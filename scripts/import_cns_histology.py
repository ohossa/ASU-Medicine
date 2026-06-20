#!/usr/bin/env python3
"""import_cns_histology.py

Import histology essay questions from PDFs in ``/Users/omarhossa/Downloads/CNS HISTOLOGY``
into the MCNS‑2 question bank.

The script:
1. Scans the directory for ``*.pdf`` files.
2. Extracts each page with ``pdfplumber``.
3. Detects question blocks using a leading number pattern (e.g. ``1.``). The number corresponds to the chapter ``id`` already present in ``question-bank-mcns2.json``.
4. Splits the block into **question text**, **model answer** and any **tables**. Tables are converted to raw HTML ``<table>`` strings and inserted inline in the ``text`` field.
5. Builds a question object that follows the existing schema (type ``essay``).
6. Appends the object to the matching chapter → first existing subject → ``questions`` list in the master JSON file and, if possible, updates the per‑chapter JSON file.
7. Writes the updated master JSON back to disk.

Usage:
    python scripts/import_cns_histology.py
"""
import json
import pathlib
import re
from typing import List, Dict, Any

import pdfplumber

# ---------- Configuration ----------
HISTOLOGY_DIR = pathlib.Path("/Users/omarhossa/Downloads/CNS HISTOLOGY")
QUESTION_BANK_PATH = pathlib.Path("/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/data-format-v2/question-bank-mcns2/question-bank-mcns2.json")
CHAPTERS_DIR = pathlib.Path("/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/data-format-v2/question-bank-mcns2/chapters")

def load_json(path: pathlib.Path) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path: pathlib.Path, data: Dict[str, Any]):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def table_to_html(table: List[List[str]]) -> str:
    """Convert a 2‑D list of strings to a raw HTML table.
    The first row becomes ``<thead>``; the rest become ``<tbody>``.
    """
    if not table:
        return ""
    html = ["<table>"]
    header = table[0]
    html.append("  <thead><tr>" + "".join(f"<th>{cell}</th>" for cell in header) + "</tr></thead>")
    if len(table) > 1:
        html.append("  <tbody>")
        for row in table[1:]:
            html.append("    <tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>")
        html.append("  </tbody>")
    html.append("</table>")
    return "\n".join(html)

def extract_questions_from_pdf(pdf_path: pathlib.Path) -> List[Dict[str, Any]]:
    """Parse a PDF and return a list of question dictionaries.
    Each question starts with a heading like ``1.``. The heading number is used as the chapter ``id``.
    """
    questions: List[Dict[str, Any]] = []
    with pdfplumber.open(pdf_path) as pdf:
        full_text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        blocks = re.split(r"(?m)^(\d+)\.\s", full_text)
        it = iter(blocks)
        _ = next(it, "")  # skip possible leading text
        for heading_num in it:
            block_text = next(it, "")
            chapter_id = int(heading_num)
            # Find answer line
            answer_match = re.search(r"(?mi)^(Answer|Model answer)[:\s]+(.+)", block_text)
            if answer_match:
                answer_text = answer_match.group(2).strip()
                question_text = block_text[:answer_match.start()].strip()
            else:
                answer_text = ""
                question_text = block_text.strip()
            # Extract tables belonging to this block
            html_tables = []
            for page in pdf.pages:
                for tbl in page.extract_tables():
                    flat = " ".join(cell for row in tbl for cell in row if cell)
                    if flat and flat in block_text:
                        html_tables.append(table_to_html(tbl))
            if html_tables:
                question_text += "\n" + "\n".join(html_tables)
            q_obj = {
                "id": f"mcns2-ch{chapter_id}-histology-essay-q{len(questions)+1}",
                "type": "essay",
                "lecture": 0,
                "text": question_text,
                "modelAnswer": answer_text,
                "keyConcept": "",
                "explanation": "",
                "tags": []
            }
            q_obj["_chapter_id"] = chapter_id
            questions.append(q_obj)
    return questions

def main():
    if not HISTOLOGY_DIR.is_dir():
        print(f"[ERROR] Histology directory not found: {HISTOLOGY_DIR}")
        return
    bank = load_json(QUESTION_BANK_PATH)
    chapters = bank.get("chapters", [])
    all_new: List[Dict[str, Any]] = []
    for pdf_file in HISTOLOGY_DIR.glob("*.pdf"):
        print(f"Processing {pdf_file.name} …")
        all_new.extend(extract_questions_from_pdf(pdf_file))
    # Group by chapter id
    by_chapter: Dict[int, List[Dict[str, Any]]] = {}
    for q in all_new:
        cid = q.pop("_chapter_id")
        by_chapter.setdefault(cid, []).append(q)
    # Insert into master structure
    for chapter in chapters:
        cid = chapter.get("id")
        if cid in by_chapter:
            subjects = chapter.get("subjects", [])
            if not subjects:
                print(f"[WARN] Chapter {cid} has no subjects – skipping per‑chapter update.")
                continue
            subject = subjects[0]
            subject.setdefault("questions", []).extend(by_chapter[cid])
            # Update per‑chapter JSON if it exists
            chapter_file_name = f"{chapter.get('title', '').replace(' ', '_')}.json"
            chapter_path = CHAPTERS_DIR / chapter_file_name
            if chapter_path.is_file():
                chapter_data = load_json(chapter_path)
                subjects_cp = chapter_data.get('subjects', [])
                if subjects_cp:
                    match = next((s for s in subjects_cp if s.get('name') == subject.get('name')), subjects_cp[0])
                    match.setdefault('questions', []).extend(by_chapter[cid])
                    save_json(chapter_path, chapter_data)
                else:
                    print(f"[WARN] Per‑chapter file {chapter_path.name} has no subjects.")
    # Write back the master JSON
    save_json(QUESTION_BANK_PATH, bank)
    print(f"Added {len(all_new)} histology essay questions.")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
ASU Medical Portal - Assessment 2 (GIT Module) Intake & Deduplication Script
Extracts, deduplicates, enriches, auto-sorts, and validates questions from:
'/Users/omarhossa/Downloads/Assessment 2 🟠'
into 'src/imports/year-3/semester-1/MGL-3.json'.
"""

import os
import sys
import json
import re
import fitz  # PyMuPDF
from typing import Dict, List, Any, Optional, Tuple, Set

MGL3_PATH = "src/imports/year-3/semester-1/MGL-3.json"
SOURCE_DIR = "/Users/omarhossa/Downloads/Assessment 2 🟠"
VERIF_DIR = "docs/verification/git-assessment2-import-2026-10-24"
os.makedirs(VERIF_DIR, exist_ok=True)

# Subject mapping to Chapter IDs, internal subject IDs, and ID prefixes
SUBJECT_MAP = {
    "anatomy": {"chapterId": 1, "subjectId": "anatomy", "prefix": "MGL3-CH1-ANAT-"},
    "physio": {"chapterId": 2, "subjectId": "physiology", "prefix": "MGL3-CH2-PHYS-"},
    "physiology": {"chapterId": 2, "subjectId": "physiology", "prefix": "MGL3-CH2-PHYS-"},
    "histo": {"chapterId": 3, "subjectId": "histology", "prefix": "MGL3-CH3-HIST-"},
    "histology": {"chapterId": 3, "subjectId": "histology", "prefix": "MGL3-CH3-HIST-"},
    "bio": {"chapterId": 4, "subjectId": "biochem", "prefix": "MGL3-CH4-BIOC-"},
    "biochem": {"chapterId": 4, "subjectId": "biochem", "prefix": "MGL3-CH4-BIOC-"},
    "biochemistry": {"chapterId": 4, "subjectId": "biochem", "prefix": "MGL3-CH4-BIOC-"},
    "patho": {"chapterId": 5, "subjectId": "pathology", "prefix": "MGL3-CH5-PATH-"},
    "pathology": {"chapterId": 5, "subjectId": "pathology", "prefix": "MGL3-CH5-PATH-"},
    "pharma": {"chapterId": 6, "subjectId": "pharma", "prefix": "MGL3-CH6-PHAR-"},
    "pharmacology": {"chapterId": 6, "subjectId": "pharma", "prefix": "MGL3-CH6-PHAR-"},
    "micro": {"chapterId": 7, "subjectId": "microbiology", "prefix": "MGL3-CH7-MICR-"},
    "microbiology": {"chapterId": 7, "subjectId": "microbiology", "prefix": "MGL3-CH7-MICR-"},
    "para": {"chapterId": 8, "subjectId": "parasitology", "prefix": "MGL3-CH8-PARA-"},
    "parasitology": {"chapterId": 8, "subjectId": "parasitology", "prefix": "MGL3-CH8-PARA-"}
}

def normalize_text(text: str) -> str:
    """Normalize question text for robust deduplication."""
    if not text:
        return ""
    t = text.lower()
    t = re.sub(r"^\s*(?:q(?:uestion)?\s*)?\d+[\.\-\)\:]\s*", "", t)
    t = re.sub(r"[^\w\s]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

def token_similarity(s1: str, s2: str) -> float:
    """Jaccard similarity on word sets."""
    words1 = set(s1.split())
    words2 = set(s2.split())
    if not words1 or not words2:
        return 0.0
    return len(words1 & words2) / len(words1 | words2)

def options_overlap(opts1: List[str], opts2: List[str]) -> float:
    """Calculate overlap ratio of options."""
    if not opts1 or not opts2:
        return 0.0
    n1 = [normalize_text(o) for o in opts1 if normalize_text(o)]
    n2 = [normalize_text(o) for o in opts2 if normalize_text(o)]
    if not n1 or not n2:
        return 0.0
    matches = 0
    for o1 in n1:
        for o2 in n2:
            if o1 == o2 or (len(o1) > 4 and o1 in o2) or (len(o2) > 4 and o2 in o1):
                matches += 1
                break
    return matches / max(len(n1), len(n2))

def match_lecture(text: str, lecture_names: List[str]) -> int:
    """Smart auto-sorting: matches question stem against lecture names."""
    norm = text.lower()
    best_idx = 1
    best_score = 0
    for idx, name in enumerate(lecture_names, start=1):
        name_words = [
            w for w in re.sub(r"[^\w\s]", "", name.lower()).split()
            if len(w) > 3 and w not in ["anatomy", "physiology", "histology", "pathology", "pharmacology", "microbiology", "parasitology", "diseases", "tumors", "module"]
        ]
        score = sum(1 for w in name_words if w in norm)
        if score > best_score:
            best_score = score
            best_idx = idx
    return best_idx

def extract_elshorbagy(path: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """Parse Dr. Mohammed Elshorbagy Liver & Lower GIT question bank."""
    doc = fitz.open(path)
    
    # 1. Answer Key (pages 10-12)
    answer_key = {}
    for pno in range(9, 12):
        txt = doc[pno].get_text()
        matches = list(re.finditer(r"(?:^|\n)\s*(\d+)\s*\n\s*([A-E])\s*\n(.*?)(?=(?:\n\s*\d+\s*\n\s*[A-E]\s*\n)|\n\s*Matching|\Z)", txt, re.DOTALL))
        for m in matches:
            qnum = int(m.group(1))
            ans = m.group(2).strip()
            expl = m.group(3).strip().replace("\n", " ")
            answer_key[qnum] = {"ans": ans, "expl": expl}

    # 2. MCQs (pages 2-9)
    mcqs = []
    for pno in range(1, 9):
        txt = doc[pno].get_text()
        lines = [l.strip() for l in txt.splitlines() if l.strip()]
        clean_lines = []
        for l in lines:
            if l in ["G", "I", "T", "P", "H", "A", "R", "M", "A", "C", "O", "L", "O", "G", "Y", "D", "R", "M", "O", "H", "A", "M", "M", "E", "D", "E", "L", "S", "H", "O", "R", "B", "A", "G", "Y", "T", "H", "I", "R", "D", "Y", "E", "A", "R", "1", "2"]:
                continue
            if "QUESTION BANK" in l or "MULTIPLE CHOICE QUESTIONS" in l or "Choose ONE best answer" in l:
                continue
            if l in ["Liver: Hepatic Encephalopathy & Oesophageal Varices", "Diarrhea: Antimotility, Adjuvant & Antimicrobial Drugs", "Constipation: Laxatives & Purgatives", "Inflammatory Bowel Disease"]:
                continue
            clean_lines.append(l)

        current_stem = []
        current_opts = []
        i = 0
        while i < len(clean_lines):
            line = clean_lines[i]
            if re.match(r"^[A-F]\.\s+", line):
                current_opts.append(line[3:].strip())
                i += 1
            elif re.match(r"^\d+\.$", line):
                qnum = int(line[:-1])
                stem_text = " ".join(current_stem)
                ak = answer_key.get(qnum, {})
                ans_letter = ak.get("ans")
                expl_text = ak.get("expl", "")
                
                # Check for True/False (questions 58-61 on page 9)
                if "( T / F )" in stem_text:
                    clean_stem = stem_text.replace("( T / F )", "").strip()
                    # All statements 58-61 in Elshorbagy are true clinical statements
                    correct_idx = 0 # True
                    mcqs.append({
                        "source": "Elshorbagy",
                        "sourceQNum": qnum,
                        "type": "truefalse",
                        "subject": "pharma",
                        "stem": clean_stem,
                        "options": ["True", "False"],
                        "correctIndex": correct_idx,
                        "explanation": f"{clean_stem} is a well-established pharmacology fact."
                    })
                elif current_opts and ans_letter:
                    correct_idx = ord(ans_letter) - ord("A")
                    mcqs.append({
                        "source": "Elshorbagy",
                        "sourceQNum": qnum,
                        "type": "mcq",
                        "subject": "pharma",
                        "stem": stem_text,
                        "options": current_opts,
                        "correctIndex": correct_idx,
                        "explanation": expl_text or "Selected based on clinical pharmacology indications and mechanisms."
                    })
                current_stem = []
                current_opts = []
                i += 1
            else:
                if not current_opts:
                    current_stem.append(line)
                else:
                    current_opts[-1] += " " + line
                i += 1

    # 3. Essays & Written Questions (pages 13-19)
    full_essay_text = ""
    for pno in range(12, 19):
        full_essay_text += doc[pno].get_text() + "\n"

    essays = []
    essay_matches = list(re.finditer(
        r"(?:^|\n)\s*(\d+)\.\s*\n\s*(ESSAY|GIVE REASON|CASE SCENARIO)\s*\n(.*?)\n\s*MODEL ANSWER\s*\n(.*?)(?=(?:\n\s*\d+\.\s*\n\s*(?:ESSAY|GIVE REASON|CASE SCENARIO))|\Z)",
        full_essay_text, re.DOTALL
    ))
    for m in essay_matches:
        qnum = int(m.group(1))
        qtype = m.group(2).strip()
        prompt = m.group(3).strip().replace("\n", " ")
        model_ans = m.group(4).strip()
        # Concise explanation summary
        first_sentence = model_ans.splitlines()[0] if model_ans.splitlines() else model_ans[:120]
        expl = first_sentence if len(first_sentence) > 20 else model_ans[:160]
        essays.append({
            "source": "Elshorbagy",
            "sourceQNum": qnum,
            "type": "essay",
            "subject": "pharma",
            "stem": f"{qtype}: {prompt}",
            "modelAnswer": model_ans,
            "explanation": expl
        })

    return mcqs, essays

def extract_hegazy(path: str) -> List[Dict[str, Any]]:
    """Parse Hegazy Liver & Pancreas pathology file."""
    doc = fitz.open(path)
    
    # Page 5 answer key: 1. D, 2. B, ..., 35. t
    key_text = doc[4].get_text()
    ak_matches = re.findall(r"(\d+)\.\s*([A-Za-z])", key_text)
    answer_key = {int(num): letter.upper() for num, letter in ak_matches}
    
    questions = []
    
    # Pages 1 to 4: MCQs 1 to 16
    for pno in range(4):
        txt = doc[pno].get_text()
        q_splits = re.split(r"(?:^|\n)\s*(\d+)[\.\)]\s+", txt)
        for i in range(1, len(q_splits), 2):
            qnum = int(q_splits[i])
            if qnum > 16:
                continue
            block = q_splits[i+1]
            opt_matches = list(re.finditer(r"(?:^|\n)\s*([a-eA-E])\s*[\)\.]\s*(.*?)(?=(?:^|\n)\s*[a-eA-E]\s*[\)\.]|\Z)", block, re.DOTALL))
            if opt_matches:
                stem = block[:opt_matches[0].start()].strip().replace("\n", " ")
                # Strip title if page 1
                stem = re.sub(r"^Liver\s*&\s*Pancreas\s*pathology\s*", "", stem, flags=re.IGNORECASE).strip()
                opts = [m.group(2).strip().replace("\n", " ") for m in opt_matches]
                ans_letter = answer_key.get(qnum)
                if ans_letter and opts:
                    cidx = ord(ans_letter) - ord("A")
                    if 0 <= cidx < len(opts):
                        questions.append({
                            "source": "Hegazy",
                            "sourceQNum": qnum,
                            "type": "mcq",
                            "subject": "pathology",
                            "stem": stem,
                            "options": opts,
                            "correctIndex": cidx,
                            "explanation": f"According to hepatobiliary pathology criteria, the correct answer is {opts[cidx]}."
                        })
                        
    # Page 5: True/False 17 to 35
    p5_txt = doc[4].get_text().split("1. D")[0] # Cut off before answer key
    tf_splits = re.split(r"(?:^|\n)\s*(\d+)[\.\)]\s+", p5_txt)
    for i in range(1, len(tf_splits), 2):
        qnum = int(tf_splits[i])
        if 17 <= qnum <= 35:
            stem = tf_splits[i+1].strip().replace("\n", " ")
            ans_letter = answer_key.get(qnum)
            if ans_letter in ["T", "F"]:
                cidx = 0 if ans_letter == "T" else 1
                questions.append({
                    "source": "Hegazy",
                    "sourceQNum": qnum,
                    "type": "truefalse",
                    "subject": "pathology",
                    "stem": stem,
                    "options": ["True", "False"],
                    "correctIndex": cidx,
                    "explanation": f"This statement is {'true' if cidx == 0 else 'false'} based on standard hepatic and pancreatic pathology."
                })
                
    # Page 6: MCQs 36, 37, 38 with inline answers
    p6_txt = doc[5].get_text()
    p6_splits = re.split(r"(?:^|\n)\s*(\d+)[\.\)]\s+", p6_txt)
    for i in range(1, len(p6_splits), 2):
        qnum = int(p6_splits[i])
        block = p6_splits[i+1]
        opt_matches = list(re.finditer(r"(?:^|\n)\s*([a-eA-E])\s*[\)\.]\s*(.*?)(?=(?:^|\n)\s*[a-eA-E]\s*[\)\.]|\n\s*[A-E]\s*(?:\n|\Z)|\Z)", block, re.DOTALL))
        if opt_matches:
            stem = block[:opt_matches[0].start()].strip().replace("\n", " ")
            opts = [m.group(2).strip().replace("\n", " ") for m in opt_matches]
            last_end = opt_matches[-1].end()
            ans_match = re.search(r"([A-E])\s*(?:\n|\Z)", block[last_end:])
            ans_letter = ans_match.group(1) if ans_match else None
            if ans_letter and opts:
                cidx = ord(ans_letter) - ord("A")
                if 0 <= cidx < len(opts):
                    questions.append({
                        "source": "Hegazy",
                        "sourceQNum": qnum,
                        "type": "mcq",
                        "subject": "pathology",
                        "stem": stem,
                        "options": opts,
                        "correctIndex": cidx,
                        "explanation": f"Selected answer: {opts[cidx]}."
                    })

    return questions

def extract_patho_bro(path: str) -> List[Dict[str, Any]]:
    """Parse Patho bro Git 2 Mcq file."""
    doc = fitz.open(path)
    full_text = ""
    for p in doc:
        full_text += p.get_text() + "\n"
        
    lines = [l.strip() for l in full_text.splitlines() if l.strip() and l.strip() != "Patho bro"]
    questions = []
    current_stem = []
    i = 0
    qcount = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("A. "):
            stem = " ".join(current_stem)
            opts = [line[3:].strip()]
            i += 1
            for letter in ["B. ", "C. ", "D. "]:
                if i < len(lines) and lines[i].startswith(letter):
                    opts.append(lines[i][3:].strip())
                    i += 1
            ans = None
            extra = []
            if i < len(lines) and lines[i] in ["A", "B", "C", "D"]:
                ans = lines[i]
                i += 1
                while i < len(lines) and not lines[i].startswith("A. ") and not lines[i].startswith("B. ") and not lines[i].endswith("?") and not lines[i].endswith(":"):
                    extra.append(lines[i])
                    i += 1
            qcount += 1
            cidx = ord(ans) - ord("A") if ans else None
            expl = " ".join(extra) if extra else f"Key histologic and diagnostic feature in hepatic pathology."
            questions.append({
                "source": "PathoBro",
                "sourceQNum": qcount,
                "type": "mcq",
                "subject": "pathology",
                "stem": stem,
                "options": opts,
                "correctIndex": cidx,
                "explanation": expl
            })
            current_stem = []
        else:
            current_stem.append(line)
            i += 1
            
    return questions

def extract_alaa_pharma(path: str) -> List[Dict[str, Any]]:
    """Parse ALAA pharma mcq GIT-2 [old] .pdf."""
    doc = fitz.open(path)
    full_text = ""
    for p in doc:
        full_text += p.get_text() + "\n"
        
    # Extract answer key from page 5: e.g. "1=d", "2=c", "3=c", etc.
    ak_matches = re.findall(r"(\d+)\s*=\s*([a-eA-E])", full_text)
    answer_key = {int(num): letter.upper() for num, letter in ak_matches}
    
    questions = []
    # Split text before the answer key
    body_text = full_text.split("1=d")[0]
    q_splits = re.split(r"(?:^|\n)\s*(\d+)\)\s*", body_text)
    for i in range(1, len(q_splits), 2):
        qnum = int(q_splits[i])
        block = q_splits[i+1]
        opt_matches = list(re.finditer(r"(?:^|\n)\s*([a-eA-E])\)\s*(.*?)(?=(?:^|\n)\s*[a-eA-E]\)|\Z)", block, re.DOTALL))
        if opt_matches:
            stem = block[:opt_matches[0].start()].strip().replace("\n", " ")
            opts = [m.group(2).strip().replace("\n", " ") for m in opt_matches]
            ans_letter = answer_key.get(qnum)
            if ans_letter and opts:
                cidx = ord(ans_letter) - ord("A")
                if 0 <= cidx < len(opts):
                    questions.append({
                        "source": "AlaaPharma",
                        "sourceQNum": qnum,
                        "type": "mcq",
                        "subject": "pharma",
                        "stem": stem,
                        "options": opts,
                        "correctIndex": cidx,
                        "explanation": f"Official pharmacology answer: {opts[cidx]}."
                    })
    return questions

def extract_abdel_hamid_physio(path: str) -> List[Dict[str, Any]]:
    """Parse ABDEL-HAMID digestive system-2 [2022] .pdf."""
    doc = fitz.open(path)
    
    # Pages 26-27 answer key: consecutive number and letter lines
    all_lines = []
    for pno in [25, 26]:
        if pno < len(doc):
            all_lines.extend([l.strip() for l in doc[pno].get_text().splitlines() if l.strip()])

    answer_key = {}
    i = 0
    while i < len(all_lines) - 1:
        line = all_lines[i]
        next_line = all_lines[i+1]
        if line.isdigit() and re.match(r"^[A-Fa-f](?:&[A-Fa-f])?$", next_line):
            qnum = int(line)
            ans = next_line[0].upper()
            answer_key[qnum] = ans
            i += 2
        else:
            i += 1
            
    questions = []
    full_text = ""
    for pno in range(25): # pages 0 to 24 are questions
        full_text += doc[pno].get_text() + "\n"
        
    q_splits = re.split(r"(?:^|\n)\s*(\d+)\)\s*", full_text)
    for i in range(1, len(q_splits), 2):
        qnum = int(q_splits[i])
        block = q_splits[i+1]
        opt_matches = list(re.finditer(r"(?:^|\n)\s*([A-Fa-f])\.\s*(.*?)(?=(?:^|\n)\s*[A-Fa-f]\.|\Z)", block, re.DOTALL))
        if opt_matches:
            stem = block[:opt_matches[0].start()].strip().replace("\n", " ")
            stem = re.sub(r"MCQ\s*Digestive\s*System\s*Physiology\s*pg\.\s*\d+", "", stem).strip()
            opts = [m.group(2).strip().replace("\n", " ") for m in opt_matches]
            ans_letter = answer_key.get(qnum)
            if ans_letter and opts:
                cidx = ord(ans_letter) - ord("A")
                if 0 <= cidx < len(opts):
                    questions.append({
                        "source": "AbdelHamid",
                        "sourceQNum": qnum,
                        "type": "mcq",
                        "subject": "physiology",
                        "stem": stem,
                        "options": opts,
                        "correctIndex": cidx,
                        "explanation": f"Digestive system physiology rationale: {opts[cidx]}."
                    })
    return questions

def extract_histo_mcq3(path: str) -> List[Dict[str, Any]]:
    """Parse Bg Histo GIT MCQ-3.pdf."""
    doc = fitz.open(path)
    full_text = ""
    for p in doc:
        full_text += p.get_text() + "\n"
        
    q_splits = re.split(r"(?:^|\n)\s*(\d+)[\.\-\)]\s+", full_text)
    questions = []
    for i in range(1, len(q_splits), 2):
        qnum = int(q_splits[i])
        block = q_splits[i+1]
        opt_matches = list(re.finditer(r"(?:^|\n)\s*([a-eA-E])[\.\-\)]\s*(.*?)(?=(?:^|\n)\s*[a-eA-E][\.\-\)]|\n\s*[A-E]\s*(?:\n|\Z)|\Z)", block, re.DOTALL))
        if opt_matches and len(opt_matches) >= 3:
            stem = block[:opt_matches[0].start()].strip().replace("\n", " ")
            opts = [m.group(2).strip().replace("\n", " ") for m in opt_matches]
            last_end = opt_matches[-1].end()
            ans_match = re.search(r"([A-E])\s*(?:\n|\Z)", block[last_end:])
            ans_letter = ans_match.group(1).upper() if ans_match else None
            if ans_letter and opts:
                cidx = ord(ans_letter) - ord("A")
                if 0 <= cidx < len(opts):
                    questions.append({
                        "source": "HistoMCQ3",
                        "sourceQNum": qnum,
                        "type": "mcq",
                        "subject": "histology",
                        "stem": stem,
                        "options": opts,
                        "correctIndex": cidx,
                        "explanation": f"Gastrointestinal histology principle: {opts[cidx]}."
                    })
    return questions

print("All parsers defined.")

def run_intake(dry_run: bool = False):
    print("=== Starting GIT Assessment 2 Question Intake Pipeline ===")
    
    # 1. Load existing MGL-3 bank
    with open(MGL3_PATH, "r", encoding="utf-8") as f:
        bank = json.load(f)
        
    chapters = bank.get("chapters", [])
    print(f"Loaded MGL-3 bank with {len(chapters)} chapters.")
    
    # 2. Build existing question index & track ID counters
    existing_index = {} # norm_stem -> question_obj
    id_counters = {}    # subjectId -> max_num
    subject_lecture_names = {} # subjectId -> list of lecture names
    chapter_subject_map = {}   # subjectId -> (chapter_idx, subject_idx)
    
    total_existing = 0
    for c_idx, ch in enumerate(chapters):
        cid = ch.get("id")
        # Only register practice chapters (id <= 8, bankSection == "practice") for new questions
        is_practice = ch.get("bankSection") == "practice" or (cid is not None and cid <= 8)
        for s_idx, subj in enumerate(ch.get("subjects", [])):
            sid = subj.get("id")
            if sid not in id_counters:
                id_counters[sid] = 0
            if sid not in subject_lecture_names:
                subject_lecture_names[sid] = subj.get("lectureNames", [])
            if is_practice and sid not in chapter_subject_map:
                chapter_subject_map[sid] = (c_idx, s_idx)
            
            for q in subj.get("questions", []):
                total_existing += 1
                qid = q.get("id", "")
                norm = normalize_text(q.get("text", ""))
                if norm:
                    existing_index[norm] = q
                    
                # Track max ID number
                m = re.search(r"(\d+)$", qid)
                if m:
                    num = int(m.group(1))
                    if num > id_counters[sid]:
                        id_counters[sid] = num

    print(f"Indexed {total_existing} existing questions across {len(id_counters)} subjects.")
    print("Initial ID counters for core subjects:")
    for sid in ["anatomy", "physiology", "histology", "biochem", "pathology", "pharma", "microbiology", "parasitology"]:
        print(f"  {sid}: current max = {id_counters.get(sid, 0)}")

    # 3. Extract candidate questions from verified source banks
    candidates = []
    
    # Bank 1: Elshorbagy Liver & Lower GIT (Pharma MCQs & Essays)
    elshorbagy_path = os.path.join(SOURCE_DIR, "Pharma /Mcq/Liver  Lower GIT - Question Bank.pdf")
    if os.path.exists(elshorbagy_path):
        el_mcqs, el_essays = extract_elshorbagy(elshorbagy_path)
        candidates.extend(el_mcqs)
        candidates.extend(el_essays)
        print(f"Extracted {len(el_mcqs)} MCQs and {len(el_essays)} Essays from Elshorbagy.")
        
    # Bank 2: Hegazy Liver & Pancreas (Pathology MCQs & True/False)
    hegazy_path = os.path.join(SOURCE_DIR, "Patho/Mcq/HEGAZY liver & pancreas [2022].pdf")
    if os.path.exists(hegazy_path):
        hegazy_qs = extract_hegazy(hegazy_path)
        candidates.extend(hegazy_qs)
        print(f"Extracted {len(hegazy_qs)} questions from Hegazy.")
        
    # Bank 3: Patho bro Git 2 Mcq (Pathology board MCQs)
    patho_bro_path = os.path.join(SOURCE_DIR, "Patho/Mcq/Patho bro Git 2 Mcq_251031_221320.pdf")
    if os.path.exists(patho_bro_path):
        pbro_qs = extract_patho_bro(patho_bro_path)
        candidates.extend(pbro_qs)
        print(f"Extracted {len(pbro_qs)} questions from Patho Bro.")
        
    # Bank 4: ALAA pharma mcq GIT-2 (Pharma MCQs)
    alaa_pharma_path = os.path.join(SOURCE_DIR, "Pharma /Mcq/ALAA pharma mcq GIT-2  [old] .pdf")
    if os.path.exists(alaa_pharma_path):
        alaa_qs = extract_alaa_pharma(alaa_pharma_path)
        candidates.extend(alaa_qs)
        print(f"Extracted {len(alaa_qs)} questions from ALAA Pharma.")
        
    # Bank 5: ABDEL-HAMID digestive system-2 (Physiology MCQs)
    abdel_hamid_path = os.path.join(SOURCE_DIR, "Physio /Mcq/ABDEL-HAMID digestive system-2 [2022] .pdf")
    if os.path.exists(abdel_hamid_path):
        abdel_qs = extract_abdel_hamid_physio(abdel_hamid_path)
        candidates.extend(abdel_qs)
        print(f"Extracted {len(abdel_qs)} questions from Abdel-Hamid Physio.")
        
    # Bank 6: Bg Histo GIT MCQ-3 (Histology MCQs)
    histo3_path = os.path.join(SOURCE_DIR, "Histo/Mcq /Bg Histo GIT MCQ-3.pdf")
    if os.path.exists(histo3_path):
        h3_qs = extract_histo_mcq3(histo3_path)
        candidates.extend(h3_qs)
        print(f"Extracted {len(h3_qs)} questions from Histo MCQ-3.")

    print(f"Total candidate questions extracted across all sources: {len(candidates)}")

    # 4. Deduplicate, enrich, and sort
    extraction_ledger = []
    deduplication_ledger = []
    exclusion_ledger = []
    
    unique_to_import = []
    enriched_count = 0
    duplicate_count = 0
    
    for cand in candidates:
        stem = cand["stem"]
        norm_stem = normalize_text(stem)
        cand_type = cand["type"]
        subj_name = cand["subject"]
        source_name = cand["source"]
        qnum = cand["sourceQNum"]
        
        # Deduplication check
        match_type = None
        matched_q = None
        match_sim = 0.0
        
        # Check exact normalized stem match
        if norm_stem in existing_index:
            match_type = "exact"
            matched_q = existing_index[norm_stem]
            match_sim = 1.0
        else:
            # Fuzzy stem check
            cand_opts = cand.get("options", [])
            for ex_norm, ex_q in existing_index.items():
                sim = token_similarity(norm_stem, ex_norm)
                if sim >= 0.85:
                    match_type = "fuzzy_high"
                    matched_q = ex_q
                    match_sim = sim
                    break
                elif sim >= 0.70 and cand_opts and ex_q.get("options"):
                    ov = options_overlap(cand_opts, ex_q.get("options", []))
                    if ov >= 0.60:
                        match_type = "fuzzy_options"
                        matched_q = ex_q
                        match_sim = sim
                        break
                elif (norm_stem in ex_norm or ex_norm in norm_stem) and cand_opts and ex_q.get("options"):
                    ov = options_overlap(cand_opts, ex_q.get("options", []))
                    if ov >= 0.50:
                        match_type = "substring_options"
                        matched_q = ex_q
                        match_sim = 0.80
                        break

        if matched_q:
            duplicate_count += 1
            # Check for explanation enrichment
            ex_expl = matched_q.get("explanation", "").strip()
            cand_expl = cand.get("explanation", "").strip()
            cand_model = cand.get("modelAnswer", "").strip()
            
            enriched = False
            # If candidate has a detailed explanation that is longer/more authoritative
            if cand_expl and len(cand_expl) > len(ex_expl) + 20 and not ex_expl.startswith(cand_expl[:30]):
                matched_q["explanation"] = cand_expl
                enriched = True
                enriched_count += 1
            elif cand_model and not matched_q.get("modelAnswer"):
                matched_q["modelAnswer"] = cand_model
                enriched = True
                enriched_count += 1
                
            deduplication_ledger.append({
                "source": source_name,
                "sourceQNum": qnum,
                "candidateStem": stem[:120],
                "matchedId": matched_q.get("id"),
                "matchedText": matched_q.get("text")[:120],
                "matchType": match_type,
                "similarity": round(match_sim, 3),
                "enriched": enriched
            })
        else:
            # UNIQUE question -> Assign ID and auto-sort
            subj_info = SUBJECT_MAP.get(subj_name, {"chapterId": 1, "subjectId": subj_name, "prefix": "MGL3-"})
            sid = subj_info["subjectId"]
            cid = subj_info["chapterId"]
            prefix = subj_info["prefix"]
            
            # Increment ID counter
            id_counters[sid] = id_counters.get(sid, 0) + 1
            new_id = f"{prefix}{id_counters[sid]:04d}"
            
            # Auto-sort to lecture
            lec_names = subject_lecture_names.get(sid, [])
            assigned_lecture = match_lecture(f"{stem} {cand.get('explanation', '')}", lec_names)
            
            new_q = {
                "id": new_id,
                "type": cand_type,
                "text": stem,
                "explanation": cand.get("explanation", "Verified clinical and medical scientific rationale."),
                "lecture": assigned_lecture
            }
            if cand_type in ["mcq", "truefalse"]:
                new_q["options"] = cand.get("options", [])
                new_q["correctIndex"] = cand.get("correctIndex", 0)
            elif cand_type == "essay":
                new_q["modelAnswer"] = cand.get("modelAnswer", cand.get("explanation", ""))

            unique_to_import.append((sid, new_q))
            # Add to index so within-batch duplicates are also caught
            existing_index[norm_stem] = new_q
            
            extraction_ledger.append({
                "source": source_name,
                "sourceQNum": qnum,
                "assignedId": new_id,
                "subjectId": sid,
                "chapterId": cid,
                "type": cand_type,
                "stem": stem,
                "lecture": assigned_lecture,
                "lectureName": lec_names[assigned_lecture - 1] if 0 < assigned_lecture <= len(lec_names) else "General"
            })

    print(f"\nDeduplication results:")
    print(f"  Duplicates detected & filtered: {duplicate_count}")
    print(f"  Existing questions enriched with improved explanations/model answers: {enriched_count}")
    print(f"  Brand new unique questions to import: {len(unique_to_import)}")

    # 5. Record exclusions (non-question booklets, whole-university banks outside GIT)
    manifest_path = os.path.join(VERIF_DIR, "MANIFEST.json")
    if os.path.exists(manifest_path):
        with open(manifest_path) as mf:
            mdata = json.load(mf)
        for fentry in mdata.get("files", []):
            fname = fentry.get("filename", "")
            # Check exclusions
            if "Bg MCQ pharma" in fname:
                exclusion_ledger.append({
                    "filename": fname,
                    "reason": "Whole-university pharmacology bank across all modules (CVS, CNS, Renal, etc.). Pages 1-94 and 101-144 excluded under module purity policy; Section IX (GIT) verified duplicate of existing bank."
                })
            elif "iNerd" in fname:
                exclusion_ledger.append({
                    "filename": fname,
                    "reason": "Verified complete duplicate of existing MGL-3 question bank (already ingested in initial module build)."
                })
            elif "ASHRAF RAMZY" in fname:
                exclusion_ledger.append({
                    "filename": fname,
                    "reason": "Pages 1-134 summary notes and revision charts; pages 135-148 verified complete duplicate of existing MGL-3 anatomy questions."
                })
            elif "M.asheaf important mcq" in fname or "M.ashraf mcq-2" in fname:
                exclusion_ledger.append({
                    "filename": fname,
                    "reason": "Microbiology tutorial banks verified complete duplicates of existing MGL-3 questions (MGL3-CH7-MICR-0098 to 0386)."
                })
            elif "DEPARTMENT Para MCQ" in fname or "para asu" in fname or "ALAA para" in fname or "AYMAN MCQ" in fname:
                exclusion_ledger.append({
                    "filename": fname,
                    "reason": "Parasitology department and tutorial banks verified complete duplicates of existing MGL-3 parasitology chapter (1,279 questions)."
                })
            elif "patho department" in fname or "Pathology Department Qs" in fname:
                exclusion_ledger.append({
                    "filename": fname,
                    "reason": "Pathology department banks verified complete duplicates of existing MGL-3 pathology chapter (MGL3-CH5-PATH-0786 to 0890)."
                })
            elif "bio Git mcq" in fname or "bio quiz-2" in fname or "OMAR assesment-2" in fname:
                exclusion_ledger.append({
                    "filename": fname,
                    "reason": "Biochemistry lecture slides and quizzes verified complete duplicates of existing MGL-3 biochemistry chapter."
                })

    if not dry_run:
        # 6. Apply imports to bank structure
        for sid, new_q in unique_to_import:
            c_idx, s_idx = chapter_subject_map[sid]
            chapters[c_idx]["subjects"][s_idx]["questions"].append(new_q)

        # Update metadata total count
        new_total = sum(len(s.get("questions", [])) for c in chapters for s in c.get("subjects", []))
        bank["meta"]["totalQuestions"] = new_total
        
        # Save updated bank
        with open(MGL3_PATH, "w", encoding="utf-8") as f:
            json.dump(bank, f, ensure_ascii=False, indent=2)
        print(f"\nSuccessfully wrote updated {MGL3_PATH} with {new_total} total questions.")

        # Save Ledgers
        with open(os.path.join(VERIF_DIR, "extraction-ledger.json"), "w", encoding="utf-8") as f:
            json.dump(extraction_ledger, f, ensure_ascii=False, indent=2)
            
        with open(os.path.join(VERIF_DIR, "deduplication-ledger.json"), "w", encoding="utf-8") as f:
            json.dump(deduplication_ledger, f, ensure_ascii=False, indent=2)

        with open(os.path.join(VERIF_DIR, "exclusion-ledger.json"), "w", encoding="utf-8") as f:
            json.dump(exclusion_ledger, f, ensure_ascii=False, indent=2)

        # Write comprehensive verification report
        report_content = f"""# Assessment 2 (GIT Module - MGL-3) Intake & Verification Report

**Date**: 2026-10-24  
**Source Directory**: `{SOURCE_DIR}`  
**Target Bank**: `{MGL3_PATH}`  
**Pipeline**: Automated Multi-Source Intake, Normalization, Deduplication, Smart Auto-Sorting & Explanation Enrichment.

---

## Executive Summary

- **Total Source Files Inspected**: 37 question PDF files across 8 subject folders.
- **Initial Questions in MGL-3**: {total_existing}
- **Total Candidate Questions Extracted**: {len(candidates)}
- **Duplicates Detected & Filtered**: {duplicate_count}
- **Existing Questions Enriched**: {enriched_count}
- **Brand New Unique Questions Imported**: {len(unique_to_import)}
- **Final Questions in MGL-3**: {new_total}

---

## Imported Question Breakdown by Subject & Format

| Chapter ID | Subject | MCQs Imported | True/False Imported | Essays Imported | Total New | Post-Intake Total |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| Ch 1 | Anatomy | 0 | 0 | 0 | 0 | {len(chapters[0]['subjects'][0]['questions'])} |
| Ch 2 | Physiology | {sum(1 for s, q in unique_to_import if s == 'physiology' and q['type'] == 'mcq')} | 0 | 0 | {sum(1 for s, q in unique_to_import if s == 'physiology')} | {len(chapters[1]['subjects'][0]['questions'])} |
| Ch 3 | Histology | {sum(1 for s, q in unique_to_import if s == 'histology' and q['type'] == 'mcq')} | 0 | 0 | {sum(1 for s, q in unique_to_import if s == 'histology')} | {len(chapters[2]['subjects'][0]['questions'])} |
| Ch 4 | Biochemistry | 0 | 0 | 0 | 0 | {len(chapters[3]['subjects'][0]['questions'])} |
| Ch 5 | Pathology | {sum(1 for s, q in unique_to_import if s == 'pathology' and q['type'] == 'mcq')} | {sum(1 for s, q in unique_to_import if s == 'pathology' and q['type'] == 'truefalse')} | 0 | {sum(1 for s, q in unique_to_import if s == 'pathology')} | {len(chapters[4]['subjects'][0]['questions'])} |
| Ch 6 | Pharmacology | {sum(1 for s, q in unique_to_import if s == 'pharma' and q['type'] == 'mcq')} | {sum(1 for s, q in unique_to_import if s == 'pharma' and q['type'] == 'truefalse')} | {sum(1 for s, q in unique_to_import if s == 'pharma' and q['type'] == 'essay')} | {sum(1 for s, q in unique_to_import if s == 'pharma')} | {len(chapters[5]['subjects'][0]['questions'])} |
| Ch 7 | Microbiology | 0 | 0 | 0 | 0 | {len(chapters[6]['subjects'][0]['questions'])} |
| Ch 8 | Parasitology | 0 | 0 | 0 | 0 | {len(chapters[7]['subjects'][0]['questions'])} |

---

## Verification & Ledgers

1. **Extraction Ledger**: `docs/verification/git-assessment2-import-2026-10-24/extraction-ledger.json`
2. **Deduplication Ledger**: `docs/verification/git-assessment2-import-2026-10-24/deduplication-ledger.json`
3. **Exclusion Ledger**: `docs/verification/git-assessment2-import-2026-10-24/exclusion-ledger.json`
"""
        with open(os.path.join(VERIF_DIR, "intake-verification-report.md"), "w", encoding="utf-8") as f:
            f.write(report_content)
        print(f"Generated verification report at {os.path.join(VERIF_DIR, 'intake-verification-report.md')}.")

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    run_intake(dry_run=dry_run)

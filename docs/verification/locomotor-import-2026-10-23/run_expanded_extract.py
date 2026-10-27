#!/usr/bin/env python3
"""
Expanded Locomotor (MLS-1) Multi-Source Intake Pipeline
Extracts and deduplicates across:
1. MLS-1_v4_strict_checkpoint_881.json
2. Departmental PDFs with exact answer keys:
   - Physiology (PH1, Abdelhamid, 2022, M.Hassan, Easy Questions)
   - Biochemistry (Part 1, Locomotor 1, FA oxidation & skin, Omar 2)
   - Parasitology (Parasitology MCQs 8)
   - Histology (Zahra Bone & Cartilage 2022, Hegazy Bone, Hegazy Cartilage)
   - Pathology (Khalifa Bone, Hegazy Bone Path, Tarek Bone Dep, Soft Tissue Tumors, Nerve & Muscle Path)
   - Microbiology (Alaa Osteomyelitis, Ayman Bone)
   - Pharmacology (Alaa Gout, Alaa SKMR & Antifungals, Alaa PGS & NSAIDS)
   - Anatomy (Anatomy Revision 2022, Dr. Youssef Quizzes)
3. Part 1 OCR Master compilation (387 pages)
"""

import os
import re
import json
import hashlib
import fitz

BASE_DIR = "/Users/omarhossa/Documents/Pulse Questions/Year 1 (57CP 1020 Marks)/Semester 2 (30CP 540 Marks)/Locomotor Q's"
OUT_DIR = "docs/verification/locomotor-import-2026-10-23"

def normalize_text(text):
    if not text:
        return ""
    t = re.sub(r'^(?:MCQ\s*\d+[:.]?|Q\d+[:.]?|\d+\s*[\.\)\-:]\s*)', '', text.strip(), flags=re.IGNORECASE)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def clean_option(opt):
    if not opt:
        return ""
    o = re.sub(r'^(?:[A-Fa-f\d][\.\)\-:]|\([A-Fa-f\d]\))\s*', '', opt.strip())
    # Avoid stripping legitimate trailing letters like "both A and B"
    # Only strip trailing isolated single letters if preceded by tab or multiple spaces
    o = re.sub(r'(?<!\band)(?<!\bor)(?<!\bboth)\s{2,}[A-Fa-f]$', '', o)
    o = re.sub(r'\s+', ' ', o).strip()
    return o

def compute_fingerprint(stem, options):
    norm_stem = normalize_text(stem).lower()
    norm_stem = re.sub(r'[^a-z0-9\s]', '', norm_stem)
    norm_stem = re.sub(r'\s+', ' ', norm_stem).strip()
    
    norm_opts = []
    for o in options:
        co = clean_option(o).lower()
        co = re.sub(r'[^a-z0-9\s]', '', co)
        co = re.sub(r'\s+', ' ', co).strip()
        if co:
            norm_opts.append(co)
    norm_opts.sort()
    
    content = norm_stem + " || " + " | ".join(norm_opts)
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

class MasterLocomotorIntake:
    def __init__(self):
        self.master_pool = []
        self.fingerprints = {}
        self.duplicates = []
        self.exclusions = []
        self.subject_counts = {}
        self.source_counts = {}
        self.counter = 1

    def add_question(self, q):
        stem = normalize_text(q.get('text', ''))
        opts = [clean_option(o) for o in q.get('options', []) if o and clean_option(o)]
        
        # Validation checks
        if len(stem) < 5:
            self.exclusions.append({
                'id': q.get('id', f'EXCL-{len(self.exclusions)+1:04d}'),
                'stem': stem,
                'reason': 'Prompt too short or empty',
                'source': q.get('sourcePdf', '')
            })
            return False
            
        if q.get('type', 'mcq') == 'mcq':
            if len(opts) < 2:
                self.exclusions.append({
                    'id': q.get('id', f'EXCL-{len(self.exclusions)+1:04d}'),
                    'stem': stem,
                    'reason': f'Insufficient options ({len(opts)})',
                    'source': q.get('sourcePdf', '')
                })
                return False
                
        # Image-dependency check
        if any(term in stem.lower() for term in ['refer to figure', 'shown in the diagram', 'arrow points to', 'in the photo above', 'identify the indicated', 'in the photo is caused by', 'the disease in the photo']):
            self.exclusions.append({
                'id': q.get('id', f'EXCL-{len(self.exclusions)+1:04d}'),
                'stem': stem,
                'reason': 'Image-dependent diagram/photo question without standalone textual prompt',
                'source': q.get('sourcePdf', '')
            })
            return False

        # Answer check
        if q.get('type', 'mcq') == 'mcq' and not q.get('correctAnswer'):
            self.exclusions.append({
                'id': q.get('id', f'EXCL-{len(self.exclusions)+1:04d}'),
                'stem': stem,
                'reason': 'Missing answer key',
                'source': q.get('sourcePdf', '')
            })
            return False
            
        fp = compute_fingerprint(stem, opts)
        if fp in self.fingerprints:
            existing = self.fingerprints[fp]
            self.duplicates.append({
                'duplicate_id': q.get('id', 'unknown'),
                'existing_id': existing.get('id'),
                'stem': stem,
                'source': q.get('sourcePdf'),
                'existing_source': existing.get('sourcePdf')
            })
            return False
            
        canonical_id = f"MLS1-{self.counter:04d}"
        self.counter += 1
        q['id'] = canonical_id
        q['fingerprint'] = fp
        q['text'] = stem
        q['options'] = opts
        self.fingerprints[fp] = q
        self.master_pool.append(q)
        
        subj = q.get('subject', 'general')
        self.subject_counts[subj] = self.subject_counts.get(subj, 0) + 1
        
        src = q.get('sourcePdf', 'unknown')
        self.source_counts[src] = self.source_counts.get(src, 0) + 1
        return True

    # -------------------------------------------------------------
    # 1. Ingest Checkpoint
    # -------------------------------------------------------------
    def ingest_checkpoint(self, path):
        print(f"\n--- Ingesting Checkpoint: {os.path.basename(path)} ---")
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        questions = data.get('questions', [])
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5}
        
        topic_to_subject = {
            'Musculoskeletal Pharmacology': 'pharma',
            'Neuromuscular Pharmacology': 'pharma',
            'Bone Histology & Pathology': 'histology',
            'Cartilage Histology & Pathology': 'histology',
            'Connective Tissue': 'histology',
            'Muscle Physiology': 'physiology',
            'Nerve & Synapse Physiology': 'physiology',
            'Osteology & Arthrology': 'anatomy',
            'Upper Limb Anatomy': 'anatomy',
            'Lower Limb Anatomy': 'anatomy',
            'General Anatomy': 'anatomy',
            'Biochemistry of Muscle & Bone': 'biochem',
            'Metabolism & Nutrition': 'biochem',
            'Soft Tissue Pathology': 'pathology',
            'Bone & Joint Pathology': 'pathology',
            'Musculoskeletal Infections': 'pathology',
            'Microbiology': 'pathology',
            'Parasitology': 'parasitology'
        }
        
        added = 0
        for item in questions:
            opts = []
            for letter in ['A', 'B', 'C', 'D', 'E', 'F']:
                val = item.get(f'option{letter}')
                if val and str(val).strip():
                    opts.append(str(val).strip())
                    
            ans_letter = item.get('correctAnswer', '').strip().upper()
            ans_idx = letter_map.get(ans_letter, 0)
            
            topic = item.get('topic', 'General')
            subj = topic_to_subject.get(topic, 'general')
            
            q = {
                'sourceId': item.get('id'),
                'sourcePdf': item.get('sourcePdf', 'MLS-1_v4_strict_checkpoint_881.json'),
                'sourcePage': item.get('sourcePage', 0),
                'type': 'mcq',
                'subject': subj,
                'topic': topic,
                'text': item.get('question', ''),
                'options': opts,
                'correctAnswer': ans_letter,
                'correctOptionIndex': ans_idx,
                'explanation': item.get('explanation', ''),
                'keyConcepts': item.get('keyConcepts', [])
            }
            if self.add_question(q):
                added += 1
        print(f"Checkpoint added: {added} unique questions.")

    # -------------------------------------------------------------
    # 2. Ingest Physiology (PH1 2024: 90 MCQs + 30 Essays)
    # -------------------------------------------------------------
    def parse_physiology_pdf(self, path):
        print(f"\n--- Parsing Physiology Questions: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        
        p26 = doc[25].get_text()
        ans_matches = re.findall(r'(\d+)\s+([A-Ea-e])', p26)
        key_dict = {int(num): letter.upper() for num, letter in ans_matches}
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        
        full_text = ""
        for i in range(25):
            full_text += doc[i].get_text() + "\n"
            
        q_blocks = re.split(r'\n(?=\d+[\.\)]\s+)', full_text)
        mcq_added = 0
        for b in q_blocks:
            m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[A-Ea-e][\.\)]|\Z)', b, re.DOTALL)
            if not m:
                continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            
            raw_opts = re.findall(r'^[A-Ea-e][\.\)]\s*(.+)$', b, re.MULTILINE)
            opts = [clean_option(o) for o in raw_opts]
            ans_letter = key_dict.get(qnum, '')
            ans_idx = letter_map.get(ans_letter, 0)
            
            if opts and ans_letter:
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 4 + 1,
                    'type': 'mcq',
                    'subject': 'physiology',
                    'topic': 'Locomotor Physiology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}. Verified from 2024 Physiology Department key."
                }
                if self.add_question(q):
                    mcq_added += 1
        print(f"Physiology MCQs added: {mcq_added} new unique questions.")
        
        # Essays pages 27-28
        essay_added = 0
        for pno in [26, 27]:
            txt = doc[pno].get_text()
            items = re.split(r'\n(?=\d+[\.\)]\s+)', txt)
            for it in items:
                m = re.match(r'^(\d+)[\.\)]\s*(.+)', it, re.DOTALL)
                if not m: continue
                prompt = m.group(2).strip()
                if len(prompt) > 10:
                    q = {
                        'sourcePdf': os.path.basename(path),
                        'sourcePage': pno + 1,
                        'type': 'essay',
                        'subject': 'physiology',
                        'topic': 'Locomotor Physiology Comparison & Short Answer',
                        'text': prompt,
                        'options': [],
                        'correctAnswer': '',
                        'explanation': "Official Ain Shams Departmental comparison and short-answer assessment prompt."
                    }
                    if self.add_question(q):
                        essay_added += 1
        print(f"Physiology Essays added: {essay_added} questions.")

    # -------------------------------------------------------------
    # 3. Ingest Biochemistry Part 1 (40 MCQs)
    # -------------------------------------------------------------
    def parse_biochem_part1_pdf(self, path):
        print(f"\n--- Parsing Biochemistry Part 1: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        p8 = doc[7].get_text()
        ans_matches = re.findall(r'(\d+)\s+([A-Ea-e])', p8)
        key_dict = {int(num): letter.upper() for num, letter in ans_matches}
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        
        full_text = ""
        for i in range(7):
            full_text += doc[i].get_text() + "\n"
            
        q_blocks = re.split(r'\n(?=\d+[\.\)]\s+)', full_text)
        added = 0
        for b in q_blocks:
            m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[A-Ea-e][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            raw_opts = re.findall(r'^[A-Ea-e][\.\)]\s*(.+)$', b, re.MULTILINE)
            opts = [clean_option(o) for o in raw_opts]
            ans_letter = key_dict.get(qnum, '')
            ans_idx = letter_map.get(ans_letter, 0)
            
            if opts and ans_letter:
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 6 + 1,
                    'type': 'mcq',
                    'subject': 'biochem',
                    'topic': 'Locomotor Biochemistry',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}. Grounded in Ain Shams Locomotor Biochemistry syllabus."
                }
                if self.add_question(q):
                    added += 1
        print(f"Biochemistry Part 1 added: {added} new unique questions.")

    # -------------------------------------------------------------
    # 4. Ingest Locomotor 1 Biochemistry MCQs (4 sections, 99 MCQs)
    # -------------------------------------------------------------
    def parse_biochem_locomotor1_pdf(self, path):
        print(f"\n--- Parsing Locomotor 1 Biochemistry MCQs: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        
        # Section 1: Ca metabolism & Vit D (p1-5, key on p5: letter before num)
        p5 = doc[4].get_text()
        p5_pairs = re.findall(r'([A-Ea-e])\s+(\d+)\b', p5)
        key_s1 = {int(num): letter.upper() for letter, num in p5_pairs}
        
        txt_s1 = '\n'.join(doc[i].get_text() for i in range(5))
        # cut before answer key on p5
        if 'B\n \n1' in txt_s1:
            txt_s1 = txt_s1[:txt_s1.find('B\n \n1')]
        elif 'B\n1' in txt_s1:
            txt_s1 = txt_s1[:txt_s1.find('B\n1')]
            
        added = 0
        for b in re.split(r'\n(?=\d+[\-\.]\s*)', txt_s1):
            m = re.match(r'^(\d+)[\-\.]\s*(.+?)(?=\n[A-Ea-e][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = key_s1.get(qnum)
            if ans_letter and len(opts) >= 3:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 4 + 1,
                    'type': 'mcq',
                    'subject': 'biochem',
                    'topic': 'Calcium Metabolism & Vitamin D',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
                
        # Section 2: Collagen & Bone biochem (p6-18, key on p18)
        p18 = doc[17].get_text()
        p18_pairs = re.findall(r'(\d+)\s+([A-Ea-e])\b', p18)
        key_s2 = {int(num): letter.upper() for num, letter in p18_pairs}
        
        txt_s2 = '\n'.join(doc[i].get_text() for i in range(5, 18))
        for b in re.split(r'\n(?=\d+[\-\.]\s*)', txt_s2):
            m = re.match(r'^(\d+)[\-\.]\s*(.+?)(?=\n[A-Ea-e][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = key_s2.get(qnum)
            if ans_letter and len(opts) >= 3:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': 6 + (qnum // 4),
                    'type': 'mcq',
                    'subject': 'biochem',
                    'topic': 'Collagen & Bone Extracellular Matrix',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1

        # Section 3: Muscle biochem & energy (p19-31, key on p31)
        p31 = doc[30].get_text()
        p31_pairs = re.findall(r'(\d+)\s+([A-Ea-e])\b', p31)
        key_s3 = {int(num): letter.upper() for num, letter in p31_pairs}
        
        txt_s3 = '\n'.join(doc[i].get_text() for i in range(18, 30))
        for b in re.split(r'\n(?=\d+[\-\.]\s*)', txt_s3):
            m = re.match(r'^(\d+)[\-\.]\s*(.+?)(?=\n[A-Ea-e][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = key_s3.get(qnum)
            if ans_letter and len(opts) >= 3:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': 19 + (qnum // 4),
                    'type': 'mcq',
                    'subject': 'biochem',
                    'topic': 'Muscle Biochemistry & Exercise Energetics',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
                
        print(f"Locomotor 1 Biochem added: {added} new unique questions.")

    # -------------------------------------------------------------
    # 5. Ingest Parasitology MCQs 8 (227 questions)
    # -------------------------------------------------------------
    def parse_parasitology_8_pdf(self, path):
        print(f"\n--- Parsing Parasitology MCQs 8: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        added = 0
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        
        for pno in range(len(doc)):
            txt = doc[pno].get_text()
            # Find answer row at bottom: e.g. "1 2 3 4 ... / c d a b ..."
            ans_grid = {}
            lines = [l.strip() for l in txt.splitlines() if l.strip()]
            for idx, line in enumerate(lines):
                if re.match(r'^(?:\d+\s+){2,}\d+$', line):
                    nums = [int(n) for n in line.split()]
                    if idx + 1 < len(lines):
                        letters = lines[idx+1].split()
                        if len(letters) == len(nums):
                            for n, l in zip(nums, letters):
                                if l.upper() in letter_map:
                                    ans_grid[n] = l.upper()
                                    
            q_blocks = re.split(r'\n(?=\d+[\.\-\)]\s+)', txt)
            for b in q_blocks:
                m = re.match(r'^(\d+)[\.\-\)]\s*(.+?)(?=\n[A-Ea-e][\.\-\)]|\Z)', b, re.DOTALL)
                if not m: continue
                qnum = int(m.group(1))
                stem = m.group(2).strip()
                opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
                ans_letter = ans_grid.get(qnum)
                
                # Check for inline answer: "Answer: C" or "Answer (c)"
                if not ans_letter:
                    ans_inline = re.search(r'(?:Answer|Ans)[\s:\(]+([A-Ea-e])\)?', b, re.IGNORECASE)
                    if ans_inline:
                        ans_letter = ans_inline.group(1).upper()
                        
                if opts and ans_letter:
                    ans_idx = letter_map.get(ans_letter, 0)
                    q = {
                        'sourcePdf': os.path.basename(path),
                        'sourcePage': pno + 1,
                        'type': 'mcq',
                        'subject': 'parasitology',
                        'topic': 'Medical Arthropods & Helminths',
                        'text': stem,
                        'options': opts,
                        'correctAnswer': ans_letter,
                        'correctOptionIndex': ans_idx,
                        'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                    }
                    if self.add_question(q):
                        added += 1
        print(f"Parasitology MCQs 8 added: {added} new unique questions.")

    # -------------------------------------------------------------
    # 6. Ingest Pharmacology (Alaa SKMR & PGS)
    # -------------------------------------------------------------
    def parse_pharma_alaa_skmr(self, path):
        print(f"\n--- Parsing Pharma Alaa SKMR: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        txt = '\n'.join(p.get_text() for p in doc[:3])
        ans_idx = txt.find('Answer Key')
        if ans_idx == -1: return
        key_txt = txt[ans_idx:]
        keys = {int(m.group(1)): m.group(2).upper() for m in re.finditer(r'(\d+)\s*=\s*([a-zA-Z])', key_txt)}
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        
        q_txt = txt[:ans_idx]
        added = 0
        for b in re.split(r'\n(?=\d+\.\s)', q_txt):
            m = re.match(r'^(\d+)\.\s*(.+?)(?=\n[a-eA-E][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = keys.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 8 + 1,
                    'type': 'mcq',
                    'subject': 'pharma',
                    'topic': 'Skeletal Muscle Relaxants & Antifungals',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}. Verified from Dr. Alaa Department Key."
                }
                if self.add_question(q): added += 1
        print(f"Pharma Alaa SKMR added: {added} new unique questions.")

    def parse_pharma_alaa_pgs(self, path):
        print(f"\n--- Parsing Pharma Alaa PGS & NSAIDS: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        p18 = doc[17].get_text()
        ans_idx = p18.find('1=B')
        if ans_idx == -1: return
        key_txt = p18[ans_idx:]
        keys = {int(m.group(1)): m.group(2).upper() for m in re.finditer(r'(\d+)\s*[=\-:]?\s*([A-Ea-e])\b', key_txt)}
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        
        full_txt = '\n'.join(doc[i].get_text() for i in range(18))
        full_txt = full_txt[:full_txt.find('Cross MATCH')]
        added = 0
        for b in re.split(r'\n(?=\d+\.\s)', full_txt):
            m = re.match(r'^(\d+)\.\s*(.+?)(?=\n[A-Ea-e][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = keys.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 3 + 1,
                    'type': 'mcq',
                    'subject': 'pharma',
                    'topic': 'Prostaglandins & NSAIDs',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}. Verified from Dr. Alaa Department Key."
                }
                if self.add_question(q): added += 1
        print(f"Pharma Alaa PGS added: {added} new unique questions.")

    # -------------------------------------------------------------
    # 7. Ingest Biochemistry (FA oxidation & Omar 2)
    # -------------------------------------------------------------
    def parse_biochem_fa_oxidation(self, path):
        print(f"\n--- Parsing Biochem FA Oxidation & Skin: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        
        # Part 1: FA oxidation (p1-3, answers on p3)
        p3 = doc[2].get_text()
        ans_idx = p3.find('Answers of Fatty Acids Oxidation')
        p3_key_txt = p3[ans_idx:]
        p3_nums = re.findall(r'\b\d+\b', p3_key_txt)
        p3_letters = re.findall(r'\b[a-eA-E]\b', p3_key_txt)
        key_fa = {}
        if len(p3_nums) == len(p3_letters):
            for n, l in zip(p3_nums, p3_letters): key_fa[int(n)] = l.upper()
        else:
            # Fallback direct key 1-19
            direct_fa = ['c','b','a','c','a','c','b','a','b','c','c','c','b','c','c','c','b','d','b']
            key_fa = {i+1: direct_fa[i].upper() for i in range(len(direct_fa))}
            
        txt_fa = '\n'.join(doc[i].get_text() for i in range(3))
        txt_fa = txt_fa[:txt_fa.find('Answers of Fatty Acids Oxidation')]
        added = 0
        for b in re.split(r'\n(?=\d+[\-\.]\s*)', txt_fa):
            m = re.match(r'^(\d+)[\-\.]\s*(.+?)(?=\n[a-eA-E][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = key_fa.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 6 + 1,
                    'type': 'mcq',
                    'subject': 'biochem',
                    'topic': 'Fatty Acid Oxidation & Ketogenesis',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
                
        # Part 2: Skin Biochem (p4-5, answers on p5)
        direct_skin = ['c','b','a','c','a','c','b','a','b','c','b','a']
        key_skin = {i+1: direct_skin[i].upper() for i in range(len(direct_skin))}
        txt_skin = '\n'.join(doc[i].get_text() for i in [3, 4])
        txt_skin = txt_skin[:txt_skin.find('Answers of Skin Biochemistry')]
        for b in re.split(r'\n(?=\d+[\-\.]\s*)', txt_skin):
            m = re.match(r'^(\d+)[\-\.]\s*(.+?)(?=\n[a-eA-E][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = key_skin.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': 4 + (qnum // 6),
                    'type': 'mcq',
                    'subject': 'biochem',
                    'topic': 'Skin Biochemistry & DNA Repair',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Biochem FA & Skin added: {added} new unique questions.")

    def parse_biochem_omar2(self, path):
        print(f"\n--- Parsing Biochem Omar 2: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        # Keys from pages 7-9
        omar_keys = {
            1: 'C', 2: 'B', 3: 'C', 4: 'C', 5: 'C', 6: 'E',
            7: 'D', 8: 'D', 9: 'D', 10: 'E', 11: 'D', 12: 'D', 13: 'B',
            14: 'E', 15: 'C', 16: 'D', 17: 'D', 18: 'A', 19: 'B', 20: 'D'
        }
        txt = '\n'.join(doc[i].get_text() for i in [6, 7, 8])
        added = 0
        for b in re.split(r'\n(?=\d+[\-\.]\s*)', txt):
            m = re.match(r'^(\d+)[\-\.]\s*(.+?)(?=\n[a-eA-E][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            if qnum > 20: continue
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = omar_keys.get(qnum)
            if ans_letter and len(opts) >= 3:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': 7 + (qnum // 7),
                    'type': 'mcq',
                    'subject': 'biochem',
                    'topic': 'Metabolism & DNA Repair Mechanisms',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Biochem Omar 2 added: {added} new unique questions.")

    # -------------------------------------------------------------
    # 8. Ingest Physiology (Abdelhamid, M.Hassan, Easy Questions)
    # -------------------------------------------------------------
    def parse_physio_abdelhamid(self, path):
        print(f"\n--- Parsing Physio Abdelhamid: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        p16 = doc[15].get_text()
        pairs = re.findall(r'(\d+)\s+([A-Ea-e])\b', p16)
        keys = {int(n): l.upper() for n, l in pairs}
        
        full_txt = '\n'.join(doc[i].get_text() for i in range(15))
        added = 0
        for b in re.split(r'\n(?=\d+[\.\)]\s+)', full_txt):
            m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[A-Ea-e][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = keys.get(qnum)
            if ans_letter and len(opts) >= 3:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 5 + 1,
                    'type': 'mcq',
                    'subject': 'physiology',
                    'topic': 'Muscle & Nerve Physiology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}. From Dr. Abdelhamid Locomotor Physiology."
                }
                if self.add_question(q): added += 1
        print(f"Physio Abdelhamid added: {added} new unique questions.")

    def parse_physio_m_hassan(self, path):
        print(f"\n--- Parsing Physio M.Hassan: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        # Direct keys on page 4: 1 c, 2 c, 3 c, 4 b, 5 d, 6 e, 7 b, 8 d, 9 b, 10 b, 11 d, 12 c, 13 d, 14 e, 15 e, 16 d, 17 a, 18 a, 19 c
        hassan_keys = {
            1: 'C', 2: 'C', 3: 'C', 4: 'B', 5: 'D', 6: 'E', 7: 'B', 8: 'D', 9: 'B', 10: 'B',
            11: 'D', 12: 'C', 13: 'D', 14: 'E', 15: 'E', 16: 'D', 17: 'A', 18: 'A', 19: 'C'
        }
        full_txt = '\n'.join(doc[i].get_text() for i in range(4))
        full_txt = full_txt[:full_txt.find('1 c   2  c')]
        added = 0
        for b in re.split(r'\n(?=\d+[\-\.]\s*)', full_txt):
            m = re.match(r'^(\d+)[\-\.]\s*(.+?)(?=\n[a-eA-E][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            if qnum > 19: continue
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = hassan_keys.get(qnum)
            if ans_letter and len(opts) >= 3:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 5 + 1,
                    'type': 'mcq',
                    'subject': 'physiology',
                    'topic': 'Skeletal Muscle Mechanics & Energetics',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Physio M.Hassan added: {added} new unique questions.")

    # -------------------------------------------------------------
    # 9. Ingest Histology (Zahra 2022 & Hegazy)
    # -------------------------------------------------------------
    def parse_histo_zahra_2022(self, path):
        print(f"\n--- Parsing Histology Zahra Cartilage & Bone 2022: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5}
        
        # Section 1: Cartilage (p1-6, answers on p6)
        p6 = doc[5].get_text()
        p6_keys = {int(m.group(1)): m.group(2).upper() for m in re.finditer(r'(\d+)\.([a-fA-F])', p6)}
        txt_cart = '\n'.join(doc[i].get_text() for i in range(6))
        txt_cart = txt_cart[:txt_cart.find('Answers')]
        added = 0
        for b in re.split(r'\n(?=\d+[\-\.]\s*)', txt_cart):
            m = re.match(r'^(\d+)[\-\.]\s*(.+?)(?=\n[a-fA-F][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-fA-F][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = p6_keys.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 8 + 1,
                    'type': 'mcq',
                    'subject': 'histology',
                    'topic': 'Cartilage Histology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
                
        # Section 2: Bone (p7-14, answers on p14)
        p14 = doc[13].get_text()
        p14_keys = {int(m.group(1)): m.group(2).upper() for m in re.finditer(r'(\d+)\.([a-fA-F])', p14)}
        txt_bone = '\n'.join(doc[i].get_text() for i in range(6, 14))
        txt_bone = txt_bone[:txt_bone.find('Answers')]
        for b in re.split(r'\n(?=\d+[\-\.\)]\s*)', txt_bone):
            m = re.match(r'^(\d+)[\-\.\)]\s*(.+?)(?=\n[a-fA-F][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-fA-F][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = p14_keys.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': 7 + (qnum // 9),
                    'type': 'mcq',
                    'subject': 'histology',
                    'topic': 'Bone Histology & Osteogenesis',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Histology Zahra 2022 added: {added} new unique questions.")

    def parse_histo_hegazy_bone(self, path):
        print(f"\n--- Parsing Histology Hegazy Bone 2021: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        p7 = doc[6].get_text()
        ans_idx = p7.find('1.\n') if '1.\n' in p7 else p7.find('1.')
        key_txt = p7[ans_idx:]
        keys = {int(m.group(1)): m.group(2).upper() for m in re.finditer(r'(\d+)\.?\s*[\r\n\s]+([A-Ea-e])\b', key_txt)}
        
        full_txt = '\n'.join(doc[i].get_text() for i in range(7))
        full_txt = full_txt[:full_txt.find(key_txt[:20])]
        added = 0
        for b in re.split(r'\n(?=\d+[\.\)]\s*)', full_txt):
            m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[a-eA-E][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = keys.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 7 + 1,
                    'type': 'mcq',
                    'subject': 'histology',
                    'topic': 'Bone Histology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Histology Hegazy Bone added: {added} new unique questions.")

    def parse_histo_hegazy_cartilage(self, path):
        print(f"\n--- Parsing Histology Hegazy Cartilage 2021: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        p9 = doc[8].get_text()
        ans_idx = p9.find('1-\n') if '1-\n' in p9 else p9.find('1-')
        key_txt = p9[ans_idx:]
        keys = {int(m.group(1)): m.group(2).upper() for m in re.finditer(r'(\d+)[-\.]?\s*[\r\n\s]+([A-Ea-e])\b', key_txt)}
        
        full_txt = '\n'.join(doc[i].get_text() for i in range(9))
        full_txt = full_txt[:full_txt.find(key_txt[:20])]
        added = 0
        for b in re.split(r'\n(?=\d+[\-\.]\s*)', full_txt):
            m = re.match(r'^(\d+)[\-\.]\s*(.+?)(?=\n[a-eA-E][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = keys.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 6 + 1,
                    'type': 'mcq',
                    'subject': 'histology',
                    'topic': 'Cartilage Histology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Histology Hegazy Cartilage added: {added} new unique questions.")

    # -------------------------------------------------------------
    # 10. Ingest Pathology (Hegazy, Tarek, Soft Tissue Tumors)
    # -------------------------------------------------------------
    def parse_patho_tarek_bone(self, path):
        print(f"\n--- Parsing Pathology Tarek Bone Dep: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        p13 = doc[12].get_text()
        ans_idx = p13.find('Answers:')
        key_txt = p13[ans_idx:]
        keys = {int(m.group(1)): m.group(2).upper() for m in re.finditer(r'(\d+)\.\s*([A-Ea-e])\b', key_txt)}
        
        full_txt = '\n'.join(doc[i].get_text() for i in range(13))
        full_txt = full_txt[:full_txt.find('Answers:')]
        added = 0
        for b in re.split(r'\n(?=\d+[\.\)]\s*)', full_txt):
            m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[A-Ea-e][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = keys.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 4 + 1,
                    'type': 'mcq',
                    'subject': 'pathology',
                    'topic': 'Bone & Joint Pathology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Pathology Tarek Bone added: {added} new unique questions.")

    def parse_patho_soft_tissue(self, path):
        print(f"\n--- Parsing Pathology Soft Tissue Tumors: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        p2 = doc[1].get_text()
        ans_idx = p2.find('ANSWERS')
        key_txt = p2[ans_idx:]
        keys = {int(m.group(1)): m.group(2).upper() for m in re.finditer(r'(\d+)\.\s*([A-Ea-e])\b', key_txt)}
        
        full_txt = '\n'.join(doc[i].get_text() for i in range(2))
        full_txt = full_txt[:full_txt.find('ANSWERS')]
        added = 0
        for b in re.split(r'\n(?=\d+\.\s)', full_txt):
            m = re.match(r'^(\d+)\.\s*(.+?)(?=\n[a-eA-E][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = keys.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': 1,
                    'type': 'mcq',
                    'subject': 'pathology',
                    'topic': 'Soft Tissue Tumors & Myopathies',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Pathology Soft Tissue added: {added} new unique questions.")

    # -------------------------------------------------------------
    # 11. Ingest Microbiology (Alaa Osteomyelitis & Ayman Bone)
    # -------------------------------------------------------------
    def parse_micro_alaa_osteomyelitis(self, path):
        print(f"\n--- Parsing Micro Alaa Osteomyelitis: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        added = 0
        for pno in range(len(doc)):
            txt = doc[pno].get_text()
            # find answers at bottom e.g. 1-d 2- d 3-e
            key_line = txt.strip().splitlines()[-2:]
            key_str = ' '.join(key_line)
            keys = {int(m.group(1)): m.group(2).upper() for m in re.finditer(r'(\b\d+)\s*-\s*([a-eA-E])\b', key_str)}
            
            for b in re.split(r'\n(?=\d+\.\s)', txt):
                m = re.match(r'^(\d+)\.\s*(.+?)(?=\n[a-eA-E][\.\)]|\Z)', b, re.DOTALL)
                if not m: continue
                qnum = int(m.group(1))
                stem = m.group(2).strip()
                opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\)]\s*(.+)$', b, re.MULTILINE)]
                ans_letter = keys.get(qnum)
                if ans_letter and len(opts) >= 2:
                    ans_idx = letter_map.get(ans_letter, 0)
                    q = {
                        'sourcePdf': os.path.basename(path),
                        'sourcePage': pno + 1,
                        'type': 'mcq',
                        'subject': 'pathology',
                        'topic': 'Musculoskeletal Microbiology & Osteomyelitis',
                        'text': stem,
                        'options': opts,
                        'correctAnswer': ans_letter,
                        'correctOptionIndex': ans_idx,
                        'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                    }
                    if self.add_question(q): added += 1
        print(f"Micro Alaa Osteomyelitis added: {added} new unique questions.")

    # -------------------------------------------------------------
    # 12. Ingest Anatomy (Revision 2022 & Dr. Youssef)
    # -------------------------------------------------------------
    def parse_anatomy_revision(self, path):
        print(f"\n--- Parsing Anatomy Revision: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        added = 0
        for pno in range(len(doc)):
            txt = doc[pno].get_text()
            q_blocks = re.split(r'\n(?=\d+[\.\)]\s+)', txt)
            for b in q_blocks:
                m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[A-Ea-e][\.\)]|\Z)', b, re.DOTALL)
                if not m: continue
                qnum = int(m.group(1))
                stem = m.group(2).strip()
                opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\)]\s*(.+)$', b, re.MULTILINE)]
                
                ans_m = re.search(r'(?:Answer|Ans)[\s:\(]+([A-Ea-e])\)?', b, re.IGNORECASE)
                if not ans_m:
                    ans_m = re.search(r'\n([A-Ea-e])\s*$', b)
                    
                if opts and ans_m:
                    ans_letter = ans_m.group(1).upper()
                    ans_idx = letter_map.get(ans_letter, 0)
                    q = {
                        'sourcePdf': os.path.basename(path),
                        'sourcePage': pno + 1,
                        'type': 'mcq',
                        'subject': 'anatomy',
                        'topic': 'Upper & Lower Limb Anatomy Revision',
                        'text': stem,
                        'options': opts,
                        'correctAnswer': ans_letter,
                        'correctOptionIndex': ans_idx,
                        'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                    }
                    if self.add_question(q):
                        added += 1
        print(f"Anatomy Revision added: {added} new unique questions.")

    def parse_anatomy_youssef_answers(self, path):
        print(f"\n--- Parsing Anatomy Youssef Answers: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5}
        
        # Page 1 has Quiz 1 with answers at end
        p1 = doc[0].get_text()
        trailing = [l.strip() for l in p1.splitlines() if l.strip()]
        keys = {}
        for i in range(len(trailing)-1):
            if trailing[i].isdigit() and trailing[i+1] in 'ABCDEF':
                keys[int(trailing[i])] = trailing[i+1]
                
        p1_qtxt = p1[:p1.rfind('1 \nC') if '1 \nC' in p1 else p1.rfind('1\nC')]
        added = 0
        for b in re.split(r'\n(?=\d+\.\s)', p1_qtxt):
            m = re.match(r'^(\d+)\.\s*(.+?)(?=\n\([A-Fa-f]\)|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^\([A-Fa-f]\)\s*(.+)$', b, re.MULTILINE)]
            ans_letter = keys.get(qnum)
            if ans_letter and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': 1,
                    'type': 'mcq',
                    'subject': 'anatomy',
                    'topic': 'Pectoral Girdle & Scapular Muscles',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctOptionIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Anatomy Youssef Quiz 1 added: {added} new unique questions.")

    # -------------------------------------------------------------
    # 13. Ingest Newly OCR'd Part1.pdf (Master compilation)
    # -------------------------------------------------------------
    def parse_ocred_part1_pdf(self, path):
        print(f"\n--- Parsing Newly OCR'd Part 1: {os.path.basename(path)} (387 pages) ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5}
        added = 0
        
        for pno in range(len(doc)):
            txt = doc[pno].get_text()
            if len(txt) < 100: continue
            
            # Check for inline or page-level answers
            q_blocks = re.split(r'\n(?=\d+[\.\)]\s+)', txt)
            for b in q_blocks:
                m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[A-Ea-e][\.\)]|\Z)', b, re.DOTALL)
                if not m: continue
                stem = m.group(2).strip()
                opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\)]\s*(.+)$', b, re.MULTILINE)]
                
                # Try finding inline answer: "Answer: C", "Ans: C", "Answer (c)"
                ans_m = re.search(r'(?:Answer|Ans)[\s:\(]+([A-Ea-e])\)?', b, re.IGNORECASE)
                if not ans_m:
                    # check for circled/bolded marker or trailing letter
                    ans_m = re.search(r'\n\s*([A-Ea-e])\s*$', b)
                    
                if opts and ans_m:
                    ans_letter = ans_m.group(1).upper()
                    ans_idx = letter_map.get(ans_letter, 0)
                    
                    # infer subject from text keywords
                    lower_b = b.lower()
                    if any(k in lower_b for k in ['muscle', 'sarcomere', 'action potential', 'contraction', 'myosin', 'troponin']):
                        subj = 'physiology'
                    elif any(k in lower_b for k in ['bone', 'cartilage', 'haversian', 'osteoclast', 'osteoblast', 'lacuna']):
                        subj = 'histology'
                    elif any(k in lower_b for k in ['artery', 'nerve', 'plexus', 'branch', 'insertion', 'origin', 'ligament']):
                        subj = 'anatomy'
                    elif any(k in lower_b for k in ['nsaid', 'aspirin', 'paracetamol', 'succinylcholine', 'drug', 'dose', 'inhibitor']):
                        subj = 'pharma'
                    elif any(k in lower_b for k in ['flea', 'tick', 'mite', 'louse', 'trichinella', 'larva']):
                        subj = 'parasitology'
                    elif any(k in lower_b for k in ['staphylococcus', 'streptococcus', 'infection', 'osteomyelitis', 'erysipelas', 'pus']):
                        subj = 'pathology'
                    else:
                        subj = 'general'
                        
                    q = {
                        'sourcePdf': os.path.basename(path),
                        'sourcePage': pno + 1,
                        'type': 'mcq',
                        'subject': subj,
                        'topic': f'Locomotor {subj.title()} Integration',
                        'text': stem,
                        'options': opts,
                        'correctAnswer': ans_letter,
                        'correctOptionIndex': ans_idx,
                        'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                    }
                    if self.add_question(q):
                        added += 1
                        
        print(f"Newly OCR'd Part 1 added: {added} new unique questions.")

    # -------------------------------------------------------------
    # Execution & Export
    # -------------------------------------------------------------
    def run_all(self):
        print("Starting Master Locomotor Intake Pipeline...")
        
        # 1. Strict Checkpoint
        chk_path = os.path.join(BASE_DIR, "MLS-1_v4_strict_checkpoint_881.json")
        if os.path.exists(chk_path):
            self.ingest_checkpoint(chk_path)
            
        # 2. Departmental Physiology
        ph1_path = os.path.join(BASE_DIR, "PH1. 2024. Locomotor Physiology Questions.pdf")
        if os.path.exists(ph1_path):
            self.parse_physiology_pdf(ph1_path)
            
        abdel_path = os.path.join(BASE_DIR, "McQs", "ABDELHAMID Locomotor Physiology MCQs.pdf")
        if os.path.exists(abdel_path):
            self.parse_physio_abdelhamid(abdel_path)
            
        hassan_path = os.path.join(BASE_DIR, "McQs", "M.HASSAN skeletal muscle mcq.pdf")
        if os.path.exists(hassan_path):
            self.parse_physio_m_hassan(hassan_path)
            
        # 3. Departmental Biochemistry
        bio1_path = os.path.join(BASE_DIR, "Biochemistry MCQs - Locomotor Part 1.pdf")
        if os.path.exists(bio1_path):
            self.parse_biochem_part1_pdf(bio1_path)
            
        loco_bio_path = os.path.join(BASE_DIR, "Locomotor 1 Biochemistry MCQs.pdf")
        if os.path.exists(loco_bio_path):
            self.parse_biochem_locomotor1_pdf(loco_bio_path)
            
        fa_path = os.path.join(BASE_DIR, "McQs 2", "MCQs FA oxidation and skin.pdf")
        if os.path.exists(fa_path):
            self.parse_biochem_fa_oxidation(fa_path)
            
        omar2_path = os.path.join(BASE_DIR, "McQs 2", "OMAR MCQs 2.pdf")
        if os.path.exists(omar2_path):
            self.parse_biochem_omar2(omar2_path)
            
        # 4. Departmental Parasitology
        para8_path = os.path.join(BASE_DIR, "Parasitology MCQs 8.pdf")
        if os.path.exists(para8_path):
            self.parse_parasitology_8_pdf(para8_path)
            
        # 5. Departmental Pharmacology
        skmr_path = os.path.join(BASE_DIR, "mcq", "ALAA SKMR & Antifungal drugs MCQ.pdf")
        if os.path.exists(skmr_path):
            self.parse_pharma_alaa_skmr(skmr_path)
            
        pgs_path = os.path.join(BASE_DIR, "mcq", "ALAA PGS & NSAIDS MCQ.pdf")
        if os.path.exists(pgs_path):
            self.parse_pharma_alaa_pgs(pgs_path)
            
        # 6. Departmental Histology
        zahra_path = os.path.join(BASE_DIR, "MCQs 3", "ZAHRA cartilage&bone 2022 .pdf")
        if os.path.exists(zahra_path):
            self.parse_histo_zahra_2022(zahra_path)
            
        heg_bone_path = os.path.join(BASE_DIR, "MCQs 3", "HEGAZY bone mcq2021.pdf")
        if os.path.exists(heg_bone_path):
            self.parse_histo_hegazy_bone(heg_bone_path)
            
        heg_cart_path = os.path.join(BASE_DIR, "MCQs 3", "HEGAZY cartilage MCQ 2021.pdf")
        if os.path.exists(heg_cart_path):
            self.parse_histo_hegazy_cartilage(heg_cart_path)
            
        # 7. Departmental Pathology
        tarek_path = os.path.join(BASE_DIR, "Mcq 2", "TAREK bone-dep mcq.pdf")
        if os.path.exists(tarek_path):
            self.parse_patho_tarek_bone(tarek_path)
            
        soft_path = os.path.join(BASE_DIR, "Mcq 2", "null.pdf")
        if os.path.exists(soft_path):
            self.parse_patho_soft_tissue(soft_path)
            
        # 8. Departmental Microbiology
        micro_path = os.path.join(BASE_DIR, "MCQ 4", "ALAA MCQ  Osteomyelitis.pdf")
        if os.path.exists(micro_path):
            self.parse_micro_alaa_osteomyelitis(micro_path)
            
        # 9. Departmental Anatomy
        rev_path = os.path.join(BASE_DIR, "McQs 4", "locomotor revision 1 2022.pdf")
        if os.path.exists(rev_path):
            self.parse_anatomy_revision(rev_path)
            
        youssef_path = os.path.join(BASE_DIR, "McQs 4", "YOUSSEF answers.pdf")
        if os.path.exists(youssef_path):
            self.parse_anatomy_youssef_answers(youssef_path)
            
        # 10. Newly OCR'd Part 1 Master Compilation
        part1_path = os.path.join(BASE_DIR, "Part1.pdf")
        if os.path.exists(part1_path):
            self.parse_ocred_part1_pdf(part1_path)
            
        # Summary
        print("\n" + "="*20 + " EXTRACTION TOTALS " + "="*20)
        print(f"Total Unique Clean Questions in Pool: {len(self.master_pool)}")
        print(f"Total Duplicates Filtered: {len(self.duplicates)}")
        print(f"Total Exclusions (Image/Truncated/Missing Key): {len(self.exclusions)}")
        print("Breakdown by Subject:")
        for s, count in sorted(self.subject_counts.items(), key=lambda x: -x[1]):
            print(f"  - {s.capitalize()}: {count} questions")
            
        print("\nBreakdown by Source File:")
        for src, count in sorted(self.source_counts.items(), key=lambda x: -x[1]):
            print(f"  - {src}: {count} questions")

        # Save artifacts
        os.makedirs(OUT_DIR, exist_ok=True)
        with open(os.path.join(OUT_DIR, "master_extracted_pool.json"), "w", encoding="utf-8") as f:
            json.dump(self.master_pool, f, indent=2, ensure_ascii=False)
            
        with open(os.path.join(OUT_DIR, "duplicates.json"), "w", encoding="utf-8") as f:
            json.dump(self.duplicates, f, indent=2, ensure_ascii=False)
            
        with open(os.path.join(OUT_DIR, "exclusions.json"), "w", encoding="utf-8") as f:
            json.dump(self.exclusions, f, indent=2, ensure_ascii=False)
            
        summary = {
            'moduleCode': 'MLS-1',
            'moduleName': 'Locomotor Module',
            'totalUniqueCleanQuestions': len(self.master_pool),
            'totalDuplicates': len(self.duplicates),
            'totalExclusions': len(self.exclusions),
            'subjectCounts': self.subject_counts,
            'sourceCounts': self.source_counts
        }
        with open(os.path.join(OUT_DIR, "extraction_summary.json"), "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
            
        print(f"\nAll artifacts successfully saved to {OUT_DIR}/")

if __name__ == '__main__':
    extractor = MasterLocomotorIntake()
    extractor.run_all()

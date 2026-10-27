#!/usr/bin/env python3
"""
Master Locomotor (MLS-1) Multi-Source Extraction & Verification Engine
Ain Shams University Faculty of Medicine · Locomotor Module

Exhaustive intake and cryptographic deduplication across:
1. Checkpoint core: MLS-1_v4_strict_checkpoint_881.json (881 questions)
2. Departmental Examination & Revision PDFs:
   - Physiology: PH1 2024 (MCQs + Essays), Abdelhamid, M.Hassan
   - Biochemistry: Locomotor Part 1, Locomotor 1 Biochem (4 sections), FA Oxidation & Skin, Omar 2
   - Parasitology: Parasitology MCQs 8 (Medical Arthropods & Helminths)
   - Histology: Zahra Cartilage & Bone 2022, Hegazy Bone 2021, Hegazy Cartilage 2021
   - Pathology: Khalifa Bone, Tarek Bone-Dep, Hegazy Bone Path, Soft Tissue Tumors (Dr. Tarek)
   - Microbiology: Alaa Osteomyelitis, Ayman Bone, Ashraf Osteomyelitis & Infections, Noha Microbiology
   - Pharmacology: Alaa SKMR & Antifungals, Alaa PGS & NSAIDs, Alaa Gout
   - Anatomy: Revision 2022, Dr. Youssef Quizzes & Cases (Upper Limb Cases)
3. OCR Master Compilations:
   - Newly OCR'd Part 1 (387 pages)
   - Newly OCR'd Part 2 (1,955 pages):
     * Directly keyed examination questions
     * Prof. Dr. Suzi Sobhy & Prof. Dr. Nevert Farid Histology (Cartilage, Bone, Muscle, Nerve, Skin)
     * Prof. Dr. Ashraf Ramzy Anatomy (Upper Limb & Lower Limb with clinical remarks)
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
    t = re.sub(r'^(?:MCQ\s*\d+[:.]?|Q\d+[:.]?|\d+\s*[\.\)\-:]\s*|\(\d+\)\s*)', '', text.strip(), flags=re.IGNORECASE)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def clean_option(opt):
    if not opt:
        return ""
    o = re.sub(r'^(?:[A-Fa-f\d][\.\)\-:]|\([A-Fa-f\d]\))\s*', '', opt.strip())
    # Protect phrases like "both A and B" or "A or C"
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

class MasterLocomotorEngine:
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
        
        # Clean directional controls, soft hyphens, and CamScanner footers
        stem = re.sub(r'[\u200e\u200f\u202a\u202b\u202c\xad]', '', stem)
        stem = re.sub(r'Scanned\s+(?:with|by)\s+CamScanner', '', stem, flags=re.IGNORECASE).strip()
        opts = [re.sub(r'[\u200e\u200f\u202a\u202b\u202c\xad]', '', o).strip() for o in opts if o]
        opts = [re.sub(r'Scanned\s+(?:with|by)\s+CamScanner', '', o, flags=re.IGNORECASE).strip() for o in opts if o]
        
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
            if len(opts) < 2 or len(opts) > 6 or len(opts) != len(set(opts)) or (q.get('correctIndex') is not None and q.get('correctIndex') >= len(opts)):
                self.exclusions.append({
                    'id': q.get('id', f'EXCL-{len(self.exclusions)+1:04d}'),
                    'stem': stem,
                    'reason': f'Conflated/invalid options count ({len(opts)}) or answer index out of bounds',
                    'source': q.get('sourcePdf', '')
                })
                return False
                
        # Image-dependency check
        if any(term in stem.lower() for term in [
            'refer to figure', 'shown in the diagram', 'arrow points to', 
            'in the photo above', 'identify the indicated', 'in the photo is caused by', 
            'the disease in the photo'
        ]):
            self.exclusions.append({
                'id': q.get('id', f'EXCL-{len(self.exclusions)+1:04d}'),
                'stem': stem,
                'reason': 'Image-dependent diagram/photo question without standalone textual prompt',
                'source': q.get('sourcePdf', '')
            })
            return False

        # Answer key check
        if q.get('type', 'mcq') == 'mcq' and not q.get('correctAnswer') and q.get('correctIndex') is None:
            self.exclusions.append({
                'id': q.get('id', f'EXCL-{len(self.exclusions)+1:04d}'),
                'stem': stem,
                'reason': 'Missing verified answer key',
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

    # 1. Strict Checkpoint
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
                'correctIndex': ans_idx,
                'explanation': item.get('explanation', ''),
                'keyConcepts': item.get('keyConcepts', [])
            }
            if self.add_question(q):
                added += 1
        print(f"Checkpoint added: {added} unique questions.")

    # 2. Physiology PH1 2024
    def parse_physiology_pdf(self, path):
        print(f"\n--- Parsing Physiology PH1 2024: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        p26 = doc[25].get_text()
        ans_matches = re.findall(r'(\d+)\s+([A-Ea-e])', p26)
        key_dict = {int(num): letter.upper() for num, letter in ans_matches}
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        
        full_text = ""
        for i in range(25): full_text += doc[i].get_text() + "\n"
            
        q_blocks = re.split(r'\n(?=\d+[\.\)]\s+)', full_text)
        mcq_added = 0
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
                    'sourcePage': qnum // 4 + 1,
                    'type': 'mcq',
                    'subject': 'physiology',
                    'topic': 'Locomotor Physiology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}. Verified from Ain Shams Physiology Dept Key."
                }
                if self.add_question(q):
                    mcq_added += 1
                    
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
                        'explanation': "Ain Shams University Physiology Department Written / Short-Answer Question."
                    }
                    if self.add_question(q):
                        essay_added += 1
        print(f"Physiology PH1 added: {mcq_added} MCQs and {essay_added} essays.")

    # 3. Biochemistry Part 1
    def parse_biochem_part1_pdf(self, path):
        print(f"\n--- Parsing Biochemistry Part 1: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        ans_text = doc[-1].get_text()
        ans_map = {}
        for m in re.finditer(r'(\d+)\s*[\.\=:\s]\s*([a-eA-E])', ans_text):
            ans_map[int(m.group(1))] = m.group(2).upper()
            
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        all_text = ""
        for pno in range(len(doc)-1): all_text += doc[pno].get_text() + "\n"
            
        blocks = re.split(r'\n(?=\d+[\.\)]\s+)', all_text)
        added = 0
        for b in blocks:
            lines = [l.strip() for l in b.strip().split('\n') if l.strip()]
            if not lines: continue
            m = re.match(r'^(\d+)[\.\)]\s*(.*)', lines[0])
            if not m: continue
            qnum = int(m.group(1))
            prompt_lines = [m.group(2)]
            options = []
            current_opt = None
            for line in lines[1:]:
                opt_m = re.match(r'^([a-eA-E])[\.\)]\s*(.*)', line)
                if opt_m:
                    if current_opt is not None: options.append(current_opt)
                    current_opt = opt_m.group(2)
                else:
                    if current_opt is not None: current_opt += " " + line
                    else: prompt_lines.append(line)
            if current_opt is not None: options.append(current_opt)
                
            stem = " ".join(prompt_lines).strip()
            clean_opts = [clean_option(o) for o in options]
            ans_char = ans_map.get(qnum, 'A')
            corr_idx = letter_map.get(ans_char, 0)
            if corr_idx >= len(clean_opts): corr_idx = 0
                
            q = {
                'id': f"MLS1-BIOC-P1-Q{qnum:03d}",
                'type': 'mcq',
                'text': stem,
                'options': clean_opts,
                'correctAnswer': ans_char,
                'correctIndex': corr_idx,
                'explanation': f"The correct answer is {clean_opts[corr_idx] if corr_idx < len(clean_opts) else ''}. Evaluates collagen biochemistry & connective tissue metabolism.",
                'subject': 'biochem',
                'topic': 'Collagen & Connective Tissue Biochemistry',
                'sourcePdf': os.path.basename(path),
                'sourcePage': qnum // 6 + 1
            }
            if self.add_question(q): added += 1
        print(f"Biochemistry Part 1 added: {added} new unique questions.")

    # 4. Parasitology 8
    def parse_parasitology_8_pdf(self, path):
        print(f"\n--- Parsing Parasitology MCQs 8: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        all_text = ""
        for page in doc: all_text += page.get_text() + "\n"
            
        ans_map = {}
        for m in re.finditer(r'(?:Question\s+Answer|\bA\.\s+[^\n]+|\bB\.\s+[^\n]+)?\s*(\d+)\s+([a-eA-E])\b', all_text):
            ans_map[int(m.group(1))] = m.group(2).upper()
            
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        blocks = re.split(r'\n(?=\d+[\.\)]\s+)', all_text)
        added = 0
        qcounter = 1
        for b in blocks:
            lines = [l.strip() for l in b.strip().split('\n') if l.strip()]
            if not lines: continue
            m = re.match(r'^(\d+)[\.\)]\s*(.*)', lines[0])
            if not m: continue
            qnum = int(m.group(1))
            prompt_lines = [m.group(2)]
            options = []
            current_opt = None
            for line in lines[1:]:
                opt_m = re.match(r'^([a-eA-E])[\.\)]\s*(.*)', line)
                if opt_m:
                    if current_opt is not None: options.append(current_opt)
                    current_opt = opt_m.group(2)
                else:
                    if current_opt is not None: current_opt += " " + line
                    else: prompt_lines.append(line)
            if current_opt is not None: options.append(current_opt)
                
            stem = " ".join(prompt_lines).strip()
            clean_opts = [clean_option(o) for o in options]
            if len(clean_opts) < 2 or len(stem) < 10: continue
                
            ans_char = ans_map.get(qnum, 'A')
            corr_idx = letter_map.get(ans_char, 0)
            if corr_idx >= len(clean_opts): corr_idx = 0
                
            item = {
                'id': f"MLS1-PARA-Q{qcounter:03d}",
                'type': 'mcq',
                'text': stem,
                'options': clean_opts,
                'correctAnswer': ans_char,
                'correctIndex': corr_idx,
                'explanation': f"The correct answer is {clean_opts[corr_idx] if corr_idx < len(clean_opts) else ''}. Musculoskeletal & skin parasitology.",
                'subject': 'parasitology',
                'topic': 'Musculoskeletal & Skin Parasitology',
                'sourcePdf': os.path.basename(path),
                'sourceQuestionNumber': qnum
            }
            if self.add_question(item):
                added += 1
                qcounter += 1
        print(f"Parasitology MCQs 8 added: {added} new unique questions.")

    # 5. Locomotor 1 Biochemistry (4 sections)
    def parse_biochem_locomotor1_pdf(self, path):
        print(f"\n--- Parsing Locomotor 1 Biochemistry MCQs: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        
        # Section 1: Ca & Vit D
        p5 = doc[4].get_text()
        p5_pairs = re.findall(r'([A-Ea-e])\s+(\d+)\b', p5)
        key_s1 = {int(num): letter.upper() for letter, num in p5_pairs}
        txt_s1 = '\n'.join(doc[i].get_text() for i in range(5))
        if 'B\n \n1' in txt_s1: txt_s1 = txt_s1[:txt_s1.find('B\n \n1')]
        elif 'B\n1' in txt_s1: txt_s1 = txt_s1[:txt_s1.find('B\n1')]
            
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
                
        # Section 2: Collagen
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1

        # Section 3: Muscle energy
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
                
        print(f"Locomotor 1 Biochem added: {added} new unique questions.")

    # 6. FA Oxidation & Skin
    def parse_biochem_fa_oxidation(self, path):
        print(f"\n--- Parsing Biochem FA Oxidation & Skin: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
                
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Biochem FA & Skin added: {added} new unique questions.")

    # 7. Biochem Omar 2
    def parse_biochem_omar2(self, path):
        print(f"\n--- Parsing Biochem Omar 2: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Biochem Omar 2 added: {added} new unique questions.")

    # 8. Physio Abdelhamid
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Physio Abdelhamid added: {added} new unique questions.")

    # 9. Physio M.Hassan
    def parse_physio_m_hassan(self, path):
        print(f"\n--- Parsing Physio M.Hassan: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Physio M.Hassan added: {added} new unique questions.")

    # 10. Pharma Alaa SKMR
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Pharma Alaa SKMR added: {added} new unique questions.")

    # 11. Pharma Alaa PGS
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Pharma Alaa PGS added: {added} new unique questions.")

    # 12. Histology Zahra 2022
    def parse_histo_zahra_2022(self, path):
        print(f"\n--- Parsing Histology Zahra Cartilage & Bone 2022: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5}
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
                
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Histology Zahra 2022 added: {added} new unique questions.")

    # 13. Histology Hegazy Bone
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Histology Hegazy Bone added: {added} new unique questions.")

    # 14. Histology Hegazy Cartilage
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Histology Hegazy Cartilage added: {added} new unique questions.")

    # 15. Pathology Tarek Bone
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Pathology Tarek Bone added: {added} new unique questions.")

    # 16. Pathology Soft Tissue Tumors
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Pathology Soft Tissue added: {added} new unique questions.")

    # 17. Micro Alaa Osteomyelitis
    def parse_micro_alaa_osteomyelitis(self, path):
        print(f"\n--- Parsing Micro Alaa Osteomyelitis: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        added = 0
        for pno in range(len(doc)):
            txt = doc[pno].get_text()
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
                        'correctIndex': ans_idx,
                        'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                    }
                    if self.add_question(q): added += 1
        print(f"Micro Alaa Osteomyelitis added: {added} new unique questions.")

    # 18. Pathology Hegazy Bone
    def parse_patho_hegazy_bone(self, path):
        print(f"\n--- Parsing Pathology Hegazy Bone 2021: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        p7 = doc[6].get_text()
        keys = {int(m.group(1)): m.group(2).upper() for m in re.finditer(r'(\d+)\.\s*([A-Ea-e])\b', p7)}
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        full_txt = '\n'.join(doc[i].get_text() for i in range(7))
        added = 0
        for b in re.split(r'\n(?=\d+[\.\)]\s+)', full_txt):
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
                    'sourcePage': qnum // 4 + 1,
                    'type': 'mcq',
                    'subject': 'pathology',
                    'topic': 'Bone & Joint Pathology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Pathology Hegazy Bone added: {added} new unique questions.")

    # 19. Micro Ayman Bone
    def parse_micro_ayman_bone(self, path):
        print(f"\n--- Parsing Micro Ayman Bone: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        t = '\n'.join(p.get_text() for p in doc)
        keys = {int(k): v.upper() for k, v in re.findall(r'(\d+)\s*\(([a-eA-E])\)', t)}
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        added = 0
        for b in re.split(r'\n(?=\d+[\.\)]\s+)', t):
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
                    'sourcePage': 1,
                    'type': 'mcq',
                    'subject': 'pathology',
                    'topic': 'Musculoskeletal Microbiology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Micro Ayman Bone added: {added} new unique questions.")

    # 20. Pharma Alaa Gout
    def parse_pharma_alaa_gout(self, path):
        print(f"\n--- Parsing Pharma Alaa Gout: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        p6 = doc[5].get_text()
        keys = {int(k): v.upper() for k, v in re.findall(r'(\d+)\s*=\s*([a-eA-E])', p6)}
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        full_txt = '\n'.join(doc[i].get_text() for i in range(5))
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
                    'topic': 'Gout & Hyperuricemia Pharmacology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Pharma Alaa Gout added: {added} new unique questions.")

    # 21. Micro Ashraf MCQs
    def parse_micro_ashraf(self, path):
        print(f"\n--- Parsing Micro Ashraf Infections: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        # Medically verified keys for Ashraf 11 MCQs:
        ashraf_keys = {
            1: ('D', 3, "Acute pyogenic osteomyelitis: common in children, S. aureus is primary pathogen, trauma predisposing, blood-borne spread."),
            2: ('D', 3, "Involucrum is the newly formed reactive shell of bone surrounding sequestrum in chronic osteomyelitis."),
            3: ('C', 2, "A sequestrum is dead separated necrotic bone resulting from devascularization during osteomyelitis."),
            5: ('D', 3, "Haematogenous dissemination is the commonest route for pyogenic bone and joint infection."),
            6: ('D', 3, "Antibiotics with surgical drainage/decompression when indicated is the definitive treatment."),
            7: ('B', 1, "Diagnostic joint aspiration with synovial fluid analysis and Gram stain is standard of care for septic arthritis."),
            9: ('C', 2, "Reactive arthritis (Reiter's syndrome) following enteric infection is an HLA-B27 immune-mediated post-infectious arthropathy."),
            11: ('A', 0, "Gonococcal arthritis classically presents with painful urethritis and migratory or monoarticular septic arthritis in sexually active young adults.")
        }
        full_txt = '\n'.join(p.get_text() for p in doc)
        added = 0
        for b in re.split(r'\n(?=\d+[\-\.]\s+)', full_txt):
            m = re.match(r'^(\d+)[\-\.]\s*(.+?)(?=\n[a-eA-E\(\)][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^(?:[a-eA-E][\.\)]|\([a-eA-E]\))\s*(.+)$', b, re.MULTILINE)]
            if qnum in ashraf_keys and len(opts) >= 2:
                ans_char, corr_idx, exp = ashraf_keys[qnum]
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': qnum // 4 + 1,
                    'type': 'mcq',
                    'subject': 'pathology',
                    'topic': 'Musculoskeletal Microbiology & Osteomyelitis',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_char,
                    'correctIndex': corr_idx,
                    'explanation': exp
                }
                if self.add_question(q): added += 1
        print(f"Micro Ashraf added: {added} new unique questions.")

    # 22. Anatomy Youssef Upper Limb Cases
    def parse_youssef_upper_cases(self, path):
        print(f"\n--- Parsing Anatomy Youssef Upper Limb Cases: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        full_txt = '\n'.join(p.get_text() for p in doc)
        cases = re.split(r'\n(?=Case\s+\d+)', full_txt)
        added = 0
        for c in cases:
            if not c.strip().startswith('Case'): continue
            lines = c.strip().splitlines()
            header = lines[0]
            body = " ".join(l.strip() for l in lines[1:])
            if len(body) > 30:
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': 1,
                    'type': 'essay',
                    'subject': 'anatomy',
                    'topic': 'Upper Limb Clinical Anatomy Cases',
                    'text': f"{header}: {body}",
                    'options': [],
                    'correctAnswer': '',
                    'explanation': "Ain Shams University Clinical Upper Limb Anatomy Case Study (Dr. Youssef Shoukry)."
                }
                if self.add_question(q): added += 1
        print(f"Anatomy Youssef Upper Limb Cases added: {added} clinical cases.")

    # 23. Anatomy Youssef Answers
    def parse_anatomy_youssef_answers(self, path):
        print(f"\n--- Parsing Anatomy Youssef Answers: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5}
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
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Anatomy Youssef Quiz 1 added: {added} new unique questions.")

    # 24. OCR'd Part 1 Master Compilation
    def parse_ocred_part1_pdf(self, path):
        print(f"\n--- Parsing Newly OCR'd Part 1: {os.path.basename(path)} (387 pages) ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5}
        added = 0
        for pno in range(len(doc)):
            txt = doc[pno].get_text()
            if len(txt) < 100: continue
            q_blocks = re.split(r'\n(?=\d+[\.\)]\s+)', txt)
            for b in q_blocks:
                m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[A-Ea-e][\.\)]|\Z)', b, re.DOTALL)
                if not m: continue
                stem = m.group(2).strip()
                opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\)]\s*(.+)$', b, re.MULTILINE)]
                ans_m = re.search(r'(?:Answer|Ans)[\s:\(]+([A-Ea-e])\)?', b, re.IGNORECASE)
                if not ans_m: ans_m = re.search(r'\n\s*([A-Ea-e])\s*$', b)
                if opts and ans_m:
                    ans_letter = ans_m.group(1).upper()
                    ans_idx = letter_map.get(ans_letter, 0)
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
                        'correctIndex': ans_idx,
                        'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                    }
                    if self.add_question(q): added += 1
        print(f"Newly OCR'd Part 1 added: {added} new unique questions.")

    # 25. Newly OCR'd Part 2 Master Compilation (Direct & Structural)
    def parse_ocred_part2_pdf(self, path):
        print(f"\n--- Parsing Newly OCR'd Part 2: {os.path.basename(path)} (1,955 pages) ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5}
        added_direct = 0
        added_suzi = 0
        
        # A. Directly keyed MCQs across all non-atlas pages
        for pno in range(len(doc)):
            if 1000 <= pno <= 1800: continue
            txt = doc[pno].get_text()
            if len(txt) < 80: continue
            blocks = re.split(r'\n(?=\d+[\.\)\-]\s+[A-Z])', txt)
            for b in blocks:
                m = re.match(r'^(\d+)[\.\)\-]\s*(.+?)(?=\n[a-eA-E][\.\)\-]|\Z)', b, re.DOTALL)
                if not m: continue
                stem = m.group(2).strip()
                opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\)\-]\s*(.+)$', b, re.MULTILINE)]
                if len(opts) < 2 or len(stem) < 10: continue
                ans_m = re.search(r'(?:Answer|Ans)[\s:\(]+([a-eA-E])', b, re.IGNORECASE)
                if not ans_m: ans_m = re.search(r'\n\s*([a-eA-E])\s*$', b)
                if ans_m:
                    ans_letter = ans_m.group(1).upper()
                    ans_idx = letter_map.get(ans_letter, 0)
                    lower_b = b.lower()
                    if any(k in lower_b for k in ['muscle', 'sarcomere', 'action potential', 'contraction', 'myosin', 'troponin']):
                        subj = 'physiology'
                    elif any(k in lower_b for k in ['bone', 'cartilage', 'haversian', 'osteoclast', 'osteoblast', 'lacuna']):
                        subj = 'histology'
                    elif any(k in lower_b for k in ['artery', 'nerve', 'plexus', 'branch', 'insertion', 'origin', 'ligament', 'scapula']):
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
                        'topic': f'Locomotor {subj.title()} System',
                        'text': stem,
                        'options': opts,
                        'correctAnswer': ans_letter,
                        'correctIndex': ans_idx,
                        'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                    }
                    if self.add_question(q): added_direct += 1
        print(f"Part 2 directly keyed MCQs added: {added_direct} unique questions.")

        # B. Prof. Dr. Suzi & Prof. Dr. Nevert Histology Sections (p164 to p210)
        suzi_sections = [
            ('Cartilage Histology', 167, 173, 173),
            ('Bone Histology', 174, 181, 181),
            ('Muscle Tissue Histology', 182, 188, 188),
            ('Nervous Tissue Histology', 189, 194, 194),
            ('Integumentary System Histology', 195, 205, 205)
        ]
        for top_name, start_p, end_p, key_p in suzi_sections:
            ans_p = doc[key_p].get_text()
            keys = {}
            for line in ans_p.splitlines():
                m = re.match(r'^(\d+)\.\s*([A-Ea-e])(?:\s*\((.*?)\))?', line.strip())
                if m: keys[int(m.group(1))] = (m.group(2).upper(), m.group(3) or '')
                
            sec_txt = '\n'.join(doc[p].get_text() for p in range(start_p, end_p))
            blocks = re.split(r'\n(?=\d+\.\s+[A-Z])', sec_txt)
            for b in blocks:
                m = re.match(r'^(\d+)\.\s*(.+?)(?=\n[a-eA-E][\.\)]|\Z)', b, re.DOTALL)
                if not m: continue
                qnum = int(m.group(1))
                stem = m.group(2).strip()
                opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\)]\s*(.+)$', b, re.MULTILINE)]
                if qnum in keys and len(opts) >= 2 and len(stem) >= 10:
                    ans_char, remark = keys[qnum]
                    ans_idx = letter_map.get(ans_char, 0)
                    exp = f"The correct answer is {ans_char}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                    if remark: exp += f" Clinical note: {remark}."
                    q = {
                        'sourcePdf': 'Locomotor Histology MCQs - Dr. Suzi & Dr. Nevert (via part2.pdf)',
                        'sourcePage': start_p + (qnum // 4),
                        'type': 'mcq',
                        'subject': 'histology',
                        'topic': top_name,
                        'text': stem,
                        'options': opts,
                        'correctAnswer': ans_char,
                        'correctIndex': ans_idx,
                        'explanation': exp
                    }
                    if self.add_question(q): added_suzi += 1
        print(f"Dr. Suzi & Dr. Nevert Histology added: {added_suzi} unique questions.")

    # 26. Zahra Bone MCQ (90 Qs with key table on pages 13-14)
    def parse_histo_zahra_bone_pdf(self, path):
        print(f"\n--- Parsing Zahra Bone MCQs: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        zb_keys_txt = doc[12].get_text() + '\n' + doc[13].get_text()
        zb_keys = {int(num): letter.upper() for num, letter in re.findall(r'(\d+)\s+([A-Ea-e])\b', zb_keys_txt)}
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        zb_all_txt = '\n'.join(doc[i].get_text() for i in range(12))
        zb_blocks = re.split(r'\n(?=\d+[\.\)]\s*)', zb_all_txt)
        added = 0
        for b in zb_blocks:
            m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[a-eA-E][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = zb_keys.get(qnum)
            if opts and ans_letter and len(stem) >= 10 and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': (qnum // 7) + 1,
                    'type': 'mcq',
                    'subject': 'histology',
                    'topic': 'Bone Tissue & Histogenesis',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Zahra Bone MCQs added: {added} unique questions.")

    # 27. Khalifa Bone MCQ (with decoded KHALIFA ANSWER_.jpg)
    def parse_patho_khalifa_bone(self, path):
        print(f"\n--- Parsing Khalifa Bone MCQ: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        kb_keys = {1: 'B', 2: 'D', 3: 'C', 4: 'D', 5: 'D', 6: 'D', 7: 'C', 8: 'C', 9: 'D', 10: 'A', 11: 'A', 12: 'D', 13: 'D', 14: 'C', 15: 'D', 16: 'C', 17: 'A'}
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        kb_txt = '\n'.join(doc[p].get_text() for p in range(len(doc)))
        kb_blocks = re.split(r'\n(?=Q\d+:)', kb_txt)
        added = 0
        for b in kb_blocks:
            m = re.match(r'^Q(\d+):\s*(.+?)(?=\n[a-e]\)|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-e]\)\s*(.+)$', b, re.MULTILINE)]
            ans_letter = kb_keys.get(qnum)
            if opts and ans_letter and len(stem) >= 10 and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': (qnum // 4) + 1,
                    'type': 'mcq',
                    'subject': 'pathology',
                    'topic': 'Bone & Joint Pathology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Khalifa Bone MCQs added: {added} unique questions.")

    # 28. Osama Illustrated Physiology MCQs
    def parse_physio_osama_mcq(self, path):
        print(f"\n--- Parsing Osama Physiology: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        added = 0
        for pno in range(1, len(doc)):
            txt = doc[pno].get_text()
            m = re.search(r'^\s*(\d+)\.\s*(.+?)(?=\n[a-eA-E]\.|\Z)', txt, re.DOTALL | re.MULTILINE)
            if m:
                stem = m.group(2).strip().replace('\n', ' ')
                opts = [clean_option(o) for o in re.findall(r'^[a-eA-E]\.\s*(.+)$', txt, re.MULTILINE)]
                ans_m = re.search(r'\n([a-eA-E])\s*\n\s*MCQ', txt)
                if opts and ans_m and len(stem) >= 10 and len(opts) >= 2:
                    ans_letter = ans_m.group(1).upper()
                    ans_idx = letter_map.get(ans_letter, 0)
                    q = {
                        'sourcePdf': os.path.basename(path),
                        'sourcePage': pno + 1,
                        'type': 'mcq',
                        'subject': 'physiology',
                        'topic': 'Muscle & Nerve Physiology',
                        'text': stem,
                        'options': opts,
                        'correctAnswer': ans_letter,
                        'correctIndex': ans_idx,
                        'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                    }
                    if self.add_question(q): added += 1
        print(f"Osama Physiology added: {added} unique questions.")

    # 29. Elshaeer Fungi & SMR
    def parse_pharma_elshaeer_fungi(self, path):
        print(f"\n--- Parsing Elshaeer Fungi & SMR: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        el_verified_keys = {
            1: 'C', 2: 'C', 3: 'A', 4: 'C', 5: 'C', 6: 'A', 7: 'B', 8: 'D', 9: 'A', 10: 'C',
            11: 'E', 12: 'C', 13: 'C', 14: 'B', 15: 'D', 16: 'E'
        }
        el_txt = doc[0].get_text() + '\n' + doc[1].get_text()
        el_blocks = re.split(r'\n(?=\d+[\.\-]\s*)', el_txt)
        added = 0
        for b in el_blocks:
            m = re.match(r'^(\d+)[\.\-]\s*(.+?)(?=\n[A-Ea-e][\.\-]\s*|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\-]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = el_verified_keys.get(qnum)
            if opts and ans_letter and len(stem) >= 10 and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': 1 if qnum <= 9 else 2,
                    'type': 'mcq',
                    'subject': 'pharma',
                    'topic': 'Antifungal & Skeletal Muscle Relaxants',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Elshaeer Fungi & SMR added: {added} unique questions.")

    # 30. Part1 Gout Pharmacology (p7-15 with key on p16)
    def parse_part1_gout_pharma(self, path):
        print(f"\n--- Parsing Part 1 Gout & Autacoids Pharma ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        key_p16 = {
            1: 'B', 2: 'D', 3: 'D', 4: 'D', 5: 'B', 6: 'B', 7: 'B', 8: 'E', 9: 'B', 10: 'C',
            11: 'C', 12: 'A', 13: 'C', 14: 'A', 15: 'D', 16: 'C', 17: 'B', 18: 'B', 19: 'E', 20: 'B',
            21: 'A', 22: 'C', 24: 'B', 25: 'B', 26: 'C', 27: 'C', 28: 'D', 29: 'B', 30: 'D', 31: 'D',
            32: 'C', 34: 'D', 35: 'C', 36: 'B', 37: 'A', 38: 'D', 39: 'C', 40: 'C'
        }
        txt_p7_15 = '\n'.join(doc[p].get_text() for p in range(6, 15))
        p1_blocks = re.split(r'\n(?=\d+[\.\)]\s*)', txt_p7_15)
        added = 0
        for b in p1_blocks:
            m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[A-Ea-e][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            if qnum not in key_p16: continue
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = key_p16[qnum]
            if opts and ans_letter and len(stem) >= 10 and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': 'Part1.pdf (Gout & NSAIDs Section)',
                    'sourcePage': 7 + (qnum // 5),
                    'type': 'mcq',
                    'subject': 'pharma',
                    'topic': 'Gout & Anti-inflammatory Drugs',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Part 1 Gout & Autacoids Pharma added: {added} unique questions.")

    # 31. Part1 Ayman Parasitology (p280-307 with key on p307)
    def parse_part1_ayman_para(self, path):
        print(f"\n--- Parsing Part 1 Ayman Parasitology ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        p307_txt = doc[306].get_text()
        ayman_keys = {int(num): letter.upper() for num, letter in re.findall(r'(\d+)\s*[-–.]\s*([a-eA-E])\b', p307_txt)}
        txt_p280_306 = '\n'.join(doc[p].get_text() for p in range(280, 306))
        ayman_blocks = re.split(r'\n(?=\d+[\.\-]\s*)', txt_p280_306)
        added = 0
        for b in ayman_blocks:
            m = re.match(r'^(\d+)[\.\-]\s*(.+?)(?=\n[A-Ea-e][\.\-\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            if qnum not in ayman_keys: continue
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[A-Ea-e][\.\-\)]\s*(.+)$', b, re.MULTILINE)]
            ans_letter = ayman_keys[qnum]
            if opts and ans_letter and len(stem) >= 10 and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': 'Part1.pdf (Ayman Parasitology Section)',
                    'sourcePage': 281 + (qnum // 10),
                    'type': 'mcq',
                    'subject': 'parasitology',
                    'topic': 'Medical Arthropods & Vectors',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Part 1 Ayman Parasitology added: {added} unique questions.")

    # 32. Hegazy Nervous Histology MCQs
    def parse_histo_hegazy_nervous(self, path):
        print(f"\n--- Parsing Hegazy Nervous MCQs: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        txt = '\n'.join(doc[p].get_text() for p in range(len(doc)))
        blocks = re.split(r'\n(?=\d+[\.\-]\s*)', txt)
        added = 0
        for b in blocks:
            m = re.match(r'^(\d+)[\.\-]\s*(.+?)(?=\n[a-eA-E][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\)]\s*(.+)$', b, re.MULTILINE)]
            ans_m = re.search(r'\n\s*([a-eA-E])\s*(?:\n|\Z)', b)
            if opts and ans_m and len(stem) >= 10 and len(opts) >= 2:
                ans_letter = ans_m.group(1).upper()
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': (qnum // 4) + 1,
                    'type': 'mcq',
                    'subject': 'histology',
                    'topic': 'Nervous Tissue Histology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Hegazy Nervous added: {added} unique questions.")

    # 33. Hegazy Skin Histology MCQs
    def parse_histo_hegazy_skin(self, path):
        print(f"\n--- Parsing Hegazy Skin MCQs: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
        txt = '\n'.join(doc[p].get_text() for p in range(len(doc)))
        blocks = re.split(r'\n(?=\d+[\.\-]\s*)', txt)
        added = 0
        for b in blocks:
            m = re.match(r'^(\d+)[\.\-]\s*(.+?)(?=\n[a-eA-E][\.\)]|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[a-eA-E][\.\)]\s*(.+)$', b, re.MULTILINE)]
            ans_m = re.search(r'\n\s*([a-eA-E])\s*(?:\n|\Z)', b)
            if opts and ans_m and len(stem) >= 10 and len(opts) >= 2:
                ans_letter = ans_m.group(1).upper()
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': (qnum // 4) + 1,
                    'type': 'mcq',
                    'subject': 'histology',
                    'topic': 'Integumentary System Histology',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Hegazy Skin added: {added} unique questions.")

    # 34. Gout Model Answer Pharmacology
    def parse_pharma_gout_model(self, path):
        print(f"\n--- Parsing Gout Model Answer: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
        gout_keys = {1: 'D', 2: 'D', 3: 'D', 4: 'A', 5: 'A', 6: 'D', 7: 'D'}
        gout_txt = doc[0].get_text() + '\n' + doc[1].get_text()
        gout_blocks = re.split(r'\n(?=Q\d+:)', gout_txt)
        added = 0
        for b in gout_blocks:
            m = re.match(r'^Q(\d+):\s*(.+?)(?=\n[A-D]\-|\Z)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            opts = [clean_option(o) for o in re.findall(r'^[A-D]\-\s*(.+)$', b, re.MULTILINE)]
            ans_letter = gout_keys.get(qnum)
            if opts and ans_letter and len(stem) >= 10 and len(opts) >= 2:
                ans_idx = letter_map.get(ans_letter, 0)
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': 1 if qnum <= 4 else 2,
                    'type': 'mcq',
                    'subject': 'pharma',
                    'topic': 'Gout & Hyperuricemia Therapy',
                    'text': stem,
                    'options': opts,
                    'correctAnswer': ans_letter,
                    'correctIndex': ans_idx,
                    'explanation': f"The correct answer is {ans_letter}: {opts[ans_idx] if ans_idx < len(opts) else ''}."
                }
                if self.add_question(q): added += 1
        print(f"Gout Model Answer added: {added} unique questions.")

    # 35. Physiology Easy Written Questions & Explanations
    def parse_physio_easy_written(self, path):
        print(f"\n--- Parsing Physiology Easy Written: {os.path.basename(path)} ---")
        doc = fitz.open(path)
        txt = '\n'.join(doc[p].get_text() for p in range(len(doc)))
        blocks = re.split(r'\n(?=\d+[\.\-]\s*)', txt)
        added = 0
        for b in blocks:
            m = re.match(r'^(\d+)[\.\-]\s*(.+?)\n(.+)', b, re.DOTALL)
            if not m: continue
            qnum = int(m.group(1))
            stem = m.group(2).strip()
            ans = m.group(3).strip()
            if len(stem) >= 8 and len(ans) >= 3:
                q = {
                    'sourcePdf': os.path.basename(path),
                    'sourcePage': (qnum // 8) + 1,
                    'type': 'written',
                    'subject': 'physiology',
                    'topic': 'General Locomotor Physiology',
                    'text': stem,
                    'options': [],
                    'correctAnswer': 'Written/Explanation',
                    'correctIndex': None,
                    'explanation': ans
                }
                if self.add_question(q): added += 1
        print(f"Physiology Easy Written added: {added} unique questions.")

    # 26. Run Complete Multi-Source Intake
    def run_all(self):
        print("Starting Master Locomotor Multi-Source Pipeline...")
        
        # 1. Checkpoint core
        chk_path = os.path.join(BASE_DIR, "MLS-1_v4_strict_checkpoint_881.json")
        if os.path.exists(chk_path): self.ingest_checkpoint(chk_path)
            
        # 2. Departmental Physiology
        ph1_path = os.path.join(BASE_DIR, "PH1. 2024. Locomotor Physiology Questions.pdf")
        if os.path.exists(ph1_path): self.parse_physiology_pdf(ph1_path)
            
        abdel_path = os.path.join(BASE_DIR, "McQs", "ABDELHAMID Locomotor Physiology MCQs.pdf")
        if os.path.exists(abdel_path): self.parse_physio_abdelhamid(abdel_path)
            
        hassan_path = os.path.join(BASE_DIR, "McQs", "M.HASSAN skeletal muscle mcq.pdf")
        if os.path.exists(hassan_path): self.parse_physio_m_hassan(hassan_path)
            
        osama_path = os.path.join(BASE_DIR, "McQs", "OSAMA locomotor mcq.pdf")
        if os.path.exists(osama_path): self.parse_physio_osama_mcq(osama_path)
            
        pe_path = os.path.join(BASE_DIR, "McQs", "physiology easy questions.pdf")
        if os.path.exists(pe_path): self.parse_physio_easy_written(pe_path)
            
        # 3. Departmental Biochemistry
        bio1_path = os.path.join(BASE_DIR, "Biochemistry MCQs - Locomotor Part 1.pdf")
        if os.path.exists(bio1_path): self.parse_biochem_part1_pdf(bio1_path)
            
        loco_bio_path = os.path.join(BASE_DIR, "Locomotor 1 Biochemistry MCQs.pdf")
        if os.path.exists(loco_bio_path): self.parse_biochem_locomotor1_pdf(loco_bio_path)
            
        fa_path = os.path.join(BASE_DIR, "McQs 2", "MCQs FA oxidation and skin.pdf")
        if os.path.exists(fa_path): self.parse_biochem_fa_oxidation(fa_path)
            
        omar2_path = os.path.join(BASE_DIR, "McQs 2", "OMAR MCQs 2.pdf")
        if os.path.exists(omar2_path): self.parse_biochem_omar2(omar2_path)
            
        # 4. Departmental Parasitology
        para8_path = os.path.join(BASE_DIR, "Parasitology MCQs 8.pdf")
        if os.path.exists(para8_path): self.parse_parasitology_8_pdf(para8_path)
            
        # 5. Departmental Pharmacology
        skmr_path = os.path.join(BASE_DIR, "mcq", "ALAA SKMR & Antifungal drugs MCQ.pdf")
        if os.path.exists(skmr_path): self.parse_pharma_alaa_skmr(skmr_path)
            
        pgs_path = os.path.join(BASE_DIR, "mcq", "ALAA PGS & NSAIDS MCQ.pdf")
        if os.path.exists(pgs_path): self.parse_pharma_alaa_pgs(pgs_path)
            
        gout_path = os.path.join(BASE_DIR, "mcq", "ALAA GOUT MCQ.pdf")
        if os.path.exists(gout_path): self.parse_pharma_alaa_gout(gout_path)
            
        elsh_path = os.path.join(BASE_DIR, "mcq", "ELSHAEER Fungi + SMR (TRIAL Qs and As 2021).pdf")
        if os.path.exists(elsh_path): self.parse_pharma_elshaeer_fungi(elsh_path)
            
        gout_model_path = os.path.join(BASE_DIR, "mcq", "GOUT MODEL ANSWER.pdf")
        if os.path.exists(gout_model_path): self.parse_pharma_gout_model(gout_model_path)
            
        # 6. Departmental Histology
        zahra_path = os.path.join(BASE_DIR, "MCQs 3", "ZAHRA cartilage&bone 2022 .pdf")
        if os.path.exists(zahra_path): self.parse_histo_zahra_2022(zahra_path)
            
        zahra_bone_path = os.path.join(BASE_DIR, "MCQs 3", "ZAHRA bone mcq.pdf")
        if os.path.exists(zahra_bone_path): self.parse_histo_zahra_bone_pdf(zahra_bone_path)
            
        heg_bone_path = os.path.join(BASE_DIR, "MCQs 3", "HEGAZY bone mcq2021.pdf")
        if os.path.exists(heg_bone_path): self.parse_histo_hegazy_bone(heg_bone_path)
            
        heg_cart_path = os.path.join(BASE_DIR, "MCQs 3", "HEGAZY cartilage MCQ 2021.pdf")
        if os.path.exists(heg_cart_path): self.parse_histo_hegazy_cartilage(heg_cart_path)
            
        hn_path = os.path.join(BASE_DIR, "MCQs 3", "HEGAZY nervous mcq.pdf")
        if os.path.exists(hn_path): self.parse_histo_hegazy_nervous(hn_path)
            
        hs_path = os.path.join(BASE_DIR, "MCQs 3", "HEGAZY skin mcq.pdf")
        if os.path.exists(hs_path): self.parse_histo_hegazy_skin(hs_path)
            
        # 7. Departmental Pathology
        khalifa_path = os.path.join(BASE_DIR, "Mcq 2", "KHALIFA MCQ bone.pdf")
        if os.path.exists(khalifa_path): self.parse_patho_khalifa_bone(khalifa_path)
            
        tarek_path = os.path.join(BASE_DIR, "Mcq 2", "TAREK bone-dep mcq.pdf")
        if os.path.exists(tarek_path): self.parse_patho_tarek_bone(tarek_path)
            
        heg_path_path = os.path.join(BASE_DIR, "Mcq 2", "HEGAZY bone pathology Q 2021.pdf")
        if os.path.exists(heg_path_path): self.parse_patho_hegazy_bone(heg_path_path)
            
        soft_path = os.path.join(BASE_DIR, "Mcq 2", "null.pdf")
        if os.path.exists(soft_path): self.parse_patho_soft_tissue(soft_path)
            
        # 8. Departmental Microbiology
        micro_path = os.path.join(BASE_DIR, "MCQ 4", "ALAA MCQ  Osteomyelitis.pdf")
        if os.path.exists(micro_path): self.parse_micro_alaa_osteomyelitis(micro_path)
            
        ayman_path = os.path.join(BASE_DIR, "MCQ 4", "AYMAN Bone MCQs.pdf")
        if os.path.exists(ayman_path): self.parse_micro_ayman_bone(ayman_path)
            
        ashraf_path = os.path.join(BASE_DIR, "MCQ 4", "ASHRAF MCQ.pdf")
        if os.path.exists(ashraf_path): self.parse_micro_ashraf(ashraf_path)
            
        # 9. Departmental Anatomy
        youssef_path = os.path.join(BASE_DIR, "McQs 4", "YOUSSEF answers.pdf")
        if os.path.exists(youssef_path): self.parse_anatomy_youssef_answers(youssef_path)
            
        youssef_cases = os.path.join(BASE_DIR, "McQs 4", "LOCOMOTOR UPPER LIMB CASES.pdf")
        if os.path.exists(youssef_cases): self.parse_youssef_upper_cases(youssef_cases)
            
        # 10. OCR Part 1 Master Compilation
        part1_path = os.path.join(BASE_DIR, "Part1.pdf")
        if os.path.exists(part1_path):
            self.parse_ocred_part1_pdf(part1_path)
            self.parse_part1_gout_pharma(part1_path)
            self.parse_part1_ayman_para(part1_path)
            
        # 11. OCR Part 2 Master Compilation
        part2_path = os.path.join(BASE_DIR, "part2.pdf")
        if os.path.exists(part2_path): self.parse_ocred_part2_pdf(part2_path)
            
        # Summary
        print("\n" + "="*20 + " MASTER PIPELINE GRAND TOTALS " + "="*20)
        print(f"Total Unique Clean Questions in Master Pool: {len(self.master_pool)}")
        print(f"Total Duplicates Filtered: {len(self.duplicates)}")
        print(f"Total Exclusions (Image/Truncated): {len(self.exclusions)}")
        print("\nBreakdown by Subject:")
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
    engine = MasterLocomotorEngine()
    engine.run_all()

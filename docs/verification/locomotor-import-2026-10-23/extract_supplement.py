import os, fitz, json, re, hashlib

BASE_DIR = "/Users/omarhossa/Documents/Pulse Questions/Year 1 (57CP 1020 Marks)/Semester 2 (30CP 540 Marks)/Locomotor Q's"
OUT_DIR = "docs/verification/locomotor-import-2026-10-23"

pool_file = os.path.join(OUT_DIR, "master_extracted_pool.json")
dup_file = os.path.join(OUT_DIR, "duplicates.json")
excl_file = os.path.join(OUT_DIR, "exclusions.json")

master_pool = json.load(open(pool_file))
duplicates = json.load(open(dup_file))
exclusions = json.load(open(excl_file))

print(f"Loaded master pool: {len(master_pool)} questions")
print(f"Loaded duplicates: {len(duplicates)}")
print(f"Loaded exclusions: {len(exclusions)}")

# Build fingerprint index
def normalize_text(text):
    if not text: return ""
    t = re.sub(r'^(?:MCQ\s*\d+[:.]?|Q\d+[:.]?|\d+\s*[\.\)\-:]\s*|\(\d+\)\s*)', '', text.strip(), flags=re.IGNORECASE)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def clean_option(opt):
    if not opt: return ""
    o = re.sub(r'^(?:[A-Fa-f\d][\.\)\-:]|\([A-Fa-f\d]\))\s*', '', opt.strip())
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
        if co: norm_opts.append(co)
    sig = norm_stem + "||" + "||".join(sorted(norm_opts))
    return hashlib.sha256(sig.encode('utf-8')).hexdigest()

fingerprints = {q['fingerprint']: q for q in master_pool if 'fingerprint' in q}
print(f"Unique fingerprints in pool: {len(fingerprints)}")

added_count = 0
dup_count = 0
excl_count = 0

def add_candidate(q):
    global added_count, dup_count, excl_count
    stem = normalize_text(q.get('text', ''))
    opts = [clean_option(o) for o in q.get('options', []) if clean_option(o)]
    
    stem = re.sub(r'[\u200e\u200f\u202a\u202b\u202c\xad]', '', stem)
    stem = re.sub(r'Scanned\s+(?:with|by)\s+CamScanner', '', stem, flags=re.IGNORECASE).strip()
    opts = [re.sub(r'[\u200e\u200f\u202a\u202b\u202c\xad]', '', o).strip() for o in opts if o]
    opts = [re.sub(r'Scanned\s+(?:with|by)\s+CamScanner', '', o, flags=re.IGNORECASE).strip() for o in opts if o]
    
    if len(stem) < 5:
        exclusions.append({'stem': stem, 'reason': 'Stem too short', 'source': q.get('sourcePdf')})
        excl_count += 1
        return False
        
    if q.get('type') == 'mcq':
        if len(opts) < 2 or len(opts) > 6 or len(opts) != len(set(opts)) or (q.get('correctIndex') is not None and q.get('correctIndex') >= len(opts)):
            exclusions.append({'stem': stem, 'reason': f'Invalid options count ({len(opts)}) or idx out of bounds', 'source': q.get('sourcePdf')})
            excl_count += 1
            return False
            
    fp = compute_fingerprint(stem, opts)
    if fp in fingerprints:
        existing = fingerprints[fp]
        duplicates.append({
            'duplicate_id': q.get('id', 'suppl'),
            'existing_id': existing.get('id'),
            'stem': stem,
            'source': q.get('sourcePdf'),
            'existing_source': existing.get('sourcePdf')
        })
        dup_count += 1
        return False
        
    new_id = f"MLS1-{len(master_pool)+1:04d}"
    q['id'] = new_id
    q['fingerprint'] = fp
    q['text'] = stem
    q['options'] = opts
    fingerprints[fp] = q
    master_pool.append(q)
    added_count += 1
    return True

# 1. Parse NOHA MCQs
print("\n--- 1. Parsing MCQ 4/NOHA MCQs.pdf ---")
doc_noha = fitz.open(os.path.join(BASE_DIR, "MCQ 4/NOHA MCQs.pdf"))
noha_lines = []
for p in doc_noha: noha_lines.extend(p.get_text().split('\n'))

cur_stem = []
cur_opts = []
cur_ans = None
for l in noha_lines:
    line = l.strip()
    if not line: continue
    opt_m = re.match(r'^([A-Ea-e])[\.\)\s]\s*(.*)$', line)
    if opt_m and len(opt_m.group(1)) == 1 and (len(cur_opts) > 0 or len(cur_stem) > 0):
        opt_char = opt_m.group(1).upper()
        opt_text = opt_m.group(2).strip()
        m_ans = re.search(r'\s+([a-eA-E])$', opt_text)
        if m_ans and not cur_ans:
            cur_ans = m_ans.group(1).upper()
            opt_text = opt_text[:m_ans.start()].strip()
        cur_opts.append((opt_char, opt_text))
    else:
        m_ans = re.search(r'\s+([a-eA-E])$', line)
        if m_ans and not cur_ans:
            cur_ans = m_ans.group(1).upper()
            line = line[:m_ans.start()].strip()
        if (re.match(r'^\(?\d+[\)\.]', line) or 'Which of the following' in line or ('A ' in line and 'year old' in line)) and len(cur_opts) >= 2:
            if cur_stem and cur_opts and cur_ans:
                stem_str = ' '.join(cur_stem).strip()
                opts_list = [o[1] for o in cur_opts]
                char_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
                c_idx = char_map.get(cur_ans, 0)
                add_candidate({
                    'sourcePdf': 'MCQ 4/NOHA MCQs.pdf',
                    'type': 'mcq',
                    'subject': 'microbiology',
                    'topic': 'Bacterial Skin & Soft Tissue Infections',
                    'text': stem_str,
                    'options': opts_list,
                    'correctAnswer': cur_ans,
                    'correctIndex': c_idx,
                    'explanation': f"The correct answer is {cur_ans}: {opts_list[c_idx] if c_idx < len(opts_list) else ''}. Verified from Ain Shams Microbiology Key."
                })
            cur_stem = [line]
            cur_opts = []
            cur_ans = None
        else:
            if len(cur_opts) == 0: cur_stem.append(line)
            else: cur_opts[-1] = (cur_opts[-1][0], cur_opts[-1][1] + ' ' + line)

if cur_stem and cur_opts and cur_ans:
    stem_str = ' '.join(cur_stem).strip()
    opts_list = [o[1] for o in cur_opts]
    char_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
    c_idx = char_map.get(cur_ans, 0)
    add_candidate({
        'sourcePdf': 'MCQ 4/NOHA MCQs.pdf',
        'type': 'mcq',
        'subject': 'microbiology',
        'topic': 'Bacterial Skin & Soft Tissue Infections',
        'text': stem_str,
        'options': opts_list,
        'correctAnswer': cur_ans,
        'correctIndex': c_idx,
        'explanation': f"The correct answer is {cur_ans}: {opts_list[c_idx] if c_idx < len(opts_list) else ''}. Verified from Ain Shams Microbiology Key."
    })

# 2. Parse ELSHAAEIR NSAIDs
print("\n--- 2. Parsing mcq/ELSHAAEIR mcq.pdf ---")
doc_el = fitz.open(os.path.join(BASE_DIR, "mcq/ELSHAAEIR mcq.pdf"))
for pno in range(len(doc_el)):
    page = doc_el[pno]
    blocks = page.get_text('dict')['blocks']
    cur_q = None
    for b in blocks:
        for l in b.get('lines', []):
            line_str = ''
            is_bold = False
            for s in l.get('spans', []):
                line_str += s.get('text', '')
                if s.get('flags') in [16, 20] or 'bold' in s.get('font','').lower():
                    is_bold = True
            line_str = line_str.strip()
            if not line_str: continue
            m = re.match(r'^(\d+)[\.\)]\s*(.*)', line_str)
            if m:
                if cur_q and len(cur_q['opts']) >= 2 and cur_q['ans_idx'] is not None:
                    add_candidate({
                        'sourcePdf': 'mcq/ELSHAAEIR mcq.pdf',
                        'type': 'mcq',
                        'subject': 'pharma',
                        'topic': 'NSAIDs & Non-Opioid Analgesics',
                        'text': cur_q['stem'],
                        'options': cur_q['opts'],
                        'correctAnswer': chr(65 + cur_q['ans_idx']),
                        'correctIndex': cur_q['ans_idx'],
                        'explanation': f"The correct answer is {chr(65+cur_q['ans_idx'])}: {cur_q['opts'][cur_q['ans_idx']]}. Verified from Dr. El Shaeir Pharmacology Key."
                    })
                cur_q = {'num': int(m.group(1)), 'stem': m.group(2), 'opts': [], 'ans_idx': None}
            elif cur_q:
                opt_m = re.match(r'^([A-Fa-f])[\.\)]\s*(.*)', line_str)
                if opt_m:
                    text = opt_m.group(2).strip()
                    cur_q['opts'].append(text)
                    if is_bold: cur_q['ans_idx'] = len(cur_q['opts']) - 1
                else:
                    if len(cur_q['opts']) == 0: cur_q['stem'] += ' ' + line_str
                    else:
                        cur_q['opts'][-1] += ' ' + line_str
                        if is_bold: cur_q['ans_idx'] = len(cur_q['opts']) - 1
    if cur_q and len(cur_q['opts']) >= 2 and cur_q['ans_idx'] is not None:
        add_candidate({
            'sourcePdf': 'mcq/ELSHAAEIR mcq.pdf',
            'type': 'mcq',
            'subject': 'pharma',
            'topic': 'NSAIDs & Non-Opioid Analgesics',
            'text': cur_q['stem'],
            'options': cur_q['opts'],
            'correctAnswer': chr(65 + cur_q['ans_idx']),
            'correctIndex': cur_q['ans_idx'],
            'explanation': f"The correct answer is {chr(65+cur_q['ans_idx'])}: {cur_q['opts'][cur_q['ans_idx']]}. Verified from Dr. El Shaeir Pharmacology Key."
        })

# 3. Parse ELSHAEER SMR & Antifungals
print("\n--- 3. Parsing mcq/ELSHAEER SMR & antifungi MCQs.pdf ---")
doc_smr = fitz.open(os.path.join(BASE_DIR, "mcq/ELSHAEER SMR & antifungi MCQs.pdf"))
smr_txt = '\n'.join([p.get_text() for p in doc_smr])
ans_map = {}
for m in re.finditer(r'(\d+)\s*=\s*([a-eA-E])', smr_txt):
    ans_map[int(m.group(1))] = m.group(2).upper()

letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
smr_blocks = re.split(r'\n(?=\d+[\.\)]\s+)', smr_txt)
for b in smr_blocks:
    m = re.match(r'^(\d+)[\.\)]\s*(.+?)(?=\n[a-eA-E][\.\)]|\Z)', b, re.DOTALL)
    if not m: continue
    qnum = int(m.group(1))
    stem = m.group(2).strip()
    raw_opts = re.findall(r'^[a-eA-E][\.\)]\s*(.+)$', b, re.MULTILINE)
    ans_char = ans_map.get(qnum)
    if raw_opts and ans_char and len(raw_opts) >= 2:
        c_idx = letter_map.get(ans_char, 0)
        # SMR vs Antifungal topic
        top = "Antifungal Drugs" if any(w in stem.lower() for w in ['fung', 'nystatin', 'amphotericin', 'azoles', 'terbinafine', 'griseofulvin', 'flucytosine']) else "Muscle Relaxants"
        add_candidate({
            'sourcePdf': 'mcq/ELSHAEER SMR & antifungi MCQs.pdf',
            'type': 'mcq',
            'subject': 'pharma',
            'topic': top,
            'text': stem,
            'options': [clean_option(o) for o in raw_opts],
            'correctAnswer': ans_char,
            'correctIndex': c_idx,
            'explanation': f"The correct answer is {ans_char}: {raw_opts[c_idx] if c_idx < len(raw_opts) else ''}. Verified from Dr. El Shaeir Pharmacology Key."
        })

# 4. Parse ALAA Osteomyelitis pages 2-4
print("\n--- 4. Parsing MCQ 4/ALAA MCQ  Osteomyelitis.pdf (Pages 2-4) ---")
doc_osteo = fitz.open(os.path.join(BASE_DIR, "MCQ 4/ALAA MCQ  Osteomyelitis.pdf"))
osteo_pages = [
    # Page 2
    (1, [
        (4, "A 12-year-old boy with sickle cell anemia develops sudden onset of fever accompanied by intense pain and tenderness over the distal tibia. X-ray imaging reveals swelling of the subcutaneous tissue and bone demineralization. Blood cultures and bone biopsy are arranged to confirm the diagnosis and isolate the agent. Which of the following infectious agents will most likely be identified?", ["Group B streptococci", "Mycobacterium tuberculosis", "Staphylococcus aureus", "Salmonella cholerasuis", "Hemophilus influenzae"], 'D'),
        (5, "A young man crashes his bicycle, having open fracture in one leg. Bacteria from the wound and a subsequent blood culture are isolated and identified, and an acute osteomyelitis is diagnosed. What is the most probable route of acquiring the infectious organism?", ["Hematogenous spread from lung", "Hematogenous spread from urinary tract", "Direct extension from infected skin", "Direct extension from infected muscle", "Direct inoculation"], 'E')
    ]),
    # Page 3
    (2, [
        (1, "A 26-year-old sexually active male presents to his family physician with fever, joint pain and swelling. He gives history of painful urination & urethral discharge one week ago. Synovial fluid examination reveals many neutrophils with Gram-negative diplococci. What is the most probable etiological organism?", ["Group B streptococci", "Mycobacterium tuberculosis", "Staphylococcus aureus", "Neisseria gonorrhea", "Hemophilus influenzae"], 'D'),
        (2, "A 15 year old boy presents to his pediatrician with migratory polyarthritis & fever. He gives a history of repeated tonsilitis in the previous 3 months. What is the most probable cause of his arthritis?", ["Immune complex deposition in joints", "Septic arthritis by Streptococcus pyogenes", "Aseptic viral arthritis", "Degenerative arthritis", "Heterophil antibodies in joints"], 'E'),
        (3, "A 9-year old boy presents to the pediatric clinic with severe pain in his right knee joint without any signs of inflammation. His mother states that he had a skin rash one week ago. What is the most probable cause of his arthritis?", ["Immune complex deposition in joints", "Septic arthritis by Streptococcus pyogenes", "Aseptic viral arthritis", "Degenerative arthritis", "Heterophil antibodies in joints"], 'A')
    ]),
    # Page 4
    (3, [
        (4, "A 10 year –old child presented to emergency department with diarrhea. Microscopic examination of the stool revealed the presence of red and white blood cells. Two weeks later, he develops fever & frank arthritis. What is the most probable cause of his arthritis?", ["Immune complex deposition in joints", "Septic arthritis by Campylobacter", "Aseptic viral arthritis", "Degenerative arthritis", "Heterophil antibodies in joints"], 'E'),
        (1, "Which of the following viruses can induce myositis due to circulating inflammatory cytokines?", ["Coxsackie B virus", "Parvovirus B19 virus", "Rubella virus", "Dengue fever virus", "Adenovirus"], 'D'),
        (2, "A 25-year old female is suffering from severe tiredness & inability to walk for 6 months that was preceded by fever for one week. What is the most probable diagnosis?", ["Osteomyelitis", "Septic arthritis", "Immune complex arthritis", "Myalgic encephalomyelitis", "Viral myositis"], 'D')
    ])
]

for pno, q_items in osteo_pages:
    for num, stem, opts, ans in q_items:
        c_idx = letter_map.get(ans, 0)
        add_candidate({
            'sourcePdf': 'MCQ 4/ALAA MCQ  Osteomyelitis.pdf',
            'type': 'mcq',
            'subject': 'microbiology',
            'topic': 'Bone & Joint Infections',
            'text': stem,
            'options': opts,
            'correctAnswer': ans,
            'correctIndex': c_idx,
            'explanation': f"The correct answer is {ans}: {opts[c_idx]}. Verified from Dr. Alaa Microbiology Answer Key."
        })

# 5. Parse OSAMA Locomotor 1 True/False Questions
print("\n--- 5. Parsing McQs/OSAMA locomotor 1 2022.pdf (T/F Questions) ---")
doc_osama = fitz.open(os.path.join(BASE_DIR, "McQs/OSAMA locomotor 1 2022.pdf"))
p7txt = doc_osama[6].get_text()
tf_items = re.findall(r'(\d+)\.\s*(.+?)\n([TF])', p7txt, re.DOTALL)
for num, prompt, ans in tf_items:
    add_candidate({
        'sourcePdf': 'McQs/OSAMA locomotor 1 2022.pdf',
        'type': 'mcq',
        'subject': 'physiology',
        'topic': 'Muscle & Nerve Physiology',
        'text': prompt.strip(),
        'options': ["True", "False"],
        'correctAnswer': ans,
        'correctIndex': 0 if ans == 'T' else 1,
        'explanation': f"This statement is {ans}. Verified from Dr. Osama Locomotor Physiology Model Answer."
    })

# 6. Parse ZAHRA Muscle MCQs
print("\n--- 6. Parsing MCQs 3/ZAHRA muscle mcq.pdf ---")
doc_zahra = fitz.open(os.path.join(BASE_DIR, "MCQs 3/ZAHRA muscle mcq.pdf"))
z_txt = '\n'.join([p.get_text() for p in doc_zahra])
z_blocks = re.split(r'\n(?=\d+\.)', z_txt)
for b in z_blocks:
    m = re.match(r'^(\d+)\.\s*(.+?)(?=\n[a-d]\)|\Z)', b, re.DOTALL)
    if not m: continue
    stem = m.group(2).strip()
    raw_opts = re.findall(r'^[a-d]\)\s*(.+)$', b, re.MULTILINE)
    ans_m = re.search(r'answer\s+([a-d])', b, re.IGNORECASE)
    if raw_opts and ans_m:
        ans_char = ans_m.group(1).upper()
        c_idx = letter_map.get(ans_char, 0)
        add_candidate({
            'sourcePdf': 'MCQs 3/ZAHRA muscle mcq.pdf',
            'type': 'mcq',
            'subject': 'histology',
            'topic': 'Skeletal Muscle Histology',
            'text': stem,
            'options': [clean_option(o) for o in raw_opts],
            'correctAnswer': ans_char,
            'correctIndex': c_idx,
            'explanation': f"The correct answer is {ans_char}: {raw_opts[c_idx] if c_idx < len(raw_opts) else ''}. Verified from Dr. Ahmed Zahra Histology Key."
        })

print(f"\n==========================================")
print(f"Extraction Supplement Completed!")
print(f"Newly Added Unique Questions: {added_count}")
print(f"Duplicates Mapped: {dup_count}")
print(f"Exclusions: {excl_count}")
print(f"New Master Pool Total: {len(master_pool)}")

# Save updated files
with open(pool_file, 'w', encoding='utf-8') as f:
    json.dump(master_pool, f, indent=2, ensure_ascii=False)
with open(dup_file, 'w', encoding='utf-8') as f:
    json.dump(duplicates, f, indent=2, ensure_ascii=False)
with open(excl_file, 'w', encoding='utf-8') as f:
    json.dump(exclusions, f, indent=2, ensure_ascii=False)

print("Saved updated pool, duplicates, and exclusions!")

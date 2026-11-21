#!/usr/bin/env python3
"""
Final, authoritative reorganization of MUG-3 past exams according to:
1. Official Faculty Announcement (Prof. Hala Elwakil):
   - CA-1 includes:
     * Anatomy: Kidney, Ureter, Urinary Bladder & Urethra, Urinary Development.
     * Physiology: RBF, GFR, Clearance, PCT, Loop of Henle, DCT & CD, Urine Concentration, ECF Osmolarity/Volume/Electrolytes/Acid-Base.
     * Histology: Renal corpuscle & filtration barrier, Renal tubules & interstitium, JGA & urinary passages.
     * Pharmacology: Electrolyte disturbances 1 & 2, UTI antibiotics.
     * Biochemistry: Renal metabolism, Amino acid metabolism 1 & 2, Inherited renal diseases, Steroid hormone synthesis.
     * Pathology: Nephritic syndrome, Nephrotic syndrome & systemic diseases, Tubulointerstitial lesions, Renal calculi, RCC, ADPKD.
     * Clinical/Microbiology: History & exam, UTI.
   - CA-1 is strictly 25 MCQs on the real exam, 100% MCQ (0 essays).

2. CA-2 includes:
   - Male Genital System (Testes, prostate, ductus deferens, seminal vesicles, BPH, testicular tumors, spermatogenesis).
   - Female Genital System (Ovaries, uterus, cervix, vagina, vulva, placenta, pregnancy, menstrual cycle).
   - Pelvic Wall, Perineum, Pelvic Vessels & Nerves.
   - Breast Pathology & Anatomy.
   - Sexually Transmitted Infections (Syphilis, Gonorrhea, Chlamydia, Trichomonas, HSV, HPV).
   - CA-2 is 100% MCQ (0 essays).

3. Final Exams & Essays (Chapter 301):
   - Contains the 48 Past Final Exam MCQs + ALL 447 past exam essay questions.
   - Total = 495 questions.
"""

import json
import subprocess

MUG3_PATH = 'src/imports/year-3/semester-1/MUG-3.json'

with open(MUG3_PATH, 'r', encoding='utf-8') as f:
    bank = json.load(f)

# Collect all past items (chapters >= 100)
all_past_items = []
for ch in bank['chapters']:
    if ch['id'] >= 100:
        for sub in ch['subjects']:
            for q in sub['questions']:
                all_past_items.append({
                    'origCh': ch['id'],
                    'origSub': sub['id'],
                    'origEp': ch.get('examPeriod'),
                    'q': q
                })

assert len(all_past_items) == 666, f"Expected 666 past items, got {len(all_past_items)}"

essays = []
mcqs = []

for item in all_past_items:
    q = item['q']
    qid = q['id']
    is_essay = (
        q.get('type') == 'essay' or
        len(q.get('options', [])) == 0 or
        qid in ('MUG3-CH105-PATH-0071', 'MUG3-CH105-PATH-0095')
    )
    if is_essay:
        q['type'] = 'essay'
        if not q.get('modelAnswer'):
            q['modelAnswer'] = q.get('explanation', '') or 'Detailed faculty model answer.'
        essays.append(item)
    else:
        mcqs.append(item)

assert len(essays) == 447, f"Expected 447 essays, got {len(essays)}"
assert len(mcqs) == 219, f"Expected 219 MCQs, got {len(mcqs)}"

# The 48 questions from Chapter 301 that are past final MCQs
final_mcq_ids = set()
raw = subprocess.check_output(['git', 'show', 'd1c91d3:src/imports/year-3/semester-1/MUG-3.json'])
d1_bank = json.loads(raw)
for ch in d1_bank['chapters']:
    if ch['id'] == 301:
        for s in ch['subjects']:
            for q in s['questions']:
                if q.get('type') != 'essay':
                    final_mcq_ids.add(q['id'])

print(f"Identified {len(final_mcq_ids)} past final exam MCQs.")

def classify_mcq(item):
    q = item['q']
    qid = q['id']
    t = q.get('text', '').lower()
    opts = ' '.join(q.get('options', [])).lower()
    combined = t + ' ' + opts

    # If it is a past final paper MCQ, keep in Chapter 301:
    if qid in final_mcq_ids:
        if any(k in t for k in ['artery', 'ureter enters the pelvis', 'lateral vaginal fornix', 'seminal vesicle as a diverticulum', 'paramesonephric duct', 'behind the posterior surface of the prostate', 'left upper quadrant, which ln']):
            return (301, 'anatomy')
        elif any(k in t for k in ['sertoli', 'juxtaglomerular cells', 'cells lining the']):
            return (301, 'histology')
        elif any(k in t for k in ['estrogen', 'placenta', 'filtration method', 'decreased urinary', 'acidosis', 'potassium', 'adverse effect of parenteral', 'renal blood flow', 'vasa recta']):
            return (301, 'physiology')
        elif any(k in t for k in ['21 alpha hydroxylase', '17 alpha hydroxylase']):
            return (301, 'biochem')
        elif any(k in t for k in ['strept', 'vdrl', 'viruses', 'urethritis', 'diplococci', 'lactic acid', 'rubella', 'utls']):
            return (301, 'microbiology')
        else:
            return (301, 'pathology')

    # Specific misplacements from CA-1:
    if qid == 'MUG3-CH103-PHYS-0120': # ovary lymphatics -> CA-2 Anatomy
        return (201, 'anatomy')
    if qid == 'MUG3-CH103-PHYS-0132': # vaginal candidiasis -> CA-2 Microbiology
        return (207, 'microbiology')

    # Specific misplacements from CA-2 to CA-1:
    if qid == 'MUG3-CH201-ANAT-0023': # double ureter -> CA-1 Anatomy
        return (101, 'anatomy')
    if qid == 'MUG3-CH202-HIST-0005': # macula densa -> CA-1 Histology
        return (102, 'histology')
    if qid == 'MUG3-CH203-PHYS-0025': # cardiac output fraction to kidneys -> CA-1 Physiology
        return (103, 'physiology')
    if qid == 'MUG3-CH203-PHYS-0104': # Alport syndrome -> CA-1 Histology/Physio
        return (102, 'histology')
    if qid == 'MUG3-CH203-PHYS-0109': # crescents & linear IgG -> CA-1 Pathology
        return (105, 'pathology')
    if qid == 'MUG3-CH203-PHYS-0110': # acute kidney injury from penicillin -> CA-1 Pathology
        return (105, 'pathology')
    if qid == 'MUG3-CH203-PHYS-0106': # cystinuria -> CA-1 Biochemistry
        return (104, 'biochem')
    if qid == 'MUG3-CH203-PHYS-0107': # inulin / PAH clearance -> CA-1 Physiology
        return (103, 'physiology')
    if qid == 'MUG3-CH203-PHYS-0135': # primary prevention CKD -> CA-1 Physiology
        return (103, 'physiology')
    if qid == 'MUG3-CH205-PATH-0144': # ADPKD -> CA-1 Pathology
        return (105, 'pathology')
    if qid == 'MUG3-CH205-PATH-0051': # Nephritic syndrome -> CA-1 Pathology
        return (105, 'pathology')
    if qid == 'MUG3-CH205-PATH-0105': # RCC mass -> CA-1 Pathology
        return (105, 'pathology')
    if qid == 'MUG3-CH203-PHYS-0111': # superficial urothelial umbrella cells expansion -> CA-1 Histology
        return (102, 'histology')
    if qid == 'MUG3-CH203-PHYS-0114': # peri-orbital edema / oliguria / hematuria -> CA-1 Pathology
        return (105, 'pathology')
    if qid == 'MUG3-CH203-PHYS-0115': # acute pyelonephritis / fever, flank pain -> CA-1 Pathology
        return (105, 'pathology')
    if qid == 'MUG3-CH206-PHAR-0006': # severe hypercalcemia treatment -> CA-1 Pharmacology
        return (106, 'pharma')
    if qid == 'MUG3-CH202-HIST-0012': # puffiness around eyes (nephrotic) -> CA-1 Pathology
        return (105, 'pathology')
    if qid == 'MUG3-CH203-PHYS-0105': # 21 hydroxylase deficiency -> CA-1 Biochemistry
        return (104, 'biochem')
    if qid == 'MUG3-CH205-PATH-0045': # acute urinary tract obstruction / UTI -> CA-1 Clinical / Micro
        return (107, 'microbiology')
    if qid == 'MUG3-CH205-PATH-0056': # serum creatinine -> CA-1 Pathology
        return (105, 'pathology')

    # CA-2 Questions:
    ca2_terms = [
        'prostat', 'spermat', 'testi', 'testosteron', 'vas deferens', 'ductus deferens',
        'seminal vesicle', 'bulbourethral', 'ejaculat', 'bph', 'cavernos', 'sperm', 'sertoli',
        'orchiectomy', 'scrotal', 'scrotum', 'seminiferous', 'blood–testis', 'blood-testis',
        'ovary', 'ovarian', 'uterus', 'uterine', 'cervix', 'cervical', 'vagin', 'vulv',
        'broad ligament', 'fallopian', 'mammary', 'breast', 'preeclampsia', 'parturition',
        'lactat', 'placenta', 'schiller', 'yolk sac', 'granulosa', 'endometri', 'labia',
        'gartner', 'sinovaginal', 'paramesonephric', 'pap smear', 'peau d\'orange',
        'perineal', 'ischiorectal', 'internal iliac', 'sacral plexus', 'lumbosacral',
        'piriformis', 'urogenital diaphragm', 'syphilis', 'vdrl', 'gonorrhea', 'chlamydia',
        'trichomonas', 'hsv', 'hpv', 'genital ulcer', 'botryoides', 'fibroadenoma',
        'tamsulosin', 'prazocin', 'leuprolide', 'rubella', 'fetal hydrops', 'strept',
        'anti-müllerian', 'clotting enzy', 'clothng enzyues', 'vesicles ulcers', 'skin smear',
        'protozoan parasite', 'widest', 'bilharziasis'
    ]

    if any(k in t for k in ca2_terms):
        if any(k in t for k in ['prazocin', 'tamsulosin', 'drug which affords faster', 'leuprolide']):
            return (206, 'pharma')
        elif any(k in t for k in ['artery', 'nerve', 'ligament', 'embryonic', 'fascia', 'fornix', 'widest', 'paramesonephric', 'anti-müllerian']):
            return (201, 'anatomy')
        elif any(k in t for k in ['sertoli', 'seminiferous', 'lining the']):
            return (202, 'histology')
        elif any(k in t for k in ['lactat', 'placenta', 'parturition', 'clothng enzyues', 'clotting enzy']):
            return (203, 'physiology')
        elif any(k in t for k in ['syphilis', 'vdrl', 'gonorrhea', 'chlamydia', 'trichomonas', 'hsv', 'hpv', 'rubella', 'vesicles ulcers', 'skin smear', 'protozoan parasite', 'strept', 'diplococci', 'serology unreliable']):
            return (207, 'microbiology')
        else:
            return (205, 'pathology')

    # All remaining questions belong to CA-1:
    # 1. Anatomy (101): Kidney, ureter, bladder, urethra, urinary embryology
    if any(k in t for k in ['ureter', 'morris', 'horseshoe', 'ureteric bud', 'omental bursa', 'cut off the blood supply to the kidney', 'peritoneum reflect', 'middle of the three normal', 'length of one adult ureter', 'does not cross in front of right ureter', 'duplicated upper collecting']):
        return (101, 'anatomy')

    # 2. Histology (102): Renal corpuscle, filtration barrier, GBM, slit diaphragm, podocytes, JGA, macula densa, urothelium
    if any(k in t for k in ['macula densa', 'slit diaphragm', 'podocyte', 'glomerular basement membrane', 'brush border', 'renal corpuscle', 'urothelial', 'umbrella cells', 'pedicel', 'juxtaglomerular', 'filtration slit']):
        return (102, 'histology')

    # 3. Biochemistry (104): Renal metabolism, ammoniagenesis, amino acids, cystinuria, alkaptonuria, Fanconi, adrenal steroids
    if any(k in t for k in ['glutaminase', 'alkaptonuria', 'homogentisic', 'cystinuria', 'cystine', 'fanconi', '17α-hydroxylase', '17 alpha', '21 hydroxylase', '21-hydroxylase']):
        return (104, 'biochem')

    # 4. Pharmacology (106): Electrolytes, UTI antibiotics, cephalosporins, asymptomatic bacteriuria, hypercalcemia, hypokalemia
    if any(k in t for k in ['asymptomatic bacteruria', 'hypercalcemia', 'cephalo sperins', 'hypokalemia', 'magnesium']):
        return (106, 'pharma')

    # 5. Microbiology / Clinical UTI (107)
    if any(k in t for k in ['cystitis', 'urine isolate', 'urinary tract infection']):
        return (107, 'microbiology')

    # 6. Pathology (105): Nephritic, nephrotic, crescents, linear IgG, edema/puffiness, serum creatinine, calculus, RCC, PKD, penicillin interstitial nephritis
    if any(k in t for k in ['crescents', 'linear igg', 'puffiness around', 'oliguria', 'creatinine', 'calculus', 'penicillin antibiotic', 'renal cell carcinoma', 'enlarged kidneys with numerous cysts', 'costovertebral angle tenderness']):
        return (105, 'pathology')

    # 7. Physiology (103): RBF, GFR, clearance, PCT, loop of Henle, DCT, urine concentration, acid-base, endocrine kidney
    return (103, 'physiology')

# Reset questions in all past exam chapters
for ch in bank['chapters']:
    if ch['id'] >= 100:
        for sub in ch['subjects']:
            sub['questions'] = []

# Index subjects
subject_map = {
    (ch['id'], sub['id']): sub
    for ch in bank['chapters']
    for sub in ch['subjects']
}

# Place all 447 essays into Chapter 301
for item in essays:
    target_sub = item['origSub']
    target_subject = subject_map.get((301, target_sub))
    if not target_subject:
        target_subject = subject_map[(301, 'pathology')]
    q = item['q']
    max_lec = target_subject.get('lectureCount', 1)
    q['lecture'] = max(1, min(max_lec, q.get('lecture', 1)))
    target_subject['questions'].append(q)

# Place all 219 MCQs into their verified destination
ca1_items = 0
ca2_items = 0
finals_mcqs = 0

for item in mcqs:
    dest_ch, dest_sub = classify_mcq(item)
    target_subject = subject_map.get((dest_ch, dest_sub))
    if not target_subject:
        target_ch = next(c for c in bank['chapters'] if c['id'] == dest_ch)
        target_subject = target_ch['subjects'][0]
    q = item['q']
    max_lec = target_subject.get('lectureCount', 1)
    q['lecture'] = max(1, min(max_lec, q.get('lecture', 1)))
    target_subject['questions'].append(q)
    if dest_ch < 200:
        ca1_items += 1
    elif dest_ch < 300:
        ca2_items += 1
    else:
        finals_mcqs += 1

print(f"MCQs distributed: CA-1 = {ca1_items}, CA-2 = {ca2_items}, Finals MCQs = {finals_mcqs}")

# Verification assertions
all_q_ids = [q['id'] for ch in bank['chapters'] for sub in ch['subjects'] for q in sub['questions']]
assert len(all_q_ids) == 2297, f"Expected 2297 questions, got {len(all_q_ids)}"
assert len(set(all_q_ids)) == 2297, "Duplicate question IDs detected!"

for ch in bank['chapters']:
    ch_id = ch['id']
    if 101 <= ch_id <= 208:
        for sub in ch['subjects']:
            for q in sub['questions']:
                assert q.get('type') != 'essay', f"Found essay {q['id']} in chapter {ch_id}!"
    for sub in ch['subjects']:
        for q in sub['questions']:
            assert 1 <= q['lecture'] <= sub['lectureCount'], f"Invalid lecture {q['lecture']} in {sub['id']}!"

with open(MUG3_PATH, 'w', encoding='utf-8') as f:
    json.dump(bank, f, ensure_ascii=False, indent=2)

print("Successfully written MUG-3 bank!")

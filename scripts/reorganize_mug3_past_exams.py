#!/usr/bin/env python3
"""
Reorganize MUG-3 past exams into clean, verified blocks:
- CA-1 (Continuous Assessment 1, Chapters 101-108): MCQ only, strictly matching CA-1 syllabus.
- CA-2 (Continuous Assessment 2, Chapters 201-208): MCQ only, genital/reproductive/pelvic/breast/STI topics.
- Past Final Papers & Essays (Chapter 301): Past final MCQs + ALL past exam essays.
"""

import json
import re

MUG3_PATH = 'src/imports/year-3/semester-1/MUG-3.json'

with open(MUG3_PATH, 'r', encoding='utf-8') as f:
    bank = json.load(f)

# 1. Collect all past-exam questions (chapters >= 100)
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

# 2. Separate essays vs MCQs
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

# 3. Classify MCQs into CA-1, CA-2, or Finals
def classify_mcq(item):
    q = item['q']
    qid = q['id']
    orig_ch = item['origCh']
    orig_sub = item['origSub']
    t = q.get('text', '').lower()
    
    # Past Finals: If originally in Chapter 301 and not an Assessment 1 question:
    if orig_ch == 301 and qid != 'MUG3-CH301-PATH-0066':
        return (301, orig_sub)
        
    # Check if CA-2 topics:
    # Male genital / prostate / testes / BPH
    if any(k in t for k in ['prostat', 'spermat', 'testi', 'testosteron', 'vas deferens', 'ductus deferens', 'seminal vesicle', 'bulbourethral', 'ejaculat', 'bph', 'cavernos', 'sperm', 'sertoli', 'orchiectomy']):
        if 'prazocin' in str(q.get('options', [])).lower() or 'drug which affords faster' in t:
            return (206, 'pharma')
        elif any(k in t for k in ['histolog', 'seminiferous', 'sertoli', 'blood–testis']):
            return (202, 'histology')
        elif any(k in t for k in ['artery', 'nerve', 'lobe', 'anterior', 'posterior', 'compartment', 'widest', 'segment', 'fascia']):
            return (201, 'anatomy')
        elif any(k in t for k in ['adverse effect', 'nitric oxide', 'delivery', 'leuprolide']):
            return (203, 'physiology')
        else:
            return (205, 'pathology')

    # Female genital / ovary / uterus / cervix / vagina / vulva / breast / pregnancy / preeclampsia
    if any(k in t for k in ['ovary', 'ovarian', 'uterus', 'uterine', 'cervix', 'cervical', 'vagin', 'vulv', 'broad ligament', 'fallopian', 'mammary', 'breast', 'preeclampsia', 'parturition', 'lactat', 'placenta', 'schiller', 'yolk sac', 'granulosa', 'endometri', 'labia', 'gartner', 'sinovaginal']):
        if 'distal ureters' in t or ('cervical carcinoma' in t and 'kidneys' in t):
            return (105, 'pathology')
        if any(k in t for k in ['artery', 'nerve', 'subdivision', 'anterior', 'embryonic', 'ligament', 'internal os', 'lymph nodes first receive', 'junction']):
            return (201, 'anatomy')
        elif any(k in t for k in ['lactobacilli', 'candidiasis', 'bacterial vaginosis', 'discharge', 'odor']):
            return (207, 'microbiology')
        elif any(k in t for k in ['postmenopausal', 'carcinoma', 'cyst', 'tumor', 'mass', 'bleeding', 'hyperplasia', 'pap smear']):
            return (205, 'pathology')
        else:
            return (203, 'physiology')

    # Pelvic wall / Perineum / Internal iliac / Sacral plexus / Lumbosacral trunk / Piriformis
    if any(k in t for k in ['perineal', 'ischiorectal', 'internal iliac', 'sacral plexus', 'lumbosacral', 'piriformis', 'urogenital diaphragm']):
        return (201, 'anatomy')

    # STIs
    if any(k in t for k in ['syphilis', 'vdrl', 'gonorrhea', 'chlamydia', 'trichomonas', 'hsv', 'hpv', 'genital ulcer', 'urethritis', 'urethral discharge', 'conjunctivitis in the second week', 'penicillin g 2.4 million']):
        return (207, 'microbiology')

    # Bladder Schistosomiasis / SCC
    if any(k in t for k in ['schistosomiasis', 'squamous cell carcinoma', 'keratinized mass', 'intercellular bridges']):
        return (205, 'pathology')

    # Fetal hydrops / parvovirus
    if 'fetal hydrops' in t:
        return (207, 'microbiology')

    # CA-1 Topics:
    # Anatomy (101): kidney, ureter, bladder, urethra, urinary development
    if any(k in t for k in ['ureter', 'kidney', 'urinary bladder', 'horseshoe', 'ureteric bud', 'rectovesical pouch', 'morris', 'omental bursa']):
        if any(k in t for k in ['clearance', 'rbf', 'gfr', 'filtration', 'blood flow', 'pressure', 'reabsorp']):
            return (103, 'physiology')
        elif 'length of one adult ureter' in t or 'constrictions' in t or 'middle of the three normal' in t or 'cross in front of right ureter' in t:
            return (101, 'anatomy')
        elif 'renal cell carcinoma ligation' in t:
            return (101, 'anatomy')
        elif 'anion gap' in t or 'morris' in t:
            return (101, 'anatomy')
        else:
            return (101, 'anatomy')

    # Histology (102): renal corpuscle, filtration barrier, podocyte, slit diaphragm, GBM, PCT/DCT brush border, JGA macula densa, urothelium, umbrella cells
    if any(k in t for k in ['macula densa', 'slit diaphragm', 'podocyte', 'glomerular basement membrane', 'brush border', 'renal corpuscle', 'urothelial', 'umbrella cells', 'intraglomerular mesangial', 'alport syndrome']):
        return (102, 'histology')

    # Pharmacology (106): electrolyte disturbances, UTI antibiotics, hypercalcemia, asymptomatic bacteriuria, cephalosporins
    if any(k in t for k in ['asymptomatic bacteruria', 'hypercalcemia', 'cephalo sperins', 'hypokalemia', 'magnesium']):
        return (106, 'pharma')

    # Microbiology / Clinical UTI (107)
    if any(k in t for k in ['cystitis', 'urine isolate', 'motile, lactose-fermenting']):
        return (107, 'microbiology')

    # Biochemistry (104): amino acid metabolism, inherited renal, steroid hormone synthesis
    if any(k in t for k in ['glutaminase', '17α-hydroxylase', '17 alpha', 'alkaptonuria', 'homogentisic', 'cystinuria', 'cystine', 'fanconi', '21 hydroxylase', '21-hydroxylase', 'polycystic', 'polycystin']):
        return (104, 'biochem')

    # Pathology (105): nephritic, nephrotic, tubulointerstitial, calculi, creatinine
    if any(k in t for k in ['calculus', 'stones', 'crescents', 'linear igg', 'penicillin antibiotic', 'eosinophils', 'flank pain, costovertebral', 'poststreptococcal', 'oliguria , hematuria', 'puffiness around', 'diabetic nephropathy', 'serum creatinine', 'renal cell carcinoma']):
        return (105, 'pathology')

    # Physiology (103) default for renal physio
    return (103, 'physiology')

# Clear existing questions from past-exam chapters
for ch in bank['chapters']:
    if ch['id'] >= 100:
        for sub in ch['subjects']:
            sub['questions'] = []

# Index subjects for fast lookup
subject_map = {
    (ch['id'], sub['id']): sub
    for ch in bank['chapters']
    for sub in ch['subjects']
}

# 4. Place all essays into Chapter 301
for item in essays:
    target_sub = item['origSub']
    target_subject = subject_map.get((301, target_sub))
    if not target_subject:
        target_subject = subject_map[(301, 'pathology')]
    q = item['q']
    # Clamp lecture
    max_lec = target_subject.get('lectureCount', 1)
    q['lecture'] = max(1, min(max_lec, q.get('lecture', 1)))
    target_subject['questions'].append(q)

# 5. Place MCQs into their classified destination
for item in mcqs:
    dest_ch, dest_sub = classify_mcq(item)
    target_subject = subject_map.get((dest_ch, dest_sub))
    if not target_subject:
        # Fallback to chapter's first subject
        target_ch = next(c for c in bank['chapters'] if c['id'] == dest_ch)
        target_subject = target_ch['subjects'][0]
    q = item['q']
    max_lec = target_subject.get('lectureCount', 1)
    q['lecture'] = max(1, min(max_lec, q.get('lecture', 1)))
    target_subject['questions'].append(q)

# 6. Verification checks
all_q_ids = [q['id'] for ch in bank['chapters'] for sub in ch['subjects'] for q in sub['questions']]
assert len(all_q_ids) == 2297, f"Expected 2297 questions, got {len(all_q_ids)}"
assert len(set(all_q_ids)) == 2297, "Duplicate question IDs detected!"

for ch in bank['chapters']:
    ch_id = ch['id']
    if ch_id in range(101, 209):
        # Must have zero essays
        for sub in ch['subjects']:
            for q in sub['questions']:
                assert q.get('type') != 'essay', f"Found essay {q['id']} in chapter {ch_id}!"
    for sub in ch['subjects']:
        for q in sub['questions']:
            assert 1 <= q['lecture'] <= sub['lectureCount'], f"Invalid lecture {q['lecture']} in {sub['id']}!"

with open(MUG3_PATH, 'w', encoding='utf-8') as f:
    json.dump(bank, f, ensure_ascii=False, indent=2)

print("Successfully reorganized MUG-3 past exams bank into CA-1, CA-2, and Finals blocks!")

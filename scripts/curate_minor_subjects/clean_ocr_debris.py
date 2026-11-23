import json, re

bank_path = 'src/imports/year-3/semester-1/MUG-3.json'
with open(bank_path, 'r') as f:
    bank = json.load(f)

cleaned_count = 0

patterns_to_remove = [
    r'\s*\d*\s*Multiple Choice Questions and Answers in Pathology\s*',
    r'\s*Thanna Helal\s*',
    r'\s*Thanaa Helal\s*',
    r'\s*Chapter\s*\(\d+\)\s*',
    r'\s*Urinary S[vy]stem\s*',
    r'\s*Male Genital System\s*',
    r'\s*Female Genital System\s*',
    r'\s*Breast\s*',
    r'\s*BIOCHEMISTRY\s*',
    r'\s*Case Study\s*',
    r'\s*Choose the correct answer:?\s*'
]

for c in bank['chapters']:
    for s in c.get('subjects', []):
        for q in s.get('questions', []):
            orig_text = q['text']
            for p in patterns_to_remove:
                q['text'] = re.sub(p, ' ', q['text'], flags=re.I).strip()
            if q['text'] != orig_text:
                cleaned_count += 1
                print(f"Cleaned stem in {q['id']}")

            if 'options' in q and isinstance(q['options'], list):
                for idx, opt in enumerate(q['options']):
                    orig_opt = opt
                    for p in patterns_to_remove:
                        opt = re.sub(p, ' ', opt, flags=re.I).strip()
                    # Also clean specific running page numbers like "173"
                    opt = re.sub(r'\s{2,}\d{2,3}\s*$', '', opt).strip()
                    if opt != orig_opt:
                        q['options'][idx] = opt
                        cleaned_count += 1
                        print(f"Cleaned option in {q['id']}: {repr(orig_opt)} -> {repr(opt)}")

with open(bank_path, 'w') as f:
    json.dump(bank, f, indent=2)

print(f"Finished cleaning OCR debris! Total modifications: {cleaned_count}")

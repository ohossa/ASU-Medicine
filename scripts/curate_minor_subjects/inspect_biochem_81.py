import json, re

with open('data-format-v2/extracted_urogenital_all201.json', 'r') as f:
    data = json.load(f)

bio_qs = [q for q in data if q.get('subject') == 'biochem' and q.get('options')]

for i, q in enumerate(bio_qs):
    t = q.get('text', '').replace('\n', ' ').strip()
    opts = q.get('options', [])
    ans = None
    cleaned_opts = []
    for opt in opts:
        m = re.search(r'Correct answer:\s*([A-E])', opt, re.I)
        if m:
            ans = m.group(1).upper()
        # remove correct answer string
        clean = re.sub(r'\s*Correct answer:\s*[A-E]', '', opt, flags=re.I).strip()
        cleaned_opts.append(clean)
    if ans:
        print(f"[{i+1}] Ans={ans} | {t[:80]}")


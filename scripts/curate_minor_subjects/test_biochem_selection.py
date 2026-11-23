import json, re

with open('data-format-v2/extracted_urogenital_all201.json', 'r') as f:
    data = json.load(f)

bio_qs = [q for q in data if q.get('subject') == 'biochem' and q.get('options')]
print(f"Total candidate biochem questions: {len(bio_qs)}")

# Check breakdown by source
for q in bio_qs:
    # normalize text
    t = q.get('text', '').strip()
    opts = q.get('options', [])
    ans = None
    for opt in opts:
        m = re.search(r'Correct answer:\s*([A-E])', opt, re.I)
        if m:
            ans = m.group(1).upper()
            break
    q['_parsed_ans'] = ans

with_ans = [q for q in bio_qs if q.get('_parsed_ans')]
print(f"Candidate biochem with parsed answer: {len(with_ans)}")

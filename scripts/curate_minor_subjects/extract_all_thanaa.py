import fitz, re, json

doc = fitz.open('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/Pathology/Urogenital Module - MCQ and CASES in Pathology - Dr. Thanaa Helal.pdf')

# 1. Parse keys
key_dict = {}
for pno in range(53, 58):
    text = doc[pno].get_text()
    matches = re.findall(r'\((\d+)\)\s+([A-Ea-e])', text)
    for qnum, ans in matches:
        key_dict[int(qnum)] = ans.upper()

# 2. Extract full text from page 3 to 53 (MCQ chapters)
full_mcq_text = ""
for pno in range(2, 53):
    full_mcq_text += doc[pno].get_text() + "\n"

blocks = re.findall(r'\((\d{4})\)\s*(.*?)(?=\(\d{4}\)|\Z)', full_mcq_text, re.S)
print(f"Total question blocks found: {len(blocks)}")

parsed_qs = []
for qnum_str, body in blocks:
    qnum = int(qnum_str)
    
    # Split stem and options
    # Options start with A. B. C. D. (and optionally E.)
    m_opt_start = re.search(r'\n[A-E]\.', body)
    if not m_opt_start:
        continue
    stem = body[:m_opt_start.start()].strip().replace('\n', ' ')
    opts_text = body[m_opt_start.start():]
    
    raw_opts = re.findall(r'[A-E]\.\s*(.*?)(?=\n[A-E]\.|\Z)', opts_text, re.S)
    opts = [o.strip().replace('\n', ' ') for o in raw_opts]
    
    ans = key_dict.get(qnum)
    if ans and len(opts) >= 4:
        parsed_qs.append({
            'num': qnum,
            'stem': stem,
            'options': opts,
            'ans': ans
        })

print(f"Total parsed MCQs with answers: {len(parsed_qs)}")
by_range = {
    'Ch15_Urinary': len([q for q in parsed_qs if 1238 <= q['num'] <= 1353]),
    'Ch16_Male': len([q for q in parsed_qs if 1354 <= q['num'] <= 1425]),
    'Ch17_Female': len([q for q in parsed_qs if 1426 <= q['num'] <= 1565]),
    'Ch18_Breast': len([q for q in parsed_qs if 1566 <= q['num'] <= 1640]),
}
print("Breakdown by chapter:", by_range)

with open('scripts/curate_minor_subjects/thanaa_parsed.json', 'w') as f:
    json.dump(parsed_qs, f, indent=2)

print("Saved thanaa_parsed.json")

import fitz, re, json

doc = fitz.open('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/Pathology/Urogenital Module - MCQ and CASES in Pathology - Dr. Thanaa Helal.pdf')

# 1. Parse keys
key_dict = {}
for pno in range(53, 58):
    text = doc[pno].get_text()
    matches = re.findall(r'\((\d+)\)\s+([A-Ea-e])', text)
    for qnum, ans in matches:
        key_dict[int(qnum)] = ans.upper()

print(f"Total keys: {len(key_dict)}")

# 2. Extract full text from page 3 to 53 (MCQ chapters)
full_mcq_text = ""
for pno in range(2, 53):
    full_mcq_text += doc[pno].get_text() + "\n"

# Split by question pattern: e.g. "(1238) Horse-shoe kidney..."
q_blocks = re.split(r'\n(?=\((\d{4})\))', full_mcq_text)
print(f"Total splits: {len(q_blocks)}")

parsed_qs = []
for i in range(1, len(q_blocks), 2):
    qnum_str = q_blocks[i]
    block = q_blocks[i+1]
    qnum = int(qnum_str)
    
    # Stem: before A.
    m_stem = re.search(r'^\)\s*(.*?)(?=\n[A-E]\.|\Z)', block, re.S)
    if not m_stem:
        continue
    stem = m_stem.group(1).strip().replace('\n', ' ')
    
    raw_opts = re.findall(r'([A-E])\.\s*(.*?)(?=\n[A-E]\.|\n\(\d{4}\)|\Z)', block, re.S)
    opts = [o[1].strip().replace('\n', ' ') for o in raw_opts]
    
    ans = key_dict.get(qnum)
    if ans and len(opts) >= 4:
        parsed_qs.append({
            'num': qnum,
            'stem': stem,
            'options': opts,
            'ans': ans
        })

print(f"Successfully extracted {len(parsed_qs)} complete MCQs with keys from Dr. Thanaa Helal!")
by_range = {
    'Ch15_Urinary': len([q for q in parsed_qs if 1238 <= q['num'] <= 1353]),
    'Ch16_Male': len([q for q in parsed_qs if 1354 <= q['num'] <= 1425]),
    'Ch17_Female': len([q for q in parsed_qs if 1426 <= q['num'] <= 1565]),
    'Ch18_Breast': len([q for q in parsed_qs if 1566 <= q['num'] <= 1640]),
}
print("Breakdown by chapter:", by_range)

import fitz, re

doc = fitz.open('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/Pharmacology/ALAA uro mcq.pdf')
full_text = '\n'.join(p.get_text() for p in doc)

# Parse answer key
m_key = re.search(r'Answer key\s*(.*)', full_text, re.S)
key_text = m_key.group(1)
keys = dict(re.findall(r'(\d+)\s*=\s*([a-e])', key_text, re.I))

# Split questions
# Questions start with number followed by dot
q_blocks = re.split(r'\n(?=\d+\.\s+)', full_text[:m_key.start()])
print(f"Total question blocks split: {len(q_blocks)}")

parsed = []
for block in q_blocks:
    m_num = re.match(r'(\d+)\.\s*(.*?)(?=\n[a-e]\.|\Z)', block, re.S)
    if not m_num:
        continue
    q_num = m_num.group(1)
    stem = m_num.group(2).strip().replace('\n', ' ')
    
    # parse options
    raw_opts = re.findall(r'([a-e])\.\s*(.*?)(?=\n[a-e]\.|\nAnswer|\Z)', block, re.S)
    opts = [o[1].strip().replace('\n', ' ') for o in raw_opts]
    
    ans_letter = keys.get(q_num, '').lower()
    parsed.append({
        'num': q_num,
        'stem': stem,
        'options': opts,
        'ans': ans_letter
    })

print(f"Successfully parsed {len(parsed)} questions from ALAA:")
for q in parsed[:5]:
    print(f"Q{q['num']} (Ans: {q['ans']}): {q['stem'][:70]} | Opts: {len(q['options'])}")

import fitz, re

doc = fitz.open('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/Microbiology/MCQ Micro .pdf')

# Page 7 has answers
p7_text = doc[6].get_text()
raw_matches = re.findall(r'(\d+)\s+([A-E])', p7_text)
keys = {num: letter.lower() for num, letter in raw_matches}

# Split questions on pages 1 to 6
full_text = '\n'.join(doc[p].get_text() for p in range(6))
q_blocks = re.split(r'\n(?=\d+\.\s+)', full_text)
print(f"Total blocks split: {len(q_blocks)}")

parsed = []
for block in q_blocks:
    m = re.match(r'(\d+)\.\s*(.*?)(?=\n[A-E]\.|\Z)', block, re.S)
    if not m:
        continue
    qnum = m.group(1)
    stem = m.group(2).strip().replace('\n', ' ')
    
    raw_opts = re.findall(r'([A-E])\.\s*(.*?)(?=\n[A-E]\.|\Z)', block, re.S)
    opts = [o[1].strip().replace('\n', ' ') for o in raw_opts]
    
    parsed.append({
        'num': qnum,
        'stem': stem,
        'options': opts,
        'ans': keys.get(qnum)
    })

print(f"Parsed {len(parsed)} questions:")
for q in parsed[:10]:
    print(f"Q{q['num']} (Ans: {q['ans']}): {q['stem'][:70]} | Opts: {len(q['options'])}")

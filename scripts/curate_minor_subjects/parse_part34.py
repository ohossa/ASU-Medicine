import fitz, re

doc = fitz.open('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/Pharmacology/essay questions and MCQs urogenital part 3 and 4.pdf')
full_text = '\n'.join(p.get_text() for p in doc[2:]) # page 3 onwards

# Parse answer key
# It appears on last page: 1=d 2=c ... 30=d
keys = dict(re.findall(r'(\d+)\s*[-=]\s*([a-e])', full_text, re.I))
print(f"Parsed {len(keys)} keys from Part 3 & 4: {keys}")

# Find where answers start
ans_idx = full_text.rfind('1=')
if ans_idx == -1:
    ans_idx = full_text.rfind('1-')

q_text = full_text[:ans_idx]

# Split questions: e.g. "5. Which of the following...", "11. Regarding Tadalafil..."
q_blocks = re.split(r'\n(?=\d+[\.\-]\s+)', q_text)
print(f"Total question blocks split: {len(q_blocks)}")

parsed = []
for block in q_blocks:
    m_num = re.match(r'(\d+)[\.\-]\s*(.*?)(?=\n[a-e]\.|\Z)', block, re.S)
    if not m_num:
        continue
    q_num = m_num.group(1)
    stem = m_num.group(2).strip().replace('\n', ' ')
    
    raw_opts = re.findall(r'([a-e])\.\s*(.*?)(?=\n[a-e]\.|\Z)', block, re.S)
    opts = [o[1].strip().replace('\n', ' ') for o in raw_opts]
    
    ans_letter = keys.get(q_num, '').lower()
    parsed.append({
        'num': q_num,
        'stem': stem,
        'options': opts,
        'ans': ans_letter
    })

print(f"Successfully parsed {len(parsed)} questions from Part 3 & 4:")
for q in parsed[:8]:
    print(f"Q{q['num']} (Ans: {q['ans']}): {q['stem'][:70]} | Opts: {len(q['options'])}")

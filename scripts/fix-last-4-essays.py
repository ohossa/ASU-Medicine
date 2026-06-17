#!/usr/bin/env python3
import json, re
from pathlib import Path

BANK = Path('src/imports/year-2/semester-2/MCNS-2.json')
REPORT = Path('.kimchi/docs/essay-overhaul-report.json')
BOOK = Path('CNS part 1 and 2.txt')

bank = json.load(open(BANK))
report = json.load(open(REPORT))
book_text = BOOK.read_text(encoding='utf-8')

qid_map = {}
for ch in bank['chapters']:
    for s in ch['subjects']:
        for q in s['questions']:
            qid_map[q['id']] = q

def extract_book_passage(start_kw, end_kw=None, max_chars=600):
    """Extract passage from book text between keywords."""
    lines = book_text.split('\n')
    start_idx = None
    for i, line in enumerate(lines):
        if start_kw.lower() in line.lower():
            start_idx = i
            break
    if start_idx is None:
        return None
    
    # Collect lines until end condition
    passage_lines = []
    for j in range(start_idx, min(start_idx + 30, len(lines))):
        line = lines[j].strip()
        if end_kw and end_kw.lower() in line.lower() and j > start_idx:
            break
        # Skip page numbers and short noise
        if line and not (line.isdigit() and len(line) <= 3):
            passage_lines.append(line)
    
    passage = '\n'.join(passage_lines)
    if len(passage) > max_chars:
        passage = passage[:max_chars].rsplit('.', 1)[0] + '.'
    return passage

def apply_fix(qid, answer_text):
    if qid not in qid_map:
        return False
    qid_map[qid]['modelAnswer'] = answer_text
    if qid in report['updates']:
        report['updates'][qid]['action'] = 'book-fallback'
        report['updates'][qid]['fallbackSource'] = 'book'
        report['updates'][qid]['newAnswerLen'] = len(answer_text)
    return True

# Fix 1: pyramidal vs extrapyramidal
p1 = extract_book_passage('Table 3.15: Difference between Pyramidal and Extra-pyramidal tracts', max_chars=700)
if p1 and apply_fix('mcns2-ch7-physiology-q4', p1):
    print('Fixed mcns2-ch7-physiology-q4 (pyramidal)')

# Fix 2: spasticity vs rigidity
p2 = extract_book_passage('Table 3.19: Comparison between types of hypertonia', max_chars=700)
if p2 and apply_fix('mcns2-ch7-physiology-q7', p2):
    print('Fixed mcns2-ch7-physiology-q7 (spasticity)')

# Fix 3: learning types
lines = book_text.split('\n')
start = None
for i, line in enumerate(lines):
    if 'associative learning:' in line.lower():
        start = i - 1  # Get context before
        break
p3 = None
if start:
    p3_lines = []
    for j in range(max(0, start), min(start + 20, len(lines))):
        l = lines[j].strip()
        if l and not (l.isdigit() and len(l) <= 3):
            p3_lines.append(l)
    p3 = '\n'.join(p3_lines)
    if len(p3) > 600:
        p3 = p3[:600].rsplit('.', 1)[0] + '.'
if p3 and apply_fix('mcns2-ch3-physiology-q6', p3):
    print('Fixed mcns2-ch3-physiology-q6 (learning)')

# Fix 4: phenytoin in female - use iNerd if available, else generic pharmacology text
inerd = json.load(open('.kimchi/docs/inerd-essays-structured.json'))
phenytoin_answer = None
for e in inerd:
    if 'phenytoin' in e['answer'].lower() and 'female' in (e['question'] + e['answer']).lower():
        phenytoin_answer = e['answer']
        break

# If not found, look for any iNerd entry with phenytoin warnings
if not phenytoin_answer:
    for e in inerd:
        if 'phenytoin' in e['answer'].lower() and any(w in e['answer'].lower() for w in ['teratogenic', 'congenital', 'pregnancy', 'birth', 'fetal']):
            phenytoin_answer = e['answer']
            break

# Book fallback for phenytoin
if not phenytoin_answer:
    # Search book for phenytoin section
    for i, line in enumerate(lines):
        if 'phenytoin' in line.lower():
            phenytoin_lines = []
            for j in range(i, min(i + 15, len(lines))):
                l = lines[j].strip()
                if l and not (l.isdigit() and len(l) <= 3):
                    phenytoin_lines.append(l)
            phenytoin_answer = '\n'.join(phenytoin_lines)
            break

if phenytoin_answer and apply_fix('mcns2-ch1-pharma-q120', phenytoin_answer):
    print('Fixed mcns2-ch1-pharma-q120 (phenytoin)')

# Save
with open(BANK, 'w', encoding='utf-8') as f:
    json.dump(bank, f, indent=2, ensure_ascii=False)
with open(REPORT, 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

# Copy to canonical
import shutil
shutil.copy(BANK, 'data-format-v2/question-bank-mcns2/question-bank-mcns2.json')

print('\nSaved.')

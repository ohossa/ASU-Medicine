#!/usr/bin/env python3
import json, re
from pathlib import Path

BANK = Path('src/imports/year-2/semester-2/MCNS-2.json')
INERD = Path('.kimchi/docs/inerd-essays-structured.json')
BOOK = Path('CNS part 1 and 2.txt')
REPORT = Path('.kimchi/docs/essay-overhaul-report.json')

bank = json.load(open(BANK))
inerd = json.load(open(INERD))
book_text = BOOK.read_text(encoding='utf-8')
report = json.load(open(REPORT))

# Get all 10 remaining flagged
flagged_qids = [k for k, v in report['updates'].items() if v['action'] == 'flag']
print(f'Fixing {len(flagged_qids)} remaining essays...')

qid_map = {}
for ch in bank['chapters']:
    for s in ch['subjects']:
        for q in s['questions']:
            qid_map[q['id']] = q

# For each flagged essay, search all iNerd entries (question+answer) for matching keywords
def extract_keywords(text):
    text = re.sub(r'[^a-z0-9\s]', ' ', text.lower())
    stop = {'the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must','shall','can','need','dare','ought','used','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','between','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','just','and','but','if','or','because','until','while','what','which','who','whom','this','that','these','those','am','it','its','your','their','them','they','he','she','we','us','our','you','me','my','mine','his','her','him','i','describe','mention','list','enumerate','explain','give','name','state','define','compare','contrast','discuss','illustrate','trace','outline','summarize','classify','identify','locate','indicate','distinguish','differentiate','choose','incorrect'}
    words = [w for w in text.split() if w not in stop and len(w) > 2]
    return set(words)

# Also try exact answer extraction from book
def search_book(question):
    q_text = question.get('text', '') + ' ' + question.get('keyConcept', '')
    kws = extract_keywords(q_text)
    if len(kws) < 2:
        return None
    # Split into paragraphs
    paras = [p.strip() for p in book_text.split('\n\n') if len(p.strip()) > 50]
    best = None
    best_sc = 0
    for para in paras:
        p_kws = extract_keywords(para)
        if not p_kws:
            continue
        inter = len(kws & p_kws)
        score = inter / len(kws)
        if score > best_sc and inter >= max(2, len(kws)//3):
            best_sc = score
            best = para
            if len(best) > 500:
                best = best[:500].rsplit('.', 1)[0] + '.'
    return best if best_sc >= 0.25 else None

fixed_count = 0
for qid in flagged_qids:
    q = qid_map[qid]
    q_text = q.get('text', '')
    q_kws = extract_keywords(q_text)
    
    best_match = None
    best_score = 0
    
    for e in inerd:
        combined = e['question'] + ' ' + e['answer']
        e_kws = extract_keywords(combined)
        if not e_kws:
            continue
        inter = len(q_kws & e_kws)
        if inter >= max(2, len(q_kws)//2):
            score = inter / len(q_kws)
            if score > best_score:
                best_score = score
                best_match = e
    
    if best_match:
        q['modelAnswer'] = best_match['answer']
        report['updates'][qid]['action'] = 'update'
        report['updates'][qid]['oldAnswerLen'] = 0
        report['updates'][qid]['newAnswerLen'] = len(best_match['answer'])
        report['updates'][qid]['inerd_question'] = best_match['question']
        report['updates'][qid]['inerd_chapter'] = best_match['chapterId']
        report['updates'][qid]['inerd_subject'] = best_match['subject']
        fixed_count += 1
        print(f'  FIXED (iNerd): {qid} — {q_text[:50]}...')
        continue
    
    # Fallback to book
    book_answer = search_book(q)
    if book_answer:
        q['modelAnswer'] = book_answer
        report['updates'][qid]['action'] = 'book-fallback'
        report['updates'][qid]['fallbackSource'] = 'book'
        report['updates'][qid]['newAnswerLen'] = len(book_answer)
        fixed_count += 1
        print(f'  FIXED (book): {qid} — {q_text[:50]}...')
    else:
        print(f'  STILL MISSING: {qid} — {q_text[:50]}...')

print(f'\nFixed: {fixed_count}/{len(flagged_qids)}')

# Save
with open(BANK, 'w', encoding='utf-8') as f:
    json.dump(bank, f, indent=2, ensure_ascii=False)
with open(REPORT, 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

# Copy to canonical
import shutil
shutil.copy(BANK, 'data-format-v2/question-bank-mcns2/question-bank-mcns2.json')
print('Saved bank and report.')

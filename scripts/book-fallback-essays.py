#!/usr/bin/env python3
"""Search CNS book OCR for flagged essay answers."""
import json, re
from pathlib import Path

BANK_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json')
BOOK_PATH = Path('CNS part 1 and 2.txt')
REPORT_PATH = Path('.kimchi/docs/essay-overhaul-report.json')

def normalize(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_keywords(text):
    """Extract content words (exclude stop words)."""
    stop = {'the','a','an','is','are','was','were','be','been','being',
            'have','has','had','do','does','did','will','would','could',
            'should','may','might','must','shall','can','need','dare',
            'ought','used','to','of','in','for','on','with','at','by',
            'from','as','into','through','during','before','after',
            'above','below','between','under','again','further','then',
            'once','here','there','when','where','why','how','all',
            'any','both','each','few','more','most','other','some',
            'such','no','nor','not','only','own','same','so','than',
            'too','very','just','and','but','if','or','because','until',
            'while','what','which','who','whom','this','that','these',
            'those','am','it','its','your','their','them','they','he',
            'she','we','us','our','you','me','my','mine','his','her',
            'him','i','describe','mention','list','enumerate','explain',
            'give','name','state','what','how','why','where','when',
            'which','compare','contrast','discuss','define','illustrate',
            'trace','outline','summarize','classify','identify','locate',
            'indicate','distinguish','differentiate','examples','include'}
    words = [w for w in normalize(text).split() if w not in stop and len(w) > 2]
    return words

def search_book_for_answer(question_text, book_text, max_chars=600):
    """Search book text for a relevant passage matching the question."""
    keywords = extract_keywords(question_text)
    if len(keywords) < 2:
        return None
    
    # Build a regex that requires at least 2/3 of the keywords
    required = max(2, len(keywords) // 3)
    
    # Try finding a paragraph containing multiple keywords
    best_match = None
    best_score = 0
    
    # Split book into paragraphs (roughly)
    paragraphs = book_text.split('\n\n')
    
    for para in paragraphs:
        if len(para) < 50:
            continue
        para_norm = normalize(para)
        matches = sum(1 for kw in keywords if kw in para_norm)
        score = matches / len(keywords)
        if score > best_score and matches >= required:
            best_score = score
            best_match = para.strip()
            if len(best_match) > max_chars:
                best_match = best_match[:max_chars].rsplit('.', 1)[0] + '.'
    
    return best_match if best_score >= 0.3 else None

def main():
    bank = json.load(open(BANK_PATH))
    book_text = BOOK_PATH.read_text(encoding='utf-8')
    report = json.load(open(REPORT_PATH))
    
    # Build qid -> question mapping
    qid_map = {}
    for ch in bank['chapters']:
        for sub in ch['subjects']:
            for q in sub['questions']:
                qid_map[q['id']] = q
    
    flagged_qids = [k for k, v in report['updates'].items() if v['action'] == 'flag']
    print(f"Searching book for {len(flagged_qids)} flagged essays...")
    
    updated = 0
    not_found = 0
    
    for qid in flagged_qids:
        q = qid_map[qid]
        answer = search_book_for_answer(q.get('text',''), book_text)
        if answer:
            q['modelAnswer'] = answer
            report['updates'][qid]['action'] = 'book-fallback'
            report['updates'][qid]['fallbackSource'] = 'book'
            report['updates'][qid]['newAnswerLen'] = len(answer)
            updated += 1
        else:
            not_found += 1
    
    print(f"Found book answers: {updated}")
    print(f"Still not found: {not_found}")
    
    # Save
    with open(BANK_PATH, 'w', encoding='utf-8') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print("Saved.")

if __name__ == '__main__':
    main()

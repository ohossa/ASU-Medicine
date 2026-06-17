#!/usr/bin/env python3
"""Cross-match bank essays with iNerd essays and update/add accordingly."""
import json, re, shutil
from collections import Counter
from pathlib import Path

BANK_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json')
INERD_PATH = Path('.kimchi/docs/inerd-essays-structured.json')
BOOK_TOC_PATH = Path('.kimchi/docs/book-toc.json')
OUT_BANK = Path('src/imports/year-2/semester-2/MCNS-2.json')
CANONICAL_OUT = Path('data-format-v2/question-bank-mcns2/question-bank-mcns2.json')
REPORT_PATH = Path('.kimchi/docs/essay-overhaul-report.json')

def normalize(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def jaccard(a, b):
    set_a = set(a.split())
    set_b = set(b.split())
    if not set_a or not set_b:
        return 0.0
    inter = len(set_a & set_b)
    union = len(set_a | set_b)
    return inter / union

def load_bank():
    with open(BANK_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_inerd():
    with open(INERD_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_bank_essays(bank):
    essays = []
    for ch in bank['chapters']:
        for sub in ch['subjects']:
            for q in sub['questions']:
                if q.get('type') == 'essay':
                    essays.append({
                        'question': q,
                        'chapterId': ch['id'],
                        'subject': sub['id'],
                        'text': q.get('text',''),
                        'norm': normalize(q.get('text','')),
                    })
    return essays

def map_inered_to_valid_subject(inerd_sub, valid_subs):
    """Map iNerd inferred subject to valid subject for a chapter."""
    if inerd_sub in valid_subs:
        return inerd_sub
    # Fallback mappings
    if 'embryology' == inerd_sub and 'anatomy' in valid_subs:
        return 'anatomy'
    if inerd_sub == 'clinical' and 'clinical' not in valid_subs:
        # Clinical only valid in certain chapters
        if 'pathology' in valid_subs:
            return 'pathology'
        if 'pharma' in valid_subs:
            return 'pharma'
    if inerd_sub == 'parasitology' and 'parasitology' not in valid_subs:
        if 'microbiology' in valid_subs:
            return 'microbiology'
    if inerd_sub == 'microbiology' and 'microbiology' not in valid_subs:
        if 'pathology' in valid_subs:
            return 'pathology'
    # Generic fallback
    return valid_subs[0] if valid_subs else 'anatomy'

def get_max_chapter_id(bank):
    return max(ch['id'] for ch in bank['chapters'])

def main():
    bank = load_bank()
    inerd = load_inerd()
    book_toc = json.load(open(BOOK_TOC_PATH))
    
    # Build valid subjects per chapter
    valid_subjects = {}
    for ch in book_toc['chapters']:
        valid_subjects[ch['id']] = list(ch['subjects'].keys())
    
    bank_essays = extract_bank_essays(bank)
    print(f"Bank essays: {len(bank_essays)}")
    print(f"iNerd essays: {len(inerd)}")
    
    # Normalize iNerd essays
    for e in inerd:
        e['norm'] = normalize(e['question'])
    
    # Cross-match
    matched_inerd = set()
    updates = {}
    flags = []
    
    for be in bank_essays:
        best_score = 0
        best_match = None
        for ie in inerd:
            score = jaccard(be['norm'], ie['norm'])
            if score > best_score:
                best_score = score
                best_match = ie
        
        if best_match and best_score >= 0.40:
            matched_inerd.add(id(best_match))
            updates[be['question']['id']] = {
                'action': 'update',
                'score': best_score,
                'oldAnswerLen': len(be['question'].get('modelAnswer','')),
                'newAnswerLen': len(best_match['answer']),
                'inerd_question': best_match['question'],
                'inerd_chapter': best_match['chapterId'],
                'inerd_subject': best_match['subject'],
            }
            be['question']['modelAnswer'] = best_match['answer']
            # Check if chapter/subject sort is wrong
            current_ch = be['chapterId']
            current_sub = be['subject']
            target_ch = best_match['chapterId']
            target_sub = best_match['subject']
            
            if target_ch and target_ch != current_ch:
                # Mark for potential move
                updates[be['question']['id']]['move_chapter'] = target_ch
            if target_sub and target_sub != current_sub:
                # Check if target subject is valid for current chapter
                if target_sub in valid_subjects.get(current_ch, []):
                    updates[be['question']['id']]['move_subject'] = target_sub
        else:
            flags.append(be['question']['id'])
            updates[be['question']['id']] = {
                'action': 'flag',
                'best_score': best_score,
            }
    
    print(f"Matched (score>=0.55): {len(matched_inerd)}")
    print(f"Flagged: {len(flags)}")
    
    # Find unmatched iNerd essays to add
    unmatched_inerd = [e for e in inerd if id(e) not in matched_inerd]
    print(f"Unmatched iNerd (to add): {len(unmatched_inerd)}")
    
    # Add unmatched iNerd essays
    added = []
    for ie in unmatched_inerd:
        ch_id = ie['chapterId'] or 1
        target_sub = ie['subject']
        valid_subs = valid_subjects.get(ch_id, ['anatomy'])
        sub = map_inered_to_valid_subject(target_sub, valid_subs)
        
        # Generate a unique ID
        ch = next((c for c in bank['chapters'] if c['id'] == ch_id), None)
        if not ch:
            ch_id = 1
            ch = bank['chapters'][0]
        
        sub_obj = next((s for s in ch['subjects'] if s['id'] == sub), None)
        if not sub_obj:
            sub = valid_subs[0]
            sub_obj = next((s for s in ch['subjects'] if s['id'] == sub), ch['subjects'][0])
        
        existing_ids = {q['id'] for c in bank['chapters'] for s in c['subjects'] for q in s['questions']}
        max_num = 1
        prefix = f"mcns2-ch{ch_id}-{sub}-q"
        for qid in existing_ids:
            if qid.startswith(prefix):
                try:
                    num = int(qid.replace(prefix, ''))
                    max_num = max(max_num, num)
                except:
                    pass
        new_id = f"{prefix}{max_num + 1}"
        
        new_q = {
            'id': new_id,
            'type': 'essay',
            'lecture': 1,
            'text': ie['question'],
            'explanation': '',
            'keyConcept': '',
            'modelAnswer': ie['answer'],
        }
        sub_obj['questions'].append(new_q)
        added.append({
            'id': new_id,
            'chapterId': ch_id,
            'subject': sub,
            'question': ie['question'][:60],
        })
    
    print(f"Added: {len(added)}")
    
    # Save bank
    with open(OUT_BANK, 'w', encoding='utf-8') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    with open(CANONICAL_OUT, 'w', encoding='utf-8') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    
    # Save report
    report = {
        'total_bank_essays': len(bank_essays),
        'total_inerd_essays': len(inerd),
        'updated': len(matched_inerd),
        'flagged': len(flags),
        'added': len(added),
        'updates': updates,
        'added_details': added,
    }
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"Saved bank to {OUT_BANK}")
    print(f"Saved report to {REPORT_PATH}")
    
    # Verify count
    total_after = sum(sum(len(s['questions']) for s in c['subjects']) for c in bank['chapters'])
    print(f"Total questions after: {total_after}")

if __name__ == '__main__':
    main()

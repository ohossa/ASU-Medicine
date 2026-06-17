#!/usr/bin/env python3
"""Classify MCNS-2 questions into correct chapter/subject using keyword dictionaries."""
import json, re
from collections import defaultdict
from pathlib import Path

KEYWORD_DICT_PATH = Path('.kimchi/docs/keyword-dictionary.json')
BOOK_TOC_PATH = Path('.kimchi/docs/book-toc.json')
BANK_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json')
OUT_PATH = Path('.kimchi/docs/proposed-mapping.json')
FLAG_PATH = Path('.kimchi/docs/low-confidence-flags.json')

def load_data():
    with open(BOOK_TOC_PATH, 'r', encoding='utf-8') as f:
        book_toc = json.load(f)
    with open(KEYWORD_DICT_PATH, 'r', encoding='utf-8') as f:
        kw_dict = json.load(f)
    with open(BANK_PATH, 'r', encoding='utf-8') as f:
        bank = json.load(f)
    return book_toc, kw_dict, bank

def build_valid_chapter_subjects(book_toc):
    """Return set of (ch_id, sub_id) that are valid per book TOC."""
    valid = set()
    for ch in book_toc['chapters']:
        ch_id = str(ch['id'])
        for sub_id in ch['subjects']:
            valid.add((ch_id, sub_id))
    return valid

def normalize_question(q: dict) -> str:
    """Build a normalized text blob from a question."""
    parts = []
    parts.append(q.get('text', ''))
    # Add options
    if q.get('type') in ('mcq', 'truefalse'):
        parts.extend(q.get('options', []))
    elif q.get('type') == 'matching':
        for pair in q.get('pairs', []):
            parts.append(pair.get('premise', ''))
            parts.append(pair.get('target', ''))
    elif q.get('type') == 'case':
        for sq in q.get('subQuestions', []):
            parts.append(sq.get('text', ''))
            if sq.get('type') == 'mcq':
                parts.extend(sq.get('options', []))
    parts.append(q.get('explanation', ''))
    parts.append(q.get('keyConcept', ''))
    
    text = ' '.join(str(p) for p in parts if p)
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def score_question(text: str, ch_id: str, sub_id: str, kw_dict: dict) -> tuple[float, list[str]]:
    keywords = kw_dict.get(ch_id, {}).get(sub_id, {}).get('keywords', [])
    hits = 0.0
    evidence = []
    for kw in keywords:
        if not kw:
            continue
        kw_lower = kw.lower()
        # Multi-word phrase
        if ' ' in kw_lower:
            if kw_lower in text:
                hits += 3.0
                evidence.append(kw_lower)
        else:
            # Single word
            if f' {kw_lower} ' in f' {text} ':
                hits += 0.5
                evidence.append(kw_lower)
    return hits, evidence

def classify(book_toc, kw_dict, bank):
    valid_pairs = build_valid_chapter_subjects(book_toc)
    
    # Precompute keyword frequency across pairs for weighting
    kw_freq = defaultdict(int)
    for ch_id, subs in kw_dict.items():
        for sub_id, data in subs.items():
            for kw in data.get('keywords', []):
                kw_freq[kw.lower()] += 1
    
    # Build weighted keyword dict
    weighted = {}
    for ch_id, subs in kw_dict.items():
        weighted[ch_id] = {}
        for sub_id, data in subs.items():
            weighted[ch_id][sub_id] = {}
            for kw in data.get('keywords', []):
                kw_lower = kw.lower()
                freq = kw_freq.get(kw_lower, 1)
                weight = 4.0 / freq if ' ' in kw_lower else 0.8 / freq
                weighted[ch_id][sub_id][kw_lower] = weight
    
    mapping = {}
    flags = {}
    total = 0
    
    for chapter in bank['chapters']:
        ch_id = str(chapter['id'])
        for subject in chapter['subjects']:
            sub_id = subject['id']
            for q in subject['questions']:
                qid = q['id']
                text = normalize_question(q)
                
                best_score = -1
                best_ch = None
                best_sub = None
                best_evidence = []
                
                scores = []
                for (vch, vsub) in valid_pairs:
                    score = 0.0
                    ev = []
                    for kw, weight in weighted.get(vch, {}).get(vsub, {}).items():
                        if ' ' in kw:
                            if kw in text:
                                score += weight
                                ev.append(kw)
                        else:
                            if f' {kw} ' in f' {text} ':
                                score += weight
                                ev.append(kw)
                    scores.append((score, vch, vsub, ev))
                
                scores.sort(reverse=True, key=lambda x: x[0])
                best_score, best_ch, best_sub, best_evidence = scores[0]
                second_score = scores[1][0] if len(scores) > 1 else 0
                
                # Confidence = ratio of best to second best
                confidence = best_score / (second_score + 0.1) if second_score > 0 else best_score
                
                mapping[qid] = {
                    'chapterId': int(best_ch),
                    'subject': best_sub,
                    'oldChapterId': int(ch_id),
                    'oldSubject': sub_id,
                    'confidence': round(confidence, 3),
                    'score': round(best_score, 3),
                    'evidence': best_evidence[:5],
                }
                
                if confidence < 2.0 and best_score < 2.0:
                    flags[qid] = mapping[qid]
                
                total += 1
                if total % 500 == 0:
                    print(f"Processed {total} questions...")
    
    return mapping, flags

def main():
    book_toc, kw_dict, bank = load_data()
    mapping, flags = classify(book_toc, kw_dict, bank)
    
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)
    
    with open(FLAG_PATH, 'w', encoding='utf-8') as f:
        json.dump(flags, f, indent=2, ensure_ascii=False)
    
    print(f"Classified {len(mapping)} questions.")
    print(f"Low-confidence flags: {len(flags)}")
    print(f"Mapping saved to {OUT_PATH}")
    print(f"Flags saved to {FLAG_PATH}")
    
    # Show distribution
    dist = defaultdict(lambda: defaultdict(int))
    for qid, data in mapping.items():
        dist[data['chapterId']][data['subject']] += 1
    print("\nProposed distribution:")
    for ch_id in sorted(dist.keys(), key=int):
        for sub_id in sorted(dist[ch_id].keys()):
            print(f"  Ch{ch_id}/{sub_id}: {dist[ch_id][sub_id]}")

if __name__ == '__main__':
    main()

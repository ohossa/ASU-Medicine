import json
import re
import hashlib

def normalize_text(text):
    if not text:
        return ""
    # Remove leading question numbers e.g. "1.", "Q1:", "MCQ 1:"
    t = re.sub(r'^(?:MCQ\s*\d+[:.]?|Q\d+[:.]?|\d+[\.\)]\s*)', '', text.strip(), flags=re.IGNORECASE)
    # Collapse whitespace
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def clean_option(opt):
    if not opt:
        return ""
    # Strip leading option letter e.g. "A.", "a)", "(A)"
    o = re.sub(r'^(?:[A-Fa-f\d][\.\)]|\([A-Fa-f\d]\))\s*', '', opt.strip())
    # Strip trailing single letters like " A" or " c"
    o = re.sub(r'\s+[A-Da-d]$', '', o).strip()
    return o

def fingerprint(text, options):
    norm_text = normalize_text(text).lower()
    norm_opts = sorted([clean_option(o).lower() for o in options if o])
    content = norm_text + " || " + " | ".join(norm_opts)
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

def process_checkpoint(checkpoint_path):
    with open(checkpoint_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data.get('questions', [])
    processed = []
    fingerprints = set()
    duplicates = []
    
    letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5}
    
    for q in questions:
        stem = normalize_text(q.get('question', ''))
        raw_opts = [
            q.get('optionA', ''),
            q.get('optionB', ''),
            q.get('optionC', ''),
            q.get('optionD', ''),
            q.get('optionE', ''),
            q.get('optionF', '')
        ]
        clean_opts = [clean_option(o) for o in raw_opts if o and o.strip()]
        
        # Determine correct index
        ans_char = q.get('correctAnswer', '').strip().upper()
        if ans_char in letter_map and letter_map[ans_char] < len(clean_opts):
            corr_idx = letter_map[ans_char]
        else:
            corr_idx = 0
            
        fp = fingerprint(stem, clean_opts)
        if fp in fingerprints:
            duplicates.append({
                'id': q.get('id'),
                'stem': stem,
                'source': q.get('sourcePdf'),
                'page': q.get('sourcePage')
            })
            continue
            
        fingerprints.add(fp)
        
        # Clinical explanation
        expl = q.get('explanation', '').strip()
        if not expl or 'Review the related lecture' in expl:
            expl = f"The correct answer is {clean_opts[corr_idx] if corr_idx < len(clean_opts) else ''}. This question evaluates core musculoskeletal concepts in {q.get('topic', 'Locomotor System')}."
            
        # Key concept
        raw_kc = q.get('keyConcepts', [])
        if isinstance(raw_kc, list) and len(raw_kc) > 0:
            kc = raw_kc[0].strip()
        elif isinstance(raw_kc, str) and raw_kc.strip():
            kc = raw_kc.strip()
        else:
            kc = f"High-yield {q.get('topic', 'Locomotor')}: {stem[:80]} → {clean_opts[corr_idx] if corr_idx < len(clean_opts) else ''}"
            
        processed.append({
            'sourceId': q.get('id'),
            'type': 'mcq',
            'text': stem,
            'options': clean_opts,
            'correctIndex': corr_idx,
            'explanation': expl,
            'keyConcept': kc,
            'topic': q.get('topic', 'Locomotor General'),
            'sourcePdf': q.get('sourcePdf'),
            'sourcePage': q.get('sourcePage'),
            'fingerprint': fp
        })
        
    print(f"Processed {len(processed)} unique MCQs from checkpoint ({len(duplicates)} duplicates).")
    return processed, duplicates

if __name__ == '__main__':
    p = "/Users/omarhossa/Documents/Pulse Questions/Year 1 (57CP 1020 Marks)/Semester 2 (30CP 540 Marks)/Locomotor Q's/MLS-1_v4_strict_checkpoint_881.json"
    proc, dups = process_checkpoint(p)
    print("Sample question 0:")
    print(json.dumps(proc[0], indent=2))

#!/usr/bin/env python3
"""TF-IDF based classifier for MCNS-2 question bank."""
import json, re, math
from collections import defaultdict, Counter
from pathlib import Path

BOOK_TOC_PATH = Path('.kimchi/docs/book-toc.json')
ANKI_PATH = Path('/Users/omarhossa/Downloads/CNS anki .txt')
BANK_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json')
OUT_PATH = Path('.kimchi/docs/proposed-mapping.json')
FLAG_PATH = Path('.kimchi/docs/low-confidence-flags.json')

with open(BOOK_TOC_PATH, 'r', encoding='utf-8') as f:
    book_toc = json.load(f)
with open(BANK_PATH, 'r', encoding='utf-8') as f:
    bank = json.load(f)

# Build valid pairs
valid_pairs = set()
for ch in book_toc['chapters']:
    ch_id = str(ch['id'])
    for sub_id in ch['subjects']:
        valid_pairs.add((ch_id, sub_id))

def tokenize(text: str) -> list[str]:
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    words = text.split()
    return [w for w in words if len(w) > 2 and w not in {
        'the', 'and', 'for', 'are', 'with', 'from', 'this', 'that', 'into', 'they',
        'their', 'there', 'have', 'been', 'were', 'said', 'each', 'which', 'will',
        'about', 'also', 'more', 'than', 'when', 'what', 'how', 'not', 'but', 'can',
        'has', 'had', 'may', 'all', 'one', 'two', 'three', 'after', 'other', 'many',
        'such', 'was', 'did', 'does', 'would', 'should', 'could', 'most', 'some',
        'only', 'its', 'use', 'used', 'using', 'due', 'via', 'per', 'over', 'under'
    }]

def normalize_question(q: dict) -> list[str]:
    parts = [q.get('text', '')]
    if q.get('type') in ('mcq', 'truefalse'):
        parts.extend(q.get('options', []))
    elif q.get('type') == 'matching':
        for pair in q.get('pairs', []):
            parts.append(pair.get('premise', ''))
            parts.append(pair.get('target', ''))
    elif q.get('type') == 'case':
        for sq in q.get('subQuestions', []):
            parts.append(sq.get('text', ''))
    parts.append(q.get('explanation', ''))
    parts.append(q.get('keyConcept', ''))
    text = ' '.join(str(p) for p in parts if p)
    return tokenize(text)

def normalize_anki(text: str) -> list[str]:
    text = re.sub(r'\{\{c\d+::(.*?)\}\}', r'\1', text)
    text = text.replace('&nbsp;', ' ')
    text = re.sub(r'<[^>]+>', ' ', text)
    return tokenize(text)

# Build reference documents
print("Building reference documents from Anki...")
ref_texts = defaultdict(list)  # (ch, sub) -> tokens
ref_raw_text = defaultdict(list)

with open(ANKI_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith('#') or '::Practical::' in line:
            continue
        cols = line.split('\t')
        if len(cols) < 3:
            continue
        deck = cols[0]
        m = re.search(r'Chapter\s+(\d+)', deck, re.I)
        if not m:
            m = re.search(r'Unit\s+(\d+)', deck, re.I)
        if not m:
            continue
        ch = m.group(1)
        # Special case: Chapter 5 is all anatomy
        if ch == '5':
            sub = 'anatomy'
        else:
            sub = None
            parts = deck.split('::')
            for i, p in enumerate(parts):
                p_clean = p.strip()
                if re.match(r'Chapter\s+\d+|Unit\s+\d+', p_clean, re.I) and i + 1 < len(parts):
                    candidate = parts[i + 1].strip()
                    if candidate == 'Biochemistry':
                        sub = 'biochem'
                    elif candidate == 'Physiology':
                        sub = 'physiology'
                    elif candidate == 'Anatomy':
                        sub = 'anatomy'
                    elif candidate == 'Histology':
                        sub = 'histology'
                    elif candidate == 'Pharmacology':
                        sub = 'pharma'
                    elif candidate == 'Pathology':
                        sub = 'pathology'
                    elif candidate == 'Microbiology':
                        sub = 'microbiology'
                    elif candidate == 'Parasitology':
                        sub = 'parasitology'
                    elif candidate == 'Neurology':
                        sub = 'clinical'
                    elif candidate == 'Clinical':
                        sub = 'clinical'
                    elif candidate == 'Embryology':
                        sub = 'anatomy'
        if not sub:
            continue
        content = ' '.join(cols[2:12])
        tokens = normalize_anki(content)
        if (ch, sub) in valid_pairs:
            ref_texts[(ch, sub)].extend(tokens)
            ref_raw_text[(ch, sub)].append(content)

# Add book TOC topics as reference text
for chapter in book_toc['chapters']:
    ch_id = str(chapter['id'])
    for sub_id, topics in chapter['subjects'].items():
        for topic in topics:
            tokens = tokenize(topic)
            ref_texts[(ch_id, sub_id)].extend(tokens)
            ref_raw_text[(ch_id, sub_id)].append(topic)

# Compute term frequencies for references
ref_freqs = {}
for key, tokens in ref_texts.items():
    ref_freqs[key] = Counter(tokens)

# Compute document frequency: how many refs contain each word
N = len(ref_freqs)
df = defaultdict(int)
for counter in ref_freqs.values():
    for word in counter:
        df[word] += 1

def idf(word):
    d = df.get(word, 1)
    return math.log(N / d) + 1.0

# Build reference TF-IDF vectors
ref_vectors = {}
for key, counter in ref_freqs.items():
    vec = {}
    total = sum(counter.values())
    for word, count in counter.items():
        tf = count / total
        vec[word] = tf * idf(word)
    ref_vectors[key] = vec

# Normalize vectors
ref_norms = {}
for key, vec in ref_vectors.items():
    norm = math.sqrt(sum(v**2 for v in vec.values()))
    ref_norms[key] = norm if norm > 0 else 1

def score_question(q_tokens: list[str]) -> list[tuple[float, str, str]]:
    q_counter = Counter(q_tokens)
    total = sum(q_counter.values())
    if total == 0:
        return []
    q_vec = {}
    for word, count in q_counter.items():
        tf = count / total
        q_vec[word] = tf * idf(word)
    q_norm = math.sqrt(sum(v**2 for v in q_vec.values()))
    if q_norm == 0:
        return []
    
    scores = []
    for key, r_vec in ref_vectors.items():
        if key not in valid_pairs:
            continue
        dot = sum(q_vec.get(w, 0) * r_vec.get(w, 0) for w in set(q_vec) & set(r_vec))
        sim = dot / (q_norm * ref_norms[key])
        scores.append((sim, key[0], key[1]))
    scores.sort(reverse=True)
    return scores

print(f"Classifying questions using {N} reference documents...")
mapping = {}
flags = {}
total = 0

for chapter in bank['chapters']:
    ch_id = str(chapter['id'])
    for subject in chapter['subjects']:
        sub_id = subject['id']
        for q in subject['questions']:
            qid = q['id']
            tokens = normalize_question(q)
            scores = score_question(tokens)
            if not scores:
                # fallback: keep in place or flag
                mapping[qid] = {
                    'chapterId': int(ch_id), 'subject': sub_id,
                    'oldChapterId': int(ch_id), 'oldSubject': sub_id,
                    'confidence': 0, 'score': 0, 'evidence': []
                }
                flags[qid] = mapping[qid]
                total += 1
                continue
            
            best_score, best_ch, best_sub = scores[0]
            second_score = scores[1][0] if len(scores) > 1 else 0
            confidence = best_score / (second_score + 0.001) if second_score > 0 else best_score * 10
            
            # Get evidence: top matching words
            evidence = []
            q_counter = Counter(tokens)
            for word in q_counter:
                best_vec = ref_vectors.get((best_ch, best_sub), {})
                if word in best_vec:
                    evidence.append((word, best_vec[word] * q_counter[word]))
            evidence.sort(key=lambda x: -x[1])
            
            mapping[qid] = {
                'chapterId': int(best_ch),
                'subject': best_sub,
                'oldChapterId': int(ch_id),
                'oldSubject': sub_id,
                'confidence': round(min(confidence, 99.9), 3),
                'score': round(best_score, 5),
                'evidence': [w for w, _ in evidence[:8]],
            }
            
            if confidence < 2.0:
                flags[qid] = mapping[qid]
            
            total += 1
            if total % 500 == 0:
                print(f"Processed {total}/{sum(sum(len(s['questions']) for s in c['subjects']) for c in bank['chapters'])}...")

OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(mapping, f, indent=2, ensure_ascii=False)
with open(FLAG_PATH, 'w', encoding='utf-8') as f:
    json.dump(flags, f, indent=2, ensure_ascii=False)

print(f"Classified {total} questions.")
print(f"Low-confidence flags: {len(flags)}")

# Distribution
dist = defaultdict(lambda: defaultdict(int))
for qid, d in mapping.items():
    dist[d['chapterId']][d['subject']] += 1
print("\nProposed distribution:")
for ch in sorted(dist.keys(), key=int):
    for sub in sorted(dist[ch].keys()):
        print(f"  Ch{ch}/{sub}: {dist[ch][sub]}")

#!/usr/bin/env python3
"""Parse CNS Anki file to extract keywords per chapter/subject."""
import json, re
from collections import defaultdict
from pathlib import Path

ANKI_PATH = Path('/Users/omarhossa/Downloads/CNS anki .txt')
OUT_PATH = Path('.kimchi/docs/anki-keywords.json')

# Map Anki subject names to schema subject IDs
SUBJECT_MAP = {
    'Anatomy': 'anatomy',
    'Histology': 'histology',
    'Physiology': 'physiology',
    'Biochemistry': 'biochem',
    'Microbiology': 'microbiology',
    'Parasitology': 'parasitology',
    'Pathology': 'pathology',
    'Pharmacology': 'pharma',
    'Neurology': 'clinical',
    'Clinical': 'clinical',
    'Embryology': 'anatomy',
    'Psychiatry': 'clinical',
}

def extract_text(content: str) -> str:
    text = re.sub(r'\{\{c\d+::(.*?)\}\}', r'\1', content)
    text = text.replace('&nbsp;', ' ')
    text = re.sub(r'<[^>]+>', ' ', text)
    return text.strip()

def parse_deck_path(path: str) -> tuple[str | None, str | None]:
    """Return (chapter, subject_id) or (None, None) if unparseable"""
    parts = [p.strip() for p in path.split('::')]
    # Ignore practical cards
    if any('practical' in p.lower() for p in parts):
        return None, None
    
    # Find chapter
    chapter = None
    for i, p in enumerate(parts):
        m = re.match(r'Chapter\s+(\d+)', p, re.I)
        if m:
            chapter = f"Chapter {m.group(1)}"
            # Special case: Chapter 5 is all anatomy
            if m.group(1) == '5':
                return chapter, 'anatomy'
            # Look for subject after Chapter N
            for j in range(i + 1, len(parts)):
                if parts[j] in SUBJECT_MAP:
                    return chapter, SUBJECT_MAP[parts[j]]
            return chapter, None
        m = re.match(r'Unit\s+(\d+)', p, re.I)
        if m:
            chapter = f"Chapter {m.group(1)}"
            for j in range(i + 1, len(parts)):
                if parts[j] in SUBJECT_MAP:
                    return chapter, SUBJECT_MAP[parts[j]]
            return chapter, None
    return None, None

def get_topic_keywords(parts: list[str]) -> set[str]:
    """Extract topic names from the tail of the deck path."""
    skip = {
        'Medicine ASU', 'Year 2', 'Semester 2', 'Central Nervous System',
        'Part 1', 'Part 2',
    }
    keywords = set()
    for p in parts:
        if p in skip or re.match(r'Chapter\s+\d+', p, re.I) or re.match(r'Unit\s+\d+', p, re.I):
            continue
        if p in SUBJECT_MAP:
            continue
        # Keep alphanumeric tokens
        keywords.add(p.lower())
    return keywords

chapter_keywords = defaultdict(lambda: defaultdict(set))
records = 0
skipped_practical = 0
skipped_unknown = 0
chapter_subject_counts = defaultdict(int)

def get_words(text: str) -> list[str]:
    words = []
    for w in re.findall(r"[A-Za-z][A-Za-z0-9\-/]+", text):
        if len(w) > 2 and w.lower() not in {
            'the', 'and', 'for', 'are', 'with', 'from', 'this', 'that', 'into', 'they',
            'their', 'there', 'have', 'been', 'were', 'said', 'each', 'which', 'will',
            'about', 'also', 'more', 'than', 'when', 'what', 'how', 'not', 'but', 'can',
            'has', 'had', 'may', 'all', 'one', 'two', 'three', 'after', 'other', 'many',
            'such', 'was', 'did', 'does', 'doesn', 'would', 'should', 'could'
        }:
            words.append(w.lower())
    return words

with open(ANKI_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.rstrip('\n')
        if not line or line.startswith('#'):
            continue
        cols = line.split('\t')
        if len(cols) < 3:
            continue
        deck_path = cols[0]
        chapter, subject = parse_deck_path(deck_path)
        if chapter is None and 'practical' in deck_path.lower():
            skipped_practical += 1
            continue
        if chapter is None or subject is None:
            skipped_unknown += 1
            continue
        
        chapter_subject_counts[f"{chapter}/{subject}"] += 1
        
        content = ' '.join(cols[2:12])
        text = extract_text(content)
        parts = [p.strip() for p in deck_path.split('::')]
        
        # Add topic keywords from deck path
        for kw in get_topic_keywords(parts):
            chapter_keywords[chapter][subject].add(kw)
        
        # Add words from card content
        for w in get_words(text):
            chapter_keywords[chapter][subject].add(w)
        
        records += 1

print(f"Parsed {records} theory cards.")
print(f"Skipped practical: {skipped_practical}")
print(f"Skipped unknown: {skipped_unknown}")
print(f"Chapter/subject breakdown:")
for key, count in sorted(chapter_subject_counts.items()):
    print(f"  {key}: {count}")

result = {}
for ch, subjects in sorted(chapter_keywords.items()):
    result[ch] = {sub: sorted(list(words)) for sub, words in sorted(subjects.items())}

OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

print(f"Output written to {OUT_PATH}")

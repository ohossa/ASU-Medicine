#!/usr/bin/env python3
"""Merge book TOC topics and Anki keywords into unified keyword dictionaries."""
import json
from collections import defaultdict
from pathlib import Path

BOOK_TOC_PATH = Path('.kimchi/docs/book-toc.json')
ANKI_KEYWORDS_PATH = Path('.kimchi/docs/anki-keywords.json')
OUT_PATH = Path('.kimchi/docs/keyword-dictionary.json')

with open(BOOK_TOC_PATH, 'r', encoding='utf-8') as f:
    book_toc = json.load(f)
with open(ANKI_KEYWORDS_PATH, 'r', encoding='utf-8') as f:
    anki_keywords = json.load(f)

# Build unified dictionary: chapter_id -> subject_id -> {keywords: [...]}
result = defaultdict(lambda: defaultdict(lambda: {"keywords": set(), "sources": []}))

# Process book TOC
for chapter in book_toc['chapters']:
    ch_id = str(chapter['id'])
    for subject_id, topics in chapter['subjects'].items():
        for topic in topics:
            # Tokenize topic into keywords
            words = [w.lower() for w in topic.split() if len(w) > 2]
            for w in words:
                result[ch_id][subject_id]["keywords"].add(w)
            # Add full topic phrase as keyword
            result[ch_id][subject_id]["keywords"].add(topic.lower())
            result[ch_id][subject_id]["sources"].append(f"book:{topic}")

# Process Anki keywords
for ch_name, subjects in anki_keywords.items():
    ch_id = ch_name.replace("Chapter ", "")
    for subject_id, keywords in subjects.items():
        for kw in keywords:
            result[ch_id][subject_id]["keywords"].add(kw.lower())
        result[ch_id][subject_id]["sources"].append(f"anki:{ch_name}/{subject_id}")

# Convert sets to sorted lists for JSON serialization
output = {}
for ch_id, subjects in sorted(result.items(), key=lambda x: int(x[0])):
    output[ch_id] = {}
    for subject_id, data in sorted(subjects.items()):
        output[ch_id][subject_id] = {
            "keywords": sorted(list(data["keywords"])),
            "keyword_count": len(data["keywords"]),
            "sources": list(set(data["sources"]))
        }

OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"Merged keyword dictionary saved to {OUT_PATH}")
print(f"Chapters covered: {list(output.keys())}")
for ch_id, subjects in output.items():
    for sub_id, data in subjects.items():
        print(f"  Ch{ch_id}/{sub_id}: {data['keyword_count']} keywords")

#!/usr/bin/env python3
"""Filter keyword dictionary to keep only unique/rare keywords."""
import json
from collections import defaultdict
from pathlib import Path

KW_PATH = Path('.kimchi/docs/keyword-dictionary.json')
BOOK_TOC_PATH = Path('.kimchi/docs/book-toc.json')
OUT_PATH = Path('.kimchi/docs/keyword-dictionary-filtered.json')

with open(KW_PATH, 'r', encoding='utf-8') as f:
    kw_dict = json.load(f)

# Count frequency: how many (chapter, subject) pairs contain each keyword
freq = defaultdict(int)
for ch_id, subs in kw_dict.items():
    for sub_id, data in subs.items():
        for kw in data.get('keywords', []):
            freq[kw.lower()] += 1

# Build filtered dictionary
MAX_FREQ_SINGLE_WORD = 2   # Single words must appear in <= 2 pairs
MAX_FREQ_MULTI_WORD = 4    # Multi-word phrases must appear in <= 4 pairs

filtered = {}
total_before = 0
total_after = 0
for ch_id, subs in kw_dict.items():
    filtered[ch_id] = {}
    for sub_id, data in subs.items():
        filtered[ch_id][sub_id] = {"keywords": [], "sources": data.get("sources", [])}
        for kw in data.get('keywords', []):
            f = freq.get(kw.lower(), 1)
            total_before += 1
            if ' ' in kw.lower():
                if f <= MAX_FREQ_MULTI_WORD:
                    filtered[ch_id][sub_id]["keywords"].append(kw)
                    total_after += 1
            else:
                if f <= MAX_FREQ_SINGLE_WORD:
                    filtered[ch_id][sub_id]["keywords"].append(kw)
                    total_after += 1

with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(filtered, f, indent=2, ensure_ascii=False)

print(f"Total keywords before: {total_before}")
print(f"Total keywords after: {total_after}")
print(f"Removed: {total_before - total_after}")
for ch_id, subs in sorted(filtered.items(), key=lambda x: int(x[0])):
    for sub_id, data in subs.items():
        print(f"  Ch{ch_id}/{sub_id}: {len(data['keywords'])} keywords")

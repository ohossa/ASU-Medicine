#!/usr/bin/env python3
"""Audit keyword dictionary for overlap and uniqueness."""
import json
from collections import defaultdict
from pathlib import Path

KW_PATH = Path('.kimchi/docs/keyword-dictionary.json')
OUT_PATH = Path('.kimchi/docs/keyword-audit.json')

with open(KW_PATH, 'r', encoding='utf-8') as f:
    kw_dict = json.load(f)

# Build reverse index: keyword -> list of (ch, sub)
reverse = defaultdict(list)
for ch_id, subjects in kw_dict.items():
    for sub_id, data in subjects.items():
        for kw in data['keywords']:
            reverse[kw].append((ch_id, sub_id))

# Find overlaps
overlaps = {}
for kw, locations in reverse.items():
    if len(locations) > 1:
        overlaps[kw] = locations

# Summarize
same_chapter_diff_subject = defaultdict(list)  # kw -> [(ch, sub1), (ch, sub2)]
diff_chapter_same_subject = defaultdict(list)  # kw -> [(ch1, sub), (ch2, sub)]
diff_chapter_diff_subject = defaultdict(list)  # kw -> [(ch1, sub1), (ch2, sub2)]

for kw, locations in overlaps.items():
    chapters = set(ch for ch, sub in locations)
    subjects = set(sub for ch, sub in locations)
    if len(chapters) == 1 and len(subjects) > 1:
        same_chapter_diff_subject[kw] = locations
    elif len(chapters) > 1 and len(subjects) == 1:
        diff_chapter_same_subject[kw] = locations
    else:
        diff_chapter_diff_subject[kw] = locations

print(f"Total keywords: {len(reverse)}")
print(f"Unique keywords (appear in exactly 1 location): {len([k for k,v in reverse.items() if len(v)==1])}")
print(f"Overlapping keywords: {len(overlaps)}")
print(f"  Same chapter, different subject: {len(same_chapter_diff_subject)}")
print(f"  Different chapter, same subject: {len(diff_chapter_same_subject)}")
print(f"  Different chapter, different subject: {len(diff_chapter_diff_subject)}")

print("\nTop overlapping keywords (different chapter, same subject) — these reduce chapter discrimination:")
sorted_diff_ch_same_sub = sorted(diff_chapter_same_subject.items(), key=lambda x: len(x[1]), reverse=True)[:20]
for kw, locs in sorted_diff_ch_same_sub:
    print(f"  '{kw}' -> {locs}")

print("\nTop overlapping keywords (different chapter, different subject) — most ambiguous:")
sorted_diff_ch_diff_sub = sorted(diff_chapter_diff_subject.items(), key=lambda x: len(x[1]), reverse=True)[:20]
for kw, locs in sorted_diff_ch_diff_sub:
    print(f"  '{kw}' -> {locs}")

# Save audit
audit = {
    "summary": {
        "total_keywords": len(reverse),
        "unique": len([k for k,v in reverse.items() if len(v)==1]),
        "overlapping": len(overlaps),
        "same_chapter_diff_subject": len(same_chapter_diff_subject),
        "diff_chapter_same_subject": len(diff_chapter_same_subject),
        "diff_chapter_diff_subject": len(diff_chapter_diff_subject),
    },
    "ambiguous_keywords": {
        kw: locs for kw, locs in sorted(overlaps.items(), key=lambda x: len(x[1]), reverse=True)[:100]
    }
}
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(audit, f, indent=2, ensure_ascii=False)
print(f"\nAudit saved to {OUT_PATH}")

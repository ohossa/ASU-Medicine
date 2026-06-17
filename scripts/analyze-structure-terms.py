#!/usr/bin/env python3
import json
from collections import defaultdict

bank = json.load(open('src/imports/year-2/semester-2/MCNS-2.json'))

terms = ['cerebellum', 'basal ganglia', 'dorsal column', 'spinothalamic', 'pons', 'thalamus', 'brain stem', 'brainstem', 'reticular formation']

results = defaultdict(list)
for ch in bank['chapters']:
    ch_id = ch['id']
    for sub in ch['subjects']:
        sub_id = sub['id']
        for q in sub['questions']:
            text = ' '.join([q.get('text',''), ' '.join(q.get('options',[])), q.get('explanation',''), q.get('keyConcept','')]).lower()
            for term in terms:
                if term in text:
                    results[term].append((ch_id, sub_id, q['id'], q.get('text','')[:60]))

for term in terms:
    if not results[term]:
        continue
    print(f"\n=== '{term}' ===  ({len(results[term])} questions)")
    ch_sub_counts = defaultdict(int)
    for ch_id, sub_id, qid, txt in results[term]:
        ch_sub_counts[f"Ch{ch_id}/{sub_id}"] += 1
    for loc, count in sorted(ch_sub_counts.items()):
        print(f"  {loc}: {count}")

#!/usr/bin/env python3
"""
Integrate Packet 050 Verified Questions into Live MUG-3 Bank
============================================================
1. Ingests 23 source-grounded, textbook-verified physiology essay questions
   from Packet 050 into src/imports/year-3/semester-1/MUG-3.json.
2. Catalogs the 27 excluded fragments / damaged items into exclusion-ledger.json.
3. Records all 23 repairs in held-questions-repair-ledger.json.
4. Updates bankManifest.json question counts and chapter summaries.
"""

import json
import os
from pathlib import Path

BASE_DIR = Path('/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal')
VERIF_DIR = Path('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/2026-11-20-MUG-3-verification')

BANK_PATH = BASE_DIR / 'src/imports/year-3/semester-1/MUG-3.json'
EXCLUSION_PATH = BASE_DIR / 'docs/verification/urogenital-import/exclusion-ledger.json'
REPAIR_LEDGER_PATH = BASE_DIR / 'docs/verification/urogenital-import/held-questions-repair-ledger.json'
MANIFEST_PATH = BASE_DIR / 'src/app/generated/bankManifest.json'

DRAFTS_PATH = VERIF_DIR / 'REVIEW/full-bank/packet-050-repair-drafts.json'
DECISIONS_PATH = VERIF_DIR / 'REVIEW/full-bank/packet-050-decisions.json'

def main():
    print("=" * 70)
    print("INTEGRATING PACKET 050 VERIFIED QUESTIONS")
    print("=" * 70)

    # 1. Load active bank
    with open(BANK_PATH, 'r', encoding='utf-8') as f:
        bank = json.load(f)

    existing_ids = set()
    for ch in bank['chapters']:
        for sub in ch['subjects']:
            for q in sub['questions']:
                existing_ids.add(q['id'])
    print(f"Current active questions in MUG-3.json: {len(existing_ids)}")

    # 2. Load drafts & decisions
    with open(DRAFTS_PATH, 'r', encoding='utf-8') as f:
        drafts = json.load(f)
    with open(DECISIONS_PATH, 'r', encoding='utf-8') as f:
        decisions = json.load(f)

    repaired_by_id = {d['id']: d for d in drafts}
    decisions_by_id = {d['id']: d for d in decisions}

    # 3. Locate Chapter 3 Physiology
    ch3 = next(c for c in bank['chapters'] if c['id'] == 3)
    phys = next(s for s in ch3['subjects'] if s['id'] == 'physiology')

    added_questions = []
    repair_records = []
    for d in drafts:
        pq = d['proposedQuestion']
        qid = pq['id']
        assert qid not in existing_ids, f"Collision on {qid}!"
        phys['questions'].append(pq)
        existing_ids.add(qid)
        added_questions.append(qid)
        repair_records.append({
            'id': qid,
            'chapterId': 3,
            'subjectId': 'physiology',
            'type': 'essay',
            'lecture': pq['lecture'],
            'originalStem': d['reason'],
            'repairedStem': pq['text'],
            'explanationLength': len(pq['explanation'])
        })

    print(f"Added {len(added_questions)} verified essay questions to Chapter 3 Physiology.")

    # 4. Save updated bank
    with open(BANK_PATH, 'w', encoding='utf-8') as f:
        json.dump(bank, f, ensure_ascii=False, indent=2)
    print(f"Updated MUG-3.json saved with total {len(existing_ids)} active questions.")

    # 5. Catalog exclusions
    with open(EXCLUSION_PATH, 'r', encoding='utf-8') as f:
        exclusions = json.load(f)

    excluded_ids = set(decisions_by_id.keys()) - set(repaired_by_id.keys())
    print(f"Cataloging {len(excluded_ids)} excluded fragments / damaged items...")

    for qid in sorted(excluded_ids):
        dec = decisions_by_id[qid]
        exclusions.append({
            'sourceFile': 'Physiology/Physiology URO.pdf' if 'PHYS' in qid and int(qid.split('-')[-1]) <= 277 else 'Comprehensive Banks/UG_NERD mcqs.pdf',
            'sourceOccurrence': dec['sourceLocations'][0]['occurrenceId'] if dec['sourceLocations'] else 'S187',
            'stem': (dec.get('historicalAnswer') or '')[:100],
            'reason': 'corrupt_extraction_or_fragment',
            'details': f"Question {qid}: {dec['reason']}"
        })

    with open(EXCLUSION_PATH, 'w', encoding='utf-8') as f:
        json.dump(exclusions, f, ensure_ascii=False, indent=2)
    print(f"Updated exclusion ledger: now {len(exclusions)} total entries.")

    # 6. Update repairs ledger
    with open(REPAIR_LEDGER_PATH, 'r', encoding='utf-8') as f:
        repairs = json.load(f)
    repairs.extend(repair_records)
    with open(REPAIR_LEDGER_PATH, 'w', encoding='utf-8') as f:
        json.dump(repairs, f, ensure_ascii=False, indent=2)
    print(f"Updated repair ledger: now {len(repairs)} total entries.")

    # 7. Update bankManifest.json
    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    if 'MUG-3' in manifest:
        mug3_entry = manifest['MUG-3']
        mug3_entry['questionCount'] = len(existing_ids)
        mug3_entry['essayCount'] = mug3_entry.get('essayCount', 0) + len(added_questions)
        for ch_info in mug3_entry.get('chapters', []):
            if ch_info.get('id') == 3:
                ch_info['questionCount'] = sum(len(s['questions']) for s in ch3['subjects'])

    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print("Updated bankManifest.json successfully.")

if __name__ == '__main__':
    main()

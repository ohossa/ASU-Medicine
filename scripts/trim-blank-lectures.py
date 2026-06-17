#!/usr/bin/env python3
"""Remove extra blank lectures (generic 'Lecture N' fillers) from MCNS-2."""

import json

BANK_IMPORT = 'src/imports/year-2/semester-2/MCNS-2.json'
BANK_CANON = 'data-format-v2/question-bank-mcns2/question-bank-mcns2.json'


def trim_bank(path):
    with open(path) as f:
        bank = json.load(f)

    for ch in bank['chapters']:
        for subj in ch['subjects']:
            names = subj.get('lectureNames', [])
            # Keep only real names (exclude generic 'Lecture N' fillers)
            real_names = [n for n in names if not n.startswith('Lecture ')]
            if real_names and len(real_names) < len(names):
                print(f"ch{ch['id']} {subj['id']:12}: {len(names)} -> {len(real_names)} : {real_names}")
                subj['lectureCount'] = len(real_names)
                subj['lectureNames'] = real_names

    with open(path, 'w') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)


if __name__ == '__main__':
    for p in [BANK_IMPORT, BANK_CANON]:
        trim_bank(p)

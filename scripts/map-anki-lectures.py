#!/usr/bin/env python3
"""Map Anki deck names to bank lecture names and update MCNS-2.json."""

import json, re
from collections import defaultdict

ANKI_PATH = '/Users/omarhossa/Downloads/CNS anki .txt'
BANK_IMPORT = 'src/imports/year-2/semester-2/MCNS-2.json'
BANK_CANON = 'data-format-v2/question-bank-mcns2/question-bank-mcns2.json'

SUBJECT_MAP = {
    'anatomy': 'anatomy',
    'anatomy of the neck': 'anatomy',
    'histology': 'histology',
    'physiology': 'physiology',
    'biochemistry': 'biochem',
    'pharmacology': 'pharma',
    'pathology': 'pathology',
    'microbiology': 'microbiology',
    'parasitology': 'parasitology',
    'psychiatry': 'psychiatry',
    'embryology': 'embryology',
    'neurology': 'clinical',
    'clinical': 'clinical',
}

def parse_decks():
    lines = open(ANKI_PATH).read().splitlines()
    lines = [l for l in lines if not l.startswith('#')]
    groups = defaultdict(lambda: defaultdict(set))

    for line in lines:
        parts = line.split('\t')
        if not parts:
            continue
        deck = parts[0]
        if 'Practical' in deck:
            continue
        segs = deck.split('::')
        chapter = None
        subject = None
        for i, seg in enumerate(segs):
            s = seg.strip().lower()
            if s.startswith('chapter'):
                m = re.search(r'\d+', s)
                chapter = int(m.group()) if m else None
            elif s.startswith('unit'):
                m = re.search(r'\d+', s)
                chapter = int(m.group()) if m else None
            elif chapter is not None and i > 0:
                # After chapter marker, next segment is subject-ish
                if segs[i-1].lower().startswith(('chapter', 'unit')):
                    subject = seg.strip().lower()
                    lecture_parts = segs[i+1:]
                    lecture_name = ': '.join(lecture_parts) if lecture_parts else seg.strip()
                    mapped = SUBJECT_MAP.get(subject, subject)
                    if chapter and mapped and lecture_name:
                        groups[chapter][mapped].add(lecture_name)

    return groups

def clean_name(name):
    # Remove trailing numbers like "Pain 1" -> "Pain" if there's a parent
    return name.strip()

def update_bank(path):
    with open(path) as f:
        bank = json.load(f)

    groups = parse_decks()
    updates = 0

    for ch in bank['chapters']:
        ch_id = ch['id']
        for subj in ch['subjects']:
            subj_id = subj['id']
            names = sorted(groups.get(ch_id, {}).get(subj_id, set()))
            if names:
                # Use all Anki deck names; lectureCount = number of decks.
                # Pad with generic only if question lecture numbers exceed deck count.
                lecture_nums = set(
                    q.get('lecture', 1) for q in subj['questions']
                )
                max_lec = max(lecture_nums) if lecture_nums else len(names)
                while len(names) < max_lec:
                    names.append(f'Lecture {len(names) + 1}')
                subj['lectureCount'] = len(names)
                subj['lectureNames'] = names
                updates += 1
            else:
                # Still need a sensible lectureCount from question data
                lecture_nums = set(
                    q.get('lecture', 1) for q in subj['questions']
                )
                if lecture_nums:
                    subj['lectureCount'] = max(lecture_nums)
                    subj['lectureNames'] = [f'Lecture {i}' for i in range(1, subj['lectureCount'] + 1)]
                    updates += 1

    with open(path, 'w') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)

    return updates

if __name__ == '__main__':
    for p in [BANK_IMPORT, BANK_CANON]:
        n = update_bank(p)
        print(f'Updated {n} subjects in {p}')

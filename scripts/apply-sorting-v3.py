#!/usr/bin/env python3
"""Conservative CNS sorter: fix unauthorized subjects + structural term routing."""
import json, shutil, re
from pathlib import Path

BANK_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json')
MAPPING_PATH = Path('.kimchi/docs/proposed-mapping.json')
BOOK_TOC_PATH = Path('.kimchi/docs/book-toc.json')
CANONICAL_OUT = Path('data-format-v2/question-bank-mcns2/question-bank-mcns2-resorted.json')
IMPORT_OUT = Path('src/imports/year-2/semester-2/MCNS-2.json')
BACKUP_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json.bak')

with open(BOOK_TOC_PATH, 'r', encoding='utf-8') as f:
    book_toc = json.load(f)
with open(BANK_PATH, 'r', encoding='utf-8') as f:
    bank = json.load(f)
with open(MAPPING_PATH, 'r', encoding='utf-8') as f:
    mapping = json.load(f)

book_chapters = {}
for ch in book_toc['chapters']:
    book_chapters[ch['id']] = {
        'title': ch['title'],
        'subjects': set(ch['subjects'].keys()),
    }

# Structural terms → home chapter (for questions whose MAIN text contains them)
STRUCTURAL_HOME = {
    'cerebellum': 3,
    'cerebellar peduncle': 3,
    'basal ganglia': 3,
    'caudate nucleus': 3,
    'putamen': 3,
    'globus pallidus': 3,
    'substantia nigra': 3,
    'striatum': 3,
    'subthalamic nucleus': 3,
    'internal capsule': 3,
    'dorsal column': 2,
    'spinothalamic': 2,
    'spinocerebellar': 2,
    'fasciculus gracilis': 2,
    'fasciculus cuneatus': 2,
    'pons': 4,
    'medulla oblongata': 4,
    'medulla': 4,
    'midbrain': 4,
    'brain stem': 4,
    'brainstem': 4,
    'pyramidal decussation': 4,
    'sensory decussation': 4,
    'olive': 4,
    'superior colliculus': 4,
    'inferior colliculus': 4,
    'nucleus solitarius': 4,
    'spinal nucleus of trigeminal': 4,
    'hypoglossal nucleus': 4,
    'dorsal motor nucleus of vagus': 4,
    'facial colliculus': 4,
    'hypoglossal trigone': 4,
    'fourth ventricle': 4,
    'thalamus': 6,
    'hypothalamus': 6,
    'lateral geniculate body': 6,
    'medial geniculate body': 6,
    'mammillary body': 6,
    'pineal body': 6,
    'third ventricle': 6,
    'interventricular foramen': 6,
    'sternocleidomastoid': 5,
    'scm': 5,
    'ansa cervicalis': 5,
    'cervical plexus': 5,
    'phrenic nerve': 5,
    'carotid sheath': 5,
    'occipital triangle': 5,
    'post triangle': 5,
    'carotid triangle': 5,
    'vagus nerve': 5,
    'glossopharyngeal nerve': 5,
    'accessory nerve': 5,
    'hypoglossal nerve': 5,
    'stylopharyngeus': 5,
    'recurrent laryngeal nerve': 5,
    'limbic system': 7,
    'hippocampus': 7,
    'amygdala': 7,
    'fornix': 7,
    'cingulate': 7,
    'parahippocampal': 7,
}

# Build lookup from original bank
questions_by_id = {}
for ch in bank['chapters']:
    for sub in ch['subjects']:
        for q in sub['questions']:
            questions_by_id[q['id']] = {'ch': ch['id'], 'sub': sub['id'], 'q': q}

moves = []
keeps = []

# Step 1: Conservative base move (only invalid subjects)
for qid, old in questions_by_id.items():
    old_ch = old['ch']
    old_sub = old['sub']
    valid_subs = book_chapters.get(old_ch, {}).get('subjects', set())
    
    if old_sub in valid_subs:
        keeps.append(qid)
        continue
    
    # Invalid subject - must move
    props = mapping[qid]
    new_ch = props['chapterId']
    new_sub = props['subject']
    evidence = props.get('evidence', [])
    
    if new_sub in book_chapters.get(new_ch, {}).get('subjects', set()):
        moves.append({'qid': qid, 'from_ch': old_ch, 'from_sub': old_sub,
                      'to_ch': new_ch, 'to_sub': new_sub,
                      'reason': 'invalid-subject move'})
    else:
        fallback_sub = list(valid_subs)[0] if valid_subs else old_sub
        moves.append({'qid': qid, 'from_ch': old_ch, 'from_sub': old_sub,
                      'to_ch': old_ch, 'to_sub': fallback_sub,
                      'reason': 'invalid-subject fallback'})

# Step 2: Structural-term override (only for PRIMARY text, not explanation)
qid_to_move = {m['qid']: m for m in moves}
kept_qids = set(keeps)

for qid in kept_qids:
    q = questions_by_id[qid]['q']
    # Primary text only: question text + options (not explanation)
    text = ' '.join([q.get('text', ''), ' '.join(q.get('options', []))]).lower()
    if q.get('type') == 'matching':
        for p in q.get('pairs', []):
            text += ' ' + p.get('premise', '') + ' ' + p.get('target', '')
    for term, home_ch in STRUCTURAL_HOME.items():
        if term not in text:
            continue
        old_ch = questions_by_id[qid]['ch']
        if old_ch == home_ch:
            break  # Already in right chapter
        # Need to move to home chapter
        valid_subs = book_chapters[home_ch]['subjects']
        # Default to anatomy for structural terms
        sub = 'anatomy' if 'anatomy' in valid_subs else list(valid_subs)[0]
        if qid in qid_to_move:
            qid_to_move[qid]['to_ch'] = home_ch
            qid_to_move[qid]['to_sub'] = sub
            qid_to_move[qid]['reason'] = f'structural override: {term}'
        else:
            m = {'qid': qid, 'from_ch': old_ch, 
                 'from_sub': questions_by_id[qid]['sub'],
                 'to_ch': home_ch, 'to_sub': sub,
                 'reason': f'structural override: {term}'}
            qid_to_move[qid] = m
        break  # Only move once

moves = list(qid_to_move.values())
final_keeps = [qid for qid in keeps if qid not in qid_to_move]

print(f"Total questions: {len(questions_by_id)}")
print(f"Keep in place: {len(final_keeps)}")
print(f"Move: {len(moves)}")

# Build new bank
new_chapters = {}
for ch in book_toc['chapters']:
    ch_id = ch['id']
    new_chapters[ch_id] = {
        'id': ch_id, 'title': ch['title'], 'subtitle': '',
        'emoji': '🧠', 'page': ch_id, 'lectureRange': '',
        'subjects': {sid: {'id': sid, 'name': sid.capitalize(),
                           'iconName': sid, 'lectures': '',
                           'lectureCount': 0, 'questions': []}
                     for sid in ch['subjects']}
    }

for m in moves:
    q = questions_by_id[m['qid']]['q']
    new_chapters[m['to_ch']]['subjects'][m['to_sub']]['questions'].append(q)
for qid in final_keeps:
    info = questions_by_id[qid]
    q = info['q']
    ch = info['ch']
    sub = info['sub']
    new_chapters[ch]['subjects'][sub]['questions'].append(q)

chapter_list = []
for ch_id in sorted(new_chapters.keys()):
    ch = new_chapters[ch_id]
    subjects = [v for k, v in sorted(ch['subjects'].items()) if len(v['questions']) > 0]
    if not subjects:
        subjects = [v for k, v in sorted(ch['subjects'].items())]
    chapter_list.append({
        'id': ch['id'], 'title': ch['title'], 'subtitle': ch['subtitle'],
        'emoji': ch['emoji'], 'page': ch['page'], 'lectureRange': ch['lectureRange'],
        'subjects': subjects
    })

new_bank = {'schemaVersion': 1, 'meta': bank['meta'], 'chapters': chapter_list}

# Save backup
if not BACKUP_PATH.exists():
    shutil.copy(BANK_PATH, BACKUP_PATH)
    print(f"Backup saved to {BACKUP_PATH}")

# Save canonical
CANONICAL_OUT.parent.mkdir(parents=True, exist_ok=True)
with open(CANONICAL_OUT, 'w', encoding='utf-8') as f:
    json.dump(new_bank, f, indent=2, ensure_ascii=False)
print(f"Canonical: {CANONICAL_OUT}")

# Save import
with open(IMPORT_OUT, 'w', encoding='utf-8') as f:
    json.dump(new_bank, f, indent=2, ensure_ascii=False)
print(f"Import: {IMPORT_OUT}")

# Verify count
total_after = sum(sum(len(s['questions']) for s in ch['subjects']) for ch in new_bank['chapters'])
assert total_after == len(questions_by_id)
print(f"Verified: {total_after}")

# Stats
stats_path = Path('.kimchi/docs/cns-sorting-stats.md')
with open(stats_path, 'w', encoding='utf-8') as f:
    f.write("# CNS Sorting Statistics\n\n## Before\n\n")
    for ch in bank['chapters']:
        total = sum(len(s['questions']) for s in ch['subjects'])
        subs = ', '.join(f"{s['id']}={len(s['questions'])}" for s in ch['subjects'])
        f.write(f"- Ch{ch['id']} ({ch['title']}): {total} total | {subs}\n")
    f.write("\n## After\n\n")
    for ch in new_bank['chapters']:
        total = sum(len(s['questions']) for s in ch['subjects'])
        subs = ', '.join(f"{s['id']}={len(s['questions'])}" for s in ch['subjects'])
        f.write(f"- Ch{ch['id']} ({ch['title']}): {total} total | {subs}\n")
print(f"Stats: {stats_path}")

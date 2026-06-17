#!/usr/bin/env python3
"""
Apply conservative sorting to MCNS-2 question bank.
Rules:
1. Keep question in place if current subject is valid for current chapter.
2. If current subject is invalid, move to best matching valid subject in same chapter if similarity is strong.
3. If no valid subject in same chapter matches well, move to best chapter using classifier + force routes.
4. Chapter titles and metadata are updated to match the book.
"""
import json, shutil
from pathlib import Path

BANK_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json')
BACKUP_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json.bak')
MAPPING_PATH = Path('.kimchi/docs/proposed-mapping.json')
BOOK_TOC_PATH = Path('.kimchi/docs/book-toc.json')
CANONICAL_OUT = Path('data-format-v2/question-bank-mcns2/question-bank-mcns2-resorted.json')
IMPORT_OUT = Path('src/imports/year-2/semester-2/MCNS-2.json')

with open(BOOK_TOC_PATH, 'r', encoding='utf-8') as f:
    book_toc = json.load(f)
with open(BANK_PATH, 'r', encoding='utf-8') as f:
    bank = json.load(f)
with open(MAPPING_PATH, 'r', encoding='utf-8') as f:
    mapping = json.load(f)

# Build authorized subjects per chapter
book_chapters = {}
for ch in book_toc['chapters']:
    book_chapters[ch['id']] = {
        'title': ch['title'],
        'subjects': set(ch['subjects'].keys()),
    }

# Build chapter lookup from current bank
old_bank = json.dumps(bank)
questions_by_id = {}
for ch in bank['chapters']:
    ch_id = ch['id']
    for sub in ch['subjects']:
        for q in sub['questions']:
            questions_by_id[q['id']] = {
                'chapterId': ch_id,
                'subject': sub['id'],
                'question': q,
            }

moves = []
keeps = []
flagged = []

for qid, old_info in questions_by_id.items():
    old_ch = old_info['chapterId']
    old_sub = old_info['subject']
    props = mapping[qid]
    new_ch = props['chapterId']
    new_sub = props['subject']
    conf = props['confidence']
    evidence = props.get('evidence', [])
    
    valid_subs = book_chapters.get(old_ch, {}).get('subjects', set())
    
    # Rule 1: Current placement is valid → KEEP (move only if forced by very strong signal)
    if old_sub in valid_subs:
        # Keep in place unless cross-chapter force route is overwhelming
        # Evidence from force routes has priority 99.9 confidence
        if conf >= 95 and 'force:' in str(evidence) and new_ch != old_ch:
            # Very strong cross-chapter force route overrides
            moves.append({
                'qid': qid, 'from_ch': old_ch, 'from_sub': old_sub,
                'to_ch': new_ch, 'to_sub': new_sub,
                'reason': f'force-route override (conf={conf}, evidence={evidence[:3]})'
            })
        else:
            keeps.append(qid)
        continue
    
    # Rule 2: Current placement is invalid → MOVE
    # If classifier proposes the same chapter with a valid subject, prefer that
    if new_ch == old_ch and new_sub in valid_subs:
        moves.append({
            'qid': qid, 'from_ch': old_ch, 'from_sub': old_sub,
            'to_ch': new_ch, 'to_sub': new_sub,
            'reason': f'same chapter, valid subject (conf={conf})'
        })
        continue
    
    # If classifier proposes a different chapter with valid subject
    if new_sub in book_chapters.get(new_ch, {}).get('subjects', set()):
        moves.append({
            'qid': qid, 'from_ch': old_ch, 'from_sub': old_sub,
            'to_ch': new_ch, 'to_sub': new_sub,
            'reason': f'cross-chapter move (conf={conf}, evidence={evidence[:3]})'
        })
        continue
    
    # Fallback: stay in same chapter, pick first valid subject
    fallback_sub = list(valid_subs)[0] if valid_subs else old_sub
    flagged.append({
        'qid': qid, 'from_ch': old_ch, 'from_sub': old_sub,
        'to_ch': old_ch, 'to_sub': fallback_sub,
        'reason': f'AMBIGUOUS — classifier proposed invalid chapter/subject (Ch{new_ch}/{new_sub})'
    })
    moves.append({
        'qid': qid, 'from_ch': old_ch, 'from_sub': old_sub,
        'to_ch': old_ch, 'to_sub': fallback_sub,
        'reason': f'ambiguous → default to {fallback_sub}'
    })

print(f"Total questions: {len(questions_by_id)}")
print(f"Keep in place: {len(keeps)}")
print(f"Move: {len(moves)}")
print(f"Flagged ambiguous: {len(flagged)}")

# Build new bank structure
new_chapters = {}
for ch in book_toc['chapters']:
    ch_id = ch['id']
    new_chapters[ch_id] = {
        'id': ch_id,
        'title': ch['title'],
        'subtitle': '',
        'emoji': '🧠',
        'page': ch_id,
        'lectureRange': '',
        'subjects': {sub_id: {
            'id': sub_id,
            'name': sub_id.capitalize(),
            'iconName': sub_id,
            'lectures': '',
            'lectureCount': 0,
            'questions': []
        } for sub_id in ch['subjects']}
    }

# Populate
for move in moves:
    qid = move['qid']
    to_ch = move['to_ch']
    to_sub = move['to_sub']
    q = questions_by_id[qid]['question']
    new_chapters[to_ch]['subjects'][to_sub]['questions'].append(q)

for qid in keeps:
    old_ch = questions_by_id[qid]['chapterId']
    old_sub = questions_by_id[qid]['subject']
    q = questions_by_id[qid]['question']
    if old_sub not in new_chapters[old_ch]['subjects']:
        print(f"WARNING: keep question {qid} has invalid subject {old_sub} for ch {old_ch}")
        continue
    new_chapters[old_ch]['subjects'][old_sub]['questions'].append(q)

# Convert to required schema format
chapter_list = []
for ch_id in sorted(new_chapters.keys()):
    ch = new_chapters[ch_id]
    subjects = [v for k, v in sorted(ch['subjects'].items()) if len(v['questions']) > 0]
    if not subjects:
        # Keep empty subject arrays for schema but with zero questions
        subjects = [v for k, v in sorted(ch['subjects'].items())]
    chapter_list.append({
        'id': ch['id'],
        'title': ch['title'],
        'subtitle': ch['subtitle'],
        'emoji': ch['emoji'],
        'page': ch['page'],
        'lectureRange': ch['lectureRange'],
        'subjects': subjects
    })

new_bank = {
    'schemaVersion': 1,
    'meta': bank['meta'],
    'chapters': chapter_list,
}

# Save backup
if not BACKUP_PATH.exists():
    shutil.copy(BANK_PATH, BACKUP_PATH)
    print(f"Backup saved to {BACKUP_PATH}")

# Save canonical bank
CANONICAL_OUT.parent.mkdir(parents=True, exist_ok=True)
with open(CANONICAL_OUT, 'w', encoding='utf-8') as f:
    json.dump(new_bank, f, indent=2, ensure_ascii=False)
print(f"Canonical bank saved to {CANONICAL_OUT}")

# Save import bank (scripted replacement, not hand-edit)
with open(IMPORT_OUT, 'w', encoding='utf-8') as f:
    json.dump(new_bank, f, indent=2, ensure_ascii=False)
print(f"Import bank saved to {IMPORT_OUT}")

# Verify no lost questions
total_after = sum(sum(len(s['questions']) for s in ch['subjects']) for ch in new_bank['chapters'])
assert total_after == len(questions_by_id), f"Lost questions! Before: {len(questions_by_id)}, After: {total_after}"
print(f"Question count verified: {total_after}")

# Write move report
report_path = Path('.kimchi/docs/cns-sorting-report.md')
report_path.parent.mkdir(parents=True, exist_ok=True)
with open(report_path, 'w', encoding='utf-8') as f:
    f.write("# CNS Question Sorting Report\n\n")
    f.write(f"Total questions: {len(questions_by_id)}\n")
    f.write(f"Kept in place: {len(keeps)}\n")
    f.write(f"Moved: {len(moves)}\n")
    f.write(f"Flagged ambiguous: {len(flagged)}\n\n")
    f.write("## Cross-Chapter Moves\n\n")
    for m in moves:
        if m['from_ch'] != m['to_ch']:
            f.write(f"- `{m['qid']}`: Ch{m['from_ch']}/{m['from_sub']} → Ch{m['to_ch']}/{m['to_sub']} | {m['reason']}\n")
    f.write("\n## Within-Chapter Subject Changes\n\n")
    for m in moves:
        if m['from_ch'] == m['to_ch'] and m['from_sub'] != m['to_sub']:
            f.write(f"- `{m['qid']}`: {m['from_sub']} → {m['to_sub']} | {m['reason']}\n")
print(f"Report saved to {report_path}")

# Write stats report
stats_path = Path('.kimchi/docs/cns-sorting-stats.md')
with open(stats_path, 'w', encoding='utf-8') as f:
    f.write("# CNS Sorting Statistics\n\n")
    f.write("## Before\n\n")
    for ch in bank['chapters']:
        total = sum(len(s['questions']) for s in ch['subjects'])
        subs = ', '.join(f"{s['id']}={len(s['questions'])}" for s in ch['subjects'])
        f.write(f"- Ch{ch['id']} ({ch['title']}): {total} total | {subs}\n")
    f.write("\n## After\n\n")
    for ch in new_bank['chapters']:
        total = sum(len(s['questions']) for s in ch['subjects'])
        subs = ', '.join(f"{s['id']}={len(s['questions'])}" for s in ch['subjects'])
        f.write(f"- Ch{ch['id']} ({ch['title']}): {total} total | {subs}\n")
print(f"Stats saved to {stats_path}")

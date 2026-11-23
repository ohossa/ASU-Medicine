"""
Migration script: Move Microbiology questions from CA-1 to CA-2
Reason: Ain Shams University Urogenital curriculum does not include Microbiology lectures in Assessment 1 (CA-1).
Microbiology is examined in Assessment 2 (CA-2) and the Final.
All questions in Continuous Assessment (CA-1 and CA-2) must be strictly type: 'mcq'.
Any duplicate of Final is merged into Final, not moved to CA-2.
"""

import json
import os

JSON_PATH = 'src/imports/year-3/semester-1/MUG-3.json'

def main():
    print(f'Loading {JSON_PATH}...')
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    chapters = {c['id']: c for c in data['chapters']}

    ch103 = chapters[103]['subjects'][0]
    ch107 = chapters[107]['subjects'][0]
    ch207 = chapters[207]['subjects'][0]
    ch301 = chapters[301]

    print(f"Pre-migration: Ch 103: {len(ch103['questions'])}, Ch 107: {len(ch107['questions'])}, Ch 207: {len(ch207['questions'])}")

    # 1. Locate Final duplicate target
    target_final = None
    for s in ch301['subjects']:
        for q in s['questions']:
            if q['id'] == 'MUG3-CH301-PATH-0016':
                target_final = q
                break

    assert target_final is not None, 'Final question MUG3-CH301-PATH-0016 not found'

    # 2. Extract Ch 107 questions
    ch107_qs = ch107['questions']
    path_0045 = [q for q in ch107_qs if q['id'] == 'MUG3-CH205-PATH-0045'][0]
    micro_107 = [q for q in ch107_qs if q['id'] != 'MUG3-CH205-PATH-0045']
    assert len(micro_107) == 11, f'Expected 11 micro questions from Ch 107, got {len(micro_107)}'

    # Map all UTI micro questions to lecture 1 (Urinary Tract Infections)
    for q in micro_107:
        q['lecture'] = 1
        q['type'] = 'mcq'

    # 3. Extract and deduplicate Ch 103 misplaced micro & final questions
    ch103_qs = ch103['questions']
    path_0053 = [q for q in ch103_qs if q['id'] == 'MUG3-CH205-PATH-0053'][0]
    path_0143 = [q for q in ch103_qs if q['id'] == 'MUG3-CH205-PATH-0143'][0]
    micr_0012 = [q for q in ch103_qs if q['id'] == 'MUG3-CH207-MICR-0012'][0]
    micr_0007 = [q for q in ch103_qs if q['id'] == 'MUG3-CH207-MICR-0007'][0]
    micr_0010 = [q for q in ch103_qs if q['id'] == 'MUG3-CH207-MICR-0010'][0]
    path_0172 = [q for q in ch103_qs if q['id'] == 'MUG3-CH205-PATH-0172'][0]

    # Merge path_0143 into micr_0012
    merged_sources_0012 = list(dict.fromkeys(micr_0012.get('sources', []) + path_0143.get('sources', [])))
    micr_0012['sources'] = merged_sources_0012
    micr_0012['repetitionCount'] = len(merged_sources_0012)
    micr_0012['lecture'] = 2
    micr_0012['type'] = 'mcq'

    # STDs -> Lecture 2
    micr_0007['lecture'] = 2
    micr_0007['type'] = 'mcq'
    micr_0010['lecture'] = 2
    micr_0010['type'] = 'mcq'

    # Perinatal / Congenital Infections -> Lecture 3
    path_0172['lecture'] = 3
    path_0172['type'] = 'mcq'

    # Merge BPH past exam sources into Final question (path_0045 from Ch 107 + path_0053 from Ch 103)
    final_sources = list(dict.fromkeys(target_final.get('sources', []) + path_0045.get('sources', []) + path_0053.get('sources', [])))
    target_final['sources'] = final_sources
    target_final['repetitionCount'] = len(final_sources)

    # 4. Remove from Ch 103
    remove_ids_103 = {
        'MUG3-CH207-MICR-0007',
        'MUG3-CH207-MICR-0010',
        'MUG3-CH207-MICR-0012',
        'MUG3-CH205-PATH-0143',
        'MUG3-CH205-PATH-0172',
        'MUG3-CH205-PATH-0053'
    }
    ch103['questions'] = [q for q in ch103['questions'] if q['id'] not in remove_ids_103]

    # 5. Empty Ch 107
    ch107['questions'] = []

    # 6. Populate Ch 207
    micro_from_103 = [micr_0007, micr_0010, micr_0012, path_0172]
    ch207['questions'] = ch207['questions'] + micro_107 + micro_from_103

    print(f"Post-migration: Ch 103: {len(ch103['questions'])}, Ch 107: {len(ch107['questions'])}, Ch 207: {len(ch207['questions'])}")
    print(f"Target Final Q repetitionCount: {target_final['repetitionCount']}")

    # 7. Quality & schema assertions across ALL CA chapters
    for cid in range(101, 109):
        for s in chapters[cid]['subjects']:
            for q in s['questions']:
                assert q.get('type') == 'mcq', f"Non-MCQ in CA-1 Ch {cid}: {q['id']}"
                assert 1 <= q.get('lecture', 1) <= s.get('lectureCount', 1), f"Invalid lecture in Ch {cid}: {q['id']}"

    for cid in range(201, 209):
        for s in chapters[cid]['subjects']:
            for q in s['questions']:
                assert q.get('type') == 'mcq', f"Non-MCQ in CA-2 Ch {cid}: {q['id']}"
                assert 1 <= q.get('lecture', 1) <= s.get('lectureCount', 1), f"Invalid lecture in Ch {cid}: {q['id']}"

    # 8. Save updated file
    print(f'Writing updated data to {JSON_PATH}...')
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print('Successfully completed migration.')

if __name__ == '__main__':
    main()

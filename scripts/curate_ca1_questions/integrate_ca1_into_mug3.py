import json

mug3_path = 'src/imports/year-3/semester-1/MUG-3.json'
staged_path = 'scripts/curate_ca1_questions/staged_ca1_307.json'

with open(mug3_path, 'r', encoding='utf-8') as f:
    bank = json.load(f)

with open(staged_path, 'r', encoding='utf-8') as f:
    staged = json.load(f)

print(f"Loaded bank with {len(bank['chapters'])} chapters.")
print(f"Loaded {len(staged)} staged questions.")

# Group staged by chapterId and subjectId
staged_by_ch_sub = {}
for item in staged:
    key = (item['chapterId'], item['subjectId'])
    staged_by_ch_sub.setdefault(key, []).append(item['question'])

# Track existing IDs
existing_ids = set()
for ch in bank['chapters']:
    for sub in ch['subjects']:
        for q in sub['questions']:
            assert q['id'] not in existing_ids, f"Pre-existing duplicate ID: {q['id']}"
            existing_ids.add(q['id'])

print(f"Pre-existing questions count: {len(existing_ids)}")

# Inject into bank
total_injected = 0
for ch in bank['chapters']:
    ch_id = ch['id']
    if 101 <= ch_id <= 108:
        for sub in ch['subjects']:
            key = (ch_id, sub['id'])
            if key in staged_by_ch_sub:
                to_add = staged_by_ch_sub[key]
                before_cnt = len(sub['questions'])
                for q in to_add:
                    assert q['id'] not in existing_ids, f"Collision with ID: {q['id']}"
                    existing_ids.add(q['id'])
                    sub['questions'].append(q)
                after_cnt = len(sub['questions'])
                total_injected += len(to_add)
                print(f"Ch {ch_id} ({sub['id']}): {before_cnt} -> {after_cnt} (+{len(to_add)})")

print(f"Total questions injected: {total_injected}")
assert total_injected == 307, f"Expected 307 injected, got {total_injected}"
print(f"New total questions in bank: {len(existing_ids)}")
assert len(existing_ids) == 2567 + 307, f"Expected 2874 total, got {len(existing_ids)}"

# Write back
with open(mug3_path, 'w', encoding='utf-8') as f:
    json.dump(bank, f, indent=2, ensure_ascii=False)

print(f"Successfully integrated {total_injected} questions into {mug3_path}!")

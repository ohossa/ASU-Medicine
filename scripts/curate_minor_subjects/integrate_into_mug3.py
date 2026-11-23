import json, shutil, os

bank_path = 'src/imports/year-3/semester-1/MUG-3.json'
bak_path = 'src/imports/year-3/semester-1/MUG-3.json.bak'

# 1. Backup
shutil.copyfile(bank_path, bak_path)
print(f"Backed up to {bak_path}")

# 2. Load MUG-3.json
with open(bank_path, 'r') as f:
    bank = json.load(f)

# Count initial questions
initial_total = sum(len(s.get('questions', [])) for c in bank['chapters'] for s in c.get('subjects', []))
print(f"Initial total questions in MUG-3: {initial_total}")

# 3. Load staged questions
with open('scripts/curate_minor_subjects/staged_biochem.json', 'r') as f:
    staged_bio = json.load(f)
with open('scripts/curate_minor_subjects/staged_pathology.json', 'r') as f:
    staged_path = json.load(f)
with open('scripts/curate_minor_subjects/staged_pharma.json', 'r') as f:
    staged_phar = json.load(f)
with open('scripts/curate_minor_subjects/staged_micro.json', 'r') as f:
    staged_micr = json.load(f)
with open('scripts/curate_minor_subjects/staged_parasitology.json', 'r') as f:
    staged_para = json.load(f)

print(f"Loaded staged: Bio={len(staged_bio)}, Path={len(staged_path)}, Phar={len(staged_phar)}, Micro={len(staged_micr)}, Para={len(staged_para)}")
assert len(staged_bio) + len(staged_path) + len(staged_phar) + len(staged_micr) + len(staged_para) == 270

# 4. Inject into chapters
chapter_map = {
    4: ('biochem', staged_bio),
    5: ('pathology', staged_path),
    6: ('pharma', staged_phar),
    7: ('microbiology', staged_micr),
    8: ('parasitology', staged_para)
}

existing_ids = set()
for c in bank['chapters']:
    for s in c.get('subjects', []):
        for q in s.get('questions', []):
            existing_ids.add(q['id'])

for ch_id, (subj_id, new_qs) in chapter_map.items():
    ch = next((c for c in bank['chapters'] if c['id'] == ch_id), None)
    assert ch, f"Chapter {ch_id} not found"
    subj = next((s for s in ch['subjects'] if s['id'] == subj_id), None)
    assert subj, f"Subject {subj_id} in chapter {ch_id} not found"
    
    # Check for ID collision
    for q in new_qs:
        assert q['id'] not in existing_ids, f"Collision detected for ID: {q['id']}"
        existing_ids.add(q['id'])
        subj['questions'].append(q)
    
    print(f"Chapter {ch_id} ({subj_id}): Added {len(new_qs)} questions -> New total: {len(subj['questions'])}")

# 5. Verify final counts
final_total = sum(len(s.get('questions', [])) for c in bank['chapters'] for s in c.get('subjects', []))
print(f"Final total questions in MUG-3: {final_total} (Expected: {initial_total + 270})")
assert final_total == initial_total + 270, "Final total mismatch!"

# 6. Save updated MUG-3.json
with open(bank_path, 'w') as f:
    json.dump(bank, f, indent=2)

print(f"Successfully wrote updated {bank_path} with 2,567 questions.")

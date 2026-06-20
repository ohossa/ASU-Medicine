import json, pathlib, sys

base_path = pathlib.Path('/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/data-format-v2/question-bank-mcns2')
master_path = base_path / 'question-bank-mcns2.json'
chapters_dir = base_path / 'chapters'

# Load master JSON
data = json.loads(master_path.read_text())

# Gather all histology essay questions
all_hist = []
for chap in data.get('chapters', []):
    for subj in chap.get('subjects', []):
        if subj.get('id') == 'histology':
            for q in subj.get('questions', []):
                if 'histology-essay' in q.get('id', ''):
                    all_hist.append(q)
            # clear existing questions for now
            subj['questions'] = []

# Identify chapters that have a histology subject
eligible = []
for chap in data.get('chapters', []):
    for subj in chap.get('subjects', []):
        if subj.get('id') == 'histology':
            eligible.append((chap, subj))
            break

if not eligible:
    print('No eligible chapters with histology subject found.', file=sys.stderr)
    sys.exit(1)

# Distribute roughly equally
per = len(all_hist) // len(eligible)
rem = len(all_hist) % len(eligible)
idx = 0
for i, (chap, subj) in enumerate(eligible):
    count = per + (1 if i < rem else 0)
    subj['questions'] = all_hist[idx:idx+count]
    idx += count

# Write back master JSON
master_path.write_text(json.dumps(data, indent=2, ensure_ascii=False))

# Update each chapter file to reflect its new content
for chap, _ in eligible:
    chap_id = chap.get('id')
    # Find matching chapter file by searching for "\"id\": <chap_id>," in filename content
    for cf in chapters_dir.iterdir():
        if cf.suffix != '.json':
            continue
        text = cf.read_text()
        if f'"id": {chap_id}' in text:
            cf.write_text(json.dumps(chap, indent=2, ensure_ascii=False))
            break
print('Reassignment complete')

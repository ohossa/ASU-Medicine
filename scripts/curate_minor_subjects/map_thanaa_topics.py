import json

with open('scripts/curate_minor_subjects/thanaa_parsed.json', 'r') as f:
    qs = json.load(f)

for q in qs:
    num = q['num']
    stem = q['stem']
    # Print number and first 60 chars of stem
    print(f"({num}) {stem[:65]}")

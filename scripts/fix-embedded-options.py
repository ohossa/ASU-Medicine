#!/usr/bin/env python3
"""Fix MCNS-2 questions where options are embedded in the text field."""
import json, re, shutil
from pathlib import Path

BANK_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json')
BACKUP_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json.bak2')
CANONICAL_PATH = Path('data-format-v2/question-bank-mcns2/question-bank-mcns2.json')

with open(BANK_PATH, 'r', encoding='utf-8') as f:
    bank = json.load(f)

# Find all mcq/truefalse questions where text contains option markers
fixed_count = 0

for ch in bank['chapters']:
    for sub in ch['subjects']:
        for q in sub['questions']:
            if q.get('type') not in ('mcq', 'truefalse'):
                continue
            text = q.get('text', '')
            options = q.get('options', [])
            
            # Skip if text doesn't have embedded A., B., C. etc.
            if not re.search(r'\n[A-Ea-e][\.\)]', text):
                continue
            
            # Already has separate options array - just strip from text
            if options and len(options) > 0:
                # Find where options start in text
                m = re.search(r'\n[A-Ea-e][\.\)]', text)
                if m:
                    clean_text = text[:m.start()].strip()
                    q['text'] = clean_text
                    fixed_count += 1
                continue
            
            # Need to extract options from text
            lines = text.split('\n')
            question_lines = []
            extracted_options = []
            in_options = False
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                # Check if line is an option (A., B., C., etc.)
                opt_match = re.match(r'^([A-Ea-e])[\.\)]\s*(.+)$', line)
                if opt_match:
                    in_options = True
                    extracted_options.append(opt_match.group(2).strip())
                elif in_options and not opt_match:
                    # Non-option line after options started - stop collecting options
                    break
                elif not in_options:
                    question_lines.append(line)
            
            if extracted_options:
                clean_text = ' '.join(question_lines).strip()
                if clean_text:
                    q['text'] = clean_text
                q['options'] = extracted_options
                fixed_count += 1

print(f"Fixed {fixed_count} questions")

# Save backup
if not BACKUP_PATH.exists():
    shutil.copy(BANK_PATH, BACKUP_PATH)

# Save updated bank
with open(BANK_PATH, 'w', encoding='utf-8') as f:
    json.dump(bank, f, indent=2, ensure_ascii=False)
print(f"Saved to {BANK_PATH}")

# Update canonical if it exists
if CANONICAL_PATH.exists():
    with open(CANONICAL_PATH, 'w', encoding='utf-8') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    print(f"Saved to {CANONICAL_PATH}")

# Verify no remaining embedded options
remaining = 0
for ch in bank['chapters']:
    for sub in ch['subjects']:
        for q in sub['questions']:
            if q.get('type') in ('mcq', 'truefalse'):
                txt = q.get('text', '')
                if re.search(r'\n[A-Ea-e][\.\)]', txt):
                    remaining += 1

print(f"Remaining embedded options: {remaining}")

# Verify count
total = sum(sum(len(s['questions']) for s in ch['subjects']) for ch in bank['chapters'])
print(f"Total questions: {total}")

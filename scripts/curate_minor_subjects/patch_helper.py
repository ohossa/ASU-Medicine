with open('scripts/curate_minor_subjects/generate_pathology_100.py', 'r') as f:
    content = f.read()

helper_code = '''
def make_4_opts(opts, ans_letter):
    ans_idx = ord(ans_letter.upper()) - ord('A')
    cleaned = [o.strip() for o in opts]
    correct_text = cleaned[ans_idx] if ans_idx < len(cleaned) else cleaned[0]
    
    if len(cleaned) == 4:
        return cleaned, ans_idx
    elif len(cleaned) > 4:
        distractors = [o for o in cleaned if o != correct_text][:3]
        target_idx = min(ans_idx, 3)
        final_opts = []
        for i in range(4):
            if i == target_idx:
                final_opts.append(correct_text)
            else:
                final_opts.append(distractors.pop(0))
        return final_opts, target_idx
    else:
        while len(cleaned) < 4:
            cleaned.append("None of the above")
        return cleaned, ans_idx
'''

content = content.replace("print(f\"Loaded {len(thanaa_qs)} thanaa questions.\")", "print(f\"Loaded {len(thanaa_qs)} thanaa questions.\")\n" + helper_code)

with open('scripts/curate_minor_subjects/generate_pathology_100.py', 'w') as f:
    f.write(content)

print("Patched helper")

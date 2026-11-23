import json, re

with open('data-format-v2/extracted_urogenital_all201.json', 'r') as f:
    data = json.load(f)

# Load dr omar questions
omar_qs = [q for q in data if q.get('sourceFile') == 'Biochemistry/dr omar.pdf']

# We will curate 60 high-yield questions: 15 for Lecture 1, 15 for Lecture 2, 15 for Lecture 3, 15 for Lecture 4.

# Helper to clean options to exactly 4 choices
def format_4_opts(raw_opts, raw_ans_letter):
    cleaned = []
    ans_idx = ord(raw_ans_letter.upper()) - ord('A')
    for opt in raw_opts:
        c = re.sub(r'\s*Correct answer:\s*[A-E]', '', opt, flags=re.I).strip()
        c = re.sub(r'^[a-eA-E][\.\-\)]\s*', '', c).strip()
        cleaned.append(c)
    
    correct_text = cleaned[ans_idx] if ans_idx < len(cleaned) else cleaned[0]
    
    if len(cleaned) == 4:
        return cleaned, ans_idx
    elif len(cleaned) > 4:
        # Keep correct option and 3 distractors
        opts_4 = [correct_text]
        for opt in cleaned:
            if opt != correct_text and opt not in opts_4 and len(opts_4) < 4:
                opts_4.append(opt)
        # Sort or place correctly
        # Let's place correct_text at ans_idx if ans_idx < 4, otherwise at 0
        target_idx = min(ans_idx, 3)
        other_opts = [o for o in opts_4 if o != correct_text]
        final_opts = []
        for i in range(4):
            if i == target_idx:
                final_opts.append(correct_text)
            else:
                final_opts.append(other_opts.pop(0))
        return final_opts, target_idx
    else:
        # Pad with plausible distractor if needed
        while len(cleaned) < 4:
            cleaned.append("None of the above")
        return cleaned, ans_idx

print("Helper ready")

import json
import os
import glob
import re

print("Starting Audited Anatomy Merger & Validator...")

with open("scripts/canonical_practical_forms.json", "r", encoding="utf-8") as f:
    master_forms = json.load(f)

# Collect all audited batches
audited_files = sorted(glob.glob("scripts/audited_anat*.json"))
print(f"Found {len(audited_files)} audited batch files:")
for af in audited_files:
    print(f"  {af}")

merged_audit = {}
for af in audited_files:
    with open(af, "r", encoding="utf-8") as f:
        data = json.load(f)
        for qid_str, info in data.items():
            qid = int(qid_str)
            merged_audit[qid] = info

print(f"\nTotal unique QIDs audited: {len(merged_audit)}/315")

all_anat_questions = []

for fid, form_meta in [("anat1", {"lec": 1, "name": "Module 1"}),
                       ("anat2", {"lec": 2, "name": "Module 2"}),
                       ("anat3", {"lec": 3, "name": "Module 3"}),
                       ("anat4", {"lec": 4, "name": "Module 4"})]:
    qs = master_forms[fid]["questions"]
    print(f"\nProcessing {fid} ({len(qs)} questions)...")
    
    for i, q in enumerate(qs):
        qid = q["qid"]
        options = list(q["options"])
        title = q["title"].strip()
        title_clean = re.sub(r"^\*+|\*+$", "", title).strip()
        title_clean = re.sub(r"\s*بلاش استظراف على صعوبة السؤال.*", "", title_clean).strip()
        if not title_clean or title_clean.upper() == "IDENTIFY":
            title_clean = "IDENTIFY"
            
        # Clean title of conversational notes
        title_clean = re.sub(r"[\u0600-\u06FF].*", "", title_clean).strip()
        if not title_clean or title_clean.upper() in ["IDENTIFY", "*IDENTIFY*"]:
            title_clean = "IDENTIFY"

        audit_info = merged_audit.get(qid)
        if not audit_info:
            print(f"  [WARNING] QID {qid} (index {i}) NOT yet in merged audit!")
            continue

        target = audit_info["target"].strip()
        explanation = audit_info.get("explanation", "").strip()
        concept = audit_info.get("keyConcept", "").strip()

        # Handle questions that had empty or single options in Google Forms
        if len(options) < 2:
            if "T12 – L1" in target or "T12" in target:
                title_clean = "Identify the vertebral level of this abdominal CT cross-section:"
                options = [
                    "At level of T12 – L1",
                    "At level of L1 – L2",
                    "At level of L3 – L4",
                    "At level of T10 – T11"
                ]
                correct_idx = options.index("At level of T12 – L1")
            elif "L1 – L2" in target or "L1" in target:
                title_clean = "Identify the vertebral level of this abdominal CT cross-section:"
                options = [
                    "At level of L1 – L2",
                    "At level of T12 – L1",
                    "At level of L3 – L4",
                    "At level of L5 – S1"
                ]
                correct_idx = options.index("At level of L1 – L2")
            elif "ribs" in target.lower():
                title_clean = "Identify the skeletal relationship of the diaphragmatic surface of the spleen:"
                options = [
                    "Spleen related to 9th, 10th & 11th left ribs",
                    "Spleen related to 7th, 8th & 9th left ribs",
                    "Spleen related to 10th, 11th & 12th left ribs",
                    "Spleen related to 8th, 9th & 10th left ribs"
                ]
                correct_idx = 0
            else:
                options = [
                    target,
                    "Incisive canal and greater palatine vessels",
                    "Sphenopalatine artery and vein",
                    "Pterygoid venous plexus and maxillary artery"
                ]
                correct_idx = 0
        else:
            # Match target in options
            if target in options:
                correct_idx = options.index(target)
            else:
                # Case-insensitive or stripped match
                matched = False
                for opt_idx, opt in enumerate(options):
                    if opt.strip().lower() == target.lower():
                        correct_idx = opt_idx
                        target = opt
                        matched = True
                        break
                if not matched:
                    # Partial match
                    for opt_idx, opt in enumerate(options):
                        if target.lower() in opt.lower() or opt.lower() in target.lower():
                            correct_idx = opt_idx
                            target = opt
                            matched = True
                            break
                    if not matched:
                        print(f"  [ERROR] Target '{target}' not found in options {options} for QID {qid}")
                        correct_idx = 0

        if not explanation.startswith("Criteria of Identification:"):
            explanation = f"Criteria of Identification: {explanation}"
            
        if len(concept) < 18:
            concept = f"Key identification criterion: {target} — high-yield diagnostic spotter feature."

        q_obj = {
            "id": f"MGL3-PRAC-ANAT-{form_meta['lec']}{i+1:03d}",
            "type": "mcq",
            "lecture": form_meta["lec"],
            "text": title_clean,
            "options": options,
            "correctIndex": correct_idx,
            "explanation": explanation,
            "keyConcept": concept,
            "media": {
                "type": "image",
                "imageUrl": q["image_url"],
                "caption": f"Anatomy Practical {form_meta['name']} — Station {i+1}"
            }
        }
        all_anat_questions.append(q_obj)

print(f"\nSuccessfully assembled {len(all_anat_questions)} anatomy questions.")

if len(all_anat_questions) == 315:
    out_payload = {
        "all": all_anat_questions,
        "count": len(all_anat_questions)
    }
    with open("scripts/adjudicated_anatomy.json", "w", encoding="utf-8") as f:
        json.dump(out_payload, f, indent=2, ensure_ascii=False)
    print("Master scripts/adjudicated_anatomy.json generated successfully!")
else:
    print(f"Still waiting on remaining questions ({len(all_anat_questions)}/315 completed).")

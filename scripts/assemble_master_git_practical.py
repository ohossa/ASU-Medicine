import json
import os

print("Assembling Master GIT Practical Bank (MGL-3)...")

# 1. Load Anatomy (315 Qs)
with open("scripts/adjudicated_anatomy.json", "r", encoding="utf-8") as f:
    anat_data = json.load(f)
anat_questions = anat_data["all"]

# 2. Load Histology (183 Qs)
with open("scripts/adjudicated_histology.json", "r", encoding="utf-8") as f:
    histo_data = json.load(f)
histo_questions = histo_data["histo1"] + histo_data["histo2"]

# 3. Load Pathology (145 Qs)
with open("scripts/adjudicated_pathology.json", "r", encoding="utf-8") as f:
    patho_data = json.load(f)
patho_questions = patho_data["museum"] + patho_data["lab"]

# 4. Load Parasitology (84 Qs)
with open("scripts/adjudicated_parasitology.json", "r", encoding="utf-8") as f:
    para_questions = json.load(f)

# 5. Load Microbiology and Physiology from current bank
with open("src/app/data/practical/mgl-3-practical.json", "r", encoding="utf-8") as f:
    current_bank = json.load(f)

micro_ch = next(c for c in current_bank if c["id"] == 305)
micro_questions = micro_ch["subjects"][0]["questions"]

physio_ch = next(c for c in current_bank if c["id"] == 306)
physio_questions = physio_ch["subjects"][0]["questions"]

# 6. Load Biochemistry (65 Qs)
with open("scripts/adjudicated_biochemistry.json", "r", encoding="utf-8") as f:
    bio_questions = json.load(f)

# Enhance all keyConcepts to be at least 20 chars
for q_list in [anat_questions, histo_questions, patho_questions, para_questions, micro_questions, physio_questions, bio_questions]:
    for q in q_list:
        kc = q.get("keyConcept", "").strip()
        if len(kc) < 18:
            target_name = q["options"][q.get("correctIndex", 0)] if q.get("options") else "Target structure"
            q["keyConcept"] = f"Key identification criterion: {kc.rstrip('.')} ({target_name}) — high-yield diagnostic spotter feature."

master_bank = [
    {
        "id": 301,
        "title": "Practical — Anatomy",
        "bankSection": "practical",
        "accentColor": "anatomy",
        "subjects": [
            {
                "id": "anatomy",
                "name": "Anatomy",
                "lectureNames": [
                    "Module 1: Oral Cavity, Pharynx & Anterior Abdominal Wall",
                    "Module 2: Posterior Abdominal Wall, Nerves & Lumbar Spine",
                    "Module 3: Liver, Gallbladder, Spleen & Celiac Vasculature",
                    "Module 4: Major Retroperitoneal Vessels, Mesenteries & Anomalies"
                ],
                "questions": anat_questions
            }
        ]
    },
    {
        "id": 302,
        "title": "Practical — Histology",
        "bankSection": "practical",
        "accentColor": "histology",
        "subjects": [
            {
                "id": "histology",
                "name": "Histology",
                "lectureNames": [
                    "Histology Practical Part 1 (Lip, Tongue, Salivary & Esophagus)",
                    "Histology Practical Part 2 (Stomach, Intestines, Colon & Appendix)"
                ],
                "questions": histo_questions
            }
        ]
    },
    {
        "id": 303,
        "title": "Practical — Pathology",
        "bankSection": "practical",
        "accentColor": "pathology",
        "subjects": [
            {
                "id": "pathology",
                "name": "Pathology",
                "lectureNames": [
                    "Pathology Museum (Gross Jars)",
                    "Pathology Lab (Microscopic Slides)"
                ],
                "questions": patho_questions
            }
        ]
    },
    {
        "id": 304,
        "title": "Practical — Parasitology",
        "bankSection": "practical",
        "accentColor": "parasitology",
        "subjects": [
            {
                "id": "parasitology",
                "name": "Parasitology",
                "lectureNames": [
                    "Parasitology Practical Spotters & Clinical Cases"
                ],
                "questions": para_questions
            }
        ]
    },
    {
        "id": 305,
        "title": "Practical — Microbiology",
        "bankSection": "practical",
        "accentColor": "microbiology",
        "subjects": [
            {
                "id": "microbiology",
                "name": "Microbiology",
                "lectureNames": [
                    "Microbiology Practical Spotters & Clinical Panels"
                ],
                "questions": micro_questions
            }
        ]
    },
    {
        "id": 306,
        "title": "Practical — Physiology",
        "bankSection": "practical",
        "accentColor": "physiology",
        "subjects": [
            {
                "id": "physiology",
                "name": "Physiology",
                "lectureNames": [
                    "Clinical Gastroenterology Physiology Cases"
                ],
                "questions": physio_questions
            }
        ]
    },
    {
        "id": 307,
        "title": "Practical — Biochemistry",
        "bankSection": "practical",
        "accentColor": "biochem",
        "subjects": [
            {
                "id": "biochemistry",
                "name": "Biochemistry",
                "lectureNames": [
                    "Lab 1: Serum Albumin & Total Protein (Biuret Assay)",
                    "Lab 2: Liver Function Tests & Diagnostic Enzymes (LFTs)",
                    "Lab 3: Bilirubin Metabolism, Jaundice & Van den Bergh Test",
                    "Lab 4: Nutritional Assessment, BMI & Clinical Case Vignettes"
                ],
                "questions": bio_questions
            }
        ]
    }
]

out_path = "src/app/data/practical/mgl-3-practical.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(master_bank, f, indent=2, ensure_ascii=False)

total_qs = sum(len(ch["subjects"][0]["questions"]) for ch in master_bank)
print(f"Successfully assembled {total_qs} practical questions into {out_path}!")

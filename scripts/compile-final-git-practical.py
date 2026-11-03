#!/usr/bin/env python3
"""
ASU Medical Portal — GIT (MGL-3) Comprehensive Practical Exam Compiler
Assembles the complete 286 authentic exam stations across all 8 chapters:
- Histology (Chapter 301, 28 stations)
- Pathology (Chapter 302, 30 stations)
- Parasitology (Chapter 303, 41 stations)
- Anatomy (Chapter 304, 37 stations)
- Physiology (Chapter 305, 40 stations)
- Biochemistry (Chapter 306, 40 stations)
- Microbiology (Chapter 307, 40 stations)
- Clinical & Pharmacology (Chapter 308, 30 stations)

Enforces:
- Perfect answer key distribution across every subject
- Verified image assets on disk
- Criteria of identification and authentic ASU medical exam structure
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from data_histology import HISTOLOGY_QUESTIONS
from data_pathology import PATHOLOGY_QUESTIONS
from data_parasitology import PARASITOLOGY_QUESTIONS
from data_anatomy import ANATOMY_QUESTIONS
from data_physiology import get_physiology_questions
from data_biochemistry import get_biochemistry_questions
from data_microbiology import get_microbiology_questions
from data_clinical import get_clinical_questions

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PRACTICAL_JSON_PATH = os.path.join(ROOT_DIR, "src/app/data/practical/mgl-3-practical.json")

def verify_image(img_rel):
    if not img_rel:
        return
    disk_path = os.path.join(ROOT_DIR, "public", img_rel.lstrip("/"))
    if not os.path.exists(disk_path):
        raise FileNotFoundError(f"Missing image on disk: {disk_path}")
    size_kb = os.path.getsize(disk_path) / 1024
    if size_kb < 1.0:
        raise ValueError(f"Image too small ({size_kb:.2f} KB): {disk_path}")

def build_raw_question_obj(q_raw, target_idx, ch_id, subj_code):
    qid = f"MGL3-CH{ch_id}-{subj_code}-{q_raw['seq']:04d}"
    correct = q_raw["correct_answer"]
    distractors = list(q_raw["distractors"])
    
    # Place correct at target_idx
    options = distractors[:]
    options.insert(target_idx, correct)
    
    img_rel = q_raw.get("imageUrl")
    verify_image(img_rel)
        
    return {
        "id": qid,
        "type": "mcq",
        "lecture": q_raw["lecture"],
        "text": q_raw["text"],
        "options": options,
        "correctIndex": target_idx,
        "explanation": q_raw["explanation"],
        "keyConcept": q_raw["keyConcept"],
        "media": {
            "type": "image",
            "imageUrl": img_rel,
            "caption": f"Practical Spotter Examination — Station {q_raw['seq']}"
        } if img_rel else None
    }

def rebalance_authored_question(q, target_idx):
    q_copy = dict(q)
    opts = list(q["options"])
    old_idx = q["correctIndex"]
    correct_val = opts.pop(old_idx)
    opts.insert(target_idx, correct_val)
    q_copy["options"] = opts
    q_copy["correctIndex"] = target_idx
    
    if q_copy.get("media") and q_copy["media"].get("imageUrl"):
        verify_image(q_copy["media"]["imageUrl"])
        
    return q_copy

def main():
    print("Compiling 286 Comprehensive GIT Practical Exam Stations...")
    
    # 1. Chapter 301: Histology (28 stations)
    histo_targets = [i % 4 for i in range(len(HISTOLOGY_QUESTIONS))]
    histo_questions = [
        build_raw_question_obj(q, t, 301, "HIST")
        for q, t in zip(HISTOLOGY_QUESTIONS, histo_targets)
    ]
    histo_chapter = {
        "id": 301,
        "title": "Practical — Histology",
        "subtitle": "Micrographs & Electron Microscopy (TEM/SEM)",
        "emoji": "🔬",
        "page": 661,
        "lectureRange": "Stations 1–28",
        "bankSection": "practical",
        "subjects": [
            {
                "id": "histology",
                "name": "Histology",
                "iconName": "Microscope",
                "lectures": "Stations 1–28",
                "lectureCount": 6,
                "lectureNames": [
                    "Alimentary Canal: Esophagus to Large Intestine",
                    "Oral Cavity & Salivary Glands",
                    "Liver & Gallbladder Architecture",
                    "Pancreas & Secretory Acini",
                    "Cellular Ultrastructure (TEM: Taste buds, Acini, Parietal cells)",
                    "Subcellular Ultrastructure (TEM/SEM: Enterocytes, Sinusoids, Paneth)"
                ],
                "questions": histo_questions
            }
        ]
    }

    # 2. Chapter 302: Pathology (30 stations)
    path_targets = [i % 4 for i in range(len(PATHOLOGY_QUESTIONS))]
    path_questions = [
        build_raw_question_obj(q, t, 302, "PATH")
        for q, t in zip(PATHOLOGY_QUESTIONS, path_targets)
    ]
    path_chapter = {
        "id": 302,
        "title": "Practical — Pathology",
        "subtitle": "Gross Pathology Museum Jars & Histopathology Slides",
        "emoji": "🧪",
        "page": 457,
        "lectureRange": "Stations 1–30",
        "bankSection": "practical",
        "subjects": [
            {
                "id": "pathology",
                "name": "Pathology",
                "iconName": "Activity",
                "lectures": "Stations 1–30",
                "lectureCount": 6,
                "lectureNames": [
                    "Stomach & Esophagus (Ulcers, Barrett's, Carcinoma)",
                    "Intestinal Polyps & Colorectal Neoplasms",
                    "Inflammatory Bowel & Infectious Enteric Lesions (Appendicitis, TB, Typhoid, Amoebiasis)",
                    "Liver Cirrhosis & Hepatocellular Carcinoma",
                    "Gallbladder & Salivary Glands (Cholecystitis, Pleomorphic Adenoma, Warthin)",
                    "Fibrosis & Parasitic Pathology (Schistosomal Pipestem Fibrosis)"
                ],
                "questions": path_questions
            }
        ]
    }

    # 3. Chapter 303: Parasitology (41 stations)
    para_targets = [i % 4 for i in range(len(PARASITOLOGY_QUESTIONS))]
    para_questions = [
        build_raw_question_obj(q, t, 303, "PARA")
        for q, t in zip(PARASITOLOGY_QUESTIONS, para_targets)
    ]
    para_chapter = {
        "id": 303,
        "title": "Practical — Parasitology",
        "subtitle": "Helminths, Protozoa, Vectors, Eggs & Clinical Stations",
        "emoji": "🪱",
        "page": 711,
        "lectureRange": "Stations 1–41",
        "bankSection": "practical",
        "subjects": [
            {
                "id": "parasitology",
                "name": "Parasitology",
                "iconName": "Bug",
                "lectures": "Stations 1–41",
                "lectureCount": 10,
                "lectureNames": [
                    "Adult Flukes & Nematodes (Fasciola, Trichuris, Schistosoma, Enterobius)",
                    "Tapeworms, Hookworms & Strongyloides Adults",
                    "Cestode Scolices, Segments & Cercariae",
                    "Larval Cysts (Cysticercus, Hydatid) & Rhabditiform Larvae",
                    "Intestinal Protozoa: Trophozoites (Balantidium, Giardia, Entamoeba)",
                    "Intestinal Protozoa: Cysts & Oocysts (Acid-Fast Cryptosporidium)",
                    "Snail Intermediate Hosts & Diagnostic Helminth Eggs",
                    "Clinical Spotter Stations: Hydatid, Strongyloides & Schistosoma",
                    "Clinical Spotter Stations: Ascaris & Cryptosporidiosis",
                    "Clinical Spotter Stations: Giardia, Fasciola, Enterobius & Hookworm"
                ],
                "questions": para_questions
            }
        ]
    }

    # 4. Chapter 304: Anatomy (37 stations)
    anat_targets = [i % 4 for i in range(len(ANATOMY_QUESTIONS))]
    anat_questions = [
        build_raw_question_obj(q, t, 304, "ANAT")
        for q, t in zip(ANATOMY_QUESTIONS, anat_targets)
    ]
    anat_chapter = {
        "id": 304,
        "title": "Practical — Anatomy",
        "subtitle": "Gross Specimens, Viscera, Vessels, Osteology & Cross Sections",
        "emoji": "🦴",
        "page": 731,
        "lectureRange": "Stations 1–37",
        "bankSection": "practical",
        "subjects": [
            {
                "id": "anatomy",
                "name": "Anatomy",
                "iconName": "Bone",
                "lectures": "Stations 1–37",
                "lectureCount": 10,
                "lectureNames": [
                    "Sagittal Head & Neck (Oral Cavity, Pharynx & Tonsillar Bed)",
                    "Salivary Glands Topography & Ducts",
                    "Anterior & Posterior Abdominal Wall Dissections",
                    "Retroperitoneal Great Vessels & Lumbar Plexus Topography",
                    "Stomach, Omenta & Peritoneal Spaces",
                    "Liver Lobes, Surfaces & Biliary Apparatus",
                    "Small & Large Intestines & Anal Canal",
                    "Blood Supply of Gut (Celiac Trunk, SMA, IMA & Portal Vein)",
                    "Osteology (Palatine Bones, Pelvis & Lumbar Vertebrae)",
                    "Congenital Anomalies & Cross-Sectional Axial CT Anatomy"
                ],
                "questions": anat_questions
            }
        ]
    }

    # 5. Chapter 305: Physiology (40 stations)
    phys_raw = get_physiology_questions()
    phys_questions = [
        rebalance_authored_question(q, i % 4)
        for i, q in enumerate(phys_raw)
    ]
    phys_chapter = {
        "id": 305,
        "title": "Practical — Physiology",
        "subtitle": "Lab Cases, Manometry, Secretions & Motility Curves",
        "emoji": "⚡",
        "page": 929,
        "lectureRange": "Stations 1–40",
        "bankSection": "practical",
        "subjects": [
            {
                "id": "physiology",
                "name": "Physiology",
                "iconName": "Zap",
                "lectures": "Stations 1–40",
                "lectureCount": 3,
                "lectureNames": [
                    "Lab 1: Swallowing, Esophageal Motility & Manometry (Achalasia, GERD, Zenker)",
                    "Lab 2: Gastric Motility, Secretions & Hepatobiliary Function (PUD, Emptying, Bile)",
                    "Lab 3: Intestinal Motility, Transport & Absorption (SGLT-1, Diarrhea, Hirschsprung)"
                ],
                "questions": phys_questions
            }
        ]
    }

    # 6. Chapter 306: Biochemistry (40 stations)
    bioc_raw = get_biochemistry_questions()
    bioc_questions = [
        rebalance_authored_question(q, i % 4)
        for i, q in enumerate(bioc_raw)
    ]
    bioc_chapter = {
        "id": 306,
        "title": "Practical — Biochemistry",
        "subtitle": "Clinical Chemistry, Spectrophotometry & Metabolic Labs",
        "emoji": "🧬",
        "page": 1097,
        "lectureRange": "Stations 1–40",
        "bankSection": "practical",
        "subjects": [
            {
                "id": "biochemistry",
                "name": "Biochemistry",
                "iconName": "TestTube",
                "lectures": "Stations 1–40",
                "lectureCount": 4,
                "lectureNames": [
                    "Wilson's Disease & Copper Metabolism (KF Ring, Ceruloplasmin)",
                    "Liver Function Tests & Jaundice Metabolism (ALT, AST, ALP, VandenBergh)",
                    "Nutritional Assessment, BMI & Caloric Calculations",
                    "Spectrophotometric Lab Calculations (Beer-Lambert Law: Standard vs Unknown)"
                ],
                "questions": bioc_questions
            }
        ]
    }

    # 7. Chapter 307: Microbiology (40 stations)
    micr_raw = get_microbiology_questions()
    micr_questions = [
        rebalance_authored_question(q, i % 4)
        for i, q in enumerate(micr_raw)
    ]
    micr_chapter = {
        "id": 307,
        "title": "Practical — Microbiology",
        "subtitle": "Diagnostic Cultures, Biochemical Tests & Serology",
        "emoji": "🧫",
        "page": 1200,
        "lectureRange": "Stations 1–40",
        "bankSection": "practical",
        "subjects": [
            {
                "id": "microbiology",
                "name": "Microbiology",
                "iconName": "Sparkles",
                "lectures": "Stations 1–40",
                "lectureCount": 4,
                "lectureNames": [
                    "Culture Media & Colony Morphology (MacConkey LF/NLF, TCBS, MSA)",
                    "Biochemical Identification Tests (TSI, Oxidase, Urease, Indole)",
                    "Serological Diagnosis (Widal Agglutination & Salmonella Typing)",
                    "Stool Specimen Transport, Food Poisoning Cases & Typhoid Carriers"
                ],
                "questions": micr_questions
            }
        ]
    }

    # 8. Chapter 308: Clinical & Pharmacology (30 stations)
    clin_raw = get_clinical_questions()
    clin_questions = [
        rebalance_authored_question(q, i % 4)
        for i, q in enumerate(clin_raw)
    ]
    clin_chapter = {
        "id": 308,
        "title": "Practical — Clinical & Pharmacology",
        "subtitle": "Endoscopy, Imaging, Therapeutics & Emergencies",
        "emoji": "🩺",
        "page": 1272,
        "lectureRange": "Stations 1–30",
        "bankSection": "practical",
        "subjects": [
            {
                "id": "clinical",
                "name": "Clinical & Pharmacology",
                "iconName": "Stethoscope",
                "lectures": "Stations 1–30",
                "lectureCount": 3,
                "lectureNames": [
                    "GERD, Peptic Ulcer Disease & Endoscopic Diagnosis",
                    "H. pylori Eradication Regimens & Urea Breath Testing",
                    "Portal Hypertension, Varices, Cirrhosis & Viral Hepatitis Phases"
                ],
                "questions": clin_questions
            }
        ]
    }

    # Assemble all 8 chapters in canonical order
    full_bank = [
        histo_chapter,
        path_chapter,
        para_chapter,
        anat_chapter,
        phys_chapter,
        bioc_chapter,
        micr_chapter,
        clin_chapter
    ]

    # Verification: total count & answer key balance
    total_q = sum(len(c["subjects"][0]["questions"]) for c in full_bank)
    final_counts = {0: 0, 1: 0, 2: 0, 3: 0}
    for c in full_bank:
        for q in c["subjects"][0]["questions"]:
            final_counts[q["correctIndex"]] += 1

    print("\n--- Verification Summary ---")
    print(f"Total practical stations: {total_q}")
    for c in full_bank:
        ch_q = len(c["subjects"][0]["questions"])
        ch_counts = {0: 0, 1: 0, 2: 0, 3: 0}
        for q in c["subjects"][0]["questions"]:
            ch_counts[q["correctIndex"]] += 1
        print(f"  Ch {c['id']} ({c['title']}): {ch_q} stations | Keys: {ch_counts}")
    print(f"Overall Answer Key Distribution: {final_counts}")

    assert total_q == 286, f"Expected 286 stations, found {total_q}"

    # Write to PRACTICAL_JSON_PATH
    with open(PRACTICAL_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(full_bank, f, indent=2, ensure_ascii=False)
    print(f"\n✓ Successfully compiled and saved 286 stations to {PRACTICAL_JSON_PATH}")

if __name__ == "__main__":
    main()

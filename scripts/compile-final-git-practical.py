#!/usr/bin/env python3
"""
ASU Medical Portal — GIT (MGL-3) Comprehensive Practical Exam Compiler
Assembles the complete 120 questions across 8 chapters with:
- Balanced answer keys (exactly 30 A, 30 B, 30 C, 30 D)
- Verified image assets on disk
- Balanced distractor lengths
- High-yield medical explanations
"""

import json
import os
import sys

from data_histology import HISTOLOGY_QUESTIONS
from data_anatomy import ANATOMY_QUESTIONS
from data_parasitology import PARASITOLOGY_QUESTIONS

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PRACTICAL_JSON_PATH = os.path.join(ROOT_DIR, "src/app/data/practical/mgl-3-practical.json")

def load_preserved_chapters():
    with open(PRACTICAL_JSON_PATH, "r", encoding="utf-8") as f:
        existing = json.load(f)
    preserved = {}
    for ch in existing:
        if ch["id"] in [302, 305, 306, 307, 308]:
            preserved[ch["id"]] = ch
    return preserved

def main():
    preserved_chapters = load_preserved_chapters()
    
    # Count preserved indices
    preserved_counts = {0: 0, 1: 0, 2: 0, 3: 0}
    for cid, ch in preserved_chapters.items():
        for q in ch["subjects"][0]["questions"]:
            preserved_counts[q["correctIndex"]] += 1
            
    print(f"Preserved questions: {sum(preserved_counts.values())}")
    print(f"Preserved index distribution: {preserved_counts}")
    
    # Target across all 120 questions is 30 each
    targets_needed = {
        0: 30 - preserved_counts[0],
        1: 30 - preserved_counts[1],
        2: 30 - preserved_counts[2],
        3: 30 - preserved_counts[3]
    }
    print(f"Indices needed for new questions (106 total): {targets_needed}")
    total_needed = sum(targets_needed.values())
    assert total_needed == 106, f"Expected 106, got {total_needed}"

    # Plan index allocations across Histology (28), Anatomy (37), Parasitology (41)
    # We will distribute systematically
    pool = []
    for idx, count in targets_needed.items():
        pool.extend([idx] * count)
    
    # Deterministic interleave so each subject has balanced distribution
    # Sort pool so [0, 1, 2, 3, 0, 1, 2, 3, ...]
    interleaved = []
    sub_pools = {0: [0]*targets_needed[0], 1: [1]*targets_needed[1], 2: [2]*targets_needed[2], 3: [3]*targets_needed[3]}
    while any(len(v) > 0 for v in sub_pools.values()):
        for i in [0, 1, 2, 3]:
            if sub_pools[i]:
                interleaved.append(sub_pools[i].pop())
                
    print(f"Interleaved {len(interleaved)} targets for new questions.")
    
    # Distribute:
    histo_targets = interleaved[:28]
    anat_targets = interleaved[28:28+37]
    para_targets = interleaved[28+37:]
    
    assert len(histo_targets) == 28
    assert len(anat_targets) == 37
    assert len(para_targets) == 41

    def build_question_obj(q_raw, target_idx, ch_id, subj_code):
        qid = f"MGL3-CH{ch_id}-{subj_code}-{q_raw['seq']:04d}"
        correct = q_raw["correct_answer"]
        distractors = list(q_raw["distractors"])
        
        # Place correct at target_idx
        options = distractors[:]
        options.insert(target_idx, correct)
        
        # Verify image on disk
        img_rel = q_raw["imageUrl"]
        disk_path = os.path.join(ROOT_DIR, "public", img_rel.lstrip("/"))
        if not os.path.exists(disk_path):
            raise FileNotFoundError(f"Missing image on disk: {disk_path}")
        size_kb = os.path.getsize(disk_path) / 1024
        if size_kb < 1.0:
            raise ValueError(f"Image too small ({size_kb:.2f} KB): {disk_path}")
            
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
            }
        }

    # 1. Build Histology Chapter (301)
    histo_questions = []
    for q_raw, target_idx in zip(HISTOLOGY_QUESTIONS, histo_targets):
        histo_questions.append(build_question_obj(q_raw, target_idx, 301, "HIST"))
        
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

    # 2. Build Parasitology Chapter (303)
    para_questions = []
    for q_raw, target_idx in zip(PARASITOLOGY_QUESTIONS, para_targets):
        para_questions.append(build_question_obj(q_raw, target_idx, 303, "PARA"))

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

    # 3. Build Anatomy Chapter (304)
    anat_questions = []
    for q_raw, target_idx in zip(ANATOMY_QUESTIONS, anat_targets):
        anat_questions.append(build_question_obj(q_raw, target_idx, 304, "ANAT"))

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

    # Assemble all 8 chapters in canonical numerical order: 301 to 308
    full_bank = [
        histo_chapter,
        preserved_chapters[302],
        para_chapter,
        anat_chapter,
        preserved_chapters[305],
        preserved_chapters[306],
        preserved_chapters[307],
        preserved_chapters[308]
    ]

    # Verification: total count & answer key balance
    total_q = sum(len(c["subjects"][0]["questions"]) for c in full_bank)
    final_counts = {0: 0, 1: 0, 2: 0, 3: 0}
    for c in full_bank:
        for q in c["subjects"][0]["questions"]:
            final_counts[q["correctIndex"]] += 1

    print(f"\nFinal Assembly Complete!")
    print(f"Total practical questions: {total_q}")
    print(f"Answer key distribution: {final_counts}")
    assert total_q == 120, f"Expected 120 questions, found {total_q}"
    assert all(cnt == 30 for cnt in final_counts.values()), f"Imbalanced keys: {final_counts}"

    # Write to PRACTICAL_JSON_PATH
    with open(PRACTICAL_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(full_bank, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved to {PRACTICAL_JSON_PATH}")

if __name__ == "__main__":
    main()

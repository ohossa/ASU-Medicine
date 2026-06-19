import re
import json
import os

def clean_field(t):
    t = t.strip('\r\n')
    if t.startswith('"') and t.endswith('"'):
        t = t[1:-1]
    t = t.replace('""', '"')
    return t.strip()

def process_cloze(text):
    blanks = []
    def replacer(match):
        content = match.group(1)
        parts = content.split('::')
        answer = parts[0].strip()
        blanks.append(answer)
        if len(parts) > 1 and parts[1].strip():
            hint = parts[1].strip()
            return f"___ ({hint})"
        else:
            return "___"
    
    processed_text = re.sub(r'\{\{c\d+::(.*?)\}\}', replacer, text)
    return processed_text, blanks

def make_completed_sentence(text):
    def replacer(match):
        content = match.group(1)
        parts = content.split('::')
        answer = parts[0].strip()
        return f"**{answer}**"
    return re.sub(r'\{\{c\d+::(.*?)\}\}', replacer, text)

# Predefined sequences of topics to guarantee textbook order
eye_anatomy = ["Bony Orbit", "Orbital Fascia", "Extra-ocular Muscles", "Lacrimal Apparatus", "Nerves of the Orbit", "Vessels of the Orbit", "Anatomy of the Eyelids (palpebrae)", "Development of the eye", "Visual Pathway", "Visual Reflexes"]
eye_histology = ["The Eye"]
eye_biochem = ["Visual cycle and vitamin A", "Deficiency of vitamin A"]
eye_physiology = ["Introduction to Vision Physiology and Vision Optics", "Light path through cornea, Aqueous humor and Lens", "Accommodation, Errors of refraction, and Iris", "Organization and Functions of Retinal Neurons", "Photoreceptors", "Dark and light adaptation, and visual cortex", "Color Vision, Binocular Vision, and Eye Movements"]
eye_microbiology = ["Infections of The Eye"]
eye_pathology = ["Diseases of The Eye"]
eye_pharma = ["Drug Therapy of Glaucoma"]
eye_clinical = ["Basic Neuro-ophthalmic Examination"]

ear_anatomy = ["Anatomy of the ear", "Auditory Pathway", "Development of the Ear", "Anatomy of the Facial Nerve", "Medial Longitudinal Fasciculus (Bundle)", "Vestibular Pathway"]
ear_histology = ["The Ear", "Structure of the Ear"]
ear_physiology = ["Physiology & Physics of Sound & Function of External and Middle Ear", "Physiology Function of Inner Ear", "Discrimination of Sounds and Hearing Impairment and Hearing Tests", "Posture and equilibrium"]
ear_microbiology = ["Infections of The Ear"]
ear_pathology = ["Diseases of The Ear"]
ear_clinical = ["Hearing Loss"]

chem_anatomy = ["Olfactory & Taste Pathways"]
chem_physiology = ["Physiology of Smell and Taste (Chemical Senses)"]
chem_clinical = ["Taste and Smell Disorders"]

# Mapping of (chapter_id, subject_id) to the textbook topic order
TOPIC_ORDER = {
    (1, "anatomy"): eye_anatomy,
    (1, "histology"): eye_histology,
    (1, "biochem"): eye_biochem,
    (1, "physiology"): eye_physiology,
    (1, "microbiology"): eye_microbiology,
    (1, "pathology"): eye_pathology,
    (1, "pharma"): eye_pharma,
    (1, "clinical"): eye_clinical,

    (2, "anatomy"): ear_anatomy,
    (2, "histology"): ear_histology,
    (2, "physiology"): ear_physiology,
    (2, "microbiology"): ear_microbiology,
    (2, "pathology"): ear_pathology,
    (2, "clinical"): ear_clinical,

    (3, "anatomy"): chem_anatomy,
    (3, "physiology"): chem_physiology,
    (3, "clinical"): chem_clinical,
}

SUBJECT_ORDER = ["anatomy", "histology", "physiology", "biochem", "microbiology", "pathology", "pharma", "clinical"]

SUBJECT_METADATA = {
    "anatomy": {"name": "Anatomy", "iconName": "Bone"},
    "histology": {"name": "Histology", "iconName": "Microscope"},
    "physiology": {"name": "Physiology", "iconName": "Activity"},
    "biochem": {"name": "Biochemistry", "iconName": "FlaskConical"},
    "microbiology": {"name": "Microbiology", "iconName": "Biohazard"},
    "pathology": {"name": "Pathology", "iconName": "ShieldAlert"},
    "pharma": {"name": "Pharmacology", "iconName": "Pill"},
    "clinical": {"name": "Clinical", "iconName": "Stethoscope"},
}

CHAPTER_METADATA = {
    1: {
        "title": "The Eye & Visual System",
        "subtitle": "Anatomy, Histology, Biochemistry, Physiology, Pathology, Pharmacology, and Clinical Ophthalmology of the Eye",
        "emoji": "👁️",
        "page": 4,
        "lectureRange": "Lectures 1-20"
    },
    2: {
        "title": "The Ear & Auditory/Vestibular Systems",
        "subtitle": "Anatomy, Histology, Physiology, Pathology, Microbiology, and Clinical Otorhinolaryngology of the Ear",
        "emoji": "👂",
        "page": 35,
        "lectureRange": "Lectures 21-27"
    },
    3: {
        "title": "Chemical Senses (Smell & Taste)",
        "subtitle": "Olfactory & Gustatory Anatomy, Physiology, and Clinical Disorders",
        "emoji": "👅",
        "page": 56,
        "lectureRange": "Lectures 28-30"
    }
}

def parse_anki_file(filepath):
    questions_by_location = {} # (chapter_id, subject_id, topic_name) -> list of questions
    duplicates_count = 0
    seen_questions = set()

    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith('#') or not line.strip():
                continue
            parts = line.split('\t')
            if len(parts) < 3:
                continue
            
            deck = clean_field(parts[0])
            front = clean_field(parts[1])
            back = clean_field(parts[2])
            
            # Exclude Practical
            if "::Practical::" in deck:
                continue
            
            # Match deck path
            # Expected format: Medicine ASU::Year 2::Semester 2::Special Senses::{Subject}::{Topic}
            match = re.search(r'Special Senses::([^:]+)::(.+)$', deck)
            if not match:
                print(f"Skipping line: deck '{deck}' does not match pattern")
                continue
            
            subject_raw, topic_name = match.groups()
            subject_raw = subject_raw.strip()
            topic_name = topic_name.strip()
            
            # Normalise subject_id
            subject_map = {
                "Anatomy": "anatomy",
                "Biochemistry": "biochem",
                "Histology": "histology",
                "Microbiology": "microbiology",
                "Ophthalmology": "clinical",
                "Otorhinolaryngology": "clinical",
                "Pathology": "pathology",
                "Pharmacology": "pharma",
                "Physiology": "physiology"
            }
            if subject_raw not in subject_map:
                print(f"Unknown subject: {subject_raw}")
                continue
            subject_id = subject_map[subject_raw]
            
            # Determine Chapter ID
            chapter_id = None
            for ch_id, ch_meta in CHAPTER_METADATA.items():
                # We check all topics in this chapter/subject combo
                key = (ch_id, subject_id)
                if key in TOPIC_ORDER and topic_name in TOPIC_ORDER[key]:
                    chapter_id = ch_id
                    break
            
            if chapter_id is None:
                # Let's check for case-insensitive or soft match
                for ch_id, ch_meta in CHAPTER_METADATA.items():
                    key = (ch_id, subject_id)
                    if key in TOPIC_ORDER:
                        if any(t.lower() == topic_name.lower() for t in TOPIC_ORDER[key]):
                            # Match found! Use the correct cased name
                            topic_name = next(t for t in TOPIC_ORDER[key] if t.lower() == topic_name.lower())
                            chapter_id = ch_id
                            break
            
            if chapter_id is None:
                print(f"Warning: could not assign topic '{topic_name}' under subject '{subject_id}' to any chapter.")
                continue
            
            # Deduplicate questions
            # We normalise the front text for duplicates check
            norm_front = re.sub(r'\s+', ' ', front).strip().lower()
            dupe_key = (chapter_id, subject_id, norm_front)
            if dupe_key in seen_questions:
                duplicates_count += 1
                continue
            seen_questions.add(dupe_key)
            
            # Parse question
            if "{{c" in front:
                q_type = "fillblank"
                processed_text, blanks = process_cloze(front)
                completed = make_completed_sentence(front)
                if back:
                    explanation = f"{back}\n\n**Completed Sentence:**\n{completed}"
                else:
                    explanation = f"**Completed Sentence:**\n{completed}"
                
                question_obj = {
                    "type": "fillblank",
                    "text": processed_text,
                    "blanks": blanks,
                    "explanation": explanation
                }
            else:
                q_type = "essay"
                question_obj = {
                    "type": "essay",
                    "text": front,
                    "modelAnswer": back if back else "No model answer provided.",
                    "explanation": "Model answer is provided based on the Special Senses syllabus."
                }
            
            # Keep topic name and associate
            loc_key = (chapter_id, subject_id, topic_name)
            if loc_key not in questions_by_location:
                questions_by_location[loc_key] = []
            questions_by_location[loc_key].append(question_obj)
            
    print(f"Parsing complete. Found {len(seen_questions)} unique questions. Removed {duplicates_count} duplicates.")
    return questions_by_location

def assemble_database(questions_by_location):
    chapters = []
    
    for ch_id in sorted(CHAPTER_METADATA.keys()):
        ch_meta = CHAPTER_METADATA[ch_id]
        chapter_subjects = []
        
        for subj_id in SUBJECT_ORDER:
            # Check if this subject has topics in this chapter
            key = (ch_id, subj_id)
            if key not in TOPIC_ORDER:
                continue
            
            topic_list = TOPIC_ORDER[key]
            subject_questions = []
            
            # Populate questions in textbook topic order
            for topic_idx, topic_name in enumerate(topic_list):
                loc_key = (ch_id, subj_id, topic_name)
                topic_qs = questions_by_location.get(loc_key, [])
                
                # Assign lecture index and sequential ID
                for q_idx, q in enumerate(topic_qs):
                    q_num = len(subject_questions) + 1
                    q["id"] = f"mss2-ch{ch_id}-{subj_id}-q{q_num}"
                    q["lecture"] = topic_idx + 1 # 1-based index in the topic_list
                    subject_questions.append(q)
            
            # Only include subject if there are questions or we want a skeleton.
            # Since the user requested to build the proper foundation, we should include the subjects even if empty,
            # but wait, the validator requires subjects to be non-empty or have questions.
            # Actually, let's include the subjects that have questions, and since we parsed the entire Anki file,
            # almost all subjects will be populated!
            if len(subject_questions) > 0:
                subj_meta = SUBJECT_METADATA[subj_id]
                chapter_subjects.append({
                    "id": subj_id,
                    "name": subj_meta["name"],
                    "iconName": subj_meta["iconName"],
                    "lectures": ", ".join(topic_list),
                    "lectureCount": len(topic_list),
                    "lectureNames": topic_list,
                    "questions": subject_questions
                })
                
        chapters.append({
            "id": ch_id,
            "title": ch_meta["title"],
            "subtitle": ch_meta["subtitle"],
            "emoji": ch_meta["emoji"],
            "page": ch_meta["page"],
            "lectureRange": ch_meta["lectureRange"],
            "subjects": chapter_subjects
        })
        
    return {
        "schemaVersion": 1,
        "meta": {
            "moduleCode": "MSS-2",
            "moduleName": "Special Senses Module",
            "year": 2,
            "semester": 2,
            "creditPoints": 4,
            "totalMarks": 80,
            "keywords": [
                "special senses",
                "senses",
                "mss",
                "eye",
                "ear",
                "ophthalmology",
                "ent",
                "vision",
                "hearing",
                "smell",
                "taste"
            ]
        },
        "chapters": chapters
    }

if __name__ == "__main__":
    anki_path = "/Users/omarhossa/Downloads/SS Anki.txt"
    out_path = "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/src/imports/year-2/semester-2/MSS-2.json.tmp"
    
    questions = parse_anki_file(anki_path)
    db = assemble_database(questions)
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
        
    print(f"Restructured database generated at: {out_path}")

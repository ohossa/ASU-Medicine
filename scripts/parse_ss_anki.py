import json

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
        "lectureRange": "Lectures 1-20",
        "keywords": ["eye", "vision", "orbit", "extra-ocular", "lacrimal", "retina", "photoreceptors", "glaucoma", "visual cycle", "accommodation"]
    },
    2: {
        "title": "The Ear & Auditory/Vestibular Systems",
        "subtitle": "Anatomy, Histology, Physiology, Pathology, Microbiology, and Clinical Otorhinolaryngology of the Ear",
        "emoji": "👂",
        "page": 35,
        "lectureRange": "Lectures 21-27",
        "keywords": ["ear", "hearing", "cochlea", "auditory", "vestibular", "balance", "facial nerve", "tympanic", "hearing loss"]
    },
    3: {
        "title": "Chemical Senses (Smell & Taste)",
        "subtitle": "Olfactory & Gustatory Anatomy, Physiology, and Clinical Disorders",
        "emoji": "👅",
        "page": 56,
        "lectureRange": "Lectures 28-30",
        "keywords": ["smell", "taste", "olfactory", "gustatory", "chemical senses", "olfaction", "taste buds"]
    }
}

def assemble_skeleton():
    chapters = []
    
    for ch_id in sorted(CHAPTER_METADATA.keys()):
        ch_meta = CHAPTER_METADATA[ch_id]
        chapter_subjects = []
        
        for subj_id in SUBJECT_ORDER:
            key = (ch_id, subj_id)
            if key not in TOPIC_ORDER:
                continue
            
            topic_list = TOPIC_ORDER[key]
            subj_meta = SUBJECT_METADATA[subj_id]
            
            chapter_subjects.append({
                "id": subj_id,
                "name": subj_meta["name"],
                "iconName": subj_meta["iconName"],
                "lectures": ", ".join(topic_list),
                "lectureCount": len(topic_list),
                "lectureNames": topic_list,
                "questions": []  # Empty array to allow future dynamic question ingestion
            })
                
        chapters.append({
            "id": ch_id,
            "title": ch_meta["title"],
            "subtitle": ch_meta["subtitle"],
            "emoji": ch_meta["emoji"],
            "page": ch_meta["page"],
            "lectureRange": ch_meta["lectureRange"],
            "keywords": ch_meta["keywords"],
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
    out_path = "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/src/imports/year-2/semester-2/MSS-2.json.tmp"
    
    db = assemble_skeleton()
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
        
    print(f"Clean restructuring skeleton generated at: {out_path}")

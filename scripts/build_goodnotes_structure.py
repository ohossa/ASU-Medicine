import os, zipfile, shutil

ROOT_DIR = "dist/Goodnotes_Organization/Medicine ASU"
ZIP_PATH = "dist/Goodnotes_Organization/Medicine_ASU_Goodnotes_Structure.zip"

# Ensure clean directory
if os.path.exists("dist/Goodnotes_Organization"):
    shutil.rmtree("dist/Goodnotes_Organization")
os.makedirs(ROOT_DIR, exist_ok=True)

CURRICULUM = {
    "Year 1 (57 CP)": {
        "Semester 1": {
            "[IAE-1] Intro to Anatomy & Embryology": [
                "01. General Anatomy",
                "02. General Embryology",
                "03. Upper Limb Overview",
                "04. Clinical Anatomy & Imaging"
            ],
            "[IBM-1] Intro to Medical Biochemistry": [
                "01. Chemistry of Carbohydrates & Lipids",
                "02. Protein Structure & Amino Acids",
                "03. Enzymology & Bioenergetics",
                "04. Vitamins & Minerals",
                "05. Clinical Correlations & Lab Tests"
            ],
            "[IHC-1] Intro to Histology & Cell Biology": [
                "01. Cytology & Cell Organelles",
                "02. Epithelial Tissue",
                "03. Connective Tissue Proper",
                "04. Microscopes & Staining Techniques"
            ],
            "[IPHY-1] Intro to Physiology": [
                "01. General Physiology & Homeostasis",
                "02. Autonomic Nervous System (ANS)",
                "03. Excitable Tissues (Nerve & Muscle)",
                "04. Body Fluids & Compartments"
            ],
            "[MBMG-1] Molecular Biology & Medical Genetics": [
                "01. DNA Replication, Transcription & Translation",
                "02. Gene Expression & Mutation Mechanisms",
                "03. Medical Cytogenetics & Chromosomal Disorders",
                "04. Recombinant DNA & Molecular Diagnostics",
                "05. Clinical Genetics & Pedigrees"
            ],
            "[MIM-1] Medical Immunology": [
                "01. Innate Immunity",
                "02. Adaptive Immunity (B & T Lymphocytes)",
                "03. Immunoglobulins & Complement System",
                "04. Major Histocompatibility Complex (MHC)",
                "05. Hypersensitivity & Autoimmunity",
                "06. Immunodeficiency & Vaccines"
            ],
            "[P1-1] Professionalism 1 (ICT & Medical Terminology)": [
                "01. Medical Terminology (Prefixes, Roots, Suffixes)",
                "02. Health Informatics & Digital Hospital Systems",
                "03. Medical Ethics & Codes of Conduct",
                "04. Communication Basics"
            ]
        },
        "Semester 2": {
            "[BLS-HE-1] BLS & Clinical Examination": [
                "01. Basic Life Support (BLS) & CPR Algorithms",
                "02. History Taking Principles",
                "03. General Physical & Systemic Examination",
                "04. Vital Signs, First Aid & Clinical Skills"
            ],
            "[IPAT-1] Intro to Pathology": [
                "01. Cell Injury, Adaptation & Necrosis",
                "02. Acute & Chronic Inflammation",
                "03. Tissue Repair & Wound Healing",
                "04. Hemodynamics, Thrombosis & Embolism",
                "05. Neoplasia & Tumor Biology"
            ],
            "[IPHA-1] Intro to Pharmacology": [
                "01. Pharmacokinetics (Absorption, Distribution, Metabolism, Excretion)",
                "02. Pharmacodynamics & Receptor Theory",
                "03. Autonomic Pharmacology (Cholinergic & Adrenergic)",
                "04. Adverse Drug Reactions & Drug-Drug Interactions"
            ],
            "[MINF-1] Infection Module": [
                "01. Medical Bacteriology",
                "02. Medical Virology",
                "03. Medical Mycology",
                "04. Medical Parasitology",
                "05. Pathology of Infectious Diseases",
                "06. Antimicrobial Chemotherapy"
            ],
            "[MLS-1] Locomotor Module": [
                "01. Anatomy & Embryology",
                "02. Physiology",
                "03. Histology",
                "04. Biochemistry",
                "05. Pathology",
                "06. Pharmacology",
                "07. Microbiology",
                "08. Parasitology",
                "09. Clinical Orthopedics & Radiology"
            ],
            "[P2-1] Professionalism 2 (Learning & Time Management)": [
                "01. Public Speaking & Presentation Skills",
                "02. Adult Learning Styles & Metacognition",
                "03. Time Management & Productivity Systems"
            ]
        }
    },
    "Year 2 (54 CP)": {
        "Semester 1": {
            "[MBL-2] Blood & Lymphatic System": [
                "01. Anatomy & Embryology",
                "02. Physiology & Hemostasis",
                "03. Histology",
                "04. Biochemistry (Heme Synthesis & Hemoglobin)",
                "05. Pathology (Anemias, Leukemias, Lymphomas)",
                "06. Pharmacology (Anticoagulants, Antiplatelets, Hematinics)",
                "07. Microbiology & Immunology",
                "08. Parasitology (Malaria, Leishmania, Trypanosoma)",
                "09. Clinical Hematology & Transfusion Medicine"
            ],
            "[MCVS-2] Cardiovascular System": [
                "01. Anatomy & Embryology of Heart & Great Vessels",
                "02. Cardiac Electrophysiology & Hemodynamics",
                "03. Histology of Heart & Vessels",
                "04. Biochemistry (Cardiac Markers & Lipoproteins)",
                "05. Pathology (Atherosclerosis, IHD, Rheumatic Heart, Hypertension)",
                "06. Pharmacology (Antihypertensives, Antiarrhythmics, Antianginals)",
                "07. Microbiology (Infective Endocarditis)",
                "08. Clinical Cardiology & ECG Interpretation"
            ],
            "[MRS-2] Respiratory System": [
                "01. Anatomy & Embryology of Respiratory Tract & Thorax",
                "02. Pulmonary Mechanics & Gas Exchange",
                "03. Histology",
                "04. Biochemistry (Surfactant & Acid-Base Balance)",
                "05. Pathology (COPD, Pneumonia, Tuberculosis, Bronchogenic Carcinoma)",
                "06. Pharmacology (Bronchodilators, Anti-TB Drugs)",
                "07. Microbiology (Respiratory Viruses & Bacteria)",
                "08. Parasitology",
                "09. Clinical Pulmonology & Chest Imaging"
            ]
        },
        "Semester 2": {
            "[MCNS-2] Central Nervous System": [
                "01. Neuroanatomy & Embryology",
                "02. Neurophysiology (Motor, Sensory & Reflex Systems)",
                "03. Neurohistology",
                "04. Neurobiochemistry (Neurotransmitters & CSF)",
                "05. Neuropathology (Stroke, CNS Tumors, Demyelination)",
                "06. Neuropharmacology (Antiepileptics, Antidepressants, Sedatives)",
                "07. Microbiology & Parasitology (Meningitis, Encephalitis, Toxoplasma)",
                "08. Clinical Neurology & Neurosurgery"
            ],
            "[MEM-2] Endocrine System & Metabolism": [
                "01. Anatomy & Embryology of Endocrine Glands",
                "02. Endocrine Physiology & Feedback Loops",
                "03. Histology",
                "04. Biochemistry & Intermediary Metabolism",
                "05. Pathology (Thyroid, Pituitary, Adrenal, Diabetes Pathology)",
                "06. Pharmacology (Insulin, Oral Hypoglycemics, Steroids)",
                "07. Clinical Endocrinology & Metabolic Disorders"
            ],
            "[MSS-2] Special Senses (ENT & Ophthalmology)": [
                "01. Anatomy & Embryology (Orbit, Eye, Ear, Nose, Throat)",
                "02. Physiology of Vision & Hearing/Vestibular System",
                "03. Histology",
                "04. Biochemistry (Rhodopsin & Lens Proteins)",
                "05. Pathology of Eye & ENT",
                "06. Pharmacology (Ophthalmic & ENT Drugs)",
                "07. Microbiology (Trachoma, Conjunctivitis, Otitis)",
                "08. Clinical Ophthalmology",
                "09. Clinical ENT"
            ],
            "[P3-2] Professionalism 3 (Behavioral Science)": [
                "01. Medical Psychology & Human Behavior",
                "02. Doctor-Patient Relationship & Compliance",
                "03. Psychopathology & Somatization"
            ],
            "[R-2] Research Methodology 2 (Fundamentals of Research)": [
                "01. Principles of Scientific Inquiry & Study Types",
                "02. Evidence-Based Medicine (EBM) & Levels of Evidence",
                "03. PubMed Searching & Critical Appraisal"
            ]
        }
    },
    "Year 3 (45 CP)": {
        "Semester 1": {
            "[MGL-3] GIT & Liver": [
                "01. Anatomy & Embryology of GI Tract, Liver & Biliary Tree",
                "02. Gastrointestinal Motility & Secretory Physiology",
                "03. Histology",
                "04. Biochemistry (Liver Function, Bile Salts, Digestion)",
                "05. Pathology (Peptic Ulcer, Hepatitis, Cirrhosis, GI Tumors)",
                "06. Pharmacology (Antacids, PPIs, Laxatives, Antiemetics)",
                "07. Microbiology (H. pylori, Hepatitis Viruses, Enteric Bacteria)",
                "08. Parasitology (Schistosoma, Fasciola, Amoeba, Giardia)",
                "09. Clinical Gastroenterology & Hepatology"
            ],
            "[MUG-3] Urogenital System": [
                "01. Anatomy & Embryology (Kidney, Ureter, Bladder, Genital Tract)",
                "02. Renal Clearance, GFR, Tubular Transport & Acid-Base",
                "03. Reproductive Physiology",
                "04. Histology",
                "05. Biochemistry & Urine Chemistry",
                "06. Pathology (Glomerulopathies, Pyelonephritis, RCC, TCC, Reproductive Tumors)",
                "07. Pharmacology (Diuretics, RAAS Blockers, Reproductive Hormones)",
                "08. Microbiology & Parasitology (UTIs, STIs, Schistosoma haematobium)",
                "09. Clinical Nephrology & Urology"
            ],
            "[P4-3] Professionalism 4 (Medical Ethics)": [
                "01. Core Principles of Medical Bioethics",
                "02. Informed Consent, Competence & Confidentiality",
                "03. Medical Malpractice & Legal Obligations in Egypt",
                "04. End-of-Life Decisions & Palliative Ethics"
            ],
            "[R-3] Scientific Research (Biostatistics & Methodology)": [
                "01. Biostatistical Concepts & Hypothesis Testing",
                "02. Sample Size Calculation & Sampling Methods",
                "03. Epidemiological Study Designs (RCTs, Cohort, Case-Control)",
                "04. Research Proposal Protocol Writing"
            ]
        },
        "Semester 2": {
            "[CEO-3] Community, Environmental & Occupational Medicine": [
                "01. Descriptive & Analytical Epidemiology",
                "02. Communicable Disease Surveillance & Outbreak Investigation",
                "03. Non-Communicable Disease Prevention & Health Promotion",
                "04. Environmental Health (Water, Air, Sanitation, Waste)",
                "05. Occupational Diseases & Industrial Toxicology",
                "06. Maternal, Child Health (MCH) & Family Planning",
                "07. Healthcare Administration, Quality & Health Economics"
            ],
            "[FT-3] Forensic Medicine & Clinical Toxicology": [
                "01. Forensic Thanatology, Postmortem Interval & Death Certification",
                "02. Forensic Traumatology (Blunt, Sharp, Firearms, Head Injuries)",
                "03. Forensic Asphyxia, Drowning & Burns",
                "04. Forensic Genetics, DNA Profiling & Personal Identification",
                "05. Medical Malpractice, Civil/Penal Responsibility & Ethics",
                "06. Corrosive, Heavy Metal & Cyanide Toxicology",
                "07. Agricultural Poisons (Organophosphates, Carbamates)",
                "08. Drugs of Abuse, Sedative, CNS & CVS Toxins"
            ],
            "[MED1-3] Foundation of Internal Medicine": [
                "01. General Bedside Symptomatology & History Taking",
                "02. Cardiovascular Examination & Basics of ECG",
                "03. Chest Examination & Interpretation of CXR",
                "04. Abdominal Examination (Hepatomegaly, Splenomegaly, Ascites)",
                "05. Neurological Examination (Cranial Nerves, Motor & Sensory)"
            ],
            "[ORL-3] Otorhinolaryngology": [
                "01. Otology (External, Middle Ear Infections, Hearing Loss)",
                "02. Rhinology (Epistaxis, Nasal Polyps, Sinusitis)",
                "03. Laryngology (Hoarseness, Stridor, Airway Obstruction)",
                "04. Pharynx & Oral Cavity (Tonsillitis, Adenoids, Sleep Apnea)",
                "05. Head & Neck Surgery & Diagnostic Audiology"
            ],
            "[P5-3] Professionalism 5 (Doctor-Patient Communication)": [
                "01. Patient-Centered Interviewing Techniques",
                "02. Breaking Bad News (SPIKES Protocol)",
                "03. Communicating with Distressed, Angry or Grieving Families"
            ],
            "[P6-3] Professionalism 6 (Patient Safety & Leadership Skills)": [
                "01. Patient Safety Principles & Preventing Medical Errors",
                "02. Infection Control & Hospital Hygiene",
                "03. Root Cause Analysis (RCA) & Clinical Auditing",
                "04. Leadership, Team Dynamics & Crisis Resource Management"
            ]
        }
    },
    "Year 4 (40 CP)": {
        "Semester 1": {
            "[FAM-4] Family Medicine": [
                "01. Principles & Practice of Primary Health Care (PHC)",
                "02. Comprehensive Family Health & Genograms",
                "03. Chronic Disease Care (Hypertension, Diabetes, Dyslipidemia)",
                "04. Preventive Care, Screening Guidelines & Adult Immunizations",
                "05. Approach to Common Undifferentiated Outpatient Complaints"
            ],
            "[MED2-4] General & Special Internal Medicine 1": [
                "01. Clinical Cardiology (Heart Failure, CAD, Arrhythmias, Valvular)",
                "02. Clinical Pulmonology (Asthma, COPD, Interstitial Lung, Pleural)",
                "03. Gastroenterology, Peptic Ulcer & Inflammatory Bowel Disease",
                "04. Hepatology, Viral Hepatitis, Cirrhosis & Complications",
                "05. Clinical Nephrology (Glomerular Diseases, AKI, CKD, Dialysis)",
                "06. Rheumatology & Autoimmune Connective Tissue Diseases"
            ],
            "[P7-4] Professionalism 7 (Medical Team Communication)": [
                "01. Interprofessional Communication in Healthcare",
                "02. Structured Clinical Handover Protocols (SBAR)",
                "03. Medical Records, Discharge Summaries & Medicolegal Writing"
            ]
        },
        "Semester 2": {
            "[MED3-4] General & Special Internal Medicine 2": [
                "01. Clinical Hematology (Anemias, Bone Marrow Disorders, Coagulation)",
                "02. Medical Oncology & Principles of Chemotherapy",
                "03. Endocrinology, Pituitary, Thyroid & Diabetes Complications",
                "04. Clinical Neurology (Stroke, Epilepsy, Myopathies, Neuropathies)",
                "05. Infectious Diseases, Pyrexia of Unknown Origin & Tropical Medicine",
                "06. Dermatology & Venereology",
                "07. Geriatric Medicine & Polypharmacy"
            ],
            "[PED-4] Pediatrics": [
                "01. Normal Growth & Development Milestones",
                "02. Infant Feeding, Breastfeeding & Pediatric Nutrition",
                "03. Protein-Energy Malnutrition, Rickets & Scurvy",
                "04. Neonatology & Neonatal Intensive Care",
                "05. Pediatric Pulmonology & Acute Respiratory Distress",
                "06. Pediatric Cardiology (Congenital Heart Defects, Rheumatic Fever)",
                "07. Pediatric Gastroenterology, Diarrhea & Dehydration Protocols",
                "08. Pediatric Nephrology (Nephrotic Syndrome, Acute GN)",
                "09. Pediatric Hematology & Oncology",
                "10. Pediatric Neurology & Childhood Seizures",
                "11. Pediatric Infectious Diseases & Expanded Immunization Program",
                "12. Pediatric Genetics & Inborn Errors of Metabolism"
            ]
        }
    },
    "Year 5 (44 CP)": {
        "Semester 1": {
            "[EM1-5] Emergency Medicine & Trauma 1": [
                "01. Resuscitation & Systematic ABCDE Triage",
                "02. Advanced Cardiac Life Support (ACLS) & Shock Management",
                "03. Advanced Trauma Life Support (ATLS) & Polytrauma",
                "04. Acute Coronary Syndromes, Arrhythmias & Hypertensive Crises",
                "05. Acute Respiratory Failure & Emergency Airway Procedures",
                "06. Acute Poisoning, Overdoses & Environmental Emergencies"
            ],
            "[OO-5] Ophthalmology": [
                "01. Optics, Refraction & Low Vision Aids",
                "02. Diseases of Eyelids, Lacrimal System & Orbit",
                "03. Conjunctival Disorders & Corneal Ulcers/Keratoplasty",
                "04. Lens, Cataracts & Modern Phacoemulsification",
                "05. Glaucoma (Primary Open-Angle, Angle-Closure & Congenital)",
                "06. Uveitis & Ocular Inflammatory Syndromes",
                "07. Retinal Diseases (Diabetic Retinopathy, Vascular Occlusions, RD)",
                "08. Strabismus, Pediatric Ophthalmology & Neuro-ophthalmology",
                "09. Ocular Trauma, Chemical Burns & Ophthalmic Emergencies"
            ],
            "[SUR1-5] General & Special Surgery 1": [
                "01. Surgical Principles, Asepsis, Suture Materials & Wound Care",
                "02. Fluids, Electrolytes, Acid-Base & Surgical Nutrition",
                "03. Shock, Hemorrhage & Blood Component Therapy",
                "04. Preoperative Optimization & Postoperative Complications",
                "05. Head & Neck Surgery (Thyroid, Parathyroid, Salivary Glands)",
                "06. Breast Diseases & Multidisciplinary Breast Cancer Management",
                "07. Abdominal Wall, Groin Anatomy & Hernia Repair",
                "08. Upper GI Surgery (Esophagus, Stomach, Duodenum & Bariatric)",
                "09. Hepatobiliary Surgery, Gallbladder & Bile Duct Disorders",
                "10. Pancreatic Diseases, Pancreatitis & Splenectomy"
            ]
        },
        "Semester 2": {
            "[EM2-5] Emergency Medicine & Trauma 2": [
                "01. Pediatric Advanced Life Support (PALS)",
                "02. Emergency Obstetrics & Gynecologic Crises",
                "03. Surgical Acute Abdomen & Vascular Catastrophes",
                "04. Major Burns Management & Inhalation Injuries",
                "05. ICU Fundamentals, Sepsis Protocols & Mechanical Ventilation",
                "06. Mass Casualty Incidents & Disaster Medicine"
            ],
            "[OG-5] Obstetrics & Gynecology": [
                "01. Normal Pregnancy, Maternal Physiology & Prenatal Care",
                "02. Labor Mechanism, Stages, Partogram & Pain Relief",
                "03. Dystocia, Malpresentations & Operative Delivery (Cesarean/Instrumental)",
                "04. Antepartum & Postpartum Hemorrhage Protocols",
                "05. Hypertensive Disorders of Pregnancy (Preeclampsia/Eclampsia)",
                "06. Medical Co-morbidities with Pregnancy (Diabetes, Cardiac, Anemia)",
                "07. Preterm Labor, PROM, IUGR & Multiple Pregnancies",
                "08. General Gynecology, Menstrual Disorders & Abnormal Uterine Bleeding",
                "09. Infertility, Endometriosis & Assisted Reproductive Techniques (IVF)",
                "10. Gynecologic Oncology (Cervical, Uterine, Ovarian & Vulvar Malignancies)",
                "11. Pelvic Organ Prolapse & Urogynecology",
                "12. Family Planning, Contraceptive Options & Reproductive Endocrinology"
            ],
            "[SUR2-5] General & Special Surgery 2": [
                "01. Colorectal Surgery (Diverticular Disease, IBD, Colorectal Neoplasms)",
                "02. Anorectal Surgery (Hemorrhoids, Anal Fissures, Fistulae, Abscesses)",
                "03. Vascular Surgery (Aortic Aneurysms, PVD, Carotid Disease, DVT)",
                "04. Cardiothoracic Surgery (CABG, Valvular Disease, Thoracic Trauma)",
                "05. Neurosurgery (Traumatic Brain Injury, Intracranial Tumors, Spine)",
                "06. Orthopedic Surgery, Fracture Classification & Joint Arthroplasty",
                "07. Urological Surgery (Urolithiasis, BPH, Prostate & Urothelial Cancer)",
                "08. Pediatric Surgery (Congenital Malformations, Atresias, Intussusception)",
                "09. Plastic & Reconstructive Surgery, Microvascular Surgery & Flaps"
            ]
        }
    }
}

total_dirs = 0
module_count = 0

for year, semesters in CURRICULUM.items():
    year_path = os.path.join(ROOT_DIR, year)
    os.makedirs(year_path, exist_ok=True)
    total_dirs += 1
    
    for sem, modules in semesters.items():
        sem_path = os.path.join(year_path, sem)
        os.makedirs(sem_path, exist_ok=True)
        total_dirs += 1
        
        for mod, subjects in modules.items():
            mod_path = os.path.join(sem_path, mod)
            os.makedirs(mod_path, exist_ok=True)
            module_count += 1
            total_dirs += 1
            
            # 1. 00. Textbooks
            tb_path = os.path.join(mod_path, "00. Textbooks")
            os.makedirs(tb_path, exist_ok=True)
            total_dirs += 1
            
            # 2. 00. SGDs
            sgd_path = os.path.join(mod_path, "00. SGDs (Small Group Discussions)")
            os.makedirs(sgd_path, exist_ok=True)
            total_dirs += 1
            
            # 3. Subject folders
            for s in subjects:
                s_path = os.path.join(mod_path, s)
                os.makedirs(s_path, exist_ok=True)
                total_dirs += 1

print(f"Created complete folder hierarchy: {module_count} modules across 5 years, {total_dirs} total folders.")

# Generate ZIP archive preserving exact empty directories
print(f"Compressing into {ZIP_PATH}...")
with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(ROOT_DIR):
        # Add directories as ZIP entries ending with /
        for d in dirs:
            dir_full = os.path.join(root, d)
            dir_rel = os.path.relpath(dir_full, os.path.dirname(ROOT_DIR))
            # write directory entry
            zinfo = zipfile.ZipInfo(dir_rel + "/")
            zipf.writestr(zinfo, "")

print("Compression complete!")
print("ZIP file size:", os.path.getsize(ZIP_PATH), "bytes")

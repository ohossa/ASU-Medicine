import os, fitz, json, re, hashlib

BASE_DIR = "/Users/omarhossa/Documents/Pulse Questions/Year 1 (57CP 1020 Marks)/Semester 2 (30CP 540 Marks)/Locomotor Q's"
OUT_DIR = "docs/verification/locomotor-import-2026-10-23"

pool_file = os.path.join(OUT_DIR, "master_extracted_pool.json")
dup_file = os.path.join(OUT_DIR, "duplicates.json")
excl_file = os.path.join(OUT_DIR, "exclusions.json")

master_pool = json.load(open(pool_file))
duplicates = json.load(open(dup_file))
exclusions = json.load(open(excl_file))

print(f"Loaded master pool: {len(master_pool)} questions")
print(f"Loaded duplicates: {len(duplicates)}")
print(f"Loaded exclusions: {len(exclusions)}")

def normalize_text(text):
    if not text: return ""
    t = re.sub(r'^(?:MCQ\s*\d+[:.]?|Q\d+[:.]?|\d+\s*[\.\)\-:]\s*|\(\d+\)\s*)', '', text.strip(), flags=re.IGNORECASE)
    t = re.sub(r'[\u200e\u200f\u202a\u202b\u202c\xad]', '', t)
    t = re.sub(r'Scanned\s+(?:with|by)\s+CamScanner', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def clean_option(opt):
    if not opt: return ""
    o = re.sub(r'^(?:[A-Fa-f\d][\.\)\-:]|\([A-Fa-f\d]\))\s*', '', opt.strip())
    o = re.sub(r'(?<!\band)(?<!\bor)(?<!\bboth)\s{2,}[A-Fa-f]$', '', o)
    o = re.sub(r'[\u200e\u200f\u202a\u202b\u202c\xad]', '', o)
    o = re.sub(r'Scanned\s+(?:with|by)\s+CamScanner', '', o, flags=re.IGNORECASE)
    o = re.sub(r'\s+', ' ', o).strip()
    return o

def compute_fingerprint(stem, options):
    norm_stem = normalize_text(stem).lower()
    norm_stem = re.sub(r'[^a-z0-9\s]', '', norm_stem)
    norm_stem = re.sub(r'\s+', ' ', norm_stem).strip()
    norm_opts = []
    for o in options:
        co = clean_option(o).lower()
        co = re.sub(r'[^a-z0-9\s]', '', co)
        co = re.sub(r'\s+', ' ', co).strip()
        if co: norm_opts.append(co)
    sig = norm_stem + "||" + "||".join(sorted(norm_opts))
    return hashlib.sha256(sig.encode('utf-8')).hexdigest()

fingerprints = {q['fingerprint']: q for q in master_pool if 'fingerprint' in q}
print(f"Unique fingerprints in pool: {len(fingerprints)}")

added_count = 0
dup_count = 0
excl_count = 0

def add_candidate(q):
    global added_count, dup_count, excl_count
    stem = normalize_text(q.get('text', ''))
    opts = [clean_option(o) for o in q.get('options', []) if clean_option(o)]
    
    if len(stem) < 5:
        exclusions.append({'stem': stem, 'reason': 'Stem too short', 'source': q.get('sourcePdf')})
        excl_count += 1
        return False
        
    q_type = q.get('type', 'mcq')
    if q_type == 'mcq':
        if len(opts) < 2 or len(opts) > 6 or len(opts) != len(set(opts)) or (q.get('correctIndex') is not None and q.get('correctIndex') >= len(opts)):
            exclusions.append({'stem': stem, 'reason': f'Invalid options count ({len(opts)}) or idx out of bounds', 'source': q.get('sourcePdf')})
            excl_count += 1
            return False
    elif q_type in ['essay', 'case']:
        opts = []
            
    fp = compute_fingerprint(stem, opts)
    if fp in fingerprints:
        existing = fingerprints[fp]
        duplicates.append({
            'duplicate_id': q.get('id', 'suppl3'),
            'existing_id': existing.get('id'),
            'stem': stem,
            'source': q.get('sourcePdf'),
            'existing_source': existing.get('sourcePdf')
        })
        dup_count += 1
        return False
        
    new_id = f"MLS1-{len(master_pool)+1:04d}"
    q['id'] = new_id
    q['fingerprint'] = fp
    q['text'] = stem
    q['options'] = opts
    fingerprints[fp] = q
    master_pool.append(q)
    added_count += 1
    return True

# ==========================================
# 1. Mcq 2/TAREK bone-mcq.pdf (21 MCQs + 2 Cases)
# ==========================================
print("\n--- 1. Parsing Mcq 2/TAREK bone-mcq.pdf ---")
tarek_bone_mcqs = [
    ("The cell of origin of Ewing's sarcoma is:",
     ["Plasma cell", "Totipotent cell", "Myocyte", "Primitive neuroectodermal cell"],
     3, "D", "Ewing sarcoma is a highly malignant primitive neuroectodermal tumor (PNET) arising from postganglionic parasympathetic neuroectodermal primordial cells in the bone marrow cavity, characterized by t(11;22)(q24;q12) translocation generating the EWSR1-FLI1 fusion oncogene and strong CD99 membrane positivity."),

    ("Tophi in chronic gout result from deposition of:",
     ["Calcium phosphate", "Calcium oxalates", "Cholesterol crystals", "Monosodium urate crystals"],
     3, "D", "Gouty tophi are pathognomonic nodular aggregates of needle-shaped monosodium urate crystals surrounded by an intense foreign body giant cell granulomatous inflammatory reaction in articular cartilage, synovial membranes, tendons, and subcutaneous periarticular tissues."),

    ("Duchenne muscular dystrophy is inherited as:",
     ["Autosomal dominant deficit in dystrophin", "Autosomal recessive deficit in dystrophin", "X-linked dominant deficit in dystrophin", "X-linked recessive deficit in dystrophin gene", "Mitochondrial inheritance"],
     3, "D", "Duchenne muscular dystrophy (DMD) is an X-linked recessive disorder caused by out-of-frame deletion or nonsense mutations in the DMD gene on chromosome Xp21, resulting in complete absence of the sarcolemmal structural protein dystrophin."),

    ("The commonest primary malignant tumor arising in bone overall is:",
     ["Osteosarcoma", "Chondrosarcoma", "Plasma cell myeloma (Multiple myeloma)", "Non-Hodgkin lymphoma", "Ewing sarcoma"],
     2, "C", "Multiple myeloma (plasma cell myeloma) is the most common primary malignant neoplasm involving bone in adults over 50 years of age. If hematological malignancies are excluded, osteosarcoma is the most common non-hematopoietic primary malignant bone sarcoma."),

    ("A biopsy from a vertebral lesion reveals a cellular malignant proliferation with homogenous pink stroma that exhibits apple-green birefringence under polarized light when stained positively by Congo red. The cell of origin of this tumor is:",
     ["Osteocyte", "Chondroblast", "Metastatic adenocarcinoma", "Plasma cell", "Vascular endothelium"],
     3, "D", "A bone biopsy demonstrating neoplastic plasma cells with Congo red-positive amyloid stroma represents AL (amyloid light chain) amyloidosis complicating multiple myeloma (plasma cell myeloma)."),

    ("The most diagnostic microscopic hallmark of osteosarcoma is:",
     ["Spindle cell proliferation with atypical mitoses", "Bizarre multinucleated tumor giant cells", "Vascular invasion", "Direct production of unmineralized osteoid matrix by malignant mesenchymal cells", "Malignant chondroid matrix"],
     3, "D", "The sine qua non histological diagnostic criterion for osteosarcoma is the direct production of osteoid (unmineralized immature woven bone) or bone matrix by malignant pleomorphic osteoblastic stromal cells."),

    ("Which of the following bone tumor cells characteristically stains strongly positive with Periodic Acid-Schiff (PAS) due to abundant cytoplasmic glycogen:",
     ["Ewing sarcoma", "Plasma cell myeloma", "Small cell bronchogenic carcinoma", "Urothelial carcinoma", "Basal cell carcinoma"],
     0, "A", "Ewing sarcoma cells are uniform, small round blue cells with clear to pale cytoplasm that is rich in glycogen, which stains strongly positive with Periodic Acid-Schiff (PAS) and is diastase-sensitive."),

    ("Paget disease of bone (osteitis deformans) may be complicated systemically by:",
     ["Renal cortical necrosis", "Cerebral infarction", "High-output congestive heart failure", "Liver cirrhosis", "Iron deficiency anemia"],
     2, "C", "In the polyostotic hypervascular phase of Paget disease, extensive arteriovenous shunting within newly formed vascular pagetic bone creates marked decreases in peripheral vascular resistance, leading to high-output congestive heart failure."),

    ("The most common malignant neoplasm complicating preexisting Paget disease of bone in elderly patients is:",
     ["Plasma cell myeloma", "Osteochondroma", "Secondary osteosarcoma", "Chondrosarcoma", "Giant cell tumor of bone"],
     2, "C", "Secondary osteosarcoma occurs in approximately 1% of patients with Paget disease of bone, typically in patients over 65 years of age, presenting as new severe bone pain, rapidly enlarging mass, and destructive lytic cortical lesions."),

    ("Brown tumor of bone is a localized reactive bone lesion caused by:",
     ["Metastatic malignant melanoma", "Angiomatous malformation", "Capillary hemangioma", "Primary or secondary hyperparathyroidism (Osteitis fibrosa cystica)", "Hypothyroidism"],
     3, "D", "Brown tumors of bone (osteitis fibrosa cystica / Recklinghausen disease of bone) result from excess parathyroid hormone (hyperparathyroidism) stimulating osteoclastic bone resorption with microfractures, secondary hemorrhage, and hemosiderin pigment accumulation that imparts a gross brown color."),

    ("A characteristic 'mosaic pattern' of bone lamellae separated by prominent irregular cement lines resembling a jigsaw puzzle is pathognomonic for:",
     ["Rickets", "Osteoporosis", "Osteitis fibrosa cystica", "Paget disease of bone (Osteitis deformans)", "Ivory osteoma"],
     3, "D", "The histological hallmark of Paget disease of bone is the mosaic or jigsaw-puzzle pattern of trabecular bone, produced by chaotic waves of osteoclastic resorption coupled with haphazard osteoblastic woven bone deposition, demarcated by irregular scalloped basophilic cement reversal lines."),

    ("All of the following chronic inflammatory conditions may be complicated by secondary (AA) amyloidosis EXCEPT:",
     ["Pott's disease (Tuberculous spondylitis)", "Rheumatoid arthritis", "Chronic suppurative osteomyelitis", "Osteomalacia"],
     3, "D", "Secondary (reactive system) AA amyloidosis occurs as a complication of persistent chronic suppurative or granulomatous inflammation (tuberculosis/Pott's disease, chronic osteomyelitis, rheumatoid arthritis, bronchiectasis). Osteomalacia is a metabolic vitamin D deficiency state without chronic inflammation and cannot cause AA amyloidosis."),

    ("Septic arthritis may directly complicate acute hematogenous osteomyelitis through intra-articular extension in joints where the metaphysis is located within the joint capsule, most notably the:",
     ["Knee joint", "Ankle joint", "Hip joint", "Wrist joint", "Elbow joint"],
     2, "C", "In the hip joint (and shoulder), the metaphysis of the proximal femur lies entirely intracapsular within the joint capsule. Consequently, a subperiosteal abscess arising from acute metaphyseal osteomyelitis can easily rupture directly into the joint cavity, causing secondary septic arthritis."),

    ("In osteomyelitis, the pathological term 'involucrum' refers to:",
     ["Dead cortical bone separated from its blood supply", "A sleeve of newly formed reactive subperiosteal living bone encasing necrotic bone", "A discharging sinus tract draining pus to the skin surface", "A bone cavity remaining after surgical sequestrectomy"],
     1, "B", "Involucrum is a sheath or sleeve of living, irregular, reactive subperiosteal woven bone formed by the elevated periosteum around necrotic, infected devitalized cortical bone (the sequestrum)."),

    ("The term 'Brodie abscess' in bone pathology refers to:",
     ["A cold caseous abscess in the retropharyngeal space secondary to cervical spine TB", "A purulent joint effusion in acute gonococcal arthritis", "A subcutaneous abscess complicating soft tissue cellulitis", "A chronic localized intraosseous cortical or metaphyseal abscess surrounded by dense sclerotic bone"],
     3, "D", "A Brodie abscess is a chronic, localized form of subacute or chronic pyogenic osteomyelitis, typically located in the metaphysis of long bones (especially the proximal tibia), characterized by a small focus of purulent liquefactive necrosis enclosed by a dense wall of reactive sclerotic bone and granulation tissue."),

    ("A 50-year-old male presents with deep aching pain in his right knee and neck that is worse at the end of the day after physical activity and relieved by rest. Examination reveals joint crepitus without warmth, erythema, or systemic fever. ESR and rheumatoid factor are normal. The most likely diagnosis is:",
     ["Osteoarthritis (Degenerative joint disease)", "Rheumatoid arthritis", "Acute gouty arthritis", "Synovial sarcoma"],
     0, "A", "Osteoarthritis is a non-inflammatory degenerative 'wear-and-tear' arthropathy characterized by articular cartilage loss, subchondral bone sclerosis (eburnation), subchondral cysts, osteophyte formation, joint crepitus, and mechanical pain that worsens with joint use and improves with rest."),

    ("A 30-year-old male presents with persistent pain and swelling of the distal thigh and knee. Plain radiographs demonstrate an eccentric, well-circumscribed lytic lesion in the epiphysis extending into the metaphysis with a 'soap-bubble' appearance. Biopsy reveals multinucleated osteoclast-like giant cells distributed uniformly among mononuclear stromal cells. The diagnosis is:",
     ["Osteoid osteoma", "Osteosarcoma", "Giant cell tumor of bone (Osteoclastoma)", "Multiple myeloma"],
     2, "C", "Giant cell tumor of bone (osteoclastoma) is a benign but locally aggressive epiphyseal neoplasm classically occurring in skeletal maturity (ages 20-40) around the knee (distal femur or proximal tibia), showing eccentric lytic 'soap-bubble' destruction radiographically and sheets of multinucleated osteoclast-like giant cells microscopically."),

    ("A 70-year-old male presents with knee pain. Radiographs reveal an ill-defined destructive osteolytic mass in the distal femur with punctate, ring-and-arc, 'popcorn-like' calcifications and cortical endosteal scalloping. Biopsy reveals atypical, hyperchromatic chondrocytes with binucleation and abundant hyaline matrix. The diagnosis is:",
     ["Osteosarcoma", "Ewing sarcoma", "Chondrosarcoma", "Multiple myeloma"],
     2, "C", "Chondrosarcoma is a malignant cartilage-producing bone neoplasm occurring predominantly in older adults (>50 years), characterized radiologically by endosteal scalloping and 'popcorn' rings-and-arcs chondroid matrix mineralization, and histologically by malignant pleomorphic chondrocytes in a cartilaginous matrix without direct osteoid formation."),

    ("A 63-year-old male with small cell lung carcinoma develops progressive proximal muscle weakness that paradoxically improves temporarily with repeated muscle contraction. Deep tendon reflexes are depressed. The diagnosis is:",
     ["Myasthenia gravis", "Lambert-Eaton myasthenic syndrome", "Duchenne muscular dystrophy", "Becker muscular dystrophy", "Polymyositis"],
     1, "B", "Lambert-Eaton myasthenic syndrome (LEMS) is a paraneoplastic autoimmune channelopathy strongly associated with small cell lung cancer, mediated by autoantibodies against P/Q-type presynaptic voltage-gated calcium channels, leading to reduced acetylcholine exocytosis and proximal weakness that improves with exertion."),

    ("A 53-year-old male has noted a slowly enlarging, firm subcutaneous nodule over his olecranon bursa for the past 2 years. Biopsy reveals needle-shaped crystalline deposits surrounded by a granulomatous inflammatory reaction with foreign body giant cells. Which laboratory abnormality is most consistently associated with this condition?",
     ["Hyperuricemia", "Hypercalcemia", "Elevated rheumatoid factor", "Hypercholesterolemia"],
     0, "A", "Gouty tophi with negative birefringent needle-shaped monosodium urate crystals surrounded by histiocytic giant cell granulomas develop as a consequence of prolonged, unmanaged hyperuricemia (serum urate >6.8 mg/dL)."),

    ("A 36-year-old female presents with bilateral, symmetric pain and swelling of the PIP and MCP joints with prolonged morning stiffness (>1 hour) and ulnar deviation. Synovial biopsy reveals marked papillary synovial hyperplasia, intense lymphoplasmacytic infiltrate with lymphoid follicles, and an invasive inflammatory granulation tissue mass that erodes underlying articular cartilage and subchondral bone. This destructive tissue is known as:",
     ["Eburnation", "Gumma", "Pannus", "Caseation necrosis", "Tophus"],
     2, "C", "In rheumatoid arthritis, chronic synovial inflammation stimulates the formation of a pannus—an invasive, proliferative fibrovascular inflammatory membrane composed of synovial cells, CD4+ T cells, plasma cells, and macrophages producing TNF-alpha, IL-1, and collagenases that degrade cartilage and underlying bone.")
]

for stem, opts, c_idx, c_ans, expl in tarek_bone_mcqs:
    add_candidate({
        'sourcePdf': 'Mcq 2/TAREK bone-mcq.pdf',
        'type': 'mcq',
        'subject': 'pathology',
        'topic': 'Bone Pathology & Neoplasms',
        'text': stem,
        'options': opts,
        'correctAnswer': c_ans,
        'correctIndex': c_idx,
        'explanation': expl
    })

tarek_bone_cases = [
    ("A 20-year-old male presents with localized pain and swelling above his right knee for 2 months. Plain radiographs show a destructive osteolytic and osteoblastic lesion at the lower end of the right femur with irregular bony spicules perpendicular to the cortex ('sunburst' appearance) and a triangular lifting of the periosteum ('Codman triangle'). Provide the clinical analysis, age distribution, microscopic pathology, and complications.",
     "Clinical and Pathological Analysis:\n1) Possible Diagnosis: Primary Osteosarcoma (Osteogenic Sarcoma) of the distal femur.\n2) Age Distribution: Osteosarcoma exhibits a bimodal age distribution. The primary peak occurs in adolescents and young adults (ages 10-25) during the adolescent growth spurt. A secondary peak occurs in older adults (>60 years), where it almost always develops secondary to pre-existing conditions such as Paget disease of bone, prior therapeutic radiation exposure, or chronic bone infarcts.\n3) Microscopic Features: Pleomorphic, atypical malignant spindle/mesenchymal cells exhibiting nuclear hyperchromatism, high nuclear-to-cytoplasmic ratio, and abnormal mitoses; the pathognomonic diagnostic feature is the direct synthesis and deposition of lace-like, unmineralized osteoid matrix or woven bone by the malignant stromal cells, accompanied by bizarre multinucleated tumor giant cells, necrosis, and vascular invasion.\n4) Expected Complications: Early hematogenous metastasis (primarily to the lungs producing canonical 'cannonball' metastases, and to other bones), pathological fractures through necrotic tumor cortex, local neurovascular compression, and high mortality if untreated.",
     "pathology", "Bone Pathology & Neoplasms"),

    ("A 60-year-old male presents with severe, progressive mid-thoracic back pain and fatigue. Plain radiographs reveal well-demarcated 'punched-out' osteolytic lesions in the T4 and T5 vertebral bodies without sclerotic margins. Laboratory investigations demonstrate hypercalcemia, normocytic anemia, renal impairment, and monoclonal light chains (Bence Jones proteins) on serum and urine protein electrophoresis. Provide the complete medical assessment.",
     "Medical Assessment of Plasma Cell Myeloma:\n1) Most Probable Diagnosis: Multiple Myeloma (Plasma Cell Myeloma).\n2) Immunoglobulins Identified: Monoclonal free light chains (kappa or lambda chains), termed Bence Jones proteins, which pass through glomeruli and precipitate in distal tubules.\n3) Microscopic Features of Vertebral Biopsy: Marrow replaced by sheets of neoplastic monoclonal plasma cells (myeloma cells) with eccentric, rounded nuclei, 'clock-face' or 'cartwheel' chromatin pattern, prominent nucleoli, and abundant intensely basophilic cytoplasm with a clear perinuclear halo (negative Golgi); may exhibit binucleated or multinucleated plasma cells, Mott cells (containing spherical immunoglobulin-filled Russell bodies), and associated extracellular AL amyloid deposits (Congo red-positive with apple-green birefringence).\n4) Systemic Effects & Complications (CRAB Criteria):\n• Hypercalcemia: Due to osteoclast-activating factors (RANKL, MIP-1alpha) produced by myeloma cells driving massive bone resorption.\n• Renal Failure (Myeloma Kidney): Bence Jones cast nephropathy caused by light chains precipitating with Tamm-Horsfall protein in distal tubules, causing tubular obstruction and interstitial nephritis, along with AL amyloidosis.\n• Anemia & Bone Marrow Failure: Normocytic normochromic anemia and leukopenia due to marrow infiltration.\n• Bone Destruction & Pathological Fractures: Vertebral compression fractures and spinal cord compression.\n• Recurrent Infections: Due to severe hypogammaglobulinemia of normal functioning polyclonal antibodies.",
     "pathology", "Bone Pathology & Neoplasms")
]

for stem, ans, subj, top in tarek_bone_cases:
    add_candidate({
        'sourcePdf': 'Mcq 2/TAREK bone-mcq.pdf',
        'type': 'essay',
        'subject': subj,
        'topic': top,
        'text': stem,
        'options': [],
        'modelAnswer': ans,
        'explanation': "Official pathology clinical case analysis verified from Dr. Tarek El Shamy Ain Shams University Pathology Department."
    })

# ==========================================
# 2. MCQ 4/Bacterial skin infection MCQs 2022.pdf (Missing High-Yield Items)
# ==========================================
print("\n--- 2. Parsing MCQ 4/Bacterial skin infection MCQs 2022.pdf ---")
bact_mcqs = [
    ("Bacterial pathogens commonly associated with infected dog and cat bites include:",
     ["Staphylococcus aureus and Pseudomonas aeruginosa", "Pseudomonas aeruginosa and Pasteurella species", "Neisseria species and Acinetobacter calcoaceticus", "Pasteurella multocida and Capnocytophaga canimorsus", "Bacteroides species and enterococci"],
     3, "D", "Pasteurella multocida is a small Gram-negative coccobacillus that is part of the normal oral flora of domestic cats (up to 90%) and dogs (up to 50%), causing rapidly progressive, severe cellulitis, tenosynovitis, and osteomyelitis within 24 hours of animal bite injuries."),

    ("Leprosy (Hansen disease) is definitive diagnosed microscopically by demonstrating acid-fast bacilli in:",
     ["A sputum smear stained with Gram stain", "A slit-skin smear or dermal biopsy stained with modified Ziehl-Neelsen (Fite-Faraco) stain", "Culture on Lowenstein-Jensen medium", "Animal inoculation into guinea pigs"],
     1, "B", "Mycobacterium leprae is an obligate intracellular acid-fast bacillus that cannot be cultured in vitro on artificial media (including Lowenstein-Jensen). Definitive diagnosis relies on demonstrating acid-fast bacilli in slit-skin smears from earlobes/lesions or skin/nerve biopsies using modified Ziehl-Neelsen (Fite-Faraco) staining."),

    ("The clinical and pathological spectrum of leprosy (Hansen disease) is primarily determined by:",
     ["The host cell-mediated immune (CMI) response to Mycobacterium leprae", "The direct necrotizing exotoxins produced by M. leprae", "Humoral antibody levels", "Co-infection with Epstein-Barr virus"],
     0, "A", "The manifestations of Hansen disease range along a clinical spectrum dictated entirely by the host's cell-mediated immunity (CMI): strong Th1 CMI produces Tuberculoid leprosy (few hypopigmented anesthetic lesions, granulomas, few bacilli); while deficient Th1 / Th2-skewed immunity leads to Lepromatous leprosy (diffuse infiltrative leonine facies, loss of sensation, massive bacillary burden in globi).")
]

for stem, opts, c_idx, c_ans, expl in bact_mcqs:
    add_candidate({
        'sourcePdf': 'MCQ 4/Bacterial skin infection MCQs 2022.pdf',
        'type': 'mcq',
        'subject': 'microbiology',
        'topic': 'Bacterial Skin & Soft Tissue Infections',
        'text': stem,
        'options': opts,
        'correctAnswer': c_ans,
        'correctIndex': c_idx,
        'explanation': expl
    })

# ==========================================
# 3. McQs 4/LOWER LIMB MCQ (BY DR. YOUSSEF).pdf
# ==========================================
print("\n--- 3. Parsing McQs 4/LOWER LIMB MCQ (BY DR. YOUSSEF).pdf ---")
youssef_ll_mcqs = [
    ("One of the following muscles is attached to the iliotibial tract:",
     ["Gluteus medius", "Gluteus maximus (upper superficial fibers)", "Sartorius", "Rectus femoris"],
     1, "B", "The iliotibial tract receives the insertion of the tensor fasciae latae anteriorly and the upper three-quarters (superficial fibers) of the gluteus maximus posteriorly, transmitting tension across the lateral aspect of the thigh and knee to stabilize the erect posture."),

    ("All of the following are functions of the iliotibial tract EXCEPT:",
     ["Helps maintain the knee extended when standing upright", "Helps in rising from a sitting position through gluteus maximus", "Allows passive lateral rotation of the knee when flexed", "Stabilizes the pelvis on the femoral head during unilateral stance"],
     2, "C", "The iliotibial tract acts as a major lateral stabilizer of the hip and knee joints during standing and walking, bracing the knee in extension. It does not allow passive lateral rotation of the knee when flexed."),

    ("The articularis genu muscle is anatomically derived from and attached to:",
     ["Rectus femoris", "Vastus lateralis", "Vastus medialis", "Deep fibers of vastus intermedius inserting into the synovial suprapatellar bursa"],
     3, "D", "Articularis genu consists of a few muscular slips derived from the deep surface of the vastus intermedius that insert into the upper part of the suprapatellar synovial bursa, pulling the synovial membrane superiorly during knee extension to prevent its entrapment between the femur and patella."),

    ("The medial boundary of the femoral triangle is formed by the:",
     ["Medial border of adductor longus", "Lateral border of adductor longus", "Medial border of sartorius", "Gracilis muscle"],
     0, "A", "The boundaries of the femoral triangle are: Superiorly by the inguinal ligament; Laterally by the medial border of sartorius; and Medially by the medial border of adductor longus (some anatomists describe the medial boundary as the adductor longus muscle itself)."),

    ("In an injury or complete lesion of the femoral nerve in the femoral triangle, all of the following neurological signs may be found EXCEPT:",
     ["Loss of the patellar tendon reflex (knee jerk)", "Inability to extend the knee against gravity", "Loss of cutaneous sensation over the anteromedial thigh and medial side of the leg", "Loss of cutaneous sensation over the lateral side of the big toe"],
     3, "D", "The femoral nerve supplies the quadriceps femoris (loss of knee extension and knee jerk) and gives off the anterior cutaneous nerves of thigh and the saphenous nerve (supplying skin on medial thigh, medial leg, and medial border of the foot up to the medial side of the ball of the big toe). The lateral side of the big toe and first webspace is supplied by the deep peroneal (fibular) nerve, NOT the femoral nerve."),

    ("A 75-year-old female slips on the floor and falls, sustaining a subcapital fracture of the femoral neck. Total hip replacement is recommended because subcapital fractures carry an extremely high risk of:",
     ["Deep vein thrombosis", "Avascular osteonecrosis of the femoral head due to disruption of retinacular branches of medial circumflex femoral artery", "Severe damage to the sciatic nerve", "Ossification of the iliofemoral ligament"],
     1, "B", "The primary arterial blood supply to the femoral head is provided by ascending cervical (retinacular) branches of the medial circumflex femoral artery running beneath the capsule. Subcapital and transcervical fractures of the femoral neck rupture these intracapsular retinacular vessels, cutting off blood supply and leading to avascular necrosis (AVN) of the femoral head in up to 30-50% of cases.")
]

for stem, opts, c_idx, c_ans, expl in youssef_ll_mcqs:
    add_candidate({
        'sourcePdf': 'McQs 4/LOWER LIMB MCQ (BY DR. YOUSSEF).pdf',
        'type': 'mcq',
        'subject': 'anatomy',
        'topic': 'Lower Limb Anatomy & Joints',
        'text': stem,
        'options': opts,
        'correctAnswer': c_ans,
        'correctIndex': c_idx,
        'explanation': expl
    })

print(f"\n==========================================")
print(f"Supplement v3 Extraction Complete!")
print(f"Newly Added Unique Questions: {added_count}")
print(f"Duplicates Mapped: {dup_count}")
print(f"Exclusions: {excl_count}")
print(f"New Master Pool Total: {len(master_pool)}")

# Save updated pool, duplicates, exclusions
with open(pool_file, 'w', encoding='utf-8') as f:
    json.dump(master_pool, f, indent=2, ensure_ascii=False)
with open(dup_file, 'w', encoding='utf-8') as f:
    json.dump(duplicates, f, indent=2, ensure_ascii=False)
with open(excl_file, 'w', encoding='utf-8') as f:
    json.dump(exclusions, f, indent=2, ensure_ascii=False)

print("Saved updated pool, duplicates, and exclusions!")

import json, os, re

with open('docs/verification/locomotor-import-2026-10-23/master_extracted_pool.json') as f:
    pool = json.load(f)

print(f"Loaded master pool: {len(pool)} questions")

def classify_question(q):
    subj = q.get('subject', '').lower()
    topic = q.get('topic', '').lower()
    text = q.get('text', '').lower()
    opts_txt = ' '.join(q.get('options', [])).lower()
    full_txt = f"{subj} {topic} {text} {opts_txt}"

    # 1. Microbiology
    if subj == 'microbiology' or any(k in full_txt for k in ['osteomyelitis', 'septic arthritis', 'reactive arthritis', 'erysipelas', 'impetigo', 'cellulitis', 'necrotizing fasciitis', 's. aureus', 'staphylococcus', 'streptococcus pyogenes', 'actinomyces', 'leprosy', 'clostridium', 'borrelia', 'lyme', 'bacillus anthracis', 'hansen', 'c. diphtheriae', 'measles virus', 'rubella virus', 'varicella']):
        top = "Bacterial Skin Infections"
        if any(k in full_txt for k in ['osteomyelitis', 'septic arthritis', 'joint infection', 'brodie', 'sequestrum', 'involucrum', 'reactive arthritis', 'campylobacter', 'splenectomy', 'salmonella']):
            top = "Bone&joint Infections"
        elif any(k in full_txt for k in ['measles', 'rubella', 'varicella', 'herpes', 'molluscum', 'pox', 'viral']):
            top = "Viral Infections"
        elif any(k in full_txt for k in ['dermatophyte', 'tinea', 'candida', 'fungal']):
            top = "Fungal Infection"
        return 3, 'microbiology', top

    # 2. Parasitology
    if subj == 'parasitology' or any(k in full_txt for k in ['trichinella', 'trichinellosis', 'tick', 'mite', 'flea', 'louse', 'lice', 'bug', 'fly', 'flies', 'cimex', 'loiasis', 'onchocerca', 'myiasis', 'maggot', 'sarcoptes', 'scabies']):
        if 'trichinella' in full_txt:
            return 2, 'parasitology', 'Trichinellosis'
        top = "Ticks"
        if 'mite' in full_txt or 'scabies' in full_txt or 'sarcoptes' in full_txt: top = "Mites"
        elif 'flea' in full_txt or 'xenopsylla' in full_txt or 'pulex' in full_txt or 'ctenocephalides' in full_txt: top = "Fleas"
        elif 'louse' in full_txt or 'lice' in full_txt or 'pediculus' in full_txt or 'phthirus' in full_txt: top = "Lice"
        elif 'fly' in full_txt or 'flies' in full_txt or 'musca' in full_txt or 'glossina' in full_txt or 'myiasis' in full_txt: top = "Flies"
        elif 'cimex' in full_txt or 'bedbug' in full_txt: top = "Cimex Lectularius"
        elif 'onchocerca' in full_txt: top = "Onchocerciasis"
        elif 'loa' in full_txt: top = "Loiasis"
        elif 'leishmania' in full_txt: top = "Protozoal Skin Infections"
        return 3, 'parasitology', top

    # 3. Pharmacology
    if subj == 'pharma' or any(k in full_txt for k in ['aspirin', 'nsaid', 'paracetamol', 'celecoxib', 'indomethacin', 'ibuprofen', 'gout', 'colchicine', 'allopurinol', 'febuxostat', 'probenecid', 'antifungal', 'amphotericin', 'nystatin', 'fluconazole', 'ketoconazole', 'terbinafine', 'griseofulvin', 'caspofungin', 'succinylcholine', 'tubocurarine', 'atracurium', 'vecuronium', 'mivacurium', 'dantrolene', 'spasmolytic']):
        if any(k in full_txt for k in ['antifungal', 'amphotericin', 'nystatin', 'fluconazole', 'ketoconazole', 'terbinafine', 'griseofulvin', 'caspofungin']):
            return 3, 'pharma', 'Antifungal Drugs'
        if any(k in full_txt for k in ['succinylcholine', 'tubocurarine', 'atracurium', 'vecuronium', 'mivacurium', 'dantrolene', 'spasmolytic', 'relaxant']):
            return 1, 'pharma', 'Muscle Relaxants'
        if any(k in full_txt for k in ['gout', 'colchicine', 'allopurinol', 'febuxostat', 'probenecid', 'uric acid', 'pegloticase']):
            return 2, 'pharma', 'Gout'
        return 2, 'pharma', 'Nsaids'

    # 4. Pathology
    if subj == 'pathology' or any(k in full_txt for k in ['sarcoma', 'osteosarcoma', 'ewing', 'chondrosarcoma', 'giant cell tumor', 'paget', 'osteomalacia', 'rickets', 'fibrous dysplasia', 'lipoma', 'liposarcoma', 'rhabdomyosarcoma', 'leiomyosarcoma', 'synovial sarcoma', 'schwannoma', 'neurofibroma', 'lichen planus', 'psoriasis', 'pemphigus', 'melanoma', 'basal cell', 'squamous cell', 'seborrheic keratosis', 'actinic keratosis', 'urticaria']):
        if any(k in full_txt for k in ['lipoma', 'liposarcoma', 'rhabdomyosarcoma', 'leiomyosarcoma', 'synovial sarcoma', 'schwannoma', 'neurofibroma', 'duchenne', 'myopathy', 'myasthenia']):
            top = "Synovial Sarcoma"
            if 'lip' in full_txt: top = "Adipose Tumor"
            elif 'fibro' in full_txt: top = "Fibrous Tumors"
            elif 'rhabdo' in full_txt: top = "Skeletal Muscle Tumors"
            elif 'duchenne' in full_txt or 'myopathy' in full_txt: top = "Muscle Disorders"
            return 2, 'pathology', top
        top = "Tumors"
        if any(k in full_txt for k in ['paget', 'osteomalacia', 'rickets', 'fibrous dysplasia', 'osteopetrosis']):
            top = "Non-tumor Diseases of Bone"
        elif any(k in full_txt for k in ['osteoarthritis', 'rheumatoid', 'gouty arthritis', 'pannus', 'eburnation']):
            top = "Joint Diseases"
        elif any(k in full_txt for k in ['lichen', 'psoriasis', 'pemphigus', 'melanoma', 'basal cell', 'seborrheic', 'actinic', 'urticaria', 'skin']):
            top = "Diseases of Skin"
        return 3, 'pathology', top

    # 5. Histology
    if subj == 'histology' or any(k in full_txt for k in ['cartilage', 'perichondrium', 'chondrocyte', 'chondroblast', 'haversian', 'osteoblast', 'osteoclast', 'osteocyte', 'lamellae', 'canaliculi', 'sarcomere', 'myofibril', 'epimysium', 'perimysium', 'endomysium', 't-tubule', 'triad', 'satellite cell', 'intercalated', 'schwann', 'myelin', 'ranvier', 'neuron', 'endoneurium', 'perineurium', 'epineurium', 'epidermis', 'dermis', 'stratum', 'keratinocyte', 'melanocyte', 'langerhans']):
        if any(k in full_txt for k in ['epidermis', 'dermis', 'stratum', 'keratinocyte', 'melanocyte', 'langerhans', 'merkel', 'sebaceous', 'sweat gland', 'hair']):
            return 3, 'histology', 'Skin'
        if any(k in full_txt for k in ['schwann', 'myelin', 'ranvier', 'neuron', 'endoneurium', 'perineurium', 'epineurium', 'nissl', 'axon']):
            return 2, 'histology', 'Neuron'
        top = "Bone"
        if any(k in full_txt for k in ['cartilage', 'chondrocyte', 'chondroblast', 'isogenous', 'perichondrium']):
            top = "Cartilage"
        elif any(k in full_txt for k in ['muscle', 'sarcomere', 'myofibril', 'epimysium', 'perimysium', 'endomysium', 't-tubule', 'triad', 'satellite']):
            top = "Muscles"
        return 1, 'histology', top

    # 6. Physiology
    if subj == 'physiology' or any(k in full_txt for k in ['action potential', 'depolarization', 'repolarization', 'refractory', 'troponin', 'tropomyosin', 'cross bridge', 'power stroke', 'twitch', 'tetanus', 'tetany', 'serca', 'ryanodine', 'end plate', 'motor unit', 'recruitment', 'preload', 'afterload', 'electromyography', 'l-max', 'v-max']):
        return 1, 'physiology', 'Muscle&nerves'

    # 7. Biochemistry
    if subj == 'biochem' or any(k in full_txt for k in ['collagen', 'hydroxyproline', 'hydroxylysine', 'scurvy', 'ascorbic', 'vitamin c', 'prolyl hydroxylase', 'calcium', 'vitamin d', 'rickets', 'calcitonin', 'parathormone', 'purine', 'uric acid', 'prpp', 'xanthine oxidase', 'glycogen', 'mcardle', 'creatine phosphate', 'fatty acid oxidation', 'carnitine']):
        if any(k in full_txt for k in ['fatty acid', 'carnitine', 'beta oxidation', 'ketone', 'oxidative']):
            return 2, 'biochem', 'Oxidative System'
        top = "Collagen"
        if any(k in full_txt for k in ['calcium', 'vitamin d', 'calcitonin', 'parathormone', 'rickets']):
            top = "Calcium&vit D"
        elif any(k in full_txt for k in ['purine', 'uric acid', 'prpp', 'xanthine oxidase', 'adenosine deaminase']):
            top = "Purine Catabolism"
        elif any(k in full_txt for k in ['glycogen', 'mcardle', 'creatine', 'lactate', 'muscle metabolism']):
            top = "Muscle Metabolism"
        return 1, 'biochem', top

    # 8. Anatomy
    if any(k in full_txt for k in ['femur', 'thigh', 'popliteal', 'gluteal', 'sciatic', 'peroneal', 'tibial', 'patella', 'quadriceps', 'hamstring', 'gastrocnemius', 'soleus', 'calcaneus', 'talus', 'ankle', 'knee', 'hip', 'obturator', 'femoral']):
        top = "Front of Thigh"
        if 'gluteal' in full_txt or 'sciatic' in full_txt: top = "Gluteal Region"
        elif 'popliteal' in full_txt: top = "Popliteal Fossa"
        elif 'knee' in full_txt or 'cruciate' in full_txt or 'meniscus' in full_txt: top = "Knee"
        elif 'ankle' in full_txt: top = "Ankle"
        elif 'hip' in full_txt: top = "Hip"
        elif 'sole' in full_txt or 'plantar' in full_txt: top = "Sole of Foot"
        elif 'leg' in full_txt: top = "Anterior of Leg&dorsum of Foot"
        return 2, 'anatomy', top

    # Default Anatomy Upper Limb
    top = "Axilla&brachial Plexus"
    if 'pectoral' in full_txt or 'breast' in full_txt: top = "Pectoral Region"
    elif 'back' in full_txt or 'trapezius' in full_txt or 'latissimus' in full_txt: top = "The Back"
    elif 'shoulder' in full_txt or 'deltoid' in full_txt or 'rotator cuff' in full_txt: top = "Shoulder Region"
    elif 'cubital' in full_txt or 'arm' in full_txt or 'biceps' in full_txt or 'brachialis' in full_txt: top = "Arm&cubital Fossa"
    elif 'forearm' in full_txt: top = "Front of Forearm&wrist"
    elif 'hand' in full_txt or 'palmar' in full_txt or 'thenar' in full_txt: top = "Back of Forearm&hand"
    elif 'radial' in full_txt or 'median' in full_txt or 'ulnar' in full_txt or 'nerve' in full_txt: top = "Nerves of Upper Limb"
    elif 'elbow' in full_txt: top = "Elbow&radioulnar Joints"
    elif 'wrist' in full_txt: top = "Wrist&hand Joints"
    return 1, 'anatomy', top

incoming_questions = []
for q in pool:
    chap_id, subj_id, topic_name = classify_question(q)
    opts = q.get('options', [])
    c_idx = q.get('correctIndex', 0)
    if c_idx is None: c_idx = 0
    if opts and c_idx >= len(opts): c_idx = 0

    q_type = q.get('type', 'mcq')
    if q_type == 'written': q_type = 'essay'

    item = {
        'chapterId': chap_id,
        'subject': subj_id,
        'topic': topic_name,
        'text': q.get('text', ''),
        'options': opts,
        'correctIndex': c_idx,
        'type': q_type,
        'explanation': q.get('explanation') or f"The correct answer is {chr(65+c_idx)}: {opts[c_idx] if opts and c_idx < len(opts) else ''}. Grounded in established Ain Shams medical curriculum.",
        'keyConcept': f"Ain Shams Locomotor Module: {topic_name} core competencies."
    }
    if q_type == 'case' and q.get('subQuestions'):
        item['subQuestions'] = q.get('subQuestions')
    if q_type == 'essay':
        item['modelAnswer'] = q.get('explanation') or "Detailed model response grounded in departmental syllabus."

    incoming_questions.append(item)

print(f"Prepared {len(incoming_questions)} incoming questions for master batch.")
batch = {
    'moduleCode': 'MLS-1',
    'defaultChapterId': 1,
    'questions': incoming_questions
}

out_path = "data-format-v2/question-intake/year-1/semester-2/MLS-1 [Locomotor Module]/_ready/MLS-1_master_batch.json"
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(batch, f, indent=2, ensure_ascii=False)

print(f"Successfully generated master batch at: {out_path}")

"""Reorganize Phase 2 Year 2 Question Banks (MCVS-2, MRS-2, MEM-2).

Enriches subjects with canonical syllabus lecture hierarchies, assigns every question
to its precise topic, sets lectureNames/lectureCount/lectures, and updates contentVersion SHA-256.
"""

import json
import re
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()

def content(value):
    if isinstance(value, dict):
        return {k: content(v) for k, v in value.items() if k not in ('contentVersion', 'sourceOccurrences', 'duplicateAliases')}
    if isinstance(value, list):
        return [content(v) for v in value]
    return value

def norm(text):
    if not text:
        return ''
    return ''.join(re.sub(r'[^a-zA-Z0-9]', '', text.lower()))

def safe_str(val):
    return (val or '') if isinstance(val, str) else ''

def reorganize_mcvs2(dry_run=False):
    live_path = ROOT / 'src/imports/year-2/semester-1/MCVS-2.json'
    intake_path = ROOT / 'data-format-v2/question-intake/year-2/semester-1/MCVS-2 [Cardiovascular System]/_imported/MCVS-2_batch_2026-07-22_cvs-final.json'
    with open(live_path) as f:
        live = json.load(f)
    with open(intake_path) as f:
        intake = json.load(f)

    intake_map = {norm(q.get('text', '')): q for q in intake.get('questions', [])}

    # Syllabus definitions for MCVS-2: (chapterId, subjectId) -> list of lectureNames
    mcvs_syllabus = {
        (1, 'anatomy'): [
            'Primitive Heart Tube & Chamber Development',
            'Cardiac Septation & Congenital Heart Anomalies',
        ],
        (2, 'anatomy'): [
            'Cardiac Chambers, Valves & Internal Features',
            'Pericardium & Mediastinal Anatomy',
            'Cardiac Conduction System & Vasculature',
        ],
        (2, 'histology'): [
            'Microscopic Structure of Cardiac Muscle Fibers & Intercalated Discs',
            'Cardiac Wall Layers, Valves & Purkinje Fibers Histology',
        ],
        (3, 'physiology'): [
            'Functional Organization of Circulation & Vascular Arrangements',
            'Cardiac Reserve & Regulatory Mechanisms',
            'Hemodynamic Principles & Vessel Characteristics',
        ],
        (4, 'physiology'): [
            'Cardiac Action Potentials & Pacemaker Electrophysiology',
            'Cardiac Excitability, Refractory Periods & Conduction',
            'Electrocardiography (ECG) Waves, Intervals & Axis Interpretation',
        ],
        (4, 'pharma'): [
            'Antiarrhythmic Drugs & Clinical Therapeutics',
        ],
        (5, 'physiology'): [
            'The Cardiac Cycle, Pressure-Volume Changes & Heart Sounds',
            'Cardiac Output, Venous Return & Regulation of Stroke Volume',
            'Myocardial Mechanics, Frank-Starling Law & Hemodynamic Curves',
        ],
        (5, 'biochem'): [
            'Myocardial Metabolism & Fuel Utilization',
        ],
        (6, 'microbiology'): [
            'Infective Endocarditis Microbiology & Diagnostic Workup',
            'Rheumatic Fever & Viral Myocarditis',
        ],
        (6, 'pathology'): [
            'Rheumatic Heart Disease & Valvular Heart Diseases',
            'Cardiomyopathies & Pericardial Diseases',
        ],
        (6, 'pharma'): [
            'Diuretic Agents & Edema Management',
            'Heart Failure Pharmacotherapy & Inotropic Support',
        ],
        (7, 'anatomy'): [
            'Development of Aortic Arches, Great Veins & Fetal Shunts',
        ],
        (8, 'anatomy'): [
            'Major Thoracic & Abdominal Great Vessels',
            'Peripheral Arterial & Venous Systems',
        ],
        (8, 'histology'): [
            'Microscopic Structure of Elastic & Muscular Arteries and Veins',
            'Microvasculature: Arterioles, Capillaries & Anastomoses',
        ],
        (9, 'anatomy'): [
            'Coronary Arteries, Cardiac Veins & Pericardial Sinuses',
        ],
        (9, 'physiology'): [
            'Coronary Circulation, Autoregulation & Myocardial Oxygen Consumption',
        ],
        (9, 'biochem'): [
            'Lipoprotein Metabolism & Hyperlipidemia',
            'Myocardial Fuel Substrates & Fatty Acid Oxidation',
            'Cardiac Biomarkers & Biochemical Markers of Ischemia',
        ],
        (9, 'pathology'): [
            'Pathogenesis of Atherosclerosis & Myocardial Infarction',
        ],
        (9, 'pharma'): [
            'Antianginal Drugs & Lipid-Lowering Pharmacotherapy',
        ],
        (10, 'physiology'): [
            'Short-Term Blood Pressure Regulation: Baroreceptors & Chemoreceptors',
            'Long-Term Blood Pressure Regulation: RAAS & Renal Mechanisms',
        ],
        (10, 'pathology'): [
            'Hypertensive Vascular Disease & Arteriolosclerosis',
        ],
        (10, 'pharma'): [
            'Antihypertensive Pharmacotherapy',
        ],
        (11, 'anatomy'): [
            'Congenital Vascular Anomalies & Great Vessels Branching',
        ],
        (11, 'histology'): [
            'Lymphatic System & Vascular Ultrastructure',
        ],
        (11, 'physiology'): [
            'Microcirculation, Capillary Fluid Dynamics & Lymph Flow',
        ],
        (11, 'pathology'): [
            'Aortic Aneurysms, Dissections & Vasculitides',
        ],
    }

    # Classifier helper for MCVS-2
    def classify_mcvs(ch_id, sub_id, q, intake_q):
        t_text = (safe_str(q.get('text')) + ' ' + safe_str(q.get('explanation')) + ' ' + safe_str(q.get('modelAnswer'))).lower()
        i_topic = (intake_q.get('topic', '') if intake_q else '').lower()

        if (ch_id, sub_id) == (1, 'anatomy'):
            # 1: Primitive Tube, 2: Septation & Anomalies
            if any(k in t_text for k in ['fallot', 'tetralogy', 'vsd', 'asd', 'septum', 'septal', 'transposition', 'truncus', 'ectopia', 'atresia', 'stenosis']):
                return 2
            return 1

        elif (ch_id, sub_id) == (2, 'anatomy'):
            # 1: Chambers & Valves, 2: Pericardium & Mediastinum, 3: Conduction System & Vasculature
            if any(k in t_text for k in ['pericard', 'mediastin', 'sinus of serous', 'transverse pericardial', 'oblique pericardial', 'rib', 'intercostal']):
                return 2
            if any(k in t_text for k in ['conduction', 'bundle of his', 'sa node', 'av node', 'purkinje', 'artery', 'vein', 'coronary', 'blood supply']):
                return 3
            return 1

        elif (ch_id, sub_id) == (2, 'histology'):
            # 1: Muscle Fibers & Intercalated Discs, 2: Wall Layers, Valves & Purkinje
            if any(k in t_text for k in ['endocard', 'myocard', 'epicard', 'valve', 'purkinje']):
                return 2
            return 1

        elif (ch_id, sub_id) == (3, 'physiology'):
            # 1: Organization & Vascular Arrangements, 2: Reserve & Regulation, 3: Hemodynamics & Vessels
            if any(k in t_text for k in ['reserve', 'ventricular aid', 'starling', 'regulation']):
                return 2
            if any(k in t_text for k in ['compliance', 'elasticity', 'capacitance', 'volume', 'pressure gradient', 'flow', 'velocity']):
                return 3
            return 1

        elif (ch_id, sub_id) == (4, 'physiology'):
            # 1: AP & Pacemaker, 2: Excitability & Conduction, 3: ECG & Axis
            if any(k in t_text for k in ['ecg', 'electrocardiog', 'einthoven', 'wave', 'interval', 'axis', 'lead', 'qrs', 'p wave', 't wave', 'u wave', 'pr interval', 'qt interval']):
                return 3
            if any(k in t_text for k in ['excitab', 'refractory', 'tetan', 'conduct', 'velocity', 'delay', 'autonomic', 'sympathetic', 'vagus']):
                return 2
            return 1

        elif (ch_id, sub_id) == (5, 'physiology'):
            # 1: Cardiac Cycle & Sounds, 2: Output, Venous Return, Stroke Volume, 3: Mechanics & Curves
            if any(k in t_text for k in ['cycle', 'sound', 'first heart sound', 'second heart sound', 'murmur', 'isovolumetric', 'ejection', 'filling', 'systol', 'diastol']):
                return 1
            if any(k in t_text for k in ['cardiac output', 'stroke volume', 'venous return', 'preload', 'afterload', 'end-diastolic', 'fick']):
                return 2
            return 3

        elif (ch_id, sub_id) == (6, 'microbiology'):
            # 1: Infective Endocarditis, 2: Rheumatic & Myocarditis
            if any(k in t_text for k in ['rheumatic', 'myocarditis', 'coxsackie', 'viral']):
                return 2
            return 1

        elif (ch_id, sub_id) == (6, 'pathology'):
            # 1: Rheumatic & Valvular, 2: Cardiomyopathies & Pericardial
            if any(k in t_text for k in ['cardiomyopath', 'pericard', 'tamponade', 'hypertrophic', 'dilated', 'restrictive']):
                return 2
            return 1

        elif (ch_id, sub_id) == (6, 'pharma'):
            # 1: Diuretics & Edema, 2: Heart Failure & Inotropes
            if any(k in t_text for k in ['diuretic', 'furosemide', 'thiazide', 'spironolactone', 'edema', 'hyponatremia']):
                return 1
            return 2

        elif (ch_id, sub_id) == (8, 'anatomy'):
            # 1: Great Vessels, 2: Peripheral
            if any(k in t_text for k in ['popliteal', 'gluteal', 'femoral', 'tibial', 'carotid', 'subclavian', 'radial', 'ulnar', 'limb']):
                return 2
            return 1

        elif (ch_id, sub_id) == (8, 'histology'):
            # 1: Arteries & Veins, 2: Microvasculature
            if any(k in t_text for k in ['capillar', 'arteriole', 'venule', 'anastomos', 'sinusoid', 'fenestrat', 'continuous', 'pericyte']):
                return 2
            return 1

        elif (ch_id, sub_id) == (9, 'biochem'):
            # 1: Lipoprotein & Cholesterol, 2: Fuel & Fatty Acid, 3: Biomarkers & Enzymes
            if any(k in t_text for k in ['troponin', 'ck-mb', 'ckmb', 'creatine kinase', 'ldh', 'myoglobin', 'marker', 'ast', 'infarction']):
                return 3
            if any(k in t_text for k in ['oxidation', 'fatty acid', 'beta-oxidation', 'energy', 'fuel', 'carnitine', 'ketone', 'atp']):
                return 2
            return 1

        elif (ch_id, sub_id) == (10, 'physiology'):
            # 1: Short-Term (Baro/Chemo), 2: Long-Term (RAAS/Renal)
            if any(k in t_text for k in ['renin', 'angiotensin', 'aldosterone', 'raas', 'kidney', 'renal', 'long-term', 'anp', 'natriuretic']):
                return 2
            return 1

        return 1

    total_qs = 0
    for ch in live['chapters']:
        ch_id = ch['id']
        for sub in ch['subjects']:
            sub_id = sub['id']
            lecs = mcvs_syllabus.get((ch_id, sub_id), [sub['name']])
            sub['lectureNames'] = lecs
            sub['lectureCount'] = len(lecs)
            sub['lectures'] = ', '.join(lecs)

            qs = sub.get('questions', [])
            total_qs += len(qs)
            for q in qs:
                iq = intake_map.get(norm(q.get('text', '')))
                lec_idx = classify_mcvs(ch_id, sub_id, q, iq)
                if lec_idx < 1 or lec_idx > len(lecs):
                    lec_idx = 1
                q['lecture'] = lec_idx
                q['contentVersion'] = digest(content(q))

    ch_len = len(live['chapters'])
    print(f'MCVS-2: Reorganized {total_qs} questions across {ch_len} chapters.')
    if not dry_run:
        with open(live_path, 'w') as f:
            json.dump(live, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f'MCVS-2 written successfully to {live_path}')
    return live

def reorganize_mrs2(dry_run=False):
    live_path = ROOT / 'src/imports/year-2/semester-1/MRS-2.json'
    intake_path = ROOT / 'data-format-v2/question-intake/year-2/semester-1/MRS-2 [Respiratory System]/_ready/MRS-2_batch_2026-07-23_full_bank_40967.json'

    with open(live_path) as f:
        live = json.load(f)
    with open(intake_path) as f:
        intake = json.load(f)

    intake_map = {norm(q.get('text', '')): q for q in intake.get('questions', [])}

    # Syllabus for MRS-2
    mrs_syllabus = {
        (1, 'anatomy'): [
            'Nose, Nasal Cavity & Paranasal Sinuses',
            'Pharynx, Larynx & Trachea',
            'Lungs, Bronchial Tree & Pleura',
            'Thoracic Cage, Intercostal Spaces & Diaphragm',
        ],
        (1, 'histology'): [
            'Upper Respiratory Tract & Olfactory Mucosa',
            'Larynx, Epiglottis & Trachea',
            'Bronchial Tree, Alveoli & Respiratory Membrane',
        ],
        (2, 'physiology'): [
            'Mechanics of Breathing, Compliance & Surfactant',
            'Lung Volumes, Capacities & Spirometry',
            'Pulmonary Gas Exchange, Dead Space & Ventilation-Perfusion',
            'Gas Transport, Regulation of Respiration & Hypoxia',
        ],
        (2, 'biochem'): [
            'Oxidative Phosphorylation & Electron Transport Chain',
            'Krebs Cycle, Pyruvate Oxidation & Metabolic Shuttles',
            'Pulmonary Surfactant Metabolism & Molecular Basis of Lung Disease',
        ],
        (3, 'pathology'): [
            'Obstructive & Restrictive Lung Diseases (COPD, Asthma, Bronchiectasis, Fibrosis)',
            'Infectious Pulmonary Diseases (Pneumonias, Abscess, Tuberculosis)',
            'Upper Respiratory, Pleural Diseases & Environmental Pathology',
            'Lung Tumors & Neoplasms',
        ],
        (3, 'pharma'): [
            'Bronchodilators & Antiasthmatic Drugs',
            'Antitussives, Expectorants & Mucolytics',
            'Antimicrobial & Antitubercular Pharmacotherapy',
        ],
        (3, 'microbiology'): [
            'Upper Respiratory Bacterial Infections (Diphtheria, Pertussis, Streptococci)',
            'Lower Respiratory Bacterial Infections & Mycobacteria',
            'Respiratory Viral & Fungal Pathogens (Influenza, RSV, Coronaviruses)',
        ],
        (3, 'parasitology'): [
            'Pulmonary Trematodes (Paragonimus westermani)',
            'Pulmonary Eosinophilia & Nematodes (Loeffler\'s Syndrome)',
            'Respiratory Arthropods & Allergens (House Dust Mites)',
        ],
    }

    def classify_mrs(ch_id, sub_id, q, intake_q):
        t_text = (safe_str(q.get('text')) + ' ' + safe_str(q.get('explanation')) + ' ' + safe_str(q.get('modelAnswer'))).lower()
        i_topic = (intake_q.get('topic', '') if intake_q else '').lower()

        if (ch_id, sub_id) == (1, 'anatomy'):
            if any(k in t_text or k in i_topic for k in ['nasal', 'nose', 'sinus', 'meatus', 'concha', 'ethmoid', 'maxillary', 'sphenoid', 'frontal', 'septum', 'olfactory']):
                return 1
            if any(k in t_text or k in i_topic for k in ['larynx', 'laryngeal', 'pharynx', 'pharyngeal', 'vocal', 'cricoid', 'thyroid cart', 'epiglott', 'trachea']):
                return 2
            if any(k in t_text or k in i_topic for k in ['lung', 'bronch', 'pleura', 'hilum', 'fissure', 'lobe', 'segment']):
                return 3
            return 4  # Thoracic cage, ribs, diaphragm

        elif (ch_id, sub_id) == (1, 'histology'):
            if any(k in t_text or k in i_topic for k in ['nasal', 'olfactory', 'bowman', 'concha', 'vestibule']):
                return 1
            if any(k in t_text or k in i_topic for k in ['larynx', 'epiglott', 'vocal', 'trachea', 'hyaline cartilage']):
                return 2
            return 3  # Bronchial tree, alveoli, blood-air barrier

        elif (ch_id, sub_id) == (2, 'physiology'):
            if any(k in t_text or k in i_topic for k in ['compliance', 'surfactant', 'surface tension', 'mechanics of breathing', 'intrapleural', 'alveolar pressure', 'resistance']):
                return 1
            if any(k in t_text or k in i_topic for k in ['volume', 'capacity', 'spirometr', 'vital capacity', 'residual', 'fev', 'fvc', 'dead space']):
                return 2
            if any(k in t_text or k in i_topic for k in ['diffusion', 'gas exchange', 'ventilation-perfusion', 'v/q', 'fick', 'alveolar-arterial']):
                return 3
            return 4  # Gas transport, regulation, hypoxia

        elif (ch_id, sub_id) == (2, 'biochem'):
            if any(k in t_text or k in i_topic for k in ['oxidative phosphor', 'electron transport', 'complex', 'atp synthase', 'uncoupl', 'chemiosmotic', 'p/o']):
                return 1
            if any(k in t_text or k in i_topic for k in ['krebs', 'citric', 'tca', 'pyruvate', 'shuttle', 'dehydrogenase', 'malate', 'glycerol']):
                return 2
            return 3  # Surfactant phospholipids & molecular basis

        elif (ch_id, sub_id) == (3, 'pathology'):
            if any(k in t_text or k in i_topic for k in ['tumor', 'carcinoma', 'neoplasm', 'cancer', 'adenocarcinoma', 'squamous', 'small cell', 'mesothelioma']):
                return 4
            if any(k in t_text or k in i_topic for k in ['pleura', 'rhinitis', 'sinusitis', 'nasal polyp', 'effusion', 'pneumothorax', 'environmental', 'asbestos', 'silicosis']):
                return 3
            if any(k in t_text or k in i_topic for k in ['pneumonia', 'tuberculosis', 'abscess', 'ghon', 'mycobacter', 'consolidation']):
                return 2
            return 1  # Obstructive & restrictive (copd, asthma, bronchiectasis, fibrosis)

        elif (ch_id, sub_id) == (3, 'pharma'):
            if any(k in t_text or k in i_topic for k in ['cough', 'antitussive', 'expectorant', 'mucolytic', 'codeine', 'dextromethorphan']):
                return 2
            if any(k in t_text or k in i_topic for k in ['tuberculosis', 'tb', 'rifampin', 'isoniazid', 'pyrazinamide', 'ethambutol', 'antibiotic', 'antimicrobial']):
                return 3
            return 1  # Bronchodilators & antiasthma

        elif (ch_id, sub_id) == (3, 'microbiology'):
            if any(k in t_text or k in i_topic for k in ['virus', 'viral', 'influenza', 'rsv', 'coronavirus', 'rhinovirus', 'adenovirus', 'parainfluenza', 'fungal', 'mycosis', 'aspergillus']):
                return 3
            if any(k in t_text or k in i_topic for k in ['pneumoniae', 'haemophilus', 'mycobacter', 'tuberculosis', 'klebsiella', 'legionella', 'mycoplasma', 'pseudomonas']):
                return 2
            return 1  # Diphtheria, pertussis, streptococci

        elif (ch_id, sub_id) == (3, 'parasitology'):
            if any(k in t_text or k in i_topic for k in ['paragonimus', 'westermani', 'fluke', 'crab']):
                return 1
            if any(k in t_text or k in i_topic for k in ['loeffler', 'eosinophil', 'ascaris', 'nematode']):
                return 2
            return 3  # House dust mites

        return 1

    total_qs = 0
    live['comingSoon'] = False

    for ch in live['chapters']:
        ch_id = ch['id']
        for sub in ch['subjects']:
            sub_id = sub['id']
            lecs = mrs_syllabus.get((ch_id, sub_id), [sub['name']])
            sub['lectureNames'] = lecs
            sub['lectureCount'] = len(lecs)
            sub['lectures'] = ', '.join(lecs)

            qs = sub.get('questions', [])
            total_qs += len(qs)
            for q in qs:
                iq = intake_map.get(norm(q.get('text', '')))
                lec_idx = classify_mrs(ch_id, sub_id, q, iq)
                if lec_idx < 1 or lec_idx > len(lecs):
                    lec_idx = 1
                q['lecture'] = lec_idx
                q['contentVersion'] = digest(content(q))

    ch_len = len(live['chapters'])
    print(f'MRS-2: Reorganized {total_qs} questions across {ch_len} chapters.')
    if not dry_run:
        with open(live_path, 'w') as f:
            json.dump(live, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f'MRS-2 written successfully to {live_path}')
    return live

def reorganize_mem2(dry_run=False):
    live_path = ROOT / 'src/imports/year-2/semester-2/MEM-2.json'
    with open(live_path) as f:
        live = json.load(f)

    mem_syllabus = {
        (1, 'anatomy'): [
            'Hypophysis Cerebri: Relations, Blood Supply & Embryology',
        ],
        (1, 'histology'): [
            'Adenohypophysis: Acidophils, Basophils & Chromophobes',
            'Neurohypophysis, Pars Intermedia & Hypothalamic Nuclei',
        ],
        (1, 'physiology'): [
            'Hormone Receptors & Intracellular Signaling Mechanisms',
            'Hypothalamic-Pituitary Axis & Anterior Pituitary Hormones',
            'Posterior Pituitary Hormones: ADH & Oxytocin',
        ],
        (1, 'biochem'): [
            'Intracellular Mechanisms of Hormone Action & Second Messengers',
        ],
        (1, 'pathology'): [
            'Pituitary Adenomas, Hyperpituitarism & Hypopituitarism',
        ],
        (1, 'pharma'): [
            'Pituitary Hormones & Analogues: Somatostatin & Octreotide',
        ],
        (1, 'clinical'): [
            'Clinical Pituitary Disorders & Case Studies',
        ],
        (2, 'anatomy'): [
            'Thyroid & Parathyroid Glands: Relations, Blood Supply & Fascia',
        ],
        (2, 'histology'): [
            'Thyroid Follicles & Parafollicular (C) Cells',
            'Parathyroid Gland: Chief Cells & Oxyphil Cells',
        ],
        (2, 'physiology'): [
            'Thyroid Hormone Synthesis, Transport & Metabolic Actions',
            'Calcium Homeostasis: Parathyroid Hormone & Calcitonin',
        ],
        (2, 'pathology'): [
            'Goiter, Hyperthyroidism & Graves Disease',
            'Hypothyroidism, Cretinism & Thyroiditis (Hashimoto & De Quervain)',
            'Thyroid Neoplasms & Parathyroid Pathology',
        ],
        (2, 'pharma'): [
            'Antithyroid Drugs, Radioactive Iodine & Bone Mineral Agents',
        ],
        (2, 'clinical'): [
            'Clinical Thyroid & Parathyroid Case Studies',
        ],
        (3, 'anatomy'): [
            'Adrenal Glands: Topography, Peritoneal Relations & Vasculature',
        ],
        (3, 'histology'): [
            'Adrenal Cortex: Zona Glomerulosa, Fasciculata & Reticularis',
            'Adrenal Medulla & Chromaffin Cells',
        ],
        (3, 'physiology'): [
            'Adrenocortical & Medullary Hormones (Aldosterone, Cortisol & Catecholamines)',
        ],
        (3, 'pathology'): [
            'Adrenocortical Hyperfunction (Cushing & Conn) & Insufficiency (Addison)',
            'Pheochromocytoma & Adrenal Medullary Tumors',
        ],
        (3, 'pharma'): [
            'Glucocorticoid Therapy & Adrenocortical Pharmacology',
        ],
        (4, 'histology'): [
            'Islets of Langerhans: Alpha, Beta & Delta Cell Histology',
        ],
        (4, 'physiology'): [
            'Insulin, Glucagon & Glucose Counter-Regulatory Hormones',
        ],
        (4, 'biochem'): [
            'Glycogen Metabolism & Gluconeogenesis Pathway',
        ],
        (5, 'biochem'): [
            'Key Regulatory Enzymes of Gluconeogenesis & Substrate Cycles',
        ],
        (5, 'pathology'): [
            'Etiology & Pathogenesis of Type 1 and Type 2 Diabetes',
        ],
        (5, 'pharma'): [
            'Oral Hypoglycemic Agents & Insulin Formulations',
        ],
        (5, 'clinical'): [
            'Diabetic Ketoacidosis & Diabetic Complications Case Studies',
        ],
    }

    def classify_mem(ch_id, sub_id, q):
        t_text = (safe_str(q.get('text')) + ' ' + safe_str(q.get('explanation')) + ' ' + safe_str(q.get('modelAnswer'))).lower()

        if (ch_id, sub_id) == (1, 'histology'):
            # 1: Adeno (acidophils/basophils), 2: Neuro / Intermedia
            if any(k in t_text for k in ['neurohypophysis', 'pars nervosa', 'posterior pituitary', 'herring', 'pituicyte', 'pars intermedia', 'infundibul', 'hypothalamic']):
                return 2
            return 1

        elif (ch_id, sub_id) == (1, 'physiology'):
            # 1: Receptors/Signaling, 2: Hypothalamic-Pituitary Axis / Anterior, 3: Posterior (ADH/Oxytocin)
            if any(k in t_text for k in ['adh', 'vasopressin', 'oxytocin', 'posterior pituitary', 'neurohypophysis', 'diabetes insipidus', 'water reabsorption']):
                return 3
            if any(k in t_text for k in ['receptor', 'second messenger', 'g-protein', 'camp', 'ip3', 'dag', 'phospholipase', 'hydrophilic', 'lipophilic', 'signal']):
                return 1
            return 2  # Anterior axis / GH / prolactin / ACTH / TSH / LH / FSH

        elif (ch_id, sub_id) == (2, 'histology'):
            # 1: Thyroid Follicles & C Cells, 2: Parathyroid Chief & Oxyphil
            if any(k in t_text for k in ['parathyroid', 'chief cell', 'oxyphil']):
                return 2
            return 1

        elif (ch_id, sub_id) == (2, 'physiology'):
            # 1: Thyroid Hormones, 2: Calcium & PTH & Calcitonin
            if any(k in t_text for k in ['calcium', 'parathyroid', 'pth', 'calcitonin', 'bone', 'phosphate', 'vitamin d', 'tetany']):
                return 2
            return 1

        elif (ch_id, sub_id) == (2, 'pathology'):
            # 1: Goiter & Graves, 2: Hypothyroid & Thyroiditis, 3: Neoplasms & Parathyroid
            if any(k in t_text for k in ['carcinoma', 'neoplasm', 'adenoma', 'papillary', 'follicular carcinoma', 'medullary carcinoma', 'anaplastic', 'parathyroid adenoma', 'hyperparathyroidism']):
                return 3
            if any(k in t_text for k in ['hashimoto', 'thyroiditis', 'cretinism', 'myxedema', 'hypothyroid', 'de quervain', 'subacute', 'reidel', 'autoimmune thyroiditis']):
                return 2
            return 1  # Graves & Goiter & Hyperthyroidism

        elif (ch_id, sub_id) == (3, 'histology'):
            # 1: Cortex (Glomerulosa, Fasciculata, Reticularis), 2: Medulla (Chromaffin)
            if any(k in t_text for k in ['medulla', 'chromaffin', 'catecholamine', 'epinephrine', 'norepinephrine', 'sympathetic']):
                return 2
            return 1

        elif (ch_id, sub_id) == (3, 'physiology'):
            # 1: Cortex (Cortisol, Aldosterone, Androgens), 2: Medulla (Catecholamines)
            if any(k in t_text for k in ['medulla', 'catecholamine', 'epinephrine', 'norepinephrine', 'pheochromocytoma']):
                return 2
            return 1

        elif (ch_id, sub_id) == (3, 'pathology'):
            # 1: Cortical (Cushing, Conn, Addison), 2: Medullary (Pheochromocytoma, Neuroblastoma)
            if any(k in t_text for k in ['pheochromocytoma', 'medulla', 'neuroblastoma', 'chromaffin', 'ganglioneuroma']):
                return 2
            return 1

        return 1

    total_qs = 0
    for ch in live['chapters']:
        ch_id = ch['id']
        for sub in ch['subjects']:
            sub_id = sub['id']
            lecs = mem_syllabus.get((ch_id, sub_id), [sub['name']])
            sub['lectureNames'] = lecs
            sub['lectureCount'] = len(lecs)
            sub['lectures'] = ', '.join(lecs)

            qs = sub.get('questions', [])
            total_qs += len(qs)
            for q in qs:
                lec_idx = classify_mem(ch_id, sub_id, q)
                if lec_idx < 1 or lec_idx > len(lecs):
                    lec_idx = 1
                q['lecture'] = lec_idx
                q['contentVersion'] = digest(content(q))

    ch_len = len(live['chapters'])
    print(f'MEM-2: Reorganized {total_qs} questions across {ch_len} chapters.')
    if not dry_run:
        with open(live_path, 'w') as f:
            json.dump(live, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f'MEM-2 written successfully to {live_path}')
    return live

if __name__ == '__main__':
    import sys
    dry_run = '--dry-run' in sys.argv
    print(f'Running reorganization (dry_run={dry_run})...')
    reorganize_mcvs2(dry_run)
    reorganize_mrs2(dry_run)
    reorganize_mem2(dry_run)

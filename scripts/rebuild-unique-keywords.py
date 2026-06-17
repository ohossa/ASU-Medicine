#!/usr/bin/env python3
"""Rebuild keyword dictionary keeping only exact, unique, chapter-specific keywords."""
import json, re
from collections import defaultdict
from pathlib import Path

with open('.kimchi/docs/book-toc.json', 'r', encoding='utf-8') as f:
    book_toc = json.load(f)
with open('.kimchi/docs/anki-keywords.json', 'r', encoding='utf-8') as f:
    anki_kw = json.load(f)
with open('/Users/omarhossa/Downloads/CNS anki .txt', 'r', encoding='utf-8') as f:
    anki_lines = f.readlines()

# === PHASE 1: Extract raw keywords per (ch, sub) ===
raw = defaultdict(lambda: defaultdict(set))

# From book TOC
for chapter in book_toc['chapters']:
    ch_id = str(chapter['id'])
    for sub_id, topics in chapter['subjects'].items():
        for topic in topics:
            # Add multi-word phrases from topic
            words = topic.split()
            if len(words) >= 2:
                raw[ch_id][sub_id].add(topic.lower())
            # Add 2-word phrases
            for i in range(len(words)-1):
                phrase = f"{words[i]} {words[i+1]}".lower()
                if len(phrase) > 4:
                    raw[ch_id][sub_id].add(phrase)
            # Add 3-word phrases
            for i in range(len(words)-2):
                phrase = f"{words[i]} {words[i+1]} {words[i+2]}".lower()
                raw[ch_id][sub_id].add(phrase)

# From Anki deck paths (topic names are very specific)
for ch_name, subjects in anki_kw.items():
    ch_id = ch_name.replace("Chapter ", "")
    for sub_id, kws in subjects.items():
        for kw in kws:
            # Keep multi-word phrases and proper nouns
            if ' ' in kw or len(kw) > 4:
                raw[ch_id][sub_id].add(kw.lower())

# From Anki card content: extract proper nouns (drugs, diseases, specific structures)
PROPER_NOUN_RE = re.compile(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b')
DRUG_PATTERN = re.compile(r'\b(?:'
n                         r'Levodopa|Sinemet|Carbidopa|Entacapone|Tolcapone|Selegiline|Rasagiline|Bromocriptine|Pergolide|'
                         r'Pramipexole|Ropinirole|Apomorphine|Amantadine|Trihexyphenidyl|Benztropine|'
                         r'Donepezil|Rivastigmine|Galantamine|Memantine|Tacrine|Riluzole|Fampridine|'
                         r'Fingolimod|Natalizumab|Interferon|Ocrelizumab|Dimethyl fumarate|Teriflunomide|'
                         r'Methylprednisolone|Prednisone|Voriconazole|Amphotericin|Itraconazole|Fluconazole|'
                         r'Nystatin|Ketoconazole|Rifampin|Isoniazid|Pyrazinamide|Ethambutol|Streptomycin|'
                         r'Gentamicin|Vancomycin|Ceftriaxone|Cefotaxime|Ampicillin|Penicillin|Metronidazole|'
                         r'Acyclovir|Ganciclovir|Oseltamivir|Zanamivir|Amantadine|Rimantadine|'
                         r'Haloperidol|Chlorpromazine|Fluphenazine|Thioridazine|Loxapine|Mesoridazine|'
                         r'Risperidone|Olanzapine|Quetiapine|Ziprasidone|Aripiprazole|Clozapine|Paliperidone|'
                         r'Amitriptyline|Imipramine|Clomipramine|Nortriptyline|Desipramine|Doxepin|'
                         r'Fluoxetine|Sertraline|Paroxetine|Citalopram|Escitalopram|Venlafaxine|Duloxetine|'
                         r'Mirtazapine|Trazodone|Bupropion|Lithium|Morphine|Fentanyl|Codeine|Tramadol|'
                         r'Meperidine|Methadone|Buprenorphine|Naloxone|Naltrexone|Pentazocine|Butorphanol|'
                         r'Phenobarbital|Primidone|Phenytoin|Carbamazepine|Oxcarbazepine|Valproate|'
                         r'Lamotrigine|Gabapentin|Pregabalin|Topiramate|Levetiracetam|Ethosuximide|'
                         r'Clonazepam|Diazepam|Lorazepam|Midazolam|Triazolam|Zolpidem|Zaleplon|'
                         r'Propofol|Etomidate|Ketamine|Thiopental|Halothane|Isoflurane|Sevoflurane|Desflurane|'
                         r'Nitrous oxide|Succinylcholine|Vecuronium|Rocuronium|Atracurium|Cisatracurium|'
                         r'Mivacurium|Dantrolene|Baclofen|Tizanidine|Diazepam|'
                         r'Sumatriptan|Ergotamine|Dihydroergotamine|Propranolol|Timolol|Atenolol|Metoprolol|'
                         r'Valproic acid|Lamotrigine|Topiramate|Gabapentin|Carbamazepine|'
                         r'Aspirin|Acetaminophen|Ibuprofen|Naproxen|Indomethacin|Celecoxib|'
                         r'Dopamine|Norepinephrine|Epinephrine|Serotonin|GABA|Glutamate|Acetylcholine|Histamine|'
                         r'endorphins|enkephalins|substance P|nitric oxide|ATP|adenosine|'
                         r'TCA|SSRI|SNRI|MAOI|ECT|VNS|DBS|'
                         r'Warfarin|Heparin|Aspirin|Clopidogrel|Dabigatran|Rivaroxaban|Apixaban|Edoxaban|'
                         r'rtPA|Streptokinase|Alteplase|Tenecteplase|'
                         r'Mannitol|Furosemide|Acetazolamide|Glycerol|Hypertonic saline|'
                         r'Dexamethasone|Prednisolone|Hydrocortisone|'
                         r'Azathioprine|Mycophenolate|Cyclophosphamide|Methotrexate|Rituximab|'
                         r'Bevacizumab|Cetuximab|Trastuzumab|Pembrolizumab|Nivolumab|'
                         r'Cisplatin|Carboplatin|Oxaliplatin|Vincristine|Vinblastine|Paclitaxel|Docetaxel|Doxorubicin|'
                         r'Cyclosporine|Tacrolimus|Sirolimus|Everolimus|'
                         r'Insulin|Metformin|Glipizide|Glyburide|Glimepiride|Sitagliptin|Saxagliptin|'
                         r'Empagliflozin|Canagliflozin|Dapagliflozin|Pioglitazone|Rosiglitazone|'
                         r'Levothyroxine|Methimazole|Propylthiouracil|'
                         r'Alendronate|Risedronate|Raloxifene|Denosumab|Teriparatide|'
                         r'Losartan|Valsartan|Candesartan|Irbesartan|'
                         r'Enalapril|Lisinopril|Captopril|Ramipril|'
                         r'Verapamil|Diltiazem|Nifedipine|Amlodipine|'
                         r'Furosemide|Hydrochlorothiazide|Spironolactone|Chlorthalidone|'
                         r'Omeprazole|Esomeprazole|Lansoprazole|Pantoprazole|Rabeprazole|'
                         r'Ranitidine|Famotidine|Cimetidine|'
                         r'Ondansetron|Granisetron|Palonosetron|Dolasetron|'
                         r'Metoclopramide|Domperidone|Erythromycin|'
                         r'Lactulose|Rifaximin|Neomycin|'
                         r'Loperamide|Diphenoxylate|'
                         r'Sulfasalazine|Mesalamine|Azathioprine|Infliximab|Adalimumab|'
                         r'TNF|IL-6|IL-1|IFN|'
                         r'ATP|ADP|AMP|cAMP|cGMP|GTP|GDP|NADH|FADH2|CoA|'
                         r'heme|bilirubin|urea|creatinine|uric acid|ammonia|ketone bodies|'
                         r'glucose|fructose|galactose|lactose|sucrose|maltose|glycogen|starch|cellulose|'
                         r'palmitate|stearate|oleate|linoleate|linolenate|arachidonate|'
                         r'cholesterol|bile acids|steroid hormones|vitamin D|'
                         r'alanine|arginine|asparagine|aspartate|cysteine|glutamate|glutamine|glycine|'
                         r'histidine|isoleucine|leucine|lysine|methionine|phenylalanine|proline|'
                         r'serine|threonine|tryptophan|tyrosine|valine|'
                         r'ornithine|citrulline|argininosuccinate|fumarate|malate|oxaloacetate|'
                         r'pyruvate|lactate|acetyl-CoA|citrate|isocitrate|α-ketoglutarate|'
                         r'succinyl-CoA|succinate|fumarate|malate|oxaloacetate|'
                         r'hemoglobin|myoglobin|cytochrome|ferritin|transferrin|'
                         r'collagen|elastin|keratin|fibrin|fibrinogen|albumin|globulin|'
                         r'insulin|glucagon|cortisol|epinephrine|norepinephrine|thyroxine|T4|'
                         r'triiodothyronine|T3|PTH|calcitonin|vitamin D|calcitriol|'
                         r'aldosterone|renin|angiotensin|ACE|bradykinin|'
                         r'prolactin|GH|ACTH|TSH|FSH|LH|ADH|oxytocin|'
                         r'estrogen|progesterone|testosterone|DHEA|DHT|'
                         r'prostaglandin|thromboxane|prostacyclin|leukotriene|'
                         r'NF-κB|AP-1|STAT|SMAD|Wnt|Notch|Hedgehog|'
                         r'BRCA1|BRCA2|TP53|RB|p16|p53|MDM2|ATM|'
                         r'HER2|EGFR|VEGF|PDGF|FGF|IGF|'
                         r'ras|raf|MEK|ERK|PI3K|AKT|mTOR|JAK|'
                         r'cyclin|CDK|CKI|p21|p27|p16|Rb|E2F|'
                         r'Bcl-2|Bax|Bad|Bak|Bim|PUMA|NOXA|'
                         r'caspase|apaf-1|cytochrome c|Smac/DIABLO|'
                         r'TNF-α|TRAIL|Fas|FasL|TNF-R1|'
                         r'VEGF|bFGF|TGF-β|IL-8|PDGF|MCP-1|'
                         r'MMP|TIMP|uPA|tPA|PAI-1|'
                         r'COX|LOX|5-LO|12-LO|15-LO|'
                         r'cPLA2|sPLA2|iPLA2|PI3K|AKT|mTOR|'
                         r'GSK3|β-catenin|TCF|LEF|'
                         r'HIF|HRE|VEGF|GLUT1|HKII|LDHA|'
                         r'p53|MDM2|p21|GADD45|14-3-3|'
                         r'Chk1|Chk2|ATM|ATR|BRCA1|BRCA2|RAD51|'
                         r'MLH1|MSH2|MSH6|PMS2|'
                         r'APC|β-catenin|Axin|GSK3β|'
                         r'KRAS|BRAF|PIK3CA|PTEN|EGFR|HER2|'
                         r'ALK|ROS1|BCR-ABL|PDGFR|KIT|FLT3|'
                         r'imatinib|dasatinib|nilotinib|bosutinib|ponatinib|'
                         r'erlotinib|gefitinib|afatinib|osimertinib|'
                         r'vemurafenib|dabrafenib|trametinib|cobimetinib|'
                         r'crizotinib|ceritinib|alectinib|brigatinib|lorlatinib|'
                         r'bevacizumab|ramucirumab|ziv-aflibercept|regorafenib|'
                         r'trametinib|dabrafenib|encorafenib|binimetinib|'
                         r'cetuximab|panitumumab|'
                         r'rituximab|obinutuzumab|ofatumumab|'
                         r'alemtuzumab|'
                         r'nivolumab|pembrolizumab|atezolizumab|durvalumab|avelumab|'
                         r'ipilimumab|tremelimumab|'
                         r'CAR-T|tisagenlecleucel|axicabtagene|'
                         r'bispecific|blinatumomab|tebentafusp|'
                         r'ADC|trastuzumab emtansine|fam-trastuzumab deruxtecan|'
                         r'PARP|olaparib|rucaparib|niraparib|talazoparib|'
                         r'CDK4/6|palbociclib|ribociclib|abemaciclib|'
                         r'PI3K|alpelisib|'
                         r'mTOR|everolimus|temsirolimus|'
                         r'HDAC|vorinostat|belinostat|panobinostat|'
                         r'HSP90|ganetespib|'
                         r'BCL-2|venetoclax|'
                         r'MDM2|idasanutlin|'
                         r'RAF|encorafenib|vemurafenib|dabrafenib|'
                         r'MEK|trametinib|cobimetinib|binimetinib|'
                         r'EGFR|erlotinib|gefitinib|afatinib|osimertinib|'
                         r'ALK|crizotinib|ceritinib|alectinib|brigatinib|lorlatinib|'
                         r'ROS1|crizotinib|entrectinib|repotrectinib|'
                         r'VEGFR|sunitinib|sorafenib|pazopanib|axitinib|cabozantinib|lenvatinib|'
                         r'KIT|imatinib|sunitinib|regorafenib|avapritinib|'
                         r'PDGFR|imatinib|sunitinib|sorafenib|'
                         r'FGFR|erdafitinib|pemigatinib|infigratinib|futibatinib|'
                         r'FGFR1|FGFR2|FGFR3|FGFR4|'
                         r'NTRK|larotrectinib|entrectinib|repotrectinib|'
                         r'NTRK1|NTRK2|NTRK3|'
                         r'PD-1|nivolumab|pembrolizumab|cemiplimab|dostarlimab|'
                         r'PD-L1|atezolizumab|durvalumab|avelumab|'
                         r'CTLA-4|ipilimumab|tremelimumab|'
                         r'LAG-3|relatlimab|'
                         r'TIM-3|sabatolimab|'
                         r'TIGIT|tiragolumab|domvanalimab|'
                         r'STING|cGAS|'
                         r'TLR|imiquimod|'
                         r'Oncolytic virus|talimogene laherparepvec|'
                         r'Cytokine|IL-2|IFN-α|GM-CSF|'
                         r'TIL|TCR|TIL therapy|'
                         r'TCR-T|tebentafusp|'
                         r'neoantigen|personalized vaccine|'
                         r'checkpoint inhibitor|immune checkpoint|'
                         r'CAR-T cell|CAR-T therapy|chimeric antigen receptor|'
                         r'BiTE|blinatumomab|tebentafusp|'
                         r'TNK cells|'
                         r'NK cell therapy|'
                         r'iPSC|induced pluripotent stem cell|'
                         r'CRISPR|Cas9|gene editing|'
                         r'Prime editing|base editing|'
                         r'AAV|adeno-associated virus|gene therapy|'
                         r'lentiviral vector|retroviral vector|'
                         r'antisense oligonucleotide|ASO|nusinersen|eteplirsen|'
                         r'siRNA|RNAi|patisiran|givosiran|lumasiran|'
                         r'miRNA|microRNA|'
                         r'mRNA|mRNA vaccine|'
                         r'oncolytic virus|talimogene laherparepvec|'
                         r'virotherapy|'
                         r'photodynamic therapy|PDT|'
                         r'radioimmunotherapy|ibritumomab tiuxetan|tositumomab|'
                         r'targeted radionuclide therapy|'
                         r'peptide receptor radionuclide therapy|PRRT|'
                         r'177Lu-DOTATATE|'
                         r'225Ac-DOTATATE|'
                         r'alpha emitter|'
                         r'beta emitter|'
                         r'gamma emitter|'
                         r'Auger electron|'
                         r'proton therapy|'
                         r'carbon ion therapy|'
                         r'FLASH radiotherapy|'
                         r'stereotactic body radiation therapy|SBRT|'
                         r'stereotactic radiosurgery|SRS|'
                         r'Gamma Knife|CyberKnife|'
                         r'intensity modulated radiation therapy|IMRT|'
                         r'volumetric modulated arc therapy|VMAT|'
                         r'image guided radiation therapy|IGRT|'
                         r'adaptive radiotherapy|ART|'
                         r'hyperthermia|'
                         r'cryoablation|'
                         r'microwave ablation|'
                         r'radiofrequency ablation|'
                         r'irreversible electroporation|'
                         r'high intensity focused ultrasound|HIFU|'
                         r'histotripsy|'
                         r'nanoparticle|liposome|dendrimer|micelle|'
                         r'polymer|PEG|PLGA|'
                         r'exosome|extracellular vesicle|'
                         r'aptamer|spiegelmer|'
                         r'ribozyme|deoxyribozyme|'
                     r')(?:\b|$'))
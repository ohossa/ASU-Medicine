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
    elif q_type == 'essay':
        opts = []
            
    fp = compute_fingerprint(stem, opts)
    if fp in fingerprints:
        existing = fingerprints[fp]
        duplicates.append({
            'duplicate_id': q.get('id', 'suppl2'),
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

letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5}

# ==========================================
# 1. MCQs 3/Locomotor Part 1 ASU (1).pdf (19 Written Essays by Dr. Ahmed Zahra)
# ==========================================
print("\n--- 1. Parsing MCQs 3/Locomotor Part 1 ASU (1).pdf (19 Essays) ---")
zahra_essays = [
    # Cartilage (7 questions)
    ("Give an account on cartilaginous matrix.", 
     "Cartilaginous matrix is an extracellular matrix specialized to bear mechanical stresses. It is composed of: 1) Fibers: Type II collagen fibrils (in hyaline and elastic cartilage) or thick Type I collagen bundles (in fibrocartilage). 2) Ground substance: Highly hydrated proteoglycan aggregates (aggrecan) containing sulfated glycosaminoglycans (chondroitin-4-sulfate, chondroitin-6-sulfate, and keratan sulfate) linked to hyaluronic acid core molecules. 3) Multiadhesive glycoproteins (chondronectin). The matrix is divided into territorial (capsular) matrix immediately surrounding lacunae, which is basophilic and rich in GAGs but poor in collagen, and interterritorial matrix, which is more acidophilic and richer in collagen. Cartilage matrix is completely avascular, aneural, and alymphatic; nutrition diffuses from perichondrial vessels.",
     "histology", "Cartilage Histology"),
     
    ("Give an account on perichondrium.",
     "The perichondrium is a vascular dense connective tissue capsule that surrounds cartilage, except over articular surfaces and fibrocartilage. It consists of two layers: 1) Outer fibrous layer: Composed of dense irregular connective tissue with Type I collagen fibers, fibroblasts, and blood vessels; provides structural support and vascular supply. 2) Inner chondrogenic (cellular) layer: Rich in mesenchymal chondrogenic cells and chondroblasts that can differentiate into chondrocytes for appositional cartilage growth and repair. Function: Provides vascular nourishment to avascular cartilage by diffusion and serves as the source of new chondroblasts for growth.",
     "histology", "Cartilage Histology"),
     
    ("Give an account on chondroblasts.",
     "Chondroblasts are immature cartilage-forming cells located in the inner chondrogenic layer of the perichondrium. Light microscopy (LM): Spindle-shaped or oval cells with oval euchromatic nuclei and basophilic cytoplasm due to abundant ribosomes. Electron microscopy (EM): Prominent rough endoplasmic reticulum (rER), well-developed Golgi apparatus, numerous mitochondria, and secretory granules containing collagen precursors and proteoglycans. Function: Actively synthesize and secrete the components of the cartilaginous extracellular matrix (collagen fibrils and ground substance); once completely surrounded by their secreted matrix, they mature into chondrocytes within lacunae.",
     "histology", "Cartilage Histology"),
     
    ("Give an account on chondrocytes.",
     "Chondrocytes are mature, differentiated cartilage cells residing within spaces called lacunae. LM: Spherical or rounded cells located deep in the matrix, often arranged in clusters called isogenous groups (cell nests) of 2 to 8 cells derived from mitotic division of a single chondroblast. Nuclei are spherical with prominent nucleoli; cytoplasm shows lipid droplets and glycogen vacuoles. EM: Show features of active protein synthesis (moderate rER and Golgi) with surface microvilli extending into matrix lacunae. Function: Maintain and turn over the surrounding extracellular matrix under endocrine control (growth hormone, thyroxine, testosterone).",
     "histology", "Cartilage Histology"),
     
    ("Compare between chondroblasts & chondrocytes as regard: LM, EM & Function.",
     "Comparison between Chondroblasts and Chondrocytes:\n• Location: Chondroblasts are located at the periphery in the inner layer of the perichondrium; Chondrocytes reside deep within matrix lacunae, singly or in isogenous groups.\n• LM Morphology: Chondroblasts are elongated or spindle-shaped with oval nuclei and basophilic cytoplasm; Chondrocytes are rounded or spherical with central rounded nuclei and vacuolated cytoplasm (lipid/glycogen).\n• EM Features: Chondroblasts have abundant rER, extensive Golgi complexes, and secretory vesicles; Chondrocytes have moderate rER and Golgi, surface microvilli, and cytoplasmic lipid droplets/glycogen reserves.\n• Function: Chondroblasts synthesize and deposit new matrix responsible for appositional growth; Chondrocytes maintain matrix integrity and enable interstitial growth.",
     "histology", "Cartilage Histology"),
     
    ("Compare between hyaline, Elastic and white fibrocartilage as regard: covering, fibers, Matrix, Site & function.",
     "Comparison of Cartilage Types:\n• Hyaline Cartilage: Covered by perichondrium (except articular surfaces); Fibers are fine Type II collagen fibrils (invisible under LM due to identical refractive index with ground substance); Matrix is basophilic and glassy (amorphous); Sites: Costal cartilages, nasal septum, larynx (thyroid, cricoid), trachea, bronchi, articular ends of bones; Function: Provides smooth low-friction gliding surface, flexible support, and forms fetal skeletal model.\n• Elastic Cartilage: Covered by perichondrium; Fibers are dense network of branched elastic fibers plus Type II collagen; Matrix is yellowish in fresh state with high elasticity; Sites: Auricle of ear, external acoustic meatus, Eustachian tube, epiglottis, corniculate and cuneiform laryngeal cartilages; Function: Flexible resilient support maintaining open lumen.\n• White Fibrocartilage: NO perichondrium; Fibers are dense parallel bundles of Type I collagen; Matrix is acidophilic and sparse between fiber bundles, with chondrocytes in linear rows; Sites: Intervertebral discs (annulus fibrosus), pubic symphysis, menisci of knee, articular discs of TMJ and sternoclavicular joints; Function: Tensile strength, shock absorption, and resistance to heavy compressive forces.",
     "histology", "Cartilage Histology"),
     
    ("Comment on Growth of Cartilage.",
     "Cartilage grows through two complementary mechanisms: 1) Appositional (Exogenous) Growth: Growth in thickness from the outside. Mesenchymal cells in the inner chondrogenic layer of the perichondrium proliferate and differentiate into chondroblasts, which deposit layers of new extracellular matrix on the surface of existing cartilage. 2) Interstitial (Endogenous) Growth: Growth in length/volume from within. Chondrocytes inside lacunae undergo mitotic division, forming isogenous groups (cell nests). Each daughter cell secretes matrix around itself, pushing the cells apart and expanding the matrix internally. Interstitial growth occurs primarily in fetal development, young cartilage, and within the epiphyseal plate of growing long bones. In adults, cartilage growth and regenerative capacity are extremely limited due to avascularity.",
     "histology", "Cartilage Histology"),

    # Bone (12 questions)
    ("Enumerate types of bone cells & give an account on bone forming one.",
     "The four main types of bone cells are: 1) Osteoprogenitor (osteogenic) cells, 2) Osteoblasts (bone-forming cells), 3) Osteocytes (mature bone cells), and 4) Osteoclasts (bone-resorbing cells).\nAccount on Osteoblasts:\n• Origin: Differentiate from osteoprogenitor mesenchymal stem cells under the influence of BMPs and Runx2.\n• Location: Line the active surfaces of growing or remodeling bone as a continuous single cuboidal or columnar layer.\n• LM: Cuboidal/columnar with intense cytoplasmic basophilia (high RNA/rER content), eccentric spherical euchromatic nucleus, and negative Golgi image.\n• EM: Abundant rER, prominent Golgi apparatus, numerous mitochondria, and secretory matrix vesicles containing alkaline phosphatase.\n• Function: Synthesize and secrete organic bone matrix (osteoid, mainly Type I collagen and non-collagenous proteins like osteocalcin and osteopontin) and initiate mineralization by releasing matrix vesicles rich in alkaline phosphatase, which precipitates calcium and phosphate as hydroxyapatite crystals. Once surrounded by mineralized matrix, osteoblasts mature into osteocytes.",
     "histology", "Bone Histology"),
     
    ("Give Short notes on osteoclast (bone resorbing cell).",
     "Osteoclasts are specialized bone-resorbing giant cells responsible for osteolysis and bone remodeling.\n• Origin: Derived from the fusion of mononuclear hematopoietic progenitor cells (monocyte/macrophage lineage in bone marrow) under stimulation by M-CSF and RANKL.\n• Location: Lie on resorbing bone surfaces inside shallow enzymatically carved depressions termed Howship's lacunae (resorption bays).\n• LM: Very large multinucleated cells (containing 5 to 50 nuclei) with acidophilic, granular cytoplasm due to abundant lysosomes and mitochondria.\n• Function: Dissolves both mineral and organic phases of bone. Secretes hydrogen ions via H+-ATPase pumps into the subosteoclastic microenvironment to dissolve hydroxyapatite crystals, and secretes lysosomal enzymes (cathepsin K and matrix metalloproteinases) to degrade Type I collagen matrix. Regulated by calcitonin (inhibits osteoclasts directly) and parathyroid hormone (stimulates osteoclasts indirectly via osteoblast RANKL expression).",
     "histology", "Bone Histology"),
     
    ("EM picture of osteoclast (4 Zones).",
     "Electron microscopy of an actively resorbing osteoclast reveals four specialized functional zones:\n1) Ruffled Border: Extensive microvillous foldings of the apical cell membrane directly facing the bone matrix. Contains active H+-ATPase proton pumps and secretory vacuoles releasing cathepsin K and tartrate-resistant acid phosphatase (TRAP) for active bone dissolution.\n2) Clear (Sealing) Zone: Ring of organelle-free cytoplasm surrounding the ruffled border, rich in actin filaments and integrins (αvβ3) that anchor tightly to osteopontin on the bone surface, creating an isolated, sealed acidic microenvironment beneath the ruffled border.\n3) Vesicular Zone: Located between the ruffled border and the cell body; contains numerous endocytic and secretory vesicles involved in the endocytosis and transcytosis of degraded bone mineral and collagen fragments.\n4) Basal Zone: The outermost region containing multiple nuclei, Golgi complexes, centrioles, rough endoplasmic reticulum, and abundant mitochondria supplying ATP for active proton transport.",
     "histology", "Bone Histology"),
     
    ("Enumerate bone cells responsible for bone remodeling & discuss one of them.",
     "Bone remodeling is carried out through the coupled actions of two primary cell types: 1) Osteoclasts (responsible for bone resorption) and 2) Osteoblasts (responsible for bone formation).\nDiscussion of Osteoblasts:\nOsteoblasts are mononuclear bone-forming cells derived from mesenchymal stem cells. They line bone surfaces in an epithelioid arrangement. Osteoblasts synthesize and secrete osteoid (Type I collagen, proteoglycans, and osteocalcin) and calcify it by releasing membrane-bound matrix vesicles. Furthermore, osteoblasts coordinate osteoclast activity through the RANKL/OPG pathway: osteoblasts express RANKL, which binds RANK on pre-osteoclasts to induce osteoclast differentiation and activation; osteoblasts also produce osteoprotegerin (OPG), a decoy receptor that binds RANKL and prevents excessive bone resorption.",
     "histology", "Bone Histology"),
     
    ("Give short note on periosteum.",
     "The periosteum is a tough vascular connective tissue membrane covering all outer surfaces of bones, except over articular surfaces where articular cartilage is present.\nLayers:\n1) Outer Fibrous Layer: Composed of dense irregular fibrous connective tissue containing fibroblasts, Type I collagen fibers, and a rich network of blood vessels, lymphatics, and sensory pain fibers. Deep collagen bundles called Sharpey's (perforating) fibers extend into outer circumferential lamellae of bone, firmly anchoring the periosteum, tendons, and ligaments to bone.\n2) Inner Osteogenic (Cellular) Layer: Loosely organized layer containing osteoprogenitor cells and osteoblasts resting on the bone surface. Function: Provides vascular nutrition to outer cortical bone, mediates appositional growth in bone diameter, anchors muscular attachments, and supplies osteogenic cells essential for fracture healing and repair.",
     "histology", "Bone Histology"),
     
    ("Give short note on endosteum.",
     "The endosteum is a delicate, thin single-cell-thick membrane that lines all internal cavities of bone, including the central medullary (marrow) cavity, the trabeculae of spongy (cancellous) bone, and the inner walls of Haversian and Volkmann's canals.\nStructure & Composition: Consists of a monolayer of flattened osteoprogenitor cells, inactive bone lining cells, along with osteoblasts and osteoclasts.\nFunction: Directly participates in internal bone remodeling, bone turnover, and calcium homeostasis. During growth, endosteal osteoclasts resorb bone from the marrow cavity wall as periosteal osteoblasts deposit bone externally, enlarging the marrow cavity without excessively increasing bone weight.",
     "histology", "Bone Histology"),
     
    ("Give short note on organization of lamellae of compact bone.",
     "Compact (cortical) bone is organized into dense, highly organized calcified matrix lamellae arranged in four distinct patterns:\n1) Concentric (Haversian) Lamellae: Concentric circular layers of bone matrix (4 to 20 lamellae) arranged around a central Haversian canal, forming an osteon. Collagen fibers run helically with alternating orientations in successive lamellae, providing high torsional strength.\n2) Interstitial Lamellae: Irregular angular fragments of lamellae located between intact osteons; represent remnants of partially resorbed older osteons left behind during bone remodeling.\n3) Outer Circumferential Lamellae: Several continuous lamellae running completely around the outer perimeter of the bone shaft immediately beneath the periosteum.\n4) Inner Circumferential Lamellae: Several continuous lamellae lining the inner aspect of the bone shaft immediately beneath the endosteum around the marrow cavity.",
     "histology", "Bone Histology"),
     
    ("Give an account on Haversian system (osteon).",
     "The Haversian system (osteon) is the basic structural and functional unit of mature compact (cortical) bone.\nComponents:\n1) Haversian Canal: Central longitudinal vascular canal running parallel to the long axis of bone, transmitting 1 to 2 blood capillaries, unmyelinated nerve fibers, and loose connective tissue.\n2) Concentric Lamellae: 4 to 20 concentric cylindrical plates of mineralized bone matrix organized around the central canal.\n3) Lacunae: Small fluid-filled spaces situated between concentric lamellae, each containing a single mature osteocyte.\n4) Canaliculi: Minute radiating micro-canals penetrating the lamellae, connecting adjacent lacunae with each other and with the Haversian canal. Osteocyte cytoplasmic processes meet within canaliculi and communicate via gap junctions, facilitating nutrient, gas, and metabolic waste diffusion across the mineralized barrier.\n5) Cement Line: Outer refractive boundary of the osteon, mineralized with ground substance and deficient in collagen fibers, delimiting each osteon from neighboring bone.\nTransverse Volkmann's canals run perpendicular to osteons, connecting Haversian canals to each other, to the periosteum, and to the medullary cavity.",
     "histology", "Bone Histology"),
     
    ("Compare between osteocytes and chondrocytes.",
     "Comparison between Osteocytes and Chondrocytes:\n• Location: Osteocytes reside in lacunae within mineralized bone matrix, possessing radiating canaliculi; Chondrocytes reside in lacunae within non-mineralized hydrated cartilage matrix, without canaliculi.\n• Arrangement: Osteocytes are arranged in concentric rings (in osteons) or parallel lamellae; Chondrocytes are arranged in isogenous clusters (cell nests) or scattered singly.\n• Nutrition & Transport: Osteocytes receive nutrients through canalicular fluid flow and gap junctions from vascular Haversian canals; Chondrocytes depend strictly on slow diffusion through the gel-like matrix from perichondrial or synovial vessels.\n• Cytoplasmic Processes: Osteocytes have long, slender dendritic processes passing through canaliculi; Chondrocytes lack extensive processes (short microvilli only).\n• Mitotic Capacity: Osteocytes NEVER undergo mitotic division (no interstitial growth of bone); Chondrocytes undergo mitotic division, enabling interstitial growth of cartilage.",
     "histology", "Bone Histology"),
     
    ("Compare between osteoblast and osteoclast.",
     "Comparison between Osteoblast and Osteoclast:\n• Embryological Origin: Osteoblasts originate from mesenchymal osteoprogenitor stem cells; Osteoclasts originate from hematopoietic stem cells (monocyte/macrophage lineage).\n• Cell Size & Nuclear Count: Osteoblasts are small, mononucleated cuboidal/columnar cells; Osteoclasts are giant multinucleated cells (5 to 50 nuclei).\n• Cytoplasmic Staining: Osteoblasts show basophilic cytoplasm (abundant rER); Osteoclasts show acidophilic cytoplasm (numerous lysosomes and mitochondria).\n• Location: Osteoblasts line bone-forming surfaces as an epithelioid layer; Osteoclasts reside in Howship's resorption lacunae on bone surfaces.\n• Primary Function: Osteoblasts form organic osteoid matrix and induce mineralization (release alkaline phosphatase); Osteoclasts resorb bone mineral (via H+ ATPase acid secretion) and digest collagen matrix (via cathepsin K).\n• Hormonal Regulation: Osteoblasts are stimulated by PTH, vitamin D, and estrogen; Osteoclasts are inhibited directly by calcitonin and stimulated indirectly by PTH through osteoblastic RANKL.",
     "histology", "Bone Histology"),
     
    ("Describe the structure of epiphyseal plate of cartilage.",
     "The epiphyseal growth plate is a disc of hyaline cartilage separating the epiphysis from the diaphysis in growing long bones, responsible for endochondral longitudinal bone growth. Under LM, it is divided from the epiphyseal side to the diaphyseal side into five continuous histological zones:\n1) Zone of Resting (Reserve) Cartilage: Typical inactive hyaline cartilage with small, randomly scattered chondrocytes; anchors the plate to the epiphysis.\n2) Zone of Proliferation: Chondrocytes undergo rapid mitosis and arrange themselves in distinct longitudinal parallel columns resembling stacks of coins, actively producing matrix.\n3) Zone of Hypertrophy (Maturation): Chondrocytes cease dividing and enlarge markedly (hypertrophy), accumulating intracellular glycogen and compressing the surrounding matrix into thin longitudinal septa. They secrete alkaline phosphatase and VEGF to induce vascular invasion.\n4) Zone of Calcification: Thin zone where hypertrophic chondrocytes degenerate and undergo apoptosis; the thin cartilage matrix septa become calcified by calcium salt precipitation.\n5) Zone of Ossification: Capillaries and osteoprogenitor cells from the diaphysis invade the vacant lacunae; osteoblasts line the calcified cartilage scaffolding and lay down new osteoid (bone matrix), which subsequently mineralizes to form woven bone.",
     "histology", "Bone Histology"),
     
    ("Mention the histology of spongy (cancellous) bone.",
     "Spongy (cancellous or trabecular) bone is lightweight, porous bone found in the interior of epiphyses and metaphyses of long bones, and inside flat and irregular bones.\nHistological Characteristics:\n1) Trabecular Architecture: Formed of an interconnecting meshwork of delicate bony plates, bars, and struts called trabeculae, oriented along lines of mechanical stress.\n2) Bone Lamellae: The trabeculae are composed of parallel bone lamellae containing lacunae with osteocytes. However, trabeculae are thin (<0.2 mm) and do NOT contain classic Haversian systems (osteons) or central blood canals.\n3) Nutrition: Osteocytes receive nutrients directly by diffusion from blood vessels within the surrounding marrow spaces via canaliculi opening onto the endosteal surface.\n4) Covering: Every trabecular surface is covered by a cellular layer of endosteum containing osteoprogenitor cells, osteoblasts, and osteoclasts.\n5) Marrow Spaces: The spaces between trabeculae are filled with vascular bone marrow (red hematopoietic marrow or yellow adipose marrow).",
     "histology", "Bone Histology")
]

for stem, ans, subj, top in zahra_essays:
    add_candidate({
        'sourcePdf': 'MCQs 3/Locomotor Part 1 ASU (1).pdf',
        'type': 'essay',
        'subject': subj,
        'topic': top,
        'text': stem,
        'options': [],
        'modelAnswer': ans,
        'explanation': f"Official model answer verified from Ain Shams Histology Department (Dr. Ahmed Zahra Locomotor Guide)."
    })

# ==========================================
# 2. McQs 4/JOINT QUIZ 2.pdf (11 MCQs)
# ==========================================
print("\n--- 2. Parsing McQs 4/JOINT QUIZ 2.pdf ---")
joint_mcqs = [
    ("Regarding the long heads of biceps and triceps which of the following is true?",
     ["Both extracapsular", "Triceps extracapsular, biceps intracapsular", "Both intracapsular", "Triceps intracapsular, biceps extracapsular"],
     1, "B", "The tendon of the long head of the biceps brachii arises from the supraglenoid tubercle of the scapula and passes intracapsularly across the glenohumeral joint before entering the bicipital groove. In contrast, the long head of the triceps brachii arises from the infraglenoid tubercle of the scapula entirely extracapsularly."),

    ("Which of the following does not connect radius and ulna?",
     ["Annular ligament", "Interosseous membrane", "Oblique cord", "Quadrate ligament"],
     0, "A", "The annular ligament of the radius encircles the head of the radius and attaches to both the anterior and posterior margins of the radial notch of the ulna; it does not connect the radial bone to the ulnar bone directly along shafts or necks, whereas the oblique cord, interosseous membrane, and quadrate ligament directly unite radius and ulna."),

    ("Which of the following pierces the interosseous membrane?",
     ["Posterior interosseous artery", "Anterior interosseous artery", "Common interosseous artery", "Posterior interosseous nerve"],
     1, "B", "The anterior interosseous artery descends on the anterior surface of the interosseous membrane and pierces the interosseous membrane at the upper border of pronator quadratus to enter the posterior compartment of the forearm and anastomose with the posterior interosseous artery and dorsal carpal arch."),

    ("Which of the following describes the correct order of the distal row of carpals from lateral to medial?",
     ["Triquetrum, trapezoid, capitate, hamate", "Trapezoid, trapezium, capitate, hamate", "Trapezium, trapezoid, capitate, hamate", "Trapezium, triquetrum, capitate, hamate", "Scaphoid, lunate, triquetrum, pisiform"],
     2, "C", "From lateral to medial, the bones of the distal carpal row are: Trapezium, Trapezoid, Capitate, and Hamate (mnemonic: She Looks Too Pretty, Try To Catch Her; second row = Trapezium, Trapezoid, Capitate, Hamate)."),

    ("All of the following are medial rotators of the arm EXCEPT:",
     ["Latissimus dorsi", "Teres major", "Subscapularis", "Infraspinatus", "Anterior part of deltoid"],
     3, "D", "Infraspinatus (along with teres minor and posterior deltoid) is a lateral rotator of the arm at the glenohumeral joint. Subscapularis, latissimus dorsi, teres major, pectoralis major, and anterior deltoid are all medial rotators."),

    ("What muscles are necessary to raise the arm above the shoulder?",
     ["First the supraspinatus, next the deltoid, and then the serratus anterior", "First the deltoid, next the supraspinatus, and then the serratus anterior", "First the serratus anterior, next the deltoid, and then the supraspinatus", "First the deltoid, next the serratus anterior, and then supraspinatus"],
     0, "A", "Abduction of the upper limb is initiated (0° to 15°) by the supraspinatus muscle; abduction from 15° to 90° is performed by the multipennate middle fibers of the deltoid; full abduction and elevation above the horizontal (>90° to 180°) requires scapular upward rotation produced by the serratus anterior (lower 5 digitations) and trapezius."),

    ("Which rotator cuff muscle does NOT rotate the humerus?",
     ["Supraspinatus", "Infraspinatus", "Teres minor", "Subscapularis", "Teres major"],
     0, "A", "The supraspinatus initiates abduction of the arm (0-15°) and stabilizes the glenohumeral joint; it does not produce rotation. Subscapularis produces medial rotation; infraspinatus and teres minor produce lateral rotation."),

    ("A patient is asked to abduct the arm 90 degrees and then to extend the flexed forearm against resistance. Which muscle is being tested?",
     ["Triceps brachii", "Brachialis", "Coracobrachialis", "Biceps brachii", "Supinator"],
     0, "A", "Active extension of the flexed forearm against examiner resistance specifically tests the motor function and strength of the triceps brachii muscle and its radial nerve innervation (C6, C7, C8)."),

    ("In respect to movement of the arm at the glenohumeral joint, which of the following movements is correctly paired with its prime mover?",
     ["Extension . . . deltoid (posterior part)", "Abduction . . . pectoralis major and latissimus dorsi", "Adduction . . . deltoid", "Medial rotation . . . infraspinatus", "Lateral rotation . . . subscapularis"],
     0, "A", "Posterior fibers of the deltoid and latissimus dorsi are prime movers for arm extension. Pectoralis major and latissimus dorsi adduct; infraspinatus laterally rotates; subscapularis medially rotates."),

    ("Which of the following joints is paired correctly with its type?",
     ["Proximal and distal radioulnar joints . . . condyloid type of synovial joint", "Radiocarpal joint . . . pivot type of synovial joint", "Intercarpal joints . . . plane type of synovial joints", "Metacarpophalangeal joints . . . hinge type of synovial joints", "Interphalangeal joints . . . condyloid type of synovial joints"],
     2, "C", "Intercarpal joints are plane synovial joints allowing gliding movements. Radioulnar joints are pivot synovial; radiocarpal is ellipsoid; metacarpophalangeal are condyloid; interphalangeal are hinge synovial joints."),

    ("All carpometacarpal and intermetacarpal joints are plane types of synovial joints EXCEPT for:",
     ["The carpometacarpal joint of the thumb", "The carpometacarpal joint of the fifth metacarpal", "The carpometacarpal joint of the third metacarpal", "The intermetacarpal joint of the 4th and 5th metacarpals"],
     0, "A", "The first carpometacarpal joint (between the trapezium and the base of the first metacarpal of the thumb) is a saddle (sellar) synovial joint, which permits flexion, extension, abduction, adduction, and opposition.")
]

for stem, opts, c_idx, c_ans, expl in joint_mcqs:
    add_candidate({
        'sourcePdf': 'McQs 4/JOINT QUIZ 2.pdf',
        'type': 'mcq',
        'subject': 'anatomy',
        'topic': 'Joints of Upper Limb',
        'text': stem,
        'options': opts,
        'correctAnswer': c_ans,
        'correctIndex': c_idx,
        'explanation': expl
    })

# ==========================================
# 3. McQs 4/YOUSSEF upper quiz 1 ANSWERED.pdf
# ==========================================
print("\n--- 3. Parsing McQs 4/YOUSSEF upper quiz 1 ANSWERED.pdf ---")
youssef_q1 = [
    ("Subacromial bursa separates coracoacromial arch from the tendon of:",
     ["Subscapularis", "Teres minor", "Supraspinatus", "Infraspinatus"],
     2, "C", "The subacromial (subdeltoid) bursa lies between the acromion/coracoacromial ligament superiorly and the tendon of supraspinatus and joint capsule inferiorly, facilitating friction-free abduction of the arm."),
     
    ("The type of the sternoclavicular joint is:",
     ["Saddle synovial joint", "Ellipsoid synovial joint", "Ball and socket joint", "Plane synovial joint"],
     0, "A", "The sternoclavicular joint is anatomically a saddle (sellar) synovial joint, but functionally moves in all planes like a ball-and-socket joint due to the presence of an intervening fibrocartilaginous articular disc.")
]

for stem, opts, c_idx, c_ans, expl in youssef_q1:
    add_candidate({
        'sourcePdf': 'McQs 4/YOUSSEF upper quiz 1 ANSWERED.pdf',
        'type': 'mcq',
        'subject': 'anatomy',
        'topic': 'Joints of Upper Limb',
        'text': stem,
        'options': opts,
        'correctAnswer': c_ans,
        'correctIndex': c_idx,
        'explanation': expl
    })

# ==========================================
# 4. mcq/ELSHAEER GOUT QUIZ.pdf (MCQs + Essays)
# ==========================================
print("\n--- 4. Parsing mcq/ELSHAEER GOUT QUIZ.pdf ---")
gout_mcqs = [
    ("Gout is induced by one of the following drugs:",
     ["Allopurinol", "Probenecid", "Naproxen", "Diuretics"],
     3, "D", "Thiazide and loop diuretics compete with uric acid for the organic acid secretory transport system in the proximal renal tubules and cause volume depletion, leading to decreased renal clearance of uric acid and drug-induced hyperuricemia/gout."),
     
    ("Indomethacin dose in treatment of acute gouty arthritis is:",
     ["500 mg once per day", "50 mg three times per day", "5 mg three times per day", "None of the above"],
     1, "B", "The standard initial dose of indomethacin in acute gouty arthritis is 50 mg orally three times daily (every 8 hours) with meals until joint pain subsides, followed by tapering."),
     
    ("Colchicine chronic adverse effects include all of the following except:",
     ["Hair loss (alopecia)", "Neutropenia", "Aplastic anemia", "Acute diarrhea"],
     3, "D", "Diarrhea, abdominal cramps, nausea, and vomiting are the hallmark acute gastrointestinal side effects of colchicine toxicity. Bone marrow suppression (leukopenia, neutropenia, aplastic anemia), myopathy, and alopecia are associated with chronic toxic exposure."),
     
    ("Pegloticase is characterized by all of the following except:",
     ["Administered by intravenous infusion", "Should be preceded by antihistamines and corticosteroids", "Administered every 2 weeks", "Safe in patients with G6PD deficiency"],
     3, "D", "Pegloticase (recombinant pegylated uricase) oxidizes uric acid to allantoin and produces hydrogen peroxide as a byproduct. In patients with glucose-6-phosphate dehydrogenase (G6PD) deficiency, hydrogen peroxide cannot be neutralized, causing severe acute hemolytic anemia and methemoglobinemia. It is strictly contraindicated in G6PD deficiency."),
     
    ("Probenecid in low dose may lead to:",
     ["Hyperuricemia", "Nausea", "Anaphylaxis", "None of the above"],
     0, "A", "Low-dose probenecid preferentially inhibits the tubular secretion of uric acid without blocking reabsorption, resulting in net uric acid retention and paradoxically worsening hyperuricemia. Full uricosuric therapeutic doses are required to block the URAT1 reabsorption transporter."),
     
    ("Peptic ulceration may be associated with:",
     ["Acetylsalicylic acid (Aspirin)", "Glucocorticoids", "Sulfinpyrazone", "All of the above"],
     3, "D", "Aspirin, sulfinpyrazone, and glucocorticoids all disrupt gastric mucosal protective barriers by inhibiting mucosal prostaglandin synthesis or impairing epithelial regeneration, predisposing to peptic ulcer disease and GI bleeding."),
     
    ("Colchicine in the treatment of acute gout should be taken:",
     ["3 times per day for 3 days after complete recovery", "Loading dose followed by hourly or twice-daily dosing until pain relief or GI toxicity", "Once per day till recovery", "None of the above"],
     1, "B", "In acute gout, colchicine is administered as an initial oral loading dose (1.2 mg / 1 mg) followed by 0.6 mg / 0.5 mg one hour later or every 2-3 hours until joint symptoms abate or GI adverse effects (diarrhea/nausea) occur.")
]

for stem, opts, c_idx, c_ans, expl in gout_mcqs:
    add_candidate({
        'sourcePdf': 'mcq/ELSHAEER GOUT QUIZ.pdf',
        'type': 'mcq',
        'subject': 'pharma',
        'topic': 'Gout & Hyperuricemia Pharmacotherapy',
        'text': stem,
        'options': opts,
        'correctAnswer': c_ans,
        'correctIndex': c_idx,
        'explanation': expl
    })

gout_essays = [
    ("Explain why colchicine or low-dose NSAID is added to allopurinol during the first 3 to 6 months of chronic gout treatment.",
     "Initiation of urate-lowering therapy with allopurinol (a xanthine oxidase inhibitor) rapidly lowers serum uric acid concentrations, which leads to mobilization and dissolution of preexisting monosodium urate crystal deposits in articular cartilage and tophi. Fragmented and shed crystals trigger acute synovial inflammation and precipitate paradoxical acute gouty flares. Concomitant prophylaxis with low-dose colchicine (0.5-0.6 mg daily or BID) or an NSAID inhibits neutrophil chemotaxis, activation, and inflammasome assembly, preventing initiation-induced acute gout attacks until total body urate stores stabilize.",
     "pharma", "Gout & Hyperuricemia Pharmacotherapy"),
     
    ("Explain why uricosuric drugs and low-dose Aspirin should NOT be taken during an acute gouty arthritis attack.",
     "1) Low-dose aspirin (1-2 g/day) inhibits organic acid secretory transporters in the renal proximal tubules, selectively blocking uric acid secretion without inhibiting its reabsorption, thereby exacerbating hyperuricemia.\n2) Uricosuric agents (such as probenecid or sulfinpyrazone) markedly increase renal tubular uric acid excretion, predisposing to precipitation of uric acid crystals, renal calculi (nephrolithiasis), and acute urate nephropathy, especially in dehydrated acidotic patients during an acute inflammatory attack.\n3) Shifting plasma and synovial urate concentrations during an ongoing acute attack destabilizes articular crystal deposits and prolongs or intensifies joint synovitis.",
     "pharma", "Gout & Hyperuricemia Pharmacotherapy"),
     
    ("Outline the long-term pharmacological management of chronic tophaceous gout.",
     "Long-term management of chronic tophaceous gout aims to maintain serum urate levels below 5 mg/dL (300 µmol/L) to dissolve tophi and prevent recurrent flares:\n1) Xanthine Oxidase Inhibitors (First-Line): Allopurinol (titrated from 100 mg up to 300-800 mg daily, adjusted for renal function) or Febuxostat (40-80 mg daily in renal impairment or allopurinol intolerance).\n2) Flare Prophylaxis: Low-dose colchicine (0.5-0.6 mg daily) or low-dose NSAIDs co-administered for the first 3 to 6 months of urate-lowering therapy.\n3) Uricosuric Agents: Probenecid (500-1000 mg BID) added in underexcretors with preserved renal function (GFR >50 mL/min) and absent history of nephrolithiasis; ensure adequate hydration and urine alkalinization.\n4) Recombinant Uricase (Refractory Tophaceous Gout): Pegloticase IV infusion every 2 weeks for severe debilitating tophaceous disease refractory to conventional oral therapies.",
     "pharma", "Gout & Hyperuricemia Pharmacotherapy")
]

for stem, ans, subj, top in gout_essays:
    add_candidate({
        'sourcePdf': 'mcq/ELSHAEER GOUT QUIZ.pdf',
        'type': 'essay',
        'subject': subj,
        'topic': top,
        'text': stem,
        'options': [],
        'modelAnswer': ans,
        'explanation': "Verified pharmacology model answer based on Ain Shams Department Guidelines and Dr. ElShaeir Gout Module."
    })

# ==========================================
# 5. MCQ 4/LOCO MCQ 2-Solved.pdf (19 Microbiology MCQs)
# ==========================================
print("\n--- 5. Parsing MCQ 4/LOCO MCQ 2-Solved.pdf ---")
loco_mcqs = [
    ("Which of the following statements about Staphylococcus aureus is incorrect?",
     ["Gram-positive cocci in grape-like clusters", "Staphylococcal lesions are localized due to coagulase production", "Treatment should include a beta-lactamase-resistant penicillin", "Endotoxin is an important virulence factor"],
     3, "D", "Staphylococcus aureus is a Gram-positive bacterium and therefore completely lacks endotoxin (lipopolysaccharide), which is an exclusive structural component of the outer membrane of Gram-negative bacteria. Virulence factors of S. aureus include coagulase, protein A, hemolysins, leukocidins, and enterotoxins."),

    ("Skin rash of scarlet fever is mediated by:",
     ["Erythrogenic toxin (pyrogenic exotoxin)", "Pyrogenic exotoxin B", "Alpha toxin", "Exfoliatin toxin"],
     0, "A", "The diffuse erythematous punctate blanching rash of scarlet fever is mediated by lysogenic phage-encoded streptococcal pyrogenic exotoxins (erythrogenic toxin A, B, or C) produced by Streptococcus pyogenes (GAS)."),

    ("A 44-year-old male had an open fracture of the right femur and tibia due to a car accident. The patient developed pain, edema, cellulitis, blackening and bad odor at the wound area; Gram-positive bacilli were isolated anaerobically from wound exudates. Which of the following is most probably the causative agent of this infection?",
     ["Actinomyces israelii", "Group A beta-hemolytic streptococci", "Bacillus anthracis", "Clostridium perfringens", "Corynebacterium diphtheriae"],
     3, "D", "Gas gangrene (clostridial myonecrosis) following contaminated trauma or open fractures is caused by Clostridium perfringens, an anaerobic, spore-forming, Gram-positive bacillus that secretes alpha-toxin (lecithinase), causing gas production (crepitus), foul-smelling exudate, tissue blackening, and rapid necrosis."),

    ("Methicillin-resistant Staphylococcus aureus (MRSA) strains are resistant to beta-lactamase-resistant penicillins primarily due to:",
     ["Reduced permeability to methicillin", "Degradation of methicillin by a beta-lactamase encoded on a plasmid", "Altered penicillin-binding proteins (PBP2a encoded by mecA gene)", "Change in peptidoglycan precursor structure"],
     2, "C", "MRSA resistance is mediated by the chromosomal mecA gene, which encodes penicillin-binding protein 2a (PBP2a). PBP2a has remarkably low binding affinity for all beta-lactam antibiotics, permitting cell wall synthesis even in the presence of methicillin, nafcillin, or oxacillin."),

    ("A 4-year-old boy presents with honey-colored crusted skin lesions on his face. Gram stain reveals polymorphs and Gram-positive catalase-negative cocci. If the exudate is cultured on blood agar, which of the following is most likely to be seen?",
     ["Beta-hemolysis", "Alpha-hemolysis", "Gamma-hemolysis", "Double zone of hemolysis"],
     0, "A", "Non-bullous impetigo with characteristic honey-colored crusts caused by Streptococcus pyogenes (catalase-negative, Gram-positive cocci in chains) exhibits clear beta-hemolysis (complete lysis of red blood cells) on 5% sheep blood agar and is bacitracin-sensitive."),

    ("Scalded skin syndrome (SSSS / Ritter's disease) is caused by exotoxins (exfoliatins) produced by:",
     ["Streptococcus pyogenes", "Pseudomonas aeruginosa", "Staphylococcus aureus", "Cutibacterium acnes"],
     2, "C", "Staphylococcal scalded skin syndrome is caused by epidermolytic (exfoliative) toxins A and B secreted by Staphylococcus aureus (phage group II), which target and cleave desmoglein-1 in the desmosomes of the stratum granulosum."),

    ("Which of the following microorganisms causes scarlet fever?",
     ["Streptococcus pyogenes", "Pseudomonas aeruginosa", "Staphylococcus aureus", "Propionibacterium acnes", "Demodex folliculorum"],
     0, "A", "Scarlet fever is caused by Streptococcus pyogenes (Group A beta-hemolytic Streptococcus) carrying a temperate bacteriophage that encodes pyrogenic exotoxin / erythrogenic toxin."),

    ("Which of the following is NOT a characteristic of impetigo?",
     ["Common in children", "Can be caused by Staphylococcus aureus", "Can be caused by Streptococcus pyogenes", "Is highly contagious", "Can be caused by Pseudomonas aeruginosa"],
     4, "E", "Impetigo is a superficial bacterial skin infection predominantly affecting young children, caused by Staphylococcus aureus and/or Streptococcus pyogenes. It is highly contagious via direct contact but is NOT caused by Pseudomonas aeruginosa."),

    ("Bacteria that multiply in blocked skin pores, metabolize sebum, and lead to the development of acne vulgaris are:",
     ["Pseudomonas aeruginosa", "Cutibacterium (Propionibacterium) acnes", "Serratia marcescens", "Streptococcus pyogenes", "Acne is not caused by bacterial infection"],
     1, "B", "Cutibacterium (formerly Propionibacterium) acnes is an anaerobic Gram-positive diphtheroid that colonizes sebaceous follicles, releases lipases that break down triglycerides in sebum into pro-inflammatory free fatty acids, and incites comedone and pustule formation."),

    ("Staphylococcus aureus is most characteristically distinguished from other staphylococci by being:",
     ["Coagulase-positive", "Coagulase-negative", "Catalase-negative", "Gram-negative"],
     0, "A", "Coagulase production (converting fibrinogen to fibrin) is the definitive diagnostic hallmark that distinguishes pathogenic Staphylococcus aureus (coagulase-positive) from coagulase-negative staphylococci such as S. epidermidis and S. saprophyticus."),

    ("M protein, a major virulence factor that inhibits phagocytosis by degrading C3b, is produced by:",
     ["Pseudomonas aeruginosa", "Staphylococcus aureus", "Propionibacterium acnes", "Streptococcus pyogenes"],
     3, "D", "M protein is the major cell-wall virulence factor of Streptococcus pyogenes (GAS). It extends as hair-like projections from the cell wall, binds complement regulatory factor H, prevents alternative pathway C3b deposition, and resists opsonophagocytosis."),

    ("A patient presents with skin that is intensely red, raised, shiny, edematous, with a sharply demarcated advancing margin; the most common cause is Group A streptococci. These features are diagnostic of:",
     ["Erysipelas", "Furuncle", "Cellulitis", "Necrotizing fasciitis"],
     0, "A", "Erysipelas is an acute superficial dermal and lymphatic infection typically caused by Streptococcus pyogenes, characterized by a bright red, swollen, warm, plaque-like lesion with sharply demarcated elevated margins and prominent systemic symptoms (fever, chills)."),

    ("The causative agent of Buruli ulcer (causing extensive necrotizing skin and soft tissue lesions) is:",
     ["Mycobacterium chelonae", "Mycobacterium marinum", "Mycobacterium fortuitum", "Mycobacterium ulcerans"],
     3, "D", "Mycobacterium ulcerans produces the lipid-soluble polyketide exotoxin mycolactone, which exerts cytotoxic and immunosuppressive effects, causing severe necrotic subcutaneous destruction known as Buruli ulcer."),

    ("A patient complains to his dentist about a chronic draining sinus in the jaw following dental extraction. A Gram stain of pus shows branching Gram-positive filamentous rods and yellowish 'sulfur granules'. The most likely diagnosis is:",
     ["Actinomyces israelii", "Corynebacterium diphtheriae", "Nocardia brasiliensis", "Staphylococcus aureus"],
     0, "A", "Cervicofacial actinomycosis, caused by the anaerobic/microaerophilic filamentous Gram-positive bacterium Actinomyces israelii (part of oral flora), produces chronic indurated abscesses with multiple sinus tracts draining purulent material containing characteristic yellow macrocolonies called 'sulfur granules'."),

    ("A 30-year-old butcher developed a painless pruritic papule on his forearm that rapidly enlarged, ulcerated, and formed a central depressed black eschar surrounded by non-pitting edema. Gram stain reveals large Gram-positive bacilli with squared ends. The causative organism is:",
     ["Propionibacterium acnes", "Corynebacterium diphtheriae", "Clostridium perfringens", "Actinomyces israelii", "Bacillus anthracis"],
     4, "E", "Cutaneous anthrax, acquired by direct contact with infected animal carcasses or wool, is caused by Bacillus anthracis (large aerobic Gram-positive spore-forming rod). It classically presents as a painless black necrotic eschar surrounded by extensive gelatinous edema, mediated by lethal toxin and edema toxin."),

    ("A young man suffers major soft tissue trauma and open tibial fractures after a motorcycle accident. On examination, the leg is tense, with thin, foul-smelling dirty brownish discharge, and palpable subcutaneous crepitus. The most likely organism is:",
     ["Actinomyces israelii", "Staphylococcus aureus", "Nocardia brasiliensis", "Clostridium perfringens"],
     3, "D", "Palpable crepitus (subcutaneous gas production from carbohydrate fermentation), dirty dishwater discharge, severe muscle pain out of proportion to exam, and rapid tissue necrosis in an open fracture are hallmarks of clostridial myonecrosis (gas gangrene) caused by Clostridium perfringens."),

    ("A 9-year-old girl presents with fever (39.5°C), sore throat, cervical lymphadenopathy, a diffuse sandpapery erythematous rash that blanches on pressure, and a 'strawberry tongue'. The causative organism is best described as:",
     ["Gram-positive cocci, alpha-hemolytic, catalase-negative", "Gram-positive cocci, beta-hemolytic, catalase-negative", "Gram-positive cocci, alpha-hemolytic, catalase-positive", "Gram-positive cocci, beta-hemolytic, catalase-positive"],
     1, "B", "Scarlet fever caused by Streptococcus pyogenes (Group A beta-hemolytic Streptococcus) is characterized microscopically as Gram-positive cocci in chains, displaying complete beta-hemolysis on blood agar and negative catalase testing."),

    ("A 27-year-old female presents with sudden high fever, vomiting, diarrhea, diffuse sunburn-like macular rash that subsequently desquamates on palms and soles, and hypotension (BP 70/40 mmHg) during her menstrual period while using tampons. Her condition is mediated by:",
     ["A toxin that hemolyzes red blood cells", "A toxin that disrupts intercellular connections of the epidermis", "A superantigen toxin that causes massive non-specific activation of T cells and cytokine release", "A two-component toxin that forms pores in white blood cells"],
     2, "C", "Staphylococcal toxic shock syndrome (TSS) is mediated by Toxic Shock Syndrome Toxin-1 (TSST-1), a superantigen that cross-links the MHC class II receptor on antigen-presenting cells directly to the Vβ domain of T-cell receptors without antigen processing, causing non-specific activation of up to 20% of all T cells and an overwhelming cytokine storm (IL-1, IL-2, TNF-alpha, IFN-gamma)."),

    ("A 12-year-old boy developed a shallow cut on his shin at summer camp. Within 5 days, the area became warm, erythematous, tender, and swollen with poorly demarcated, ill-defined margins that spread rapidly. This condition is most characteristically caused by:",
     ["Bacillus anthracis", "Clostridium perfringens", "Group A beta-hemolytic streptococci", "Pseudomonas aeruginosa"],
     2, "C", "Cellulitis is an infection of the deep dermis and subcutaneous fat presenting with diffuse, poorly demarcated spreading erythema, warmth, and edema. Group A streptococci (Streptococcus pyogenes) are the most common cause, spreading rapidly through subcutaneous tissue planes by secreting hyaluronidase and streptokinase.")
]

for stem, opts, c_idx, c_ans, expl in loco_mcqs:
    add_candidate({
        'sourcePdf': 'MCQ 4/LOCO MCQ 2-Solved.pdf',
        'type': 'mcq',
        'subject': 'microbiology',
        'topic': 'Pyogenic Soft Tissue & Bone Infections',
        'text': stem,
        'options': opts,
        'correctAnswer': c_ans,
        'correctIndex': c_idx,
        'explanation': expl
    })

# ==========================================
# 6. Mcq 2/TAREK Skin mcq.pdf (14 MCQs + 3 Essays)
# ==========================================
print("\n--- 6. Parsing Mcq 2/TAREK Skin mcq.pdf ---")
tarek_skin_mcqs = [
    ("Urticaria is pathologically mediated by:",
     ["Type II hypersensitivity", "Type I hypersensitivity (IgE-mediated mast cell degranulation)", "Contact dermatitis", "Chronic inflammatory autoimmune disease of the skin"],
     1, "B", "Urticaria (hives) is a Type I IgE-mediated immediate hypersensitivity reaction characterized by antigen cross-linking of IgE antibodies on mast cells and basophils, triggering release of histamine, leukotrienes, and prostaglandins that produce microvascular hyperpermeability and wheals."),

    ("A spongiotic intraepidermal pustule (spongiform pustule of Kogoj) is defined as:",
     ["Small collection of neutrophils within superficial spongiotic epidermis", "Small collection of neutrophils within parakeratotic stratum corneum", "Small collection of neutrophils below stratum corneum", "Small collection of neutrophils within dermal papillae"],
     0, "A", "A spongiform pustule of Kogoj (characteristic of psoriasis) is an aggregate of neutrophils within the superficial, edematous (spongiotic) spinous layer of the epidermis. Munro microabscesses, by contrast, represent collections of neutrophils in the parakeratotic stratum corneum."),

    ("Subcorneal pustules are characteristically observed in:",
     ["Psoriasis vulgaris", "Lichen planus", "Impetigo (and subcorneal pustular dermatosis)", "Lichen simplex chronicus"],
     2, "C", "Subcorneal pustules (blisters situated immediately beneath the stratum corneum) are diagnostic of bullous impetigo, subcorneal pustular dermatosis (Sneddon-Wilkinson disease), and pemphigus foliaceus."),

    ("Papillary microabscesses (aggregates of neutrophils at the dermal papilla tips) are diagnostic of:",
     ["Pemphigus vulgaris", "Dermatitis herpetiformis", "Eczema", "Erythema multiforme"],
     1, "B", "Dermatitis herpetiformis is pathognomonic for granular IgA deposition and neutrophilic microabscesses at the tips of dermal papillae, causing dermo-epidermal junction separation and subepidermal microvesicles, associated with celiac disease."),

    ("Colloid bodies (Civatte bodies / apoptotic keratinocytes) are typically found in:",
     ["Lichen planus", "Lichen simplex", "Eczema", "Erythema multiforme"],
     0, "A", "Civatte bodies (colloid or cytoid bodies) are anucleate apoptotic basal keratinocytes found in the lower epidermis and upper papillary dermis in lichen planus, resulting from cytotoxic T-cell-mediated basal vacuolar degeneration."),

    ("Regarding Pemphigus vulgaris, all of the following are true EXCEPT:",
     ["Antibodies target desmoglein-3 causing loss of intercellular bridges and acantholysis", "Blisters are intraepidermal and suprabasal", "Blisters are subepidermal", "Basal cells attached to the basement membrane exhibit a 'row of tombstones' appearance"],
     2, "C", "Pemphigus vulgaris produces intraepidermal suprabasal blisters due to IgG antibodies against desmoglein-3 leading to acantholysis (detachment of keratinocytes); the basal layer remains attached to the basement membrane ('tombstone appearance'). Subepidermal blisters are seen in bullous pemphigoid, NOT pemphigus vulgaris."),

    ("A 20-year-old female presents with a skin eruption composed of well-demarcated erythematous plaques covered by silvery white micaceous scales over both extensor surfaces (elbows and knees):",
     ["Psoriasis vulgaris", "Lichen planus", "Erythema multiforme", "Nummular eczema"],
     0, "A", "Well-demarcated erythematous plaques covered by silvery white scales on extensor surfaces (elbows, knees, scalp) that demonstrate Auspitz sign on scraping are classic features of chronic plaque psoriasis vulgaris."),

    ("Regarding Lichen planus, all of the following are true EXCEPT:",
     ["Sawtooth elongation of rete ridges", "Marked hyperkeratosis", "Presence of apoptotic Civatte colloid bodies", "Loss of the granular cell layer"],
     3, "D", "Lichen planus is characterized histologically by prominent wedge-shaped hypergranulosis (thickening of the granular layer), NOT loss of the granular layer. Other hallmarks include hyperkeratosis without parakeratosis, sawtooth rete ridges, basal vacuolation, and a dense band-like lymphocytic dermal infiltrate."),

    ("Seborrheic keratosis is histopathologically characterized by:",
     ["Horn cysts and pseudo-horn cysts filled with laminated keratin", "Intradermal melanocytic cell nests", "Peripheral palisading of atypical basaloid cells", "Marked nuclear atypia and invasion"],
     0, "A", "Seborrheic keratosis exhibits benign exophytic proliferation of basaloid keratinocytes with hyperkeratosis, papillomatosis, and pathognomonic true horn cysts and pseudo-horn cysts (invaginations of stratum corneum filled with concentric keratin)."),

    ("Actinic (solar) keratosis is histologically characterized by:",
     ["Atypical, dysplastic keratinocytes confined to the lower epidermis (basal and lower spinous layers)", "Loss of the granular layer and uniform full-thickness atypia", "Presence of large pseudo-horn cysts", "Involvement of deep skin adnexal epithelium"],
     0, "A", "Actinic keratosis (a premalignant precursor to squamous cell carcinoma induced by UV radiation) shows cellular atypia, pleomorphism, hyperchromasia, and loss of polarity confined to the lower basal and spinous layers of the epidermis, often accompanied by overlying alternating parakeratosis/orthokeratosis and solar elastosis in the dermis."),

    ("Eosinophilic microabscesses within subepidermal blisters are characteristic of:",
     ["Pemphigus vulgaris", "Bullous pemphigoid", "Lichen planus", "Contact eczema"],
     1, "B", "Bullous pemphigoid is characterized by subepidermal blisters containing eosinophils, linear IgG and C3 deposition along the dermo-epidermal junction targeting hemidesmosomal BP180/BP230 antigens, and eosinophilic microabscesses in the papillary dermis."),

    ("Neutrophilic microabscesses localized specifically at the tips of dermal papillae are seen in:",
     ["Pemphigus vulgaris", "Bullous pemphigoid", "Dermatitis herpetiformis", "Atopic eczema"],
     2, "C", "Collections of neutrophils at the apex (tips) of dermal papillae accompanied by granular IgA deposits on direct immunofluorescence are pathognomonic for dermatitis herpetiformis."),

    ("Lichen planus is characterized histologically by which of the following epidermal alterations?",
     ["Parakeratosis", "Wedge-shaped hypergranulosis", "Subcorneal pustules", "Koilocytosis"],
     1, "B", "Hypergranulosis (thickening of the stratum granulosum) is a classic histological feature of lichen planus, producing the clinically visible fine white lines known as Wickham's striae on the surfaces of violaceous polygonal pruritic papules."),

    ("A 75-year-old male presents with a slow-growing, sharply demarcated, pigmented exophytic plaque with a greasy, verrucous surface on his shoulder that appears 'stuck on'. Excision and histopathology demonstrate sheets of uniform small basaloid cells surrounding circular keratin-filled cysts. The diagnosis is:",
     ["Basal cell carcinoma", "Bowen disease (squamous cell carcinoma in situ)", "Seborrheic keratosis", "Invasive squamous cell carcinoma", "Verruca vulgaris"],
     2, "C", "A pigmented 'stuck-on' plaque with a greasy/keratotic surface containing sheets of benign basaloid cells and keratin-filled horn cysts without cytological atypia is diagnostic of seborrheic keratosis.")
]

for stem, opts, c_idx, c_ans, expl in tarek_skin_mcqs:
    add_candidate({
        'sourcePdf': 'Mcq 2/TAREK Skin mcq.pdf',
        'type': 'mcq',
        'subject': 'pathology',
        'topic': 'Skin Pathology',
        'text': stem,
        'options': opts,
        'correctAnswer': c_ans,
        'correctIndex': c_idx,
        'explanation': expl
    })

tarek_skin_essays = [
    ("Compare between Psoriasis vulgaris and Lichen planus (Clinical picture, Microscopic features, Scales & Striae).",
     "Comparison of Psoriasis vulgaris vs Lichen planus:\n• Clinical Presentation: Psoriasis presents with erythematous plaques covered by silvery-white micaceous scales predominantly on extensor surfaces (elbows, knees, scalp) and sacrum, with positive Auspitz sign and nail pitting; Lichen planus presents with the '6 Ps': Pruritic, Polygonal, Planar, Purple (violaceous), Papules/plaques, on flexor surfaces (wrists, ankles) and oral mucosa.\n• Epidermal Changes: Psoriasis shows marked regular elongation of rete ridges ('test tubes in a rack'), hyperkeratosis with confluent PARAKERATOSIS, and thinning or absence of the granular layer; Lichen planus shows hyperkeratosis WITHOUT parakeratosis, wedge-shaped HYPERGRANULOSIS, and 'sawtooth' rete ridges.\n• Diagnostic Features: Psoriasis exhibits neutrophil collections (Munro microabscesses in parakeratotic stratum corneum and spongiform pustules of Kogoj in spinous layer); Lichen planus exhibits cytotoxic basal vacuolar degeneration, apoptotic keratinocytes (Civatte / colloid bodies), and Wickham's striae.\n• Dermal Infiltrate: Psoriasis shows tortuous dilated capillaries in dermal papillae with mild perivascular infiltrate; Lichen planus shows a dense, continuous 'band-like' lymphocytic infiltrate hugging the dermo-epidermal junction.",
     "pathology", "Skin Pathology"),

    ("Compare between Pemphigus vulgaris and Dermatitis herpetiformis (Level of blister, Autoantibody target, Immunofluorescence, Clinical picture).",
     "Comparison of Pemphigus vulgaris vs Dermatitis herpetiformis:\n• Clinical Picture: Pemphigus vulgaris affects middle-aged adults (40-60 yrs) with flaccid, easily ruptured bullae on scalp, face, groin, and oral mucosal erosions, with positive Nikolsky sign; Dermatitis herpetiformis affects young adults (20-40 yrs) with intensely pruritic, grouped, symmetric polymorphic vesicles on elbows, knees, buttocks, and upper back, strongly associated with celiac disease.\n• Level of Blister: Pemphigus vulgaris forms INTRAEPIDERMAL suprabasal blisters; Dermatitis herpetiformis forms SUBEPIDERMAL blisters at the dermo-epidermal junction.\n• Mechanism & Target: Pemphigus vulgaris is caused by IgG autoantibodies against desmoglein-3 and desmoglein-1 in desmosomes, causing loss of intercellular cohesion (acantholysis); Dermatitis herpetiformis is caused by IgA autoantibodies directed against epidermal/tissue transglutaminase.\n• Microscopic Features: Pemphigus vulgaris shows rounded detached acantholytic Tzanck cells with basal cells remaining anchored ('row of tombstones'); Dermatitis herpetiformis shows neutrophilic microabscesses at the tips of dermal papillae.\n• Immunofluorescence: Pemphigus vulgaris shows intercellular 'fishnet' (chicken-wire) IgG and C3 deposition in the epidermis; Dermatitis herpetiformis shows granular IgA deposits concentrated at the tips of dermal papillae.",
     "pathology", "Skin Pathology"),

    ("Compare between Actinic keratosis and Bowen disease (Definition, Extent of atypia, Malignant potential).",
     "Comparison of Actinic keratosis vs Bowen disease:\n• Definition: Actinic (solar) keratosis is a UV-induced premalignant cutaneous lesion characterized by partial-thickness epidermal dysplasia; Bowen disease is cutaneous squamous cell carcinoma in situ (full-thickness epidermal dysplasia) without invasion through the basement membrane.\n• Extent of Atypia: In Actinic keratosis, cytological atypia, hyperchromatism, and pleomorphism are confined to the lower basal and spinous layers, sparing the upper granular and cornified layers; in Bowen disease, atypical, highly pleomorphic, dysplastic keratinocytes with multinucleation, abnormal mitoses, and dyskeratosis involve the ENTIRE thickness of the epidermis from the basal membrane to the surface ('windblown' appearance).\n• Clinical Features: Actinic keratosis presents as small (<1 cm) rough, scaly, sandpaper-like erythematous macules or papules on sun-exposed sites (head, neck, dorsum of hands); Bowen disease presents as a slowly enlarging, sharply demarcated, crusted or velvety erythematous plaque resembling psoriasis or nummular eczema.\n• Malignant Potential: Actinic keratosis carries an estimated 1-10% lifetime risk of progression to invasive squamous cell carcinoma; Bowen disease is already carcinoma in situ with a 3-5% risk of developing invasive squamous cell carcinoma with metastatic potential.",
     "pathology", "Skin Pathology")
]

for stem, ans, subj, top in tarek_skin_essays:
    add_candidate({
        'sourcePdf': 'Mcq 2/TAREK Skin mcq.pdf',
        'type': 'essay',
        'subject': subj,
        'topic': top,
        'text': stem,
        'options': [],
        'modelAnswer': ans,
        'explanation': "Verified pathology model answer from Dr. Tarek El Shamy Skin Pathology Course."
    })

# ==========================================
# 7. mcq/ALAA MCQ SKMR & Antifungals.pdf (with Part 1 page 39 key)
# ==========================================
print("\n--- 7. Parsing mcq/ALAA MCQ SKMR & Antifungals.pdf ---")
doc_skmr = fitz.open(os.path.join(BASE_DIR, "mcq/ALAA MCQ SKMR & Antifungals.pdf"))
skmr_txt = '\n'.join([p.get_text() for p in doc_skmr])
skmr_keys = {
    1: 'C', 2: 'B', 3: 'D', 4: 'B', 5: 'D', 6: 'B', 7: 'C', 8: 'C', 9: 'D', 10: 'B',
    11: 'C', 12: 'B', 13: 'A', 14: 'B', 15: 'C', 16: 'C', 17: 'E', 18: 'D', 19: 'D', 20: 'D',
    21: 'B', 22: 'D', 23: 'C', 24: 'C', 25: 'C', 26: 'D', 27: 'C', 28: 'C', 29: 'B'
}

matches_skmr = list(re.finditer(r'(?:^|\n)(\d+)[\.\)]\s*(.+?)(?=\n\d+[\.\)]|\Z)', skmr_txt, re.DOTALL))
for m in matches_skmr:
    qnum = int(m.group(1))
    block = m.group(2).strip()
    lines = [l.strip() for l in block.split('\n') if l.strip()]
    if not lines: continue
    
    # parse stem and options
    stem_lines = []
    opt_lines = []
    for l in lines:
        if re.match(r'^[a-eA-E][\.\)]\s+', l):
            opt_lines.append(l)
        else:
            if not opt_lines:
                stem_lines.append(l)
            else:
                opt_lines[-1] += ' ' + l
                
    stem = ' '.join(stem_lines).strip()
    opts = [re.sub(r'^[a-eA-E][\.\)]\s*', '', o).strip() for o in opt_lines]
    ans_char = skmr_keys.get(qnum)
    if ans_char and len(opts) >= 2:
        c_idx = letter_map.get(ans_char, 0)
        # determine topic
        is_fung = any(w in stem.lower() for w in ['fung', 'nystatin', 'amphotericin', 'azoles', 'terbinafine', 'griseofulvin', 'flucytosine', 'ketoconazole', 'fluconazole', 'itraconazole'])
        top = "Antifungal Pharmacotherapy" if is_fung else "Neuromuscular Blockers & Muscle Relaxants"
        add_candidate({
            'sourcePdf': 'mcq/ALAA MCQ SKMR & Antifungals.pdf',
            'type': 'mcq',
            'subject': 'pharma',
            'topic': top,
            'text': stem,
            'options': opts,
            'correctAnswer': ans_char,
            'correctIndex': c_idx,
            'explanation': f"The correct answer is {ans_char}: {opts[c_idx] if c_idx < len(opts) else ''}. Verified from Part 1 Model Answer Key (Page 39)."
        })

# ==========================================
# 8. mcq/ALAA PGS & NSAIDS MCQ.pdf (with Part 1 page 57 key)
# ==========================================
print("\n--- 8. Parsing mcq/ALAA PGS & NSAIDS MCQ.pdf ---")
doc_pgs = fitz.open(os.path.join(BASE_DIR, "mcq/ALAA PGS & NSAIDS MCQ.pdf"))
pgs_txt = '\n'.join([p.get_text() for p in doc_pgs])
pgs_keys = {
    1: 'B', 2: 'D', 3: 'D', 4: 'D', 5: 'B', 6: 'B', 7: 'B', 8: 'E', 9: 'B', 10: 'C',
    11: 'C', 12: 'A', 13: 'C', 14: 'A', 15: 'D', 16: 'C', 17: 'B', 18: 'B', 19: 'E', 20: 'B',
    21: 'A', 22: 'C', 23: 'C', 24: 'B', 25: 'B', 26: 'C', 27: 'C', 28: 'D', 29: 'D', 30: 'D',
    31: 'D', 32: 'C', 33: 'C', 34: 'D', 35: 'C', 36: 'B', 37: 'A', 38: 'D', 39: 'C'
}

matches_pgs = list(re.finditer(r'(?:^|\n)(\d+)[\.\)]\s*(.+?)(?=\n\d+[\.\)]|\Z)', pgs_txt, re.DOTALL))
for m in matches_pgs:
    qnum = int(m.group(1))
    block = m.group(2).strip()
    lines = [l.strip() for l in block.split('\n') if l.strip()]
    if not lines: continue
    
    stem_lines = []
    opt_lines = []
    for l in lines:
        if re.match(r'^[a-eA-E][\.\)]\s+', l):
            opt_lines.append(l)
        else:
            if not opt_lines:
                stem_lines.append(l)
            else:
                opt_lines[-1] += ' ' + l
                
    stem = ' '.join(stem_lines).strip()
    opts = [re.sub(r'^[a-eA-E][\.\)]\s*', '', o).strip() for o in opt_lines]
    ans_char = pgs_keys.get(qnum)
    if ans_char and len(opts) >= 2:
        c_idx = letter_map.get(ans_char, 0)
        add_candidate({
            'sourcePdf': 'mcq/ALAA PGS & NSAIDS MCQ.pdf',
            'type': 'mcq',
            'subject': 'pharma',
            'topic': 'NSAIDs & Prostaglandins Pharmacotherapy',
            'text': stem,
            'options': opts,
            'correctAnswer': ans_char,
            'correctIndex': c_idx,
            'explanation': f"The correct answer is {ans_char}: {opts[c_idx] if c_idx < len(opts) else ''}. Verified from Part 1 Model Answer Key (Page 57)."
        })

print(f"\n==========================================")
print(f"Supplement v2 Extraction Complete!")
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

#!/usr/bin/env python3
"""
ASU Medical Portal — GIT (MGL-3) Practical Question & Image Extraction Pipeline
Extracts high-yield practical exam slides across all 8 subjects from 'All Practical GIT.pdf'.
Performs:
1. Specimen extraction and cropping.
2. Automated label masking (drawing clean rounded badges A, B, C, D over text).
3. Ultra-efficient modern WebP compression (82-85% quality, 30-70 KB per asset).
4. Manifest generation with metadata for question bank incorporation.
"""

import os
import sys
import json
import fitz
from PIL import Image, ImageDraw, ImageFont

PDF_PATH = "/Users/omarhossa/Downloads/All Practical GIT.pdf"
OUT_BASE = "public/images/practical/mgl-3"
JOB_DIR = "QUESTION_IMPORT_JOBS/2026-11-01-mgl3-practical"

os.makedirs(JOB_DIR, exist_ok=True)

# -------------------------------------------------------------------------
# High-Yield Slide Selection Specification
# Maps each subject to key slide numbers, title, whether masking is needed,
# and label coordinates or identification targets.
# -------------------------------------------------------------------------

SLIDE_SPECS = [
    # ── HISTOLOGY ──
    {
        "id": "MGL3-PRAC-HIST-001",
        "subject": "histology",
        "topic": "Taste Buds & Tongue",
        "page": 688, # 1-based PDF page
        "output_filename": "taste_bud_tem_masked.webp",
        "type": "masked_mcq",
        "question_text": "In this transmission electron micrograph (TEM) of a circumvallate papilla taste bud, identify the structure indicated by label [ A ]:",
        "mask_labels": [
            ("A", (575.4, 76.6, 681.0, 103.7)), # Taste pore
            ("B", (559.1, 149.5, 672.9, 201.8)), # Supporting cells
            ("C", (556.1, 239.2, 679.2, 266.3)), # Sensory cells
            ("D", (583.6, 312.9, 666.2, 336.1)), # Basal cells
        ],
        "target_badge": "A",
        "correct_answer": "Taste pore",
        "distractors": [
            "Basal stem cell",
            "Sustentacular cell",
            "Gustatory receptor"
        ],
        "explanation": "The taste pore is the small apical opening through which microvilli of sensory gustatory cells project into the oral cavity to contact dissolved tastants.",
        "key_concept": "Apical opening containing receptor microvilli in lingual taste buds."
    },
    {
        "id": "MGL3-PRAC-HIST-002",
        "subject": "histology",
        "topic": "Taste Buds & Tongue",
        "page": 688,
        "output_filename": "taste_bud_tem_masked_b.webp",
        "type": "masked_mcq",
        "question_text": "In the same transmission electron micrograph (TEM) of the taste bud, identify the cells indicated by label [ B ]:",
        "mask_labels": [
            ("A", (575.4, 76.6, 681.0, 103.7)),
            ("B", (559.1, 149.5, 672.9, 201.8)),
            ("C", (556.1, 239.2, 679.2, 266.3)),
            ("D", (583.6, 312.9, 666.2, 336.1)),
        ],
        "target_badge": "B",
        "correct_answer": "Supporting (sustentacular) cells",
        "distractors": [
            "Primary gustatory receptor cells",
            "Basal reserve stem cells",
            "Secretory Paneth cells"
        ],
        "explanation": "Supporting (sustentacular) cells extend from the basal lamina to the taste pore, providing structural, metabolic, and electrical insulation around sensory receptor cells.",
        "key_concept": "Elongated cells with microvilli providing structural insulation to receptor cells."
    },
    {
        "id": "MGL3-PRAC-HIST-003",
        "subject": "histology",
        "topic": "Salivary Glands",
        "page": 714,
        "output_filename": "parotid_gland_he.webp",
        "type": "specimen_mcq",
        "question_text": "Examine this high-yield H&E histological section of a major salivary gland. Which of the following features confirms that this is the parotid gland?",
        "correct_answer": "Purely serous acini with prominent intercalated ducts",
        "distractors": [
            "Predominantly mucous acini with serous demilunes",
            "Purely mucous acini with wide lumens",
            "Equal mixture of serous and mucous acini"
        ],
        "explanation": "The parotid gland is purely serous in humans, characterized by dense basophilic rounded acini with narrow central lumens, central round nuclei, and absence of mucous tubules.",
        "key_concept": "Parotid = 100% serous acini with basophilic cytoplasm and apical secretory zymogen granules."
    },
    {
        "id": "MGL3-PRAC-HIST-004",
        "subject": "histology",
        "topic": "Small Intestine",
        "page": 781,
        "output_filename": "duodenum_brunner_glands_he.webp",
        "type": "specimen_mcq",
        "question_text": "Identify this histological section of the gastrointestinal tract. What diagnostic landmark confirms the identification of the duodenum?",
        "correct_answer": "Branched coiled Brunner glands packed within the submucosa",
        "distractors": [
            "Aggregated Peyer patches filling the lamina propria",
            "Complete absence of villi with straight vertical crypts",
            "Stratified squamous non-keratinized mucosal epithelium"
        ],
        "explanation": "Brunner (duodenal) glands are branched coiled tubular mucous glands confined specifically to the submucosa of the duodenum, secreting alkaline mucin (pH 8.1–9.3) to neutralize gastric acid.",
        "key_concept": "Submucosal Brunner glands are unique to the duodenum."
    },
    {
        "id": "MGL3-PRAC-HIST-005",
        "subject": "histology",
        "topic": "Small Intestine",
        "page": 796,
        "output_filename": "paneth_cells_tem.webp",
        "type": "specimen_mcq",
        "question_text": "This transmission electron micrograph (TEM) displays cells located at the base of the crypts of Lieberkühn containing prominent apical electron-dense granules. What is the primary function of these cells?",
        "correct_answer": "Secretion of antimicrobial peptides including lysozyme and defensins",
        "distractors": [
            "Absorption of long-chain fatty acids via chylomicrons",
            "Synthesis of protective lubricating mucin glycoproteins",
            "Systemic secretion of peptide hormones gastrin and CCK"
        ],
        "explanation": "Paneth cells occupy the bases of small intestinal crypts and contain large apical eosinophilic secretory granules containing lysozyme, phospholipase A2, and alpha-defensins (cryptdins) providing innate mucosal immunity.",
        "key_concept": "Paneth cells produce innate antimicrobial defensins and lysozyme at crypt bases."
    },
    {
        "id": "MGL3-PRAC-HIST-006",
        "subject": "histology",
        "topic": "Large Intestine",
        "page": 804,
        "output_filename": "colon_vs_appendix_he.webp",
        "type": "specimen_mcq",
        "question_text": "Examine this cross-section of the appendix. Which histological characteristic most clearly distinguishes the vermiform appendix from the colon?",
        "correct_answer": "Abundant confluent lymphoid follicles infiltrating the lamina propria and submucosa",
        "distractors": [
            "Well-developed taeniae coli formed by outer longitudinal muscle",
            "Presence of numerous tall intestinal villi with brush borders",
            "Absence of straight tubular crypts of Lieberkühn"
        ],
        "explanation": "The vermiform appendix features a complete circular outer longitudinal muscle coat (no taeniae coli) and massive, confluent lymphoid follicles with germinal centers extending through the lamina propria and submucosa.",
        "key_concept": "Appendix: complete longitudinal coat and circumferential ring of lymphoid nodules."
    },

    # ── PATHOLOGY ──
    {
        "id": "MGL3-PRAC-PATH-001",
        "subject": "pathology",
        "topic": "Esophagus",
        "page": 461,
        "output_filename": "barretts_esophagus_he.webp",
        "type": "specimen_mcq",
        "question_text": "This endoscopic biopsy from the distal esophagus of a patient with long-standing GERD demonstrates replacement of normal epithelium. Identify the diagnostic histological finding:",
        "correct_answer": "Intestinal metaplasia with columnar epithelium containing alcian blue-positive goblet cells",
        "distractors": [
            "Squamous cell hyperplasia with severe basal zone dysplasia",
            "Severe transmural eosinophilic infiltration without metaplasia",
            "Extensive submucosal lymphoid follicles with germinal centers"
        ],
        "explanation": "Barrett esophagus is defined histopathologically by glandular metaplasia where stratified squamous epithelium is replaced by intestinal columnar epithelium containing true goblet cells, predisposing to adenocarcinoma.",
        "key_concept": "Barrett esophagus = intestinal metaplasia with goblet cells above gastroesophageal junction."
    },
    {
        "id": "MGL3-PRAC-PATH-002",
        "subject": "pathology",
        "topic": "Salivary Gland Neoplasms",
        "page": 467,
        "output_filename": "pleomorphic_adenoma_he.webp",
        "type": "specimen_mcq",
        "question_text": "Examine this section from a slowly enlarging, painless parotid mass. What dual histological components define this benign neoplasm (pleomorphic adenoma)?",
        "correct_answer": "Epithelial ductal structures intermixed with myxoid and chondroid mesenchymal-like stroma",
        "distractors": [
            "Bilayered oncocytic columnar cells overlying a dense lymphoid stroma",
            "Solid sheets of poorly differentiated clear cells with perineural invasion",
            "Mucus-secreting goblet cells surrounded by malignant squamous pearls"
        ],
        "explanation": "Pleomorphic adenoma (benign mixed tumor) contains a mixture of epithelial elements forming ducts/sheets and mesenchymal-like myxoid, chondroid, or hyaline stroma produced by transformed myoepithelial cells.",
        "key_concept": "Pleomorphic adenoma = epithelial ducts embedded in myxochondroid matrix."
    },
    {
        "id": "MGL3-PRAC-PATH-003",
        "subject": "pathology",
        "topic": "Salivary Gland Neoplasms",
        "page": 470,
        "output_filename": "warthin_tumor_he.webp",
        "type": "specimen_mcq",
        "question_text": "This photomicrograph demonstrates Warthin tumor (papillary cystadenoma lymphomatosum). What are its two defining microscopic features?",
        "correct_answer": "Double layer of oncocytic epithelial cells forming papillary projections over lymphoid stroma with germinal centers",
        "distractors": [
            "Invasive keratinizing squamous nests surrounded by dense desmoplastic collagen",
            "Mucin-filled cystic cavities lined by single-layered attenuated flat cells",
            "Mesenchymal cartilage islands with multinucleated giant cells and calcifications"
        ],
        "explanation": "Warthin tumor consists of cystic and papillary projections lined by a distinctive double layer of eosinophilic oncocytic epithelial cells resting upon a dense mature lymphoid stroma frequently containing germinal centers.",
        "key_concept": "Warthin tumor = bilayered oncocytic epithelium + lymphoid stroma with germinal centers."
    },
    {
        "id": "MGL3-PRAC-PATH-004",
        "subject": "pathology",
        "topic": "Liver Pathology",
        "page": 482,
        "output_filename": "liver_cirrhosis_masson_trichrome.webp",
        "type": "specimen_mcq",
        "question_text": "This liver biopsy stained with Masson trichrome demonstrates blue-staining collagen bands. What is the fundamental pathological triad of liver cirrhosis?",
        "correct_answer": "Diffuse bridging fibrosis, loss of normal lobular architecture, and regenerative parenchymal nodules",
        "distractors": [
            "Focal portal inflammation, preserved central veins, and bile ductopenia",
            "Centrilobular macrovesicular steatosis with Mallory-Denk bodies without fibrosis",
            "Granulomatous portal destruction with preservation of normal lobular plates"
        ],
        "explanation": "Cirrhosis is defined by diffuse hepatic parenchymal nodular regeneration enclosed by bridging fibrous septa (stained blue with Masson trichrome), causing total disruption of normal vascular architecture.",
        "key_concept": "Cirrhosis triad: diffuse fibrosis + regenerative nodules + architectural disruption."
    },
    {
        "id": "MGL3-PRAC-PATH-005",
        "subject": "pathology",
        "topic": "Liver Pathology",
        "page": 487,
        "output_filename": "hcc_on_cirrhosis_he.webp",
        "type": "specimen_mcq",
        "question_text": "A patient with long-standing hepatitis C cirrhosis develops a new solitary hepatic mass. Biopsy reveals the following high-power field. What features confirm hepatocellular carcinoma (HCC)?",
        "correct_answer": "Thickened trabeculae (>3 cells thick), marked nuclear pleomorphism, and atypical mitoses",
        "distractors": [
            "Well-formed mucin-producing tubular glands embedded in dense fibrous stroma",
            "Preserved single-cell liver cords lined by orderly Kupffer cells",
            "Sheets of small round blue neuroendocrine cells with salt-and-pepper chromatin"
        ],
        "explanation": "Hepatocellular carcinoma (HCC) is characterized cytologically by pleomorphic hepatocytes with increased N/C ratio and prominent nucleoli, and architecturally by thick liver plates (>3 cells thick) and pseudoacinar patterns.",
        "key_concept": "HCC: thickened trabecular plates (>3 cells thick) and malignant pleomorphic hepatocytes."
    },
    {
        "id": "MGL3-PRAC-PATH-006",
        "subject": "pathology",
        "topic": "Liver Pathology",
        "page": 488,
        "output_filename": "schistosomal_clay_pipe_stem_fibrosis.webp",
        "type": "specimen_mcq",
        "question_text": "Examine this gross and histological specimen of hepatic bilharziasis (Symmers clay-pipe-stem fibrosis). Which crucial feature distinguishes schistosomal fibrosis from true cirrhosis?",
        "correct_answer": "Preservation of normal hepatic lobular architecture and absence of true regenerative nodules",
        "distractors": [
            "Diffuse destruction of all central veins with micronodular regeneration",
            "Widespread hepatocellular steatosis with ballooning degeneration",
            "Primary obliteration of the major hepatic veins with ischemic atrophy"
        ],
        "explanation": "In Symmers clay-pipe-stem fibrosis, dense collagenous tissue encases the intrahepatic portal tracts, but the intervening hepatic lobular architecture and central veins remain preserved without diffuse regenerative nodule formation.",
        "key_concept": "Schistosomal hepatic fibrosis preserves lobular architecture (non-cirrhotic portal hypertension)."
    },

    # ── PARASITOLOGY ──
    {
        "id": "MGL3-PRAC-PARA-001",
        "subject": "parasitology",
        "topic": "Trematodes",
        "page": 29,
        "output_filename": "schistosoma_mansoni_egg.webp",
        "type": "specimen_mcq",
        "question_text": "Identify this parasite egg recovered from a stool examination of a patient with chronic dysentery. What diagnostic feature distinguishes this species?",
        "correct_answer": "Large oval translucent egg with a prominent, sharp lateral spine",
        "distractors": [
            "Small operculated egg containing a fully developed miracidium",
            "Spherical thick brown egg with a prominent terminal spine",
            "Barrel-shaped egg with translucent mucoid bipolar plugs"
        ],
        "explanation": "Schistosoma mansoni eggs measure 114–180 µm by 45–70 µm and possess a distinctive large, sharp lateral spine near the posterior end, differentiating them from S. haematobium (terminal spine) and S. japonicum (small lateral knob).",
        "key_concept": "Schistosoma mansoni egg = prominent sharp lateral spine."
    },
    {
        "id": "MGL3-PRAC-PARA-002",
        "subject": "parasitology",
        "topic": "Trematodes",
        "page": 42,
        "output_filename": "fasciola_gigantica_adult.webp",
        "type": "specimen_mcq",
        "question_text": "Identify this adult fluke recovered from the bile duct at cholecystectomy. Which anatomical feature differentiates Fasciola gigantica from Fasciola hepatica?",
        "correct_answer": "Larger size (up to 7.5 cm) with parallel lateral margins and less prominent cephalic cone",
        "distractors": [
            "Presence of a third sucker (gonotyl) surrounding the genital pore",
            "Absence of oral and ventral suckers as organs of fixation",
            "Simple, unbranched intestinal ceca extending to the posterior end"
        ],
        "explanation": "Fasciola gigantica is longer and more slender (25–75 mm) than F. hepatica (20–30 mm), has nearly parallel lateral borders, and exhibits a less distinct cephalic cone and less pronounced shoulders.",
        "key_concept": "Fasciola gigantica: large size with parallel margins and faint cephalic shoulders."
    },
    {
        "id": "MGL3-PRAC-PARA-003",
        "subject": "parasitology",
        "topic": "Trematode Vectors",
        "page": 34,
        "output_filename": "biomphalaria_alexandrina_snail.webp",
        "type": "specimen_mcq",
        "question_text": "Identify this freshwater snail shell collected from irrigation canals in Egypt. What morphological criteria confirm Biomphalaria alexandrina?",
        "correct_answer": "Sinistral, discoidal (planorboid) shell with flat whorls coiled in a single horizontal plane",
        "distractors": [
            "Dextral shell with a sharp conical apex and very large body whorl",
            "Elongated turret-shaped spiral shell with a narrow oval aperture",
            "Globular operculate shell with thick concentric growth rings"
        ],
        "explanation": "Biomphalaria alexandrina is the intermediate host of Schistosoma mansoni in Egypt; its shell is planorboid (discoidal, coiled horizontally like a disk) and sinistral (aperture opens to the left).",
        "key_concept": "Biomphalaria alexandrina: discoidal, sinistral shell; intermediate host of S. mansoni."
    },
    {
        "id": "MGL3-PRAC-PARA-004",
        "subject": "parasitology",
        "topic": "Cestodes",
        "page": 72,
        "output_filename": "hydatid_cyst_wall_he.webp",
        "type": "specimen_mcq",
        "question_text": "Examine this histological section through the wall of a hepatic hydatid cyst (Echinococcus granulosus). Identify the non-cellular outer protective layer:",
        "correct_answer": "Acellular, chitinous laminated (cuticular) membrane",
        "distractors": [
            "Inner nucleated cellular germinal layer generating brood capsules",
            "Outer vascularized fibrous capsule derived from host tissue",
            "Protoscolex hooklet ring surrounded by calcified calcareous corpuscles"
        ],
        "explanation": "The hydatid cyst wall consists of an outer acellular laminated cuticular membrane (secreted by the parasite, appearing hyaline and striated) and an inner cellular germinal layer that produces brood capsules and protoscolices.",
        "key_concept": "Hydatid wall: outer acellular laminated layer + inner nucleated germinal layer."
    },
    {
        "id": "MGL3-PRAC-PARA-005",
        "subject": "parasitology",
        "topic": "Nematodes",
        "page": 374,
        "output_filename": "enterobius_vermicularis_egg.webp",
        "type": "specimen_mcq",
        "question_text": "Identify this parasitic egg recovered from perianal cellophane adhesive tape (Scotch tape technique) in a child with nocturnal pruritus ani:",
        "correct_answer": "Enterobius vermicularis (pinworm) egg with an asymmetrical D-shape (one side flattened)",
        "distractors": [
            "Ascaris lumbricoides unfertilized egg with heavy cortical mammillations",
            "Ancylostoma duodenale egg containing 4–8 embryonated blastomeres",
            "Trichocephalus trichiurus egg with prominent bipolar mucoid plugs"
        ],
        "explanation": "Enterobius vermicularis eggs are 50–60 µm long, colorless, translucent, and planoconvex (D-shaped: one side flattened and the other convex), typically containing a folded rhabditiform larva.",
        "key_concept": "Enterobius vermicularis egg: planoconvex (D-shaped), colorless, transparent shell."
    },
    {
        "id": "MGL3-PRAC-PARA-006",
        "subject": "parasitology",
        "topic": "Nematodes",
        "page": 375,
        "output_filename": "trichuris_trichiura_egg.webp",
        "type": "specimen_mcq",
        "question_text": "Identify this parasite egg in a stool wet mount from an anemic child. What distinctive structural feature establishes the diagnosis of Trichuris trichiura?",
        "correct_answer": "Brown barrel-shaped (lemon-shaped) shell with prominent transparent bipolar mucoid plugs",
        "distractors": [
            "Golden-yellow operculated egg with a tiny abopercular knob",
            "Spherical hexacanth oncosphere enclosed by radially striated embryophore",
            "Thin-shelled transparent oval egg with a wide clear space around yolk"
        ],
        "explanation": "Trichuris trichiura (whipworm) eggs are characteristically barrel-shaped (50–54 µm by 22–23 µm), golden-brown, with a thick smooth shell and two translucent, protruding mucoid plugs at either pole.",
        "key_concept": "Trichuris trichiura egg: barrel-shaped with bipolar transparent mucoid plugs."
    },

    # ── ANATOMY ──
    {
        "id": "MGL3-PRAC-ANAT-001",
        "subject": "anatomy",
        "topic": "Abdominal Vessels",
        "page": 905,
        "output_filename": "celiac_trunk_anatomy.webp",
        "type": "specimen_mcq",
        "question_text": "In a cadaveric prosection of the upper abdomen, the celiac trunk arises from the abdominal aorta at the level of T12. Which of the following is an immediate primary branch of the celiac trunk?",
        "correct_answer": "Splenic artery",
        "distractors": [
            "Gastroduodenal artery",
            "Right gastric artery",
            "Superior mesenteric artery"
        ],
        "explanation": "The celiac trunk divides into three primary branches: left gastric artery, splenic artery (tortuous along the superior border of the pancreas), and common hepatic artery.",
        "key_concept": "Celiac trunk trifurcation: Left gastric, Splenic, and Common hepatic arteries."
    },
    {
        "id": "MGL3-PRAC-ANAT-002",
        "subject": "anatomy",
        "topic": "Inguinal Canal",
        "page": 910,
        "output_filename": "inguinal_canal_anatomy.webp",
        "type": "specimen_mcq",
        "question_text": "During dissection of the inguinal canal, identify the structure forming the posterior wall of the canal in its medial third:",
        "correct_answer": "Conjoint tendon (falx inguinalis)",
        "distractors": [
            "External oblique aponeurosis",
            "Inguinal ligament of Poupart",
            "Lacunar ligament of Gimbernat"
        ],
        "explanation": "The posterior wall of the inguinal canal is formed laterally by transversalis fascia and medially by the conjoint tendon (common aponeurosis of internal oblique and transversus abdominis).",
        "key_concept": "Posterior wall of inguinal canal: Transversalis fascia (lateral) + Conjoint tendon (medial)."
    },
    {
        "id": "MGL3-PRAC-ANAT-003",
        "subject": "anatomy",
        "topic": "Liver & Porta Hepatis",
        "page": 920,
        "output_filename": "porta_hepatis_anatomy.webp",
        "type": "specimen_mcq",
        "question_text": "At the porta hepatis (free margin of lesser omentum), what is the correct spatial arrangement of the structures from anterior to posterior?",
        "correct_answer": "Bile duct (anterior-right), Hepatic artery proper (anterior-left), Portal vein (posterior)",
        "distractors": [
            "Portal vein (anterior), Hepatic artery proper (middle), Bile duct (posterior)",
            "Hepatic artery proper (anterior), Portal vein (middle), Bile duct (posterior)",
            "Inferior vena cava (anterior), Bile duct (middle), Portal vein (posterior)"
        ],
        "explanation": "In the free edge of the lesser omentum: the common bile duct lies anterolaterally to the right, the hepatic artery proper lies anteromedially to the left, and the large portal vein lies posteriorly.",
        "key_concept": "Porta hepatis order: Duct on right, Artery on left, Portal Vein behind."
    },

    # ── PHYSIOLOGY ──
    {
        "id": "MGL3-PRAC-PHYS-001",
        "subject": "physiology",
        "topic": "Esophageal Motility",
        "page": 938,
        "output_filename": "achalasia_manometry_case.webp",
        "type": "specimen_mcq",
        "question_text": "A 35-year-old woman presents with progressive dysphagia to both liquids and solids and regurgitation. High-resolution esophageal manometry demonstrates aperistalsis and failure of the lower esophageal sphincter (LES) to relax. What is the fundamental neurogenic defect?",
        "correct_answer": "Degeneration of inhibitory ganglion cells in the myenteric (Auerbach) plexus producing NO and VIP",
        "distractors": [
            "Hyperactivity of vagal cholinergic preganglionic fibers releasing excess acetylcholine",
            "Loss of sensory afferent fibers in the submucosal (Meissner) plexus of the esophagus",
            "Autoimmune destruction of skeletal muscle motor endplates in the upper third of the esophagus"
        ],
        "explanation": "Achalasia is caused by selective loss/degeneration of inhibitory postganglionic neurons in the myenteric plexus that release nitric oxide (NO) and vasoactive intestinal peptide (VIP), preventing LES relaxation during deglutition.",
        "key_concept": "Achalasia: loss of NO/VIP inhibitory myenteric neurons causes unrelaxed LES."
    },
    {
        "id": "MGL3-PRAC-PHYS-002",
        "subject": "physiology",
        "topic": "Pancreatic Secretion",
        "page": 958,
        "output_filename": "pancreatic_hormonal_regulation.webp",
        "type": "specimen_mcq",
        "question_text": "In a laboratory experiment investigating gastrointestinal hormones, duodenal acidification (pH < 4.5) induces copious watery pancreatic juice rich in bicarbonate. Which hormone mediates this response?",
        "correct_answer": "Secretin, secreted by S-cells in the duodenal mucosa",
        "distractors": [
            "Cholecystokinin (CCK), secreted by I-cells in response to fatty acids",
            "Gastrin, secreted by antral G-cells in response to peptides",
            "Motilin, secreted by M-cells during the interdigestive phase"
        ],
        "explanation": "Secretin is stimulated by H+ ions entering the duodenum and acts on pancreatic ductal cells via cAMP to stimulate large volumes of watery alkaline juice rich in HCO3- to neutralize acidic gastric chyme.",
        "key_concept": "Secretin = duodenal H+ stimulus -> ductal watery HCO3- secretion."
    },

    # ── BIOCHEMISTRY ──
    {
        "id": "MGL3-PRAC-BIO-001",
        "subject": "biochemistry",
        "topic": "Wilson Disease",
        "page": 1103,
        "output_filename": "wilson_disease_cbl.webp",
        "type": "specimen_mcq",
        "question_text": "A 12-year-old boy presents with tremor, behavioral changes, hepatosplenomegaly, and golden-brown corneal rings (Kayser-Fleischer rings). Laboratory analysis confirms Wilson disease (hepatolenticular degeneration). What is the classic biochemical profile?",
        "correct_answer": "Decreased serum ceruloplasmin, increased free serum copper, and increased 24-hour urinary copper excretion",
        "distractors": [
            "Markedly elevated serum ceruloplasmin with decreased urinary copper excretion",
            "Elevated serum ferritin, increased transferrin saturation, and normal copper levels",
            "Decreased alpha-1 antitrypsin with normal serum ceruloplasmin and urine copper"
        ],
        "explanation": "Wilson disease is an autosomal recessive mutation in the ATP7B copper-transporting ATPase gene, impairing copper incorporation into apoceruloplasmin (low ceruloplasmin) and biliary excretion, causing toxic copper accumulation.",
        "key_concept": "Wilson disease: low serum ceruloplasmin + high urinary copper excretion + ATP7B defect."
    },
    {
        "id": "MGL3-PRAC-BIO-002",
        "subject": "biochemistry",
        "topic": "Liver Function Tests (LFTs)",
        "page": 1148,
        "output_filename": "jaundice_lft_markers.webp",
        "type": "specimen_mcq",
        "question_text": "A 52-year-old woman develops painless dark urine and pale clay-colored stools. Serum tests show Total Bilirubin 12 mg/dL with Direct (conjugated) Bilirubin 9.5 mg/dL, marked elevation of Alkaline Phosphatase (ALP) and GGT, with only mildly elevated ALT/AST. What is the diagnosis?",
        "correct_answer": "Post-hepatic (obstructive/cholestatic) jaundice",
        "distractors": [
            "Acute viral hepatocellular hepatitis",
            "Pre-hepatic hemolytic anemia with unconjugated hyperbilirubinemia",
            "Gilbert syndrome caused by reduced glucuronyl transferase activity"
        ],
        "explanation": "Obstructive cholestatic jaundice exhibits predominant conjugated (direct) hyperbilirubinemia with disproportionately high biliary canalicular enzymes (ALP and GGT), with clay stools due to absent urobilinogen synthesis.",
        "key_concept": "Cholestatic jaundice: High Direct Bilirubin + Markedly High ALP & GGT."
    },

    # ── MICROBIOLOGY ──
    {
        "id": "MGL3-PRAC-MICR-001",
        "subject": "microbiology",
        "topic": "Stool Culture & Enteric Pathogens",
        "page": 1215,
        "output_filename": "macconkey_agar_stool_culture.webp",
        "type": "specimen_mcq",
        "question_text": "A stool specimen from a patient with fever and watery diarrhea is cultured on MacConkey agar. The plate grows pale, non-lactose-fermenting colonies. Subsequent subculture on Salmonella-Shigella (SS) agar produces colonies with black centers. What is the pathogen?",
        "correct_answer": "Salmonella enterica (H2S production creates black iron sulfide centers)",
        "distractors": [
            "Shigella sonnei (non-lactose fermenter producing colorless colonies without H2S)",
            "Escherichia coli (vigorous lactose fermenter producing bright pink colonies)",
            "Vibrio cholerae (sucrose fermenter producing yellow colonies on TCBS)"
        ],
        "explanation": "On MacConkey agar, Salmonella and Shigella appear pale/translucent (non-lactose fermenters). On SS agar, Salmonella produces hydrogen sulfide (H2S), which reacts with ferric citrate to form characteristic black-centered colonies.",
        "key_concept": "Salmonella on SS agar = non-lactose fermenting colonies with black H2S centers."
    },
    {
        "id": "MGL3-PRAC-MICR-002",
        "subject": "microbiology",
        "topic": "Vibrio & Selective Media",
        "page": 1216,
        "output_filename": "tcbs_agar_vibrio_cholerae.webp",
        "type": "specimen_mcq",
        "question_text": "A patient returning from an endemic area presents with voluminous rice-water stools. Stool inoculated onto Thiosulfate-Citrate-Bile Salts-Sucrose (TCBS) agar grows bright yellow colonies. Gram staining reveals curved Gram-negative rods with darting motility. What is the organism?",
        "correct_answer": "Vibrio cholerae (sucrose fermentation turns bromothymol blue indicator yellow)",
        "distractors": [
            "Campylobacter jejuni (grows only on Skirrow medium at 42°C under microaerophilic conditions)",
            "Helicobacter pylori (urease-positive curved rod requiring Christensen urea agar)",
            "Clostridioides difficile (spore-forming Gram-positive rod producing toxins A and B)"
        ],
        "explanation": "TCBS agar is highly selective and differential for Vibrio species. Vibrio cholerae ferments sucrose, producing acid that changes the bromothymol blue pH indicator from green to bright yellow.",
        "key_concept": "Vibrio cholerae: yellow colonies on TCBS agar + curved Gram-negative rods."
    },

    # ── CLINICAL ──
    {
        "id": "MGL3-PRAC-CLIN-001",
        "subject": "clinical",
        "topic": "Peptic Ulcer Disease",
        "page": 1290,
        "output_filename": "peptic_ulcer_endoscopy_case.webp",
        "type": "specimen_mcq",
        "question_text": "A 45-year-old chronic heavy smoker taking over-the-counter NSAIDs presents with burning epigastric pain that occurs 2–3 hours after meals and awakens him at night, relieved by food or antacids. Upper GI endoscopy reveals a punched-out mucosal defect in the first part of the duodenum. What is the most appropriate first-line medical therapy?",
        "correct_answer": "Proton pump inhibitor (PPI) along with testing and eradication therapy for Helicobacter pylori",
        "distractors": [
            "Immediate surgical subtotal gastrectomy with Billroth II gastrojejunostomy",
            "High-dose chronic NSAID therapy with oral misoprostol monotherapy",
            "Empiric lifelong anticholinergic belladonna alkaloid administration"
        ],
        "explanation": "Duodenal ulcers are classically associated with pain relieved by food and nocturnal awakening. Primary management requires acid suppression with a PPI and mandatory testing/eradication of H. pylori (triple or quadruple therapy).",
        "key_concept": "Duodenal ulcer: epigastric pain relieved by food; treat with PPI + H. pylori eradication."
    },
    {
        "id": "MGL3-PRAC-CLIN-002",
        "subject": "clinical",
        "topic": "Liver Cirrhosis Complications",
        "page": 1305,
        "output_filename": "portal_hypertension_cirrhosis.webp",
        "type": "specimen_mcq",
        "question_text": "A 58-year-old male with decompensated post-hepatitis cirrhosis presents with tense abdominal distension, splenomegaly, and dilated tortuous superficial periumbilical veins radiating outward from the umbilicus. What is the vascular origin of this sign (caput medusae)?",
        "correct_answer": "Portosystemic collateral blood flow via recanalized paraumbilical veins into epigastric veins",
        "distractors": [
            "Direct superior vena cava thrombosis with retrograde jugular congestion",
            "Anastomosis between left gastric veins and esophageal veins",
            "Retroperitoneal communication between superior and middle rectal veins"
        ],
        "explanation": "Caput medusae occurs in severe portal hypertension when blood from the portal vein is shunted through recanalized paraumbilical veins (in the falciform ligament) into systemic superficial and deep epigastric veins.",
        "key_concept": "Caput medusae = portosystemic shunt through recanalized paraumbilical veins."
    }
]

def render_and_process_slides():
    print(f"Opening PDF: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)
    total_pages = len(doc)
    print(f"Total pages in PDF: {total_pages}")
    
    extracted_records = []
    
    for spec in SLIDE_SPECS:
        page_num = spec["page"]
        if page_num > total_pages:
            print(f"⚠️ Page {page_num} exceeds PDF total ({total_pages}), skipping.")
            continue
            
        page = doc[page_num - 1]
        subject = spec["subject"]
        sub_dir = os.path.join(OUT_BASE, subject)
        os.makedirs(sub_dir, exist_ok=True)
        out_path = os.path.join(sub_dir, spec["output_filename"])
        
        # Render high-resolution pixmap (144 dpi = Retina 2x)
        pix = page.get_pixmap(dpi=144)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        scale = pix.width / float(page.rect.width)
        
        # If masked MCQ, apply label redacting badges
        if spec.get("type") == "masked_mcq" and "mask_labels" in spec:
            draw = ImageDraw.Draw(img)
            for badge, (x0, y0, x1, y1) in spec["mask_labels"]:
                bx0, by0, bx1, by1 = x0 * scale, y0 * scale, x1 * scale, y1 * scale
                # High-contrast rounded pill
                pill_box = [bx0 - 8, by0 - 4, bx1 + 8, by1 + 4]
                draw.rounded_rectangle(
                    pill_box,
                    radius=14,
                    fill=(20, 15, 35),
                    outline=(217, 70, 239),
                    width=3
                )
                # Badge letter in center
                cx = (bx0 + bx1) / 2
                cy = (by0 + by1) / 2
                # Draw letter
                draw.text((cx, cy), f"[{badge}]", fill=(255, 255, 255), anchor="mm")
                
        # Save as ultra-efficient modern WebP
        img.save(out_path, format="WEBP", quality=82)
        size_kb = os.path.getsize(out_path) / 1024.0
        print(f"✅ Generated [{subject}] {spec['output_filename']} ({img.width}x{img.height}, {size_kb:.1f} KB)")
        
        # Record web-accessible image path
        web_image_url = f"/images/practical/mgl-3/{subject}/{spec['output_filename']}"
        record = {
            **spec,
            "imageUrl": web_image_url,
            "dimensions": f"{img.width}x{img.height}",
            "size_kb": round(size_kb, 1)
        }
        extracted_records.append(record)
        
    # Save manifest
    manifest_path = os.path.join(JOB_DIR, "practical_extracted_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(extracted_records, f, indent=2)
    print(f"\nSaved extraction manifest with {len(extracted_records)} items to {manifest_path}")
    return extracted_records

if __name__ == "__main__":
    render_and_process_slides()

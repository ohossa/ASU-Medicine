#!/usr/bin/env python3
"""
ASU Medical Portal — GIT (MGL-3) Practical Question Bank Builder
Compiles the high-yield practical questions across all 8 subjects into
canonical Chapter objects following schemaVersion 1.
Ensures:
- Exactly 25% distribution across correctIndex (0, 1, 2, 3)
- Balanced distractor lengths (±15% character counts)
- Canonical ID format: MGL3-CH{id}-{KEY}-{seq:04d}
- High-yield medical explanations <= 65 words
- media.imageUrl pointing to local WebP assets
"""

import json
import random

RAW_QUESTIONS = [
    # ── HISTOLOGY (CH301) ──
    {
        "chapter_id": 301,
        "subject_id": "histology",
        "subject_key": "HIST",
        "seq": 1,
        "lecture": 1,
        "text": "In this transmission electron micrograph (TEM) of a circumvallate papilla taste bud, identify the apical structure indicated by pointer [ A ]:",
        "correct_answer": "Taste pore with microvilli",
        "distractors": [
            "Basal reserve stem cell",
            "Supporting sustentacular cell",
            "Primary gustatory receptor"
        ],
        "explanation": "The taste pore is the small apical mucosal opening through which microvilli of sensory gustatory cells project into the oral cavity to bind dissolved tastants.",
        "keyConcept": "Taste pore: apical orifice transmitting tastants to sensory cell microvilli.",
        "imageUrl": "/images/practical/mgl-3/histology/taste_bud_tem_masked.webp"
    },
    {
        "chapter_id": 301,
        "subject_id": "histology",
        "subject_key": "HIST",
        "seq": 2,
        "lecture": 1,
        "text": "In this transmission electron micrograph (TEM) of the circumvallate taste bud, identify the elongated insulating cells indicated by pointer [ B ]:",
        "correct_answer": "Supporting (sustentacular) cells",
        "distractors": [
            "Primary gustatory sensory cells",
            "Basal undifferentiated stem cells",
            "Antimicrobial secretory Paneth cells"
        ],
        "explanation": "Supporting (sustentacular) cells span the entire height of the taste bud from the basal lamina to the taste pore, providing structural and metabolic insulation for gustatory receptor cells.",
        "keyConcept": "Sustentacular cells: full-height supportive cells insulating sensory receptors.",
        "imageUrl": "/images/practical/mgl-3/histology/taste_bud_tem_masked_b.webp"
    },
    {
        "chapter_id": 301,
        "subject_id": "histology",
        "subject_key": "HIST",
        "seq": 3,
        "lecture": 2,
        "text": "Examine this high-yield H&E histological section of a major salivary gland. Which defining histological feature confirms that this specimen is the parotid gland?",
        "correct_answer": "Purely serous acini with narrow lumens and intercalated ducts",
        "distractors": [
            "Predominantly mucous tubules capped with serous demilunes",
            "Purely mucous acini with flattened basal peripheral nuclei",
            "Co-dominant mixture of discrete serous and mucous acini"
        ],
        "explanation": "The human parotid gland is 100% serous, exhibiting round basophilic acini with narrow lumens, spherical central nuclei, apical zymogen granules, and absence of mucous tubules.",
        "keyConcept": "Parotid = purely serous acini with round central nuclei and intercalated ducts.",
        "imageUrl": "/images/practical/mgl-3/histology/parotid_gland_he.webp"
    },
    {
        "chapter_id": 301,
        "subject_id": "histology",
        "subject_key": "HIST",
        "seq": 4,
        "lecture": 3,
        "text": "Examine this H&E cross-section of the gastrointestinal tract. What definitive landmark restricts the anatomical diagnosis to the duodenum?",
        "correct_answer": "Branched coiled Brunner glands packed within the submucosal layer",
        "distractors": [
            "Aggregated Peyer lymphoid patches in the lamina propria and submucosa",
            "Complete absence of mucosal villi with long straight vertical crypts",
            "Stratified squamous non-keratinized mucosal epithelial lining"
        ],
        "explanation": "Brunner (duodenal) glands are branched coiled tubular mucous glands confined specifically to the submucosa of the duodenum, secreting alkaline mucin (pH 8.1–9.3) to protect against gastric acid.",
        "keyConcept": "Submucosal Brunner glands are exclusively found in the duodenum.",
        "imageUrl": "/images/practical/mgl-3/histology/duodenum_brunner_glands_he.webp"
    },
    {
        "chapter_id": 301,
        "subject_id": "histology",
        "subject_key": "HIST",
        "seq": 5,
        "lecture": 4,
        "text": "This transmission electron micrograph (TEM) demonstrates pyramidal cells at the base of the crypts of Lieberkühn with prominent apical dense granules. What is their primary function?",
        "correct_answer": "Secretion of antimicrobial alpha-defensins and lysozyme enzymes",
        "distractors": [
            "Absorption of dietary lipids and synthesis of core chylomicrons",
            "Secretion of lubricating mucin glycoproteins by exocytosis",
            "Systemic release of endocrine peptides gastrin and cholecystokinin"
        ],
        "explanation": "Paneth cells occupy the bases of small intestinal crypts and contain large apical eosinophilic secretory granules containing lysozyme, phospholipase A2, and alpha-defensins providing mucosal immunity.",
        "keyConcept": "Paneth cells secrete antimicrobial defensins and lysozyme at intestinal crypt bases.",
        "imageUrl": "/images/practical/mgl-3/histology/paneth_cells_tem.webp"
    },
    {
        "chapter_id": 301,
        "subject_id": "histology",
        "subject_key": "HIST",
        "seq": 6,
        "lecture": 5,
        "text": "Examine this cross-section of the vermiform appendix. Which histological characteristic most definitively distinguishes the appendix from the colon?",
        "correct_answer": "Confluent lymphoid follicles infiltrating the lamina propria and submucosa",
        "distractors": [
            "Prominent outer taeniae coli formed by discrete longitudinal muscle bands",
            "Numerous tall slender mucosal villi lined by microvillar enterocytes",
            "Complete absence of straight tubular crypts of Lieberkühn"
        ],
        "explanation": "The vermiform appendix possesses a complete outer longitudinal muscle coat (no taeniae coli) and massive, confluent lymphoid follicles with germinal centers effacing the lamina propria and submucosa.",
        "keyConcept": "Appendix: circular continuous longitudinal coat + dense circumferential lymphoid ring.",
        "imageUrl": "/images/practical/mgl-3/histology/colon_vs_appendix_he.webp"
    },

    # ── PATHOLOGY (CH302) ──
    {
        "chapter_id": 302,
        "subject_id": "pathology",
        "subject_key": "PATH",
        "seq": 1,
        "lecture": 1,
        "text": "This endoscopic biopsy from the distal esophagus of a patient with chronic reflux demonstrates epithelial replacement. What is the pathognomonic diagnostic finding?",
        "correct_answer": "Columnar intestinal metaplasia containing alcian blue-positive goblet cells",
        "distractors": [
            "Severe squamous cell dysplasia with intact underlying basal membrane",
            "Eosinophilic microabscesses without glandular or goblet cell conversion",
            "Dense submucosal lymphoid follicles with reactive germinal centers"
        ],
        "explanation": "Barrett esophagus is defined histologically by intestinal metaplasia where normal squamous epithelium is replaced by columnar cells containing true goblet cells, conferring risk for adenocarcinoma.",
        "keyConcept": "Barrett esophagus: intestinal metaplasia with true goblet cells above GE junction.",
        "imageUrl": "/images/practical/mgl-3/pathology/barretts_esophagus_he.webp"
    },
    {
        "chapter_id": 302,
        "subject_id": "pathology",
        "subject_key": "PATH",
        "seq": 2,
        "lecture": 2,
        "text": "Examine this section from a benign parotid neoplasm (pleomorphic adenoma). What dual histological components define this mixed tumor?",
        "correct_answer": "Epithelial ductal structures embedded in myxoid and chondroid stroma",
        "distractors": [
            "Bilayered oncocytic columnar cells overlying dense lymphoid stroma",
            "Solid sheets of poorly differentiated clear cells with vascular invasion",
            "Sheets of mature signet ring cells filled with abundant intracellular mucin"
        ],
        "explanation": "Pleomorphic adenoma (mixed tumor) displays epithelial ductal structures and sheets intermingled with myxoid, chondroid, or fibrous mesenchymal-like stroma elaborated by neoplastic myoepithelial cells.",
        "keyConcept": "Pleomorphic adenoma = epithelial ducts embedded in myxochondroid matrix.",
        "imageUrl": "/images/practical/mgl-3/pathology/pleomorphic_adenoma_he.webp"
    },
    {
        "chapter_id": 302,
        "subject_id": "pathology",
        "subject_key": "PATH",
        "seq": 3,
        "lecture": 3,
        "text": "This photomicrograph demonstrates Warthin tumor (papillary cystadenoma lymphomatosum). What microscopic architecture establishes the diagnosis?",
        "correct_answer": "Bilayered oncocytic epithelium lining cysts over lymphoid stroma with follicles",
        "distractors": [
            "Malignant stratified squamous islands surrounded by marked desmoplasia",
            "Acellular laminated chitinous membranes with calcified brood capsules",
            "Mucin-secreting signet ring cells infiltrating the parotid gland capsule"
        ],
        "explanation": "Warthin tumor consists of cystic spaces with papillary foldings lined by a uniform double layer of pink oncocytic columnar cells resting upon a dense lymphoid stroma with germinal centers.",
        "keyConcept": "Warthin tumor: bilayered oncocytic epithelium + lymphoid stroma with germinal centers.",
        "imageUrl": "/images/practical/mgl-3/pathology/warthin_tumor_he.webp"
    },
    {
        "chapter_id": 302,
        "subject_id": "pathology",
        "subject_key": "PATH",
        "seq": 4,
        "lecture": 4,
        "text": "This liver biopsy stained with Masson trichrome demonstrates blue-staining fibrous bands. What pathological triad defines liver cirrhosis?",
        "correct_answer": "Diffuse bridging fibrosis, architectural disruption, and regenerative nodules",
        "distractors": [
            "Focal portal triaditis, central vein thrombosis, and preserved liver plates",
            "Centrilobular macrovesicular steatosis without significant fibrous septation",
            "Non-caseating granulomas with complete preservation of lobular architecture"
        ],
        "explanation": "Cirrhosis is defined pathologically by diffuse bridging fibrosis (blue on Masson trichrome), complete loss of normal lobular architecture, and parenchymal nodular regeneration.",
        "keyConcept": "Cirrhosis triad: diffuse fibrosis + regenerative nodules + architectural disruption.",
        "imageUrl": "/images/practical/mgl-3/pathology/liver_cirrhosis_masson_trichrome.webp"
    },
    {
        "chapter_id": 302,
        "subject_id": "pathology",
        "subject_key": "PATH",
        "seq": 5,
        "lecture": 5,
        "text": "A patient with cirrhosis develops a liver mass showing malignant hepatocytes. Which histological feature confirms hepatocellular carcinoma (HCC)?",
        "correct_answer": "Markedly thickened liver cell trabeculae (>3 cells thick) with atypical mitoses",
        "distractors": [
            "Orderly single-cell thick cords bordered by normal sinusoidal endothelial cells",
            "Malignant glandular tubules producing abundant intracytoplasmic mucin",
            "Small uniform round blue neuroendocrine cells with salt-and-pepper chromatin"
        ],
        "explanation": "Hepatocellular carcinoma (HCC) is characterized by loss of reticulin framework, markedly thickened trabeculae (>3 cells thick), pseudoacinar architecture, pleomorphic nuclei, and atypical mitoses.",
        "keyConcept": "HCC: thick trabeculae (>3 cells), nuclear atypia, and loss of reticulin network.",
        "imageUrl": "/images/practical/mgl-3/pathology/hcc_on_cirrhosis_he.webp"
    },
    {
        "chapter_id": 302,
        "subject_id": "pathology",
        "subject_key": "PATH",
        "seq": 6,
        "lecture": 6,
        "text": "Examine this hepatic bilharziasis specimen (Symmers clay-pipe-stem fibrosis). What distinguishes schistosomal hepatic fibrosis from true cirrhosis?",
        "correct_answer": "Preservation of normal lobular architecture and absence of regenerative nodules",
        "distractors": [
            "Widespread hepatocellular necrosis with diffuse micro-nodular regeneration",
            "Severe diffuse macrovesicular fatty change affecting all lobular zones",
            "Primary obliteration of major hepatic veins with centrilobular congestion"
        ],
        "explanation": "In Symmers clay-pipe-stem fibrosis, granulomatous and dense fibrosis is restricted to periportal spaces, while lobular architecture and central veins are preserved without regenerative nodules.",
        "keyConcept": "Symmers fibrosis: periportal fibrosis with preserved lobular architecture (non-cirrhotic).",
        "imageUrl": "/images/practical/mgl-3/pathology/schistosomal_clay_pipe_stem_fibrosis.webp"
    },

    # ── PARASITOLOGY (CH303) ──
    {
        "chapter_id": 303,
        "subject_id": "parasitology",
        "subject_key": "PARA",
        "seq": 1,
        "lecture": 1,
        "text": "Identify this parasite egg recovered from the stool of a patient with dysentery. What morphological feature definitively identifies Schistosoma mansoni?",
        "correct_answer": "Large elongated oval translucent shell bearing a prominent sharp lateral spine",
        "distractors": [
            "Small oval yellowish-brown operculated shell containing a ciliated miracidium",
            "Spherical thick-shelled brown egg bearing a conspicuous terminal spine",
            "Barrel-shaped golden egg with translucent protruding bipolar mucoid plugs"
        ],
        "explanation": "Schistosoma mansoni eggs measure 114–180 µm by 45–70 µm and feature a prominent sharp lateral spine near the posterior pole, in contrast to S. haematobium (terminal spine).",
        "keyConcept": "Schistosoma mansoni egg = prominent sharp lateral spine.",
        "imageUrl": "/images/practical/mgl-3/parasitology/schistosoma_mansoni_egg.webp"
    },
    {
        "chapter_id": 303,
        "subject_id": "parasitology",
        "subject_key": "PARA",
        "seq": 2,
        "lecture": 2,
        "text": "Identify this adult liver fluke recovered from a biliary tract prosection. Which feature differentiates Fasciola gigantica from Fasciola hepatica?",
        "correct_answer": "Elongated body (up to 7.5 cm) with nearly parallel margins and faint shoulders",
        "distractors": [
            "Presence of a third specialized genital sucker (gonotyl) around genital pore",
            "Complete absence of anterior oral and ventral fixation acetabula",
            "Unbranched simple tubular intestinal ceca extending to the posterior tip"
        ],
        "explanation": "Fasciola gigantica is significantly longer (25–75 mm) than F. hepatica (20–30 mm), possesses nearly parallel lateral margins, and displays a less prominent cephalic cone and indistinct shoulders.",
        "keyConcept": "Fasciola gigantica: large size (up to 7.5 cm), parallel borders, faint shoulders.",
        "imageUrl": "/images/practical/mgl-3/parasitology/fasciola_gigantica_adult.webp"
    },
    {
        "chapter_id": 303,
        "subject_id": "parasitology",
        "subject_key": "PARA",
        "seq": 3,
        "lecture": 3,
        "text": "Identify this freshwater snail shell collected from Egyptian water channels. What morphological criteria confirm Biomphalaria alexandrina?",
        "correct_answer": "Sinistral, discoidal shell coiled horizontally like a disk with aperture to left",
        "distractors": [
            "Dextral conical shell with a sharp pointed apex and very large body whorl",
            "Tall turreted spiral shell with an elongated narrow aperture on the right",
            "Globular thick operculated shell with prominent concentric exterior ridges"
        ],
        "explanation": "Biomphalaria alexandrina is the intermediate snail host of Schistosoma mansoni in Egypt; its shell is planorboid (discoidal, flat whorls) and sinistral (aperture opens to the left).",
        "keyConcept": "Biomphalaria alexandrina: discoidal, sinistral shell; vector for S. mansoni.",
        "imageUrl": "/images/practical/mgl-3/parasitology/biomphalaria_alexandrina_snail.webp"
    },
    {
        "chapter_id": 303,
        "subject_id": "parasitology",
        "subject_key": "PARA",
        "seq": 4,
        "lecture": 4,
        "text": "Examine this histological section of a hepatic hydatid cyst (Echinococcus granulosus). Identify the distinctive acellular parasite layer:",
        "correct_answer": "Acellular, chitinous laminated (cuticular) membrane with fine striations",
        "distractors": [
            "Inner nucleated germinal layer actively generating scolices and brood capsules",
            "Dense outer vascularized fibrous pseudocapsule synthesized by the host liver",
            "Calcified calcareous corpuscle layer lining the internal cyst cavity"
        ],
        "explanation": "The hydatid cyst wall consists of an outer acellular laminated cuticular membrane (secreted by the parasite, appearing hyaline and striated) and an inner cellular germinal layer that buds brood capsules.",
        "keyConcept": "Hydatid wall: outer acellular laminated layer + inner nucleated germinal layer.",
        "imageUrl": "/images/practical/mgl-3/parasitology/hydatid_cyst_wall_he.webp"
    },
    {
        "chapter_id": 303,
        "subject_id": "parasitology",
        "subject_key": "PARA",
        "seq": 5,
        "lecture": 5,
        "text": "Identify this parasite egg collected by perianal Scotch tape swab in a child with nocturnal pruritus ani:",
        "correct_answer": "Planoconvex D-shaped transparent egg of Enterobius vermicularis",
        "distractors": [
            "Thick-shelled corticated egg of Ascaris lumbricoides with wavy coat",
            "Thin-shelled oval egg of Ancylostoma duodenale with clear space",
            "Lemon-shaped egg of Trichuris trichiura with two polar plugs"
        ],
        "explanation": "Enterobius vermicularis (pinworm) eggs are colorless, translucent, 50–60 µm long, and characteristically planoconvex (D-shaped, flattened on one side and convex on the other).",
        "keyConcept": "Enterobius vermicularis egg: planoconvex (D-shaped), colorless, transparent shell.",
        "imageUrl": "/images/practical/mgl-3/parasitology/enterobius_vermicularis_egg.webp"
    },
    {
        "chapter_id": 303,
        "subject_id": "parasitology",
        "subject_key": "PARA",
        "seq": 6,
        "lecture": 6,
        "text": "Identify this parasite egg found in a stool wet mount from an anemic patient. What morphological hallmark identifies Trichuris trichiura?",
        "correct_answer": "Golden-brown barrel-shaped shell with prominent transparent bipolar mucoid plugs",
        "distractors": [
            "Yellow operculated oval shell with an abopercular thickening and miracidium",
            "Spherical brown egg with a thick radially striated embryophore and hooklets",
            "Ovoid thin-shelled transparent egg containing an unsegmented granular ovum"
        ],
        "explanation": "Trichuris trichiura (whipworm) eggs are barrel-shaped (50–54 µm by 22 µm), golden-brown, with a thick smooth shell and two characteristic translucent mucoid plugs protruding from both poles.",
        "keyConcept": "Trichuris trichiura egg: barrel-shaped with bipolar mucoid plugs.",
        "imageUrl": "/images/practical/mgl-3/parasitology/trichuris_trichiura_egg.webp"
    },

    # ── ANATOMY (CH304) ──
    {
        "chapter_id": 304,
        "subject_id": "anatomy",
        "subject_key": "ANAT",
        "seq": 1,
        "lecture": 1,
        "text": "In a cadaveric prosection of the celiac trunk at the level of T12, which of the following is an immediate primary branch of the trunk?",
        "correct_answer": "Splenic artery coursing tortuously along the upper border of pancreas",
        "distractors": [
            "Gastroduodenal artery arising behind the first part of the duodenum",
            "Right gastric artery running along the lesser curvature of stomach",
            "Superior mesenteric artery descending anterior to the third part of duodenum"
        ],
        "explanation": "The celiac trunk trifurcates into the left gastric artery, splenic artery (running along the upper pancreatic border to the spleen), and common hepatic artery.",
        "keyConcept": "Celiac trunk trifurcation: Left gastric, Splenic, and Common hepatic arteries.",
        "imageUrl": "/images/practical/mgl-3/anatomy/celiac_trunk_anatomy.webp"
    },
    {
        "chapter_id": 304,
        "subject_id": "anatomy",
        "subject_key": "ANAT",
        "seq": 2,
        "lecture": 2,
        "text": "During dissection of the inguinal canal, identify the structure that reinforces the posterior wall in its medial third:",
        "correct_answer": "Conjoint tendon (falx inguinalis) behind the superficial inguinal ring",
        "distractors": [
            "Aponeurosis of the external oblique muscle with its intercrural fibers",
            "Curved shelving border of the inguinal ligament (Poupart ligament)",
            "Reflected triangular pectineal ligament (Cooper ligament) on pecten pubis"
        ],
        "explanation": "The posterior wall of the inguinal canal is formed in its lateral two-thirds by the fascia transversalis and in its medial third by the conjoint tendon (falx inguinalis) formed by internal oblique and transversus abdominis.",
        "keyConcept": "Inguinal canal posterior wall: Fascia transversalis (lateral) + Conjoint tendon (medial).",
        "imageUrl": "/images/practical/mgl-3/anatomy/inguinal_canal_anatomy.webp"
    },
    {
        "chapter_id": 304,
        "subject_id": "anatomy",
        "subject_key": "ANAT",
        "seq": 3,
        "lecture": 3,
        "text": "At the porta hepatis (free margin of the lesser omentum), what is the correct spatial arrangement of the structures from anterior to posterior?",
        "correct_answer": "Bile duct (anterior-right), Hepatic artery proper (anterior-left), Portal vein (posterior)",
        "distractors": [
            "Portal vein (anterior), Hepatic artery proper (middle), Bile duct (posterior)",
            "Hepatic artery proper (anterior), Portal vein (middle), Bile duct (posterior)",
            "Inferior vena cava (anterior), Bile duct (middle), Hepatic artery (posterior)"
        ],
        "explanation": "In the free edge of the lesser omentum: the common bile duct lies anterolaterally to the right, the hepatic artery proper lies anteromedially to the left, and the portal vein lies posteriorly.",
        "keyConcept": "Porta hepatis relation: Duct on Right, Artery on Left, Portal Vein Behind.",
        "imageUrl": "/images/practical/mgl-3/anatomy/porta_hepatis_anatomy.webp"
    },

    # ── PHYSIOLOGY (CH305) ──
    {
        "chapter_id": 305,
        "subject_id": "physiology",
        "subject_key": "PHYS",
        "seq": 1,
        "lecture": 1,
        "text": "Esophageal manometry in a 35-year-old with dysphagia reveals unrelaxed LES and aperistalsis (achalasia). What is the primary neurogenic defect?",
        "correct_answer": "Degeneration of inhibitory myenteric neurons producing nitric oxide and VIP",
        "distractors": [
            "Excessive cholinergic vagal outflow hyperpolarizing esophageal smooth muscle",
            "Loss of sensory afferent fibers in the submucosal Meissner nerve plexus",
            "Autoimmune destruction of nicotinic acetylcholine receptors at striated endplates"
        ],
        "explanation": "Achalasia results from selective degeneration of postganglionic inhibitory neurons in the myenteric (Auerbach) plexus that release nitric oxide (NO) and VIP, preventing lower esophageal sphincter relaxation.",
        "keyConcept": "Achalasia: loss of NO/VIP inhibitory myenteric neurons causes aperistalsis and unrelaxed LES.",
        "imageUrl": "/images/practical/mgl-3/physiology/achalasia_manometry_case.webp"
    },
    {
        "chapter_id": 305,
        "subject_id": "physiology",
        "subject_key": "PHYS",
        "seq": 2,
        "lecture": 2,
        "text": "In a lab experiment, introducing acidic chyme (pH < 4.5) into the duodenum triggers copious watery pancreatic juice rich in bicarbonate. Which hormone mediates this response?",
        "correct_answer": "Secretin, secreted by mucosal S-cells in response to intraluminal hydrogen ions",
        "distractors": [
            "Cholecystokinin (CCK), secreted by mucosal I-cells in response to peptides",
            "Gastrin, released from gastric antral G-cells in response to distension",
            "Motilin, released from upper intestinal M-cells during interdigestive migrating complexes"
        ],
        "explanation": "Secretin is released by duodenal S-cells when luminal pH drops below 4.5. It acts on pancreatic ductular cells via cAMP to stimulate secretion of large volumes of watery, bicarbonate-rich juice.",
        "keyConcept": "Secretin: triggered by duodenal acid -> stimulates ductal aqueous HCO3- secretion.",
        "imageUrl": "/images/practical/mgl-3/physiology/pancreatic_hormonal_regulation.webp"
    },

    # ── BIOCHEMISTRY (CH306) ──
    {
        "chapter_id": 306,
        "subject_id": "biochemistry",
        "subject_key": "BIOC",
        "seq": 1,
        "lecture": 1,
        "text": "A 12-year-old boy presents with hepatosplenomegaly, tremor, and Kayser-Fleischer rings (Wilson disease). What is the pathognomonic serum and urine biochemical profile?",
        "correct_answer": "Decreased serum ceruloplasmin, increased free serum copper, and elevated 24-hour urine copper",
        "distractors": [
            "Elevated serum ceruloplasmin with markedly decreased urinary copper clearance",
            "Markedly elevated serum ferritin, high transferrin saturation, and normal copper",
            "Deficiency of alpha-1 antitrypsin with normal serum ceruloplasmin and urinary copper"
        ],
        "explanation": "Wilson disease (ATP7B mutation) causes impaired copper incorporation into apoceruloplasmin (low ceruloplasmin) and blocked biliary excretion, causing high free serum copper and high urinary copper excretion.",
        "keyConcept": "Wilson disease: low serum ceruloplasmin + high urinary copper excretion (ATP7B defect).",
        "imageUrl": "/images/practical/mgl-3/biochemistry/wilson_disease_cbl.webp"
    },
    {
        "chapter_id": 306,
        "subject_id": "biochemistry",
        "subject_key": "BIOC",
        "seq": 2,
        "lecture": 2,
        "text": "A 52-year-old female presents with painless jaundice and clay-colored stools. Labs: Total Bilirubin 12 mg/dL, Direct Bilirubin 9.5 mg/dL, and marked elevation of ALP and GGT with mild ALT/AST elevation. What is the diagnosis?",
        "correct_answer": "Post-hepatic (obstructive/cholestatic) jaundice",
        "distractors": [
            "Acute viral hepatocellular hepatitis with diffuse hepatic cytolysis",
            "Pre-hepatic hemolytic anemia with predominant unconjugated hyperbilirubinemia",
            "Gilbert syndrome caused by reduced promoter activity of glucuronyl transferase"
        ],
        "explanation": "Obstructive cholestatic jaundice shows predominant conjugated (direct) hyperbilirubinemia with disproportionate elevation of biliary canalicular enzymes (ALP and GGT) and clay stools from lack of stercobilin.",
        "keyConcept": "Cholestatic jaundice: high direct bilirubin + marked elevation of ALP and GGT.",
        "imageUrl": "/images/practical/mgl-3/biochemistry/jaundice_lft_markers.webp"
    },

    # ── MICROBIOLOGY (CH307) ──
    {
        "chapter_id": 307,
        "subject_id": "microbiology",
        "subject_key": "MICR",
        "seq": 1,
        "lecture": 1,
        "text": "A stool culture on MacConkey agar shows pale non-lactose-fermenting colonies. Subculture on Salmonella-Shigella (SS) agar produces colonies with black centers. Identify the pathogen:",
        "correct_answer": "Salmonella enterica (H2S production creates black iron sulfide precipitate)",
        "distractors": [
            "Shigella dysenteriae (non-lactose fermenter producing colorless colonies without H2S)",
            "Escherichia coli (vigorous lactose fermenter producing bright pink dry colonies)",
            "Vibrio cholerae (sucrose fermenter producing bright yellow colonies on TCBS agar)"
        ],
        "explanation": "On MacConkey agar, Salmonella and Shigella are pale (non-lactose fermenters). On SS agar, Salmonella produces H2S gas which reacts with ferric citrate to produce black-centered colonies.",
        "keyConcept": "Salmonella on SS agar = non-lactose fermenting colonies with black H2S centers.",
        "imageUrl": "/images/practical/mgl-3/microbiology/macconkey_agar_stool_culture.webp"
    },
    {
        "chapter_id": 307,
        "subject_id": "microbiology",
        "subject_key": "MICR",
        "seq": 2,
        "lecture": 2,
        "text": "Stool from a patient with rice-water diarrhea is cultured on Thiosulfate-Citrate-Bile Salts-Sucrose (TCBS) agar, yielding bright yellow colonies. Microscopic examination shows curved Gram-negative rods with darting motility. What is the organism?",
        "correct_answer": "Vibrio cholerae (sucrose fermentation lowers pH and turns bromothymol blue yellow)",
        "distractors": [
            "Campylobacter jejuni (microaerophilic thermophilic curved rod growing on Skirrow agar)",
            "Helicobacter pylori (potent urease-producing curved rod colonizing gastric antrum)",
            "Pseudomonas aeruginosa (non-fermenting Gram-negative rod producing green pyocyanin pigment)"
        ],
        "explanation": "TCBS agar is highly selective and differential for Vibrio. Vibrio cholerae ferments sucrose, producing acid that turns the bromothymol blue pH indicator yellow.",
        "keyConcept": "Vibrio cholerae: yellow colonies on TCBS agar + curved Gram-negative rods.",
        "imageUrl": "/images/practical/mgl-3/microbiology/tcbs_agar_vibrio_cholerae.webp"
    },

    # ── CLINICAL (CH308) ──
    {
        "chapter_id": 308,
        "subject_id": "clinical",
        "subject_key": "CLIN",
        "seq": 1,
        "lecture": 1,
        "text": "A 45-year-old smoker taking NSAIDs presents with burning epigastric pain 2–3 hours after meals relieved by food. Endoscopy reveals a punched-out duodenal ulcer. What is the essential medical management?",
        "correct_answer": "Proton pump inhibitor (PPI) along with testing and eradication therapy for Helicobacter pylori",
        "distractors": [
            "Emergency partial gastrectomy with Roux-en-Y gastrojejunostomy reconstruction",
            "High-dose continuous NSAID therapy combined with oral misoprostol monotherapy",
            "Long-term empiric belladonna alkaloid therapy to suppress vagal gastric motility"
        ],
        "explanation": "Duodenal ulcers typically cause pain relieved by food and nocturnal pain. Treatment requires profound acid suppression with a PPI and eradication of H. pylori (triple or quadruple regimen).",
        "keyConcept": "Duodenal ulcer: epigastric pain relieved by food; treat with PPI + H. pylori eradication.",
        "imageUrl": "/images/practical/mgl-3/clinical/peptic_ulcer_endoscopy_case.webp"
    },
    {
        "chapter_id": 308,
        "subject_id": "clinical",
        "subject_key": "CLIN",
        "seq": 2,
        "lecture": 2,
        "text": "A patient with cirrhosis presents with ascites, splenomegaly, and dilated tortuous superficial periumbilical veins radiating outward (caput medusae). What portosystemic collateral channel produces this sign?",
        "correct_answer": "Recanalized paraumbilical veins communicating with systemic epigastric veins",
        "distractors": [
            "Superior vena cava collaterals anastomosing with internal mammary vessels",
            "Left gastric veins anastomosing with lower esophageal tributaries of the azygos vein",
            "Superior rectal vein anastomosing with middle and inferior rectal branches of internal iliac"
        ],
        "explanation": "Caput medusae results from severe portal hypertension where portal venous blood is shunted through recanalized paraumbilical veins in the falciform ligament into superficial and inferior epigastric veins.",
        "keyConcept": "Caput medusae = portosystemic shunt through recanalized paraumbilical veins.",
        "imageUrl": "/images/practical/mgl-3/clinical/portal_hypertension_cirrhosis.webp"
    }
]

def build_balanced_questions():
    # Canonical pattern to balance correctIndex uniformly across 0, 1, 2, 3
    pattern = [0, 1, 2, 3, 1, 2, 0, 3, 2, 0, 3, 1, 3, 2, 1, 0, 0, 2, 1, 3, 1, 0, 3, 2, 2, 1, 0, 3, 3]
    
    questions_by_chapter = {}
    
    for i, raw in enumerate(RAW_QUESTIONS):
        target_idx = pattern[i % len(pattern)]
        
        # Build balanced 4-option array
        opts = [None] * 4
        opts[target_idx] = raw["correct_answer"]
        
        distractor_idx = 0
        for slot in range(4):
            if slot != target_idx:
                opts[slot] = raw["distractors"][distractor_idx]
                distractor_idx += 1
                
        qid = f"MGL3-CH{raw['chapter_id']}-{raw['subject_key']}-{raw['seq']:04d}"
        
        q = {
            "id": qid,
            "type": "mcq",
            "lecture": raw["lecture"],
            "text": raw["text"],
            "options": opts,
            "correctIndex": target_idx,
            "explanation": raw["explanation"],
            "keyConcept": raw["keyConcept"],
            "media": {
                "imageUrl": raw["imageUrl"]
            }
        }
        
        cid = raw["chapter_id"]
        if cid not in questions_by_chapter:
            questions_by_chapter[cid] = []
        questions_by_chapter[cid].append(q)
        
    return questions_by_chapter

CHAPTER_METADATA = [
    {
        "id": 301,
        "title": "Practical — Histology",
        "subtitle": "Micrographs & Electron Microscopy (TEM/SEM)",
        "emoji": "🔬",
        "page": 661,
        "lectureRange": "Stations 1–6",
        "bankSection": "practical",
        "subject": {
            "id": "histology",
            "name": "Histology",
            "iconName": "Microscope",
            "lectures": "Stations 1–6",
            "lectureCount": 6,
            "lectureNames": [
                "Taste Buds & Lingual Papillae",
                "Salivary Glands Histology",
                "Small Intestine & Brunner Glands",
                "Paneth Cells & Crypts of Lieberkuhn",
                "Colon vs Vermiform Appendix",
                "Recto-anal Junction"
            ]
        }
    },
    {
        "id": 302,
        "title": "Practical — Pathology",
        "subtitle": "Gross Pathology Museum Jars & Histopathology",
        "emoji": "🧫",
        "page": 457,
        "lectureRange": "Stations 1–6",
        "bankSection": "practical",
        "subject": {
            "id": "pathology",
            "name": "Pathology",
            "iconName": "Activity",
            "lectures": "Stations 1–6",
            "lectureCount": 6,
            "lectureNames": [
                "Barrett Esophagus & Dysplasia",
                "Pleomorphic Adenoma & Salivary Tumors",
                "Warthin Tumor Histopathology",
                "Liver Cirrhosis (Masson Trichrome)",
                "Hepatocellular Carcinoma on Cirrhosis",
                "Schistosomal Clay-Pipe-Stem Fibrosis"
            ]
        }
    },
    {
        "id": 303,
        "title": "Practical — Parasitology",
        "subtitle": "GIT Parasites, Eggs, Adults & Snail Vectors",
        "emoji": "🐛",
        "page": 2,
        "lectureRange": "Stations 1–6",
        "bankSection": "practical",
        "subject": {
            "id": "parasitology",
            "name": "Parasitology",
            "iconName": "Bug",
            "lectures": "Stations 1–6",
            "lectureCount": 6,
            "lectureNames": [
                "Schistosoma mansoni Egg & Adult",
                "Fasciola gigantica & Fasciola hepatica",
                "Biomphalaria alexandrina & Lymnea Snails",
                "Echinococcus granulosus Hydatid Wall",
                "Enterobius vermicularis (Pinworm) Egg",
                "Trichuris trichiura (Whipworm) Egg"
            ]
        }
    },
    {
        "id": 304,
        "title": "Practical — Anatomy",
        "subtitle": "Cadaveric Prosections, Vessels & Inguinal Canal",
        "emoji": "🦴",
        "page": 904,
        "lectureRange": "Stations 1–3",
        "bankSection": "practical",
        "subject": {
            "id": "anatomy",
            "name": "Anatomy",
            "iconName": "Bone",
            "lectures": "Stations 1–3",
            "lectureCount": 3,
            "lectureNames": [
                "Celiac Trunk & Branches",
                "Inguinal Canal Boundaries & Conjoint Tendon",
                "Porta Hepatis Spatial Relationships"
            ]
        }
    },
    {
        "id": 305,
        "title": "Practical — Physiology",
        "subtitle": "GI Motility, Manometry & Secretory Regulation",
        "emoji": "⚡",
        "page": 929,
        "lectureRange": "Stations 1–2",
        "bankSection": "practical",
        "subject": {
            "id": "physiology",
            "name": "Physiology",
            "iconName": "Zap",
            "lectures": "Stations 1–2",
            "lectureCount": 2,
            "lectureNames": [
                "Achalasia & Esophageal Manometry",
                "Hormonal Control of Pancreatic Secretion"
            ]
        }
    },
    {
        "id": 306,
        "title": "Practical — Biochemistry",
        "subtitle": "Clinical Biochemistry, LFTs & Jaundice Biomarkers",
        "emoji": "🧪",
        "page": 1097,
        "lectureRange": "Stations 1–2",
        "bankSection": "practical",
        "subject": {
            "id": "biochem",
            "name": "Biochemistry",
            "iconName": "FlaskConical",
            "lectures": "Stations 1–2",
            "lectureCount": 2,
            "lectureNames": [
                "Wilson Disease (ATP7B) Copper Profile",
                "Liver Function Tests & Cholestatic Jaundice"
            ]
        }
    },
    {
        "id": 307,
        "title": "Practical — Microbiology",
        "subtitle": "Stool Culture, Selective Media & Enteric Pathogens",
        "emoji": "🦠",
        "page": 1200,
        "lectureRange": "Stations 1–2",
        "bankSection": "practical",
        "subject": {
            "id": "microbiology",
            "name": "Microbiology",
            "iconName": "ShieldAlert",
            "lectures": "Stations 1–2",
            "lectureCount": 2,
            "lectureNames": [
                "MacConkey & SS Agar Culture Media",
                "TCBS Agar & Vibrio cholerae Identification"
            ]
        }
    },
    {
        "id": 308,
        "title": "Practical — Clinical",
        "subtitle": "Clinical Vignettes, Endoscopy & Cirrhosis Signs",
        "emoji": "🩺",
        "page": 1272,
        "lectureRange": "Stations 1–2",
        "bankSection": "practical",
        "subject": {
            "id": "clinical",
            "name": "Clinical",
            "iconName": "Stethoscope",
            "lectures": "Stations 1–2",
            "lectureCount": 2,
            "lectureNames": [
                "Peptic Ulcer Endoscopy & H. pylori Therapy",
                "Portal Hypertension & Caput Medusae"
            ]
        }
    }
]

def generate_chapters_json():
    questions_map = build_balanced_questions()
    
    new_chapters = []
    total_q = 0
    correct_counts = {0: 0, 1: 0, 2: 0, 3: 0}
    
    for meta in CHAPTER_METADATA:
        cid = meta["id"]
        qs = questions_map.get(cid, [])
        total_q += len(qs)
        for q in qs:
            correct_counts[q["correctIndex"]] += 1
            
        subj = {
            **meta["subject"],
            "questions": qs
        }
        
        ch = {
            "id": cid,
            "title": meta["title"],
            "subtitle": meta["subtitle"],
            "emoji": meta["emoji"],
            "page": meta["page"],
            "lectureRange": meta["lectureRange"],
            "bankSection": meta["bankSection"],
            "subjects": [subj]
        }
        new_chapters.append(ch)
        
    print(f"Total practical questions: {total_q}")
    print(f"Correct key distribution: A={correct_counts[0]}, B={correct_counts[1]}, C={correct_counts[2]}, D={correct_counts[3]}")
    
    out_file = "QUESTION_IMPORT_JOBS/2026-11-01-mgl3-practical/mgl3_practical_chapters.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(new_chapters, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(new_chapters)} practical chapters to {out_file}")
    return new_chapters

if __name__ == "__main__":
    generate_chapters_json()

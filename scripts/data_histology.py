# scripts/data_histology.py
"""
Official 28 Histology Practical Revision Questions for Year 3 GIT (MGL-3).
All questions are authentic spotter exam questions with NO giveaways in question stems.
All images are clean raw micrographs without labels or text.
"""

HISTOLOGY_QUESTIONS = [
    {
        "seq": 1,
        "lecture": 1,
        "text": "Examine this low-power histological section of the alimentary canal. Identify this organ:",
        "correct_answer": "Esophagus",
        "distractors": [
            "Duodenum",
            "Pyloric stomach",
            "Jejunum"
        ],
        "explanation": "Criteria of Identification: Non-keratinized stratified squamous epithelium, prominent muscularis mucosae, and submucosal tubuloacinar esophageal glands proper.",
        "keyConcept": "Esophagus: non-keratinized stratified squamous epithelium with submucosal esophageal glands proper.",
        "imageUrl": "/images/practical/mgl-3/histology/esophagus_lm.webp"
    },
    {
        "seq": 2,
        "lecture": 1,
        "text": "Examine this histological section of the small intestine. Identify this specific segment:",
        "correct_answer": "Duodenum",
        "distractors": [
            "Ileum",
            "Jejunum",
            "Vermiform appendix"
        ],
        "explanation": "Criteria of Identification: Intestinal villi and crypts with pathognomonic submucosal branched Brunner's glands secreting alkaline bicarbonate-rich mucus.",
        "keyConcept": "Duodenum: diagnostic submucosal Brunner's glands producing protective alkaline mucus.",
        "imageUrl": "/images/practical/mgl-3/histology/duodenum_brunner_lm.webp"
    },
    {
        "seq": 3,
        "lecture": 1,
        "text": "Examine this small intestinal histological section. Identify this segment:",
        "correct_answer": "Jejunum",
        "distractors": [
            "Duodenum",
            "Ileum",
            "Cecum"
        ],
        "explanation": "Criteria of Identification: Exceptionally tall, slender mucosal villi and prominent plicae circulares, lacking both submucosal Brunner's glands and aggregated Peyer's patches.",
        "keyConcept": "Jejunum: tall, well-developed villi without Brunner's glands or prominent Peyer's patches.",
        "imageUrl": "/images/practical/mgl-3/histology/jejunum_villi_lm.webp"
    },
    {
        "seq": 4,
        "lecture": 1,
        "text": "Examine this histological section of the distal small intestine. Identify the diagnostic lymphoid aggregates indicated:",
        "correct_answer": "Peyer's patches in the ileum",
        "distractors": [
            "Brunner's glands in duodenum",
            "Taeniae coli in large colon",
            "Demilunes in salivary gland"
        ],
        "explanation": "Criteria of Identification: Large aggregates of secondary lymphoid follicles (Peyer's patches) occupying lamina propria and submucosa on the antimesenteric border.",
        "keyConcept": "Ileum: hallmark aggregated lymphoid nodules (Peyer's patches) along the antimesenteric wall.",
        "imageUrl": "/images/practical/mgl-3/histology/ileum_peyer_lm.webp"
    },
    {
        "seq": 5,
        "lecture": 2,
        "text": "Examine this histological section of the lower gastrointestinal tract. Identify this specimen:",
        "correct_answer": "Colon (Large intestine)",
        "distractors": [
            "Jejunum (Small intestine)",
            "Duodenum (Small intestine)",
            "Gastric body mucosa"
        ],
        "explanation": "Criteria of Identification: Flat mucosal surface without villi, straight parallel crypts of Lieberkuhn densely lined by goblet cells, and outer longitudinal taeniae coli.",
        "keyConcept": "Colon: absence of villi with straight parallel crypts densely populated by goblet cells.",
        "imageUrl": "/images/practical/mgl-3/histology/colon_crypts_lm.webp"
    },
    {
        "seq": 6,
        "lecture": 2,
        "text": "Examine this cross-section of a tubular gastrointestinal organ. Identify this specimen:",
        "correct_answer": "Vermiform appendix",
        "distractors": [
            "Sigmoid colon",
            "Pyloric canal",
            "Gallbladder"
        ],
        "explanation": "Criteria of Identification: Narrow, irregular star-shaped lumen, absent villi, shallow crypts, and a complete confluent ring of prominent lymphoid follicles effacing the submucosa.",
        "keyConcept": "Appendix: narrow stellate lumen with a circumferential ring of prominent lymphoid follicles.",
        "imageUrl": "/images/practical/mgl-3/histology/appendix_lymphoid_lm.webp"
    },
    {
        "seq": 7,
        "lecture": 2,
        "text": "Examine this histological section from the dorsal lingual mucosa. Identify these pointed surface papillae:",
        "correct_answer": "Filiform papillae",
        "distractors": [
            "Fungiform papillae",
            "Circumvallate papillae",
            "Foliate papillae"
        ],
        "explanation": "Criteria of Identification: Pointed conical projections covered by keratinized stratified squamous epithelium, serving a mechanical role and uniquely lacking taste buds.",
        "keyConcept": "Filiform papillae: pointed keratinized projections providing mechanical friction, devoid of taste buds.",
        "imageUrl": "/images/practical/mgl-3/histology/tongue_filiform_lm.webp"
    },
    {
        "seq": 8,
        "lecture": 2,
        "text": "Examine this sagittal histological section showing a mucocutaneous transition. Identify this organ:",
        "correct_answer": "Lip (Labium)",
        "distractors": [
            "Eyelid (Palpebra)",
            "Hard palate mucosa",
            "Anal transition zone"
        ],
        "explanation": "Criteria of Identification: External hairy skin, intermediate vermilion red margin with high vascular papillae and translucent stratum corneum, and internal oral mucosa over orbicularis oris.",
        "keyConcept": "Lip: transition from external hairy skin to translucent vermilion margin and internal oral mucosa.",
        "imageUrl": "/images/practical/mgl-3/histology/lip_histology_lm.webp"
    },
    {
        "seq": 9,
        "lecture": 3,
        "text": "Examine this histological section of the gastric wall. Identify this specific anatomical region:",
        "correct_answer": "Fundus and body of stomach",
        "distractors": [
            "Pyloric region of stomach",
            "Cardia region of stomach",
            "Duodenal bulb mucosa"
        ],
        "explanation": "Criteria of Identification: Shallow gastric pits (1/4 of mucosal thickness) and straight tubular glands densely packed with acidophilic parietal cells and basophilic chief cells.",
        "keyConcept": "Gastric fundus/body: shallow pits with straight glands rich in parietal and chief cells.",
        "imageUrl": "/images/practical/mgl-3/histology/stomach_fundus_lm.webp"
    },
    {
        "seq": 10,
        "lecture": 3,
        "text": "Examine this gastric histological section. Identify this specific anatomical region:",
        "correct_answer": "Pylorus of stomach",
        "distractors": [
            "Fundus of stomach",
            "Corpus of stomach",
            "Esophageal junction"
        ],
        "explanation": "Criteria of Identification: Deep, branched gastric pits (extending 1/2 or more into mucosal depth) and branched, coiled tubular glands lined by pale mucus-secreting cells.",
        "keyConcept": "Pylorus: deep branching gastric pits leading into coiled, mucus-secreting tubular glands.",
        "imageUrl": "/images/practical/mgl-3/histology/stomach_pylorus_lm.webp"
    },
    {
        "seq": 11,
        "lecture": 3,
        "text": "Examine this histological section of liver parenchyma. Identify this structural unit:",
        "correct_answer": "Classical liver lobule",
        "distractors": [
            "Portal lobule unit",
            "Hepatic acinus of Rappaport",
            "Splenic red pulp cord"
        ],
        "explanation": "Criteria of Identification: Hexagonal structural prism centered on a terminal central venule, with radiating hepatocyte plates separated by vascular sinusoids toward portal triads.",
        "keyConcept": "Classical liver lobule: hexagonal structural unit centered on a terminal central venule.",
        "imageUrl": "/images/practical/mgl-3/histology/liver_lobule_lm.webp"
    },
    {
        "seq": 12,
        "lecture": 3,
        "text": "Examine this histological section of a hollow digestive organ wall. Identify this organ:",
        "correct_answer": "Gallbladder",
        "distractors": [
            "Urinary bladder",
            "Ampulla of ductus deferens",
            "Uterine fallopian tube"
        ],
        "explanation": "Criteria of Identification: Highly folded mucosa lined by tall simple columnar epithelium with brush border, resting directly on a fibromuscular coat without muscularis mucosae or submucosa.",
        "keyConcept": "Gallbladder: tall columnar epithelium with folded mucosa lacking muscularis mucosae and submucosa.",
        "imageUrl": "/images/practical/mgl-3/histology/liver_gallbladder_lm.webp"
    },
    {
        "seq": 13,
        "lecture": 4,
        "text": "Examine this histological section of a major salivary gland. Identify this gland:",
        "correct_answer": "Submandibular gland",
        "distractors": [
            "Parotid salivary gland",
            "Sublingual salivary gland",
            "Exocrine pancreas"
        ],
        "explanation": "Criteria of Identification: Mixed seromucous gland with serous predominance (~80%), crescentic serous demilunes of Giannuzzi capping mucous acini, and prominent striated ducts.",
        "keyConcept": "Submandibular gland: serous-predominant mixed acini with classic demilunes of Giannuzzi.",
        "imageUrl": "/images/practical/mgl-3/histology/submandibular_gland_lm.webp"
    },
    {
        "seq": 14,
        "lecture": 4,
        "text": "Examine this histological section of a parenchymal digestive organ. Identify this organ:",
        "correct_answer": "Pancreas",
        "distractors": [
            "Parotid salivary gland",
            "Submandibular gland",
            "Thyroid gland tissue"
        ],
        "explanation": "Criteria of Identification: Purely serous secretory acini with intra-acinar centroacinar cells, absence of striated ducts, and pale endocrine Islets of Langerhans.",
        "keyConcept": "Pancreas: purely serous acini with centroacinar cells and endocrine Islets of Langerhans.",
        "imageUrl": "/images/practical/mgl-3/histology/pancreas_islets_lm.webp"
    },
    {
        "seq": 15,
        "lecture": 4,
        "text": "In this high-resolution scanning electron micrograph (SEM) of the dorsal tongue, identify these surface papillae:",
        "correct_answer": "Filiform papillae",
        "distractors": [
            "Fungiform papillae",
            "Circumvallate papillae",
            "Foliate papillae"
        ],
        "explanation": "Criteria of Identification: Tapering conical, hook-like keratinized projections providing abrasive mechanical grip for food manipulation without taste receptors.",
        "keyConcept": "Filiform papillae SEM: pointed mechanical projections forming an abrasive dorsal surface.",
        "imageUrl": "/images/practical/mgl-3/histology/sem_filiform_papillae.webp"
    },
    {
        "seq": 16,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM) of an intraepithelial taste bud, identify the apical sensory opening:",
        "correct_answer": "Taste pore",
        "distractors": [
            "Striated border canal",
            "Bile canaliculus cleft",
            "Junctional complex gate"
        ],
        "explanation": "Criteria of Identification: Constricted apical mucosal opening through which microvilli of sensory gustatory cells contact dissolved chemical tastants.",
        "keyConcept": "Taste pore: apical microvillar opening mediating chemical contact between tastants and gustatory receptors.",
        "imageUrl": "/images/practical/mgl-3/histology/taste_bud_tem.webp"
    },
    {
        "seq": 17,
        "lecture": 5,
        "text": "Examine this transmission electron micrograph (TEM) of a salivary secretory unit. Identify this structure:",
        "correct_answer": "Mucous acinus",
        "distractors": [
            "Serous acinus",
            "Parietal oxyntic cell",
            "Pancreatic acinar cell"
        ],
        "explanation": "Criteria of Identification: Basally flattened heterochromatic nucleus compressed against basement membrane, with cytoplasm packed with electron-lucent mucinogen droplets.",
        "keyConcept": "Mucous acinus TEM: basally flattened nucleus with electron-lucent, pale mucinogen droplets.",
        "imageUrl": "/images/practical/mgl-3/histology/mucous_acinus_tem.webp"
    },
    {
        "seq": 18,
        "lecture": 5,
        "text": "Examine this transmission electron micrograph (TEM) of a salivary acinar cell. Identify this cell:",
        "correct_answer": "Serous acinar cell",
        "distractors": [
            "Mucous acinar cell",
            "Intestinal goblet cell",
            "Enteroendocrine cell"
        ],
        "explanation": "Criteria of Identification: Rounded euchromatic basal nucleus, extensive parallel stacks of rough endoplasmic reticulum, and dense apical zymogen secretory granules.",
        "keyConcept": "Serous acinus TEM: prominent basal rough ER stacks with apical electron-dense zymogen granules.",
        "imageUrl": "/images/practical/mgl-3/histology/serous_acinus_tem.webp"
    },
    {
        "seq": 19,
        "lecture": 5,
        "text": "Examine this transmission electron micrograph (TEM) of a gastric epithelial cell. Identify this cell:",
        "correct_answer": "Parietal (Oxyntic) cell",
        "distractors": [
            "Chief (Peptic) cell",
            "Mucous neck cell",
            "Enterochromaffin cell"
        ],
        "explanation": "Criteria of Identification: Deep intracellular secretory canaliculi lined by microvilli, tubulovesicular membrane system, and abundant mitochondria supplying ATP for H+/K+ ATPase pumps.",
        "keyConcept": "Parietal cell TEM: deep intracellular secretory canaliculi, tubulovesicles, and dense mitochondria.",
        "imageUrl": "/images/practical/mgl-3/histology/parietal_cell_tem.webp"
    },
    {
        "seq": 20,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM) of gut epithelium, identify this sensory endocrine cell:",
        "correct_answer": "Open-type enteroendocrine cell",
        "distractors": [
            "Closed-type enteroendocrine cell",
            "Absorptive enterocyte cell",
            "Crypt Paneth granule cell"
        ],
        "explanation": "Criteria of Identification: Reaches the intestinal lumen via apical microvilli acting as chemoreceptors, with basal neuroendocrine granules directed toward lamina propria capillaries.",
        "keyConcept": "Open enteroendocrine cell: apical sensory microvilli sampling luminal contents with basal secretory granules.",
        "imageUrl": "/images/practical/mgl-3/histology/enteroendocrine_open_tem.webp"
    },
    {
        "seq": 21,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM) of intestinal epithelium, identify this basal endocrine cell:",
        "correct_answer": "Closed-type enteroendocrine cell",
        "distractors": [
            "Open-type enteroendocrine cell",
            "Intestinal goblet cell",
            "Parietal oxyntic cell"
        ],
        "explanation": "Criteria of Identification: Rests along the basal lamina without apical luminal contact, responding to mechanical stretch or paracrine cues, with basal secretory granules.",
        "keyConcept": "Closed enteroendocrine cell: basally situated endocrine cell lacking direct apical luminal contact.",
        "imageUrl": "/images/practical/mgl-3/histology/enteroendocrine_closed_tem.webp"
    },
    {
        "seq": 22,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) between adjacent hepatocytes, identify this intercellular channel:",
        "correct_answer": "Bile canaliculus",
        "distractors": [
            "Sinusoidal capillary lumen",
            "Perisinusoidal space of Disse",
            "Terminal central venule"
        ],
        "explanation": "Criteria of Identification: Intercellular channel formed by plasma membranes of adjacent hepatocytes, lined by short microvilli and sealed by tight junctional complexes (zonulae occludentes).",
        "keyConcept": "Bile canaliculus: intercellular bile channel sealed by tight junctions between adjacent hepatocytes.",
        "imageUrl": "/images/practical/mgl-3/histology/bile_canaliculus_tem.webp"
    },
    {
        "seq": 23,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of hepatic parenchyma, identify this perisinusoidal compartment:",
        "correct_answer": "Perisinusoidal space of Disse",
        "distractors": [
            "Canal of Hering lumen",
            "Interlobular bile duct",
            "Subcapsular hepatic cleft"
        ],
        "explanation": "Criteria of Identification: Sub-endothelial gap between fenestrated sinusoidal endothelial cells and hepatocyte microvilli, containing fat- and vitamin A-storing Ito (hepatic stellate) cells.",
        "keyConcept": "Space of Disse: perisinusoidal microvillar compartment containing vitamin A-storing Ito cells.",
        "imageUrl": "/images/practical/mgl-3/histology/space_of_disse_tem.webp"
    },
    {
        "seq": 24,
        "lecture": 6,
        "text": "In this scanning electron micrograph (SEM) of hepatic sinusoidal endothelium, identify these clustered fenestrations:",
        "correct_answer": "Endothelial sieve plates",
        "distractors": [
            "Basal infoldings canaliculi",
            "Canaliculi of Hering",
            "Macula adherens desmosomes"
        ],
        "explanation": "Criteria of Identification: Grouped transcellular fenestrations lacking diaphragms organized into sieve plates, facilitating macromolecular exchange with the space of Disse.",
        "keyConcept": "Sieve plates: clustered sinusoidal endothelial fenestrations facilitating macromolecular hepatic exchange.",
        "imageUrl": "/images/practical/mgl-3/histology/sinusoid_sieve_plates_sem.webp"
    },
    {
        "seq": 25,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of pancreatic tissue, identify these apical secretory organelles:",
        "correct_answer": "Zymogen secretory granules",
        "distractors": [
            "Mucinogen pale droplets",
            "Secondary lipofuscin granules",
            "Glycogen storage rosettes"
        ],
        "explanation": "Criteria of Identification: Round, electron-dense membrane-bound apical granules storing digestive proenzymes (trypsinogen, chymotrypsinogen, amylase) awaiting exocytosis.",
        "keyConcept": "Zymogen granules: electron-dense apical secretory organelles storing proenzyme digestive cascades.",
        "imageUrl": "/images/practical/mgl-3/histology/pancreatic_acinar_tem.webp"
    },
    {
        "seq": 26,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of the enterocyte apical pole, identify this specialized surface border:",
        "correct_answer": "Striated (Brush) border",
        "distractors": [
            "Motile ciliary apparatus",
            "Stereociliary projections",
            "Basolateral interdigitations"
        ],
        "explanation": "Criteria of Identification: Dense, parallel cylindrical microvilli anchored into the underlying actin-rich terminal web, multiplying absorptive surface area 20-fold.",
        "keyConcept": "Striated border: dense parallel microvilli anchored to terminal web, dramatically increasing absorptive surface.",
        "imageUrl": "/images/practical/mgl-3/histology/striated_border_tem.webp"
    },
    {
        "seq": 27,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of intestinal epithelium, identify this mucus-secreting cell:",
        "correct_answer": "Intestinal goblet cell",
        "distractors": [
            "Paneth cell of Lieberkuhn",
            "Enteroendocrine cell",
            "Absorptive columnar cell"
        ],
        "explanation": "Criteria of Identification: Polarized unicellular gland with narrow basal stem and expanded apical theca filled with electron-lucent mucinogen granules that lubricate the mucosa.",
        "keyConcept": "Goblet cell: apical cup filled with mucinogen granules providing protective lubricating mucosal barrier.",
        "imageUrl": "/images/practical/mgl-3/histology/goblet_cell_tem.webp"
    },
    {
        "seq": 28,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of an intestinal crypt base, identify these granule-filled cells:",
        "correct_answer": "Paneth cells",
        "distractors": [
            "Chief peptic cells",
            "Parietal oxyntic cells",
            "Mucous neck cells"
        ],
        "explanation": "Criteria of Identification: Pyramidal cells residing at the base of crypts of Lieberkuhn containing large, intensely electron-dense apical granules discharging lysozyme, defensins, and zinc.",
        "keyConcept": "Paneth cells: crypt-base cells with prominent antimicrobial granules secreting lysozyme and defensins.",
        "imageUrl": "/images/practical/mgl-3/histology/paneth_cells_tem.webp"
    }
]

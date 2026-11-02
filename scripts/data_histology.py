# scripts/data_histology.py
"""
Official 28 Histology Practical Revision Questions for Year 3 GIT (MGL-3).
All questions are authentic spotter exam questions following ASU Faculty of Medicine guidelines:
- Balanced mix of direct slide identification and defining diagnostic histological features (Criteria of Identification).
- All images are verified clean raw micrographs without labels or text.
"""

HISTOLOGY_QUESTIONS = [
    {
        "seq": 1,
        "lecture": 1,
        "text": "Examine this low-power histological section of the alimentary canal. Identify the characteristic diagnostic feature of this organ:",
        "correct_answer": "Non-keratinized stratified squamous epithelium and submucosal esophageal glands proper",
        "distractors": [
            "Simple columnar epithelium with branched Brunner's glands in the submucosa",
            "Simple columnar epithelium with prominent Peyer's patches in the lamina propria and submucosa",
            "Simple columnar epithelium with deep regular crypts and complete absence of villi"
        ],
        "explanation": "Criteria of Identification: The esophagus is characterized by a thick protective non-keratinized stratified squamous epithelium, a prominent muscularis mucosae, and branched tubuloacinar esophageal glands proper situated in the submucosa.",
        "keyConcept": "Esophagus: non-keratinized stratified squamous epithelium + submucosal esophageal glands proper.",
        "imageUrl": "/images/practical/mgl-3/histology/esophagus_lm.webp"
    },
    {
        "seq": 2,
        "lecture": 1,
        "text": "Examine this histological section of the small intestine. Identify the characteristic diagnostic feature of this segment:",
        "correct_answer": "Submucosal branched tubuloacinar Brunner's glands",
        "distractors": [
            "Aggregated lymphoid nodules (Peyer's patches) occupying the antimesenteric submucosa",
            "Tall finger-like mucosal villi with complete absence of submucosal glands",
            "Thick non-keratinized stratified squamous epithelium with submucosal glands"
        ],
        "explanation": "Criteria of Identification: Duodenum is definitively identified by the presence of branched tubuloacinar Brunner's glands situated in the submucosa (beneath the muscularis mucosae), which secrete alkaline bicarbonate-rich fluid to neutralize acidic gastric chyme.",
        "keyConcept": "Duodenum: mucosal villi + submucosal branched mucous Brunner's glands.",
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
            "Colon"
        ],
        "explanation": "Criteria of Identification: Jejunum displays tall, well-developed, finger-like mucosal villi with central lacteals and well-developed plicae circulares, but lacks both submucosal Brunner's glands (distinguishing it from duodenum) and aggregated Peyer's patches (distinguishing it from ileum).",
        "keyConcept": "Jejunum: tall mucosal villi with lacteals; absence of Brunner's glands and absence of Peyer's patches.",
        "imageUrl": "/images/practical/mgl-3/histology/jejunum_villi_lm.webp"
    },
    {
        "seq": 4,
        "lecture": 1,
        "text": "Examine this histological section of the distal small intestine. Identify the characteristic diagnostic lymphoid aggregates shown:",
        "correct_answer": "Peyer's patches on the antimesenteric border",
        "distractors": [
            "Brunner's glands occupying the submucosa",
            "Isolated solitary lymphatic follicles distributed evenly all around the circumference",
            "Paneth cell clusters restricted to the basal lamina"
        ],
        "explanation": "Criteria of Identification: Ileum is characterized by aggregated lymphoid nodules (Peyer's patches) that occupy the lamina propria and extend into the submucosa, located exclusively on the antimesenteric border.",
        "keyConcept": "Ileum: Peyer's patches (aggregated lymphoid nodules occupying lamina propria and submucosa on the antimesenteric side).",
        "imageUrl": "/images/practical/mgl-3/histology/ileum_peyer_lm.webp"
    },
    {
        "seq": 5,
        "lecture": 1,
        "text": "Examine this histological section of the lower gastrointestinal tract. Identify the characteristic diagnostic feature of this organ:",
        "correct_answer": "Deep regular straight mucosal crypts lined by abundant goblet cells and complete absence of villi",
        "distractors": [
            "Mucosal finger-like villi lined by enterocytes and central lacteals",
            "Complete circular ring of lymphoid nodules occupying the entire circumference",
            "Non-keratinized stratified squamous epithelium and submucosal mucous glands"
        ],
        "explanation": "Criteria of Identification: Large intestine (colon) is distinguished by a flat luminal surface devoid of villi, containing long, straight, parallel mucosal crypts of Lieberkühn densely populated with mucus-secreting goblet cells.",
        "keyConcept": "Colon: long straight mucosal crypts packed with goblet cells; villi and submucosal glands are absent.",
        "imageUrl": "/images/practical/mgl-3/histology/colon_crypts_lm.webp"
    },
    {
        "seq": 6,
        "lecture": 1,
        "text": "Examine this cross-section of a tubular gastrointestinal organ. Identify the characteristic diagnostic feature of this specimen:",
        "correct_answer": "Complete uninterrupted circular ring of lymphoid follicles in the wall with a narrow stellate lumen",
        "distractors": [
            "Peyer's patches restricted exclusively to the antimesenteric border",
            "Submucosal branched tubuloacinar Brunner's glands",
            "Deep mucosal crypts without lymphoid tissue and wide open circular lumen"
        ],
        "explanation": "Criteria of Identification: The vermiform appendix exhibits a small, irregular, stellate lumen and a continuous, confluent ring of lymphoid nodules occupying the lamina propria and submucosa around its entire circumference.",
        "keyConcept": "Appendix: narrow stellate lumen with a continuous ring of lymphoid follicles in the mucosa and submucosa.",
        "imageUrl": "/images/practical/mgl-3/histology/appendix_lymphoid_lm.webp"
    },
    {
        "seq": 7,
        "lecture": 2,
        "text": "Examine this histological section of the dorsal lingual mucosa. Identify these pointed surface projections:",
        "correct_answer": "Filiform papillae",
        "distractors": [
            "Fungiform papillae",
            "Circumvallate papillae",
            "Foliate papillae"
        ],
        "explanation": "Criteria of Identification: Filiform papillae are the most abundant lingual papillae, recognized by their pointed, conical shape and covering of partially keratinized stratified squamous epithelium; they provide mechanical friction and lack taste buds.",
        "keyConcept": "Filiform papillae: most numerous, pointed conical keratinized papillae lacking taste buds.",
        "imageUrl": "/images/practical/mgl-3/histology/tongue_filiform_lm.webp"
    },
    {
        "seq": 8,
        "lecture": 2,
        "text": "Examine this sagittal histological section of the lip. Identify the three characteristic anatomical zones of this organ:",
        "correct_answer": "Outer skin with hair follicles, vermilion red margin, and inner oral mucosa with labial glands",
        "distractors": [
            "Outer keratinized epidermis, middle cartilaginous plate, and inner ciliated columnar mucosa",
            "Outer non-keratinized mucosa, middle serous acini, and inner skeletal muscle core",
            "Outer skin with sweat glands, middle fibrous septum, and inner stratified columnar mucosa"
        ],
        "explanation": "Criteria of Identification: The lip displays a tripartite structure: an outer cutaneous surface (thin skin with hair follicles and sebaceous glands), a transitional vermilion border (tall vascular dermal papillae imparting red color), and an inner oral mucosal surface (thick non-keratinized stratified squamous epithelium with submucosal labial glands).",
        "keyConcept": "Lip: skin surface (hair & sebaceous glands), vermilion red margin (tall dermal papillae), and mucosal surface (labial mucous glands).",
        "imageUrl": "/images/practical/mgl-3/histology/lip_histology_lm.webp"
    },
    {
        "seq": 9,
        "lecture": 2,
        "text": "Examine this histological section of the gastric mucosa. Identify the characteristic mucosal architecture of this anatomical region:",
        "correct_answer": "Short narrow gastric pits (occupying 1/4 of mucosal thickness) and long straight tubular fundic glands",
        "distractors": [
            "Deep wide branched gastric pits (occupying 1/2 of mucosal thickness) and coiled mucous glands",
            "Mucosal finger-like villi lined by enterocytes and goblet cells",
            "Non-keratinized stratified squamous epithelium with submucosal mucous glands"
        ],
        "explanation": "Criteria of Identification: Gastric fundus/body exhibits shallow, narrow gastric pits occupying approximately one-fourth of the mucosal thickness, leading into long, straight, tightly packed tubular fundic glands containing abundant acid-producing parietal cells and enzyme-producing chief cells.",
        "keyConcept": "Fundus / body of stomach: short narrow pits (1/4 mucosal depth) + straight tubular glands packed with parietal and chief cells.",
        "imageUrl": "/images/practical/mgl-3/histology/stomach_fundus_lm.webp"
    },
    {
        "seq": 10,
        "lecture": 2,
        "text": "Examine this histological section of the gastric mucosa. Identify the characteristic mucosal architecture of this anatomical region:",
        "correct_answer": "Deep wide branched gastric pits (occupying 1/2 of mucosal thickness) and coiled branched mucous glands",
        "distractors": [
            "Short narrow gastric pits (occupying 1/4 of mucosal thickness) and straight tubular glands",
            "Mucosal villi with submucosal branched tubuloacinar Brunner's glands",
            "Absence of surface pits with deep crypts lined predominantly by goblet cells"
        ],
        "explanation": "Criteria of Identification: Pyloric stomach is characterized by deep, wide, branched gastric pits extending through half or more of the mucosal thickness, leading into coiled, branched tubular pyloric glands that secrete protective alkaline mucus.",
        "keyConcept": "Pylorus: deep wide branched pits (1/2 mucosal depth) + branched coiled mucous glands with mucus-secreting cells and G cells.",
        "imageUrl": "/images/practical/mgl-3/histology/stomach_pylorus_lm.webp"
    },
    {
        "seq": 11,
        "lecture": 3,
        "text": "Examine this histological section of parenchymal digestive tissue. Identify this organ:",
        "correct_answer": "Liver",
        "distractors": [
            "Pancreas",
            "Spleen",
            "Lymph node"
        ],
        "explanation": "Criteria of Identification: Liver parenchyma is organized into classic hexagonal lobules centered around a central vein, from which cords and plates of hepatocytes radiate outward, separated by vascular sinusoids and bounded peripherally by portal triads (portal vein branch, hepatic artery branch, bile ductule).",
        "keyConcept": "Liver: classic hexagonal hepatic lobules centered on central veins with radiating plates of hepatocytes and peripheral portal triads.",
        "imageUrl": "/images/practical/mgl-3/histology/liver_lobule_lm.webp"
    },
    {
        "seq": 12,
        "lecture": 3,
        "text": "Examine this histological section of the gallbladder wall. Identify the characteristic architectural feature of this organ:",
        "correct_answer": "Highly folded mucosa lined by simple columnar absorptive cells, complete absence of submucosa, and a fibromuscular coat",
        "distractors": [
            "Flat mucosal lining, well-developed submucosa with mucous glands, and distinct muscularis mucosae",
            "Stratified squamous epithelium, prominent muscularis mucosae, and thick submucosa",
            "Mucosal villi, prominent submucosa with Brunner's glands, and serosa"
        ],
        "explanation": "Criteria of Identification: Gallbladder wall possesses prominent, branching mucosal rugae lined by tall simple columnar cells with microvilli; uniquely, it lacks a muscularis mucosae and submucosa, so the lamina propria rests directly against an irregular fibromuscular layer.",
        "keyConcept": "Gallbladder: branched mucosal folds lined by tall simple columnar cells; lacks muscularis mucosae and lacks submucosa.",
        "imageUrl": "/images/practical/mgl-3/histology/liver_gallbladder_lm.webp"
    },
    {
        "seq": 13,
        "lecture": 4,
        "text": "Examine this histological section of a major salivary gland. What is the characteristic secretory feature of this gland?",
        "correct_answer": "Mixed seromucous gland with serous demilunes capping mucous acini and predominant serous units",
        "distractors": [
            "Pure serous acinar gland with abundant fat cells and no mucous units",
            "Pure mucous gland with flat basal nuclei and no serous elements",
            "Endocrine cords separated by fenestrated capillaries without ducts"
        ],
        "explanation": "Criteria of Identification: Submandibular salivary gland is a compound tubuloacinar gland containing mixed secretory units, predominantly serous acini interspersed with mucous acini capped by crescentic serous demilunes (demilunes of Giannuzzi).",
        "keyConcept": "Submandibular gland: mixed seromucous salivary gland with serous demilunes (crescents of Giannuzzi) and predominantly serous acini.",
        "imageUrl": "/images/practical/mgl-3/histology/submandibular_gland_lm.webp"
    },
    {
        "seq": 14,
        "lecture": 4,
        "text": "Examine this histological section of the pancreas. What histological feature distinguishes it from the parotid salivary gland?",
        "correct_answer": "Islets of Langerhans and centroacinar cells within serous acini, with absence of striated ducts",
        "distractors": [
            "Prominent striated intralobular ducts and abundant adipose tissue infiltration",
            "Serous demilunes capping mucous acini and branched excretory ducts",
            "Submucosal tubuloacinar glands and lymphoid nodules"
        ],
        "explanation": "Criteria of Identification: The exocrine pancreas resembles the parotid gland in possessing pure serous acini, but is definitively distinguished by the presence of pale endocrine Islets of Langerhans, centroacinar cells extending into acinar lumina, and the complete absence of striated ducts.",
        "keyConcept": "Pancreas: pure serous exocrine acini with centroacinar cells + endocrine Islets of Langerhans; lacks striated ducts.",
        "imageUrl": "/images/practical/mgl-3/histology/pancreas_islets_lm.webp"
    },
    {
        "seq": 15,
        "lecture": 5,
        "text": "In this scanning electron micrograph (SEM) of the dorsal tongue, identify these pointed surface papillae:",
        "correct_answer": "Filiform papillae",
        "distractors": [
            "Fungiform papillae",
            "Circumvallate papillae",
            "Foliate papillae"
        ],
        "explanation": "Criteria of Identification: High-power scanning electron microscopy demonstrates the characteristic slender, claw-like conical architecture of filiform papillae covering the dorsal lingual surface.",
        "keyConcept": "Filiform papillae (SEM): conical tapered keratinized surface projections lacking taste buds.",
        "imageUrl": "/images/practical/mgl-3/histology/sem_filiform_papillae.webp"
    },
    {
        "seq": 16,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM), identify this intraepithelial sensory receptor:",
        "correct_answer": "Taste bud",
        "distractors": [
            "Meissner's corpuscle",
            "Pacinian corpuscle",
            "Olfactory vesicle"
        ],
        "explanation": "Criteria of Identification: Transmission electron microscopy demonstrates an intraepithelial, barrel-shaped sensory end-organ spanning the epithelial thickness, composed of elongate supporting cells, gustatory sensory cells with apical microvilli, and basal stem cells.",
        "keyConcept": "Taste bud (TEM): intraepithelial sensory end-organ with gustatory cells and apical microvilli reaching a taste pore.",
        "imageUrl": "/images/practical/mgl-3/histology/taste_bud_tem.webp"
    },
    {
        "seq": 17,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM) of a salivary secretory unit, identify this structure:",
        "correct_answer": "Mucous acinus",
        "distractors": [
            "Serous acinus",
            "Parietal oxyntic cell",
            "Striated duct cell"
        ],
        "explanation": "Criteria of Identification: Mucous acinar cells show basally flattened, heterochromatic nuclei compressed against the basement membrane by abundant, crowded apical electron-lucent mucigen droplets.",
        "keyConcept": "Mucous acinus (TEM): compressed flat basal nuclei + apical electron-lucent mucigen droplets.",
        "imageUrl": "/images/practical/mgl-3/histology/mucous_acinus_tem.webp"
    },
    {
        "seq": 18,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM) of a salivary acinus, identify this cell type:",
        "correct_answer": "Serous acinar cell",
        "distractors": [
            "Mucous acinar cell",
            "Myoepithelial basket cell",
            "Centroacinar duct cell"
        ],
        "explanation": "Criteria of Identification: Serous acinar cells display a spherical, euchromatic basal nucleus, extensive parallel cisternae of rough endoplasmic reticulum (rER) in the basal cytoplasm, and prominent, spherical, electron-dense zymogen granules stored apically.",
        "keyConcept": "Serous cell (TEM): round basal nucleus + extensive basal rER + apical electron-dense zymogen granules.",
        "imageUrl": "/images/practical/mgl-3/histology/serous_acinus_tem.webp"
    },
    {
        "seq": 19,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM) of a gastric gland cell, identify this cell type:",
        "correct_answer": "Parietal (oxyntic) cell",
        "distractors": [
            "Chief (peptic) cell",
            "Mucous neck cell",
            "Enterochromaffin-like cell"
        ],
        "explanation": "Criteria of Identification: Parietal (oxyntic) cells are characterized by deep, branching intracellular secretory canaliculi lined by dense microvilli, a tubulovesicular membrane system, and an extraordinary abundance of large mitochondria with dense cristae required for active H+/K+-ATPase proton pumping.",
        "keyConcept": "Parietal cell (TEM): intracellular canaliculi with microvilli + tubulovesicular system + abundant mitochondria.",
        "imageUrl": "/images/practical/mgl-3/histology/parietal_cell_tem.webp"
    },
    {
        "seq": 20,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of intestinal epithelium, identify this neuroendocrine cell:",
        "correct_answer": "Open enteroendocrine cell",
        "distractors": [
            "Closed enteroendocrine cell",
            "Paneth cell",
            "Absorptive enterocyte"
        ],
        "explanation": "Criteria of Identification: Open enteroendocrine cells are bottle-shaped cells whose narrow apical process reaches the intestinal lumen with sensory microvilli (sampling luminal contents), while membrane-bound dense-core neurosecretory granules are polarized toward the basal lamina for paracrine release into capillaries.",
        "keyConcept": "Open enteroendocrine cell (TEM): apical pole reaches lumen with sensory microvilli + basal dense-core granules.",
        "imageUrl": "/images/practical/mgl-3/histology/enteroendocrine_open_tem.webp"
    },
    {
        "seq": 21,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of gut epithelium, identify this neuroendocrine cell:",
        "correct_answer": "Closed enteroendocrine cell",
        "distractors": [
            "Open enteroendocrine cell",
            "Goblet cell",
            "M-cell (microfold cell)"
        ],
        "explanation": "Criteria of Identification: Closed enteroendocrine cells rest directly upon the basal lamina and do not extend to the mucosal lumen, responding primarily to mechanical stretch or neurocrine signals and storing secretory granules in their basal cytoplasm.",
        "keyConcept": "Closed enteroendocrine cell (TEM): rests on basement membrane without contacting the intestinal lumen.",
        "imageUrl": "/images/practical/mgl-3/histology/enteroendocrine_closed_tem.webp"
    },
    {
        "seq": 22,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) between adjacent hepatocytes, identify this intercellular conduit:",
        "correct_answer": "Bile canaliculus",
        "distractors": [
            "Space of Disse",
            "Hepatic sinusoid lumen",
            "Periductal lymph vessel"
        ],
        "explanation": "Criteria of Identification: The bile canaliculus is an intercellular channel formed by apposed plasma membranes of adjacent hepatocytes, sealed by tight junctional complexes (zonulae occludentes) and containing short, projecting microvilli into its lumen.",
        "keyConcept": "Bile canaliculus (TEM): intercellular groove between hepatocytes sealed by tight junctions with microvilli.",
        "imageUrl": "/images/practical/mgl-3/histology/bile_canaliculus_tem.webp"
    },
    {
        "seq": 23,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of hepatic parenchyma, identify this subendothelial compartment:",
        "correct_answer": "Space of Disse",
        "distractors": [
            "Bile canaliculus",
            "Sinusoidal lumen",
            "Portal canal of Hering"
        ],
        "explanation": "Criteria of Identification: The perisinusoidal space of Disse is the extracellular microenvironment between sinusoidal endothelial cells and hepatocyte microvillar basolateral surfaces; it contains blood plasma, reticular fiber meshwork, and fat-storing hepatic stellate (Ito) cells.",
        "keyConcept": "Space of Disse (TEM): perisinusoidal compartment containing hepatocyte microvilli and Ito cells.",
        "imageUrl": "/images/practical/mgl-3/histology/space_of_disse_tem.webp"
    },
    {
        "seq": 24,
        "lecture": 6,
        "text": "In this scanning electron micrograph (SEM) of hepatic sinusoidal endothelium, identify these clustered fenestrations:",
        "correct_answer": "Endothelial sieve plates",
        "distractors": [
            "Tight junctional belts",
            "Desmosomal plaques",
            "Gap junction arrays"
        ],
        "explanation": "Criteria of Identification: Hepatic sinusoidal endothelial cells display clustered, transcellular pores (fenestrae) lacking diaphragms, grouped together into sieve plates that permit bidirectional macromolecular exchange between sinusoidal blood and hepatocyte microvilli.",
        "keyConcept": "Endothelial sieve plates (SEM): clustered transcellular fenestrae lacking diaphragms in sinusoidal lining.",
        "imageUrl": "/images/practical/mgl-3/histology/sinusoid_sieve_plates_sem.webp"
    },
    {
        "seq": 25,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of a pancreatic exocrine cell, identify these apical electron-dense organelles:",
        "correct_answer": "Zymogen granules",
        "distractors": [
            "Mitochondria with tubular cristae",
            "Lipid storage droplets",
            "Multivesicular lysosomes"
        ],
        "explanation": "Criteria of Identification: Pancreatic acinar cells store digestive proenzymes within large, spherical, membrane-bound, intensely electron-dense zymogen granules clustered in the apical cytoplasm awaiting cholecystokinin-stimulated exocytosis.",
        "keyConcept": "Zymogen granules (TEM): apical membrane-bound electron-dense condensing vacuoles containing proenzymes.",
        "imageUrl": "/images/practical/mgl-3/histology/pancreatic_acinar_tem.webp"
    },
    {
        "seq": 26,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of an absorptive intestinal cell, identify this apical surface specialization:",
        "correct_answer": "Striated (brush) border / microvilli",
        "distractors": [
            "Motile respiratory cilia",
            "Epididymal stereocilia",
            "Basolateral membrane infoldings"
        ],
        "explanation": "Criteria of Identification: The enterocyte striated border consists of thousands of parallel, closely packed, cylindrical microvilli (~1 µm tall) containing central axial bundles of cross-linked actin microfilaments anchored into the terminal web.",
        "keyConcept": "Striated border (TEM): dense array of parallel microvilli containing actin cores anchored into terminal web.",
        "imageUrl": "/images/practical/mgl-3/histology/striated_border_tem.webp"
    },
    {
        "seq": 27,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of intestinal epithelium, identify this unicellular mucus-secreting gland:",
        "correct_answer": "Goblet cell",
        "distractors": [
            "Paneth cell",
            "Absorptive enterocyte",
            "Tuft (brush) cell"
        ],
        "explanation": "Criteria of Identification: Goblet cells exhibit a characteristic cup- or chalice-shaped apical theca packed with pale, coalescing, electron-lucent mucinogen granules, resting upon a narrow stem containing a flattened basal nucleus and prominent Golgi apparatus.",
        "keyConcept": "Goblet cell (TEM): apical theca packed with electron-lucent mucigen droplets + basal stem with compressed nucleus.",
        "imageUrl": "/images/practical/mgl-3/histology/goblet_cell_tem.webp"
    },
    {
        "seq": 28,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) at the base of an intestinal crypt, identify these cells:",
        "correct_answer": "Paneth cells",
        "distractors": [
            "Basal stem cells",
            "Enteroendocrine cells",
            "Plasma cells"
        ],
        "explanation": "Criteria of Identification: Paneth cells reside at the base of crypts of Lieberkühn and are recognized by their pyramidal shape and prominent, large, spherical, intensely electron-dense apical secretory granules containing antimicrobial lysozyme, defensins (cryptdins), and TNF-alpha.",
        "keyConcept": "Paneth cells (TEM): crypt base cells packed with large, electron-dense apical antibacterial/lysozyme granules.",
        "imageUrl": "/images/practical/mgl-3/histology/paneth_cells_tem.webp"
    }
]

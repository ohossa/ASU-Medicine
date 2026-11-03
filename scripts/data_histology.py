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

NET_NEW_HISTOLOGY = [
    {
        "seq": 29,
        "lecture": 1,
        "text": "Examine this histological section of the gastrointestinal junction. Identify the abrupt epithelial transition indicated:",
        "correct_answer": "Non-keratinized stratified squamous to simple columnar epithelium (Gastroesophageal junction)",
        "distractors": [
            "Simple columnar to stratified squamous keratinized epithelium (Anorectal junction)",
            "Pseudostratified ciliated columnar to stratified squamous epithelium (Laryngeal transition)",
            "Simple columnar with microvilli to transitional epithelium (Ureterovesical junction)"
        ],
        "explanation": "Criteria of Identification: The gastroesophageal junction (Z-line) is characterized by a sharp, microscopic boundary where the multi-layered non-keratinized stratified squamous epithelium of the esophagus transitions abruptly into the single-layered mucus-secreting simple columnar epithelium of the gastric cardia.",
        "keyConcept": "GE junction: abrupt transition from stratified squamous non-keratinized epithelium of esophagus to simple columnar epithelium of stomach cardia.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0029.webp"
    },
    {
        "seq": 30,
        "lecture": 2,
        "text": "In this transmission electron micrograph (TEM) of a gastric fundic gland cell, identify this cell characterized by extensive intracellular canaliculi and abundant mitochondria:",
        "correct_answer": "Parietal (oxyntic) cell",
        "distractors": [
            "Chief (peptic) cell",
            "Enteroendocrine G cell",
            "Mucous neck cell"
        ],
        "explanation": "Criteria of Identification: Parietal cells are identified on TEM by deep, branching intracellular canaliculi lined by microvilli, a dynamic tubulovesicular system, and exceptionally high mitochondrial density (occupying ~40% of cytoplasmic volume) to fuel the H+/K+ ATPase proton pump.",
        "keyConcept": "Parietal cell (TEM): deep intracellular secretory canaliculi + dense packing of cristae-rich mitochondria.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0030.webp"
    },
    {
        "seq": 31,
        "lecture": 2,
        "text": "In this transmission electron micrograph (TEM) of a secretory acinar cell, identify the parallel basal cisternae and apical secretory vesicles:",
        "correct_answer": "Chief (peptic) cell with extensive rough endoplasmic reticulum and zymogen granules",
        "distractors": [
            "Parietal cell with intracellular canaliculi and smooth ER",
            "Adipocyte with large lipid droplet and flattened nucleus",
            "Plasma cell with clock-face chromatin and Russell bodies"
        ],
        "explanation": "Criteria of Identification: Chief cells (and serous acinar cells) are dedicated protein-synthesizing cells characterized on TEM by extensive parallel arrays of rough endoplasmic reticulum in the basal cytoplasm and large spherical apical zymogen granules containing pepsinogen awaiting exocytosis.",
        "keyConcept": "Chief cell (TEM): extensive parallel basal rER cisternae + apical electron-dense zymogen granules.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0031.webp"
    },
    {
        "seq": 32,
        "lecture": 2,
        "text": "Examine this histological section of the gastric mucosa. Identify this region based on the deep gastric pits occupying more than half the mucosal depth:",
        "correct_answer": "Pyloric stomach",
        "distractors": [
            "Gastric fundus / body",
            "Duodenum",
            "Jejunum"
        ],
        "explanation": "Criteria of Identification: Pyloric stomach is definitively identified by deep, branched, wide gastric pits extending through more than half (1/2 to 2/3) of the mucosal thickness, with short, tortuous, branched mucous pyloric glands in the remaining basal lamina propria.",
        "keyConcept": "Pyloric stomach: deep wide gastric pits (> 1/2 mucosal height) + branched mucous coiled glands.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0032.webp"
    },
    {
        "seq": 33,
        "lecture": 3,
        "text": "Examine this high-power micrograph of the duodenal submucosa. Identify these branched coiled glands lying deep to the muscularis mucosae:",
        "correct_answer": "Brunner's glands",
        "distractors": [
            "Esophageal cardiac glands",
            "Crypts of Lieberkühn",
            "Peyer's patches"
        ],
        "explanation": "Criteria of Identification: Brunner's glands are branched tubuloacinar submucosal glands found exclusively in the duodenum that produce an alkaline, bicarbonate-rich mucus (pH 8.1–9.3) and epidermal growth factor (urogastrone) to protect the duodenal mucosa against acidic gastric chyme.",
        "keyConcept": "Brunner's glands: submucosal branched tubuloacinar glands producing alkaline bicarbonate-rich mucus.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0033.webp"
    },
    {
        "seq": 34,
        "lecture": 3,
        "text": "In this transmission electron micrograph (TEM) of an intestinal mucosal cell, identify this cell featuring a dense apical brush border and basal nucleus:",
        "correct_answer": "Absorptive enterocyte",
        "distractors": [
            "Paneth cell",
            "Goblet cell",
            "M cell (microfold cell)"
        ],
        "explanation": "Criteria of Identification: Absorptive enterocytes are tall columnar cells displaying an apical striated border of ~3,000 tightly packed microvilli coated with thick glycocalyx enzymes, an apical terminal web, and lateral interdigitations with junctional complexes for selective nutrient uptake.",
        "keyConcept": "Enterocyte (TEM): tall columnar absorptive cell with dense microvillar brush border and apical junctional complex.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0034.webp"
    },
    {
        "seq": 35,
        "lecture": 3,
        "text": "Examine this micrograph taken at the bottom of the intestinal crypts of Lieberkühn. Identify the cells with intensely eosinophilic apical granules:",
        "correct_answer": "Paneth cells",
        "distractors": [
            "Enteroendocrine cells",
            "Stem cells",
            "Eosinophils"
        ],
        "explanation": "Criteria of Identification: Paneth cells reside exclusively at the base of small intestinal crypts and contain prominent, refringent, bright eosinophilic apical granules packed with antimicrobial lysozyme, defensins (cryptdins), and phospholipase A2.",
        "keyConcept": "Paneth cells: crypt base cells with bright eosinophilic apical antibacterial granules (lysozyme/defensins).",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0035.webp"
    },
    {
        "seq": 36,
        "lecture": 3,
        "text": "In this transmission electron micrograph (TEM), identify this epithelial cell whose apical pole reaches the intestinal lumen with sensory microvilli while containing basal neurosecretory granules:",
        "correct_answer": "Open-type enteroendocrine cell",
        "distractors": [
            "Closed-type enteroendocrine cell",
            "Paneth cell",
            "Tuft cell"
        ],
        "explanation": "Criteria of Identification: Open-type enteroendocrine cells are bottle-shaped cells that span the full height of the epithelium, contacting the gut lumen via apical microvilli acting as chemoreceptors and discharging peptide hormones (e.g., CCK, secretin, GIP) from infranuclear basal granules into the underlying fenestrated capillaries.",
        "keyConcept": "Open-type enteroendocrine cell (TEM): apical microvillar luminal contact + infranuclear basal endocrine granules.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0036.webp"
    },
    {
        "seq": 37,
        "lecture": 3,
        "text": "Examine this small intestinal histological section showing exceptionally tall, slender mucosal villi and prominent plicae circulares without submucosal glands or Peyer's patches. Identify this segment:",
        "correct_answer": "Jejunum",
        "distractors": [
            "Duodenum",
            "Ileum",
            "Vermiform appendix"
        ],
        "explanation": "Criteria of Identification: The jejunum exhibits the tallest, most developed finger-shaped intestinal villi, the deepest crypts of Lieberkühn, and well-developed plicae circulares (valves of Kerckring), distinguished definitively by the complete absence of submucosal Brunner's glands and aggregated Peyer's patches.",
        "keyConcept": "Jejunum: tall slender villi + plicae circulares without Brunner's glands or prominent Peyer's patches.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0037.webp"
    },
    {
        "seq": 38,
        "lecture": 3,
        "text": "In this histological section of the distal small intestine, identify the diagnostic aggregated lymphoid follicles occupying the antimesenteric submucosa:",
        "correct_answer": "Peyer's patches in the ileum",
        "distractors": [
            "Solitary lymphoid nodules in colon",
            "Germinal centers in tonsils",
            "Brunner's glands in duodenum"
        ],
        "explanation": "Criteria of Identification: Peyer's patches are large confluent macroscopic aggregations of 10 to 30 lymphoid follicles situated on the antimesenteric border of the ileum, extending from the lamina propria through the muscularis mucosae into the submucosa, covered by specialized follicle-associated epithelium containing M-cells.",
        "keyConcept": "Peyer's patches: antimesenteric aggregated lymphoid follicles in lamina propria and submucosa of ileum.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0038.webp"
    },
    {
        "seq": 39,
        "lecture": 3,
        "text": "Examine this low-power cross-section of a narrow tubular gut structure. Identify this organ based on the circumferential ring of lymphoid nodules and absence of villi:",
        "correct_answer": "Vermiform appendix",
        "distractors": [
            "Colon",
            "Ileum",
            "Esophagus"
        ],
        "explanation": "Criteria of Identification: The vermiform appendix is recognized by its small circular lumen, flat mucosal surface completely devoid of villi, shallow straight crypts, and a dense, confluent, continuous ring of lymphoid follicles occupying the entire circumference of the lamina propria and submucosa.",
        "keyConcept": "Appendix: narrow lumen + complete circumferential ring of lymphoid follicles without mucosal villi.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0039.webp"
    },
    {
        "seq": 40,
        "lecture": 3,
        "text": "Examine this large intestinal histological section. Identify the characteristic mucosal architecture:",
        "correct_answer": "Straight, parallel tubular crypts packed with abundant goblet cells without mucosal villi",
        "distractors": [
            "Tall mucosal villi with central lacteals and Paneth cells",
            "Stratified squamous non-keratinized epithelium with submucosal glands",
            "Branched tubuloacinar mucous glands extending through the submucosa"
        ],
        "explanation": "Criteria of Identification: The large intestine (colon) exhibits a smooth, flat mucosal surface without mucosal villi or plicae circulares, densely packed with long, straight, test-tube-like parallel crypts of Lieberkühn lined predominantly by mucus-secreting goblet cells and absorptive colonocytes.",
        "keyConcept": "Colon: flat mucosal surface + straight parallel crypts with high density of goblet cells and no villi.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0040.webp"
    },
    {
        "seq": 41,
        "lecture": 3,
        "text": "Examine this high-power micrograph of the colonic mucosal crypts. Identify the predominant pale-staining secretory cell lining these crypts:",
        "correct_answer": "Goblet cells",
        "distractors": [
            "Paneth cells",
            "Parietal cells",
            "Chief cells"
        ],
        "explanation": "Criteria of Identification: Goblet cells in the colonic crypts appear as pale, vacuolated, mucin-rich cells whose numbers progressively increase from the cecum to the rectum to provide vital lubrication for dehydrating feces.",
        "keyConcept": "Colonic crypts: dominated by abundant mucin-producing goblet cells for luminal lubrication.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0041.webp"
    },
    {
        "seq": 42,
        "lecture": 3,
        "text": "Examine this histological section of the terminal gastrointestinal canal. Identify this transition from simple columnar epithelium to non-keratinized stratified squamous epithelium:",
        "correct_answer": "Anorectal (pectinate) line",
        "distractors": [
            "Gastroesophageal junction",
            "Gastroduodenal junction",
            "Ileocecal valve"
        ],
        "explanation": "Criteria of Identification: The anorectal junction (pectinate / dentate line) marks the embryological boundary between the endoderm-derived rectum (simple columnar epithelium with deep crypts) and the ectoderm-derived anal pecten (non-keratinized stratified squamous epithelium).",
        "keyConcept": "Anorectal junction: transition from simple columnar colonic epithelium to stratified squamous non-keratinized epithelium.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0042.webp"
    },
    {
        "seq": 43,
        "lecture": 4,
        "text": "Examine this histological section of the lip. Identify the central structural core:",
        "correct_answer": "Striated skeletal muscle (Orbicularis oris muscle)",
        "distractors": [
            "Dense irregular collagenous tendon",
            "Hyaline cartilage plate",
            "Smooth muscle bundles"
        ],
        "explanation": "Criteria of Identification: The lip is characterized by a central core of skeletal muscle bundles (orbicularis oris) bounded by three distinct zones: outer thin skin (with hair follicles and sebaceous glands), transitional vermilion border (red margin with high vascular dermal papillae), and inner oral mucous membrane (with non-keratinized stratified squamous epithelium and labial salivary glands).",
        "keyConcept": "Lip: central core of orbicularis oris skeletal muscle between skin surface and oral mucous membrane.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0043.webp"
    },
    {
        "seq": 44,
        "lecture": 4,
        "text": "Examine this histological section of a major salivary gland showing purely serous acini with darkly basophilic cytoplasm and absence of mucous elements. Identify this gland:",
        "correct_answer": "Parotid gland",
        "distractors": [
            "Sublingual gland",
            "Submandibular gland",
            "Exocrine pancreas"
        ],
        "explanation": "Criteria of Identification: The parotid gland is an entirely serous branched tubuloacinar gland characterized by intensely basophilic serous acini with central round nuclei, prominent intercalated and striated ducts, and interspersed unilocular adipocytes that increase with age.",
        "keyConcept": "Parotid gland: purely serous acini + prominent striated/intercalated ducts + adipocytes.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0044.webp"
    },
    {
        "seq": 45,
        "lecture": 4,
        "text": "Examine this histological section of a major salivary gland showing predominantly pale-staining mucous acini with flattened basal nuclei and occasional serous demilunes. Identify this gland:",
        "correct_answer": "Sublingual gland",
        "distractors": [
            "Parotid gland",
            "Submandibular gland",
            "Lacrimal gland"
        ],
        "explanation": "Criteria of Identification: The sublingual gland is a mixed but predominantly mucous (60–70% mucous) tubuloacinar salivary gland recognized by pale, vacuolated mucous tubules with peripheral flattened nuclei and occasional serous demilunes of Giannuzzi.",
        "keyConcept": "Sublingual gland: predominantly mucous acini with flattened basal nuclei and scarce serous demilunes.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0045.webp"
    },
    {
        "seq": 46,
        "lecture": 4,
        "text": "Examine this histological section of a major salivary gland showing mixed acini with a predominance of serous acini (80%) and mucous tubules capped by serous demilunes. Identify this gland:",
        "correct_answer": "Submandibular gland",
        "distractors": [
            "Parotid gland",
            "Sublingual gland",
            "Exocrine pancreas"
        ],
        "explanation": "Criteria of Identification: The submandibular gland is a mixed seromucous gland dominated by serous acini (~80%) alongside mucous acini capped by crescent-shaped serous demilunes of Giannuzzi, with prominent striated intralobular ducts.",
        "keyConcept": "Submandibular gland: mixed gland dominated by serous acini (~80%) with mucous acini and serous demilunes.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0046.webp"
    },
    {
        "seq": 47,
        "lecture": 4,
        "text": "In this high-power micrograph of a salivary intralobular duct, identify the duct characterized by intense eosinophilia and basal striations:",
        "correct_answer": "Striated duct",
        "distractors": [
            "Intercalated duct",
            "Excretory interlobular duct",
            "Main parotid duct"
        ],
        "explanation": "Criteria of Identification: Striated ducts are lined by simple columnar epithelium displaying pronounced basal vertical striations corresponding to extensive plasma membrane infoldings packed with vertically aligned mitochondria that drive active Na+ reabsorption and K+/HCO3- secretion.",
        "keyConcept": "Striated duct: simple columnar duct with basal mitochondrial membrane infoldings for electrolyte modification.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0047.webp"
    },
    {
        "seq": 48,
        "lecture": 5,
        "text": "Examine this low-power histological section of the liver parenchyma. Identify the structural center of the classic hepatic lobule:",
        "correct_answer": "Central vein (terminal hepatic venule)",
        "distractors": [
            "Portal vein tributary",
            "Interlobular bile duct",
            "Hepatic artery branch"
        ],
        "explanation": "Criteria of Identification: In the classic hepatic lobule, anastomosing plates of hepatocytes and sinusoids radiate outward from a thin-walled, endothelial-lined central vein (terminal hepatic venule) toward the peripheral portal spaces.",
        "keyConcept": "Classic liver lobule: hexagonal unit centered around a central vein with portal triads at the periphery.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0048.webp"
    },
    {
        "seq": 49,
        "lecture": 5,
        "text": "Examine this high-power micrograph of a portal space (portal canal). Identify the three canonical structures comprising the portal triad:",
        "correct_answer": "Branch of portal vein, branch of hepatic artery, and interlobular bile duct",
        "distractors": [
            "Central vein, lymph vessel, and interlobular nerve",
            "Bile canaliculus, hepatic vein, and sinusoids",
            "Cystic duct, hepatic artery, and vagus nerve"
        ],
        "explanation": "Criteria of Identification: The portal triad within Glisson's capsule connective tissue contains: 1) a large, thin-walled portal venule branch, 2) a smaller, thick-walled muscular hepatic arteriole branch, and 3) an interlobular bile ductule lined by simple cuboidal epithelium.",
        "keyConcept": "Portal triad: portal venule + hepatic arteriole + cuboidal interlobular bile duct.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0049.webp"
    },
    {
        "seq": 50,
        "lecture": 5,
        "text": "In this scanning electron micrograph (SEM) of the hepatic sinusoidal wall, identify the discontinuous vascular lining containing sieve plates:",
        "correct_answer": "Fenestrated sinusoidal endothelial cells",
        "distractors": [
            "Continuous capillary endothelium",
            "Glomerular podocyte slit diaphragms",
            "Alveolar type I pneumocytes"
        ],
        "explanation": "Criteria of Identification: Hepatic sinusoids are lined by specialized discontinuous endothelial cells grouped with transcellular fenestrae (sieve plates, 100–200 nm) lacking diaphragms and resting upon a discontinuous basal lamina, permitting plasma to bathe hepatocyte microvilli freely in the space of Disse.",
        "keyConcept": "Hepatic sinusoids (SEM): discontinuous fenestrated endothelial cells with sieve plates lacking basal lamina.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0050.webp"
    },
    {
        "seq": 51,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM) of the liver, identify the narrow subendothelial gap between sinusoidal lining and hepatocyte microvilli:",
        "correct_answer": "Space of Disse (perisinusoidal space)",
        "distractors": [
            "Bile canaliculus",
            "Canal of Hering",
            "Space of Mall"
        ],
        "explanation": "Criteria of Identification: The space of Disse (perisinusoidal space) lies between the fenestrated sinusoidal endothelial cells and the microvillar basolateral membrane of hepatocytes; it contains blood plasma, reticular fibers, and fat-storing hepatic stellate cells (Ito cells).",
        "keyConcept": "Space of Disse (TEM): perisinusoidal space where plasma bathes hepatocyte microvilli; site of Ito cells.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0051.webp"
    },
    {
        "seq": 52,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM), identify the microscopic intercellular channel formed by grooves in apical hepatocyte membranes sealed by tight junctions:",
        "correct_answer": "Bile canaliculus",
        "distractors": [
            "Hepatic sinusoid",
            "Space of Disse",
            "Interlobular ductule"
        ],
        "explanation": "Criteria of Identification: Bile canaliculi are 1–2 µm wide non-endothelialized tubular spaces formed by apposed grooved apical membranes of neighboring hepatocytes, sealed circumferentially by tight junctions (zonulae occludentes) to prevent bile regurgitation into the parenchyma.",
        "keyConcept": "Bile canaliculus (TEM): intercellular lumen between adjacent hepatocytes sealed by tight junctions.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0052.webp"
    },
    {
        "seq": 53,
        "lecture": 5,
        "text": "Examine this histological section of the gallbladder wall. Identify the characteristic morphological feature:",
        "correct_answer": "Tall simple columnar epithelium with deeply folded mucosa and complete absence of submucosa and muscularis mucosae",
        "distractors": [
            "Stratified squamous epithelium with a thick submucosal glandular layer",
            "Simple columnar epithelium with goblet cells, villi, and crypts",
            "Pseudostratified ciliated epithelium with a continuous submucosa"
        ],
        "explanation": "Criteria of Identification: The gallbladder wall is characterized by a tall simple columnar absorptive epithelium with microvilli, highly branched mucosal rugae forming Rokitansky-Aschoff diverticula, a rich vascular lamina propria, and a fibromuscular coat, definitively lacking both a muscularis mucosae and a submucosa.",
        "keyConcept": "Gallbladder: tall simple columnar epithelium + folded mucosa; lacks muscularis mucosae and submucosa.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0053.webp"
    },
    {
        "seq": 54,
        "lecture": 6,
        "text": "Examine this histological section of the exocrine pancreas. Identify the pale-staining initial duct cells invaginating into the lumen of the serous acinus:",
        "correct_answer": "Centroacinar cells",
        "distractors": [
            "Kupffer cells",
            "Paneth cells",
            "Enterochromaffin cells"
        ],
        "explanation": "Criteria of Identification: Centroacinar cells are pale-staining, cuboidal-to-flattened epithelial cells that represent the terminal intra-acinar extension of the intercalated duct system, unique to the exocrine pancreas.",
        "keyConcept": "Centroacinar cells: pale intra-acinar duct cells characteristic of exocrine pancreatic acini.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0054.webp"
    },
    {
        "seq": 55,
        "lecture": 6,
        "text": "Examine this pancreatic section showing a pale, highly vascularized spherical cellular cluster embedded among dark serous acini. Identify this endocrine structure:",
        "correct_answer": "Islet of Langerhans",
        "distractors": [
            "Lymphoid follicle",
            "Pancreatic lobule",
            "Parathyroid gland"
        ],
        "explanation": "Criteria of Identification: Islets of Langerhans are pale-staining, round-to-oval endocrine clusters (~100–200 µm) comprising anastomosing cellular cords (Beta, Alpha, Delta, PP cells) intimately enveloped by a fenestrated capillary meshwork surrounded by dark exocrine serous acini.",
        "keyConcept": "Islet of Langerhans: pale spherical endocrine cluster surrounded by dark exocrine pancreatic acini.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0055.webp"
    },
    {
        "seq": 56,
        "lecture": 6,
        "text": "In this transmission electron micrograph (TEM) of a pancreatic acinar cell, identify the cellular polarity displaying basal rough ER and apical secretory vesicles:",
        "correct_answer": "Protein-synthesizing acinar cell with basal rER, Golgi complex, and apical zymogen granules",
        "distractors": [
            "Mucus-secreting goblet cell with electron-lucent droplets",
            "Steroid-synthesizing adrenal cortical cell with lipid droplets and sER",
            "Ion-transporting striated duct cell with basal mitochondria"
        ],
        "explanation": "Criteria of Identification: Pancreatic acinar cells demonstrate textbook secretory polarity: spherical euchromatic nucleus surrounded by parallel basal rER cisternae, supranuclear Golgi, and apical cluster of dense zymogen granules containing proelastase, trypsinogen, and amylase.",
        "keyConcept": "Pancreatic acinar cell (TEM): basal rER stacks + supranuclear Golgi + apical dense zymogen granules.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0056.webp"
    },
    {
        "seq": 57,
        "lecture": 4,
        "text": "Examine this histological section of the lingual mucosa showing a massive papilla sunken into a circular moat lined by taste buds. Identify this papilla:",
        "correct_answer": "Circumvallate (vallate) papilla",
        "distractors": [
            "Filiform papilla",
            "Fungiform papilla",
            "Foliate papilla"
        ],
        "explanation": "Criteria of Identification: Circumvallate papillae are 8 to 12 large dome-shaped papillae located anterior to the sulcus terminalis, submerged into a deep epithelial trench or moat containing intraepithelial barrel-shaped taste buds along their lateral walls and serous glands of von Ebner at the trench base.",
        "keyConcept": "Circumvallate papilla: large papilla surrounded by circular trench with lateral taste buds and von Ebner serous glands.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0057.webp"
    },
    {
        "seq": 58,
        "lecture": 4,
        "text": "Examine this micrograph of the dorsal tongue mucosa showing pointed conical projections covered by cornified stratified squamous epithelium lacking taste buds. Identify these papillae:",
        "correct_answer": "Filiform papillae",
        "distractors": [
            "Fungiform papillae",
            "Circumvallate papillae",
            "Foliate papillae"
        ],
        "explanation": "Criteria of Identification: Filiform papillae are the smallest and most numerous tongue papillae, appearing as elongated, conical, curved projections covered by heavily keratinized stratified squamous epithelium providing abrasive mechanical friction without taste buds.",
        "keyConcept": "Filiform papillae: keratinized conical spikes providing mechanical friction; completely lack taste buds.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0058.webp"
    },
    {
        "seq": 59,
        "lecture": 4,
        "text": "Examine this section through the body of the tongue. Identify the interlacing muscle bundles coursing in three orthogonal planes:",
        "correct_answer": "Intrinsic and extrinsic skeletal muscle fibers",
        "distractors": [
            "Smooth muscle layers",
            "Dense regular collagenous connective tissue",
            "Elastic cartilage plates"
        ],
        "explanation": "Criteria of Identification: The tongue body is unique in having cross-striated skeletal muscle bundles running in all three orthogonal dimensions (longitudinal, transverse, and vertical), interspersed with adipose tissue and lingual salivary glands.",
        "keyConcept": "Tongue body: skeletal muscle bundles intersecting in three orthogonal planes (longitudinal, transverse, vertical).",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0059.webp"
    },
    {
        "seq": 60,
        "lecture": 2,
        "text": "In this high-magnification TEM of an activated parietal cell, identify the specialized membrane system that expands during active acid secretion:",
        "correct_answer": "Intracellular canaliculi lined by microvilli fusing with the tubulovesicular network",
        "distractors": [
            "Endoplasmic reticulum cisternae",
            "Outer mitochondrial cristae",
            "Nuclear envelope pores"
        ],
        "explanation": "Criteria of Identification: Upon stimulation by histamine, gastrin, or acetylcholine, parietal tubulovesicles fuse with the apical plasma membrane, increasing the surface area of the intracellular canaliculi five- to tenfold and displaying dense arrays of elongated microvilli harboring H+/K+ ATPases.",
        "keyConcept": "Parietal cell canaliculi (TEM): dramatic microvillar membrane expansion derived from tubulovesicle fusion.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0060.webp"
    },
    {
        "seq": 61,
        "lecture": 2,
        "text": "In this transmission electron micrograph (TEM), identify the spherical, electron-dense membrane-bound secretory organelles storing pepsinogen in a gastric chief cell:",
        "correct_answer": "Zymogen granules",
        "distractors": [
            "Peroxisomes",
            "Lipid droplets",
            "Autophagic lysosomes"
        ],
        "explanation": "Criteria of Identification: Zymogen granules are intensely electron-dense, membrane-delimited spherical vesicles concentrated in the apical cytoplasm of chief cells, containing inactive pepsinogen proenzymes ready for exocytosis upon vagal or secretin stimulation.",
        "keyConcept": "Zymogen granules (TEM): dense apical membrane-bound condensing vesicles containing digestive proenzymes.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0061.webp"
    },
    {
        "seq": 62,
        "lecture": 3,
        "text": "In this transmission electron micrograph (TEM) of the apical pole of adjacent enterocytes, identify the junctional complex sealing the intercellular space:",
        "correct_answer": "Zonula occludens (tight junction), zonula adherens, and macula adherens (desmosome)",
        "distractors": [
            "Gap junctions and hemidesmosomes only",
            "Intercellular canaliculi and fenestrae",
            "Basal lamina anchoring fibrils"
        ],
        "explanation": "Criteria of Identification: The apical junctional complex of intestinal enterocytes consists from apical to basal of: 1) zonula occludens (tight junction sealing paracellular permeability), 2) zonula adherens (anchoring actin microfilaments), and 3) macula adherens (desmosome providing mechanical cohesion via intermediate filaments).",
        "keyConcept": "Junctional complex (TEM): zonula occludens (tight) + zonula adherens (belt) + macula adherens (desmosome).",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0062.webp"
    },
    {
        "seq": 63,
        "lecture": 3,
        "text": "In this transmission electron micrograph (TEM), identify the large supranuclear electron-dense granule with a characteristic bipartite halo in a crypt-base cell:",
        "correct_answer": "Paneth cell secretory granule containing defensins and lysozyme",
        "distractors": [
            "Enteroendocrine dense-core granule",
            "Mucin droplet of goblet cell",
            "Melanosome of melanocyte"
        ],
        "explanation": "Criteria of Identification: Paneth cell granules are massive (up to 1.5 µm), electron-dense spherical granules surrounded by a distinctive halo, containing alpha-defensins (cryptdins) and lysozyme that destroy invading bacterial cell walls.",
        "keyConcept": "Paneth granule (TEM): large electron-dense antimicrobial granule with peripheral halo at crypt base.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0063.webp"
    },
    {
        "seq": 64,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM) of the hepatic perisinusoidal space, identify this star-shaped cell containing cytoplasmic lipid droplets storing vitamin A:",
        "correct_answer": "Hepatic Stellate (Ito) cell",
        "distractors": [
            "Kupffer cell",
            "Endothelial cell",
            "Hepatocyte"
        ],
        "explanation": "Criteria of Identification: Hepatic stellate cells (Ito cells / lipocytes) reside within the space of Disse, characterized on TEM by prominent cytoplasmic lipid droplets that store ~80% of the body's retinoids (vitamin A); in chronic injury, they transdifferentiate into collagen-producing myofibroblasts driving cirrhosis.",
        "keyConcept": "Ito cell (TEM): perisinusoidal stellate cell in space of Disse containing lipid droplets storing vitamin A.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0064.webp"
    },
    {
        "seq": 65,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM), identify the resident macrophage anchored inside the lumen of the hepatic sinusoid containing phagocytosed debris:",
        "correct_answer": "Kupffer cell",
        "distractors": [
            "Ito cell",
            "Sinusoidal endothelial cell",
            "Hepatocyte"
        ],
        "explanation": "Criteria of Identification: Kupffer cells are specialized resident stellate macrophages attached to the luminal surface of sinusoidal endothelial cells, recognized on TEM by irregular pseudopodia, large lysosomes, phagosomes containing degraded erythrocytes, and absence of lipid droplets.",
        "keyConcept": "Kupffer cell (TEM): intravascular resident macrophage in hepatic sinusoid lumen with phagolysosomes.",
        "imageUrl": "/images/practical/mgl-3/histology/img_hist_0065.webp"
    }
]

HISTOLOGY_QUESTIONS = HISTOLOGY_QUESTIONS + NET_NEW_HISTOLOGY

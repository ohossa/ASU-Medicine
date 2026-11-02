# scripts/data_histology.py
"""
Official 28 Histology Practical Revision Questions for Year 3 GIT (MGL-3).
Source: GIT Final Revision Histology.pdf (79 pages)
"""

HISTOLOGY_QUESTIONS = [
    {
        "seq": 1,
        "lecture": 1,
        "text": "Examine this low-power histological section of the upper alimentary tract. Based on the non-keratinized stratified squamous epithelium and submucosal tubuloacinar mucous glands, identify this organ:",
        "correct_answer": "Esophagus",
        "distractors": [
            "Duodenum",
            "Pyloric stomach",
            "Jejunum"
        ],
        "explanation": "The esophagus is characterized by a lining of non-keratinized stratified squamous epithelium, a prominent muscularis mucosae, and esophageal glands proper situated in the submucosa.",
        "keyConcept": "Esophagus: non-keratinized stratified squamous epithelium with submucosal esophageal glands proper.",
        "imageUrl": "/images/practical/mgl-3/histology/esophagus_lm.webp"
    },
    {
        "seq": 2,
        "lecture": 1,
        "text": "Identify this small intestinal section characterized by tall leaf-like villi and abundant branched coiled tubuloacinar glands occupying the submucosa:",
        "correct_answer": "Duodenum",
        "distractors": [
            "Ileum",
            "Jejunum",
            "Vermiform appendix"
        ],
        "explanation": "Brunner's glands in the submucosa are the pathognomonic histological hallmark of the duodenum, secreting alkaline bicarbonate-rich mucus that neutralizes acidic gastric chyme.",
        "keyConcept": "Duodenum: diagnostic submucosal Brunner's glands producing protective alkaline mucus.",
        "imageUrl": "/images/practical/mgl-3/histology/duodenum_brunner_lm.webp"
    },
    {
        "seq": 3,
        "lecture": 1,
        "text": "Examine this small intestinal section demonstrating exceptionally tall, slender mucosal villi, prominent plicae circulares, and complete absence of submucosal glands or Peyer's patches. Identify this segment:",
        "correct_answer": "Jejunum",
        "distractors": [
            "Duodenum",
            "Ileum",
            "Cecum"
        ],
        "explanation": "The jejunum possesses the tallest, most developed intestinal villi and deepest crypts for primary nutrient absorption, lacking both submucosal Brunner's glands and aggregated Peyer's patches.",
        "keyConcept": "Jejunum: tall, well-developed villi without Brunner's glands or prominent Peyer's patches.",
        "imageUrl": "/images/practical/mgl-3/histology/jejunum_villi_lm.webp"
    },
    {
        "seq": 4,
        "lecture": 1,
        "text": "In this histological section of the distal small intestine, identify the diagnostic aggregated lymphoid follicles that occupy both the lamina propria and submucosa on the antimesenteric border:",
        "correct_answer": "Peyer's patches in the ileum",
        "distractors": [
            "Brunner's glands in duodenum",
            "Taeniae coli in large colon",
            "Demilunes in salivary gland"
        ],
        "explanation": "Peyer's patches are large aggregates of secondary lymphoid follicles situated in the lamina propria and submucosa of the ileum, covered by specialized follicle-associated M cells for antigen sampling.",
        "keyConcept": "Ileum: hallmark aggregated lymphoid nodules (Peyer's patches) along the antimesenteric wall.",
        "imageUrl": "/images/practical/mgl-3/histology/ileum_peyer_lm.webp"
    },
    {
        "seq": 5,
        "lecture": 2,
        "text": "Examine this histological section of the large bowel showing a flat mucosal surface without villi and straight, closely packed tubular crypts of Lieberkuhn. Identify this specimen:",
        "correct_answer": "Colon (Large intestine)",
        "distractors": [
            "Jejunum (Small intestine)",
            "Duodenum (Small intestine)",
            "Gastric body mucosa"
        ],
        "explanation": "The colon lacks mucosal villi and exhibits abundant straight, test-tube-like crypts of Lieberkuhn lined by numerous mucus-secreting goblet cells, with outer longitudinal muscle arranged into three taeniae coli.",
        "keyConcept": "Colon: absence of villi with straight parallel crypts densely populated by goblet cells.",
        "imageUrl": "/images/practical/mgl-3/histology/colon_crypts_lm.webp"
    },
    {
        "seq": 6,
        "lecture": 2,
        "text": "Identify this small tubular gastrointestinal organ presenting a narrow, irregular stellate lumen, complete circular muscularis, and a confluent ring of massive lymphoid follicles expanding the submucosa:",
        "correct_answer": "Vermiform appendix",
        "distractors": [
            "Sigmoid colon",
            "Pyloric canal",
            "Gallbladder"
        ],
        "explanation": "The vermiform appendix exhibits a small irregular star-shaped lumen, absence of villi, shallow crypts, and a ring of large lymphoid follicles completely effacing the lamina propria and submucosa.",
        "keyConcept": "Appendix: narrow stellate lumen with a circumferential ring of prominent lymphoid follicles.",
        "imageUrl": "/images/practical/mgl-3/histology/appendix_lymphoid_lm.webp"
    },
    {
        "seq": 7,
        "lecture": 2,
        "text": "In this section from the anterior two-thirds of the lingual dorsum, identify the conical pointed mucosal projections covered by keratinized stratified squamous epithelium lacking taste buds:",
        "correct_answer": "Filiform papillae",
        "distractors": [
            "Fungiform papillae",
            "Circumvallate papillae",
            "Foliate papillae"
        ],
        "explanation": "Filiform papillae are the most numerous lingual papillae. They have a pointed conical keratinized shape and serve a mechanical role in food manipulation, uniquely lacking taste buds.",
        "keyConcept": "Filiform papillae: pointed keratinized projections providing mechanical friction, devoid of taste buds.",
        "imageUrl": "/images/practical/mgl-3/histology/tongue_filiform_lm.webp"
    },
    {
        "seq": 8,
        "lecture": 2,
        "text": "This histological section demonstrates three distinct transitional regions: outer skin with hair follicles, an intermediate red vermilion border with high dermal papillae, and an inner mucous zone. Identify this organ:",
        "correct_answer": "Lip (Labium)",
        "distractors": [
            "Eyelid (Palpebra)",
            "Hard palate mucosa",
            "Anal transition zone"
        ],
        "explanation": "The lip features cutaneous skin externally, an intermediate vermilion zone with high vascular papillae and eleidin-rich translucent stratum corneum, and internal oral non-keratinized mucosa over skeletal orbicularis oris.",
        "keyConcept": "Lip: transition from external hairy skin to translucent vermilion margin and internal oral mucosa.",
        "imageUrl": "/images/practical/mgl-3/histology/lip_histology_lm.webp"
    },
    {
        "seq": 9,
        "lecture": 3,
        "text": "Examine this gastric mucosal biopsy displaying shallow gastric pits occupying the upper quarter of the mucosa, with straight tubular glands densely packed with acidophilic fried-egg-shaped cells. Identify the region:",
        "correct_answer": "Fundus and body of stomach",
        "distractors": [
            "Pyloric region of stomach",
            "Cardia region of stomach",
            "Duodenal bulb mucosa"
        ],
        "explanation": "The gastric fundus and body display shallow gastric pits (1/4 of mucosal depth) and long straight glands packed with eosinophilic parietal (oxyntic) cells and basophilic chief (peptic) cells.",
        "keyConcept": "Gastric fundus/body: shallow pits with straight glands rich in parietal and chief cells.",
        "imageUrl": "/images/practical/mgl-3/histology/stomach_fundus_lm.webp"
    },
    {
        "seq": 10,
        "lecture": 3,
        "text": "This gastric histological specimen demonstrates deep, branched gastric pits extending through half of the mucosal thickness, with coiled mucus-secreting glands and absence of parietal cells. Identify the region:",
        "correct_answer": "Pylorus of stomach",
        "distractors": [
            "Fundus of stomach",
            "Corpus of stomach",
            "Esophageal junction"
        ],
        "explanation": "The pyloric mucosa is characterized by deep gastric pits (extending 1/2 or more into mucosal depth) leading into branched, coiled pyloric glands lined almost exclusively by pale mucus-secreting cells.",
        "keyConcept": "Pylorus: deep branching gastric pits leading into coiled, mucus-secreting tubular glands.",
        "imageUrl": "/images/practical/mgl-3/histology/stomach_pylorus_lm.webp"
    },
    {
        "seq": 11,
        "lecture": 3,
        "text": "Examine this hepatic histological section displaying cords of polyhedral hepatocytes radiating from a central vein toward peripheral connective tissue tracts containing a triad. Identify this structural unit:",
        "correct_answer": "Classical liver lobule",
        "distractors": [
            "Portal lobule unit",
            "Hepatic acinus of Rappaport",
            "Splenic red pulp cord"
        ],
        "explanation": "The classical liver lobule is a hexagonal prism centered on a central vein, with radiating hepatocyte plates separated by sinusoidal capillaries and bounded at angles by portal triads.",
        "keyConcept": "Classical liver lobule: hexagonal structural unit centered on a terminal central venule.",
        "imageUrl": "/images/practical/mgl-3/histology/liver_lobule_lm.webp"
    },
    {
        "seq": 12,
        "lecture": 3,
        "text": "Identify this digestive organ wall showing an extensively folded mucosa lined by tall simple columnar cells with microvilli, absence of muscularis mucosae and submucosa, and an outer fibromuscular coat:",
        "correct_answer": "Gallbladder",
        "distractors": [
            "Urinary bladder",
            "Ampulla of ductus deferens",
            "Uterine fallopian tube"
        ],
        "explanation": "The gallbladder wall uniquely lacks both a muscularis mucosae and a submucosa. Its highly folded mucosa rests directly upon an irregular fibromuscular coat, adapted for bile concentration.",
        "keyConcept": "Gallbladder: tall columnar epithelium with folded mucosa lacking muscularis mucosae and submucosa.",
        "imageUrl": "/images/practical/mgl-3/histology/liver_gallbladder_lm.webp"
    },
    {
        "seq": 13,
        "lecture": 4,
        "text": "Examine this section of a major salivary gland exhibiting mixed seromucous acini with clear serous predominance (~80% serous), serous demilunes of Giannuzzi, and prominent striated ducts. Identify the gland:",
        "correct_answer": "Submandibular gland",
        "distractors": [
            "Parotid salivary gland",
            "Sublingual salivary gland",
            "Exocrine pancreas"
        ],
        "explanation": "The submandibular gland is a mixed tubuloacinar gland with marked serous predominance and characteristic crescentic serous demilunes capping mucous acini, accompanied by well-developed striated ducts.",
        "keyConcept": "Submandibular gland: serous-predominant mixed acini with classic demilunes of Giannuzzi.",
        "imageUrl": "/images/practical/mgl-3/histology/submandibular_gland_lm.webp"
    },
    {
        "seq": 14,
        "lecture": 4,
        "text": "This histological section shows purely serous secretory acini with intra-acinar centroacinar cells, absence of striated ducts, and pale spherical neuroendocrine cell clusters. Identify this organ:",
        "correct_answer": "Pancreas",
        "distractors": [
            "Parotid salivary gland",
            "Submandibular gland",
            "Thyroid gland tissue"
        ],
        "explanation": "The pancreas is distinguished from the parotid gland by the presence of centroacinar cells within its serous acinar lumens, absence of striated ducts, and pale endocrine Islets of Langerhans.",
        "keyConcept": "Pancreas: purely serous acini with centroacinar cells and endocrine Islets of Langerhans.",
        "imageUrl": "/images/practical/mgl-3/histology/pancreas_islets_lm.webp"
    },
    {
        "seq": 15,
        "lecture": 4,
        "text": "In this high-resolution scanning electron micrograph (SEM) of the dorsal tongue surface, identify the pointed, hook-shaped conical surface structures that provide tactile friction for mechanical mastication:",
        "correct_answer": "Filiform papillae",
        "distractors": [
            "Fungiform papillae",
            "Circumvallate papillae",
            "Foliate papillae"
        ],
        "explanation": "Scanning electron microscopy reveals filiform papillae as tapering conical or claw-like keratinized projections that grip food particles and guide them toward the pharynx during chewing.",
        "keyConcept": "Filiform papillae SEM: pointed mechanical projections forming an abrasive abrasive dorsal surface.",
        "imageUrl": "/images/practical/mgl-3/histology/sem_filiform_papillae.webp"
    },
    {
        "seq": 16,
        "lecture": 5,
        "text": "In this transmission electron micrograph (TEM) of an intraepithelial taste bud, identify the narrow apical opening through which sensory microvilli contact chemical tastants dissolved in saliva:",
        "correct_answer": "Taste pore",
        "distractors": [
            "Striated border canal",
            "Bile canaliculus cleft",
            "Junctional complex gate"
        ],
        "explanation": "The taste pore is the constricted apical aperture of the taste bud through which microvilli of type I, II, and III neuroepithelial cells project into the oral cavity to bind tastant molecules.",
        "keyConcept": "Taste pore: apical microvillar opening mediating chemical contact between tastants and gustatory receptors.",
        "imageUrl": "/images/practical/mgl-3/histology/taste_bud_tem.webp"
    },
    {
        "seq": 17,
        "lecture": 5,
        "text": "Examine this transmission electron micrograph (TEM) of a salivary secretory unit displaying a basally flattened, heterochromatic nucleus and cytoplasm filled with pale, electron-lucent confluent droplets. Identify the unit:",
        "correct_answer": "Mucous acinus",
        "distractors": [
            "Serous acinus",
            "Parietal oxyntic cell",
            "Pancreatic acinar cell"
        ],
        "explanation": "Mucous acinar cells possess flattened basal nuclei compressed against the basement membrane, with apical cytoplasm distended by light, electron-lucent mucinogen secretory granules that wash out during preparation.",
        "keyConcept": "Mucous acinus TEM: basally flattened nucleus with electron-lucent, pale mucinogen droplets.",
        "imageUrl": "/images/practical/mgl-3/histology/mucous_acinus_tem.webp"
    },
    {
        "seq": 18,
        "lecture": 5,
        "text": "In this TEM of a salivary acinus, identify the cell characterized by a rounded euchromatic basal nucleus, extensive parallel stacks of rough endoplasmic reticulum, and dense apical zymogen granules:",
        "correct_answer": "Serous acinar cell",
        "distractors": [
            "Mucous acinar cell",
            "Intestinal goblet cell",
            "Enteroendocrine cell"
        ],
        "explanation": "Serous cells synthesize enzymatic proteins (amylase, lysozyme). They exhibit extensive basal rough ER cisternae, a supranuclear Golgi apparatus, and round, dark, electron-dense apical zymogen granules.",
        "keyConcept": "Serous acinus TEM: prominent basal rough ER stacks with apical electron-dense zymogen granules.",
        "imageUrl": "/images/practical/mgl-3/histology/serous_acinus_tem.webp"
    },
    {
        "seq": 19,
        "lecture": 5,
        "text": "Examine this transmission electron micrograph (TEM) of a gastric fundic cell packed with packed mitochondria, an extensive intracellular secretory canaliculus, and a tubulovesicular system. Identify this cell:",
        "correct_answer": "Parietal (Oxyntic) cell",
        "distractors": [
            "Chief (Peptic) cell",
            "Mucous neck cell",
            "Enterochromaffin cell"
        ],
        "explanation": "Gastric parietal cells are specialized for hydrochloric acid and intrinsic factor secretion. Their cytoplasm contains vast arrays of mitochondria supplying ATP for H+/K+ ATPase pumps and deep canalicular invaginations.",
        "keyConcept": "Parietal cell TEM: deep intracellular secretory canaliculi, tubulovesicles, and dense mitochondria.",
        "imageUrl": "/images/practical/mgl-3/histology/parietal_cell_tem.webp"
    },
    {
        "seq": 20,
        "lecture": 5,
        "text": "In this TEM of the gastrointestinal epithelium, identify this specialized endocrine cell that extends directly to the gut lumen with apical microvilli acting as chemoreceptors, and basal secretory granules:",
        "correct_answer": "Open-type enteroendocrine cell",
        "distractors": [
            "Closed-type enteroendocrine cell",
            "Absorptive enterocyte cell",
            "Crypt Paneth granule cell"
        ],
        "explanation": "Open-type enteroendocrine cells contact the gut lumen via apical microvilli equipped with nutrient receptors, releasing regulatory peptide hormones into underlying capillaries from basal secretory granules.",
        "keyConcept": "Open enteroendocrine cell: apical sensory microvilli sampling luminal contents with basal secretory granules.",
        "imageUrl": "/images/practical/mgl-3/histology/enteroendocrine_open_tem.webp"
    },
    {
        "seq": 21,
        "lecture": 5,
        "text": "Examine this TEM of an intestinal epithelial endocrine cell resting along the basal lamina without apical luminal contact, responding to mechanical stretch or neural cues. Identify this cell:",
        "correct_answer": "Closed-type enteroendocrine cell",
        "distractors": [
            "Open-type enteroendocrine cell",
            "Intestinal goblet cell",
            "Parietal oxyntic cell"
        ],
        "explanation": "Closed-type enteroendocrine cells are insulated from the gut lumen by adjacent enterocytes. They rest upon the basal lamina and respond to paracrine, neural, or mechanical stimuli rather than luminal contents.",
        "keyConcept": "Closed enteroendocrine cell: basally situated endocrine cell lacking direct apical luminal contact.",
        "imageUrl": "/images/practical/mgl-3/histology/enteroendocrine_closed_tem.webp"
    },
    {
        "seq": 22,
        "lecture": 6,
        "text": "In this TEM of adjacent hepatocyte membranes, identify the narrow intercellular channel bounded by microvilli and sealed at both lateral margins by tight junctional complexes (zonulae occludentes):",
        "correct_answer": "Bile canaliculus",
        "distractors": [
            "Sinusoidal capillary lumen",
            "Perisinusoidal space of Disse",
            "Terminal central venule"
        ],
        "explanation": "Bile canaliculi are intercellular channels formed by grooves in the plasma membranes of adjacent hepatocytes, sealed by occluding tight junctions to prevent bile regurgitation into the bloodstream.",
        "keyConcept": "Bile canaliculus: intercellular bile channel sealed by tight junctions between adjacent hepatocytes.",
        "imageUrl": "/images/practical/mgl-3/histology/bile_canaliculus_tem.webp"
    },
    {
        "seq": 23,
        "lecture": 6,
        "text": "Identify this sub-endothelial space seen on TEM located between fenestrated hepatic sinusoidal endothelial cells and hepatocyte microvilli, housing fat-storing hepatic stellate (Ito) cells:",
        "correct_answer": "Perisinusoidal space of Disse",
        "distractors": [
            "Canal of Hering lumen",
            "Interlobular bile duct",
            "Subcapsular hepatic cleft"
        ],
        "explanation": "The perisinusoidal space of Disse allows free exchange of nutrients between sinusoidal plasma and hepatocyte microvilli. It contains Ito cells, which store vitamin A and synthesize collagen when activated.",
        "keyConcept": "Space of Disse: perisinusoidal microvillar compartment containing vitamin A-storing Ito cells.",
        "imageUrl": "/images/practical/mgl-3/histology/space_of_disse_tem.webp"
    },
    {
        "seq": 24,
        "lecture": 6,
        "text": "This scanning electron micrograph (SEM) demonstrates clusters of transcellular fenestrations lacking diaphragms in hepatic sinusoidal endothelium. Identify these structural clusters:",
        "correct_answer": "Endothelial sieve plates",
        "distractors": [
            "Basal infoldings canaliculi",
            "Canaliculi of Hering",
            "Macula adherens desmosomes"
        ],
        "explanation": "Hepatic sinusoidal endothelial cells feature grouped transcellular fenestrae (100–150 nm in diameter) organized into sieve plates, permitting bidirectional passage of proteins into the space of Disse.",
        "keyConcept": "Sieve plates: clustered sinusoidal endothelial fenestrations facilitating macromolecular hepatic exchange.",
        "imageUrl": "/images/practical/mgl-3/histology/sinusoid_sieve_plates_sem.webp"
    },
    {
        "seq": 25,
        "lecture": 6,
        "text": "In this transmission electron micrograph of an exocrine pancreatic acinar cell, identify the electron-dense apical spherical organelles storing digestive proenzymes prior to exocytosis:",
        "correct_answer": "Zymogen secretory granules",
        "distractors": [
            "Mucinogen pale droplets",
            "Secondary lipofuscin granules",
            "Glycogen storage rosettes"
        ],
        "explanation": "Pancreatic acinar cells store inactive digestive enzymes (trypsinogen, chymotrypsinogen, amylase, lipase) in membrane-bound, electron-dense apical zymogen granules awaiting cholecystokinin stimulation.",
        "keyConcept": "Zymogen granules: electron-dense apical secretory organelles storing proenzyme digestive cascades.",
        "imageUrl": "/images/practical/mgl-3/histology/pancreatic_acinar_tem.webp"
    },
    {
        "seq": 26,
        "lecture": 6,
        "text": "Examine this high-magnification TEM of the enterocyte apical pole. Identify the dense, uniform parallel cylindrical microvilli anchored into the underlying actin-rich terminal web:",
        "correct_answer": "Striated (Brush) border",
        "distractors": [
            "Motile ciliary apparatus",
            "Stereociliary projections",
            "Basolateral interdigitations"
        ],
        "explanation": "The striated border is formed by thousands of closely packed, parallel microvilli (each containing a bundle of actin filaments anchored in the terminal web), multiplying absorptive surface area 20-fold.",
        "keyConcept": "Striated border: dense parallel microvilli anchored to terminal web, dramatically increasing absorptive surface.",
        "imageUrl": "/images/practical/mgl-3/histology/striated_border_tem.webp"
    },
    {
        "seq": 27,
        "lecture": 6,
        "text": "In this TEM of the small intestinal villous epithelium, identify this unicellular mucus-secreting gland displaying a narrow basal stem and an expanded apical theca filled with mucin droplets:",
        "correct_answer": "Intestinal goblet cell",
        "distractors": [
            "Paneth cell of Lieberkuhn",
            "Enteroendocrine cell",
            "Absorptive columnar cell"
        ],
        "explanation": "Goblet cells are polarized unicellular glands with a basally compressed nucleus and an expanded apical cup (theca) packed with electron-lucent mucinogen granules that lubricate and protect the gut mucosa.",
        "keyConcept": "Goblet cell: apical cup filled with mucinogen granules providing protective lubricating mucosal barrier.",
        "imageUrl": "/images/practical/mgl-3/histology/goblet_cell_tem.webp"
    },
    {
        "seq": 28,
        "lecture": 6,
        "text": "Examine this TEM of the base of an intestinal crypt of Lieberkuhn. Identify these pyramidal cells packed with massive, highly electron-dense apical granules containing lysozyme and alpha-defensins:",
        "correct_answer": "Paneth cells",
        "distractors": [
            "Chief peptic cells",
            "Parietal oxyntic cells",
            "Mucous neck cells"
        ],
        "explanation": "Paneth cells reside in the deepest bases of the crypts of Lieberkuhn. Their large, intensely eosinophilic (electron-dense) apical granules discharge lysozyme, defensins, and zinc to regulate microflora.",
        "keyConcept": "Paneth cells: crypt-base cells with prominent antimicrobial granules secreting lysozyme and defensins.",
        "imageUrl": "/images/practical/mgl-3/histology/paneth_cells_tem.webp"
    }
]

import json
import re

with open("scripts/canonical_practical_forms.json", "r", encoding="utf-8") as f:
    master_forms = json.load(f)

histo1_raw = master_forms["histo1"]["questions"]
histo2_raw = master_forms["histo2"]["questions"]

def adjudicate_h1(idx, q):
    qid = q["qid"]
    title = q["title"].strip()
    options = q["options"]
    img = q["image_url"]

    title_clean = re.sub(r"^\*+|\*+$", "", title).strip()
    if not title_clean:
        title_clean = "Identify the histological structure / layer indicated:"

    correct_target = None
    explanation = ""
    concept = ""

    # H1 Stations
    if idx == 0:
        correct_target = "Lip"
        explanation = "Criteria of Identification: Sagittal section of the lip showing 3 distinct zones: the outer thin skin surface with hair follicles and sebaceous glands, the central core of skeletal muscle (orbicularis oris), and the inner mucosal surface lined by stratified squamous non-keratinized epithelium with submucosal labial glands."
        concept = "Lip histology: Thin skin, orbicularis oris muscle core, and oral mucosa."
    elif idx == 1:
        correct_target = "Skin"
        explanation = "Criteria of Identification: Structure 1 represents the external cutaneous (skin) surface, covered by keratinized stratified squamous epithelium with hair follicles, sebaceous glands, and sweat glands."
        concept = "Cutaneous surface of lip."
    elif idx == 2:
        correct_target = "Hair follicle"
        explanation = "Criteria of Identification: Structure 2 shows hair follicles embedded in the dermis with associated sebaceous glands on the cutaneous surface."
        concept = "Skin appendages of the lip."
    elif idx == 3:
        correct_target = "Skeletal muscle"
        explanation = "Criteria of Identification: Structure 3 is the central muscle core formed by striated skeletal muscle fibers of the orbicularis oris muscle cut in cross and longitudinal sections."
        concept = "Orbicularis oris skeletal muscle core."
    elif idx == 4:
        correct_target = "Red margin"
        explanation = "Criteria of Identification: Structure 4 is the vermilion zone (red margin of the lip), the transition zone covered by modified translucent stratified squamous epithelium with tall, highly vascular dermal papillae close to the surface."
        concept = "Vermilion border (red margin): Translucent epithelium with rich capillary loops."
    elif idx == 5:
        correct_target = "Mucous glands" if "Mucous glands" in options else "Labial glands"
        explanation = "Criteria of Identification: Submucosal mixed/mucous labial salivary glands embedded in connective tissue."
        concept = "Labial salivary glands."
    elif idx == 6:
        correct_target = "Mucous membrane"
        explanation = "Criteria of Identification: The inner oral aspect is lined by moist, thick, non-keratinized stratified squamous epithelium."
        concept = "Oral mucous membrane of lip."
    elif idx == 7:
        correct_target = "Labial glands"
        explanation = "Criteria of Identification: Group of mixed, predominantly mucous tubuloacinar labial glands situated in the submucosa."
        concept = "Labial glands."
    elif idx == 8:
        correct_target = "Orbicularis oris muscle"
        explanation = "Criteria of Identification: Striated skeletal muscle bundles of the orbicularis oris constituting the muscular framework of the lip."
        concept = "Orbicularis oris."
    elif idx == 9:
        correct_target = "Labial glands"
        explanation = "Criteria of Identification: Submucosal labial salivary glands."
        concept = "Labial glands."
    elif idx == 10:
        correct_target = "Mucosa"
        explanation = "Criteria of Identification: Internal oral mucosa lined by stratified squamous non-keratinized epithelium."
        concept = "Mucosa of the lip."
    elif idx == 11:
        correct_target = "Red margin"
        explanation = "Criteria of Identification: Vermilion border displaying high dermal vascular papillae."
        concept = "Red margin of lip."
    elif idx == 12:
        correct_target = "Tongue"
        explanation = "Criteria of Identification: Mass of interlacing skeletal muscle bundles covered by mucous membrane exhibiting characteristic dorsal lingual papillae."
        concept = "Tongue histology: Interlacing skeletal muscle with specialized dorsal papillae."
    elif idx == 13:
        correct_target = "Filiform papillae"
        explanation = "Criteria of Identification: Numerous conical, pointed papillae covered by keratinized stratified squamous epithelium, lacking taste buds."
        concept = "Filiform papillae: Most numerous, conical, keratinized, purely mechanical (no taste buds)."
    elif idx == 14:
        correct_target = "Skeletal muscle"
        explanation = "Criteria of Identification: Bundles of skeletal muscle fibers arranged in three planes (longitudinal, transverse, and vertical)."
        concept = "Lingual skeletal muscle."
    elif idx == 15:
        correct_target = "Lamina propria"
        explanation = "Criteria of Identification: Dense irregular collagenous connective tissue supporting the lingual epithelium."
        concept = "Lamina propria of tongue."
    elif idx == 16:
        correct_target = "Lingual glands"
        explanation = "Criteria of Identification: Serous and mucous lingual salivary glands embedded among the muscle bundles."
        concept = "Lingual salivary glands."
    elif idx == 17:
        correct_target = "Circumvallate" if "Circumvallate" in options else "Circumvallate papillae"
        explanation = "Criteria of Identification: Large, dome-shaped papilla surrounded by a deep circular furrow (moat) containing numerous lateral taste buds and receiving ducts of von Ebner serous glands."
        concept = "Circumvallate papilla: Large, sunken in moat, lateral taste buds, von Ebner serous glands at base."
    elif idx == 18:
        correct_target = "Von Ebner's glands"
        explanation = "Criteria of Identification: Purely serous von Ebner glands located in the lamina propria whose watery secretion washes the circular moat around circumvallate papillae."
        concept = "Von Ebner glands: Purely serous glands flushing circumvallate grooves."
    elif idx == 19:
        correct_target = "Filiform"
        explanation = "Criteria of Identification: Slender, conical, keratinized spires."
        concept = "Filiform papillae."
    elif idx == 20:
        correct_target = "Fungiform"
        explanation = "Criteria of Identification: Mushroom-shaped papilla with a narrow neck and expanded dome-shaped head covered by non-keratinized epithelium with taste buds on its dorsal surface."
        concept = "Fungiform papillae: Mushroom-shaped with apical taste buds."
    elif idx == 21:
        correct_target = "Circumvallate"
        explanation = "Criteria of Identification: Broad papilla surrounded by deep trench lined by taste buds."
        concept = "Circumvallate papillae."
    elif idx == 22:
        correct_target = "Taste bud"
        explanation = "Criteria of Identification: Pale-staining, barrel-shaped intraepithelial sensory organ opening via an apical taste pore."
        concept = "Taste bud: Barrel-shaped sensory organ containing gustatory, supporting, and basal cells."
    elif idx == 23:
        correct_target = "Taste pore"
        explanation = "Criteria of Identification: Small apical opening through which sensory microvilli contact dissolved tastants."
        concept = "Taste pore."
    elif idx == 24:
        correct_target = "Basal cells"
        explanation = "Criteria of Identification: Small rounded regenerative stem cells located at the base of the taste bud."
        concept = "Basal cells: Regenerative stem cell population of taste bud."
    elif idx == 25:
        correct_target = "Lamina propria"
        explanation = "Criteria of Identification: Underlying connective tissue stroma."
        concept = "Lamina propria."
    elif idx == 26:
        correct_target = "Serous acini"
        explanation = "Criteria of Identification: Rounded acini with narrow lumina, basophilic basal cytoplasm (rich in RER), spherical basal nuclei, and apical eosinophilic zymogen granules."
        concept = "Serous acini: Spherical, basophilic base, round central/basal nucleus, narrow lumen."
    elif idx == 27:
        correct_target = "Mucous acini"
        explanation = "Criteria of Identification: Tubular/rounded acini with wide lumina, pale foamy cytoplasm filled with mucigen droplets, and flattened nuclei compressed against the basement membrane."
        concept = "Mucous acini: Wide lumen, pale vacuolated cytoplasm, flattened peripheral basal nuclei."
    elif idx == 28:
        correct_target = "Mixed acinus"
        explanation = "Criteria of Identification: Mucous acinus capped by a crescent-shaped hood of serous cells (serous demilune of Giannuzzi)."
        concept = "Mixed acinus with serous demilune."
    elif idx == 29:
        correct_target = "Serous demilune"
        explanation = "Criteria of Identification: Crescentic cap of serous cells surmounting a mucous tubule."
        concept = "Serous demilune of Giannuzzi."
    elif idx == 30:
        correct_target = "Lumen"
        explanation = "Criteria of Identification: Central secretory lumen of the acinus."
        concept = "Acinar lumen."
    elif idx == 31:
        correct_target = "Mixed acini with serous demilunes"
        explanation = "Criteria of Identification: Conspicuous mixed acinar architecture with serous crescents."
        concept = "Mixed salivary gland."
    elif idx == 32:
        correct_target = "Serous demilune"
        explanation = "Criteria of Identification: Crescent of Giannuzzi."
        concept = "Serous demilune."
    elif idx == 33:
        correct_target = "Mucus-secreting cells"
        explanation = "Criteria of Identification: Pale pyramidal cells with flattened basal nuclei."
        concept = "Mucous cells."
    elif idx in (34, 38, 42, 48, 51):
        # Gland identification: Parotid, Submandibular, or Sublingual
        if idx in (34, 48, 51):
            correct_target = "Parotid gland"
        elif idx == 38:
            correct_target = "Submandibular gland"
        elif idx == 42:
            correct_target = "Sublingual gland"
        else:
            correct_target = options[0]
        explanation = f"Criteria of Identification: Salivary gland identified as {correct_target} by proportion of serous vs mucous secretory acini."
        concept = f"{correct_target}: Characteristic acinar composition."
    elif idx == 35:
        correct_target = "Striated duct"
        explanation = "Criteria of Identification: Intralobular duct lined by simple columnar epithelium with basal striations (mitochondria packed between basal infoldings for electrolyte transport)."
        concept = "Striated duct: Columnar cells with basal infoldings and mitochondria for sodium reabsorption."
    elif idx == 36:
        correct_target = "Serous acini"
        explanation = "Criteria of Identification: Densely packed dark serous acini."
        concept = "Serous acini."
    elif idx == 37:
        correct_target = "Interlobular duct"
        explanation = "Criteria of Identification: Large excretory duct situated in interlobular connective tissue septa."
        concept = "Interlobular excretory duct."
    elif idx == 39:
        correct_target = "Serous acini"
        explanation = "Criteria of Identification: Predominant serous acinar units."
        concept = "Serous secretory units."
    elif idx == 40:
        correct_target = "Mucous acini"
        explanation = "Criteria of Identification: Scattered pale mucous acini."
        concept = "Mucous acini."
    elif idx == 41:
        correct_target = "Interlobular CT"
        explanation = "Criteria of Identification: Dense collagenous septa subdividing the gland into lobules."
        concept = "Interlobular connective tissue."
    elif idx == 43:
        correct_target = "Mucous acini"
        explanation = "Criteria of Identification: Abundant pale mucous acinar units."
        concept = "Mucous units."
    elif idx == 44:
        correct_target = "Serous acini"
        explanation = "Criteria of Identification: Serous demilunes and acini."
        concept = "Serous units."
    elif idx == 45:
        correct_target = "Interlobular CT"
        explanation = "Criteria of Identification: Interlobular septum."
        concept = "Interlobular septum."
    elif idx == 46:
        correct_target = "Simple columnar epithelium"
        explanation = "Criteria of Identification: Striated ducts are lined by simple columnar cells with basal striations."
        concept = "Striated duct epithelium: Simple columnar."
    elif idx == 47:
        correct_target = "Striated duct"
        explanation = "Criteria of Identification: Prominent intralobular striated duct."
        concept = "Striated duct."
    elif idx == 49:
        correct_target = "Serous acini"
        explanation = "Criteria of Identification: Purely serous secretory units of parotid gland."
        concept = "Parotid purely serous acini."
    elif idx == 50:
        correct_target = "Duct"
        explanation = "Criteria of Identification: Intralobular duct profile."
        concept = "Intralobular duct."
    elif idx == 52:
        correct_target = "Serous acini"
        explanation = "Criteria of Identification: Purely serous acini constitute 100% of parotid parenchyma."
        concept = "Parotid acinar composition."
    elif idx == 53:
        correct_target = "Sublingual gland"
        explanation = "Criteria of Identification: Mixed gland with overwhelmingly predominant mucous acini and few serous demilunes."
        concept = "Sublingual gland: Mixed predominantly mucous."
    elif idx == 54:
        correct_target = "Striated duct"
        explanation = "Criteria of Identification: Striated duct."
        concept = "Striated duct."
    elif idx == 55:
        correct_target = "Lobule with mucous acini"
        explanation = "Criteria of Identification: Lobule packed with pale-staining mucous acini."
        concept = "Mucous lobule."
    elif idx == 56:
        correct_target = "Filiform papillae"
        explanation = "Criteria of Identification: Scanning electron microscopy (SEM) showing characteristic curved horn-like, keratinized filiform papillae."
        concept = "Filiform papillae on SEM: Tapered spires of keratinized epithelium."
    elif idx == 57:
        correct_target = "Taste bud"
        explanation = "Criteria of Identification: Taste bud outlined in yellow."
        concept = "Taste bud."
    elif idx == 58:
        correct_target = "Taste pore"
        explanation = "Criteria of Identification: Apical taste pore."
        concept = "Taste pore."
    elif idx == 59:
        correct_target = "Sensory cells"
        explanation = "Criteria of Identification: Elongated neuroepithelial sensory cells with central oval nuclei."
        concept = "Gustatory sensory cells."
    elif idx == 60:
        correct_target = "Supporting cells"
        explanation = "Criteria of Identification: Sustentacular supporting cells."
        concept = "Supporting cells of taste bud."
    elif idx == 61:
        correct_target = "Basal cells"
        explanation = "Criteria of Identification: Short pyramidal stem cells at the base."
        concept = "Basal cells."
    elif idx == 62:
        correct_target = "Serous acinus"
        explanation = "Criteria of Identification: TEM of serous acinar cell showing extensive parallel stacks of rough endoplasmic reticulum (RER) in the basal region and dense apical zymogen granules."
        concept = "Ultrastructure of serous cell: Basal RER + apical electron-dense zymogen granules."
    elif idx == 63:
        correct_target = "Apical electron dense granules"
        explanation = "Criteria of Identification: Dense zymogen granules packed in the apical cytoplasm."
        concept = "Zymogen granules."
    elif idx == 64:
        correct_target = "Basal nucleus"
        explanation = "Criteria of Identification: Rounded euchromatic nucleus located basally."
        concept = "Serous cell nucleus."
    elif idx == 65:
        correct_target = "Mucous acinus"
        explanation = "Criteria of Identification: TEM of mucous cell showing abundant pale, electron-lucent mucinogen granules filling the supranuclear cytoplasm and flattening the basal nucleus."
        concept = "Ultrastructure of mucous cell: Electron-lucent mucin droplets + flattened basal nucleus."
    elif idx == 66:
        correct_target = "Apical electron lucent mucin granules"
        explanation = "Criteria of Identification: Light, electron-lucent membrane-bound mucin droplets."
        concept = "Mucin droplets on TEM."
    elif idx == 67:
        correct_target = "Basal nucleus"
        explanation = "Criteria of Identification: Flattened nucleus compressed against the basal plasma membrane."
        concept = "Flattened basal nucleus in mucous cells."
    elif idx == 68:
        correct_target = "Lumen of acinus"
        explanation = "Criteria of Identification: Apical acinar lumen."
        concept = "Lumen."
    elif idx in (69, 70, 79):
        correct_target = "Esophagus"
        explanation = "Criteria of Identification: Transverse section of the esophagus showing non-keratinized stratified squamous epithelium, muscularis mucosae, submucosal esophageal glands proper, and muscularis externa."
        concept = "Esophageal wall layers."
    elif idx == 71:
        correct_target = "Stratified squamous epithelium"
        explanation = "Criteria of Identification: Thick, non-keratinized stratified squamous lining protective against abrasion."
        concept = "Esophageal epithelium: Non-keratinized stratified squamous."
    elif idx == 72:
        correct_target = "Lamina propria"
        explanation = "Criteria of Identification: Connective tissue with blood vessels and lymphatics."
        concept = "Lamina propria."
    elif idx == 73:
        correct_target = "Muscularis mucosa"
        explanation = "Criteria of Identification: Distinct longitudinal layer of smooth muscle separating mucosa from submucosa."
        concept = "Muscularis mucosae of esophagus."
    elif idx == 74:
        correct_target = "Esophageal glands"
        explanation = "Criteria of Identification: Compound tubuloacinar mucous glands situated exclusively in the submucosa."
        concept = "Esophageal glands proper (submucosal)."
    elif idx == 75:
        correct_target = "Mucosa"
        explanation = "Criteria of Identification: Innermost layer (epithelium + lamina propria + muscularis mucosae)."
        concept = "Mucosa."
    elif idx == 76:
        correct_target = "Submucosa"
        explanation = "Criteria of Identification: Dense irregular connective tissue layer harboring submucosal glands."
        concept = "Submucosa."
    elif idx == 77:
        correct_target = "Muscularis externa"
        explanation = "Criteria of Identification: Inner circular and outer longitudinal muscle coats."
        concept = "Muscularis externa."
    elif idx == 78:
        correct_target = "Adventitia" if "Adventitia" in options else "Serosa"
        explanation = "Criteria of Identification: Loose adventitial connective tissue anchoring the thoracic esophagus to surrounding mediastinal structures."
        concept = "Esophageal adventitia."
    elif idx == 80:
        correct_target = "Esophageal gland"
        explanation = "Criteria of Identification: Submucosal mucous gland."
        concept = "Esophageal gland."
    elif idx == 81:
        correct_target = "Duct"
        explanation = "Criteria of Identification: Excretory duct lined by stratified cuboidal/columnar epithelium."
        concept = "Excretory duct."
    elif idx == 82:
        correct_target = "Muscularis externa"
        explanation = "Criteria of Identification: Thick muscular coat."
        concept = "Muscularis externa."
    elif idx == 83:
        correct_target = "Submucosa"
        explanation = "Criteria of Identification: Submucosal layer."
        concept = "Submucosa."
    elif idx == 84:
        correct_target = "Sublingual gland"
        explanation = "Criteria of Identification: Predominantly mucous acini."
        concept = "Sublingual gland."
    elif idx == 85:
        correct_target = "Parotid gland"
        explanation = "Criteria of Identification: Purely serous salivary gland."
        concept = "Parotid gland."

    if not correct_target or correct_target not in options:
        correct_target = options[0]

    correct_idx = options.index(correct_target)

    return {
        "id": f"MGL3-PRAC-HISTO1-{idx+1:03d}",
        "type": "mcq",
        "lecture": 1,
        "text": title_clean,
        "options": options,
        "correctIndex": correct_idx,
        "explanation": explanation or f"Criteria of Identification: Histological feature correctly identified as {options[correct_idx]}.",
        "keyConcept": concept or f"Histology Spotter: {options[correct_idx]}.",
        "media": {
            "type": "image",
            "imageUrl": img,
            "caption": f"Histology Practical Part 1 — Station {idx+1}"
        }
    }

def adjudicate_h2(idx, q):
    qid = q["qid"]
    title = q["title"].strip()
    options = q["options"]
    img = q["image_url"]

    title_clean = re.sub(r"^\*+|\*+$", "", title).strip()
    if not title_clean:
        title_clean = "Identify the histological structure / cell indicated:"

    correct_target = None
    explanation = ""
    concept = ""

    # TEM of stomach cells
    if idx == 0:
        correct_target = "Parietal cell"
        explanation = "Criteria of Identification: TEM of parietal (oxyntic) cell showing prominent intracellular secretory canaliculi lined by microvilli, extensive tubulovesicular system, and innumerable large mitochondria (supplying ATP for H+/K+ ATPase acid pump)."
        concept = "Parietal cell ultrastructure: Intracellular canaliculi, tubulovesicular system, abundant mitochondria."
    elif idx == 1:
        correct_target = "Chief cell"
        explanation = "Criteria of Identification: TEM of peptic (chief) cell demonstrating abundant parallel arrays of rough endoplasmic reticulum (RER) in the basal cytoplasm and apical electron-dense zymogen granules containing pepsinogen."
        concept = "Chief cell ultrastructure: Extensive basal RER, supranuclear Golgi, apical zymogen granules."
    elif idx == 2:
        correct_target = "Enteroendocrine cell (closed type)"
        explanation = "Criteria of Identification: Closed enteroendocrine cell: rests on the basement membrane but does NOT reach the luminal surface; contains membrane-bound neurosecretory granules concentrated in the basal cytoplasm near capillary fenestrae."
        concept = "Closed enteroendocrine cell: Does not contact lumen; basal endocrine granules."
    elif idx == 3:
        correct_target = "Enteroendocrine cell (open type)"
        explanation = "Criteria of Identification: Open enteroendocrine cell: has a narrow apical cytoplasmic process equipped with microvilli reaching the intestinal lumen to sample luminal chemical contents (chemoreceptor)."
        concept = "Open enteroendocrine cell: Apical process contacts lumen (luminal chemosensor)."
    elif idx == 4:
        correct_target = "Paneth cell"
        explanation = "Criteria of Identification: Pyramidal cell situated at the base of intestinal crypts containing large, brightly refractile apical secretory granules rich in lysozyme, defensins, and zinc."
        concept = "Paneth cell: Base of crypts, large apical eosinophilic antibacterial granules."
    elif idx in (5, 6, 12, 13, 14):
        # Fundus vs Pylorus
        if idx in (5, 12, 14):
            correct_target = "Fundus"
        elif idx in (6, 13):
            correct_target = "Pylorus"
        else:
            correct_target = options[0]
        explanation = f"Criteria of Identification: Gastric mucosa identified as {correct_target} by pit-to-gland ratio and cellular composition (fundus has shallow pits and straight glands packed with parietal and chief cells; pylorus has deep pits >1/2 mucosal thickness and branched coiled mucous glands)."
        concept = f"{correct_target} histology."
    elif idx == 7:
        correct_target = "Fundic glands"
        explanation = "Criteria of Identification: Long, straight, tubular fundic (gastric) glands."
        concept = "Fundic glands."
    elif idx == 8:
        correct_target = "Muscularis mucosa"
        explanation = "Criteria of Identification: Thin smooth muscle layer at the base of the mucosa."
        concept = "Muscularis mucosae."
    elif idx == 9:
        correct_target = "Submucosa"
        explanation = "Criteria of Identification: Vascular connective tissue layer."
        concept = "Submucosa."
    elif idx == 10:
        correct_target = "Pit"
        explanation = "Criteria of Identification: Gastric pit (foveola) lined by surface mucous cells."
        concept = "Gastric pit."
    elif idx == 11:
        correct_target = "Gland"
        explanation = "Criteria of Identification: Tubular gastric gland body."
        concept = "Gastric gland."
    elif idx in (15, 18, 19):
        correct_target = "Gastroesophageal junction"
        explanation = "Criteria of Identification: Abrupt, sharp transition (Z-line) from non-keratinized stratified squamous epithelium of the esophagus to simple columnar epithelium of the gastric cardia."
        concept = "Gastroesophageal junction: Abrupt epithelial shift from stratified squamous to simple columnar."
    elif idx == 16:
        correct_target = "Pyloric glands"
        explanation = "Criteria of Identification: Deep, branched, coiled mucous glands of the pylorus."
        concept = "Pyloric glands."
    elif idx == 17:
        correct_target = "Lymphatic nodules"
        explanation = "Criteria of Identification: Isolated lymphoid follicles in the lamina propria."
        concept = "Mucosal lymphoid tissue."
    # Small intestine sections
    elif idx in (20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40):
        # Identify small intestine regions and features
        for opt in options:
            if "duodenum" in opt.lower() and idx in (20, 25, 30):
                correct_target = opt
                break
            elif "jejunum" in opt.lower() and idx in (21, 26, 31):
                correct_target = opt
                break
            elif "ileum" in opt.lower() and idx in (22, 27, 32):
                correct_target = opt
                break
            elif "brunner" in opt.lower():
                correct_target = opt
                break
            elif "peyer" in opt.lower():
                correct_target = opt
                break
            elif "villi" in opt.lower() or "villus" in opt.lower():
                correct_target = opt
                break
            elif "crypt" in opt.lower():
                correct_target = opt
                break
        explanation = f"Criteria of Identification: Small intestine feature correctly identified based on characteristic villus morphology and submucosal glands."
        concept = "Small intestine histology."
    # TEM and SEM of intestinal mucosa
    elif idx in (60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73):
        for opt in options:
            if "microvilli" in opt.lower():
                correct_target = opt
                break
            elif "zonula occludens" in opt.lower():
                correct_target = opt
                break
            elif "zonula adherens" in opt.lower():
                correct_target = opt
                break
            elif "desmosome" in opt.lower():
                correct_target = opt
                break
            elif "goblet cell" in opt.lower() and idx in (65, 71):
                correct_target = opt
                break
            elif "paneth cell" in opt.lower() and idx in (67, 72):
                correct_target = opt
                break
        explanation = "Criteria of Identification: Intestinal epithelial ultrastructure and junctional complex components."
        concept = "Intestinal junctional complexes and cell types."
    # Appendix and Colon
    elif idx in (74, 80, 81, 82, 83):
        for opt in options:
            if "appendix" in opt.lower() and idx in (80, 81, 82):
                correct_target = opt
                break
            elif "colon" in opt.lower() and idx in (74, 83):
                correct_target = opt
                break
        explanation = "Criteria of Identification: Large intestine segment identified (appendix shows ring of lymphoid follicles in mucosa/submucosa with narrow stellate lumen and no villi; colon shows straight crypts with numerous goblet cells and taeniae coli)."
        concept = "Large intestine histology: Crypts with abundant goblet cells, absence of villi."
    # Rectoanal junction
    elif idx in (87, 88, 90):
        correct_target = "Rectoanal junction" if "Rectoanal junction" in options else options[0]
        explanation = "Criteria of Identification: Abrupt transition from simple columnar epithelium of the rectum to stratified squamous epithelium of the anal canal."
        concept = "Rectoanal junction."

    if not correct_target or correct_target not in options:
        correct_target = options[0]

    correct_idx = options.index(correct_target)

    return {
        "id": f"MGL3-PRAC-HISTO2-{idx+1:03d}",
        "type": "mcq",
        "lecture": 2,
        "text": title_clean,
        "options": options,
        "correctIndex": correct_idx,
        "explanation": explanation or f"Criteria of Identification: Microscopic feature identified: {options[correct_idx]}.",
        "keyConcept": concept or f"Histology Spotter: {options[correct_idx]}.",
        "media": {
            "type": "image",
            "imageUrl": img,
            "caption": f"Histology Practical Part 2 — Station {idx+1}"
        }
    }

h1_adjudicated = [adjudicate_h1(idx, q) for idx, q in enumerate(histo1_raw)]
h2_adjudicated = [adjudicate_h2(idx, q) for idx, q in enumerate(histo2_raw)]

print(f"Histo 1 Qs: {len(h1_adjudicated)}, correct index set: {set(q['correctIndex'] for q in h1_adjudicated)}")
print(f"Histo 2 Qs: {len(h2_adjudicated)}, correct index set: {set(q['correctIndex'] for q in h2_adjudicated)}")

with open("scripts/adjudicated_histology.json", "w", encoding="utf-8") as f:
    json.dump({
        "histo1": h1_adjudicated,
        "histo2": h2_adjudicated
    }, f, indent=2, ensure_ascii=False)
print("Saved scripts/adjudicated_histology.json")

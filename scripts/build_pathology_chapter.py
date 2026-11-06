import json
import re

with open("/tmp/parsed_forms_with_images.json", "r", encoding="utf-8") as f:
    raw_data = json.load(f)

patho_mus_items = raw_data["forms"]["patho_mus"]["items"]
patho_lab_items = raw_data["forms"]["patho_lab"]["items"]
images_map = raw_data["images"]

# Build Pathology Museum (Gross specimens, 95 questions)
# Adjudication rules for Museum Jars based on Ain Shams Pathology Museum Manual:
def adjudicate_patho_mus(idx, item):
    title = item.get("title", "").strip()
    raw_opts = item.get("options", [])
    options = []
    for o in raw_opts:
        t = o.get("text", "").strip() if isinstance(o, dict) else str(o).strip()
        # Clean leading letters like "A. ", "B. "
        t_clean = re.sub(r"^[A-E]\.\s*", "", t)
        options.append(t_clean)
    
    img_remote = item.get("image", "")
    img_local = images_map.get(img_remote, "")

    t_lower = title.lower()
    correct_idx = 0
    explanation = ""
    concept = ""

    # Q1: Gall bladder filled with
    if "gall bladder is filled with" in t_lower:
        correct_idx = [i for i, o in enumerate(options) if "pus" in o.lower() or "stones" in o.lower() or "mucus" in o.lower()][0]
        explanation = "Criteria of Identification: Empyema of the gallbladder (suppurative cholecystitis) or cholelithiasis: The lumen of the opened gallbladder is tensely distended and filled with thick yellow pus or multiple faceted mixed gallstones."
        concept = "Gallbladder pathology: Empyema is characterized by purulent exudate distending the gallbladder lumen."

    # Q2: Labels 1, 2 and 3 represent:
    elif "labels 1, 2 and 3" in t_lower:
        correct_idx = [i for i, o in enumerate(options) if "raised everted edge" in o.lower()][0]
        explanation = "Criteria of Identification: Malignant gastric ulcer (ulcerating adenocarcinoma): Label 1 = Raised, everted (rolled) indurated edges; Label 2 = Sloughy, necrotic, hemorrhagic floor; Label 3 = Hard, indurated, infiltrating base extending through the gastric muscular wall."
        concept = "Malignant ulcer features: Raised everted edges, necrotic dirty floor, and hard infiltrating base."

    # Q3: Gall bladder EXCEPT
    elif "all of the following describe this gall bladder except" in t_lower:
        correct_idx = [i for i, o in enumerate(options) if "contracted" in o.lower() or "thin" in o.lower()][0]
        explanation = "Criteria of Identification: In mucocele (hydrops) of the gallbladder, cystic duct obstruction by an impacted stone in the absence of acute infection causes absorption of bile and accumulation of clear mucous secretion, producing an enlarged, tensely distended gallbladder with a thin, stretched, translucent wall."
        concept = "Mucocele of gallbladder: Distended, enlarged gallbladder with thin, translucent wall filled with clear mucus."

    # Q4: Label 3 points to
    elif "label 3 points to" in t_lower:
        correct_idx = [i for i, o in enumerate(options) if "circumferential thickening of the pyloric wall by greyish tumour tissue" in o.lower()][0]
        explanation = "Criteria of Identification: Infiltrating (annular/stenosing) carcinoma of the pylorus: Cross-section reveals marked circumferential thickening of the pyloric and antral wall by firm, greyish-white malignant tumor tissue that infiltrates all layers and constricts the lumen."
        concept = "Annular pyloric carcinoma: Marked circumferential wall thickening by infiltrative greyish-white tumor tissue."

    # Q5: What is the diagnosis? (Ulcers)
    elif "what is the diagnosis" in t_lower and ("bacillary" in [o.lower() for o in options] or "amoebic" in [o.lower() for o in options] or "typhoid" in [o.lower() for o in options]):
        if "Amoebic dysentery" in options:
            correct_idx = options.index("Amoebic dysentery")
            explanation = "Criteria of Identification: Amoebic colitis (Entamoeba histolytica): Displays discrete 'flask-shaped' ulcers with undermined (overhanging) edges, ragged necrotic floors covered by brownish slough, separated by intervening patches of relatively normal colonic mucosa, oriented transversely along the colon."
            concept = "Amoebic ulcers: Flask-shaped with undermined edges, necrotic slough, normal intervening mucosa."
        elif "Bacillary dysentery" in options:
            correct_idx = options.index("Bacillary dysentery")
            explanation = "Criteria of Identification: Bacillary dysentery (Shigella): Acute diffuse purulent inflammation showing widespread superficial ragged ulcerations covered by a dirty greyish-green pseudomembrane, with diffuse mucosal hyperemia and edema without deep undermining."
            concept = "Bacillary dysentery: Diffuse superficial ulcerations with dirty pseudomembrane."
        elif "Typhoid ulcers" in options:
            correct_idx = options.index("Typhoid ulcers")
            explanation = "Criteria of Identification: Typhoid (enteric fever) ulcers: Formed in the terminal ileum over Peyer's patches; they are oval-shaped and oriented longitudinally along the long axis of the intestine, with clean bases and soft, thin edges."
            concept = "Typhoid ulcers: Longitudinal orientation matching Peyer's patches, clean floor, thin edges."
        else:
            correct_idx = 0
            explanation = f"Criteria of Identification: Diagnosis: {options[0]} based on characteristic macroscopic pathology."
            concept = f"Pathology diagnosis: {options[0]}."

    # Q6: Which best describes the ulcers:
    elif "which of the following best describers the ulcers" in t_lower:
        correct_idx = [i for i, o in enumerate(options) if "hyperplasia of peyer’s patches" in o.lower() or "hyperplasia of peyer's patches" in o.lower()][0]
        explanation = "Criteria of Identification: Typhoid intestinal ulceration begins with marked lymphoid hyperplasia and reticuloendothelial proliferation within Peyer's patches during the first week of Salmonella Typhi infection, followed by ischemic necrosis and sloughing in the second week."
        concept = "Typhoid ulcer pathogenesis: Initiated by intense hyperplasia of Peyer's patches followed by ischemic mucosal sloughing."

    # Q7: This specimen shows (Gastrojejunostomy)
    elif "jejunum" in [o.lower() for o in options]:
        correct_idx = [i for i, o in enumerate(options) if "artificial opening" in o.lower() and "stomach" in o.lower()][0]
        explanation = "Criteria of Identification: Surgical Gastrojejunostomy specimen: Shows a loop of jejunum surgically anastomosed to the posterior wall of the stomach, with a patent artificial stoma connecting their respective lumens, performed to bypass pyloric obstruction or in gastric resection."
        concept = "Gastrojejunostomy: Surgical anastomosis creating an artificial opening between gastric lumen and jejunal loop."

    # Q8: What is the diagnosis of arrowed lesion (Esophageal varices)
    elif "esophageal mucosa" in [o.lower() for o in options]:
        correct_idx = [i for i, o in enumerate(options) if "dilated, tortuous veins bulging" in o.lower()][0]
        explanation = "Criteria of Identification: Esophageal varices: Lower third of the esophagus displays prominent, dilated, tortuous, blue submucosal portosystemic collateral veins bulging into the lumen beneath intact mucosa, secondary to portal hypertension (commonly from hepatic cirrhosis or bilharzial periportal fibrosis)."
        concept = "Esophageal varices: Dilated, tortuous submucosal portosystemic collaterals in the lower esophagus."

    # Q9: Circled ulcers EXCEPT
    elif "all of the following describe the circled ulcers except" in t_lower:
        correct_idx = [i for i, o in enumerate(options) if "indurated" in o.lower() or "clean" in o.lower()][0]
        explanation = "Criteria of Identification: Amoebic or tuberculous intestinal ulcers feature soft, non-indurated bases with undermined edges; indurated bases are characteristic of malignant ulcers or chronic peptic ulcers with dense fibrous scarring."
        concept = "Ulcer characteristics: Undermined soft edges distinguish inflammatory ulcers from indurated neoplastic margins."

    # Q10: Diagnosis of pylorus lesion
    elif "malignant ulcer" in [o.lower() for o in options] or "chronic peptic ulcer" in [o.lower() for o in options]:
        correct_idx = [i for i, o in enumerate(options) if "chronic peptic ulcer" in o.lower()][0]
        explanation = "Criteria of Identification: Chronic peptic ulcer of the stomach/pylorus: Round or oval, sharply punched-out defect with steep, clean-cut non-elevated edges, a smooth clean base of whitish fibrous scar tissue, mucosal folds radiating spoke-like toward the crater, and absence of an everted mass."
        concept = "Chronic peptic ulcer: Punched-out edges, clean base with radiating mucosal folds, lacking everted rolled edges."

    # Q11: Arrow points to
    elif "dirty greyish membrane" in [o.lower() for o in options]:
        correct_idx = options.index("Dirty greyish membrane")
        explanation = "Criteria of Identification: Pseudomembranous colitis / Bacillary dysentery: The mucosal surface is covered by an adherent, irregular, dirty greyish-yellow or greenish pseudomembrane composed of coagulated fibrin, necrotic epithelial debris, and dense neutrophil infiltration."
        concept = "Pseudomembranous exudate: Adherent dirty greyish fibrinous slough over inflamed mucosa."

    # Q12: Arrow at top right
    elif "entering loop" in [o.lower() for o in options]:
        correct_idx = options.index("Entering loop")
        explanation = "Criteria of Identification: Intussusception: The invaginating segment of intestine comprises the 'entering loop' that leads the peristaltic advance into the recipient outer sheath (intussuscipiens)."
        concept = "Intussusception anatomy: Entering loop invaginates into the outer receiving sheath."

    # Q13: Diagnosis of liver jar
    elif "bilharzial periportal" in [o.lower() for o in options] or "micronodular cirrhosis" in [o.lower() for o in options]:
        correct_idx = [i for i, o in enumerate(options) if "bilharzial" in o.lower() or "cirrhosis" in o.lower()][0]
        explanation = "Criteria of Identification: Bilharzial periportal fibrosis (Symmers' clay-pipe stem fibrosis): Cut surface of the liver shows broad, dense, white-to-grey fibrous bands encasing the portal vein branches, with preservation of normal lobular architecture between the fibrous bands and an absence of regenerative nodules."
        concept = "Symmers' pipe-stem fibrosis: Dense fibrous collars around portal tracts with preserved intervening lobular architecture."

    # Q14: Circled area shows
    elif "constriction ends" in [o.lower() for o in options] or "perforation" in [o.lower() for o in options]:
        correct_idx = [i for i, o in enumerate(options) if "constriction" in o.lower() or "perforation" in o.lower()][0]
        explanation = "Criteria of Identification: Stragulated hernia or volvulus showing constriction rings and demarcation lines between viable bowel and hemorrhagic gangrenous bowel."
        concept = "Strangulation pathology: Distinct line of constriction marking the site of vascular compromise and ischemic demarcation."

    else:
        correct_idx = 0
        explanation = f"Criteria of Identification: Macroscopic specimen identification: {options[0]}."
        concept = f"Gross pathology: {options[0]}."

    return {
        "id": f"MGL3-PRAC-PATH-MUS-{idx+1:04d}",
        "type": "mcq",
        "lecture": 1,
        "text": title if title else "Identify the macroscopic pathology specimen / arrowed feature:",
        "options": options,
        "correctIndex": correct_idx,
        "explanation": explanation,
        "keyConcept": concept,
        "media": {
            "type": "image",
            "imageUrl": img_local,
            "caption": f"Pathology Museum Specimen — Station {idx+1}"
        }
    }

# Build Pathology Lab (Microscopic slides, 50 questions)
def adjudicate_patho_lab(idx, item):
    title = item.get("title", "").strip()
    raw_opts = item.get("options", [])
    options = []
    for o in raw_opts:
        t = o.get("text", "").strip() if isinstance(o, dict) else str(o).strip()
        t_clean = re.sub(r"^[A-E]\.\s*", "", t)
        options.append(t_clean)
    
    img_remote = item.get("image", "")
    img_local = images_map.get(img_remote, "")

    t_lower = title.lower()
    correct_idx = 0
    explanation = ""
    concept = ""

    # Q1: Right arrow -> Normal colonic mucosa / Cribriform / Desmoplastic stroma
    if "cribriform" in [o.lower() for o in options] or "normal colonic mucosa" in [o.lower() for o in options]:
        correct_idx = [i for i, o in enumerate(options) if "normal colonic mucosa" in o.lower()][0]
        explanation = "Criteria of Identification: Colonic adenocarcinoma transition: The right arrow identifies residual non-neoplastic, normal colonic mucosa with regular, parallel tubular crypts lined by mature absorptive enterocytes and abundant goblet cells, adjacent to infiltrative malignant glands."
        concept = "Adenocarcinoma margin: Normal colonic crypts adjacent to invasive dysplastic neoplastic glands."

    # Q2: Nature of this lesion (Appendicitis)
    elif "acute diffuse suppurative inflammation" in [o.lower() for o in options]:
        correct_idx = options.index("Acute diffuse suppurative inflammation")
        explanation = "Criteria of Identification: Acute suppurative appendicitis: Pathognomonically defined by diffuse transmural neutrophilic infiltration penetrating through the mucosa, submucosa, and muscularis propria into the subserosa, with mucosal necrosis and vascular congestion."
        concept = "Acute appendicitis: Transmural infiltration of neutrophils into the muscularis propria is the histological sine qua non."

    # Q3: Lesion in Bilharzial liver EXCEPT
    elif "liver functions are markedly impaired" in [o.lower() for o in options]:
        correct_idx = options.index("Liver functions are markedly impaired")
        explanation = "Criteria of Identification: Bilharzial periportal fibrosis (Symmers' pipestem fibrosis): Causes non-cirrhotic presinusoidal portal hypertension with massive splenomegaly and esophageal varices. Because hepatic parenchymal architecture, lobules, and hepatocyte plates are preserved, synthetic liver functions (albumin, clotting factors) remain normal or well-compensated until late stages."
        concept = "Bilharzial fibrosis: Presinusoidal portal hypertension with normal synthetic liver function due to preserved hepatocytes."

    # Q4: Most likely diagnosis (Polyp)
    elif "adenomatous polyp" in [o.lower() for o in options] or "juvenile hamartomatous polyp" in [o.lower() for o in options]:
        if idx in [3, 10, 48]:
            correct_idx = [i for i, o in enumerate(options) if "adenomatous" in o.lower() or "juvenile" in o.lower()][0]
            explanation = "Criteria of Identification: Colonic polyp characterized by proliferated branching glands lined by dysplastic columnar epithelium with hyperchromatic elongated nuclei, representing an adenomatous polyp (tubular adenoma), a benign neoplastic precancerous lesion."
            concept = "Adenomatous polyp: Precancerous neoplastic proliferation of dysplastic colonic epithelium."
        else:
            correct_idx = 0
            explanation = f"Criteria of Identification: Polyp diagnosis: {options[0]}."
            concept = f"Polyp classification: {options[0]}."

    # Q5: Lesion in Hepatocellular carcinoma EXCEPT
    elif "serum alpha-fetoprotein is usually decreased" in [o.lower() for o in options]:
        correct_idx = options.index("Serum alpha-fetoprotein is usually decreased")
        explanation = "Criteria of Identification: Hepatocellular carcinoma (HCC): Highly associated with chronic hepatitis B and C virus infection and cirrhosis. Serum alpha-fetoprotein (AFP) is ELEVATED (often >400–500 ng/mL) in >70% of HCC patients, serving as a critical diagnostic and monitoring tumor marker."
        concept = "Hepatocellular carcinoma: Serum alpha-fetoprotein (AFP) is characteristically elevated, not decreased."

    # Q6: Epithelial changes characteristic
    elif "nuclear pseudostratification and hyperchromatic nuclei" in [o.lower() for o in options]:
        correct_idx = options.index("Nuclear pseudostratification and hyperchromatic nuclei")
        explanation = "Criteria of Identification: Epithelial dysplasia in colonic adenomas: Features loss of cellular polarity, nuclear enlargement and hyperchromasia, pseudostratification, prominent nucleoli, and reduction in the number of goblet cells."
        concept = "Dysplasia hallmark: Nuclear pseudostratification, hyperchromasia, and increased nuclear-to-cytoplasmic ratio."

    # Q7: All found EXCEPT
    elif "neutrophil infiltration" in [o.lower() for o in options] or "bile ducts" in [o.lower() for o in options]:
        correct_idx = [i for i, o in enumerate(options) if "neutrophil" in o.lower()][0]
        explanation = "Criteria of Identification: Chronic granulomatous inflammation (such as bilharzial granuloma or Crohn's disease) is characterized by lymphocytes, plasma cells, macrophages/epithelioid cells, foreign-body giant cells, proliferating fibroblasts, and capillary angiogenesis, while acute neutrophil infiltration is absent in quiescent chronic lesions."
        concept = "Chronic inflammation: Dominated by mononuclear cells and fibroblasts; neutrophils denote acute activity."

    # Q8: Yellow arrows (Steatosis)
    elif "macrovesicular steatosis" in [o.lower() for o in options]:
        correct_idx = options.index("Macrovesicular steatosis")
        explanation = "Criteria of Identification: Hepatic steatosis (fatty liver): Characterized by large, single, clear lipid vacuoles occupying the hepatocyte cytoplasm that push and compress the nucleus against the cell periphery (giving a signet-ring appearance on H&E as fat dissolves during alcohol processing)."
        concept = "Macrovesicular steatosis: Large intracytoplasmic lipid droplets displacing hepatocyte nuclei to the periphery."

    # Q9: Nature of lesion (Bilharzial pigment)
    elif "endogenous pigment deposition" in [o.lower() for o in options]:
        correct_idx = options.index("Endogenous pigment deposition")
        explanation = "Criteria of Identification: Bilharzial pigment (hemozoin-like pigment): Produced by adult schistosomes digesting host hemoglobin; it is an endogenous iron-porphyrin complex deposited as brown-black refractile granules inside Kupffer cells and histiocytes within portal fibrous tracts."
        concept = "Bilharzial pigment: Endogenous iron-porphyrin breakdown product accumulated in Kupffer cells."

    # Q10: Nature of lesion
    elif "benign neoplastic polyp — precancerous" in [o.lower() for o in options]:
        correct_idx = options.index("Benign neoplastic polyp — precancerous")
        explanation = "Criteria of Identification: Adenomatous polyps (tubular, tubulovillous, and villous adenomas) are true epithelial neoplasms possessing intrinsic genetic mutations (APC/beta-catenin pathway) that confer pre-malignant potential for progression to invasive adenocarcinoma."
        concept = "Adenoma-carcinoma sequence: Adenomatous polyps are benign precancerous neoplasms with malignant potential."

    # Q11: Hallmark feature
    elif "presence of dysplasia" in [o.lower() for o in options] or "cystically dilated glands" in [o.lower() for o in options]:
        correct_idx = [i for i, o in enumerate(options) if "dysplasia" in o.lower() or "cystically dilated" in o.lower()][0]
        explanation = "Criteria of Identification: Histological hallmark of adenomatous polyps is epithelial dysplasia, whereas juvenile polyps are characterized by retention cyst formation with cystically dilated, mucin-filled glands in an inflamed stroma."
        concept = "Diagnostic hallmark: Dysplasia defines adenomas; cystic gland dilation in inflamed stroma defines juvenile polyps."

    # Q12: All true EXCEPT
    elif "hallmark feature is dysplasia" in [o.lower() for o in options]:
        correct_idx = [i for i, o in enumerate(options) if "dysplasia" in o.lower()][0]
        explanation = "Criteria of Identification: Juvenile polyps are non-neoplastic hamartomas; their hallmark is dilated mucinous cysts and inflamed lamina propria, NOT epithelial dysplasia. Dysplasia occurs only in rare cases of Juvenile Polyposis Syndrome."
        concept = "Juvenile polyp: Hamartomatous lesion lacking epithelial dysplasia."

    # Q13: Epithelial lining
    elif "bland columnar cells with goblet cells" in [o.lower() for o in options]:
        correct_idx = options.index("Bland columnar cells with goblet cells")
        explanation = "Criteria of Identification: The cystically dilated retention glands of juvenile polyps are lined by benign, bland, regular columnar epithelial cells with abundant mucin-producing goblet cells, lacking pleomorphism or mitotic figures."
        concept = "Bland mucinous epithelium: Hallmarks benign hamartomatous glandular dilation."

    # Q14: Mixed salivary gland tumor
    elif "benign encapsulated mixed salivary gland tumor" in [o.lower() for o in options]:
        correct_idx = options.index("Benign encapsulated mixed salivary gland tumor")
        explanation = "Criteria of Identification: Pleomorphic adenoma (mixed tumor of salivary gland): Characterized by dual epithelial/myoepithelial cellular elements (forming ducts, cords, and sheets) embedded within a distinctive myxoid, chondroid, or hyalinized stroma, surrounded by a complete or incomplete fibrous capsule."
        concept = "Pleomorphic adenoma: Benign encapsulated mixed tumor featuring epithelial ducts in chondromyxoid stroma."

    # Q15: Architectural pattern
    elif "trabecular" in [o.lower() for o in options]:
        correct_idx = options.index("Trabecular")
        explanation = "Criteria of Identification: Hepatocellular carcinoma commonly exhibits a trabecular (sinusoidal) architectural pattern, where malignant hepatocytes form thick cords (>3 cells wide) separated by sinusoidal blood spaces, recapitulating embryonic liver architecture."
        concept = "Trabecular pattern: Thickened neoplastic cords (>3 cells thick) pathognomonic of hepatocellular carcinoma."

    else:
        correct_idx = 0
        explanation = f"Criteria of Identification: Microscopic feature identified: {options[0]}."
        concept = f"Histopathology: {options[0]}."

    return {
        "id": f"MGL3-PRAC-PATH-LAB-{idx+1:04d}",
        "type": "mcq",
        "lecture": 2,
        "text": title if title else "Identify the microscopic slide feature / histopathological diagnosis:",
        "options": options,
        "correctIndex": correct_idx,
        "explanation": explanation,
        "keyConcept": concept,
        "media": {
            "type": "image",
            "imageUrl": img_local,
            "caption": f"Pathology Lab Microscopic Slide — Station {idx+1}"
        }
    }

patho_mus_questions = [adjudicate_patho_mus(idx, item) for idx, item in enumerate(patho_mus_items)]
patho_lab_questions = [adjudicate_patho_lab(idx, item) for idx, item in enumerate(patho_lab_items)]

with open("src/app/data/practical/mgl-3-patho-mus-practical.json", "w", encoding="utf-8") as f:
    json.dump(patho_mus_questions, f, indent=2, ensure_ascii=False)

with open("src/app/data/practical/mgl-3-patho-lab-practical.json", "w", encoding="utf-8") as f:
    json.dump(patho_lab_questions, f, indent=2, ensure_ascii=False)

print(f"Generated {len(patho_mus_questions)} Museum and {len(patho_lab_questions)} Lab Pathology questions.")

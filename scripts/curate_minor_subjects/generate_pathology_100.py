import json, re

# Load parsed thanaa questions
with open('scripts/curate_minor_subjects/thanaa_parsed.json', 'r') as f:
    thanaa_qs = {q['num']: q for q in json.load(f)}

def make_4_opts(opts, ans_letter):
    ans_idx = ord(ans_letter.upper()) - ord('A')
    cleaned = [o.strip() for o in opts]
    correct_text = cleaned[ans_idx] if ans_idx < len(cleaned) else cleaned[0]
    
    if len(cleaned) == 4:
        return cleaned, ans_idx
    elif len(cleaned) > 4:
        distractors = [o for o in cleaned if o != correct_text][:3]
        target_idx = min(ans_idx, 3)
        final_opts = []
        for i in range(4):
            if i == target_idx:
                final_opts.append(correct_text)
            else:
                final_opts.append(distractors.pop(0))
        return final_opts, target_idx
    else:
        while len(cleaned) < 4:
            cleaned.append('None of the above')
        return cleaned, ans_idx


# Structure for 100 questions
# We will define the selected question numbers and their lecture mappings, along with detailed medical explanations
selected_specs = [
    # --- LECTURE 1: Glomerular Diseases (8 Qs: 4001 to 4008) ---
    (1240, 1, "Acute diffuse proliferative glomerulonephritis (PSGN) follows infection by nephritogenic strains of Group A beta-hemolytic Streptococcus (e.g., M-types 12, 49) after a latent interval of 1-4 weeks."),
    (1242, 1, "PSGN is a Type III hypersensitivity reaction caused by circulating immune complexes (antigen-antibody) depositing in the subepithelial space as pathognomonic subepithelial humps on electron microscopy."),
    (1246, 1, "Nephrotic syndrome is clinically defined by massive proteinuria (>3.5 g/24h), severe hypoalbuminemia (<3.0 g/dL), generalized edema, and hyperlipidemia with lipiduria. Gross hematuria and hypertension are characteristic of nephritic, not nephrotic, syndrome."),
    (1248, 1, "Edema in nephritic syndrome is primarily caused by primary renal sodium and water retention due to acute reduction in GFR, leading to circulatory overload and periorbital edema."),
    (1252, 1, "Rapidly progressive glomerulonephritis (RPGN / crescentic GN) is characterized on light microscopy by circumferential epithelial crescents lining Bowman's space, composed of proliferating parietal epithelial cells and infiltrating monocytes/macrophages."),
    (1253, 1, "Membranoproliferative glomerulonephritis (MPGN Type I) is characterized by mesangial cell interposition and subendothelial immune deposits causing glomerular basement membrane duplication, creating a classic 'tram-track' or split-basement-membrane appearance on Silver stain."),
    (1254, 1, "Minimal change disease (lipoid nephrosis) characteristically shows normal glomeruli on light microscopy and negative immunofluorescence, but electron microscopy reveals diffuse, uniform effacement (flattening) of podocyte foot processes."),
    (1256, 1, "Membranous nephropathy is defined ultrastructurally by subepithelial electron-dense immune deposits along the glomerular basement membrane, separated by spikes of silver-staining basement membrane matrix ('spike and dome' pattern)."),

    # --- LECTURE 2: Tubulointerstitial Nephritis & ATN (7 Qs: 4009 to 4015) ---
    (1267, 2, "Acute pyelonephritis is a suppurative inflammation of the kidney caused predominantly by ascending Gram-negative enteric bacilli (E. coli). Predisposing factors include urinary tract obstruction, vesicoureteral reflux, pregnancy, and diabetes mellitus."),
    (1268, 2, "Females have a marked anatomical predisposition to ascending urinary tract infections and pyelonephritis due to their significantly shorter urethra and its close anatomical proximity to the fecal flora of the anus."),
    (1269, 2, "The predominant and most frequent route of renal infection in acute pyelonephritis is ascending infection from the lower urinary tract up the ureters into the renal pelvis and calyces."),
    (1271, 2, "Chronic excessive ingestion of analgesic mixtures (phenacetin, aspirin, acetaminophen) causes chronic interstitial nephritis complicated by ischemic renal papillary necrosis, where necrotic papillae slough into the urine causing ureteric colic and hematuria."),
    (1272, 2, "Mismatched ABO blood transfusion triggers massive intravascular hemolysis, hemoglobinuria, systemic hypotension, and severe ischemic/nephrotoxic Acute Tubular Necrosis (ATN), leading to acute oliguric renal failure."),
    (1273, 2, "Renal tuberculosis is an active hematogenous metastatic infection secondary to primary pulmonary tuberculosis. It classically begins in the corticomedullary junction, producing caseating fibrocaseous granulomas that cavitate into the calyceal system."),
    (1312, 2, "Nonsteroidal anti-inflammatory drugs (NSAIDs) can induce acute interstitial nephritis characterized by tubular cell injury, interstitial edema, and an inflammatory infiltrate rich in eosinophils and T-lymphocytes."),

    # --- LECTURE 3: Renal Vascular Pathology & Hypertensive Nephropathy (7 Qs: 4016 to 4022) ---
    (1259, 3, "Benign nephrosclerosis in essential hypertension is characterized grossly by symmetrical, moderately reduced kidneys with a fine, granular, pebbled cortical surface resembling leather ('grain leather' appearance) due to patchy cortical atrophy."),
    (1260, 3, "Malignant hypertension is characterized by widespread hyperplastic arteriolosclerosis ('onion-skinning') and necrotizing arteriolitis with fibrinoid necrosis, producing petechial cortical hemorrhages termed a 'flea-bitten' kidney."),
    (1262, 3, "Diabetic nephropathy is characterized by diffuse glomerulosclerosis and pathognomonic nodular glomerulosclerosis (Kimmelstiel-Wilson nodules), accompanied by severe arteriolar hyalinosis affecting BOTH afferent and efferent arterioles."),
    (1263, 3, "In systemic lupus erythematosus (SLE), Class IV Diffuse Proliferative Lupus Nephritis is the most common, most severe, and most aggressive histological subtype, requiring intensive immunosuppressive therapy."),
    (1264, 3, "Wire loop lesions in lupus nephritis represent extensive, confluent subendothelial immune complex deposits that markedly thicken the glomerular capillary walls, resembling rigid bent wires on light microscopy."),
    (1265, 3, "Goodpasture syndrome is caused by circulating autoantibodies directed against the non-collagenous domain (NC1) of alpha-3 chain of collagen type IV in glomerular and alveolar basement membranes, producing rapidly progressive glomerulonephritis and pulmonary alveolar hemorrhage."),
    (1274, 3, "Renal arterial infarction is typically caused by thromboembolism originating from mural thrombi in the left heart (atrial fibrillation, left ventricular MI) or severe atherosclerotic aortic plaques, producing wedge-shaped pale, coagulative cortical infarcts."),

    # --- LECTURE 4: Chronic Kidney Disease & Renal Failure (7 Qs: 4023 to 4029) ---
    (1258, 4, "End-stage chronic glomerulonephritis produces markedly contracted, symmetrically shrunken kidneys with a diffusely granular thinned cortex, obliterated corticomedullary junction, and global hyalinization/sclerosis of glomeruli."),
    (1286, 4, "Acute renal failure (acute kidney injury) can result from prerenal hypoperfusion (shock, dehydration), intrinsic acute tubular necrosis (ischemic or toxic), or postrenal acute bilateral urinary tract obstruction."),
    (1238, 4, "Horseshoe kidney is the most common congenital fusion anomaly, where the lower poles of the kidneys are fused across the midline anterior to the abdominal aorta and IVC, trapped inferiorly by the origin of the inferior mesenteric artery (IMA)."),
    (1239, 4, "Autosomal dominant polycystic kidney disease (ADPKD, PKD1/PKD2 genes) is characterized by bilaterally massively enlarged kidneys filled with multiple non-communicating fluid-filled cysts lined by flattened epithelium, inexorably causing ESRD in adulthood."),
    (1316, 4, "In long-standing chronic suppurative or tuberculous disease, renal secondary (AA) amyloidosis develops, manifesting with pale, waxy, enlarged kidneys with positive Congo Red staining showing apple-green birefringence under polarized light."),
    (1317, 4, "Chronic pyelonephritis produces characteristically asymmetric, irregularly scarred kidneys with deep, broad, U-shaped corticomedullary depressions overlying blunted, dilated, deformed calyces (calyceal clubbing)."),
    (1319, 4, "The most common and immediate cause of death in children with acute post-streptococcal glomerulonephritis is acute heart failure and pulmonary edema secondary to severe hypervolemic fluid overload, or hypertensive encephalopathy."),

    # --- LECTURE 5: Neoplasms of the Kidney & Wilms Tumor (7 Qs: 4030 to 4036) ---
    (1288, 5, "Renal cell carcinoma (RCC) typically originates in the renal cortex as a golden-yellow, circumscribed mass with prominent areas of hemorrhage, necrosis, and cystic degeneration, characteristically invading the renal vein."),
    (1294, 5, "Clear cell renal cell carcinoma (the commonest RCC subtype, 70-80%) is strongly associated with loss or inactivation of the VHL (von Hippel-Lindau) tumor suppressor gene on chromosome 3p, leading to constitutive HIF-1alpha activation and VEGF overexpression."),
    (1295, 5, "Papillary renal cell carcinoma (10-15% of RCCs) is characterized by trisomy 7 and 17 and activating mutations or duplications of the MET proto-oncogene encoding the hepatocyte growth factor receptor."),
    (1287, 5, "Wilms tumor (nephroblastoma) is the most common primary malignant renal tumor of childhood (peak age 2-5 years), arising from primitive metanephric blastema and associated with WT1 gene mutations on chromosome 11p13."),
    (1293, 5, "Classic Wilms tumor exhibits a characteristic triphasic histology consisting of: primitive blastematous sheets of small round blue cells, epithelial tubular/glomeruloid structures, and mesenchymal stroma (spindle cells, skeletal muscle, cartilage)."),
    (1321, 5, "Adult renal oncocytoma is a benign epithelial neoplasm derived from intercalated cells of collecting ducts, characterized grossly by a mahogany-brown color with a prominent central stellate scar, and histologically by sheets of uniform eosinophilic cells packed with mitochondria."),
    (1322, 5, "Renal angiomyolipoma is a benign mesenchymal hamartoma composed of mature adipose tissue, smooth muscle, and thick-walled dysplastic blood vessels, frequently associated with tuberous sclerosis (TSC1/TSC2 mutations)."),

    # --- LECTURE 6: Pathology of the Urinary Bladder & Urolithiasis (7 Qs: 4037 to 4043) ---
    (1281, 6, "Staghorn calculi are large branched stones that fill the renal pelvis and calyces, composed of magnesium ammonium phosphate (struvite/triple phosphate) caused by urease-producing bacterial infections (Proteus mirabilis)."),
    (1282, 6, "Uric acid calculi develop in acidic urine (pH < 5.5) and are uniquely radiolucent on conventional plain abdominal radiographs (KUB), requiring non-contrast CT for radiographic visualization."),
    (1283, 6, "Calcium oxalate calculi are the most common type of urinary stones (70-80%); they are hard, radio-opaque, and frequently have a dark brown, spiky, mulberriform or jackstone appearance that scratches the urothelium causing hematuria."),
    (1297, 6, "Urinary schistosomiasis (Schistosoma haematobium) causes chronic urothelial ulceration, inflammation, and squamous metaplasia, predisposing heavily to invasive Squamous Cell Carcinoma (SCC) of the urinary bladder."),
    (1299, 6, "Malakoplakia of the urinary bladder is an inflammatory pseudotumor associated with chronic E. coli cystitis, characterized histologically by sheets of foamy histiocytes (von Hansemann cells) containing laminated, basophilic, calcified concentric inclusions called Michaelis-Gutmann bodies."),
    (1303, 6, "Occupational exposure to aromatic amines (aniline dyes, 2-naphthylamine, benzidine) in textile, chemical, and rubber industries is a major established risk factor for urothelial (transitional cell) carcinoma of the urinary bladder."),
    (1307, 6, "In staging bladder urothelial carcinoma, the single most critical prognostic factor determining survival and management (transurethral resection vs. radical cystectomy) is the depth of tumor invasion into the muscularis propria (detrusor muscle, stage T2)."),

    # --- LECTURE 7: Pathology of the Testis, Epididymis & Scrotum (7 Qs: 4044 to 4050) ---
    (1354, 7, "Cryptorchidism refers to the failure of one or both testes to descend completely into the scrotum, arresting in the inguinal canal or abdomen; it causes tubular atrophy, hyalinization, azoospermia, and carries a 3- to 5-fold increased risk of testicular germ cell cancer."),
    (1363, 7, "Testicular seminoma is the most common germ cell tumor (peak age 30-40), characterized by sheets of uniform polyhedral cells with clear glycogen-rich cytoplasm, distinct cell borders, prominent nucleoli, and delicate fibrovascular septa infiltrated by T-lymphocytes."),
    (1365, 7, "Testicular yolk sac tumor (endodermal sinus tumor) is the most common testicular neoplasm in infants and boys under 3 years of age, characterized by elevated serum alpha-fetoprotein (AFP) and pathognomonic Schiller-Duval bodies mimicking primitive glomeruli."),
    (1367, 7, "Testicular choriocarcinoma is a highly aggressive malignant germ cell tumor composed of syncytiotrophoblasts and cytotrophoblasts, characteristically producing massive elevations in serum beta-hCG (human chorionic gonadotropin) and early hematogenous metastases."),
    (1374, 7, "Post-pubertal testicular teratoma is considered malignant regardless of its histological maturity (mature vs. immature components), capable of late aggressive metastasis, unlike benign childhood teratomas."),
    (1356, 7, "Syphilitic orchitis classically presents in tertiary syphilis as a painless gumma or chronic interstitial fibrosis with obliterative endarteritis, characteristically sparing the epididymis (unlike tuberculosis which primarily affects the epididymis)."),
    (1357, 7, "Tuberculous epididymitis is almost always secondary to retrograde canalicular or hematogenous spread from the urinary tract (kidney/prostate), causing caseating granulomas that begin in the globus minor of the epididymis before invading the testis."),

    # --- LECTURE 8: Prostatic Diseases: Hyperplasia & Carcinoma (7 Qs: 4051 to 4057) ---
    (1380, 8, "Benign prostatic hyperplasia (BPH) arises exclusively in the periurethral and transition zones of the prostate under the trophic hormonal influence of dihydrotestosterone (DHT) synthesized by stromal 5alpha-reductase."),
    (1382, 8, "Perineural space invasion is a characteristic histological hallmark of prostatic adenocarcinoma, where malignant glands wrap around or infiltrate intramural autonomic nerve twigs within the prostatic capsule and periprostatic fat."),
    (1384, 8, "Serum Prostate-Specific Antigen (PSA) is an organ-specific (not cancer-specific) serine protease secreted by prostatic epithelial cells; serum levels >4 ng/mL warrant further evaluation, while PSA velocity and free-to-total PSA ratio assist in differentiating BPH from carcinoma."),
    (1389, 8, "Skeletal metastases from prostatic adenocarcinoma characteristically stimulate osteoblast proliferation and new woven bone deposition, producing dense, radio-opaque osteoblastic (osteosclerotic) bone lesions on plain radiographs and bone scans."),
    (1397, 8, "The Gleason grading system for prostatic adenocarcinoma is based entirely on histological architectural growth patterns (patterns 1 through 5) rather than cytological atypia, combining the primary and secondary patterns to yield a prognostic Gleason score."),
    (1399, 8, "Major clinical complications of benign prostatic hyperplasia include bladder outlet obstruction, detrusor hypertrophy and trabeculation, bladder diverticula, urinary stasis with recurrent UTIs, bilateral hydronephrosis, and postrenal azotemia."),
    (1404, 8, "Prostatic adenocarcinoma arises in >70% of cases in the peripheral (posterior) zone of the prostate, which explains why it is palpable on digital rectal examination (DRE) as a hard, irregular nodule before producing early obstructive symptoms."),

    # --- LECTURE 9: Pathology of the Penis & Urethra (7 Qs: 4058 to 4064) ---
    (1426, 9, "Condyloma acuminatum of the external genitalia is a benign verrucous squamous papilloma caused by low-risk Human Papillomavirus types 6 and 11, histologically characterized by branching acanthosis, hyperkeratosis, and superficial koilocytosis."),
    (1427, 9, "Condyloma lata are moist, flat, broad, highly infectious mucosal plaques of the vulva, perineum, or scrotum, representing a classical mucocutaneous manifestation of secondary syphilis teeming with Treponema pallidum spirochetes."),
    (1429, 9, "Extramammary Paget disease of the vulva or scrotum manifests as an erythematous, crusted, pruritic plaque, histologically characterized by intraepithelial infiltration of large malignant glandular cells with pale mucinous cytoplasm (mucin-positive, PAS-positive)."),
    (1433, 9, "Lichen sclerosus of the vulva (kraurosis vulvae) manifests clinically as smooth white porcelain-like atrophic plaques ('leukoplakia'), histologically showing epidermal thinning, hydropic basal degeneration, and a broad band of dense dermal collagen homogenization/hyalinization."),
    (1434, 9, "Lichen simplex chronicus of the vulva results from chronic scratching or rubbing; it is characterized histologically by marked epidermal hyperkeratosis and acanthosis with regular rete ridge elongation, carrying no intrinsic premalignant potential."),
    (1435, 9, "Sarcoma botryoides (embryonal rhabdomyosarcoma) is the most common malignant vaginal/urinary tract sarcoma in infants and young girls under 5 years, presenting grossly as soft, gelatinous polypoid masses resembling a 'bunch of grapes' protruding from the introitus."),
    (1436, 9, "Invasive squamous cell carcinoma of the penis is strongly associated with lack of neonatal circumcision (poor hygiene/smegma accumulation) and high-risk HPV types 16 and 18, commonly arising on the glans penis or inner surface of the prepuce."),

    # --- LECTURE 10: Non-Neoplastic & Neoplastic Cervical Lesions (7 Qs: 4065 to 4071) ---
    (1437, 10, "Endocervical polyps are benign inflammatory inflammatory outgrowths of endocervical mucosa, composed of loose fibromyxomatous vascular stroma lined by mucus-secreting columnar epithelium, frequently presenting with postcoital spotting."),
    (1439, 10, "Cervical intraepithelial neoplasia (CIN) is characterized cytologically by nuclear enlargement, hyperchromasia, coarse chromatin clumping, irregular nuclear contours, pleomorphism, and abnormal mitotic figures starting in the basal layers."),
    (1440, 10, "Histological grading of cervical intraepithelial neoplasia depends on the vertical extent of squamous epithelial dysplasia: CIN 1 involves the lower 1/3; CIN 2 involves the lower 2/3; and CIN 3 involves more than 2/3 to full-thickness dysplasia (carcinoma in situ)."),
    (1443, 10, "The Papanicolaou (Pap) cervical cytology smear combined with high-risk HPV DNA co-testing is the worldwide standard screening method, sampling cells from the cervical transformation zone (squamocolumnar junction) to detect pre-invasive dysplastic lesions."),
    (1444, 10, "Carcinoma in situ (CIN 3) of the uterine cervix is defined histologically as full-thickness squamous atypia and loss of maturation spanning the entire epithelial height, but strictly contained above an intact basement membrane without stromal microinvasion."),
    (1445, 10, "High-risk HPV types 16 and 18 induce cervical oncogenesis primarily through integration of viral DNA into host genome, leading to overexpression of oncoproteins E6 (which promotes ubiquitin-dependent degradation of p53) and E7 (which binds and inactivates retinoblastoma pRb)."),
    (1511, 10, "Persistent high-risk Human Papillomavirus (HPV) infection (especially genotypes 16, 18, 31, 33, 45) is the single most critical and mandatory epidemiological risk factor for the development of invasive cervical carcinoma."),

    # --- LECTURE 11: Endometrial Hyperplasia & Carcinoma, Adenomyosis (7 Qs: 4072 to 4078) ---
    (1450, 11, "Under light microscopy, the histological hallmark confirming normal ovulation and the onset of the endometrial secretory phase is the appearance of uniform subnuclear glycogen vacuoles within columnar glandular epithelial cells on day 16-17."),
    (1456, 11, "Endometrial hyperplasia without atypia carries a <1-3% risk of progression to adenocarcinoma, whereas atypical endometrial hyperplasia (endometrial intraepithelial neoplasia, EIN) carries an alarming 20-30% risk of concurrent or future invasive carcinoma."),
    (1457, 11, "Uterine leiomyoma (fibroid) is the most common benign mesenchymal tumor in women of reproductive age, arising from myometrial smooth muscle cells and characterized by whorled bundles of uniform spindle cells surrounded by a distinct pseudocapsule."),
    (1461, 11, "Simple non-atypical endometrial hyperplasia characteristically exhibits dilated, cystic, irregular glands lined by non-stratified columnar cells with no cellular atypia, producing a classic 'Swiss-cheese' architectural appearance."),
    (1463, 11, "Endometriosis is defined pathologically as the presence of functional endometrial glands and stroma outside the uterine cavity, most frequently affecting the ovaries (forming 'chocolate cysts' / endometriomas), pelvic peritoneum, and pouch of Douglas."),
    (1467, 11, "Type I endometrioid adenocarcinoma of the endometrium (accounting for 80% of cases) is strongly driven by prolonged, unopposed hyperestrogenism (obesity, nulliparity, late menopause, estrogen replacement therapy, PCOS) and PTEN mutations."),
    (1469, 11, "Type II serous carcinoma of the endometrium is an aggressive, estrogen-independent tumor occurring in elderly women with atrophic endometria, strongly associated with TP53 mutations, extensive pelvic dissemination, and poor clinical prognosis."),

    # --- LECTURE 12: Gestational Trophoblastic Diseases (7 Qs: 4079 to 4085) ---
    (1472, 12, "Complete hydatidiform mole results from androgenesis: fertilization of an enucleate (empty) ovum by a single sperm that duplicates (46,XX, 90%) or by two sperm (46,XY), producing purely paternal genetic material with no maternal chromosomes."),
    (1473, 12, "Complete hydatidiform mole is characterized by diffuse, circumferential trophoblastic hyperplasia, generalized hydropic swelling of all chorionic villi with central cistern formation, markly elevated serum beta-hCG (>100,000 mIU/mL), and COMPLETE ABSENCE of fetal or embryonic tissues."),
    (1474, 12, "Partial hydatidiform mole results from diandric triploidy: fertilization of a normal haploid ovum (23,X) by two sperm (or a diploid sperm), resulting in a 69,XXX, 69,XXY, or 69,XYY karyotype, and characteristically DOES contain fetal or embryonic parts."),
    (1478, 12, "Fertilization of a normal haploid ovum by two normal spermatozoa produces a triploid (69 chromosomes) conceptus, which pathologically manifests as a partial vesicular mole with scalloped, focal villous edema and identifiable fetal RBCs."),
    (1479, 12, "In contrast to partial hydatidiform mole or blighted ovum, a complete hydatidiform mole contains NO fetal parts, no umbilical cord, no amniotic membrane, and no nucleated fetal red blood cells within villous capillaries."),
    (1481, 12, "Gestational choriocarcinoma is a highly malignant, invasive epithelial neoplasm composed of anaplastic syncytiotrophoblasts and cytotrophoblasts with extensive hemorrhage and necrosis and NO chorionic villi; it responds spectacularly to chemotherapy (Methotrexate) with >90% cure rates."),
    (1507, 12, "Pelvic ultrasonography of a complete hydatidiform mole characteristically displays an enlarged uterine cavity filled with a diffuse, heterogeneous, echogenic mass containing innumerable tiny cystic spaces, termed the 'snowstorm' or 'bunch of grapes' appearance."),

    # --- LECTURE 13: Diseases of Fallopian Tubes and Ovaries (8 Qs: 4086 to 4093) ---
    (1484, 13, "Ectopic pregnancy occurs when a fertilized blastocyst implants outside the endometrial cavity, with >95% of cases implanting in the fallopian tube (most commonly in the ampulla), predisposed by chronic salpingitis and pelvic inflammatory disease (PID)."),
    (1486, 13, "Polycystic ovary syndrome (PCOS / Stein-Leventhal syndrome) is clinically characterized by hyperandrogenism (hirsutism, acne), chronic anovulation (oligomenorrhea), and bilaterally enlarged ovaries with multiple subcapsular follicular cysts and cortical stromal fibrosis."),
    (1490, 13, "Serous cystadenoma of the ovary is the most common benign ovarian epithelial neoplasm, typically unilocular, containing clear watery straw-colored serous fluid and lined by a single layer of ciliated columnar epithelial cells resembling tubal mucosa."),
    (1491, 13, "Mucinous cystadenoma of the ovary is a multilocular, bulky tumor filled with thick, gelatinous, glycoprotein-rich mucin, lined by non-ciliated columnar epithelial cells with apical mucin vacuoles resembling endocervical or intestinal epithelium."),
    (1493, 13, "Psammoma bodies are concentric, laminated, basophilic calcospherites that are characteristically found in ovarian serous cystadenocarcinoma (as well as papillary thyroid carcinoma and meningioma)."),
    (1496, 13, "Granulosa cell tumors of the ovary are sex cord-stromal neoplasms that characteristically secrete estrogens, causing endometrial hyperplasia, irregular uterine bleeding, or precocious puberty; histologically they feature Call-Exner bodies (microfollicles containing eosinophilic fluid)."),
    (1500, 13, "Mature cystic teratoma (dermoid cyst) is a benign germ cell tumor composed of well-differentiated tissues derived from all three germ cell layers (ectoderm, mesoderm, endoderm), characteristically containing hair, sebaceous material, teeth, and keratinaceous debris."),
    (1503, 13, "Krukenberg tumor is a metastatic adenocarcinoma to the ovaries, characteristically bilateral, originating predominantly from gastric signet-ring cell adenocarcinoma (or colon/breast) and histologically displaying mucin-filled signet-ring cells infiltrating ovarian stroma."),

    # --- LECTURE 14: Diseases of the Breast (7 Qs: 4094 to 4100) ---
    (1559, 14, "The normal terminal duct lobular unit (TDLU) of the human breast is composed of a two-cell epithelial bilayer consisting of: an inner secretory luminal epithelial cell layer and an outer contractile myoepithelial cell layer."),
    (1560, 14, "Mammary duct ectasia is an inflammatory condition characterized by dilation of subareolar collecting ducts filled with thick lipid-rich secretions, associated with periductal chronic inflammation rich in plasma cells ('plasma cell mastitis') and periductal fibrosis."),
    (1562, 14, "Traumatic fat necrosis of the breast typically follows physical trauma or surgery, histologically demonstrating lipid-laden foamy macrophages, foreign body multinucleated giant cells, and central necrotic adipocytes; it can mimic breast carcinoma on palpation and mammography."),
    (1565, 14, "Fibrocystic change of the breast comprises a triad of benign non-proliferative alterations: cyst formation (apocrine metaplasia), stromal fibrosis, and adenosis (increased number of acini per lobule)."),
    (1567, 14, "Among benign proliferative breast conditions, atypical hyperplasia (atypical ductal hyperplasia, ADH, and atypical lobular hyperplasia, ALH) confers a 4- to 5-fold increased relative risk of subsequent invasive breast cancer."),
    (1568, 14, "Breast fibroadenoma is the most common benign breast neoplasm in young females (age 20-35), presenting as a painless, rubbery, sharply circumscribed, freely movable nodule ('breast mouse') composed of proliferating stromal fibrous tissue compressing glandular ducts."),
    (1598, 14, "Phyllodes tumor (cystosarcoma phyllodes) is a fibroepithelial breast neoplasm characterized by exaggerated leaf-like stromal projections lined by epithelium; it differs from fibroadenoma by possessing hypercellular stroma, and can be benign, borderline, or overtly malignant.")
]

print(f"Total defined specs: {len(selected_specs)}")

output_questions = []
for i, (qnum, lec, expl) in enumerate(selected_specs):
    src_q = thanaa_qs.get(qnum)
    if not src_q:
        print(f"Warning: Q{qnum} not found in thanaa_qs!")
        continue
    
    stem = src_q['stem']
    opts, correct_idx = make_4_opts(src_q['options'], src_q['ans'])
    
    q_id = f"MUG3-CH5-PATH-{4001+i:04d}"
    output_questions.append({
        "id": q_id,
        "type": "mcq",
        "lecture": lec,
        "sources": [f"Pathology/Urogenital Module - MCQ and CASES in Pathology - Dr. Thanaa Helal.pdf-pX-Q{qnum}"],
        "repetitionCount": 1,
        "text": stem,
        "options": opts,
        "correctIndex": correct_idx,
        "explanation": expl
    })

print(f"Successfully constructed {len(output_questions)} Pathology MCQs")

with open('scripts/curate_minor_subjects/staged_pathology.json', 'w') as f:
    json.dump(output_questions, f, indent=2)

print("Saved staged_pathology.json")

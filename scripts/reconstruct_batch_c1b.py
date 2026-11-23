#!/usr/bin/env python3
"""
scripts/reconstruct_batch_c1b.py
Reconstructs the second half of Part C1 (44 questions):
MUG3-CH205-PATH-0115 to MUG3-CH205-PATH-0155 in Chapter 301.
"""

import json

BANK_PATH = "src/imports/year-3/semester-1/MUG-3.json"

BATCH_C1B_REPAIRS = {
    "MUG3-CH205-PATH-0115": {
        "text": "Explain the pharmacological mechanisms of action by which Combined Oral Contraceptive Pills (COCPs) prevent pregnancy.",
        "modelAnswer": """Combined oral contraceptive pills (containing synthetic estrogen, e.g., ethinyl estradiol, and a progestin, e.g., levonorgestrel or drospirenone) prevent conception through three synergistic mechanisms:

**1. Inhibition of Ovulation (Primary Mechanism):**
- **Estrogen Component:** Suppresses pituitary **FSH secretion** via negative feedback on the hypothalamus and anterior pituitary, preventing selection and maturation of the dominant ovarian follicle.
- **Progestin Component:** Suppresses hypothalamic **GnRH pulse frequency** and pituitary **LH secretion**, abolishing the midcycle **LH surge** required for follicular rupture and oocyte release.

**2. Alteration of Cervical Mucus:**
- Progestin counteracts estrogenic mucus thinning, causing cervical mucus to become **thick, viscous, cellular, and acidic**.
- This creates an impenetrable physical and chemical barrier that blocks sperm motility and prevents sperm penetration through the cervical canal.

**3. Endometrial Asynchrony & Tubal Motility:**
- Continuous progestin exposure induces early secretory exhaustion followed by **endometrial decidualization and glandular atrophy**, rendering the endometrium unreceptive to blastocyst implantation.
- Progestin alters fallopian tube peristalsis and ciliary beating, hindering gamete transport.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Inhibition of ovulation: Estrogen suppresses FSH (follicle development); progestin abolishes LH surge (ovulation) (1.5 marks).
2. Cervical mucus thickening: Progestin creates an impenetrable barrier to sperm (1.0 mark).
3. Endometrial atrophy preventing blastocyst implantation (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
COCPs provide >99% contraceptive efficacy with perfect use. Ovulation inhibition is the primary fail-safe mechanism, while cervical and endometrial changes provide essential backup barriers.

**Ain Shams Faculty Curriculum Highlights:**
- Progestin alone (minipill) primarily acts by thickening cervical mucus and altering endometrium; ovulation is suppressed in ~60-80% of cycles."""
    },

    "MUG3-CH205-PATH-0116": {
        "text": "Name three histological types of mesenchymal and mixed Müllerian tumors of the uterus, and describe the clinical features of uterine leiomyosarcoma.",
        "modelAnswer": """**1. Mesenchymal and Mixed Müllerian Tumors of the Uterus:**
1. **Leiomyoma (Uterine Fibroid):** The most common benign mesenchymal tumor of smooth muscle origin.
2. **Leiomyosarcoma (LMS):** Highly malignant smooth muscle neoplasm (arises de novo, NOT from pre-existing leiomyomas).
3. **Endometrial Stromal Sarcoma (ESS):** Malignant mesenchymal neoplasm derived from endometrial stroma (low-grade or high-grade).
4. **Carcinosarcoma (Malignant Mixed Müllerian Tumor [MMMT]):** Highly aggressive biphasic neoplasm containing malignant epithelial (carcinomatous) and mesenchymal (sarcomatous) elements.

**2. Clinical & Histological Features of Uterine Leiomyosarcoma:**
- **Clinical Presentation:** Postmenopausal woman presenting with abnormal uterine bleeding, pelvic pain, a rapidly enlarging pelvic mass, and foul-smelling vaginal discharge.
- **Diagnostic Microscopic Triad (Stanford Criteria):**
  1. **Marked Diffuse Cytological Atypia:** Bizarre, pleomorphic, hyperchromatic multinucleated tumor giant cells.
  2. **High Mitotic Index:** $\ge 10$ mitotic figures per 10 High Power Fields (HPF).
  3. **Tumor Cell Necrosis (Coagulative Necrosis):** Abrupt transition between viable tumor cells and necrotic ghost cells without intervening granulation tissue.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Mesenchymal tumors: Leiomyoma, leiomyosarcoma, endometrial stromal sarcoma, carcinosarcoma (MMMT) (1.0 mark).
2. Presentation: Postmenopausal bleeding with rapidly growing solitary uterine mass (0.5 mark).
3. Diagnostic histology triad: Nuclear atypia, high mitotic rate (≥10/10 HPF), and coagulative tumor cell necrosis (1.5 marks).

**Core Educational Objective & Clinical Mechanism:**
Leiomyosarcomas are solitary, fleshy, soft, hemorrhagic masses with ragged margins, in contrast to benign leiomyomas which are multiple, firm, white, whorled, and well-circumscribed.

**Ain Shams Faculty Curriculum Highlights:**
- Leiomyosarcomas arise de novo from myometrial precursors, not from malignant degeneration of fibroids."""
    },

    "MUG3-CH205-PATH-0117": {
        "text": "Enumerate the visceral branches of the anterior division of the internal iliac artery in both males and females.",
        "modelAnswer": """The anterior division of the internal iliac artery gives off specific visceral branches to pelvic organs:

**1. Visceral Branches Present in Both Sexes:**
- **Superior Vesical Artery:** Arises as the patent proximal part of the fetal umbilical artery; supplies the upper part of the urinary bladder and lower ureter.
- **Middle Rectal Artery:** Courses medially to supply the lower rectum, anastomosing with the superior rectal (IMA) and inferior rectal (internal pudendal) arteries.

**2. Visceral Branches in the Male:**
- **Inferior Vesical Artery:** Supplies the base of the urinary bladder, prostate gland, seminal vesicles, and lower ureter, giving off the artery to the ductus deferens.

**3. Visceral Branches in the Female:**
- **Uterine Artery:** Courses medially in the cardinal ligament, crosses anterior and superior to the ureter ('water under the bridge'), and ascends along the lateral border of the uterus to supply the uterus, uterine tube, and ovary.
- **Vaginal Artery:** (Frequently replaces the inferior vesical artery); supplies the anterior and posterior walls of the vagina, bladder base, and rectum.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Common branches: Superior vesical and middle rectal arteries (1.0 mark).
2. Male-specific branch: Inferior vesical artery (supplying prostate/seminal vesicles) (1.0 mark).
3. Female-specific branches: Uterine artery and vaginal artery (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
The internal iliac artery divides at the upper border of the greater sciatic foramen into anterior and posterior trunks. The posterior trunk is purely parietal (PILS); the anterior trunk gives visceral branches to pelvic organs and parietal branches to thigh/perineum.

**Ain Shams Faculty Curriculum Highlights:**
- Inferior vesical artery in the male is represented by the vaginal artery in the female."""
    },

    "MUG3-CH205-PATH-0118": {
        "text": "Describe the microscopic pathological features of fibrocystic changes of the breast, and differentiate non-proliferative from proliferative lesions.",
        "modelAnswer": """Fibrocystic changes represent a benign, multifocal morphological spectrum arising from the terminal duct lobular unit (TDLU) in premenopausal women under cyclic hormonal stimulation:

**1. Non-Proliferative Fibrocystic Changes (No Increased Cancer Risk):**
- **Cyst Formation:** Dilatation of terminal ducts into fluid-filled microscopic or macroscopic cysts ('blue-dome cysts' of Bloodgood) filled with serous, brown-blue fluid.
- **Apocrine Metaplasia:** Cystic lining is replaced by tall, eosinophilic cells with abundant granular cytoplasm and round apical snouts resembling normal apocrine sweat glands.
- **Stromal Fibrosis:** Chronic cyst rupture into the surrounding stroma incites chronic inflammation and dense collagenous fibrosis, giving the breast a nodular, 'lumpy-bumpy' feel.

**2. Proliferative Fibrocystic Changes Without Atypia (1.5 to 2-fold Cancer Risk):**
- **Epithelial Hyperplasia (Epitheliosis):** Proliferation of luminal epithelial and myoepithelial cells filling and distending ducts with irregular, slit-like peripheral fenestrations.
- **Sclerosing Adenosis:** Increased number of acini per lobule surrounded by dense, compressive stromal fibrosis that distorts the lobular architecture.
- **Ductal Papillomatosis:** Multiple small intraductal branching fibrovascular fronds.

**3. Proliferative Changes With Atypia (4 to 5-fold Cancer Risk):**
- **Atypical Ductal Hyperplasia (ADH)** and **Atypical Lobular Hyperplasia (ALH)**: Exhibit cytological or architectural features resembling low-grade DCIS or LCIS.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Non-proliferative features: Cysts, apocrine metaplasia, stromal fibrosis (no cancer risk) (1.0 mark).
2. Proliferative without atypia: Epithelial hyperplasia (epitheliosis), sclerosing adenosis (1.5-2x risk) (1.0 mark).
3. Atypical hyperplasia: ADH/ALH (4-5x increased breast cancer risk) (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Simple cysts and apocrine metaplasia carry zero increased risk of invasive breast cancer; risk rises sharply with epithelial hyperplasia displaying cytological atypia.

**Ain Shams Faculty Curriculum Highlights:**
- Blue-dome cysts and apocrine metaplasia are the classic non-proliferative findings."""
    },

    "MUG3-CH205-PATH-0120": {
        "text": "Explain why HER2/neu status is routinely evaluated in all newly diagnosed invasive breast carcinomas, detailing its prognostic and predictive value.",
        "modelAnswer": """**1. Biological Nature of HER2/neu:**
- **HER2/neu (ERBB2)** is a proto-oncogene located on chromosome **17q12** that encodes a 185-kDa transmembrane receptor tyrosine kinase belonging to the Human Epidermal Growth Factor Receptor family.
- It has no known direct ligand and signals via constitutive homodimerization or heterodimerization (especially with HER3), activating the downstream **MAPK and PI3K/Akt pro-survival and mitogenic pathways**.

**2. Prognostic Significance:**
- In approximately **15 to 20% of invasive breast carcinomas**, gene amplification or protein overexpression of HER2 is present.
- Historically, HER2-positive status was an independent marker of **adverse prognosis**: associated with poorly differentiated high-grade tumors, high proliferation index, increased rates of axillary lymph node metastases, visceral and brain metastases, and reduced disease-free survival.

**3. Predictive Clinical Value for Targeted Therapy (The Primary Clinical Rationale):**
- HER2 testing is mandatory because it strongly **predicts dramatic therapeutic response to targeted anti-HER2 therapies**:
  - **Trastuzumab (Herceptin):** Recombinant humanized monoclonal antibody targeting the extracellular domain IV of HER2, inducing receptor internalization and antibody-dependent cellular cytotoxicity (ADCC).
  - **Pertuzumab:** Blocks HER2-HER3 dimerization.
  - **Trastuzumab Emtansine (T-DM1):** Antibody-drug conjugate delivering cytotoxic emtansine.
- Targeted therapy has revolutionized HER2-positive breast cancer management, converting an aggressive phenotype into a disease with excellent long-term survival.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Biological nature: ERBB2 proto-oncogene on chromosome 17 encoding receptor tyrosine kinase (0.5 mark).
2. Prognostic value: Historically associated with high grade, aggressive metastases, and poor survival (1.0 mark).
3. Predictive value: Essential to select patients who benefit from targeted therapy (Trastuzumab / Herceptin) (1.5 marks).

**Core Educational Objective & Clinical Mechanism:**
HER2 status is evaluated by Immunohistochemistry (IHC score 0 to 3+). Equivocal 2+ cases must be confirmed by Fluorescence In Situ Hybridization (FISH) to detect gene amplification.

**Ain Shams Faculty Curriculum Highlights:**
- Trastuzumab causes cardiotoxicity (reversible decrease in left ventricular ejection fraction) requiring baseline echocardiographic monitoring."""
    },

    "MUG3-CH205-PATH-0123": {
        "text": "Compare the histological lining of the endocervix and ectocervix, and explain why cervical carcinoma characteristically arises at the transformation zone.",
        "modelAnswer": """**1. Histological Comparison:**
- **Endocervix (Endocervical Canal):**
  - Lined by a single layer of **tall, mucin-secreting simple columnar epithelium**.
  - Forms complex, branched invaginations (cervical crypts) that secrete alkaline cervical mucus.
  - Microscopic appearance: Basally situated dark nuclei with clear, apical mucin-filled cytoplasm.
- **Ectocervix (Portio Vaginalis):**
  - Continuous with the vaginal mucosa; lined by a protective, non-keratinized **stratified squamous epithelium** (rich in glycogen).

**2. The Squamocolumnar Junction (SCJ) and Transformation Zone:**
- The point where the simple columnar epithelium meets the stratified squamous epithelium is the **squamocolumnar junction (SCJ)**.
- At puberty and during pregnancy, high estrogen causes cervical eversion (ectropion), exposing columnar endocervical cells to the acidic vaginal pH.
- In response to the acid microenvironment, subcolumnar reserve stem cells undergo physiological **squamous metaplasia**, transforming into stratified squamous epithelium.
- The area between the original SCJ and the new physiological SCJ is called the **Transformation Zone (TZ)**.

**3. Vulnerability to HPV Oncogenesis & Carcinoma:**
- The immature, actively proliferating metaplastic reserve cells in the transformation zone are exceptionally susceptible to infection by **high-risk Human Papillomavirus (HPV types 16 and 18)**.
- HPV oncoproteins **E6** (which degrades the p53 tumor suppressor protein) and **E7** (which inactivates the retinoblastoma protein pRb) integrate into host DNA.
- This drives dysplastic clonal progression from Cervical Intraepithelial Neoplasia (CIN 1 $\rightarrow$ CIN 2 $\rightarrow$ CIN 3) to invasive **squamous cell carcinoma**, explaining why **$>90\%$ of cervical carcinomas arise precisely at the transformation zone**.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Histology: Endocervix (simple mucin-secreting columnar) vs Ectocervix (non-keratinized stratified squamous) (1.0 mark).
2. Transformation zone: Area of active physiological squamous metaplasia at the squamocolumnar junction (1.0 mark).
3. Pathogenesis of carcinoma: Immature metaplastic reserve cells are highly susceptible to HPV 16/18 oncoproteins E6/E7, initiating CIN and invasive carcinoma (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Cervical cytology screening (Pap smear) specifically samples the transformation zone using a spatula and cytobrush to detect dysplastic cells before invasive cancer develops.

**Ain Shams Faculty Curriculum Highlights:**
- HPV E6 inhibits p53; HPV E7 inhibits pRb."""
    },

    "MUG3-CH205-PATH-0194": {
        "text": "List the anatomical contents situated between the two layers of the broad ligament of the uterus.",
        "modelAnswer": """The broad ligament is a double-layered peritoneal fold extending from the lateral margins of the uterus to the lateral pelvic walls. The structures enclosed between its layers include:

**1. Tubular & Reproductive Structures:**
- **Uterine (Fallopian) Tube:** Located in the free upper border (mesosalpinx).
- **Round Ligament of the Uterus:** Extends from the uterine cornu to the deep inguinal ring.
- **Ligament of the Ovary (Ovarian Ligament):** Connects the lower pole of the ovary to the uterine cornu.

**2. Neurovascular Structures:**
- **Uterine Artery and Veins:** Running in the base (cardinal ligament / mesometrium) and ascending tortuously along the lateral border of the uterus.
- **Ovarian Artery and Veins:** Entering the upper lateral broad ligament via the suspensory ligament of the ovary (infundibulopelvic fold).
- **Uterovaginal Nerve Plexus** and ovarian sympathetic nerves.
- Lymphatic trunks draining the uterus and ovary.

**3. Urological Structures:**
- **Ureter:** Courses forward in the lower base of the broad ligament, crossed superiorly by the uterine artery 2 cm lateral to the supravaginal cervix.

**4. Embryological Remnants:**
- **Epoophoron** and **Paroophoron** (mesonephric tubular remnants in the mesosalpinx).
- **Gartner's Duct** (caudal remnant of the mesonephric duct running parallel to the uterus and vagina).""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Tubular structures: Fallopian tube, round ligament, ovarian ligament (1.0 mark).
2. Neurovascular & ureter: Uterine and ovarian vessels, nerve plexuses, and ureter in base (1.0 mark).
3. Embryological remnants: Epoophoron, paroophoron, and Gartner's duct (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
The broad ligament is subdivided into three anatomical compartments: (1) Mesosalpinx (surrounding the fallopian tube), (2) Mesovarium (suspending the ovary), and (3) Mesometrium (the main lower body).

**Ain Shams Faculty Curriculum Highlights:**
- Uterine artery crosses superior to the ureter within the base of the broad ligament."""
    },

    "MUG3-CH205-PATH-0195": {
        "text": "Enumerate the constituents of the spermatic cord, classifying them into arteries, nerves, and other anatomical structures.",
        "modelAnswer": """The spermatic cord suspends the testis and extends from the deep inguinal ring to the posterior border of the testis. Its contents are organized under the 'Rule of 3s':

**1. Three Arteries:**
- **Testicular Artery:** Direct branch from the anterior aspect of the abdominal aorta (at L2), providing the primary blood supply to the testis and epididymis.
- **Artery to the Ductus Deferens (Deferential Artery):** Branch of the inferior (or superior) vesical artery accompanying the vas deferens.
- **Cremasteric Artery:** Branch of the inferior epigastric artery supplying the cremaster muscle and fascial layers.

**2. Three Nerves:**
- **Genital Branch of the Genitofemoral Nerve (L1, L2):** Motor supply to the cremaster muscle (efferent limb of the cremasteric reflex).
- **Testicular Sympathetic Plexus:** Postganglionic sympathetic fibers (T10-T11) accompanying the testicular artery (vasomotor and pain fibers).
- **Ilioinguinal Nerve (L1):** (Travels along the *anterior surface* of the spermatic cord within the inguinal canal, outside the internal spermatic fascia, supplying scrotal skin).

**3. Three Other Structures:**
- **Ductus (Vas) Deferens:** Thick-walled muscular tube transporting spermatozoa.
- **Pampiniform Venous Plexus:** Extensive venous network draining the testis, coalescing into the testicular vein near the deep ring.
- **Testicular Lymphatics:** Draining directly to the retroperitoneal para-aortic (lumbar) lymph nodes (accompanied by vestigial remnant of the processus vaginalis).""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Three arteries: Testicular, deferential, and cremasteric arteries (1.0 mark).
2. Three nerves: Genital branch of genitofemoral, sympathetic plexus, ilioinguinal nerve (1.0 mark).
3. Other structures: Vas deferens, pampiniform venous plexus, and lymphatics to para-aortic nodes (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Torsion of the spermatic cord twists these neurovascular structures, immediately obstructing the thin-walled pampiniform venous plexus while arterial inflow continues, producing acute venous congestion, testicular infarction, and necrosis within 6 hours.

**Ain Shams Faculty Curriculum Highlights:**
- Ilioinguinal nerve lies on the surface of the spermatic cord, NOT inside the internal spermatic fascia."""
    },

    "MUG3-CH205-PATH-0204": {
        "text": "Describe the physiological composition and clinical functions of normal prostatic secretions in human semen.",
        "modelAnswer": """Prostatic fluid comprises approximately **25 to 30% of total ejaculate volume** and is secreted by the tubuloalveolar glands of the prostate:

**1. Physiological Physical Characteristics:**
- A thin, milky, slightly acidic-to-alkaline (pH ~6.5 to 7.2) fluid secreted continuously into the prostatic urethra via 20 to 30 prostatic ducts.

**2. Key Biochemical Components & Their Physiological Functions:**
- **Prostate-Specific Antigen (PSA / Human Kallikrein 3 [hK3]):**
  - A serine protease enzyme synthesized exclusively by prostatic luminal epithelial cells.
  - **Function:** Hydrolyzes **semenogelin I and II** (gel-forming proteins secreted by the seminal vesicles), liquefying the seminal coagulum within 15-30 minutes of ejaculation to liberate motile spermatozoa.
- **Citric Acid:**
  - Present in exceptionally high concentrations (~20-50 mM); acts as an osmotic agent and chelates calcium, maintaining normal seminal osmolarity and regulating buffer equilibrium.
- **Zinc Ions ($\text{Zn}^{2+}$):**
  - Extremely high concentrations; stabilizes chromatin condensation within sperm heads and exerts potent bactericidal activity (**prostatic antibacterial factor**).
- **Acid Phosphatase (Prostatic Acid Phosphatase [PAP]):**
  - An enzyme hydrolyzing phosphate esters; historically used as a serum marker for metastatic prostate cancer.
- **Polyamines (Spermine and Spermidine):**
  - Impart the characteristic odor to semen and protect sperm membranes from oxidative stress.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Volume and physical nature: Thin, milky fluid comprising 25-30% of semen (0.5 mark).
2. PSA (serine protease): Liquefies seminal coagulum by hydrolyzing semenogelin (1.0 mark).
3. Citric acid (buffering/chelator) and Zinc (antibacterial factor and chromatin stabilization) (1.0 mark).
4. Acid phosphatase and polyamines (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
Elevated serum total PSA (>4 ng/mL) indicates disruption of normal prostatic architecture (seen in adenocarcinoma, BPH, prostatitis, and post-cystoscopy/biopsy), leading to leakage into systemic circulation.

**Ain Shams Faculty Curriculum Highlights:**
- PSA is a serine protease whose primary physiological role is seminal clot liquefaction."""
    },

    "MUG3-CH205-PATH-0206": {
        "text": "Trace the course of the ductus (vas) deferens through the inguinal canal and pelvic cavity, detailing the structures it crosses.",
        "modelAnswer": """**1. Inguinal Canal Course:**
- The ductus deferens commences at the tail of the epididymis at the lower pole of the testis, ascends along the posterior border of the testis within the spermatic cord, and enters the superficial inguinal ring.
- Traverses the entire length of the **inguinal canal (4 cm)**.
- Exits the inguinal canal at the **deep inguinal ring**, situated 1.25 cm superior to the midentry point of the inguinal ligament, immediately lateral to the **inferior epigastric vessels**.

**2. Pelvic Wall Course & Structures Crossed:**
- At the deep ring, the vas hooks around the lateral side of the **inferior epigastric artery**.
- Descends posteroinferiorly along the lateral pelvic wall retroperitoneally, crossing sequentially anterior (medial) to:
  1. The **external iliac artery and vein**.
  2. The **obliterated umbilical artery** (medial umbilical ligament).
  3. The **obturator nerve, obturator artery, and obturator vein**.
  4. The **superior vesical vessels**.

**3. Bladder Base Termination:**
- Turns medially across the **pelvic ureter** (crossing superior and anterior to the ureter near the posterolateral corner of the bladder).
- Expands behind the bladder base as the sacculated **ampulla of the ductus deferens**.
- Narrows to unite with the duct of the **seminal vesicle** at the prostate base to form the **ejaculatory duct**, which pierces the prostate to empty into the prostatic urethra.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Deep inguinal ring exit: Hooks around inferior epigastric artery (1.0 mark).
2. Structures crossed on lateral pelvic wall: External iliac vessels, obliterated umbilical artery, obturator vessels/nerve (1.0 mark).
3. Crosses anterior/superior to pelvic ureter to form ampulla and ejaculatory duct (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
During open or laparoscopic inguinal hernia repair, the vas deferens is located in the floor of the internal ring alongside the testicular vessels ('triangle of doom' lies between them). Accidental transection or clipping causes iatrogenic obstructive azoospermia.

**Ain Shams Faculty Curriculum Highlights:**
- The vas deferens crosses superior and anterior to the ureter on the posterior bladder wall."""
    },

    "MUG3-CH205-PATH-0005": {
        "text": "Identify the anatomical lobe of the prostate gland situated behind the upper prostatic urethra, and describe its pathological significance in Benign Prostatic Hyperplasia.",
        "modelAnswer": """**1. Identification:**
- The **Median (Middle) Lobe** of the prostate gland.
- Situated between the upper portion of the prostatic urethra (anteriorly) and the two converging ejaculatory ducts (posteriorly), lying immediately inferior to the neck of the bladder.

**2. Pathological Role in Benign Prostatic Hyperplasia (BPH):**
- The median lobe forms part of the transitional/periurethral zone, which is exceptionally sensitive to androgenic stimulation via **dihydrotestosterone (DHT)** synthesized locally by **5$\\alpha$-reductase type 2**.
- In aging men ($>50$ years), nodular glandular and fibromuscular hyperplasia causes the median lobe to expand upward into the bladder lumen.
- It pushes up the mucosa of the vesical trigone to form an intravesical projection termed the **uvula vesicae**.
- This produces a mechanical **ball-valve obstruction**: during detrusor contraction, intravesical pressure forces the hyperplastic median lobe down over the internal urethral meatus, causing severe urinary hesitancy, intermittency, poor stream, and large post-void residual urine volumes.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Identification: Median (middle) lobe (1.0 mark).
2. DHT-driven hyperplasia in transitional zone (1.0 mark).
3. Upward growth creating uvula vesicae and ball-valve urinary outflow obstruction (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Hyperplasia of the median lobe explains why severe lower urinary tract symptoms (LUTS) can occur in men with modest total prostate volumes, as the intravesical protrusion directly blocks the internal urethral orifice.

**Ain Shams Faculty Curriculum Highlights:**
- Median lobe hyperplasia causes elevation of the bladder trigone (uvula vesicae)."""
    },

    "MUG3-CH205-PATH-0006": {
        "text": "Explain the pharmacological indications and clinical benefits of Raloxifene in postmenopausal women.",
        "modelAnswer": """**1. Pharmacological Classification:**
- **Raloxifene** is a second-generation **Selective Estrogen Receptor Modulator (SERM)** that exhibits differential, tissue-specific agonistic or antagonistic actions on estrogen receptors (ERs).

**2. Clinical Indications and Therapeutic Benefits:**
- **Prevention and Treatment of Postmenopausal Osteoporosis:**
  - Acts as an **estrogen receptor agonist in bone tissue**, suppressing osteoclastic bone resorption and increasing bone mineral density.
  - Proven to significantly reduce the incidence of **vertebral compression fractures** in postmenopausal women.
- **Reduction in the Risk of Invasive Breast Cancer:**
  - Acts as an **estrogen receptor antagonist in mammary tissue**, competitively inhibiting estrogen-driven epithelial proliferation.
  - Approved for breast cancer risk reduction in postmenopausal women with osteoporosis or at high risk for invasive breast cancer.
- **Absence of Endometrial Carcinoma Risk:**
  - Unlike Tamoxifen, Raloxifene has **neutral/antagonistic actions on the uterine endometrium**, carrying no risk of endometrial hyperplasia or carcinoma.

**3. Major Adverse Effects:**
- Increased risk of **deep venous thrombosis (DVT) and pulmonary embolism**.
- Worsening of vasomotor symptoms (**hot flashes**).""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Drug class: Selective Estrogen Receptor Modulator (SERM) (0.5 mark).
2. Bone benefits: ER agonist in bone preventing vertebral fractures in osteoporosis (1.0 mark).
3. Breast benefits: ER antagonist in breast preventing ER-positive invasive breast cancer (1.0 mark).
4. Endometrial safety (neutral/antagonist) and DVT risk (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
Raloxifene is the ideal agent for an osteoporotic postmenopausal woman with an intact uterus who has a strong family history of breast cancer.

**Ain Shams Faculty Curriculum Highlights:**
- Raloxifene: Bone agonist, breast antagonist, endometrium neutral/antagonist."""
    },

    "MUG3-CH205-PATH-0008": {
        "text": "Describe the neurovascular mechanisms responsible for penile erection, highlighting the nitric oxide-cGMP pathway.",
        "modelAnswer": """**1. Neurovascular Signaling Arc:**
- Sexual stimulation activates the parasympathetic sacral spinal center (**S2, S3, S4**; pelvic splanchnic nerves / nervi erigentes).
- Postganglionic parasympathetic cavernous nerves release **nitric oxide (NO)** and acetylcholine, while shearing stress stimulates endothelial cells to synthesize NO via **endothelial nitric oxide synthase (eNOS)**.

**2. The Intracellular cGMP Vasodilatory Cascade:**
- Nitric oxide diffuses rapidly into the vascular smooth muscle cells of the **helicine arteries** and cavernosal trabeculae.
- NO binds to the heme moiety of cytosolic **soluble guanylyl cyclase (sGC)**, activating the enzyme.
- sGC converts GTP into **cyclic guanosine monophosphate (cGMP)**.
- cGMP activates **protein kinase G (PKG)**, which phosphorylates intracellular targets to:
  - Extrude cytosolic calcium via plasma membrane $\text{Ca}^{2+}$-ATPase.
  - Sequester calcium into the sarcoplasmic reticulum.
  - Open large-conductance calcium-activated potassium ($\text{BK}_{\text{Ca}}$) channels, hyperpolarizing the cell membrane.
- The marked drop in free cytosolic calcium dephosphorylates myosin light chains, inducing profound **vascular smooth muscle relaxation**.

**3. Veno-Occlusive Mechanism:**
- Blood rushes into the dilated cavernosal lacunar spaces under high arterial pressure.
- Expanding erectile sinusoidal spaces compress the subtunical venules against the rigid, non-compliant **tunica albuginea**, trapping blood inside the corpora cavernosa to produce penile rigidity and erection.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Parasympathetic stimulation (S2-S4) releasing nitric oxide (NO) (1.0 mark).
2. Intracellular cascade: NO -> sGC -> cGMP -> PKG -> decreased cytosolic calcium -> smooth muscle relaxation (1.5 marks).
3. Tumescence & veno-occlusion: Helicine artery dilation and compression of subtunical venules against tunica albuginea (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
Erection terminates when phosphodiesterase type 5 (PDE-5) hydrolyzes cGMP to 5'-GMP, and sympathetic discharge contracts helicine smooth muscle, opening venous outflow channels.

**Ain Shams Faculty Curriculum Highlights:**
- 'Point and Shoot': Parasympathetic controls erection (Point); Sympathetic controls emission/ejaculation (Shoot)."""
    },

    "MUG3-CH205-PATH-0012": {
        "text": "Name the embryological origin of the seminal vesicles and describe their anatomical relations to the bladder and rectum.",
        "modelAnswer": """**1. Embryological Origin:**
- The seminal vesicles develop as lateral outpocketings (diverticula) from the caudal portion of the **mesonephric (Wolffian) duct** during the 10th to 12th week of gestation.
- Driven by fetal testosterone synthesized by Leydig cells.

**2. Anatomical Relations:**
- Situated obliquely on the posterior surface (base) of the urinary bladder:
  - **Anteriorly:** In direct contact with the fundus (base) of the **urinary bladder**, situated lateral to the ampullae of the vasa deferentia.
  - **Posteriorly:** Related to the anterior surface of the **rectum**, separated from it by the rectovesical fascia (**fascia of Denonvilliers**).
  - **Superiorly:** Their upper extremities are covered by peritoneum forming the anterior boundary of the rectovesical pouch.
  - **Inferiorly:** The narrow excretory duct unites with the duct of the vas deferens at an acute angle to form the **ejaculatory duct**, which pierces the posterior surface of the prostate gland.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Embryology: Lateral diverticulum from the mesonephric (Wolffian) duct under testosterone (1.0 mark).
2. Anterior relation: Base of the urinary bladder (1.0 mark).
3. Posterior relation: Rectum separated by the fascia of Denonvilliers; joins vas to form ejaculatory duct (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Because of their retrovesical location, seminal vesicles and ampullae of the vas deferens are palpated during digital rectal examination when abnormally indurated or distended by infection (seminal vesiculitis).

**Ain Shams Faculty Curriculum Highlights:**
- Seminal vesicles contribute ~60-70% of total ejaculate volume (fructose and semenogelin)."""
    },

    "MUG3-CH205-PATH-0014": {
        "text": "Detail the anatomical relations and boundaries of the median lobe of the prostate gland.",
        "modelAnswer": """**1. Anatomical Position & Boundaries:**
- The median (middle) lobe of the prostate is the wedge of prostatic tissue bounded by:
  - **Anteriorly:** The posterior wall of the prostatic urethra (above the verumontanum).
  - **Posteriorly:** The bilateral ejaculatory ducts as they traverse obliquely downward and forward.
  - **Superiorly:** The bladder neck and the inferior surface of the vesical trigone.
  - **Inferiorly:** Merges with the central zone of the prostate at the level of the verumontanum.

**2. Clinical & Functional Anatomy:**
- Structurally part of the periurethral and transitional zones.
- When enlarged in Benign Prostatic Hyperplasia, it projects directly upward into the bladder cavity behind the internal urethral orifice, elevating the mucous membrane to produce the **uvula vesicae**.
- This creates mechanical bladder outflow obstruction and a dynamic ball-valve action that blocks micturition.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Anterior boundary: Posterior wall of upper prostatic urethra (1.0 mark).
2. Posterior boundary: Bilateral ejaculatory ducts (1.0 mark).
3. Superior boundary: Bladder neck and trigone (uvula vesicae) (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
The median lobe lies directly under the trigone; its enlargement is the primary driver of intravesical prostatic protrusion (IPP), an independent predictor of medical therapy failure in BPH.

**Ain Shams Faculty Curriculum Highlights:**
- Ejaculatory ducts separate the median lobe from the posterior lobe."""
    },

    "MUG3-CH205-PATH-0015": {
        "text": "State the nerve roots that form the lumbosacral trunk, and describe its course across the pelvic brim to the sacral plexus.",
        "modelAnswer": """**1. Constituent Nerve Roots:**
- The **lumbosacral trunk** is formed by the union of:
  - The lower, descending branch of the anterior primary ramus of **L4**.
  - The entire anterior primary ramus of **L5**.
- (L4 + L5 contribute the lumbar component to the sacral plexus).

**2. Course Across the Pelvic Brim:**
- Forms on the medial border of the psoas major muscle within the lower abdomen.
- Descends obliquely across the ala of the **sacrum** (lateral to the promontory) into the true pelvis.
- Passes **anterior to the sacroiliac joint** and medial to the obturator nerve.
- Crosses posterior to the internal iliac vessels and anterior primary division of the internal iliac artery.

**3. Entry into the Sacral Plexus:**
- Upon entering the pelvis, the lumbosacral trunk unites with the anterior primary ramus of **S1** (and subsequently S2, S3, S4) on the anterior surface of the **piriformis muscle** to form the **sacral plexus**, providing the major contribution to the **sciatic nerve**.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Nerve roots: Lower branch of L4 + entire anterior ramus of L5 (1.0 mark).
2. Course: Descends across sacral ala and sacroiliac joint into true pelvis (1.0 mark).
3. Sacral plexus formation: Joins S1 on anterior surface of piriformis muscle to form sciatic nerve (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Because the lumbosacral trunk crosses the sacral ala immediately adjacent to the pelvic brim, it can be compressed by the fetal head during prolonged, obstructed labor, causing postpartum foot drop (peroneal nerve weakness).

**Ain Shams Faculty Curriculum Highlights:**
- Lumbosacral trunk = L4 (descending branch) + L5."""
    },

    "MUG3-CH205-PATH-0016": {
        "text": "Describe the anatomical course, dilatations, and mucosal glands of the spongy (penile) urethra.",
        "modelAnswer": """**1. Anatomical Course:**
- The spongy (cavernous / penile) urethra is the longest segment of the male urethra, measuring approximately **15 cm** in length.
- Extends from the inferior fascia of the urogenital diaphragm (perineal membrane) to the external urethral meatus.
- Traverses the entire length of the **corpus spongiosum** of the penis.

**2. Two Anatomical Dilatations:**
- **Intrabulbar Fossa (Bulbar Dilatation):** A prominent dilatation located proximally within the bulb of the penis.
- **Navicular Fossa (Fossa Navicularis):** A transverse dilatation situated distally within the glans penis, terminating at the vertical slit of the external urethral meatus (the narrowest point of the entire urethra).

**3. Mucosal Glands and Openings:**
- Lined by pseudostratified columnar epithelium proximally, transitioning to stratified squamous epithelium in the navicular fossa.
- **Openings of Bulbourethral (Cowper's) Glands:** Two tiny ducts pierce the floor of the proximal spongy urethra within the bulb.
- **Urethral Glands (Glands of Littré):** Numerous small, mucus-secreting epithelial glands embedded in the mucosa, opening into small epithelial outpocketings called **lacunae of Morgagni** (which can catch the tip of a catheter).""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Course: 15 cm long, traversing the corpus spongiosum of penis (1.0 mark).
2. Dilatations: Intrabulbar fossa in bulb and navicular fossa in glans (1.0 mark).
3. Openings: Ducts of bulbourethral glands and glands of Littré / lacunae of Morgagni (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Straddle injuries (e.g., falling onto a bicycle crossbar) crush the bulbar urethra against the pubic symphysis, causing rupture of the spongy urethra with extravasation of urine into the superficial perineal pouch (Colles' fascia).

**Ain Shams Faculty Curriculum Highlights:**
- External urethral meatus is the narrowest point of the entire urinary tract."""
    },

    "MUG3-CH205-PATH-0021": {
        "text": "Describe the anatomical boundaries, mucosal characteristics, and clinical significance of the isthmus uteri and internal os.",
        "modelAnswer": """**1. Anatomical Boundaries & Position:**
- The **isthmus uteri** is the constricted junctional zone (measuring ~0.5 to 1 cm in non-pregnant women) situated between the lower end of the uterine body (corpus) and the upper cervix.
- Demarcated internally by two distinct anatomical landmarks:
  - **Anatomical Internal Os:** The superior transition where the wide triangular uterine cavity narrows into the isthmic canal.
  - **Histological Internal Os:** The inferior boundary where the endometrium transitions into the endocervical mucosa.

**2. Mucosal Characteristics:**
- Lined by a low, inactive endometrium with sparse glands and dense stroma that does not undergo typical cyclic menstrual shedding.

**3. Clinical & Obstetrical Significance (Lower Uterine Segment):**
- In pregnancy, after the 12th week, the isthmus uteri unfolds and incorporates into the uterine cavity, expanding to form the **Lower Uterine Segment (LUS)**.
- **Site of Cesarean Section:** The thin, less vascular lower uterine segment is the standard site for a transverse lower segment Cesarean section (LSCS) incision, minimizing blood loss and risk of future uterine rupture.
- **Cervical Incompetence:** Painless mid-trimester dilatation of the internal os leads to recurrent spontaneous second-trimester miscarriages, treated by cervical cerclage.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Anatomical position: Constricted zone between corpus and cervix; anatomical vs histological internal os (1.0 mark).
2. Transformation into the Lower Uterine Segment (LUS) during pregnancy (1.0 mark).
3. Clinical significance: Transverse incision site for Cesarean section and cervical incompetence (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
The distinction between upper active uterine segment (muscular, thick, contractile) and lower passive segment (thin, fibrous, dilating) is critical for normal labor progression.

**Ain Shams Faculty Curriculum Highlights:**
- In pregnancy, the uterine isthmus develops into the lower uterine segment."""
    },

    "MUG3-CH205-PATH-0022": {
        "text": "Describe the anatomical boundaries, peritoneal reflections, and clinical significance of the rectovesical pouch in the male pelvis.",
        "modelAnswer": """**1. Peritoneal Reflections & Boundaries:**
- The **rectovesical pouch (excavatio rectovesicalis)** is the peritoneal recess formed in the male pelvis by the reflection of parietal peritoneum:
  - Peritoneum descends from the posterior abdominal wall over the anterior surface and sides of the upper rectum.
  - It covers the anterior surface of the middle third of the rectum, then reflects **anteriorly onto the superior surface and upper part of the base (fundus) of the urinary bladder**.
- **Anterior Boundary:** Posterior wall (base) and superior surface of the urinary bladder, seminal vesicles, and ampullae of vasa deferentia.
- **Posterior Boundary:** Anterior wall of the middle third of the rectum.
- **Floor:** The reflection line, approximately **7.5 cm from the anal verge** (separated from the perineum by the rectovesical fascia of Denonvilliers).

**2. Clinical Significance:**
- **Lowest Point of Peritoneal Cavity:** In the male in the erect and supine positions, the rectovesical pouch is the most dependent peritoneal space.
- **Accumulation of Pathological Fluid:** Intraperitoneal exudates, blood (hemoperitoneum), pus (peritonitis from perforated appendicitis), and malignant cells (drop metastases / Blumer's shelf) pool in this pouch.
- **Accessibility:** Easily palpated during digital rectal examination (DRE) as anterior fullness/tenderness, and can be drained transrectally if an abscess forms.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Peritoneal reflection: Between anterior wall of rectum and posterior surface of bladder/seminal vesicles (1.0 mark).
2. Floor located ~7.5 cm from anal verge (0.5 mark).
3. Clinical significance: Lowest peritoneal space in males; accumulates pus/blood/malignant cells; accessible to DRE (1.5 marks).

**Core Educational Objective & Clinical Mechanism:**
In females, the rectouterine pouch of Douglas corresponds to the rectovesical pouch, but is deeper (~5.5 cm from anal verge) because the uterus is interposed.

**Ain Shams Faculty Curriculum Highlights:**
- Rectovesical pouch is the lowest point of the peritoneal cavity in males."""
    },

    "MUG3-CH205-PATH-0028": {
        "text": "A 2-year-old boy presents with a painless unilateral testicular mass. Biopsy reveals Schiller-Duval bodies. Identify the diagnosis, serum tumor marker, and histological features of this tumor.",
        "modelAnswer": """**1. Diagnosis:**
- **Yolk Sac Tumor (Endodermal Sinus Tumor / Infantile Embryonal Carcinoma)**:
  - The **most common malignant testicular germ cell tumor in infants and young children** (under 3 years of age; accounts for ~80% of childhood testicular tumors).

**2. Serum Tumor Marker (Diagnostic & Monitoring):**
- Markedly elevated serum **Alpha-Fetoprotein (AFP)** (levels often $>1000\text{ ng/mL}$).
- Serum AFP serves as an indispensable biomarker for initial diagnosis, monitoring response to chemotherapy, and detecting tumor recurrence.

**3. Histopathological Features:**
- **Light Microscopy (H&E):**
  - **Reticular (Microcystic) Pattern:** Most common pattern, formed by a loose, lace-like meshwork of flattened or cuboidal cells lining intercommunicating spaces.
  - **Schiller-Duval Bodies (Pathognomonic Hallmark):** Characteristic perivascular glomerulus-like or papillary structures consisting of a central blood capillary core surrounded by a mantle of malignant embryonal cells, projecting into a cystic space lined by flat tumor cells (resembling primitive yolk sac sinuses).
  - **Eosinophilic Hyaline Globules:** Cytoplasmic and extracellular spherical, PAS-positive, diastase-resistant globules containing accumulated alpha-fetoprotein and $\alpha_1$-antitrypsin.
- Immunohistochemistry: Strongly positive for **AFP** and **Glypican-3**; negative for OCT4 and CD30.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Diagnosis: Yolk sac tumor (Endodermal sinus tumor) (1.0 mark).
2. Tumor marker: Markedly elevated serum Alpha-Fetoprotein (AFP) (1.0 mark).
3. Histology: Schiller-Duval bodies (glomeruloid structures), reticular pattern, and PAS-positive hyaline globules (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Pure yolk sac tumors in infants carry an excellent prognosis (>90% cure rate with inguinal orchiectomy and platinum-based chemotherapy). In adults, yolk sac elements typically occur as components of aggressive mixed non-seminomatous germ cell tumors.

**Ain Shams Faculty Curriculum Highlights:**
- Schiller-Duval bodies and elevated serum AFP are pathognomonic for yolk sac tumors."""
    },

    "MUG3-CH205-PATH-0030": {
        "text": "Describe the gross morphology and microscopic criteria of benign Ovarian Serous Cystadenoma.",
        "modelAnswer": """**1. Gross Morphological Features:**
- Accounts for approximately **20 to 25% of all benign ovarian neoplasms** (most common benign ovarian epithelial tumor, peak incidence ages 20 to 45 years).
- **Appearance:** Typically large, smooth-surfaced, spherical or ovoid cystic mass (often 5 to 15 cm in diameter); 15-20% are bilateral.
- **Internal Architecture:** Characteristically **unilocular** (or low-multilocular) with a thin, translucent cyst wall.
- **Cyst Contents:** Filled with clear, pale yellow, watery, proteinaceous **serous fluid**.
- Inner cyst lining is smooth and glistening; occasional small, blunt, delicate papillary projections may be present.

**2. Microscopic Histopathological Criteria:**
- Lined by a single layer of uniform **ciliated tall columnar epithelial cells** intermixed with non-ciliated secretory cells, resembling the normal mucosal lining of the **fallopian (uterine) tube**.
- Nuclei are round, basal, and monomorphic, with delicate chromatin and absent mitotic figures.
- **Absence of Malignancy Criteria:** No nuclear pleomorphism, no architectural complexity (no cellular stratification $>2-3$ layers), no solid sheets, and **strictly NO stromal invasion**.
- Occasional concentric, laminated, calcified microspheres termed **psammoma bodies** may be seen in the fibrous stroma.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Gross morphology: Unilocular thin-walled cyst containing clear watery serous fluid (1.0 mark).
2. Microscopy: Single layer of ciliated columnar epithelial cells resembling fallopian tube lining (1.0 mark).
3. Absence of stromal invasion, atypia, or multilayering; presence of psammoma bodies (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Serous tumors reflect Müllerian differentiation. Benign cystadenomas must be carefully distinguished from borderline tumors (mild atypia, stratification) and invasive serous carcinomas (destructive stromal invasion, high p53 mutations).

**Ain Shams Faculty Curriculum Highlights:**
- Serous cystadenoma is lined by tubal-type ciliated columnar epithelium."""
    },

    "MUG3-CH205-PATH-0033": {
        "text": "Explain the pharmacological mechanism and clinical rationale for using Raloxifene in postmenopausal osteoporosis.",
        "modelAnswer": """**1. Pharmacological Mechanism:**
- **Raloxifene** is a second-generation Selective Estrogen Receptor Modulator (SERM).
- It binds with high affinity to estrogen receptors ($\text{ER}\alpha$ and $\text{ER}\beta$), altering receptor conformation to recruit tissue-specific transcriptional coactivators in bone:
  - In bone tissue, it functions as an **estrogen receptor agonist**.
  - It suppresses osteoblast synthesis of **RANK-Ligand (RANKL)** and stimulates **Osteoprotegerin (OPG)** secretion.
  - OPG acts as a soluble decoy receptor that binds RANKL, preventing it from binding RANK on osteoclast precursors.
  - This halts osteoclast differentiation, reduces osteoclastic bone resorption, and restores balanced bone remodeling.

**2. Clinical Benefits:**
- **Increases Bone Mineral Density (BMD):** Significantly increases lumbar spine and femoral neck BMD.
- **Fracture Risk Reduction:** Reduces the relative risk of **vertebral compression fractures by 30 to 50%** in postmenopausal women with osteoporosis.
- **Cardiovascular & Lipid Benefit:** Decreases serum total cholesterol and LDL-C.

**3. Breast Cancer Risk Reduction:**
- Concurrently acts as an **ER antagonist in breast tissue**, reducing the incidence of invasive ER-positive breast cancer by ~65-70%.
- Has **no stimulatory effect on the endometrium**, avoiding the increased risk of endometrial carcinoma seen with tamoxifen.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. SERM mechanism: ER agonist in bone altering RANKL/OPG balance to inhibit osteoclast resorption (1.5 marks).
2. Clinical efficacy: Increases BMD and reduces vertebral fracture risk by 30-50% (1.0 mark).
3. Dual benefit: Antagonist in breast tissue preventing cancer, without endometrial cancer risk (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
Raloxifene does not reduce hip fracture risk as effectively as bisphosphonates (alendronate, zoledronic acid), but is the preferred drug when breast cancer chemoprevention is simultaneously desired.

**Ain Shams Faculty Curriculum Highlights:**
- Raloxifene reduces vertebral fractures and invasive breast cancer risk."""
    },

    "MUG3-CH205-PATH-0036": {
        "text": "Describe the histological wall layers and contractile mechanisms of the ductus (vas) deferens.",
        "modelAnswer": """**1. Histological Organization of the Vas Deferens Wall:**
The ductus deferens possesses an exceptionally thick fibromuscular wall surrounding a narrow, stellate lumen, organized into three distinct tunics:

1. **Tunica Mucosa:**
   - Thrown into longitudinal mucosal folds that give the lumen its star-shaped profile in cross-section.
   - Lined by a **pseudostratified columnar epithelium** with two cell types:
     - **Tall Columnar Principal Cells:** Bearing non-motile **stereocilia** (long, branched actin-rich microvilli) that absorb luminal fluid and dead sperm.
     - **Basal Stem Cells:** Small, rounded regenerative cells resting on the basement membrane.
   - Thin lamina propria rich in elastic fibers.
2. **Tunica Muscularis (Massive Three-Layered Smooth Muscle Coat):**
   - Comprises the vast bulk of the wall thickness (~1 mm thick):
     - **Inner Longitudinal Smooth Muscle Layer** (thin).
     - **Middle Circular Smooth Muscle Layer** (exceptionally thick and dense).
     - **Outer Longitudinal Smooth Muscle Layer** (thick).
3. **Tunica Adventitia:**
   - Outer layer of dense fibrous connective tissue blending with spermatic cord fascial sheaths, containing blood vessels, lymphatics, and autonomic nerve bundles.

**2. Contractile Mechanism in Emission:**
- Densely innervated by **sympathetic adrenergic nerve fibers** (hypogastric nerves, T12-L2) releasing norepinephrine onto **$\alpha_1$-adrenergic receptors**.
- Triggers coordinated, powerful, rapid **peristaltic contractions** during the emission phase of ejaculation, forcefully propelling spermatozoa from the epididymis through the vas into the prostatic urethra.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Mucosa: Stellate lumen lined by pseudostratified columnar epithelium with stereocilia (1.0 mark).
2. Three muscularis layers: Inner longitudinal, thick middle circular, outer longitudinal (1.0 mark).
3. Sympathetic α1-adrenergic innervation driving peristaltic propulsion during emission (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
The massive smooth muscle coat gives the vas deferens its characteristic firm, cord-like texture, allowing urologists to isolate it palpably through the scrotal skin during bilateral vasectomy.

**Ain Shams Faculty Curriculum Highlights:**
- The muscular wall of the vas deferens is the thickest relative to lumen diameter of any hollow organ."""
    },

    "MUG3-CH205-PATH-0037": {
        "text": "Compare the cyclical histological responses of the fallopian (uterine) tube epithelium with those of the uterine endometrium during the menstrual cycle.",
        "modelAnswer": """While the uterine endometrium undergoes marked cyclical desquamation and bleeding under ovarian steroids, the fallopian tube epithelium exhibits subtle, non-shedding functional adaptations:

**1. Lack of Menstrual Shedding in the Fallopian Tube:**
- The fallopian tube mucosa is lined by a simple columnar epithelium composed of **ciliated cells** and **non-ciliated secretory (peg) cells**.
- **Unlike the endometrium, the fallopian tube epithelium DOES NOT undergo cyclical tissue loss, desquamation, necrosis, or menstrual shedding**. The tubal mucosa remains anatomically intact throughout the entire cycle.

**2. Cyclical Hormonal Modulation of Tubal Epithelium:**
- **Follicular (Estrogenic) Phase:**
  - High estrogen levels stimulate cellular hypertrophy: **ciliated cells become taller** and increase their ciliary beating frequency.
  - Secretory (peg) cells swell and accumulate apical secretory granules containing glycogen, proteins, and electrolytes.
- **Luteal (Progestational) Phase:**
  - Progesterone stimulates **secretory peg cells to release nutritive fluid** ('tubal fluid' rich in albumin, pyruvate, and lactate) into the lumen to nourish the unfertilized ovum or developing morula/blastocyst.
  - Ciliated cells become shorter and shed some cilia, while muscular peristalsis accelerates toward the uterus.

**3. Contrast with Uterine Endometrium:**
- The endometrium undergoes massive cyclic destruction: the entire functional layer (stratum functionale) proliferates, transforms into secretory glands, and **sloughs completely during menstruation** when progesterone drops, leaving only the basal layer (stratum basale).""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Lack of shedding: Fallopian tube epithelium does NOT undergo menstrual shedding or necrosis (1.0 mark).
2. Estrogen effect: Hypertrophy and increased ciliary activity (0.5 mark); Progesterone effect: Nutritive fluid secretion by peg cells (0.5 mark).
3. Endometrial contrast: Complete desquamation of stratum functionale during menstruation (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Tubal fluid provides the physiological environment for capacitation, fertilization (which occurs in the ampulla), and early cleavage of the zygote before it enters the uterine cavity on day 4 post-fertilization.

**Ain Shams Faculty Curriculum Highlights:**
- Fallopian tube ciliated cells beat toward the uterus to transport the ovum."""
    },

    "MUG3-CH205-PATH-0039": {
        "text": "Describe the clinical presentation, gross pathology, and microscopic patterns of mammary Fibroadenoma.",
        "modelAnswer": """**1. Clinical Presentation:**
- The **most common benign tumor of the female breast**, predominantly affecting young women aged **15 to 35 years**.
- Presents as a discrete, solitary, painless, firm, rubbery, sharply circumscribed, freely movable mass measuring 1 to 3 cm in diameter (**'breast mouse'**, because it slips easily beneath the examining fingers).
- Responsive to hormones: may enlarge during pregnancy or late menstrual cycle and regresses after menopause.

**2. Gross Pathological Appearance:**
- Well-circumscribed, encapsulated, round or ovoid mass.
- Firm, rubbery, grey-white cut surface that **bulges above the surrounding breast tissue**, displaying slit-like clefts and a delicate whorled lobular pattern without hemorrhage or necrosis.

**3. Microscopic Histopathological Architecture (Biphasic Tumor):**
- A true **biphasic benign neoplasm** composed of both proliferating epithelial and stromal elements:
  - **Glandular Epithelium:** Proliferating cuboidal to low columnar cells lining duct-like spaces, surrounded by an intact myoepithelial layer.
  - **Stromal Elements:** Proliferating loose, cellular, fibroblastic stroma rich in myxoid ground substance.
- **Two Histological Growth Patterns (Frequently Mixed):**
  - **Intracanalicular Pattern:** Proliferating stroma compresses and distorts glandular spaces into elongated, irregular, branched, slit-like clefts.
  - **Pericanalicular Pattern:** Proliferating stroma surrounds round, patent glandular ductules in concentric rings without compressing them.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Clinical: Painless, firm, mobile 'breast mouse' in a young woman (0.5 mark).
2. Gross: Well-circumscribed, bulging, rubbery grey-white cut surface with clefts (0.5 mark).
3. Biphasic histology: Intact ductal epithelium and cellular stroma (1.0 mark).
4. Patterns: Intracanalicular (compressed slits) and pericanalicular (concentric circles) (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Fibroadenoma is a clonal stromal neoplasm that drives polyclonal secondary epithelial proliferation. It carries no increased risk of invasive breast cancer unless complex features (cysts >3 mm, sclerosing adenosis, papillary apocrine metaplasia) are present.

**Ain Shams Faculty Curriculum Highlights:**
- Freely movable breast lump in a woman under 30 is classically a fibroadenoma."""
    },

    "MUG3-CH205-PATH-0076": {
        "text": "State the recommended rate of correction for chronic hyponatremia and describe the neurological complication of exceeding this limit.",
        "modelAnswer": """**1. Recommended Rate of Correction (Safety Rule):**
- For chronic hyponatremia (present for $>48\text{ hours}$ or of unknown duration):
  - **Target Correction Rate:** Increase serum sodium by **4 to 8 mEq/L per 24 hours**.
  - **Maximum Safe Upper Limit:** **DO NOT exceed 8 to 10 mEq/L in any 24-hour period** (and $<18\text{ mEq/L}$ in 48 hours).
  - In patients at high risk of demyelination (malnutrition, alcoholism, advanced liver disease), the rate should not exceed 4 to 6 mEq/L per day.

**2. Neurological Complication of Overly Rapid Correction:**
- **Osmotic Demyelination Syndrome (ODS / Central Pontine Myelinolysis [CPM]):**
  - **Pathophysiology:** Over 48 hours, brain cells adapt to chronic hyponatremia by extruding intracellular organic osmoles (myoinositol, glutamate, taurine) to prevent brain swelling.
  - When hypertonic or isotonic saline is administered too rapidly, the extracellular osmolarity rises sharply.
  - Water rushes down the osmotic gradient out of brain cells, causing acute shrinkage and dehydration of oligodendrocytes before intracellular osmoles can be replenished.
  - This triggers oligodendrocyte apoptosis and disruption of the myelin sheath in the basis pontis.
  - **Clinical Manifestations:** Typically presents **2 to 6 days after rapid correction** with initial improvement followed by catastrophic neurological deterioration: spastic quadriparesis, pseudobulbar palsy (dysarthria, dysphagia), cognitive impairment, and classic **'locked-in' syndrome**.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Rate limit: 4-8 mEq/L per 24 hours; strictly never exceed 8-10 mEq/L in 24 hours (1.0 mark).
2. Pathogenesis of ODS: Dehydration of brain cells and oligodendrocyte apoptosis in basis pontis (1.0 mark).
3. Clinical syndrome: Delayed (2-6 days) spastic quadriparesis, pseudobulbar palsy, locked-in syndrome (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
If sodium levels inadvertently rise too rapidly, administration of free water (D5W) or desmopressin (DDAVP) is indicated to 're-lower' serum sodium back below the safe 24-hour limit.

**Ain Shams Faculty Curriculum Highlights:**
- Osmotic demyelination syndrome affects the central basis pontis."""
    },

    "MUG3-CH205-PATH-0077": {
        "text": "List the safe oral antimicrobial agents for treating uncomplicated urinary tract infections in pregnancy, noting gestational timing restrictions.",
        "modelAnswer": """Asymptomatic bacteriuria and acute cystitis in pregnancy must always be treated to prevent acute pyelonephritis and preterm delivery. Safe oral antimicrobial options include:

**1. Beta-Lactam Antibiotics (Category B - Safe Across All Trimesters):**
- **Amoxicillin-Clavulanate (Augmentin):** 500/125 mg orally BID for 5 to 7 days (broad coverage, highly safe throughout pregnancy).
- **Cephalosporins (e.g., Cephalexin, Cefuroxime):** Cephalexin 500 mg orally QID for 5 to 7 days (excellent urinary tract penetration, highly safe).

**2. Fosfomycin Trometamol (Category B):**
- Single oral dose of **3 g sachet** in water; achieves high active urinary concentrations for 48 hours, safe in all trimesters with excellent compliance.

**3. Nitrofurantoin (Category B - Timing Restrictions):**
- Nitrofurantoin monohydrate/macrocrystals 100 mg orally BID for 5 to 7 days.
- **Timing Restrictions:**
  - **Avoid in the 1st Trimester:** Conflicting reports of congenital malformations.
  - **Strictly Contraindicated at Term (Weeks 36 to 42 / Labor):** Can trigger **neonatal hemolytic anemia** due to immature neonatal erythrocyte glutathione reductase activity.

**4. Strictly Contraindicated Antibiotics in Pregnancy:**
- **Fluoroquinolones (Ciprofloxacin):** Fetal cartilage toxicity and arthropathies.
- **Tetracyclines (Doxycycline):** Permanent brown tooth discoloration and bone growth inhibition.
- **Trimethoprim-Sulfamethoxazole:** Teratogenic in 1st trimester (folate antagonist) and causes neonatal **kernicterus** near term (displaces bilirubin from albumin).""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Safe beta-lactams: Amoxicillin-clavulanate and Cephalexin (safe all trimesters) (1.0 mark).
2. Fosfomycin (single dose) and Nitrofurantoin (avoid in 1st trimester and near term due to hemolysis) (1.0 mark).
3. Contraindicated classes: Fluoroquinolones (cartilage), Tetracyclines (teeth/bones), Bactrim (kernicterus) (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
All pregnant women must be screened for asymptomatic bacteriuria at 12-16 weeks gestation, and a post-treatment test-of-cure urine culture is mandatory 1-2 weeks after antibiotic completion.

**Ain Shams Faculty Curriculum Highlights:**
- Nitrofurantoin is contraindicated near term due to the risk of fetal hemolytic anemia."""
    },

    "MUG3-CH205-PATH-0080": {
        "text": "State the arterial pressure limits of renal autoregulation, and explain the myogenic mechanism maintaining constant renal blood flow.",
        "modelAnswer": """**1. Pressure Limits of Renal Autoregulation:**
- Renal Blood Flow (RBF) and Glomerular Filtration Rate (GFR) are maintained relatively constant across mean arterial pressures (MAP) ranging between **80 and 180 mmHg**.

**2. The Myogenic Mechanism (Bayliss Effect):**
- Operates as an intrinsic, pressure-sensitive property of the circular vascular smooth muscle cells in the **afferent arteriole**:
  1. **When Perfusion Pressure Increases (e.g., from 90 to 140 mmHg):**
     - Increased intravascular pressure distends and stretches the wall of the afferent arteriole.
     - Mechanical stretch opens **stretch-activated, non-selective cation channels** in the smooth muscle membrane.
     - Influx of sodium and calcium ions depolarizes the vascular smooth muscle cell membrane.
     - Depolarization opens voltage-gated **L-type calcium channels**, triggering a rapid influx of extracellular $\text{Ca}^{2+}$.
     - Calcium binds calmodulin to activate myosin light chain kinase (MLCK), triggering **immediate vasoconstriction** of the afferent arteriole.
  2. **Mathematical Balance:**
     - According to Ohm's law ($Q = \Delta P / R$), the proportional increase in afferent arteriolar resistance ($R$) precisely offsets the rise in perfusion pressure ($\Delta P$), keeping renal blood flow ($Q$) and capillary pressure constant.
  3. **When Perfusion Pressure Falls:**
     - Arteriolar stretch diminishes, L-type calcium channels close, smooth muscle relaxes, and the afferent arteriole **vasodilates**, preserving GFR down to 80 mmHg.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Autoregulation range: MAP 80 to 180 mmHg (1.0 mark).
2. Myogenic mechanism: Stretch opens cation channels, depolarizing membrane and opening L-type Ca2+ channels (1.0 mark).
3. Proportional resistance adjustment: Vasoconstriction offsets elevated pressure to maintain constant flow (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Below 80 mmHg MAP, the afferent arteriole is already maximally dilated; further drops in blood pressure produce a linear, passive decline in RBF and GFR (prerenal acute kidney injury).

**Ain Shams Faculty Curriculum Highlights:**
- The myogenic mechanism takes 1-2 seconds to react, followed by tubuloglomerular feedback (10-15 seconds)."""
    },

    "MUG3-CH205-PATH-0082": {
        "text": "Describe the endocrine role of the kidney in blood pressure homeostasis via the Renin-Angiotensin-Aldosterone System (RAAS).",
        "modelAnswer": """**1. Renin Secretion:**
- In response to renal hypoperfusion, sympathetic $\beta_1$ stimulation, or low macula densa NaCl, **juxtaglomerular (granular) cells** of the afferent arteriole secrete the aspartyl protease enzyme **Renin** into the renal vein.

**2. Enzymatic Cascade:**
- **Angiotensinogen Cleavage:** Renin cleaves circulating **angiotensinogen** (an $\alpha_2$-globulin produced constitutively by the liver) into the decapeptide **Angiotensin I** ($\text{Asp-Arg-Val-Tyr-Ile-His-Pro-Phe-His-Leu}$).
- **Angiotensin II Formation:** Angiotensin Converting Enzyme (**ACE**), located predominantly on pulmonary vascular endothelial cells and renal vascular endothelium, removes two terminal amino acids to form the active octapeptide **Angiotensin II**.

**3. Homeostatic Actions of Angiotensin II:**
- **Systemic Vasoconstriction:** Binds **$\text{AT}_1$ receptors** on vascular smooth muscle, activating $\text{G}_q$-phospholipase C to induce potent arteriolar vasoconstriction, elevating systemic vascular resistance and blood pressure.
- **Efferent Arteriolar Constriction:** Selectively constricts the efferent arteriole more than the afferent arteriole, raising $P_{GC}$ to preserve GFR during hypoperfusion.
- **Aldosterone Secretion:** Stimulates the adrenal **zona glomerulosa** to secrete **Aldosterone**, which activates ENaC and $\text{Na}^+-\text{K}^+$-ATPase in collecting duct principal cells, promoting renal **sodium and water retention**.
- **Central Effects:** Stimulates hypothalamic thirst center and posterior pituitary **ADH secretion**.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Renin secretion by juxtaglomerular cells (0.5 mark).
2. Cascade: Angiotensinogen -> Angiotensin I (via Renin) -> Angiotensin II (via ACE) (1.0 mark).
3. Angiotensin II actions: Systemic vasoconstriction, efferent arteriolar constriction, aldosterone secretion, and thirst/ADH (1.5 marks).

**Core Educational Objective & Clinical Mechanism:**
Pharmacological blockade of this cascade using ACE inhibitors (captopril, ramipril), ARBs (losartan, valsartan), or direct renin inhibitors (aliskiren) represents first-line therapy for essential hypertension and proteinuric renal disease.

**Ain Shams Faculty Curriculum Highlights:**
- ACE also degrades the vasodilator bradykinin; ACE inhibitors cause a dry cough due to bradykinin accumulation."""
    },

    "MUG3-CH205-PATH-0084": {
        "text": "Describe the principle, procedure, and clinical interpretation of the Germ Tube Test for Candida albicans.",
        "modelAnswer": """**1. Diagnostic Principle:**
- The **Germ Tube Test (Reynolds-Braude Phenomenon)** is a rapid, definitive screening test used to differentiate ***Candida albicans*** and ***Candida dubliniensis*** from all other non-albicans Candida species.
- Under specific nutritional and thermal triggers, yeast blastospores transition into invasive filamentous hyphae by forming initial germ tubes.

**2. Test Procedure:**
- A light inoculum of yeast colonies from a fresh culture is inoculated into a small tube containing **0.5 mL of sterile human serum** (or fetal bovine serum).
- The suspension is incubated in an incubator at **37°C for precisely 2 to 3 hours** (do not exceed 3 hours to prevent false-positive pseudo-germ tube formation).
- A drop of the incubated suspension is placed on a glass slide, covered with a coverslip, and examined under the light microscope (40x objective).

**3. Microscopic Interpretation:**
- **Positive Test (*C. albicans*):** Formation of true **germ tubes**—slender, cylindrical, tube-like hyphal outgrowths arising directly from the yeast cell with **parallel walls and strictly NO constriction or neck at the point of origin from the blastospore**.
- **Negative Test (Non-albicans species e.g., *C. tropicalis*):** Blastospores produce pseudohyphae characterized by a distinct **constriction at the point of origin** resembling a string of sausages.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Principle: Rapid differentiation of Candida albicans/dubliniensis from other yeast species (1.0 mark).
2. Procedure: Inoculation in human serum, incubation at 37°C for 2-3 hours (1.0 mark).
3. Interpretation: True germ tube has parallel walls with NO constriction at origin from blastospore (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
A positive germ tube test provides rapid same-day presumptive identification of C. albicans, allowing prompt initiation of targeted azole therapy without waiting for full carbohydrate assimilation panels.

**Ain Shams Faculty Curriculum Highlights:**
- True germ tubes have no constriction at their junction with the yeast cell."""
    },

    "MUG3-CH205-PATH-0085": {
        "text": "Identify the anatomical surface of the prostate gland from which the prostatic urethra emerges, and describe its anatomical course.",
        "modelAnswer": """**1. Emergence Surface:**
- The prostatic urethra pierces and emerges from the **anterior surface** of the prostate gland, slightly above and anterior to the apex of the gland.

**2. Anatomical Course:**
- Commences at the internal urethral orifice at the neck of the urinary bladder.
- Descends through the anterior substance of the prostate gland, curving slightly forward with a gentle posterior concavity.
- Measures approximately **3 to 4 cm** in length (the widest and most dilatable part of the male urethra).
- After emerging from the anterior surface near the apex, it immediately pierces the superior fascia of the **urogenital diaphragm** to enter the deep perineal pouch, continuing as the **membranous urethra** surrounded by the external urethral sphincter.

**3. Internal Features:**
- Features the **urethral crest**, flanked on each side by the **prostatic sinuses** (receiving 15-30 prostatic duct openings).
- The crest expands in the middle to form the **seminal colliculus (verumontanum)**, bearing the central slit-like opening of the **prostatic utricle** and the bilateral orifice puncta of the **ejaculatory ducts**.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Emergence: Anterior surface of the prostate near the apex (1.0 mark).
2. Course: 3-4 cm long, widest part, pierces urogenital diaphragm to become membranous urethra (1.0 mark).
3. Internal features: Urethral crest, prostatic sinuses, verumontanum, prostatic utricle, ejaculatory ducts (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
The verumontanum serves as an indispensable surgical landmark during Transurethral Resection of the Prostate (TURP): resections must strictly remain proximal to the verumontanum to avoid damaging the external sphincter in the membranous urethra and causing permanent urinary incontinence.

**Ain Shams Faculty Curriculum Highlights:**
- Verumontanum is the landmark for the external urethral sphincter during TURP."""
    },

    "MUG3-CH205-PATH-0086": {
        "text": "Describe the embryological origin and development of the uterine (fallopian) tubes.",
        "modelAnswer": """**1. Embryological Origin:**
- The uterine (fallopian) tubes develop from the **cranial, unfused portions of the paired paramesonephric (Müllerian) ducts**.
- The paramesonephric ducts arise during the 6th week of gestation as longitudinal invaginations of the coelomic surface epithelium on the anterolateral aspect of the urogenital ridge.

**2. Morphological Differentiation:**
- **Cranial Open Ends (Infundibulum and Fimbriae):**
  - The cranial-most open ends of the paramesonephric ducts do not fuse; they maintain their opening into the coelomic (peritoneal) cavity.
  - This open end expands and develops mucosal projections to form the **abdominal ostium and fimbriae** of the fallopian tube.
- **Horizontal & Vertical Segments (Ampulla and Isthmus):**
  - The cranial vertical portion and the horizontal portion that crosses the mesonephric duct develop into the **ampulla, isthmus, and intramural segments** of the tube.
- **Supporting Ligament:**
  - As the ovaries descend into the true pelvis, the fallopian tubes are pulled into a transverse plane, enclosed within the free upper border of the broad ligament (**mesosalpinx**).

**3. Absence of Müllerian Inhibiting Substance:**
- In the female fetus (absence of SRY and Sertoli cells), no Anti-Müllerian Hormone (AMH) is produced. Consequently, the paramesonephric ducts develop autonomously into the female genital tract without requiring estrogen.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Embryological origin: Cranial unfused portion of paramesonephric (Müllerian) ducts (1.0 mark).
2. Development: Cranial opening forms abdominal ostium/fimbriae; horizontal segment forms ampulla/isthmus (1.0 mark).
3. Role of AMH absence permitting autonomous female duct development (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Failure of canalization of the paramesonephric duct leads to congenital tubal atresia, an uncommon cause of mechanical female infertility.

**Ain Shams Faculty Curriculum Highlights:**
- Fallopian tubes derive from paramesonephric ducts; ovaries derive from genital ridges."""
    },

    "MUG3-CH205-PATH-0087": {
        "text": "Describe the dual somatic and autonomic innervation of the human vagina.",
        "modelAnswer": """The vagina possesses a dual sensory and autonomic nerve supply reflecting its dual embryological origin:

**1. Upper Three-Fourths (Upper 80%) of the Vagina (Visceral Autonomic Innervation):**
- **Nerve Supply:** Innervated by the **uterovaginal nerve plexus** (an extension of the inferior hypogastric plexus).
- **Sympathetic Fibers:** Derived from **T12-L1** via lumbar splanchnic nerves (vasoconstrictor).
- **Parasympathetic Fibers:** Derived from **S2, S3, S4** via pelvic splanchnic nerves (vasodilator and secretomotor to vaginal glands).
- **Sensory Modality:** Transmits visceral afferent fibers that travel with sympathetic nerves. Sensitive primarily to **stretch and distension**, but relatively **insensitive to touch, temperature, laceration, or pinprick pain**.

**2. Lower One-Fourth (Lower 20%) of the Vagina (Somatic Innervation):**
- **Nerve Supply:** Innervated by the **deep perineal nerve**, a major branch of the somatic **pudendal nerve (S2, S3, S4)**.
- **Sensory Modality:** Highly sensitive to **touch, pinprick, laceration, and temperature**.
- The vaginal orifice and lower introitus share somatic innervation with the labia minora and perineum.

**3. Clinical Significance:**
- Upper vaginal biopsy or cryosurgery can be performed without local anesthesia because visceral innervation lacks somatic pain fibers.
- In contrast, tears or incisions involving the lower vagina (e.g., episiotomy) cause severe pain and require a **pudendal nerve block** or local infiltration.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Upper 3/4 innervation: Uterovaginal autonomic plexus (S2-S4 parasympathetic / T12-L1 sympathetic) sensitive only to stretch (1.5 marks).
2. Lower 1/4 innervation: Somatic pudendal nerve (deep perineal branch) sensitive to pain, touch, temperature (1.0 mark).
3. Clinical correlate: Episiotomy / tears of lower vagina require pudendal block (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
The demarcation in sensory innervation precisely matches embryology: upper vagina derives from the paramesonephric duct, while the lower vagina derives from the urogenital sinus.

**Ain Shams Faculty Curriculum Highlights:**
- Pudendal nerve block anesthetizes the somatic lower fourth of the vagina and perineum."""
    },

    "MUG3-CH205-PATH-0089": {
        "text": "State the nerve roots forming the lumbosacral trunk, and trace its topographical course across the pelvic brim.",
        "modelAnswer": """**1. Constituent Nerve Roots:**
- The **lumbosacral trunk** is formed by:
  - The descending branch of the anterior primary ramus of **L4**.
  - The entire anterior primary ramus of **L5**.
  - (Carries somatic motor and sensory fibers from the L4 and L5 spinal cord segments).

**2. Topographical Course Across the Pelvic Brim:**
- Emerges from the medial border of the psoas major muscle in the iliac fossa.
- Descends vertically across the **ala of the sacrum** immediately lateral to the sacral promontory.
- Crosses anterior to the **sacroiliac joint** to enter the true pelvic cavity.
- In the pelvis, it runs deep to the internal iliac vessels and passes anterior to the upper border of the **piriformis muscle**.

**3. Termination in the Sacral Plexus:**
- On the anterior surface of the piriformis, the lumbosacral trunk merges with the anterior primary rami of **S1, S2, and S3** to form the **sacral plexus**.
- Its fibers contribute predominantly to the **sciatic nerve** (common fibular and tibial divisions) and the **superior gluteal nerve**.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Nerve roots: L4 descending branch + L5 anterior ramus (1.0 mark).
2. Topographical course: Over sacral ala and anterior to sacroiliac joint into pelvis (1.0 mark).
3. Joins S1-S3 on piriformis muscle to form the sacral plexus / sciatic nerve (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
The lumbosacral trunk is vulnerable to pressure injury between the fetal head and the sacral ala during dystocia in labor, manifesting as postpartum foot drop (L5 common peroneal distribution).

**Ain Shams Faculty Curriculum Highlights:**
- Lumbosacral trunk transmits L4 and L5 fibers to the sciatic nerve."""
    },

    "MUG3-CH205-PATH-0090": {
        "text": "Describe the arterial anastomoses of the uterine and vaginal arteries and their clinical significance in obstetrical practice.",
        "modelAnswer": """**1. Major Pelvic Arterial Anastomoses:**
- **Uterine-Vaginal Anastomosis:**
  - The **uterine artery** (branch of anterior internal iliac) gives off a descending **cervicovaginal branch** at the supravaginal cervix.
  - This branch anastomoses extensively with the ascending branches of the **vaginal artery** (and branches of the middle rectal artery).
  - Together, these anastomotic vessels form longitudinal arterial trunks along the anterior and posterior midlines of the vagina termed the **azygos arteries of the vagina**.
- **Uterine-Ovarian Anastomosis:**
  - The ascending main trunk of the uterine artery courses tortuously along the lateral border of the uterus within the broad ligament and anastomoses with the ovarian branch of the **ovarian artery** (direct branch of the abdominal aorta).

**2. Clinical & Obstetrical Significance:**
- **Control of Postpartum Hemorrhage (PPH):**
  - Because of this rich collateral network, **bilateral internal iliac (hypogastric) artery ligation** or **uterine artery embolization (UAE)** reduces pelvic pulse pressure by ~85% to halt massive obstetrical bleeding without causing uterine or vaginal ischemic necrosis.
- **Surgical Risk During Hysterectomy:**
  - The uterine artery crosses superior and anterior to the ureter **2 cm lateral to the supravaginal cervix** ('water under the bridge'), requiring meticulous skeletonization during ligation to avoid ureteral transection.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Uterine-vaginal anastomosis: Cervicovaginal branch joins vaginal artery forming azygos arteries of vagina (1.0 mark).
2. Uterine-ovarian anastomosis along broad ligament (0.5 mark).
3. Clinical significance: Collaterals preserve tissue viability during bilateral hypogastric ligation for PPH (1.0 mark).
4. Surgical relation: Crosses ureter 2 cm lateral to cervix (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
The uterus receives a dual arterial inflow (internal iliac via uterine artery, aorta via ovarian artery), providing an essential safety collateral in pelvic vascular surgery.

**Ain Shams Faculty Curriculum Highlights:**
- Uterine artery passes superior to the ureter 2 cm lateral to the cervix."""
    },

    "MUG3-CH205-PATH-0093": {
        "text": "Identify the diagnostic serum tumor marker and microscopic hallmark of testicular and ovarian Yolk Sac Tumors.",
        "modelAnswer": """**1. Diagnostic Serum Tumor Marker:**
- **Alpha-Fetoprotein (AFP)**:
  - Markedly elevated in serum (frequently $>1000\text{ ng/mL}$).
  - Serves as an indispensable clinical biomarker for initial diagnosis, monitoring treatment response, and early detection of recurrence.
  - *(Human chorionic gonadotropin [hCG] is characteristically normal in pure yolk sac tumors).*

**2. Microscopic Hallmark (Schiller-Duval Body):**
- **Schiller-Duval Bodies (Glomeruloid / Endodermal Sinus Structures):**
  - Pathognomonic microscopic structures found in 50-75% of yolk sac tumors.
  - Composed of a **central capillary loop** surrounded by a mantle of columnar or cuboidal embryonal tumor cells, projecting into a cystic space lined by flattened endothelial-like tumor cells (resembling a primitive glomerulus or yolk sac sinus).

**3. Additional Microscopic Findings:**
- **Reticular (Microcystic) Architecture:** The most common pattern; loose, lace-like meshwork of tumor cells with clear cytoplasm lining communicating microcysts.
- **Intracellular and Extracellular Hyaline Globules:** Strongly **PAS-positive, diastase-resistant eosinophilic globules** representing accumulated intracellular alpha-fetoprotein and $\alpha_1$-antitrypsin.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Tumor marker: Markedly elevated serum Alpha-Fetoprotein (AFP) (1.0 mark).
2. Schiller-Duval bodies: Central capillary core with malignant cells projecting into a cystic space (1.0 mark).
3. Additional histology: Reticular microcystic pattern and PAS-positive hyaline globules (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Yolk sac tumor is the most common malignant testicular neoplasm in boys under 3 years of age, where it carries an excellent prognosis with orchiectomy and chemotherapy.

**Ain Shams Faculty Curriculum Highlights:**
- Schiller-Duval bodies are pathognomonic for yolk sac tumors."""
    },

    "MUG3-CH205-PATH-0097": {
        "text": "Name the anatomical structures situated between the base (posterior surface) of the urinary bladder and the rectum in the male.",
        "modelAnswer": """In the male, the interval between the base of the urinary bladder (anteriorly) and the rectum (posteriorly) contains several vital reproductive and fascial structures:

**1. Seminal Vesicles:**
- Paired, coiled, sacculated reservoirs situated laterally on the base of the bladder, lying anterior to the rectum.

**2. Ampullae of the Vasa Deferentia:**
- The dilated terminal portions of the ductus deferentes, descending medially along the bladder base between the two seminal vesicles.
- The two ampullae converge inferiorly to delineate the **interdeferential triangle** on the posterior bladder wall.

**3. Peritoneal Rectovesical Pouch (Upper Part):**
- The upper third of the bladder base and upper rectum are separated by the **rectovesical pouch of peritoneum**.

**4. Rectovesical Fascia (Fascia of Denonvilliers) (Lower Part):**
- A tough, membranous fibromuscular septum situated between the lower unperitonealized bladder base/prostate and the anterior wall of the rectum.
- Acts as a strong anatomical barrier preventing the direct spread of prostatic adenocarcinoma into the rectum.

**5. Terminal Ureters & Pelvic Autonomic Plexuses:**
- The terminal segments of the ureters enter the bladder wall at the superolateral angles of the bladder base, accompanied by autonomic nerve fibers from the pelvic plexus.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Seminal vesicles and ampullae of vasa deferentia (interdeferential triangle) (1.0 mark).
2. Upper part: Rectovesical peritoneal pouch (1.0 mark).
3. Lower part: Rectovesical fascia of Denonvilliers (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
The fascia of Denonvilliers creates a distinct surgical cleavage plane during radical prostatectomy or abdominoperineal resection, protecting the rectum from injury and tumor seeding.

**Ain Shams Faculty Curriculum Highlights:**
- Prostatic carcinoma rarely invades through the fascia of Denonvilliers into the rectum."""
    },

    "MUG3-CH205-PATH-0102": {
        "text": "Explain the biphasic pharmacological mechanism of GnRH agonists (e.g., Leuprolide) in the hormonal treatment of advanced prostate carcinoma.",
        "modelAnswer": """**Leuprolide** (and Goserelin) are synthetic nonapeptide analogues of Gonadotropin-Releasing Hormone (GnRH) that possess prolonged half-lives and 100-fold higher affinity for pituitary GnRH receptors:

**1. Initial Acute Phase (The 'Testosterone Flare' Effect):**
- **Mechanism:** During the first 1 to 2 weeks of administration, leuprolide acts as a potent **GnRH receptor agonist**.
- It stimulates pituitary gonadotrophs, triggering an acute surge in **LH and FSH** secretion.
- This transiently stimulates testicular Leydig cells, causing an acute **surge in serum testosterone**.
- **Clinical Hazard:** The testosterone flare can stimulate tumor growth, causing a temporary exacerbation of symptoms: bone pain, acute urinary retention, or spinal cord compression in patients with vertebral metastases.
- **Prevention:** Co-administration of an **androgen receptor blocker (e.g., Bicalutamide or Flutamide)** for 2 weeks prior to initiating leuprolide blocks the flare.

**2. Chronic Phase (Therapeutic Receptor Downregulation):**
- **Mechanism:** Continuous, non-pulsatile stimulation of pituitary GnRH receptors causes uncoupling of G-proteins, followed by rapid **internalization and downregulation (desensitization) of pituitary GnRH receptors**.
- Pituitary LH and FSH secretion drops to near undetectable levels within 2 to 4 weeks.
- **Therapeutic Outcome:** Testicular synthesis of testosterone is shut off, achieving **medical castration (serum testosterone $<50\text{ ng/dL}$)**, which halts androgen-dependent prostate tumor proliferation.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Initial flare phase: Agonist action causing transient LH/testosterone surge (1.0 mark).
2. Clinical flare hazard and prevention with anti-androgens (bicalutamide) (0.5 mark).
3. Chronic phase: Receptor internalization and downregulation suppressing LH/FSH (1.0 mark).
4. Therapeutic goal: Chemical/medical castration (testosterone <50 ng/dL) (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
Physiological GnRH is secreted in pulsatile bursts every 60-90 minutes. Continuous exposure to GnRH agonists paradoxically shuts down the HPG axis, producing reversible medical orchiectomy.

**Ain Shams Faculty Curriculum Highlights:**
- Degarelix (a GnRH antagonist) achieves immediate castration without the initial testosterone flare."""
    },

    "MUG3-CH205-PATH-0111": {
        "text": "A 6-year-old child presents with periorbital edema, dark tea-colored urine, and oliguria following pharyngitis. Describe the diagnostic laboratory workup and expected findings for post-streptococcal glomerulonephritis.",
        "modelAnswer": """**1. Diagnostic Urinalysis & Microscopy:**
- **Gross Appearance:** Dark, smoky, cola-colored (tea-colored) urine due to hemoglobin oxidation into acid hematin.
- **Microscopic Examination:**
  - **Dysmorphic Erythrocytes:** Glomerular hematuria characterized by acanthocytes (RBCs with membrane blebs) resulting from mechanical passage through damaged basement membranes.
  - **Red Blood Cell (RBC) Casts:** Pathognomonic hallmark of active glomerular bleeding.
  - Mild to moderate non-selective proteinuria ($<2-3\text{ g/24 hr}$).

**2. Serum Complement Profile (Diagnostic Hallmark):**
- **Depressed Serum C3:** Characteristically **low serum C3** with normal or mildly reduced C4 levels, reflecting activation of the **alternative complement pathway** by streptococcal immune complexes.
- Serum C3 returns to normal physiological levels within **6 to 8 weeks** (failure to normalize at 8 weeks mandates renal biopsy to rule out MPGN or lupus nephritis).

**3. Serological Evidence of Streptococcal Infection:**
- **Elevated Anti-Streptolysin O (ASO) Titer:** Elevated in $>80\%$ of cases following streptococcal pharyngitis (peak at 3-5 weeks).
- **Elevated Anti-DNase B Titer:** Highly sensitive and specific for preceding streptococcal skin infections (impetigo/pyoderma).
- Elevated anti-hyaluronidase and streptozyme panel.

**4. Renal Function Tests:**
- Elevated BUN and serum creatinine; fractional excretion of sodium ($\text{FeNa} < 1\%$) reflecting acute oliguric nephritic state.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Urinalysis: Cola-colored urine, dysmorphic RBCs, and pathognomonic RBC casts (1.0 mark).
2. Complement: Depressed serum C3 normalizing within 6-8 weeks (1.0 mark).
3. Serology: Elevated ASO titer (pharyngitis) and anti-DNase B (skin infection) (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
RBC casts form in the renal tubules when extravasated erythrocytes become trapped within a matrix of Tamm-Horsfall mucoprotein (uromodulin), definitively identifying the glomerulus as the source of hematuria.

**Ain Shams Faculty Curriculum Highlights:**
- Transient hypocomplementemia (low C3) is a core diagnostic criterion for PSGN."""
    },

    "MUG3-CH205-PATH-0114": {
        "text": "Describe the genetic defect, clinical triad, and diagnostic electron microscopic findings of Alport syndrome.",
        "modelAnswer": """**1. Genetic Basis & Molecular Defect:**
- In approximately **85% of cases**, Alport syndrome is inherited as an **X-linked dominant** disorder caused by mutations in the ***COL4A5* gene** (chromosome Xq22), which encodes the **$\alpha_5$ chain of Type IV collagen**.
- (Autosomal recessive and dominant forms involve mutations in *COL4A3* or *COL4A4* on chromosome 2).
- Impairs the normal developmental molecular switching from embryonic $\alpha_1\alpha_1\alpha_2(\text{IV})$ to mature, cross-linked **$\alpha_3\alpha_4\alpha_5(\text{IV})$ collagen networks** in glomerular, cochlear, and ocular basement membranes.

**2. Classic Clinical Triad:**
1. **Progressive Hereditary Nephritis:** Persistent microscopic hematuria in early childhood, progressing to proteinuria, hypertension, and **end-stage renal disease (ESRD)** by early adulthood (ages 20 to 40 in affected males).
2. **Sensorineural Hearing Loss:** Bilateral, progressive, high-frequency sensorineural deafness developing in late childhood.
3. **Ocular Abnormalities:** Pathognomonic **anterior lenticonus** (conical protrusion of the anterior pole of the lens into the anterior chamber), macular flecks, and cataracts.

**3. Diagnostic Electron Microscopy (EM) (Diagnostic Hallmark):**
- **Irregular Thickening and Thinning of the GBM:** Early disease shows diffuse thinning, which evolves into diagnostic alternating segments of thick and attenuated basement membrane.
- **'Basket-Weave' Lamellation:** Marked longitudinal **splitting, fraying, and fragmentation of the lamina densa** into multiple interlacing electron-dense strands separated by clear spaces containing small electron-dense granules.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Genetics: X-linked COL4A5 mutation encoding α5 chain of Type IV collagen (1.0 mark).
2. Clinical triad: Progressive nephritis/hematuria, sensorineural deafness, and anterior lenticonus (1.0 mark).
3. EM diagnostic hallmark: 'Basket-weave' lamellation and splitting of the GBM lamina densa (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Because COL4A5 is X-linked, hemizygous males develop severe, early-onset ESRD and deafness, whereas heterozygous females typically present with persistent microscopic hematuria and a milder, variable clinical course.

**Ain Shams Faculty Curriculum Highlights:**
- Anterior lenticonus and basket-weave GBM splitting are pathognomonic for Alport syndrome."""
    },

    "MUG3-CH205-PATH-0133": {
        "text": "Detail the second-messenger signaling cascade of nitric oxide and cGMP in mediating corporal vascular smooth muscle relaxation during penile erection.",
        "modelAnswer": """**1. Nitric Oxide Synthesis and Diffusion:**
- Parasympathetic non-adrenergic non-cholinergic (NANC) cavernous nerve endings release **nitric oxide (NO)** via neuronal nitric oxide synthase (nNOS), while shear stress stimulates **endothelial nitric oxide synthase (eNOS)**.
- Lipophilic NO gas diffuses rapidly across cell membranes into adjacent vascular smooth muscle cells of the **helicine arterioles** and cavernous trabeculae.

**2. Activation of Soluble Guanylyl Cyclase (sGC):**
- Intracellular NO binds with high affinity to the prosthetic **heme group** of soluble guanylyl cyclase (sGC).
- This induces a conformational change that dramatically activates the enzyme, catalyzing the conversion of Guanosine Triphosphate (GTP) into **cyclic Guanosine Monophosphate (cGMP)**.

**3. Activation of Protein Kinase G (PKG) and Calcium Efflux:**
- Accumulated cGMP binds and activates **Protein Kinase G (PKG / cGK-I)**, which phosphorylates multiple regulatory transport proteins:
  1. Phosphorylates and opens **large-conductance calcium-activated potassium ($\text{BK}_{\text{Ca}}$) channels**, driving $\text{K}^+$ efflux and hyperpolarizing the plasma membrane. Hyperpolarization closes voltage-gated L-type calcium channels.
  2. Phosphorylates phospholamban, activating the **SERCA pump** to sequester free $\text{Ca}^{2+}$ into the sarcoplasmic reticulum.
  3. Activates the plasma membrane $\text{Ca}^{2+}$-ATPase pump, extruding calcium into the extracellular space.
  4. Inhibits inositol trisphosphate ($\text{IP}_3$) receptor-mediated calcium release.

**4. Smooth Muscle Relaxation:**
- The marked drop in cytosolic free calcium ($[\text{Ca}^{2+}]_i$) causes calcium to dissociate from calmodulin, inactivating Myosin Light Chain Kinase (MLCK).
- Concurrently, PKG activates **Myosin Light Chain Phosphatase (MLCP)**, dephosphorylating myosin light chains, producing smooth muscle relaxation, lacunar engorgement, and penile erection.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. NO synthesis and diffusion to smooth muscle cells (0.5 mark).
2. Activation of soluble guanylyl cyclase (sGC) generating cGMP (1.0 mark).
3. PKG activation driving potassium efflux, closing L-type Ca2+ channels, and SERCA uptake (1.0 mark).
4. Dephosphorylation of myosin light chains by MLCP producing relaxation and erection (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
PDE-5 inhibitors (sildenafil, tadalafil) prevent the enzymatic breakdown of cGMP, thereby sustaining PKG activation and prolonging corporal smooth muscle relaxation.

**Ain Shams Faculty Curriculum Highlights:**
- PKG decreases intracellular calcium and activates myosin light chain phosphatase."""
    },

    "MUG3-CH205-PATH-0142": {
        "text": "Describe the embryological origin, morphological development, and hormonal regulation of the seminal vesicles.",
        "modelAnswer": """**1. Embryological Origin:**
- The seminal vesicles develop during the **10th to 12th week of gestation** as lateral, tubular outgrowths (diverticula) from the caudal portion of the **mesonephric (Wolffian) duct**.
- Arise immediately proximal to where the mesonephric duct enters the pelvic urethra.

**2. Morphological Differentiation:**
- Driven by high local concentrations of **testosterone** secreted by fetal Leydig cells under placental hCG stimulation.
- The initially simple tubular diverticulum elongates, branches, and coils repeatedly upon itself, forming a complex, tortuous, sacculated gland invested by smooth muscle and connective tissue.
- The proximal stalk narrows to form the **excretory duct of the seminal vesicle**, which unites with the terminal ampulla of the vas deferens to form the **ejaculatory duct**.

**3. Hormonal Regulation in Adults:**
- Adult secretory function and epithelial maintenance depend strictly on circulating **androgens (testosterone and dihydrotestosterone [DHT])**.
- Androgens bind to nuclear androgen receptors in luminal epithelial cells, stimulating transcription of secretory proteins (**semenogelin I and II**) and metabolic substrates (**fructose**).
- Castration or androgen deprivation therapy triggers rapid epithelial apoptosis and marked atrophy of the seminal vesicles.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Embryological origin: Lateral diverticulum from the mesonephric (Wolffian) duct (1.0 mark).
2. Development: Branching and coiling into a sacculated gland uniting with vas to form ejaculatory duct (1.0 mark).
3. Hormonal regulation: Testosterone/DHT dependent; androgen deprivation causes glandular atrophy (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
In congenital bilateral absence of the vas deferens (CBAVD), which occurs in $>95\%$ of males with Cystic Fibrosis (*CFTR* mutations), the seminal vesicles are characteristically hypoplastic or absent, resulting in low-volume, fructose-negative azoospermic ejaculate.

**Ain Shams Faculty Curriculum Highlights:**
- Absence of fructose in semen confirms bilateral seminal vesicle or ejaculatory duct obstruction."""
    },

    "MUG3-CH205-PATH-0148": {
        "text": "Describe the clinical presentation, histology, and diagnostic serum tumor markers of testicular Yolk Sac Tumor in early childhood.",
        "modelAnswer": """**1. Clinical Presentation:**
- The **most common malignant germ cell tumor of the testis in infants and young children** (peak incidence at 16 to 18 months of age).
- Presents as a painless, firm, rapidly enlarging **unilateral testicular mass** discovered incidentally by parents during bathing or diaper changing.
- Rare presentation with testicular pain or secondary reactive hydrocele.

**2. Serum Tumor Marker (Diagnostic Hallmark):**
- Markedly elevated serum **Alpha-Fetoprotein (AFP)** (often $>1000\text{ ng/mL}$).
- Serum AFP is essential for confirming diagnosis, staging, monitoring response to orchiectomy/chemotherapy, and surveillance for relapse.
- Normal serum $\beta$-hCG (elevated hCG indicates choriocarcinoma or mixed germ cell components).

**3. Histopathological Features:**
- **Gross Pathology:** Non-encapsulated, soft, pale yellow-white, gelatinous, or mucoid lobulated mass with areas of cystic degeneration.
- **Light Microscopy (H&E):**
  - **Reticular / Microcystic Pattern:** Loose, lace-like network of cuboidal cells enclosing communicating spaces (most common architecture).
  - **Schiller-Duval Bodies (Pathognomonic Hallmark):** Glomeruloid, papillary structures consisting of a central fibrovascular capillary loop mantled by malignant embryonal cells, projecting into an amphitheater space lined by flat tumor cells.
  - **Hyaline Globules:** Prominent intracellular and extracellular eosinophilic, PAS-positive, diastase-resistant globules containing alpha-fetoprotein.
- Strongly positive for **Glypican-3** and **AFP** on immunohistochemistry.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Clinical: Painless firm unilateral testicular mass in an infant/child <3 years (0.5 mark).
2. Tumor marker: Markedly elevated Alpha-Fetoprotein (AFP) with normal hCG (1.0 mark).
3. Histology: Schiller-Duval bodies, reticular microcystic pattern, and PAS-positive hyaline globules (1.5 marks).

**Core Educational Objective & Clinical Mechanism:**
Pediatric yolk sac tumors carry an excellent prognosis (>95% overall cure rate) when treated by inguinal orchiectomy and platinum-based chemotherapy. Trans-scrotal biopsy is strictly contraindicated to prevent inguinal lymph node metastasis.

**Ain Shams Faculty Curriculum Highlights:**
- Schiller-Duval bodies are pathognomonic for yolk sac tumors."""
    },

    "MUG3-CH205-PATH-0155": {
        "text": "Describe the histological criteria that characterize well-differentiated Squamous Cell Carcinoma (SCC) of the urinary bladder.",
        "modelAnswer": """**1. Historical & Epidemiological Context:**
- In Egypt and regions endemic for urinary schistosomiasis (***Schistosoma haematobium***), Squamous Cell Carcinoma historically accounted for **60 to 75% of bladder cancer cases** (associated with chronic bilharzial cystitis and squamous metaplasia).

**2. Histopathological Diagnostic Criteria of Well-Differentiated SCC:**
- **Invasive Malignant Squamous Sheets:** Malignant epithelial cells infiltrate deeply into the lamina propria and muscularis propria (detrusor muscle) as large, cohesive, irregular nests, cords, and sheets.
- **Keratin Pearl Formation (Squamous Pearls / Epithelial Pearls):**
  - Pathognomonic hallmark of well-differentiated SCC.
  - Concentric, whorled, laminated nests of densely packed, brightly eosinophilic, anucleated **keratin flakes** located within the centers of tumor nests.
- **Intercellular Bridges (Desmosomes):**
  - Prominent, visible 'spines' bridging the intercellular spaces between adjacent tumor cells, representing magnified desmosomal junctions.
- **Individual Cell Keratinization (Dyskeratosis):**
  - Single tumor cells exhibiting intense, glassy, deep pink/red eosinophilic cytoplasm with pyknotic nuclei.
- **Nuclear Features:** Large, pleomorphic, hyperchromatic nuclei with coarse chromatin and prominent nucleoli; mitotic figures are present predominantly at the periphery of tumor nests.
- **Pure Squamous Differentiation:** Must show pure squamous morphology with **complete absence of conventional urothelial (transitional cell) or adenocarcinomatous components**.""",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Invasive architecture: Cohesive malignant epithelial nests invading lamina propria and muscularis (1.0 mark).
2. Keratin pearls (concentric laminated keratin whorls) and intercellular bridges (desmosomes) (1.0 mark).
3. Individual cell dyskeratosis and nuclear pleomorphism (0.5 mark).
4. Pure squamous differentiation without urothelial components (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
Schistosoma haematobium ova trapped in the bladder wall release soluble egg antigens that trigger chronic granulomatous inflammation, producing irritative squamous metaplasia (leukoplakia), which evolves into invasive exophytic or ulcerative squamous cell carcinoma.

**Ain Shams Faculty Curriculum Highlights:**
- Keratin pearls and intercellular bridges are diagnostic for well-differentiated squamous cell carcinoma."""
    }
}


def main():
    with open(BANK_PATH, "r", encoding="utf-8") as f:
        bank = json.load(f)

    updated_count = 0
    for ch in bank.get("chapters", []):
        if ch.get("id") == 301:
            for sub in ch.get("subjects", []):
                for q in sub.get("questions", []):
                    qid = q.get("id")
                    if qid in BATCH_C1B_REPAIRS:
                        rep = BATCH_C1B_REPAIRS[qid]
                        q["text"] = rep["text"]
                        q["modelAnswer"] = rep["modelAnswer"]
                        q["explanation"] = rep["explanation"]
                        updated_count += 1

    print(f"Total Batch C1b repairs applied: {updated_count} / {len(BATCH_C1B_REPAIRS)}")

    with open(BANK_PATH, "w", encoding="utf-8") as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)

    print(f"Successfully saved updated bank to {BANK_PATH}")


if __name__ == "__main__":
    main()

"""
ASU Medical Portal: Milestone 3 Authoritative Medical Data
Compiled from official Ain Shams University curriculum textbooks and departmental booklets.
"""

# 1. Anatomy Target Corrections (Feature 8 + Embryology)
ANATOMY_TARGETS = {
    "MUG3-CH1-ANAT-0316": {
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Anatomy of urinary bladder', p. 22-23.",
        "claim": "Parasympathetic fibers to the urinary bladder originate from pelvic splanchnic nerves (S2-S4) via the inferior hypogastric plexus to motor the detrusor muscle."
    },
    "MUG3-CH1-ANAT-0255": {
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Anatomy of ureter', p. 12-14.",
        "claim": "In the male pelvic cavity, the ureter runs inferior (below) to the vas deferens as it approaches the bladder base ('water under the bridge')."
    },
    "MUG3-CH1-ANAT-0313": {
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Anatomy of the kidneys', p. 8-9.",
        "claim": "The autonomic nerves supplying the kidney and suprarenal gland are derived from the celiac plexus and abdominothoracic splanchnic nerves."
    },
    "MUG3-CH1-ANAT-0301": {
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Anatomy of urinary bladder', p. 18-19.",
        "claim": "The interureteric fold (crista interureterica) connects the two ureteric orifices and serves as the visual anatomical landmark to find them."
    },
    "MUG3-CH1-ANAT-0287": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, p. 25-27 and Part 2, p. 10-15.",
        "claim": "The external urethral sphincter is composed of voluntary skeletal muscle innervated by the perineal branch of the pudendal nerve (S2-S4)."
    },
    "MUG3-CH1-ANAT-0324": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Development of urinary system', p. 99.",
        "claim": "Renal glomeruli and nephrons develop from the metanephric blastema, while the collecting duct system derives from the ureteric bud."
    }
}

# 2. Histology Male & Female Booklet Corrections (Q1-15 Male, Q1-10 Female)
HISTOLOGY_BOOKLET_MALE_FEMALE = {
    "MUG3-CH2-HIST-0176": {"correctIndex": 3, "claim": "Crossing over occurs during pachytene of prophase of the 1st meiotic division."},
    "MUG3-CH2-HIST-0177": {"correctIndex": 0, "claim": "Manchettes are transient microtubular sheaths formed during the acrosomal phase of spermiogenesis."},
    "MUG3-CH2-HIST-0178": {"correctIndex": 3, "claim": "Primary spermatocytes are the largest spermatogenic cells and frequently seen in histological sections; secondary spermatocytes are rarely seen."},
    "MUG3-CH2-HIST-0179": {"correctIndex": 1, "claim": "The sperm middle piece core is formed by 9 doublets and 2 central singlets of microtubules, NOT microfilaments."},
    "MUG3-CH2-HIST-0180": {"correctIndex": 3, "claim": "Testosterone is synthesized and secreted by interstitial Leydig cells, NOT Sertoli cells."},
    "MUG3-CH2-HIST-0181": {"correctIndex": 2, "claim": "Blood-testis barrier tight junctions separate the basal compartment (spermatogonia) from the adluminal compartment (spermatocytes and spermatids)."},
    "MUG3-CH2-HIST-0182": {"correctIndex": 1, "claim": "Interstitial Leydig cells are characterized by Reinke crystals, abundant smooth ER, and luteinizing hormone (LH) regulation."},
    "MUG3-CH2-HIST-0183": {"correctIndex": 1, "claim": "Testicular Leydig cell tumors secrete excess testosterone, producing precocious puberty in young boys."},
    "MUG3-CH2-HIST-0184": {"correctIndex": 4, "claim": "Epididymis is an extratesticular duct lined by pseudostratified columnar epithelium with non-motile stereocilia, not motile cilia."},
    "MUG3-CH2-HIST-0185": {"correctIndex": 2, "claim": "Epididymis is lined by pseudostratified columnar epithelium with long non-motile stereocilia, NOT motile cilia."},
    "MUG3-CH2-HIST-0186": {"correctIndex": 3, "claim": "Epididymis is situated on the posterior surface of the testis in the scrotum, NOT inside the spermatic cord."},
    "MUG3-CH2-HIST-0187": {"correctIndex": 3, "claim": "Benign prostatic hyperplasia (BPH) arises from transitional and periurethral mucosal/submucosal acini; main acini in the peripheral zone give rise to carcinoma."},
    "MUG3-CH2-HIST-0188": {"correctIndex": 2, "claim": "Bulbourethral (Cowper) gland ducts pierce the perineal membrane to open into the beginning of the penile (spongy) urethra."},
    "MUG3-CH2-HIST-0189": {"correctIndex": 1, "claim": "Normal semen contains 20-100 million sperms/mL; counts below 1 million/mL represent severe oligospermia/azoospermia."},
    "MUG3-CH2-HIST-0190": {"correctIndex": 1, "claim": "Dark type A spermatogonia serve as reserve stem cells for the spermatogenic epithelium."},
    "MUG3-CH2-HIST-0191": {"correctIndex": 3, "claim": "At birth, each ovary contains approximately 700,000 to 1,000,000 primordial follicles, not 250,000."},
    "MUG3-CH2-HIST-0192": {"correctIndex": 2, "claim": "Early follicular growth to multilaminar primary follicles is gonadotropin-independent and regulated by local factors including activins."},
    "MUG3-CH2-HIST-0193": {"correctIndex": 2, "claim": "Secondary (antral) follicles are characterized by antrum formation and differentiation of the surrounding stroma into theca interna and externa."},
    "MUG3-CH2-HIST-0194": {"correctIndex": 1, "claim": "LH surge triggers ovulation via follicular fluid transudation, collagenase activation, and vascular hyperemia."},
    "MUG3-CH2-HIST-0195": {"correctIndex": 2, "claim": "Peg cells of the fallopian tube secrete nutrient-rich fluid that supports the ovum and facilitates sperm capacitation."},
    "MUG3-CH2-HIST-0196": {"correctIndex": 3, "claim": "Fallopian tube mucosal cilia beat toward the uterus to transport the ovum/zygote, NOT toward the ovary."},
    "MUG3-CH2-HIST-0197": {"correctIndex": 0, "claim": "The functional zone (stratum functionale) of the endometrium is supplied by spiral arteries and shed during menstruation."},
    "MUG3-CH2-HIST-0198": {"correctIndex": 2, "claim": "The menstrual/endometrial cycle clinically begins on Day 1 with the menstrual phase."},
    "MUG3-CH2-HIST-0199": {"correctIndex": 2, "claim": "The uterine cervix wall is composed predominantly (85-90%) of dense collagenous connective tissue, unlike the muscular corpus."},
    "MUG3-CH2-HIST-0200": {"correctIndex": 1, "claim": "Vaginal mucosa has no glands; lubrication occurs via capillary transudation and cervical mucus."}
}

# 3. Histology Negative MCQs
HISTOLOGY_NEGATIVE_CORRECTIONS = {
    "MUG3-CH2-HIST-0537": {"correctIndex": 2, "claim": "Renal glomerular capillaries are fenestrated without diaphragms to permit high-volume ultrafiltration."},
    "MUG3-CH2-HIST-0538": {"correctIndex": 1, "claim": "Podocytes attach to glomerular capillary basement membranes via secondary foot processes (pedicels)."},
    "MUG3-CH2-HIST-0251": {"correctIndex": 3, "claim": "Androgen-binding protein (ABP) synthesis by Sertoli cells is stimulated by FSH, NOT LH."},
    "MUG3-CH2-HIST-0147": {"correctIndex": 2, "claim": "Sertoli cells have an extremely well-developed cytoskeleton of microfilaments and microtubules that supports developing germ cells."},
    "MUG3-CH2-HIST-0533": {"correctIndex": 4, "claim": "Filtration slits are located between secondary pedicels, NOT between primary major processes."},
    "MUG3-CH2-HIST-0542": {"correctIndex": 2, "claim": "Intercalated cells participate in acid-base regulation (H+/HCO3- transport) and do not express aquaporin water channels."},
    "MUG3-CH2-HIST-0546": {"correctIndex": 3, "claim": "Juxtaglomerular granular cells communicate with macula densa and lacis cells via gap junctions, not tight junctions."},
    "MUG3-CH2-HIST-0211": {"correctIndex": 2, "claim": "Macula densa cells possess an extremely thin or absent basement membrane to permit direct signaling to JG cells."},
    "MUG3-CH2-HIST-0344": {"correctIndex": 0, "claim": "Proximal convoluted tubule (PCT) cells are distinguished by a prominent, dense apical brush border of microvilli."},
    "MUG3-CH2-HIST-0359": {"correctIndex": 2, "claim": "Ducts of Bellini (papillary ducts) are located exclusively in the inner renal medulla and papilla, not the cortex."},
    "MUG3-CH2-HIST-0399": {"correctIndex": 0, "claim": "Distal convoluted tubule (DCT) cells lack apical cilia and possess only short, sparse microvilli without a brush border."},
    "MUG3-CH2-HIST-0530": {"correctIndex": 3, "claim": "Collecting tubules develop embryologically from the ureteric bud and are not part of the nephron proper."},
    "MUG3-CH2-HIST-0260": {"correctIndex": 2, "claim": "Priapism involves sustained relaxation of cavernous trabecular smooth muscle, failure of detumescence, and absent intrinsic smooth muscle tone."}
}

# 4. Anatomy Negative MCQs (77 verified non-booklet items)
ANATOMY_NEGATIVE_CORRECTIONS = {
    "MUG3-CH1-ANAT-0234": {"correctIndex": 0, "claim": "A normal adult kidney weighs approximately 130-150 grams; 340 grams represents severe pathological enlargement."},
    "MUG3-CH1-ANAT-0241": {"correctIndex": 4, "claim": "The duodenojejunal flexure is related to the anterior surface of the left kidney, not the right kidney."},
    "MUG3-CH1-ANAT-0547": {"correctIndex": 3, "claim": "At the renal hilum, structures are arranged from anterior to posterior as Vein, Artery, Pelvis (V-A-P)."},
    "MUG3-CH1-ANAT-0246": {"correctIndex": 0, "claim": "Perinephric fat immediately surrounds the renal capsule and is enveloped by the renal fascia (Gerota's fascia)."},
    "MUG3-CH1-ANAT-0247": {"correctIndex": 1, "claim": "The ureter runs posterior (under) to the vas deferens in the male pelvis ('water under the bridge')."},
    "MUG3-CH1-ANAT-0248": {"correctIndex": 2, "claim": "The ureter is approximately 25 cm (10 inches) long, not 45 cm."},
    "MUG3-CH1-ANAT-0574": {"correctIndex": 4, "claim": "The ureter runs anterior to the genitofemoral nerve and psoas major, not behind it."},
    "MUG3-CH1-ANAT-0265": {"correctIndex": 3, "claim": "The trigone of the bladder is bounded by the two ureteric orifices posterolaterally and the internal urethral orifice anteroinferiorly."},
    "MUG3-CH1-ANAT-0268": {"correctIndex": 0, "claim": "The trigone mucosa is firmly adherent to the underlying muscular layer and remains smooth in both distended and empty states."},
    "MUG3-CH1-ANAT-0276": {"correctIndex": 4, "claim": "The male urethra is divided into three anatomical parts: prostatic, membranous, and spongy (cavernous/bulbar)."},
    "MUG3-CH1-ANAT-0603": {"correctIndex": 3, "claim": "The male urethra measures approximately 20 cm in length, presenting two normal physiological curvatures (infrabubic and prepubic)."},
    "MUG3-CH1-ANAT-0607": {"correctIndex": 2, "claim": "Prostatic sinuses lie on either side of the seminal colliculus (verumontanum) and receive the openings of the prostatic ducts."},
    "MUG3-CH1-ANAT-0281": {"correctIndex": 3, "claim": "Middle suprarenal arteries arise directly from the abdominal aorta at the level of the celiac trunk / SMA."},
    "MUG3-CH1-ANAT-0283": {"correctIndex": 2, "claim": "The inferior suprarenal artery is a direct branch of the renal artery, not the abdominal aorta."},
    "MUG3-CH1-ANAT-0284": {"correctIndex": 0, "claim": "The left gonadal (testicular/ovarian) vein drains directly into the left renal vein on the left side and does not cross the midline."},
    "MUG3-CH1-ANAT-0289": {"correctIndex": 0, "claim": "The body of the pancreas is related to the left kidney, while the right kidney is related to the liver, duodenum, and right colic flexure."},
    "MUG3-CH1-ANAT-0290": {"correctIndex": 2, "claim": "Posterior relations of the kidney include psoas major, quadratus lumborum, transversus abdominis, and diaphragm; internal oblique is more anterior/superficial."},
    "MUG3-CH1-ANAT-0621": {"correctIndex": 3, "claim": "The ureter receives blood supply from the renal, gonadal, abdominal aorta, and iliac arteries, but NOT the splenic artery."},
    "MUG3-CH1-ANAT-0622": {"correctIndex": 3, "claim": "The muscular wall of the urinary bladder is pierced obliquely by the ureters, forming a physiological one-way flap valve."},
    "MUG3-CH1-ANAT-0299": {"correctIndex": 4, "claim": "The pancreas (body and tail) lies anterior to the left kidney, not the right kidney."},
    "MUG3-CH1-ANAT-0626": {"correctIndex": 4, "claim": "The second part of the duodenum is an anterior relation of the right kidney, not the left kidney."},
    "MUG3-CH1-ANAT-0628": {"correctIndex": 3, "claim": "In females, the pelvic part of the ureter passes lateral to the vaginal fornix and is crossed superiorly by the uterine artery."},
    "MUG3-CH1-ANAT-0303": {"correctIndex": 2, "claim": "The spongy urethra traverses the corpus spongiosum, NOT the corpus cavernosum."},
    "MUG3-CH1-ANAT-0305": {"correctIndex": 3, "claim": "The adrenal (suprarenal) gland is an endocrine organ, not an anatomical component of the urinary drainage tract."},
    "MUG3-CH1-ANAT-0307": {"correctIndex": 3, "claim": "The kidneys are positioned retroperitoneally between T12 and L3 vertebral levels, not between L3 and L5."},
    "MUG3-CH1-ANAT-0308": {"correctIndex": 1, "claim": "The male urethra possesses two sphincters: the involuntary internal sphincter at the bladder neck and the voluntary external sphincter in the deep perineal pouch."},
    "MUG3-CH1-ANAT-0310": {"correctIndex": 3, "claim": "The second part of the duodenum is an anterior relation of the right kidney, not a posterior relation."},
    "MUG3-CH1-ANAT-0637": {"correctIndex": 4, "claim": "Renal pyramids are located in the renal medulla, not inside the renal hilum or sinus."},
    "MUG3-CH1-ANAT-0638": {"correctIndex": 2, "claim": "Ureters are thick-walled muscular tubes that convey urine via active peristaltic contractions, not passive fibrous conduits."},
    "MUG3-CH1-ANAT-0323": {"correctIndex": 3, "claim": "The urinary bladder epithelium (except trigone) derives from the vesicourethral canal of the endodermal urogenital sinus."},
    "MUG3-CH1-ANAT-0779": {"correctIndex": 0, "claim": "A normal adult kidney weighs about 130-150 grams; 340 grams represents severe hydronephrosis or tumor."},
    "MUG3-CH1-ANAT-0416": {"correctIndex": 2, "claim": "The ureter passes posterior (under) to the vas deferens, not over it."},
    "MUG3-CH1-ANAT-0417": {"correctIndex": 1, "claim": "The ureter is 25 cm long, not 45 cm."},
    "MUG3-CH1-ANAT-0801": {"correctIndex": 2, "claim": "The ureter is divided into abdominal, pelvic, and intramural parts; it has no membranous part (which is part of the urethra)."},
    "MUG3-CH1-ANAT-0431": {"correctIndex": 4, "claim": "The fundus (base) is the posterior surface of the bladder; the lowest, most fixed part is the bladder neck."},
    "MUG3-CH1-ANAT-0435": {"correctIndex": 0, "claim": "The left renal vein lies high at the transpyloric plane (L1) and is not vulnerable to injury just above the pelvic brim."},
    "MUG3-CH1-ANAT-0437": {"correctIndex": 0, "claim": "In females, the posterior surface of the bladder is separated from the rectum by the uterus and upper vagina."},
    "MUG3-CH1-ANAT-0836": {"correctIndex": 0, "claim": "The prostatic urethra is the widest and most dilatable portion of the male urethra."},
    "MUG3-CH1-ANAT-0441": {"correctIndex": 2, "claim": "The male urethra measures 20 cm in length, not 16 cm."},
    "MUG3-CH1-ANAT-0856": {"correctIndex": 3, "claim": "The uncinate process of the pancreas lies anterior to the abdominal aorta (and posterior to the superior mesenteric vessels)."},
    "MUG3-CH1-ANAT-0449": {"correctIndex": 1, "claim": "The abdominal aorta lies to the left of the inferior vena cava throughout its abdominal course."},
    "MUG3-CH1-ANAT-0555": {"correctIndex": 4, "claim": "Kidneys are retroperitoneal; peritoneum covers only their anterior aspect and is not an intrinsic renal capsule/fascial covering."},
    "MUG3-CH1-ANAT-0556": {"correctIndex": 0, "claim": "The hilum of the left kidney lies higher (around L1) than that of the right kidney (around L1-L2) due to hepatic bulk on the right."},
    "MUG3-CH1-ANAT-0577": {"correctIndex": 1, "claim": "The ureters are approximately 25 cm long with half in the abdomen and half in the pelvis, passing obliquely into the bladder."},
    "MUG3-CH1-ANAT-0608": {"correctIndex": 0, "claim": "The inferior mesenteric artery arises from the aorta at L3; superior mesenteric at L1; celiac trunk at T12."},
    "MUG3-CH1-ANAT-0704": {"correctIndex": 3, "claim": "Straddle injuries to the perineum crush the bulbous/spongy urethra against the pubic arch."},
    "MUG3-CH1-ANAT-0711": {"correctIndex": 4, "claim": "The scrotum is innervated by ilioinguinal, genitofemoral, pudendal, and posterior femoral cutaneous nerves, but NOT the obturator nerve."},
    "MUG3-CH1-ANAT-0723": {"correctIndex": 3, "claim": "The supravaginal cervix is related anteriorly to the bladder, laterally to the ureter and uterine artery, and posteriorly to the pouch of Douglas."},
    "MUG3-CH1-ANAT-0737": {"correctIndex": 2, "claim": "The normal uterus is mobile and changes position with filling of the bladder and rectum."},
    "MUG3-CH1-ANAT-0751": {"correctIndex": 4, "claim": "The breast is supplied by lateral thoracic, internal thoracic, thoracoacromial, and posterior intercostals; no costoclavicular artery exists."},
    "MUG3-CH1-ANAT-0795": {"correctIndex": 0, "claim": "The left kidney is higher than the right kidney; its hilum lies near the transpyloric plane (L1)."},
    "MUG3-CH1-ANAT-0796": {"correctIndex": 1, "claim": "The ureter passes posterior (below) to the vas deferens, not over it."},
    "MUG3-CH1-ANAT-0829": {"correctIndex": 0, "claim": "The mucous membrane of the trigone is tightly bound to the muscular coat, preventing folding."},
    "MUG3-CH1-ANAT-0869": {"correctIndex": 1, "claim": "The cranial remnant of the paramesonephric (Mullerian) duct in the male is the appendix testis."},
    "MUG3-CH1-ANAT-0877": {"correctIndex": 0, "claim": "The vaginal fornices are recess spaces formed around the protruding vaginal portion of the uterine cervix."},
    "MUG3-CH1-ANAT-0901": {"correctIndex": 4, "claim": "The superior rectal artery is the terminal continuation of the inferior mesenteric artery, NOT a branch of the internal iliac."},
    "MUG3-CH1-ANAT-0903": {"correctIndex": 1, "claim": "The iliolumbar artery arises from the posterior division of the internal iliac artery, along with lateral sacral and superior gluteal."},
    "MUG3-CH1-ANAT-0930": {"correctIndex": 4, "claim": "The ischiorectal fossa has no anatomical roof; its apex forms where the levator ani meets the obturator internus fascia."},
    "MUG3-CH1-ANAT-0936": {"correctIndex": 3, "claim": "At the base of the bladder, the vas deferens runs medial to the seminal vesicle, expanding into the ampulla."},
    "MUG3-CH1-ANAT-0937": {"correctIndex": 1, "claim": "The vas deferens begins at the tail (cauda) of the epididymis, not the head."},
    "MUG3-CH1-ANAT-0948": {"correctIndex": 3, "claim": "The glans penis is the distal conical expansion of the corpus spongiosum, NOT the corpora cavernosa."},
    "MUG3-CH1-ANAT-0964": {"correctIndex": 0, "claim": "The median sacral vein drains into the left common iliac vein, not into the internal iliac vein."},
    "MUG3-CH1-ANAT-0984": {"correctIndex": 3, "claim": "The adrenal gland is an independent endocrine gland, not part of the urinary tract."},
    "MUG3-CH1-ANAT-0996": {"correctIndex": 0, "claim": "The ureters pierce the bladder wall obliquely, which compresses their lumina during bladder filling to prevent vesicoureteral reflux."},
    "MUG3-CH1-ANAT-0999": {"correctIndex": 2, "claim": "Ureteric arterial supply derives from renal, aortic, testicular/ovarian, and iliac vessels, not the splenic artery."},
    "MUG3-CH1-ANAT-1003": {"correctIndex": 2, "claim": "The obturator nerve supplies medial compartment thigh adductors and does not contribute to scrotal sensory innervation."},
    "MUG3-CH1-ANAT-1015": {"correctIndex": 0, "claim": "The inferior vena cava lies anterior and medial on the right vertebral column, far away from a posterior lumbar kidney approach."},
    "MUG3-CH3-PHYS-0315": {"correctIndex": 1, "claim": "Kidney coverings consist of fibrous capsule, perirenal fat, renal fascia, and pararenal fat; thoracolumbar fascia covers trunk muscles."},
    "MUG3-CH3-PHYS-0313": {"correctIndex": 0, "claim": "The body of the pancreas is an anterior relation of the left kidney, not the right kidney."},
    "MUG3-CH3-PHYS-0316": {"correctIndex": 3, "claim": "The 2nd part of the duodenum is an anterior relation of the right kidney, not a posterior relation."},
    "MUG3-CH3-PHYS-0319": {"correctIndex": 2, "claim": "The male urethra has two sphincters: internal involuntary sphincter and external voluntary sphincter."},
    "MUG3-CH3-PHYS-0322": {"correctIndex": 0, "claim": "As the bladder distends with urine, its superior surface rises out of the true pelvis into the abdominal cavity."},
    "MUG3-CH3-PHYS-0329": {"correctIndex": 3, "claim": "The splenic artery supplies the spleen, stomach, and pancreas, not the ureter."},
    "MUG3-CH3-PHYS-0331": {"correctIndex": 4, "claim": "The kidneys normally extend from the level of the 12th thoracic vertebra to the 3rd lumbar vertebra."},
    "MUG3-CH3-PHYS-0335": {"correctIndex": 3, "claim": "The gubernaculum is an embryonic structure; its adult remnants are the scrotal ligament in males and round ligament in females."},
    "MUG3-CH3-PHYS-0348": {"correctIndex": 2, "claim": "The right kidney is related anteriorly to the 2nd (descending) part of the duodenum, NOT the 3rd (horizontal) part."},
    "MUG3-CH3-PHYS-0349": {"correctIndex": 4, "claim": "The left kidney is related anteriorly to the body and tail of the pancreas, NOT the head (which lies in the duodenal C-loop)." }
}

# 5. Biochemistry Issues & Errors (15 items)
BIOCHEM_CORRECTIONS = {
    "MUG3-CH4-BIOC-0112": {
        "text": "Cystinosis is due to a defect in the transport of cystine across which cellular structure?",
        "options": ["Mitochondrial membrane", "Cell membrane", "Lysosomal membrane", "Proximal tubular brush border"],
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Inherited renal diseases', pp. 147-149.",
        "claim": "Cystinosis is an autosomal recessive lysosomal storage disease caused by mutations in CTNS, impairing cystine efflux across the lysosomal membrane."
    },
    "MUG3-CH4-BIOC-0113": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Amino acid metabolism', pp. 85-92.",
        "claim": "Cystinuria involves defective renal and intestinal dibasic amino acid transport (COLA: Cystine, Ornithine, Lysine, Arginine). Methionine is a neutral amino acid and is absorbed normally."
    },
    "MUG3-CH4-BIOC-0114": {
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Functions of proximal convoluted tubule', pp. 108-118.",
        "claim": "Fanconi syndrome is a generalized defect of proximal tubular reabsorption causing glucosuria, phosphaturia, generalized aminoaciduria, and bicarbonate loss, not isolated basic aminoaciduria."
    },
    "MUG3-CH4-BIOC-0115": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Renal clearance & metabolism', pp. 74-84.",
        "claim": "Renal glucosuria is characterized by benign excretion of glucose in the urine despite normal or low blood glucose concentrations due to reduced SGLT2 transport threshold."
    },
    "MUG3-CH4-BIOC-0272": {
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 147-149.",
        "claim": "Cystinosis results from defective cystinosin transport across the lysosomal membrane, leading to intralysosomal cystine crystal deposition."
    },
    "MUG3-CH4-BIOC-0288": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Renal metabolism', pp. 79-84.",
        "claim": "Because of low vascularity and low tissue pO2, the renal medulla relies primarily on anaerobic glycolysis of glucose to lactate, whereas the cortex oxidizes fatty acids."
    },
    "MUG3-CH4-BIOC-0293": {
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Function of kidney', pp. 53-57.",
        "claim": "The kidney synthesizes renin, erythropoietin, and prostaglandins, and activates vitamin D (1-alpha-hydroxylase)."
    },
    "MUG3-CH4-BIOC-0294": {
        "text": "Vitamin D-dependent rickets type I is due to deficiency of which enzyme?",
        "options": ["1-alpha-Hydroxylase (CYP27B1)", "25-Hydroxylase (CYP2R1)", "24,25-Hydroxylase (CYP24A1)", "7-Dehydrocholesterol reductase"],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Renal metabolism', pp. 79-84.",
        "claim": "Vitamin D-dependent rickets type I is caused by inactivating mutations in renal 25-hydroxyvitamin D 1-alpha-hydroxylase (CYP27B1)."
    },
    "MUG3-CH4-BIOC-0295": {
        "text": "About Meister Cycle:",
        "options": [
            "Gamma GT enzyme is a mitochondrial enzyme",
            "Need 5 ATPs.",
            "Need carnitine for amino acids absorption",
            "Glutathione is synthesized from glutamic acid, cysteine & glycine"
        ],
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Amino acid metabolism', pp. 85-92.",
        "claim": "In the gamma-glutamyl (Meister) cycle, glutathione is a tripeptide synthesized from glutamate, cysteine, and glycine via two ATP-dependent enzymatic reactions."
    },
    "MUG3-CH4-BIOC-0305": {
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 85-92.",
        "claim": "Transamination of aspartate via aspartate aminotransferase (AST) directly yields oxaloacetate, an essential Krebs cycle intermediate."
    },
    "MUG3-CH4-BIOC-0351": {
        "text": "All of the following are true about 21-alpha hydroxylase deficiency EXCEPT:",
        "options": [
            "Hypotension & hyperkalemia",
            "Increase androgen hormones",
            "Increase ACTH & hyperpigmentation",
            "Increase aldosterone"
        ],
        "correctIndex": 3,
        "evidence": "Copy of steroid QUIZ.pdf, p. 3, Q4-15; Ain Shams Urogenital Textbook Part 1, pp. 150-156.",
        "claim": "21-hydroxylase deficiency blocks conversion of progesterone to 11-deoxycorticosterone, causing aldosterone deficiency (decreased aldosterone), hypotension, and hyperkalemia."
    },
    "MUG3-CH4-BIOC-0354": {
        "correctIndex": 1,
        "evidence": "Copy of steroid QUIZ.pdf, p. 2, Q9; Ain Shams Urogenital Textbook Part 1, 'Steroid hormone synthesis', pp. 150-156.",
        "claim": "The rate-limiting and initial step in steroid hormone biosynthesis is the conversion of cholesterol to pregnenolone catalyzed by CYP11A1 (cholesterol desmolase)."
    },
    "MUG3-CH4-BIOC-0373": {
        "text": "The relationship between GFR and serum creatinine concentration is:",
        "options": ["Direct", "Inverse", "Linear", "Exponentially independent"],
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Renal clearance', pp. 74-78.",
        "claim": "Serum creatinine concentration exhibits an inverse hyperbolic relationship with glomerular filtration rate (GFR); when GFR halves, serum creatinine approximately doubles."
    },
    "MUG3-CH4-BIOC-0382": {
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Renal metabolism', pp. 79-84.",
        "claim": "Recurrent gouty arthritis with tophi is prevented by allopurinol and febuxostat, which inhibit xanthine oxidase and block uric acid synthesis."
    },
    "MUG3-CH4-BIOC-0424": {
        "text": "Which one of the following amino acids can be converted to NAD+ (nicotinamide adenine dinucleotide)?",
        "options": ["Lysine and methionine", "Tryptophan", "Proline", "Glutamate"],
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 85-92.",
        "claim": "Tryptophan serves as the dietary precursor for the de novo synthesis of nicotinic acid / NAD+ (60 mg dietary tryptophan generates 1 mg niacin equivalent)."
    }
}

# 6. Sanitize Biochemistry Essay Leaks
BIOCHEM_ESSAY_LEAKS = {
    "MUG3-CH4-BIOC-0012": {
        "text": "Mention the number of ATPs needed in the gamma-glutamyl (Meister) cycle.",
        "modelAnswer": "The gamma-glutamyl (Meister) cycle requires 3 ATP molecules for the transport of one amino acid across the cell membrane and resynthesis of glutathione: 1 ATP for gamma-glutamylcysteine synthetase, 1 ATP for glutathione synthetase, and 1 ATP for 5-oxoprolinase."
    },
    "MUG3-CH4-BIOC-0016": {
        "text": "Mention the primary anatomical sites of L-carnitine synthesis in the human body.",
        "modelAnswer": "L-carnitine is synthesized primarily in the liver and kidneys (and brain). Tissues with high fatty acid oxidation requirements, such as skeletal and cardiac muscle, depend on carnitine uptake from the bloodstream via organic cation transporters."
    },
    "MUG3-CH4-BIOC-0017": {
        "text": "List the precursor amino acids and cofactors required for L-carnitine synthesis.",
        "modelAnswer": "L-carnitine is synthesized from two amino acids: Lysine (which provides the carbon backbone via protein trimethyllysine) and Methionine (which provides the methyl groups via S-adenosylmethionine [SAM]). Essential cofactors include vitamin C, ferrous iron (Fe2+), vitamin B6, and niacin."
    }
}

# 7. Misplaced Histology Questions in Chapter 4 to Re-route to Chapter 2
HISTOLOGY_REROUTE_IDS = {
    "MUG3-CH4-BIOC-0416": 5,   # Ureter & Bladder
    "MUG3-CH4-BIOC-0417": 1,   # Glomerulus & Capillaries
    "MUG3-CH4-BIOC-0419": 10,  # Cervix & Vagina
    "MUG3-CH4-BIOC-0420": 7,   # Penis & Ducts
    "MUG3-CH4-BIOC-0421": 7,   # Epididymis & Ducts
    "MUG3-CH4-BIOC-0422": 6,   # Testis & Spermatogenesis
    "MUG3-CH4-BIOC-0423": 6    # Testis & Spermatogenesis
}

# 8. Explorer 3 High-Yield Medical Adjudications (Pathology, Pharma, Micro, Finals)
EXPLORER3_CORRECTIONS = {
    "MUG3-CH5-PATH-0491": {
        "correctIndex": 3,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 54, Q1120; Robbins Basic Pathology 10th Ed, Ch 20, p. 540.",
        "claim": "Autosomal dominant polycystic kidney disease (ADPKD) cysts originate from isolated segments of nephrons and do NOT communicate with the renal pelvis."
    },
    "MUG3-CH5-PATH-0496": {
        "options": [
            "Bilateral hydronephrosis.",
            "Bilateral pyonephrosis.",
            "Renal tuberculosis.",
            "Amyloidosis.",
            "Chronic glomerulonephritis."
        ],
        "correctIndex": 3,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 55, Q1261; Robbins Basic Pathology 10th Ed, Ch 20.",
        "claim": "Chronic pulmonary tuberculosis causes secondary systemic (AA) amyloidosis presenting clinically with nephrotic syndrome and progressive renal failure."
    },
    "MUG3-CH5-PATH-3113": {
        "correctIndex": 3,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 55, Q1273; Robbins Basic Pathology 10th Ed, Ch 18, p. 692.",
        "claim": "Seminoma is exquisitely radiosensitive; radiotherapy achieves >95% cure rates in early-stage disease."
    },
    "MUG3-CH5-PATH-0330": {
        "correctIndex": 3,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 55; Robbins Basic Pathology 10th Ed, Ch 18.",
        "claim": "Seminoma is highly sensitive to ionizing radiation (radiosensitive) and rarely presents before puberty."
    },
    "MUG3-CH5-PATH-1602": {
        "correctIndex": 3,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 56, Q1372; Robbins Basic Pathology 10th Ed, Ch 18, p. 694.",
        "claim": "Schiller-Duval bodies (perivascular glomeruloid structures) are pathognomonic histological features of Yolk Sac (endodermal sinus) tumor."
    },
    "MUG3-CH5-PATH-0654": {
        "correctIndex": 3,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 55, Q1283; Ain Shams Urogenital Textbook Part 2, p. 198.",
        "claim": "In puerperal sepsis, the postpartum uterus is soft, enlarged, congested, and subinvoluted, NOT atrophic and firm."
    },
    "MUG3-CH5-PATH-2413": {
        "correctIndex": 1,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 54, Q1121; Robbins Basic Pathology 10th Ed, Ch 20, p. 542.",
        "claim": "Acute post-infectious glomerulonephritis characteristically follows infection with nephritogenic strains of Group A beta-hemolytic Streptococcus (Streptococcus pyogenes / haemolyticus)."
    },
    "MUG3-CH5-PATH-0298": {
        "correctIndex": 2,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 544; Ain Shams Urogenital Textbook Part 1, p. 115.",
        "claim": "Membranous nephropathy characteristically presents with nephrotic syndrome manifest by heavy albuminuria/proteinuria (>3.5 g/24 hr) and normal RBC morphology."
    },
    "MUG3-CH5-PATH-0231": {
        "text": "A 60-year-old male with adenocarcinoma of the lung presents with malaise, 4+ proteinuria, and a renal biopsy showing granular IgG and C3 deposition along the basement membrane. He is most likely to have:",
        "options": [
            "Rapidly progressive glomerulonephritis",
            "Membranous glomerulonephritis",
            "Nodular glomerulosclerosis",
            "Goodpasture syndrome",
            "Membranoproliferative glomerulonephritis"
        ],
        "correctIndex": 1,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 545; Ain Shams Urogenital Textbook Part 1, p. 229.",
        "claim": "Carcinoma-associated nephrotic syndrome with subepithelial granular IgG and C3 immune complexes represents secondary Membranous Glomerulonephritis."
    },
    "MUG3-CH5-PATH-3601": {
        "correctIndex": 1,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 543; Nelson Textbook of Pediatrics.",
        "claim": "Minimal change disease in pediatric patients presents with massive selective proteinuria (>3.5 g/24 hr) with normal urinary sediment (negative nitrites)."
    },
    "MUG3-CH5-PATH-0369": {
        "correctIndex": 3,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 55, Q1266; Robbins Basic Pathology 10th Ed, Ch 20, p. 568.",
        "claim": "Sarcoma botryoides (embryonal rhabdomyosarcoma) is the most common malignant mesenchymal bladder neoplasm in infants and children under 5."
    },
    "MUG3-CH5-PATH-1969": {
        "correctIndex": 3,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 567; Ain Shams Urogenital Textbook Part 1, p. 258.",
        "claim": "Cigarette smoking is the most important established risk factor for urothelial (transitional cell) bladder carcinoma (3- to 5-fold increased risk)."
    },
    "MUG3-CH5-PATH-3610": {
        "correctIndex": 3,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 567.",
        "claim": "Cigarette smoking is the primary environmental risk factor for urothelial carcinoma of the bladder."
    },
    "MUG3-CH5-PATH-3614": {
        "correctIndex": 0,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 562; Ain Shams Urogenital Textbook Part 1, p. 250.",
        "claim": "Clear cell renal cell carcinoma is specifically associated with somatic or germline deletion/loss of chromosome 3p involving the VHL tumor suppressor gene."
    },
    "MUG3-CH5-PATH-0395": {
        "correctIndex": 3,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 55, Q1267; Robbins Basic Pathology 10th Ed, Ch 20, p. 565.",
        "claim": "Wilms tumor (nephroblastoma) is the classic primary pediatric renal tumor presenting as a large palpable abdominal mass in children aged 2-5 years."
    },
    "MUG3-CH5-PATH-2324": {
        "correctIndex": 3,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 55, Q1267.",
        "claim": "Wilms tumor is the primary pediatric renal neoplasm presenting with an asymptomatic flank mass."
    },
    "MUG3-CH5-PATH-2202": {
        "correctIndex": 3,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 565.",
        "claim": "Palpable pediatric renal mass in a toddler is classic for Wilms tumor (nephroblastoma)."
    },
    "MUG3-CH5-PATH-3155": {
        "correctIndex": 3,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 565.",
        "claim": "Wilms tumor presents as a large, well-circumscribed, solid solitary flank mass in young children."
    },
    "MUG3-CH5-PATH-2391": {
        "correctIndex": 3,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 565.",
        "claim": "Wilms tumor accounts for >95% of renal tumors in children aged 1-5 years; renal cell carcinoma is extremely rare in this age bracket."
    },
    "MUG3-CH5-PATH-3094": {
        "correctIndex": 3,
        "evidence": "Ain Shams Urogenital Textbook Part 1, p. 257.",
        "claim": "Nephroblastoma is eponymously known as Wilms tumor."
    },
    "MUG3-CH5-PATH-0299": {
        "correctIndex": 0,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 566; Dr. Thanaa Helal Pathology Booklet, p. 55.",
        "claim": "Michaelis-Gutmann calcospherite bodies within von Hansemann histiocytes are pathognomonic of malakoplakia."
    },
    "MUG3-CH5-PATH-0371": {
        "correctIndex": 1,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 18 & 19.",
        "claim": "Ovarian dysgerminoma peaks in the second and third decades (20s), whereas testicular seminoma peaks in the fourth decade (35-45 years)."
    },
    "MUG3-CH5-PATH-0493": {
        "text": "Predisposing factors to pyelonephritis include all of the following EXCEPT:",
        "options": [
            "Urinary tract instrumentation",
            "Urinary tract obstruction",
            "Diabetes mellitus",
            "Pregnancy",
            "Hypertension"
        ],
        "correctIndex": 4,
        "evidence": "Dr. Thanaa Helal Pathology Booklet, p. 54, Q1126; Robbins Basic Pathology 10th Ed, Ch 20.",
        "claim": "Hypertension is a consequence of chronic renal injury/pyelonephritis, NOT an initiating predisposing risk factor for acute ascending infection."
    },
    "MUG3-CH6-PHAR-0147": {
        "correctIndex": 2,
        "evidence": "Katzung Basic & Clinical Pharmacology 15th Ed, Ch 15, p. 268.",
        "claim": "Combining an ACE inhibitor (captopril) with a potassium-sparing aldosterone receptor antagonist (spironolactone) markedly increases the risk of severe hyperkalemia."
    },
    "MUG3-CH6-PHAR-0249": {
        "text": "Hyperkalemia can be reported with which of the following drug combinations?",
        "options": [
            "Captopril (ACEI) plus Liquorice",
            "Captopril (ACEI) plus frusemide",
            "Captopril (ACEI) plus thiazide",
            "Captopril (ACEI) plus spironolactone"
        ],
        "correctIndex": 3,
        "evidence": "Katzung Basic & Clinical Pharmacology 15th Ed, Ch 15, p. 268.",
        "claim": "Captopril plus spironolactone impairs both aldosterone production and distal tubular mineralocorticoid receptors, precipitating hyperkalemia."
    },
    "MUG3-CH6-PHAR-0309": {
        "correctIndex": 3,
        "evidence": "Katzung Basic & Clinical Pharmacology 15th Ed, Ch 15, p. 268.",
        "claim": "Captopril combined with spironolactone leads to synergistic potassium retention and hyperkalemia."
    },
    "MUG3-CH6-PHAR-0185": {
        "correctIndex": 2,
        "evidence": "Katzung Basic & Clinical Pharmacology 15th Ed, Ch 15; Harrison's 21st Ed, Ch 52.",
        "claim": "NSAIDs inhibit renal prostaglandin synthesis (PGE2/PGI2), decreasing renin and aldosterone secretion, causing hyperkalemia (hyporeninemic hypoaldosteronism), NOT hypokalemia."
    },
    "MUG3-CH6-PHAR-0307": {
        "correctIndex": 3,
        "evidence": "Harrison's Principles of Internal Medicine 21st Ed, Ch 52.",
        "claim": "Intravenous calcium (gluconate/chloride) is the emergency first-line treatment for severe hyperkalemia with ECG changes to stabilize cardiac myocyte membranes."
    },
    "MUG3-CH6-PHAR-0371": {
        "correctIndex": 4,
        "evidence": "Katzung Basic & Clinical Pharmacology 15th Ed, Ch 13 & 15.",
        "claim": "Digoxin toxicity inhibits the Na+/K+-ATPase pump, preventing potassium entry into cells and causing extracellular hyperkalemia."
    },
    "MUG3-CH7-MICR-0023": {
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, p. 216.",
        "claim": "Terminal hematuria (passage of blood at the end of micturition due to trigonal contraction squeezing schistosome eggs) is pathognomonic of urinary bilharziasis."
    },
    "MUG3-CH7-MICR-0026": {
        "correctIndex": 4,
        "evidence": "Ain Shams Parasitology/Microbiology Department Notes; Manson's Tropical Diseases.",
        "claim": "Schistosoma haematobium infection is transmitted by direct percutaneous penetration of unbroken human skin by free-swimming furcocercous cercariae in freshwater."
    },
    "MUG3-CH7-MICR-0031": {
        "correctIndex": 0,
        "evidence": "Murray's Medical Microbiology 9th Ed, Ch 19; Ain Shams Microbiology Booklet, p. 7.",
        "claim": "Group A beta-hemolytic Streptococcus (Streptococcus pyogenes) is the causative pathogen of both post-streptococcal glomerulonephritis and acute rheumatic fever."
    },
    "MUG3-CH7-MICR-0117": {
        "correctIndex": 4,
        "evidence": "Murray's Medical Microbiology 9th Ed, Ch 18.",
        "claim": "Staphylococcus saprophyticus is a novobiocin-resistant, coagulase-negative staphylococcus that causes acute community-acquired UTIs in sexually active young women."
    },
    "MUG3-CH7-MICR-0122": {
        "correctIndex": 4,
        "evidence": "Jawetz Medical Microbiology 28th Ed, Ch 15.",
        "claim": "Shigella dysenterica causes invasive bacillary dysentery (bloody diarrhea), not urinary tract infections."
    },
    "MUG3-CH7-MICR-0125": {
        "correctIndex": 3,
        "evidence": "Jawetz Medical Microbiology 28th Ed, Ch 15; Murray Ch 25.",
        "claim": "Proteus mirabilis is actively motile via peritrichous flagella, producing characteristically swarming growth on non-inhibitory agar; claiming it is non-motile is false."
    },
    "MUG3-CH7-MICR-0126": {
        "correctIndex": 3,
        "evidence": "Murray's Medical Microbiology 9th Ed, Ch 25.",
        "claim": "Klebsiella pneumoniae produces a prominent polysaccharide capsule yielding large, glistening, characteristically mucoid colonies."
    },
    "MUG3-CH7-MICR-0132": {
        "correctIndex": 2,
        "evidence": "CDC Guidelines for Prevention of CAUTI; Ain Shams Microbiology.",
        "claim": "Urinary catheters promote bacterial biofilm formation and represent the primary risk factor for hospital-acquired UTIs, rather than eliminating infections."
    },
    "MUG3-CH301-PATH-0106": {
        "correctIndex": 0,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 542.",
        "claim": "The classic nephritic triad of hematuria (smoky urine), hypertension, oliguria, and periorbital edema defines post-streptococcal glomerulonephritis."
    },
    "MUG3-CH301-PATH-0116": {
        "correctIndex": 3,
        "evidence": "Guyton and Hall Textbook of Medical Physiology 14th Ed, Ch 31, p. 415.",
        "claim": "In primary respiratory acidosis, renal compensation involves increased tubular H+ secretion, generation of new bicarbonate, and elevated plasma HCO3-."
    },
    "MUG3-CH301-PATH-0117": {
        "correctIndex": 3,
        "evidence": "Langman's Medical Embryology 14th Ed, Ch 16, p. 258.",
        "claim": "The ureteric bud originates as a dorsal diverticulum from the caudal portion of the mesonephric (Wolffian) duct."
    },
    "MUG3-CH301-PATH-0121": {
        "correctIndex": 2,
        "evidence": "Harper's Illustrated Biochemistry 31st Ed, Ch 29.",
        "claim": "Alkaptonuria is caused by homogentisate 1,2-dioxygenase deficiency, resulting in dark urine upon standing (homogentisic aciduria) and ochronosis."
    },
    "MUG3-CH301-PATH-0122": {
        "correctIndex": 1,
        "evidence": "Harrison's Principles of Internal Medicine 21st Ed, Ch 135.",
        "claim": "Adult males aged 20-50 have a long urethra and antibacterial prostatic secretions, giving them the lowest susceptibility to UTIs among all demographic groups."
    },
    "MUG3-CH301-MICR-0008": {
        "text": "A 32-year-old male presents with a very painful genital ulcer and inguinal adenopathy. Tzanck smear reveals multinucleated giant cells and intranuclear inclusion bodies. What is the causative pathogen?",
        "options": [
            "Treponema pallidum",
            "Haemophilus ducreyi",
            "Chlamydia trachomatis (LGV)",
            "Herpes Simplex Virus (HSV)"
        ],
        "correctIndex": 3,
        "evidence": "Murray's Medical Microbiology 9th Ed, Ch 44.",
        "claim": "Multinucleated giant cells and eosinophilic Cowdry A intranuclear inclusion bodies on a Tzanck smear from a painful genital vesicle/ulcer are diagnostic of Herpes Simplex Virus (HSV-2/HSV-1)."
    },
    "MUG3-CH205-PATH-0051": {
        "text": "Oliguria, hematuria, hypertension, and periorbital edema are characteristic clinical features for which of the following types of glomerulonephritis?",
        "options": [
            "Minimal change disease",
            "Poststreptococcal GN",
            "Membranous nephropathy",
            "Rapidly progressive GN"
        ],
        "correctIndex": 1,
        "evidence": "Robbins Basic Pathology 10th Ed, Ch 20, p. 542.",
        "claim": "Acute nephritic syndrome (hematuria, red cell casts, oliguria, hypertension, periorbital edema) is the hallmark presentation of acute post-streptococcal glomerulonephritis."
    }
}

# 9. Physiology Clinical Inversions
PHYSIOLOGY_CLINICAL_INVERSIONS = {
    "MUG3-CH3-PHYS-1814": {
        "correctIndex": 4,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Micturition reflex', pp. 173-179.",
        "claim": "Micturition requires parasympathetic-mediated detrusor contraction accompanied by coordinated reciprocal relaxation of both internal and external urethral sphincters."
    },
    "MUG3-CH3-PHYS-1815": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 173-179.",
        "claim": "Bladder stretching stimulates pelvic splanchnic parasympathetics and inhibits lumbar sympathetics; sympathetic stimulation causes contraction, not relaxation, of the internal sphincter."
    },
    "MUG3-CH3-PHYS-1917": {
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Male Accessory Glands', pp. 57-61.",
        "claim": "The prostate gland secretes a thin, milky, alkaline fluid that neutralizes vaginal acidity and enhances sperm motility; spermatogenesis is testicular."
    },
    "MUG3-CH3-PHYS-1849": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Ovarian & Uterine Cycle', pp. 152-160.",
        "claim": "Ovulation is triggered by the preovulatory luteinizing hormone (LH) surge, which induces follicular rupture and oocyte release."
    },
    "MUG3-CH3-PHYS-1848": {
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, pp. 161-166.",
        "claim": "Estrogen is a steroid hormone synthesized from cholesterol; FSH and LH are anterior pituitary glycoprotein hormones."
    },
    "MUG3-CH3-PHYS-1022": {
        "correctIndex": 1,
        "evidence": "💥Reproduction Physiology F Questions.pdf, p. 23, Q13; Ain Shams Urogenital Textbook Part 2, pp. 152-160.",
        "claim": "Progesterone exerts negative feedback on the hypothalamus and anterior pituitary to inhibit LH secretion during the luteal phase."
    },
    "MUG3-CH3-PHYS-1622": {
        "correctIndex": 3,
        "evidence": "💥Renal Physiology Questions-1.pdf, p. 12, Q22; Ain Shams Textbook Part 1, pp. 58-73.",
        "claim": "Renal autoregulation maintains renal blood flow and GFR relatively constant over a mean arterial pressure range of 80 to 180 mmHg, NOT 50 to 150 mmHg."
    },
    "MUG3-CH3-PHYS-0700": {
        "correctIndex": 1,
        "evidence": "💥Renal Physiology Questions-1.pdf, p. 12, Q45; Ain Shams Textbook Part 1, pp. 58-73.",
        "claim": "Increasing mean arterial pressure to 150 mmHg falls well within the autoregulatory range (80-180 mmHg) and does not increase GFR."
    },
    "MUG3-CH3-PHYS-0716": {
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Urine concentration', pp. 129-136.",
        "claim": "The vasa recta act as passive countercurrent exchangers that preserve the hypertonic medullary gradient without actively transporting solutes."
    },
    "MUG3-CH3-PHYS-0717": {
        "correctIndex": 4,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 129-136.",
        "claim": "Water reabsorption from medullary collecting ducts is PASSIVE via osmosis through aquaporin channels, never active."
    },
    "MUG3-CH3-PHYS-0719": {
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 129-136.",
        "claim": "Urea is reabsorbed passively down its concentration gradient via facilitated diffusion transporters (UT-A1/UT-A3) in the medullary collecting duct."
    },
    "MUG3-CH3-PHYS-0724": {
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Drug Therapy of Electrolytes', pp. 180-189.",
        "claim": "Loop diuretics inhibit the Na+-K+-2Cl- (NKCC2) cotransporter in the thick ascending limb of Henle, NOT sodium-glucose cotransport (which is SGLT2)."
    },
    "MUG3-CH3-PHYS-0725": {
        "correctIndex": 4,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Function of loop of Henle', pp. 119-128.",
        "claim": "The ascending limb of the loop of Henle is completely impermeable to water; water reabsorption never occurs here."
    },
    "MUG3-CH3-PHYS-0729": {
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Regulation of ECF', pp. 137-146.",
        "claim": "Sodium (Na+) and its associated anions are the primary determinants of ECF osmolarity; potassium is the determinant of intracellular fluid (ICF) osmolarity."
    },
    "MUG3-CH3-PHYS-0733": {
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 137-146.",
        "claim": "Acidosis DECREASES distal potassium secretion because excess intracellular H+ inhibits basolateral Na+/K+-ATPase pumps in principal cells."
    },
    "MUG3-CH3-PHYS-0761": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Acid-base balance', pp. 157-172.",
        "claim": "pH regulation affects enzyme conformations, myocardial contractility, and neural excitability, but does NOT determine ECF temperature."
    },
    "MUG3-CH3-PHYS-0764": {
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 157-172.",
        "claim": "Volatile acid (CO2) elimination is exclusively respiratory via alveolar ventilation, while kidneys regulate fixed non-volatile acids and bicarbonate."
    },
    "MUG3-CH3-PHYS-0777": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 157-172.",
        "claim": "In metabolic or respiratory alkalosis, renal compensation decreases H+ secretion and excretes bicarbonate to lower systemic pH."
    },
    "MUG3-CH3-PHYS-0807": {
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 157-172.",
        "claim": "Renal ammoniagenesis from glutamine is stimulated by acidosis and decreased (inhibited) during alkalosis."
    },
    "MUG3-CH3-PHYS-0933": {
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Functions of proximal convoluted tubule', pp. 108-118.",
        "claim": "Hydrogen ion secretion in proximal tubular cells is secondary active transport mediated by the apical Na+/H+ exchanger (NHE3)."
    },
    "MUG3-CH3-PHYS-0790": {
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Renal clearance', pp. 74-78.",
        "claim": "Inulin clearance specifically measures Glomerular Filtration Rate (GFR), whereas TmG, PAH clearance, and PSP excretion evaluate tubular function."
    },
    "MUG3-CH3-PHYS-0478": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Function of kidney', pp. 53-57.",
        "claim": "Macula densa cells form a specialized plaque in the thick ascending limb of the loop of Henle / early DCT at the vascular pole of the glomerulus."
    },
    "MUG3-CH3-PHYS-1618": {
        "correctIndex": 2,
        "evidence": "💥Renal Physiology Questions-1.pdf, p. 12, Q15; Ain Shams Textbook Part 1, pp. 53-57.",
        "claim": "Intrarenal baroreceptors are the juxtaglomerular granular cells situated in the wall of the afferent arteriole that release renin in response to decreased perfusion pressure."
    },
    "MUG3-CH3-PHYS-0377": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Renal clearance', pp. 74-78.",
        "claim": "If clearance of substance X exceeds inulin clearance (Cx > Cinulin), the substance undergoes net tubular secretion in addition to filtration."
    },
    "MUG3-CH3-PHYS-0386": {
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 74-78.",
        "claim": "Normal renal clearance of glucose is 0 mL/min because 100% of filtered glucose is avidly reabsorbed by SGLT2/SGLT1 cotransporters below threshold."
    },
    "MUG3-CH3-PHYS-1680": {
        "correctIndex": 1,
        "evidence": "💥Renal Physiology Questions-2.pdf, p. 12, Q3; Ain Shams Textbook Part 1, pp. 74-78.",
        "claim": "Inulin clearance is the gold standard research method for GFR, but creatinine clearance or eGFR formulas are used clinically because inulin requires continuous IV infusion."
    },
    "MUG3-CH3-PHYS-1682": {
        "correctIndex": 2,
        "evidence": "💥Renal Physiology Questions-2.pdf, p. 12, Q5; Ain Shams Textbook Part 1, pp. 74-78.",
        "claim": "Normal renal plasma clearance of glucose (0 mL/min) is lower than that of urea (~70 mL/min), which is lower than creatinine (~125 mL/min)."
    },
    "MUG3-CH3-PHYS-1630": {
        "correctIndex": 2,
        "evidence": "💥Renal Physiology Questions-1.pdf, p. 12, Q38; Ain Shams Textbook Part 1, pp. 58-73.",
        "claim": "Negatively charged heparan sulfate proteoglycans in the filtration barrier repel polyanionic molecules, making cations more easily filtered than anions of equal size."
    },
    "MUG3-CH3-PHYS-0976": {
        "text": "Renal plasma clearance of glucose:",
        "options": [
            "Is equal to GFR.",
            "Glucose is freely filtered, not reabsorbed and not secreted.",
            "Gives idea about the secretory renal mass.",
            "Glucose is normally not cleared by the kidneys."
        ],
        "correctIndex": 3,
        "evidence": "Renal Physiology MCQs-2022 Part-1, p. 11, Q54; Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Renal plasma clearance', pp. 74–78.",
        "claim": "Glucose is freely filtered at the glomerulus and completely reabsorbed in the proximal convoluted tubule via SGLT2 and GLUT2 under normal physiological conditions, meaning renal plasma clearance of glucose is zero (normally not cleared by the kidneys)."
    }
}

HISTOLOGY_REROUTE_DATA = {
    "MUG3-CH4-BIOC-0416": {
        "text": "Regarding the muscular layer of the ureter:",
        "options": [
            "Contains 2 muscle layers in the upper two thirds and 3 layers in the lower one third.",
            "Contains 3 muscle layers throughout its entire length.",
            "Contains a single circular muscle layer throughout.",
            "Contains skeletal muscle fibers in the middle third."
        ],
        "correctIndex": 0,
        "lecture": 5,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, Histological structure of the Urinary Passages, pp. 49-52.",
        "claim": "The ureteric muscularis is composed of 2 smooth muscle layers (inner longitudinal, outer circular) in its upper 2/3, and acquires an additional outer longitudinal layer (3 layers total) in its lower 1/3."
    },
    "MUG3-CH4-BIOC-0417": {
        "text": "The endothelial lining of renal glomerular capillaries is:",
        "options": [
            "Continuous non-fenestrated endothelium.",
            "Fenestrated endothelium without diaphragms.",
            "Fenestrated endothelium with diaphragms.",
            "Discontinuous sinusoidal endothelium."
        ],
        "correctIndex": 1,
        "lecture": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, Histological structure of the Kidney, pp. 28-48.",
        "claim": "Glomerular capillaries possess large endothelial fenestrations (70-90 nm) lacking diaphragms to optimize ultrafiltration."
    },
    "MUG3-CH4-BIOC-0419": {
        "text": "Which of the following concerning the histological structure of the uterine cervix is true?",
        "options": [
            "Its mucosa is continuously shed during normal menstruation.",
            "The endocervical canal is lined by mucus-secreting simple columnar epithelium.",
            "The wall consists predominantly of thick bundles of smooth muscle fibers.",
            "The ectocervix is lined by simple ciliated columnar epithelium."
        ],
        "correctIndex": 1,
        "lecture": 10,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, Histology of Cervix, pp. 189-193.",
        "claim": "The endocervix is lined by tall, mucus-secreting simple columnar epithelium, whereas the ectocervix is lined by stratified squamous non-keratinized epithelium."
    },
    "MUG3-CH4-BIOC-0420": {
        "text": "Which of the following statements concerning the histological structure of the penis is true?",
        "options": [
            "Skin covering the shaft is thick and contains abundant subcutaneous adipose tissue.",
            "The penile (spongy) urethra traverses the corpus spongiosum to terminate at the glans penis.",
            "The corpora cavernosa contain the penile urethra.",
            "The erectile vascular spaces lack an endothelial lining."
        ],
        "correctIndex": 1,
        "lecture": 7,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, Male External Genital Organs, pp. 25-29.",
        "claim": "The spongy (penile) urethra traverses the length of the corpus spongiosum and expands distally within the glans penis as the fossa navicularis."
    },
    "MUG3-CH4-BIOC-0421": {
        "text": "Which of the following genital ducts forms the initial head segment of the epididymis?",
        "options": [
            "Vas (ductus) deferens",
            "Ductuli efferentes (efferent ductules)",
            "Tubuli recti (straight tubules)",
            "Rete testis"
        ],
        "correctIndex": 1,
        "lecture": 7,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, Histology of the male reproductive system: Ducts, pp. 53-56.",
        "claim": "12-20 coiled efferent ductules (ductuli efferentes) emerge from the rete testis and form the vascular cones constituting the head (caput) of the epididymis."
    },
    "MUG3-CH4-BIOC-0422": {
        "text": "The axoneme of the principal piece of the mature sperm flagellum is characterized by which structure?",
        "options": [
            "A 9+2 arrangement of microtubule doublets surrounded by outer dense fibers and a fibrous sheath.",
            "A helical sheath of elongated mitochondria.",
            "An outer covering of stratified squamous epithelial cells.",
            "9 triplets of microfilaments with no central singlets."
        ],
        "correctIndex": 0,
        "lecture": 6,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, Histology of Testis, pp. 40-52.",
        "claim": "The principal piece of the sperm tail consists of a central 9+2 axoneme surrounded by 7 outer dense fibers and a circumferential fibrous sheath (mitochondria are restricted to the middle piece)."
    },
    "MUG3-CH4-BIOC-0423": {
        "text": "Primary spermatocytes in the seminiferous epithelium are characterized by which of the following?",
        "options": [
            "They contain 23 single chromosomes (haploid, 1N).",
            "They are the smallest cells in the spermatogenic lineage.",
            "They contain 46 chromosomes (diploid, 4N DNA) and undergo prolonged meiotic prophase I.",
            "They secrete testosterone under the influence of LH."
        ],
        "correctIndex": 2,
        "lecture": 6,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, pp. 40-52.",
        "claim": "Primary spermatocytes are large diploid cells (46 chromosomes, 4N DNA content) that enter a prolonged prophase I (lasting ~22 days) where crossing over occurs."
    }
}


# 11. Reviewer 2 Specific Corrections
REVIEWER2_SPECIFIC_CORRECTIONS = {
    # Minimal Change Disease (Proteinuria >3.5 gm/24 hours)
    "MUG3-CH5-PATH-0403": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Nephrotic Syndrome', pp. 225–234; Robbins 10th Ed.",
        "claim": "Minimal Change Disease is the prototypical nephrotic syndrome presenting with nephrotic-range proteinuria (>3.5 gm/24 hours), severe hypoalbuminemia, and generalized edema due to diffuse podocyte foot process effacement."
    },
    # Post-streptococcal Glomerulonephritis (Elevated anti streptolysin O titer)
    "MUG3-CH5-PATH-0233": {
        "correctIndex": 4,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Nephritic Syndrome', pp. 217–224.",
        "claim": "Post-streptococcal glomerulonephritis (PSGN) typically follows group A streptococcal pharyngitis; elevated anti-streptolysin O (ASO) titer confirms recent streptococcal infection in the setting of hematuria and subepithelial electron-dense humps."
    },
    # Drug-Induced Acute Interstitial Nephritis (Drug-induced interstitial nephritis)
    "MUG3-CH5-PATH-0391": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Diseases of the tubules and the interstitium', pp. 235–239.",
        "claim": "The clinical presentation of fever, maculopapular rash, and peripheral eosinophilia with mild proteinuria following antibiotic therapy is diagnostic of drug-induced acute interstitial nephritis."
    },
    # Membranous Glomerulonephritis (Systemic lupus erythematosus)
    "MUG3-CH5-PATH-1311": {
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Nephrotic Syndrome', pp. 225–234.",
        "claim": "Membranous glomerulonephritis (membranous nephropathy) is a classic secondary cause of nephrotic syndrome in Systemic Lupus Erythematosus (Class V lupus nephritis)."
    },
    # Phenacetin Analgesic Nephropathy / Papillary Necrosis
    "MUG3-CH5-PATH-1297": {
        "text": "A 53-year-old female has taken 2 gm of phenacetin daily for her arthritic pain for the past 3 years. She now has increasing serum BUN and creatinine. Her kidneys are most likely to show:",
        "options": [
            "Renal papillary necrosis",
            "Acute post-infectious glomerulonephritis",
            "Diffuse cortical necrosis",
            "Renal amyloidosis",
            "Minimal change disease"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Diseases of the tubules and the interstitium', pp. 235–239.",
        "claim": "Chronic abuse of phenacetin-containing analgesics causes chronic interstitial nephritis with characteristic renal papillary necrosis."
    },
    # Drug induced hypokalemia (None of the above)
    "MUG3-CH6-PHAR-0247": {
        "text": "Drug-induced hypokalemia is caused by:",
        "options": [
            "Beta-1 receptor blockers",
            "Angiotensin receptor blockers and Na+/K+ ATPase inhibitors",
            "None of the above"
        ],
        "correctIndex": 2,
        "evidence": "MCQ Pharma .pdf p. 1 Q2 (Key D). Ain Shams Urogenital Textbook Part 1, pp. 180–189.",
        "claim": "Neither beta-blockers, ARBs, nor Na+/K+ ATPase inhibitors cause hypokalemia (they tend to cause hyperkalemia); therefore, none of the above induces hypokalemia."
    },
    # Proteus stone formation repair
    "MUG3-CH7-MICR-0010": {
        "text": "All of the following statements are true regarding Proteus species in urinary tract infections, EXCEPT:",
        "options": [
            "Proteus species produce a potent urease enzyme",
            "Urease splits urea into ammonia, making the urine alkaline",
            "Alkaline urine promotes the precipitation of magnesium ammonium phosphate (struvite) stones",
            "Proteus infections are typically associated with persistent acidic urine"
        ],
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Urinary tract infections', pp. 196–205.",
        "claim": "Proteus species produce urease, which hydrolyzes urea to carbon dioxide and ammonia, generating alkaline urine and promoting struvite calculus formation; persistent acidic urine is false."
    },
    # Hypersplenism in Schistosomiasis (Schistosoma mansoni)
    "MUG3-CH8-PARA-0028": {
        "text": "Hypersplenism and hepatosplenomegaly occur characteristically in infection with:",
        "options": [
            "Schistosoma mansoni",
            "Schistosoma haematobium",
            "Enterobius vermicularis",
            "Heterophyes heterophyes"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Urinary Schistosomiasis', pp. 190–195.",
        "claim": "Hepatosplenomegaly and hypersplenism are hallmarks of Schistosoma mansoni infection (intestinal/hepatosplenic schistosomiasis), whereas Schistosoma haematobium causes urinary tract pathology."
    },
    # Schistosoma haematobium snail intermediate host (Bulinus truncatus)
    "MUG3-CH8-PARA-0040": {
        "text": "The snail intermediate host of Schistosoma haematobium is:",
        "options": [
            "Bulinus truncatus (sinistral, left-sided shell opening)",
            "Biomphalaria alexandrina (discoidal shell)",
            "Lymnaea cailliaudi",
            "Cleopatra bulimoides"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Urinary Schistosomiasis', pp. 190–195.",
        "claim": "Bulinus truncatus is the intermediate snail host for Schistosoma haematobium; it is characterized by a sinistral (left-sided) shell opening."
    },
    # Schistosoma prepatent period (10-12 weeks)
    "MUG3-CH8-PARA-0032": {
        "text": "After infection, Schistosoma haematobium eggs appear in the urine within:",
        "options": [
            "10-12 weeks",
            "3 weeks",
            "48 hours",
            "One week"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Urinary Schistosomiasis', pp. 190–195.",
        "claim": "The biological prepatent period for Schistosoma haematobium (from cercarial penetration to the appearance of eggs in urine) is approximately 10 to 12 weeks (70–84 days)."
    },
    # Schistosoma egg escape mechanism
    "MUG3-CH8-PARA-0009": {
        "text": "Eggs of Schistosoma manage to escape from venules into perivascular tissues mainly through which of the following mechanisms?",
        "options": [
            "Secretion of proteolytic enzymes by the enclosed miracidium through egg-shell pores",
            "Active motility of adult schistosomes",
            "Host muscular peristalsis alone",
            "Passive hydrostatic blood pressure alone"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Urinary Schistosomiasis', pp. 190–195.",
        "claim": "Schistosome eggs traverse the venular wall into the perivascular tissues primarily aided by proteolytic enzymes secreted by the enclosed miracidium through pores in the egg shell, aided by the terminal spine and vascular pressure."
    }
}

# 12. Option Text Cleanliness & Defect Repairs (Challenger 1 Section 1.2)
OPTION_TEXT_REPAIRS = {
    "MUG3-CH3-PHYS-0371": {
        "text": "In tubuloglomerular feedback, increased NaCl delivery to the macula densa leads to:",
        "options": [
            "Decreased release of ATP and adenosine",
            "Decreased Ca2+ in afferent arteriolar vascular smooth muscle",
            "Afferent arteriolar dilatation",
            "Decreased renin secretion from juxtaglomerular cells"
        ],
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Renal blood flow and Glomerular filtration', pp. 58–73.",
        "claim": "Elevated NaCl at the macula densa suppresses renin release from juxtaglomerular granular cells while triggering ATP/adenosine release to constrict the afferent arteriole."
    },
    "MUG3-CH3-PHYS-0668": {
        "text": "Anabolic effects of testosterone include which of the following?",
        "options": [
            "Increased muscle bulk",
            "Increased bone matrix and Ca2+ deposition in bone",
            "Increased thickness of skin and vocal folds"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Endocrine function of testis & Spermatogenesis', pp. 62–70.",
        "claim": "Testosterone exerts powerful protein anabolic effects on bone tissue, increasing bone matrix synthesis and calcium deposition."
    },
    "MUG3-CH3-PHYS-1009": {
        "text": "In the male reproductive system, the primary physiological target of follicle-stimulating hormone (FSH) is:",
        "options": [
            "Leydig (interstitial) cells",
            "Sertoli cells of seminiferous tubules",
            "Prostatic glandular epithelium",
            "Epididymal smooth muscle"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Endocrine function of testis & Spermatogenesis', pp. 62–70.",
        "claim": "FSH specifically binds to receptors on Sertoli cells in the seminiferous tubules to stimulate spermatogenesis and synthesis of androgen-binding protein (ABP)."
    },
    "MUG3-CH5-PATH-2079": {
        "text": "The most common clinical presentation of an intraductal papilloma of the breast is:",
        "options": [
            "Painful lump",
            "Painless lump",
            "Bloody or serous nipple discharge",
            "Microcalcifications on screening mammograms",
            "Eczema and itching of the nipple and areola"
        ],
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Diseases of the Breast', pp. 224–240.",
        "claim": "Intraductal papilloma is the most common cause of unilateral serous or bloody (serosanguinous) nipple discharge in women aged 20-50 years."
    },
    "MUG3-CH5-PATH-2960": {
        "text": "A firm, poorly circumscribed breast mass with skin retraction and nipple inversion is most characteristic of:",
        "options": [
            "Fibroadenoma",
            "Phyllodes tumor",
            "Mammary duct ectasia",
            "Invasive ductal carcinoma with tumor desmoplasia and fibrosis",
            "Fat necrosis"
        ],
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Diseases of the Breast', pp. 224–240.",
        "claim": "Invasive (infiltrating) ductal carcinoma typically induces an extensive desmoplastic stromal response causing retraction of overlying skin and nipple inversion."
    },
    "MUG3-CH5-PATH-3474": {
        "text": "A 35-year-old woman presents with bilateral premenstrual breast tenderness and multiple fluctuating cystic lumps. The most likely diagnosis is:",
        "options": [
            "Invasive ductal carcinoma",
            "Fibrocystic changes of the breast",
            "Intraductal papilloma",
            "Phyllodes tumor"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Diseases of the Breast', pp. 224–240.",
        "claim": "Fibrocystic changes represent benign multifocal alterations in breast tissue presenting with cyclic premenstrual mastalgia and fluctuating nodularity."
    },
    "MUG3-CH2-HIST-0127": {
        "text": "Which segment of the Fallopian (uterine) tube is characterized by finger-like projections that capture the ovulated oocyte?",
        "options": [
            "Fimbriae of the infundibulum",
            "Ampulla",
            "Isthmus",
            "Intramural (uterine) segment"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Histology of Fallopian tube', pp. 138–139.",
        "claim": "The infundibulum terminates in mucosal fringes termed fimbriae, which sweep over the ovary at ovulation to capture the secondary oocyte."
    },
    "MUG3-CH3-PHYS-0418": {
        "text": "The failure of one or both testes to descend into the scrotum is referred to as:",
        "options": [
            "Castration",
            "Azoospermia",
            "Impotence",
            "Hydrocele",
            "Cryptorchidism"
        ],
        "correctIndex": 4,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Male external genital organs', pp. 25–29.",
        "claim": "Cryptorchidism is the developmental failure of the testis to descend from the posterior abdominal wall into the scrotal sac."
    },
    "MUG3-CH3-PHYS-0437": {
        "text": "Which structural layer of the uterus experiences the greatest histological changes during the menstrual cycle?",
        "options": [
            "Perimetrium",
            "Myometrium",
            "Cervix",
            "Endometrium",
            "Vagina"
        ],
        "correctIndex": 3,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Ovarian & Uterine Cycle & Hormonal Control', pp. 152–160.",
        "claim": "The endometrium (specifically the stratum functionale) undergoes marked cyclic proliferation, secretory differentiation, and shedding during the uterine menstrual cycle."
    },
    "MUG3-CH5-PATH-0538": {
        "text": "Severe hematuria accompanying the passage of a jagged calcium oxalate urinary stone is primarily caused by:",
        "options": [
            "Direct chemical erosion of renal tubules",
            "Mechanical injury of the ureteric mucosa by the rough surface of the stone",
            "Bacterial cystitis with mucosal sloughing",
            "Immune complex deposition in urothelium"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Vascular and obstructive renal diseases', pp. 240–246.",
        "claim": "Calcium oxalate stones characteristically have sharp, spiny surfaces that produce mechanical laceration and abrasive injury to the ureteric mucosa, causing hematuria."
    },
    "MUG3-CH6-PHAR-0158": {
        "text": "In a patient with benign prostatic hyperplasia (BPH) and acute urinary retention, which drug selectively relaxes prostatic smooth muscle with minimal effect on systemic blood pressure?",
        "options": [
            "Alprostadil",
            "Finasteride",
            "Sildenafil",
            "Flutamide",
            "Tamsulosin"
        ],
        "correctIndex": 4,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Treatment of prostate diseases', pp. 86–89.",
        "claim": "Tamsulosin is a uroselective alpha-1A adrenergic antagonist that selectively relaxes smooth muscle in the prostate and bladder neck with minimal cardiovascular hypotension."
    },
    "MUG3-CH2-HIST-0421": {
        "text": "Arrange the following vessels in a proper sequence for blood flow into the kidney: 1= renal artery. 2 arcuate artery. 3 interlobar artery. 4 afferent arteriole. 5 interlobular artery. 6 efferent arteriole.",
        "options": [
            "1-3-2-5-4-6",
            "1-2-3-4-5-6",
            "1-4-3-2-5-6",
            "1-5-4-3-2-6",
            "6-1-3-2-5-4"
        ],
        "correctIndex": 0,
        "evidence": "Histology Department MCQs Booklet ('Renal Histo Mcq.pdf', p. 13 Q65 & p. 18 Key A).",
        "claim": "The correct arterial blood flow sequence is: renal artery (1) -> interlobar artery (3) -> arcuate artery (2) -> interlobular artery (5) -> afferent arteriole (4) -> efferent arteriole (6)."
    }
}

# 13. Chapter 6 (Pharmacology) Negative Stem Adjudications (44 items)
PHARMACOLOGY_NEGATIVE_CORRECTIONS = {
    "MUG3-CH6-PHAR-0146": {
        "text": "The following is not usually recommended during treatment of acute euvolemic hypercalcemic patient:",
        "options": [
            "Intravenous isotonic saline infusion",
            "Zoledronic acid",
            "Salmon calcitonin",
            "Loop diuretic",
            "Dialysis"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Pharma .pdf p. 4 Q14 (Key D). Ain Shams Urogenital Textbook 4th Ed Part 1, pp. 180–189.",
        "claim": "Loop diuretics are not recommended in euvolemic hypercalcemia without preceding fluid expansion."
    },
    "MUG3-CH6-PHAR-0149": {
        "text": "Acute symptomatic severe hyponatremia, choose incorrect sentence:",
        "options": [
            "Start treatment with isotonic saline infusion at a rate of 1ml/kg/hour",
            "Rapid correction may lead to ataxia and tremors",
            "Loop diuretic may be used in volume overload",
            "Vaptan should be avoided"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams Pharmacology Lecture Notes; Katzung 15th Ed, Fluid & Electrolytes.",
        "claim": "Severe symptomatic hyponatremia requires 3% hypertonic saline, not isotonic saline."
    },
    "MUG3-CH6-PHAR-0162": {
        "text": "Sildenafil should not be combined with which of the following drugs at the same time:",
        "options": [
            "Dutasteride",
            "Nitrates",
            "H2 receptors blockers",
            "Alprostadil",
            "Flutamide"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Erectile dysfunction pharmacotherapy', pp. 90–94.",
        "claim": "Sildenafil is strictly contraindicated with nitrates due to severe, potentially fatal hypotension."
    },
    "MUG3-CH6-PHAR-0182": {
        "text": "Which of the following is incorrect regarding symptomatic hyponatremia?",
        "options": [
            "Stop 3% saline and switch to isotonic saline when sodium concentration reaches 130mEq/L",
            "Rapid correction may lead to osmotic demyelination",
            "IV bolus of 150 ml of 5% saline within 20 minutes is used to correct acute symptoms",
            "Acute symptomatic hyponatremia occurs when serum sodium concentration decreases below 120mEq/L"
        ],
        "correctIndex": 2,
        "evidence": "ALAA uro mcq.pdf p. 1 Q3 (Key C). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "Acute symptoms are managed with 3% hypertonic saline boluses, not 5% saline."
    },
    "MUG3-CH6-PHAR-0183": {
        "text": "In management of chronic asymptomatic hyponatremia, which of the following is incorrect?",
        "options": [
            "Hypotonic hypovolemic type is treated by only normal saline",
            "Hypotonic euvolemic is treated by Demeclocycline or V2 receptor antagonists",
            "Free water restriction is needed in hypotonic euvolemic type",
            "Hypotonic hypervolemic type is treated by 0.9% normal saline infusion and V2 receptor antagonist"
        ],
        "correctIndex": 3,
        "evidence": "ALAA uro mcq.pdf p. 1 Q4 (Key D). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "Hypervolemic hypotonic hyponatremia is managed by fluid/salt restriction, not saline infusion."
    },
    "MUG3-CH6-PHAR-0185": {
        "text": "All of the following drugs may induce hypokalemia except:",
        "options": [
            "Insulin",
            "Beta-2 receptor agonists",
            "NSAIDs",
            "Loop diuretics"
        ],
        "correctIndex": 2,
        "evidence": "ALAA uro mcq.pdf p. 2 Q7 (Key C). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "NSAIDs cause hyperkalemia by inhibiting prostaglandin-mediated renin release."
    },
    "MUG3-CH6-PHAR-0186": {
        "text": "The following are true about pharmacological action of drugs used in treatment of hyperkalemia except:",
        "options": [
            "Intravenous calcium / stabilization of myocardial membrane",
            "Insulin / Increased potassium movement into the cells",
            "Beta-2 agonist inhalation / Increase potassium loss",
            "Loop diuretics / removal of potassium from the body"
        ],
        "correctIndex": 2,
        "evidence": "ALAA uro mcq.pdf p. 2 Q9 (Key C). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "Beta-2 agonists stimulate Na+/K+-ATPase shifting K+ intracellularly; they do not increase potassium excretion."
    },
    "MUG3-CH6-PHAR-0187": {
        "text": "The following is not a pharmacological action of magnesium:",
        "options": [
            "Sedative & anticonvulsant effect by blocking of excitatory effect of glutamate",
            "Muscle relaxant effect by interfering with acetylcholine release",
            "Competitive antagonist to calcium on L type of calcium channels",
            "Increase release of catecholamines after sympathetic stimulation"
        ],
        "correctIndex": 3,
        "evidence": "ALAA uro mcq.pdf p. 2 Q11 (Key C). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "Magnesium inhibits catecholamine release from the adrenal medulla and adrenergic terminals."
    },
    "MUG3-CH6-PHAR-0288": {
        "text": "All of the following are therapeutic uses of magnesium except:",
        "options": [
            "Antiarrhythmic in digitalis induced arrhythmia",
            "Anticonvulsant in eclampsia",
            "Refractory hyperkalemia",
            "Adjuvant in anesthesia"
        ],
        "correctIndex": 2,
        "evidence": "ALAA uro mcq.pdf p. 2 Q12 (Key C). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "Magnesium is indicated in refractory hypokalemia and hypocalcemia, not hyperkalemia."
    },
    "MUG3-CH6-PHAR-0189": {
        "text": "The following drug does not induce hypocalcemia:",
        "options": [
            "Corticosteroids",
            "Tetracyclines",
            "Mithramycin",
            "Lithium carbonate"
        ],
        "correctIndex": 3,
        "evidence": "ALAA uro mcq.pdf p. 3 Q13 (Key D). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "Lithium reduces renal calcium excretion and increases PTH, causing hypercalcemia."
    },
    "MUG3-CH6-PHAR-0193": {
        "text": "The following is not an adverse effect of bisphosphonates:",
        "options": [
            "Flu like syndrome",
            "Osteonecrosis in the jaw and atypical fracture",
            "Renal impairment",
            "Hypercalcemia & hyperphosphatemia",
            "Esophagitis"
        ],
        "correctIndex": 3,
        "evidence": "ALAA uro mcq.pdf p. 3 Q17 (Key D). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "Bisphosphonates inhibit osteoclasts and lower serum calcium/phosphate; they cause hypocalcemia."
    },
    "MUG3-CH6-PHAR-0197": {
        "text": "Lactic acidosis is not considered an adverse effect of which of the following drugs?",
        "options": [
            "Metformin",
            "Linezolid",
            "Insulin",
            "Propafenone"
        ],
        "correctIndex": 2,
        "evidence": "ALAA uro mcq.pdf p. 4 Q21 (Key C). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "Insulin promotes glucose utilization and clears ketoacids/lactate; it does not cause lactic acidosis."
    },
    "MUG3-CH6-PHAR-0198": {
        "text": "The following are expected adverse effects of sodium bicarbonate therapy except:",
        "options": [
            "Cerebral hemorrhage",
            "Hypernatremia",
            "Hypocalcemia",
            "Hyperkalemia"
        ],
        "correctIndex": 3,
        "evidence": "ALAA uro mcq.pdf p. 4 Q22 (Key D). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "Alkalinization drives potassium into cells, causing hypokalemia, not hyperkalemia."
    },
    "MUG3-CH6-PHAR-0199": {
        "text": "Which of the following is not a disadvantage of sodium bicarbonate therapy in lactic acidosis?",
        "options": [
            "Intracellular acidosis",
            "Hypernatremia",
            "Volume overload",
            "Rebound acidosis"
        ],
        "correctIndex": 3,
        "evidence": "ALAA uro mcq.pdf p. 4 Q23 (Key D). Ain Shams Textbook Part 1, pp. 180–189.",
        "claim": "Sodium bicarbonate therapy causes paradoxical intracellular acidosis and hypernatremia, but not rebound acidosis."
    },
    "MUG3-CH6-PHAR-0201": {
        "text": "The following are requirements of ideal antibiotics in management of UTI except:",
        "options": [
            "Concentrated in urine in upper UTI such as pyelonephritis",
            "Minimal adverse effects",
            "Long half-life with infrequent dosing",
            "Eliminated active in urine especially in lower UTI"
        ],
        "correctIndex": 0,
        "evidence": "ALAA uro mcq.pdf p. 5 Q25 (Key A). Ain Shams Textbook Part 1, pp. 206–211.",
        "claim": "Upper UTI requires therapeutic tissue and blood concentrations, not just urinary concentration."
    },
    "MUG3-CH6-PHAR-0212": {
        "text": "Ovulation inducing agents do not include:",
        "options": [
            "Gonadorelin",
            "Bromocriptine",
            "Clomiphene",
            "Tamoxifen"
        ],
        "correctIndex": 3,
        "evidence": "essay questions and MCQs urogenital part 3 and 4.pdf p. 3 Q7 (Key D).",
        "claim": "Tamoxifen is primarily used for ER+ breast cancer, while Clomiphene, Bromocriptine, and Gonadorelin are used for ovulation induction."
    },
    "MUG3-CH6-PHAR-0215": {
        "text": "Contraindications of oral contraceptives DO NOT include:",
        "options": [
            "Liver disease",
            "Estrogen dependent breast cancer",
            "Myocardial infarction",
            "Bleeding tendency"
        ],
        "correctIndex": 3,
        "evidence": "essay questions and MCQs urogenital part 3 and 4.pdf p. 3 Q10 (Key D).",
        "claim": "OCPs promote hypercoagulability (thromboembolism); bleeding tendency is not a contraindication."
    },
    "MUG3-CH6-PHAR-0218": {
        "text": "The following is not an adverse effect of PDE-5 inhibitors:",
        "options": [
            "Hypotension & syncope",
            "Flushing, headache & nasal congestion",
            "Visual disturbances",
            "Prostatic hyperplasia"
        ],
        "correctIndex": 3,
        "evidence": "essay questions and MCQs urogenital part 3 and 4.pdf p. 4 Q13 (Key D).",
        "claim": "PDE-5 inhibitors (e.g. tadalafil) treat BPH by relaxing prostatic smooth muscle; they do not cause BPH."
    },
    "MUG3-CH6-PHAR-0220": {
        "text": "All the following reduce the tone of prostatic smooth muscles and bladder neck except:",
        "options": [
            "Alpha adrenergic receptor blockers",
            "Beta 3 receptor agonists",
            "5 alpha reductase enzyme inhibitors",
            "Antimuscarinic drugs"
        ],
        "correctIndex": 2,
        "evidence": "essay questions and MCQs urogenital part 3 and 4.pdf p. 4 Q15 (Key C).",
        "claim": "5-alpha reductase inhibitors reduce static prostate volume by blocking DHT, not dynamic smooth muscle tone."
    },
    "MUG3-CH6-PHAR-0222": {
        "text": "Testosterone therapy may induce all of the following except:",
        "options": [
            "Gynecomastia",
            "Abnormal lipid profile",
            "Hepatic toxicity",
            "Osteoporosis",
            "Hypertension & peripheral edema"
        ],
        "correctIndex": 3,
        "evidence": "essay questions and MCQs urogenital part 3 and 4.pdf p. 5 Q18 (Key D).",
        "claim": "Testosterone stimulates osteoblastic activity and increases bone density; it prevents osteoporosis."
    },
    "MUG3-CH6-PHAR-0223": {
        "text": "Finasteride, choose incorrect sentence:",
        "options": [
            "Inhibit 5 alpha reductase enzyme",
            "Reduce dynamic factors of BPH",
            "Associated with gynecomastia",
            "Associated with erectile dysfunction"
        ],
        "correctIndex": 1,
        "evidence": "essay questions and MCQs urogenital part 3 and 4.pdf p. 5 Q19 (Key B).",
        "claim": "Finasteride reduces static mechanical enlargement by inhibiting DHT synthesis, not dynamic smooth muscle tone."
    },
    "MUG3-CH6-PHAR-0224": {
        "text": "All the following drugs may be used in gonorrhea during pregnancy except:",
        "options": [
            "Erythromycin",
            "Doxycycline",
            "Azithromycin",
            "Ceftriaxone"
        ],
        "correctIndex": 1,
        "evidence": "essay questions and MCQs urogenital part 3 and 4.pdf p. 5 Q20 (Key B).",
        "claim": "Doxycycline is a tetracycline contraindicated in pregnancy due to fetal bone growth restriction and tooth discoloration."
    },
    "MUG3-CH6-PHAR-0225": {
        "text": "Continuous use of gonadorelin does not induce:",
        "options": [
            "Depression",
            "Osteoporosis",
            "Increased libido",
            "Hot flushes & vaginal dryness",
            "Ovarian cysts"
        ],
        "correctIndex": 2,
        "evidence": "essay questions and MCQs urogenital part 3 and 4.pdf p. 5 Q21 (Key C).",
        "claim": "Continuous GnRH agonist therapy downregulates GnRH receptors, causing profound hypogonadism and loss of libido."
    },
    "MUG3-CH6-PHAR-0231": {
        "text": "The following antibiotic is not effective in treatment of chlamydial infections:",
        "options": [
            "Azithromycin",
            "Doxycycline",
            "Ceftriaxone",
            "Ofloxacin"
        ],
        "correctIndex": 2,
        "evidence": "essay questions and MCQs urogenital part 3 and 4.pdf p. 6 Q27 (Key C).",
        "claim": "Ceftriaxone targets peptidoglycan cell walls and is ineffective against obligate intracellular Chlamydia trachomatis."
    },
    "MUG3-CH6-PHAR-0500": {
        "text": "The following is not an adverse effect of hormonal contraception:",
        "options": [
            "Sodium & water retention",
            "Thromboembolism",
            "Risk of gall stone formation",
            "Hypoglycemia",
            "Amenorrhea"
        ],
        "correctIndex": 3,
        "evidence": "essay questions and MCQs urogenital part 3 and 4.pdf p. 7 Q30 (Key D).",
        "claim": "Hormonal contraceptives impair glucose tolerance, causing hyperglycemia, not hypoglycemia."
    },
    "MUG3-CH6-PHAR-0238": {
        "text": "All of the following are therapeutic uses of magnesium except:",
        "options": [
            "Anticonvulsant in eclampsia",
            "Antiarrhythmic in digitalis induced arrhythmia",
            "Refractory hyperkalemia",
            "Adjuvant in anesthesia"
        ],
        "correctIndex": 2,
        "evidence": "ALAA uro mcq.pdf p. 2 Q12 (Key C).",
        "claim": "Magnesium is used in refractory hypokalemia and eclampsia, not hyperkalemia."
    },
    "MUG3-CH6-PHAR-0265": {
        "text": "Sildenafil should not be combined with which of the following drugs at the same time:",
        "options": [
            "Dutasteride",
            "Nitrates",
            "H2 receptors blockers",
            "Alprostadil",
            "Flutamide"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams Urogenital Textbook Part 2, pp. 90–94.",
        "claim": "Co-administration of sildenafil with organic nitrates leads to excessive cGMP accumulation and fatal hypotension."
    },
    "MUG3-CH6-PHAR-0303": {
        "text": "Regarding hypokalemia, choose the incorrect sentence:",
        "options": [
            "Constipation is usually occurred",
            "IV potassium is usually associated with phlebitis",
            "Cation exchange resin is not effective in its management",
            "Oral potassium should be given with plenty of fluid in supine position"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Pharma .pdf p. 3 Q9 (Key D).",
        "claim": "Oral potassium should be taken in an upright sitting or standing position to avoid severe esophageal ulceration."
    },
    "MUG3-CH6-PHAR-0305": {
        "text": "The following antibiotic is not used in UTI as it is eliminated mainly by hepatic route (with low urinary concentration):",
        "options": [
            "Aminoglycosides",
            "Amoxicillin",
            "Ciprofloxacin",
            "Moxifloxacin",
            "Sulfamethoxazole/trimethoprim"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Pharma .pdf p. 3 Q11 (Key D).",
        "claim": "Moxifloxacin is metabolized hepatically and does not achieve adequate therapeutic urinary concentrations for UTI."
    },
    "MUG3-CH6-PHAR-0308": {
        "text": "The following is not usually recommended during treatment of acute euvolemic hypercalcemic patient:",
        "options": [
            "Intravenous isotonic saline infusion",
            "Zoledronic acid",
            "Salmon calcitonin",
            "Loop diuretic",
            "Dialysis"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Pharma .pdf p. 4 Q14 (Key D).",
        "claim": "Loop diuretics are not recommended in euvolemic hypercalcemic patients without preceding fluid volume expansion."
    },
    "MUG3-CH6-PHAR-0312": {
        "text": "Asymptomatic significant bacteriuria with pregnancy, choose the incorrect sentence:",
        "options": [
            "Duration of therapy is 7 days",
            "Follow up till labour",
            "Amoxicillin is considered safe",
            "Give antibiotic only when symptoms start to appear"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Pharma .pdf p. 5 Q18 (Key D).",
        "claim": "Asymptomatic bacteriuria in pregnancy must be treated immediately upon detection to prevent pyelonephritis and premature labour."
    },
    "MUG3-CH6-PHAR-0315": {
        "text": "Nosocomial UTI could be managed by all of the following except:",
        "options": [
            "Nitrofurantoin",
            "Vancomycin",
            "Monobactam",
            "Aminoglycoside"
        ],
        "correctIndex": 0,
        "evidence": "MCQ Pharma .pdf p. 6 Q21 (Key A).",
        "claim": "Nitrofurantoin is only suitable for uncomplicated lower UTI and is ineffective for complex nosocomial hospital infections."
    },
    "MUG3-CH6-PHAR-0323": {
        "text": "Acute symptomatic severe hyponatremia, choose incorrect sentence:",
        "options": [
            "Start treatment with isotonic saline infusion at a rate of 1ml/kg/hour",
            "Rapid correction may lead to ataxia and tremors",
            "Loop diuretic may be used in volume overload",
            "Vaptan should be avoided"
        ],
        "correctIndex": 0,
        "evidence": "MCQ Pharma .pdf p. 8 Q29 (Key A).",
        "claim": "Severe acute symptomatic hyponatremia requires 3% hypertonic saline, not isotonic saline infusion."
    },
    "MUG3-CH6-PHAR-0324": {
        "text": "Osmotic demyelination syndrome occurs more commonly in patients with, choose incorrect sentence:",
        "options": [
            "Malnutrition",
            "Liver cirrhosis",
            "Serum sodium lower than 120mEq for 24 hours",
            "Serum sodium over correction"
        ],
        "correctIndex": 2,
        "evidence": "MCQ Pharma .pdf p. 8 Q30 (Key C).",
        "claim": "ODS is precipitated by rapid overcorrection of chronic hyponatremia (>48 hours), not short acute durations (<24 hours)."
    },
    "MUG3-CH6-PHAR-0325": {
        "text": "Vaptans should not be used in treatment of patients with:",
        "options": [
            "Euvolemic hypotonic hyponatremia",
            "Hypervolemic hypernatremia",
            "Hypovolemic hypotonic hyponatremia",
            "Hypervolemic hypotonic hyponatremia",
            "Hypovolemic hypotonic hyponatremia and hypernatremia"
        ],
        "correctIndex": 4,
        "evidence": "MCQ Pharma .pdf p. 8 Q31 (Key E / C+D).",
        "claim": "Vaptans cause pure aquaresis and worsen volume depletion; they are contraindicated in hypovolemic hyponatremia."
    },
    "MUG3-CH6-PHAR-0327": {
        "text": "Drug-induced hypocalcemia includes all of the following except:",
        "options": [
            "Frusemide",
            "Cortisone",
            "Mithramycin",
            "Lithium carbonate"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Pharma .pdf p. 9 Q33 (Key D).",
        "claim": "Lithium carbonate causes hypercalcemia by raising the set-point for PTH secretion."
    },
    "MUG3-CH6-PHAR-0328": {
        "text": "Bisphosphonate adverse effects include all of the following except:",
        "options": [
            "Atypical femur fracture",
            "Impaired renal function",
            "Flu like syndrome",
            "Parkinson like syndrome"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Pharma .pdf p. 9 Q35 (Key D).",
        "claim": "Bisphosphonates do not cross the blood-brain barrier and do not cause parkinsonism."
    },
    "MUG3-CH6-PHAR-0329": {
        "text": "Glucocorticoids are better used to prevent recurrence in the following risk factors except:",
        "options": [
            "Lymphoma",
            "Metastasis",
            "Sarcoidosis",
            "Hypervitaminosis D"
        ],
        "correctIndex": 1,
        "evidence": "MCQ Pharma .pdf p. 10 Q36 (Key B).",
        "claim": "Glucocorticoids inhibit 1-alpha hydroxylase in granulomatous diseases (sarcoidosis, lymphoma), but are not primary therapy for osteolytic bone metastasis."
    },
    "MUG3-CH6-PHAR-0336": {
        "text": "Parenteral testosterone therapy in a boy can cause the following adverse effects except:",
        "options": [
            "Gynaecomastia",
            "Acne",
            "Cholestatic jaundice",
            "Precocious puberty",
            "Thrombosis"
        ],
        "correctIndex": 4,
        "evidence": "MCQs urogenital qesm.pdf p. 3 Q1.",
        "claim": "Testosterone induces secondary sexual characteristics and hepatic/dermatologic effects, while arterial/venous thrombosis is an anabolic steroid abuse complication rather than pediatric therapy."
    },
    "MUG3-CH6-PHAR-0342": {
        "text": "Which of the following drugs is not associated with initial stimulation of release of LH and FSH during treatment of prostate cancer?",
        "options": [
            "Leuprolide",
            "Gonadorelin",
            "Tamsulosin",
            "Tolterodine",
            "Degarelix"
        ],
        "correctIndex": 4,
        "evidence": "SGD UROGENITAL 2 ans.pdf p. 15. Katzung 15th Ed.",
        "claim": "Degarelix is a GnRH receptor antagonist that suppresses LH and FSH immediately without any initial agonist flare."
    },
    "MUG3-CH6-PHAR-0370": {
        "text": "Drugs which are better avoided in chronic hypocalcemia include all of the following except:",
        "options": [
            "Aluminum antacids",
            "Tetracyclines",
            "Quinolones",
            "Frusemide",
            "Thiazide diuretics"
        ],
        "correctIndex": 4,
        "evidence": "Pharma lecture Questions.PDF.pdf p. 6.",
        "claim": "Thiazides enhance distal tubule calcium reabsorption, reducing calciuria and elevating serum calcium."
    },
    "MUG3-CH6-PHAR-0374": {
        "text": "NaHCO3 administration during metabolic acidosis could be associated with all of the following except:",
        "options": [
            "Hypokalemia",
            "Hypocalcemia",
            "Hyperkalemia",
            "Hypernatremia",
            "Salt and water retention"
        ],
        "correctIndex": 2,
        "evidence": "Pharma lecture Questions.PDF.pdf p. 10.",
        "claim": "Sodium bicarbonate alkalinizes serum and shifts potassium into cells, causing hypokalemia, not hyperkalemia."
    },
    "MUG3-CH6-PHAR-0376": {
        "text": "Which of the following lines is not preferred at the start of treatment of hyperkalemia?",
        "options": [
            "Salbutamol inhalation",
            "NaHCO3 infusion",
            "Insulin + glucose",
            "Intravenous calcium",
            "Magnesium infusion"
        ],
        "correctIndex": 1,
        "evidence": "Pharma lecture Questions.PDF.pdf p. 13.",
        "claim": "Sodium bicarbonate is unpredictable and no longer recommended as acute first-line monotherapy for hyperkalemia."
    },
    "MUG3-CH6-PHAR-0444": {
        "text": "Which of the following is not an androgen deprivation therapy:",
        "options": [
            "Gonadorelin",
            "Abiraterone acetate",
            "Tadalafil",
            "Flutamide",
            "Mirabegron"
        ],
        "correctIndex": 2,
        "evidence": "SGD UROGENITAL 2 ans.pdf p. 3.",
        "claim": "Tadalafil is a PDE-5 inhibitor used for erectile dysfunction and BPH, not an androgen deprivation oncologic agent."
    }
}

# 14. Chapter 7 (Microbiology) Negative Stem Adjudications (26 items)
MICROBIOLOGY_NEGATIVE_CORRECTIONS = {
    "MUG3-CH7-MICR-0011": {
        "text": "All of the following are risk factors of UTI, Except:",
        "options": [
            "Males are more likely to get urinary tract infections, due to closeness of urethra to anal opening",
            "Sexually active women",
            "Honeymoon cystitis during early marriage",
            "Senile prostatic hypertrophy",
            "Diabetes mellitus and pregnancy"
        ],
        "correctIndex": 0,
        "evidence": "MCQ Micro .pdf p. 6 Q23 (Key A).",
        "claim": "Females, not males, have a significantly higher risk of UTI due to short urethral length."
    },
    "MUG3-CH7-MICR-0012": {
        "text": "All of the following statements are true regarding diagnosis of UTI, Except:",
        "options": [
            "It is generally accepted that 10^3 CFU/ml of urine is significant bacteriuria",
            "Young women with dysuria may have sterile pyuria or lower colony counts",
            "Urinalysis for nitrites and pus cells",
            "Urinalysis for leukocyte esterase and RBCs"
        ],
        "correctIndex": 0,
        "evidence": "MCQ Micro .pdf p. 6 Q25 (Key A).",
        "claim": "Significant bacteriuria historically requires >=10^5 CFU/ml in clean-catch voided urine."
    },
    "MUG3-CH7-MICR-0029": {
        "text": "Which of the following bacteria would not be considered highly probable of causing this problem (UTI)?",
        "options": [
            "Pseudomonas aeruginosa",
            "Klebsiella pneumoniae",
            "Enterobacter species",
            "Group A Beta-hemolytic streptococcus",
            "Proteus species"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Micro .pdf p. 1 Q3 (Key D).",
        "claim": "Group A Streptococcus (S. pyogenes) causes pharyngitis and pyoderma, not urinary tract infections."
    },
    "MUG3-CH7-MICR-0034": {
        "text": "All the following are characteristics of Pseudomonas aeruginosa EXCEPT:",
        "options": [
            "An opportunistic pathogen",
            "Causative agent of urinary tract infection",
            "Causative agent of burn infection",
            "Primary obligate pathogen",
            "Causative agent of eye infection"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Micro .pdf p. 5 Q18 (Key D).",
        "claim": "Pseudomonas aeruginosa is an opportunistic pathogen requiring compromised host defenses, not a primary pathogen."
    },
    "MUG3-CH7-MICR-0128": {
        "text": "All of the following organisms can be found in urine EXCEPT:",
        "options": [
            "E. coli",
            "Candida albicans",
            "Haemophilus influenzae",
            "Enterococci",
            "Staphylococcus saprophyticus"
        ],
        "correctIndex": 2,
        "evidence": "MCQ Micro .pdf p. 5 Q20 (Key C).",
        "claim": "Haemophilus influenzae is a respiratory tract pathogen and is not a cause of urinary tract infection."
    },
    "MUG3-CH7-MICR-0036": {
        "text": "All of the following statements are true regarding diagnosis of UTI, Except:",
        "options": [
            "It is generally accepted that 10^3 CFU/ml of urine is significant bacteriuria",
            "Some young women with acute dysuria have negative bacterial cultures",
            "Urinalysis checks for urinary nitrites and pus cells",
            "Urinalysis checks for leukocyte esterase and hematuria"
        ],
        "correctIndex": 0,
        "evidence": "MCQ Micro .pdf p. 6 Q25 (Key A).",
        "claim": "Standard diagnostic criterion for significant bacteriuria in clean catch urine is >=10^5 CFU/ml."
    },
    "MUG3-CH7-MICR-0134": {
        "text": "All of the following statements are true regarding leptospirosis, Except:",
        "options": [
            "Leptospirosis is a zoonosis of worldwide distribution",
            "Leptospira are tightly coiled, thin, flexible spirochetes",
            "Dark-field examination of centrifuged urine may be positive",
            "The diagnosis of leptospirosis in most cases is confirmed by tissue culture",
            "Rats, dogs, swine, and cattle are principal sources of human infection"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Micro .pdf p. 7 Q26 (Key D).",
        "claim": "Leptospira culture is difficult and slow; diagnosis is primarily confirmed by serology (MAT) or PCR."
    },
    "MUG3-CH7-MICR-0063": {
        "text": "A 25-year-old woman presents with a non-pruritic maculopapular rash on her trunk, palms, and soles, with flat moist labial lesions (condyloma lata). Dark-field microscopy reveals spirochetes. The most likely diagnosis is:",
        "options": [
            "Primary syphilis",
            "Secondary syphilis",
            "Chlamydia trachomatis infection",
            "Lymphogranuloma venereum"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams Microbiology Urogenital Syllabus; Murray 9th Ed.",
        "claim": "Palmar/plantar papular rash with condyloma lata and spirochetes is diagnostic of secondary syphilis."
    },
    "MUG3-CH7-MICR-0073": {
        "text": "A 25-year-old woman has a papular rash on her trunk, arms, and palms. She says the rash does not itch. Vaginal examination reveals two flat, moist, slightly raised lesions on the labia. Material from a labial lesion examined in a dark field microscope revealed spirochetes. Which of the following is the most likely diagnosis?",
        "options": [
            "Primary syphilis",
            "Secondary syphilis",
            "Chlamydia trachomatis infection",
            "Neisseria gonorrhoeae infection"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams Microbiology Department Booklet; Jawetz 28th Ed.",
        "claim": "Disseminated rash involving palms and soles with condyloma lata indicates secondary syphilis."
    },
    "MUG3-CH7-MICR-0289": {
        "text": "A 3-year-old unimmunized child presents with fever, coryza, cough, conjunctivitis, and bluish-white spots on the buccal mucosa opposite the lower molars (Koplik spots). The causative organism is:",
        "options": [
            "Adenovirus",
            "Herpes simplex virus",
            "Influenza virus",
            "Measles virus",
            "Rubella virus"
        ],
        "correctIndex": 3,
        "evidence": "Ain Shams Textbook Part 2, 'Perinatal and Congenital Infections', pp. 249–256.",
        "claim": "Koplik spots opposite lower molars with cough, coryza, and conjunctivitis are pathognomonic for measles."
    },
    "MUG3-CH7-MICR-0080": {
        "text": "A 1-day-old male infant presents with jaundice, microcephaly, sensorineural deafness, hepatosplenomegaly, and CT showing periventricular intracerebral calcifications. The causative agent is:",
        "options": [
            "Parvovirus B19",
            "Human immunodeficiency virus",
            "Cytomegalovirus",
            "Hepatitis B virus",
            "Rubella virus"
        ],
        "correctIndex": 2,
        "evidence": "Ain Shams Textbook Part 2, 'Perinatal and Congenital Infections', pp. 249–256.",
        "claim": "Periventricular intracerebral calcifications, microcephaly, and sensorineural hearing loss define congenital CMV."
    },
    "MUG3-CH7-MICR-0292": {
        "text": "An obstetrician sees a pregnant patient exposed to rubella virus at 18 weeks of gestation with unknown vaccination history. The best immediate course of action is:",
        "options": [
            "Administer rubella immune globulin",
            "Order a rubella antibody titer to determine immune status",
            "Reassure the patient without testing",
            "Terminate the pregnancy"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams Textbook Part 2, pp. 249–256.",
        "claim": "Immediate IgG/IgM serology determines preexisting immunity and guides management."
    },
    "MUG3-CH7-MICR-0293": {
        "text": "A 32-year-old woman developed fever, headache, malaise, and parotid swelling followed one week later by pelvic pain and tenderness (oophoritis). She was infected with:",
        "options": [
            "Cytomegalovirus",
            "Mumps virus",
            "Rabies virus",
            "Respiratory syncytial virus",
            "Rubella virus"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams Textbook Part 2, pp. 249–256.",
        "claim": "Mumps virus causes parotitis and can disseminate to gonads causing oophoritis or orchitis."
    },
    "MUG3-CH7-MICR-0083": {
        "text": "Which of the following would be present in a neonate with congenital rubella syndrome (CRS) but not in a neonate with congenital CMV infection?",
        "options": [
            "Intrauterine growth retardation",
            "Hepatosplenomegaly",
            "Mental retardation",
            "Patent ductus arteriosus",
            "Sensorineural hearing loss"
        ],
        "correctIndex": 3,
        "evidence": "Ain Shams Textbook Part 2, pp. 249–256.",
        "claim": "Cardiovascular malformations (PDA, pulmonary artery stenosis) are characteristic of Congenital Rubella Syndrome."
    },
    "MUG3-CH7-MICR-0086": {
        "text": "A 25-year-old woman with acute PID. Which one is the LEAST informative laboratory test?",
        "options": [
            "Gram stain of cervical exudate showing intracellular diplococci",
            "Culture of cervical exudate on Thayer-Martin agar",
            "Fluorescent-antibody / NAAT test for Chlamydia",
            "Complement fixation test showing rise in antibody titer"
        ],
        "correctIndex": 3,
        "evidence": "Ain Shams Textbook Part 2, 'Infections of the Genital System', pp. 170–184.",
        "claim": "Complement fixation serology is slow, non-specific for acute management, and least informative compared to direct microbial detection."
    },
    "MUG3-CH7-MICR-0104": {
        "text": "All of the following are risk factors of UTI, Except:",
        "options": [
            "Males are more likely to get urinary tract infections, due to closeness of urethra to anal opening",
            "Sexually active women",
            "Senile prostatic hypertrophy",
            "Diabetes mellitus and pregnancy"
        ],
        "correctIndex": 0,
        "evidence": "MCQ Micro .pdf p. 6 Q23 (Key A).",
        "claim": "Male gender is protective against uncomplicated UTI due to longer urethral length and prostatic antibacterial secretions."
    },
    "MUG3-CH7-MICR-0129": {
        "text": "Which of the following statements is incorrect?",
        "options": [
            "Enterobacter may cause hospital-acquired infections",
            "Staph. saprophyticus is novobiocin resistant and nonhemolytic",
            "Staph. saprophyticus causes honeymoon cystitis",
            "Renal involvement in TB can be part of disseminated infection",
            "Urogenital TB is an infrequent extrapulmonary location for M. tuberculosis lesions"
        ],
        "correctIndex": 4,
        "evidence": "MCQ Micro .pdf p. 2 Q9 (Key E).",
        "claim": "Genitourinary tuberculosis is one of the most common forms of extrapulmonary tuberculosis."
    },
    "MUG3-CH7-MICR-0122": {
        "text": "Urinary tract infection is not caused by:",
        "options": [
            "Escherichia coli",
            "Klebsiella pneumoniae",
            "Pseudomonas aeruginosa",
            "Proteus mirabilis",
            "Shigella dysenterica"
        ],
        "correctIndex": 4,
        "evidence": "MCQ Micro .pdf p. 4 Q13 (Key E).",
        "claim": "Shigella causes bacillary dysentery in the gastrointestinal tract and does not colonize or infect the urinary tract."
    },
    "MUG3-CH7-MICR-0124": {
        "text": "All of the following statements are true regarding E. coli, EXCEPT:",
        "options": [
            "E. coli is the most common cause of urinary tract infection",
            "Urinary tract infection can result in bacteremia with sepsis",
            "Most urinary tract infections are caused by uropathogenic E. coli",
            "These organisms produce hemolysin facilitating tissue invasion",
            "In urinary tract infections with E. coli, the urine becomes alkaline promoting stone formation"
        ],
        "correctIndex": 4,
        "evidence": "MCQ Micro .pdf p. 4 Q15 (Key E).",
        "claim": "Urine alkalinization and staghorn calculi formation are caused by urease-producing Proteus species, not E. coli."
    },
    "MUG3-CH7-MICR-0126": {
        "text": "All of the following statements are true regarding Klebsiella, EXCEPT:",
        "options": [
            "Klebsiella are gram-negative bacilli which are thick and short",
            "They are non-motile and produce large capsules",
            "This organism grows well on ordinary nutrient media",
            "Colonies are large, raised, moist and non-mucoid",
            "They produce pink lactose-fermenting colonies on MacConkey agar"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Micro .pdf p. 4 Q17 (Key D).",
        "claim": "Klebsiella pneumoniae produces copious polysaccharide capsule, giving characteristic highly mucoid, viscid colonies."
    },
    "MUG3-CH7-MICR-0130": {
        "text": "Which of the following statements is false about asymptomatic bacteriuria?",
        "options": [
            "Asymptomatic bacteriuria is very common in clinical practice",
            "Most patients will never develop symptomatic UTI",
            "Most non-pregnant patients have no adverse consequences",
            "Most non-pregnant patients with asymptomatic bacteriuria benefit from antibiotic treatment",
            "Obstructive uropathy increases the likelihood of bacteriuria"
        ],
        "correctIndex": 3,
        "evidence": "MCQ Micro .pdf p. 5 Q22 (Key D).",
        "claim": "Routine antibiotic treatment of asymptomatic bacteriuria in non-pregnant patients offers no clinical benefit and promotes resistance."
    },
    "MUG3-CH7-MICR-0131": {
        "text": "All of the following are risk factors of UTI, Except:",
        "options": [
            "Males are more likely to get urinary tract infections",
            "Sexually active women",
            "Honeymoon cystitis",
            "Senile prostatic hypertrophy",
            "Diabetes mellitus and pregnancy"
        ],
        "correctIndex": 0,
        "evidence": "MCQ Micro .pdf p. 6 Q23 (Key A).",
        "claim": "Males are significantly less prone to UTI due to anatomical length of urethra."
    },
    "MUG3-CH7-MICR-0132": {
        "text": "All of the following are correct regarding CAUTI, Except:",
        "options": [
            "CAUTI are the most common infections in health care facilities",
            "Placement of urinary catheter disrupts host defense mechanisms",
            "The urinary catheter helps the complete elimination of bladder urine without a residual pool of stagnant urine",
            "Causative bacteria can arise from endogenous skin and urogenital flora",
            "Biofilm protects bacteria from host immune clearance"
        ],
        "correctIndex": 2,
        "evidence": "MCQ Micro .pdf p. 6 Q24 (Key C).",
        "claim": "Indwelling catheters impede complete bladder drainage and promote a stagnant urine pool above the balloon."
    },
    "MUG3-CH7-MICR-0291": {
        "text": "A 1-day-old male infant presents with jaundice, microcephaly, sensorineural deafness, hepatosplenomegaly, and CT showing periventricular intracerebral calcifications. The causative agent is:",
        "options": [
            "Parvovirus B19",
            "Human immunodeficiency virus",
            "Cytomegalovirus",
            "Hepatitis B virus",
            "Rubella virus"
        ],
        "correctIndex": 2,
        "evidence": "Ain Shams Textbook Part 2, pp. 249–256.",
        "claim": "Microcephaly with periventricular intracerebral calcifications and sensorineural hearing loss is classic congenital CMV."
    },
    "MUG3-CH7-MICR-0317": {
        "text": "Lymphogranuloma venereum (LGV) is a sexually transmitted infection presenting with a transient genital ulcer followed by suppurative inguinal lymphadenitis. It is caused by:",
        "options": [
            "Treponema pallidum",
            "Herpes simplex virus",
            "Haemophilus ducreyi",
            "Chlamydia trachomatis serotypes L1, L2, or L3"
        ],
        "correctIndex": 3,
        "evidence": "Ain Shams Textbook Part 2, 'Infections of the Genital System', pp. 170–184.",
        "claim": "Chlamydia trachomatis L1, L2, and L3 serovars cause lymphogranuloma venereum."
    },
    "MUG3-CH7-MICR-0324": {
        "text": "A 10-day-old neonate has clusters of vesicles on the scalp and periocular skin. Tzanck smear of vesicle base demonstrates multinucleated giant cells with intranuclear inclusions. The most likely causative agent is:",
        "options": [
            "Cytomegalovirus",
            "Herpes simplex virus (HSV-2)",
            "Varicella-zoster virus",
            "Rubella virus"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams Textbook Part 2, pp. 249–256.",
        "claim": "Neonatal cutaneous vesicles with multinucleated giant cells and Cowdry A intranuclear inclusions represent neonatal herpes simplex virus."
    }
}


# ==============================================================================
# MILESTONE 3 ITERATION 4: CLINICAL CORRECTIONS & EXCLUSIONS
# ==============================================================================

ITERATION4_CORRECTIONS = {
    # 1. Chapter 8 (Parasitology) Key Corrections & Cleanups
    "MUG3-CH8-PARA-0002": {
        "options": ["Giardia lamblia", "Toxoplasma gondii", "Plasmodium species", "Trichomonas vaginalis"],
        "correctIndex": 3,
        "evidence": "Ain Shams Parasitology Syllabus; Markell & Voge's Medical Parasitology 9th Ed, Ch. 4; MCQ Para .pdf p. 1.",
        "claim": "Trichomonas vaginalis is the only flagellate protozoon infecting the human genitourinary tract. Giardia lamblia is an intestinal flagellate; Toxoplasma and Plasmodium are apicomplexan sporozoa.",
        "distractor_notes": {
            0: "Giardia lamblia is an intestinal flagellate inhabiting the duodenum and upper jejunum.",
            1: "Toxoplasma gondii is an obligate intracellular apicomplexan tissue parasite.",
            2: "Plasmodium species are intraerythrocytic sporozoan parasites causing malaria."
        }
    },
    "MUG3-CH8-PARA-0004": {
        "options": ["Cysts only", "Oocysts only", "Trophozoites only", "Both Cysts & Trophozoites"],
        "correctIndex": 2,
        "evidence": "Ain Shams Parasitology Syllabus; Manson's Tropical Diseases 23rd Ed, Ch. 58; MCQ Para .pdf p. 1.",
        "claim": "Trichomonas vaginalis exists solely in the trophozoite form; it completely lacks a cyst stage in its life cycle, transmitting directly via trophozoites during sexual intercourse.",
        "distractor_notes": {
            0: "Trichomonas vaginalis does not form cysts.",
            1: "Oocysts are formed by coccidian parasites (e.g. Cryptosporidium, Toxoplasma), not Trichomonas.",
            3: "Trichomonas vaginalis possesses only a trophozoite stage with no cystic form."
        }
    },
    "MUG3-CH8-PARA-0029": {
        "options": ["having cercaria in the life cycle", "having snail in the life cycle", "having separate sexes", "none of the above"],
        "correctIndex": 2,
        "evidence": "Ain Shams Textbook Part 2, 'Schistosomiasis', pp. 170–180; MCQ Para .pdf p. 3 Q23.",
        "claim": "Unlike virtually all other human trematodes (flukes) which are hermaphroditic, Schistosoma species are uniquely dioecious (unisexual), exhibiting separate male and female adult worms. Cercariae and snail intermediate hosts are shared by all digenetic trematodes.",
        "distractor_notes": {
            0: "All digenetic flukes possess cercariae in their life cycle.",
            1: "All digenetic flukes require a snail intermediate host.",
            3: "Separate sexes is the definitive characteristic distinguishing schistosomes from other flukes."
        }
    },
    "MUG3-CH8-PARA-0030": {
        "options": ["small cercaria", "cercaria without tail", "carried directly to branches of portal vein", "carried directly to pelvic and vesical plexus"],
        "correctIndex": 1,
        "evidence": "Markell & Voge's Medical Parasitology, Ch. 7; MCQ Para .pdf p. 4 Q28.",
        "claim": "During transcutaneous penetration, the furcocercous cercaria sheds its bifurcated tail and surface glycocalyx, transforming into a schistosomulum (a cercaria without tail)."
    },
    "MUG3-CH8-PARA-0031": {
        "options": ["lung vessels", "systemic circulation", "intrahepatic branches of portal vein", "vesical and pelvic plexuses of veins"],
        "correctIndex": 2,
        "evidence": "Ain Shams Parasitology Notes; Manson's Tropical Diseases 23rd Ed; MCQ Para .pdf p. 4 Q29.",
        "claim": "Schistosomulae migrate via systemic capillaries to the intrahepatic portal veins, where they develop and mature into sexually dimorphic adult worms over 6 weeks before migrating to pelvic venules."
    },
    "MUG3-CH8-PARA-0033": {
        "options": ["dermatitis", "skin irritation", "hepatomegaly", "papular rash"],
        "correctIndex": 2,
        "evidence": "Ain Shams Textbook Part 2, pp. 170–180; MCQ Para .pdf p. 4 Q31.",
        "claim": "Cercarial penetration causes transient maculopapular cercarial dermatitis (swimmer's itch) and skin irritation during the invasive stage. Hepatomegaly occurs later in the toxemic/Katayama or chronic stages, making it the designated exception."
    },
    "MUG3-CH8-PARA-0034": {
        "options": ["stage of invasion", "stage of egg deposition", "stage of migration", "chronic stage"],
        "correctIndex": 2,
        "evidence": "Ain Shams Parasitology Notes; Markell & Voge's Medical Parasitology, Ch. 7; MCQ Para .pdf p. 5 Q33.",
        "claim": "Haemoptysis and transient verminous pneumonitis occur during the migration stage as schistosomulae break through pulmonary alveolar capillaries into the pulmonary circulation."
    },
    "MUG3-CH8-PARA-0038": {
        "options": ["Copper sulphate", "Paris green", "Sodium pentachlorophenate", "Bayluscide"],
        "correctIndex": 1,
        "evidence": "WHO Molluscicide Guidelines; Ain Shams Parasitology Notes; MCQ Para .pdf p. 5 Q37.",
        "claim": "Paris green (copper acetoarsenite) is an insecticide/larvicide used for mosquito control, NOT a molluscicide. Copper sulphate, sodium pentachlorophenate, and bayluscide (niclosamide) are established molluscicides used to eliminate snail intermediate hosts."
    },
    "MUG3-CH8-PARA-0039": {
        "options": ["treatment of adult worm", "snail destruction", "protection from cercarial penetration", "other purpose"],
        "correctIndex": 2,
        "evidence": "Ain Shams Parasitology Notes; Manson's Tropical Diseases; MCQ Para .pdf p. 5 Q38.",
        "claim": "Dimethyl phthalate is a topical chemical repellent applied to the skin to inhibit cercarial penetration during unavoidable contact with infested canal water."
    },
    "MUG3-CH8-PARA-0041": {
        "options": ["pseudopodia", "flagellae", "none of the above"],
        "correctIndex": 1,
        "evidence": "Markell & Voge's Medical Parasitology 9th Ed, Ch. 4; MCQ Para .pdf p. 6 Q48.",
        "claim": "Trichomonas vaginalis is an active flagellate that moves with characteristic jerky, rotary motility propelled by 4 anterior free flagella and a recurrent flagellum forming an undulating membrane."
    },
    "MUG3-CH8-PARA-0042": {
        "options": ["two nuclei", "cilia", "prominent parabasal body", "cyst stage"],
        "correctIndex": 2,
        "evidence": "Markell & Voge's Medical Parasitology, Ch. 4; MCQ Para .pdf p. 7 Q75.",
        "claim": "Trichomonas vaginalis is characterized by a prominent parabasal body and filament, a single nucleus, and an axostyle. It never forms cysts."
    },
    "MUG3-CH8-PARA-0043": {
        "options": ["Trichomonas hominis", "Dientamoeba fragilis", "Trichomonas vaginalis", "Retortamonas hominis"],
        "correctIndex": 2,
        "evidence": "Ain Shams Parasitology Syllabus; Jawetz Medical Microbiology 28th Ed; MCQ Para .pdf p. 7 Q76.",
        "claim": "Trichomonas vaginalis is primarily transmitted through sexual intercourse. Trichomonas hominis is a non-pathogenic commensal of the large intestine transmitted fecal-orally."
    },
    "MUG3-CH8-PARA-0044": {
        "options": ["the small intestine", "the large intestine", "the prostate", "none of the above"],
        "correctIndex": 2,
        "evidence": "Ain Shams Textbook Part 2, 'Infections of the Genital System', pp. 170–184; MCQ Para .pdf p. 7.",
        "claim": "In infected males, Trichomonas vaginalis colonizes the prostate gland, urethra, and seminal vesicles, frequently causing latent asymptomatic infection. It does not colonize the gastrointestinal tract."
    },
    "MUG3-CH8-PARA-0045": {
        "options": ["Entamoeba histolytica", "Giardia lamblia", "Trichomonas vaginalis", "Entamoeba coli"],
        "correctIndex": 2,
        "evidence": "Ain Shams Parasitology Notes; Markell & Voge's Medical Parasitology, Ch. 4; MCQ Para .pdf p. 8 Q82.",
        "claim": "Entamoeba histolytica, Giardia lamblia, and Entamoeba coli all produce resistant cystic stages. Trichomonas vaginalis exists solely as trophozoites and lacks a cyst stage."
    },

    # 2. Chapter 7 (Microbiology) Fixes
    "MUG3-CH7-MICR-0065": {
        "text": "A 25 years old woman in her last month of pregnancy visited her sister who had a boy with typical picture of chicken pox. She was worried that she might contract the infection. Serological test revealed absence of specific antibodies. What will you recommend for her?",
        "options": [
            "Antiviral drugs",
            "Interferon",
            "Live attenuated varicella vaccine",
            "Reassure her that it is not a problem",
            "Varicella zoster immunoglobulins"
        ],
        "correctIndex": 4,
        "evidence": "CDC/ACIP Guidelines; Ain Shams Textbook Part 2, 'Perinatal & Congenital Infections', pp. 249–256; genital infection mcq.pdf p. 3 Q15.",
        "claim": "Live attenuated varicella vaccine is strictly contraindicated in pregnancy due to the risk of fetal varicella syndrome. Susceptible non-immune pregnant women exposed to varicella should receive passive immunization with Varicella Zoster Immune Globulin (VZIG) within 96 to 240 hours of exposure to prevent maternal and congenital complications.",
        "distractor_notes": {
            0: "Oral antivirals (acyclovir) are used for active maternal chickenpox treatment, not primary post-exposure prophylaxis in asymptomatic exposed individuals.",
            1: "Interferon has no role in post-exposure prophylaxis for varicella.",
            2: "Live attenuated varicella vaccine is contraindicated in pregnancy due to the risk of fetal varicella syndrome.",
            3: "Reassurance alone is dangerous; maternal and neonatal varicella carry high morbidity without post-exposure prophylaxis."
        }
    },
    "MUG3-CH7-MICR-0076": {
        "text": "A 25 years old woman in her last month of pregnancy visited her sister who had a boy with typical picture of chicken pox. She was worried that she might contract the infection. Serological test revealed absence of specific antibodies. What will you recommend for her?",
        "options": [
            "Antiviral drugs",
            "Interferon",
            "Live attenuated varicella vaccine",
            "Reassure her that it is not a problem",
            "Varicella zoster immunoglobulins"
        ],
        "correctIndex": 4,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Perinatal & Congenital Infections', pp. 249–256; CDC/ACIP Guidelines; genital infection mcq.pdf p. 3 Q15.",
        "claim": "Live attenuated varicella vaccine is strictly contraindicated in pregnancy due to the risk of fetal varicella syndrome. Susceptible non-immune pregnant women exposed to varicella should receive passive immunization with Varicella Zoster Immune Globulin (VZIG) within 96 to 240 hours of exposure to prevent maternal and congenital complications.",
        "distractor_notes": {
            0: "Oral antivirals (acyclovir) are used for active maternal chickenpox treatment, not primary post-exposure prophylaxis in asymptomatic exposed individuals.",
            1: "Interferon has no role in post-exposure prophylaxis for varicella.",
            2: "Live attenuated varicella vaccine is strictly contraindicated in pregnancy due to the risk of fetal varicella syndrome.",
            3: "Reassurance alone is dangerous; maternal and neonatal varicella carry high morbidity without post-exposure prophylaxis."
        }
    },
    "MUG3-CH7-MICR-0069": {
        "text": "A neonate was born with a small head (microcephaly), jaundice, and hepatosplenomegaly. Urine contained multinucleated giant cells with intranuclear inclusions. Diagnosis is:",
        "options": [
            "Rubella infection acquired in utero.",
            "Cytomegalovirus infection acquired in utero.",
            "Human immunodeficiency virus acquired in utero.",
            "Hepatitis B virus acquired in utero.",
            "Hepatitis C virus acquired in utero."
        ],
        "correctIndex": 1,
        "evidence": "Jawetz Medical Microbiology 28th Ed, Ch. 33; Ain Shams Textbook Part 2, pp. 249–256; Urogenital Module - Microbiology Department MCQs.pdf p. 1 Q34.",
        "claim": "Microcephaly, jaundice, hepatosplenomegaly, and giant cells with basophilic intranuclear inclusions (owl's eye cytomegalic cells) in neonatal urine sediment are classic diagnostic features of congenital Cytomegalovirus (CMV) infection.",
        "distractor_notes": {
            0: "Congenital rubella presents classically with cataracts, sensorineural deafness, and patent ductus arteriosus, without cytomegalic inclusion cells in urine.",
            2: "In utero HIV causes progressive immunodeficiency and opportunistic infections in infancy, not cytomegalic intranuclear inclusions.",
            3: "Hepatitis B acquired vertically typically produces asymptomatic carrier status, not microcephaly with cytomegalic inclusion cells.",
            4: "Hepatitis C does not cause microcephaly or giant cells with intranuclear inclusions."
        }
    },

    # 3. Chapter 5 (Pathology & Trapped Pharmacology) Fixes
    "MUG3-CH5-PATH-0267": {
        "text": "A 61 year old female has had increasing nausea and vomiting for several months accompanied by a 10 kg weight loss. An upper endoscopy reveals a 3 x 5 cm mass located on the lesser curvature of the stomach. Which of the following ovarian neoplasms is most likely to be present?",
        "options": [
            "Krukenberg tumor",
            "Endometrioid carcinoma",
            "Serous cystadenocarcinoma",
            "Clear cell carcinoma",
            "Mucinous cystadenocarcinoma"
        ],
        "correctIndex": 0,
        "evidence": "Robbins & Cotran Pathologic Basis of Disease 10th Ed, Ch. 22; Urogenital Module - Pathology Department MCQs.pdf p. 57 Q83; Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Diseases of Fallopian Tubes & Ovaries', pp. 115–125.",
        "claim": "Krukenberg tumor is a metastatic mucinous signet-ring cell adenocarcinoma to the ovaries, characteristically bilaterally presenting secondary to a primary gastrointestinal malignancy, most commonly gastric adenocarcinoma located on the stomach curvature.",
        "distractor_notes": {
            1: "Endometrioid carcinoma is a primary epithelial neoplasm of the ovary commonly associated with endometriosis or endometrial hyperplasia.",
            2: "Serous cystadenocarcinoma is the most common primary malignant epithelial ovarian tumor, not secondary to gastric carcinoma.",
            3: "Clear cell carcinoma is a primary ovarian epithelial tumor characterized by clear cytoplasm containing glycogen.",
            4: "Primary mucinous cystadenocarcinoma is usually unilateral, multiloculated, and large, not presenting as a metastatic lesion from a gastric ulcerating mass."
        }
    },
    "MUG3-CH5-PATH-2990": {
        "text": "A 61 year old female has had increasing nausea and vomiting for several months accompanied by a 10 kg weight loss. An upper endoscopy reveals a 3 x 5 cm mass located on the lesser curvature of the stomach. Which of the following ovarian neoplasms is most likely to be present?",
        "options": [
            "Krukenberg tumor",
            "Endometrioid carcinoma",
            "Serous cystadenocarcinoma",
            "Clear cell carcinoma",
            "Mucinous cystadenocarcinoma"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 2, 'Diseases of Fallopian Tubes & Ovaries', pp. 115–125; Robbins & Cotran Pathologic Basis of Disease 10th Ed, Ch. 22; Urogenital Module - Pathology Department MCQs.pdf p. 57 Q83.",
        "claim": "Krukenberg tumor is a metastatic mucinous signet-ring cell adenocarcinoma to the ovaries, characteristically bilaterally presenting secondary to a primary gastrointestinal malignancy, most commonly gastric adenocarcinoma located on the stomach curvature.",
        "distractor_notes": {
            1: "Endometrioid carcinoma is a primary epithelial neoplasm of the ovary commonly associated with endometriosis or endometrial hyperplasia.",
            2: "Serous cystadenocarcinoma is the most common primary malignant epithelial ovarian tumor, not secondary to gastric carcinoma.",
            3: "Clear cell carcinoma is a primary ovarian epithelial tumor characterized by clear cytoplasm containing glycogen.",
            4: "Primary mucinous cystadenocarcinoma is usually unilateral, multiloculated, and large, not presenting as a metastatic lesion from a gastric ulcerating mass."
        }
    },
    "MUG3-CH5-PATH-0306": {
        "options": ["Digoxin", "Succinylcholine", "ACE inhibitors", "Corticosteroids"],
        "correctIndex": 3,
        "evidence": "Katzung Basic & Clinical Pharmacology 15th Ed, Ch. 15; ALAA uro mcq.pdf p. 2 Q8 (Department Key p. 5: 8=d).",
        "claim": "Digoxin, succinylcholine, and ACE inhibitors induce hyperkalemia. Corticosteroids exhibit mineralocorticoid activity, stimulating principal cell Na+/K+-ATPase and ENac to enhance renal potassium excretion, inducing hypokalemia, making them the true exception."
    },
    "MUG3-CH5-PATH-0307": {
        "options": ["Insulin & glucose", "Sodium bicarbonate", "Intravenous calcium", "Loop diuretics"],
        "correctIndex": 2,
        "evidence": "Katzung Basic & Clinical Pharmacology 15th Ed, Ch. 15; Harrison's Principles of Internal Medicine 21st Ed, Ch. 50; ALAA uro mcq.pdf p. 2 Q10 (Key p. 5: 10=c).",
        "claim": "Insulin with glucose, sodium bicarbonate, and loop diuretics actively lower serum potassium levels by intracellular shifting or renal excretion. Intravenous calcium membrane-stabilizes the cardiac resting membrane potential without lowering serum potassium concentration, making it the true exception."
    },
    "MUG3-CH5-PATH-0310": {
        "options": ["Zoledronic acid", "Glucocorticoids", "Loop Diuretics", "Thiazide diuretics"],
        "correctIndex": 3,
        "evidence": "Katzung Basic & Clinical Pharmacology 15th Ed, Ch. 15; ALAA uro mcq.pdf p. 3 Q15 (Department Key p. 5: 15=d).",
        "claim": "Zoledronic acid, glucocorticoids, and loop diuretics (furosemide) are therapeutic options to manage hypercalcemia. Thiazide diuretics enhance renal tubular calcium reabsorption and aggravate hypercalcemia; hence they should be avoided in hypercalcemia."
    },

    # 4. Chapter 1 (Anatomy) & Chapter 3 (Physiology) Repairs
    "MUG3-CH1-ANAT-0596": {
        "text": "A 65 years old male patient complains of difficulty in urinating. When the doctor touches inside his anus, which structure may be enlarged?",
        "options": [
            "Seminal vesicle",
            "Prostate",
            "Bulbourethral gland",
            "Ampulla ductus deferentis",
            "Urinary bladder"
        ],
        "correctIndex": 1,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 45–48; Part 2, p. 86; MCQ Anatomy  (1).pdf-p17-Q104.",
        "claim": "In an elderly male with lower urinary tract obstruction symptoms (BPH), digital rectal examination palpates the posterior surface of the enlarged prostate gland directly through the anterior rectal wall.",
        "distractor_notes": {
            0: "Seminal vesicles lie superior to the prostate base and are not palpable unless pathologically indurated.",
            2: "Bulbourethral glands lie in the deep perineal pouch inferior to the prostate and are not palpable on DRE.",
            3: "Ampulla of ductus deferens lies medial to the seminal vesicle above the prostate, not routinely evaluated on DRE.",
            4: "Urinary bladder lies anterior to the rectum but DRE specifically evaluates the prostate gland in prostatism."
        }
    },
    "MUG3-CH1-ANAT-0645": {
        "text": "The collecting tubules of the kidney are derived from the:",
        "options": [
            "Ureteric bud",
            "Metanephric blastema",
            "Mesonephric ducts",
            "Paramesonephric duct",
            "Allantois"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 97–100; Langman's Medical Embryology 14th Ed., Ch. 16; MCQ Anatomy .pdf-p12-Q60 answer grid: 60 A.",
        "claim": "The ureteric bud branches to form the renal collecting system: ureter, renal pelvis, calyces, and collecting tubules. The metanephric blastema forms the secretory nephrons.",
        "distractor_notes": {
            1: "Metanephric blastema differentiates into the secretory nephrons (Bowman capsule through distal convoluted tubule).",
            2: "Mesonephric ducts form male genital ducts (epididymis, vas deferens, ejaculatory duct).",
            3: "Paramesonephric ducts develop into female genital tract structures (fallopian tubes, uterus, upper vagina).",
            4: "Allantois contributes to the development of the urachus and median umbilical ligament."
        }
    },
    "MUG3-CH1-ANAT-0904": {
        "text": "A 32-year-old woman operated for bilateral pudendal nerve block at the time of her second delivery. To Inject the anaesthetic agent near the pudendal nerve the anaesthetic consultant Inserted a finger into the vagina and pressed laterally to palpate which landmark?",
        "options": [
            "White line of levator ani",
            "Coccyx",
            "Ischial spine",
            "Lateral fornix",
            "Obturator canal"
        ],
        "correctIndex": 2,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, 'Perineum & Pudendal Nerve', pp. 88–92; Snell's Clinical Anatomy by Regions 10th Ed, Ch. 8.",
        "claim": "The landmark for administering a transvaginal pudendal nerve block is the ischial spine. The ischial spine is palpated transvaginally through the lateral vaginal wall, and the needle is passed through the sacrospinous ligament adjacent to the ischial spine where the pudendal nerve traverses.",
        "distractor_notes": {
            0: "The white line (tendinous arch) of levator ani extends from the pubic body to the ischial spine, serving as origin for levator ani, but is not the target injection landmark.",
            1: "The coccyx is a midline posterior bony structure, not the lateral landmark palpated for pudendal nerve blockade.",
            3: "The lateral fornix of the vagina is the entry route of palpation, but the bony landmark palpated through the fornix is the ischial spine.",
            4: "The obturator canal transmits the obturator nerve and vessels into the medial thigh compartment, far anterior and superior to the pudendal nerve."
        }
    },
    "MUG3-CH1-ANAT-0988": {
        "text": "The collecting tubules of the kidney are derived from the:",
        "options": [
            "Ureteric bud",
            "Metanephric blastema",
            "Mesonephric ducts",
            "Paramesonephric duct",
            "Allantois"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 97–100; Langman's Medical Embryology 14th Ed., Ch. 16; MCQ Anatomy .pdf-p12-Q60 answer grid: 60 A.",
        "claim": "The ureteric bud branches to form the renal collecting system: ureter, renal pelvis, calyces, and collecting tubules. The metanephric blastema forms the secretory nephrons.",
        "distractor_notes": {
            1: "Metanephric blastema differentiates into the secretory nephrons (Bowman capsule through distal convoluted tubule).",
            2: "Mesonephric ducts form male genital ducts (epididymis, vas deferens, ejaculatory duct).",
            3: "Paramesonephric ducts develop into female genital tract structures (fallopian tubes, uterus, upper vagina).",
            4: "Allantois contributes to the development of the urachus and median umbilical ligament."
        }
    },
    "MUG3-CH1-ANAT-0614": {
        "text": "Left gonadal vein drains into:",
        "options": [
            "Left renal vein",
            "Inferior vena cava",
            "Azygous vein",
            "Iliac vein"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 11–14; MCQ Anatomy  (1).pdf-p24-Q144.",
        "claim": "The left gonadal vein drains perpendicularly into the left renal vein, whereas the right gonadal vein drains directly into the inferior vena cava.",
        "distractor_notes": {
            1: "Inferior vena cava receives the right gonadal vein directly, but not the left under normal anatomy.",
            2: "Azygous vein drains thoracic and abdominal wall veins and terminates in the superior vena cava.",
            3: "Iliac veins unite to form the inferior vena cava; gonadal veins do not terminate in iliac veins."
        }
    },
    "MUG3-CH1-ANAT-0811": {
        "text": "Regarding the ureter, the correct statement is:",
        "options": [
            "Narrowed at pelviureteric junction",
            "Is 10 cm long",
            "Lower end of ureter is supplied by the ureteric branch of the renal artery",
            "It is endodermal in origin",
            "It is related to the second part of the duodenum on the right"
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 19–23; anatomy renal.pdf-p11-Q66 answer grid: 66 a.",
        "claim": "The ureter has normal constrictions at the pelviureteric junction (PUJ), pelvic brim, and ureterovesical junction. It is 25 cm (not 10 cm) long, mesodermal in origin, and its upper end is supplied by the renal artery while its lower end is supplied by pelvic arteries.",
        "distractor_notes": {
            1: "The adult ureter is approximately 25 cm (10 inches) long, not 10 cm.",
            2: "The lower end of the ureter is supplied by inferior vesical and middle rectal arteries, not the renal artery.",
            3: "The ureter develops from the ureteric bud of intermediate mesoderm origin, not endoderm.",
            4: "Choice A is the verified faculty exam key (Q66: 'a')."
        }
    },
    "MUG3-CH3-PHYS-0404": {
        "text": "Carbonic anhydrase inhibition leads to all of the following EXCEPT:",
        "options": [
            "Metabolic alkalosis.",
            "Decrease in H+ secretion in the proximal tubule.",
            "Decrease HCO3-, Na+ and Cl- reabsorption in the proximal tubule.",
            "Excretion of alkaline urine."
        ],
        "correctIndex": 0,
        "evidence": "Ain Shams University Urogenital Module Textbook 4th Edition Part 1, pp. 53–57; UG_NERD mcqs.pdf-p26-Q79.",
        "claim": "Carbonic anhydrase inhibition impairs proximal tubular H+ secretion and HCO3- reabsorption, producing urinary bicarbonate wasting, alkaline urine, and normal anion gap metabolic acidosis, NOT metabolic alkalosis."
    }
}

ITERATION4_EXCLUSIONS = {
    "MUG3-CH1-ANAT-0597": {
        "sourceFile": "Anatomy/MCQ Anatomy  (1).pdf",
        "sourceOccurrence": "MUG3-CH1-ANAT-0597",
        "stem": "An elderly patient is h still feels as though he n Prostatic hypertrophy, whic! seminal colliculus interureteric crest ampulla trigone ; specific condition uula struction of the urinary tract. The sp paeoom in ob:",
        "reason": "unresolvable_ocr_bleed",
        "details": "829-character multi-line garbage collision block formed from a CamScanner scan boundary error on page 17 of MCQ Anatomy (1).pdf. It fuses chopped fragments of Q105 (BPH symptoms), Q106 (prostatic lobes), Q107 (urethral injury), Q108 (prostatic urethra), Q109 (shortest part of male urethra), and Q110 (female urethra) into 2 pseudo-options. All constituent questions already exist independently in the bank (e.g. MUG3-CH1-ANAT-0442). Unresolvable OCR collision."
    },
    "MUG3-CH1-ANAT-0779": {
        "sourceFile": "Anatomy/anatomy renal.pdf",
        "sourceOccurrence": "MUG3-CH1-ANAT-0779",
        "stem": "Regarding the kidneys all of the followings are true EXCEPT a, Each weighs about 340 grams",
        "reason": "unresolvable_ocr_bleed",
        "details": "Severe multi-question collision between Question 15 ('Regarding the kidneys all of the followings are true EXCEPT') and Question 16 ('Left gonadal vein drains into:'). Stem swallowed option A, option 0 merged choices B, C, D, option 1 merged choice E with the stem of Q16, and options 2, 3, 4 are the choices of Q16. Q15 is already present cleanly as MUG3-CH1-ANAT-0234 and Q16 is present as MUG3-CH1-ANAT-0614."
    },
    "MUG3-CH1-ANAT-0554": {
        "sourceFile": "Anatomy/MCQ Anatomy  (1).pdf",
        "sourceOccurrence": "MUG3-CH1-ANAT-0554",
        "stem": "The structure passing through the hilu",
        "reason": "severed_ocr_fragment",
        "details": "Severed stem ('The structure passing through the hilu'), deficient options count (<3 options, only 2), and severe two-column OCR bleed. Option 0 is OCR bullet noise ('paoex') and option 1 is a 210-character garbled concatenation of anterior kidney relations (Q35) and hilum structures (Q36). Cannot be reconstructed cleanly without speculative invention."
    },
    "MUG3-CH1-ANAT-0274": {
        "sourceFile": "Anatomy/MCQ Anatomy  (1).pdf",
        "sourceOccurrence": "MUG3-CH1-ANAT-0274",
        "stem": "Which sperms?",
        "reason": "severed_ocr_fragment",
        "details": "Severed stem ('Which sperms?') resulting from CamScanner column truncation of 'Which of the following produce sperms?', while its 5 options belong to an entirely different question ('The duct of prostate opens into'). Complete question-option mismatch resulting from OCR column misalignment."
    },
    "MUG3-CH1-ANAT-0598": {
        "sourceFile": "Anatomy/MCQ Anatomy  (1).pdf",
        "sourceOccurrence": "MUG3-CH1-ANAT-0598",
        "stem": "Which sperms?",
        "reason": "severed_ocr_fragment",
        "details": "Duplicate corrupted question with severed stem ('Which sperms?') and garbled multi-option string bleeds ('prostatic part of urethra membranous part of urethra bulbar part of urethra... penis prostate 120'). Unintelligible OCR fragment with only 3 corrupted choices."
    }
}

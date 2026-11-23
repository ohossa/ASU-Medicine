#!/usr/bin/env python3
"""
Applies final 9 essay reconstructions to src/imports/year-3/semester-1/MUG-3.json
"""

import json

BANK_PATH = "src/imports/year-3/semester-1/MUG-3.json"

FINAL_9_REPAIRS = {
    "MUG3-CH103-PHYS-0030": {
        "text": "Describe the effect of changes in plasma colloid osmotic (oncotic) pressure on Glomerular Filtration Rate (GFR). Explain the clinical conditions that cause decreased plasma oncotic pressure and their impact on net ultrafiltration pressure.",
        "modelAnswer": "Effect of Plasma Oncotic Pressure on GFR:\n1. Physiological Mechanism: According to Starling's equation for glomerular ultrafiltration, glomerular capillary plasma oncotic pressure (normally ~28-32 mmHg) acts as a major Starling force directly opposing filtration.\n2. Effect of Decreased Oncotic Pressure: A reduction in systemic plasma oncotic pressure directly increases net ultrafiltration pressure, thereby increasing the Glomerular Filtration Rate (GFR).\n3. Clinical Conditions: Occurs in severe hypoalbuminemia (plasma albumin < 2.5-3.0 g/dL) caused by nephrotic syndrome, severe hepatic cirrhosis (impaired albumin synthesis), severe protein-energy malnutrition (Kwashiorkor), or aggressive rapid volume resuscitation with protein-free crystalloids.",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Starling Equation & Opposing Force: Identifies plasma oncotic pressure as opposing filtration (1.0 mark).
2. Net Filtration Effect: Decreased oncotic pressure increases net ultrafiltration pressure and GFR (1.0 mark).
3. Clinical Causes: Severe hypoalbuminemia in nephrotic syndrome, liver failure, and malnutrition (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Plasma proteins cannot cross the intact glomerular basement membrane; oncotic pressure holds water in capillaries. Hypoalbuminemia lowers this retentive force, increasing GFR while driving peripheral edema.

**Ain Shams Faculty Curriculum Highlights:**
- Decreased plasma oncotic pressure increases GFR by elevating net glomerular filtration pressure."""
    },
    "MUG3-CH103-PHYS-0043": {
        "text": "Explain why serum albumin excretion in the urine is negligible under normal physiological conditions despite its molecular radius being smaller than the physical pore size of the glomerular barrier. Detail the role of fixed negative charges.",
        "modelAnswer": "Physiological Restriction of Albumin Filtration:\n1. Size vs Charge Barrier: Serum albumin has an effective molecular radius of ~3.55 nm, which is slightly smaller than the physical radius of glomerular endothelial fenestrae (70-100 nm) and podocyte filtration slits (25-40 nm). Theoretically, size alone would allow moderate filtration.\n2. Role of Fixed Negative Charges (Charge Selectivity): The glomerular filtration barrier is richly coated with fixed, polyanionic negatively charged glycoproteins:\n   - Glycocalyx on fenestrated endothelial cells (sialic acid, podocalyxin).\n   - Lamina rara interna and Lamina rara externa of the Glomerular Basement Membrane (GBM), heavily enriched with Heparan Sulfate Proteoglycans (agrin and perlecan).\n   - Podocyte pedicel surface coat (podocalyxin).\n3. Electrostatic Repulsion: At physiological arterial pH (7.4), circulating albumin carries a net negative charge (-19). Strong electrostatic repulsion between negative charges on albumin and fixed polyanions of the GBM repels albumin away from the filtration slits, reducing its filtration fraction to <0.001 (fractional clearance <0.05%).\n4. Clinical Correlation: Loss of GBM polyanions (as in Minimal Change Disease) abolishes charge selectivity, resulting in massive selective albuminuria.",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Physical Dimensions vs Charge: Albumin radius (~3.6 nm) vs pore size; importance of charge selectivity (1.0 mark).
2. Heparan Sulfate Proteoglycans: Fixed negative charges in lamina rara of GBM and endothelial glycocalyx (1.0 mark).
3. Electrostatic Repulsion: Like negative charges repel polyanionic albumin at physiological pH (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
The filtration barrier acts as both an isoporous molecular sieve and an electrostatic shield. Neutral dextrans of equivalent size filter much more readily than negatively charged dextrans or albumin.

**Ain Shams Faculty Curriculum Highlights:**
- Fixed negative charges on heparan sulfate proteoglycans in the basal lamina repel albumin."""
    },
    "MUG3-CH103-PHYS-0088": {
        "text": "Describe the structural characteristics and specialized physiological role of Juxtamedullary Nephrons. Explain how their long loops of Henle establish the corticomedullary osmotic gradient required for urine concentration.",
        "modelAnswer": "Juxtamedullary Nephrons and Urinary Concentration:\n1. Structural Characteristics:\n   - Comprise approximately 15% of all nephrons in the human kidney (with the remaining 85% being cortical nephrons).\n   - Renal corpuscles are situated deep within the inner renal cortex immediately adjacent to the corticomedullary junction.\n   - Loops of Henle are exceptionally long, dipping deeply into the inner renal medulla and reaching the renal papillae, accompanied by specialized hairpin capillary loops—the Vasa Recta.\n2. Physiological Function (Countercurrent Multiplication):\n   - The primary role of juxtamedullary nephrons is the generation and maintenance of the hypertonic Corticomedullary Osmotic Gradient (300 mOsm/L at cortex to 1200 mOsm/L at papilla).\n   - Thick Ascending Limb (TAL): Actively reabsorbs Na+, K+, and 2Cl- (via NKCC2) without water (water-impermeable), pumping solutes into the medullary interstitium.\n   - Descending Thin Limb: Permeable to water but impermeable to solutes; water is drawn out into the hypertonic medullary interstitium, concentrating luminal fluid.\n3. Clinical Significance: In the presence of Antidiuretic Hormone (ADH / Vasopressin), the hypertonic gradient draws water out of medullary collecting ducts through aquaporin-2 channels, allowing the kidney to concentrate urine up to 1200 mOsm/L; in ADH absence, dilute urine (50-100 mOsm/L) is excreted.",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Structural Identity: Corpuscles at corticomedullary junction with long loops of Henle penetrating inner medulla (1.0 mark).
2. Countercurrent Multiplication: Active TAL salt reabsorption establishing corticomedullary osmotic gradient (1.0 mark).
3. Water Conservation: Enables ADH-dependent water reabsorption to produce concentrated urine (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Cortical nephrons perform bulk solute reabsorption; juxtamedullary nephrons specialize in countercurrent multiplication to generate hyperosmotic medullary interstitium.

**Ain Shams Faculty Curriculum Highlights:**
- Juxtamedullary nephrons have long loops of Henle essential for concentrating and diluting urine."""
    },
    "MUG3-CH103-PHYS-0092": {
        "text": "Explain the physiological mechanism by which the Vasa Recta maintain the hyperosmolality of the medullary interstitial fluid (MIF). Differentiate between countercurrent multiplication and countercurrent exchange.",
        "modelAnswer": "Countercurrent Exchange in the Vasa Recta:\n1. Passive Nature of Countercurrent Exchange: Unlike the active countercurrent multiplier (loops of Henle), the vasa recta act as purely passive Countercurrent Exchangers, requiring no metabolic energy.\n2. Hairpin U-Shaped Architecture: Vasa recta are long, hairpin-shaped capillary loops that plunge deeply into the renal medulla alongside the loops of Henle, operating with a very low, sluggish blood flow (<10% of total renal blood flow).\n3. Stepwise Mechanism of Solute and Water Movement:\n   - Descending Capillary Limb: As blood flows down toward the hypertonic papilla (up to 1200 mOsm/L), water diffuses passively OUT of the capillaries into the hypertonic interstitium, while solutes (NaCl and urea) diffuse IN. At the tip of the hairpin loop, capillary blood osmolality matches that of the deep medullary interstitium (~1200 mOsm/L).\n   - Ascending Capillary Limb: As blood flows back toward the cortex through progressively lower interstitial osmolality (from 1200 down to 300 mOsm/L), the concentration gradients reverse: solutes (NaCl and urea) diffuse passively OUT back into the medullary interstitium, while water diffuses IN.\n4. Net Physiological Outcome: The recycled solutes remain trapped within the renal medulla, preventing the hypertonic corticomedullary gradient from being 'washed out' by the circulation.",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Passive Mechanism: Passive countercurrent exchanger requiring no metabolic energy (1.0 mark).
2. Hairpin Solute Recirculation: Solutes enter descending limb and return to interstitium in ascending limb (1.0 mark).
3. Prevention of Gradient Washout: Preserves hypertonic medullary interstitium while delivering oxygen/nutrients (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Sluggish capillary flow and hairpin geometry prevent medullary gradient dissipation. High medullary blood flow washes out the gradient, impairing urinary concentrating ability.

**Ain Shams Faculty Curriculum Highlights:**
- Vasa recta maintain medullary hyperosmolality via passive countercurrent exchange."""
    },
    "MUG3-CH105-PATH-0115": {
        "text": "Describe the anatomical course of the Left Ureter as it traverses the posterior abdominal wall and enters the pelvic cavity. Specify the major vascular structure it crosses at the pelvic brim.",
        "modelAnswer": "Anatomical Course of the Left Ureter and Pelvic Entry:\n1. Abdominal Course: The left ureter descends retroperitoneally over the anterior surface of the left Psoas major muscle, crossed obliquely anteriorly by the gonadal (testicular/ovarian) vessels, left colic vessels, and sigmoid colon and mesocolon.\n2. Entry into the Pelvic Cavity (The Pelvic Brim):\n   - Vascular Landmark: The left ureter enters the pelvis by crossing immediately anterior to the bifurcation of the Common Iliac Artery (or the origin of the External Iliac Artery), just anterior to the sacroiliac joint.\n   - Contrast with Right Ureter: The right ureter typically crosses the origin of the External Iliac Artery, whereas the left ureter crosses the bifurcation of the Common Iliac Artery.\n3. Ureteric Constriction: This crossing at the pelvic brim corresponds to the middle of the three normal physiological anatomical constrictions of the ureter (the proximal being at the ureteropelvic junction, and the distal within the bladder wall at the ureterovesical junction).\n4. Clinical Significance: The bifurcation of the common iliac artery is a frequent site for stone impaction during acute ureteral colic, and an essential anatomical surgical landmark during retroperitoneal dissection.",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Abdominal Path: Descends retroperitoneally on psoas major crossed by gonadal vessels (1.0 mark).
2. Pelvic Brim Landmark: Crosses anterior to the bifurcation of the Common Iliac Artery (1.0 mark).
3. Anatomical Constriction: Represents the middle physiological constriction where calculi frequently lodge (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
The pelvic brim marks the transition from abdominal to pelvic ureter. The pulsation of the iliac bifurcation serves as a tactile and visual guide in pelvic surgery.

**Ain Shams Faculty Curriculum Highlights:**
- Left ureter enters the pelvic brim by crossing anterior to the bifurcation of the common iliac artery."""
    },
    "MUG3-CH205-PATH-0024": {
        "text": "Describe the physiological actions of Progesterone on the cervical mucus, myometrium, and fallopian tubes during the luteal phase of the menstrual cycle and early pregnancy.",
        "modelAnswer": "Physiological Actions of Progesterone on the Female Reproductive Tract:\n1. Actions on Cervical Mucus:\n   - Progesterone renders cervical mucus thick, highly viscous, cellular, and scant in volume.\n   - Inhibits the 'spinnbarkeit' (elastic stretchability) seen in the pre-ovulatory estrogenic phase and eliminates ferning/arborization on air-dried glass slides.\n   - This dense, viscous mucus forms a physical and antimicrobial barrier ('cervical mucus plug') that impedes sperm penetration and prevents ascending bacterial colonization during the luteal phase and pregnancy.\n2. Actions on the Myometrium:\n   - Induces myometrial quiescence by hyperpolarizing smooth muscle membranes, downregulating gap junctions (connexin-43), and suppressing oxytocin and prostaglandin receptor expression, preventing premature uterine contractions.\n3. Actions on the Endometrium & Fallopian Tubes:\n   - Converts estrogen-primed proliferative endometrium into a tortuous, glycogen-rich secretory endometrium (stromal decidualization).\n   - Decreases the frequency of fallopian tube ciliary beating and muscular peristalsis, synchronizing embryo transport to the uterine cavity.",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Cervical Mucus Effect: Forms thick, viscous, non-ferning mucus blocking sperm and ascending bacteria (1.0 mark).
2. Myometrial Quiescence: Suppresses gap junctions and oxytocin receptors, preventing contractions (1.0 mark).
3. Secretory Endometrium: Converts proliferative into glycogen-rich secretory endometrium for implantation (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Progesterone antagonizes the liquefying, receptive effects of estrogen on cervical mucus, acting as a natural contraceptive barrier post-ovulation.

**Ain Shams Faculty Curriculum Highlights:**
- Progesterone causes formation of thick, sticky, cellular cervical mucus that impedes sperm passage."""
    },
    "MUG3-CH205-PATH-0252": {
        "text": "Identify the definitive infective stage of Schistosoma haematobium for human infection. Describe its morphology, mode of transmission, and the route of larval migration to the vesical venous plexus.",
        "modelAnswer": "Infective Stage and Transmission of Schistosoma haematobium:\n1. Definitive Infective Stage: The Cercaria (specifically, the fork-tailed Cercaria / Furcocercous cercaria).\n2. Morphological Characteristics: Measures ~400-500 micrometers in length, consisting of an elongated pear-shaped body with an oral sucker, a ventral sucker (acetabulum), penetration glands secreting histolytic enzymes, and a distinctive bifurcated / forked tail (furcocerca) that propels it vigorously through fresh water.\n3. Mode of Human Infection: Active transcutaneous penetration. When humans come into contact with contaminated freshwater (e.g., swimming, bathing, wading in canals), cercariae are attracted to skin lipids. They adhere via suckers and shed their forked tail while penetrating unbroken human skin via histolytic proteases, transforming into Schistosomula.\n4. Route of Migration:\n   - Schistosomula enter dermic capillaries or lymphatics, pass through the right heart into pulmonary capillaries, and enter systemic arterial circulation.\n   - They navigate to the intrahepatic portal venous system, where they mature into male and female adult worms and pair up.\n   - Paired adult worms migrate against portal blood flow through mesenteric and pelvic venules to reach their definitive habitat: the Vesical and Pelvic Venous Plexuses (surrounding the urinary bladder and ureters), where females deposit terminal-spined ova.",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Definitive Stage: Fork-tailed cercaria (furcocercous cercaria) released from freshwater snail host (1.0 mark).
2. Mode of Transmission: Active transcutaneous penetration of intact human skin in freshwater (1.0 mark).
3. Migration Route: Dermal entry -> lung capillaries -> intrahepatic portal veins -> vesical venous plexus (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Snail intermediate host (Bulinus truncatus) releases cercariae that penetrate skin. Loss of the tail and coat remodeling converts cercaria into schistosomulum.

**Ain Shams Faculty Curriculum Highlights:**
- Fork-tailed cercaria is the infective stage; active skin penetration transmits urinary bilharziasis."""
    },
    "MUG3-CH301-PATH-0201": {
        "text": "Explain the biochemical and molecular mechanism responsible for connective tissue weakness, vascular thrombosis, and ectopia lentis in Homocystinuria (Cystathionine Beta-Synthase deficiency).",
        "modelAnswer": "Connective Tissue Pathology in Homocystinuria:\n1. Enzymatic Defect: Autosomal recessive deficiency of Cystathionine Beta-Synthase (CBS), which normally condenses homocysteine with serine to synthesize cystathionine (requiring Vitamin B6 / pyridoxal phosphate as a cofactor). This causes massive accumulation of homocysteine and methionine in blood and urine.\n2. Mechanism of Connective Tissue / Extracellular Matrix Weakness:\n   - Impaired Collagen and Elastin Cross-Linking: Highly elevated homocysteine and its reactive metabolite, homocysteine thiolactone, directly react with and bind the epsilon-amino groups of lysine and hydroxylysine residues in tropocollagen and tropoelastin.\n   - Lysyl Oxidase Inhibition: Homocysteine competitively inhibits the copper-dependent enzyme Lysyl Oxidase (LOX), blocking the oxidative deamination of lysine to allysine.\n   - Loss of Covalent Cross-Links: Consequently, the formation of covalent intermolecular desmosine, isodesmosine, and lysinonorleucine cross-links is severely disrupted, destabilizing the triple helix of collagen and elastic fibers throughout the extracellular matrix.\n3. Clinical Manifestations: Marfanoid habitus (tall slender stature, arachnodactyly, pectus excavatum), downward and inward ectopia lentis (subluxation of the lens, in contrast to upward subluxation in Marfan syndrome), osteopenia, and severe premature arterial and venous thromboembolism.",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Primary Defect: Cystathionine beta-synthase deficiency causing hyperhomocysteinemia (0.5 mark).
2. Cross-Linking Disruption: Reaction with lysine residues and inhibition of lysyl oxidase (1.5 marks).
3. Connective Tissue Instability: Defective collagen/elastin cross-links yielding weak extracellular matrix (0.5 mark).
4. Clinical Hallmarks: Marfanoid habitus, downward ectopia lentis, and severe thromboembolic events (0.5 mark).

**Core Educational Objective & Clinical Mechanism:**
Covalent cross-links provide tensile strength to collagen and elasticity to fibrillin. Homocysteine disrupts Schiff base cross-linkages, weakening connective tissue and vessel walls.

**Ain Shams Faculty Curriculum Highlights:**
- Homocysteine inhibits cross-linking of lysine residues in collagen and elastin, producing connective tissue fragility."""
    },
    "MUG3-CH301-PATH-0235": {
        "text": "A sexually active patient presents with multiple soft, exquisitely painful genital ulcers with a ragged, undermined border and tender unilateral suppurative inguinal lymphadenitis (bubo). What is the causative pathogen? Describe its microbiological characteristics and contrast it with primary syphilis.",
        "modelAnswer": "Chancroid (Haemophilus ducreyi):\n1. Causative Organism: Haemophilus ducreyi, a fastidious, facultatively anaerobic Gram-negative coccobacillus.\n2. Microbiological & Diagnostic Features:\n   - Direct Microscopy (Gram stain): Slender Gram-negative coccobacilli arranged in characteristic parallel chains or clusters described as a 'school of fish', 'railroad tracks', or 'fingerprint' pattern outside and inside polymorphonuclear neutrophils.\n   - Culture: Requires specialized enriched chocolate agar containing fetal bovine serum and vancomycin (to inhibit contaminants), incubated in 5% CO2 at 33-35 deg C.\n3. Clinical Differentiation: Chancroid vs Primary Syphilis (Hard Chancre):\n   - Feature | Chancroid (Haemophilus ducreyi) | Primary Syphilis (Treponema pallidum)\n   - Ulcer Characteristics | Multiple, soft base (soft chancre), ragged undermined edges, extremely PAINFUL | Solitary, indurated hard base (hard chancre), clean regular margins, completely PAINLESS\n   - Inguinal Lymphadenopathy | Painful, tender, acute suppurative lymphadenitis (unilateral bubo) that often fluctuates and ruptures | Non-tender, firm, discrete, bilateral rubbery lymphadenopathy without suppuration or ulceration\n   - Etiology | Gram-negative bacillus | Spirochete (Treponema pallidum)",
        "explanation": """**Faculty Model Answer & Scoring Rubric:**
1. Pathogen Identification: Haemophilus ducreyi (chancroid) (1.0 mark).
2. Microbiological Appearance: Gram-negative coccobacillus in 'school of fish' arrangement on Gram stain (1.0 mark).
3. Clinical Distinction: Soft, ragged, exquisitely painful ulcer with suppurative bubo vs painless indurated hard chancre of syphilis (1.0 mark).

**Core Educational Objective & Clinical Mechanism:**
Haemophilus ducreyi produces cytolethal distending toxin (HdCDT) that arrests host epithelial cell cycling and triggers neutrophilic ulceration, distinct from the painless lymphocytic obliterative endarteritis of primary syphilis.

**Ain Shams Faculty Curriculum Highlights:**
- Chancroid ulcer is soft and painful ('school of fish' on Gram stain); syphilitic chancre is hard and painless."""
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
                    if qid in FINAL_9_REPAIRS:
                        rep = FINAL_9_REPAIRS[qid]
                        q["text"] = rep["text"]
                        q["modelAnswer"] = rep["modelAnswer"]
                        q["explanation"] = rep["explanation"]
                        updated_count += 1

    print(f"Applied {updated_count} / {len(FINAL_9_REPAIRS)} final repairs.")

    with open(BANK_PATH, "w", encoding="utf-8") as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)

    print(f"Successfully saved updated bank to {BANK_PATH}")


if __name__ == "__main__":
    main()

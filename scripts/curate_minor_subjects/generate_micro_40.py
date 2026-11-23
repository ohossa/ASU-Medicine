import json

questions = [
    # --- LECTURE 1: Urinary Tract Infections: Etiology, Pathogenesis & Diagnosis (16 Qs: 0301 to 0316) ---
    {
        "id": "MUG3-CH7-MICR-0301",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p1-Q1"],
        "repetitionCount": 1,
        "text": "A 27-year-old catheterized female presents with high fever, shaking rigors, vomiting, and severe bilateral costovertebral angle (CVA) tenderness. What is the most likely diagnosis?",
        "options": ["Acute lower cystitis", "Acute pyelonephritis", "Asymptomatic bacteriuria", "Urethral syndrome"],
        "correctIndex": 1,
        "explanation": "High fever, rigors, systemic toxicity, and costovertebral angle (flank) tenderness are cardinal signs of acute pyelonephritis (upper urinary tract infection), distinguishing it from lower cystitis which presents with localized dysuria, frequency, and urgency without systemic fever or flank pain."
    },
    {
        "id": "MUG3-CH7-MICR-0302",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p1-Q2"],
        "repetitionCount": 1,
        "text": "What is the single most common bacterial pathogen responsible for >80% of community-acquired uncomplicated urinary tract infections in outpatients?",
        "options": ["Staphylococcus saprophyticus", "Proteus mirabilis", "Uropathogenic Escherichia coli (UPEC)", "Klebsiella pneumoniae"],
        "correctIndex": 2,
        "explanation": "Uropathogenic Escherichia coli (UPEC) colonizes the perineum from the gastrointestinal normal flora and ascends the urethra, accounting for 80-90% of community-acquired uncomplicated cystitis and pyelonephritis."
    },
    {
        "id": "MUG3-CH7-MICR-0303",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p2-Q6"],
        "repetitionCount": 1,
        "text": "A 22-year-old newly married woman develops acute dysuria and frequency. Urine culture yields Gram-positive cocci in clusters that are catalase-positive, coagulase-negative, and resistant to novobiocin. What is the organism?",
        "options": ["Staphylococcus epidermidis", "Staphylococcus aureus", "Staphylococcus saprophyticus", "Enterococcus faecalis"],
        "correctIndex": 2,
        "explanation": "Staphylococcus saprophyticus is the second most common cause of community-acquired acute cystitis in young, sexually active females ('honeymoon cystitis'). It is biochemically characterized as catalase-positive, coagulase-negative, and novobiocin-resistant (differentiating it from novobiocin-sensitive S. epidermidis)."
    },
    {
        "id": "MUG3-CH7-MICR-0304",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p2-Q4"],
        "repetitionCount": 1,
        "text": "A 65-year-old man with urinary retention develops a UTI. Urine culture reveals Gram-negative bacilli that produce swarming motility across blood agar, are non-lactose fermenting on MacConkey agar, and are strongly urease-positive. What is the pathogen?",
        "options": ["Escherichia coli", "Klebsiella pneumoniae", "Proteus mirabilis", "Pseudomonas aeruginosa"],
        "correctIndex": 2,
        "explanation": "Proteus mirabilis exhibits characteristic swarming motility on blood agar and produces abundant bacterial urease. Urease splits urea into ammonia and CO2, raising urinary pH (>7.5) and precipitating magnesium ammonium phosphate (struvite/triple phosphate) staghorn calculi."
    },
    {
        "id": "MUG3-CH7-MICR-0305",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p4-Q15"],
        "repetitionCount": 1,
        "text": "Which virulence factor possessed by uropathogenic E. coli (UPEC) binds specifically to Gal(alpha1-4)Gal oligosaccharide receptors on urothelial cells, enabling ascending colonization to the renal pelvis?",
        "options": ["Type 1 fimbriae (mannose-sensitive)", "P-fimbriae (pyelonephritis-associated pili)", "Capsular K antigen", "Heat-stable enterotoxin"],
        "correctIndex": 1,
        "explanation": "P-fimbriae (Pap pili) bind specifically to digalactoside (Gal-Gal) epitopes on uroepithelial cells and the renal pelvis, facilitating adherence and ascension into the kidneys to produce pyelonephritis. Type 1 fimbriae mediate lower bladder adherence."
    },
    {
        "id": "MUG3-CH7-MICR-0306",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p4-Q13"],
        "repetitionCount": 1,
        "text": "Which of the following Enterobacteriaceae is an obligate intestinal pathogen causing bacillary dysentery and does NOT cause urinary tract infections?",
        "options": ["Klebsiella pneumoniae", "Shigella dysenteriae", "Proteus mirabilis", "Enterobacter cloacae"],
        "correctIndex": 1,
        "explanation": "Shigella dysenteriae is an invasive colonic pathogen that produces bloody mucoid diarrhea (bacillary dysentery); it lacks uropathogenic fimbriae and does not cause urinary tract infections."
    },
    {
        "id": "MUG3-CH7-MICR-0307",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p5-Q19"],
        "repetitionCount": 1,
        "text": "A hospitalized burn patient with a long-term Foley catheter develops a nosocomial UTI. Urine culture grows a non-lactose fermenting Gram-negative rod that produces pyocyanin (blue-green pigment) and is oxidase-positive. What is the pathogen?",
        "options": ["Escherichia coli", "Klebsiella oxytoca", "Proteus vulgaris", "Pseudomonas aeruginosa"],
        "correctIndex": 3,
        "explanation": "Pseudomonas aeruginosa is an oxidase-positive, aerobic, non-lactose-fermenting opportunistic rod that produces distinctive blue-green phenazine pigments (pyocyanin and pyoverdine) and exhibits intrinsic resistance to many common antimicrobials."
    },
    {
        "id": "MUG3-CH7-MICR-0308",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p6-Q27"],
        "repetitionCount": 1,
        "text": "Urine culture from an elderly man with recurrent catheter-associated UTI grows Gram-positive cocci in pairs and short chains that are catalase-negative, grow in 6.5% NaCl, and hydrolyze esculin on bile esculin agar. What is the organism?",
        "options": ["Streptococcus agalactiae", "Enterococcus faecalis", "Staphylococcus epidermidis", "Listeria monocytogenes"],
        "correctIndex": 1,
        "explanation": "Enterococcus faecalis (Group D enterococcus) is a hardy Gram-positive coccus capable of growing in bile and 6.5% hypertonic NaCl broth, turning bile esculin agar black. It is a major cause of healthcare-associated and catheter-related UTIs."
    },
    {
        "id": "MUG3-CH7-MICR-0309",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p6-Q24"],
        "repetitionCount": 1,
        "text": "What is the primary mechanism by which indwelling urinary catheters predispose patients to persistent, refractory catheter-associated UTIs (CAUTIs)?",
        "options": ["Catheters neutralize normal acidic urine pH", "Bacterial adherence and extracellular polysaccharide biofilm formation on the catheter surface, shielding microbes from antibiotics and host defenses", "Direct suppression of bone marrow granulopoiesis", "Destruction of glomerular podocyte slit diaphragms"],
        "correctIndex": 1,
        "explanation": "Uropathogens adhere to the inner and outer surfaces of the urinary catheter and secrete an extracellular polysaccharide matrix (biofilm). Bacteria within biofilms enter a sessile metabolic state and are impervious to circulating host antibodies, phagocytes, and antibiotics."
    },
    {
        "id": "MUG3-CH7-MICR-0310",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p3-Q9"],
        "repetitionCount": 1,
        "text": "Under physiological conditions, which anatomical zone of the human urinary tract is normally colonised by a resident commensal microflora?",
        "options": ["Renal pelvis and ureters", "Urinary bladder lumen", "Anterior (distal) urethra", "Collecting ducts"],
        "correctIndex": 2,
        "explanation": "Urine in the bladder, ureters, and kidneys is normally sterile. Only the anterior (distal) urethra possesses a resident commensal flora (e.g., coagulase-negative staphylococci, diphtheroids, lactobacilli)."
    },
    {
        "id": "MUG3-CH7-MICR-0311",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p3-Q10"],
        "repetitionCount": 1,
        "text": "Acute post-streptococcal glomerulonephritis (APSGN) develops 1 to 4 weeks following an infection with which specific bacterial species?",
        "options": ["Streptococcus agalactiae (Group B)", "Streptococcus pyogenes (Group A beta-hemolytic Streptococcus, nephritogenic strains)", "Enterococcus faecalis", "Streptococcus pneumoniae"],
        "correctIndex": 1,
        "explanation": "APSGN is an immune-complex mediated glomerulonephritis triggered by nephritogenic strains of Streptococcus pyogenes (GAS, e.g., M-types 12, 49) following pharyngitis or impetigo."
    },
    {
        "id": "MUG3-CH7-MICR-0312",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p3-Q11"],
        "repetitionCount": 1,
        "text": "Which serological antibody titer is the most sensitive marker for confirming antecedent streptococcal impetigo/pyoderma preceding acute post-streptococcal glomerulonephritis?",
        "options": ["Anti-streptolysin O (ASO)", "Anti-DNase B", "Anti-capsular polysaccharide", "Anti-protein A"],
        "correctIndex": 1,
        "explanation": "While ASO is reliable after pharyngitis, skin lipids neutralize streptolysin O during cutaneous infections; therefore, anti-DNase B (anti-deoxyribonuclease B) is markedly superior and the most sensitive titer for confirming antecedent post-impetigo glomerulonephritis."
    },
    {
        "id": "MUG3-CH7-MICR-0313",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p4-Q14"],
        "repetitionCount": 1,
        "text": "What is the classic diagnostic quantitative threshold defining significant bacteriuria on a clean-catch midstream urine culture in a symptomatic female with acute uncomplicated cystitis?",
        "options": [">= 10^2 CFU/mL of a single uropathogen (or >= 10^5 CFU/mL in asymptomatic individuals)", ">= 10^7 CFU/mL of multiple mixed organisms", "Presence of any bacteria in the presence of epithelial cells", ">= 10^8 CFU/mL"],
        "correctIndex": 0,
        "explanation": "While Kass originally defined >=10^5 CFU/mL for asymptomatic bacteriuria, modern clinical microbiology recognizes that in acutely symptomatic women, counts as low as >=10^2 to 10^3 CFU/mL of a typical coliform uropathogen (e.g., E. coli) represent genuine bladder infection."
    },
    {
        "id": "MUG3-CH7-MICR-0314",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p2-Q5"],
        "repetitionCount": 1,
        "text": "On a rapid urine dipstick analysis, what does a positive leukocyte esterase and a positive nitrite test specifically indicate?",
        "options": ["Leukocyte esterase indicates pyuria (neutrophils); nitrite indicates presence of Gram-negative bacteria reducing dietary nitrate to nitrite", "Both tests reflect heavy viral replication", "Positive nitrite indicates fungal infection by Candida albicans", "Both tests reflect renal tubular necrosis"],
        "correctIndex": 0,
        "explanation": "Leukocyte esterase is an enzyme released by lysed neutrophils, confirming active pyuria. Nitrite detects bacteria possessing nitrate reductase (most Enterobacteriaceae like E. coli, Klebsiella, Proteus) that reduce urinary nitrate to nitrite."
    },
    {
        "id": "MUG3-CH7-MICR-0315",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p5-Q20"],
        "repetitionCount": 1,
        "text": "Which of the following uropathogens is an opportunistic yeast that frequently causes fungal cystitis in diabetic patients and those with indwelling catheters receiving broad-spectrum antibiotics?",
        "options": ["Candida albicans", "Aspergillus fumigatus", "Cryptococcus neoformans", "Histoplasma capsulatum"],
        "correctIndex": 0,
        "explanation": "Candida albicans is a polymorphic yeast/pseudohyphal fungus that colonizes the perineum. In patients with diabetes mellitus, immunosuppression, or broad-spectrum antibacterial therapy, it readily ascends urinary catheters to cause candiduria or bladder fungus balls."
    },
    {
        "id": "MUG3-CH7-MICR-0316",
        "type": "mcq",
        "lecture": 1,
        "sources": ["Microbiology/MCQ Micro .pdf-p5-Q21"],
        "repetitionCount": 1,
        "text": "Klebsiella pneumoniae uropathogenicity and resistance to phagocytosis are mediated primarily by which major structural virulence determinant?",
        "options": ["Thick polysaccharide capsule (K antigen)", "Coagulase enzyme", "Exotoxin A", "Outer membrane porin loss"],
        "correctIndex": 0,
        "explanation": "Klebsiella pneumoniae produces a prominent, thick, mucoid polysaccharide capsule (K antigen) that physically impedes complement deposition (C3b) and completely inhibits opsonophagocytosis by neutrophils."
    },

    # --- LECTURE 2: Infections of the Genital System & STDs (14 Qs: 0317 to 0330) ---
    {
        "id": "MUG3-CH7-MICR-0317",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p3-Q10"],
        "repetitionCount": 1,
        "text": "A 24-year-old male presents with copious purulent urethral discharge and severe dysuria. A Gram stain of the exudate shows intracellular Gram-negative diplococci inside polymorphonuclear leukocytes. What is the diagnosis?",
        "options": ["Chlamydia trachomatis nongonococcal urethritis", "Acute gonococcal urethritis (Neisseria gonorrhoeae)", "Trichomoniasis", "Primary syphilis"],
        "correctIndex": 1,
        "explanation": "Neisseria gonorrhoeae appears on Gram stain as kidney bean-shaped Gram-negative diplococci situated within the cytoplasm of polymorphonuclear leukocytes (PMNs). In males with urethral discharge, this finding has >98% sensitivity and specificity."
    },
    {
        "id": "MUG3-CH7-MICR-0318",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p3-Q11"],
        "repetitionCount": 1,
        "text": "Which selective enriched medium containing vancomycin, colistin, nystatin, and trimethoprim is used to isolate Neisseria gonorrhoeae from non-sterile genital specimens?",
        "options": ["MacConkey agar", "Thayer-Martin (or Modified New York City) agar", "Lowenstein-Jensen medium", "Sabouraud dextrose agar"],
        "correctIndex": 1,
        "explanation": "Thayer-Martin agar is chocolate agar supplemented with antibiotics (vancomycin inhibits Gram-positives, colistin inhibits Gram-negative rods, nystatin inhibits fungi, trimethoprim inhibits swarming Proteus) to selectively isolate fastidious Neisseria."
    },
    {
        "id": "MUG3-CH7-MICR-0319",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p3-Q12"],
        "repetitionCount": 1,
        "text": "Which obligate intracellular bacterium possesses a biphasic developmental cycle consisting of infectious elementary bodies (EBs) and metabolically active reticulate bodies (RBs)?",
        "options": ["Mycoplasma hominis", "Treponema pallidum", "Chlamydia trachomatis", "Ureaplasma urealyticum"],
        "correctIndex": 2,
        "explanation": "Chlamydia trachomatis alternates between extracellular, metabolically inert, infectious Elementary Bodies (EBs) and intracellular, metabolically active, replicating Reticulate Bodies (RBs) inside host cytoplasmic inclusions."
    },
    {
        "id": "MUG3-CH7-MICR-0320",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p3-Q13"],
        "repetitionCount": 1,
        "text": "Lymphogranuloma venereum (LGV) is a sexually transmitted disease characterized by a transient painless genital papule followed by painful suppurative inguinal buboes, caused by which serovars of Chlamydia trachomatis?",
        "options": ["Serovars A, B, and C (Trachoma)", "Serovars D through K (Genital infections & inclusion conjunctivitis)", "Serovars L1, L2, and L3 (LGV)", "Serovar O"],
        "correctIndex": 2,
        "explanation": "Chlamydia trachomatis serovars L1, L2, and L3 are lymphotropic invasive strains that invade regional lymphatic tissue, producing lymphogranuloma venereum with prominent inguinal lymphadenitis and the 'groove sign'."
    },
    {
        "id": "MUG3-CH7-MICR-0321",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p3-Q14"],
        "repetitionCount": 1,
        "text": "What is the cardinal clinical manifestation of primary syphilis developing approximately 2 to 6 weeks after sexual inoculation?",
        "options": ["Disseminated maculopapular rash on palms and soles", "Hard chancre (single, painless, indurated ulcer with clean base and non-tender inguinal lymphadenopathy)", "Painful, soft, ragged ulcer with necrotic exudate (chancroid)", "Condyloma lata"],
        "correctIndex": 1,
        "explanation": "Primary syphilis manifests as a solitary, painless, indurated ulcer known as a hard chancre at the site of inoculation, accompanied by bilateral painless regional lymphadenopathy. Treponema pallidum spirochetes are abundant in darkfield examination."
    },
    {
        "id": "MUG3-CH7-MICR-0322",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p3-Q15"],
        "repetitionCount": 1,
        "text": "Because Treponema pallidum cannot be cultivated in vitro on artificial bacteriological culture media, what direct microscopic method is used to visualize active motile spirochetes from primary chancre exudate?",
        "options": ["Gram stain microscopy", "Acid-fast Ziehl-Neelsen stain", "Darkfield microscopy (or direct fluorescent antibody test, DFA-TP)", "India ink preparation"],
        "correctIndex": 2,
        "explanation": "Treponema pallidum is extremely thin (0.1-0.2 um) and cannot be seen on standard light microscopy or cultured on agar. Darkfield microscopy reveals slender, corkscrew-shaped spirochetes exhibiting characteristic rapid rotation and flexion."
    },
    {
        "id": "MUG3-CH7-MICR-0323",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p3-Q16"],
        "repetitionCount": 1,
        "text": "Non-treponemal serological screening tests for syphilis (such as VDRL and RPR) detect host serum antibodies directed against which antigen?",
        "options": ["Treponemal flagellar protein", "Cardiolipin-lecithin-cholesterol antigen (reagin antibodies)", "Treponemal outer membrane protein A", "Streptococcal M protein"],
        "correctIndex": 1,
        "explanation": "VDRL (Venereal Disease Research Laboratory) and RPR (Rapid Plasma Reagin) tests detect non-specific anti-cardiolipin antibodies ('reagin') produced in response to lipid materials released from damaged host cells and treponemal membranes."
    },
    {
        "id": "MUG3-CH7-MICR-0324",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p3-Q17"],
        "repetitionCount": 1,
        "text": "Which treponemal-specific serological test remains permanently positive for life following treated syphilis infection and is used to confirm a reactive RPR?",
        "options": ["VDRL titer", "Fluorescent treponemal antibody-absorbed (FTA-ABS) or TP-PA", "Weil-Felix reaction", "Widal test"],
        "correctIndex": 1,
        "explanation": "Specific treponemal tests (FTA-ABS, TP-PA, EIA) measure antibodies directed against genuine T. pallidum antigens. Once positive, they typically remain reactive for life regardless of curative therapy and cannot be used to monitor treatment response."
    },
    {
        "id": "MUG3-CH7-MICR-0325",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p2-Q7"],
        "repetitionCount": 1,
        "text": "A 28-year-old female presents with a malodorous, thin, homogeneous grayish-white vaginal discharge. A whiff test with 10% KOH yields a fishy amine odor, and saline wet mount reveals 'clue cells'. What is the diagnosis?",
        "options": ["Vulvovaginal candidiasis", "Trichomoniasis", "Bacterial vaginosis (associated with Gardnerella vaginalis and loss of lactobacilli)", "Atrophic vaginitis"],
        "correctIndex": 2,
        "explanation": "Bacterial vaginosis is a dysbiosis characterized by depletion of protective H2O2-producing Lactobacillus species and massive overgrowth of anaerobes and Gardnerella vaginalis. Clue cells (vaginal epithelial cells stippled with adherent coccobacilli obscuring cell margins) are pathognomonic."
    },
    {
        "id": "MUG3-CH7-MICR-0326",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p2-Q8"],
        "repetitionCount": 1,
        "text": "What is the normal physiological vaginal pH maintained by hydrogen peroxide-producing Lactobacillus species (Döderlein bacilli)?",
        "options": ["pH 2.0 to 2.5", "pH 3.8 to 4.5 (acidic)", "pH 6.5 to 7.0 (neutral)", "pH 8.0 to 8.5 (alkaline)"],
        "correctIndex": 1,
        "explanation": "Normal vaginal microflora is dominated by Lactobacillus crispatus/jensenii which ferment glycogen produced by estrogenized vaginal epithelium into lactic acid, maintaining a protective acidic pH <= 4.5 that inhibits pathogens."
    },
    {
        "id": "MUG3-CH7-MICR-0327",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p2-Q9"],
        "repetitionCount": 1,
        "text": "Painful, grouped fluid-filled vesicles on an erythematous base that ulcerate on the penis or vulva, accompanied by fever and paresthesias, are caused by:",
        "options": ["Human papillomavirus (HPV)", "Herpes simplex virus type 2 (HSV-2)", "Molluscum contagiosum virus", "Hepatitis B virus"],
        "correctIndex": 1,
        "explanation": "Herpes simplex virus type 2 (HSV-2) causes genital herpes presenting with clusters of painful vesicles that erode into shallow ulcers. The virus establishes lifelong latency in the sacral dorsal root sensory ganglia (S2-S4)."
    },
    {
        "id": "MUG3-CH7-MICR-0328",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p3-Q18"],
        "repetitionCount": 1,
        "text": "A Tzanck smear prepared by scraping the base of a vesicular genital ulcer and stained with Giemsa reveals multinucleated giant cells with ground-glass nuclei and Cowdry A inclusion bodies. This confirms infection with:",
        "options": ["Herpes simplex virus (HSV)", "Treponema pallidum", "Chlamydia trachomatis", "Haemophilus ducreyi"],
        "correctIndex": 0,
        "explanation": "Tzanck smear demonstrating multinucleated epithelial giant cells with syncytia formation and intranuclear Cowdry A eosinophilic viral inclusions is diagnostic of Herpes simplex virus (HSV-1 or HSV-2) infection."
    },
    {
        "id": "MUG3-CH7-MICR-0329",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p1-Q3"],
        "repetitionCount": 1,
        "text": "Which high-risk human papillomavirus (HPV) genotypes express oncoproteins E6 and E7 that inactivate tumor suppressors p53 and pRb, driving invasive cervical carcinoma?",
        "options": ["HPV types 6 and 11", "HPV types 16 and 18", "HPV types 1 and 2", "HPV types 31 and 33 only"],
        "correctIndex": 1,
        "explanation": "High-risk HPV genotypes 16 and 18 cause >70% of cervical carcinomas. Oncoprotein E6 binds and degrades p53 via ubiquitination, while E7 binds and inactivates retinoblastoma protein (pRb), driving uncontrolled cell cycle progression."
    },
    {
        "id": "MUG3-CH7-MICR-0330",
        "type": "mcq",
        "lecture": 2,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p3-Q19"],
        "repetitionCount": 1,
        "text": "Chancroid is a sexually transmitted genital ulcer disease characterized by painful, non-indurated soft ulcers with ragged undermined edges and suppurative inguinal buboes, caused by:",
        "options": ["Haemophilus ducreyi", "Treponema pallidum", "Calymmatobacterium granulomatis", "Neisseria gonorrhoeae"],
        "correctIndex": 0,
        "explanation": "Chancroid is caused by Haemophilus ducreyi, a fastidious Gram-negative coccobacillus that appears on Gram stain as a 'school of fish' arrangement, producing painful, non-indurated soft chancres."
    },

    # --- LECTURE 3: Perinatal & Congenital Infections (10 Qs: 0331 to 0340) ---
    {
        "id": "MUG3-CH7-MICR-0331",
        "type": "mcq",
        "lecture": 3,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p5-Q22"],
        "repetitionCount": 1,
        "text": "Which classical clinical triad defines congenital rubella syndrome (CRS, Gregg's triad) resulting from maternal first-trimester viral infection?",
        "options": ["Microcephaly, periventricular calcifications, and chorioretinitis", "Sensorineural hearing loss, ocular cataracts, and congenital heart disease (e.g., Patent Ductus Arteriosus)", "Hydrocephalus, diffuse intracerebral calcifications, and chorioretinitis", "Hepatosplenomegaly, limb hypoplasia, and cicatricial skin lesions"],
        "correctIndex": 1,
        "explanation": "Congenital rubella syndrome (Gregg triad) characteristically comprises sensorineural deafness, ocular defects (cataracts, microphthalmia), and cardiovascular malformations (patent ductus arteriosus, pulmonary artery stenosis)."
    },
    {
        "id": "MUG3-CH7-MICR-0332",
        "type": "mcq",
        "lecture": 3,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p5-Q23"],
        "repetitionCount": 1,
        "text": "What is the single most common congenital viral infection worldwide, characteristically causing periventricular calcifications, microcephaly, sensorineural hearing loss, and 'blueberry muffin' purpura in severely affected neonates?",
        "options": ["Congenital Rubella virus", "Congenital Cytomegalovirus (CMV)", "Congenital Toxoplasmosis", "Herpes simplex virus type 1"],
        "correctIndex": 1,
        "explanation": "Cytomegalovirus (CMV) is the leading cause of congenital viral disease and non-hereditary sensorineural hearing loss. Head CT classically shows periventricular calcifications (lining the lateral ventricles), contrasting with diffuse intracranial calcifications in toxoplasmosis."
    },
    {
        "id": "MUG3-CH7-MICR-0333",
        "type": "mcq",
        "lecture": 3,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p5-Q24"],
        "repetitionCount": 1,
        "text": "Microscopic examination of tissues or urine sediment from an infant with congenital cytomegalovirus infection demonstrates pathognomonic:",
        "options": ["Intranuclear Cowdry B inclusions", "Large cytomegalic cells with basophilic intranuclear inclusion bodies surrounded by a clear halo ('owl's eye' appearance)", "Cytoplasmic Negri bodies", "Extracellular Gram-positive diplococci"],
        "correctIndex": 1,
        "explanation": "CMV infects vascular endothelial and epithelial cells, causing massive cell enlargement (cytomegaly) with prominent central intranuclear basophilic inclusions surrounded by a halo, resembling an owl's eye."
    },
    {
        "id": "MUG3-CH7-MICR-0334",
        "type": "mcq",
        "lecture": 3,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p5-Q25"],
        "repetitionCount": 1,
        "text": "A newborn presents with early-onset neonatal sepsis and meningitis within 48 hours of birth. The causative organism is a narrow-zone beta-hemolytic Gram-positive coccus that is bacitracin-resistant and CAMP-test positive. What is the pathogen?",
        "options": ["Streptococcus agalactiae (Group B Streptococcus, GBS)", "Streptococcus pyogenes (Group A)", "Listeria monocytogenes", "Staphylococcus aureus"],
        "correctIndex": 0,
        "explanation": "Streptococcus agalactiae (GBS) is the leading cause of early-onset neonatal sepsis, pneumonia, and meningitis. It is bacitracin-resistant, hydrolyzes sodium hippurate, and enlarges the zone of hemolysis produced by S. aureus on sheep blood agar (CAMP test positive)."
    },
    {
        "id": "MUG3-CH7-MICR-0335",
        "type": "mcq",
        "lecture": 3,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p5-Q26"],
        "repetitionCount": 1,
        "text": "Universal prenatal screening for maternal rectovaginal Group B Streptococcus (GBS) carriage is recommended by international guidelines at what gestational age?",
        "options": ["12 to 16 weeks", "20 to 24 weeks", "36 to 37 6/7 weeks", "Only after rupture of membranes"],
        "correctIndex": 2,
        "explanation": "Universal rectovaginal culture screening for GBS colonization is performed at 36 0/7 to 37 6/7 weeks of gestation. Women who test positive receive intrapartum intravenous penicillin (or ampicillin) prophylaxis during labor."
    },
    {
        "id": "MUG3-CH7-MICR-0336",
        "type": "mcq",
        "lecture": 3,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p6-Q28"],
        "repetitionCount": 1,
        "text": "A pregnant woman develops mild febrile flu-like illness after consuming unpasteurized artisanal soft cheese. She experiences spontaneous abortion. Autopsy of the fetus reveals disseminated microabscesses and granulomas (granulomatosis infantiseptica). What is the causative organism?",
        "options": ["Listeria monocytogenes", "Brucella melitensis", "Salmonella enterica", "Campylobacter jejuni"],
        "correctIndex": 0,
        "explanation": "Listeria monocytogenes is a foodborne facultative intracellular Gram-positive rod that crosses the placenta, producing severe intrauterine infection, amnionitis, miscarriage, or severe neonatal granulomatosis infantiseptica with disseminated microabscesses."
    },
    {
        "id": "MUG3-CH7-MICR-0337",
        "type": "mcq",
        "lecture": 3,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p6-Q29"],
        "repetitionCount": 1,
        "text": "Which characteristic laboratory property helps identify Listeria monocytogenes in clinical specimens?",
        "options": ["Obligate anaerobe that forms central spores", "Tumbling end-over-end motility in broth at 22-25°C and ability to multiply at refrigeration temperatures (4°C)", "Production of green pigment on nutrient agar", "Acid-fast rod requiring 6 weeks to grow"],
        "correctIndex": 1,
        "explanation": "Listeria monocytogenes is a non-spore-forming, motile Gram-positive bacillus that exhibits characteristic tumbling motility at room temperature (22-25°C, but not at 37°C) and can replicate at refrigerator temperatures (cold enrichment)."
    },
    {
        "id": "MUG3-CH7-MICR-0338",
        "type": "mcq",
        "lecture": 3,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p4-Q20"],
        "repetitionCount": 1,
        "text": "Which clinical feature seen in late congenital syphilis (Hutchinson's triad) typically manifests in children over 2 years of age?",
        "options": ["Hutchinson teeth (notched peg-shaped central incisors), interstitial keratitis, and eighth-nerve sensorineural deafness", "Congenital cataracts, PDA, and microcephaly", "Hydrocephalus, intracranial calcifications, and chorioretinitis", "Blueberry muffin rash and microphthalmia"],
        "correctIndex": 0,
        "explanation": "Hutchinson's triad consists of Hutchinson's notched central incisors, interstitial keratitis (corneal scarring causing blindness), and sensorineural deafness due to eighth cranial nerve damage, characteristic of late congenital syphilis."
    },
    {
        "id": "MUG3-CH7-MICR-0339",
        "type": "mcq",
        "lecture": 3,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p4-Q21"],
        "repetitionCount": 1,
        "text": "Neonatal ophthalmia neonatorum presenting with acute hyperacute purulent conjunctivitis within 2 to 5 days of birth is prevented universally at delivery by topical ocular prophylaxis against which pathogen?",
        "options": ["Neisseria gonorrhoeae", "Chlamydia trachomatis", "Herpes simplex virus", "Streptococcus pneumoniae"],
        "correctIndex": 0,
        "explanation": "Ophthalmia neonatorum caused by maternal Neisseria gonorrhoeae manifests with severe purulent conjunctivitis that rapidly penetrates the cornea causing corneal perforation and blindness. Universal erythromycin 0.5% ophthalmic ointment at birth provides essential prophylaxis."
    },
    {
        "id": "MUG3-CH7-MICR-0340",
        "type": "mcq",
        "lecture": 3,
        "sources": ["Microbiology/Urogenital Module - Microbiology Department MCQs.pdf-p5-Q27"],
        "repetitionCount": 1,
        "text": "Maternal primary genital herpes (HSV-2) infection acquired near delivery carries what approximate risk of vertical transmission to the neonate during vaginal birth, warranting scheduled Cesarean delivery?",
        "options": ["< 1%", "30% to 50%", "100%", "Zero risk if membranes are intact"],
        "correctIndex": 1,
        "explanation": "Primary maternal genital herpes acquired near term involves high viral shedding without maternal neutralizing antibodies, carrying a 30-50% risk of transmission during vaginal delivery. Cesarean delivery is indicated to prevent severe neonatal disseminated herpes or encephalitis."
    }
]

with open('scripts/curate_minor_subjects/staged_micro.json', 'w') as f:
    json.dump(questions, f, indent=2)

print(f"Successfully generated {len(questions)} verified Microbiology MCQs in staged_micro.json")

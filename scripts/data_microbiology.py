# scripts/data_microbiology.py
"""
ASU Medical Portal — GIT Practical Bank: Microbiology (Chapter 307)
Authentic practical stations covering:
- Lecture 1: Infectious Diarrhea & Stool Processing (E. coli, Shigella, Salmonella, Vibrio, Campylobacter)
- Lecture 2: Diagnostic Media & Biochemical Reactions (MacConkey, TCBS, TSI, Oxidase, Indole, Urease)
- Lecture 3: Food Poisoning & Enteric Fever (S. aureus, B. cereus, Clostridia, S. typhi, Widal test, Carriers)
"""

def get_microbiology_questions():
    questions = [
        # ── LECTURE 1: Infectious Diarrhea & Stool Processing (Stations 1–14) ────────
        {
            "id": "MGL3-CH307-MICR-0001",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this stool specimen collection container. What is the standard protocol and transport precaution for a stool sample suspected of acute bacterial infectious diarrhea?",
            "options": [
                "Collect in a clean, dry, wide-mouthed container without disinfectant and transport within 2 hours or place in Cary-Blair transport medium",
                "Collect in a formalin-fixed container and refrigerate at -20°C for 48 hours",
                "Swab the perineum after sterile alcohol cleaning and place in normal saline at 37°C",
                "Mix with 10% formalin immediately to preserve bacterial viability for culture"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Stool specimens must be collected in a clean, dry, leak-proof wide-mouthed container devoid of disinfectants or soap residues. They should be delivered to the laboratory within 1–2 hours of collection; if delayed, specimens must be inoculated into Cary-Blair transport medium to preserve fragile enteropathogens like Shigella and Campylobacter.",
            "keyConcept": "Stool specimen: clean, dry container without disinfectant; transport within 2 hours or use Cary-Blair medium.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/stewart_cary_blair_transport.webp",
                "caption": "Station 1 — Specimen Collection & Transport Container"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0002",
            "type": "mcq",
            "lecture": 1,
            "text": "Why is direct Gram staining of unconcentrated fecal smears considered of minimal diagnostic value in routine bacterial diarrhea?",
            "options": [
                "The normal colonic microbiota consists of dense polymicrobial Gram-negative and Gram-positive bacteria, obscuring pathogens",
                "Gram-negative enteropathogens rapidly lose their cell walls in fecal material",
                "Fecal bile salts actively decolorize Gram-positive bacteria, making all flora appear Gram-negative",
                "Bacterial flagella interfere with crystal violet penetration in stool smears"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Gram stain of fecal smears has virtually no diagnostic value for routine bacterial diarrhea because feces normally contains 10^11 bacteria per gram, predominantly anaerobic Gram-negative rods (Bacteroides) and Gram-positive rods/cocci. Distinguishing a specific pathogen like E. coli or Salmonella from normal commensal coliforms by morphology alone is impossible.",
            "keyConcept": "Direct fecal Gram stain is non-diagnostic due to overwhelming normal colonic flora.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/gram_negative_bacilli.webp",
                "caption": "Station 2 — Fecal Smear Microscopy"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0003",
            "type": "mcq",
            "lecture": 1,
            "text": "A direct microscopic stool examination reveals numerous pus cells (neutrophils) and red blood cells. Which category of gastrointestinal pathogens is most consistent with this finding?",
            "options": [
                "Invasive / inflammatory enteropathogens such as Shigella dysenteriae, EIEC, or Campylobacter jejuni",
                "Enterotoxigenic Escherichia coli (ETEC) producing cholera-like enterotoxin",
                "Vibrio cholerae causing massive secretory hypersecretion",
                "Giardia duodenalis adhering non-invasively to proximal jejunal brush border"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The presence of abundant leukocytes (fecal pus cells >10/HPF) and RBCs indicates mucosal invasion, ulceration, and an acute inflammatory exudate, characteristic of invasive dysentery caused by Shigella spp., Enteroinvasive E. coli (EIEC), Campylobacter jejuni, or Salmonella enterica.",
            "keyConcept": "Fecal pus cells and RBCs indicate invasive/cytotoxic mucosal destruction (e.g., Shigella, EIEC, Campylobacter).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/gram_negative_bacilli.webp",
                "caption": "Station 3 — High-Power Fecal Wet Mount Examination"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0004",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this culture plate (MacConkey agar). Colonies marked as 'A' are dark pink with surrounding precipitated bile salts, while colonies marked as 'B' are pale and translucent. What biochemical property differentiates colony A from colony B?",
            "options": [
                "Colony A ferments lactose with neutral red indicator turning pink; Colony B is a non-lactose fermenter",
                "Colony A produces hydrogen sulfide gas; Colony B is an obligate aerobe",
                "Colony A utilizes citrate as its sole carbon source; Colony B degrades tryptophan to indole",
                "Colony A possesses urease activity; Colony B ferments mannitol"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: MacConkey agar contains lactose, bile salts, and neutral red pH indicator. Lactose fermenters (e.g., E. coli, Klebsiella) produce acid that lowers pH, causing neutral red to turn bright pink/magenta with precipitated bile salts. Non-lactose fermenters (e.g., Shigella, Salmonella, Proteus) do not ferment lactose, producing colorless/pale colonies.",
            "keyConcept": "MacConkey agar: Lactose fermenters = pink colonies (E. coli); Non-lactose fermenters = pale/colorless colonies (Shigella, Salmonella).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/macconkey_lf_nlf.webp",
                "caption": "Station 4 — MacConkey Agar Differential Culture"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0005",
            "type": "mcq",
            "lecture": 1,
            "text": "A 4-year-old child presents with severe bloody diarrhea, abdominal cramps, and oliguria with hemolytic uremic syndrome (HUS). Stool culture on MacConkey agar shows lactose-fermenting colonies. Which diagnostic selective agar is essential to isolate the specific serotype responsible?",
            "options": [
                "Sorbitol MacConkey (SMAC) agar: EHEC O157:H7 appears as colorless/sorbitol-negative colonies",
                "Thiosulfate-Citrate-Bile Salts-Sucrose (TCBS) agar: forms black colonies",
                "Mannitol Salt Agar: forms golden-yellow coagulase-positive halos",
                "Lowenstein-Jensen medium: incubated at 42°C in microaerophilic jar"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Enterohemorrhagic E. coli (EHEC serotype O157:H7) produces Shiga toxin (Stx-1/Stx-2) leading to hemorrhagic colitis and HUS. Unlike 95% of commensal E. coli strains, EHEC O157:H7 cannot ferment D-sorbitol within 24 hours, forming characteristic colorless (sorbitol-negative) colonies on Sorbitol MacConkey (SMAC) agar.",
            "keyConcept": "EHEC O157:H7: Sorbitol-negative (colorless) on Sorbitol MacConkey (SMAC) agar.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/macconkey_lf_nlf.webp",
                "caption": "Station 5 — Selective Stool Agar for Hemorrhagic Colitis"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0006",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this selective agar plate (TCBS agar) incubated with a stool sample from a patient presenting with voluminous, non-bloody 'rice-water' diarrhea. Large, smooth, yellow colonies are visible. Identify the organism and the mechanism of color change:",
            "options": [
                "Vibrio cholerae: ferments sucrose, causing bromothymol blue indicator to turn yellow",
                "Vibrio parahaemolyticus: does not ferment sucrose, producing deep green colonies",
                "Shigella flexneri: produces alkaline peptone digestion turning bromocresol purple",
                "Campylobacter jejuni: hydrolyzes hippurate on charcoal cefoperazone agar"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: TCBS (Thiosulfate Citrate Bile Salts Sucrose) is the selective gold standard medium for Vibrio spp. Vibrio cholerae ferments sucrose in the medium, generating acid that turns the bromothymol blue and thymol blue indicators to a brilliant yellow.",
            "keyConcept": "Vibrio cholerae on TCBS: Yellow colonies due to sucrose fermentation.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/tcbs_cholera_colonies.webp",
                "caption": "Station 6 — TCBS Agar Inoculation"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0007",
            "type": "mcq",
            "lecture": 1,
            "text": "Which liquid enrichment medium is specifically utilized to rapidly multiply Vibrio cholerae from stool specimens prior to subculturing on TCBS agar?",
            "options": [
                "Alkaline Peptone Water (pH 8.6), incubated for 4–6 hours at 37°C",
                "Selenite F broth (pH 7.0), incubated for 24 hours",
                "Thioglycollate broth enriched with 10% sheep blood",
                "Buffered charcoal yeast extract (BCYE) broth"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Vibrio cholerae is highly tolerant of and thrives in alkaline pH, while commensal coliforms are inhibited. Alkaline Peptone Water (APW, pH 8.4–8.6) is the enrichment medium of choice; subcultures onto TCBS are taken from the surface pellicle after 4–6 hours of incubation.",
            "keyConcept": "Alkaline Peptone Water (pH 8.6): enrichment medium for Vibrio cholerae.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/stewart_cary_blair_transport.webp",
                "caption": "Station 7 — Liquid Enrichment Broth"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0008",
            "type": "mcq",
            "lecture": 1,
            "text": "A fresh dark-field or phase-contrast hanging-drop wet mount of a stool sample from an acute diarrheal patient reveals tiny, curved, comma-shaped bacilli exhibiting rapid, shooting 'darting motility'. When a drop of specific O1 antiserum is added, the motility immediately ceases. This diagnostic phenomenon identifies:",
            "options": [
                "Vibrio cholerae motility immobilization test",
                "Campylobacter jejuni tumbling end-over-end motility",
                "Salmonella enterica swarming phenomenon",
                "Listeria monocytogenes umbrella motility at 25°C"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Vibrio cholerae possesses a single polar sheathed flagellum that confers rapid, darting 'shooting star' motility in fresh hanging-drop preparations. Specific O1/O139 antiserum cross-links the flagella/somatic antigens, instantaneously immobilizing the bacteria.",
            "keyConcept": "Darting motility immobilized by specific antiserum = Vibrio cholerae.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/oxidase_test_reaction.webp",
                "caption": "Station 8 — Hanging Drop Motility Demonstration"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0009",
            "type": "mcq",
            "lecture": 1,
            "text": "Which liquid enrichment broth is standardly employed to enrich Salmonella and Shigella species from stool or carrier specimens before plating on MacConkey or SS agar?",
            "options": [
                "Selenite F broth or Tetrathionate broth",
                "Alkaline peptone water (pH 8.6)",
                "Sabouraud dextrose broth",
                "Cooked meat medium"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Selenite F broth (and Tetrathionate broth) inhibits normal coliforms (like E. coli) while permitting the rapid multiplication of Salmonella and Shigella species during the first 12–18 hours of incubation.",
            "keyConcept": "Selenite F broth: fluid enrichment for Salmonella and Shigella.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/stewart_cary_blair_transport.webp",
                "caption": "Station 9 — Enteric Fluid Enrichment Media"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0010",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this Gram-stained smear from a blood-streaked diarrheal stool sample. Microscopic inspection reveals slender, curved Gram-negative rods with characteristic 'gull-wing', comma, or S-shaped morphology. This organism requires incubation at 42°C under microaerophilic conditions. Identify this pathogen:",
            "options": [
                "Campylobacter jejuni",
                "Helicobacter pylori",
                "Vibrio cholerae",
                "Yersinia enterocolitica"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Campylobacter jejuni is a fastidious, thermophilic Gram-negative curved rod showing classic 'gull-wing' or 'comma' pairs. It requires selective media (Skirrow's, Campy-BAP) incubated at 42°C under microaerophilic conditions (5% O2, 10% CO2, 85% N2).",
            "keyConcept": "Campylobacter jejuni: gull-wing Gram-negative rod, thermophilic (42°C), microaerophilic.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/gram_negative_bacilli.webp",
                "caption": "Station 10 — Gram-Stained Fecal Morphology"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0011",
            "type": "mcq",
            "lecture": 1,
            "text": "Which physiological feature uniquely distinguishes the family Enterobacteriaceae from other Gram-negative bacilli affecting the gastrointestinal tract (such as Pseudomonas and Vibrio)?",
            "options": [
                "Enterobacteriaceae are all oxidase-negative and ferment glucose",
                "Enterobacteriaceae are all obligate intracellular parasites",
                "Enterobacteriaceae produce oxidase enzymes and are strict aerobes",
                "Enterobacteriaceae fail to reduce nitrates to nitrites"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: All members of the family Enterobacteriaceae share core diagnostic properties: they are facultative anaerobes, ferment glucose, reduce nitrates to nitrites, and are definitively cytochrome oxidase-negative (unlike Vibrio and Pseudomonas, which are oxidase-positive).",
            "keyConcept": "Enterobacteriaceae: Oxidase-negative, glucose fermenters, nitrate reducers.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/oxidase_test_reaction.webp",
                "caption": "Station 11 — Biochemical Group Differentiation"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0012",
            "type": "mcq",
            "lecture": 1,
            "text": "Which genus among the pathogenic Enterobacteriaceae is definitively non-motile (lacks peritrichous flagella) at both room temperature and 37°C?",
            "options": [
                "Shigella species (and Klebsiella)",
                "Salmonella enterica",
                "Escherichia coli",
                "Proteus mirabilis"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Within the primary enteric bacilli, Salmonella, E. coli, and Proteus are actively motile by peritrichous flagella, whereas Shigella and Klebsiella are non-motile. Motility is a primary differential criterion in enteric diagnostic flowcharts.",
            "keyConcept": "Non-motile enteric bacilli = Shigella and Klebsiella.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/gram_negative_bacilli.webp",
                "caption": "Station 12 — Enteric Motility Screening"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0013",
            "type": "mcq",
            "lecture": 1,
            "text": "A patient with suspected bacillary dysentery has non-lactose fermenting colonies on MacConkey agar. The isolate is non-motile, oxidase-negative, and produces acid without gas from glucose on TSI. How is definitive identification of the specific Shigella serogroup confirmed in the diagnostic lab?",
            "options": [
                "Slide agglutination test with polyvalent and monovalent somatic (O) antisera",
                "Quellung capsular swelling reaction",
                "Elek immunodiffusion precipitation test",
                "ASO neutralization titer measurement"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Definitive laboratory identification of Shigella species is achieved by slide agglutination utilizing polyvalent and type-specific antisera against somatic (O) lipopolysaccharide antigens, categorizing isolates into Group A (S. dysenteriae), Group B (S. flexneri), Group C (S. boydii), and Group D (S. sonnei).",
            "keyConcept": "Shigella confirmation: Slide agglutination with somatic (O) antisera.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/salmonella_slide_agglutination.webp",
                "caption": "Station 13 — Serogroup Identification Test"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0014",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the primary role of Colicin typing (or bacteriophage typing) in the medical microbiology laboratory during a Shigella or Salmonella outbreak?",
            "options": [
                "Epidemiological tracking and tracing the exact outbreak clone across patients and food sources",
                "Determining minimal inhibitory concentrations for oral rehydration salts",
                "Detecting beta-lactamase resistance plasmid transfer in vitro",
                "Neutralizing Shiga toxin in clinical serum samples"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Colicin typing and bacteriophage typing are epidemiological fingerprinting tools. Colicins are bacteriocins produced by coliforms that kill sensitive indicator strains; the specific susceptibility pattern (colicin type) identifies identical clonal strains in outbreak investigations.",
            "keyConcept": "Colicin/phage typing: Epidemiological tracing of clonal outbreak strains.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/macconkey_lf_nlf.webp",
                "caption": "Station 14 — Epidemiological Typing Method"
            }
        },

        # ── LECTURE 2: Diagnostic Media & Biochemical Reactions (Stations 15–28) ─────
        {
            "id": "MGL3-CH307-MICR-0015",
            "type": "mcq",
            "lecture": 2,
            "text": "Examine this Cytochrome Oxidase test strip. Colony 'A' produces an instantaneous deep purple/blue color within 10–20 seconds, while Colony 'B' produces no color change. Which clinical gastrointestinal pathogen is represented by Colony A?",
            "options": [
                "Vibrio cholerae",
                "Escherichia coli",
                "Salmonella typhi",
                "Shigella dysenteriae"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The oxidase test detects bacterial cytochrome c oxidase using tetramethyl-p-phenylenediamine dihydrochloride. Vibrio cholerae (and Campylobacter/Pseudomonas) is strongly oxidase-positive (deep purple within seconds), whereas all Enterobacteriaceae (E. coli, Salmonella, Shigella) are oxidase-negative.",
            "keyConcept": "Oxidase positive = Vibrio cholerae; Oxidase negative = Enterobacteriaceae.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/oxidase_test_reaction.webp",
                "caption": "Station 15 — Cytochrome Oxidase Strip Reaction"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0016",
            "type": "mcq",
            "lecture": 2,
            "text": "Examine this Triple Sugar Iron (TSI) agar slant. The reaction demonstrates an entirely yellow slant and yellow butt with gas bubbles splitting the agar, but no black precipitate (A/A, gas +, H2S -). Which enteric organism displays this characteristic reaction?",
            "options": [
                "Escherichia coli (or Klebsiella pneumoniae)",
                "Shigella dysenteriae",
                "Salmonella typhi",
                "Proteus mirabilis"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: TSI contains 0.1% glucose, 1.0% lactose, 1.0% sucrose, and phenol red. An Acid slant / Acid butt (yellow/yellow) with gas formation indicates fermentation of glucose plus lactose/sucrose with CO2/H2 production, typical of lactose-fermenting E. coli and Klebsiella.",
            "keyConcept": "TSI A/A with gas (yellow/yellow) = Escherichia coli.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/tsi_reactions_comparison.webp",
                "caption": "Station 16 — Triple Sugar Iron (TSI) Slant Reaction"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0017",
            "type": "mcq",
            "lecture": 2,
            "text": "Examine this TSI slant inoculated with a non-lactose fermenter. It shows a red (alkaline) slant and a yellow (acid) butt, with no gas and no blackening (K/A, gas -, H2S -). Which organism produces this exact pattern?",
            "options": [
                "Shigella dysenteriae",
                "Escherichia coli",
                "Salmonella typhimurium",
                "Proteus vulgaris"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: A red slant / yellow butt (K/A) indicates fermentation of glucose only (0.1%). Oxidative deamination of peptones in the slant turns phenol red alkaline (red) in aerobic conditions, while glucose fermentation maintains acid (yellow) in the anaerobic butt. Lack of gas and H2S is diagnostic of Shigella species.",
            "keyConcept": "TSI K/A (red slant, yellow butt, no gas, no H2S) = Shigella spp.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/tsi_reactions_comparison.webp",
                "caption": "Station 17 — TSI Pattern: Shigella"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0018",
            "type": "mcq",
            "lecture": 2,
            "text": "Examine this TSI slant inoculated with a blood-culture isolate from a suspected typhoid patient. The tube shows a red slant (alkaline), a yellow butt (acid), no gas, and a discrete black ring of hydrogen sulfide (H2S) precipitate at the junction. Identify this organism:",
            "options": [
                "Salmonella typhi",
                "Shigella flexneri",
                "Vibrio cholerae",
                "Escherichia coli"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Salmonella typhi ferments glucose only without gas production (K/A) and produces a modest, characteristic trace ring of black iron sulfide (H2S +) at the junction of the slant and butt. In contrast, non-typhoidal Salmonella (e.g., S. enteritidis) produces abundant gas and extensive blackening throughout the butt.",
            "keyConcept": "TSI K/A with trace H2S ring, no gas = Salmonella typhi.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/tsi_reactions_comparison.webp",
                "caption": "Station 18 — TSI Pattern: Salmonella typhi"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0019",
            "type": "mcq",
            "lecture": 2,
            "text": "In the Triple Sugar Iron (TSI) test, what biochemical mechanism produces the intense black color seen in Salmonella and Proteus cultures?",
            "options": [
                "Production of H2S gas from sodium thiosulfate which reacts with ferric ammonium citrate to precipitate ferrous sulfide",
                "Charcoal precipitation induced by bacterial beta-galactosidase",
                "Melanin pigment synthesis in aerobic conditions",
                "Oxidation of potassium tellurite to elemental black tellurium"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: TSI contains sodium thiosulfate and ferrous sulfate/ferric ammonium citrate. Bacteria possessing thiosulfate reductase reduce thiosulfate to colorless H2S gas, which rapidly combines with iron ions to form insoluble, dense black ferrous sulfide (FeS).",
            "keyConcept": "Blackening in TSI = H2S reaction with iron ions forming ferrous sulfide precipitate.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/tsi_reactions_comparison.webp",
                "caption": "Station 19 — Hydrogen Sulfide (H2S) Detection"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0020",
            "type": "mcq",
            "lecture": 2,
            "text": "Examine this Christensen Urease test. Tube 'A' remains orange/yellow, while Tube 'B' has developed an intense bright magenta/pink color throughout. Which gastrointestinal bacterium demonstrates rapid, strong positive urease activity matching Tube B?",
            "options": [
                "Helicobacter pylori (or Proteus mirabilis)",
                "Salmonella typhi",
                "Shigella dysenteriae",
                "Escherichia coli"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Urease hydrolyzes urea into carbon dioxide and ammonia (NH3). The released ammonia alkalinizes the medium, causing the phenol red pH indicator to turn bright magenta/pink. Helicobacter pylori and Proteus spp. are rapid, potent urease producers; Salmonella, Shigella, and E. coli are urease-negative.",
            "keyConcept": "Urease positive (magenta/pink) = Helicobacter pylori and Proteus; Urease negative = Salmonella, Shigella.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/urease_test_reaction.webp",
                "caption": "Station 20 — Christensen Urease Test Reaction"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0021",
            "type": "mcq",
            "lecture": 2,
            "text": "In the IMViC series, the Indole test is performed by inoculating peptone water and adding Kovac's reagent after 24 hours. A cherry-red surface ring signifies a positive reaction. Which organism is characteristically Indole-positive?",
            "options": [
                "Escherichia coli",
                "Salmonella typhi",
                "Klebsiella pneumoniae",
                "Shigella sonnei"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The indole test detects the tryptophanase enzyme, which breaks down tryptophan to indole, pyruvic acid, and ammonia. Kovac's reagent (p-dimethylaminobenzaldehyde) reacts with indole to form a cherry-red rosindole dye layer. E. coli is Indole-positive; Salmonella, Klebsiella, and Proteus mirabilis are negative.",
            "keyConcept": "Indole positive (cherry-red ring) = Escherichia coli.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/macconkey_lf_nlf.webp",
                "caption": "Station 21 — Indole Biochemical Test"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0022",
            "type": "mcq",
            "lecture": 2,
            "text": "In Simmons Citrate agar, the utilization of sodium citrate as the sole carbon source converts the bromothymol blue indicator from green to deep Prussian blue. Which enteric organism is Citrate-negative (tube remains green)?",
            "options": [
                "Escherichia coli (and Shigella spp.)",
                "Klebsiella pneumoniae",
                "Salmonella enterica",
                "Enterobacter aerogenes"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Simmons citrate tests whether an organism can transport and utilize citrate as its sole source of carbon and ammonium salts as its nitrogen source. Alkaline carbonates release ammonia, turning bromothymol blue from green to intense blue. E. coli and Shigella are Citrate-negative (green); Klebsiella, Salmonella, and Enterobacter are Citrate-positive (blue).",
            "keyConcept": "Citrate negative (green) = Escherichia coli; Citrate positive (blue) = Klebsiella, Salmonella.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/oxidase_test_reaction.webp",
                "caption": "Station 22 — Simmons Citrate Utilization Reaction"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0023",
            "type": "mcq",
            "lecture": 2,
            "text": "What is the classic IMViC profile that definitively differentiates Escherichia coli from Klebsiella pneumoniae in enteric laboratory diagnostics?",
            "options": [
                "E. coli is + + - - (Indole +, Methyl Red +, VP -, Citrate -); Klebsiella is - - + +",
                "E. coli is - - + +; Klebsiella is + + - -",
                "E. coli is + - + -; Klebsiella is - + - +",
                "Both E. coli and Klebsiella share the identical profile + + + +"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The IMViC battery (Indole, Methyl Red, Voges-Proskauer, Citrate) is the classic mnemonic for distinguishing coliforms. E. coli is Indole positive, Methyl Red positive, VP negative, Citrate negative (+ + - -). Klebsiella pneumoniae is Indole negative, MR negative, VP positive, Citrate positive (- - + +).",
            "keyConcept": "E. coli IMViC: ++-- ; Klebsiella IMViC: --++",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/macconkey_lf_nlf.webp",
                "caption": "Station 23 — IMViC Differential Battery"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0024",
            "type": "mcq",
            "lecture": 2,
            "text": "Examine this selective media plate (Mannitol Salt Agar, MSA). Colonies of Station A show bright yellow zones due to mannitol fermentation, while Station B shows growth with red background. Which foodborne pathogen is represented by Station A?",
            "options": [
                "Staphylococcus aureus",
                "Staphylococcus epidermidis",
                "Bacillus cereus",
                "Salmonella enteritidis"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Mannitol Salt Agar contains 7.5% NaCl, mannitol, and phenol red. The high salt concentration inhibits most non-staphylococcal bacteria. Staphylococcus aureus tolerates salt and ferments mannitol, generating acidic end-products that turn phenol red to golden yellow. S. epidermidis grows but does not ferment mannitol (remains red).",
            "keyConcept": "Mannitol Salt Agar yellow fermentation = Staphylococcus aureus.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/mannitol_salt_agar.webp",
                "caption": "Station 24 — Mannitol Salt Agar Differentiation"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0025",
            "type": "mcq",
            "lecture": 2,
            "text": "A gastric antral biopsy placed into a rapid urease test (CLO test) broth at room temperature changes from yellow to bright pink within 15 minutes. What is the clinical significance of this result?",
            "options": [
                "Confirms active Helicobacter pylori colonization of gastric mucosa",
                "Indicates presence of Candida albicans yeast overgrowth",
                "Demonstrates complete eradication of H. pylori following triple therapy",
                "Suggests gastric adenocarcinoma secreting ectopic alkaline phosphatase"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Helicobacter pylori produces massive quantities of constitutive urease to create an alkaline ammonia microenvironment protecting it from gastric HCl. Biopsy inoculation into a urea-phenol red broth yields a rapid color shift to pink/magenta within 15–60 minutes (sensitivity and specificity >90%).",
            "keyConcept": "CLO test: rapid pink color shift indicates active Helicobacter pylori infection.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/urease_test_reaction.webp",
                "caption": "Station 25 — Rapid Urease Test (CLO Test)"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0026",
            "type": "mcq",
            "lecture": 2,
            "text": "What is the recommended non-invasive diagnostic test to confirm successful eradication of Helicobacter pylori 4 to 6 weeks after completing eradication therapy?",
            "options": [
                "13C- or 14C-Urea Breath Test (or Stool Antigen Test)",
                "Serum IgG ELISA serology for H. pylori antibodies",
                "Barium swallow examination of stomach and duodenum",
                "Total serum pepsinogen I/II ratio assay"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Serum IgG antibodies against H. pylori remain elevated for months to years after successful cure and cannot distinguish past from active infection. Active eradication is confirmed only by the 13C/14C-Urea Breath Test (UBT) or monoclonal Stool Antigen Test (SAT) performed at least 4 weeks post-treatment and 2 weeks off PPIs.",
            "keyConcept": "Confirm H. pylori eradication: Urea Breath Test or Stool Antigen Test (never serology).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/urease_test_reaction.webp",
                "caption": "Station 26 — Post-Treatment Eradication Monitoring"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0027",
            "type": "mcq",
            "lecture": 2,
            "text": "Which serological method is used to determine the somatic (O) and flagellar (H) antigen composition of isolated Salmonella colonies on a slide?",
            "options": [
                "Slide agglutination test with polyvalent followed by factor-specific O and H antisera",
                "Radial immunodiffusion assay in agarose gel",
                "Western blot chemiluminescence assay",
                "Complement fixation test with guinea pig serum"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Slide agglutination is the reference standard for serological identification of Salmonella (Kauffmann-White scheme). Bacterial emulsion on a clean slide is mixed with polyvalent O antisera, followed by specific O group antisera (Group A, B, C, D) and then H (flagellar phase 1 and 2) antisera, observing for macroscopic clumping within 1 minute.",
            "keyConcept": "Salmonella serotyping: Kauffmann-White slide agglutination using O and H antisera.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/salmonella_slide_agglutination.webp",
                "caption": "Station 27 — Slide Agglutination Serotyping"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0028",
            "type": "mcq",
            "lecture": 2,
            "text": "What is the motility and flagellar arrangement characteristic of Salmonella enterica under the microscope?",
            "options": [
                "Actively motile by peritrichous flagella surrounding the entire cell",
                "Monotrichous with a single polar sheathed flagellum",
                "Lophotrichous with a tuft of polar flagella at one pole",
                "Completely non-motile lacking any flagellar apparatus"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Salmonella species (with the exception of the rare avian non-motile serotypes S. gallinarum and S. pullorum) are actively motile through multiple peritrichous flagella distributed uniformly over the cell surface.",
            "keyConcept": "Salmonella: Motile by peritrichous flagella.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/gram_negative_bacilli.webp",
                "caption": "Station 28 — Enteric Flagellar Arrangement"
            }
        },

        # ── LECTURE 3: Food Poisoning & Enteric Fever (Stations 29–40) ───────────────
        {
            "id": "MGL3-CH307-MICR-0029",
            "type": "mcq",
            "lecture": 3,
            "text": "Five coworkers develop sudden violent nausea, projectile vomiting, and abdominal cramps within 3 to 4 hours of eating potato salad and custard pastries at a restaurant buffet. None have fever. What is the most likely pathogen and pathophysiological mechanism?",
            "options": [
                "Staphylococcus aureus: ingestion of preformed heat-stable enterotoxin (A–E)",
                "Salmonella enteritidis: mucosal invasion and active enterotoxin production in vivo",
                "Clostridium perfringens: enterotoxin release during sporulation in the ileum",
                "Shigella sonnei: cytotoxic microvascular endothelial destruction"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: An ultra-short incubation period of 1 to 6 hours (typically 2–4 hours) following consumption of high-salt or creamy foods (mayonnaise, pastries, processed meat) dominated by upper GI symptoms (intense nausea, projectile vomiting) without fever is pathognomonic for preformed Staphylococcus aureus enterotoxins acting as neural emetic superantigens.",
            "keyConcept": "Staph aureus food poisoning: Rapid onset (1–6 hrs), intense vomiting, preformed heat-stable enterotoxin.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/gram_positive_staph.webp",
                "caption": "Station 29 — Food Poisoning Case: Bacterial Morphology"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0030",
            "type": "mcq",
            "lecture": 3,
            "text": "A college student develops severe vomiting 2 hours after reheating fried rice left at room temperature overnight. Which organism and enterotoxin are responsible for this rapid emetic presentation?",
            "options": [
                "Bacillus cereus: preformed heat-stable cereulide toxin",
                "Bacillus cereus: heat-labile diarrheal enterotoxin formed in vivo",
                "Clostridium botulinum: neurotoxin blocking acetylcholine release",
                "Listeria monocytogenes: listeriolysin O pore-forming toxin"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Bacillus cereus spores survive boiling/steaming of rice; unrefrigerated storage permits germination and production of 'cereulide', a heat-stable cyclic peptide emetic toxin. Ingestion produces acute vomiting within 1–5 hours (resembling Staph. aureus). A separate heat-labile diarrheal toxin causes watery diarrhea with an 8–16 hour onset.",
            "keyConcept": "Bacillus cereus fried rice syndrome: Emetic form (1–5 hrs) via heat-stable cereulide toxin.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/gram_negative_bacilli.webp",
                "caption": "Station 30 — Food Poisoning Pathogens"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0031",
            "type": "mcq",
            "lecture": 3,
            "text": "A 16-year-old girl is admitted with persistent high step-ladder fever, dry cough, dull frontal headache, and constipation for 6 days. On exam, her temperature is 39.8°C with a pulse of 72 bpm (relative bradycardia). What is the single most sensitive diagnostic investigation during this FIRST week of illness?",
            "options": [
                "Blood culture (or clot culture)",
                "Widal agglutination test",
                "Stool culture on MacConkey agar",
                "Urine culture on CLED agar"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: In enteric (typhoid) fever, bacteremia peaks during the 1st week of infection; blood culture is positive in >90% of cases and provides the definitive diagnostic isolate. Stool and urine cultures are typically negative during the 1st week, and the Widal serological test becomes positive only during the 2nd week.",
            "keyConcept": "Enteric fever 1st week: Blood culture is the investigation of choice (>90% positive).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/macconkey_lf_nlf.webp",
                "caption": "Station 31 — First-Week Enteric Fever Diagnostic Protocol"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0032",
            "type": "mcq",
            "lecture": 3,
            "text": "What is the technical advantage of performing a 'Clot Culture' over standard whole blood culture in suspected typhoid patients who have already taken antibiotics?",
            "options": [
                "Antibacterial antibodies and inhibitory antibiotics in serum are discarded with the serum, while trapped Salmonella in the retracted clot are lysed with streptokinase",
                "The clot provides a dense anaerobic matrix promoting sporulation",
                "Fibrin strands in the clot directly stain Gram-negative under ultraviolet light",
                "Serum proteins in the clot act as selective inhibitors of normal flora"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: In clot culture, the patient's blood is allowed to clot; the serum is separated and used for Widal testing, thereby removing circulating antibodies and serum antibiotics that inhibit bacterial growth. The clot is then lysed with streptokinase and inoculated into bile broth, significantly increasing the isolation rate of Salmonella typhi.",
            "keyConcept": "Clot culture: removes inhibitory serum/antibiotics and concentrates Salmonella in the clot.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/stewart_cary_blair_transport.webp",
                "caption": "Station 32 — Clot Culture Procedure"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0033",
            "type": "mcq",
            "lecture": 3,
            "text": "During the SECOND and THIRD weeks of enteric fever, which non-invasive clinical specimens show highest diagnostic yield for culture of Salmonella typhi?",
            "options": [
                "Stool culture (2nd week onward) and Urine culture (3rd week)",
                "Cerebrospinal fluid and sputum",
                "Saliva and nasopharyngeal aspirate",
                "Skin scrapings from the lower limbs"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Following primary bacteremia and hepatobiliary replication in week 1, Salmonella typhi is excreted via bile into the intestine in huge numbers during the 2nd and 3rd weeks, making stool culture highly positive. In the 3rd week, bacteremic seeding of the renal parenchyma renders urine culture positive in up to 25% of patients.",
            "keyConcept": "Typhoid cultures: Week 1 = Blood; Week 2 = Stool; Week 3 = Urine.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/macconkey_lf_nlf.webp",
                "caption": "Station 33 — Enteric Fever Timeline & Specimens"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0034",
            "type": "mcq",
            "lecture": 3,
            "text": "Examine this Widal slide qualitative agglutination test. What type of immunological reaction takes place between the patient's serum and the Salmonella antigens?",
            "options": [
                "Direct agglutination reaction between serum antibodies and particulate bacterial antigens",
                "Precipitation reaction involving soluble exotoxin antigens in agar",
                "Enzyme-linked chromogenic substrate hydrolysis",
                "Complement-dependent immune hemolysis of sensitized sheep erythrocytes"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The Widal test is a classical direct tube/slide agglutination reaction. Serum antibodies bind to whole, particulate bacterial somatic (O) and flagellar (H) antigens of Salmonella enterica serovars Typhi and Paratyphi, producing visible clumping/lattice aggregates.",
            "keyConcept": "Widal test: Direct agglutination between serum antibodies and particulate O/H antigens.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/widal_slide_agglutination.webp",
                "caption": "Station 34 — Widal Slide Qualitative Test"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0035",
            "type": "mcq",
            "lecture": 3,
            "text": "Examine this Widal tube titration series. In endemic regions like Egypt, what are the minimum diagnostic cutoff titers for Salmonella O and H agglutinins in an unvaccinated patient indicating active enteric fever?",
            "options": [
                "Titer of ≥ 1/160 for anti-O and ≥ 1/160 for anti-H (or a fourfold rising titer in paired sera)",
                "Titer of ≥ 1/20 for anti-O and ≥ 1/40 for anti-H",
                "Titer of ≥ 1/1280 only for anti-Vi capsular antigen",
                "Any detectable titer > 1/10 is definitively diagnostic"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Because of baseline background exposure in endemic areas, baseline titers up to 1/80 may be non-specific. An anti-O titer ≥ 1/160 and anti-H titer ≥ 1/160 in a single specimen is considered clinically significant, but demonstrating a fourfold rise in titer between acute (week 1) and convalescent (week 2–3) sera is the definitive diagnostic gold standard.",
            "keyConcept": "Significant Widal titer in endemic areas: O and H ≥ 1/160, or a fourfold rising titer.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/widal_tube_titration.webp",
                "caption": "Station 35 — Widal Tube Quantitative Titration"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0036",
            "type": "mcq",
            "lecture": 3,
            "text": "In interpreting Widal serology, a high anti-O titer (≥ 1/320) with a low anti-H titer (< 1/40) strongly indicates which clinical status?",
            "options": [
                "Early acute typhoid fever infection",
                "Late convalescent stage of typhoid fever",
                "Previous vaccination with TAB vaccine years ago",
                "Non-specific anamnestic reaction to malaria"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: IgM antibodies against somatic (O) antigen appear first (days 6–8) and disappear rapidly (within 3–6 months); hence, an elevated O titer with low/absent H indicates early acute infection. IgG antibodies against flagellar (H) antigen appear later, peak in convalescence, and persist for years (or follow immunization).",
            "keyConcept": "High O + Low H = Early acute typhoid infection; High H + Low O = Past infection or vaccination.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/widal_tube_titration.webp",
                "caption": "Station 36 — Widal Serological Kinetics"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0037",
            "type": "mcq",
            "lecture": 3,
            "text": "What serological finding explains an elevated anti-H titer with a low/negative anti-O titer in an asymptomatic food handler?",
            "options": [
                "Past Salmonella infection or prior vaccination with TAB/typhoid vaccine",
                "Active acute typhoid bacteremia requiring immediate isolation",
                "Severe cross-reaction with Entamoeba histolytica",
                "Laboratory false-positive due to cold hemagglutinins"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Anti-H flagellar antibodies persist for years following either natural recovery or immunization with typhoid vaccines (such as TAB vaccine), whereas anti-O antibodies wane within months. An isolated elevated H titer in an asymptomatic individual reflects immunological memory, not acute disease.",
            "keyConcept": "Isolated high H titer without high O = past infection or prior vaccination.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/widal_tube_titration.webp",
                "caption": "Station 37 — Immunological Memory vs Acute Titers"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0038",
            "type": "mcq",
            "lecture": 3,
            "text": "A certified food handler recovered from typhoid fever 1 year ago. To screen for chronic fecal Salmonella carriage, what is the anatomical reservoir and the required laboratory protocol?",
            "options": [
                "The gallbladder is the chronic reservoir; perform repeated stool cultures following Selenite F enrichment after a saline purge",
                "The stomach antrum is the reservoir; perform gastric juice culture via nasogastric tube",
                "The appendix is the reservoir; perform appendiceal ultrasound and serum amylase",
                "The terminal ileum is the reservoir; perform colonoscopy biopsy for viral PCR"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Approximately 1–4% of patients become chronic carriers (harboring Salmonella typhi for >1 year). The bacteria persist within the gallbladder (often embedded in gallstones or biliary slime). Diagnosis requires multiple serial stool cultures following Selenite F broth enrichment, often stimulated by a saline laxative purge.",
            "keyConcept": "Chronic typhoid carrier reservoir = Gallbladder; screened by repeated stool cultures after Selenite F enrichment.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/stewart_cary_blair_transport.webp",
                "caption": "Station 38 — Chronic Carrier Screening Protocol"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0039",
            "type": "mcq",
            "lecture": 3,
            "text": "Which serological test is highly valuable as a screening tool to detect asymptomatic chronic typhoid carriers in large populations of food handlers?",
            "options": [
                "Detection of serum antibodies against Salmonella Vi capsular polysaccharide antigen",
                "Serum anti-streptolysin O (ASO) titer",
                "Direct Coombs antiglobulin test",
                "Rapid plasma reagin (RPR) flocculation test"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Chronic carriers continuously harbor viable Salmonella typhi possessing the surface virulence capsular polysaccharide (Vi antigen). Serum anti-Vi antibodies are present in >85–90% of chronic carriers, making anti-Vi ELISA/agglutination the premier serological screening method before pursuing repeated stool cultures.",
            "keyConcept": "Screening chronic typhoid carriers: Serum anti-Vi capsular antibody detection.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/salmonella_slide_agglutination.webp",
                "caption": "Station 39 — Anti-Vi Serological Screening"
            }
        },
        {
            "id": "MGL3-CH307-MICR-0040",
            "type": "mcq",
            "lecture": 3,
            "text": "A patient with chronic schistosomiasis develops prolonged, persistent bacteremia with recurrent high fever. Stool and urine cultures repeatedly grow non-typhoidal Salmonella. What is the pathological explanation for this chronic urinary carrier state?",
            "options": [
                "Salmonella organisms adhere to the tegument and pili of adult Schistosoma haematobium worms in pelvic venous plexuses",
                "Schistosoma eggs directly synthesize bacterial capsules that evade ampicillin",
                "Bile salts in the bladder promote Salmonella L-form transformation",
                "Schistosoma miracidia act as obligate intracellular hosts for enterobacteria"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: In chronic urinary schistosomiasis (Schistosoma haematobium), adult schistosome worms in the vesical and pelvic venous plexuses provide an immune-privileged nidus. Salmonella adhere to the surface tegument of the worms via bacterial fimbriae, causing recalcitrant, prolonged bacteremia and chronic urinary excretion.",
            "keyConcept": "Salmonella-Schistosoma symbiosis: Salmonella colonize the tegument of adult schistosomes.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/microbiology/gram_negative_bacilli.webp",
                "caption": "Station 40 — Schistosoma-Associated Salmonella Carrier State"
            }
        }
    ]
    return questions + NET_NEW_MICROBIOLOGY

# NET_NEW_MICROBIOLOGY for stations 41 to 65

NET_NEW_MICROBIOLOGY = [
    {
        "id": "MGL3-CH307-MICR-0041",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this stool culture on MacConkey agar demonstrating deep pink/magenta colonies with bile precipitation on the left versus translucent, colorless colonies on the right. What biochemical property and mechanism explains this differential reaction?",
        "options": [
            "Lactose fermentation; lactic acid lowers pH, causing the neutral red indicator to turn pink",
            "Sucrose fermentation; alkaline ammonia production turns phenol red purple",
            "Hydrogen sulfide (H2S) production reacting with ferric citrate",
            "Urease hydrolysis raising pH above 8.4"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: MacConkey agar is both selective and differential: bile salts and crystal violet inhibit Gram-positive bacteria. Neutral red is the pH indicator (red/pink at pH < 6.8). Lactose fermenters (e.g., E. coli, Klebsiella) produce organic acids from lactose, dropping the pH and precipitating bile salts to yield bright pink colonies; non-lactose fermenters (e.g., Salmonella, Shigella) utilize peptones, raising pH and remaining colorless/translucent.",
        "keyConcept": "MacConkey agar: neutral red turns pink upon lactose fermentation (E. coli); non-lactose fermenters remain colorless (Salmonella).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0041.webp",
            "caption": "Station 41 — MacConkey Agar LF vs NLF Differential Reaction"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0042",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this stool culture on Eosin Methylene Blue (EMB) agar. Dark, nucleated colonies exhibit an unmistakable, brilliant green metallic sheen under reflected light. Identify the organism responsible for this vigorous fermentation:",
        "options": [
            "Escherichia coli",
            "Salmonella enterica",
            "Shigella sonnei",
            "Proteus vulgaris"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Eosin Methylene Blue (EMB) agar contains aniline dyes (eosin Y and methylene blue) that inhibit Gram-positive organisms and act as indicators. Rapid, vigorous lactose fermentation by Escherichia coli generates high acid concentrations, precipitating the eosin-methylene blue dye complex onto the colony surface to produce a pathognomonic bright green metallic sheen.",
        "keyConcept": "EMB agar: vigorous lactose fermentation by E. coli produces a characteristic green metallic sheen.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0042.webp",
            "caption": "Station 42 — E. coli Green Metallic Sheen on EMB Agar"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0043",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this stool culture from a patient with voluminous 'rice-water' diarrhea plated on Thiosulfate-Citrate-Bile Salts-Sucrose (TCBS) agar. Large, smooth, elevated golden-yellow colonies grow luxuriantly against the dark green agar. Identify this pathogen and the metabolic reaction:",
        "options": [
            "Vibrio cholerae; ferments sucrose, dropping pH and turning thymol blue / bromothymol blue yellow",
            "Vibrio parahaemolyticus; non-sucrose fermenter",
            "Campylobacter jejuni; produces alkaline ammonia",
            "Pseudomonas aeruginosa; pigments pyocyanin"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: TCBS agar is a highly selective and differential medium (pH 8.6) for isolation of pathogenic Vibrio species. Vibrio cholerae ferments sucrose present in the medium, generating acid that changes the dual pH indicator system (thymol blue and bromothymol blue) from dark green to bright golden yellow, yielding characteristic large yellow colonies.",
        "keyConcept": "TCBS agar: Vibrio cholerae ferments sucrose to form large golden-yellow colonies on dark green agar.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0043.webp",
            "caption": "Station 43 — Vibrio cholerae Yellow Colonies on TCBS Agar"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0044",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this stool culture on TCBS agar from a coastal seafood worker presenting with acute food poisoning. The colonies appear blue-green (non-sucrose fermenters) with dark centers. Identify this halophilic bacterium:",
        "options": [
            "Vibrio parahaemolyticus",
            "Vibrio cholerae",
            "Salmonella enterica",
            "Helicobacter pylori"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Vibrio parahaemolyticus is a halophilic marine Vibrio requiring 2–4% NaCl for optimal growth. Unlike V. cholerae, it does not ferment sucrose; on TCBS agar, it utilizes peptones and leaves the bromothymol blue indicator unchanged, forming round, translucent blue-green colonies.",
        "keyConcept": "TCBS agar: Vibrio parahaemolyticus is sucrose-negative, forming distinct blue-green colonies.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0044.webp",
            "caption": "Station 44 — Vibrio parahaemolyticus Sucrose-Negative Colonies"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0045",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this Salmonella-Shigella (SS) agar plate. Colorless colonies display prominent jet-black centers. What biochemical reaction causes this black pigmentation, and which pathogen does it identify?",
        "options": [
            "Hydrogen sulfide (H2S) reduction from sodium thiosulfate reacting with ferric ammonium citrate; indicates Salmonella",
            "Lactose fermentation with neutral red reduction; indicates Shigella",
            "Urease cleavage of urea to ammonia; indicates Proteus",
            "Oxidase enzyme oxidation of phenylenediamine; indicates Pseudomonas"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: SS agar contains sodium thiosulfate (sulfur source) and ferric ammonium citrate (indicator). Salmonella species reduce thiosulfate to hydrogen sulfide gas (H2S), which combines with iron to form insoluble black ferrous sulfide (FeS) precipitate in colony centers. Shigella does not produce H2S and forms completely translucent colonies without black centers.",
        "keyConcept": "SS agar: Salmonella forms colorless colonies with black centers (H2S+); Shigella forms colorless colonies without black centers (H2S-).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0045.webp",
            "caption": "Station 45 — SS Agar Salmonella H2S Black Centers"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0046",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this stool culture on Hektoen Enteric (HE) agar. Colonies of Shigella appear green-to-blue-green without black centers, whereas Salmonella colonies appear blue-green with dense black centers. Why are Shigella colonies green on this medium?",
        "options": [
            "Shigella does not ferment lactose, sucrose, or salicin and does not produce H2S, leaving bromothymol blue green",
            "Shigella ferments lactose vigorously to produce green acid pigments",
            "Shigella produces pyoverdine fluorescent pigment",
            "Shigella hydrolyzes bile salts to precipitate green bile acids"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Hektoen Enteric agar contains bile salts, carbohydrates (lactose, sucrose, salicin), bromothymol blue / acid fuchsin indicators, and iron indicators. Shigella does not ferment any of the carbohydrates and does not produce H2S; it raises pH by peptone breakdown, appearing as green-blue translucent colonies without black centers.",
        "keyConcept": "Hektoen Enteric agar: Shigella = green translucent colonies (no sugar fermentation, no H2S); Salmonella = green with black centers.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0046.webp",
            "caption": "Station 46 — Hektoen Enteric Agar Shigella vs Salmonella"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0047",
        "type": "mcq",
        "lecture": 1,
        "text": "A child presents with bloody diarrhea and hemolytic uremic syndrome (HUS). Stool culture on Sorbitol MacConkey (SMAC) agar yields colorless, translucent colonies, while normal commensal E. coli strains form bright pink colonies. Identify this specific Shiga-toxin producing serotype:",
        "options": [
            "Enterohemorrhagic E. coli (EHEC O157:H7)",
            "Enterotoxigenic E. coli (ETEC)",
            "Enteropathogenic E. coli (EPEC)",
            "Enteroinvasive E. coli (EIEC)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Sorbitol MacConkey (SMAC) agar substitutes D-sorbitol for lactose. Approximately 95% of commensal E. coli ferment sorbitol within 24 hours, forming pink colonies. Enterohemorrhagic E. coli (EHEC O157:H7) is unique among E. coli in being sorbitol-negative (delayed > 48h), forming pathognomonic colorless/translucent colonies on SMAC.",
        "keyConcept": "SMAC agar: EHEC O157:H7 is sorbitol-negative (colorless colonies), differentiating it from sorbitol-fermenting commensal E. coli (pink).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0047.webp",
            "caption": "Station 47 — Sorbitol MacConkey Agar EHEC O157:H7 Isolation"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0048",
        "type": "mcq",
        "lecture": 3,
        "text": "A selective blood agar plate (Campy-BAP) incubated at 42°C under microaerophilic conditions (5% O2, 10% CO2, 85% N2) yields non-hemolytic, effuse, spreading grey colonies. Gram stain reveals curved, seagull-winged Gram-negative bacilli exhibiting darting motility. Identify this enteropathogen:",
        "options": [
            "Campylobacter jejuni",
            "Helicobacter pylori",
            "Vibrio cholerae",
            "Pseudomonas aeruginosa"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Campylobacter jejuni is a thermophilic microaerophile requiring 42°C (which inhibits other fecal flora) and reduced oxygen (5% O2, 10% CO2). Gram-stain displays pathognomonic curved, S-shaped, or 'gull-wing' Gram-negative rods with a single polar flagellum producing rapid darting 'corkscrew' motility.",
        "keyConcept": "Campylobacter jejuni: isolated at 42°C under microaerophilic conditions; gull-wing Gram-negative rods with darting motility.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0048.webp",
            "caption": "Station 48 — Campylobacter jejuni 42°C Microaerophilic Culture"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0049",
        "type": "mcq",
        "lecture": 3,
        "text": "Examine this culture on Mannitol Salt Agar (MSA) containing 7.5% NaCl. Golden-yellow colonies surrounded by bright yellow halos are observed, while surrounding uninoculated agar is red. Identify this foodborne enterotoxin producer:",
        "options": [
            "Staphylococcus aureus",
            "Staphylococcus epidermidis",
            "Streptococcus pyogenes",
            "Bacillus cereus"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Mannitol Salt Agar contains 7.5% NaCl, which selectively inhibits non-staphylococcal organisms. Staphylococcus aureus is distinguished from coagulase-negative staphylococci (e.g., S. epidermidis) by its ability to ferment mannitol, producing acid that turns the phenol red indicator from red to golden yellow.",
        "keyConcept": "MSA: 7.5% NaCl selects for Staphylococci; S. aureus ferments mannitol turning phenol red yellow.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0049.webp",
            "caption": "Station 49 — Mannitol Salt Agar S. aureus Yellow Fermentation"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0050",
        "type": "mcq",
        "lecture": 3,
        "text": "Stool from an adolescent with acute mesenteric adenitis mimicking acute appendicitis is inoculated onto Cefsulodin-Irgasan-Novobiocin (CIN) agar and incubated at 28°C. Small, smooth colonies with a distinctive deep red center surrounded by a transparent border ('bull's-eye' appearance) appear. Identify this organism:",
        "options": [
            "Yersinia enterocolitica",
            "Salmonella Enteritidis",
            "Escherichia coli",
            "Listeria monocytogenes"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Yersinia enterocolitica is psychrotrophic, growing optimally at room temperature (25–28°C). On CIN selective agar, it ferments mannitol in the presence of neutral red, generating localized acid precipitation that produces pathognomonic 'bull's-eye' colonies (deep red center with a clear translucent outer rim).",
        "keyConcept": "CIN agar: Yersinia enterocolitica forms distinctive 'bull's-eye' colonies (deep red center, clear border) at 28°C.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0050.webp",
            "caption": "Station 50 — CIN Agar Yersinia Bull's-Eye Colonies"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0051",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this Triple Sugar Iron (TSI) agar slant tube inoculated with an enteric pathogen. The slant is alkaline (red), the butt is acid (yellow) with gas cracks, and there is extensive black precipitate (H2S+) throughout the deep butt: K/A, gas (+), H2S (+). Identify this pathogen:",
        "options": [
            "Salmonella serotype (e.g., Salmonella Typhimurium)",
            "Shigella flexneri",
            "Escherichia coli",
            "Pseudomonas aeruginosa"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: In TSI agar, an alkaline slant / acid butt (K/A, red/yellow) indicates glucose fermentation only (0.1% glucose exhausted, amino acid oxidation on slant yields red amine products). Gas bubbles indicate glucose fermentation with CO2/H2 gas. Blackening indicates hydrogen sulfide (H2S) reduction reacting with iron salts. K/A, Gas (+), H2S (+) is the classic TSI profile of Salmonella.",
        "keyConcept": "TSI reading: K/A (red/yellow) + Gas (+) + H2S (+) = Salmonella.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0051.webp",
            "caption": "Station 51 — TSI Reaction K/A Gas+ H2S+ in Salmonella"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0052",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this Triple Sugar Iron (TSI) agar tube demonstrating an alkaline red slant, acid yellow butt, complete absence of gas, and no blackening: K/A, gas (-), H2S (-). Identify this dysentery-causing pathogen:",
        "options": [
            "Shigella species (e.g., Shigella dysenteriae)",
            "Salmonella Typhi",
            "Proteus mirabilis",
            "Klebsiella pneumoniae"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Shigella species ferment glucose only (yielding an acid yellow butt), do not ferment lactose or sucrose (yielding an alkaline red slant: K/A), do not produce gas from glucose (butt remains intact without fissures), and do not produce H2S (butt remains yellow without blackening). Profile: K/A, Gas (-), H2S (-).",
        "keyConcept": "TSI reading: K/A (red/yellow) without gas and without H2S = Shigella.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0052.webp",
            "caption": "Station 52 — TSI Reaction K/A Gas- H2S- in Shigella"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0053",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this Triple Sugar Iron (TSI) agar tube displaying an acid yellow slant, acid yellow butt, abundant gas pushing the agar up from the tube bottom, and no H2S: A/A, gas (+), H2S (-). Identify this coliform organism:",
        "options": [
            "Escherichia coli or Klebsiella pneumoniae",
            "Salmonella enterica",
            "Shigella dysenteriae",
            "Pseudomonas aeruginosa"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: An acid slant / acid butt (A/A, yellow/yellow) indicates that the organism ferments glucose as well as high concentrations (1.0%) of lactose and/or sucrose, generating sustained organic acids that keep both slant and butt yellow. Splitting or lifting of agar indicates heavy gas production without H2S, characteristic of coliforms (E. coli, Klebsiella).",
        "keyConcept": "TSI reading: A/A (yellow/yellow) + abundant gas + no H2S = E. coli or Klebsiella.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0053.webp",
            "caption": "Station 53 — TSI Reaction A/A Gas+ H2S- in E. coli"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0054",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this Triple Sugar Iron (TSI) agar tube showing an alkaline red slant, alkaline red butt, and no change in the medium: K/K, gas (-), H2S (-). Identify this non-fermenting Gram-negative rod:",
        "options": [
            "Pseudomonas aeruginosa",
            "Escherichia coli",
            "Salmonella Typhi",
            "Vibrio cholerae"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: An alkaline slant / alkaline butt (K/K, red/red) indicates that the organism is an obligate aerobe and non-fermenter unable to ferment glucose, lactose, or sucrose. It oxidizes peptones oxidatively on the surface, yielding alkaline amines that turn the entire tube deep red, characteristic of Pseudomonas aeruginosa and Acinetobacter.",
        "keyConcept": "TSI reading: K/K (red/red) = non-fermenter (Pseudomonas aeruginosa).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0054.webp",
            "caption": "Station 54 — TSI Reaction K/K Non-Fermenter in Pseudomonas"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0055",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this filter paper disk test impregnated with 1% tetramethyl-p-phenylenediamine dihydrochloride. A colony rubbed onto the paper turns deep dark purple within 15 seconds. Identify this test and an important gastrointestinal pathogen that is positive:",
        "options": [
            "Oxidase test; positive in Vibrio cholerae",
            "Catalase test; positive in Streptococcus",
            "Indole test; positive in Klebsiella",
            "Urease test; positive in Salmonella"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The cytochrome c oxidase test uses tetramethyl-p-phenylenediamine as an artificial electron donor. Oxidation by bacterial cytochrome c oxidase produces a dark purple indophenol blue within 10–30 seconds. Vibrio cholerae, Campylobacter jejuni, and Pseudomonas are strongly oxidase-positive, whereas all Enterobacteriaceae are strictly oxidase-negative.",
        "keyConcept": "Oxidase test: rapid purple color (cytochrome c oxidase+); Vibrio and Campylobacter are positive, Enterobacteriaceae are negative.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0055.webp",
            "caption": "Station 55 — Rapid Cytochrome c Oxidase Filter Paper Test"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0056",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this Christensen's urea agar slant inoculated with a gastric antral biopsy isolate. The medium has turned from pale yellow-orange to an intense, vibrant pink/magenta throughout within 20 minutes. Identify this reaction and the enzyme responsible:",
        "options": [
            "Urease test; bacterial urease hydrolyzes urea to ammonia, raising pH above 8.1 to turn phenol red magenta (Helicobacter pylori)",
            "Lactose fermentation; lactic acid lowers pH below 6.8",
            "Tryptophanase test; produces indole",
            "Gelatinase liquefaction"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Christensen's urea medium contains urea and phenol red pH indicator (yellow at pH 6.8, magenta at pH > 8.1). Bacterial urease hydrolyzes urea into carbon dioxide and ammonia (NH3); accumulation of alkaline ammonium ions raises the pH, turning the agar bright fuchsia/magenta. Helicobacter pylori and Proteus produce potent, rapid urease.",
        "keyConcept": "Urease test: hydrolyzes urea into NH3, raising pH to turn phenol red bright magenta (H. pylori, Proteus).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0056.webp",
            "caption": "Station 56 — Christensen's Urea Agar Rapid Magenta Reaction"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0057",
        "type": "mcq",
        "lecture": 3,
        "text": "A drop of 3% hydrogen peroxide (H2O2) is placed onto a bacterial colony on a glass slide, resulting in immediate, vigorous bubbling and gas effervescence. What enzyme is present, and which genus does it identify?",
        "options": [
            "Catalase; differentiates Staphylococcus (positive) from Streptococcus / Enterococcus (negative)",
            "Coagulase; differentiates S. aureus from S. epidermidis",
            "Oxidase; differentiates Vibrio from Salmonella",
            "Peroxidase; identifies anaerobic Clostridium"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The catalase test detects the enzyme catalase, which decomposes toxic hydrogen peroxide into water and molecular oxygen gas (2 H2O2 -> 2 H2O + O2), producing visible bubbling. Catalase distinguishes catalase-positive Staphylococci and Listeria from catalase-negative Streptococci and Enterococci.",
        "keyConcept": "Catalase test: breakdown of H2O2 produces immediate O2 gas bubbles; differentiates Staph (+) from Strep (-).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0057.webp",
            "caption": "Station 57 — Catalase Hydrogen Peroxide Effervescence Test"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0058",
        "type": "mcq",
        "lecture": 2,
        "text": "Following incubation in tryptone broth, Kovac's reagent (p-dimethylaminobenzaldehyde in isoamyl alcohol) is added to the tube, producing an immediate cherry-red surface ring. Identify this test and an enterobacterium that is positive:",
        "options": [
            "Indole test; positive in Escherichia coli",
            "Methyl red test; positive in Enterobacter",
            "Voges-Proskauer test; positive in Klebsiella",
            "Citrate test; positive in Salmonella"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The indole test detects the enzyme tryptophanase, which hydrolyzes tryptophan into indole, pyruvic acid, and ammonia. Indole reacts with p-dimethylaminobenzaldehyde in Kovac's reagent to form a rosindole dye (cherry-red ring at the meniscus). E. coli is indole-positive (part of the IMViC series: ++--), whereas Klebsiella pneumoniae is indole-negative.",
        "keyConcept": "Indole test: Kovac's reagent yields cherry-red surface ring; E. coli is indole (+), Klebsiella is indole (-).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0058.webp",
            "caption": "Station 58 — Indole Test Cherry-Red Ring in E. coli"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0059",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this Simmons Citrate agar slant. The medium has changed from its original forest green color to an intense Prussian blue along the entire slant. What does this color change signify?",
        "options": [
            "Citrate utilization as sole carbon source; produces alkaline sodium carbonate, turning bromothymol blue to Prussian blue",
            "Acidification of the medium from glucose fermentation",
            "Production of hydrogen sulfide gas",
            "Bile salt precipitation"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Simmons citrate agar tests the ability of an organism to utilize citrate as its sole carbon source and ammonium dihydrogen phosphate as its sole nitrogen source. Metabolism of citrate produces alkaline carbonates and bicarbonates, raising the pH > 7.6 and turning the bromothymol blue indicator from green to vivid Prussian blue (e.g., Klebsiella, Salmonella, Enterobacter).",
        "keyConcept": "Citrate test: growth and alkaline conversion turn bromothymol blue from green to intense Prussian blue.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0059.webp",
            "caption": "Station 59 — Simmons Citrate Prussian Blue Positive Reaction"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0060",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this serial tube dilution Widal agglutination test for enteric (typhoid) fever. In endemic regions like Egypt, what minimal serum agglutinin titer threshold is considered diagnostically significant for active current typhoid infection?",
        "options": [
            "Anti-O (somatic) titer >= 1:160 and Anti-H (flagellar) titer >= 1:160",
            "Anti-O titer = 1:20 and Anti-H = 1:40",
            "Anti-Vi titer >= 1:10 only",
            "Total agglutination at 1:10 dilution"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The Widal agglutination test measures antibodies against Salmonella enterica serotype Typhi somatic (O) and flagellar (H) antigens. In endemic areas, basal background titers exist; therefore, a single diagnostic titer requires Anti-O >= 1:160 (indicates active acute infection, appears early and disappears in months) and/or Anti-H >= 1:160 (indicates past infection, immunization, or late active stage), or ideally a 4-fold rising titer in paired sera.",
        "keyConcept": "Widal test: Anti-O >= 1:160 confirms acute typhoid fever; Anti-H >= 1:160 indicates past infection or immunization.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0060.webp",
            "caption": "Station 60 — Widal Serial Tube Titration Diagnostic Rack"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0061",
        "type": "mcq",
        "lecture": 1,
        "text": "In the Kauffmann-White antigenic classification scheme, what two primary surface antigens are used for serotyping Salmonella isolates using polyvalent and monovalent antisera on glass slides?",
        "options": [
            "Somatic (O) lipopolysaccharide antigens and Flagellar (H) phase 1 / phase 2 protein antigens",
            "Capsular (K) antigens and Peptidoglycan (M) antigens only",
            "Teichoic acid and Outer membrane porins",
            "Exotoxin A and Enterotoxin B"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The Kauffmann-White serological classification scheme identifies > 2,500 Salmonella serotypes based on: 1) Somatic (O) heat-stable polysaccharide antigens on the outer lipopolysaccharide cell wall (defining serogroups A, B, C1, C2, D, E), and 2) Flagellar (H) heat-labile protein antigens (diphasic: Phase 1 specific and Phase 2 non-specific). S. Typhi also possesses the capsular Vi (virulence) antigen.",
        "keyConcept": "Kauffmann-White classification: serotypes Salmonella using somatic O antigens and flagellar H phase 1/2 antigens.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0061.webp",
            "caption": "Station 61 — Kauffmann-White Salmonella Serotyping Slide Agglutination"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0062",
        "type": "mcq",
        "lecture": 3,
        "text": "Examine this Gram-stained gastric biopsy smear showing curved, spiral, gull-winged Gram-negative rods. What biochemical diagnostic triad characteristically identifies Helicobacter pylori?",
        "options": [
            "Urease-positive, Catalase-positive, and Oxidase-positive",
            "Urease-negative, Lactose-fermenter, and Indole-positive",
            "Oxidase-negative, H2S-positive, and Citrate-positive",
            "Coagulase-positive, Catalase-negative, and Bile-soluble"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Helicobacter pylori is a microaerophilic, spiral, S-shaped Gram-negative bacillus (0.5 x 3 µm) with multiple unipolar sheathed flagella. It is definitively characterized biochemically by the rapid diagnostic triad: Urease-positive (potent), Catalase-positive, and Cytochrome c Oxidase-positive.",
        "keyConcept": "Helicobacter pylori: spiral Gram-negative rod characterized by the triad of Urease (+), Catalase (+), and Oxidase (+).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0062.webp",
            "caption": "Station 62 — Helicobacter pylori Spiral Morphology & Enzyme Triad"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0063",
        "type": "mcq",
        "lecture": 3,
        "text": "A hospitalized patient develops pseudomembranous colitis following clindamycin therapy. Stool testing utilizes a two-step diagnostic algorithm. What initial screening enzyme and subsequent confirmatory targets are detected?",
        "options": [
            "Glutamate Dehydrogenase (GDH) screening antigen, followed by Enzyme Immunoassay (EIA) or PCR for Toxin A (enterotoxin) and Toxin B (cytotoxin)",
            "Lactose fermentation followed by Gram stain",
            "Widal agglutination for O and H antigens",
            "Van den Bergh diazo coupling"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Clostridioides difficile diagnostic guidelines mandate: 1) initial sensitive screening for C. difficile common Glutamate Dehydrogenase (GDH) antigen in stool, followed if positive by 2) specific enzyme immunoassay (EIA) or nucleic acid amplification test (NAAT/PCR) targeting Toxin A (enterotoxin causing mucosal fluid secretion) and Toxin B (potent cytotoxin disrupting actin cytoskeleton).",
        "keyConcept": "C. difficile diagnosis: initial GDH screening antigen confirmed by EIA or PCR for Toxin A and Toxin B.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0063.webp",
            "caption": "Station 63 — Clostridioides difficile GDH & Toxin A/B Diagnostic Algorithm"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0064",
        "type": "mcq",
        "lecture": 3,
        "text": "Two hours after consuming reheated Chinese fried rice, a student develops sudden nausea and profuse vomiting without diarrhea. What spore-forming organism and toxin is responsible for this short-incubation emetic food poisoning?",
        "options": [
            "Bacillus cereus; preformed heat-stable cyclic peptide toxin (Cereulide)",
            "Bacillus cereus; heat-labile enterotoxin produced in the intestine",
            "Clostridium perfringens enterotoxin",
            "Salmonella enterica"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Bacillus cereus causes two distinct syndromes: 1) Emetic syndrome: rapid incubation (1–6 hours), caused by preformed, heat-stable toxin (cereulide) that survives cooking of boiled/fried rice; 2) Diarrheal syndrome: longer incubation (8–16 hours), caused by heat-labile enterotoxins produced in vivo following ingestion of spores in contaminated meat or vegetables.",
        "keyConcept": "Bacillus cereus: emetic syndrome (1–6h, fried rice) caused by preformed heat-stable cereulide toxin.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0064.webp",
            "caption": "Station 64 — Bacillus cereus Food Poisoning Pathogenesis"
        }
    },
    {
        "id": "MGL3-CH307-MICR-0065",
        "type": "mcq",
        "lecture": 3,
        "text": "Examine this transmission electron micrograph (TEM) of fecal fluid from a 10-month-old infant with acute dehydrating watery diarrhea. Distinctive non-enveloped, double-shelled spherical 70 nm viral particles resembling 'cartwheels' with sharply defined radiating spokes are seen. Identify this viral pathogen:",
        "options": [
            "Rotavirus (Group A)",
            "Norovirus (Norwalk virus)",
            "Adenovirus serotypes 40/41",
            "Astrovirus"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Rotaviruses (Reoviridae, segmented double-stranded RNA) exhibit pathognomonic morphology on negative-stain electron microscopy: 70 nm naked icosahedral particles with a triple-layered capsid; the inner core and outer radiating capsomers give the appearance of a cartwheel (Latin 'rota' = wheel), representing the leading cause of severe dehydrating infantile diarrhea worldwide.",
        "keyConcept": "Rotavirus (TEM): 70 nm wheel-like ('cartwheel') particles with sharp radiating spokes; leading cause of infantile diarrhea.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/microbiology/img_micr_0065.webp",
            "caption": "Station 65 — Rotavirus Cartwheel Ultrastructure on TEM"
        }
    }
]


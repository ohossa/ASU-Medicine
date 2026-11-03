# scripts/data_biochemistry.py
"""
ASU Medical Portal — GIT Practical Bank: Biochemistry (Chapter 306)
Authentic practical stations covering:
- Lecture 1: Wilson's Disease & Copper Metabolism (Stations 1–12)
- Lecture 2: Nutritional Assessment & Caloric Calculations (Stations 13–24)
- Lecture 3: Liver Function Tests & Spectrophotometric Laboratory Calculations (Stations 25–40)
"""

def get_biochemistry_questions():
    questions = [
        # ── LECTURE 1: Wilson's Disease & Copper Metabolism (Stations 1–12) ──────────
        {
            "id": "MGL3-CH306-BIOC-0001",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this slit-lamp ophthalmologic photograph of the cornea. A golden-brown pigmented ring is clearly visible around the limbus in Descemet's membrane. Identify this pathognomonic clinical sign and the associated metabolic disorder:",
            "options": [
                "Kayser-Fleischer ring in Wilson disease (hepatolenticular degeneration)",
                "Arcus senilis in familial hypercholesterolemia",
                "Fleischer ring in keratoconus",
                "Band keratopathy in hyperparathyroidism"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Kayser-Fleischer (KF) rings represent copper deposition within Descemet's membrane at the corneal limbus. They appear as greenish-gold or brown granular bands and are pathognomonic for Wilson disease, present in >95% of patients with neurological manifestations and >50% of those with hepatic presentation.",
            "keyConcept": "Kayser-Fleischer ring in Descemet's membrane = Wilson disease (excess copper).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/kayser_fleischer_ring.webp",
                "caption": "Station 1 — Slit-Lamp Ophthalmic Examination"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0002",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the primary circulating copper-binding alpha-2 globulin synthesized by hepatocytes that typically demonstrates severely diminished serum levels in Wilson disease?",
            "options": [
                "Ceruloplasmin",
                "Transferrin",
                "Haptoglobin",
                "Hemopexin"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Ceruloplasmin carries >90–95% of normal circulating plasma copper. In Wilson disease, defective incorporation of copper into apoceruloplasmin due to mutant ATP7B yields an unstable apoprotein that is rapidly degraded in circulation, resulting in markedly reduced serum ceruloplasmin (<20 mg/dL; normal 20–40 mg/dL).",
            "keyConcept": "Wilson disease: Serum ceruloplasmin is characteristically reduced (<20 mg/dL).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/kayser_fleischer_ring.webp",
                "caption": "Station 2 — Copper Transport Protein Evaluation"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0003",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the primary genetic defect and cellular mechanism responsible for tissue copper accumulation in Wilson disease?",
            "options": [
                "Autosomal recessive mutation in the ATP7B gene (chromosome 13q14) encoding a copper-transporting P-type ATPase in the trans-Golgi network",
                "X-linked recessive defect in ATP7A encoding intestinal copper efflux",
                "Autosomal dominant mutation in the HFE gene leading to increased copper absorption",
                "Point mutation in the ceruloplasmin gene preventing copper binding in enterocytes"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Wilson disease is caused by homozygous or compound heterozygous mutations in ATP7B on chromosome 13. The ATP7B ATPase functions in hepatocytes to deliver copper into the trans-Golgi for ceruloplasmin synthesis and transport copper into bile canaliculi for excretion. Defective ATP7B blocks biliary copper excretion, causing progressive hepatic overload and spillover into blood.",
            "keyConcept": "Wilson disease etiology: Mutation in ATP7B (chr 13) impairing biliary copper excretion.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/wilson_mri_basal_ganglia.webp",
                "caption": "Station 3 — Molecular Genetics of Copper Transport"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0004",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this T2-weighted axial brain MRI of a 14-year-old boy presenting with tremors, dysarthria, and behavioral changes. Symmetrical hyperintensities are evident in the lenticular nuclei (putamen and globus pallidus) and midbrain. What is the biochemical cause of these neuroimaging findings?",
            "options": [
                "Toxic accumulation of non-ceruloplasmin-bound free copper inducing Fenton-reaction oxidative lipid peroxidation in basal ganglia",
                "Iron deposition within substantia nigra pars compacta",
                "Manganese intoxication following chronic total parenteral nutrition",
                "Bilirubin encephalopathy staining the subthalamic nucleus"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: When hepatic copper binding sites are saturated, non-ceruloplasmin-bound free copper spills into the systemic circulation and crosses the blood-brain barrier. Free Cu(II) catalyzes hydroxyl free radical generation via Haber-Weiss and Fenton chemistry, producing oxidative necrosis and cavitation within basal ganglia (particularly putamen and caudate), appearing as symmetric T2 hyperintensities.",
            "keyConcept": "Free copper toxicity: Fenton reaction oxidative damage to basal ganglia (lenticular nuclei).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/wilson_mri_basal_ganglia.webp",
                "caption": "Station 4 — T2-Weighted Brain MRI (Basal Ganglia Hyperintensity)"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0005",
            "type": "mcq",
            "lecture": 1,
            "text": "In a patient suspected of Wilson disease with borderline serum ceruloplasmin, what is the most reliable non-invasive confirmatory laboratory measurement?",
            "options": [
                "24-hour urinary copper excretion (markedly elevated, > 100 μg/24 hr or > 1.6 μmol/day)",
                "Serum total alkaline phosphatase activity",
                "Random spot urine dipstick for protein",
                "Plasma copper-to-zinc ratio on fasting morning blood"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: In Wilson disease, increased non-ceruloplasmin-bound free copper in plasma is readily filtered by renal glomeruli, resulting in a dramatic increase in 24-hour urinary copper excretion (>100 μg/24 hr, normal <40 μg/24 hr). This is a cornerstone non-invasive diagnostic test.",
            "keyConcept": "Confirmatory test for Wilson disease: 24-hour urinary copper excretion > 100 μg/day.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/kayser_fleischer_ring.webp",
                "caption": "Station 5 — 24-Hour Urinary Excretion Protocol"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0006",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the primary gold standard diagnostic test for definitive quantification of hepatic copper content when clinical and serological tests remain inconclusive?",
            "options": [
                "Quantitative dry weight copper assay on percutaneous liver biopsy (> 250 μg/g dry tissue)",
                "Hepatic ultrasound shear-wave elastography",
                "Technetium-99m sulfur colloid hepatobiliary scintigraphy",
                "Direct microscopic examination of bile aspirated via ERCP"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Liver biopsy with quantitative biochemical copper determination on dried tissue is the definitive gold standard. Normal hepatic copper is <50 μg/g dry weight; levels >250 μg/g dry weight definitively establish the diagnosis of Wilson disease even in presymptomatic siblings.",
            "keyConcept": "Gold standard for Wilson disease: Liver biopsy dry weight copper > 250 μg/g.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/liver_enzymes_alt_alp.webp",
                "caption": "Station 6 — Hepatic Tissue Copper Quantification"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0007",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the pharmacological mechanism of action of D-penicillamine in the management of symptomatic Wilson disease?",
            "options": [
                "Chelates copper via free sulfhydryl (-SH) groups forming a soluble complex excreted in urine",
                "Directly replaces the mutant ATP7B transporter protein in canalicular membranes",
                "Inhibits intestinal copper absorption by competitive binding to DMT1",
                "Converts trivalent cupric copper into insoluble elemental copper deposits in skin"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: D-penicillamine (β,β-dimethylcysteine) possesses a reactive free sulfhydryl group that chelates divalent heavy metal ions (Cu2+), forming stable, water-soluble penicillamine-copper ring complexes that are readily cleared and excreted by the kidneys, inducing massive cupriuresis.",
            "keyConcept": "D-Penicillamine: Sulfhydryl copper chelator inducing urinary excretion of copper.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/kayser_fleischer_ring.webp",
                "caption": "Station 7 — Pharmacological Chelation Therapy"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0008",
            "type": "mcq",
            "lecture": 1,
            "text": "Four months after initiating high-dose D-penicillamine therapy, a patient with Wilson disease develops painful glossitis, angular stomatitis, and symmetrical stocking-glove peripheral neuropathy. Plasma pyridoxal phosphate is 1.0 μg/L (low). What is the biochemical basis for this drug complication?",
            "options": [
                "Penicillamine reacts chemically with pyridoxal 5'-phosphate (PLP / Vitamin B6), forming an inactive thiazolidine adduct excreted in urine",
                "Penicillamine inhibits intestinal mucosal absorption of cyanocobalamin (Vitamin B12)",
                "Penicillamine destroys thiamine pyrophosphate by cleavage of the thiazole ring",
                "Penicillamine blocks riboflavin phosphorylation by riboflavin kinase"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: D-penicillamine binds directly to the active aldehyde group of pyridoxal 5'-phosphate (PLP / active Vitamin B6), forming an inactive thiazolidine derivative that is excreted in urine, precipitating secondary Vitamin B6 deficiency (glossitis, cheilosis, peripheral sensory neuropathy). Daily pyridoxine (Vitamin B6, 25–50 mg) must be co-prescribed.",
            "keyConcept": "Penicillamine inactivates Vitamin B6 (pyridoxine); co-administration is mandatory.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/kayser_fleischer_ring.webp",
                "caption": "Station 8 — Chelation Complications & Vitamin Interactions"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0009",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the biochemical mechanism by which oral Zinc acetate or Zinc sulfate acts as maintenance therapy in Wilson disease?",
            "options": [
                "Induces intestinal mucosal metallothionein, which preferentially binds dietary copper and prevents its absorption",
                "Directly oxidizes serum copper into cuprous oxide in the portal circulation",
                "Stimulates canalicular bile acid secretion by activating the FXR nuclear receptor",
                "Inhibits renal tubular reabsorption of penicillamine-copper complexes"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Zinc ions upregulate the transcription of metallothionein in enterocytes. Metallothionein has a higher binding affinity for copper than for zinc; it avidly sequesters copper inside mucosal cells, which are then sloughed into the fecal stream every few days, effectively blocking net copper absorption.",
            "keyConcept": "Oral Zinc: Induces enterocyte metallothionein, sequestering copper and preventing absorption.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/kayser_fleischer_ring.webp",
                "caption": "Station 9 — Oral Zinc Metallothionein Induction"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0010",
            "type": "mcq",
            "lecture": 1,
            "text": "Which foods must a patient diagnosed with Wilson disease strictly avoid due to their exceptionally high copper content?",
            "options": [
                "Shellfish, organ meats (liver/kidney), dark chocolate, nuts, and mushrooms",
                "Citrus fruits, tomatoes, and green leafy vegetables",
                "Cow's milk, white rice, and refined wheat flour",
                "Poultry breast, olive oil, and egg whites"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Dietary management of Wilson disease mandates avoiding foods with exceptionally high copper concentration: shellfish (oysters, crabs), organ meats (liver, kidneys), dark chocolate/cocoa, tree nuts, legumes, and dried mushrooms.",
            "keyConcept": "High-copper foods to avoid: Shellfish, liver, dark chocolate, nuts, mushrooms.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/caloric_activity_sheet.webp",
                "caption": "Station 10 — Dietary Copper Restriction Guidelines"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0011",
            "type": "mcq",
            "lecture": 1,
            "text": "Why is ceruloplasmin NOT synthesized in the intestinal mucosa or kidneys?",
            "options": [
                "The ceruloplasmin gene is predominantly expressed and transcribed in hepatocytes under the control of liver-specific promoters",
                "Intestinal enterocytes lack copper ions required for protein translation",
                "Ceruloplasmin is broken down by pancreatic enzymes immediately upon synthesis in the bowel",
                "Enterocytes synthesize transferrin which represses the ceruloplasmin locus"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Ceruloplasmin is a 132 kDa copper ferroxidase synthesized almost exclusively by hepatocytes (>95%) and to a minor degree by astrocytes in the central nervous system. The intestinal mucosa absorbs dietary copper via CTR1 and DMT1 but does not express hepatic ceruloplasmin.",
            "keyConcept": "Ceruloplasmin is synthesized in the liver (hepatocytes), not the intestinal mucosa.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/kayser_fleischer_ring.webp",
                "caption": "Station 11 — Organ-Specific Protein Synthesis"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0012",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the critical laboratory pitfall when measuring serum ceruloplasmin in a patient with active Wilson disease who has concurrent acute infection or systemic inflammation?",
            "options": [
                "Ceruloplasmin is an acute-phase reactant; hepatic upregulation during inflammation can falsely normalize borderline low baseline levels",
                "Acute inflammation causes spontaneous dissociation of copper from ceruloplasmin in the test tube",
                "C-reactive protein binds to the ceruloplasmin antibody causing false-negative readings",
                "Elevated fibrinogen precipitates ceruloplasmin during sample centrifugation"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Ceruloplasmin is a positive acute-phase reactant whose transcription is stimulated by interleukin-6 (IL-6) and other pro-inflammatory cytokines. In a Wilson disease patient experiencing acute viral hepatitis, tissue necrosis, or pregnancy, serum ceruloplasmin may rise into the low-normal range, masking the underlying deficiency.",
            "keyConcept": "Ceruloplasmin is an acute-phase reactant; systemic inflammation can falsely normalize low levels in Wilson disease.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/kayser_fleischer_ring.webp",
                "caption": "Station 12 — Acute-Phase Reactant Diagnostic Confounder"
            }
        },

        # ── LECTURE 2: Nutritional Assessment & Caloric Calculations (Stations 13–24) ─
        {
            "id": "MGL3-CH306-BIOC-0013",
            "type": "mcq",
            "lecture": 2,
            "text": "What are the standard physiochemical physiological caloric values (energy densities) assigned to carbohydrates, proteins, and fats in human clinical nutrition?",
            "options": [
                "Carbohydrate: 4 kcal/g | Protein: 4 kcal/g | Fat: 9 kcal/g | Alcohol: 7 kcal/g",
                "Carbohydrate: 9 kcal/g | Protein: 4 kcal/g | Fat: 4 kcal/g | Alcohol: 2 kcal/g",
                "Carbohydrate: 4 kcal/g | Protein: 7 kcal/g | Fat: 4 kcal/g | Alcohol: 9 kcal/g",
                "Carbohydrate: 2 kcal/g | Protein: 4 kcal/g | Fat: 7 kcal/g | Alcohol: 4 kcal/g"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: According to Atwater physiological fuel values, complete biological oxidation yields 4.0 kcal (17 kJ) per gram of digestible carbohydrate, 4.0 kcal (17 kJ) per gram of dietary protein, 9.0 kcal (38 kJ) per gram of fat/lipid, and 7.0 kcal (29 kJ) per gram of ethanol.",
            "keyConcept": "Caloric densities: CHO = 4 kcal/g, Protein = 4 kcal/g, Fat = 9 kcal/g, Alcohol = 7 kcal/g.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/caloric_activity_sheet.webp",
                "caption": "Station 13 — Physiological Energy Densities"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0014",
            "type": "mcq",
            "lecture": 2,
            "text": "Calculation Station: A 70 kg moderately active medical student consumes a daily diet containing 275 g of carbohydrate, 75 g of protein, and 65 g of fat. Calculate the total daily caloric intake of this diet:",
            "options": [
                "1,985 kcal",
                "2,450 kcal",
                "1,650 kcal",
                "2,820 kcal"
            ],
            "correctIndex": 0,
            "explanation": "Calculation Steps:\n1. Caloric contribution from Carbohydrate: 275 g × 4 kcal/g = 1,100 kcal\n2. Caloric contribution from Protein: 75 g × 4 kcal/g = 300 kcal\n3. Caloric contribution from Fat: 65 g × 9 kcal/g = 585 kcal\nTotal Daily Energy Intake = 1,100 + 300 + 585 = 1,985 kcal.",
            "keyConcept": "Total Calories = (CHO × 4) + (Protein × 4) + (Fat × 9) = 1,100 + 300 + 585 = 1,985 kcal.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/caloric_activity_sheet.webp",
                "caption": "Station 14 — Macronutrient Caloric Calculation"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0015",
            "type": "mcq",
            "lecture": 2,
            "text": "For the diet calculated in Station 14 (Total: 1,985 kcal; CHO: 1,100 kcal; Protein: 300 kcal; Fat: 585 kcal), calculate the percentage of total energy contributed by Carbohydrates and evaluate if it falls within the Acceptable Macronutrient Distribution Range (AMDR: 45–65%):",
            "options": [
                "55.4% (Falls within the healthy AMDR of 45–65%)",
                "72.5% (Exceeds the maximum recommended AMDR)",
                "35.2% (Deficient below the minimum recommended AMDR)",
                "42.0% (Suboptimal below the minimum recommended AMDR)"
            ],
            "correctIndex": 0,
            "explanation": "Calculation Steps:\nPercentage of energy from Carbohydrates = (1,100 kcal / 1,985 kcal) × 100% = 55.41%.\nThe established dietary guideline for the Acceptable Macronutrient Distribution Range (AMDR) for carbohydrates is 45% to 65% of total caloric intake; hence, 55.4% represents an ideal, balanced intake.",
            "keyConcept": "CHO percentage = (1,100 / 1,985) × 100 = 55.4%, compliant with AMDR (45–65%).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/caloric_activity_sheet.webp",
                "caption": "Station 15 — AMDR Percentage Evaluation"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0016",
            "type": "mcq",
            "lecture": 2,
            "text": "For the same diet (Total: 1,985 kcal; Fat: 585 kcal; Protein: 300 kcal), calculate the percentage contributions of dietary Fat and Protein:",
            "options": [
                "Fat: 29.5% (AMDR: 20–35%) | Protein: 15.1% (AMDR: 10–35%)",
                "Fat: 42.0% | Protein: 8.5%",
                "Fat: 18.0% | Protein: 25.0%",
                "Fat: 35.0% | Protein: 35.0%"
            ],
            "correctIndex": 0,
            "explanation": "Calculation Steps:\n1. Fat % = (585 kcal / 1,985 kcal) × 100% = 29.47% (~29.5%), which is well within the AMDR for fat (20–35%).\n2. Protein % = (300 kcal / 1,985 kcal) × 100% = 15.11% (~15.1%), which is within the AMDR for protein (10–35%).",
            "keyConcept": "Fat = 29.5% (AMDR 20–35%); Protein = 15.1% (AMDR 10–35%). Both are nutritionally balanced.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/caloric_activity_sheet.webp",
                "caption": "Station 16 — Fat & Protein AMDR Distribution"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0017",
            "type": "mcq",
            "lecture": 2,
            "text": "Calculation Station: An adult woman has a measured height of 158.5 cm (1.585 m) and a body weight of 75.0 kg. What is her Body Mass Index (BMI), and what is her clinical nutritional classification?",
            "options": [
                "BMI = 29.85 kg/m² — Overweight (Pre-obesity)",
                "BMI = 24.20 kg/m² — Normal weight",
                "BMI = 33.50 kg/m² — Class I Obesity",
                "BMI = 38.10 kg/m² — Class II Obesity"
            ],
            "correctIndex": 0,
            "explanation": "Calculation Steps:\nFormula: BMI = Weight (kg) / [Height (m)]²\n1. Height in meters = 1.585 m\n2. [Height (m)]² = 1.585 × 1.585 = 2.5122 m²\n3. BMI = 75.0 / 2.5122 = 29.854 kg/m² (~29.9 kg/m²).\nAccording to WHO criteria, a BMI of 25.0–29.9 kg/m² is classified as Overweight (pre-obesity; ≥30 is obesity).",
            "keyConcept": "BMI = 75 / (1.585)² = 29.85 kg/m² = Overweight (25.0–29.9 kg/m²).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/bmi_whr_body_composition.webp",
                "caption": "Station 17 — Body Mass Index (BMI) Calculation"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0018",
            "type": "mcq",
            "lecture": 2,
            "text": "According to the World Health Organization (WHO) international classification, which BMI range defines Class I (Moderate) Obesity?",
            "options": [
                "30.0 to 34.9 kg/m²",
                "25.0 to 29.9 kg/m²",
                "35.0 to 39.9 kg/m²",
                "≥ 40.0 kg/m²"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: WHO BMI Classification:\n- Underweight: < 18.5 kg/m²\n- Normal weight: 18.5 – 24.9 kg/m²\n- Overweight: 25.0 – 29.9 kg/m²\n- Class I Obesity: 30.0 – 34.9 kg/m²\n- Class II Obesity: 35.0 – 39.9 kg/m²\n- Class III (Morbid/Severe) Obesity: ≥ 40.0 kg/m².",
            "keyConcept": "Class I Obesity: BMI 30.0 – 34.9 kg/m².",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/bmi_whr_body_composition.webp",
                "caption": "Station 18 — WHO Adult Obesity Stratification"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0019",
            "type": "mcq",
            "lecture": 2,
            "text": "A 52-year-old male has a waist circumference of 102 cm and a hip circumference of 96 cm (Waist-to-Hip Ratio = 1.06). What is the clinical significance of this anthropometric ratio?",
            "options": [
                "Android (central/visceral) obesity associated with high risk of metabolic syndrome and cardiovascular disease (WHR > 0.90 in men)",
                "Gynoid (peripheral) obesity associated with minimal metabolic complications",
                "Normal physiological fat distribution within acceptable reference limits",
                "Protein-energy malnutrition with loss of lean muscle mass"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The Waist-to-Hip Ratio (WHR) assesses abdominal visceral fat. Cut-offs defining substantial cardiometabolic risk are WHR > 0.90 in men and > 0.85 in women. A WHR of 1.06 indicates android (apple-shaped/visceral) adiposity, which strongly correlates with insulin resistance, non-alcoholic fatty liver disease (NAFLD), and atherosclerosis.",
            "keyConcept": "WHR > 0.90 in men (>0.85 in women) indicates central/visceral android obesity with high cardiometabolic risk.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/bmi_whr_body_composition.webp",
                "caption": "Station 19 — Waist-to-Hip Ratio (WHR) Assessment"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0020",
            "type": "mcq",
            "lecture": 2,
            "text": "What are the three core physiological components that comprise Total Daily Energy Expenditure (TDEE) in human bioenergetics?",
            "options": [
                "Basal Metabolic Rate (BMR, 60–70%) + Physical Activity (20–30%) + Thermic Effect of Food (TEF, ~10%)",
                "Resting metabolic rate (90%) + Sleep catabolism (10%)",
                "Thermic effect of food (50%) + Renal glomerular filtration (50%)",
                "Cardiac output (40%) + Hepatic gluconeogenesis (60%)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Total Daily Energy Expenditure (TDEE) consists of: 1) Basal Metabolic Rate (BMR), the energy expended at complete physical and emotional rest (~60–70%); 2) Physical Activity / Exercise activity thermogenesis (~20–30%); and 3) Thermic Effect of Food (TEF / specific dynamic action), the metabolic cost of digesting, absorbing, and storing nutrients (~10%).",
            "keyConcept": "TDEE components: BMR (60–70%) + Physical Activity (20–30%) + Thermic Effect of Food (~10%).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/caloric_activity_sheet.webp",
                "caption": "Station 20 — Total Daily Energy Expenditure Breakdown"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0021",
            "type": "mcq",
            "lecture": 2,
            "text": "Why does dietary protein exhibit the highest Thermic Effect of Food (TEF / Specific Dynamic Action) compared to carbohydrates and fats?",
            "options": [
                "Protein synthesis, urea cycle disposal of ammonia, and gluconeogenesis demand substantial ATP consumption (20–30% of energy)",
                "Proteins are actively degraded by gastric acid without enzymatic catalysts",
                "Amino acids are actively excreted in large quantities by renal tubular secretion",
                "Peptide bonds release endothermic heat during hydrolysis in the intestinal lumen"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The thermic effect of protein is approximately 20–30% of its caloric value, compared to 5–10% for carbohydrates and 0–3% for fats. This high metabolic cost stems from energy-intensive peptide bond hydrolysis, active sodium-dependent amino acid transport, hepatic deamination, and ATP-dependent urea biosynthesis.",
            "keyConcept": "Dietary protein has the highest thermic effect (20–30%) due to energetic costs of urea synthesis and processing.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/caloric_activity_sheet.webp",
                "caption": "Station 21 — Specific Dynamic Action of Macronutrients"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0022",
            "type": "mcq",
            "lecture": 2,
            "text": "What is the primary adipokine secreted in proportion to body fat mass that acts on the arcuate nucleus of the hypothalamus to suppress appetite (anorexigenic effect)?",
            "options": [
                "Leptin",
                "Ghrelin",
                "Neuropeptide Y (NPY)",
                "Agouti-related peptide (AgRP)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Leptin is a 16 kDa peptide hormone produced by white adipose tissue. Circulating leptin levels reflect total triglyceride fat stores; leptin crosses the blood-brain barrier to bind Ob-R receptors in the hypothalamic arcuate nucleus, stimulating anorexigenic POMC/CART neurons and inhibiting orexigenic NPY/AgRP neurons to decrease food intake.",
            "keyConcept": "Leptin: Anorexigenic hormone produced by adipocytes that suppresses appetite via the hypothalamus.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/bmi_whr_body_composition.webp",
                "caption": "Station 22 — Neuroendocrine Regulation of Appetite"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0023",
            "type": "mcq",
            "lecture": 2,
            "text": "Which gastrointestinal peptide hormone secreted primarily by P/D1 cells in the gastric fundus during fasting acts as the primary 'hunger hormone' stimulating appetite?",
            "options": [
                "Ghrelin",
                "Peptide YY (PYY)",
                "Cholecystokinin (CCK)",
                "Glucagon-like peptide-1 (GLP-1)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Ghrelin is a 28-amino acid acylated peptide secreted by oxyntic cells of the gastric fundus. Ghrelin levels rise precipitously before meals and fall upon gastric distension; it stimulates orexigenic NPY/AgRP neurons in the arcuate nucleus, triggering hunger and gastric motility.",
            "keyConcept": "Ghrelin: Gastric hunger hormone that stimulates appetite during fasting.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/caloric_activity_sheet.webp",
                "caption": "Station 23 — Orexigenic Gut Hormone Physiology"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0024",
            "type": "mcq",
            "lecture": 2,
            "text": "In calculating dietary requirements for an obese patient, what daily caloric deficit relative to total energy expenditure is clinically recommended to achieve a safe, sustainable weight loss of 0.5 to 1.0 kg per week?",
            "options": [
                "Deficit of 500 to 1,000 kcal/day (since 1 kg adipose tissue contains ~7,700 kcal)",
                "Deficit of 100 to 200 kcal/day",
                "Deficit of 2,500 kcal/day with total water fast",
                "Deficit of 50 kcal/day supplemented with high-dose carnitine"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: One pound of body fat corresponds to approximately 3,500 kcal (~7,700 kcal per kg). A sustained daily deficit of 500 kcal yields a weekly loss of 3,500 kcal (~0.5 kg/week), while a 1,000 kcal/day deficit yields ~1.0 kg/week. Larger deficits risk lean muscle loss and metabolic rate suppression.",
            "keyConcept": "Safe weight loss: 500–1,000 kcal/day deficit produces 0.5–1.0 kg loss per week.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/caloric_activity_sheet.webp",
                "caption": "Station 24 — Clinical Caloric Deficit Guidelines"
            }
        },

        # ── LECTURE 3: LFTs & Spectrophotometric Calculations (Stations 25–40) ───────
        {
            "id": "MGL3-CH306-BIOC-0025",
            "type": "mcq",
            "lecture": 3,
            "text": "What is the normal reference range for serum albumin in healthy adults, and what is its physiological half-life in the systemic circulation?",
            "options": [
                "3.5 to 5.0 g/dL (35–50 g/L) | Half-life of approximately 20 days",
                "1.0 to 2.0 g/dL | Half-life of 24 hours",
                "6.0 to 8.5 g/dL | Half-life of 120 days",
                "0.2 to 0.8 g/dL | Half-life of 4 hours"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Serum albumin is the most abundant plasma protein (normal: 3.5–5.0 g/dL), accounting for ~70–80% of plasma colloid oncotic pressure. Its circulating half-life is long (~20 days). Because of this longevity, plasma albumin levels remain normal in acute hepatic injury (e.g., acute viral hepatitis) and only drop significantly in chronic liver disease (cirrhosis).",
            "keyConcept": "Serum albumin: 3.5–5.0 g/dL; half-life ~20 days (falls in chronic, not acute, liver disease).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/spectrophotometer_tubes_b_s_t.webp",
                "caption": "Station 25 — Serum Albumin Reference Standards"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0026",
            "type": "mcq",
            "lecture": 3,
            "text": "Why does a patient presenting with fulminant acute viral hepatitis have a normal serum albumin level despite massive hepatocellular necrosis?",
            "options": [
                "The circulating half-life of albumin is 20 days, so pre-existing circulating albumin persists long after new synthesis ceases",
                "Kidneys actively synthesize compensatory albumin during acute hepatitis",
                "Peripheral skeletal muscle releases stored albumin into the bloodstream",
                "Hepatocellular necrosis releases pre-formed intracellular albumin pools"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Because circulating albumin has a 20-day half-life, cessation of hepatic albumin synthesis takes 2–3 weeks to manifest as significant hypoalbuminemia. Consequently, serum albumin is a marker of chronic liver disease (cirrhosis) rather than acute injury. In acute liver failure, Prothrombin Time (PT/INR, half-life of Factor VII = 4–6 hours) is the accurate synthetic marker.",
            "keyConcept": "Normal albumin in acute liver injury is due to its long 20-day half-life; PT/INR is the acute marker.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/spectrophotometer_tubes_b_s_t.webp",
                "caption": "Station 26 — Kinetic Biomarkers in Acute vs Chronic Liver Injury"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0027",
            "type": "mcq",
            "lecture": 3,
            "text": "Examine this laboratory protocol for colorimetric measurement of serum albumin using Bromocresol Green (BCG) dye. Three cuvettes are prepared: Blank (B), Standard (S, 4.0 g/dL), and Test (T). What mathematical formula derived from the Beer-Lambert Law yields the albumin concentration?",
            "options": [
                "Concentration of Albumin (g/dL) = [(A_Test - A_Blank) / (A_Standard - A_Blank)] × Concentration of Standard (4.0 g/dL)",
                "Concentration of Albumin (g/dL) = [(A_Standard - A_Blank) / (A_Test - A_Blank)] × Concentration of Standard",
                "Concentration of Albumin (g/dL) = (A_Test × A_Standard) / 4.0",
                "Concentration of Albumin (g/dL) = (A_Test - A_Standard) × 100"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: According to the Beer-Lambert Law (A = ε·b·c), absorbance is directly proportional to solute concentration when path length and molar absorptivity are constant. Subtracting the reagent blank absorbance (A_Blank), the unknown sample concentration is:\nC_Test = [(A_Test - A_Blank) / (A_Standard - A_Blank)] × C_Standard.",
            "keyConcept": "Beer-Lambert Law formula: C_Test = (A_Test / A_Standard) × C_Standard.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/spectrophotometer_tubes_b_s_t.webp",
                "caption": "Station 27 — Spectrophotometric Calibration Formula"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0028",
            "type": "mcq",
            "lecture": 3,
            "text": "Calculation Station (Part 1 of 2): In a clinical laboratory, serum albumin is measured at 630 nm against a 4.0 g/dL standard. The spectrophotometer readings are:\n• A_Blank = 0.00\n• A_Standard = 0.50\n• A_Test (Patient) = 0.25\nCalculate the patient's serum albumin concentration:",
            "options": [
                "2.0 g/dL (20 g/L)",
                "3.5 g/dL (35 g/L)",
                "1.2 g/dL (12 g/L)",
                "4.8 g/dL (48 g/L)"
            ],
            "correctIndex": 0,
            "explanation": "Calculation Steps:\n1. A_Test = 0.25\n2. A_Standard = 0.50\n3. C_Standard = 4.0 g/dL\nFormula: C_Test = (A_Test / A_Standard) × C_Standard\nC_Test = (0.25 / 0.50) × 4.0 g/dL = 0.5 × 4.0 = 2.0 g/dL.",
            "keyConcept": "Albumin = (0.25 / 0.50) × 4.0 = 2.0 g/dL (Severe Hypoalbuminemia).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/spectrophotometer_tubes_b_s_t.webp",
                "caption": "Station 28 — Albumin Spectrophotometric Calculation (Part 1)"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0029",
            "type": "mcq",
            "lecture": 3,
            "text": "Clinical Interpretation (Part 2 of 2): Based on the calculated serum albumin of 2.0 g/dL from Station 28, what is the hemodynamic and clinical consequence in this patient with decompensated liver cirrhosis?",
            "options": [
                "Marked reduction in plasma colloid oncotic pressure, favoring fluid transudation into peritoneal cavity (ascites) and lower extremities",
                "Severe intravascular hypervolemia and systemic arterial hypertension",
                "Increased renal excretion of calcium leading to tetany",
                "Enhanced platelet aggregation and extensive arterial thrombosis"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: According to Starling's equation of microvascular fluid flux, plasma oncotic pressure (normally ~25 mmHg, generated mainly by albumin) retains fluid within capillaries. When serum albumin falls from normal (4.0 g/dL) to 2.0 g/dL, oncotic pressure plummets to <12 mmHg; capillary hydrostatic pressure (magnified by portal hypertension) overcomes oncotic retention, resulting in massive ascites and pitting peripheral edema.",
            "keyConcept": "Serum albumin 2.0 g/dL causes reduced plasma oncotic pressure -> ascites and dependent edema.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/liver_cirrhosis_ascites_edema.webp",
                "caption": "Station 29 — Starling Forces & Hypoalbuminemia (Part 2)"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0030",
            "type": "mcq",
            "lecture": 3,
            "text": "Examine this Van Den Bergh reaction tube. Diazotized sulfanilic acid is added to patient serum. An immediate violet-pink color develops within 60 seconds ('Direct reaction'). What biochemical form of bilirubin is elevated?",
            "options": [
                "Conjugated (Direct) Bilirubin (water-soluble diglucuronide)",
                "Unconjugated (Indirect) Bilirubin bound to albumin",
                "Delta-bilirubin covalently linked to globulin",
                "Biliverdin reductase precursor"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Conjugated bilirubin is water-soluble (polar diglucuronide) and reacts immediately with diazotized sulfanilic acid (Ehrlich's diazo reagent) in aqueous solution to yield purple azobilirubin within 1 minute (Direct Van Den Bergh reaction). Unconjugated bilirubin is non-polar and requires an accelerator/solvent (alcohol/caffeine) to react.",
            "keyConcept": "Direct Van Den Bergh positive (instant pink color) = Conjugated (direct) water-soluble bilirubin.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/vandenbergh_reaction_tubes.webp",
                "caption": "Station 30 — Van Den Bergh Direct Diazo Reaction"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0031",
            "type": "mcq",
            "lecture": 3,
            "text": "In performing the Van Den Bergh test, no color develops initially. However, upon addition of absolute methanol (accelerator), an intense purple-red color appears. What biochemical condition does this 'Indirect Reaction' establish?",
            "options": [
                "Unconjugated hyperbilirubinemia (e.g., hemolytic jaundice or Gilbert syndrome)",
                "Complete extrahepatic biliary duct obstruction (gallstone)",
                "Primary biliary cholangitis with cholestasis",
                "Acute pancreatic pseudocyst compressing the common bile duct"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Unconjugated bilirubin is hydrophobic and tightly bound to albumin; its diazo-reactive sites are shielded. Adding alcohol/methanol breaks the albumin-bilirubin bond and dissolves unconjugated bilirubin, enabling coupling with diazo reagent. A reaction occurring only after alcohol addition is termed 'Indirect' and diagnostic of unconjugated hyperbilirubinemia.",
            "keyConcept": "Indirect Van Den Bergh positive (requires alcohol) = Unconjugated hyperbilirubinemia (hemolysis / Gilbert).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/vandenbergh_reaction_tubes.webp",
                "caption": "Station 31 — Van Den Bergh Indirect Reaction"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0032",
            "type": "mcq",
            "lecture": 3,
            "text": "Calculation Station (Part 1 of 3): A jaundiced patient has total bilirubin measured at 540 nm against a 5.0 mg/dL standard:\n• A_Standard = 0.40\n• A_Test = 0.80\nCalculate the Total Serum Bilirubin concentration:",
            "options": [
                "10.0 mg/dL",
                "6.25 mg/dL",
                "2.5 mg/dL",
                "15.0 mg/dL"
            ],
            "correctIndex": 0,
            "explanation": "Calculation Steps:\nFormula: C_Total = (A_Test / A_Standard) × C_Standard\nC_Total = (0.80 / 0.40) × 5.0 mg/dL = 2.0 × 5.0 = 10.0 mg/dL.",
            "keyConcept": "Total Bilirubin = (0.80 / 0.40) × 5.0 = 10.0 mg/dL (Normal: 0.2–1.2 mg/dL).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/spectrophotometer_tubes_b_s_t.webp",
                "caption": "Station 32 — Total Bilirubin Spectrophotometric Assay (Part 1)"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0033",
            "type": "mcq",
            "lecture": 3,
            "text": "Calculation Station (Part 2 of 3): In the same patient from Station 32, the Direct (Conjugated) Bilirubin assay reads:\n• A_Standard = 0.40 (C_Standard = 5.0 mg/dL)\n• A_Test = 0.68\nCalculate the Direct Bilirubin and the Indirect (Unconjugated) Bilirubin concentrations:",
            "options": [
                "Direct Bilirubin = 8.5 mg/dL | Indirect Bilirubin = 1.5 mg/dL",
                "Direct Bilirubin = 1.5 mg/dL | Indirect Bilirubin = 8.5 mg/dL",
                "Direct Bilirubin = 4.2 mg/dL | Indirect Bilirubin = 5.8 mg/dL",
                "Direct Bilirubin = 6.0 mg/dL | Indirect Bilirubin = 4.0 mg/dL"
            ],
            "correctIndex": 0,
            "explanation": "Calculation Steps:\n1. Direct Bilirubin = (A_Test / A_Standard) × C_Standard = (0.68 / 0.40) × 5.0 = 1.7 × 5.0 = 8.5 mg/dL.\n2. Indirect Bilirubin = Total Bilirubin - Direct Bilirubin = 10.0 mg/dL - 8.5 mg/dL = 1.5 mg/dL.",
            "keyConcept": "Direct Bilirubin = 8.5 mg/dL; Indirect Bilirubin = 10.0 - 8.5 = 1.5 mg/dL.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/spectrophotometer_tubes_b_s_t.webp",
                "caption": "Station 33 — Direct & Indirect Bilirubin Fractions (Part 2)"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0034",
            "type": "mcq",
            "lecture": 3,
            "text": "Clinical Interpretation (Part 3 of 3): Based on the findings (Total Bilirubin = 10.0 mg/dL, Direct Bilirubin = 8.5 mg/dL, Direct/Total ratio = 85%), accompanied by Alkaline Phosphatase (ALP) = 650 U/L (markedly elevated) and ALT = 45 U/L (normal), what is the definitive diagnosis?",
            "options": [
                "Obstructive (Post-hepatic / Cholestatic) Jaundice (e.g., choledocholithiasis or pancreatic head carcinoma)",
                "Pre-hepatic Hemolytic Jaundice (e.g., sickle cell anemia)",
                "Acute Viral Hepatitis A infection",
                "Gilbert syndrome with fasting unconjugated jaundice"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: When Direct Bilirubin constitutes >50% (here 85%) of total bilirubin with markedly elevated canalicular enzymes (ALP and GGT >3–5× ULN) and near-normal aminotransferases (ALT/AST <2× ULN), it definitively indicates extrahepatic biliary obstruction (cholestasis). Stools will be pale/clay-colored (acholic) and urine dark/foamy with bilirubin.",
            "keyConcept": "Direct bilirubin >50% + high ALP/GGT + normal ALT = Obstructive (cholestatic) jaundice.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/jaundice_metabolism_pathway.webp",
                "caption": "Station 34 — Cholestatic Jaundice Differential Diagnosis (Part 3)"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0035",
            "type": "mcq",
            "lecture": 3,
            "text": "A 23-year-old medical student with hereditary spherocytosis presents with mild jaundice. Laboratory investigation reveals Total Bilirubin = 4.8 mg/dL, Direct Bilirubin = 0.4 mg/dL (Indirect = 4.4 mg/dL). Complete urinalysis demonstrates absent bilirubin and markedly elevated urobilinogen. What is the diagnosis?",
            "options": [
                "Pre-hepatic (Hemolytic) Jaundice",
                "Hepatocellular Jaundice due to viral hepatitis",
                "Obstructive jaundice due to common bile duct stricture",
                "Crigler-Najjar syndrome Type I"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: In hemolytic jaundice, excessive erythrocyte breakdown overwhelms hepatic conjugation capacity. Serum indirect (unconjugated) bilirubin is elevated (>85% of total). Because unconjugated bilirubin is water-insoluble and bound to albumin, it cannot be filtered by glomeruli (acholuric jaundice; urine bilirubin is negative). Increased conjugated bilirubin entering bile leads to massive colonic urobilinogen formation and elevated urinary urobilinogen.",
            "keyConcept": "Hemolytic jaundice: High indirect bilirubin + negative urine bilirubin (acholuric) + high urine urobilinogen.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/jaundice_metabolism_pathway.webp",
                "caption": "Station 35 — Hemolytic Jaundice Laboratory Profile"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0036",
            "type": "mcq",
            "lecture": 3,
            "text": "A 28-year-old man presents with malaise, dark urine, and jaundice. Liver function tests show:\n• Total Bilirubin: 7.2 mg/dL (Direct: 4.2 mg/dL, Indirect: 3.0 mg/dL)\n• Serum ALT: 1,450 U/L (ULN: 40)\n• Serum AST: 1,120 U/L (ULN: 35)\n• ALP: 160 U/L (mild elevation, ULN: 120)\nWhat is the interpretation of this biochemical profile?",
            "options": [
                "Acute hepatocellular injury (Acute Viral Hepatitis) with biphasic jaundice and ALT > AST",
                "Alcoholic hepatitis with AST:ALT ratio > 2:1",
                "Pure extrahepatic bile duct stone with secondary ascending cholangitis",
                "Chronic end-stage cirrhosis with synthetic exhaustion"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Extreme aminotransferase elevation (>1,000 U/L or >25× ULN) with ALT exceeding AST (AST/ALT ratio < 1) combined with mixed/biphasic hyperbilirubinemia is the classic hallmark of acute hepatocellular necrosis, most commonly acute viral hepatitis (HAV, HBV) or toxic/ischemic injury.",
            "keyConcept": "Acute viral hepatitis: ALT & AST > 1,000 U/L with ALT > AST and biphasic hyperbilirubinemia.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/liver_enzymes_alt_alp.webp",
                "caption": "Station 36 — Acute Hepatocellular Necrosis Profile"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0037",
            "type": "mcq",
            "lecture": 3,
            "text": "Why is Serum Alanine Aminotransferase (ALT) considered a far more specific enzymatic marker of liver parenchymal damage than Aspartate Aminotransferase (AST)?",
            "options": [
                "ALT is localized predominantly in hepatocyte cytoplasm; AST is found in liver, cardiac muscle, skeletal muscle, kidneys, and brain",
                "ALT is exclusively cleared by renal filtration while AST is excreted in bile",
                "AST has a half-life of 30 days while ALT has a half-life of 2 hours",
                "ALT is an allosteric enzyme activated exclusively by bile salts"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: ALT is primarily cytosolic and concentrated almost exclusively in hepatocytes; hence, its elevation is liver-specific. In contrast, AST has both cytosolic and mitochondrial isoenzymes and is abundant in myocardium, skeletal muscle, kidneys, and erythrocytes (elevating in myocardial infarction, rhabdomyolysis, and hemolysis).",
            "keyConcept": "ALT is liver-specific (cytosolic hepatocyte enzyme); AST is also present in heart, muscle, and brain.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/liver_enzymes_alt_alp.webp",
                "caption": "Station 37 — Aminotransferase Tissue Specificity"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0038",
            "type": "mcq",
            "lecture": 3,
            "text": "A chronic alcoholic presents with jaundice and hepatomegaly. LFTs show AST = 280 U/L and ALT = 110 U/L (AST:ALT ratio = 2.5:1). What is the biochemical explanation for this inverted ratio characteristic of alcoholic liver disease?",
            "options": [
                "Alcohol causes mitochondrial toxicity releasing mitochondrial AST, and alcoholics suffer from dietary pyridoxal 5'-phosphate (Vitamin B6) deficiency which suppresses ALT synthesis more than AST",
                "Alcohol selectively induces transcription of the cytosolic AST gene",
                "ALT is rapidly destroyed by circulating acetaldehyde in hepatocytes",
                "Alcohol stimulates renal tubular reabsorption of AST"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: In alcoholic liver disease, the AST/ALT ratio characteristically exceeds 2:1. Two biochemical mechanisms drive this: 1) Alcohol is a direct mitochondrial toxin, releasing mitochondrial AST into the circulation; and 2) Alcoholics have severe pyridoxine (Vitamin B6 / PLP) deficiency; ALT synthesis is more sensitive to PLP depletion than AST, suppressing hepatic ALT levels.",
            "keyConcept": "Alcoholic liver disease: AST:ALT ratio > 2:1 due to mitochondrial damage and Vitamin B6 (PLP) deficiency.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/liver_enzymes_alt_alp.webp",
                "caption": "Station 38 — De Ritis Ratio (AST:ALT in Alcoholic Hepatitis)"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0039",
            "type": "mcq",
            "lecture": 3,
            "text": "An isolated elevation of Serum Alkaline Phosphatase (ALP) is noted in a 65-year-old man. Which additional serum biliary enzyme should be measured to definitively distinguish biliary tract disease from bone disorders (such as Paget disease or bone metastases)?",
            "options": [
                "Gamma-Glutamyl Transferase (GGT) or 5'-Nucleotidase",
                "Creatine Kinase (CK-MB)",
                "Lactate Dehydrogenase (LDH)",
                "Serum Acid Phosphatase"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Alkaline phosphatase is produced by biliary canalicular membranes, osteoblasts, placenta, and intestine. Gamma-Glutamyl Transferase (GGT) and 5'-Nucleotidase are elevated in hepatobiliary disease but NOT in bone diseases. A high ALP with normal GGT confirms bone etiology; high ALP with elevated GGT confirms hepatobiliary/cholestatic origin.",
            "keyConcept": "Differentiate liver vs bone ALP: Elevated GGT/5'-nucleotidase confirms liver origin; normal GGT points to bone.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/liver_enzymes_alt_alp.webp",
                "caption": "Station 39 — GGT & 5'-Nucleotidase Specificity Assay"
            }
        },
        {
            "id": "MGL3-CH306-BIOC-0040",
            "type": "mcq",
            "lecture": 3,
            "text": "Complete Urinalysis Station: In a patient with complete obstructive jaundice due to an impacted gallstone in the common bile duct, what are the expected urinary findings on dipstick examination?",
            "options": [
                "Urinary Bilirubin is strongly POSITIVE (dark green/brown foam); Urinary Urobilinogen is completely ABSENT",
                "Urinary Bilirubin is NEGATIVE; Urinary Urobilinogen is markedly ELEVATED",
                "Both Urinary Bilirubin and Urobilinogen are strongly positive",
                "Both Urinary Bilirubin and Urobilinogen are completely absent"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: In complete biliary obstruction, conjugated bilirubin cannot enter the duodenum; hence, intestinal bacteria cannot convert it into urobilinogen, resulting in absent urobilinogen in urine and pale/clay-colored stool. Meanwhile, conjugated bilirubin regurges into the bloodstream, filters through the glomeruli, and turns urine dark brown with yellow-green foam (bilirubinuria).",
            "keyConcept": "Complete biliary obstruction: Urine bilirubin positive + Urine urobilinogen completely absent.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/biochemistry/jaundice_metabolism_pathway.webp",
                "caption": "Station 40 — Biliary Obstruction Urinalysis Profile"
            }
        }
    ]
    return questions + NET_NEW_BIOCHEMISTRY

# NET_NEW_BIOCHEMISTRY for stations 41 to 65

NET_NEW_BIOCHEMISTRY = [
    {
        "id": "MGL3-CH306-BIOC-0041",
        "type": "mcq",
        "lecture": 4,
        "text": "A spectrophotometric assay for serum total bilirubin is performed using the diazo method. The spectrophotometer absorbance at 540 nm for the patient sample is 0.40, while a 10 mg/dL standard yields an absorbance of 0.50 (reagent blank set to 0.00). According to the Beer-Lambert law, calculate the patient's serum total bilirubin concentration:",
        "options": [
            "8.0 mg/dL (Severe hyperbilirubinemia)",
            "12.5 mg/dL",
            "5.0 mg/dL",
            "4.0 mg/dL"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: According to the Beer-Lambert Law, absorbance is directly proportional to solute concentration: C_sample = (A_sample / A_standard) x C_standard. Here, C_sample = (0.40 / 0.50) x 10 mg/dL = 0.80 x 10 = 8.0 mg/dL, indicating severe pathological hyperbilirubinemia.",
        "keyConcept": "Beer-Lambert Law: C_sample = (A_sample / A_standard) x C_standard = (0.40 / 0.50) x 10 = 8.0 mg/dL.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0041.webp",
            "caption": "Station 41 — Spectrophotometric Bilirubin Quantitative Calculation"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0042",
        "type": "mcq",
        "lecture": 4,
        "text": "Serum albumin concentration is determined using the bromocresol green (BCG) dye-binding method at 628 nm. The patient's test absorbance is 0.28, and a 4.0 g/dL bovine serum albumin standard gives an absorbance of 0.40. Calculate the patient's serum albumin level and clinical interpretation:",
        "options": [
            "2.8 g/dL (Significant hypoalbuminemia / impaired hepatic synthesis)",
            "3.6 g/dL (Normal reference range)",
            "1.4 g/dL (Critical severe hypoalbuminemia)",
            "5.7 g/dL (Hyperalbuminemia due to hemoconcentration)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Using C_sample = (A_sample / A_standard) x C_standard: C_albumin = (0.28 / 0.40) x 4.0 g/dL = 0.70 x 4.0 = 2.8 g/dL. Normal serum albumin is 3.5–5.0 g/dL; a value of 2.8 g/dL represents significant hypoalbuminemia reflecting impaired hepatic synthetic function in advanced cirrhosis.",
        "keyConcept": "Albumin calculation: C = (0.28 / 0.40) x 4.0 = 2.8 g/dL (significant hypoalbuminemia).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0042.webp",
            "caption": "Station 42 — Bromocresol Green Albumin Spectrophotometric Assay"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0043",
        "type": "mcq",
        "lecture": 4,
        "text": "In a clinical chemistry laboratory, total serum protein is measured with Biuret reagent (C_total = 4.2 g/dL), and serum albumin is measured at 2.8 g/dL. What is the calculated serum globulin concentration and the Albumin/Globulin (A/G) ratio?",
        "options": [
            "Globulin = 1.4 g/dL; A/G ratio = 2.0",
            "Globulin = 7.0 g/dL; A/G ratio = 0.4",
            "Globulin = 2.8 g/dL; A/G ratio = 1.0",
            "Globulin = 0.7 g/dL; A/G ratio = 4.0"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Serum Globulin is calculated as: Total Protein - Albumin = 4.2 g/dL - 2.8 g/dL = 1.4 g/dL. The Albumin/Globulin (A/G) ratio is: Albumin / Globulin = 2.8 / 1.4 = 2.0 (normal reference range: 1.2–2.2).",
        "keyConcept": "Globulin = Total Protein - Albumin = 4.2 - 2.8 = 1.4 g/dL; A/G ratio = 2.8 / 1.4 = 2.0.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0043.webp",
            "caption": "Station 43 — Total Protein & A/G Ratio Diagnostic Chemistry"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0044",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this laboratory demonstration of the Van den Bergh reaction. A patient's serum reacts immediately with Ehrlich's diazo reagent to produce a reddish-purple color within 30 seconds without the addition of alcohol. Identify this reaction and the predominant bilirubin form:",
        "options": [
            "Direct positive reaction; indicates Conjugated (water-soluble) bilirubin",
            "Indirect positive reaction; indicates Unconjugated (lipid-soluble) bilirubin",
            "Biphasic reaction; indicates Equal mix of bilirubin fractions",
            "Negative reaction; indicates Complete absence of serum bile pigments"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The Van den Bergh reaction differentiates bilirubin fractions: Direct positive reaction occurs within 30 seconds without accelerator (alcohol/methanol), identifying water-soluble conjugated (diglucuronide) bilirubin; Indirect positive reaction requires alcohol to solubilize albumin-bound unconjugated bilirubin before diazo coupling.",
        "keyConcept": "Van den Bergh: Direct reaction (no alcohol) = conjugated bilirubin; Indirect reaction (+ alcohol) = unconjugated bilirubin.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0044.webp",
            "caption": "Station 44 — Van den Bergh Reaction Differential Tubes"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0045",
        "type": "mcq",
        "lecture": 2,
        "text": "A 22-year-old with sickle cell disease presents with scleral icterus. Lab results reveal: Total bilirubin = 5.2 mg/dL, Direct bilirubin = 0.4 mg/dL, AST = 22 U/L, ALT = 18 U/L, ALP = 65 U/L, Urine bilirubin = Negative, Urine urobilinogen = Markedly increased. Identify this type of jaundice:",
        "options": [
            "Pre-hepatic (Hemolytic) jaundice",
            "Intra-hepatic (Hepatocellular) jaundice",
            "Post-hepatic (Obstructive) jaundice",
            "Gilbert syndrome"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Pre-hepatic (hemolytic) jaundice is defined by predominant unconjugated (indirect) hyperbilirubinemia with normal transaminases (ALT/AST) and ALP. Because unconjugated bilirubin is tightly bound to albumin, it cannot be filtered by glomeruli (acholuric jaundice, urine bilirubin negative); excess stercobilinogen in the gut leads to marked increase in urinary and fecal urobilinogen.",
        "keyConcept": "Pre-hepatic jaundice: unconjugated hyperbilirubinemia + negative urine bilirubin + elevated urinary urobilinogen.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0045.webp",
            "caption": "Station 45 — Hemolytic Jaundice Metabolic Diagnostic Profile"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0046",
        "type": "mcq",
        "lecture": 2,
        "text": "A 35-year-old presents with acute jaundice and malaise. Labs show: Total bilirubin = 9.0 mg/dL, Direct bilirubin = 5.5 mg/dL, AST = 1,450 U/L (ULN 40), ALT = 1,820 U/L (ULN 40), ALP = 180 U/L (ULN 120), Urine bilirubin = Positive. Identify this clinical biochemical pattern:",
        "options": [
            "Acute Hepatocellular (Hepatic) jaundice (e.g., Acute viral hepatitis)",
            "Extrahepatic biliary obstruction by choledocholithiasis",
            "Hemolytic anemia with sickle crisis",
            "Crigler-Najjar syndrome Type II"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Hepatocellular jaundice is characterized by marked acute elevation of serum transaminases (ALT and AST > 10–40 times the upper limit of normal) reflecting hepatocyte necrosis, accompanied by combined conjugated and unconjugated hyperbilirubinemia and positive urinary bilirubin (conjugated bilirubin filtered by kidneys).",
        "keyConcept": "Hepatocellular jaundice: massive transaminase surge (ALT/AST > 1,000 U/L) + mixed hyperbilirubinemia + positive urine bilirubin.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0046.webp",
            "caption": "Station 46 — Hepatocellular Jaundice Massive Transaminase Surge"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0047",
        "type": "mcq",
        "lecture": 2,
        "text": "A 62-year-old presents with painless jaundice, dark tea-colored urine, and pale clay-colored stools. Labs show: Total bilirubin = 14.5 mg/dL, Direct bilirubin = 12.0 mg/dL, ALP = 680 U/L (ULN 120), GGT = 450 U/L (ULN 50), AST = 55 U/L, ALT = 60 U/L, Urine urobilinogen = Absent (0). Identify this type of jaundice:",
        "options": [
            "Post-hepatic (Obstructive / Cholestatic) jaundice",
            "Hemolytic jaundice",
            "Acute acetaminophen toxicity",
            "Gilbert syndrome"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Obstructive (cholestatic) jaundice is defined by predominant direct (conjugated) hyperbilirubinemia (> 80%), striking elevations in canalicular enzymes (ALP and GGT > 3–5x ULN), dark urine (bilirubinuria), pale acholic stools (lack of stercobilin), and complete absence of urinary urobilinogen (bile cannot reach gut lumen).",
        "keyConcept": "Obstructive jaundice: direct bilirubin > 80% + high ALP/GGT + pale stools + complete absence of urinary urobilinogen.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0047.webp",
            "caption": "Station 47 — Obstructive Cholestatic Enzyme Pattern"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0048",
        "type": "mcq",
        "lecture": 2,
        "text": "A chronic alcohol-dependent patient presents with jaundice. Liver enzymes reveal: AST = 240 U/L, ALT = 95 U/L. What is the calculated De Ritis ratio (AST/ALT) and its diagnostic significance?",
        "options": [
            "De Ritis ratio = 2.53; strongly diagnostic of Alcoholic Liver Disease",
            "De Ritis ratio = 0.40; indicates acute viral hepatitis A",
            "De Ritis ratio = 1.00; indicates non-alcoholic fatty liver disease (NAFLD)",
            "De Ritis ratio = 5.00; indicates ischemic shock liver"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The De Ritis ratio is AST / ALT. Here: 240 / 95 = 2.53. An AST/ALT ratio > 2.0 with AST < 300 U/L is strongly suggestive of alcoholic liver disease, caused by alcohol-induced mitochondrial injury (AST is 80% mitochondrial) and hepatic deficiency of pyridoxal-5'-phosphate (vitamin B6, required more by ALT than AST).",
        "keyConcept": "De Ritis ratio: AST/ALT > 2.0 is pathognomonic for alcoholic hepatitis (mitochondrial AST release + low B6).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0048.webp",
            "caption": "Station 48 — De Ritis Ratio (AST/ALT) Diagnostic Algorithm"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0049",
        "type": "mcq",
        "lecture": 2,
        "text": "A patient is found to have an isolated elevation of Alkaline Phosphatase (ALP = 380 U/L, ULN 120) on routine screening, while AST, ALT, and total bilirubin are completely normal. Which additional serum enzyme must be measured to distinguish between hepatobiliary and bone origin?",
        "options": [
            "Gamma-Glutamyl Transferase (GGT)",
            "Lactate Dehydrogenase (LDH)",
            "Creatine Kinase (CK-MB)",
            "Amylase"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Alkaline phosphatase (ALP) is synthesized by both biliary canalicular epithelium and osteoblasts in bone. Gamma-Glutamyl Transferase (GGT) is expressed in hepatocytes and biliary epithelial cells, but is completely absent in bone; elevated ALP with elevated GGT confirms hepatobiliary pathology, whereas elevated ALP with normal GGT indicates bone disease (e.g., Paget's disease, osteomalacia).",
        "keyConcept": "GGT differentiation: High ALP + High GGT = biliary origin; High ALP + Normal GGT = bone origin.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0049.webp",
            "caption": "Station 49 — ALP vs GGT Enzyme Discrimination Tree"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0050",
        "type": "mcq",
        "lecture": 2,
        "text": "Why is Prothrombin Time (PT / INR) the most sensitive biochemical marker for detecting acute, early changes in hepatic protein synthetic function compared to serum albumin?",
        "options": [
            "Factor VII has an exceptionally short biological half-life (~6 hours) compared to albumin (~20 days)",
            "Albumin is synthesized by reticuloendothelial macrophages rather than hepatocytes",
            "Prothrombin time is independent of vitamin K absorption",
            "Clotting factor synthesis is stimulated in acute liver failure"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Factor VII (extrinsic pathway, measured by PT/INR) has the shortest plasma half-life (~4–6 hours) of all liver-synthesized proteins, making PT prolong within hours of acute liver failure. In contrast, albumin has a long half-life of 20 to 22 days, so serum albumin levels remain normal during acute hepatic necrosis and drop only in chronic liver disease.",
        "keyConcept": "PT vs Albumin: Factor VII half-life (~6 hours) reflects acute hepatic synthesis; albumin half-life (~20 days) reflects chronic state.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0050.webp",
            "caption": "Station 50 — Hepatic Synthetic Kinetics: PT/INR vs Albumin"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0051",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this slit-lamp photograph of the cornea showing a golden-brown pigment ring in Descemet's membrane (Kayser-Fleischer ring). What classical laboratory triad confirms the diagnosis of Wilson's Disease?",
        "options": [
            "Decreased serum ceruloplasmin (< 20 mg/dL), increased 24h urinary copper (> 100 µg/day), and elevated hepatic parenchymal copper (> 250 µg/g dry weight)",
            "Elevated serum ceruloplasmin, zero urinary copper, and low hepatic iron",
            "Decreased transferrin saturation, elevated ferritin, and high urinary zinc",
            "Elevated serum free iron, low copper, and normal urinary excretion"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Wilson's disease (hepatolenticular degeneration) is characterized biochemically by the diagnostic triad of: 1) low serum ceruloplasmin (< 20 mg/dL, present in 90–95%), 2) elevated 24-hour urinary copper excretion (> 100 µg/day / > 1.6 µmol/day), and 3) elevated liver biopsy copper concentration (> 250 µg/g dry weight).",
        "keyConcept": "Wilson's disease triad: low ceruloplasmin (< 20 mg/dL) + high 24h urinary copper (> 100 µg) + liver copper > 250 µg/g.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0051.webp",
            "caption": "Station 51 — Kayser-Fleischer Ring & Wilson Diagnostic Triad"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0052",
        "type": "mcq",
        "lecture": 1,
        "text": "Wilson's disease results from an autosomal recessive loss-of-function mutation in which gene on chromosome 13q14, encoding a transmembrane copper-transporting P-type ATPase in the trans-Golgi network?",
        "options": [
            "ATP7B",
            "ATP7A",
            "HFE",
            "CFTR"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Wilson's disease is caused by mutations in the ATP7B gene (chromosome 13q14), encoding a copper-transporting P-type ATPase located in the trans-Golgi network of hepatocytes. ATP7B dysfunction impairs both copper incorporation into apoceruloplasmin and excretion of excess copper into bile, leading to toxic copper accumulation in liver, brain, and cornea. Note: ATP7A mutation causes Menkes disease.",
        "keyConcept": "ATP7B mutation: impairs hepatic copper excretion into bile and incorporation into ceruloplasmin.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0052.webp",
            "caption": "Station 52 — ATP7B Trans-Golgi Copper Transport Architecture"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0053",
        "type": "mcq",
        "lecture": 1,
        "text": "A 48-year-old man presents with 'bronze diabetes', hepatomegaly, and arthropathy. Biochemical workup shows: Serum ferritin = 1,450 ng/mL (ULN 300) and Transferrin Saturation = 72% (normal < 45%). What genetic test confirms Hereditary Hemochromatosis?",
        "options": [
            "HFE gene analysis for C282Y and H63D missense mutations",
            "ATP7B gene sequencing on chromosome 13",
            "SERPINA1 PiZZ allele testing",
            "CFTR delta-F508 deletion testing"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Hereditary hemochromatosis is an autosomal recessive disorder caused predominantly by homozygous C282Y (or compound heterozygous C282Y/H63D) mutations in the HFE gene on chromosome 6p21, leading to inappropriately suppressed hepcidin, uncontrolled intestinal iron absorption, transferrin saturation > 45–50%, and marked ferritin elevation (> 1,000 ng/mL).",
        "keyConcept": "Hemochromatosis: HFE C282Y mutation + transferrin saturation > 45-50% + ferritin > 1,000 ng/mL.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0053.webp",
            "caption": "Station 53 — HFE Hemochromatosis Iron Overload Profile"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0054",
        "type": "mcq",
        "lecture": 1,
        "text": "A 32-year-old non-smoker presents with chronic hepatitis and lower lobe panacinar emphysema. Liver biopsy reveals round periportal cytoplasmic inclusions that stain positive with Periodic Acid-Schiff (PAS) and resist diastase digestion. Identify this genetic disease:",
        "options": [
            "Alpha-1 Antitrypsin (A1AT) deficiency (PiZZ homozygous phenotype)",
            "Wilson's disease",
            "Glycogen storage disease Type I",
            "Amyloidosis"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Alpha-1 Antitrypsin deficiency (most severe in PiZZ homozygotes) results from a Glu342Lys mutation in the SERPINA1 gene, causing the misfolded mutant glycoprotein to polymerize and become trapped inside the rough ER of hepatocytes; these accumulations appear on histology as pathognomonic round, eosinophilic cytoplasmic globules that stain bright magenta with PAS and resist diastase digestion.",
        "keyConcept": "A1AT deficiency: PiZZ phenotype characterized by PAS-positive, diastase-resistant hepatocyte globules.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0054.webp",
            "caption": "Station 54 — A1AT PAS-Positive Diastase-Resistant Globules"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0055",
        "type": "mcq",
        "lecture": 2,
        "text": "A patient presents with severe epigastric pain radiating to the back 48 hours after onset. Serum lipase is 750 U/L (ULN 60), while serum amylase is 180 U/L (ULN 100). Why is serum lipase clinically superior to amylase for the diagnosis of Acute Pancreatitis?",
        "options": [
            "Serum lipase has higher sensitivity and specificity (> 90%), rises within 4-8 hours, and remains elevated for 8-14 days (vs amylase which normalizes in 3-5 days)",
            "Amylase is only synthesized by salivary glands",
            "Lipase levels correlate directly with the severity of pancreatitis",
            "Amylase is cleared exclusively by the biliary tree"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Serum lipase is the preferred biomarker for acute pancreatitis because: 1) it is produced almost exclusively by pancreatic acinar cells (unlike amylase which is also produced by salivary glands, fallopian tubes, and tumors), 2) has higher diagnostic sensitivity (95–100%) and specificity (99%), and 3) remains elevated in serum for 8 to 14 days, whereas amylase normalizes rapidly in 3 to 5 days.",
        "keyConcept": "Serum lipase: preferred biomarker for acute pancreatitis; > 90% specific and remains elevated for 8–14 days.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0055.webp",
            "caption": "Station 55 — Lipase vs Amylase Temporal Kinetic Curves"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0056",
        "type": "mcq",
        "lecture": 2,
        "text": "A 45-year-old with hepatitis C presents with cutaneous fluid-filled blisters and skin fragility on sun-exposed hands. His urine is tea-colored and displays striking coral-pink fluorescence under Wood's lamp (UV light at 365 nm). Identify this porphyria and the deficient enzyme:",
        "options": [
            "Porphyria Cutanea Tarda (PCT); Uroporphyrinogen Decarboxylase (UROD)",
            "Acute Intermittent Porphyria (AIP); Porphobilinogen Deaminase",
            "Erythropoietic Protoporphyria (EPP); Ferrochelatase",
            "Congenital Erythropoietic Porphyria; Uroporphyrinogen III Synthase"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Porphyria Cutanea Tarda (PCT) is the most common porphyria, caused by deficiency of hepatic uroporphyrinogen decarboxylase (UROD). Accumulation of uroporphyrin in dermal capillaries causes photosensitivity blisters, and urinary excretion of uroporphyrin yields wine-colored urine exhibiting intense pink-red fluorescence under Wood's lamp UV light (365 nm).",
        "keyConcept": "PCT: UROD deficiency + skin blistering on sun exposure + pink-red urine fluorescence under Wood's lamp.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0056.webp",
            "caption": "Station 56 — Wood's Lamp Urine Fluorescence in PCT"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0057",
        "type": "mcq",
        "lecture": 2,
        "text": "A healthy 19-year-old medical student develops mild scleral icterus during final exam fasting. Total bilirubin is 2.4 mg/dL with 90% unconjugated bilirubin; all LFTs and hemoglobin are normal. Which promoter mutation in the UGT1A1 gene causes this benign condition?",
        "options": [
            "Gilbert syndrome; homozygous A(TA)7TAA promoter insertion reducing UGT1A1 activity to ~30%",
            "Crigler-Najjar Type I; complete absence of UGT1A1 enzyme",
            "Dubin-Johnson syndrome; mutation in canalicular MRP2 exporter",
            "Rotor syndrome; defect in SLCO1B1 and SLCO1B3 transporters"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Gilbert syndrome is a benign autosomal recessive condition affecting 5–10% of the population, caused by an insertion of two bases in the TATA box of the UGT1A1 promoter (homozygous A(TA)7TAA vs normal A(TA)6TAA), reducing glucuronyltransferase transcription by 70%; mild unconjugated hyperbilirubinemia (< 3 mg/dL) precipitates harmlessly during fasting, stress, or illness.",
        "keyConcept": "Gilbert syndrome: A(TA)7TAA UGT1A1 promoter mutation reducing enzyme activity to 30%; mild fasting jaundice.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0057.webp",
            "caption": "Station 57 — UGT1A1 Promoter Variant in Gilbert Syndrome"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0058",
        "type": "mcq",
        "lecture": 2,
        "text": "A 25-year-old presents with mild conjugated hyperbilirubinemia. Laparoscopy reveals an intensely dark black-pigmented liver, while normal urinary coproporphyrin isomer I constitutes > 80% of total coproporphyrin. Identify this syndrome and its defective transporter:",
        "options": [
            "Dubin-Johnson syndrome; defective canalicular Multidrug Resistance-associated Protein 2 (MRP2 / ABCC2)",
            "Rotor syndrome; defective organic anion transporter SLCO1B1",
            "Wilson's disease; defective ATP7B copper ATPase",
            "Gilbert syndrome; defective UGT1A1 promoter"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Dubin-Johnson syndrome is an autosomal recessive disorder caused by mutations in the canalicular exporter MRP2 (ABCC2), preventing secretion of conjugated bilirubin and epinephrine metabolites into bile. Metabolites accumulate in hepatocyte lysosomes, producing pathognomonic gross black liver pigmentation and elevated urinary coproporphyrin isomer I (> 80%).",
        "keyConcept": "Dubin-Johnson syndrome: MRP2 (ABCC2) mutation + conjugated hyperbilirubinemia + gross black-pigmented liver.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0058.webp",
            "caption": "Station 58 — Dubin-Johnson Canalicular MRP2 Transporter Defect"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0059",
        "type": "mcq",
        "lecture": 3,
        "text": "What post-transcriptional RNA-editing enzyme present in small intestinal enterocytes deaminates a specific cytidine to uridine (CAA -> UAA stop codon) in the apoB mRNA, producing truncated Apolipoprotein B-48 essential for dietary chylomicron assembly?",
        "options": [
            "APOBEC-1 (Apolipoprotein B mRNA editing catalytic polypeptide 1)",
            "Adenosine Deaminase (ADA)",
            "Peptidyl Transferase",
            "Fatty Acid Synthase"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: In human enterocytes, the enzyme APOBEC-1 deaminates cytidine at nucleotide 6666 of the full-length apoB-100 mRNA into uridine, creating an in-frame UAA nonsense stop codon; this truncates the protein at 48% of its length (ApoB-48), which serves as the unique structural protein required for packaging and secreting dietary chylomicrons into lacteals.",
        "keyConcept": "APOBEC-1: cytidine deaminase editing enterocyte apoB mRNA to generate ApoB-48 for chylomicron synthesis.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0059.webp",
            "caption": "Station 59 — APOBEC-1 RNA-Editing & ApoB-48 Synthesis"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0060",
        "type": "mcq",
        "lecture": 3,
        "text": "Which stool biochemical assay is the non-invasive gold standard for diagnosing Exocrine Pancreatic Insufficiency (EPI), because the enzyme is completely resistant to intestinal degradation and unaffected by oral enzyme replacement therapy?",
        "options": [
            "Fecal Elastase-1 (FE-1) assay (< 200 µg/g stool)",
            "Fecal Chymotrypsin assay",
            "Fecal alpha-1 antitrypsin clearance",
            "Stool reducing substances"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Fecal elastase-1 (FE-1) is a stable pancreatic endopeptidase that traverses the digestive tract without degradation. A stool concentration < 200 µg/g stool diagnosticates exocrine pancreatic insufficiency (< 100 µg/g indicates severe insufficiency). Crucially, human FE-1 assays do not cross-react with animal-derived oral pancreatic enzyme replacement therapies (PERT).",
        "keyConcept": "Fecal Elastase-1: stable stool biomarker of exocrine pancreatic function (< 200 µg/g = insufficiency).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0060.webp",
            "caption": "Station 60 — Fecal Elastase-1 Exocrine Diagnostic Assay"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0061",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this urinalysis demonstration using Fouchet's reagent (ferric chloride in trichloroacetic acid). A patient's urine develops an intense green color (biliverdin) upon addition of the reagent. Identify the urinary pigment detected:",
        "options": [
            "Conjugated bilirubin (Bilirubinuria)",
            "Urobilinogen",
            "Porphobilinogen",
            "Hemoglobin"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Fouchet's test detects conjugated bilirubin in urine: trichloroacetic acid precipitates proteins and ferric chloride oxidizes yellow bilirubin into green biliverdin. Unconjugated bilirubin cannot appear in urine because it is lipophilic and bound to albumin, whereas water-soluble conjugated bilirubin readily filters into urine during cholestasis or hepatitis.",
        "keyConcept": "Fouchet's test: oxidizes conjugated bilirubin to green biliverdin, confirming pathological bilirubinuria.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0061.webp",
            "caption": "Station 61 — Fouchet's Chemical Test for Urinary Bilirubin"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0062",
        "type": "mcq",
        "lecture": 3,
        "text": "Calculate the approximate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) for a 70 kg sedentary adult male using the standard quick estimate rule (1.0 kcal/kg/hour for BMR and sedentary activity factor of 1.2):",
        "options": [
            "BMR = 1,680 kcal/day; TDEE = 2,016 kcal/day",
            "BMR = 2,100 kcal/day; TDEE = 2,520 kcal/day",
            "BMR = 1,200 kcal/day; TDEE = 1,440 kcal/day",
            "BMR = 1,680 kcal/day; TDEE = 2,850 kcal/day"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Basal metabolic rate for adult males is estimated at 1 kcal/kg/hour: BMR = 1.0 x 70 kg x 24 hours = 1,680 kcal/day. For a sedentary lifestyle (physical activity level factor PAL = 1.2), TDEE = BMR x 1.2 = 1,680 x 1.2 = 2,016 kcal/day.",
        "keyConcept": "BMR calculation: 1 kcal/kg/hr x 70 kg x 24h = 1,680 kcal/day; TDEE = 1,680 x 1.2 = 2,016 kcal/day.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0062.webp",
            "caption": "Station 62 — Basal Metabolic Rate & TDEE Calculations"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0063",
        "type": "mcq",
        "lecture": 3,
        "text": "Indirect calorimetry measures a patient's Respiratory Quotient (RQ = CO2 produced / O2 consumed) at 0.70. What is the predominant metabolic fuel being oxidized in this patient?",
        "options": [
            "Fatty acids / Lipids (RQ = 0.70)",
            "Pure Carbohydrates (RQ = 1.00)",
            "Proteins (RQ = 0.82)",
            "Mixed balanced diet (RQ = 0.85)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The Respiratory Quotient (RQ) reflects substrate oxidation: Carbohydrate oxidation (C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O) yields RQ = 6/6 = 1.00; Fatty acid oxidation (e.g., palmitate: C16H32O2 + 23 O2 -> 16 CO2 + 16 H2O) yields RQ = 16/23 = 0.70; Protein oxidation yields RQ ~0.82; an RQ of 0.70 signifies exclusive lipid oxidation (starvation or severe diabetic ketoacidosis).",
        "keyConcept": "Respiratory Quotient: Carbohydrates = 1.00; Proteins = 0.82; Lipids = 0.70; Mixed diet = 0.85.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0063.webp",
            "caption": "Station 63 — Respiratory Quotient Indirect Calorimetry Table"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0064",
        "type": "mcq",
        "lecture": 3,
        "text": "A 40-year-old male has a height of 1.75 m and weight of 95 kg. Calculate his Body Mass Index (BMI = kg/m^2) and identify the WHO clinical classification category:",
        "options": [
            "BMI = 31.0 kg/m^2 (Class I Obesity)",
            "BMI = 27.1 kg/m^2 (Overweight)",
            "BMI = 35.5 kg/m^2 (Class II Obesity)",
            "BMI = 24.5 kg/m^2 (Normal weight)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Body Mass Index is calculated as: BMI = weight (kg) / [height (m)]^2 = 95 / (1.75)^2 = 95 / 3.0625 = 31.02 kg/m^2. According to WHO criteria: BMI < 18.5 is underweight, 18.5–24.9 is normal, 25.0–29.9 is overweight, and 30.0–34.9 is Class I Obesity.",
        "keyConcept": "BMI calculation: 95 / (1.75)^2 = 31.0 kg/m^2 (Class I Obesity: 30.0–34.9 kg/m^2).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0064.webp",
            "caption": "Station 64 — Body Mass Index WHO Classification Nomogram"
        }
    },
    {
        "id": "MGL3-CH306-BIOC-0065",
        "type": "mcq",
        "lecture": 3,
        "text": "A critically ill ICU trauma patient receives 80 g of dietary protein daily. 24-hour urine collection reveals Urinary Urea Nitrogen (UUN) of 18 g. Calculate the patient's Nitrogen Balance (Nitrogen Intake = Protein / 6.25; Nitrogen Output = UUN + 4 g miscellaneous loss) and clinical status:",
        "options": [
            "Nitrogen Balance = -9.2 g/day (Severe negative nitrogen balance / hypercatabolic state)",
            "Nitrogen Balance = +2.8 g/day (Positive anabolic state)",
            "Nitrogen Balance = 0.0 g/day (Nitrogen equilibrium)",
            "Nitrogen Balance = -5.0 g/day (Mild catabolism)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Nitrogen Intake = 80 g protein / 6.25 = 12.8 g nitrogen. Nitrogen Output = UUN + 4 g = 18 + 4 = 22 g. Nitrogen Balance = Intake - Output = 12.8 - 22 = -9.2 g/day. A negative nitrogen balance reflects severe catabolism, tissue breakdown, and muscle wasting common in sepsis, trauma, or burns.",
        "keyConcept": "Nitrogen Balance: Intake (80/6.25 = 12.8) - Output (18 + 4 = 22) = -9.2 g/day (severe catabolic state).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/biochemistry/img_bioc_0065.webp",
            "caption": "Station 65 — Clinical Nitrogen Balance Quantitative Determination"
        }
    }
]


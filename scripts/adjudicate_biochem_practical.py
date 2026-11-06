import json

with open("scripts/raw_biochem_form.json", "r", encoding="utf-8") as f:
    raw_qs = json.load(f)

print(f"Adjudicating {len(raw_qs)} Biochemistry practical questions...")

# Define medical adjudication rules for all 65 questions
# Key: index (0-based) -> (target_option_string, lecture_topic_id, explanation, key_concept)
biochem_rules = {
    0: (
        "Protein loss through the kidneys",
        1,
        "Criteria of Identification: The combination of profound hypoalbuminemia (2.3 g/dL) with massive proteinuria and generalized edema in the presence of completely normal liver synthetic markers (normal ALT, AST, bilirubin, and PT) is the classic hallmark of nephrotic syndrome. In nephrotic syndrome, disruption of the glomerular filtration barrier leads to heavy urinary loss of albumin exceeding hepatic compensatory synthesis.",
        "Nephrotic syndrome: Glomerular proteinuria causing hypoalbuminemia, decreased oncotic pressure, and third-space edema with preserved liver synthetic function."
    ),
    1: (
        "Its long plasma half-life of about 20 days",
        1,
        "Criteria of Identification: Serum albumin has a long physiological half-life of approximately 20 days in humans. Consequently, in acute liver diseases of short duration (e.g., acute viral hepatitis lasting 5 days), cessation or reduction of hepatic albumin synthesis has not had sufficient time to produce a noticeable decline in circulating albumin levels.",
        "Albumin kinetics: Long plasma half-life of ~20 days makes albumin a marker of chronic (not acute) liver disease."
    ),
    2: (
        "Increased volume of distribution from fluid retention",
        1,
        "Criteria of Identification: In chronic liver disease with portal hypertension, splanchnic arterial vasodilation triggers neurohumoral sodium and water retention (renin-angiotensin-aldosterone and ADH activation), leading to ascites and peripheral edema. This marked expansion of the extracellular fluid volume significantly increases the volume of distribution for albumin, diluting its serum concentration.",
        "Hypoalbuminemia in cirrhosis: Caused by both impaired hepatic protein synthesis and hemodilution from expanded plasma volume and ascites."
    ),
    3: (
        "Dehydration",
        1,
        "Criteria of Identification: Dehydration (hemoconcentration) is the only clinically recognized cause of hyperalbuminemia in humans. The liver does not hypersecrete albumin above normal physiological reference limits (3.5–5.0 g/dL); an elevated concentration (e.g., 6.2 g/dL) invariably reflects relative loss of plasma water.",
        "Hyperalbuminemia: Exclusively caused by dehydration and hemoconcentration, never by hepatic hyperproduction."
    ),
    4: (
        "Sodium",
        1,
        "Criteria of Identification: Albumin has a net negative charge (-17 to -19 mEq) at physiological blood pH (7.40). Due to the Gibbs-Donnan effect, this strong polyanionic charge attracts and binds positively charged sodium ions (Na+) in the intravascular compartment. The osmotic pull of these trapped sodium ions accounts for approximately one-third of the total colloidal oncotic pressure exerted by albumin.",
        "Gibbs-Donnan effect: Negative net charge of albumin attracts intravascular Na+, enhancing its colloidal oncotic pressure."
    ),
    5: (
        "About 10 grams",
        1,
        "Criteria of Identification: In a healthy adult, the liver synthesizes approximately 10 to 15 grams of albumin per day (about 120–200 mg/kg/day), which represents roughly 50% of total hepatic protein output.",
        "Hepatic albumin synthesis: Normal adult liver produces 10–15 grams of albumin daily, representing ~50% of total export protein synthesis."
    ),
    6: (
        "Ala-Gly-Ser tripeptide",
        1,
        "Criteria of Identification: The biuret reaction requires the presence of at least two peptide bonds in a molecule to coordinate with cupric ions (Cu2+) in an alkaline solution. A tripeptide contains two peptide bonds and thus yields a positive violet complex, whereas free amino acids and dipeptides (which have only one peptide bond) are biuret-negative.",
        "Biuret principle: Requires a minimum of two peptide bonds (tripeptides or larger) to form a violet coordination complex with alkaline cupric ions."
    ),
    7: (
        "Blue, then violet",
        1,
        "Criteria of Identification: Biuret reagent contains copper sulfate (CuSO4) in alkaline sodium hydroxide (NaOH) with potassium sodium tartrate (to keep copper in solution) and potassium iodide (as stabilizer), giving the unreacted reagent a characteristic light blue color. When peptide bonds coordinate with Cu2+ ions in alkaline medium, the solution turns violet (purple).",
        "Biuret reaction color: Transition from blue (unreacted alkaline copper sulfate) to violet (cupric-peptide coordination complex)."
    ),
    8: (
        "10 minutes at 37 degrees C",
        1,
        "Criteria of Identification: In standard clinical biochemistry laboratory protocols for the biuret protein assay, after adding the biuret reagent to the serum and standard tubes and mixing by inversion, the reaction mixture is incubated for 10 minutes at 37°C (or 20–30 minutes at room temperature 20–25°C) to allow full, stable development of the violet copper-peptide coordination complex.",
        "Biuret assay incubation: Requires 10 minutes at 37°C for complete and stable chromophore development before spectrophotometric measurement."
    ),
    9: (
        "550 nm",
        1,
        "Criteria of Identification: The violet biuret complex absorbs light maximally in the green-yellow region of the visible spectrum, with an absorption peak between 540 and 560 nm (standardized at 545–550 nm in automated and manual spectrophotometers).",
        "Biuret spectrophotometry: Peak absorbance of the purple coordination complex is measured between 540 and 560 nm (standard 550 nm)."
    ),
    10: (
        "1.0 mL distilled water + 5.0 mL biuret reagent",
        1,
        "Criteria of Identification: The blank tube in colorimetric assays corrects for the intrinsic absorbance of the reagents. It contains identical volume of the biuret reagent (5.0 mL) combined with distilled water (1.0 mL or designated sample volume) without any serum protein, ensuring the spectrophotometer is zeroed solely on the reagent background.",
        "Colorimetric blank: Distilled water plus reagent; zeros out background reagent absorbance to isolate sample chromophore optical density."
    ),
    11: (
        "4.5 g/dL, within the normal range",
        1,
        "Criteria of Identification: Applying Beer-Lambert's law: Concentration of Test = (Absorbance of Test / Absorbance of Standard) * Concentration of Standard = (0.36 / 0.48) * 6.0 g/dL = 0.75 * 6.0 = 4.5 g/dL. The standard adult reference range for serum albumin is 3.5 to 5.0 g/dL, placing 4.5 g/dL squarely within normal physiological limits.",
        "Albumin calculation: (A_test / A_std) * C_std yields 4.5 g/dL, which is within the normal adult reference interval (3.5–5.0 g/dL)."
    ),
    12: (
        "3.0 g/dL, protein loss from malabsorption",
        1,
        "Criteria of Identification: Concentration = (0.21 / 0.42) * 6.0 g/dL = 0.5 * 6.0 = 3.0 g/dL (hypoalbuminemia). Because liver transaminases and bilirubin are entirely normal, hepatic synthetic capacity is intact. The patient's chronic diarrhea with steatorrhea indicates intestinal malabsorption (e.g., celiac sprue or protein-losing enteropathy) leading to failure of dietary amino acid uptake and protein loss.",
        "Malabsorptive hypoalbuminemia: Chronic steatorrhea leads to protein malnutrition and enteric protein loss with normal hepatic enzymes."
    ),
    13: (
        "Galactose tolerance test",
        2,
        "Criteria of Identification: Liver function tests are categorized functionally: synthetic (albumin, PT/coagulation factors), excretory (bilirubin, bile acids), integrity/necrosis (ALT, AST), and metabolic capacity (galactose elimination capacity, antipyrine clearance, aminopyrine breath test). The galactose tolerance test specifically measures the metabolic capacity of functional hepatocytes to phosphorylate and convert galactose to glucose via the Leloir pathway.",
        "Hepatic metabolic capacity: Assessed by galactose tolerance test and clearance of exogenously administered metabolized compounds."
    ),
    14: (
        "Prothrombin time",
        2,
        "Criteria of Identification: Prothrombin time (PT) reflects the synthetic function of the liver, as the liver synthesizes all vitamin K-dependent clotting factors (II, VII, IX, X) as well as factor V and fibrinogen. In contrast, AST, ALT, and LDH reflect cellular integrity/leakage, and ALP and 5'-nucleotidase reflect cholestasis/excretory biliary function.",
        "Liver synthetic tests: Serum albumin and prothrombin time (PT/INR) are the two primary clinical markers of true hepatic synthetic capacity."
    ),
    15: (
        "Metabolic capacity",
        2,
        "Criteria of Identification: Esterification of free cholesterol with fatty acids to form cholesteryl esters is catalyzed by the enzyme lecithin:cholesterol acyltransferase (LCAT), which is produced by hepatocytes. Evaluating the ratio of free cholesterol to esterified cholesterol provides a measure of hepatic metabolic and enzymatic esterifying capacity.",
        "Cholesterol esterification: Assesses hepatic metabolic enzymatic capacity mediated by liver-derived LCAT."
    ),
    16: (
        "Release of AST from damaged cardiac muscle",
        2,
        "Criteria of Identification: Aspartate transaminase (AST) is not liver-specific; it is present in high concentrations in cardiac myocardium, skeletal muscle, kidneys, and brain. In acute myocardial infarction presenting with crushing chest pain, damaged cardiomyocytes necrotic membrane rupture releases large amounts of AST into the circulation, while ALT (which is much more liver-specific) remains normal.",
        "AST tissue distribution: Abundant in myocardium; elevated AST with normal ALT in chest pain points to acute myocardial infarction, not liver disease."
    ),
    17: (
        "ALT is cytoplasmic; AST is cytoplasmic and mitochondrial",
        2,
        "Criteria of Identification: Alanine transaminase (ALT) is purely a cytosolic enzyme. In contrast, aspartate transaminase (AST) exists as two distinct isoenzymes: cytosolic (cAST, ~20% of activity) and mitochondrial (mAST, ~80% of activity). Severe necrotic injuries (such as ischemic hepatitis or toxic/alcoholic injury) release mitochondrial AST, shifting the AST/ALT ratio.",
        "Transaminase subcellular location: ALT is exclusively cytoplasmic, whereas AST is found in both cytoplasm and mitochondria (80% mitochondrial)."
    ),
    18: (
        "ALT rises higher than AST",
        2,
        "Criteria of Identification: In most forms of acute inflammatory hepatocellular injury (such as acute viral hepatitis A, B, or E), ALT rises substantially higher than AST, producing a De Ritis ratio (AST/ALT) of less than 1.0 (typically 0.3–0.7). This is because ALT has a longer circulating half-life (~47 hours vs ~17 hours for AST) and is released continuously from inflamed cytoplasm.",
        "De Ritis ratio in acute hepatitis: ALT > AST (AST/ALT < 1.0) due to longer plasma half-life and predominant cytosolic release."
    ),
    19: (
        "Placenta",
        2,
        "Criteria of Identification: Alkaline phosphatase (ALP) consists of several tissue isoenzymes: liver, bone, intestinal, and placental. During the third trimester of normal pregnancy, the syncytiotrophoblast of the placenta synthesizes and releases large amounts of heat-stable placental ALP into maternal circulation, causing a physiological rise in total ALP without hepatic or biliary pathology.",
        "Placental ALP: Heat-stable isoenzyme produced by syncytiotrophoblast; causes physiological isolated ALP elevation in third-trimester pregnancy."
    ),
    20: (
        "2.5 times",
        2,
        "Criteria of Identification: In biliary tract obstruction (obstructive/cholestatic jaundice), bile duct epithelial cells and canalicular hepatocytes upregulate ALP synthesis in response to accumulated bile acids. Serum ALP characteristically rises markedly to greater than 2.5 to 3.0 times the upper limit of normal, whereas in uncomplicated hepatocellular injury it rarely exceeds 2 to 3 times normal.",
        "Cholestatic ALP threshold: Biliary obstruction characteristically elevates ALP to > 2.5–3.0 times the upper reference limit."
    ),
    21: (
        "Predominantly unconjugated bilirubin",
        3,
        "Criteria of Identification: Unconjugated (indirect) bilirubin is non-polar and water-insoluble, being tightly bound to albumin; it cannot react directly with aqueous diazo reagent. Adding an organic accelerator such as methanol disrupts albumin binding and dissolves the unconjugated pigment, allowing it to react and produce the characteristic pink azobilirubin color (Indirect Van den Bergh positive).",
        "Indirect Van den Bergh: Detects unconjugated (water-insoluble) bilirubin, which requires alcohol/methanol accelerator to react with diazo reagent."
    ),
    22: (
        "Azobilirubin, pink",
        3,
        "Criteria of Identification: In the Van den Bergh reaction, bilirubin molecules are cleaved and coupled with diazotized sulfanilic acid (diazo reagent) in acidic medium to form two molecules of dipyrrolic azobilirubin, which displays an intense pink to reddish-purple color that can be quantitated spectrophotometrically at 540 nm.",
        "Van den Bergh reaction product: Cleavage of tetrapyrrole bilirubin by diazo reagent yields pink/reddish-purple dipyrrolic azobilirubin."
    ),
    23: (
        "Direct bilirubin 0.45 mg/dL",
        3,
        "Criteria of Identification: Normal reference ranges in clinical biochemistry: Total bilirubin is 0.2–1.2 mg/dL, direct (conjugated) bilirubin is 0.0–0.3 mg/dL, indirect (unconjugated) is 0.2–0.8 mg/dL, and serum albumin is 3.5–5.0 g/dL. A direct bilirubin of 0.45 mg/dL exceeds the normal physiological threshold (< 0.3 mg/dL) and indicates abnormal conjugated hyperbilirubinemia.",
        "Bilirubin reference ranges: Normal direct (conjugated) bilirubin is strictly < 0.3 mg/dL; 0.45 mg/dL represents abnormal conjugated hyperbilirubinemia."
    ),
    24: (
        "Ligandin",
        3,
        "Criteria of Identification: Following dissociation from albumin at the sinusoidal hepatocyte membrane, unconjugated bilirubin enters the hepatocyte via facilitated diffusion (OATP1B1/OATP1B3 transporters). In the cytosol, it is immediately bound by ligandin (glutathione S-transferase B / Y protein) and protein Z, which prevent its efflux back into the sinusoidal blood and deliver it to the smooth endoplasmic reticulum for glucuronidation.",
        "Intracellular bilirubin transport: Ligandin (Y-protein / GST) binds unconjugated bilirubin in hepatocyte cytoplasm, escorting it to the SER."
    ),
    25: (
        "Bacterial proteases",
        3,
        "Criteria of Identification: In the terminal ileum and colon, conjugated bilirubin glucuronides are deconjugated by bacterial beta-glucuronidases and subsequently reduced by anaerobic intestinal microflora (colonic bacteria) into colorless tetrapyrrolic compounds known as urobilinogens (stercobilinogen, urobilinogen).",
        "Urobilinogen formation: Colonic bacterial flora deconjugate and reduce bilirubin glucuronide into urobilinogen and stercobilinogen."
    ),
    26: (
        "Extrahepatic obstructive jaundice",
        3,
        "Criteria of Identification: The laboratory profile shows massive conjugated hyperbilirubinemia (conjugated 15.9 mg/dL out of 17.2 total, direct Van den Bergh positive), striking elevation of alkaline phosphatase (410 IU/L, > 4x normal), and near-normal transaminases (ALT 42 IU/L). This profound cholestatic pattern with minimal hepatocellular necrosis is diagnostic of extrahepatic biliary tract obstruction (e.g., choledocholithiasis or pancreatic head malignancy).",
        "Extrahepatic obstruction: Predominant direct (conjugated) hyperbilirubinemia with marked ALP elevation (> 3x) and near-normal transaminases."
    ),
    27: (
        "Hepatocellular jaundice",
        3,
        "Criteria of Identification: Marked elevation of transaminases (ALT 318 IU/L, AST 290 IU/L; both > 7x normal) combined with a mixed hyperbilirubinemia (conjugated 6.2 mg/dL, unconjugated 6.6 mg/dL; biphasic/direct positive) reflects widespread hepatocellular injury and inflammation (hepatitis) causing both impaired canalicular excretion and impaired conjugation.",
        "Hepatocellular jaundice: Markedly elevated transaminases (ALT/AST in hundreds or thousands) with mixed (conjugated and unconjugated) hyperbilirubinemia."
    ),
    28: (
        "Increased urinary urobilinogen",
        3,
        "Criteria of Identification: Pure unconjugated hyperbilirubinemia (unconjugated 11.2 mg/dL out of 11.9 mg/dL, indirect positive) with completely normal liver transaminases (ALT 33, AST 29) indicates hemolytic jaundice. Massive RBC destruction floods the liver with unconjugated bilirubin; the liver conjugates it at maximal capacity, producing enormous amounts of intestinal urobilinogen. Increased urobilinogen is reabsorbed into the portal circulation and filtered by the kidneys, resulting in increased urinary urobilinogen with no urinary bilirubin.",
        "Hemolytic jaundice urine findings: Increased urinary urobilinogen with ABSENT urinary bilirubin (unconjugated bilirubin cannot be filtered by glomeruli)."
    ),
    29: (
        "Normal pattern",
        3,
        "Criteria of Identification: Total bilirubin of 0.9 mg/dL (normal < 1.2 mg/dL), conjugated 0.24 mg/dL (normal < 0.3 mg/dL), unconjugated 0.68 mg/dL (normal 0.2–0.8 mg/dL), ALT 38 IU/L (normal < 45), and AST 31 IU/L (normal < 40). In healthy individuals, 70–85% of circulating bilirubin is unconjugated; all parameters are within normal physiological reference intervals.",
        "Normal LFT profile: Total bilirubin < 1.2 mg/dL, direct < 0.3 mg/dL, and normal transaminases reflect healthy liver and biliary function."
    ),
    30: (
        "Albumin",
        4,
        "Criteria of Identification: In human plasma, approximately 90–95% of circulating copper is tightly and covalently incorporated into ceruloplasmin. The remaining 5–10% is non-ceruloplasmin-bound copper, which is loosely bound to serum albumin (and to a lesser degree histidine/amino acids) and represents the readily exchangeable, biologically active and diffusible copper pool.",
        "Circulating copper fractions: ~90% tightly incorporated in ceruloplasmin; ~10% loosely bound to albumin as the exchangeable tissue pool."
    ),
    31: (
        "Copper",
        4,
        "Criteria of Identification: Metallothioneins are small, cysteine-rich intracellular proteins synthesized primarily in the liver, kidney, and intestinal mucosa. Their high thiol (-SH) content allows them to chelate and detoxify heavy metal ions, particularly copper (Cu+) and zinc (Zn2+), buffering free intracellular copper and protecting cellular organelles from oxidative damage.",
        "Metallothionein: Cysteine-rich intracellular chelator that binds and sequesters free copper and heavy metals to prevent oxidative stress."
    ),
    32: (
        "Hepatocytes",
        4,
        "Criteria of Identification: Ceruloplasmin (an alpha-2 globulin and blue copper-carrying ferroxidase) is synthesized exclusively by hepatocytes in the liver. Within the trans-Golgi network of hepatocytes, copper is incorporated into apoceruloplasmin by the ATP7B copper-transporting ATPase before holoceruloplasmin is secreted into the blood.",
        "Ceruloplasmin synthesis: Exclusively synthesized in hepatocytes; copper incorporation occurs in the trans-Golgi network via ATP7B."
    ),
    33: (
        "Failure to load copper onto apoceruloplasmin in the Golgi",
        4,
        "Criteria of Identification: In Wilson disease, loss-of-function mutations in the ATP7B gene abolish copper transport into the secretory pathway (trans-Golgi network) of hepatocytes. Consequently, apoceruloplasmin (the copper-free precursor) is secreted into the circulation; apoceruloplasmin is structurally unstable and undergoes rapid proteolytic degradation, leading to a markedly low serum ceruloplasmin concentration.",
        "Wilson disease ceruloplasmin defect: Absent ATP7B prevents copper loading into apoceruloplasmin; unstable apoprotein is rapidly cleared from plasma."
    ),
    34: (
        "A hepatic copper-transporting ATPase",
        4,
        "Criteria of Identification: The ATP7B gene on chromosome 13q14.3 encodes a P-type transmembrane copper-transporting ATPase (ATP7B) expressed predominantly on the trans-Golgi network and canalicular membranes of hepatocytes. It functions to transport copper into the secretory pathway for ceruloplasmin incorporation and into bile canaliculi for biliary excretion.",
        "ATP7B function: P-type copper-transporting ATPase in hepatocytes responsible for copper incorporation into ceruloplasmin and biliary excretion."
    ),
    35: (
        "Liver copper over 250 ug/g dry weight with ceruloplasmin under 20 mg/dL",
        4,
        "Criteria of Identification: The gold standard diagnostic criteria for Wilson disease (AASLD and EASL consensus guidelines) include a quantitative liver biopsy copper concentration greater than 250 µg/g dry weight (normal < 50 µg/g) combined with a low serum ceruloplasmin (< 20 mg/dL, normal 20–40 mg/dL) and elevated 24-hour urinary copper excretion (> 100 µg/24h).",
        "Wilson disease diagnostic criteria: Hepatic copper > 250 µg/g dry tissue weight and serum ceruloplasmin < 20 mg/dL (often < 10 mg/dL)."
    ),
    36: (
        "It chelates copper for urinary excretion",
        4,
        "Criteria of Identification: D-penicillamine (dimethylcysteine) is a thiol-containing chelating agent. Its sulfhydryl group binds free copper in plasma and tissues to form a stable, soluble, water-soluble copper-penicillamine coordination complex that is readily filtered by renal glomeruli and excreted in the urine (producing massive cupriuria).",
        "Penicillamine mechanism: Thiol chelator that binds tissue copper and promotes its renal excretion in urine (cupriuria)."
    ),
    37: (
        "Liver transplantation",
        4,
        "Criteria of Identification: Orthotopic liver transplantation replaces the genetically defective host liver with a donor liver possessing intact, wild-type ATP7B copper-transporting ATPases. This permanently restores normal biliary copper excretion and ceruloplasmin synthesis, curing the underlying metabolic defect.",
        "Wilson disease curative therapy: Liver transplantation permanently cures the metabolic defect by providing functional donor ATP7B."
    ),
    38: (
        "Glucosuria and aminoaciduria",
        4,
        "Criteria of Identification: Chronic accumulation and toxic deposition of free copper in renal proximal tubular epithelial cells causes secondary Fanconi syndrome (proximal renal tubular acidosis). This presents with impaired proximal tubular reabsorption characterized by glucosuria (with normal blood glucose), generalized aminoaciduria, phosphaturia, and uricosuria.",
        "Renal Wilson disease: Proximal tubular copper toxicity causes Fanconi syndrome presenting with glucosuria and aminoaciduria."
    ),
    39: (
        "It oxidizes proteins, lipids and nucleic acids",
        4,
        "Criteria of Identification: Unbound (free) copper is a redox-active transition metal (Cu+ / Cu2+). Through Fenton and Haber-Weiss reactions with hydrogen peroxide, it generates highly reactive hydroxyl free radicals (•OH), which trigger lipid peroxidation of cell membranes, cross-linking and inactivation of proteins, and mitochondrial and DNA cleavage, leading to tissue necrosis.",
        "Copper toxicity mechanism: Redox cycling of free copper catalyzes hydroxyl radical generation, causing lipid peroxidation and cell necrosis."
    ),
    40: (
        "Lysyl oxidase",
        4,
        "Criteria of Identification: Lysyl oxidase is a copper-dependent amine oxidase essential for cross-linking collagen and elastin fibrils in the extracellular matrix. Other copper-dependent enzymes include cytochrome c oxidase, superoxide dismutase (Cu/Zn-SOD), dopamine beta-hydroxylase, and tyrosinase.",
        "Copper-dependent enzymes: Lysyl oxidase (collagen cross-linking), cytochrome c oxidase (ETC), tyrosinase (melanin), and ceruloplasmin (ferroxidase)."
    ),
    41: (
        "It binds pyridoxal phosphate, forming an inactive derivative lost in urine",
        4,
        "Criteria of Identification: D-penicillamine possesses both a free sulfhydryl group and an amino group. It reacts non-enzymatically with the aldehyde group of pyridoxal 5'-phosphate (PLP, active vitamin B6) to form a stable thiazolidine derivative, inactivating PLP and promoting its rapid urinary excretion, resulting in clinical vitamin B6 deficiency (neuropathy, glossitis).",
        "Penicillamine B6 interaction: Chemically binds pyridoxal phosphate to form an inactive thiazolidine complex, causing secondary B6 deficiency."
    ),
    42: (
        "Isoniazid",
        4,
        "Criteria of Identification: Isoniazid (INH), a cornerstone antimycobacterial drug used for tuberculosis, forms inactive hydrazone complexes with pyridoxal phosphate and competitively inhibits pyridoxal kinase. Supplemental pyridoxine (vitamin B6) must be routinely co-prescribed with INH to prevent peripheral neuropathy.",
        "Drug-induced B6 deficiency: Isoniazid and penicillamine both bind and inactivate pyridoxal phosphate, necessitating B6 co-supplementation."
    ),
    43: (
        "It is the biologically active form of vitamin B6",
        4,
        "Criteria of Identification: Pyridoxal 5'-phosphate (PLP) is the coenzymatically active form of vitamin B6 that serves as a cofactor for over 140 metabolic reactions (including aminotransferases, decarboxylases, and heme synthesis). Circulating plasma PLP reflects total body stores and is the gold-standard biochemical marker of functional vitamin B6 status.",
        "Pyridoxal phosphate (PLP): The biologically active coenzyme form of vitamin B6; plasma PLP is the standard indicator of B6 nutritional status."
    ),
    44: (
        "Pyridoxine phosphate oxidase",
        4,
        "Criteria of Identification: In vitamin B6 salvage and activation pathways, dietary pyridoxine and pyridoxamine are first phosphorylated by pyridoxal kinase into PNP and PMP. Both PNP and PMP are subsequently converted to the active cofactor pyridoxal 5'-phosphate (PLP) by the FMN-dependent flavoprotein enzyme pyridoxine 5'-phosphate oxidase (PPOX).",
        "PPOX enzyme: Flavin-dependent pyridoxine phosphate oxidase catalyzes oxidation of PMP and PNP into active PLP."
    ),
    45: (
        "Pyridoxine",
        4,
        "Criteria of Identification: Dietary forms of vitamin B6 differ by source: plant foods (whole grains, legumes, vegetables) contain predominantly pyridoxine (and its glucoside conjugate pyridoxine-5'-beta-D-glucoside), whereas animal tissues (meat, poultry, fish) contain predominantly pyridoxal and pyridoxamine and their phosphorylated derivatives.",
        "Dietary vitamin B6 forms: Plants primarily provide pyridoxine; animal products provide pyridoxal and pyridoxamine."
    ),
    46: (
        "They should not be taken at the same time as penicillamine",
        4,
        "Criteria of Identification: Because D-penicillamine directly reacts with and chelates pyridoxine/pyridoxal in the gastrointestinal tract and blood to form an inactive thiazolidine complex, supplemental pyridoxine tablets must be taken at least 2 hours apart from the penicillamine dose to ensure optimal absorption and prevent mutual inactivation.",
        "Penicillamine administration timing: Pyridoxine supplements must be taken at least 2 hours apart from penicillamine to avoid in vivo chelation."
    ),
    47: (
        "1870 kcal/day, stable weight",
        4,
        "Criteria of Identification: Caloric intake calculation: Carbohydrate: 250 g * 4 kcal/g = 1000 kcal; Protein: 60 g * 4 kcal/g = 240 kcal; Fat: 70 g * 9 kcal/g = 630 kcal. Total Energy Intake = 1000 + 240 + 630 = 1870 kcal/day. For a 60 kg sedentary adult woman, total daily energy expenditure is approximately 30 kcal/kg/day = 1800 kcal/day. Because caloric intake closely matches expenditure, her weight will remain stable.",
        "Caloric calculation: CHO and protein yield 4 kcal/g, fat yields 9 kcal/g; 1870 kcal matches expenditure for a 60 kg sedentary female."
    ),
    48: (
        "Protein is below its AMDR lower limit",
        4,
        "Criteria of Identification: Energy calculation on a 2200 kcal/day diet: Protein = 50 g * 4 kcal/g = 200 kcal; (200 / 2200) * 100 = 9.1% of total calories. Acceptable Macronutrient Distribution Ranges (AMDR): Protein is 10% to 35% of total calories; Carbohydrates: 45% to 65%; Fat: 20% to 35%. Because protein accounts for only 9.1%, it falls below the minimum recommended AMDR floor (10%).",
        "AMDR standards: Protein 10–35%, Fat 20–35%, Carbohydrate 45–65%; 50g protein on 2200 kcal diet yields 9.1%, which is below the 10% AMDR threshold."
    ),
    49: (
        "3200 kcal/day",
        4,
        "Criteria of Identification: Daily caloric requirement for adults is estimated based on body weight and physical activity level: Sedentary: 30 kcal/kg/day; Moderately active: 35 kcal/kg/day; Very active / heavy physical labor: 40 kcal/kg/day. For an 80 kg very active male: 80 kg * 40 kcal/kg/day = 3200 kcal/day.",
        "Energy expenditure estimation: Very active individuals require approximately 40 kcal/kg/day; 80 kg * 40 = 3200 kcal/day."
    ),
    50: (
        "30.1 kg/m2, obese",
        4,
        "Criteria of Identification: Body Mass Index (BMI) = Weight (kg) / [Height (m)]^2 = 85 / (1.68)^2 = 85 / 2.8224 = 30.11 kg/m2. According to WHO classification: BMI < 18.5 is underweight, 18.5–24.9 is normal weight, 25.0–29.9 is overweight, and >= 30.0 kg/m2 is classified as Obese (Class I Obesity: 30.0–34.9 kg/m2).",
        "BMI classification: BMI = kg/m^2; >= 30.0 kg/m^2 constitutes clinical obesity (WHO Class I: 30.0–34.9 kg/m^2)."
    ),
    51: (
        "Android, since her WHR exceeds 0.8",
        4,
        "Criteria of Identification: Waist-to-Hip Ratio (WHR) = Waist circumference / Hip circumference = 84 cm / 100 cm = 0.84. In females, a WHR greater than 0.80 indicates central/upper-body visceral fat distribution (android or apple-shaped obesity), which carries heightened cardiovascular and metabolic disease risk.",
        "Waist-to-hip ratio in females: WHR > 0.80 indicates android (central/visceral) fat distribution with elevated cardiometabolic risk."
    ),
    52: (
        "Android, since his waist exceeds 94 cm",
        4,
        "Criteria of Identification: According to international cardiovascular and metabolic guidelines (IDF/WHO), abdominal obesity in men is defined by a waist circumference of >= 94 cm (or WHR >= 0.90), which indicates increased metabolic risk. A waist of 96 cm places this male in the android obesity risk category.",
        "Male abdominal obesity: Waist circumference >= 94 cm indicates android adipose accumulation and elevated metabolic risk."
    ),
    53: (
        "Resting energy expenditure",
        4,
        "Criteria of Identification: In a non-athlete adult, Resting Energy Expenditure (REE / Basal Metabolic Rate) accounts for the largest proportion of Total Energy Expenditure (TEE), contributing approximately 60% to 75%. Physical activity accounts for 15% to 30%, and the thermic effect of food contributes roughly 10%.",
        "Components of energy expenditure: REE/BMR is the largest component of TEE, accounting for 60–75% of total daily caloric expenditure."
    ),
    54: (
        "10%",
        4,
        "Criteria of Identification: The thermic effect of food (TEF), also known as diet-induced thermogenesis, represents the metabolic energy required for the digestion, absorption, transport, and assimilation of ingested nutrients. It accounts for approximately 10% of total daily energy expenditure on a balanced mixed diet.",
        "Thermic effect of food: Diet-induced thermogenesis represents approximately 10% of total daily energy expenditure."
    ),
    55: (
        "38 g/day",
        4,
        "Criteria of Identification: According to dietary reference intakes (Institute of Medicine / Dietary Guidelines), the Adequate Intake (AI) for total dietary fiber is 14 grams per 1,000 kcal consumed. For adult men aged 19–50 years, this corresponds to 38 grams per day (compared to 25 grams per day for adult women).",
        "Dietary fiber recommendations: Adequate intake is 38 g/day for adult men and 25 g/day for adult women (14 g/1000 kcal)."
    ),
    56: (
        "No significant link to metabolic syndrome",
        4,
        "Criteria of Identification: Gynoid (pear-shaped, gluteofemoral) obesity is characterized by subcutaneous adipose tissue accumulation in the hips, thighs, and buttocks. Subcutaneous adipose tissue possesses higher lipoprotein lipase activity and lower lipolytic rate, sequestering fatty acids safely and exhibiting no significant association with insulin resistance, atherogenic dyslipidemia, or metabolic syndrome compared to visceral android fat.",
        "Gynoid fat phenotype: Gluteofemoral subcutaneous fat does not confer high risk for metabolic syndrome or insulin resistance."
    ),
    57: (
        "Less than 1 g per day",
        4,
        "Criteria of Identification: Micronutrients (vitamins and trace minerals) are dietary compounds required by the human body in amounts of less than 1 gram per day (typically milligrams [mg] or micrograms [µg]), whereas macronutrients (carbohydrates, proteins, fats) are required in large quantities exceeding several grams to hundreds of grams per day.",
        "Micronutrient definition: Essential dietary compounds required in amounts < 1 gram/day (measured in mg or µg)."
    ),
    58: (
        "Penicillamine",
        4,
        "Criteria of Identification: The clinical presentation of a young adult (28yo) with signs of liver disease (mild jaundice), basal ganglia involvement (broad-based gait, flapping tremor/asterixis), and neuropsychiatric symptoms is classic for Wilson disease (hepatolenticular degeneration). First-line medical therapy to chelate accumulated toxic copper is D-penicillamine (or trientine).",
        "Wilson disease clinical vignette: Young adult with hepatic dysfunction and movement disorder; treated with copper chelator D-penicillamine."
    ),
    59: (
        "Low serum ceruloplasmin concentration",
        4,
        "Criteria of Identification: The clinical vignette describes a young woman with extrapyramidal movement disorders (gait disturbance, tremor, dysarthria), psychiatric features (flat affect), hepatosplenomegaly, family history of young cirrhosis, and a Kayser-Fleischer ring on eye photography (copper deposition in Descemet's membrane of the cornea). Diagnostic biochemical evaluation will reveal a characteristically low serum ceruloplasmin concentration (< 20 mg/dL).",
        "Kayser-Fleischer rings & Wilson disease: Pathognomonic corneal copper deposition accompanied by low serum ceruloplasmin (< 20 mg/dL)."
    ),
    60: (
        "Presence of stones within the gallbladder",
        3,
        "Criteria of Identification: The combination of jaundice, generalized pruritus (due to bile salt accumulation in skin), dark urine containing conjugated bilirubin, and low urinary urobilinogen indicates post-hepatic obstructive (cholestatic) jaundice. Gallstone obstruction of the extrahepatic biliary tree (choledocholithiasis) prevents conjugated bile from reaching the intestine, abolishing intestinal urobilinogen formation and shunting water-soluble direct bilirubin into the urine.",
        "Obstructive jaundice urinalysis: High urinary conjugated bilirubin with absent/low urinary urobilinogen and pruritus from retained bile salts."
    ),
    61: (
        "Impaired glucuronidation of bilirubin",
        3,
        "Criteria of Identification: Severe neonatal unconjugated hyperbilirubinemia (total bilirubin 38.1 mg/dL, direct 0.1 mg/dL) presenting in the first few days of life with lethal kernicterus (bilirubin encephalopathy with yellow pigmentation of the basal ganglia and subthalamic nuclei) is caused by severe inherited deficiency of bilirubin UDP-glucuronosyltransferase (UGT1A1), as seen in Crigler-Najjar syndrome Type I.",
        "Kernicterus & Crigler-Najjar: Absent UGT1A1 causes massive unconjugated hyperbilirubinemia crossing the blood-brain barrier into basal ganglia."
    ),
    62: (
        "Mechanical erythrocyte damage",
        3,
        "Criteria of Identification: Acute onset of jaundice and scleral icterus following surgical aortic valve replacement is caused by microangiopathic hemolytic anemia due to mechanical sheer stress and turbulence destroying erythrocytes across the prosthetic valve. Intravascular erythrocyte destruction releases excess heme, producing unconjugated hyperbilirubinemia.",
        "Prosthetic valve hemolysis: Mechanical erythrocyte fragmentation causes hemolytic jaundice with predominant unconjugated bilirubin."
    ),
    63: (
        "Isomerization of unconjugated bilirubin molecules",
        3,
        "Criteria of Identification: Phototherapy with blue-green light (wavelength 460–490 nm) acts by converting native, hydrophobic 4Z,15Z-bilirubin into water-soluble configurational isomers (4Z,15E-bilirubin) and structural isomers (lumirubin) via photoisomerization. These photoisomers are polar and can be readily excreted in bile and urine without requiring hepatic glucuronide conjugation.",
        "Phototherapy mechanism: Photoisomerization converts toxic hydrophobic unconjugated bilirubin into water-soluble lumirubin excreted without conjugation."
    ),
    64: (
        "Physiological neonatal jaundice",
        3,
        "Criteria of Identification: Mild to moderate jaundice appearing on days 2–5 of life in a healthy, thriving, full-term newborn who is gaining weight and feeding well is characteristic of physiological neonatal jaundice. It results from a combination of increased red cell turnover (fetal hemoglobin degradation), relative immaturity of hepatic UGT1A1 enzyme activity, and increased enterohepatic circulation of bilirubin.",
        "Physiological neonatal jaundice: Benign, self-limited unconjugated hyperbilirubinemia peaking on days 3–5 due to hepatic enzyme immaturity and RBC turnover."
    )
}

adjudicated_biochem = []
for idx, q in enumerate(raw_qs):
    rule = biochem_rules.get(idx)
    if not rule:
        print(f"Missing rule for index {idx}")
        continue
    target, topic_num, exp, concept = rule
    opts = q["options"]
    
    if target in opts:
        correct_idx = opts.index(target)
    else:
        # Match
        matched = False
        for o_i, o in enumerate(opts):
            if o.strip().lower() == target.strip().lower():
                correct_idx = o_i
                matched = True
                break
        if not matched:
            print(f"ERROR: target '{target}' not found in options {opts} for Q{idx+1}")
            correct_idx = 0
            
    q_obj = {
        "id": f"MGL3-PRAC-BIO-{idx+1:03d}",
        "type": "mcq",
        "lecture": topic_num,
        "text": q["title"].strip(),
        "options": opts,
        "correctIndex": correct_idx,
        "explanation": exp,
        "keyConcept": concept
    }
    adjudicated_biochem.append(q_obj)

print(f"Successfully adjudicated {len(adjudicated_biochem)} Biochemistry questions!")

with open("scripts/adjudicated_biochemistry.json", "w", encoding="utf-8") as f:
    json.dump(adjudicated_biochem, f, indent=2, ensure_ascii=False)
print("Saved scripts/adjudicated_biochemistry.json!")

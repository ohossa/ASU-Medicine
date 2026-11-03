# scripts/data_clinical.py
"""
ASU Medical Portal — GIT Practical Bank: Clinical & Pharmacology (Chapter 308)
Authentic practical stations covering:
- Lecture 1: Peptic Ulcer Disease & GERD (Stations 1–15)
- Lecture 2: Liver Cirrhosis, Viral Hepatitis & Portal Hypertension (Stations 16–30)
"""

def get_clinical_questions():
    questions = [
        # ── LECTURE 1: Peptic Ulcer Disease & GERD (Stations 1–15) ──────────────────
        {
            "id": "MGL3-CH308-CLIN-0001",
            "type": "mcq",
            "lecture": 1,
            "text": "A 52-year-old businessman presents with chronic retrosternal burning pain ('heartburn') and acid regurgitation occurring after meals and aggravated by recumbency. He regularly takes Aspirin for chronic arthritis and smokes 20 cigarettes daily. What is the clinical diagnosis and the primary pathophysiological risk factors?",
            "options": [
                "Gastroesophageal Reflux Disease (GERD) aggravated by Aspirin-induced mucosal injury and nicotine-induced reduction in LES resting tone",
                "Acute coronary syndrome due to unstable angina",
                "Diffuse esophageal motility spasm due to caffeine toxicity",
                "Zenker diverticulum complicated by bacterial aspiration"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Heartburn (pyrosis) and acid regurgitation aggravated by lying down or bending forward are the hallmark symptoms of GERD. Smoking decreases lower esophageal sphincter (LES) basal pressure through nicotine-mediated sympathetic/ganglionic effects, and Aspirin/NSAIDs cause direct mucosal epithelial injury and impair protective prostaglandin synthesis.",
            "keyConcept": "GERD presentation: Retrosternal burning after meals; exacerbated by smoking (decreases LES tone) and Aspirin/NSAIDs.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/case_presentation_gerd_pud.webp",
                "caption": "Station 1 — Clinical Case Vignette: Heartburn & Risk Factors"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0002",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this upper gastrointestinal endoscopic image in a patient with severe chronic GERD. Mucosal breaks extending across two mucosal folds in the distal esophagus are visible without circumferential involvement. According to the Los Angeles Classification of Erosive Esophagitis, what grade is this lesion?",
            "options": [
                "Grade B (One or more mucosal breaks > 5 mm that do not extend between the tops of two mucosal folds)",
                "Grade A (One or more mucosal breaks ≤ 5 mm)",
                "Grade C (Mucosal breaks continuous between the tops of ≥ 2 mucosal folds, involving < 75% of circumference)",
                "Grade D (Continuous mucosal breaks involving ≥ 75% of the esophageal circumference)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The Los Angeles (LA) Classification grades reflux esophagitis objectively: Grade A: Mucosal breaks ≤ 5 mm not extending between fold tops. Grade B: At least one mucosal break > 5 mm not extending between fold tops. Grade C: Mucosal breaks continuous between ≥ 2 mucosal folds involving < 75% circumference. Grade D: Mucosal breaks involving ≥ 75% circumference.",
            "keyConcept": "Los Angeles classification Grade B: Mucosal break > 5 mm without bridging between mucosal folds.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/gerd_erosive_esophagitis_endoscopy.webp",
                "caption": "Station 2 — Upper GI Endoscopy: Erosive Esophagitis"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0003",
            "type": "mcq",
            "lecture": 1,
            "text": "What classic difference in symptom timing relative to meals helps clinically differentiate a 'Gastric Ulcer' from a 'Duodenal Ulcer'?",
            "options": [
                "Gastric ulcer pain occurs immediately or within 30 minutes after food intake (causing food aversion and weight loss); Duodenal ulcer pain occurs 2–3 hours after meals or nocturnally and is relieved by food",
                "Gastric ulcer pain is relieved by food; duodenal ulcer pain worsens immediately upon eating",
                "Gastric ulcer pain radiates to the right iliac fossa; duodenal ulcer radiates exclusively to the left shoulder",
                "Duodenal ulcer never presents with pain and is entirely asymptomatic until perforation"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: In gastric ulcer, food ingestion stimulates gastric acid and pepsin secretion that directly washes over the ulcerated antral/body mucosa, precipitating epigastric burning pain within 15–30 minutes, leading to 'food fear' and weight loss. In duodenal ulcer, eating buffers duodenal acid and closes the pylorus, relieving pain; pain recurs 2–3 hours later when acid chyme empties into the duodenum ('hunger pain', often waking the patient at 2 AM).",
            "keyConcept": "Gastric ulcer pain worsens with food (weight loss); Duodenal ulcer pain is relieved by food (weight gain, nocturnal pain).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/endoscopy_gastric_vs_duodenal_ulcer.webp",
                "caption": "Station 3 — Peptic Ulcer Symptom Kinetics"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0004",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this erect plain chest/abdominal radiograph of a 45-year-old man who developed sudden-onset, agonizing epigastric pain that rapidly became generalized with a rigid, board-like abdomen. A crescent of lucency is seen beneath the right hemidiaphragm. Identify this emergency complication:",
            "options": [
                "Pneumoperitoneum (free air under the diaphragm) due to perforated anterior peptic ulcer",
                "Right-sided tension pneumothorax",
                "Subdiaphragmatic amebic liver abscess rupture",
                "Chilaiditi sign (colonic interposition between liver and diaphragm)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Perforation occurs typically in anterior wall duodenal or gastric ulcers (which lack adjacent solid organ tamponade). Acid chyme and gas spill into the peritoneal cavity, producing chemical peritonitis ('board-like abdominal rigidity'). An erect chest/abdominal X-ray shows pathognomonic crescentic subdiaphragmatic free air (pneumoperitoneum) in >75–85% of cases, mandating immediate surgical laparotomy.",
            "keyConcept": "Perforated peptic ulcer: Sudden board-like rigidity + crescent of free air under diaphragm on erect X-ray.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/perforated_peptic_ulcer_xray.webp",
                "caption": "Station 4 — Erect Abdominal X-Ray: Pneumoperitoneum"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0005",
            "type": "mcq",
            "lecture": 1,
            "text": "A patient with a deep chronic ulcer in the POSTERIOR wall of the duodenal bulb develops massive hematemesis and hemorrhagic shock. What major retroperitoneal artery has been eroded by the ulcer base?",
            "options": [
                "Gastroduodenal artery",
                "Left gastric artery",
                "Splenic artery",
                "Superior mesenteric artery"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The gastroduodenal artery descends directly behind the first part (bulb) of the duodenum. Posterior wall duodenal ulcers erode into the retroperitoneum, directly ulcerating the gastroduodenal artery and causing catastrophic arterial upper GI hemorrhage. In contrast, posterior lesser curvature gastric ulcers erode the left gastric artery.",
            "keyConcept": "Posterior duodenal ulcer hemorrhage: Erosion of the gastroduodenal artery.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/endoscopy_gastric_vs_duodenal_ulcer.webp",
                "caption": "Station 5 — Vascular Complications of Peptic Ulcers"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0006",
            "type": "mcq",
            "lecture": 1,
            "text": "A 60-year-old woman with a 20-year history of recurrent duodenal ulcers presents with progressive early satiety, postprandial fullness, and profuse non-bilious vomiting of food ingested 24 hours earlier. On exam, a succession splash is audible over the epigastrium. What complication has occurred?",
            "options": [
                "Gastric Outlet Obstruction (pyloric stenosis due to chronic cicatricial scarring)",
                "Acute paralytic ileus secondary to hypokalemia",
                "Achalasia with megaesophagus",
                "Superior mesenteric artery syndrome compressing the third duodenum"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Chronic recurrent peptic ulceration in the pyloric channel or duodenal bulb leads to extensive fibrosis and cicatricial contraction, producing mechanical Gastric Outlet Obstruction (GOO). The stomach dilates massively; vomiting is characteristically projectile, non-bilious (since obstruction is proximal to the ampulla of Vater), and contains undigested food eaten hours earlier.",
            "keyConcept": "Gastric Outlet Obstruction: Non-bilious projectile vomiting, succussion splash, hypochloremic alkalosis.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/pud_acid_suppression_algorithm.webp",
                "caption": "Station 6 — Chronic Cicatricial Pyloric Stenosis"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0007",
            "type": "mcq",
            "lecture": 1,
            "text": "What classic metabolic acid-base and electrolyte disturbance is produced by protracted vomiting of gastric secretions in gastric outlet obstruction?",
            "options": [
                "Hypochloremic, hypokalemic metabolic alkalosis with paradoxical aciduria",
                "High anion gap metabolic acidosis with hyperkalemia",
                "Normal anion gap hyperchloremic acidosis",
                "Pure respiratory alkalosis with hypocalcemia"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Prolonged vomiting of gastric juice causes loss of HCl, producing hypochloremia and metabolic alkalosis. Dehydration activates aldosterone, which conserves Na+ at the expense of K+ and H+ excretion in the renal collecting duct, leading to severe hypokalemia. In severe K+ depletion, kidneys excrete H+ instead of K+, producing 'paradoxical aciduria' in the face of systemic alkalosis.",
            "keyConcept": "Metabolic effect of vomiting: Hypochloremic, hypokalemic metabolic alkalosis with paradoxical aciduria.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/pud_acid_suppression_algorithm.webp",
                "caption": "Station 7 — Electrolyte & Acid-Base Derangements"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0008",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this 13C-Urea Breath Test (UBT) collection kit. How does this diagnostic modality detect active Helicobacter pylori colonization in the stomach?",
            "options": [
                "Bacterial urease cleaves ingested 13C-labeled urea into ammonia and 13CO2, which is absorbed into blood and exhaled in breath",
                "13C-urea is converted into radioactive methane by anaerobic colonic flora",
                "H. pylori antibodies in saliva precipitate the 13C isotope onto breath filter paper",
                "Gastric parietal cells oxidize 13C-urea in the presence of histamine"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The 13C-Urea Breath Test (UBT) exploits H. pylori's potent constitutive urease enzyme. The patient ingests non-radioactive 13C-labeled urea. If H. pylori is present, urease hydrolyzes it: 13C-urea + H2O -> 2 NH3 + 13CO2. The 13CO2 is absorbed into blood and exhaled; a mass spectrometer or infrared spectrophotometer measures the 13CO2/12CO2 ratio (>95% sensitivity and specificity).",
            "keyConcept": "13C-Urea Breath Test: Bacterial urease hydrolyzes 13C-urea into exhaled 13CO2.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/urea_breath_test_device.webp",
                "caption": "Station 8 — 13C-Urea Breath Test Collection Apparatus"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0009",
            "type": "mcq",
            "lecture": 1,
            "text": "Before undergoing a 13C-Urea Breath Test or Stool Antigen Test for H. pylori, what medications must be temporarily discontinued to prevent false-negative test results?",
            "options": [
                "Proton Pump Inhibitors (PPIs) stopped for at least 2 weeks; Antibiotics and Bismuth stopped for at least 4 weeks",
                "Aspirin stopped for 24 hours only",
                "Antacids stopped for 12 hours with continuation of high-dose PPI",
                "Oral rehydration salts stopped for 3 days"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: PPIs, bismuth compounds, and systemic antibiotics suppress H. pylori bacterial load and inhibit urease enzyme activity, shifting bacteria from helical to coccoid forms and leading to false-negative breath and stool antigen tests. Guidelines mandate withholding PPIs for ≥ 2 weeks and antibiotics/bismuth for ≥ 4 weeks prior to testing.",
            "keyConcept": "Pre-test precautions for H. pylori: Discontinue PPIs for 2 weeks and antibiotics/bismuth for 4 weeks.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/urea_breath_test_device.webp",
                "caption": "Station 9 — Medication Washout Period Guidelines"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0010",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the standard first-line 'Triple Therapy' regimen for the eradication of Helicobacter pylori in regions with low clarithromycin resistance (< 15%)?",
            "options": [
                "Proton Pump Inhibitor (PPI, standard dose twice daily) + Clarithromycin (500 mg twice daily) + Amoxicillin (1,000 mg twice daily) for 14 days",
                "PPI twice daily + Ciprofloxacin + Doxycycline for 5 days",
                "Famotidine + Metronidazole + Vancomycin for 7 days",
                "Omeprazole once daily + Ceftriaxone IV for 3 days"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The standard first-line triple therapy consists of a PPI (e.g., omeprazole 20 mg or esomeprazole 40 mg bid), Clarithromycin 500 mg bid, and Amoxicillin 1,000 mg bid (or Metronidazole 500 mg bid in penicillin-allergic patients) administered for a full 14-day course. The PPI raises intragastric pH, stabilizing antibiotics and promoting bacterial replication which enhances antibiotic killing.",
            "keyConcept": "First-line H. pylori triple therapy: PPI + Clarithromycin (500 mg bid) + Amoxicillin (1,000 mg bid) for 14 days.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/pud_acid_suppression_algorithm.webp",
                "caption": "Station 10 — H. pylori Eradication Regimen Algorithm"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0011",
            "type": "mcq",
            "lecture": 1,
            "text": "In areas with high clarithromycin resistance (≥ 15%) or in patients with previous macrolide exposure, what is the recommended alternative first-line eradication regimen?",
            "options": [
                "Bismuth Quadruple Therapy: PPI + Bismuth subsalicylate + Metronidazole + Tetracycline for 14 days",
                "Single-agent high-dose amoxicillin for 21 days",
                "Triple therapy replacing clarithromycin with erythromycin",
                "Oral vancomycin plus rifampin for 10 days"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Bismuth quadruple therapy achieves eradication rates >90% even against clarithromycin- and metronidazole-resistant strains. It comprises: 1) a PPI bid, 2) Bismuth subsalicylate/subcitrate 120–300 mg qid, 3) Metronidazole 500 mg tid/qid, and 4) Tetracycline hydrochloride 500 mg qid for 14 days.",
            "keyConcept": "Bismuth quadruple therapy: PPI + Bismuth + Metronidazole + Tetracycline for 14 days.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/pud_acid_suppression_algorithm.webp",
                "caption": "Station 11 — Bismuth Quadruple Eradication Protocol"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0012",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the pharmacological mechanism of action of Proton Pump Inhibitors (PPIs, e.g., Omeprazole) on gastric acid secretion?",
            "options": [
                "Prodrugs that concentrate in acidic parietal cell canaliculi, undergo protonation to active sulfenamide, and form an irreversible covalent disulfide bond with the H+/K+ ATPase",
                "Reversible competitive antagonists at histamine H2 receptors on the basolateral membrane",
                "Direct inhibitors of gastrin release from antral G cells",
                "Mucosal coating polymers that physically shield ulcers from pepsin"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: PPIs are substituted benzimidazoles. As lipophilic weak bases (pKa ~4.0), they selectively accumulate in the acidic secretory canaliculi of parietal cells (pH < 1.0). Acid catalyzes conversion into active cationic tetracyclic sulfenamides, which react covalently with cysteine-813 residues of the H+/K+ ATPase pump, irreversibly inactivating it until new enzyme is synthesized (24–36 hours).",
            "keyConcept": "PPI mechanism: Irreversible covalent disulfide binding to the H+/K+ ATPase proton pump.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/pud_acid_suppression_algorithm.webp",
                "caption": "Station 12 — Proton Pump Inhibitor Molecular Pharmacology"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0013",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the clinical role of Misoprostol (a synthetic prostaglandin E1 analogue) in the prevention of NSAID-induced peptic ulcer disease?",
            "options": [
                "Replaces protective endogenous mucosal prostaglandins inhibited by NSAID COX-1 blockade, stimulating mucus and bicarbonate secretion while inhibiting acid secretion",
                "Directly neutralizes gastric acid like calcium carbonate",
                "Forms an impenetrable cross-linked aluminum polymer over the ulcer crater",
                "Inhibits bacterial urease activity in Helicobacter pylori"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: NSAIDs cause peptic ulcers by non-selectively inhibiting cyclooxygenase-1 (COX-1), blocking mucosal synthesis of cytoprotective Prostaglandin E2 (PGE2) and PGI2. Misoprostol binds EP3 receptors on parietal cells to decrease cAMP and inhibit acid secretion, and stimulates surface mucous cells to increase mucus and bicarbonate secretion (mucosal cytoprotection).",
            "keyConcept": "Misoprostol: Synthetic PGE1 analogue that restores mucosal cytoprotection in chronic NSAID users.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/pud_acid_suppression_algorithm.webp",
                "caption": "Station 13 — Prostaglandin Analogues & Cytoprotection"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0014",
            "type": "mcq",
            "lecture": 1,
            "text": "Why must ALL patients diagnosed with a GASTRIC ulcer undergo follow-up endoscopy with repeat multiple biopsies 6 to 8 weeks after a course of medical therapy, whereas duodenal ulcers do not require routine surveillance?",
            "options": [
                "Up to 5% of benign-appearing gastric ulcers harbor underlying gastric adenocarcinoma; duodenal ulcers are virtually never malignant",
                "Gastric ulcers have a 100% recurrence rate within 30 days",
                "Duodenal ulcers heal spontaneously without pharmacological acid suppression",
                "Gastric ulcers are caused exclusively by cytomegalovirus infection"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Unlike duodenal ulcers (which are almost universally benign), approximately 4–7% of ulcerative lesions of the stomach that appear benign on initial endoscopy prove to be ulcerating gastric carcinomas (or gastric MALT lymphomas). Endoscopic reassessment with at least 6–8 quadrant biopsies is mandatory until complete histological and endoscopic healing is documented.",
            "keyConcept": "Gastric ulcers require repeat biopsy after 6–8 weeks to definitively rule out underlying malignancy.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/endoscopy_gastric_vs_duodenal_ulcer.webp",
                "caption": "Station 14 — Malignancy Surveillance in Gastric Ulcers"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0015",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the primary pharmacological advantage of Histamine H2-Receptor Antagonists (e.g., Famotidine) when prescribed as nocturnal therapy in refractory GERD?",
            "options": [
                "Suppresses nocturnal basal acid secretion, which is driven primarily by resting histamine release from ECL cells",
                "Irreversibly destroys the H+/K+ ATPase pump in overnight fasting state",
                "Promotes rapid gastric emptying of solid food during sleep",
                "Blocks cholinergic vagal firing during REM sleep"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Nocturnal acid breakthrough often occurs in patients on once-daily morning PPIs. Basal nocturnal acid secretion is predominantly mediated by tonic histamine release from enterochromaffin-like (ECL) cells acting on H2 receptors; hence, adding a bedtime dose of an H2RA (famotidine) potently suppresses nocturnal acid surges.",
            "keyConcept": "H2-receptor antagonists potently suppress nocturnal basal acid secretion.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/pud_acid_suppression_algorithm.webp",
                "caption": "Station 15 — Nocturnal Acid Secretion & H2 Blockers"
            }
        },

        # ── LECTURE 2: Cirrhosis, Hepatitis & Portal Hypertension (Stations 16–30) ───
        {
            "id": "MGL3-CH308-CLIN-0016",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this clinical photograph of a 56-year-old male with chronic hepatitis C cirrhosis showing vascular lesions on the chest featuring a central pulsating arteriole with radiating spider-like capillaries. Accompanied by palmar erythema and gynecomastia, what endocrine derangement produces these cutaneous signs?",
            "options": [
                "Hyperestrogenism due to decreased hepatic clearance of androstenedione and increased peripheral aromatization to estradiol",
                "Excess circulating cortisol due to secondary adrenal hyperplasia",
                "Marked growth hormone hypersecretion",
                "Severe hypothyroidism due to impaired deiodination of thyroxine"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Spider angiomas (vascular spiders), palmar erythema, gynecomastia, testicular atrophy, and loss of pubic/axillary hair are classical stigmata of chronic liver failure. Damaged hepatocytes fail to clear adrenal androgens (androstenedione), which are converted by peripheral adipose aromatase into estrogens; elevated circulating estradiol:testosterone ratio induces arteriolar dilatation and feminization.",
            "keyConcept": "Spider angiomas & gynecomastia in cirrhosis: Hyperestrogenism due to impaired hepatic clearance.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/stigmata_chronic_liver_disease.webp",
                "caption": "Station 16 — Cutaneous Stigmata of Chronic Liver Disease"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0017",
            "type": "mcq",
            "lecture": 1,
            "text": "What hemodynamic measurement defines Portal Hypertension, and what threshold of the Hepatic Venous Pressure Gradient (HVPG) defines 'Clinically Significant Portal Hypertension' (CSPH) predisposing to variceal hemorrhage?",
            "options": [
                "Portal hypertension: HVPG > 5 mmHg | Clinically significant: HVPG ≥ 10 mmHg",
                "Portal hypertension: HVPG > 2 mmHg | Clinically significant: HVPG ≥ 5 mmHg",
                "Portal hypertension: HVPG > 25 mmHg | Clinically significant: HVPG ≥ 50 mmHg",
                "Portal hypertension: HVPG > 1 mmHg | Clinically significant: HVPG ≥ 2 mmHg"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Normal portal pressure is 5–10 mmHg, and normal Hepatic Venous Pressure Gradient (HVPG = wedged hepatic venous pressure minus free hepatic venous pressure) is 1–5 mmHg. Portal hypertension is defined as HVPG > 5 mmHg. Clinically Significant Portal Hypertension (CSPH) is established when HVPG reaches ≥ 10 mmHg (the threshold for varices to form) and ≥ 12 mmHg (the threshold for acute variceal rupture).",
            "keyConcept": "Portal hypertension: HVPG > 5 mmHg; Clinically significant portal hypertension: HVPG ≥ 10 mmHg.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/portal_hypertension_collaterals.webp",
                "caption": "Station 17 — Hepatic Venous Pressure Gradient (HVPG)"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0018",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this upper endoscopy demonstrating large, tortuous bluish submucosal columns in the distal esophagus with 'cherry-red spots'. What portosystemic collateral anastomosis forms Esophageal Varices in portal hypertension?",
            "options": [
                "Left gastric (coronary) vein of the portal system anastomosing with esophageal tributaries of the Azygos / Hemiazygos systemic veins",
                "Superior rectal vein anastomosing with the inferior vena cava directly",
                "Paraumbilical veins anastomosing with deep femoral veins",
                "Splenic vein anastomosing with the left renal vein"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: In portal hypertension, retrograde blood flow redirects into portosystemic collateral channels. Esophageal varices form at the gastroesophageal junction where the Left Gastric (Coronary) Vein and short gastric veins (portal system) anastomose with the lower esophageal veins draining into the Azygos and hemiazygos veins (systemic superior vena cava system).",
            "keyConcept": "Esophageal varices: Left gastric vein (portal) anastomoses with Azygos vein (systemic).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/esophageal_varices_endoscopy.webp",
                "caption": "Station 18 — Upper GI Endoscopy: Bleeding Esophageal Varices"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0019",
            "type": "mcq",
            "lecture": 1,
            "text": "What anatomical portosystemic collateral vessel dilates to form the classical clinical sign of 'Caput Medusae' radiating from the umbilicus across the anterior abdominal wall?",
            "options": [
                "Recanalized Paraumbilical Veins (running in the falciform ligament) anastomosing with superficial and inferior epigastric systemic veins",
                "Superior mesenteric vein anastomosing with lumbar veins",
                "Splenic vein anastomosing with internal thoracic veins",
                "Hepatic veins anastomosing with intercostal veins"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The embryonic umbilical vein remnant runs in the falciform ligament and ligamentum teres. In severe portal hypertension, this vestigial channel recanalizes as the Paraumbilical Vein, shunting portal blood from the left portal branch outward to the umbilicus, where it anastomoses with the superficial epigastric veins (draining into the femoral vein and IVC), producing Caput Medusae.",
            "keyConcept": "Caput Medusae: Paraumbilical veins (portal) anastomosing with epigastric veins (systemic).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/portal_hypertension_collaterals.webp",
                "caption": "Station 19 — Portosystemic Collateral Pathways"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0020",
            "type": "mcq",
            "lecture": 1,
            "text": "A 58-year-old cirrhotic patient is rushed to the emergency department vomiting massive bright red blood with hypovolemic shock. Along with immediate airway management and blood transfusion, what vasoactive medication should be infused intravenously immediately before emergency endoscopy?",
            "options": [
                "Octreotide (somatostatin analogue) or Terlipressin (vasopressin analogue) to induce selective splanchnic vasoconstriction and lower portal pressure",
                "Intravenous Epinephrine infusion to increase systemic blood pressure",
                "Propranolol bolus via peripheral cannula",
                "High-dose intravenous Furosemide to prevent pulmonary edema"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: In acute variceal bleeding, immediate pharmacotherapy with splanchnic vasoconstrictors (Octreotide 50 μg IV bolus followed by 50 μg/hr infusion, or Terlipressin) must be initiated upon arrival. By selectively constricting mesenteric arterioles, they decrease splanchnic inflow, reducing portal venous pressure and variceal wall tension to facilitate endoscopic therapy.",
            "keyConcept": "Acute variceal bleed: Immediate IV Octreotide or Terlipressin induces splanchnic vasoconstriction.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/esophageal_varices_endoscopy.webp",
                "caption": "Station 20 — Emergency Variceal Resuscitation Protocol"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0021",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the endoscopic procedure of choice for definitive mechanical hemostasis of bleeding esophageal varices during urgent upper endoscopy?",
            "options": [
                "Endoscopic Variceal Ligation (EVL / Band Ligation)",
                "Barium coating injection into the submucosa",
                "Laser photocoagulation of the cardia",
                "Transjugular intrahepatic portosystemic shunt (TIPS) as first-line bedside therapy"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Endoscopic Variceal Ligation (EVL) using rubber elastic bands is the gold standard therapy for acute esophageal variceal hemorrhage (superior to sclerotherapy, with higher initial control rates, lower rebleeding rates, fewer complications, and lower mortality). Bands strangle the variceal columns, causing ischemic thrombosis and sloughing.",
            "keyConcept": "Endoscopic Variceal Ligation (EVL) is the primary endoscopic therapy for esophageal varices.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/esophageal_varices_endoscopy.webp",
                "caption": "Station 21 — Endoscopic Variceal Ligation (EVL)"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0022",
            "type": "mcq",
            "lecture": 1,
            "text": "Why is short-term prophylactic antibiotic therapy (e.g., IV Ceftriaxone 1 g daily for 7 days) mandatory for every cirrhotic patient presenting with acute upper gastrointestinal bleeding?",
            "options": [
                "Significantly reduces bacterial translocation, spontaneous bacterial peritonitis (SBP), early rebleeding rates, and overall hospital mortality",
                "Directly neutralizes gastric acid secretion in the stomach",
                "Prevents clostridial pseudomembranous colitis in the ICU",
                "Binds circulating bilirubin to prevent kernicterus"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Cirrhotic patients experiencing acute GI bleeding have profound immune dysfunction and bacterial translocation from the gut. Up to 20–30% develop systemic infections or Spontaneous Bacterial Peritonitis (SBP). Randomized trials prove that 7 days of IV Ceftriaxone (or oral ciprofloxacin) reduces bacteremia, prevents early variceal rebleeding, and improves 6-week survival.",
            "keyConcept": "Antibiotic prophylaxis (Ceftriaxone) in variceal bleeding reduces infection, rebleeding, and mortality.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/esophageal_varices_endoscopy.webp",
                "caption": "Station 22 — Antibiotic Prophylaxis in Cirrhotic Hemorrhage"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0023",
            "type": "mcq",
            "lecture": 1,
            "text": "What pharmacological class is standardly prescribed for SECONDARY prophylaxis to prevent recurrent variceal hemorrhage once the acute bleed has settled?",
            "options": [
                "Non-selective beta-adrenergic receptor blockers (e.g., Propranolol, Nadolol, or Carvedilol)",
                "Selective beta-1 blockers (e.g., Metoprolol)",
                "Calcium channel blockers (e.g., Amlodipine)",
                "Angiotensin-converting enzyme inhibitors (e.g., Enalapril)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Secondary prophylaxis combines repeated EVL sessions until variceal eradication with a Non-Selective Beta-Blocker (NSBB: propranolol, nadolol, or carvedilol). NSBBs act via dual mechanisms: 1) Beta-1 blockade reduces cardiac output, and 2) Beta-2 blockade leaves splanchnic alpha-1 receptors unopposed, producing vasoconstriction and reducing HVPG < 12 mmHg.",
            "keyConcept": "Secondary variceal prophylaxis: Non-selective beta-blockers (Propranolol/Carvedilol) + repeated EVL.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/portal_hypertension_collaterals.webp",
                "caption": "Station 23 — Hemodynamic Secondary Prophylaxis"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0024",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this chart illustrating the classical clinical phases of Acute Viral Hepatitis. What sequence of four phases characterizes typical symptomatic acute hepatitis?",
            "options": [
                "Incubation period -> Prodromal (pre-icteric) phase -> Icteric phase -> Convalescent phase",
                "Prodrome -> Fibrotic phase -> Cirrhotic phase -> Carcinomatous phase",
                "Viremia -> Renal shutdown -> Hepatic coma -> Recovery",
                "Asymptomatic latency -> Fulminant necrosis -> Encephalopathy -> Shock"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Acute viral hepatitis follows 4 distinct phases: 1) Incubation period (variable, 2–24 weeks); 2) Pre-icteric (prodromal) phase: constitutional flu-like symptoms, malaise, fatigue, anorexia, nausea, and classic aversion to smoking; 3) Icteric phase: appearance of dark tea-colored urine, pale stools, scleral icterus, and hepatomegaly with improving constitutional symptoms; 4) Convalescent phase: resolution of jaundice and normalization of liver enzymes.",
            "keyConcept": "Phases of acute viral hepatitis: Incubation -> Prodromal (pre-icteric) -> Icteric -> Convalescent.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/viral_hepatitis_phases_chart.webp",
                "caption": "Station 24 — Clinical Timeline of Acute Viral Hepatitis"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0025",
            "type": "mcq",
            "lecture": 1,
            "text": "Which viral hepatitis serological marker is the FIRST to appear in serum following acute Hepatitis B Virus (HBV) infection, serving as the definitive hallmark of active infection?",
            "options": [
                "Hepatitis B surface antigen (HBsAg)",
                "Antibody to Hepatitis B surface antigen (anti-HBs)",
                "Total antibody to Hepatitis B core antigen (anti-HBc IgG)",
                "Antibody to Hepatitis B e antigen (anti-HBe)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: HBsAg is the first detectable marker, appearing in serum 1 to 10 weeks after exposure (prior to symptom onset and ALT elevation). Persistence of HBsAg for > 6 months defines Chronic Hepatitis B infection. Its disappearance and seroconversion to anti-HBs indicates recovery and protective immunity.",
            "keyConcept": "First serological marker in acute HBV: Hepatitis B surface antigen (HBsAg).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/viral_hepatitis_phases_chart.webp",
                "caption": "Station 25 — Hepatitis B Viral Serology Dynamics"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0026",
            "type": "mcq",
            "lecture": 1,
            "text": "During the 'Window Period' of acute Hepatitis B infection (when HBsAg has disappeared but anti-HBs has not yet reached detectable levels), which serological marker is the ONLY reliable indicator of acute HBV infection?",
            "options": [
                "IgM antibody to Hepatitis B core antigen (IgM anti-HBc)",
                "Total anti-HBs IgG",
                "Hepatitis B e antibody (anti-HBe)",
                "Delta antigen (HDV RNA)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The 'window period' refers to the serological gap between the clearance of HBsAg and the appearance of protective anti-HBs antibodies. During this diagnostic window, IgM anti-HBc is the sole marker present in serum, making it essential for diagnosing recent acute HBV infection.",
            "keyConcept": "Window period of HBV: IgM anti-HBc is the only positive marker.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/viral_hepatitis_phases_chart.webp",
                "caption": "Station 26 — The Hepatitis B Window Period"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0027",
            "type": "mcq",
            "lecture": 1,
            "text": "What serological profile distinguishes an individual who has acquired protective immunity through vaccination against Hepatitis B from an individual who recovered from natural HBV infection?",
            "options": [
                "Vaccinated: Anti-HBs POSITIVE, but Anti-HBc NEGATIVE | Naturally recovered: Both Anti-HBs and Anti-HBc IgG POSITIVE",
                "Vaccinated: Anti-HBc positive only",
                "Naturally recovered: HBsAg positive forever",
                "Both vaccinated and naturally immune individuals show identical serological profiles"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The recombinant Hepatitis B vaccine contains purified HBsAg only; therefore, successfully vaccinated individuals develop isolated anti-HBs (>10 mIU/mL) and are negative for anti-HBc. In contrast, natural HBV infection exposes the immune system to the viral core, inducing lifelong anti-HBc IgG in addition to anti-HBs.",
            "keyConcept": "Vaccine immunity: Isolated Anti-HBs positive (Anti-HBc negative). Natural immunity: Both Anti-HBs and Anti-HBc positive.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/viral_hepatitis_phases_chart.webp",
                "caption": "Station 27 — Vaccine-Induced vs Natural Immunity Serology"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0028",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the primary route of transmission and clinical risk of chronicity for Hepatitis A Virus (HAV) versus Hepatitis C Virus (HCV)?",
            "options": [
                "HAV: Fecal-oral transmission, never causes chronic infection (0% chronic) | HCV: Parenteral/blood-borne transmission, causes chronic hepatitis in 75–85% of cases",
                "HAV: Blood-borne transmission, 90% chronic | HCV: Fecal-oral transmission, 0% chronic",
                "Both HAV and HCV are transmitted by droplets and cause 50% chronic cirrhosis",
                "HAV causes chronic carrier state in infants; HCV is self-limiting in adults"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Hepatitis A (Picornaviridae, non-enveloped RNA) spreads via the fecal-oral route through contaminated water/food; it is acute and self-limiting, never progressing to chronicity or cirrhosis. Hepatitis C (Flaviviridae, enveloped RNA) is transmitted parenterally (blood transfusion, IV drug use); >75–85% develop chronic infection, with 20–30% progressing to cirrhosis and HCC over 20–30 years.",
            "keyConcept": "HAV: Fecal-oral, 0% chronic; HCV: Parenteral/blood, 75–85% progress to chronic hepatitis and cirrhosis.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/viral_hepatitis_phases_chart.webp",
                "caption": "Station 28 — Viral Transmission Routes & Chronicity Potential"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0029",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the diagnosis and diagnostic paracentesis criterion for Spontaneous Bacterial Peritonitis (SBP) in a cirrhotic patient with ascites presenting with fever and abdominal pain?",
            "options": [
                "Ascitic fluid polymorphonuclear (PMN) absolute neutrophil count ≥ 250 cells/mm³ (0.25 × 10^9/L)",
                "Ascitic fluid total protein > 3.0 g/dL",
                "Ascitic fluid amylase > 1,000 U/L",
                "Ascitic fluid red blood cell count > 10,000 cells/mm³"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Spontaneous Bacterial Peritonitis (SBP) is an acute bacterial infection of pre-existing ascitic fluid without an apparent intra-abdominal source. Diagnostic paracentesis is mandatory; an absolute neutrophil count (ANC = Total WBC × % neutrophils) ≥ 250 PMNs/mm³ is diagnostic and warrants immediate empiric therapy with IV 3rd-generation cephalosporins (cefotaxime or ceftriaxone) plus IV albumin.",
            "keyConcept": "Spontaneous Bacterial Peritonitis (SBP) diagnostic criterion: Ascitic fluid PMN count ≥ 250 cells/mm³.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/case_presentation_gerd_pud.webp",
                "caption": "Station 29 — Paracentesis Criteria in Ascitic Infections"
            }
        },
        {
            "id": "MGL3-CH308-CLIN-0030",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the pathophysiology of Hepatorenal Syndrome (HRS) in end-stage cirrhosis, and what is the primary medical pharmacotherapy?",
            "options": [
                "Severe splanchnic arterial vasodilatation leads to extreme renal cortical vasoconstriction with normal renal histology; treated with Terlipressin + IV Albumin",
                "Direct immune complex glomerulonephritis treated with cyclophosphamide",
                "Renal amyloidosis treated with colchicine",
                "Acute tubular necrosis caused by loop diuretics responsive to saline bolus"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Hepatorenal syndrome (HRS) is functional pre-renal failure in decompensated cirrhosis. Marked portal hypertension causes nitric oxide release and severe splanchnic arterial vasodilatation. Effective arterial blood volume falls, triggering intense compensatory activation of the RAAS and sympathetic nervous system, producing extreme renal vasoconstriction. First-line therapy is Terlipressin (or norepinephrine) combined with intravenous Albumin.",
            "keyConcept": "Hepatorenal syndrome: Functional renal vasoconstriction secondary to splanchnic vasodilatation; treated with Terlipressin + Albumin.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/clinical/portal_hypertension_collaterals.webp",
                "caption": "Station 30 — Pathophysiology of Hepatorenal Syndrome"
            }
        }
    ]
    return questions

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
    return questions + NET_NEW_CLINICAL

# NET_NEW_CLINICAL for stations 31 to 55

NET_NEW_CLINICAL = [
    {
        "id": "MGL3-CH308-CLIN-0031",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this upper gastrointestinal endoscopy image showing prominent, tortuous, bluish submucosal columns protruding into the distal esophageal lumen. Identify these vascular lesions:",
        "options": [
            "Esophageal varices (Grade III)",
            "Gastric antral vascular ectasia (watermelon stomach)",
            "Esophageal hemangioma",
            "Barrett esophagus islands"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Esophageal varices appear on flexible endoscopy as dilated, tortuous, bluish longitudinal mucosal cords protruding into the lower third of the esophageal lumen, categorized by the Paquet or Baveno classification into Grade I (flatten with insufflation) up to Grade III/IV (large, confluent, occupying > 50% of the lumen).",
        "keyConcept": "Esophageal varices: dilated bluish serpentine submucosal portosystemic collateral veins in distal esophagus.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0031.webp",
            "caption": "Station 31 — Upper Endoscopy Grade III Esophageal Varices"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0032",
        "type": "mcq",
        "lecture": 1,
        "text": "A 52-year-old cirrhotic patient presents with massive hematemesis from ruptured esophageal varices. Following hemodynamic resuscitation, which pharmacological vasoconstrictor is administered immediately to reduce portal venous inflow prior to urgent endoscopic band ligation?",
        "options": [
            "Octreotide (somatostatin analog) or Terlipressin (vasopressin analog)",
            "Propranolol (non-selective beta blocker)",
            "Nitroglycerin sublingual spray",
            "Spironolactone oral diuretic"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: In acute variceal hemorrhage, vasoactive pharmacological therapy (IV octreotide or IV terlipressin) must be initiated immediately upon presentation. These drugs induce selective splanchnic vasoconstriction, reducing portal venous inflow, collateral flow, and variceal pressure. Prophylactic IV ceftriaxone is also mandated to prevent SBP. Note: Beta-blockers are strictly contraindicated during active acute bleeding.",
        "keyConcept": "Acute variceal bleed: IV Octreotide / Terlipressin + prophylactic IV Ceftriaxone, followed by urgent Endoscopic Band Ligation.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0032.webp",
            "caption": "Station 32 — Endoscopic Band Ligation (EBL) Procedure"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0033",
        "type": "mcq",
        "lecture": 1,
        "text": "According to the Los Angeles (LA) Endoscopic Classification of Gastroesophageal Reflux Disease (GERD), what defines LA Grade C esophagitis?",
        "options": [
            "Continuous mucosal breaks between the tops of two or more mucosal folds, involving less than 75% of the esophageal circumference",
            "One or more mucosal breaks <= 5 mm confined to mucosal folds",
            "One or more mucosal breaks > 5 mm without continuity between folds",
            "Continuous mucosal breaks involving >= 75% of the esophageal circumference"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The Los Angeles (LA) Classification grades reflux esophagitis objectively: Grade A: one or more mucosal breaks <= 5 mm, none exceeding mucosal folds; Grade B: at least one break > 5 mm, none confluent between folds; Grade C: continuous mucosal breaks spanning >= 2 mucosal folds, involving < 75% of circumference; Grade D: confluent breaks involving >= 75% of esophageal circumference.",
        "keyConcept": "LA Classification: Grade C = confluent mucosal breaks between folds involving < 75% of esophageal circumference.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0033.webp",
            "caption": "Station 33 — Los Angeles (LA) Classification of Erosive GERD"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0034",
        "type": "mcq",
        "lecture": 2,
        "text": "During emergency endoscopy for acute peptic ulcer bleeding, a bleeding vessel is observed spurting bright red arterial blood actively from the ulcer crater base. According to the Forrest Classification of ulcer hemorrhage, how is this categorized?",
        "options": [
            "Forrest Ia (Active spurting arterial hemorrhage; ~90% risk of rebleeding)",
            "Forrest Ib (Active oozing hemorrhage)",
            "Forrest IIa (Non-bleeding visible vessel)",
            "Forrest III (Clean ulcer base without stigmata)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The Forrest Classification stratifies peptic ulcer rebleeding risk: Forrest Ia: active arterial spurting (90% rebleeding risk); Forrest Ib: active oozing (50% risk); Forrest IIa: non-bleeding visible vessel (40–50% risk); Forrest IIb: adherent clot (25–30% risk); Forrest IIc: flat pigmented spot (< 10% risk); Forrest III: clean ulcer base (< 5% risk). Classes Ia, Ib, and IIa mandate immediate endoscopic hemostasis.",
        "keyConcept": "Forrest Classification: Forrest Ia = active arterial spurting hemorrhage requiring urgent endoscopic hemostasis.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0034.webp",
            "caption": "Station 34 — Forrest Classification Peptic Ulcer Hemorrhage"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0035",
        "type": "mcq",
        "lecture": 2,
        "text": "What is the evidence-based gold standard endoscopic therapy recommended for high-risk bleeding peptic ulcers (Forrest Ia, Ib, IIa) to minimize rebleeding and emergency surgery?",
        "options": [
            "Dual endoscopic therapy: combination of thermal contact coagulation or through-the-scope hemoclips PLUS submucosal dilute epinephrine injection",
            "Dilute epinephrine (1:10,000) injection monotherapy alone",
            "Oral sucralfate slurry with cold saline lavage",
            "Immediate angiographic embolization without endoscopy"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: International guidelines mandate dual endoscopic modality therapy for high-risk ulcer bleeding stigmata. Submucosal epinephrine (1:10,000) provides temporary local vasoconstriction and tamponade to improve visualization, but must always be paired with a second definitive hemostatic modality: either mechanical (through-the-scope hemoclips) or thermal coagulation (bipolar / heater probe). Epinephrine monotherapy is substandard and associated with high rebleeding rates.",
        "keyConcept": "Dual endoscopic therapy: Epinephrine injection PLUS thermal coagulation or mechanical hemoclips is mandatory.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0035.webp",
            "caption": "Station 35 — Dual Endoscopic Hemostasis (Hemoclip + Injection)"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0036",
        "type": "mcq",
        "lecture": 2,
        "text": "In regions with high clarithromycin resistance (> 15%, including Egypt and the Mediterranean), what is the international first-line 14-day regimen recommended for Helicobacter pylori eradication?",
        "options": [
            "Bismuth Quadruple Therapy: PPI (standard dose twice daily) + Bismuth subsalicylate + Metronidazole + Tetracycline for 14 days",
            "Standard Triple Therapy: PPI + Clarithromycin + Amoxicillin for 7 days",
            "Dual therapy: PPI + High-dose Ciprofloxacin for 5 days",
            "Metronidazole monotherapy for 10 days"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Due to widespread global clarithromycin resistance exceeding 15–20%, standard clarithromycin triple therapy has failed. The current first-line empirical regimen recommended by Maastricht VI and ACG consensus guidelines is 14-day Bismuth Quadruple Therapy: PPI twice daily + Bismuth subcitrate/subsalicylate (300 mg qds) + Metronidazole (500 mg tds) + Tetracycline HCl (500 mg qds), which achieves > 90% eradication regardless of clarithromycin resistance.",
        "keyConcept": "H. pylori 1st-line therapy: 14-day Bismuth Quadruple Therapy (PPI bid + Bismuth + Metronidazole + Tetracycline).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0036.webp",
            "caption": "Station 36 — 14-Day Bismuth Quadruple Eradication Protocol"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0037",
        "type": "mcq",
        "lecture": 2,
        "text": "When bismuth is unavailable, which 14-day non-bismuth quadruple (concomitant) regimen is recommended as an alternative first-line therapy for H. pylori eradication?",
        "options": [
            "PPI twice daily + Amoxicillin (1000 mg bid) + Clarithromycin (500 mg bid) + Metronidazole (500 mg bid) taken simultaneously for 14 days",
            "Sequential therapy: PPI + Amoxicillin for 5 days, then Clarithromycin + Metronidazole for 5 days",
            "PPI twice daily + Doxycycline + Levofloxacin for 7 days",
            "Rifabutin + Amoxicillin for 10 days"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: In areas where bismuth formulations are inaccessible, 14-day Concomitant (Non-Bismuth Quadruple) Therapy is the preferred alternative: a PPI (standard dose twice daily) plus three antibiotics taken concurrently: Amoxicillin (1,000 mg twice daily), Clarithromycin (500 mg twice daily), and Metronidazole/Tinidazole (500 mg twice daily) for a full 14 days.",
        "keyConcept": "Non-bismuth quadruple: PPI bid + Amoxicillin 1g bid + Clarithromycin 500mg bid + Metronidazole 500mg bid for 14 days.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0037.webp",
            "caption": "Station 37 — Non-Bismuth Concomitant Quadruple Therapy"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0038",
        "type": "mcq",
        "lecture": 2,
        "text": "Before performing a 13C-Urea Breath Test (UBT) or Stool Antigen Test for Helicobacter pylori, for how long must Proton Pump Inhibitors (PPIs) and antibiotics/bismuth compounds be withheld respectively to avoid false-negative results?",
        "options": [
            "Withhold PPIs for at least 2 weeks; withhold antibiotics and bismuth for at least 4 weeks",
            "Withhold PPIs for 24 hours; withhold antibiotics for 48 hours",
            "No medication restriction is necessary prior to breath testing",
            "Withhold PPIs for 6 months; withhold antibiotics for 1 year"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: PPIs suppress bacterial urease activity and induce morphological transformation of H. pylori into a dormant coccoid form, causing up to 40% false-negative urease tests; hence PPIs must be discontinued at least 2 weeks prior to testing. Antibiotics and bismuth have direct bactericidal effects that clear bacteria temporarily, necessitating a 4-week washout period before testing.",
        "keyConcept": "UBT preparation: discontinue PPIs for at least 2 weeks and antibiotics/bismuth for at least 4 weeks prior to testing.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0038.webp",
            "caption": "Station 38 — 13C-Urea Breath Test Patient Preparation Protocol"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0039",
        "type": "mcq",
        "lecture": 2,
        "text": "What non-invasive test is recommended by clinical guidelines to confirm successful eradication of Helicobacter pylori when performed at least 4 to 8 weeks after completion of antibiotic therapy?",
        "options": [
            "Monoclonal Stool Antigen Test (HpSA) or 13C-Urea Breath Test",
            "Serum anti-H. pylori IgG serology enzyme-linked immunosorbent assay",
            "Barium swallow double contrast meal",
            "Fecal occult blood test (FOBT)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Post-treatment confirmation of H. pylori cure requires tests that detect active, live bacteria: 13C-Urea Breath Test or monoclonal Stool Antigen Test (HpSA), performed at least 4 to 8 weeks after completing treatment. Serum IgG antibody serology cannot be used to assess cure because circulating IgG antibodies persist for months to years after successful microbial eradication.",
        "keyConcept": "Confirming eradication: UBT or monoclonal Stool Antigen at >= 4 weeks; serology CANNOT be used to prove cure.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0039.webp",
            "caption": "Station 39 — Monoclonal Stool Antigen (HpSA) Test"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0040",
        "type": "mcq",
        "lecture": 2,
        "text": "What is the precise molecular pharmacology mechanism of action of Proton Pump Inhibitors (e.g., Omeprazole, Esomeprazole)?",
        "options": [
            "Lipophilic weak bases that diffuse into parietal canaliculi, undergo acid-catalyzed activation to tetracyclic sulfenamides, and covalently bind cysteine residues of H+/K+ ATPase by disulfide bonds",
            "Reversible competitive antagonists at basolateral histamine H2 receptors",
            "Inactivation of parietal cell carbonic anhydrase II",
            "Direct chemical neutralization of luminal hydrochloric acid"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: PPIs are prodrugs: as lipophilic weak bases (pKa ~4.0), they concentrate in the acidic secretory canaliculi of parietal cells (pH < 1.0) where they are protonated and trap. Acid catalyzes conversion into active cationic sulfenamides, which form covalent disulfide (-S-S-) bonds with accessible cysteine residues (especially Cys813) of the active H+/K+ ATPase, irreversibly inactivating the proton pump.",
        "keyConcept": "PPI mechanism: prodrug concentrated in canaliculi; converted by acid to sulfenamide that covalently inactivates H+/K+ ATPase.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0040.webp",
            "caption": "Station 40 — Proton Pump Inhibitor Molecular Pharmacodynamics"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0041",
        "type": "mcq",
        "lecture": 2,
        "text": "How does the novel Potassium-Competitive Acid Blocker (P-CAB) Vonoprazan differ fundamentally from conventional Proton Pump Inhibitors in its inhibition of gastric acid secretion?",
        "options": [
            "It reversibly and competitively binds the K+-binding site of the H+/K+ ATPase without requiring acid-catalyzed activation, achieving faster and acid-independent inhibition",
            "It irreversibly alkylates the gastrin CCK-B receptor",
            "It requires enteric coating and meals for activation",
            "It acts exclusively on pancreatic ductal bicarbonate channels"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Vonoprazan is a Potassium-Competitive Acid Blocker (P-CAB). Unlike PPIs, Vonoprazan: 1) is acid-stable and does not require an acidic canalicular environment for conversion, 2) reversibly competes with K+ for the luminal binding site of H+/K+ ATPase, 3) exhibits a long dissociation half-life, and 4) provides rapid, potent, full-day acid inhibition from the very first dose without meal timing constraints.",
        "keyConcept": "P-CABs (Vonoprazan): reversible competitive binding at the K+ site of H+/K+ ATPase; acid-independent and rapid onset.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0041.webp",
            "caption": "Station 41 — Vonoprazan Potassium-Competitive Binding"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0042",
        "type": "mcq",
        "lecture": 2,
        "text": "Why do Histamine H2-Receptor Antagonists (e.g., Famotidine) exhibit rapid pharmacological tolerance (tachyphylaxis) after 7 to 14 days of continuous administration, limiting their long-term efficacy in GERD and PUD?",
        "options": [
            "Upregulation of parietal H2 receptors and enhanced vagal/gastrin-mediated acid secretion compensating for histamine blockade",
            "Irreversible hepatic clearance by cytochrome P450 enzymes",
            "Downregulation of mucosal somatostatin receptors in the antrum",
            "Direct mucosal desensitization to parietal proton pumps"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: H2 receptor antagonists competitively block H2 receptors, but continuous treatment causes tachyphylaxis within 1 to 2 weeks due to upregulation of parietal H2 receptors and compensatory increases in endogenous gastrin and vagal acetylcholine tone, which bypass H2 receptors via the CCK-B and M3 pathways to restore acid secretion.",
        "keyConcept": "H2RA tachyphylaxis: rapid tolerance within 7–14 days due to receptor upregulation and compensatory gastrin/vagal activation.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0042.webp",
            "caption": "Station 42 — H2RA Pharmacological Tolerance & Tachyphylaxis"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0043",
        "type": "mcq",
        "lecture": 2,
        "text": "A 58-year-old with severe osteoarthritis requires chronic NSAID therapy. Which prostaglandin E1 (PGE1) analog is specifically FDA-approved for prevention of NSAID-induced gastric ulcers, and what is its absolute contraindication in women of childbearing potential?",
        "options": [
            "Misoprostol; absolutely contraindicated in pregnancy due to potent abortifacient and uterotonic actions",
            "Sucralfate; contraindicated in renal failure",
            "Bismuth subsalicylate; contraindicated in peptic ulcer",
            "Lansoprazole; contraindicated in liver disease"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Misoprostol is a synthetic PGE1 analog that stimulates mucosal bicarbonate secretion, thickens the mucus gel layer, and maintains mucosal blood flow depleted by NSAID cyclooxygenase-1 inhibition. It is strictly contraindicated (Pregnancy Category X) in women of childbearing potential without verified contraception because it induces strong uterine smooth muscle contractions and cervical ripening, causing abortion.",
        "keyConcept": "Misoprostol: PGE1 analog for NSAID ulcer prophylaxis; strictly contraindicated in pregnancy due to abortifacient action.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0043.webp",
            "caption": "Station 43 — Misoprostol Prostaglandin E1 Cytoprotection"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0044",
        "type": "mcq",
        "lecture": 2,
        "text": "A diabetic patient with gastroparesis is treated with a prokinetic agent and develops acute dystonic reactions and parkinsonian tremors. Which drug caused these extrapyramidal symptoms by crossing the blood-brain barrier to block central D2 dopamine receptors?",
        "options": [
            "Metoclopramide",
            "Domperidone",
            "Erythromycin",
            "Prucalopride"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Metoclopramide acts as a dopamine D2 antagonist and 5-HT4 agonist. Because it readily crosses the blood-brain barrier, it blocks central D2 receptors in the basal ganglia, carrying substantial risk of extrapyramidal symptoms (acute dystonia, akathisia, parkinsonism) and irreversible tardive dyskinesia (Black Box Warning). Domperidone is a peripheral D2 antagonist that does not cross the BBB and does not cause EPS.",
        "keyConcept": "Metoclopramide: central D2 antagonist crossing BBB causing extrapyramidal symptoms and tardive dyskinesia.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0044.webp",
            "caption": "Station 44 — Metoclopramide Central D2 Extrapyramidal Toxicity"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0045",
        "type": "mcq",
        "lecture": 2,
        "text": "What is the primary pharmacological mechanism and receptor target of Ondansetron and Granisetron in preventing severe chemotherapy-induced nausea and vomiting (CINV)?",
        "options": [
            "Competitive antagonism of 5-HT3 serotonin receptors on peripheral vagal afferents and in the central Chemoreceptor Trigger Zone (CTZ)",
            "Dopamine D2 receptor blockade in the frontal cortex",
            "Histamine H1 receptor blockade in the vestibular nuclei",
            "Neurokinin-1 (NK-1) substance P receptor antagonism"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Chemotherapeutic agents trigger massive release of serotonin from enterochromaffin cells in the gut mucosa, which excites 5-HT3 receptors on vagal sensory afferents, transmitting emetic signals to the nucleus tractus solitarius and CTZ. Ondansetron competitively blocks peripheral and central 5-HT3 receptors, serving as first-line prophylaxis for CINV and postoperative vomiting.",
        "keyConcept": "Ondansetron: selective 5-HT3 receptor antagonist blocking peripheral vagal afferents and the central CTZ.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0045.webp",
            "caption": "Station 45 — Ondansetron 5-HT3 Antagonism Emetic Cascade"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0046",
        "type": "mcq",
        "lecture": 3,
        "text": "What is the guideline-recommended initial medical therapy for moderate, uncomplicated cirrhotic ascites?",
        "options": [
            "Dietary sodium restriction (< 2 g/day) combined with Spironolactone and Furosemide in a fixed 100 mg : 40 mg ratio",
            "High-dose Furosemide monotherapy (160 mg daily) without sodium restriction",
            "Immediate large-volume paracentesis without albumin",
            "Fluid restriction to 500 mL/day without diuretics"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: First-line medical therapy for cirrhotic ascites comprises: 1) moderate dietary sodium restriction (< 2,000 mg/day / 88 mmol/day), and 2) combined oral diuretics: Spironolactone (aldosterone antagonist, initial 100 mg/day) and Furosemide (loop diuretic, initial 40 mg/day). The 100:40 mg ratio maintains normokalemia and targets secondary hyperaldosteronism while promoting natriuresis.",
        "keyConcept": "Cirrhotic ascites: dietary sodium restriction (< 2 g/day) + Spironolactone and Furosemide in 100:40 mg ratio.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0046.webp",
            "caption": "Station 46 — Cirrhotic Ascites Diuretic Ratio & Sodium Restriction"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0047",
        "type": "mcq",
        "lecture": 3,
        "text": "Diagnostic paracentesis is performed on a patient with new-onset ascites. Laboratory analysis reveals: Serum Albumin = 3.4 g/dL and Ascitic Fluid Albumin = 1.8 g/dL. Calculate the Serum-Ascites Albumin Gradient (SAAG) and classify the etiology:",
        "options": [
            "SAAG = 1.6 g/dL; High-gradient (>= 1.1 g/dL) confirming Portal Hypertension",
            "SAAG = 0.53; Low-gradient indicating peritoneal carcinomatosis",
            "SAAG = 5.2 g/dL; indicates nephrotic syndrome",
            "SAAG = 1.8 g/dL; indicates tuberculous peritonitis"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The Serum-Ascites Albumin Gradient is calculated as: SAAG = Serum Albumin - Ascitic Albumin. Here: SAAG = 3.4 - 1.8 = 1.6 g/dL. A high SAAG (>= 1.1 g/dL) has 97% accuracy for diagnosing portal hypertension (cirrhosis, alcoholic hepatitis, Budd-Chiari, heart failure). A low SAAG (< 1.1 g/dL) indicates normal portal pressure with peritoneal disease (carcinomatosis, peritoneal TB, nephrotic syndrome, pancreatitis).",
        "keyConcept": "SAAG = Serum Albumin - Ascitic Albumin = 3.4 - 1.8 = 1.6 g/dL (>= 1.1 confirms Portal Hypertension).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0047.webp",
            "caption": "Station 47 — Serum-Ascites Albumin Gradient (SAAG) Nomogram"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0048",
        "type": "mcq",
        "lecture": 3,
        "text": "A cirrhotic patient presents with fever, abdominal tenderness, and altered mental status. Diagnostic paracentesis reveals an ascitic fluid absolute polymorphonuclear neutrophil (PMN) count of 380 cells/mm^3. What is the diagnosis and immediate empirical therapy?",
        "options": [
            "Spontaneous Bacterial Peritonitis (SBP); IV Cefotaxime (or Ceftriaxone) plus IV Albumin (1.5 g/kg on day 1, 1.0 g/kg on day 3)",
            "Secondary bacterial peritonitis; emergency laparotomy",
            "Tuberculous peritonitis; oral anti-TB therapy",
            "Malignant ascites; systemic chemotherapy"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Spontaneous Bacterial Peritonitis (SBP) is definitively established when ascitic fluid absolute PMN count is >= 250 cells/mm^3 (0.25 x 10^9/L) in the absence of an intra-abdominal surgically treatable source. Immediate empirical treatment is IV 3rd-generation cephalosporin (cefotaxime 2g q8h or ceftriaxone 2g q24h) plus IV albumin (1.5 g/kg within 6h, 1 g/kg on day 3) to prevent hepatorenal syndrome.",
        "keyConcept": "SBP: Ascitic PMN >= 250 cells/mm^3; treat with IV Cefotaxime/Ceftriaxone PLUS IV Albumin.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0048.webp",
            "caption": "Station 48 — Spontaneous Bacterial Peritonitis Diagnostic Criteria"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0049",
        "type": "mcq",
        "lecture": 3,
        "text": "A cirrhotic patient presents with confusion and flapping hand tremors (asterixis). What is the first-line oral pharmacological therapy used to lower circulating ammonia levels and treat Hepatic Encephalopathy?",
        "options": [
            "Lactulose (non-absorbable disaccharide) titrated to 2 to 3 soft stools per day, combined with Rifaximin",
            "Neomycin high-dose oral aminoglycoside",
            "Intravenous loop diuretics and fluid restriction",
            "Oral branched-chain amino acids monotherapy"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: First-line therapy for Hepatic Encephalopathy is oral Lactulose. Colonic bacteria ferment lactulose into lactic and acetic acids, dropping colonic pH and trapping diffusible ammonia (NH3) as non-absorbable ammonium ions (NH4+) to be excreted, while exerting an osmotic laxative effect (titrated to 2–3 soft bowel movements/day). The non-absorbable antibiotic Rifaximin (550 mg twice daily) is added as adjunctive therapy to suppress urease-producing gut flora.",
        "keyConcept": "Hepatic encephalopathy: Lactulose (traps NH3 as NH4+ in acidic colon) + Rifaximin is 1st-line therapy.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0049.webp",
            "caption": "Station 49 — Lactulose & Rifaximin Mechanism in Hepatic Encephalopathy"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0050",
        "type": "mcq",
        "lecture": 3,
        "text": "What is the primary pathophysiology and first-line medical pharmacological management of Hepatorenal Syndrome (HRS-AKI) in a patient with decompensated cirrhosis and refractory ascites?",
        "options": [
            "Profound splanchnic arterial vasodilation causing secondary renal vasoconstriction; treated with IV Terlipressin (or Norepinephrine) plus IV Albumin",
            "Glomerular immune complex deposition; treated with high-dose steroids",
            "Direct nephrotoxic tubular injury; treated with hemodialysis monotherapy",
            "Renal artery thrombosis; treated with catheter-directed thrombolysis"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Hepatorenal Syndrome is functional renal failure driven by severe portal hypertension and nitric oxide-mediated splanchnic arterial vasodilation, which pools blood and triggers extreme activation of RAAS and sympathetic systems, causing intense renal cortical vasoconstriction. First-line therapy combines a splanchnic vasoconstrictor (IV Terlipressin or IV Norepinephrine) with volume expansion (IV Albumin 1 g/kg/day) to restore renal perfusion pressure.",
        "keyConcept": "Hepatorenal syndrome: splanchnic vasodilation causing severe renal vasoconstriction; treat with IV Terlipressin + IV Albumin.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0050.webp",
            "caption": "Station 50 — Hepatorenal Syndrome Pathophysiology & Vasoconstrictor Therapy"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0051",
        "type": "mcq",
        "lecture": 3,
        "text": "Examine this contrast-enhanced abdominal CT scan from a 60-year-old presenting with acute left lower quadrant pain and fever. Findings reveal sigmoid colon diverticula with focal colonic wall thickening and prominent pericolic fat stranding without abscess. What is the diagnosis and outpatient antibiotic management?",
        "options": [
            "Acute uncomplicated sigmoid diverticulitis; Oral Ciprofloxacin plus Metronidazole (or Amoxicillin-Clavulanate)",
            "Obstructing colonic carcinoma; emergency Hartmann procedure",
            "Ischemic colitis; therapeutic anticoagulation with heparin",
            "Ulcerative colitis; oral 5-ASA mesalamine"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Acute diverticulitis presents with left lower quadrant pain ('left-sided appendicitis'), fever, and leukocytosis. Contrast abdominal CT is the diagnostic modality of choice, showing colonic diverticula, bowel wall thickening (> 4 mm), and pericolic fat stranding ('dirty fat'). Outpatient uncomplicated cases are treated with bowel rest and oral broad-spectrum coverage against coliforms and anaerobes (Ciprofloxacin + Metronidazole or Amoxicillin-Clavulanate).",
        "keyConcept": "Acute diverticulitis: CT shows wall thickening and pericolic fat stranding; treat with Ciprofloxacin + Metronidazole.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0051.webp",
            "caption": "Station 51 — Contrast CT Diagnosis of Acute Sigmoid Diverticulitis"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0052",
        "type": "mcq",
        "lecture": 3,
        "text": "Before initiating biological anti-TNF-alpha therapy (e.g., Infliximab, Adalimumab) in a patient with moderate-to-severe Crohn's disease, which mandatory infectious screenings must be performed to avoid fatal reactivation?",
        "options": [
            "Screening for Latent Tuberculosis (Tuberculin skin test / IGRA and chest radiograph) and Hepatitis B serology (HBsAg, anti-HBc)",
            "Screening for Clostridioides difficile stool toxin only",
            "Serum HIV viral load only",
            "No screening is required prior to monoclonal antibody infusion"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: TNF-alpha is crucial for maintaining granuloma integrity and containing intracellular pathogens. Anti-TNF therapy carries a high risk of lethal reactivation of latent tuberculosis (often disseminated or extrapulmonary) and fulminant hepatitis B reactivation. Guidelines mandate pre-treatment screening for latent TB (IGRA QuantiFERON gold or PPD plus chest X-ray) and hepatitis B serology (HBsAg, anti-HBc) prior to commencing anti-TNF agents.",
        "keyConcept": "Anti-TNF screening: mandatory Latent Tuberculosis (IGRA / PPD + CXR) and Hepatitis B serology before initiation.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0052.webp",
            "caption": "Station 52 — Pre-Biological Anti-TNF Screening Protocol"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0053",
        "type": "mcq",
        "lecture": 3,
        "text": "What is the unique mechanism of action of Vedolizumab in inflammatory bowel disease, and why is it devoid of the Progressive Multifocal Leukoencephalopathy (PML) risk associated with natalizumab?",
        "options": [
            "Humanized monoclonal antibody that selectively blocks alpha-4-beta-7 integrin on gut-homing T cells, preventing interaction with mucosal MAdCAM-1 without affecting CNS alpha-4-beta-1",
            "Soluble recombinant TNF receptor-Fc decoy protein that binds circulating TNF-alpha without entering the central nervous system",
            "Fully human IgG1 monoclonal antibody targeting the shared p40 subunit of interleukin-12 and interleukin-23 without CNS tropism",
            "Oral small-molecule Janus kinase (JAK) inhibitor selectively blocking intracellular ATP phosphorylation of JAK1 and JAK3"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Natalizumab non-selectively blocks both alpha-4-beta-1 (CNS homing via VCAM-1) and alpha-4-beta-7 (gut homing), predisposing to opportunistic JC virus reactivation and fatal PML in the brain. Vedolizumab is gut-selective: it targets only the alpha-4-beta-7 heterodimer, preventing leukocyte extravasation into the intestinal mucosa by blocking adhesion to MAdCAM-1 exclusively in gut endothelium, conferring no risk of CNS immunosuppression or PML.",
        "keyConcept": "Vedolizumab: gut-selective alpha-4-beta-7 integrin antagonist blocking MAdCAM-1 without CNS immunosuppression or PML risk.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0053.webp",
            "caption": "Station 53 — Vedolizumab Gut-Selective alpha4beta7-MAdCAM-1 Blockade"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0054",
        "type": "mcq",
        "lecture": 3,
        "text": "According to updated clinical practice guidelines, at what age should average-risk colorectal cancer screening begin, and what is the recommended screening interval for a normal colonoscopy?",
        "options": [
            "Age 45; repeat colonoscopy every 10 years if normal",
            "Age 50; repeat colonoscopy every 2 years",
            "Age 40; repeat colonoscopy every 5 years",
            "Age 60; repeat colonoscopy every 15 years"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The US Multi-Society Task Force (MSTF) and USPSTF guidelines recommend that colorectal cancer screening for average-risk individuals begin at age 45 (lowered from 50 due to rising young-onset incidence). If the screening colonoscopy is high-quality and completely normal, the standard recommended surveillance interval is 10 years.",
        "keyConcept": "Colorectal cancer screening: begins at age 45 for average-risk adults; repeat every 10 years if colonoscopy is normal.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0054.webp",
            "caption": "Station 54 — CRC Screening & Post-Polypectomy Surveillance Algorithm"
        }
    },
    {
        "id": "MGL3-CH308-CLIN-0055",
        "type": "mcq",
        "lecture": 3,
        "text": "A 68-year-old with coronary artery disease and atrial fibrillation develops sudden mild cramping left lower quadrant abdominal pain followed within 12 hours by dark maroon rectal bleeding. Flexible sigmoidoscopy reveals segmental mucosal erythema and ulceration sharply demarcated at the splenic flexure (Griffiths' point). Identify this condition:",
        "options": [
            "Colonic Ischemia (Ischemic Colitis)",
            "Acute diverticular bleeding",
            "Ulcerative colitis flare",
            "Arteriovenous malformation (Angiodysplasia)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Ischemic colitis typically presents in elderly patients with transient hypoperfusion as mild left-sided abdominal pain followed rapidly by bloody diarrhea. It characteristically affects 'watershed' vascular zones with tenuous collateral blood supply: Griffiths' point (splenic flexure, boundary between SMA and IMA) and Sudeck's point (rectosigmoid junction, boundary between IMA and hypogastric/internal iliac system).",
        "keyConcept": "Ischemic colitis: transient crampy pain followed by bloody diarrhea affecting watershed areas (splenic flexure / Griffiths' point).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/clinical/img_clin_0055.webp",
            "caption": "Station 55 — Ischemic Colitis Watershed Distribution & Endoscopy"
        }
    }
]


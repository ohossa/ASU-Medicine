# scripts/data_physiology.py
"""
ASU Medical Portal — GIT Practical Bank: Physiology (Chapter 305)
Authentic practical stations covering:
- Lecture 1: Lab 1 — Swallowing & Esophageal Motility (Stations 1–14)
- Lecture 2: Lab 2 — Gastric Motility, Secretions & Hepatobiliary Physiology (Stations 15–28)
- Lecture 3: Lab 3 — Intestinal Motility, Digestion & Absorption (Stations 29–40)
"""

def get_physiology_questions():
    questions = [
        # ── LECTURE 1: Lab 1 — Swallowing & Esophageal Motility (Stations 1–14) ─────
        {
            "id": "MGL3-CH305-PHYS-0001",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this barium swallow esophagogram of a 38-year-old woman presenting with progressive dysphagia to both solids and liquids and nocturnal regurgitation. There is massive esophageal dilatation with smooth, symmetric tapering at the gastroesophageal junction ('bird-beak sign'). Identify this motility disorder:",
            "options": [
                "Achalasia",
                "Esophageal adenocarcinoma of the lower third",
                "Diffuse esophageal spasm",
                "Scleroderma esophagus"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Achalasia is a primary esophageal motility disorder characterized by failure of the lower esophageal sphincter (LES) to relax upon swallowing and aperistalsis in the esophageal body. Barium swallow classically shows marked esophageal dilatation, loss of peristalsis, and smooth, beak-like tapering of the distal esophagus ('bird-beak' or 'pencil-tip' appearance).",
            "keyConcept": "Achalasia: Progressive dysphagia to solids and liquids + 'bird-beak' sign on barium swallow.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/barium_swallow_bird_beak.webp",
                "caption": "Station 1 — Barium Swallow Esophagogram"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0002",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the neuropathological lesion responsible for the failure of lower esophageal sphincter (LES) relaxation in Achalasia?",
            "options": [
                "Degeneration of inhibitory postganglionic myenteric (Auerbach's) neurons that synthesize Nitric Oxide (NO) and Vasoactive Intestinal Peptide (VIP)",
                "Loss of preganglionic parasympathetic motor fibers in the dorsal motor nucleus of the vagus",
                "Autoimmune destruction of somatic motor endplates in the upper striated esophagus",
                "Hypertrophy of submucosal (Meissner's) plexus secretomotor neurons"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Normal swallowing-induced LES relaxation is mediated by non-adrenergic, non-cholinergic (NANC) inhibitory neurons of the myenteric (Auerbach's) plexus releasing Nitric Oxide (NO) and VIP. In Achalasia, chronic inflammatory neurodegeneration selectively destroys these inhibitory neurons; unopposed cholinergic excitatory tone results in elevated resting LES pressure and complete failure of receptive relaxation.",
            "keyConcept": "Achalasia pathophysiology: Loss of myenteric inhibitory neurons releasing NO and VIP.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/esophageal_manometry_tracing.webp",
                "caption": "Station 2 — Neuromuscular Mechanism of Achalasia"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0003",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this high-resolution esophageal manometry tracing. What characteristic hemodynamic and pressure findings confirm the diagnosis of Achalasia?",
            "options": [
                "Elevated integrated relaxation pressure (IRP > 15 mmHg) with complete failure of LES relaxation and absent peristalsis (100% aperistalsis) in the tubular esophagus",
                "Hypotensive LES (< 10 mmHg) with normal propagated peristaltic wave progression",
                "High-amplitude repetitive multi-peaked contractions ('nutcracker esophagus')",
                "Normal LES relaxation with simultaneous non-peristaltic contractions in >20% of wet swallows"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: High-resolution manometry (HRM) using the Chicago Classification is the diagnostic gold standard for Achalasia. Diagnostic criteria require: 1) Incomplete swallowing-induced LES relaxation (elevated Integrated Relaxation Pressure, IRP > 15 mmHg), and 2) 100% failed or aperistaltic contractions in the esophageal body.",
            "keyConcept": "Manometry criteria for Achalasia: Elevated IRP (failure of LES relaxation) + complete aperistalsis.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/esophageal_manometry_tracing.webp",
                "caption": "Station 3 — High-Resolution Esophageal Manometry Tracing"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0004",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this barium swallow in a 72-year-old man presenting with dysphagia, halitosis (foul breath), and regurgitation of undigested food hours after eating. A large posterior pouch is visible at the pharyngoesophageal junction. Identify this entity:",
            "options": [
                "Zenker diverticulum (pharyngeal pouch through Killian's triangle)",
                "Traction diverticulum of the midthoracic esophagus",
                "Epiphrenic diverticulum above the diaphragm",
                "Esophageal web (Plummer-Vinson syndrome)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Zenker diverticulum is a false/pulsion diverticulum formed by herniation of mucosa and submucosa through Killian's triangle (a zone of anatomical weakness between the thyropharyngeus and cricopharyngeus muscles of the inferior constrictor). It is caused by uncoordinated relaxation and spasm of the cricopharyngeal sphincter (upper esophageal sphincter) during swallowing.",
            "keyConcept": "Zenker diverticulum: Mucosal herniation through Killian's triangle due to cricopharyngeal dysfunction.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/zenker_diverticulum_barium.webp",
                "caption": "Station 4 — Pharyngoesophageal Barium Examination"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0005",
            "type": "mcq",
            "lecture": 1,
            "text": "During the pharyngeal stage of swallowing, stimulation of epithelial tactile receptors (particularly around the tonsillar pillars) initiates the swallowing reflex. Where is the central coordinating swallowing center located?",
            "options": [
                "Medulla oblongata and lower pons (specifically nucleus tractus solitarius and nucleus ambiguus)",
                "Precentral motor gyrus of the frontal cerebral cortex",
                "Cerebellar vermis and dentate nucleus",
                "Subthalamic nucleus and substantia nigra"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The swallowing reflex is integrated involuntarily in the brainstem. Afferent sensory impulses travel via the glossopharyngeal (CN IX) and vagus (CN X) nerves to the Nucleus Tractus Solitarius (NTS). The swallowing center coordinates motor outputs via the Nucleus Ambiguus and cranial nerves V, IX, X, and XII to execute the rapid pharyngeal sequence.",
            "keyConcept": "Swallowing center location: Medulla oblongata (Nucleus Tractus Solitarius and Nucleus Ambiguus).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/swallowing_stages_coordination.webp",
                "caption": "Station 5 — Neuroanatomy of the Swallowing Reflex"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0006",
            "type": "mcq",
            "lecture": 1,
            "text": "Which protective physiological event does NOT occur during the pharyngeal stage of swallowing to prevent aspiration of food into the airway?",
            "options": [
                "Opening of the glottis and active inspiratory descent of the diaphragm",
                "Elevation of the soft palate to close the posterior choanae and prevent nasopharyngeal reflux",
                "Approximation of the vocal cords and anterior-superior elevation of the larynx",
                "Backward tilting of the epiglottis over the laryngeal inlet"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: During pharyngeal swallowing, the respiratory center in the medulla is temporarily inhibited (swallowing apnea). The airway is actively sealed by: 1) soft palate elevation closing the nasopharynx; 2) palatopharyngeal fold approximation; 3) true and false vocal cord adduction; and 4) laryngeal elevation pulling the epiglottis backward over the glottis. Airway opening or inspiration during swallowing would produce fatal aspiration.",
            "keyConcept": "Airway protection in swallowing: Vocal cords adduct, larynx elevates, respiration is inhibited (apnea).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/swallowing_stages_coordination.webp",
                "caption": "Station 6 — Pharyngeal Stage Protective Mechanisms"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0007",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the primary physiological distinction between 'Primary Peristalsis' and 'Secondary Peristalsis' in the esophagus?",
            "options": [
                "Primary peristalsis is triggered by the voluntary act of swallowing; secondary peristalsis is initiated locally by luminal distension from remaining food bolus or acid reflux",
                "Primary peristalsis occurs only in the striated muscle; secondary occurs only in smooth muscle",
                "Primary peristalsis moves retrograde toward the pharynx; secondary moves anterograde",
                "Primary peristalsis is mediated by sympathetic nerves; secondary by somatic spinal nerves"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Primary peristalsis is the coordinated aboral wave initiated by the pharyngeal phase of swallowing, coordinated by the medullary swallowing center. If the bolus lodges or is not cleared (or if acid refluxes from the stomach), local sensory mechanoreceptors in the esophageal wall trigger Secondary Peristalsis via intrinsic myenteric circuits without pharyngeal swallowing.",
            "keyConcept": "Primary peristalsis is initiated by swallowing; secondary peristalsis is triggered by local luminal distension.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/swallowing_stages_coordination.webp",
                "caption": "Station 7 — Primary vs Secondary Esophageal Peristalsis"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0008",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the predominant physiological mechanism responsible for pathological acid reflux in Gastroesophageal Reflux Disease (GERD)?",
            "options": [
                "Transient lower esophageal sphincter relaxations (tLESRs) that occur independently of swallowing",
                "Excessive basal resting tone of the lower esophageal sphincter (> 45 mmHg)",
                "Hypersecretion of alkaline saliva neutralizing esophageal motility",
                "Failure of the upper esophageal sphincter to close during expiration"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The primary pathophysiology of GERD in >70–80% of patients without anatomical hiatus hernia is frequent, prolonged Transient Lower Esophageal Sphincter Relaxations (tLESRs). These are vagally-mediated reflexes triggered by gastric fundic distension (normally enabling gas belching) that allow acid chyme to surge into the unprotected esophagus.",
            "keyConcept": "GERD pathophysiology: Inappropriate Transient LES Relaxations (tLESRs) independent of swallowing.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/gerd_ph_monitoring_tracing.webp",
                "caption": "Station 8 — Pathophysiology of Gastroesophageal Reflux"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0009",
            "type": "mcq",
            "lecture": 1,
            "text": "Examine this 24-hour ambulatory esophageal pH monitoring tracing. What diagnostic parameter defines pathological gastroesophageal acid reflux?",
            "options": [
                "Percentage of total time with esophageal pH < 4.0 exceeding 4.2% (or elevated DeMeester score > 14.7)",
                "Esophageal pH remaining strictly between 7.2 and 7.4 throughout sleep",
                "Transient rise in pH to > 8.0 following fatty meals",
                "Gastric luminal pH dropping below 1.5 during nocturnal fasting"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Ambulatory 24-hour catheter or wireless capsule pH monitoring is the gold standard for quantifying acid reflux. Normal esophageal mucosa is exposed to pH < 4.0 for <4% of a 24-hour period. Total acid exposure time (AET) > 6.0% (or DeMeester score > 14.72) definitively establishes pathological GERD.",
            "keyConcept": "Gold standard for GERD: Ambulatory pH monitoring demonstrating esophageal pH < 4.0 for >4–6% of time.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/gerd_ph_monitoring_tracing.webp",
                "caption": "Station 9 — 24-Hour Ambulatory Esophageal pH Monitoring"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0010",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the physiological role of the 'Phrenicoesophageal Ligament' and the crural diaphragm in maintaining the anti-reflux barrier at the gastroesophageal junction?",
            "options": [
                "Acts as an external extrinsic muscular sphincter ('pinchcock action') augmenting intrinsic LES pressure during coughing and inspiration",
                "Inhibits gastric acid secretion by releasing secretin into local capillaries",
                "Accelerates primary peristaltic wave velocity across the cardia",
                "Suppresses vagal afferent firing from gastric stretch receptors"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The functional anti-reflux barrier is a dual anatomical mechanism: 1) the intrinsic smooth muscle LES, and 2) the extrinsic crural diaphragm encircling the esophagus. During deep inspiration, coughing, or straining (which raise intra-abdominal pressure), contraction of the crural diaphragm pinches the esophagus closed, preventing retrograde reflux.",
            "keyConcept": "Crural diaphragm acts as an extrinsic 'pinchcock' sphincter augmenting the LES during inspiration.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/gerd_ph_monitoring_tracing.webp",
                "caption": "Station 10 — Anti-Reflux Barrier Anatomy & Physiology"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0011",
            "type": "mcq",
            "lecture": 1,
            "text": "Why does a sliding hiatus hernia exacerbate gastroesophageal reflux disease (GERD)?",
            "options": [
                "Displaces the LES into the negative-pressure thoracic cavity, dissociating it from the crural diaphragm and abolishing the intra-abdominal pressure barrier",
                "Directly stimulates gastrin secretion from herniated parietal cells",
                "Paralyzes the cricopharyngeal sphincter in the pharynx",
                "Prevents mucosal blood flow to the gastric fundus"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Normally, the distal 2–4 cm of the esophagus resides within the positive-pressure abdominal cavity, where intra-abdominal pressure compresses the lumen closed. In sliding hiatus hernia, the gastroesophageal junction slides into the negative-pressure thorax, eliminating intra-abdominal compression and crural alignment, predisposing to massive reflux.",
            "keyConcept": "Hiatus hernia displaces the LES into the thorax, abolishing the extrinsic abdominal pressure barrier.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/gerd_ph_monitoring_tracing.webp",
                "caption": "Station 11 — Hiatus Hernia & Reflux Mechanics"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0012",
            "type": "mcq",
            "lecture": 1,
            "text": "What is the primary physiological mechanism of 'Esophageal Clearance' of refluxed gastric acid?",
            "options": [
                "Secondary peristaltic waves strip bulk volume, followed by swallowing of alkaline bicarbonate-rich saliva which neutralizes residual acid",
                "Active mucosal proton pump reabsorption in the distal third",
                "Rapid arterial hyperemia that washes away hydrogen ions into systemic veins",
                "Reflex opening of the upper esophageal sphincter to vent acid into the mouth"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Acid clearance has two distinct components: 1) Volume clearance (mechanical): secondary peristalsis strips >90% of the refluxed volume back into the stomach; and 2) Chemical clearance: swallowed saliva containing bicarbonate (stimulated by the esophagosalivary reflex) neutralizes the remaining microscopic acid film, restoring luminal pH > 4.0.",
            "keyConcept": "Esophageal clearance: Secondary peristalsis removes volume; swallowed salivary bicarbonate neutralizes acid.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/swallowing_stages_coordination.webp",
                "caption": "Station 12 — Esophageal Acid Clearance Mechanics"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0013",
            "type": "mcq",
            "lecture": 1,
            "text": "What type of muscle comprises the upper one-third versus lower two-thirds of the human esophagus?",
            "options": [
                "Upper 1/3: Striated (skeletal) muscle | Lower 2/3: Smooth muscle (middle 1/3 is mixed)",
                "Entire esophagus is smooth muscle from pharynx to cardia",
                "Upper 1/3: Smooth muscle | Lower 2/3: Striated muscle",
                "Entire esophagus is striated skeletal muscle under voluntary control"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The muscularis externa of the esophagus exhibits a distinct anatomical gradient: the upper 5% to 33% consists entirely of striated (skeletal) muscle innervated by somatic vagal fibers; the middle third is a transition zone of mixed striated and smooth muscle; and the lower third consists purely of smooth muscle innervated by autonomic myenteric neurons.",
            "keyConcept": "Esophageal muscle: Upper 1/3 is striated (skeletal); lower 2/3 is smooth muscle.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/swallowing_stages_coordination.webp",
                "caption": "Station 13 — Muscularis Externa Zonal Distribution"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0014",
            "type": "mcq",
            "lecture": 1,
            "text": "In scleroderma (systemic sclerosis) involving the gastrointestinal tract, what classic manometric abnormality is observed in the distal esophagus?",
            "options": [
                "Severe hypotensive/incompetent LES (< 5 mmHg) with absent peristalsis in the distal smooth-muscle two-thirds ('lead-pipe' esophagus)",
                "Hypercontractile hypertensive LES with vigorous corkscrew contractions",
                "Isolated failure of upper esophageal sphincter opening",
                "Retrograde giant migrating contractions in the proximal striated segment"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Scleroderma esophagus results from smooth muscle atrophy and widespread fibrous replacement of the muscularis externa. Because smooth muscle is restricted to the distal two-thirds, manometry demonstrates severe LES hypotension (approaching 0 mmHg) and complete absent peristalsis in the distal smooth muscle, producing intractable, devastating GERD.",
            "keyConcept": "Scleroderma esophagus: Markedly hypotensive/absent LES + aperistalsis in distal smooth muscle.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/esophageal_manometry_tracing.webp",
                "caption": "Station 14 — Systemic Sclerosis Esophageal Manometry"
            }
        },

        # ── LECTURE 2: Lab 2 — Gastric Motility, Secretions & Liver (Stations 15–28) ─
        {
            "id": "MGL3-CH305-PHYS-0015",
            "type": "mcq",
            "lecture": 2,
            "text": "What is the physiological phenomenon of 'Receptive Relaxation' of the gastric fundus and corpus during ingestion of a meal?",
            "options": [
                "A vagovagal reflex mediated by nitric oxide and VIP that permits the proximal stomach to accommodate 1.5 L of food with minimal rise in intragastric pressure",
                "Sympathetic vasoconstriction that decreases gastric mucosal blood flow",
                "Antral tonic contraction that forces chyme into the duodenal bulb",
                "Pyloric sphincter relaxation triggered by duodenal secretin release"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Receptive relaxation (and adaptive relaxation) is a non-adrenergic non-cholinergic (NANC) vagovagal reflex. Swallowing and esophageal distension trigger vagal inhibitory fibers releasing NO and VIP to relax the smooth muscle of the gastric fundus and body, expanding volume up to 1.5 L with almost zero rise in intragastric pressure.",
            "keyConcept": "Receptive relaxation: Vagovagal reflex releasing NO/VIP allowing gastric volume expansion without pressure rise.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/gastric_emptying_curves.webp",
                "caption": "Station 15 — Gastric Reservoir Physiology"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0016",
            "type": "mcq",
            "lecture": 2,
            "text": "Where are the primary pacemaker cells that generate the basal electrical rhythm (slow waves at ~3 cycles per minute) of the stomach located?",
            "options": [
                "Interstitial Cells of Cajal (ICC) in the circular muscle layer of the greater curvature of the gastric body",
                "Enterochromaffin-like (ECL) cells in the mucosal crypts of the antrum",
                "Parietal cells in the gastric oxyntic glands of the fundus",
                "D cells situated in the submucosa of the pyloric canal"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The gastric electrical slow wave (Basal Electrical Rhythm, BER) originates in a pacemaker region located along the greater curvature in the mid-corpus. Interstitial Cells of Cajal (ICC) generate spontaneous cyclic depolarizations at a frequency of 3 cycles per minute, which conduct through gap junctions to antral smooth muscle.",
            "keyConcept": "Gastric slow waves: 3 cycles/min, generated by Interstitial Cells of Cajal in mid-corpus.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/gastric_emptying_curves.webp",
                "caption": "Station 16 — Gastric Pacemaker & Slow Wave Generation"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0017",
            "type": "mcq",
            "lecture": 2,
            "text": "Examine this chart of gastric emptying rates for different dietary components. What is the correct physiological ranking of macronutrient emptying velocity from fastest to slowest?",
            "options": [
                "Liquids > Carbohydrates > Proteins > Fats",
                "Fats > Proteins > Carbohydrates > Liquids",
                "Proteins > Liquids > Fats > Carbohydrates",
                "Carbohydrates > Fats > Liquids > Proteins"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Gastric emptying rate depends on physical state and macronutrient composition. Non-caloric liquids empty rapidly by first-order kinetics. Among solids, carbohydrates empty most rapidly, followed by proteins; lipids/fats empty slowest because fat in the duodenum triggers release of CCK and enterogastric reflexes that potently inhibit gastric motility.",
            "keyConcept": "Gastric emptying speed: Liquids > Carbohydrates > Proteins > Fats (slowest).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/gastric_emptying_curves.webp",
                "caption": "Station 17 — Gastric Emptying Kinetics of Macronutrients"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0018",
            "type": "mcq",
            "lecture": 2,
            "text": "Which duodenal enterogastrone hormone is the most potent physiological inhibitor of gastric emptying in response to luminal lipid and protein digestion products?",
            "options": [
                "Cholecystokinin (CCK) secreted by duodenal I cells",
                "Gastrin secreted by antral G cells",
                "Motilin secreted by upper small bowel M cells",
                "Histamine released by mucosal mast cells"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Fatty acids and monoglycerides entering the duodenal lumen stimulate enteroendocrine I cells to secrete Cholecystokinin (CCK). CCK binds CCK-1 receptors on vagal afferents, triggering a central enterogastric reflex that relaxes the proximal stomach and constricts the pyloric sphincter, potently slowing gastric emptying to allow adequate time for fat emulsification.",
            "keyConcept": "CCK is the most potent inhibitor of gastric emptying in response to duodenal fats/peptides.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/parietal_cell_acid_secretion.webp",
                "caption": "Station 18 — Enterogastrone Regulation of Emptying"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0019",
            "type": "mcq",
            "lecture": 2,
            "text": "Examine this diagram of the Gastric Parietal (Oxyntic) Cell. What apical membrane transporter is the final common pathway directly responsible for pumping hydrogen ions into the gastric lumen?",
            "options": [
                "H+/K+ ATPase pump (Proton pump)",
                "Na+/K+ ATPase pump",
                "Na+/H+ antiporter (NHE-1)",
                "Ca2+ ATPase pump of the endoplasmic reticulum"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The H+/K+ ATPase is an electrogenic P-type ion pump localized to the canalicular membrane of parietal cells. It pumps H+ against an astronomical concentration gradient (>1,000,000-fold) into the gastric lumen in exchange for K+ ions, representing the final molecular effector targeted by PPIs (omeprazole, esomeprazole).",
            "keyConcept": "Final common pathway of acid secretion: Apical H+/K+ ATPase proton pump.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/parietal_cell_acid_secretion.webp",
                "caption": "Station 19 — Parietal Cell Membrane Transport"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0020",
            "type": "mcq",
            "lecture": 2,
            "text": "What three physiological secretagogues stimulate gastric acid secretion, and what are their respective basolateral membrane receptors and second messenger pathways on the parietal cell?",
            "options": [
                "Histamine (H2 receptor -> cAMP) | Acetylcholine (M3 receptor -> IP3/Ca2+) | Gastrin (CCK-B receptor -> IP3/Ca2+)",
                "Histamine (H1 -> cGMP) | Secretin (S1 -> cAMP) | Gastrin (CCK-A -> Ca2+)",
                "Somatostatin (SST2 -> cAMP) | VIP (VPAC1 -> IP3) | Epinephrine (Beta2 -> cAMP)",
                "Dopamine (D2 -> cAMP) | Serotonin (5-HT3 -> IP3) | Glucagon (GCGR -> Ca2+)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Parietal cells possess 3 stimulatory receptors: 1) Histamine binds basolateral H2 receptors, activating adenylate cyclase to increase intracellular cyclic AMP (cAMP); 2) Acetylcholine (vagal postganglionic) binds M3 muscarinic receptors, activating PLC/IP3/DAG to raise intracellular Ca2+; and 3) Gastrin binds CCK-B (CCK-2) receptors, also acting via IP3/Ca2+. Synergism occurs between the cAMP and Ca2+ pathways.",
            "keyConcept": "Acid secretagogues: Histamine (H2/cAMP); Acetylcholine (M3/Ca2+); Gastrin (CCK-B/Ca2+).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/parietal_cell_acid_secretion.webp",
                "caption": "Station 20 — Second Messenger Cross-Talk in Parietal Cells"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0021",
            "type": "mcq",
            "lecture": 2,
            "text": "What is the physiological mechanism of 'Alkaline Tide' observed in systemic and renal venous blood following a meal?",
            "options": [
                "For every H+ ion pumped into the gastric lumen by the parietal cell, one bicarbonate (HCO3-) ion is extruded across the basolateral membrane into gastric venous capillaries via the Cl-/HCO3- exchanger",
                "Duodenal bicarbonate absorption exceeds secretin stimulation",
                "Pancreatic acini secrete protons into mesenteric lymphatics",
                "Hepatic deamination of amino acids generates ammonium ions"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Carbonic anhydrase in parietal cells hydrates CO2 to H2CO3, which dissociates into H+ and HCO3-. As H+ is pumped into the lumen, the generated HCO3- is transported across the basolateral membrane into the capillary blood via an anion exchanger (AE2, Cl-/HCO3- exchanger). This influx of bicarbonate temporarily raises gastric venous and urinary pH (postprandial alkaline tide).",
            "keyConcept": "Alkaline tide: Basolateral extrusion of HCO3- into gastric venous blood during active HCl secretion.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/parietal_cell_acid_secretion.webp",
                "caption": "Station 21 — Basolateral Ion Exchange & Alkaline Tide"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0022",
            "type": "mcq",
            "lecture": 2,
            "text": "What physiological negative feedback mechanism suppresses gastrin secretion from antral G cells when gastric luminal pH falls below 1.5–2.0?",
            "options": [
                "Luminal H+ directly stimulates mucosal D cells to release Somatostatin, which acts via paracrine SST2 receptors to shut off Gastrin secretion",
                "Low pH directly denatures gastrin receptors on G cells",
                "Vagal efferent stimulation of GRP (gastrin-releasing peptide) ceases",
                "Duodenal motilin travels via portal veins to destroy G cells"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Gastric acid secretion is auto-regulated by a powerful negative feedback loop. When intragastric pH drops below 2.0 (and especially <1.5), luminal protons contact the apical sensory processes of antral D cells, stimulating release of Somatostatin. Somatostatin acts locally in a paracrine fashion on G cells (and parietal/ECL cells) to potently arrest gastrin release.",
            "keyConcept": "Negative feedback of acid: Low luminal pH (<1.5) stimulates D cells to release Somatostatin, inhibiting Gastrin.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/parietal_cell_acid_secretion.webp",
                "caption": "Station 22 — Somatostatin Paracrine Negative Feedback"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0023",
            "type": "mcq",
            "lecture": 2,
            "text": "What is the primary stimulus that triggers the release of the hormone Secretin from S cells in the duodenal mucosa, and what is Secretin's primary physiological action?",
            "options": [
                "Stimulus: Duodenal luminal pH < 4.5 | Action: Stimulates copious watery, bicarbonate-rich secretion from pancreatic ductal cells and inhibits gastric acid secretion",
                "Stimulus: Peptic peptides | Action: Stimulates gallbladder contraction and bile flow",
                "Stimulus: Distension of duodenum | Action: Stimulates pepsinogen release from chief cells",
                "Stimulus: Hypoglycemia | Action: Stimulates hepatic glycogenolysis"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Secretin was the first hormone discovered (Bayliss and Starling, 1902). It is secreted by duodenal S cells in response to acidic chyme (pH < 4.5) entering from the stomach. Secretin acts on pancreatic ductal epithelial cells via cAMP to stimulate massive secretion of watery fluid rich in HCO3- (neutralizing gastric acid) and augments the action of CCK.",
            "keyConcept": "Secretin: Stimulated by duodenal acid (pH < 4.5); stimulates pancreatic ductal bicarbonate secretion.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/parietal_cell_acid_secretion.webp",
                "caption": "Station 23 — Secretin & Pancreatic Ductal Secretion"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0024",
            "type": "mcq",
            "lecture": 2,
            "text": "Examine this diagram of the neural pathways of Emesis (Vomiting). Where is the Chemoreceptor Trigger Zone (CTZ) anatomically situated, and why is it uniquely susceptible to circulating emetogenic drugs and toxins?",
            "options": [
                "Located in the Area Postrema at the floor of the 4th ventricle; it lacks a blood-brain barrier (BBB)",
                "Located within the hypoglossal motor nucleus protected by dense astrocyte footplates",
                "Located in the temporal lobe amygdala behind a fenestrated choroid plexus",
                "Located in the anterior hypothalamic paraventricular nucleus"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The Chemoreceptor Trigger Zone (CTZ) lies within the area postrema on the caudal floor of the fourth ventricle. As a circumventricular organ, it has fenestrated capillaries devoid of a blood-brain barrier (BBB), permitting direct detection of circulating blood-borne emetic agents (chemotherapeutics, uremic toxins, cardiac glycosides, apomorphine). It relays signals to the medullary vomiting center.",
            "keyConcept": "Chemoreceptor Trigger Zone (CTZ): Area postrema of 4th ventricle, lacks a blood-brain barrier.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/vomiting_reflex_pathway.webp",
                "caption": "Station 24 — Neuroanatomy of the Chemoreceptor Trigger Zone"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0025",
            "type": "mcq",
            "lecture": 2,
            "text": "Which neurochemical receptor antagonists are most therapeutically potent in blocking the Chemoreceptor Trigger Zone (CTZ) to prevent chemotherapy-induced and postoperative emesis?",
            "options": [
                "Serotonin 5-HT3 receptor antagonists (Ondansetron), Dopamine D2 antagonists (Metoclopramide), and NK1 antagonists (Aprepitant)",
                "Beta-2 adrenergic receptor blockers (Propranolol)",
                "Alpha-1 adrenergic agonists (Phenylephrine)",
                "GABA-B receptor agonists (Baclofen)"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The CTZ is enriched in dopamine D2 receptors, serotonin 5-HT3 receptors, and neurokinin-1 (substance P) NK1 receptors. Antagonists of these receptors—such as 5-HT3 blockers (ondansetron, granisetron), D2 blockers (metoclopramide, domperidone), and NK1 blockers (aprepitant)—are first-line antiemetics.",
            "keyConcept": "Antiemetic receptor targets: 5-HT3 antagonists (Ondansetron), D2 antagonists, and NK1 antagonists.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/vomiting_reflex_pathway.webp",
                "caption": "Station 25 — Pharmacology of Emetic Receptors"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0026",
            "type": "mcq",
            "lecture": 2,
            "text": "A patient with advanced liver cirrhosis and hepatic encephalopathy exhibits severe bleeding from venipuncture sites. Prothrombin time (PT) is prolonged and does not correct with parenteral Vitamin K. Which clotting factors are synthesized by the liver and deficient in this patient?",
            "options": [
                "Factors I (Fibrinogen), II (Prothrombin), V, VII, IX, X, and XI (all clotting factors except Factor VIII / vWF)",
                "Only Factor VIII and von Willebrand factor",
                "Exclusively tissue factor and Factor XII",
                "Platelet cyclooxygenase enzymes only"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Hepatocytes synthesize virtually all circulating coagulation factors (Factors I, II, V, VII, IX, X, XI, XII, XIII) as well as the natural anticoagulants Protein C, Protein S, and Antithrombin III. Factor VIII is synthesized primarily by sinusoidal endothelial cells (not hepatocytes). When >70–80% of hepatic parenchymal mass is destroyed, massive coagulopathy ensues.",
            "keyConcept": "The liver synthesizes all coagulation factors except Factor VIII (produced by endothelial cells).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/parietal_cell_acid_secretion.webp",
                "caption": "Station 26 — Hepatic Synthetic Capacity & Coagulation"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0027",
            "type": "mcq",
            "lecture": 2,
            "text": "Why do patients with chronic end-stage liver failure frequently develop secondary hyperparathyroidism, osteomalacia, and bone fractures?",
            "options": [
                "Impaired hepatic 25-hydroxylation of cholecalciferol (Vitamin D3) by microsomal 25-hydroxylase, reducing active 1,25-(OH)2-D3 synthesis",
                "Excessive renal tubular calcium excretion induced by ammonia",
                "Direct osteolytic destruction by elevated indirect bilirubin",
                "Hypoalbuminemia causing increased total serum calcium"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Vitamin D3 (from skin and diet) undergoes initial 25-hydroxylation in the liver by cytochrome P450 enzyme 25-hydroxylase to form 25-hydroxycholecalciferol [25(OH)D / calcidiol]. In severe hepatic failure, calcidiol synthesis fails, precluding subsequent renal 1α-hydroxylation into active calcitriol [1,25(OH)2D], producing hypocalcemia, osteomalacia, and hepatic osteodystrophy.",
            "keyConcept": "Liver disease osteomalacia: Impaired 25-hydroxylation of Vitamin D3 to 25(OH)D.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/iron_ferroportin_hepcidin.webp",
                "caption": "Station 27 — Hepatic Vitamin D Hydroxylation Pathway"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0028",
            "type": "mcq",
            "lecture": 2,
            "text": "Examine this diagram of the Enterohepatic Circulation of Bile Salts. What percentage of the bile salt pool is reabsorbed daily, and what specific anatomical segment of the bowel carries out this active reabsorption?",
            "options": [
                "95% of bile salts are actively reabsorbed in the terminal ileum via the apical sodium-dependent bile acid transporter (ASBT)",
                "50% are reabsorbed in the duodenum by passive non-ionic diffusion",
                "99% are reabsorbed in the descending colon by bacterial esterases",
                "10% are reabsorbed in the jejunum; 90% are excreted in feces"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The total bile salt pool is 2.5–4.0 grams, which recirculates 6 to 10 times daily. Approximately 95% of secreted bile salts are actively reabsorbed in the terminal ileum by the apical sodium-dependent bile acid transporter (ASBT / IBAT) and returned to the liver via portal blood. Only ~5% (0.2–0.6 g/day) escapes into the colon and is excreted in stool, matching daily hepatic de novo synthesis.",
            "keyConcept": "Enterohepatic circulation: 95% of bile salts are reabsorbed actively in the terminal ileum via ASBT.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/bile_salts_micelle_emulsification.webp",
                "caption": "Station 28 — Enterohepatic Circulation & ASBT Transporter"
            }
        },

        # ── LECTURE 3: Lab 3 — Intestinal Digestion, Absorption & Motility (29–40) ────
        {
            "id": "MGL3-CH305-PHYS-0029",
            "type": "mcq",
            "lecture": 3,
            "text": "Examine this diagram of Carbohydrate Absorption across the intestinal enterocyte brush border. How are D-glucose and D-galactose transported across the apical (luminal) membrane against their concentration gradients?",
            "options": [
                "Secondary active symport coupled with two Na+ ions via the SGLT-1 transporter",
                "Facilitated diffusion via the insulin-dependent GLUT-4 transporter",
                "Passive paracellular solvent drag through tight junctions",
                "Primary ATP-dependent active transport via an ABC cassette transporter"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Absorption of glucose and galactose across the apical brush border occurs via SGLT-1 (Sodium-Glucose Cotransporter 1). It is a secondary active symporter: the basolateral Na+/K+ ATPase creates a steep electrochemical sodium gradient that drives the simultaneous entry of 2 Na+ ions down their gradient together with 1 molecule of glucose or galactose against its gradient.",
            "keyConcept": "Glucose & galactose absorption: Apical SGLT-1 cotransporter coupled with Na+ ions.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/sglt1_glucose_absorption.webp",
                "caption": "Station 29 — Enterocyte SGLT-1 Active Transport"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0030",
            "type": "mcq",
            "lecture": 3,
            "text": "How does dietary D-fructose cross the apical enterocyte membrane, and which basolateral transporter mediates the exit of all three monosaccharides (glucose, galactose, fructose) into the portal capillary blood?",
            "options": [
                "Apical entry: GLUT-5 (facilitated diffusion) | Basolateral exit: GLUT-2 (facilitated diffusion)",
                "Apical entry: SGLT-1 | Basolateral exit: SGLT-2",
                "Apical entry: GLUT-4 | Basolateral exit: GLUT-1",
                "Apical entry: Pinocytosis | Basolateral exit: Exocytosis"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Fructose enters the enterocyte brush border independently of sodium via facilitated diffusion mediated by the GLUT-5 carrier. Once inside the cell, glucose, galactose, and fructose all exit across the basolateral membrane into the interstitial space down their concentration gradients via the common facilitative transporter GLUT-2.",
            "keyConcept": "Fructose apical entry = GLUT-5; Basolateral exit of all hexoses = GLUT-2.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/sglt1_glucose_absorption.webp",
                "caption": "Station 30 — Monosaccharide Transporters: GLUT-5 & GLUT-2"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0031",
            "type": "mcq",
            "lecture": 3,
            "text": "A 2-week-old neonate develops severe watery diarrhea, dehydration, and metabolic acidosis immediately after starting breast milk and infant formula containing glucose and galactose, but recovers completely when fed pure fructose. What congenital transport defect is established?",
            "options": [
                "Congenital Glucose-Galactose Malabsorption due to mutation in the SGLT-1 transporter",
                "Primary lactase deficiency (hypolactasia)",
                "Hereditary fructose intolerance due to aldolase B deficiency",
                "Cystic fibrosis with complete exocrine pancreatic insufficiency"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Congenital Glucose-Galactose Malabsorption is an autosomal recessive disorder caused by mutations in the SLC5A1 gene encoding the SGLT-1 transporter. Unabsorbed glucose and galactose remain in the lumen, exerting an osmotic force that draws water, producing massive osmotic diarrhea. Fructose uses GLUT-5 (not SGLT-1) and is normally absorbed, providing life-saving nutrition.",
            "keyConcept": "SGLT-1 mutation: Intractable diarrhea on glucose/galactose; tolerated on pure fructose diet.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/sglt1_glucose_absorption.webp",
                "caption": "Station 31 — SGLT-1 Genetic Malabsorption"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0032",
            "type": "mcq",
            "lecture": 3,
            "text": "What are the two defining pathophysiological features that clinically distinguish 'Osmotic Diarrhea' from 'Secretory Diarrhea'?",
            "options": [
                "Osmotic diarrhea stops upon fasting and has a high stool osmotic gap (> 100 mOsm/kg); Secretory diarrhea persists during fasting and has a low osmotic gap (< 50 mOsm/kg)",
                "Osmotic diarrhea always contains gross blood; secretory diarrhea is crystal clear",
                "Osmotic diarrhea is caused exclusively by Vibrio cholerae; secretory by lactase deficiency",
                "Osmotic diarrhea persists during fasting; secretory stops immediately upon fasting"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Diarrhea classification:\n1. Osmotic (e.g., lactase deficiency, SGLT-1 mutation, PEG): Ingestion of poorly absorbable solutes draws water into lumen. Ceases with fasting (NPO); Stool Osmotic Gap [290 - 2×(Na+K)] is high (>100 mOsm/kg).\n2. Secretory (e.g., Cholera, VIPoma): Active mucosal secretion of anions (Cl- via CFTR). Diarrhea persists unabated during fasting; Stool Osmotic Gap is low (<50 mOsm/kg).",
            "keyConcept": "Osmotic diarrhea stops with fasting (Gap >100); Secretory diarrhea persists with fasting (Gap <50).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/sglt1_glucose_absorption.webp",
                "caption": "Station 32 — Osmotic vs Secretory Diarrhea Differentiation"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0033",
            "type": "mcq",
            "lecture": 3,
            "text": "Calculation Station: A patient with chronic diarrhea has fecal electrolyte analysis performed:\n• Stool Sodium (Na+): 35 mmol/L\n• Stool Potassium (K+): 25 mmol/L\nCalculate the Stool Osmotic Gap (assuming normal stool osmolality = 290 mOsm/kg) and determine the type of diarrhea:",
            "options": [
                "Gap = 170 mOsm/kg — Osmotic Diarrhea (due to unabsorbed osmotic solutes)",
                "Gap = 20 mOsm/kg — Secretory Diarrhea",
                "Gap = 230 mOsm/kg — Factitious Diarrhea",
                "Gap = 50 mOsm/kg — Inflammatory Exudative Diarrhea"
            ],
            "correctIndex": 0,
            "explanation": "Calculation Steps:\nFormula: Stool Osmotic Gap = 290 - [2 × (Stool Na+ + Stool K+)]\n1. Sum of cations = 35 + 25 = 60 mmol/L\n2. 2 × (Na+ + K+) = 2 × 60 = 120 mOsm/kg\n3. Stool Osmotic Gap = 290 - 120 = 170 mOsm/kg.\nA gap > 100 mOsm/kg definitively identifies Osmotic Diarrhea (unmeasured non-electrolyte solutes such as malabsorbed carbohydrates or magnesium account for the missing osmolality).",
            "keyConcept": "Stool Osmotic Gap = 290 - 2(35+25) = 170 mOsm/kg (>100) = Osmotic Diarrhea.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/sglt1_glucose_absorption.webp",
                "caption": "Station 33 — Stool Osmotic Gap Calculation"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0034",
            "type": "mcq",
            "lecture": 3,
            "text": "Examine this diagram of Intestinal Iron Absorption. What enterocyte apical membrane transporter imports inorganic ferrous iron (Fe2+), and what basolateral transporter exports iron into the bloodstream?",
            "options": [
                "Apical transporter: Divalent Metal Transporter 1 (DMT1) | Basolateral exporter: Ferroportin",
                "Apical transporter: Ferroportin | Basolateral exporter: Transferrin",
                "Apical transporter: SGLT-1 | Basolateral exporter: Ceruloplasmin",
                "Apical transporter: Ferritin | Basolateral exporter: Hepcidin"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Luminal ferric iron (Fe3+) is reduced to ferrous iron (Fe2+) by apical ferric reductase (Dcytb). Fe2+ is imported into the enterocyte via Divalent Metal Transporter 1 (DMT1). Iron is stored as ferritin or exported across the basolateral membrane into the capillary blood by the sole mammalian iron exporter, Ferroportin, accompanied by hephaestin oxidation to Fe3+.",
            "keyConcept": "Iron absorption: Apical entry via DMT1; basolateral export via Ferroportin.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/iron_ferroportin_hepcidin.webp",
                "caption": "Station 34 — Enterocyte Iron Absorption Machinery"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0035",
            "type": "mcq",
            "lecture": 3,
            "text": "What is the physiological role of the hepatic peptide hormone Hepcidin in iron homeostasis, and what happens to iron absorption when Hepcidin levels are elevated?",
            "options": [
                "Hepcidin binds to basolateral Ferroportin, inducing its internalisation and lysosomal degradation, thereby blocking iron absorption and trapping iron in enterocytes and macrophages",
                "Hepcidin directly stimulates apical DMT1 transcription in enterocytes",
                "Hepcidin converts transferrin into soluble ferritin in plasma",
                "Hepcidin stimulates renal erythropoietin secretion"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Hepcidin is the master iron regulatory hormone synthesized by hepatocytes. When body iron stores are high or during systemic inflammation (IL-6), hepcidin secretion surges. Hepcidin binds to Ferroportin, causing it to be phosphorylated, internalized, and degraded in lysosomes. Without ferroportin, iron cannot leave enterocytes or macrophages, plummeting serum iron levels (pathogenesis of Anemia of Chronic Disease).",
            "keyConcept": "Hepcidin degrades Ferroportin, shutting off intestinal iron absorption and macrophage iron release.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/iron_ferroportin_hepcidin.webp",
                "caption": "Station 35 — Hepcidin Regulation of Ferroportin"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0036",
            "type": "mcq",
            "lecture": 3,
            "text": "Examine this diagram of Colonic Fermentation. Anaerobic colonic microbiota ferment unabsorbed complex dietary fibers and resistant starches into what principal Short-Chain Fatty Acids (SCFAs)?",
            "options": [
                "Acetate, Propionate, and Butyrate (which serves as the primary energy fuel for colonocytes)",
                "Palmitate, Stearate, and Oleate",
                "Lactate, Pyruvate, and Citrate",
                "Formate, Oxalate, and Succinate"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Anaerobic commensals in the cecum and colon ferment non-digestible carbohydrates into Short-Chain Fatty Acids (SCFAs): Acetate (60%), Propionate (20%), and Butyrate (20%). Butyrate is the preferred metabolic fuel for colonic epithelial cells (providing 60–70% of their energy needs), stimulates mucosal sodium/water absorption, and exerts anti-inflammatory trophic effects.",
            "keyConcept": "Colonic fermentation yields SCFAs (Acetate, Propionate, Butyrate); Butyrate fuels colonocytes.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/colonic_scfa_fermentation.webp",
                "caption": "Station 36 — Colonic SCFA Generation & Metabolism"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0037",
            "type": "mcq",
            "lecture": 3,
            "text": "What is the primary neuroanatomical defect in congenital Hirschsprung Disease (Congenital Aganglionic Megacolon)?",
            "options": [
                "Failure of neural crest cells to migrate craniocaudally into the distal bowel, resulting in complete absence of both myenteric (Auerbach's) and submucosal (Meissner's) parasympathetic ganglion cells",
                "Absence of striated somatic innervation to the external anal sphincter",
                "Degeneration of dorsal motor nucleus vagal nuclei in the medulla",
                "Hypertrophy of sympathetic preganglionic fibers in the mesenteric plexuses"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Hirschsprung disease is caused by arrested craniocaudal migration of vagal neural crest cells between weeks 5 and 12 of gestation. The affected distal segment (invariably involving the internal anal sphincter and rectosigmoid) lacks both myenteric (Auerbach's) and submucosal (Meissner's) ganglion cells, resulting in tonic spasm of the aganglionic segment and massive secondary proximal megacolon.",
            "keyConcept": "Hirschsprung disease: Absence of myenteric and submucosal ganglion cells in distal bowel.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/colonic_scfa_fermentation.webp",
                "caption": "Station 37 — Aganglionic Megacolon Pathophysiology"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0038",
            "type": "mcq",
            "lecture": 3,
            "text": "In Hirschsprung disease, which physiological reflex that normally coordinates the defecation sequence is characteristically ABSENT on anorectal manometry?",
            "options": [
                "Rectosphincteric (Rectoanal Inhibitory) Reflex (RAIR) — relaxation of the internal anal sphincter in response to rectal balloon distension",
                "Gastrocolic reflex following a morning meal",
                "Cough-induced contraction of the puborectalis muscle",
                "Vagovagal receptive relaxation of the transverse colon"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The Rectoanal Inhibitory Reflex (RAIR) is an involuntary myenteric reflex: transient balloon distension of the rectum induces immediate reflex relaxation of the internal anal sphincter (IAS) to allow sensory sampling of rectal contents. In Hirschsprung disease, absence of intrinsic inhibitory ganglion cells prevents IAS relaxation; the reflex is definitively absent on manometry.",
            "keyConcept": "Hirschsprung diagnostic sign: Absence of the Rectoanal Inhibitory Reflex (RAIR).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/colonic_scfa_fermentation.webp",
                "caption": "Station 38 — Anorectal Manometry & RAIR"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0039",
            "type": "mcq",
            "lecture": 3,
            "text": "What type of muscle and neurochemical control governs the Internal Anal Sphincter (IAS) versus External Anal Sphincter (EAS)?",
            "options": [
                "Internal sphincter: Smooth muscle (involuntary, sympathetic contraction / parasympathetic relaxation) | External sphincter: Striated muscle (voluntary, pudendal nerve CN S2–S4)",
                "Internal sphincter: Striated muscle (voluntary) | External sphincter: Smooth muscle (involuntary)",
                "Both internal and external sphincters are smooth muscle under vagal control",
                "Both sphincters are striated muscle innervated by the femoral nerve"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: Continence relies on dual sphincteric anatomy: 1) The Internal Anal Sphincter (IAS) is a thickening of circular smooth muscle (involuntary); sympathetic hypogastric fibers maintain resting tonic contraction (80% of resting pressure), while parasympathetic pelvic splanchnic fibers (via NO) induce relaxation. 2) The External Anal Sphincter (EAS) is striated skeletal muscle innervated by the somatic pudendal nerve (S2–S4), allowing voluntary squeeze.",
            "keyConcept": "Internal anal sphincter = involuntary smooth muscle; External anal sphincter = voluntary striated muscle (pudendal nerve).",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/colonic_scfa_fermentation.webp",
                "caption": "Station 39 — Anal Sphincter Dual Innervation"
            }
        },
        {
            "id": "MGL3-CH305-PHYS-0040",
            "type": "mcq",
            "lecture": 3,
            "text": "What is the 'Gastrocolic Reflex', and what physiological mediators coordinate mass peristaltic movements in the colon following ingestion of a meal?",
            "options": [
                "Gastric distension and caloric entry stimulate mass propulsive colonic contractions, mediated by vagovagal neural pathways and release of Gastrin and CCK",
                "Colonic distension that causes reflex relaxation of the pylorus",
                "Duodenal acidification that induces retroperistalsis in the ileum",
                "Sympathetic discharge that halts all colonic haustrations"
            ],
            "correctIndex": 0,
            "explanation": "Criteria of Identification: The gastrocolic reflex is a physiological postprandial reflex wherein gastric filling and duodenal nutrient absorption trigger vigorous mass movements in the transverse and descending colon, propelling fecal material into the rectum and prompting the urge to defecate. It is coordinated by autonomic parasympathetic circuits and amplified by gastrointestinal hormones (gastrin and CCK).",
            "keyConcept": "Gastrocolic reflex: Gastric distension triggers mass colonic peristalsis mediated by vagus, gastrin, and CCK.",
            "media": {
                "type": "image",
                "imageUrl": "/images/practical/mgl-3/physiology/colonic_scfa_fermentation.webp",
                "caption": "Station 40 — Postprandial Gastrocolic Propulsive Reflex"
            }
        }
    ]
    return questions

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
                "Extrusion of bicarbonate (HCO3-) across the basolateral membrane of parietal cells into gastric venous blood via Cl-/HCO3- exchange during active H+ secretion",
                "Massive absorption of sodium bicarbonate across duodenal villi into superior mesenteric venous blood following secretin stimulation",
                "Extrusion of hydrogen ions across basolateral membranes of pancreatic ductal cells into portal venous tributaries",
                "Hepatic deamination of amino acids generating excess ammonium and bicarbonate ions into hepatic sinusoidal blood"
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
    return questions + NET_NEW_PHYSIOLOGY

# NET_NEW_PHYSIOLOGY for stations 41 to 65

NET_NEW_PHYSIOLOGY = [
    {
        "id": "MGL3-CH305-PHYS-0041",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this high-resolution esophageal manometry (HRM) pressure topography plot. The integrated relaxation pressure (IRP) is elevated at 26 mmHg (normal < 15 mmHg), 100% of swallows demonstrate absent peristalsis, and there is no pan-esophageal pressurization. According to the Chicago Classification v4.0, identify this specific subtype:",
        "options": [
            "Type I Achalasia (Classic Achalasia)",
            "Type II Achalasia (with compression)",
            "Type III Achalasia (Spastic)",
            "Distal Esophageal Spasm"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: According to the Chicago Classification v4.0, Type I (classic) Achalasia is defined by: 1) elevated median integrated relaxation pressure (IRP > 15 mmHg), 2) 100% failed peristalsis in the esophageal body, and 3) no esophageal pressurization (pan-esophageal pressurization in < 20% of swallows).",
        "keyConcept": "Type I Achalasia: elevated IRP (> 15 mmHg) + 100% failed peristalsis with negligible esophageal pressurization.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0041.webp",
            "caption": "Station 41 — Type I Classic Achalasia HRM Topography"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0042",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this high-resolution manometry tracing displaying an elevated median IRP of 28 mmHg, 100% aperistalsis, and uniform isobaric pan-esophageal pressurization extending from the UES to LES in > 20% of swallows. Identify this subtype, known for the highest clinical response rate to pneumatic balloon dilatation or POEM:",
        "options": [
            "Type II Achalasia (Pan-esophageal pressurization)",
            "Type I Achalasia",
            "Type III Achalasia",
            "Hypercontractile (Jackhammer) esophagus"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Type II Achalasia is defined by elevated IRP (> 15 mmHg), 100% failed peristalsis, and rapid pan-esophageal pressurization (> 30 mmHg) spanning the entire tubular esophagus in $>= 20%$ of swallows. It carries the most favorable prognosis and best therapeutic response to endoscopic or surgical myotomy.",
        "keyConcept": "Type II Achalasia: elevated IRP + 100% failed peristalsis with pan-esophageal pressurization; best therapeutic response.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0042.webp",
            "caption": "Station 42 — Type II Achalasia with Pan-Esophageal Pressurization"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0043",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this high-resolution esophageal manometry plot demonstrating an elevated IRP (24 mmHg), absent normal peristalsis, and premature, high-amplitude spastic contractions with reduced distal latency in > 20% of swallows. Identify this subtype:",
        "options": [
            "Type III Achalasia (Spastic Achalasia)",
            "Type I Achalasia",
            "Type II Achalasia",
            "Ineffective esophageal motility"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Type III (spastic) Achalasia is defined by an elevated IRP (> 15 mmHg) accompanied by absent peristalsis and premature spastic contractions (distal contractile integral DCI > 450 mmHg-s-cm with distal latency < 4.5 seconds) in $>= 20%$ of test swallows, often causing severe chest pain mimicking cardiac angina.",
        "keyConcept": "Type III Achalasia: elevated IRP + absent peristalsis with premature spastic contractions (DCI > 450).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0043.webp",
            "caption": "Station 43 — Type III Spastic Achalasia Manometry Tracing"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0044",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this manometry tracing from a 50-year-old presenting with episodic non-cardiac retrosternal chest pain and dysphagia. The median IRP at the esophagogastric junction is completely normal (10 mmHg), but 30% of wet swallows display premature contractions with a distal latency < 4.5 seconds. Identify this primary motility disorder:",
        "options": [
            "Distal Esophageal Spasm (DES)",
            "Type I Achalasia",
            "Absent contractility / Scleroderma",
            "Gastroesophageal reflux disease"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Distal Esophageal Spasm (DES) is defined by normal deglutitive lower esophageal sphincter relaxation (normal IRP < 15 mmHg) paired with premature contractions (distal latency DL < 4.5 seconds) in $>= 20%$ of swallows, representing uncoordinated simultaneous smooth muscle spasms in the distal two-thirds of the esophagus.",
        "keyConcept": "Distal Esophageal Spasm: normal LES relaxation (normal IRP) + $>= 20%$ premature contractions (distal latency < 4.5 s).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0044.webp",
            "caption": "Station 44 — Distal Esophageal Spasm HRM Topography"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0045",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this high-resolution manometry tracing displaying an extremely high distal contractile integral (DCI > 8,000 mmHg-s-cm) in > 20% of swallows with normal IRP. Identify this hypercontractile motility disorder:",
        "options": [
            "Hypercontractile (Jackhammer / Nutcracker) esophagus",
            "Type II Achalasia",
            "Distal esophageal spasm",
            "Esophageal atresia"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Hypercontractile (Jackhammer / Nutcracker) esophagus is defined manometrically by normal LES relaxation (normal IRP) with $>= 20%$ of swallows demonstrating hypercontractile peristaltic waves characterized by a Distal Contractile Integral (DCI) exceeding 8,000 mmHg-s-cm.",
        "keyConcept": "Jackhammer esophagus: normal IRP + hypercontractile peristalsis with DCI > 8,000 mmHg-s-cm in $>= 20%$ of swallows.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0045.webp",
            "caption": "Station 45 — Jackhammer Esophagus Extreme DCI Waveform"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0046",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this esophageal manometry tracing from a patient with systemic sclerosis (CREST syndrome) presenting with severe refractory heartburn. The tracing reveals profound hypotonia of the lower esophageal sphincter (LES resting pressure < 5 mmHg) and 100% failed peristalsis (aperistalsis) in the distal smooth muscle esophagus. Identify this entity:",
        "correct_answer": "Scleroderma esophagus (Absent contractility)",
        "distractors": [
            "Type I Achalasia",
            "Distal esophageal spasm",
            "Zenker diverticulum"
        ],
        "options": [
            "Scleroderma esophagus (Absent contractility)",
            "Type I Achalasia",
            "Distal esophageal spasm",
            "Zenker diverticulum"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Scleroderma esophagus is characterized by progressive smooth muscle atrophy and collagenous fibrosis of the distal two-thirds of the esophagus, causing severe LES hypotension (free gastroesophageal reflux) and complete aperistalsis in the smooth muscle body, while the proximal striated esophagus remains spared.",
        "keyConcept": "Scleroderma esophagus: marked LES hypotonia (< 5 mmHg) + 100% aperistalsis in distal smooth muscle esophagus.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0046.webp",
            "caption": "Station 46 — Scleroderma Esophagus Profound Hypotonia Tracing"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0047",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this 24-hour ambulatory esophageal pH monitoring tracing from a patient with chronic reflux symptoms. Which parameters confirm pathological acid reflux according to international consensus?",
        "options": [
            "Total acid exposure time (% time pH < 4.0) > 6.0% and composite DeMeester score > 14.72",
            "Esophageal pH > 7.0 for more than 10% of recording time",
            "Reflux events limited exclusively to the supine sleep period with DeMeester < 10",
            "Total acid exposure time < 2.0% with DeMeester score < 14.72"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Pathological gastroesophageal acid reflux is definitively established when 24-hour ambulatory pH monitoring demonstrates an esophageal acid exposure time (AET, percentage of total 24h recording where intraluminal pH is < 4.0) exceeding 6.0%, or a composite DeMeester score exceeding the threshold of 14.72.",
        "keyConcept": "GERD pH monitoring: AET (% time pH < 4.0) > 6.0% and DeMeester score > 14.72 confirm pathological reflux.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0047.webp",
            "caption": "Station 47 — 24-Hour Ambulatory Esophageal pH Tracing"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0048",
        "type": "mcq",
        "lecture": 1,
        "text": "Examine this barium swallow fluoroscopic esophagogram displaying prominent, repetitive, non-propulsive tertiary contractions dividing the esophageal lumen into multiple sacculations ('corkscrew esophagus' or 'rosary-bead esophagus'). Identify the underlying condition:",
        "options": [
            "Diffuse Esophageal Spasm (DES)",
            "Type I Achalasia",
            "Reflux esophagitis with stricture",
            "Sliding hiatus hernia"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Tertiary contractions are non-propulsive, simultaneous, disorganized circular smooth muscle contractions that deform the esophageal column on barium swallow into alternating outpouchings and narrow segments, producing the classic 'corkscrew' or 'rosary-bead' esophagus pathognomonic of Diffuse Esophageal Spasm.",
        "keyConcept": "'Corkscrew esophagus': fluoroscopic hallmark of Diffuse Esophageal Spasm due to uncoordinated tertiary contractions.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0048.webp",
            "caption": "Station 48 — Corkscrew Esophagus Barium Fluoroscopy"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0049",
        "type": "mcq",
        "lecture": 2,
        "text": "Examine this schematic diagram of gastric parietal cell acid secretion. Which of the following correctly pairs the three physiological secretagogues with their specific basolateral membrane receptors and intracellular secondary messengers?",
        "options": [
            "Histamine (H2 receptor -> cAMP); Gastrin (CCK-B receptor -> IP3/Ca2+); Acetylcholine (M3 receptor -> IP3/Ca2+)",
            "Histamine (H1 receptor -> cGMP); Gastrin (Secretin receptor -> cAMP); Acetylcholine (Nicotinic -> Na+)",
            "Histamine (H2 receptor -> IP3/Ca2+); Gastrin (CCK-A receptor -> cAMP); Acetylcholine (M2 -> cAMP)",
            "Histamine (H3 receptor -> Gi); Gastrin (Gastrin receptor -> cGMP); Acetylcholine (M1 -> NO)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Gastric parietal cells are stimulated by three distinct secretagogues acting synergistically: 1) Histamine binds basolateral H2 receptors linked to Gs, activating adenylate cyclase to raise cAMP, 2) Gastrin binds CCK-B (CCK-2) receptors linked to Gq, activating phospholipase C to raise IP3/DAG and intracellular Ca2+, and 3) Acetylcholine (vagus) binds M3 muscarinic receptors linked to Gq, raising IP3 and intracellular Ca2+.",
        "keyConcept": "Parietal secretagogues: Histamine (H2 -> cAMP), Gastrin (CCK-B -> Ca2+), Acetylcholine (M3 -> Ca2+).",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0049.webp",
            "caption": "Station 49 — Parietal Cell Secretagogue Signaling Cascade"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0050",
        "type": "mcq",
        "lecture": 2,
        "text": "What is the primary physiological negative feedback hormone released by antral D-cells when intragastric pH falls below 3.0 that acts directly on parietal and G-cells to terminate acid secretion?",
        "options": [
            "Somatostatin",
            "Secretin",
            "Vasoactive intestinal peptide (VIP)",
            "Cholecystokinin (CCK)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Somatostatin is the principal physiological inhibitor of gastric acid secretion. When luminal pH falls below 3.0, antral D-cells release somatostatin, which acts in a paracrine fashion via SSTR2 receptors coupled to Gi to directly inhibit parietal cell adenylate cyclase and simultaneously suppress G-cell gastrin release.",
        "keyConcept": "Somatostatin: paracrine acid-sensing inhibitor released by D-cells at pH < 3.0 acting via Gi to halt acid secretion.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0050.webp",
            "caption": "Station 50 — Antral Somatostatin Negative Feedback Loop"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0051",
        "type": "mcq",
        "lecture": 2,
        "text": "What physiological phenomenon explains the transient increase in systemic venous blood pH and urinary bicarbonate excretion observed immediately following ingestion of a protein meal ('Postprandial Alkaline Tide')?",
        "options": [
            "Extrusion of bicarbonate ions into venous blood via basolateral Cl-/HCO3- exchangers during active H+ secretion into the gastric lumen",
            "Direct absorption of alkaline pancreatic juice into portal blood",
            "Hyperventilation-induced respiratory alkalosis during mastication",
            "Renal tubular acidosis induced by dietary amino acid load"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: In active parietal cells, intracellular carbonic anhydrase converts CO2 and H2O into H+ and HCO3-. For every H+ pumped into the gastric lumen by the apical H+/K+ ATPase, one HCO3- is transported out across the basolateral membrane into gastric venous blood via an electroneutral Cl-/HCO3- anion exchanger (AE2), causing the physiological postprandial 'alkaline tide'.",
        "keyConcept": "Alkaline tide: basolateral Cl-/HCO3- exchange during gastric H+ secretion raises gastric venous and urinary pH.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0051.webp",
            "caption": "Station 51 — Cellular Basis of the Postprandial Alkaline Tide"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0052",
        "type": "mcq",
        "lecture": 2,
        "text": "Trace the physiological absorption sequence of dietary Vitamin B12 (cobalamin). What is the essential transport protein secreted by gastric parietal cells that binds cobalamin in the duodenum and mediates its receptor-mediated endocytosis in the terminal ileum?",
        "options": [
            "Intrinsic Factor (IF)",
            "Haptocorrin (R-protein)",
            "Trans渡balamin II",
            "Apolipoprotein B-48"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Dietary Vitamin B12 is initially protected in the stomach by binding salivary R-protein (haptocorrin). In the alkaline duodenum, pancreatic proteases degrade haptocorrin, allowing B12 to bind gastric Intrinsic Factor (IF). The IF-B12 complex is resistant to digestion and travels to the terminal ileum, where it binds specific mucosal cubam receptors (cubilin-amnionless) for receptor-mediated endocytosis.",
        "keyConcept": "Vitamin B12 absorption: binds Intrinsic Factor in duodenum; absorbed via cubam receptor endocytosis in terminal ileum.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0052.webp",
            "caption": "Station 52 — Intrinsic Factor & Vitamin B12 Absorption Pathway"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0053",
        "type": "mcq",
        "lecture": 2,
        "text": "When acidic chyme entering the duodenum drops intraluminal pH below 4.5, which hormone is discharged from duodenal S-cells to evoke a copious, watery, bicarbonate-rich pancreatic secretion?",
        "options": [
            "Secretin",
            "Cholecystokinin (CCK)",
            "Gastric Inhibitory Peptide (GIP)",
            "Motilin"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Secretin is released by mucosal S-cells in the duodenum and upper jejunum in response to intraluminal H+ (pH < 4.5) and fatty acids. Secretin acts on pancreatic ductal epithelial cells via Gs-coupled receptors to stimulate CFTR Cl- channels and apical Cl-/HCO3- exchangers, secreting large volumes of watery, alkaline (high HCO3-) fluid that neutralizes duodenal acid.",
        "keyConcept": "Secretin: released by duodenal S-cells at pH < 4.5; stimulates pancreatic ductal bicarbonate and water secretion.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0053.webp",
            "caption": "Station 53 — Secretin Ductal Bicarbonate Secretory Cascade"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0054",
        "type": "mcq",
        "lecture": 2,
        "text": "Which intestinal hormone is released from duodenal I-cells in response to dietary long-chain fatty acids and peptides to stimulate gallbladder contraction, relaxation of the sphincter of Oddi, and discharge of digestive zymogens from pancreatic acinar cells?",
        "options": [
            "Cholecystokinin (CCK)",
            "Secretin",
            "Gastrin",
            "Vasoactive intestinal peptide (VIP)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Cholecystokinin (CCK) is released by neuroendocrine I-cells in the duodenal and jejunal mucosa upon sensing luminal digestion products of fat (monoglycerides, free fatty acids) and protein. CCK acts on CCK-1 (CCK-A) receptors to evoke vigorous gallbladder contraction, sphincter of Oddi relaxation, and exocytosis of enzyme-rich zymogen granules from pancreatic acinar cells.",
        "keyConcept": "CCK: released by I-cells in response to fats/peptides; contracts gallbladder, relaxes sphincter of Oddi, stimulates pancreatic enzymes.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0054.webp",
            "caption": "Station 54 — Cholecystokinin Gallbladder & Acinar Stimulation"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0055",
        "type": "mcq",
        "lecture": 2,
        "text": "What is the crucial brush-border enzyme anchored to the duodenal enterocyte membrane that activates inactive pancreatic trypsinogen to active trypsin, initiating the proteolytic digestive cascade in the gut lumen?",
        "options": [
            "Enteropeptidase (Enterokinase)",
            "Aminopeptidase N",
            "Carboxypeptidase A",
            "Pepsin"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Enteropeptidase (enterokinase) is an integral transmembrane serine protease located on the brush border of duodenal and jejunal enterocytes. It specifically cleaves the acidic hexapeptide (Asp-Asp-Asp-Asp-Lys) from the N-terminus of trypsinogen, converting it to active trypsin, which then autocatalytically activates all remaining proenzymes (chymotrypsinogen, proelastase, procarboxypeptidases).",
        "keyConcept": "Enteropeptidase: duodenal brush-border protease that activates trypsinogen to trypsin, triggering the enzyme cascade.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0055.webp",
            "caption": "Station 55 — Enteropeptidase Cascade Activation Mechanism"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0056",
        "type": "mcq",
        "lecture": 2,
        "text": "Approximately 95% of bile acids secreted into the gut lumen are reabsorbed and returned to the liver via the enterohepatic circulation. Where does active, high-affinity sodium-dependent reabsorption of conjugated bile salts take place?",
        "options": [
            "Terminal ileum via the Apical Sodium-dependent Bile Acid Transporter (ASBT)",
            "Duodenum via passive non-ionic diffusion",
            "Proximal jejunum via facilitated GLUT2 transport",
            "Descending colon via active H+/K+ exchange"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: While unconjugated bile acids can undergo minor passive absorption throughout the intestine, > 95% of conjugated bile salts are actively and selectively absorbed exclusively in the terminal ileum by the apical sodium-dependent bile acid transporter (ASBT / SLC10A2), exported basolaterally via OSTalpha/OSTbeta into the portal circulation back to hepatocytes.",
        "keyConcept": "Enterohepatic circulation: active sodium-dependent bile salt absorption occurs in the terminal ileum via ASBT.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0056.webp",
            "caption": "Station 56 — Enterohepatic Bile Acid Transporter Architecture"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0057",
        "type": "mcq",
        "lecture": 3,
        "text": "Examine this diagram of intestinal carbohydrate absorption. What is the primary apical transporter responsible for secondary active, sodium-coupled uptake of D-glucose and D-galactose across the enterocyte brush border?",
        "options": [
            "Sodium-Glucose Cotransporter-1 (SGLT-1)",
            "Glucose Transporter-2 (GLUT-2)",
            "Glucose Transporter-5 (GLUT-5)",
            "Sodium-Hydrogen Exchanger-3 (NHE-3)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: SGLT-1 (SLC5A1) is a high-affinity secondary active symporter on the apical microvillar membrane of small intestinal enterocytes that cotransports 2 Na+ ions along their electrochemical gradient (maintained by basolateral Na+/K+ ATPase) together with 1 molecule of D-glucose or D-galactose against their concentration gradient.",
        "keyConcept": "SGLT-1: apical secondary active symporter transporting 2 Na+ with 1 glucose or galactose into enterocytes.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0057.webp",
            "caption": "Station 57 — SGLT-1 Secondary Active Carbohydrate Cotransport"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0058",
        "type": "mcq",
        "lecture": 3,
        "text": "Which facilitative hexose transporter located on the basolateral membrane of enterocytes exports intracellular glucose, galactose, and fructose down their concentration gradients into the interstitial space and capillary blood?",
        "options": [
            "GLUT-2",
            "GLUT-4",
            "GLUT-5",
            "SGLT-2"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: GLUT-2 (SLC2A2) is a low-affinity, high-capacity facilitated diffusion uniporter located constitutively on the basolateral membrane of enterocytes that transports all three dietary monosaccharides (glucose, galactose, and fructose) out of the cell into the interstitial fluid and lamina propria capillaries.",
        "keyConcept": "GLUT-2: basolateral facilitated diffusion transporter exporting glucose, galactose, and fructose into blood.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0058.webp",
            "caption": "Station 58 — Basolateral GLUT-2 Monosaccharide Exit Architecture"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0059",
        "type": "mcq",
        "lecture": 3,
        "text": "More than 60% of dietary protein is absorbed across the enterocyte apical membrane not as free amino acids, but as dipeptides and tripeptides. Which specialized apical transporter mediates this uptake driven by an electrogenic H+ gradient?",
        "options": [
            "Peptide Transporter-1 (PepT1)",
            "System B0 neutral amino acid transporter",
            "SGLT-1 cotransporter",
            "Cystine-dibasic amino acid transporter (rBAT)"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: PepT1 (SLC15A1) is an apical electrogenic tertiary active symporter that transports intact dipeptides and tripeptides coupled to H+ inward movement driven by an apical transmembrane proton gradient (established by apical Na+/H+ exchanger NHE3), accounting for the majority of dietary nitrogen absorption.",
        "keyConcept": "PepT1: apical H+-coupled symporter transporting dipeptides and tripeptides into enterocytes.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0059.webp",
            "caption": "Station 59 — PepT1 Oligopeptide H+-Coupled Transporter"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0060",
        "type": "mcq",
        "lecture": 3,
        "text": "Trace the pathway of dietary long-chain lipid absorption in the small intestine. What is the fundamental lipoprotein particle synthesized in the smooth endoplasmic reticulum and Golgi of enterocytes that is exocytosed into central mucosal lacteals?",
        "options": [
            "Chylomicrons",
            "Very Low-Density Lipoproteins (VLDL)",
            "High-Density Lipoproteins (HDL)",
            "Mixed bile salt micelles"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Following micellar delivery and passive/facilitated uptake, fatty acids and 2-monoglycerides are re-esterified into triglycerides in the sER of enterocytes, packaged with cholesterol, phospholipids, and Apolipoprotein B-48 into chylomicrons, which are too large to cross continuous blood capillaries and therefore enter permeable fenestrated central lacteals of intestinal villi.",
        "keyConcept": "Chylomicrons: triglyceride-rich ApoB-48 lipoproteins assembled in enterocytes and exocytosed into lacteals.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0060.webp",
            "caption": "Station 60 — Enterocyte Chylomicron Synthesis & Lacteal Delivery"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0061",
        "type": "mcq",
        "lecture": 3,
        "text": "Examine this schematic of intestinal crypt fluid secretion. In cholera diarrhea, Vibrio cholerae enterotoxin causes irreversible ADP-ribosylation of Gs-alpha, persistently activating adenylate cyclase. What apical channel is opened by elevated cAMP to drive massive chloride and water secretion?",
        "options": [
            "Cystic Fibrosis Transmembrane Conductance Regulator (CFTR)",
            "Calcium-activated Chloride Channel (TMEM16A)",
            "Epithelial Sodium Channel (ENaC)",
            "Aquaporin-1 water channel"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Cholera toxin locks Gs-alpha in its active GTP-bound state, continuously stimulating adenylate cyclase to produce intracellular cAMP, which activates protein kinase A (PKA). PKA phosphorylates and opens the CFTR chloride channel on the apical membrane of crypt cells, discharging massive amounts of Cl- into the lumen, dragging Na+ and water paracellularly to cause life-threatening rice-water diarrhea.",
        "keyConcept": "Cholera pathophysiology: persistent Gs activation -> high cAMP -> opens apical CFTR Cl- channels in crypts.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0061.webp",
            "caption": "Station 61 — CFTR-Mediated Crypt Secretory Cascade"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0062",
        "type": "mcq",
        "lecture": 3,
        "text": "A patient presents with severe watery diarrhea. Fecal electrolyte analysis reveals: Stool [Na+] = 30 mmol/L, Stool [K+] = 25 mmol/L. Assuming normal stool osmolality of 290 mOsm/kg, calculate the Fecal Osmotic Gap (FOG) and identify the mechanism:",
        "options": [
            "FOG = 180 mOsm/kg; indicates Osmotic Diarrhea (poorly absorbable solute)",
            "FOG = 35 mOsm/kg; indicates Secretory Diarrhea (active ion secretion)",
            "FOG = 0 mOsm/kg; indicates Factitious Diarrhea",
            "FOG = 235 mOsm/kg; indicates Inflammatory Diarrhea"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: Fecal Osmotic Gap is calculated as: FOG = 290 - 2 x ([Na+] + [K+]). Here, FOG = 290 - 2 x (30 + 25) = 290 - 110 = 180 mOsm/kg. An osmotic gap > 100 mOsm/kg defines Osmotic Diarrhea (e.g., lactase deficiency, osmotic laxatives), which characteristically ceases upon fasting.",
        "keyConcept": "Fecal Osmotic Gap: FOG = 290 - 2 x (Na+ + K+). FOG > 100 mOsm/kg = Osmotic; FOG < 50 mOsm/kg = Secretory.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0062.webp",
            "caption": "Station 62 — Fecal Osmotic Gap Diagnostic Calculation"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0063",
        "type": "mcq",
        "lecture": 3,
        "text": "What is the primary neurohormonal mechanism of the Gastrocolic Reflex that induces mass propulsive contractions in the colon 15 to 30 minutes following ingestion of a meal?",
        "options": [
            "Gastric distension triggers long vagovagal parasympathetic reflexes reinforced by postprandial release of gastrin and CCK",
            "Direct mechanical compression of the transverse colon by the full stomach",
            "Sympathetic splanchnic activation causing haustral segmentation",
            "Local release of nitric oxide by colonic mucosal enterocytes"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The gastrocolic reflex is a physiological propulsive response mediated by long vagovagal parasympathetic pathways triggered by gastric wall distension and chemical sensing of nutrients in the duodenum, augmented hormonally by gastrin and cholecystokinin (CCK), producing coordinated mass contractions in the transverse and sigmoid colon.",
        "keyConcept": "Gastrocolic reflex: vagovagal parasympathetic reflex + gastrin/CCK triggering mass colonic movements after meals.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0063.webp",
            "caption": "Station 63 — Gastrocolic Reflex Neurohormonal Circuit"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0064",
        "type": "mcq",
        "lecture": 3,
        "text": "During the physiological defecation reflex, distension of the rectal ampulla triggers the rectoanal inhibitory reflex (RAIR). Which smooth muscle structure involuntarily relaxes in response to myenteric nitric oxide release?",
        "options": [
            "Internal anal sphincter",
            "External anal sphincter",
            "Puborectalis muscle",
            "Ileocecal sphincter"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The rectoanal inhibitory reflex (RAIR) is an intrinsic myenteric reflex where rectal distension evokes involuntary transient relaxation of the internal anal sphincter (composed of circular smooth muscle) mediated by VIP and nitric oxide, allowing rectal contents to contact the sensitive anal transition zone for sensory 'sampling'.",
        "keyConcept": "RAIR: rectal distension causes involuntary relaxation of internal anal sphincter via myenteric NO/VIP.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0064.webp",
            "caption": "Station 64 — Rectoanal Inhibitory Reflex (RAIR) Tracing"
        }
    },
    {
        "id": "MGL3-CH305-PHYS-0065",
        "type": "mcq",
        "lecture": 3,
        "text": "Examine this neural diagram of the emetic pathway. Which specialized circumventricular organ situated in the floor of the 4th ventricle lacks a blood-brain barrier and senses circulating emetogenic chemicals via dopamine D2 and serotonin 5-HT3 receptors?",
        "options": [
            "Chemoreceptor Trigger Zone (CTZ / Area postrema)",
            "Nucleus tractus solitarius (NTS)",
            "Vomiting center in reticular formation",
            "Subfornical organ"
        ],
        "correctIndex": 0,
        "explanation": "Criteria of Identification: The Chemoreceptor Trigger Zone (CTZ) resides within the area postrema in the floor of the fourth ventricle. Because it lacks a continuous blood-brain barrier, it is directly exposed to blood-borne and CSF-borne toxins, chemotherapeutic drugs, and metabolites, signaling via dopamine D2, serotonin 5-HT3, neurokinin-1 (NK-1), and opioid receptors to the central vomiting center.",
        "keyConcept": "CTZ (area postrema): circumventricular organ lacking BBB that senses emetogens via 5-HT3 and D2 receptors.",
        "media": {
            "type": "image",
            "imageUrl": "/images/practical/mgl-3/physiology/img_phys_0065.webp",
            "caption": "Station 65 — Emetic Pathway & Chemoreceptor Trigger Zone"
        }
    }
]


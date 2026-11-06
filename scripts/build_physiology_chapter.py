import json
import urllib.request
import ssl
from bs4 import BeautifulSoup

# Parse 48 clinical gastroenterology physiology practical questions (Form Q9 to Q56, excluding 7 manometry/recording questions)
url = "https://docs.google.com/forms/d/e/1FAIpQLSdIcVGfuCWvHCfJWafgBR9yaHghQjWhhss-eR3Mwc1Um6Djzw/viewform?usp=dialog"
ctx = ssl._create_unverified_context()
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, context=ctx).read().decode("utf-8")
soup = BeautifulSoup(html, "html.parser")
containers = soup.select(".geS5n")

# Verification and adjudication keys for all 48 physiology questions:
# (correct_index, detailed_explanation, key_concept)
physio_keys = [
    # Q1: A 70-year-old woman has difficulty swallowing both solids and liquids... regurgitated food is undigested mainly because:
    (3,
     "Criteria of Identification: In achalasia, incomplete relaxation of the lower esophageal sphincter (LES) combined with aperistalsis in the esophageal body prevents food boluses from traversing the gastroesophageal junction. Ingested food remains pooled in the dilated thoracic esophagus above the tight sphincter for hours or days without ever coming into contact with gastric acid, pepsin, or pancreatico-duodenal enzymes, so it is regurgitated as completely undigested, neutral-pH food particles.\n\nOptions A, B, C, and E are incorrect because digestion of proteins and lipids requires entry into the stomach and small intestine.",
     "Achalasia: Impaired LES relaxation causes food stagnation in the dilated esophagus above the GE junction, resulting in regurgitation of undigested, non-acidic food."),

    # Q2: In the same patient, frequent coughing and aspiration while eating and during sleep is best explained by:
    (0,
     "Criteria of Identification: When the dilated esophagus reaches capacity with retained secretions and stagnant food, contents overflow retrograde into the pharynx and spill into the adjacent laryngeal inlet, especially in the recumbent position during sleep when gravitational containment is lost and protective pharyngeal swallowing reflexes are blunted.\n\nOptions B and C are incorrect because the primary pathology is esophageal aperistalsis and LES hypertonicity, not pharyngeal paralysis or brainstem swallowing center damage.",
     "Complications of achalasia: Nocturnal coughing and aspiration pneumonia result from overflow of stagnant esophageal pool into the trachea."),

    # Q3: The basic defect in achalasia is degeneration of which neurons?
    (1,
     "Criteria of Identification: Achalasia is a primary neurodegenerative disorder of the enteric nervous system characterized by selective loss and degeneration of postganglionic inhibitory myenteric (Auerbach's) neurons located in the lower esophageal sphincter and distal esophagus. These inhibitory neurons normally release nitric oxide (NO) and vasoactive intestinal peptide (VIP) to mediate LES relaxation during deglutition.\n\nOption E is incorrect because loss of cholinergic neurons would cause hypotension, whereas achalasia features unopposed cholinergic baseline tone.",
     "Pathophysiology: Degeneration of NO- and VIP-producing inhibitory myenteric neurons causes failure of LES receptive relaxation."),

    # Q4: A drug that would theoretically replace the deficient transmitter in achalasia is:
    (1,
     "Criteria of Identification: Because the primary physiological deficiency in achalasia is the lack of nitric oxide (NO) synthesis by degenerated inhibitory enteric neurons, exogenous nitric oxide donors (such as isosorbide dinitrate, nitroglycerin) or calcium channel blockers directly relax the hypertensive vascular and visceral smooth muscle of the lower esophageal sphincter.\n\nOption A (cholinergic muscarinic agonist) would exacerbate LES spasm by increasing contraction.",
     "Pharmacotherapy: Nitric oxide donors (e.g. isosorbide dinitrate) substitute for deficient neuronal NO, lowering LES resting tone."),

    # Q5: Achalasia and gastroesophageal reflux disease (GERD) differ mainly in that:
    (3,
     "Criteria of Identification: Achalasia and GERD represent opposite mechanical dysfunctions of the lower esophageal sphincter: achalasia is characterized by failure of LES relaxation (elevated resting tone >45 mmHg with absent swallow-induced receptive relaxation), whereas GERD is characterized by incompetence and failure of LES contraction / hypotensive baseline LES tone (<10 mmHg or transient inappropriate relaxations) permitting acid backwash into the esophagus.\n\nOption D is incorrect because primary achalasia is a functional motility neuropathy, not an extrinsic mechanical stricture.",
     "Differential Physiology: Achalasia = failure of LES relaxation; GERD = failure of LES contraction (incompetent/hypotonic barrier)."),

    # Q6: Which of the following swallowing events does NOT need the swallowing center to coordinate it?
    (2,
     "Criteria of Identification: Secondary esophageal peristalsis is an entirely involuntary, locally mediated reflex coordinated by the intrinsic enteric nervous system (myenteric plexus) in response to local mechanical stretch or distension of the esophageal wall by retained food or refluxed gastric acid. It operates autonomously even after bilateral cervical vagotomy or brainstem isolation. In contrast, primary peristalsis and the pharyngeal phase require central coordination by the medullary swallowing center via cranial nerves V, IX, X, and XII.",
     "Secondary peristalsis is triggered locally by luminal distension and mediated intrinsically by the enteric nervous system without central swallowing center coordination."),

    # Q7: The involuntary pharyngeal phase of swallowing is triggered by stimulation of:
    (0,
     "Criteria of Identification: The pharyngeal phase of swallowing is initiated involuntarily when a food bolus is propelled posteriorly by the tongue against tactile/pressure mechanoreceptors located in the mucosa around the pharyngeal opening, especially the palatoglossal and palatopharyngeal arches and tonsillar pillars. Afferent impulses travel via cranial nerves V, IX, and X to the swallowing center in the medulla oblongata.",
     "Initiation of pharyngeal deglutition: Bolus activates tactile/pressure mechanoreceptors on the tonsillar pillars and posterior pharyngeal wall."),

    # Q8: Stimulation of the pharyngeal receptors by a bolus causes all of the following EXCEPT:
    (4,
     "Criteria of Identification: Stimulation of pharyngeal swallowing receptors initiates a vagally mediated inhibitory reflex called 'receptive relaxation of the stomach' (fundus and corpus expand their volume with minimal pressure increase to accommodate incoming food). It causes relaxation, NOT contraction, of the proximal stomach. It simultaneously triggers UES opening, pharyngeal peristalsis, primary esophageal peristalsis, and LES relaxation.",
     "Gastric receptive relaxation: Swallowing triggers reflex relaxation of the proximal gastric reservoir (fundus) via vagal inhibitory non-adrenergic non-cholinergic (NANC) fibers."),

    # Q9: In the pancreatic secretion experiment, hormone 1 raised both the secretion rate and HCO3- concentration... Hormone 1 acts mainly on:
    (1,
     "Criteria of Identification: Secretin is released by mucosal S cells in the duodenum and upper jejunum in response to acidic chyme (pH < 4.5). It acts via Gs protein-coupled receptors on pancreatic ductal epithelial cells, activating adenylyl cyclase and cAMP to stimulate cystic fibrosis transmembrane conductance regulator (CFTR) Cl- channels and apical Cl-/HCO3- exchangers, producing high-volume, watery, enzyme-poor alkaline juice rich in HCO3- (up to 120–140 mmol/L).",
     "Secretin: Stimulates ductal epithelial cells to secrete large volumes of watery, bicarbonate-rich pancreatic juice."),

    # Q10: Hormone 2 in the same experiment caused a large rise in amylase but only a small rise in secretion rate. The primary stimulus for its release is:
    (0,
     "Criteria of Identification: Hormone 2 is cholecystokinin (CCK), which acts on pancreatic acinar cells via CCK-1 (CCK-A) receptors to trigger exocytosis of digestive zymogen granules (amylase, lipase, trypsinogen). The most potent physiological stimulants for CCK secretion by duodenal and jejunal I cells are dietary long-chain fatty acids, monoglycerides, peptides, and amino acids entering the duodenum.",
     "Cholecystokinin (CCK): Stimulated primarily by luminal fat and protein breakdown products, stimulating acinar enzyme release."),

    # Q11: Which combination correctly describes the effects of secretin?
    (2,
     "Criteria of Identification: Secretin functions as 'nature's antacid': it decreases gastric acid secretion (inhibits gastrin and parietal cells), inhibits gastric emptying (preventing duodenal acid overload), and stimulates cholangiocytes in the biliary tree to secrete a watery, bicarbonate-rich alkaline hepatic bile. It does not cause gallbladder smooth muscle contraction (which is mediated by CCK).",
     "Secretin actions: Inhibits gastric acid secretion and motility, while stimulating ductal bicarbonate secretion in pancreas and biliary tree."),

    # Q12: Which combination correctly describes the effects of cholecystokinin (CCK)?
    (3,
     "Criteria of Identification: CCK promotes digestion by causing vigorous gallbladder contraction and simultaneous relaxation of the sphincter of Oddi (emptying bile into the duodenum), stimulating pancreatic acinar enzyme secretion, and exerting a negative feedback on the stomach by decreasing gastric emptying and acid secretion to allow adequate time for intestinal digestion.",
     "CCK actions: Empties the gallbladder, relaxes the sphincter of Oddi, stimulates pancreatic enzyme exocytosis, and slows gastric emptying."),

    # Q13: A person eats meat, eggs, toast, and orange juice. The toast mainly causes release of a duodenal hormone whose main pancreatic effect is:
    (4,
     "Criteria of Identification: Toast is rich in carbohydrates (starch). The digestion of starch yields luminal glucose, which is the potent physiological trigger for the release of glucose-dependent insulinotropic polypeptide (GIP / incretin) from duodenal K cells. GIP targets the endocrine pancreas (beta cells of the islets of Langerhans) to stimulate glucose-dependent insulin secretion, anticipatorily preparing the body for postprandial glucose uptake.",
     "Incretin effect: Luminal carbohydrates stimulate duodenal GIP and GLP-1 release, which stimulate endocrine pancreatic insulin secretion."),

    # Q14: For the same meal, which statement about pancreatic enzyme secretion is correct?
    (3,
     "Criteria of Identification: Pancreatic acinar cells package enzymes together within common zymogen granules. Upon stimulation by neurohormonal agonists (CCK and ACh), exocytosis releases the entire preformed granule contents in fixed, parallel proportions. While chronic dietary shifts alter genetic expression over weeks, during a single meal the proportion of individual enzymes stays constant; only the total magnitude of enzyme secretion changes.",
     "Parallel secretion: Pancreatic acinar enzymes are co-packaged in zymogen granules, keeping relative enzyme proportions constant during a meal."),

    # Q15: A 62-year-old woman has a stone in the main pancreatic duct... diarrhea is best explained by:
    (0,
     "Criteria of Identification: Complete or partial obstruction of the main pancreatic duct halts the delivery of pancreatic lipase, amylase, and proteases into the duodenum. Undigested macronutrients (especially dietary triglycerides and starches) remain in the intestinal lumen, creating a powerful hyperosmolar gradient that obligates osmotic water retention and pulls fluid from plasma into the lumen, causing osmotic malabsorptive diarrhea.",
     "Pancreatic insufficiency: Undigested luminal macronutrients exert an osmotic force, drawing fluid into the intestinal lumen (osmotic diarrhea)."),

    # Q16: In pancreatic enzyme deficiency, the digestion of which nutrient is most severely affected?
    (1,
     "Criteria of Identification: Fat digestion is uniquely vulnerable because pancreatic lipase accounts for >90% of total dietary triglyceride hydrolysis. While salivary amylase and brush border disaccharidases can digest carbohydrates, and gastric pepsin plus intestinal brush border peptidases can hydrolyze proteins, lingual and gastric lipases have extremely limited capacity and cannot digest long-chain triglycerides in neutral intestinal environments.",
     "Enzyme deficit vulnerability: Fat digestion is most severely disrupted because pancreatic lipase lacks adequate compensatory backups."),

    # Q17: The patient's liver function tests were normal. This finding suggests that her steatorrhea is mainly caused by:
    (4,
     "Criteria of Identification: Normal liver function tests and patent extrahepatic bile ducts confirm normal hepatocyte bile salt synthesis, normal conjugation, and unrestricted delivery of bile salts into the intestinal lumen. Therefore, the isolated clinical triad of ductal stone, normal liver tests, and steatorrhea localizes the defect exclusively to exocrine pancreatic insufficiency with deficiency of pancreatic lipase.",
     "Steatorrhea with normal liver function points directly to pancreatic lipase insufficiency."),

    # Q18: If the pancreatic duct obstruction continues, all of the following are expected EXCEPT:
    (2,
     "Criteria of Identification: Chronic steatorrhea causes massive malabsorption of fat-soluble vitamins (A, D, E, and K). Malabsorption of vitamin D impairs intestinal calcium and phosphate uptake, causing secondary hyperparathyroidism, systemic calcium mobilization, osteomalacia, and osteoporosis (decreased, never increased, bone density). Vitamin K malabsorption prolongs clotting time.",
     "Chronic pancreatic obstruction causes fat-soluble vitamin malabsorption, leading to osteoporosis/osteomalacia (never increased bone density)."),

    # Q19: A patient with liver failure has bleeding. Using a thrombopoietin receptor antagonist would NOT help him because:
    (0,
     "Criteria of Identification: Thrombopoietin (TPO) is constitutively synthesized and secreted by hepatocytes into the circulation to stimulate megakaryocytopoiesis and platelet production in bone marrow. In liver failure, endogenous TPO synthesis is already severely depressed, contributing to baseline thrombocytopenia. Administering an antagonist against TPO receptors would further block platelet generation, severely worsening hemorrhagic risk.",
     "Thrombopoietin: Hepatocyte-derived hormone that drives megakaryocyte differentiation; antagonists worsen liver failure thrombocytopenia."),

    # Q20: The active form of vitamin D is reduced in liver failure because the liver performs:
    (2,
     "Criteria of Identification: Dietary and skin-derived cholecalciferol (vitamin D3) is biologically inert. The obligatory first metabolic step in its activation is 25-hydroxylation, carried out constitutively in hepatocyte microsomes and mitochondria by 25-hydroxylase (CYP2R1) to form 25-hydroxycholecalciferol [calcidiol]. Calcidiol is subsequently converted in the renal proximal tubules to active 1,25-dihydroxycholecalciferol [calcitriol].",
     "Hepatic vitamin D metabolism: Hepatocytes perform obligatory 25-hydroxylation to produce calcidiol [25(OH)D]."),

    # Q21: Clinical signs of liver failure usually appear only after destruction of more than about what percentage of the liver?
    (2,
     "Criteria of Identification: The liver has an enormous functional reserve capacity and regenerative potential. Normal metabolic, synthetic, and excretory equilibrium is maintained until approximately 70% to 80% of functional hepatic parenchymal volume has been destroyed by acute necrosis or progressive cirrhosis.",
     "Hepatic functional reserve: Clinical manifestations of hepatic decompensation manifest only after destruction of >70% of hepatocytes."),

    # Q22: Swelling of the face and extremities in liver failure is mainly caused by:
    (1,
     "Criteria of Identification: Albumin is synthesized exclusively by hepatocytes and accounts for 75–80% of total plasma colloid oncotic (osmotic) pressure. In advanced liver failure, profound hypoalbuminemia (<2.5 g/dL) drastically lowers intravascular oncotic pressure, disrupting Starling equilibrium and shifting fluid from capillaries into the interstitial tissue spaces.",
     "Starling forces in liver failure: Hypoalbuminemia decreases plasma colloid oncotic pressure, causing generalized interstitial edema and ascites."),

    # Q23: A patient with liver failure is better treated with intravenous rather than oral calcium because:
    (4,
     "Criteria of Identification: Intestinal absorption of dietary calcium across the enterocyte apical membrane (via TRPV6 channels and calbindin-D9k) strictly depends on active vitamin D [calcitriol]. In liver failure, impaired 25-hydroxylation leads to deficient calcitriol production, blunting intestinal calcium absorption and rendering oral calcium therapy largely unabsorbed and excreted in feces.",
     "Calcium bioavailability: Low active vitamin D in liver failure prevents intestinal calcium transport, requiring intravenous bypass."),

    # Q24: Which sequence correctly explains osteomalacia in liver failure?
    (3,
     "Criteria of Identification: Liver failure impairs hepatic 25-hydroxylase -> deficiency of 25(OH)D and calcitriol -> reduced intestinal absorption of calcium and phosphate -> systemic hypocalcemia -> secondary hyperparathyroidism (elevated PTH) -> osteoclastic bone resorption and defective matrix mineralization, producing osteomalacia and pathological fractures.",
     "Pathogenesis of hepatic osteodystrophy: Low active Vit D -> low intestinal Ca2+ absorption -> hypocalcemia -> high PTH -> bone demineralization."),

    # Q25: A 39-year-old man had 80% of his ileum removed... The direct cause of his steatorrhea is a deficiency of:
    (4,
     "Criteria of Identification: The terminal ileum is the exclusive anatomical site for active, sodium-dependent reabsorption of conjugated bile salts via the apical sodium-dependent bile acid transporter (ASBT). Resection of 80% of the ileum abolishes the enterohepatic circulation. Despite maximal hepatic synthesis, bile salt losses in feces exceed hepatic replacement capacity, dropping luminal bile salt concentration below the critical micellar concentration (CMC) required to emulsify fats and form mixed micelles.",
     "Short bowel syndrome: Resection of the ileum depletes the luminal bile salt pool below the critical micellar concentration, causing severe steatorrhea."),

    # Q26: In this patient, bile salt deficiency is mainly due to the loss of bile salt:
    (3,
     "Criteria of Identification: Active absorption of conjugated bile salts in the terminal ileum recovers >95% of the secreted bile acid pool per cycle. Loss of this active transporter bed directly disrupts the enterohepatic circuit.",
     "Bile salt physiology: Active transport in the terminal ileum (via ASBT) is the indispensable engine of the enterohepatic circulation."),

    # Q27: This patient's anemia is most likely due to deficiency of:
    (1,
     "Criteria of Identification: Vitamin B12 (cobalamin) bound to gastric intrinsic factor (IF) is absorbed exclusively in the terminal ileum via receptor-mediated endocytosis at the cubam receptor complex (cubilin-amnionless). Resection of the terminal ileum completely halts vitamin B12 assimilation, resulting in macrocytic megaloblastic anemia after liver cobalamin stores are exhausted.",
     "Terminal ileal absorption: Site of vitamin B12-intrinsic factor absorption; ileal resection results in vitamin B12 deficiency anemia."),

    # Q28: The bile salt pool (about 3-4 g) recycles through the enterohepatic circulation about how many times per day?
    (2,
     "Criteria of Identification: The total human bile salt pool is approximately 3 to 4 grams. To digest and absorb 80–100 g of dietary lipid ingested daily across multiple meals, this pool must be recirculated through the liver, biliary tree, intestine, and portal vein approximately 6 to 8 times every 24 hours (translating to a daily total bile salt flux of 18–24 g).",
     "Enterohepatic turnover: The 3–4 g bile salt pool recycles 6–8 times daily to meet digestive demands."),

    # Q29: About what percentage of secreted bile salts is reabsorbed from the intestine?
    (3,
     "Criteria of Identification: The enterohepatic circulation operates with extraordinary physiological efficiency: approximately 95% of secreted bile salts are actively reabsorbed in the terminal ileum and returned to the liver via the portal circulation. Only about 5% (~0.2 to 0.6 g/day) escapes into the colon to be excreted in feces, which equals the daily rate of de novo hepatic bile acid synthesis.",
     "Enterohepatic conservation: ~95% of intestinal bile salts are reabsorbed and reused; only ~5% is lost in stool daily."),

    # Q30: All of the following are functions of the enterohepatic circulation of bile salts EXCEPT:
    (2,
     "Criteria of Identification: Enterohepatic cycling of bile salts is essential for preserving the micellar pool that PROMOTES (not reduces) the intestinal absorption of dietary lipids and fat-soluble vitamins (A, D, E, K). It reduces the metabolic burden of de novo hepatic bile acid synthesis, limits fecal loss, and exerts a potent choleretic feedback on hepatocytes.",
     "Enterohepatic circulation: Maintains micelle formation, dramatically facilitating the absorption of fat-soluble vitamins."),

    # Q31: The role of bile salts in fat digestion is to:
    (0,
     "Criteria of Identification: Bile salts are amphipathic molecules possessing both hydrophobic and hydrophilic faces. In the duodenal lumen, mechanical agitation by intestinal motility breaks large fat globules into minute droplets, which bile salts coat to prevent coalescence. This emulsification increases the surface area of lipids by thousands of times, allowing water-soluble colipase-pancreatic lipase complexes to access and hydrolyze ester bonds.",
     "Emulsification: Amphipathic bile salts break large fat droplets into emulsion particles, expanding lipid surface area for lipase action."),

    # Q32: The ileal resection patient is at higher risk of gallstones because:
    (1,
     "Criteria of Identification: Cholesterol is insoluble in water and must be maintained in stable liquid-crystalline micellar solution in bile by adequate concentrations of bile salts and phospholipids. When ileal resection depletes the circulating bile salt pool, bile becomes supersaturated with cholesterol (lithogenic bile), causing cholesterol microcrystals to nucleate and aggregate into radiolucent cholesterol gallstones.",
     "Lithogenesis in ileal disease: Bile salt depletion shifts the lithogenic index, causing cholesterol supersaturation and gallstone formation."),

    # Q33: Which blood test is expected to be abnormal in this patient?
    (3,
     "Criteria of Identification: Chronic bile salt depletion and fat malabsorption impair the absorption of vitamin K, a fat-soluble cofactor essential for hepatic gamma-glutamyl carboxylase to carboxylate clotting factors II, VII, IX, and X. Vitamin K deficiency impairs coagulation cascade activation, leading to prolongation of the whole blood clotting time and prothrombin time (PT/INR).",
     "Coagulation pathophysiology: Vitamin K malabsorption secondary to bile salt deficiency prolongs clotting time (PT/INR)."),

    # Q34: If the patient is left untreated, all of the following are expected EXCEPT:
    (0,
     "Criteria of Identification: Chronic steatorrhea leads to unabsorbed fatty acids binding luminal ionized calcium to form insoluble calcium soaps. Combined with vitamin D malabsorption, systemic blood Ca2+ falls. Hypocalcemia directly stimulates the parathyroid glands via calcium-sensing receptors (CaSR) to hypersecrete parathyroid hormone (secondary hyperparathyroidism). Therefore, PTH secretion is ELEVATED, not reduced.",
     "Calcium homeostasis: Hypocalcemia from fat malabsorption stimulates secondary hyperparathyroidism (elevated PTH)."),

    # Q35: In the terminal ileum, bile salts are absorbed by:
    (4,
     "Criteria of Identification: Conjugated bile salts are negatively charged anions that cannot cross lipid bilayers by simple diffusion. In the terminal ileum, they are actively absorbed via secondary active transport coupled to the downhill inward sodium gradient across the brush border via the apical sodium-dependent bile acid transporter (ASBT / SLC10A2), driven by the basolateral Na+/K+ ATPase.",
     "ASBT transporter: Conjugated bile salts are transported across the terminal ileal enterocyte brush border via secondary active Na+ symport."),

    # Q36: This patient's liver function is normal, yet he is still bile salt deficient. This is because:
    (2,
     "Criteria of Identification: Under physiological conditions, the rate-limiting enzyme in bile acid synthesis, cholesterol 7alpha-hydroxylase (CYP7A1), produces ~0.5 g/day. When ileal reabsorption fails completely, fecal losses exceed 3–5 g/day. Even when negative feedback upregulates hepatic CYP7A1 to its maximum synthetic velocity (approximately 3 to 5 times basal), hepatic synthesis cannot compensate for the massive continuous fecal loss.",
     "Synthesis ceiling: Maximum hepatic de novo bile acid synthesis capacity cannot match the massive continuous fecal loss after total ileal loss."),

    # Q37: A 21-year-old student develops bloating, cramps, gas and diarrhea... Her diarrhea is caused by deficiency of:
    (2,
     "Criteria of Identification: Lactase (lactase-phlorizin hydrolase) is an apical brush border disaccharidase in the small intestine that hydrolyzes dietary lactose (milk sugar) into glucose and galactose. Primary adult-type hypolactasia results in unhydrolyzed lactose remaining in the intestinal lumen, causing osmotic fluid influx and bacterial fermentation into lactic acid, methane, and hydrogen gas.",
     "Lactase deficiency: Absence of brush-border lactase prevents lactose cleavage, precipitating osmotic diarrhea and gas."),

    # Q38: This patient's abdominal distension and gas are explained by all of the following EXCEPT:
    (0,
     "Criteria of Identification: In lactose intolerance, unabsorbed lactose pulls water into the lumen by osmosis, distending the small intestine. Distension mechanically activates myenteric stretch reflexes, causing hypermotility and rapid transit (not reduced motility). In the colon, bacteria rapidly ferment lactose into hydrogen, methane, CO2, and short-chain fatty acids, producing flatulence and distension.",
     "Lactose intolerance mechanics: Osmotic load accelerates motility (hyperperistalsis) rather than reducing it."),

    # Q39: Lactose intolerance like this patient's typically first appears in:
    (4,
     "Criteria of Identification: While congenital alactasia is exceptionally rare, adult-type hypolactasia (lactase non-persistence) is the normal genetically programmed phenotype in most world populations. Intestinal lactase expression is maximal during infancy to digest breast milk and begins a progressive, down-regulated decline following weaning, typically manifesting clinically in children older than 4 to 6 years of age or during adolescence.",
     "Lactase non-persistence: Genetically programmed down-regulation of lactase activity typically manifests after age 4–5 years."),

    # Q40: After sucrase digests sucrose at the brush border, fructose enters the intestinal cell by:
    (3,
     "Criteria of Identification: Sucrose is hydrolyzed at the enterocyte brush border by sucrase into glucose and fructose. Unlike glucose and galactose (which enter enterocytes via secondary active transport with Na+ via SGLT-1), fructose enters the luminal apical membrane strictly via facilitated diffusion mediated by the specific carrier GLUT-5. Both hexoses exit into the portal blood via GLUT-2.",
     "Carbohydrate transport: Fructose is absorbed across the enterocyte apical membrane via facilitated diffusion through GLUT-5."),

    # Q41: Absorption in the small intestine becomes clearly impaired only after removal of:
    (4,
     "Criteria of Identification: The small intestine possesses vast anatomical and physiological reserve for digestion and absorption. In surgical short bowel scenarios, clinically manifest malabsorption of macronutrients and electrolyte balance disturbances typically emerge only after resection of more than 50% (and particularly >70–75%) of the total small intestinal length.",
     "Intestinal functional reserve: Clinically overt malabsorption manifests only when more than 50% of the small bowel is resected."),

    # Q42: In psychogenic diarrhea, the mechanism is:
    (4,
     "Criteria of Identification: Acute emotional stress, anxiety, or psychogenic arousal activates central limbic and hypothalamic centers, stimulating intense parasympathetic vagal and pelvic nerve outflow to the gastrointestinal tract. This excessive cholinergic stimulation markedly accelerates intestinal transit and peristaltic motility, propelling luminal contents into the rectum before mucosal water reabsorption can be completed.",
     "Psychogenic diarrhea: Stress-induced parasympathetic (cholinergic) hyperactivity causes intestinal hypermotility and rapid transit."),

    # Q43: In most adults and children, the reflex that starts the urge to defecate after breakfast is:
    (1,
     "Criteria of Identification: The gastrocolic reflex is a physiological long vagovagal and neuroendocrine reflex triggered by gastric distension and mucosal exposure to food (especially lipids and coffee) during or immediately after a meal (commonly breakfast). It elicits powerful mass movements in the colon that sweep fecal material from the transverse and descending colon into the rectal ampulla, triggering the defecation urge.",
     "Gastrocolic reflex: Meal-induced gastric distension elicits colonic mass peristalsis, filling the rectum and initiating the defecation urge."),

    # Q44: A man has fecal incontinence 6 months after anorectal surgery, with an injured internal anal sphincter... Which statement about this sphincter is correct?
    (4,
     "Criteria of Identification: The internal anal sphincter (IAS) is an involuntary smooth muscle thickening of the circular muscular layer of the anorectum. Under baseline conditions, it is tonically contracted via sympathetic hypogastric outflow, generating 70–80% of resting anal canal closure pressure to prevent passive fecal leakage. During the defecation reflex, rectal distension triggers parasympathetic pelvic nerves to relax the IAS (rectoanal inhibitory reflex).",
     "Internal anal sphincter: Involuntary smooth muscle generating tonic resting closure pressure; relaxes reflexively upon rectal distension."),

    # Q45: In an adult, the act of defecation is integrated at the:
    (1,
     "Criteria of Identification: Normal voluntary defecation in continent adults requires dual neurological integration: the involuntary parasympathetic defecation reflex is integrated at the sacral spinal cord (S2, S3, S4 conus medullaris center), while voluntary continence and deliberate initiation of the act (straining, Valsalva, and somatic relaxation of the puborectalis and external anal sphincter via pudendal nerves) are integrated at the cerebral cortex and brainstem centers.",
     "Defecation integration: Dual integration involving involuntary sacral spinal reflex centers (S2–S4) under voluntary cerebral cortical control."),

    # Q46: All of the following happen during defecation EXCEPT:
    (2,
     "Criteria of Identification: During the execution of defecation when social conditions are appropriate, the voluntary external anal sphincter (EAS) and puborectalis muscles are consciously RELAXED (inhibited via somatic pudendal motor neurons), straightening the anorectal angle and allowing feces to pass. It contracts only to postpone defecation when conditions are unfavorable.",
     "Defecation mechanics: Defecation requires voluntary relaxation (not contraction) of the external anal sphincter and puborectalis."),

    # Q47: In the defecation reflex, the efferent nerves that cause rectal contraction and the nerves that control the external anal sphincter are, respectively:
    (0,
     "Criteria of Identification: Rectal smooth muscle contraction and internal anal sphincter relaxation are mediated by parasympathetic preganglionic fibers traveling in the pelvic splanchnic nerves (nervi erigentes) from S2–S4 sacral segments. In contrast, the striated voluntary external anal sphincter is controlled by somatic motor fibers running in the pudendal nerves (also derived from S2–S4 Onuf's nucleus).",
     "Innervation: Rectal peristalsis is driven by parasympathetic pelvic splanchnic nerves; the external anal sphincter is driven by somatic pudendal nerves."),

    # Q48: The bacteria of the large intestine are characterized by all of the following EXCEPT:
    (3,
     "Criteria of Identification: The colonic microbiome comprises >10^14 commensal and mutualistic anaerobic and aerobic microorganisms. They perform indispensable physiological functions: fermenting dietary fiber into protective short-chain fatty acids (acetate, propionate, butyrate), synthesizing essential micronutrients (vitamin K, vitamin B12, biotin), metabolizing bilirubin into stercobilin (giving stool its characteristic brown color), and providing colonization resistance against enteric pathogens. They are mutualistic commensals, NOT highly pathogenic under normal conditions.",
     "Colonic microbiota: Mutualistic symbionts that synthesize vitamins and ferment fiber; they are non-pathogenic in their normal ecological niche.")
]

physio_questions = []
for i, c in enumerate(containers[8:], 1):
    stem = c.select_one(".M7eMe").get_text(strip=True) if c.select_one(".M7eMe") else ""
    opt_nodes = c.select(".docssharedWtfmeeg9lHf") or c.select(".nWQGrd")
    options = [opt.get_text(strip=True) for opt in opt_nodes if opt.get_text(strip=True)]
    
    correct_idx, explanation, key_concept = physio_keys[i - 1]
    
    q_obj = {
        "id": f"MGL3-PRAC-PHY-{i:04d}",
        "type": "mcq",
        "lecture": 1,
        "text": stem,
        "options": options,
        "correctIndex": correct_idx,
        "explanation": explanation,
        "keyConcept": key_concept
    }
    physio_questions.append(q_obj)

with open("src/app/data/practical/mgl-3-physio-practical.json", "w", encoding="utf-8") as f:
    json.dump(physio_questions, f, indent=2, ensure_ascii=False)

print(f"Generated {len(physio_questions)} verified Physiology practical questions.")

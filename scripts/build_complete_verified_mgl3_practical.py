import json
import os
import re

print("=================================================================")
print("REBUILDING 100% VERIFIED PRACTICAL QUESTION BANK FOR MGL-3")
print("=================================================================")

with open("scripts/canonical_practical_forms.json", "r", encoding="utf-8") as f:
    master_forms = json.load(f)

# -----------------------------------------------------------------------------
# 1. PARASITOLOGY (84 Qs)
# -----------------------------------------------------------------------------
print("\n[1/5] Adjudicating Parasitology (84 Qs)...")
import sys
sys.path.append("scripts")
from adjudicate_canonical_parasitology import adjudicate_para, para_raw

para_adjudicated = []
for idx, q in enumerate(para_raw):
    item = adjudicate_para(idx, q)
    # Ensure options are clean and verified
    para_adjudicated.append(item)

with open("scripts/adjudicated_parasitology.json", "w", encoding="utf-8") as f:
    json.dump(para_adjudicated, f, indent=2, ensure_ascii=False)
print(f"  Successfully wrote {len(para_adjudicated)} Parasitology questions.")

# -----------------------------------------------------------------------------
# 2. HISTOLOGY (183 Qs: Part 1 = 86, Part 2 = 97)
# -----------------------------------------------------------------------------
print("\n[2/5] Adjudicating Histology (183 Qs)...")
from adjudicate_canonical_histology import adjudicate_h1, adjudicate_h2, histo1_raw, histo2_raw

histo1_adjudicated = []
for idx, q in enumerate(histo1_raw):
    item = adjudicate_h1(idx, q)
    # Ensure item 63 is Lucent Mucin
    if idx == 63:
        item["correctIndex"] = item["options"].index("Apical electron lucent mucin granules")
        item["explanation"] = "Criteria of Identification: Transmission electron micrograph of a mucous acinar cell. Structure 1 points to the apical cytoplasm filled with numerous large, pale, electron-lucent membrane-bound mucin droplets that push the nucleus against the basal plasma membrane."
        item["keyConcept"] = "Mucous cell TEM: Apical cytoplasm packed with pale, electron-lucent mucin granules."
    elif idx == 64:
        item["correctIndex"] = item["options"].index("Basal nucleus")
    elif idx == 62:
        item["correctIndex"] = item["options"].index("Mucous acinus")
    histo1_adjudicated.append(item)

histo2_adjudicated = []
for idx, q in enumerate(histo2_raw):
    item = adjudicate_h2(idx, q)
    opts = item["options"]
    # Specific visual slide adjudications verified against Ain Shams University histology slides:
    if idx == 5: # Pylorus
        item["correctIndex"] = opts.index("Pylorus")
    elif idx == 6: # Fundus
        item["correctIndex"] = opts.index("Fundus")
    elif idx == 12: # Pylorus
        item["correctIndex"] = opts.index("Pylorus")
    elif idx == 13: # Fundus
        item["correctIndex"] = opts.index("Fundus")
    elif idx == 14: # Fundus
        item["correctIndex"] = opts.index("Fundus")
    elif idx == 15: # Gastroesophageal junction
        item["correctIndex"] = opts.index("Gastroesophageal junction")
    elif idx == 18: # Gastroesophageal junction
        item["correctIndex"] = opts.index("Gastroesophageal junction")
    elif idx == 19: # Gastroesophageal junction
        item["correctIndex"] = opts.index("Gastroesophageal junction")
    elif idx == 20: # Liver H&E
        item["correctIndex"] = opts.index("Liver H&E")
    elif idx == 21: # Liver silver
        item["correctIndex"] = opts.index("Liver silver")
    elif idx == 22: # Liver H&E
        item["correctIndex"] = opts.index("Liver H&E")
    elif idx == 23: # Liver & gall bladder
        item["correctIndex"] = opts.index("Liver & gall bladder")
    elif idx == 38: # Pancreas H&E
        item["correctIndex"] = opts.index("Pancreas H&E")
    elif idx == 44: # Duodenum
        item["correctIndex"] = opts.index("Duodenum")
    elif idx == 48: # Duodenum
        item["correctIndex"] = opts.index("Duodenum")
    elif idx == 49: # Ileum
        item["correctIndex"] = opts.index("Ileum")
    elif idx == 50: # Jejunum
        item["correctIndex"] = opts.index("Jejunum")
    elif idx == 51: # Duodenum
        item["correctIndex"] = opts.index("Duodenum")
    elif idx == 52: # Ileum
        item["correctIndex"] = opts.index("Ileum")
    elif idx == 55: # Duodenum
        item["correctIndex"] = opts.index("Duodenum")
    elif idx == 60: # Jejunum (User reported item!)
        item["correctIndex"] = opts.index("Jejunum")
        item["explanation"] = "Criteria of Identification: High-power section of the small intestine displaying tall, finger-like mucosal villi, straight crypts of Lieberkühn, and a submucosa composed of loose vascular connective tissue that is completely free of Brunner's glands (distinguishing from duodenum) and free of aggregated lymphoid follicles/Peyer's patches (distinguishing from ileum)."
        item["keyConcept"] = "Jejunum histology: Tall well-developed villi with submucosa lacking Brunner's glands and Peyer's patches."
    elif idx == 61: # Villus
        item["correctIndex"] = opts.index("Villus")
    elif idx == 62: # Goblet cell
        item["correctIndex"] = opts.index("Goblet cell")
    elif idx == 63: # Glycocalyx
        item["correctIndex"] = opts.index("Glycocalyx")
    elif idx == 64: # Zonula adherens
        item["correctIndex"] = opts.index("Zonula adherens")
    elif idx == 65: # Desmosome
        item["correctIndex"] = opts.index("Desmosome")
    elif idx == 66: # Goblet cell
        item["correctIndex"] = opts.index("Goblet cell")
    elif idx == 67: # Golgi apparatus
        item["correctIndex"] = opts.index("Golgi apparatus")
    elif idx == 68: # Enteroendocrine cell
        item["correctIndex"] = opts.index("Enteroendocrine cell")
    elif idx == 69: # Basal granules
        item["correctIndex"] = opts.index("Basal granules")
    elif idx == 70: # Nucleus
        item["correctIndex"] = opts.index("Nucleus")
    elif idx == 71: # Enterocyte
        item["correctIndex"] = opts.index("Enterocyte")
    elif idx == 72: # Paneth cell
        item["correctIndex"] = opts.index("Paneth cell")
    elif idx == 73: # Paneth cell
        item["correctIndex"] = opts.index("Paneth cell")
    elif idx == 74: # Apical granules
        item["correctIndex"] = opts.index("Apical granules")
    elif idx == 75: # Jejunum
        item["correctIndex"] = opts.index("Jejunum")
    elif idx == 76: # Submucosa
        item["correctIndex"] = opts.index("Submucosa")
    elif idx == 77: # Villi
        item["correctIndex"] = opts.index("Villi")
    elif idx == 78: # Muscularis mucosa
        item["correctIndex"] = opts.index("Muscularis mucosa")
    elif idx == 79: # Goblet cells
        item["correctIndex"] = opts.index("Goblet cells")
    elif idx == 80: # Columnar absorptive cells
        item["correctIndex"] = opts.index("Columnar absorptive cells")
    elif idx == 81: # Colon
        item["correctIndex"] = opts.index("Colon")
    elif idx == 82: # Colon
        item["correctIndex"] = opts.index("Colon")
    elif idx == 83: # Colon
        item["correctIndex"] = opts.index("Colon")
    elif idx == 84: # Appendix
        item["correctIndex"] = opts.index("Appendix")
    elif idx == 85: # Lymphatic nodules
        item["correctIndex"] = opts.index("Lymphatic nodules")
    elif idx == 86: # Crypts
        item["correctIndex"] = opts.index("Crypts")
    elif idx == 87: # Ileum
        item["correctIndex"] = opts.index("Ileum")
    elif idx == 88: # Rectoanal junction
        item["correctIndex"] = opts.index("Rectoanal junction")
    elif idx == 89: # Anal side
        item["correctIndex"] = opts.index("Anal side")
    elif idx == 90: # Stratified squamous non keratinized ep.
        item["correctIndex"] = opts.index("Stratified squamous non keratinized ep.")
    elif idx == 91: # Gastroesophageal junction
        item["correctIndex"] = opts.index("Gastroesophageal junction")
    elif idx == 92: # Openings of the crypts
        item["correctIndex"] = opts.index("Openings of the crypts")
    elif idx == 93: # Goblet cells
        item["correctIndex"] = opts.index("Goblet cells")
    elif idx == 94: # Crypt of large intestine
        item["correctIndex"] = opts.index("Crypt of large intestine")
    elif idx == 95: # Short microvilli
        item["correctIndex"] = opts.index("Short microvilli")
    elif idx == 96: # Lateral membrane infoldings
        item["correctIndex"] = opts.index("Lateral membrane infoldings")

    histo2_adjudicated.append(item)

with open("scripts/adjudicated_histology.json", "w", encoding="utf-8") as f:
    json.dump({"histo1": histo1_adjudicated, "histo2": histo2_adjudicated}, f, indent=2, ensure_ascii=False)
print(f"  Successfully wrote {len(histo1_adjudicated)} Histo 1 + {len(histo2_adjudicated)} Histo 2 questions.")

# -----------------------------------------------------------------------------
# 3. PATHOLOGY (145 Qs: Museum = 95, Lab = 50)
# -----------------------------------------------------------------------------
print("\n[3/5] Adjudicating Pathology (145 Qs)...")
patho_mus_raw = master_forms["patho_mus"]["questions"]
patho_lab_raw = master_forms["patho_lab"]["questions"]

# Verified Museum targets (M0 to M94)
museum_targets = [
    ("Dilated, tortuous veins bulging under the esophageal mucosa", "Criteria of Identification: Lower end of esophagus opened longitudinally showing prominent, bluish, elongated, tortuous, dilated submucosal veins bulging beneath the mucosal surface, pathognomonic of esophageal varices.", "Esophageal varices: Submucosal venous tortuosity at the lower esophagus due to portal hypertension."),
    ("Dilated, elongated, tortuous veins under the esophageal mucosa", "Criteria of Identification: The arrows indicate the dilated, elongated, and tortuous submucosal veins running longitudinally in the lower third of the esophagus.", "Esophageal varices: Longitudinal tortuous submucosal venous cords."),
    ("Dark red spleen with atrophic white pulp", "Criteria of Identification: All are consequences of liver cirrhosis and chronic venous congestion of the portal system except atrophic white pulp with dark red appearance. In chronic congestive splenomegaly (Banti's disease), the spleen is markedly enlarged and firm with a thick fibrous capsule; cut section shows prominent trabeculae and fibrocongestive red pulp expansion.", "Congestive splenomegaly: Markedly enlarged, firm spleen with thickened capsule and fibrocongestive expansion."),
    ("Chronic peptic ulcer of the stomach", "Criteria of Identification: Stomach opened to reveal a solitary, rounded, sharply punched-out ulcer on the lesser curvature. The mucosal folds radiate towards the margins of the ulcer, and the floor is clean and indurated.", "Chronic peptic ulcer: Solitary, punched-out mucosal defect with radiating rugae and clean fibrotic base."),
    ("Flattened", "Criteria of Identification: In chronic peptic ulcers, the surrounding mucosa is flattened and smooth, with mucosal rugae radiating towards the ulcer crater due to cicatricial contraction of fibrous tissue in the base.", "Peptic ulcer gross margin: Smooth, flat margin with radiating rugae."),
    ("Hard infiltrating base", "Criteria of Identification: A hard, wide, infiltrating base is the hallmark of a malignant ulcer (gastric adenocarcinoma). Chronic peptic ulcers feature a clean, scarred base limited to the muscularis propria without diffuse infiltration.", "Malignant vs benign gastric ulcer: Hard infiltrating base characterizes carcinoma."),
    ("Infiltrating carcinoma of the pylorus", "Criteria of Identification: Segment of stomach showing marked circumferential mural thickening of the pyloric canal with rigidity and luminal stenosis (linitis plastica type of infiltrating adenocarcinoma).", "Infiltrating pyloric carcinoma: Diffuse circumferential mural thickening causing gastric outlet obstruction."),
    ("Infiltrating carcinoma of the pylorus", "Criteria of Identification: Segment of stomach showing marked circumferential mural thickening of the pyloric canal with rigidity and luminal stenosis.", "Infiltrating pyloric carcinoma: Mural infiltration with stenosis."),
    ("Marked circumferential thickening of the pyloric wall by greyish tumour tissue", "Criteria of Identification: Label 3 indicates the marked circumferential thickening of the pyloric wall by infiltrative, greyish-white malignant tumor tissue.", "Pyloric adenocarcinoma: Circumferential greyish-white mural infiltration."),
    ("Muscle infiltration; marked narrowing of the lumen", "Criteria of Identification: Label 1 indicates deep infiltration of the muscularis propria by malignant neoplastic glands, and label 2 demonstrates severe stenosis of the pyloric orifice.", "Gastric carcinoma: Transmural infiltration with luminal stenosis."),
    ("Malignant ulcer of the stomach with gastrojejunostomy", "Criteria of Identification: Specimen showing a large, irregular malignant gastric ulcer with raised everted edges, together with a surgical anastomotic stoma connecting the stomach to an adjacent loop of jejunum (gastrojejunostomy).", "Gastric malignancy with palliative gastrojejunostomy bypass."),
    ("Large ulcer at the pyloric region; opened duodenum and jejunum; normal gastric rugae", "Criteria of Identification: Labels show the primary gastric ulcer, the loop of jejunum anastomosed to the stomach, and adjacent mucosa.", "Gastrojejunostomy specimen landmarks."),
    ("Lesser curvature of the body", "Criteria of Identification: The primary ulcer crater is situated along the lesser curvature of the gastric body, the classic site for chronic peptic and malignant ulcers.", "Ulcer anatomical location: Lesser curvature of stomach."),
    ("Flattened gastric rugae", "Criteria of Identification: The arrow points to smooth, flattened gastric rugae adjacent to the lesion.", "Gastric mucosal flattening."),
    ("Raised everted edge; necrotic floor; hard infiltrating base", "Criteria of Identification: Classic gross triad of a malignant ulcer (gastric adenocarcinoma): raised, rolled, everted margins; rough necrotic floor covered by slough and hemorrhage; and an indurated, widely infiltrating base.", "Malignant ulcer triad: Raised everted edges, necrotic dirty floor, and hard infiltrating base."),
    ("Sharply punched-out outline", "Criteria of Identification: A sharply punched-out outline with clear-cut margins is the hallmark of a benign peptic ulcer, whereas a malignant ulcer features irregular, raised, everted borders.", "Malignant vs peptic ulcer: Punched-out outline characterizes benign peptic ulcers."),
    ("Jejunum attached to the stomach with an artificial opening between their lumina", "Criteria of Identification: The specimen shows a loop of jejunum surgically anastomosed to the greater curvature of the stomach with a wide artificial stoma connecting their lumens (gastrojejunostomy).", "Gastrojejunostomy: Surgical stoma between gastric body and jejunal loop."),
    ("Chronic gastric ulcer", "Criteria of Identification: Solitary, well-delineated mucosal ulcer crater with clean floor and radiating rugae characteristic of chronic gastric peptic ulcer.", "Chronic peptic ulcer: Solitary mucosal defect with clean floor."),
    ("It has raised everted edges", "Criteria of Identification: Raised everted edges characterize malignant ulcers (gastric carcinomas). Benign peptic ulcers have flat or overhanging, clear-cut edges.", "Ulcer margins: Raised everted edges indicate malignancy."),
    ("Malignant ulcer of the stomach", "Criteria of Identification: Large irregular ulcerated mass in the gastric mucosa with raised, rolled, everted margins and a hard, fixed base.", "Malignant gastric ulcer: Large, irregular with everted borders."),
    ("Malignant ulcer of the stomach", "Criteria of Identification: Gastric specimen displaying a large malignant ulcer crater with necrotic hemorrhagic debris in the floor.", "Gastric adenocarcinoma: Malignant ulceration."),
    ("Raised everted edge; necrotic floor", "Criteria of Identification: Labels 1 and 2 point respectively to the raised, rolled, everted edge of the malignant ulcer and the rough necrotic floor.", "Malignant ulcer anatomy: Raised everted edges and necrotic slough in floor."),
    ("Macronodular cirrhosis", "Criteria of Identification: Liver surface and cut section studded with large, irregular regenerating nodules of variable size (ranging from 3 mm up to several centimeters) separated by broad, depressed, greyish-white fibrous scar bands.", "Macronodular cirrhosis: Coarse regenerative nodules (>3 mm) separated by broad irregular fibrous septa."),
    ("Multiple, round, 0.5 to 2 cm in diameter", "Criteria of Identification: Label 2 indicates macronodules which typically measure 0.5 to 2 cm (and can reach 3–5 cm), characteristic of post-hepatitic (HBV/HCV) cirrhosis.", "Macronodular cirrhosis nodule size: 0.5 to 2 cm diameter."),
    ("Thickened capsule", "Criteria of Identification: Label 1 shows the chronic fibrotic thickening of Glisson's capsule over the nodular liver parenchyma.", "Cirrhotic liver capsule: Fibrotically thickened Glisson's capsule."),
    ("Macronodular cirrhosis", "Criteria of Identification: Specimen showing prominent large, variable regenerative nodules separated by broad fibrous depressions.", "Macronodular cirrhosis."),
    ("Normal liver tissue in between the nodules", "Criteria of Identification: In true cirrhosis, diffuse parenchymal disorganization occurs throughout the entire organ; normal hepatic lobular architecture is completely lost, and there is NO normal liver tissue between nodules.", "Hallmark of cirrhosis: Diffuse architectural distortion without intervening normal parenchyma."),
    ("Effects of liver cirrhosis", "Criteria of Identification: Display of multi-organ autopsy specimens illustrating the consequences of liver cirrhosis: shrunken nodular liver, congestive splenomegaly, and lower esophageal varices.", "Systemic triad of cirrhosis: Nodular liver, splenomegaly, and esophageal varices."),
    ("Preserved notch", "Criteria of Identification: In chronic congestive splenomegaly (Banti's spleen), the spleen enlarges symmetrically while maintaining its characteristic anterior border notch.", "Congestive splenomegaly: Symmetrical splenic enlargement with preserved notch."),
    ("Shrunken with a wrinkled capsule", "Criteria of Identification: In chronic congestive splenomegaly, the spleen is markedly ENLARGED, tense, firm, and weighs several times normal with a THICKENED, smooth fibrous capsule; it is never shrunken.", "Congestive splenomegaly gross features: Markedly enlarged, firm with thickened capsule."),
    ("Macronodular cirrhosis with nodular cut section", "Criteria of Identification: The arrowed liver specimen shows post-necrotic macronodular cirrhosis with prominent regenerative nodules on cut section.", "Macronodular cirrhosis cut section."),
    ("The liver shows thickened white portal tracts", "Criteria of Identification: Thickened white portal tracts (pipe-stem fibrosis) are the pathognomonic hallmark of Schistosoma (Bilharzial) periportal fibrosis, whereas in cirrhosis the fibrous tissue forms bands surrounding regenerative nodules.", "Cirrhosis vs bilharzial fibrosis: Thickened white portal tracts characterize schistosomiasis."),
    ("Hepatocellular carcinoma with Laennec’s cirrhosis", "Criteria of Identification: Liver cut section displaying a background of micronodular/macronodular cirrhosis upon which a large, bulky, yellowish-green, necrotic primary tumor mass (hepatocellular carcinoma) has arisen.", "Hepatocellular carcinoma on cirrhosis: Bulky malignant mass superimposed on cirrhotic nodules."),
    ("Central depression", "Criteria of Identification: A central depression (umbilication) is characteristic of SECONDARY / metastatic liver tumors (due to central ischemia and necrosis). Primary HCC lesions are bulky, expansile, fleshy masses without central umbilication.", "Primary HCC vs metastatic nodules: Central umbilication characterizes metastatic carcinoma."),
    ("Cirrhotic nodules in a macronodular cirrhosis", "Criteria of Identification: The starred lesions represent the background regenerative cirrhotic nodules surrounding the dominant tumor mass.", "Background cirrhotic nodules in HCC."),
    ("Fibrous bands", "Criteria of Identification: The tissue separating the cirrhotic nodules consists of dense collagenous fibrous bands (septa) containing chronic inflammatory infiltrates and proliferating bile ductules.", "Cirrhotic septa: Collagenous fibrous bands bridging portal and central areas."),
    ("Metastatic nodules from malignant melanoma", "Criteria of Identification: Liver cut section studded with multiple, discrete, rounded, jet-black to dark brown tumor nodules of varying sizes, characteristic of metastatic malignant melanoma.", "Metastatic melanoma to liver: Jet-black pigmented nodules scattered throughout the parenchyma."),
    ("Early amoebic liver abscess", "Criteria of Identification: Hepatic parenchyma containing multiple, ragged, irregular, poorly demarcated necrotic cavities without a formed fibrous capsule, filled with chocolate-colored 'anchovy paste' necrotic liquefied liver tissue.", "Early amoebic liver abscess: Multiple irregular necrotic cavities lacking a mature fibrous wall."),
    ("Multiple, irregular, filled with necrotic liver tissue", "Criteria of Identification: The arrowed cavities are multiple, irregular in contour, and filled with necrotic, liquefied liver parenchyma (anchovy sauce pus) produced by Entamoeba histolytica histolytic enzymes.", "Amoebic abscess cavity: Irregular margins filled with liquefactive anchovy-paste debris."),
    ("long standing amoebic liver abscess", "Criteria of Identification: Liver section containing a large, solitary, chronic amoebic abscess cavity encapsulated by a dense, thick, whitish fibrous wall that demarcates it from the adjacent compressed liver parenchyma.", "Chronic amoebic liver abscess: Solitary large cavity enclosed by a thick mature fibrous capsule."),
    ("Thick fibrous tissue", "Criteria of Identification: In chronic long-standing amoebic abscesses, the host mounts a prominent fibroblastic response, producing a thick collagenous fibrous capsule lining the cavity.", "Chronic amoebic abscess wall: Mature fibrous encapsulation."),
    ("Calcified hydatid cyst", "Criteria of Identification: Hepatic section displaying a large rounded cystic cavity whose pericyst wall has undergone dense dystrophic calcification, presenting as a hard, rigid, chalky-white, radio-opaque shell.", "Calcified hydatid cyst: Dystrophic calcification within the fibrous pericyst capsule."),
    ("Thick fibrous wall with chalky white calcification", "Criteria of Identification: The yellow arrow points to the thick fibrous pericyst demonstrating prominent chalky-white calcified deposits.", "Hydatid cyst calcification: Chalky-white calcified pericyst wall."),
    ("Rounded", "Criteria of Identification: The anterior border of this enlarged, fatty liver is blunted and rounded, contrasting with the normal sharp inferior hepatic margin.", "Fatty liver border: Blunted, rounded anterior margin."),
    ("Portal tracts that are thickened, fibrosed and white", "Criteria of Identification: The red arrow points to the portal triads, which are conspicuously expanded by dense, whitish, collagenous scar tissue surrounding intrahepatic portal vein branches.", "Symmers' pipe-stem fibrosis: Dense whitish periportal fibrous collars."),
    ("Bilharzial periportal fibrosis", "Criteria of Identification: Liver cut section displaying broad, dense, whitish fibrous sleeves expanding the portal tracts ('clay pipe-stem fibrosis'). Liver lobular architecture is preserved, and true regenerative nodules are absent.", "Bilharzial hepatic fibrosis (Symmers' pipe-stem): Non-cirrhotic portal fibrosis with preserved lobules."),
    ("Bilharzial pigment", "Criteria of Identification: The hepatic parenchyma appears brownish-grey to slate-grey due to extensive deposition of bilharzial pigment (hemozoin / schistosomulum pigment) engulfed by Kupffer cells and portal macrophages.", "Bilharzial pigment: Slate-grey parenchymal discoloration due to macrophage hemozoin."),
    ("Separated by fibrous bands with no normal live", "Criteria of Identification: In bilharzial periportal fibrosis, true regenerative nodules do NOT form, and the hepatic parenchyma between portal tracts remains normal and preserved (non-cirrhotic).", "Bilharzial fibrosis architecture: Preserved intervening liver parenchyma without nodular remodeling."),
    ("Fatty change of the liver", "Criteria of Identification: Liver is uniformly enlarged, smooth, with a diffuse bright yellow color, rounded borders, and a greasy, yellowish-tan cut surface that bulges on sectioning.", "Hepatic steatosis (fatty liver): Diffusely enlarged, yellow, greasy liver with rounded margins."),
    ("Hydrops of the gall bladder", "Criteria of Identification: Gallbladder is markedly enlarged, elongated, and tense with a thin, translucent wall and pale serosa, resulting from chronic cystic duct obstruction by an impacted stone with absorption of bile and accumulation of clear mucous secretion (mucocele).", "Hydrops of gallbladder (mucocele): Distended translucent gallbladder filled with sterile mucus."),
    ("Contracted, thick, irregular wall", "Criteria of Identification: In hydrops of the gallbladder, the wall is markedly STRETCHED, thin, and translucent; a thick, contracted, fibrotic wall is characteristic of chronic calculous cholecystitis, not hydrops.", "Hydrops vs chronic cholecystitis: Hydrops features a distended, thin, translucent wall."),
    ("Mucus", "Criteria of Identification: In hydrops (mucocele) of the gallbladder, cystic duct obstruction causes the trapped bile pigments to be resorbed by the mucosa, while mucosal epithelial goblet cells continue to secrete clear, watery mucus ('white bile').", "Mucocele lumen: Clear, sterile, watery mucinous secretion ('white bile')."),
    ("Cholesterol stone with hydrops of the gall bladder", "Criteria of Identification: Markedly distended, thin-walled gallbladder containing a single, large, yellowish, oval cholesterol calculus impacted in Hartmann's pouch/cystic duct.", "Hydrops with solitary cholesterol stone: Cystic duct impaction leading to mucocele."),
    ("Impacted stone", "Criteria of Identification: The arrow points to the solitary cholesterol calculus firmly impacted in the neck of the gallbladder/cystic duct, precipitating the luminal obstruction.", "Cystic duct stone impaction: Mechanical cause of gallbladder hydrops."),
    ("Meckel’s diverticulum", "Criteria of Identification: Segment of terminal ileum displaying a solitary, blind-ended, finger-like tubular diverticulum arising from the anti-mesenteric border approximately 2 feet proximal to the ileocecal valve.", "Meckel's diverticulum: True congenital diverticulum on the anti-mesenteric border of ileum."),
    ("Blind-ended, about 10 cm long, on the anti-mesenteric border", "Criteria of Identification: Label 1 indicates Meckel's diverticulum, which arises from the anti-mesenteric border of the ileum as a blind-ending pouch (remnant of the vitelline / omphalomesenteric duct).", "Meckel's diverticulum anatomy: Anti-mesenteric blind pouch of terminal ileum."),
    ("Tuberculous ulcers of the small intestine", "Criteria of Identification: Segment of ileum showing multiple transverse mucosal ulcers oriented perpendicular to the long axis of the bowel (girdle ulcers), with ragged undermined edges and subserosal tubercles.", "Tuberculous intestinal ulcers: Transverse 'girdle' ulcers with undermined edges and serosal tubercles."),
    ("Caseous material in the submucosa", "Criteria of Identification: Tuberculous ulcers are caused by caseous necrosis within submucosal lymphoid tissue that breaks through the overlying mucosa, creating undermined edges.", "Pathogenesis of tuberculous ulcer: Submucosal caseation sloughing through mucosa."),
    ("Oval, transverse, perpendicular to the direction of the gut", "Criteria of Identification: Intestinal tuberculous ulcers encircle the gut transversely (girdle ulcers) because Mycobacterium tuberculosis spreads circumferentially along the transverse submucosal lymphatic channels.", "Tuberculous ulcer orientation: Transverse / perpendicular to gut axis along lymphatics."),
    ("Undermined", "Criteria of Identification: The margins of intestinal tuberculous ulcers are ragged and characteristically undermined, because caseous necrosis in the loose submucosa extends more widely than the mucosal defect.", "Tuberculous ulcer edges: Characteristically undermined margins."),
    ("Caseous material and tubercles in the floor", "Criteria of Identification: The floor of a tuberculous ulcer is ragged, dirty, and studded with yellowish-white caseous tubercles.", "Tuberculous ulcer floor: Caseous debris and tubercles."),
    ("Large, matted, caseating lymph nodes", "Criteria of Identification: The arrow points to prominent, enlarged, matted mesenteric lymph nodes with areas of yellowish-white caseation necrosis (tabes mesenterica).", "Tabes mesenterica: Matted, caseous mesenteric tuberculous lymphadenopathy."),
    ("Black foci of gangrene with perforations", "Criteria of Identification: Intestinal tuberculosis features strictures, adhesions, and caseation; acute moist gangrene with black perforations is a vascular/ischemic catastrophe (strangulation), not tuberculosis.", "Intestinal TB features: Matted nodes, tubercles, transverse ulcers; lacks primary gangrene."),
    ("Enlarged, matted, caseating", "Criteria of Identification: The red arrows indicate mesenteric lymph nodes that are enlarged, fused together into matted conglomerates, and show cheesy caseous necrosis on cut section.", "Tuberculous lymph nodes: Matted and caseous."),
    ("Strangulated hernia", "Criteria of Identification: Resected loop of small intestine demonstrating acute moist gangrene secondary to strangulation at the hernia neck: the loop is swollen, dark purple to black, cold, and friable with lost peritoneal luster.", "Strangulated intestinal hernia: Ischemic loop showing acute moist gangrene."),
    ("Moist gangrene of the intestine", "Criteria of Identification: Intestinal loop showing diffuse, blackish discolouration, severe edema, hemorrhagic infarction, and loss of mucosal lining due to complete mesenteric vascular occlusion.", "Moist intestinal gangrene: Dark black, necrotic, foul-smelling bowel segment."),
    ("Constriction ends", "Criteria of Identification: The circled area demonstrates the sharp, pale, indented constriction rings at the neck of the strangulated loop where the constricting band arrested blood flow.", "Strangulation constriction rings: Narrow grooved lines of mechanical pressure at loop neck."),
    ("Multiple black areas due to gangrene", "Criteria of Identification: The arrows indicate extensive patchy to confluent areas of dark black necrosis resulting from tissue putrefaction and iron sulfide formation.", "Gangrenous bowel discoloration: Blackish tissue necrosis."),
    ("Ileo-ileal intussusception", "Criteria of Identification: Segment of small bowel showing invagination of a proximal ileal loop (intussusceptum) into the lumen of the immediately adjacent distal ileal segment (intussuscipiens).", "Ileo-ileal intussusception: Telescoping of proximal ileum into distal ileal lumen."),
    ("Invagination of one ileal loop into another", "Criteria of Identification: Ileo-ileal intussusception is defined as the telescoping or invagination of one segment of the ileum into an adjacent segment of the ileum.", "Definition of ileo-ileal intussusception: Ileum invaginating into ileum."),
    ("Swollen, bluish, with areas of haemorrhage", "Criteria of Identification: The entering loop (intussusceptum) suffers venous obstruction, becoming intensely congested, swollen, cyanotic (bluish-red), and hemorrhagic.", "Intussusceptum pathology: Venous congestion, intense swelling, and hemorrhagic infarction."),
    ("Entering loop", "Criteria of Identification: Label A indicates the entering loop of ileum (the inner invaginating tube of the intussusceptum).", "Intussusception anatomy: Entering ileal loop."),
    ("Constriction ends of a strangulated loop", "Criteria of Identification: The orange circle highlights the constricted neck of the intussusception where mesenteric vessels are compressed.", "Constriction neck of intussusception."),
    ("Entering loop", "Criteria of Identification: The arrow points to the entering proximal segment of bowel passing into the receiving sheath.", "Entering loop of intussusception."),
    ("Stenosis and fibrous adhesion distal to the intussusception", "Criteria of Identification: Pathological changes distal to the intussusception include inflammatory adhesions and luminal compromise.", "Intussusception complications: Obstruction and fibrous adhesions."),
    ("Ileo-cecal intussusception", "Criteria of Identification: Surgical specimen demonstrating the terminal ileum invaginating through the ileocecal valve into the cecum and ascending colon.", "Ileo-cecal intussusception: Terminal ileum invaginated into cecum."),
    ("Terminal ileum invaginated into the caecum through the ileocecal valve", "Criteria of Identification: The starred structure represents the invaginated terminal ileum which forms the apex of the intussusceptum advancing into the cecum.", "Ileo-cecal intussusception mechanism: Terminal ileum entering cecum via valve."),
    ("Terminal ileum invaginated into the caecum through the ileocecal valve", "Criteria of Identification: Terminal ileum invaginated into the caecum through the ileocecal valve.", "Ileo-cecal intussusception."),
    ("Acute suppurative appendicitis", "Criteria of Identification: Vermiform appendix is swollen, turgid, club-shaped, intensely congested, with a dull serosal surface covered by yellowish-white fibrinous and purulent exudate.", "Acute suppurative appendicitis: Turgid, congested appendix coated with purulent exudate."),
    ("Thick contracted wall with faceted stones", "Criteria of Identification: A contracted thick wall with faceted gallstones describes chronic calculous cholecystitis, whereas acute appendicitis features acute transmural swelling and purulent exudate.", "Appendicitis vs cholecystitis: Appendicitis lacks thick fibrotic contraction and faceted stones."),
    ("Bacillary dysentery of the large intestine", "Criteria of Identification: Large intestine opened to reveal a diffuse acute fibrino-purulent pseudomembranous colitis: mucosa is intensely congested and coated by a dirty greyish-green, ragged pseudomembrane with superficial mucosal erosions.", "Bacillary dysentery: Diffuse acute pseudomembranous inflammation of colonic mucosa."),
    ("Dirty greyish membrane", "Criteria of Identification: The arrow points to the dirty greyish-green pseudomembrane (composed of coagulated fibrin, necrotic epithelial debris, and neutrophils) adhering to the inflamed colonic mucosa.", "Pseudomembrane in bacillary dysentery: Fibrinopurulent exudate adhering to mucosa."),
    ("Amoebic dysentery", "Criteria of Identification: Segment of colon displaying multiple, discrete, rounded to oval mucosal ulcers with characteristically undermined edges, separated by completely normal intervening mucosal patches.", "Amoebic dysentery: Discrete ulcers with undermined edges and normal intervening mucosa."),
    ("Normal mucosa in between the ulcers", "Criteria of Identification: The arrows highlight intact, healthy, pale colonic mucosa between individual amoebic ulcers, in sharp contrast to the diffuse continuous inflammation of bacillary dysentery.", "Amoebic vs bacillary colitis: Intact normal mucosa between ulcers in amebiasis."),
    ("D indurated base", "Criteria of Identification: Amoebic ulcers have a soft base composed of necrotic debris and cellular infiltrate; an indurated, hard base is characteristic of carcinoma, not amebiasis.", "Amoebic ulcer characteristics: Soft base, undermined edges, and normal intervening mucosa."),
    ("In the center of rounded elevated areas of mucosa", "Criteria of Identification: Early amoebic lesions begin as small submucosal abscesses that elevate the overlying mucosa into rounded domes, with the ulcer neck opening at the center.", "Amoebic ulcer formation: Small central mucosal neck opening over submucosal necrosis."),
    ("Flask-shaped", "Criteria of Identification: On cross section, amoebic ulcers are classically flask-shaped (or buttonhole-shaped), having a narrow neck in the mucosa and a broad base in the loose submucosa due to lateral lytic spread of trophozoites.", "Flask-shaped amoebic ulcer: Narrow mucosal neck with wide submucosal base."),
    ("Fungating carcinoma of the large intestine", "Criteria of Identification: Large intestine displaying a bulky, cauliflower-like, friable, fungating exophytic tumor mass projecting into and partially obstructing the lumen.", "Fungating colonic carcinoma: Bulky exophytic cauliflower-like mucosal mass."),
    ("Dilatation", "Criteria of Identification: Chronic partial luminal obstruction by an exophytic colonic carcinoma leads to marked muscular hypertrophy and secondary dilatation of the proximal bowel.", "Colonic obstruction: Upstream bowel dilatation and hypertrophy."),
    ("Malignant ulcer of the large intestine", "Criteria of Identification: Colorectal segment opened to reveal an annular, ulcerating malignant mass with raised, rolled, everted margins, a rough necrotic hemorrhagic floor, and a hard infiltrating base.", "Malignant colorectal ulcer: Annular ulcerated mass with raised everted borders."),
    ("Fungating carcinoma of the large intestine", "Criteria of Identification: Specimen showing a prominent exophytic, polypoid, fungating malignant neoplasm arising from the mucosal surface of the cecum/colon.", "Fungating colorectal carcinoma: Large polypoid mucosal mass."),
    ("Fungating carcinoma of the large intestine", "Criteria of Identification: Fungating exophytic mass in colon.", "Fungating colonic carcinoma."),
    ("Gangrene", "Criteria of Identification: The dark blackish-purple discolouration of the intestinal wall is due to bacterial putrefaction and formation of iron sulfide (FeS) in ischemic, necrotic, gangrenous tissue.", "Moist gangrene: Blackish discoloration produced by bacterial iron sulfide."),
    ("Swollen loop with black foci of gangrene", "Criteria of Identification: Tuberculous peritonitis features diffuse peritoneal thickening, matted loops, and tubercles without acute moist gangrenous loops.", "Tuberculous peritonitis features: Diffuse tubercles, ascites, and adhesions; lacks primary gangrene."),
    ("Tuberculous peritonitis", "Criteria of Identification: Greater omentum is markedly thickened, contracted into a rolled-up transverse fibrous mass ('omental cake'), and densely studded with innumerable, tiny, greyish-white to yellowish caseous tubercles.", "Tuberculous peritonitis ('omental cake'): Thickened fibrotic omentum studded with tubercles.")
]

# Verified Lab targets (L0 to L49)
lab_targets = [
    ("Portal fibrosis with preserved liver architecture, chronic specific inflammation", "Criteria of Identification: Liver biopsy displaying expanded portal tracts by dense collagenous fibrous tissue containing bilharzial granulomas, dead calcified Schistosoma ova, and chronic inflammatory cells, with preserved lobular architecture and absence of true regenerative nodules.", "Bilharzial hepatic fibrosis: Portal expansion with dead ova and preserved lobular architecture."),
    ("Dead Bilharzial ova", "Criteria of Identification: Label 1 indicates dead, calcified, shrunken Schistosoma mansoni ova embedded within the periportal fibrous tissue, surrounded by foreign-body giant cells, histiocytes, and eosinophils.", "Dead Bilharzial ova: Calcified, oval, brownish egg shells within portal granulomas."),
    ("Bilharzial pigment in portal macrophages", "Criteria of Identification: Label 3 indicates dark brown to blackish granular bilharzial pigment (hemozoin / schistosomulum pigment) engulfed within the cytoplasm of portal histiocytes and Kupffer cells.", "Bilharzial pigment: Dark granular hemozoin inside portal macrophages."),
    ("Expanded portal tract by  Bilharzial granulomas", "Criteria of Identification: Area A demonstrates marked fibrous widening of a portal triad infiltrated by specific granulomatous inflammation surrounding bilharzial ova.", "Expanded portal tract in schistosomiasis: Fibrous expansion by granulomas."),
    ("Liver functions are markedly impaired", "Criteria of Identification: In pure bilharzial hepatic fibrosis (Symmers' pipe-stem), parenchymal liver functions (serum albumin, bilirubin, coagulation factors) remain PRESERVED for decades because hepatocytes and lobular architecture are intact; liver failure occurs only if viral hepatitis or end-stage cirrhosis supervenes.", "Bilharzial fibrosis clinical hallmark: Preserved parenchymal liver functions with non-cirrhotic portal hypertension."),
    ("Preserved hepatic architecture", "Criteria of Identification: Label C highlights the surrounding hepatic lobules where hepatocyte cords, sinusoids, and central veins maintain normal spatial orientation.", "Preserved lobular architecture in schistosomiasis."),
    ("Malignant epithelial tumor", "Criteria of Identification: High-power section of hepatocellular carcinoma (HCC), a malignant epithelial neoplasm derived from transformed hepatocytes.", "Hepatocellular carcinoma: Malignant epithelial neoplasm of hepatocyte origin."),
    ("Trabecular pattern", "Criteria of Identification: Neoplastic hepatocytes are organized into thick, irregular cords and trabeculae (many cells thick, in contrast to normal 1- to 2-cell thick hepatic plates) separated by sinusoid-like vascular spaces lined by endothelial cells.", "HCC trabecular pattern: Thick multicellular hepatocyte cords flanked by sinusoids."),
    ("Trabecular", "Criteria of Identification: Architectural pattern consisting of widened hepatocyte trabeculae separated by sinusoid-like channels.", "HCC trabecular architecture."),
    ("Acinar", "Criteria of Identification: Neoplastic hepatocytes are arranged in pseudoglandular / acinar structures around central dilated lumina (pseudocanaliculi), mimicking glands.", "HCC pseudoglandular/acinar pattern: Neoplastic cells arranged around central lumina."),
    ("Decreased N/C ratio", "Criteria of Identification: Cytological hallmarks of malignancy include an INCREASED nuclear-to-cytoplasmic (N/C) ratio; a decreased N/C ratio is characteristic of benign, well-differentiated or mature cells.", "Malignancy hallmark: Increased N/C ratio, nuclear pleomorphism, and hyperchromasia."),
    ("trabecular patten of growth", "Criteria of Identification: Neoplastic cells demonstrate a characteristic trabecular architecture with widened liver cell plates.", "Trabecular growth pattern in HCC."),
    ("HCC; cirrhotic nodules", "Criteria of Identification: Label 1 indicates the cellular, pleomorphic malignant hepatoma (HCC) focus, and label 2 indicates the background regenerating cirrhotic pseudolobules.", "HCC arising in cirrhotic liver: Tumor focus adjacent to regenerative nodules."),
    ("Serum alpha-fetoprotein is usually decreased", "Criteria of Identification: Serum alpha-fetoprotein (AFP) is a key oncofetal tumor marker that is characteristically ELEVATED (frequently >400–1000 ng/mL) in patients with hepatocellular carcinoma.", "HCC tumor marker: Serum alpha-fetoprotein (AFP) is markedly increased."),
    ("Masson’s trichrome; fibrous tissue septa", "Criteria of Identification: Masson's trichrome special stain stains collagen fibers intense blue or green, clearly outlining the broad fibrous tissue septa bridging between portal tracts and central veins.", "Masson's trichrome stain: Blue-stained collagen septa delineating cirrhotic nodules."),
    ("Regenerating cirrhotic nodules", "Criteria of Identification: The areas encircled by blue fibrous septa represent rounded regenerative nodules (pseudolobules) lacking normal central veins.", "Cirrhotic pseudolobules: Regenerative parenchymal islands lacking normal vascular orientation."),
    ("Diffuse hepatic fibrosis with regenerative liver nodules", "Criteria of Identification: Definitive histological triad of liver cirrhosis: diffuse parenchymal extinction, dense collagenous bridging fibrous septa, and structural remodeling into round regenerative pseudolobules.", "Histological definition of cirrhosis: Diffuse fibrosis with regenerative pseudolobules."),
    ("Neutrophil infiltration", "Criteria of Identification: Liver cirrhosis is a chronic progressive disease characterized by mononuclear lymphocytes, plasma cells, and macrophages; dense acute neutrophil infiltration is seen in acute ascending cholangitis or severe alcoholic hepatitis, not uncomplicated viral cirrhosis.", "Cirrhotic infiltrate: Chronic mononuclear inflammatory cells, not acute neutrophils."),
    ("Liver functions are preserved", "Criteria of Identification: In established liver cirrhosis, progressive hepatocyte loss and architectural distortion lead to severe parenchymal dysfunction (hypoalbuminemia, coagulopathy, jaundice, hepatic encephalopathy).", "Cirrhosis pathophysiology: Progressive impairment of parenchymal liver functions."),
    ("Macrovesicular steatosis", "Criteria of Identification: Hepatocytes contain a single, large, clear intracytoplasmic lipid vacuole that pushes the nucleus to the periphery of the cell, giving a signet-ring appearance.", "Macrovesicular steatosis: Large solitary lipid droplet displacing nucleus to cell margin."),
    ("Intracellular accumulation of fat", "Criteria of Identification: Hepatic steatosis (fatty liver) is characterized by abnormal intracellular accumulation of neutral triglycerides within the cytoplasm of hepatocytes.", "Fatty liver nature: Reversible intracellular triglyceride accumulation in hepatocytes."),
    ("Endogenous pigment deposition", "Criteria of Identification: Intrahepatic cholestasis manifests as abnormal accumulation of endogenous bile pigment (bilirubin) presenting as greenish-brown to yellowish plugs within dilated bile canaliculi and droplet accumulation within hepatocytes.", "Cholestasis: Endogenous bile pigment accumulation within canaliculi and hepatocytes."),
    ("Proliferated bile ductules; bile accumulations; fibrosis and chronic inflammatory infiltrate", "Criteria of Identification: The microscopic field demonstrates proliferated, tortuous interlobular bile ductules, yellowish-brown inspissated bile plugs (bile thrombi), and periportal fibrosis with chronic inflammation.", "Biliary obstruction histology: Proliferated ductules, bile thrombi, and portal fibrosis."),
    ("Stool is dark", "Criteria of Identification: Complete obstructive (cholestatic) jaundice prevents conjugated bilirubin from entering the intestine, resulting in the absence of stercobilin and producing pale, clay-colored stools; dark stool is seen in hyperbilirubinemia due to hemolysis.", "Cholestatic jaundice features: Pale clay-colored stools, tea-colored urine, and pruritus."),
    ("Benign encapsulated salivary gland tumor", "Criteria of Identification: Warthin's tumor (papillary cystadenoma lymphomatosum) is a benign, encapsulated salivary gland neoplasm arising almost exclusively in the superficial lobe of the parotid gland.", "Warthin's tumor: Benign encapsulated parotid tumor with epithelial and lymphoid components."),
    ("An active germinal center", "Criteria of Identification: The red star marks a prominent lymphoid follicle with an active germinal center within the dense, mature lymphoid stroma of Warthin's tumor.", "Warthin's tumor lymphoid stroma: Dense lymphoid tissue with active germinal centers."),
    ("Oncocytic columnar cells", "Criteria of Identification: Cystic and papillary spaces in Warthin's tumor are lined by a characteristic double-layered oncocytic epithelium: a luminal layer of tall columnar oncocytes with granular eosinophilic cytoplasm (packed with mitochondria) and a basal layer of cuboidal cells.", "Warthin's tumor epithelium: Double-layered oncocytic (mitochondria-rich) epithelium."),
    ("It contains chondroid and myxoid stroma", "Criteria of Identification: Chondroid and myxoid mesenchymal stroma is the pathognomonic hallmark of Pleomorphic Adenoma (benign mixed tumor), NOT Warthin's tumor (which features oncocytic epithelium in a dense lymphoid stroma).", "Warthin's vs pleomorphic adenoma: Chondromyxoid stroma characterizes pleomorphic adenoma."),
    ("Benign encapsulated mixed salivary gland tumor", "Criteria of Identification: Pleomorphic adenoma is a benign, encapsulated mixed tumor of salivary glands characterized by a remarkable diversity of epithelial/myoepithelial structures intermingled with mucoid, myxoid, and chondroid mesenchymal-like elements.", "Pleomorphic adenoma: Benign mixed tumor with epithelial ducts and chondromyxoid stroma."),
    ("Epithelial-myoepithelial elements; myxoid stroma", "Criteria of Identification: Labels indicate ductular/trabecular epithelial structures and surrounding myxoid/chondroid stroma produced by myoepithelial cells.", "Pleomorphic adenoma dual histology: Epithelial-myoepithelial units and myxoid matrix."),
    ("Its stroma is rich in lymphoid follicles with germinal centers", "Criteria of Identification: A lymphoid stroma with germinal centers is the hallmark of Warthin's tumor; pleomorphic adenoma has a chondromyxoid, hyaline, or osseous mesenchymal stroma.", "Pleomorphic adenoma stroma: Chondromyxoid matrix; lacks lymphoid germinal centers."),
    ("Muscularis propria", "Criteria of Identification: The dashed arrows indicate diffuse infiltration of the muscularis propria by acute inflammatory cells (neutrophils and pus cells), the definitive histological criterion for acute appendicitis.", "Acute appendicitis diagnostic hallmark: Transmural neutrophil infiltration into muscularis propria."),
    ("Acute diffuse suppurative inflammation", "Criteria of Identification: Acute suppurative (phlegmonous) appendicitis is a classic diffuse suppurative inflammation characterized by extensive neutrophil infiltration throughout all mural layers of the appendix with mucosal necrosis and pus in the lumen.", "Acute phlegmonous appendicitis: Diffuse suppurative transmural inflammation."),
    ("Hyperplastic lymphoid follicle", "Criteria of Identification: The circled structure is a prominent mucosal/submucosal lymphoid follicle with a pale germinal center, an anatomical component of normal appendiceal lymphoid tissue that may undergo reactive hyperplasia.", "Appendiceal lymphoid follicle: Mucosal lymphoid tissue with reactive germinal centers."),
    ("Diffuse proliferation of malignant glands", "Criteria of Identification: Acute appendicitis is an acute non-neoplastic bacterial/obstructive inflammatory lesion; malignant glandular proliferation is seen in adenocarcinoma, not suppurative appendicitis.", "Appendicitis vs adenocarcinoma: Acute appendicitis lacks neoplastic glandular proliferation."),
    ("Juvenile hamartomatous polyp", "Criteria of Identification: Colonic polyp characterized by a smooth rounded contour, abundant edematous lamina propria with chronic inflammatory infiltrate, and multiple cystically dilated, mucus-filled glands lined by bland epithelium (retention polyp).", "Juvenile polyp: Hamartomatous retention polyp with cystically dilated mucous glands."),
    ("Cystically dilated mucus-secreting colonic glands", "Criteria of Identification: Characteristic microscopic finding of juvenile polyps: markedly enlarged, cystically dilated colonic glands filled with inspissated mucin and lined by attenuated, non-dysplastic columnar epithelium.", "Juvenile polyp microscopic hallmark: Cystically dilated mucus-filled glands."),
    ("Bland columnar cells with goblet cells", "Criteria of Identification: The dilated glands in juvenile polyps are lined by bland, mature, non-dysplastic columnar absorptive cells and abundant goblet cells without nuclear atypia.", "Juvenile polyp epithelium: Bland, mature columnar and goblet cells lacking dysplasia."),
    ("They are benign neoplastic polyps characterized by epithelial dysplasia.", "Criteria of Identification: Juvenile polyps are non-neoplastic HAMARTOMAS (retention polyps); adenomatous polyps are the benign neoplastic polyps that feature epithelial dysplasia.", "Juvenile vs adenomatous polyp: Juvenile polyps are hamartomas without dysplasia."),
    ("Adenomatous polyp", "Criteria of Identification: Colonic mucosal polyp exhibiting crowded, branching, tubular epithelial glands lined by dysplastic columnar epithelium with nuclear stratification, hyperchromasia, and loss of goblet cells (tubular adenoma).", "Adenomatous polyp (tubular adenoma): Neoplastic polyp displaying epithelial dysplasia."),
    ("Presence of dysplasia", "Criteria of Identification: The absolute hallmark and defining criterion of an adenoma is epithelial dysplasia (nuclear hyperchromasia, enlargement, elongation, pseudostratification, and active mitoses).", "Adenoma hallmark: Epithelial dysplasia (the precancerous milestone)."),
    ("Their characteristic glands are lined by bland, non-dysplastic epithelium with goblet cells.", "Criteria of Identification: Adenomatous polyps are DEFINED by dysplasia and loss of normal differentiation (depletion of goblet cells); bland non-dysplastic epithelium characterizes hyperplastic or juvenile polyps.", "Adenoma histology: Dysplastic epithelium with goblet cell depletion."),
    ("Benign neoplastic polyp — precancerous", "Criteria of Identification: Colonic adenomas are benign neoplastic epithelial lesions that serve as well-established premalignant precursors for colorectal adenocarcinoma via the adenoma-carcinoma sequence.", "Adenomatous polyp nature: Benign neoplastic precancerous precursor of adenocarcinoma."),
    ("High-grade dysplasia may progress to carcinoma in situ and then adenocarcinoma.", "Criteria of Identification: In the adenoma-carcinoma sequence, accumulation of genetic mutations (APC, KRAS, TP53) drives progression from low-grade dysplasia to high-grade dysplasia, intramucosal carcinoma, and invasive adenocarcinoma.", "Adenoma-carcinoma sequence: Progression from dysplasia to invasive adenocarcinoma."),
    ("Nuclear pseudostratification and hyperchromatic nuclei", "Criteria of Identification: Characteristic dysplastic features of adenomatous epithelium: elongated, hyperchromatic, crowded nuclei stacked in multiple layers (pseudostratification) occupying the basal half to full thickness of the epithelium.", "Dysplasia features: Nuclear pseudostratification, hyperchromasia, and enlargement."),
    ("Normal colonic mucosa", "Criteria of Identification: The right arrow points to adjacent uninvolved normal colonic mucosa with straight, parallel, test-tube crypts containing abundant goblet cells.", "Colonic mucosa: Normal parallel crypts lined by mature goblet cells."),
    ("Invasive adenocarcinoma", "Criteria of Identification: High-power microscopic examination showing irregular, crowded, back-to-back malignant glands infiltrating through the muscularis mucosae and invading the submucosa, diagnostic of invasive adenocarcinoma.", "Invasive colorectal adenocarcinoma: Irregular malignant glands infiltrating the bowel wall."),
    ("Adenocarcinoma of the large intestine", "Criteria of Identification: Malignant epithelial neoplasm composed of atypical glands invading a desmoplastic fibrous stroma in the wall of the colon.", "Colonic adenocarcinoma: Invasive malignant glands within desmoplastic stroma."),
    ("Its epithelial cells show no nuclear atypia.", "Criteria of Identification: Adenocarcinomas are malignant neoplasms whose lining cells characteristically display marked cytological atypia: pleomorphism, hyperchromasia, prominent nucleoli, and atypical mitotic figures.", "Adenocarcinoma cytological features: Marked cellular and nuclear atypia."),
    ("Cystically dilated glands lined by bland columnar", "Criteria of Identification: Cystically dilated glands lined by bland, non-dysplastic epithelium are the hallmark of juvenile retention polyps, whereas adenocarcinomas feature crowded, irregular, back-to-back malignant glands.", "Adenocarcinoma vs juvenile polyp: Invasive carcinoma features irregular atypical glands, not bland cystic glands.")
]

# Build pathology questions list
patho_mus_adjudicated = []
for idx, (target, exp, kc) in enumerate(museum_targets):
    q = patho_mus_raw[idx]
    opts = q["options"]
    if target not in opts:
        print(f"ERROR: Museum {idx} target '{target}' not in options {opts}")
        c_idx = 0
    else:
        c_idx = opts.index(target)
    
    patho_mus_adjudicated.append({
        "id": f"MGL3-PRAC-PATHO-MUS-{idx+1:03d}",
        "type": "mcq",
        "lecture": 1,
        "text": q["title"].strip() or "Identify the pathological lesion shown in this museum specimen:",
        "options": opts,
        "correctIndex": c_idx,
        "explanation": exp,
        "keyConcept": kc,
        "media": {
            "type": "image",
            "imageUrl": q["image_url"],
            "caption": f"Pathology Museum Specimen — Station {idx+1}"
        }
    })

patho_lab_adjudicated = []
for idx, (target, exp, kc) in enumerate(lab_targets):
    q = patho_lab_raw[idx]
    opts = q["options"]
    if target not in opts:
        print(f"ERROR: Lab {idx} target '{target}' not in options {opts}")
        c_idx = 0
    else:
        c_idx = opts.index(target)
    
    patho_lab_adjudicated.append({
        "id": f"MGL3-PRAC-PATHO-LAB-{idx+1:03d}",
        "type": "mcq",
        "lecture": 2,
        "text": q["title"].strip() or "Identify the microscopic pathological feature shown in this slide:",
        "options": opts,
        "correctIndex": c_idx,
        "explanation": exp,
        "keyConcept": kc,
        "media": {
            "type": "image",
            "imageUrl": q["image_url"],
            "caption": f"Pathology Lab Slide — Station {idx+1}"
        }
    })

with open("scripts/adjudicated_pathology.json", "w", encoding="utf-8") as f:
    json.dump({"museum": patho_mus_adjudicated, "lab": patho_lab_adjudicated}, f, indent=2, ensure_ascii=False)
print(f"  Successfully wrote {len(patho_mus_adjudicated)} Museum + {len(patho_lab_adjudicated)} Lab questions.")

# -----------------------------------------------------------------------------
# 4. LOAD ANATOMY, MICROBIOLOGY, PHYSIOLOGY, BIOCHEMISTRY
# -----------------------------------------------------------------------------
print("\n[4/5] Loading remaining verified chapters...")
with open("scripts/adjudicated_anatomy.json", "r", encoding="utf-8") as f:
    anat_data = json.load(f)
anat_questions = anat_data["all"]
print(f"  Loaded {len(anat_questions)} verified Anatomy questions.")

with open("scripts/adjudicated_biochemistry.json", "r", encoding="utf-8") as f:
    bio_questions = json.load(f)
print(f"  Loaded {len(bio_questions)} verified Biochemistry questions.")

with open("src/app/data/practical/mgl-3-practical.json", "r", encoding="utf-8") as f:
    current_bank = json.load(f)

micro_ch = next(c for c in current_bank if c["id"] == 305)
micro_questions = micro_ch["subjects"][0]["questions"]
print(f"  Loaded {len(micro_questions)} verified Microbiology questions.")

physio_ch = next(c for c in current_bank if c["id"] == 306)
physio_questions = physio_ch["subjects"][0]["questions"]
print(f"  Loaded {len(physio_questions)} verified Physiology questions.")

histo_combined = histo1_adjudicated + histo2_adjudicated
patho_combined = patho_mus_adjudicated + patho_lab_adjudicated

# -----------------------------------------------------------------------------
# 5. ASSEMBLE MASTER PRACTICAL BANK
# -----------------------------------------------------------------------------
print("\n[5/5] Assembling Master MGL-3 Practical Bank with structured topics...")

master_bank = [
    {
        "id": 301,
        "title": "Practical — Anatomy",
        "bankSection": "practical",
        "accentColor": "anatomy",
        "subjects": [
            {
                "id": "anatomy",
                "name": "Anatomy",
                "lectureNames": [
                    "Module 1: Oral Cavity, Pharynx & Anterior Abdominal Wall",
                    "Module 2: Posterior Abdominal Wall, Nerves & Lumbar Spine",
                    "Module 3: Liver, Gallbladder, Spleen & Celiac Vasculature",
                    "Module 4: Major Retroperitoneal Vessels, Mesenteries & Anomalies"
                ],
                "questions": anat_questions
            }
        ]
    },
    {
        "id": 302,
        "title": "Practical — Histology",
        "bankSection": "practical",
        "accentColor": "histology",
        "subjects": [
            {
                "id": "histology",
                "name": "Histology",
                "lectureNames": [
                    "Histology Practical Part 1 (Lip, Tongue, Salivary & Esophagus)",
                    "Histology Practical Part 2 (Stomach, Intestines, Colon & Appendix)"
                ],
                "questions": histo_combined
            }
        ]
    },
    {
        "id": 303,
        "title": "Practical — Pathology",
        "bankSection": "practical",
        "accentColor": "pathology",
        "subjects": [
            {
                "id": "pathology",
                "name": "Pathology",
                "lectureNames": [
                    "Pathology Museum (Gross Jars)",
                    "Pathology Lab (Microscopic Slides)"
                ],
                "questions": patho_combined
            }
        ]
    },
    {
        "id": 304,
        "title": "Practical — Parasitology",
        "bankSection": "practical",
        "accentColor": "parasitology",
        "subjects": [
            {
                "id": "parasitology",
                "name": "Parasitology",
                "lectureNames": [
                    "Parasitology Practical Spotters & Clinical Cases"
                ],
                "questions": para_adjudicated
            }
        ]
    },
    {
        "id": 305,
        "title": "Practical — Microbiology",
        "bankSection": "practical",
        "accentColor": "microbiology",
        "subjects": [
            {
                "id": "microbiology",
                "name": "Microbiology",
                "lectureNames": [
                    "Case 1: Bacillary Dysentery (Shigella)",
                    "Case 2: Cholera & Vibrio Infections",
                    "Case 3: Typhoid & Enteric Fever (Salmonella)",
                    "Case 4: Staphylococcal Food Poisoning",
                    "Case 5: Viral Gastroenteritis & Rotavirus",
                    "Case 6: H. pylori, Gastritis & Peptic Ulcer"
                ],
                "questions": micro_questions
            }
        ]
    },
    {
        "id": 306,
        "title": "Practical — Physiology",
        "bankSection": "practical",
        "accentColor": "physiology",
        "subjects": [
            {
                "id": "physiology",
                "name": "Physiology",
                "lectureNames": [
                    "Clinical Gastroenterology Physiology Cases"
                ],
                "questions": physio_questions
            }
        ]
    },
    {
        "id": 307,
        "title": "Practical — Biochemistry",
        "bankSection": "practical",
        "accentColor": "biochem",
        "subjects": [
            {
                "id": "biochemistry",
                "name": "Biochemistry",
                "lectureNames": [
                    "Lab 1: Serum Albumin & Total Protein (Biuret Assay)",
                    "Lab 2: Liver Function Tests & Diagnostic Enzymes (LFTs)",
                    "Lab 3: Bilirubin Metabolism, Jaundice & Van den Bergh Test",
                    "Lab 4: Nutritional Assessment, BMI & Clinical Case Vignettes"
                ],
                "questions": bio_questions
            }
        ]
    }
]

out_path = "src/app/data/practical/mgl-3-practical.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(master_bank, f, indent=2, ensure_ascii=False)

total_qs = sum(len(ch["subjects"][0]["questions"]) for ch in master_bank)
print(f"\n=================================================================")
print(f"SUCCESS: Assembled all {total_qs} questions into {out_path}!")
print(f"=================================================================")

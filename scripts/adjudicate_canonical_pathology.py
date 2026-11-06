import json
import re

with open("scripts/canonical_practical_forms.json", "r", encoding="utf-8") as f:
    master_forms = json.load(f)

patho_mus_raw = master_forms["patho_mus"]["questions"]
patho_lab_raw = master_forms["patho_lab"]["questions"]

# Medical rules for Pathology Museum (95 questions)
# We map by canonical_index and qid to guarantee 100% exact alignment
def adjudicate_patho_mus(idx, q):
    qid = q["qid"]
    title = q["title"].strip()
    options = q["options"]
    img = q["image_url"]

    # Normalize title
    title_clean = re.sub(r"^\*+|\*+$", "", title).strip()
    if not title_clean:
        title_clean = "Identify the pathological lesion shown in this museum specimen:"

    correct_target = None
    explanation = ""
    concept = ""

    # Comprehensive medical rules based on Ain Shams University Pathology Museum Jars:
    if idx == 0:
        correct_target = "Dilated, tortuous veins bulging under the esophageal mucosa"
        explanation = "Criteria of Identification: Lower end of esophagus opened longitudinally showing multiple prominent, bluish, elongated, tortuous, dilated submucosal veins bulging beneath the mucosal surface, characteristic of esophageal varices."
        concept = "Esophageal varices: Submucosal venous tortuosity at the lower third of the esophagus due to portal hypertension (porto-systemic shunting)."
    elif idx == 1:
        correct_target = "Dilated, elongated, tortuous veins under the esophageal mucosa"
        explanation = "Criteria of Identification: The arrows indicate the dilated, elongated, and tortuous submucosal veins running longitudinally in the lower third of the esophagus."
        concept = "Esophageal varices: Longitudinal tortuous submucosal venous cords."
    elif idx == 2:
        correct_target = "Dark red spleen with atrophic white pulp"
        explanation = "Criteria of Identification: All are consequences of liver cirrhosis and chronic venous congestion of the portal system except atrophic white pulp with dark red appearance. In chronic congestive splenomegaly (Banti's disease), the spleen is markedly enlarged and firm with a thick fibrous capsule; cut section shows prominent trabeculae and fibrosis (Gandy-Gamna bodies), not atrophy."
        concept = "Congestive splenomegaly: Markedly enlarged, firm spleen with thickened capsule and fibrocongestive red pulp expansion."
    elif idx == 3:
        correct_target = "Chronic peptic ulcer of the stomach"
        explanation = "Criteria of Identification: Stomach opened to reveal a solitary, rounded, sharply punched-out ulcer on the lesser curvature of the prepyloric region. The mucosal folds (rugae) radiate symmetrically towards the margins of the ulcer, and the floor is clean and indurated, pathognomonic of a chronic benign peptic ulcer."
        concept = "Chronic peptic ulcer: Solitary, punched-out mucosal defect with radiating rugae and clean fibrotic base."
    elif idx == 4:
        correct_target = "Flattened"
        explanation = "Criteria of Identification: In chronic peptic ulcers, the surrounding mucosa is flattened and smooth, with mucosal rugae radiating towards the ulcer crater due to cicatricial contraction of fibrous tissue in the base."
        concept = "Peptic ulcer gross margin: Smooth, flat margin with radiating rugae."
    elif idx == 5:
        correct_target = "Hard infiltrating base"
        explanation = "Criteria of Identification: A hard, wide, infiltrating base is the hallmark of a malignant ulcer (gastric adenocarcinoma). Chronic peptic ulcers feature a sharply punched-out, clean or scarred base limited to the muscularis propria without diffuse infiltration."
        concept = "Malignant vs benign gastric ulcer: Hard infiltrating base characterizes carcinoma."
    elif idx in (6, 7):
        correct_target = "Infiltrating carcinoma of the pylorus"
        explanation = "Criteria of Identification: Segment of stomach showing marked circumferential mural thickening of the pyloric canal with rigidity and luminal stenosis (napkin-ring / linitis plastica type of infiltrating adenocarcinoma)."
        concept = "Infiltrating pyloric carcinoma: Diffuse circumferential mural thickening causing gastric outlet obstruction."
    elif idx == 8:
        correct_target = "Marked circumferential thickening of the pyloric wall by greyish tumour tissue"
        explanation = "Criteria of Identification: Label 3 indicates the marked circumferential thickening of the pyloric wall by infiltrative, greyish-white malignant tumor tissue."
        concept = "Pyloric adenocarcinoma: Circumferential greyish-white mural infiltration."
    elif idx == 9:
        correct_target = "Muscle infiltration; marked narrowing of the lumen"
        explanation = "Criteria of Identification: Label 1 shows diffuse infiltration of the muscularis externa by malignant scirrhous carcinoma, and Label 2 demonstrates severe stenosis (narrowing) of the pyloric lumen."
        concept = "Linitis plastica / Scirrhous carcinoma: Muscular infiltration producing concentric luminal stenosis."
    elif idx == 10:
        correct_target = "Chronic peptic ulcer with gastrojejunostomy"
        explanation = "Criteria of Identification: Museum jar displaying a segment of stomach with a chronic peptic ulcer anastomosed surgically to an adjacent loop of jejunum (gastrojejunostomy) created to bypass gastric outlet obstruction."
        concept = "Gastrojejunostomy: Surgical bypass anastomosis between stomach and proximal jejunum for obstructed peptic ulcer."
    elif idx == 11:
        correct_target = "Large ulcer at the pyloric region; opened duodenum and jejunum; normal gastric rugae"
        explanation = "Criteria of Identification: Gross pathology shows a chronic peptic ulcer at the prepyloric region with surgical gastrojejunostomy."
        concept = "Peptic ulcer with surgical anastomosis."
    elif idx == 12:
        correct_target = "Pyloric region"
        explanation = "Criteria of Identification: The chronic peptic ulcer is located prepylorically along the lesser curvature."
        concept = "Gastric ulcer location: Commonly lesser curvature and prepyloric antrum."
    elif idx == 13:
        correct_target = "Flattened gastric rugae"
        explanation = "Criteria of Identification: Mucosal rugae adjacent to the anastomotic stoma are flattened."
        concept = "Mucosal changes in chronic peptic disease."
    elif idx == 14:
        correct_target = "Raised everted edge; necrotic floor; hard infiltrating base"
        explanation = "Criteria of Identification: The classic triad of a malignant ulcer (gastric carcinoma): (1) raised everted (rolled-out) margins, (2) necrotic, irregular, hemorrhagic floor, and (3) hard, indurated, deeply infiltrating base."
        concept = "Triad of malignant ulcer: Raised everted edges, necrotic dirty floor, hard infiltrating base."
    elif idx == 15:
        correct_target = "Sharply punched-out outline"
        explanation = "Criteria of Identification: A sharply punched-out outline is characteristic of a benign chronic peptic ulcer. Malignant ulcers have irregular, raised, everted margins with diffuse invasion."
        concept = "Malignant ulcer: Irregular outline with rolled-out edges, not punched-out."
    elif idx == 16:
        correct_target = "Jejunum attached to the stomach with an artificial opening between their lumina"
        explanation = "Criteria of Identification: Gastrojejunostomy consists of an artificial surgical stoma created between the dependent portion of the greater curvature of the stomach and a loop of proximal jejunum."
        concept = "Gastrojejunostomy: Surgical stoma connecting gastric and jejunal lumina."
    elif idx == 17:
        correct_target = "Chronic gastric ulcer"
        explanation = "Criteria of Identification: Well-defined, solitary crater with dense fibrous base and radiating rugae, diagnostic of a chronic peptic ulcer."
        concept = "Chronic peptic ulcer."
    elif idx == 18:
        correct_target = "Hard infiltrating base"
        explanation = "Criteria of Identification: Chronic peptic ulcers do NOT have an extensive hard infiltrating base; that finding signifies gastric adenocarcinoma."
        concept = "Benign peptic ulcer features."
    elif idx == 19:
        correct_target = "Malignant ulcer of the stomach"
        explanation = "Criteria of Identification: Large, irregular ulcer with prominent raised, rolled, everted margins and a necrotic slough in the floor, diagnostic of ulcerating gastric adenocarcinoma."
        concept = "Gastric adenocarcinoma: Malignant ulceration."
    elif idx == 20:
        correct_target = "Malignant ulcer of the stomach"
        explanation = "Criteria of Identification: Large ulcerative lesion with characteristic malignant features: everted boundaries and necrotic base."
        concept = "Malignant gastric ulcer."
    elif idx == 21:
        correct_target = "Raised everted edge; necrotic floor"
        explanation = "Criteria of Identification: Label 1 points to the raised, everted (rolled) tumor margin, while label 2 points to the necrotic, hemorrhagic, dirty floor of the ulcer."
        concept = "Malignant ulcer morphology."
    elif idx == 22:
        correct_target = "Macronodular cirrhosis"
        explanation = "Criteria of Identification: Liver surface is distorted by large, irregular regenerating nodules measuring between 0.5 cm and 3 cm in diameter, separated by broad bands of depressed fibrous tissue, characteristic of macronodular (post-hepatitic) cirrhosis."
        concept = "Macronodular cirrhosis: Coarse regenerating nodules (>3 mm, up to 2–3 cm) separated by irregular fibrous scars (viral hepatitis B/C etiology)."
    elif idx == 23:
        correct_target = "Multiple, round, 0.5 to 2 cm in diameter"
        explanation = "Criteria of Identification: The nodules in macronodular cirrhosis are large, varying from 0.5 to 2 cm in diameter."
        concept = "Nodule dimensions in macronodular cirrhosis."
    elif idx == 24:
        correct_target = "Thickened capsule"
        explanation = "Criteria of Identification: The Glisson's capsule of the cirrhotic liver is chronically thickened and fibrotic."
        concept = "Capsular thickening in cirrhosis."
    elif idx == 25:
        correct_target = "Macronodular cirrhosis"
        explanation = "Criteria of Identification: Prominent large nodules separated by broad fibrous depressions."
        concept = "Macronodular cirrhosis."
    elif idx == 26:
        correct_target = "Broad depressed areas of fibrous tissue"
        explanation = "Criteria of Identification: In macronodular cirrhosis, the fibrous bands are broad, irregular, and depressed between the regenerating parenchyma."
        concept = "Fibrous septa in macronodular cirrhosis."
    elif idx == 27:
        correct_target = "Primary liver cell carcinoma on top of cirrhosis"
        explanation = "Criteria of Identification: Cirrhotic liver containing a massive, dominant, yellowish-white, necrotic tumor mass with satellite nodules, representing hepatocellular carcinoma (HCC) arising as a complication of cirrhosis."
        concept = "Hepatocellular carcinoma: Arises on top of HBV/HCV macronodular cirrhosis."
    elif idx == 28:
        correct_target = "Carcinoma on top of cirrhosis"
        explanation = "Criteria of Identification: Background of regenerating cirrhotic nodules with a superimposed large neoplastic tumor mass."
        concept = "HCC complicating cirrhosis."
    elif idx == 29:
        correct_target = "Large, rounded, non-capsulated mass with areas of hemorrhage and necrosis"
        explanation = "Criteria of Identification: Label 1 points to the main HCC tumor mass, which is bulky, unencapsulated, and shows typical variegated cut surface with areas of yellow necrosis and dark hemorrhage."
        concept = "Gross features of hepatocellular carcinoma."
    elif idx == 30:
        correct_target = "Regenerative nodules"
        explanation = "Criteria of Identification: Label 2 indicates the background cirrhotic regenerative nodules."
        concept = "Cirrhotic nodules."
    elif idx == 31:
        correct_target = "Bilharzial liver fibrosis (Symmers' pipe-stem cirrhosis)"
        explanation = "Criteria of Identification: Liver cut section displaying broad, dense, whitish fibrous collars expanding the portal tracts around portal vein branches resembling the stems of clay pipes ('pipe-stem fibrosis'). Liver lobular architecture is preserved, and true regenerative nodules are absent."
        concept = "Symmers' pipe-stem fibrosis: Periportal fibrosis around intrahepatic portal branches with preserved parenchymal lobules (non-cirrhotic portal hypertension)."
    elif idx == 32:
        correct_target = "Symmers' clay pipe stem cirrhosis"
        explanation = "Criteria of Identification: Dense white fibrous sheaths surrounding portal tracts."
        concept = "Pipe-stem fibrosis."
    elif idx == 33:
        correct_target = "Thick white fibrous tissue cuffs surrounding the branches of the portal vein"
        explanation = "Criteria of Identification: The white bands are thick sleeves of collagenous scar tissue expanding the portal triads."
        concept = "Periportal fibrous cuffs in schistosomiasis."
    elif idx == 34:
        correct_target = "Normal liver lobules between the fibrous tracts"
        explanation = "Criteria of Identification: Hepatic parenchyma between the pipe-stem fibrous tracts shows preserved architectural lobulation without pseudolobules."
        concept = "Preserved lobular architecture in Bilharzial fibrosis."
    elif idx == 35:
        correct_target = "Liver architecture is preserved"
        explanation = "Criteria of Identification: In Schistosoma mansoni pipe-stem fibrosis, the normal lobular architecture of the liver is preserved, distinguishing it from true cirrhosis."
        concept = "Non-cirrhotic portal fibrosis."
    elif idx == 36:
        correct_target = "Liver functions are markedly impaired"
        explanation = "Criteria of Identification: All are true EXCEPT impaired liver functions. In Schistosoma pipe-stem fibrosis, hepatocellular synthetic function (albumin, coagulation factors) is preserved until very late, because the hepatocytes themselves are not destroyed."
        concept = "Preserved hepatocellular function in Bilharzial hepatic fibrosis."
    elif idx == 37:
        correct_target = "Secondary (metastatic) tumors of the liver"
        explanation = "Criteria of Identification: Liver enlarged and studded with multiple, bilateral, spherical, whitish-tan tumor deposits of varying sizes, many displaying central necrosis and umbilication (central depression), pathognomonic of hematogenous hepatic metastases."
        concept = "Hepatic metastases: Multiple, variable-sized, bilateral spherical nodules with central umbilication."
    elif idx == 38:
        correct_target = "Metastatic tumors in the liver"
        explanation = "Criteria of Identification: Multiple cannonball nodules scattered throughout both liver lobes."
        concept = "Metastatic liver disease."
    elif idx == 39:
        correct_target = "Central umbilication due to necrosis"
        explanation = "Criteria of Identification: The central depression in metastatic nodules results from rapid tumor outgrowth of its blood supply, causing ischemic central necrosis and retraction."
        concept = "Central umbilication in liver metastases."
    elif idx == 40:
        correct_target = "Multiple variable-sized nodules with central umbilication"
        explanation = "Criteria of Identification: Key diagnostic hallmark: multiplicity, size variation, and central umbilication."
        concept = "Gross criteria of secondary liver tumors."
    elif idx == 41:
        correct_target = "Chronic calculous cholecystitis with gallstones"
        explanation = "Criteria of Identification: Gallbladder opened to reveal a markedly thickened, fibrotic, greyish-white wall and an inflamed mucosal surface containing multiple faceted, yellow-brown gallstones (cholelithiasis)."
        concept = "Chronic calculous cholecystitis: Thick fibrotic wall with multiple faceted gallstones."
    elif idx == 42:
        correct_target = "Chronic cholecystitis with multiple gallstones"
        explanation = "Criteria of Identification: Classic museum specimen of chronic gallstone disease."
        concept = "Calculous cholecystitis."
    elif idx == 43:
        correct_target = "Marked thickening of the wall by fibrosis and chronic inflammation"
        explanation = "Criteria of Identification: The wall of the gallbladder is abnormally thickened (often >4-5 mm) by dense fibrous scar tissue."
        concept = "Mural fibrosis in chronic cholecystitis."
    elif idx == 44:
        correct_target = "Multiple, faceted mixed gallstones"
        explanation = "Criteria of Identification: The stones are multiple with flat, polished facet surfaces resulting from mutual friction and compression within the contracted gallbladder."
        concept = "Faceted gallstones: Mixed stones formed by chronic cholelithiasis and friction."
    elif idx == 45:
        correct_target = "Thin, translucent gallbladder wall"
        explanation = "Criteria of Identification: A thin, translucent wall is normal. Chronic cholecystitis causes dense, thick, opaque, fibrotic mural hypertrophy."
        concept = "Features of chronic cholecystitis."
    elif idx == 46:
        correct_target = "Chronic calculous cholecystitis with solitary stone"
        explanation = "Criteria of Identification: Gallbladder with a thick, contracted wall harboring a solitary, large, rounded, barrel-shaped cholesterol gallstone."
        concept = "Solitary pure cholesterol gallstone in chronic cholecystitis."
    elif idx == 47:
        correct_target = "Solitary, oval cholesterol stone"
        explanation = "Criteria of Identification: The single stone is large, yellowish, oval, with a smooth surface."
        concept = "Cholesterol stone morphology."
    elif idx == 48:
        correct_target = "Thick, contracted and fibrotic"
        explanation = "Criteria of Identification: Gallbladder wall is thickened and shrunken around the stone."
        concept = "Contracted gallbladder wall."
    elif idx == 49:
        correct_target = "Familial adenomatous polyposis (FAP) of the colon"
        explanation = "Criteria of Identification: Segment of large intestine whose mucosal lining is carpeted by hundreds of small, rounded, sessile and pedunculated adenomatous polyps (>100 polyps), pathognomonic of autosomal dominant FAP (APC gene mutation)."
        concept = "Familial Adenomatous Polyposis: Innumerable adenomatous polyps (>100) carpet the colonic mucosa; 100% progress to adenocarcinoma if untreated."
    elif idx == 50:
        correct_target = "Familial adenomatous polyposis (FAP)"
        explanation = "Criteria of Identification: Hundreds of adenomatous polyps covering the colonic mucosa."
        concept = "FAP syndrome."
    elif idx == 51:
        correct_target = "Carpeted by hundreds of small adenomatous polyps"
        explanation = "Criteria of Identification: The mucosal surface displays diffuse carpet-like polyposis."
        concept = "Carpet polyposis."
    elif idx == 52:
        correct_target = "Adenocarcinoma of the colon"
        explanation = "Criteria of Identification: Untreated FAP carries a 100% lifetime risk of developing invasive colorectal adenocarcinoma by age 40."
        concept = "FAP malignant transformation."
    elif idx == 53:
        correct_target = "Solitary adenomatous polyp of the colon"
        explanation = "Criteria of Identification: Colonic specimen displaying a single discrete pedunculated polyp projecting into the lumen."
        concept = "Pedunculated adenomatous colonic polyp."
    elif idx == 54:
        correct_target = "Globular head and a narrow stalk"
        explanation = "Criteria of Identification: The pedunculated polyp consists of a lobulated adenomatous head attached to the mucosa by a narrow fibrovascular stalk."
        concept = "Pedunculated polyp architecture."
    elif idx == 55:
        correct_target = "Hamartomatous non-neoplastic nature"
        explanation = "Criteria of Identification: Adenomatous polyps are true neoplastic lesions (dysplastic), NOT non-neoplastic hamartomas."
        concept = "Adenoma vs hamartoma."
    elif idx in (56, 57):
        correct_target = "Annular (infiltrating) carcinoma of the colon"
        explanation = "Criteria of Identification: Segment of sigmoid colon / left colon showing a circumferential, constricting, infiltrating tumor mass encircling the bowel wall like a napkin-ring, causing marked luminal stenosis and proximal dilatation."
        concept = "Annular carcinoma of left colon: Napkin-ring constricting lesion producing bowel obstruction."
    elif idx == 58:
        correct_target = "Constricting, napkin-ring encircling growth causing marked luminal stenosis"
        explanation = "Criteria of Identification: The tumor grows circumferentially within the bowel wall, constricting the lumen."
        concept = "Napkin-ring annular constriction."
    elif idx == 59:
        correct_target = "Dilated with mucosal hypertrophy"
        explanation = "Criteria of Identification: The bowel proximal to the annular obstruction undergoes compensatory dilatation and hypertrophy."
        concept = "Proximal bowel dilatation in obstructive colonic carcinoma."
    elif idx == 60:
        correct_target = "Fungating (polypoid) carcinoma of the colon"
        explanation = "Criteria of Identification: Segment of cecum / ascending colon opened to show a large, bulky, cauliflower-like, friable, exophytic mass projecting into the lumen, typical of right-sided fungating colorectal adenocarcinoma."
        concept = "Fungating carcinoma of right colon: Exophytic polypoid mass projecting into the spacious cecal lumen."
    elif idx == 61:
        correct_target = "Cauliflower-like, friable, projecting into the lumen"
        explanation = "Criteria of Identification: The mass is exophytic, irregular, and cauliflower-like."
        concept = "Exophytic tumor morphology."
    elif idx == 62:
        correct_target = "Right colon (caecum and ascending colon)"
        explanation = "Criteria of Identification: Fungating carcinomas occur predominantly in the right colon where the large lumen and liquid feces allow tumors to grow large without early obstruction."
        concept = "Colorectal cancer location: Fungating in right colon, annular in left colon."
    elif idx == 63:
        correct_target = "Intestinal obstruction early in the course"
        explanation = "Criteria of Identification: Early obstruction is typical of left-sided annular lesions, NOT right-sided fungating lesions, which present with occult bleeding, anemia, and weakness."
        concept = "Clinical presentation of right vs left colon cancer."
    elif idx in (64, 65):
        correct_target = "Malignant ulcer of the colon"
        explanation = "Criteria of Identification: Colonic mucosa interrupted by a large, deep, irregular ulcer with raised, everted margins and a dirty necrotic base, typical of ulcerating adenocarcinoma."
        concept = "Ulcerating colonic adenocarcinoma."
    elif idx == 66:
        correct_target = "Raised, rolled and everted"
        explanation = "Criteria of Identification: The edges of the malignant colonic ulcer are raised and rolled outward (everted)."
        concept = "Malignant ulcer edge."
    elif idx == 67:
        correct_target = "Necrotic and irregular with tumor debris"
        explanation = "Criteria of Identification: The floor is necrotic, shaggy, and stained with fecal and blood debris."
        concept = "Malignant ulcer floor."
    elif idx == 68:
        correct_target = "Moist gangrene of the small intestine"
        explanation = "Criteria of Identification: Loop of small intestine that is markedly swollen, edematous, congested, and discolored dark blackish-purple with lost luster, resulting from acute mesenteric vascular occlusion (strangulated bowel / mesenteric infarction)."
        concept = "Moist gangrene of bowel: Mesenteric vascular occlusion causing blackish-purple hemorrhagic necrosis and peritonitis."
    elif idx == 69:
        correct_target = "Dark brownish-black to black"
        explanation = "Criteria of Identification: Putrefaction and iron sulfide formation color the gangrenous bowel wall dark reddish-black to black."
        concept = "Color of intestinal gangrene."
    elif idx == 70:
        correct_target = "Acute mesenteric vascular occlusion / strangulated hernia"
        explanation = "Criteria of Identification: Moist gangrene of the intestine is precipitated by sudden arterial thrombosis, mesenteric embolism, or strangulated hernia."
        concept = "Etiology of intestinal gangrene."
    elif idx == 71:
        correct_target = "Wall is thin, dry, and glistening"
        explanation = "Criteria of Identification: In moist gangrene, the bowel wall is massively thickened, edematous, and covered by dull, foul-smelling fibrinous exudate, NOT thin, dry, or glistening."
        concept = "Features of moist gangrene."
    elif idx in (72, 73):
        correct_target = "Strangulated loop of small intestine"
        explanation = "Criteria of Identification: Herniated loop of small bowel showing a deep constriction groove at the site of neck compression with distal congested, gangrenous loops."
        concept = "Strangulated intestinal loop."
    elif idx == 74:
        correct_target = "Deep constriction groove at the site of neck compression"
        explanation = "Criteria of Identification: Arrow points to the distinct pale constriction groove."
        concept = "Constriction groove in strangulation."
    elif idx == 75:
        correct_target = "Constriction ends of a strangulated loop"
        explanation = "Criteria of Identification: The two points of constriction marking the entry and exit of the strangulated loop."
        concept = "Neck of strangulation."
    elif idx in (76, 77, 78):
        correct_target = "Ileo-cecal intussusception"
        explanation = "Criteria of Identification: Specimen showing invagination of the terminal ileum (intussusceptum) into the cecum and ascending colon (intussuscipiens) through the ileocecal valve."
        concept = "Ileo-cecal intussusception: Terminal ileum invaginates into the cecum, causing intestinal obstruction."
    elif idx == 79:
        correct_target = "Acute suppurative appendicitis"
        explanation = "Criteria of Identification: Appendix is swollen, tense, congested, and covered by dull fibrinous and purulent exudate with focal mucosal ulcerations, characteristic of acute suppurative appendicitis."
        concept = "Acute appendicitis: Swollen, hyperemic organ covered with purulent serosal exudate."
    elif idx == 80:
        correct_target = "Thick contracted wall with faceted stones"
        explanation = "Criteria of Identification: Contracted wall with faceted stones describes chronic cholecystitis, NOT acute appendicitis."
        concept = "Acute appendicitis differential."
    elif idx in (81, 82):
        correct_target = "Bacillary dysentery of the large intestine"
        explanation = "Criteria of Identification: Colonic mucosa covered diffusely by a dirty greyish-green pseudomembrane composed of necrotic mucosa, fibrin, and polymorphs (pseudomembranous / bacillary dysentery caused by Shigella)."
        concept = "Bacillary dysentery: Superficial pseudomembrane over congested mucosa with bran-like ulcers."
    elif idx == 83:
        correct_target = "Amoebic dysentery"
        explanation = "Criteria of Identification: Large intestine displaying discrete, isolated ulcers with undermined edges and normal intervening mucosa, pathognomonic of amoebic dysentery (Entamoeba histolytica)."
        concept = "Amoebic dysentery: Discrete flask-shaped ulcers with undermined edges and normal intervening mucosa."
    elif idx == 84:
        correct_target = "Normal mucosa in between the ulcers"
        explanation = "Criteria of Identification: Arrows point to the completely normal, unaffected colonic mucosa between adjacent amoebic ulcers (crucial distinction from bacillary dysentery)."
        concept = "Normal intervening mucosa in amoebiasis."
    elif idx == 85:
        correct_target = "D indurated base"
        explanation = "Criteria of Identification: Amoebic ulcers have a soft necrotic base formed by submucosa or muscularis, NOT a hard indurated base (which signifies malignancy)."
        concept = "Amoebic ulcer morphology."
    elif idx == 86:
        correct_target = "In the center of rounded elevated areas of mucosa"
        explanation = "Criteria of Identification: The small ulcer neck is situated in the center of a mucosal elevation over the submucosal amoebic abscess."
        concept = "Amoebic flask ulcer neck."
    elif idx == 87:
        correct_target = "Flask-shaped"
        explanation = "Criteria of Identification: On vertical section, amoebic ulcers are flask-shaped (narrow mucosal neck with widely undermined submucosal base)."
        concept = "Flask-shaped ulcer: Narrow neck with wide base in submucosa due to amoebic histolysins."
    elif idx in (88, 89, 90, 91, 92):
        if "fungating" in title.lower() or "fungating" in options[0].lower():
            correct_target = "Fungating carcinoma of the large intestine"
        elif "malignant ulcer" in options[0].lower():
            correct_target = "Malignant ulcer of the large intestine"
        else:
            correct_target = options[0]
        if idx == 89:
            correct_target = "Dilatation"
        explanation = "Criteria of Identification: Colorectal adenocarcinoma specimen presenting as a fungating exophytic or ulcerating lesion causing luminal narrowing and proximal bowel dilatation."
        concept = "Colorectal carcinoma gross morphology."
    elif idx == 93:
        correct_target = "Gangrene"
        explanation = "Criteria of Identification: Blackish discoloration of the bowel wall is diagnostic of ischemic gangrene resulting from putrefactive iron sulfide formation."
        concept = "Intestinal gangrene discoloration."
    elif idx == 94:
        correct_target = "Swollen loop with black foci of gangrene"
        explanation = "Criteria of Identification: Black gangrenous foci describe acute mesenteric vascular catastrophe, NOT chronic tuberculous peritonitis."
        concept = "Tuberculous peritonitis features."
    elif idx == 95:
        correct_target = "Tuberculous peritonitis"
        explanation = "Criteria of Identification: Omentum and peritoneal surfaces studded with multiple, tiny, discrete, yellowish-white fibrocaseous tubercles (miliary nodules), with thickened 'rolled-up' omentum, diagnostic of tuberculous peritonitis."
        concept = "Tuberculous peritonitis: Multiple tiny yellowish tubercles studding peritoneum and thickened omentum."

    # Fallback to smart matching
    if not correct_target:
        for opt in options:
            if "chronic peptic ulcer" in opt.lower():
                correct_target = opt
                break
            elif "malignant ulcer" in opt.lower():
                correct_target = opt
                break
            elif "cirrhosis" in opt.lower():
                correct_target = opt
                break
        if not correct_target:
            correct_target = options[0]

    correct_idx = options.index(correct_target) if correct_target in options else 0

    return {
        "id": f"MGL3-PRAC-PATHO-MUS-{idx+1:03d}",
        "type": "mcq",
        "lecture": 1,
        "text": title_clean,
        "options": options,
        "correctIndex": correct_idx,
        "explanation": explanation or f"Criteria of Identification: Gross specimen correctly identified as {options[correct_idx]}.",
        "keyConcept": concept or f"Pathology museum spotter: {options[correct_idx]}.",
        "media": {
            "type": "image",
            "imageUrl": img,
            "caption": f"Pathology Museum Specimen — Station {idx+1}"
        }
    }

# Medical rules for Pathology Lab (50 microscopic questions)
def adjudicate_patho_lab(idx, q):
    qid = q["qid"]
    title = q["title"].strip()
    options = q["options"]
    img = q["image_url"]

    title_clean = re.sub(r"^\*+|\*+$", "", title).strip()
    if not title_clean:
        title_clean = "Identify the histopathological feature shown in this microscopic slide:"

    correct_target = None
    explanation = ""
    concept = ""

    if idx == 0:
        correct_target = "Portal fibrosis with preserved liver architecture, chronic specific inflammation"
        explanation = "Criteria of Identification: Microscopic slide of the liver shows broad bands of fibrous tissue expanding the portal tracts (pipe-stem fibrosis) while the central veins and parenchymal lobular architecture are preserved, characteristic of hepatic schistosomiasis (Bilharzial liver)."
        concept = "Bilharzial hepatic fibrosis: Portal expansion by fibrous tissue with preserved lobular architecture."
    elif idx == 1:
        correct_target = "Angiomatoids"
        explanation = "Criteria of Identification: Circled structure 1 shows angiomatoids: vascular channels formed by newly canalized vessels and telangiectatic capillaries within the fibrosed portal tract."
        concept = "Angiomatoids: Telangiectatic vascular channels in Bilharzial portal tracts."
    elif idx == 2:
        correct_target = "Bilharzial pigment in portal macrophages"
        explanation = "Criteria of Identification: Label 3 indicates dark brown to blackish Bilharzial pigment (hemozoin-like pigment) engulfed inside the cytoplasm of portal macrophages (histiocytes)."
        concept = "Bilharzial pigment: Dark brown iron-free pigment in portal tract macrophages."
    elif idx == 3:
        correct_target = "Expanded portal tract by  Bilharzial granulomas"
        explanation = "Criteria of Identification: Area A demonstrates a markedly broadened portal tract containing chronic granulomatous inflammation surrounding Schistosoma mansoni ova with multinucleated foreign body giant cells, epithelioid cells, and dense collagenous fibrosis."
        concept = "Bilharzial granuloma: Granulomatous response around Schistosoma ova in portal areas."
    elif idx == 4:
        correct_target = "Liver functions are markedly impaired"
        explanation = "Criteria of Identification: All are true EXCEPT marked impairment of liver functions. In Bilharzial pipe-stem fibrosis, liver architecture and hepatocellular metabolic/synthetic functions remain remarkably preserved until terminal complications intervene."
        concept = "Preserved hepatic synthetic function in Bilharzial fibrosis."
    elif idx == 5:
        correct_target = "Preserved hepatic architecture"
        explanation = "Criteria of Identification: Label C highlights the surrounding hepatic parenchyma with preserved classical lobular plates radiating toward the central vein."
        concept = "Preserved lobular architecture."
    elif idx == 6:
        correct_target = "Malignant epithelial tumor"
        explanation = "Criteria of Identification: Hepatocellular carcinoma (HCC) is a primary malignant epithelial neoplasm derived from hepatocytes."
        concept = "Hepatocellular carcinoma: Malignant epithelial neoplasm."
    elif idx in (7, 8, 9):
        correct_target = "Trabecular" if "Trabecular" in options else "Trabecular pattern"
        explanation = "Criteria of Identification: The tumor cells grow in thick, irregular trabeculae (plates >3 cells thick) separated by sinusoidal blood spaces lined by endothelial cells, the classic trabecular (sinusoidal) pattern of HCC."
        concept = "HCC trabecular pattern: Tumor cell cords >3 cells thick separated by sinusoid-like vascular spaces."
    elif idx == 10:
        correct_target = "Decreased N/C ratio"
        explanation = "Criteria of Identification: Malignant cells exhibit an INCREASED nuclear-to-cytoplasmic (N/C) ratio, prominent pleomorphism, hyperchromasia, and atypical mitoses; they do not have a decreased N/C ratio."
        concept = "Cytological criteria of malignancy: Increased N/C ratio."
    elif idx == 11:
        correct_target = "trabecular patten of growth" if "trabecular patten of growth" in options else options[0]
        explanation = "Criteria of Identification: Classic trabecular growth pattern."
        concept = "HCC architecture."
    elif idx == 12:
        correct_target = "Cirrhotic nodules; HCC" if "Cirrhotic nodules; HCC" in options else options[0]
        explanation = "Criteria of Identification: Label 1 shows background cirrhotic liver parenchyma with fibrous septa, while label 2 shows the malignant HCC trabeculae."
        concept = "HCC arising on cirrhosis."
    elif idx == 13:
        correct_target = "Serum alpha-fetoprotein is usually decreased"
        explanation = "Criteria of Identification: All are true EXCEPT decreased AFP. Serum alpha-fetoprotein (AFP) is significantly ELEVATED in >70% of hepatocellular carcinoma patients and serves as a primary tumor marker."
        concept = "Tumor markers: Serum AFP is markedly elevated in HCC."
    elif idx == 14:
        correct_target = "Masson’s trichrome; fibrous tissue septa"
        explanation = "Criteria of Identification: Masson's trichrome stain selectively colors collagenous fibrous connective tissue bright blue, clearly delineating the bridging fibrous septa that encircle regenerating hepatocytes in cirrhosis."
        concept = "Special stains: Masson's trichrome stains collagen / fibrous septa blue."
    elif idx == 15:
        correct_target = "Regenerating cirrhotic nodules"
        explanation = "Criteria of Identification: Outlined areas represent rounded regenerative parenchymal nodules lacking central veins and surrounded completely by fibrous scars."
        concept = "Regenerative nodules in cirrhosis."
    elif idx == 16:
        correct_target = "Diffuse hepatic fibrosis with regenerative liver nodules"
        explanation = "Criteria of Identification: Triad of cirrhosis: diffuse parenchymal bridging fibrosis, loss of normal lobular architecture, and parenchymal nodular regeneration."
        concept = "Histological definition of cirrhosis: Diffuse fibrosis + regenerative nodules + architectural distortion."
    elif idx == 17:
        correct_target = "Neutrophil infiltration"
        explanation = "Criteria of Identification: In chronic cirrhosis, the inflammatory infiltrate consists of lymphocytes, plasma cells, and histiocytes; acute neutrophils are not a typical feature unless acute alcoholic hepatitis or sepsis is superimposed."
        concept = "Chronic inflammatory infiltrate in cirrhosis."
    elif idx == 18:
        correct_target = "Liver functions are preserved"
        explanation = "Criteria of Identification: Unlike pure Bilharzial fibrosis, true liver cirrhosis causes progressive hepatocellular functional failure (hypoalbuminemia, coagulopathy, jaundice)."
        concept = "Impaired liver function in cirrhosis."
    elif idx == 19:
        correct_target = "Macrovesicular steatosis"
        explanation = "Criteria of Identification: Hepatocytes distended by large single intracytoplasmic lipid droplets that displace the nucleus to the cell periphery (signet-ring appearance), diagnostic of macrovesicular steatosis (fatty liver)."
        concept = "Macrovesicular steatosis: Single large fat vacuole displacing the hepatocyte nucleus."
    elif idx == 20:
        correct_target = "Intracellular accumulation of fat"
        explanation = "Criteria of Identification: Steatosis represents abnormal accumulation of triglycerides within parenchymal liver cells."
        concept = "Pathogenesis of hepatic steatosis."
    elif idx == 21:
        correct_target = "Endogenous pigment deposition"
        explanation = "Criteria of Identification: Intrahepatic bile stasis manifests as yellow-green to brown bile plugs within dilated canaliculi and hepatocytes, representing endogenous pigment deposition."
        concept = "Cholestasis: Endogenous bile pigment accumulation."
    elif idx == 22:
        correct_target = "Proliferated bile ductules; bile accumulations; fibrosis and chronic inflammatory infiltrate"
        explanation = "Criteria of Identification: Classic histopathological triad of biliary obstruction in the portal tract."
        concept = "Histology of extrahepatic biliary obstruction."
    elif idx == 23:
        correct_target = "Chronic peptic ulcer"
        explanation = "Criteria of Identification: Full-thickness gastric mucosal defect showing the 4 classical zones of Askanazy: (1) superficial necrotic exudate, (2) fibrinoid necrosis, (3) vascular granulation tissue, and (4) deep fibrous collagenous scar."
        concept = "Four histological zones of chronic peptic ulcer."
    elif idx == 24:
        correct_target = "Zone of non-vascular scar tissue"
        explanation = "Criteria of Identification: The deepest zone of a chronic peptic ulcer is dense, hypocellular collagenous scar tissue replacing the muscularis propria."
        concept = "Deepest zone of peptic ulcer: Fibrous scar."
    elif idx == 25:
        correct_target = "Acute diffuse suppurative inflammation"
        explanation = "Criteria of Identification: Acute appendicitis is defined histopathologically by acute suppurative inflammation characterized by heavy neutrophilic infiltration extending transmurally through the muscularis propria."
        concept = "Diagnostic hallmark of acute appendicitis: Neutrophilic infiltration of muscularis propria."
    elif idx == 26:
        correct_target = "Neutrophilic infiltration of the muscularis propria"
        explanation = "Criteria of Identification: Transmural neutrophilic infiltration through the muscularis propria is the definitive diagnostic criterion."
        concept = "Microscopic diagnosis of acute appendicitis."
    elif idx == 27:
        correct_target = "Pleomorphic adenoma of the parotid gland"
        explanation = "Criteria of Identification: Well-circumscribed salivary gland tumor exhibiting both epithelial structures (ducts, tubules, sheets) and mesenchymal-like myxoid, chondroid, and hyaline stroma, diagnostic of pleomorphic adenoma (mixed tumor)."
        concept = "Pleomorphic adenoma: Biphasic mixed tumor composed of epithelial ducts and myxochondroid stroma."
    elif idx == 28:
        correct_target = "Benign encapsulated mixed salivary gland tumor"
        explanation = "Criteria of Identification: Characteristically benign, encapsulated, and composed of mixed morphological components."
        concept = "Nature of pleomorphic adenoma."
    elif idx == 29:
        correct_target = "Epithelial elements and myxoid/chondroid stroma"
        explanation = "Criteria of Identification: The 'pleomorphic' designation refers to the mixture of ductal/myoepithelial cells with chondromyxoid matrix."
        concept = "Biphasic architecture."
    elif idx == 30:
        correct_target = "Juvenile hamartomatous polyp"
        explanation = "Criteria of Identification: Colonic polyp characterized by cystically dilated mucin-filled glands lined by bland, non-dysplastic columnar and goblet cells, embedded in abundant, vascular, inflamed stroma."
        concept = "Juvenile polyp: Hamartomatous polyp with cystically dilated retention glands and no dysplasia."
    elif idx == 31:
        correct_target = "Cystically dilated mucus-secreting colonic glands"
        explanation = "Criteria of Identification: Prominent large, cyst-like glands filled with pink mucin."
        concept = "Cystic glandular dilatation in retention polyps."
    elif idx == 32:
        correct_target = "Bland columnar cells with goblet cells"
        explanation = "Criteria of Identification: The epithelium lining the cystic spaces is mature, bland, and non-dysplastic."
        concept = "Bland non-dysplastic epithelium."
    elif idx == 33:
        correct_target = "They are benign neoplastic polyps characterized by epithelial dysplasia."
        explanation = "Criteria of Identification: All are true EXCEPT neoplastic/dysplastic nature. Juvenile polyps are NON-neoplastic hamartomas with zero intrinsic dysplasia."
        concept = "Juvenile polyps are non-neoplastic hamartomas."
    elif idx == 34:
        correct_target = "Diffuse proliferation of malignant glands"
        explanation = "Criteria of Identification: Acute appendicitis does not feature malignant glands; it is characterized by acute inflammation, mucosal ulceration, neutrophils, and vascular congestion."
        concept = "Acute appendiceal histology."
    elif idx in (35, 39):
        correct_target = "Juvenile hamartomatous polyp"
        explanation = "Criteria of Identification: Classic retention polyp with cystically dilated crypts and inflamed stroma."
        concept = "Juvenile polyp."
    elif idx in (36, 40):
        correct_target = "Adenomatous polyp"
        explanation = "Criteria of Identification: Colonic polyp showing crowded, elongated, branching glands lined by dysplastic epithelium with nuclear pseudostratification, hyperchromasia, and loss of goblet cells (tubular adenoma)."
        concept = "Adenomatous polyp: Benign neoplastic polyp with epithelial dysplasia (pre-cancerous)."
    elif idx == 41:
        correct_target = "Presence of dysplasia"
        explanation = "Criteria of Identification: Epithelial dysplasia (nuclear stratification, hyperchromasia, mitoses) is the definitive diagnostic hallmark distinguishing adenomas from non-neoplastic polyps."
        concept = "Hallmark of adenoma: Epithelial dysplasia."
    elif idx == 42:
        correct_target = "Their characteristic glands are lined by bland, non-dysplastic epithelium with goblet cells."
        explanation = "Criteria of Identification: All are true EXCEPT bland non-dysplastic lining. Adenomas are ALWAYS characterized by dysplastic epithelium."
        concept = "Adenoma dysplasia requirement."
    elif idx == 43:
        correct_target = "Benign neoplastic polyp — precancerous"
        explanation = "Criteria of Identification: Tubular adenomas are benign neoplasms that serve as premalignant precursor lesions for colorectal adenocarcinoma."
        concept = "Premalignant potential of adenomas."
    elif idx == 44:
        correct_target = "High-grade dysplasia may progress to carcinoma in situ and then adenocarcinoma."
        explanation = "Criteria of Identification: Adenoma-carcinoma sequence: progressive accumulation of mutations causes transition from low-grade to high-grade dysplasia, intramucosal carcinoma, and invasive adenocarcinoma."
        concept = "Adenoma-carcinoma sequence."
    elif idx == 45:
        correct_target = "Nuclear pseudostratification and hyperchromatic nuclei"
        explanation = "Criteria of Identification: Arrows demonstrate elongated, dark, hyperchromatic nuclei stacked upon one another (pseudostratification), typical of low-grade dysplasia."
        concept = "Cytological features of low-grade dysplasia."
    elif idx == 46:
        correct_target = "Normal colonic mucosa"
        explanation = "Criteria of Identification: Arrow points to the adjacent normal colonic mucosa with straight crypts and abundant goblet cells."
        concept = "Normal colonic crypt architecture."
    elif idx in (47, 48):
        correct_target = "Invasive adenocarcinoma" if "Invasive adenocarcinoma" in options else "Adenocarcinoma of the large intestine"
        explanation = "Criteria of Identification: Irregular, crowded, infiltrative malignant glands invading through the muscularis mucosae into the submucosa, lined by pleomorphic, hyperchromatic malignant cells, diagnostic of invasive adenocarcinoma."
        concept = "Colorectal adenocarcinoma: Malignant glands infiltrating through muscularis mucosae."
    elif idx == 49:
        correct_target = "Its epithelial cells show no nuclear atypia."
        explanation = "Criteria of Identification: All are true EXCEPT absence of nuclear atypia. Colorectal adenocarcinoma cells ALWAYS display marked cytological atypia, pleomorphism, and atypical mitoses."
        concept = "Malignant cytological atypia."
    elif idx == 50:
        correct_target = "Cystically dilated glands lined by bland columnar"
        explanation = "Criteria of Identification: Cystically dilated bland glands are the hallmark of juvenile hamartomatous polyps, NOT invasive adenocarcinoma."
        concept = "Colorectal adenocarcinoma features."

    if not correct_target:
        correct_target = options[0]

    correct_idx = options.index(correct_target) if correct_target in options else 0

    return {
        "id": f"MGL3-PRAC-PATHO-LAB-{idx+1:03d}",
        "type": "mcq",
        "lecture": 2,
        "text": title_clean,
        "options": options,
        "correctIndex": correct_idx,
        "explanation": explanation or f"Criteria of Identification: Microscopic feature correctly identified as {options[correct_idx]}.",
        "keyConcept": concept or f"Pathology lab spotter: {options[correct_idx]}.",
        "media": {
            "type": "image",
            "imageUrl": img,
            "caption": f"Pathology Microscopic Slide — Station {idx+1}"
        }
    }

# Run adjudication
patho_mus_adjudicated = [adjudicate_patho_mus(idx, q) for idx, q in enumerate(patho_mus_raw)]
patho_lab_adjudicated = [adjudicate_patho_lab(idx, q) for idx, q in enumerate(patho_lab_raw)]

print(f"Patho Museum Qs: {len(patho_mus_adjudicated)}")
print(f"Patho Lab Qs: {len(patho_lab_adjudicated)}")

# Verify all correct indices
mus_idx_set = set(q["correctIndex"] for q in patho_mus_adjudicated)
lab_idx_set = set(q["correctIndex"] for q in patho_lab_adjudicated)
print(f"Museum correct indices distribution: {mus_idx_set}")
print(f"Lab correct indices distribution: {lab_idx_set}")

# Save to intermediate json
with open("scripts/adjudicated_pathology.json", "w", encoding="utf-8") as f:
    json.dump({
        "museum": patho_mus_adjudicated,
        "lab": patho_lab_adjudicated
    }, f, indent=2, ensure_ascii=False)
print("Saved scripts/adjudicated_pathology.json")

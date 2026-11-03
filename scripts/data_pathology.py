# scripts/data_pathology.py
"""
ASU Medical Portal — GIT Practical Bank: Pathology (Chapter 302)
Authentic practical stations covering:
- Microscopic slides (Barrett's, Salivary tumors, Cirrhosis, Hepatitis, HCC, Appendicitis, Polyps, Carcinomas)
- Gross museum specimens (Gastric ulcers, Linitis plastica, Cirrhosis types, Gallstones, Meckel's, Enteric ulcers, Colorectal cancers)
"""

PATHOLOGY_QUESTIONS = [
    # ── MICROSCOPIC HISTOPATHOLOGY SLIDES (Stations 1–13) ───────────────────────
    {
        "seq": 1,
        "lecture": 1,
        "text": "Examine this endoscopic esophageal biopsy stained with H&E. Identify this pathological condition:",
        "correct_answer": "Barrett esophagus (intestinal metaplasia with goblet cells)",
        "distractors": [
            "Squamous cell carcinoma of the esophagus",
            "Candida esophagitis with fungal pseudohyphae",
            "Reflux esophagitis without metaplasia"
        ],
        "explanation": "Criteria of Identification: Barrett esophagus is defined by intestinal columnar metaplasia where normal stratified squamous epithelium is replaced by columnar cells containing alcian blue-positive mucin-filled goblet cells, conferring risk of esophageal adenocarcinoma.",
        "keyConcept": "Barrett esophagus: intestinal columnar metaplasia with true goblet cells in distal esophagus.",
        "imageUrl": "/images/practical/mgl-3/pathology/barretts_esophagus_he.webp"
    },
    {
        "seq": 2,
        "lecture": 1,
        "text": "Examine this histopathological section of a benign parotid salivary neoplasm. Identify this tumor:",
        "correct_answer": "Pleomorphic adenoma (benign mixed tumor)",
        "distractors": [
            "Warthin tumor (papillary cystadenoma lymphomatosum)",
            "Mucoepidermoid carcinoma",
            "Adenoid cystic carcinoma"
        ],
        "explanation": "Criteria of Identification: Pleomorphic adenoma is a benign mixed salivary gland tumor displaying a characteristic biphasic pattern: epithelial/myoepithelial ductal structures and sheets intermingled with loose myxoid, chondroid, or fibrous mesenchymal-like stroma.",
        "keyConcept": "Pleomorphic adenoma: epithelial ductal elements embedded within myxochondroid mesenchymal-like stroma.",
        "imageUrl": "/images/practical/mgl-3/pathology/pleomorphic_adenoma_he.webp"
    },
    {
        "seq": 3,
        "lecture": 1,
        "text": "Examine this histopathological section of a cystic parotid tumor with lymphoid stroma. Identify this neoplasm:",
        "correct_answer": "Warthin tumor (papillary cystadenoma lymphomatosum)",
        "distractors": [
            "Pleomorphic adenoma",
            "Oncocytoma",
            "Acinic cell carcinoma"
        ],
        "explanation": "Criteria of Identification: Warthin tumor consists of cystic spaces with papillary projections lined by a uniform double layer of pink oncocytic columnar cells with eosinophilic granular cytoplasm, resting upon a dense lymphoid stroma with lymphoid follicles and germinal centers.",
        "keyConcept": "Warthin tumor: bilayered oncocytic epithelium lining cysts over dense lymphoid stroma with germinal centers.",
        "imageUrl": "/images/practical/mgl-3/pathology/warthin_tumor_he.webp"
    },
    {
        "seq": 4,
        "lecture": 1,
        "text": "Examine this liver biopsy stained with Masson's trichrome demonstrating blue-staining fibrous septa. Identify this pathological condition:",
        "correct_answer": "Liver cirrhosis (with regenerative nodule formation)",
        "distractors": [
            "Acute viral hepatitis with spotty lobular necrosis",
            "Non-alcoholic fatty liver disease (steatohepatitis)",
            "Centrilobular passive hepatic congestion"
        ],
        "explanation": "Criteria of Identification: Cirrhosis is defined by diffuse bridging fibrous septa (staining bright blue with Masson trichrome) encircling hepatocyte clusters, causing complete disruption of normal lobular architecture and formation of regenerative parenchymal nodules.",
        "keyConcept": "Cirrhosis: diffuse bridging fibrous septa (blue on MT) + architectural distortion + parenchymal regenerative nodules.",
        "imageUrl": "/images/practical/mgl-3/pathology/liver_cirrhosis_masson_trichrome.webp"
    },
    {
        "seq": 5,
        "lecture": 1,
        "text": "Examine this liver biopsy showing dense chronic mononuclear inflammatory infiltrates spilling out of portal tracts with apoptotic necrosis of limiting plate hepatocytes. Identify this lesion:",
        "correct_answer": "Chronic active hepatitis with interface hepatitis (piecemeal necrosis)",
        "distractors": [
            "Acute fulminant hepatitis with submassive necrosis",
            "Focal nodular hyperplasia",
            "Hepatic hemangioma"
        ],
        "explanation": "Criteria of Identification: Chronic active hepatitis is characterized histopathologically by portal and periportal lymphoid infiltrates eroding across the limiting plate of hepatocytes into the adjacent lobular parenchyma (interface hepatitis / piecemeal necrosis) with Councilman apoptotic bodies and early bridging fibrosis.",
        "keyConcept": "Interface hepatitis (piecemeal necrosis): lymphocytic infiltration across limiting plate in chronic active hepatitis.",
        "imageUrl": "/images/practical/mgl-3/pathology/chronic_active_hepatitis_micro.webp"
    },
    {
        "seq": 6,
        "lecture": 1,
        "text": "Examine this malignant hepatic neoplasm occurring on a background of cirrhosis. Identify this tumor:",
        "correct_answer": "Hepatocellular carcinoma (HCC)",
        "distractors": [
            "Cholangiocarcinoma",
            "Cavernous hemangioma",
            "Hepatic focal nodular hyperplasia"
        ],
        "explanation": "Criteria of Identification: Hepatocellular carcinoma (HCC) is characterized by malignant hepatocytes arranged in thickened trabeculae (>3 cells thick), loss of reticulin network, nuclear pleomorphism, atypical mitoses, and pseudoacinar glandular structures.",
        "keyConcept": "HCC: thickened hepatocyte trabeculae (>3 cells), loss of reticulin framework, and marked nuclear atypia.",
        "imageUrl": "/images/practical/mgl-3/pathology/hcc_on_cirrhosis_he.webp"
    },
    {
        "seq": 7,
        "lecture": 1,
        "text": "Examine this cross-section of the appendix in a patient with acute right iliac fossa peritonitis. What histopathological feature is diagnostic of Acute Suppurative Appendicitis?",
        "correct_answer": "Dense transmural neutrophilic infiltration extending through the muscularis propria into the subserosa",
        "distractors": [
            "Submucosal lymphoid hyperplasia with intact germinal centers",
            "Carcinoid tumor cells in the tip of the appendix",
            "Granulomatous inflammation with Langhans giant cells"
        ],
        "explanation": "Criteria of Identification: The definitive histological hallmark required to establish acute appendicitis is acute neutrophilic leukocytic infiltration of the muscularis propria and serosa. Mucosal ulceration alone is insufficient; transmural neutrophil infiltration confirms acute suppurative inflammation.",
        "keyConcept": "Acute suppurative appendicitis: Neutrophilic infiltration traversing the muscularis propria.",
        "imageUrl": "/images/practical/mgl-3/pathology/acute_appendicitis_gross.webp"
    },
    {
        "seq": 8,
        "lecture": 1,
        "text": "Examine this pedunculated colonic polyp resected from a 6-year-old child presenting with rectal bleeding. Histology shows abundant cystically dilated, mucin-filled glands embedded in an edematous, inflamed lamina propria. Identify this polyp:",
        "correct_answer": "Juvenile (Retention / Hamartomatous) Polyp",
        "distractors": [
            "Tubular adenomatous polyp",
            "Hyperplastic polyp",
            "Peutz-Jeghers hamartomatous polyp with arborizing smooth muscle"
        ],
        "explanation": "Criteria of Identification: Juvenile polyps are benign hamartomatous/retention lesions common in children. Histology reveals round, smooth polyps containing large, cystically dilated crypts filled with mucin and inflammatory debris, set within an expanded, edematous, vascular stroma with chronic inflammation. They possess no intrinsic malignant potential.",
        "keyConcept": "Juvenile polyp: Cystically dilated mucinous glands in abundant edematous, inflamed stroma.",
        "imageUrl": "/images/practical/mgl-3/pathology/juvenile_retention_polyp_micro.webp"
    },
    {
        "seq": 9,
        "lecture": 1,
        "text": "Examine this colonic polyp biopsy showing branching tubular glands lined by crowded, stratified, hyperchromatic columnar cells with mucin depletion. What is this neoplastic lesion and its malignant potential?",
        "correct_answer": "Tubular adenoma (benign neoplastic polyp with ~5% risk of malignant transformation)",
        "distractors": [
            "Hyperplastic polyp with zero malignant risk",
            "Villous adenoma with >40% risk of malignant transformation",
            "Inflammatory pseudopolyp in ulcerative colitis"
        ],
        "explanation": "Criteria of Identification: Tubular adenomas are the most common benign neoplastic polyps of the colon (>75%). Histology displays branching, crowded tubular glands (>75% tubular architecture) lined by dysplastic epithelium with elongated 'cigar-shaped' pseudostratified hyperchromatic nuclei. Risk of malignancy correlates with size and villous component (~5% overall).",
        "keyConcept": "Tubular adenoma: Crowded dysplastic tubular glands; low-grade premalignant adenomatous polyp.",
        "imageUrl": "/images/practical/mgl-3/pathology/tubular_adenoma_colon_micro.webp"
    },
    {
        "seq": 10,
        "lecture": 1,
        "text": "Examine this sessile rectosigmoid polyp showing long, slender, finger-like papillary fronds projecting from the mucosal surface with high-grade dysplasia. What is this adenoma variant and its clinical significance?",
        "correct_answer": "Villous adenoma (high malignant potential, ~40–50% risk of invasive adenocarcinoma)",
        "distractors": [
            "Tubular adenoma with low malignant risk",
            "Juvenile hamartomatous polyp",
            "Peutz-Jeghers polyp"
        ],
        "explanation": "Criteria of Identification: Villous adenomas (>50% villous architecture) consist of long, slender, finger-like or cauliflower-like projections lined by severely dysplastic epithelial cells. They are typically large, sessile lesions in the rectum/rectosigmoid and carry the highest malignancy risk among colonic adenomas (approaching 40–50%).",
        "keyConcept": "Villous adenoma: Long finger-like papillary fronds; highest malignant risk among adenomas (~40–50%).",
        "imageUrl": "/images/practical/mgl-3/pathology/villous_adenoma_colon_micro.webp"
    },
    {
        "seq": 11,
        "lecture": 1,
        "text": "Examine this invasive colonic tumor section. Irregular, crowded, atypical glandular structures are seen infiltrating deep into the muscularis propria, accompanied by pleomorphic hyperchromatic nuclei, atypical mitoses, and central necrotic debris ('dirty necrosis'). Identify this neoplasm:",
        "correct_answer": "Adenocarcinoma of the large intestine (colorectal adenocarcinoma)",
        "distractors": [
            "Colonic carcinoid (neuroendocrine) tumor",
            "Gastrointestinal stromal tumor (GIST)",
            "Benign tubulovillous adenoma"
        ],
        "explanation": "Criteria of Identification: Colorectal adenocarcinoma is characterized by invasive, irregular, cribriform malignant glands penetrating through the muscularis mucosae into the muscularis propria and subserosa. Tumor cells exhibit high nuclear-to-cytoplasmic ratio, loss of polarity, prominent nucleoli, and luminal eosinophilic necrotic debris ('dirty necrosis').",
        "keyConcept": "Colorectal adenocarcinoma: Infiltrative malignant glands invading muscularis propria with 'dirty necrosis'.",
        "imageUrl": "/images/practical/mgl-3/pathology/colorectal_adenocarcinoma_micro.webp"
    },
    {
        "seq": 12,
        "lecture": 1,
        "text": "Examine this histological section of an aggressive colon carcinoma showing large pools of extracellular blue-staining mucin within which float clusters of malignant cells and isolated signet ring cells. Identify this histological subtype:",
        "correct_answer": "Mucinous (Colloid) adenocarcinoma of the large intestine",
        "distractors": [
            "Conventional well-differentiated tubular adenocarcinoma",
            "Medullary carcinoma of the colon",
            "Squamous cell carcinoma of the anal canal"
        ],
        "explanation": "Criteria of Identification: Mucinous (colloid) adenocarcinoma is defined by extracellular mucin pools comprising >50% of the tumor volume. Glandular structures rupture, spilling lakes of mucin into the bowel wall. Malignant cells float as irregular clusters or individual 'signet ring' cells with peripheral crescentic nuclei displaced by intracellular mucin.",
        "keyConcept": "Mucinous adenocarcinoma: Extracellular mucin pools (>50%) containing floating malignant cells / signet ring cells.",
        "imageUrl": "/images/practical/mgl-3/pathology/mucinous_adenocarcinoma_micro.webp"
    },
    {
        "seq": 13,
        "lecture": 1,
        "text": "Examine this gross liver section showing dense white periportal fibrosis around portal tracts. Identify this chronic hepatic condition:",
        "correct_answer": "Schistosomal periportal (Symmers clay-pipe-stem) fibrosis",
        "distractors": [
            "Micronodular alcoholic cirrhosis (Laennec's cirrhosis)",
            "Primary biliary cholangitis",
            "Budd-Chiari syndrome (hepatic vein thrombosis)"
        ],
        "explanation": "Criteria of Identification: Symmers clay-pipe-stem fibrosis is caused by Schistosoma mansoni ova embolizing into portal venules, inciting intense granulomatous inflammation and dense pipe-stem fibrosis confined to periportal spaces, while preserving hepatic lobular architecture without regenerative nodules.",
        "keyConcept": "Symmers fibrosis: periportal fibrosis with preserved lobular architecture and absence of nodular regeneration.",
        "imageUrl": "/images/practical/mgl-3/pathology/schistosomal_clay_pipe_stem_fibrosis.webp"
    },

    # ── GROSS MUSEUM PATHOLOGY STATIONS (Stations 14–30) ────────────────────────
    {
        "seq": 14,
        "lecture": 1,
        "text": "Examine this museum specimen of the stomach. An isolated oval ulcer with sharply punched-out margins, flat clean base, and mucosal folds radiating symmetrically outward toward the crater is demonstrated. Identify this lesion:",
        "correct_answer": "Chronic benign gastric peptic ulcer",
        "distractors": [
            "Malignant ulcerating gastric adenocarcinoma",
            "Linitis plastica",
            "Acute stress erosion"
        ],
        "explanation": "Criteria of Identification: A chronic benign peptic ulcer is classically round to oval, small (<2–3 cm), with clean, sharply 'punched-out' margins that are not raised or everted. The mucosal rugal folds radiate smoothly up to the very margin of the crater like spokes of a wheel, and the base is clean, firm, and flat (devoid of fungating necrosis).",
        "keyConcept": "Benign peptic ulcer gross features: Sharply punched-out edges, radiating mucosal folds, clean flat floor.",
        "imageUrl": "/images/practical/mgl-3/pathology/peptic_ulcer_gross_punched_out.webp"
    },
    {
        "seq": 15,
        "lecture": 1,
        "text": "Examine this gross specimen of a resected stomach. A large (>4 cm) irregular ulcer is seen with raised, thickened, rolled, everted margins and a necrotic, hemorrhagic base; surrounding mucosal folds stop abruptly short of the crater. Identify this lesion:",
        "correct_answer": "Malignant gastric ulcer (ulcerating gastric adenocarcinoma)",
        "distractors": [
            "Chronic benign peptic ulcer",
            "Gastric gastrointestinal stromal tumor (GIST)",
            "Menetrier disease"
        ],
        "explanation": "Criteria of Identification: Malignant gastric ulcers are characterized by large size (>3–4 cm), irregular asymmetrical outline, heaped-up raised 'everted' or rolled borders, an indurated dirty necrotic base, and abrupt interruption/fusion of surrounding mucosal folds before reaching the crater edge.",
        "keyConcept": "Malignant gastric ulcer: Raised everted edges, necrotic irregular floor, interrupted mucosal folds.",
        "imageUrl": "/images/practical/mgl-3/pathology/malignant_gastric_ulcer_gross.webp"
    },
    {
        "seq": 16,
        "lecture": 1,
        "text": "Examine this gastrectomy museum specimen. The stomach wall is diffusely, markedly thickened and rigid with complete loss of mucosal rugae, transforming the organ into an inelastic 'leather-bottle' container. Identify this gross entity:",
        "correct_answer": "Linitis Plastica (diffuse infiltrating scirrhous gastric adenocarcinoma)",
        "distractors": [
            "Chronic hypertrophic gastropathy",
            "Gastric amyloidosis",
            "Extensive gastrointestinal stromal tumor"
        ],
        "explanation": "Criteria of Identification: Linitis Plastica is the classical gross manifestation of diffuse-type gastric adenocarcinoma (Lauren classification). Signet ring tumor cells extensively infiltrate throughout the submucosa and muscularis propria, evoking a massive reactive desmoplastic stromal fibrosis that thickens the wall (up to 2 cm) and renders the stomach rigid and non-distensible ('leather-bottle stomach').",
        "keyConcept": "Linitis Plastica: Diffuse desmoplastic scirrhous thickening of stomach wall ('leather-bottle stomach').",
        "imageUrl": "/images/practical/mgl-3/pathology/linitis_plastica_gross.webp"
    },
    {
        "seq": 17,
        "lecture": 1,
        "text": "Examine this gross liver specimen showing a diffuse 'hobnail' external surface comprised of small, uniform nodules measuring less than 3 mm in diameter separated by delicate fibrous bands. Identify this type of cirrhosis:",
        "correct_answer": "Micronodular cirrhosis (Laennec's / Alcoholic cirrhosis)",
        "distractors": [
            "Macronodular post-hepatitic cirrhosis",
            "Biliary cirrhosis",
            "Cardiac cirrhosis with nutmeg pattern"
        ],
        "explanation": "Criteria of Identification: Micronodular cirrhosis is characterized by tiny, uniform regenerative nodules (< 3 mm in diameter) distributed uniformly throughout the entire liver parenchyma. It is classic for chronic alcohol abuse (Laennec's cirrhosis), nutritional deficiency, and early biliary tract obstruction.",
        "keyConcept": "Micronodular cirrhosis: Uniform small nodules (<3 mm), classic for alcoholic liver disease.",
        "imageUrl": "/images/practical/mgl-3/pathology/micronodular_cirrhosis_gross.webp"
    },
    {
        "seq": 18,
        "lecture": 1,
        "text": "Examine this gross liver specimen showing large, irregular, variable nodules measuring between 5 mm and 3 cm in diameter separated by broad, depressed fibrous scars. Identify this type of cirrhosis:",
        "correct_answer": "Macronodular cirrhosis (Post-necrotic / Post-hepatitic cirrhosis)",
        "distractors": [
            "Micronodular alcoholic cirrhosis",
            "Wilson disease",
            "Hemochromatosis"
        ],
        "explanation": "Criteria of Identification: Macronodular cirrhosis exhibits large, irregular, highly variable nodules (> 3 mm, up to several centimeters) separated by wide, irregular bands of fibrous scar tissue. It is typical of post-necrotic collapse following chronic viral hepatitis B or C infection, or autoimmune hepatitis.",
        "keyConcept": "Macronodular cirrhosis: Variable large nodules (>3 mm) with broad fibrous scars; typical of viral hepatitis.",
        "imageUrl": "/images/practical/mgl-3/pathology/macronodular_cirrhosis_gross.webp"
    },
    {
        "seq": 19,
        "lecture": 1,
        "text": "Examine this cross-section of a cirrhotic liver showing a large, prominent, yellowish-green solitary tumor mass with areas of hemorrhage and necrosis. Identify this complication:",
        "correct_answer": "Hepatocellular carcinoma (HCC) arising on top of cirrhosis",
        "distractors": [
            "Hepatic cavernous hemangioma",
            "Hepatic adenoma",
            "Focal nodular hyperplasia"
        ],
        "explanation": "Criteria of Identification: Hepatocellular carcinoma frequently arises in cirrhotic livers (annual incidence 3–5%). Grossly, it presents as a large dominant unifocal mass, multifocal nodules, or a diffuse infiltrative tumor. The tumor tissue often has a yellowish or greenish hue due to endogenous bile production by malignant hepatocytes, accompanied by central ischemic necrosis.",
        "keyConcept": "HCC on cirrhosis: Large green-yellow tumor mass (bile-producing) with hemorrhage and necrosis.",
        "imageUrl": "/images/practical/mgl-3/pathology/cirrhosis_with_hcc_gross.webp"
    },
    {
        "seq": 20,
        "lecture": 1,
        "text": "Examine this museum specimen of an opened gallbladder. The wall is markedly thickened, opaque, and fibrotic, and the lumen contains multiple faceted, yellowish-gray stones. Identify this condition:",
        "correct_answer": "Chronic cholecystitis with mixed cholesterol-pigment gallstones",
        "distractors": [
            "Acute gangrenous cholecystitis with a solitary pure cholesterol stone",
            "Adenocarcinoma of the gallbladder fundus",
            "Strawberry gallbladder (cholesterolosis)"
        ],
        "explanation": "Criteria of Identification: Chronic cholecystitis results from recurrent attacks of acute inflammation or mechanical irritation by gallstones. The gallbladder wall is thickened (often 3–5 mm) and dense white due to subserosal fibrosis. The presence of multiple faceted, hard calculi indicates mixed gallstones (calcium bilirubinate, cholesterol, and calcium carbonate).",
        "keyConcept": "Chronic cholecystitis: Thickened fibrotic gallbladder wall containing multiple faceted mixed stones.",
        "imageUrl": "/images/practical/mgl-3/pathology/chronic_cholecystitis_gallstones_gross.webp"
    },
    {
        "seq": 21,
        "lecture": 1,
        "text": "Examine this small intestine specimen. A blind-ended, finger-like pouch measuring approximately 5 cm in length arises from the antimesenteric border of the terminal ileum. Identify this congenital anomaly:",
        "correct_answer": "Meckel's diverticulum (persistent vitelline / omphalomesenteric duct)",
        "distractors": [
            "Duodenal diverticulum on the mesenteric border",
            "Traction diverticulum of the jejunum",
            "Duplication cyst of the ileum"
        ],
        "explanation": "Criteria of Identification: Meckel's diverticulum is the most common congenital GI anomaly (2% of population). It is a true diverticulum (containing all bowel wall layers) situated on the antimesenteric border of the ileum roughly 2 feet (60 cm) proximal to the ileocecal valve, resulting from incomplete obliteration of the vitelline (omphalomesenteric) duct.",
        "keyConcept": "Meckel's diverticulum: Blind pouch on the antimesenteric border of ileum from persistent vitelline duct.",
        "imageUrl": "/images/practical/mgl-3/pathology/meckel_diverticulum_gross.webp"
    },
    {
        "seq": 22,
        "lecture": 1,
        "text": "Examine this specimen of the terminal ileum from a patient who died of acute peritonitis during typhoid fever. Several oval ulcers are seen oriented longitudinally along the long axis of the bowel, matching the distribution of Peyer's patches. Identify these lesions:",
        "correct_answer": "Typhoid ulcers of the small intestine",
        "distractors": [
            "Tuberculous ulcers of the small intestine",
            "Crohn's disease cobblestone mucosal fissures",
            "Amoebic ulcers of the ileum"
        ],
        "explanation": "Criteria of Identification: Typhoid ulcers occur in the ileum when Salmonella typhi multiplies within Peyer's patches, causing hyperplastic reticuloendothelial proliferation followed by ischemic necrosis and sloughing. The resulting ulcers are oval and oriented longitudinally along the long axis of the intestine, conforming to Peyer's patch anatomy. The ulcer floor is thin and clean, carrying a high risk of perforation.",
        "keyConcept": "Typhoid ulcers: Oval, longitudinal along long axis of Peyer's patches; prone to perforation.",
        "imageUrl": "/images/practical/mgl-3/pathology/typhoid_ulcers_ileum_gross.webp"
    },
    {
        "seq": 23,
        "lecture": 1,
        "text": "Examine this specimen of the small intestine from a patient with intestinal tuberculosis. An ulcer is seen encircling the bowel lumen in a transverse orientation with ragged, undermined edges. Identify this ulcer:",
        "correct_answer": "Tuberculous ulcer of the small intestine",
        "distractors": [
            "Typhoid ulcer of the small intestine",
            "Peptic ulcer of the duodenum",
            "Ulcerative colitis"
        ],
        "explanation": "Criteria of Identification: Intestinal tuberculosis spreads circumferentially along the lymphatic drainage channels of the intestinal wall. Consequently, tuberculous ulcers are transverse (perpendicular to the long axis of the bowel), encircling the lumen like a belt or girdle. Healing by fibrosis causes concentric ring strictures and mechanical bowel obstruction.",
        "keyConcept": "Tuberculous ulcers: Transverse/girdle orientation encircling lumen; heal with fibrotic strictures.",
        "imageUrl": "/images/practical/mgl-3/pathology/tuberculous_ulcers_ileum_gross.webp"
    },
    {
        "seq": 24,
        "lecture": 1,
        "text": "Examine this surgically resected appendix. The organ is markedly swollen, turgid, intensely congested with prominent subserosal vessels, and coated by a yellowish-gray fibrinopurulent exudate. Identify this surgical specimen:",
        "correct_answer": "Acute suppurative (gangrenous) appendicitis",
        "distractors": [
            "Mucocele of the appendix",
            "Carcinoid tumor of the appendiceal tip",
            "Chronic quiescent appendicitis"
        ],
        "explanation": "Criteria of Identification: In acute suppurative appendicitis, obstruction of the lumen leads to bacterial proliferation, venous thrombosis, and transmural ischemic necrosis. Grossly, the appendix appears swollen, rigid, dusky red to purplish-black (gangrenous), with loss of serosal sheen and a covering of thick fibrinopurulent exudate.",
        "keyConcept": "Gross acute appendicitis: Swollen, purplish, turgid appendix covered in dull fibrinopurulent exudate.",
        "imageUrl": "/images/practical/mgl-3/pathology/acute_appendicitis_gross.webp"
    },
    {
        "seq": 25,
        "lecture": 1,
        "text": "Examine this gross specimen of the sigmoid colon. An infiltrative, circumferential tumor encircles the bowel wall with luminal narrowing, resembling a 'napkin-ring' or 'apple-core' constriction. Identify this gross pattern of colorectal carcinoma:",
        "correct_answer": "Annular constricting (scirrhous) carcinoma of the colon",
        "distractors": [
            "Fungating polypoid adenocarcinoma of the cecum",
            "Benign colonic stricture due to diverticular disease",
            "Crohn's disease string sign"
        ],
        "explanation": "Criteria of Identification: Left-sided colorectal cancers (descending and sigmoid colon) characteristically present as circumferential annular constricting lesions ('napkin-ring' or 'apple-core'). Abundant desmoplastic fibrous stroma causes inward luminal stenosing, leading to early bowel obstruction, altered bowel habits, and colicky abdominal pain.",
        "keyConcept": "Annular constricting carcinoma: Circumferential 'napkin-ring' lesion common in distal/sigmoid colon.",
        "imageUrl": "/images/practical/mgl-3/pathology/colorectal_annular_carcinoma_gross.webp"
    },
    {
        "seq": 26,
        "lecture": 1,
        "text": "Examine this cecal resection specimen. A massive, polypoid, cauliflower-like exophytic mass projects into the wide cecal lumen with surface ulceration and hemorrhage, but without luminal obstruction. Identify this gross tumor type:",
        "correct_answer": "Fungating (polypoid / exophytic) carcinoma of the cecum",
        "distractors": [
            "Annular constricting carcinoma of the sigmoid",
            "Tubular adenomatous polyp",
            "Appendiceal carcinoid tumor"
        ],
        "explanation": "Criteria of Identification: Right-sided colon carcinomas (cecum and ascending colon) typically present as large, bulky, cauliflower-like polypoid (fungating) masses protruding into the capacious lumen. Because the cecal lumen is wide and fecal content is liquid, they rarely cause bowel obstruction, presenting instead with occult GI bleeding, profound iron deficiency anemia, and palpable right iliac fossa mass.",
        "keyConcept": "Fungating cecal carcinoma: Bulky exophytic mass presenting with occult bleeding and iron deficiency anemia.",
        "imageUrl": "/images/practical/mgl-3/pathology/colorectal_fungating_carcinoma_gross.webp"
    },
    {
        "seq": 27,
        "lecture": 1,
        "text": "Examine this rectal resection specimen showing a single large ulcer with elevated, rolled, everted margins and a necrotic indurated base infiltrating the rectal wall. Identify this lesion:",
        "correct_answer": "Malignant ulcer (ulcerating adenocarcinoma) of the rectum",
        "distractors": [
            "Solitary rectal ulcer syndrome (benign)",
            "Amoebic ulcer of the rectum",
            "Tuberculous rectal ulcer"
        ],
        "explanation": "Criteria of Identification: Ulcerating carcinoma of the rectum presents as a large, solitary, crater-like lesion with classical malignant characteristics: raised, everted, indurated edges, a sloughy necrotic base, and deep penetration into the muscular rectal coat, presenting with fresh rectal bleeding (hematochezia) and tenesmus.",
        "keyConcept": "Malignant rectal ulcer: Raised everted edges, indurated base, causing hematochezia and tenesmus.",
        "imageUrl": "/images/practical/mgl-3/pathology/peptic_ulcer_gross_punched_out.webp"
    },
    {
        "seq": 28,
        "lecture": 1,
        "text": "Examine this opened colon specimen showing multiple discrete, scattered ulcers with undermined edges and necrotic yellowish slough, separated by intervening patches of entirely normal mucosa. Identify these lesions:",
        "correct_answer": "Amoebic ulcers of the colon (due to Entamoeba histolytica)",
        "distractors": [
            "Bacillary dysentery ulcerations (Shigellosis)",
            "Ulcerative colitis with diffuse continuous involvement",
            "Pseudomembranous colitis"
        ],
        "explanation": "Criteria of Identification: Entamoeba histolytica trophozoites secrete histolytic enzymes that penetrate crypt bases and spread laterally in the submucosa, producing classical 'flask-shaped' ulcers with narrow necks, undermined edges, and necrotic bases. Crucially, the intervening mucosa between ulcers remains completely normal (unlike the diffuse mucosal erythema of bacillary dysentery or ulcerative colitis).",
        "keyConcept": "Amoebic ulcers: Flask-shaped ulcers with undermined edges and normal intervening mucosa.",
        "imageUrl": "/images/practical/mgl-3/pathology/amoebic_ulcers_colon_gross.webp"
    },
    {
        "seq": 29,
        "lecture": 1,
        "text": "Examine this colon specimen from a patient with fatal bacillary dysentery (Shigellosis). The entire mucosal surface is intensely congested, edematous, and covered by a diffuse, superficial diphtheritic yellowish-green membrane ('bran-like' appearance) with widespread shallow erosions. Identify this entity:",
        "correct_answer": "Bacillary dysentery (Acute Shigella colitis)",
        "distractors": [
            "Amoebic colitis with flask-shaped ulcers",
            "Ischemic colitis with segmental stricture",
            "Familial adenomatous polyposis"
        ],
        "explanation": "Criteria of Identification: Shigella dysentery causes acute diffuse, superficial inflammation of the entire colonic mucosa without deep submucosal burrowing. Coagulative necrosis of the superficial epithelium combines with fibrin and polymorphonuclear exudate to form a diffuse 'bran-like' or diphtheritic pseudomembrane over shallow, confluent mucosal erosions; normal mucosa between lesions is completely absent.",
        "keyConcept": "Bacillary dysentery: Diffuse, continuous superficial mucosal necrosis with 'bran-like' pseudomembrane.",
        "imageUrl": "/images/practical/mgl-3/pathology/amoebic_ulcers_colon_gross.webp"
    },
    {
        "seq": 30,
        "lecture": 1,
        "text": "Examine this gross specimen of the colon showing a discrete, lobulated, spherical mucosal mass elevated on a distinct fibrovascular stalk (pedicle). Identify this gross lesion:",
        "correct_answer": "Pedunculated adenomatous polyp of the colon",
        "distractors": [
            "Sessile flat adenoma",
            "Ulcerative colitis pseudopolyp",
            "Submucosal lipoma"
        ],
        "explanation": "Criteria of Identification: A pedunculated polyp consists of a discrete head (composed of dysplastic adenomatous glandular epithelium) elevated above the surrounding normal mucosa by a distinct, non-neoplastic, elongated stalk (pedicle) lined by normal colonic mucosa and containing a central fibrovascular core.",
        "keyConcept": "Pedunculated polyp: Dysplastic adenoma on an elongated fibrovascular stalk.",
        "imageUrl": "/images/practical/mgl-3/pathology/juvenile_retention_polyp_micro.webp"
    }
]

# NET_NEW_PATHOLOGY for stations 31 to 65

NET_NEW_PATHOLOGY = [
    {
        "seq": 31,
        "lecture": 2,
        "text": "Examine this distal esophageal mucosal biopsy. Identify the pathological glandular replacement of stratified squamous epithelium:",
        "correct_answer": "Barrett esophagus (Intestinal metaplasia with goblet cells)",
        "distractors": [
            "Squamous cell carcinoma in situ",
            "Reflux esophagitis without metaplasia",
            "Infectious candida esophagitis"
        ],
        "explanation": "Criteria of Identification: Barrett esophagus is defined histopathologically by intestinal metaplasia within the distal esophagus, wherein normal stratified squamous epithelium is replaced by columnar mucosa containing alcian-blue positive, mucin-filled goblet cells, conferring significant risk for esophageal adenocarcinoma.",
        "keyConcept": "Barrett esophagus: intestinal columnar metaplasia with true goblet cells in distal esophagus.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0031.webp"
    },
    {
        "seq": 32,
        "lecture": 2,
        "text": "Examine this histopathological section of Barrett esophagus. Identify the feature indicating high-grade dysplasia:",
        "correct_answer": "Marked nuclear pleomorphism, architectural complexity, and atypical mitoses reaching the epithelial surface",
        "distractors": [
            "Regular basal nuclei with abundant intracellular glycogen",
            "Preserved cellular polarity with basal lamina intact",
            "Dense lymphocytic infiltrate confined to the submucosa"
        ],
        "explanation": "Criteria of Identification: High-grade dysplasia in Barrett esophagus exhibits crowded glandular architecture (cribriforming), loss of nuclear polarity, marked hyperchromasia, enlarged pleomorphic nuclei extending to the luminal surface, and atypical mitotic figures.",
        "keyConcept": "Barrett dysplasia: architectural crowding, loss of polarity, and atypical mitoses reaching mucosal surface.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0032.webp"
    },
    {
        "seq": 33,
        "lecture": 2,
        "text": "Examine this gross museum jar of the distal esophagus and proximal stomach from a cirrhotic patient. Identify these tortuous, dilated submucosal venous channels:",
        "correct_answer": "Esophageal varices",
        "distractors": [
            "Esophageal leiomyomas",
            "Malignant submucosal lymphoma",
            "Traction esophageal diverticula"
        ],
        "explanation": "Criteria of Identification: Esophageal varices appear on gross examination as prominent, tortuous, cord-like or serpentine bluish submucosal vessels bulging into the distal esophageal lumen, developing as portosystemic collaterals connecting the left gastric (coronary) vein with the azygos venous system in portal hypertension.",
        "keyConcept": "Esophageal varices: dilated serpentine submucosal portosystemic collateral veins in distal esophagus.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0033.webp"
    },
    {
        "seq": 34,
        "lecture": 2,
        "text": "Examine this histopathological section from an esophageal biopsy. Identify this malignant neoplasm demonstrating invasive epithelial nests with keratin pearls:",
        "correct_answer": "Well-to-moderately differentiated Squamous Cell Carcinoma",
        "distractors": [
            "Esophageal adenocarcinoma",
            "Small cell neuroendocrine carcinoma",
            "Gastrointestinal stromal tumor (GIST)"
        ],
        "explanation": "Criteria of Identification: Squamous cell carcinoma of the esophagus is characterized by sheets and nests of malignant polygonal squamous cells displaying prominent intercellular bridges (desmosomes), nuclear atypia, and concentric concentric whorls of bright pink keratin pearls invading into the submucosa and muscularis propria.",
        "keyConcept": "Esophageal SCC: invasive malignant polygonal nests with intercellular bridges and concentric keratin pearls.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0034.webp"
    },
    {
        "seq": 35,
        "lecture": 3,
        "text": "Examine this gross museum specimen of the stomach. Identify the pinned mucosal lesion indicated by [A]:",
        "correct_answer": "Chronic benign peptic ulcer",
        "distractors": [
            "Malignant fungating ulcer",
            "Polypoid adenoma",
            "Superficial erosive gastritis"
        ],
        "explanation": "Criteria of Identification: Benign chronic peptic ulcers are characteristically punched-out, sharply demarcated round-to-oval craters with perpendicular (straight) walls, a clean, smooth greyish-white base, and surrounding mucosal folds that radiate symmetrically like spokes of a wheel right to the ulcer margin.",
        "keyConcept": "Chronic peptic ulcer: sharply demarcated, punched-out crater with straight walls and radiating mucosal folds.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0035.webp"
    },
    {
        "seq": 36,
        "lecture": 3,
        "text": "Examine this gross museum specimen of the stomach. Identify the lesion indicated by pin [A] showing irregular, rolled, everted margins:",
        "correct_answer": "Malignant gastric ulcer (Ulcerating adenocarcinoma)",
        "distractors": [
            "Chronic benign peptic ulcer",
            "Acute stress ulcer",
            "Gastric trichobezoar"
        ],
        "explanation": "Criteria of Identification: Malignant gastric ulcers (ulcerative adenocarcinoma) feature large, irregular outlines, raised, rolled, everted (heaped-up) indurated borders, a dirty necrotic hemorrhagic floor, and interrupted or effaced mucosal folds that fail to reach the ulcer crater.",
        "keyConcept": "Malignant gastric ulcer: irregular shape with raised rolled everted edges and necrotic dirty floor.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0036.webp"
    },
    {
        "seq": 37,
        "lecture": 3,
        "text": "Examine this gross stomach specimen demonstrating marked diffuse thickening and rigidity of the entire gastric wall with flattened rugae. Identify this entity:",
        "correct_answer": "Linitis plastica (Diffuse infiltrating gastric carcinoma)",
        "distractors": [
            "Chronic hypertrophic gastropathy (Ménétrier disease)",
            "Gastric amyloidosis",
            "Corrosive acid gastritis"
        ],
        "explanation": "Criteria of Identification: Linitis plastica ('leather bottle stomach') is the gross manifestation of diffuse-type gastric adenocarcinoma, where malignant signet-ring cells diffusely infiltrate the gastric wall, evoking massive reactive desmoplastic fibrosis that transforms the stomach into a rigid, non-distensible, thickened tube with flattened rugae.",
        "keyConcept": "Linitis plastica: diffusely thickened, rigid 'leather-bottle' gastric wall with flattened mucosal rugae.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0037.webp"
    },
    {
        "seq": 38,
        "lecture": 3,
        "text": "Examine this high-power histopathological section of the gastric wall. Identify these infiltrating malignant cells characterized by large mucin droplets displacing hyperchromatic nuclei to the cell periphery:",
        "correct_answer": "Signet-ring cell adenocarcinoma",
        "distractors": [
            "Adipocytes in submucosa",
            "Mucous neck cells",
            "Foamy histiocytes / xanthoma"
        ],
        "explanation": "Criteria of Identification: Signet-ring cell adenocarcinoma exhibits discohesive malignant epithelial cells diffusely infiltrating the stroma; each cell contains an expanded cytoplasmic pool of mucin that compresses and displaces the hyperchromatic, pleomorphic nucleus into a crescent shape against the plasma membrane.",
        "keyConcept": "Signet-ring cells: individual malignant cells with intracytoplasmic mucin vacuoles displacing nuclei to the periphery.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0038.webp"
    },
    {
        "seq": 39,
        "lecture": 4,
        "text": "Examine this gross surgical specimen of the vermiform appendix indicated by pin [A]. Identify this condition characterized by a swollen, turgid organ covered by dull purulent exudate with focal greenish-black necrosis:",
        "correct_answer": "Acute gangrenous appendicitis with perforation",
        "distractors": [
            "Mucocele of the appendix",
            "Carcinoid tumor of appendix",
            "Chronic obliterative appendicitis"
        ],
        "explanation": "Criteria of Identification: Acute gangrenous appendicitis presents as an enlarged, tense, congested appendix whose serosa has lost its glistening luster and is covered by creamy-yellow fibrinopurulent exudate, with focal friable, greenish-black ischemic gangrene leading to mural perforation.",
        "keyConcept": "Gangrenous appendicitis: turgid swollen appendix with fibrinous exudate and patchy dark ischemic wall necrosis.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0039.webp"
    },
    {
        "seq": 40,
        "lecture": 4,
        "text": "Examine this histopathological section of an appendix. Identify the pathognomonic diagnostic criterion for acute appendicitis:",
        "correct_answer": "Neutrophilic infiltration extending through the muscularis propria",
        "distractors": [
            "Lymphoid hyperplasia confined to the mucosal follicles",
            "Eosinophils restricted to the submucosa",
            "Granulomatous reaction with Langhans giant cells"
        ],
        "explanation": "Criteria of Identification: The definitive histological hallmark of acute appendicitis is transmural infiltration of polymorphonuclear neutrophils (PMNs) extending beyond the mucosa and submucosa into the muscularis propria, accompanied by mural congestion, edema, and mucosal ulceration.",
        "keyConcept": "Acute appendicitis: pathognomonic neutrophilic infiltration invading through the muscularis propria.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0040.webp"
    },
    {
        "seq": 41,
        "lecture": 4,
        "text": "Examine this surgical gross specimen of the appendix tip showing a firm, well-circumscribed, solid yellowish-tan submucosal nodule. Identify this neoplasm:",
        "correct_answer": "Carcinoid tumor (Well-differentiated neuroendocrine tumor / NET)",
        "distractors": [
            "Acute appendicitis",
            "Mucinous cystadenoma",
            "Primary adenocarcinoma"
        ],
        "explanation": "Criteria of Identification: Carcinoid tumors (well-differentiated NETs) of the appendix typically arise as an incidental, firm, well-circumscribed yellowish-tan submucosal or intramural mass situated at the bulbous tip of the appendix, composed of enterochromaffin cells rich in lipids.",
        "keyConcept": "Appendiceal carcinoid: solid, firm, circumscribed yellowish-tan submucosal nodule located at appendiceal tip.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0041.webp"
    },
    {
        "seq": 42,
        "lecture": 4,
        "text": "Examine this histopathological section of a neuroendocrine tumor. Identify the characteristic cytological architecture:",
        "correct_answer": "Monotonous nests and trabeculae of uniform polygonal cells with 'salt-and-pepper' chromatin",
        "distractors": [
            "Pleomorphic squamous cells with keratin pearls and atypical mitoses",
            "Cribriform atypical glands with necrotic debris",
            "Spindle cells arranged in intersecting fascicles"
        ],
        "explanation": "Criteria of Identification: Well-differentiated neuroendocrine tumors (carcinoids) are characterized by organoid islands, trabeculae, or rosettes of monotonous, uniform polygonal cells possessing round central nuclei with finely stippled 'salt-and-pepper' chromatin and modest granular eosinophilic cytoplasm.",
        "keyConcept": "Carcinoid histology: monotonous nests of uniform cells displaying finely stippled 'salt-and-pepper' chromatin.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0042.webp"
    },
    {
        "seq": 43,
        "lecture": 5,
        "text": "Examine this gross bowel resection of the terminal ileum. Identify the mucosal pattern showing deep linear ulcers separating islands of edematous mucosa ('cobblestone' appearance):",
        "correct_answer": "Crohn's disease",
        "distractors": [
            "Ulcerative colitis",
            "Ischemic colitis",
            "Pseudomembranous colitis"
        ],
        "explanation": "Criteria of Identification: Crohn's disease exhibits a classic 'cobblestone' mucosal appearance produced by intersecting longitudinal and transverse linear serpentine ulcers surrounding islands of swollen, intact mucosa, accompanied by transmural wall thickening, segmental 'skip lesions', and creeping mesenteric fat.",
        "keyConcept": "Crohn's gross: 'cobblestone' mucosa + deep linear fissures + skip lesions + creeping mesenteric fat.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0043.webp"
    },
    {
        "seq": 44,
        "lecture": 5,
        "text": "Examine this histopathological section of an intestinal resection from a patient with chronic inflammatory bowel disease. Identify this non-caseating granuloma:",
        "correct_answer": "Crohn's disease non-caseating epithelioid granuloma",
        "distractors": [
            "Tuberculous caseating granuloma",
            "Schistosomal egg granuloma",
            "Foreign-body giant cell reaction"
        ],
        "explanation": "Criteria of Identification: Crohn's disease features transmural inflammation with non-caseating granulomas (present in ~40–60% of cases) composed of focal aggregates of epithelioid histiocytes and multinucleated giant cells without central caseous necrosis, distributed through mucosa, submucosa, or serosa.",
        "keyConcept": "Crohn's histology: transmural lymphoid aggregates with non-caseating epithelioid granulomas.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0044.webp"
    },
    {
        "seq": 45,
        "lecture": 5,
        "text": "Examine this gross colectomy specimen. The mucosal inflammation is continuous from the rectum without skip lesions, displaying diffuse erythema, friability, and multiple inflammatory pseudopolyps. Identify this disease:",
        "correct_answer": "Ulcerative colitis",
        "distractors": [
            "Crohn's disease",
            "Intestinal tuberculosis",
            "Diverticulosis coli"
        ],
        "explanation": "Criteria of Identification: Ulcerative colitis affects the colon in a continuous, uninterrupted fashion beginning at the rectum and extending proximally without skip lesions. The mucosa shows diffuse erythema, granularity, shallow broad-based ulcers, and residual islands of regenerating mucosa forming inflammatory pseudopolyps.",
        "keyConcept": "Ulcerative colitis gross: continuous mucosal inflammation from rectum without skip areas + inflammatory pseudopolyps.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0045.webp"
    },
    {
        "seq": 46,
        "lecture": 5,
        "text": "Examine this colonic biopsy from a patient with bloody diarrhea. Identify the histological lesion characterized by neutrophils accumulating within the lumen of distorted colonic crypts:",
        "correct_answer": "Crypt abscess in Ulcerative Colitis",
        "distractors": [
            "Caseating granuloma",
            "Transmural lymphoid nodule",
            "Adenomatous dysplasia"
        ],
        "explanation": "Criteria of Identification: Active ulcerative colitis is characterized by mucosal-limited inflammation showing architectural crypt distortion (branching and shortening), goblet cell mucin depletion, and crypt abscesses (collections of neutrophils within the lumens of crypts of Lieberkühn).",
        "keyConcept": "Crypt abscess: collections of neutrophils within the lumen of distorted colonic crypts in active ulcerative colitis.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0046.webp"
    },
    {
        "seq": 47,
        "lecture": 5,
        "text": "Examine this gross museum specimen of the ileum indicated by pin [A]. Identify these ulcers whose long axis runs transversely (perpendicular) to the lumen of the bowel:",
        "correct_answer": "Tuberculous intestinal ulcers",
        "distractors": [
            "Typhoid enteric ulcers",
            "Amoebic flask-shaped ulcers",
            "Peptic duodenal ulcers"
        ],
        "explanation": "Criteria of Identification: Intestinal tuberculosis classically produces transverse ulcers whose long axis lies perpendicular to the long axis of the intestine because Mycobacterium tuberculosis spreads along circular mucosal lymphatic channels, accompanied by subserosal miliary tubercles and fibrous stricturing.",
        "keyConcept": "Tuberculous ulcers: transverse ulcers oriented perpendicular to bowel lumen following circular lymphatics.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0047.webp"
    },
    {
        "seq": 48,
        "lecture": 5,
        "text": "Examine this histopathological section of a bowel wall lesion. Identify this granuloma displaying central amorphous eosinophilic debris surrounded by epithelioid histiocytes and horseshoe-arranged multinucleated giant cells:",
        "correct_answer": "Caseating granuloma with Langhans giant cells (Tuberculosis)",
        "distractors": [
            "Non-caseating sarcoid granuloma",
            "Foreign body giant cell reaction",
            "Schistosomal granuloma"
        ],
        "explanation": "Criteria of Identification: Tuberculous granulomas (tubercles) are characterized by central caseous necrosis (acellular, structureless eosinophilic debris) surrounded by a mantle of epithelioid macrophages, lymphocytes, fibroblasts, and Langhans multinucleated giant cells with peripheral horseshoe-shaped nuclei.",
        "keyConcept": "Caseating granuloma: central caseous necrosis encircled by epithelioid cells and Langhans giant cells.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0048.webp"
    },
    {
        "seq": 49,
        "lecture": 5,
        "text": "Examine this gross museum specimen of the terminal ileum indicated by pin [A]. Identify these oval ulcers oriented longitudinally along the axis of the bowel overlying Peyer's patches:",
        "correct_answer": "Typhoid (enteric fever) ulcers",
        "distractors": [
            "Tuberculous transverse ulcers",
            "Amoebic flask-shaped ulcers",
            "Crohn's cobblestone fissures"
        ],
        "explanation": "Criteria of Identification: Typhoid ulcers (caused by Salmonella Typhi) are oval or elliptical ulcers oriented longitudinally along the long axis of the ileum on the antimesenteric border, reflecting necrosis and sloughing of inflamed lymphoid tissue in Peyer's patches, with soft, undermined edges and high perforation risk.",
        "keyConcept": "Typhoid ulcers: longitudinal oval ulcers overlying Peyer's patches oriented parallel to bowel axis.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0049.webp"
    },
    {
        "seq": 50,
        "lecture": 6,
        "text": "Examine this gross museum jar of the liver showing a large solitary necrotic cavity filled with thick reddish-brown fluid ('anchovy-sauce' appearance). Identify this condition:",
        "correct_answer": "Amoebic liver abscess",
        "distractors": [
            "Pyogenic liver abscess",
            "Hydatid cyst",
            "Hepatocellular carcinoma"
        ],
        "explanation": "Criteria of Identification: Amoebic liver abscess (complication of Entamoeba histolytica colitis) typically presents as a large, solitary cavity in the right hepatic lobe containing liquefied necrotic liver parenchyma resembling reddish-brown 'anchovy paste' or 'chocolate sauce', surrounded by an irregular shaggy fibrous wall.",
        "keyConcept": "Amoebic liver abscess: solitary right-lobe necrotic cavity containing sterile 'anchovy-sauce' chocolate fluid.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0050.webp"
    },
    {
        "seq": 51,
        "lecture": 6,
        "text": "Examine this high-power histopathological section from the margin of a colonic ulcer. Identify these round-to-oval protozoan organisms containing ingested red blood cells (erythrophagocytosis):",
        "correct_answer": "Entamoeba histolytica trophozoites",
        "distractors": [
            "Giardia lamblia trophozoites",
            "Balantidium coli trophozoites",
            "Histoplasma capsulatum"
        ],
        "explanation": "Criteria of Identification: Entamoeba histolytica trophozoites are 15–20 µm amoebic cells identified in tissue sections by a single round nucleus with central pinpoint karyosome and pathognomonic bright red ingested erythrocytes (erythrophagocytosis) in their vacuolated cytoplasm at the advancing margin of necrotic ulcer tissue.",
        "keyConcept": "E. histolytica trophozoite: round protozoan exhibiting pathognomonic erythrophagocytosis (ingested RBCs).",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0051.webp"
    },
    {
        "seq": 52,
        "lecture": 5,
        "text": "Examine this gross colectomy specimen showing hundreds of small, carpet-like adenomatous polyps covering the entire mucosal surface. Identify this hereditary syndrome:",
        "correct_answer": "Familial Adenomatous Polyposis (FAP)",
        "distractors": [
            "Peutz-Jeghers syndrome",
            "Juvenile polyposis syndrome",
            "Cowden syndrome"
        ],
        "explanation": "Criteria of Identification: Familial Adenomatous Polyposis (FAP) is an autosomal dominant condition caused by germline APC gene mutations on chromosome 5q21, manifested grossly by the development of > 100 (often thousands) of adenomatous polyps carpeting the colorectal mucosa, with a 100% lifetime risk of colorectal adenocarcinoma if untreated.",
        "keyConcept": "FAP: carpet-like coverage of > 100 adenomatous polyps throughout colon with 100% colorectal cancer risk.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0052.webp"
    },
    {
        "seq": 53,
        "lecture": 5,
        "text": "Examine this histopathological section of a colonic polyp showing branched, tubular adenomatous glands lined by pseudostratified, hyperchromatic dysplastic columnar epithelium. Identify this polyp type:",
        "correct_answer": "Tubular adenoma",
        "distractors": [
            "Villous adenoma",
            "Hyperplastic polyp",
            "Inflammatory polyp"
        ],
        "explanation": "Criteria of Identification: Tubular adenomas are the most common neoplastic polyps of the colon, composed predominantly (> 75%) of branching, rounded tubular glands lined by crowded, pseudostratified columnar epithelial cells with elongated hyperchromatic nuclei, maintaining a lobulated head on a fibrovascular stalk.",
        "keyConcept": "Tubular adenoma: > 75% tubular branching glands lined by pseudostratified dysplastic epithelium.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0053.webp"
    },
    {
        "seq": 54,
        "lecture": 5,
        "text": "Examine this gross colonic specimen demonstrating a broad-based, sessile mucosal mass with a soft, velvety, cauliflower-like surface of finger-like fronds. Identify this polyp type:",
        "correct_answer": "Villous adenoma",
        "distractors": [
            "Tubular adenoma",
            "Juvenile retention polyp",
            "Lipoma"
        ],
        "explanation": "Criteria of Identification: Villous adenomas are typically large, broad sessile polyps composed predominantly (> 50%) of long, slender, finger-like (villous) projections lined by dysplastic glandular epithelium, carrying the highest risk of malignant transformation (~40%) among colonic adenomas.",
        "keyConcept": "Villous adenoma: broad sessile cauliflower-like fronds carrying highest malignant transformation potential (~40%).",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0054.webp"
    },
    {
        "seq": 55,
        "lecture": 5,
        "text": "Examine this histopathological section from a large bowel resection. Identify this invasive malignancy showing atypical cribriform glands lined by pleomorphic columnar cells invading the muscularis propria:",
        "correct_answer": "Invasive colonic adenocarcinoma",
        "distractors": [
            "Carcinoid tumor",
            "Colonic leiomyosarcoma",
            "Benign adenomatous polyp"
        ],
        "explanation": "Criteria of Identification: Invasive adenocarcinoma of the colon is characterized by irregular, atypical, branched or cribriform malignant glands infiltrating through the muscularis mucosae into the muscularis propria, lined by pleomorphic, hyperchromatic cells displaying prominent loss of polarity and evoking dense desmoplastic fibrous stroma.",
        "keyConcept": "Colonic adenocarcinoma: invasive atypical cribriform glands infiltrating muscularis with desmoplastic stroma.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0055.webp"
    },
    {
        "seq": 56,
        "lecture": 5,
        "text": "Examine this gross colectomy specimen of the sigmoid colon indicated by pin [A]. Identify this annular, constricting neoplasm encircling the lumen ('napkin-ring' / 'apple-core' appearance):",
        "correct_answer": "Annular stenosing adenocarcinoma of the left colon",
        "distractors": [
            "Fungating polypoid adenocarcinoma",
            "Diverticular stricture",
            "Hirschsprung disease"
        ],
        "explanation": "Criteria of Identification: Adenocarcinomas of the left colon (descending and sigmoid colon) typically grow as encircling, annular napkin-ring lesions that infiltrate circumferentially, constricting the bowel lumen to cause early obstructive symptoms (change in bowel habits, 'pencil-thin' stools, and proximal colonic dilatation).",
        "keyConcept": "Annular adenocarcinoma: circumferential constricting 'napkin-ring' tumor causing luminal stenosis in left colon.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0056.webp"
    },
    {
        "seq": 57,
        "lecture": 5,
        "text": "Examine this gross cecal specimen indicated by pin [A] showing a large, bulky, cauliflower-like exophytic mass protruding into the lumen. Identify this neoplasm:",
        "correct_answer": "Fungating polypoid adenocarcinoma of the cecum / right colon",
        "distractors": [
            "Annular stenosing carcinoma",
            "Colonic lymphoma",
            "Amoeboma"
        ],
        "explanation": "Criteria of Identification: Adenocarcinomas of the right colon (cecum and ascending colon) grow as large, bulky, polypoid fungating masses that project into the capacious lumen without causing early obstruction; they bleed insidiously, presenting classically with iron deficiency anemia, fatigue, and melena.",
        "keyConcept": "Right-sided colon cancer: bulky exophytic fungating mass presenting with occult bleeding and microcytic anemia.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0057.webp"
    },
    {
        "seq": 58,
        "lecture": 6,
        "text": "Examine this gross museum jar of a liver indicated by pin [A] displaying diffuse, small, uniformly sized regenerating nodules (< 3 mm) separated by delicate fibrous septa. Identify this type of cirrhosis:",
        "correct_answer": "Micronodular (Laennec / Alcoholic) cirrhosis",
        "distractors": [
            "Macronodular post-necrotic cirrhosis",
            "Biliary cirrhosis",
            "Cardiac cirrhosis"
        ],
        "explanation": "Criteria of Identification: Micronodular cirrhosis (classic Laennec's cirrhosis associated with chronic alcoholism) is characterized by uniform, regular regenerating parenchymal nodules measuring less than 3 mm in diameter throughout the entire liver, separated by thin, delicate fibrous bands.",
        "keyConcept": "Micronodular cirrhosis: uniform small regenerating nodules (< 3 mm) throughout liver (classic in chronic alcoholism).",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0058.webp"
    },
    {
        "seq": 59,
        "lecture": 6,
        "text": "Examine this gross museum specimen of a liver indicated by pin [A] displaying irregular, large regenerating nodules (> 3 mm up to several centimeters) separated by broad, depressed scar tissue. Identify this type of cirrhosis:",
        "correct_answer": "Macronodular (Post-viral / Post-necrotic) cirrhosis",
        "distractors": [
            "Micronodular cirrhosis",
            "Fatty liver",
            "Primary biliary cholangitis"
        ],
        "explanation": "Criteria of Identification: Macronodular cirrhosis (post-necrotic cirrhosis, common following chronic hepatitis B or C infection) is characterized by irregularly distributed, large regenerative nodules exceeding 3 mm (often 1–3 cm) separated by wide, irregular bands of dense collagenous scar tissue.",
        "keyConcept": "Macronodular cirrhosis: large irregular nodules (> 3 mm) with wide dense fibrous scars (classic in post-viral hepatitis).",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0059.webp"
    },
    {
        "seq": 60,
        "lecture": 6,
        "text": "Examine this gross cut surface of a liver specimen indicated by pin [A] showing thick, whitish-grey fibrous cuffs surrounding portal tracts ('clay pipe-stem' appearance) while lobular architecture is preserved. Identify this condition:",
        "correct_answer": "Symmers' pipe-stem (Bilharzial / Schistosomal) hepatic fibrosis",
        "distractors": [
            "Micronodular cirrhosis",
            "Budd-Chiari syndrome",
            "Metastatic liver cancer"
        ],
        "explanation": "Criteria of Identification: Symmers' clay pipe-stem fibrosis is caused by chronic Schistosoma mansoni egg embolization into portal venules, producing dense concentric fibrous cuffs around portal tracts resembling the stems of clay pipes, characteristically without true regenerative nodules (preserving normal lobular architecture between fibrotic tracts).",
        "keyConcept": "Pipe-stem fibrosis: dense concentric periportal fibrous cuffs ('clay pipe-stem') with preserved lobular architecture.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0060.webp"
    },
    {
        "seq": 61,
        "lecture": 6,
        "text": "Examine this histopathological section of liver tissue. Identify this calcified parasite ovum with a prominent lateral spine surrounded by chronic granulomatous inflammation and fibrous tissue:",
        "correct_answer": "Schistosoma mansoni ovum with bilharzial granuloma",
        "distractors": [
            "Schistosoma haematobium ovum",
            "Fasciola gigantica ovum",
            "Echinococcus hooklet"
        ],
        "explanation": "Criteria of Identification: Schistosoma mansoni ova in liver tissue sections are recognized by their oval contour and distinctive, prominent lateral spine, encircled by an inflammatory granuloma composed of eosinophils, epithelioid cells, lymphocytes, and dense concentric collagen deposition in the portal triads.",
        "keyConcept": "S. mansoni egg: diagnostic lateral spine surrounded by eosinophil-rich granulomatous periportal fibrosis.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0061.webp"
    },
    {
        "seq": 62,
        "lecture": 6,
        "text": "Examine this gross liver specimen showing a large, variegated yellowish-green multinodular tumor with areas of hemorrhage and necrosis arising in a background of macronodular cirrhosis. Identify this neoplasm:",
        "correct_answer": "Hepatocellular Carcinoma (HCC)",
        "distractors": [
            "Hepatic hemangioma",
            "Focal nodular hyperplasia",
            "Hepatic adenoma"
        ],
        "explanation": "Criteria of Identification: Hepatocellular carcinoma (HCC) typically arises in a cirrhotic liver as a large, variegated unifocal or multinodular mass that exhibits yellowish-green coloration due to bile production by neoplastic hepatocytes, along with prominent areas of necrosis, hemorrhage, and propensity for vascular invasion into portal or hepatic veins.",
        "keyConcept": "Hepatocellular carcinoma: variegated bile-stained (greenish) invasive mass arising in a cirrhotic liver.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0062.webp"
    },
    {
        "seq": 63,
        "lecture": 6,
        "text": "Examine this liver biopsy stained with Masson's trichrome. Identify the pathological hallmark demonstrated by the bright blue-stained fibrous bands bridging adjacent portal tracts and encircling hepatocytes into nodules:",
        "correct_answer": "Bridging fibrous septa and regenerative nodule formation in cirrhosis",
        "distractors": [
            "Normal portal triad connective tissue",
            "Acute viral hepatitis without fibrosis",
            "Isolated microvesicular steatosis"
        ],
        "explanation": "Criteria of Identification: Masson's trichrome stains type I collagen bright blue, clearly demonstrating bridging fibrous septa (portal-portal or portal-central) completely encircling islands of surviving liver parenchyma into structurally abnormal regenerative nodules with loss of normal central vein relationships.",
        "keyConcept": "Masson trichrome in cirrhosis: dense blue-stained collagenous septa bridging tracts and encircling regenerative nodules.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0063.webp"
    },
    {
        "seq": 64,
        "lecture": 6,
        "text": "Examine this gross museum specimen of an opened gallbladder indicated by pin [A] showing a thickened, fibrous, porcelain-like wall packed with multiple faceted calculus stones. Identify this condition:",
        "correct_answer": "Chronic cholecystitis with mixed cholelithiasis",
        "distractors": [
            "Gallbladder adenocarcinoma",
            "Acute emphysematous cholecystitis",
            "Cholesterolosis (strawberry gallbladder)"
        ],
        "explanation": "Criteria of Identification: Chronic cholecystitis displays a contracted or thickened, opaque greyish-white fibrotic gallbladder wall with trabeculated mucosa, containing multiple faceted mixed (cholesterol/bilirubinate/calcium) gallstones resulting from repetitive mechanical irritation and low-grade inflammation.",
        "keyConcept": "Chronic cholecystitis: thickened fibrous wall containing multiple faceted mixed gallstones.",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0064.webp"
    },
    {
        "seq": 65,
        "lecture": 6,
        "text": "Examine this gross pancreatic specimen showing diffuse hemorrhagic parenchymal necrosis and patchy, opaque chalky-white flecks of enzymatic fat necrosis. Identify this acute condition:",
        "correct_answer": "Acute necrotizing hemorrhagic pancreatitis",
        "distractors": [
            "Chronic calcifying pancreatitis",
            "Pancreatic ductal adenocarcinoma",
            "Pancreatic pseudocyst"
        ],
        "explanation": "Criteria of Identification: Acute hemorrhagic pancreatitis is characterized by extensive parenchymal coagulative necrosis and interstitial hemorrhage caused by premature elastase activation, accompanied by diagnostic chalky-white, opaque foci of enzymatic fat necrosis where liberated lipases hydrolyze triglycerides into fatty acids that complex with calcium salts (saponification).",
        "keyConcept": "Acute hemorrhagic pancreatitis: parenchymal hemorrhage + chalky white patches of enzymatic fat necrosis (saponification).",
        "imageUrl": "/images/practical/mgl-3/pathology/img_path_0065.webp"
    }
]


PATHOLOGY_QUESTIONS = PATHOLOGY_QUESTIONS + NET_NEW_PATHOLOGY

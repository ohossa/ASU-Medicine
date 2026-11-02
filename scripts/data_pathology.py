# scripts/data_pathology.py
"""
Official 6 Pathology Practical Revision Questions for Year 3 GIT (MGL-3).
All questions are authentic spotter exam questions following ASU Faculty of Medicine guidelines:
- Slide / museum specimen shown with blanked labels and no text.
- Student identifies the pathological lesion / diagnosis.
"""

PATHOLOGY_QUESTIONS = [
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
        "lecture": 2,
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
        "lecture": 3,
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
        "lecture": 4,
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
        "lecture": 5,
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
        "seq": 6,
        "lecture": 6,
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
    }
]

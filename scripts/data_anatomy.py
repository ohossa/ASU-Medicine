# scripts/data_anatomy.py
"""
Official 37 Anatomy Practical Revision Questions for Year 3 GIT (MGL-3).
All questions are authentic spotter exam questions with NO giveaways in question stems.
All images have all labels and titles completely blanked out.
"""

ANATOMY_QUESTIONS = [
    {
        "seq": 1,
        "lecture": 1,
        "text": "In this sagittal section of the oral cavity and pharynx, identify the lymphoid structure in the tonsillar fossa:",
        "correct_answer": "Palatine tonsil",
        "distractors": [
            "Pharyngeal adenoid tonsil",
            "Lingual follicular tonsil",
            "Tubal mucosal tonsil"
        ],
        "explanation": "Criteria of Identification: Situated in the tonsillar fossa between the palatoglossal arch (anterior pillar) and palatopharyngeal arch (posterior pillar).",
        "keyConcept": "Palatine tonsil: lymphoid organ situated in the tonsillar fossa between palatoglossal and palatopharyngeal arches.",
        "imageUrl": "/images/practical/mgl-3/anatomy/sagittal_mouth_pharynx.webp"
    },
    {
        "seq": 2,
        "lecture": 1,
        "text": "In this deep dissection of the palatine tonsillar bed, identify the cranial nerve traversing the bed:",
        "correct_answer": "Glossopharyngeal nerve (CN IX)",
        "distractors": [
            "Hypoglossal motor nerve (CN XII)",
            "Lingual sensory nerve (V3)",
            "Accessory motor nerve (CN XI)"
        ],
        "explanation": "Criteria of Identification: The glossopharyngeal nerve (CN IX) courses along the lateral pharyngeal wall deep to the tonsillar bed, vulnerable to injury during tonsillectomy.",
        "keyConcept": "Glossopharyngeal nerve: traverses tonsillar bed supplying general sensation and taste to posterior 1/3 of tongue.",
        "imageUrl": "/images/practical/mgl-3/anatomy/palatine_tonsil_bed.webp"
    },
    {
        "seq": 3,
        "lecture": 1,
        "text": "On the dorsal surface of this dissected tongue, identify this V-shaped groove:",
        "correct_answer": "Sulcus terminalis",
        "distractors": [
            "Median lingual sulcus",
            "Glossoepiglottic fold",
            "Sublingual fold margin"
        ],
        "explanation": "Criteria of Identification: V-shaped sulcus with apex at foramen cecum, demarcating the boundary between anterior 2/3 and posterior 1/3 of the tongue.",
        "keyConcept": "Sulcus terminalis: V-shaped groove separating oral and pharyngeal tongue segments.",
        "imageUrl": "/images/practical/mgl-3/anatomy/tongue_dorsum_papillae.webp"
    },
    {
        "seq": 4,
        "lecture": 2,
        "text": "In this lateral head and neck dissection, identify the largest salivary gland shown:",
        "correct_answer": "Parotid salivary gland",
        "distractors": [
            "Submandibular gland",
            "Sublingual salivary gland",
            "Thyroid glandular lobe"
        ],
        "explanation": "Criteria of Identification: Occupies the retromandibular fossa anterior to the mastoid process and sternocleidomastoid muscle, enclosed by deep investing fascia.",
        "keyConcept": "Parotid gland: largest salivary gland situated in retromandibular space anterior to sternocleidomastoid.",
        "imageUrl": "/images/practical/mgl-3/anatomy/salivary_glands_topography.webp"
    },
    {
        "seq": 5,
        "lecture": 2,
        "text": "In this superficial facial dissection, identify the excretory duct crossing the masseter muscle:",
        "correct_answer": "Parotid duct (Stensen's duct)",
        "distractors": [
            "Submandibular duct of Wharton",
            "Major sublingual duct of Rivinus",
            "Nasolacrimal drainage duct"
        ],
        "explanation": "Criteria of Identification: Arises from anterior border of parotid, crosses superficial to masseter, pierces buccinator, and opens opposite the upper second molar.",
        "keyConcept": "Parotid duct: traverses masseter and pierces buccinator to open opposite the upper second molar.",
        "imageUrl": "/images/practical/mgl-3/anatomy/parotid_gland_stensen_duct.webp"
    },
    {
        "seq": 6,
        "lecture": 2,
        "text": "In this submandibular triangle dissection, identify the artery grooving the submandibular gland:",
        "correct_answer": "Facial artery",
        "distractors": [
            "Lingual arterial trunk",
            "Superficial temporal artery",
            "Maxillary branch artery"
        ],
        "explanation": "Criteria of Identification: Arises from external carotid, loops deep to digastric, grooves the posterior pole of submandibular gland, and enters face at anterior border of masseter.",
        "keyConcept": "Facial artery: intimately grooves the posterosuperior aspect of the submandibular salivary gland.",
        "imageUrl": "/images/practical/mgl-3/anatomy/submandibular_gland_digastric.webp"
    },
    {
        "seq": 7,
        "lecture": 3,
        "text": "In this anterior abdominal wall dissection, identify the aponeurotic opening indicated:",
        "correct_answer": "Superficial inguinal ring",
        "distractors": [
            "Deep internal inguinal ring",
            "Femoral canal ring orifice",
            "Saphenous opening hiatus"
        ],
        "explanation": "Criteria of Identification: Triangular defect in external oblique aponeurosis located superolateral to pubic crest, transmitting spermatic cord or round ligament.",
        "keyConcept": "Superficial inguinal ring: aponeurotic defect in external oblique through which the spermatic cord exits.",
        "imageUrl": "/images/practical/mgl-3/anatomy/external_oblique_inguinal_ring.webp"
    },
    {
        "seq": 8,
        "lecture": 3,
        "text": "In this anterior abdominal wall dissection, identify the conjoint aponeurotic insertion indicated:",
        "correct_answer": "Conjoint tendon (Falx inguinalis)",
        "distractors": [
            "Inguinal ligament of Poupart",
            "Lacunar ligament of Gimbernat",
            "Pectineal ligament of Cooper"
        ],
        "explanation": "Criteria of Identification: Fused lower arching aponeurotic fibers of internal oblique and transversus abdominis inserting into pubic crest and pectineal line.",
        "keyConcept": "Conjoint tendon: fused aponeurotic arch of internal oblique and transversus inserting into the pubis.",
        "imageUrl": "/images/practical/mgl-3/anatomy/internal_oblique_rectus.webp"
    },
    {
        "seq": 9,
        "lecture": 3,
        "text": "On the posterior layer of the rectus sheath, identify this horizontal curved boundary:",
        "correct_answer": "Arcuate line (Line of Douglas)",
        "distractors": [
            "Linea alba central margin",
            "Linea semilunaris lateral groove",
            "Transpyloric anatomical plane"
        ],
        "explanation": "Criteria of Identification: Curved inferior margin of the posterior rectus sheath midway between umbilicus and pubic crest, below which all aponeuroses pass anteriorly.",
        "keyConcept": "Arcuate line: inferior border of posterior rectus sheath where aponeuroses shift entirely anteriorly.",
        "imageUrl": "/images/practical/mgl-3/anatomy/transversus_abdominis.webp"
    },
    {
        "seq": 10,
        "lecture": 3,
        "text": "In this posterior abdominal wall dissection, identify this large medial muscle:",
        "correct_answer": "Psoas major muscle",
        "distractors": [
            "Quadratus lumborum muscle",
            "Transversus abdominis",
            "Iliacus muscle of pelvis"
        ],
        "explanation": "Criteria of Identification: Fleshy muscle arising from lumbar vertebral bodies, transverse processes, and discs, descending to insert on the lesser trochanter.",
        "keyConcept": "Psoas major: medial posterior abdominal wall muscle arising from lumbar spine, housing lumbar plexus.",
        "imageUrl": "/images/practical/mgl-3/anatomy/posterior_wall_muscles.webp"
    },
    {
        "seq": 11,
        "lecture": 4,
        "text": "On this posterior abdominal wall specimen, identify the vertebral level of the aortic bifurcation:",
        "correct_answer": "L4 vertebral body",
        "distractors": [
            "L2 vertebral body",
            "L3 vertebral body",
            "L5 vertebral body"
        ],
        "explanation": "Criteria of Identification: The abdominal aorta bifurcates into common iliac arteries at L4, approximately 2–3 cm below the umbilicus, just superior to IVC confluence at L5.",
        "keyConcept": "Aortic bifurcation: occurs at L4 vertebral level, slightly superior to IVC confluence at L5.",
        "imageUrl": "/images/practical/mgl-3/anatomy/aorta_ivc_relations.webp"
    },
    {
        "seq": 12,
        "lecture": 4,
        "text": "In this lumbar plexus dissection, identify the nerve piercing the anterior belly of psoas major:",
        "correct_answer": "Genitofemoral nerve (L1, L2)",
        "distractors": [
            "Ilioinguinal somatic nerve (L1)",
            "Lateral femoral cutaneous nerve",
            "Femoral anterior motor trunk"
        ],
        "explanation": "Criteria of Identification: Only lumbar plexus nerve that pierces the anterior muscular surface of psoas major, descending before branching into genital and femoral nerves.",
        "keyConcept": "Genitofemoral nerve: only lumbar plexus nerve piercing and descending on the anterior surface of psoas major.",
        "imageUrl": "/images/practical/mgl-3/anatomy/lumbar_plexus_nerves.webp"
    },
    {
        "seq": 13,
        "lecture": 4,
        "text": "On this gross stomach specimen, identify the notch indicated on the lesser curvature:",
        "correct_answer": "Incisura angularis (Angular notch)",
        "distractors": [
            "Cardiac notch of stomach",
            "Sulcus intermedius groove",
            "Pyloric muscular sphincter"
        ],
        "explanation": "Criteria of Identification: Acute notch on the lower part of the lesser curvature demarcating the anatomical boundary between the body and the pyloric antrum.",
        "keyConcept": "Incisura angularis: angular notch on the lesser curvature separating the gastric body from the pyloric antrum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/stomach_parts_anatomy.webp"
    },
    {
        "seq": 14,
        "lecture": 5,
        "text": "In this peritoneal dissection, identify the foramen bounded anteriorly by the lesser omentum:",
        "correct_answer": "Epiploic foramen of Winslow",
        "distractors": [
            "Greater sciatic foramen",
            "Obturator vascular canal",
            "Incisura angularis margin"
        ],
        "explanation": "Criteria of Identification: Peritoneal aperture connecting greater and lesser sacs, bounded anteriorly by the hepatoduodenal ligament containing the portal triad.",
        "keyConcept": "Epiploic foramen: peritoneal entrance to lesser sac bounded anteriorly by the portal triad in lesser omentum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/lesser_greater_omenta.webp"
    },
    {
        "seq": 15,
        "lecture": 5,
        "text": "On this pancreas and duodenum gross specimen, identify the projection passing behind mesenteric vessels:",
        "correct_answer": "Uncinate process",
        "distractors": [
            "Pancreatic neck region",
            "Pancreatic tail tip",
            "Major duodenal papilla"
        ],
        "explanation": "Criteria of Identification: Medial and inferior hook-like projection of the pancreatic head passing posterior to the superior mesenteric artery and vein.",
        "keyConcept": "Uncinate process: lower pancreatic head extension coursing posterior to superior mesenteric artery and vein.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pancreas_duodenum_relations.webp"
    },
    {
        "seq": 16,
        "lecture": 5,
        "text": "On this gross liver specimen, identify the sickle-shaped peritoneal fold indicated:",
        "correct_answer": "Falciform ligament",
        "distractors": [
            "Coronary liver ligament",
            "Right triangular ligament",
            "Hepatoduodenal ligament"
        ],
        "explanation": "Criteria of Identification: Two-layered peritoneal fold connecting anterior liver surface to anterior abdominal wall and diaphragm, carrying ligamentum teres in free edge.",
        "keyConcept": "Falciform ligament: peritoneal fold carrying ligamentum teres hepatis in its inferior free edge.",
        "imageUrl": "/images/practical/mgl-3/anatomy/liver_anterior_falciform.webp"
    },
    {
        "seq": 17,
        "lecture": 6,
        "text": "On the posterior surface of this liver specimen, identify the non-peritoneal area indicated:",
        "correct_answer": "Bare area of the liver",
        "distractors": [
            "Porta hepatis portal fissure",
            "Gallbladder fossa bed",
            "Fissure for ligamentum venosum"
        ],
        "explanation": "Criteria of Identification: Non-peritoneal triangular posterior surface directly resting on the diaphragm, bounded by the coronary and triangular ligaments.",
        "keyConcept": "Bare area: non-peritoneal posterior hepatic surface bounded by coronary ligaments resting against diaphragm.",
        "imageUrl": "/images/practical/mgl-3/anatomy/liver_posterior_surface_relations.webp"
    },
    {
        "seq": 18,
        "lecture": 6,
        "text": "On the inferior visceral surface of this liver specimen, identify this rectangular lobe:",
        "correct_answer": "Quadrate lobe",
        "distractors": [
            "Caudate anatomical lobe",
            "Right hepatic lateral lobe",
            "Left anatomical lobe"
        ],
        "explanation": "Criteria of Identification: Rectangular lobe bounded on right by gallbladder fossa, left by fissure for ligamentum teres, and posteriorly by porta hepatis.",
        "keyConcept": "Quadrate lobe: visceral hepatic lobe located between gallbladder fossa and fissure for ligamentum teres.",
        "imageUrl": "/images/practical/mgl-3/anatomy/liver_inferior_visceral_surface.webp"
    },
    {
        "seq": 19,
        "lecture": 6,
        "text": "In this extrahepatic biliary tree specimen, identify the hepatopancreatic ampulla indicated:",
        "correct_answer": "Ampulla of Vater (Hepatopancreatic)",
        "distractors": [
            "Hartmann's gallbladder pouch",
            "Cystic duct spiral valve",
            "Duct of Santorini accessory"
        ],
        "explanation": "Criteria of Identification: Dilation formed by confluence of common bile duct and main pancreatic duct within duodenal wall, discharging at major duodenal papilla.",
        "keyConcept": "Ampulla of Vater: hepatopancreatic dilation discharging combined bile and pancreatic juice into duodenum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/biliary_tree_anatomy.webp"
    },
    {
        "seq": 20,
        "lecture": 7,
        "text": "Examine this small intestinal gross specimen. Which anatomical characteristic distinguishes jejunum from ileum?",
        "correct_answer": "Taller, closely packed plicae circulares and longer vasa recta",
        "distractors": [
            "More abundant mesenteric fat encroaching the bowel wall",
            "More numerous tiers of complex arterial mesenteric arcades",
            "Abundant visible aggregated Peyer's lymphoid nodules"
        ],
        "explanation": "Criteria of Identification: Jejunum possesses wider caliber, thicker wall, prominent plicae circulares, simpler arcades (1–2 tiers), and longer straight vasa recta.",
        "keyConcept": "Jejunum characteristics: prominent plicae, simpler arcades with long vasa recta, and less mesenteric fat.",
        "imageUrl": "/images/practical/mgl-3/anatomy/small_intestine_jejunum_ileum.webp"
    },
    {
        "seq": 21,
        "lecture": 7,
        "text": "On this large bowel specimen, identify these longitudinal outer muscular bands:",
        "correct_answer": "Taeniae coli",
        "distractors": [
            "Plicae semilunares",
            "Appendices epiploicae",
            "Haustra sacculations"
        ],
        "explanation": "Criteria of Identification: Three ribbons of thickened outer longitudinal smooth muscle (free, mesocolic, omental) converging at the root of the vermiform appendix.",
        "keyConcept": "Taeniae coli: three longitudinal smooth muscle bands converging at the base of the vermiform appendix.",
        "imageUrl": "/images/practical/mgl-3/anatomy/large_intestine_anatomy.webp"
    },
    {
        "seq": 22,
        "lecture": 7,
        "text": "In this coronal section of the anal canal, identify this mucosal boundary line:",
        "correct_answer": "Pectinate (Dentate) line",
        "distractors": [
            "Hilton's white line",
            "Anocutaneous junction line",
            "Intersphincteric anal groove"
        ],
        "explanation": "Criteria of Identification: Undulating line marking junction of hindgut endoderm and proctodeal ectoderm, dividing visceral innervation/drainage from somatic.",
        "keyConcept": "Pectinate line: embryological watershed dividing visceral innervation and drainage from somatic.",
        "imageUrl": "/images/practical/mgl-3/anatomy/rectum_anal_canal.webp"
    },
    {
        "seq": 23,
        "lecture": 8,
        "text": "In this arterial dissection of the abdomen, identify this primary foregut arterial trunk:",
        "correct_answer": "Celiac trunk",
        "distractors": [
            "Superior mesenteric artery",
            "Inferior mesenteric artery",
            "Renal arterial trunk"
        ],
        "explanation": "Criteria of Identification: Short ventral branch arising from abdominal aorta at T12, giving off left gastric, common hepatic, and splenic arteries.",
        "keyConcept": "Celiac trunk: foregut artery arising from aorta at T12 giving left gastric, splenic, and common hepatic arteries.",
        "imageUrl": "/images/practical/mgl-3/anatomy/celiac_trunk_arteries.webp"
    },
    {
        "seq": 24,
        "lecture": 8,
        "text": "In this stomach arterial arcade dissection, identify this tortuous artery on the pancreas:",
        "correct_answer": "Splenic artery",
        "distractors": [
            "Left gastric artery",
            "Gastroduodenal artery",
            "Common hepatic trunk"
        ],
        "explanation": "Criteria of Identification: Largest celiac branch, characterized by a tortuous course along the superior margin of the pancreas toward the splenic hilum.",
        "keyConcept": "Splenic artery: tortuous celiac branch traveling along upper border of pancreas toward spleen and stomach.",
        "imageUrl": "/images/practical/mgl-3/anatomy/stomach_arterial_arcade.webp"
    },
    {
        "seq": 25,
        "lecture": 8,
        "text": "In this abdominal dissection, identify this midgut artery crossing the 3rd part of the duodenum:",
        "correct_answer": "Superior mesenteric artery",
        "distractors": [
            "Inferior mesenteric artery",
            "Celiac vascular trunk",
            "Common iliac artery"
        ],
        "explanation": "Criteria of Identification: Midgut arterial trunk arising at L1, crossing anterior to the uncinate process and 3rd part of the duodenum to enter root of mesentery.",
        "keyConcept": "Superior mesenteric artery: midgut arterial supply crossing anterior to the 3rd part of the duodenum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/sma_artery_branches.webp"
    },
    {
        "seq": 26,
        "lecture": 8,
        "text": "Examine these mesenteric arterial arcades. Identify the small intestinal segment shown:",
        "correct_answer": "Ileal mesenteric arcades",
        "distractors": [
            "Jejunal mesenteric arcades",
            "Middle colic arcades",
            "Marginal artery of Drummond"
        ],
        "explanation": "Criteria of Identification: Multiple overlapping tiers (3 to 5 arcades) with short straight vasa recta and fat-laden mesentery encroaching on the bowel wall.",
        "keyConcept": "Ileal arcades: multiple complex tiers (3–5 arcades) with short vasa recta and heavy mesenteric fat.",
        "imageUrl": "/images/practical/mgl-3/anatomy/jejunal_ileal_arcades.webp"
    },
    {
        "seq": 27,
        "lecture": 8,
        "text": "In this transverse mesocolon dissection, identify the colic artery indicated:",
        "correct_answer": "Middle colic artery",
        "distractors": [
            "Right colic artery",
            "Ileocolic artery",
            "Left colic artery"
        ],
        "explanation": "Criteria of Identification: First colic branch of the SMA, ascending between layers of transverse mesocolon to supply the transverse colon.",
        "keyConcept": "Middle colic artery: SMA branch running through transverse mesocolon to supply the transverse colon.",
        "imageUrl": "/images/practical/mgl-3/anatomy/colic_arteries_sma.webp"
    },
    {
        "seq": 28,
        "lecture": 8,
        "text": "In this lower abdominal dissection, identify this hindgut arterial trunk:",
        "correct_answer": "Inferior mesenteric artery",
        "distractors": [
            "Superior mesenteric artery",
            "Middle colic branch",
            "Median sacral trunk"
        ],
        "explanation": "Criteria of Identification: Hindgut trunk arising from aorta at L3, giving left colic and sigmoid branches before continuing as superior rectal artery.",
        "keyConcept": "Inferior mesenteric artery: hindgut artery arising at L3 terminating as the superior rectal artery.",
        "imageUrl": "/images/practical/mgl-3/anatomy/ima_branches_colon.webp"
    },
    {
        "seq": 29,
        "lecture": 9,
        "text": "Behind the neck of the pancreas, identify the venous trunk formed by the union shown:",
        "correct_answer": "Hepatic portal vein",
        "distractors": [
            "Inferior vena cava",
            "Left renal vein",
            "Right gonadal vein"
        ],
        "explanation": "Criteria of Identification: Large venous trunk formed behind pancreatic neck by confluence of splenic vein and superior mesenteric vein, entering porta hepatis.",
        "keyConcept": "Portal vein: formed behind pancreatic neck by the union of splenic vein and superior mesenteric vein.",
        "imageUrl": "/images/practical/mgl-3/anatomy/portal_vein_tributaries.webp"
    },
    {
        "seq": 30,
        "lecture": 9,
        "text": "On the inferior aspect of this bony palate, identify the posterolateral foramina indicated:",
        "correct_answer": "Greater palatine foramina",
        "distractors": [
            "Incisive fossa canal",
            "Lesser palatine foramina",
            "Jugular cranial foramen"
        ],
        "explanation": "Criteria of Identification: Posterolateral bilateral foramina piercing the horizontal plates of palatine bones transmitting greater palatine nerve and vessels.",
        "keyConcept": "Greater palatine foramina: posterolateral bony palate apertures transmitting neurovascular supply to hard palate.",
        "imageUrl": "/images/practical/mgl-3/anatomy/bony_palate_foramina.webp"
    },
    {
        "seq": 31,
        "lecture": 9,
        "text": "On this bony iliac crest specimen, identify the muscle attaching to the intermediate line:",
        "correct_answer": "Internal oblique muscle",
        "distractors": [
            "External oblique muscle",
            "Transversus abdominis",
            "Quadratus lumborum"
        ],
        "explanation": "Criteria of Identification: The intermediate line of the iliac crest provides origin for the internal oblique (between outer external oblique and inner transversus).",
        "keyConcept": "Intermediate line of iliac crest: site of muscular origin for the internal oblique abdominal muscle.",
        "imageUrl": "/images/practical/mgl-3/anatomy/iliac_crest_muscles.webp"
    },
    {
        "seq": 32,
        "lecture": 9,
        "text": "On this osteological pelvis specimen, identify the muscle originating from the pubic crest:",
        "correct_answer": "Rectus abdominis muscle",
        "distractors": [
            "Pectineus adductor muscle",
            "Pyramidalis anterior belly",
            "Iliopsoas pelvic tendon"
        ],
        "explanation": "Criteria of Identification: Vertical strap muscle arising by two heads from pubic crest and pubic symphysis, ascending within the rectus sheath.",
        "keyConcept": "Rectus abdominis: vertical strap muscle arising from pubic crest and symphysis ascending to costal margin.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pubic_crest_attachments.webp"
    },
    {
        "seq": 33,
        "lecture": 9,
        "text": "On this typical lumbar vertebra, identify the horizontal posterior process indicated:",
        "correct_answer": "Lumbar spinous process",
        "distractors": [
            "Mamillary process projection",
            "Accessory tubercle process",
            "Costiform transverse process"
        ],
        "explanation": "Criteria of Identification: Thick, horizontal quadrangular hatchet-shaped process providing attachment for interspinous and supraspinous ligaments.",
        "keyConcept": "Lumbar spinous process: broad, horizontal hatchet-shaped process providing interspinous ligamentous anchor.",
        "imageUrl": "/images/practical/mgl-3/anatomy/lumbar_vertebra_ligaments.webp"
    },
    {
        "seq": 34,
        "lecture": 9,
        "text": "On this atypical fifth lumbar vertebra (L5), identify the defining morphological feature:",
        "correct_answer": "Massive conical transverse process attached directly to the pedicle and body",
        "distractors": [
            "Circular rather than triangular vertebral canal",
            "Bifid spinous process with posterior hook",
            "Absence of superior articular facets"
        ],
        "explanation": "Criteria of Identification: L5 is characterized by massive conical transverse processes arising directly from both the pedicle and body for the iliolumbar ligament.",
        "keyConcept": "L5 vertebra: distinguished by massive conical transverse processes attached directly to the pedicle and body.",
        "imageUrl": "/images/practical/mgl-3/anatomy/atypical_l5_vertebra.webp"
    },
    {
        "seq": 35,
        "lecture": 10,
        "text": "Examine this clinical photograph. Identify the embryological cause of this anomaly:",
        "correct_answer": "Failure of fusion between maxillary and medial nasal prominences",
        "distractors": [
            "Failure of fusion between mandibular and lateral nasal prominences",
            "Failure of fusion between lateral palatine processes and nasal septum",
            "Failure of migration of cranial neural crest cells into 2nd arch"
        ],
        "explanation": "Criteria of Identification: Unilateral cleft lip results from failure of the maxillary prominence to fuse with the medial nasal prominence (intermaxillary segment).",
        "keyConcept": "Cleft lip: developmental failure of fusion between the maxillary prominence and medial nasal prominence.",
        "imageUrl": "/images/practical/mgl-3/anatomy/cleft_lip_palate_anomaly.webp"
    },
    {
        "seq": 36,
        "lecture": 10,
        "text": "In this diagram of tracheoesophageal anomalies, identify the most common anatomical variant:",
        "correct_answer": "Proximal esophageal atresia with distal tracheoesophageal fistula",
        "distractors": [
            "Isolated esophageal atresia without fistula",
            "Proximal tracheoesophageal fistula with distal atresia",
            "Isolated H-type tracheoesophageal fistula"
        ],
        "explanation": "Criteria of Identification: Type C (~85% of cases) comprises a blind proximal esophageal pouch and a distal esophageal fistula connecting to the carina.",
        "keyConcept": "Tracheoesophageal fistula: Type C (blind upper esophageal pouch with distal fistula) is the most common form.",
        "imageUrl": "/images/practical/mgl-3/anatomy/tef_anomalies_types.webp"
    },
    {
        "seq": 37,
        "lecture": 10,
        "text": "On this axial abdominal CT scan at the transpyloric plane (T12-L1), identify the organ crossing the midline:",
        "correct_answer": "Pancreas",
        "distractors": [
            "Transverse colon loop",
            "Duodenojejunal flexure",
            "Left renal cortex parenchyma"
        ],
        "explanation": "Criteria of Identification: Elongated retroperitoneal parenchymal organ crossing the midline anterior to the aorta, IVC, and superior mesenteric vessels.",
        "keyConcept": "Pancreas on axial CT: elongated retroperitoneal organ whose neck crosses anterior to mesenteric vessels at L1.",
        "imageUrl": "/images/practical/mgl-3/anatomy/axial_ct_abdomen_t12_l1.webp"
    }
]

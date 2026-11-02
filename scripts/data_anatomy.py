# scripts/data_anatomy.py
"""
Official 37 Anatomy Practical Revision Questions for Year 3 GIT (MGL-3).
All questions are authentic spotter exam questions following ASU Faculty of Medicine guidelines:
- Slide / dissection shown with blanked labels and arrow / marker.
- Student chooses the correct anatomical label indicated.
"""

ANATOMY_QUESTIONS = [
    {
        "seq": 1,
        "lecture": 1,
        "text": "In this sagittal head and neck dissection, identify the labeled structure situated in the tonsillar fossa:",
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
        "text": "In this deep dissection of the palatine tonsillar bed, identify the labeled cranial nerve traversing the bed:",
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
        "text": "On the dorsal surface of this dissected tongue, identify the labeled V-shaped groove:",
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
        "text": "In this lateral facial dissection, identify the labeled major salivary gland:",
        "correct_answer": "Parotid salivary gland",
        "distractors": [
            "Submandibular gland",
            "Sublingual salivary gland",
            "Buccal mucosal gland"
        ],
        "explanation": "Criteria of Identification: Largest salivary gland, wedged anteroinferior to external acoustic meatus between ramus of mandible and sternocleidomastoid.",
        "keyConcept": "Parotid gland: largest salivary gland, wedged between mandibular ramus and mastoid process.",
        "imageUrl": "/images/practical/mgl-3/anatomy/salivary_glands_topography.webp"
    },
    {
        "seq": 5,
        "lecture": 2,
        "text": "In this superficial facial dissection, identify the labeled excretory duct crossing the masseter muscle:",
        "correct_answer": "Parotid duct (Stensen's duct)",
        "distractors": [
            "Submandibular duct (Wharton's)",
            "Major sublingual duct (Bartholin's)",
            "Facial vein confluence"
        ],
        "explanation": "Criteria of Identification: Emerges from the anterior border of the parotid gland, runs horizontally across masseter, pierces buccinator, and opens opposite upper second molar.",
        "keyConcept": "Parotid duct (Stensen's): crosses masseter, pierces buccinator, opens opposite upper 2nd molar tooth.",
        "imageUrl": "/images/practical/mgl-3/anatomy/parotid_gland_stensen_duct.webp"
    },
    {
        "seq": 6,
        "lecture": 2,
        "text": "In this submandibular triangle dissection, identify the labeled tortuous artery grooving the submandibular gland:",
        "correct_answer": "Facial artery",
        "distractors": [
            "Lingual artery branch",
            "Superficial temporal artery",
            "Maxillary deep artery"
        ],
        "explanation": "Criteria of Identification: Arises from external carotid, hooks over submandibular gland, arches across inferior border of mandible at anterior border of masseter to enter face.",
        "keyConcept": "Facial artery: grooves submandibular gland, crosses inferior border of mandible at anterior margin of masseter.",
        "imageUrl": "/images/practical/mgl-3/anatomy/submandibular_gland_digastric.webp"
    },
    {
        "seq": 7,
        "lecture": 3,
        "text": "In this anterior abdominal wall dissection, identify the labeled triangular opening in the external oblique aponeurosis:",
        "correct_answer": "Superficial inguinal ring",
        "distractors": [
            "Deep internal inguinal ring",
            "Saphenous venous opening",
            "Femoral vascular canal"
        ],
        "explanation": "Criteria of Identification: Triangular defect in external oblique aponeurosis lying superior and lateral to pubic crest, transmitting spermatic cord (or round ligament).",
        "keyConcept": "Superficial inguinal ring: triangular opening in external oblique aponeurosis transmitting spermatic cord.",
        "imageUrl": "/images/practical/mgl-3/anatomy/external_oblique_inguinal_ring.webp"
    },
    {
        "seq": 8,
        "lecture": 3,
        "text": "In this anterior abdominal wall dissection, identify the labeled conjoint aponeurotic insertion:",
        "correct_answer": "Conjoint tendon (Falx inguinalis)",
        "distractors": [
            "Inguinal ligament (Poupart's)",
            "Lacunar ligament (Gimbernat's)",
            "Reflected inguinal ligament"
        ],
        "explanation": "Criteria of Identification: Formed by lower arching aponeurotic fibers of internal oblique and transversus abdominis inserting together onto pubic crest and pectineal line.",
        "keyConcept": "Conjoint tendon: fusion of internal oblique and transversus abdominis inserting into pubic crest/pectineal line.",
        "imageUrl": "/images/practical/mgl-3/anatomy/internal_oblique_rectus.webp"
    },
    {
        "seq": 9,
        "lecture": 3,
        "text": "On the posterior layer of this rectus sheath, identify the labeled curved horizontal boundary line:",
        "correct_answer": "Arcuate line (Line of Douglas)",
        "distractors": [
            "Linea alba central line",
            "Linea semilunaris margin",
            "Transpyloric reference line"
        ],
        "explanation": "Criteria of Identification: Crescentic horizontal lower margin of the posterior rectus sheath midway between umbilicus and pubic crest, below which all aponeuroses pass anterior to rectus abdominis.",
        "keyConcept": "Arcuate line: inferior border of posterior rectus sheath where inferior epigastric vessels enter sheath.",
        "imageUrl": "/images/practical/mgl-3/anatomy/transversus_abdominis.webp"
    },
    {
        "seq": 10,
        "lecture": 3,
        "text": "In this posterior abdominal wall dissection, identify the labeled large medial fusiform muscle:",
        "correct_answer": "Psoas major muscle",
        "distractors": [
            "Quadratus lumborum muscle",
            "Iliacus pelvic muscle",
            "Psoas minor tendon"
        ],
        "explanation": "Criteria of Identification: Originates from T12-L5 bodies and transverse processes, passes beneath inguinal ligament to insert onto lesser trochanter of femur.",
        "keyConcept": "Psoas major: thick retroperitoneal muscle originating from lumbar spine and inserting on lesser trochanter.",
        "imageUrl": "/images/practical/mgl-3/anatomy/posterior_wall_muscles.webp"
    },
    {
        "seq": 11,
        "lecture": 4,
        "text": "On this posterior abdominal wall specimen, identify the labeled vertebral level of the abdominal aortic bifurcation:",
        "correct_answer": "L4 vertebral body",
        "distractors": [
            "T12 aortic hiatus",
            "L1 transpyloric level",
            "L5 sacral promontory"
        ],
        "explanation": "Criteria of Identification: Abdominal aorta bifurcates into right and left common iliac arteries at the lower border of L4 vertebra (supra-cristal line).",
        "keyConcept": "Aorta bifurcates at L4 vertebral level into right and left common iliac arteries.",
        "imageUrl": "/images/practical/mgl-3/anatomy/aorta_ivc_relations.webp"
    },
    {
        "seq": 12,
        "lecture": 4,
        "text": "In this lumbar plexus dissection, identify the labeled nerve piercing the anterior surface of psoas major:",
        "correct_answer": "Genitofemoral nerve (L1, L2)",
        "distractors": [
            "Ilioinguinal nerve (L1)",
            "Lateral femoral cutaneous nerve (L2, L3)",
            "Femoral main trunk (L2-L4)"
        ],
        "explanation": "Criteria of Identification: Emerging on the anterior belly of psoas major, dividing into genital (cremasteric) and femoral (skin of femoral triangle) branches.",
        "keyConcept": "Genitofemoral nerve (L1, L2): only lumbar plexus nerve piercing the anterior surface of psoas major.",
        "imageUrl": "/images/practical/mgl-3/anatomy/lumbar_plexus_nerves.webp"
    },
    {
        "seq": 13,
        "lecture": 5,
        "text": "On this gross stomach specimen, identify the labeled notch indicated on the lesser curvature:",
        "correct_answer": "Incisura angularis (Angular notch)",
        "distractors": [
            "Cardiac incisure notch",
            "Sulcus intermedius groove",
            "Duodenopyloric constriction"
        ],
        "explanation": "Criteria of Identification: Sharp indentation on the lower part of the lesser curvature, marking the anatomical boundary between body and pyloric antrum.",
        "keyConcept": "Incisura angularis: notch on lesser curvature demarcating gastric body from pyloric antrum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/stomach_parts_anatomy.webp"
    },
    {
        "seq": 14,
        "lecture": 5,
        "text": "In this peritoneal dissection, identify the labeled foramen bounded anteriorly by the lesser omentum:",
        "correct_answer": "Epiploic foramen of Winslow",
        "distractors": [
            "Retrocecal peritoneal recess",
            "Infraduodenal fossa recess",
            "Intersigmoid peritoneal fossa"
        ],
        "explanation": "Criteria of Identification: Natural communication between greater and lesser peritoneal sacs; bounded anteriorly by free edge of lesser omentum (portal triad), posteriorly by IVC, superiorly by caudate lobe, inferiorly by 1st part of duodenum.",
        "keyConcept": "Epiploic foramen (Winslow): opening into lesser sac bounded anteriorly by free edge of lesser omentum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/lesser_greater_omenta.webp"
    },
    {
        "seq": 15,
        "lecture": 5,
        "text": "On this gross specimen of pancreas and duodenum, identify the labeled projection passing behind mesenteric vessels:",
        "correct_answer": "Uncinate process",
        "distractors": [
            "Neck of the pancreas",
            "Tail of the pancreas",
            "Minor duodenal papilla"
        ],
        "explanation": "Criteria of Identification: Hook-like posteromedial projection from lower part of head of pancreas, passing posterior to superior mesenteric artery and vein.",
        "keyConcept": "Uncinate process: lower projection of pancreatic head passing posterior to superior mesenteric vessels.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pancreas_duodenum_relations.webp"
    },
    {
        "seq": 16,
        "lecture": 6,
        "text": "On this gross liver specimen, identify the labeled sickle-shaped peritoneal fold on the diaphragmatic surface:",
        "correct_answer": "Falciform ligament",
        "distractors": [
            "Coronary ligament layer",
            "Left triangular ligament",
            "Ligamentum venosum fold"
        ],
        "explanation": "Criteria of Identification: Sickle-shaped peritoneal fold attaching anterior and superior surfaces of liver to anterior abdominal wall and diaphragm, carrying ligamentum teres in free margin.",
        "keyConcept": "Falciform ligament: connects diaphragmatic surface of liver to anterior abdominal wall; contains ligamentum teres.",
        "imageUrl": "/images/practical/mgl-3/anatomy/liver_anterior_falciform.webp"
    },
    {
        "seq": 17,
        "lecture": 6,
        "text": "On the posterior surface of this liver specimen, identify the labeled non-peritoneal area:",
        "correct_answer": "Bare area of the liver",
        "distractors": [
            "Caudate lobe surface",
            "Fossa for the gallbladder",
            "Groove for inferior vena cava"
        ],
        "explanation": "Criteria of Identification: Triangular non-peritoneal area on diaphragmatic surface of right lobe, bounded by superior and inferior layers of coronary ligament.",
        "keyConcept": "Bare area of liver: triangular area on posterior surface devoid of peritoneum, in direct contact with diaphragm.",
        "imageUrl": "/images/practical/mgl-3/anatomy/liver_posterior_surface_relations.webp"
    },
    {
        "seq": 18,
        "lecture": 6,
        "text": "On the inferior visceral surface of this liver specimen, identify the labeled rectangular lobe:",
        "correct_answer": "Quadrate lobe",
        "distractors": [
            "Caudate lobe (Spigelian)",
            "Left anatomical lobe",
            "Right posterior segment"
        ],
        "explanation": "Criteria of Identification: Rectangular lobe on visceral surface bounded anteriorly by inferior border, posteriorly by porta hepatis, on the right by gallbladder fossa, on the left by fissure for ligamentum teres.",
        "keyConcept": "Quadrate lobe: situated on visceral surface between gallbladder fossa and fissure for ligamentum teres.",
        "imageUrl": "/images/practical/mgl-3/anatomy/liver_inferior_visceral_surface.webp"
    },
    {
        "seq": 19,
        "lecture": 6,
        "text": "In this extrahepatic biliary tree specimen, identify the labeled hepatopancreatic junction:",
        "correct_answer": "Ampulla of Vater (Hepatopancreatic)",
        "distractors": [
            "Cystic duct junction",
            "Spiral valve (Heister's)",
            "Accessory pancreatic duct"
        ],
        "explanation": "Criteria of Identification: Dilatation formed by union of bile duct and main pancreatic duct within medial wall of 2nd part of duodenum, opening onto major duodenal papilla.",
        "keyConcept": "Ampulla of Vater: union of common bile duct and main pancreatic duct opening at major duodenal papilla.",
        "imageUrl": "/images/practical/mgl-3/anatomy/biliary_tree_anatomy.webp"
    },
    {
        "seq": 20,
        "lecture": 7,
        "text": "Examine this small intestinal gross specimen. Which anatomical characteristic distinguishes the labeled jejunum from ileum?",
        "correct_answer": "Taller, closely packed plicae circulares and longer vasa recta",
        "distractors": [
            "More abundant mesenteric fat encroaching directly on bowel wall",
            "Complex arterial arcades (4-5 tiers) with short vasa recta",
            "Abundant visible Peyer's patches on the antimesenteric border"
        ],
        "explanation": "Criteria of Identification: Jejunum has a thicker, more vascular wall, taller and more crowded circular folds (plicae circulares), simpler arterial arcades (1-2 tiers), and longer vasa recta than ileum.",
        "keyConcept": "Jejunum vs Ileum: jejunum has taller/crowded plicae circulares, simpler arcades, and longer vasa recta.",
        "imageUrl": "/images/practical/mgl-3/anatomy/small_intestine_jejunum_ileum.webp"
    },
    {
        "seq": 21,
        "lecture": 7,
        "text": "On this large bowel specimen, identify the labeled longitudinal outer muscular bands:",
        "correct_answer": "Taeniae coli",
        "distractors": [
            "Appendices epiploicae tags",
            "Haustrations (sacculations)",
            "Plicae semilunares folds"
        ],
        "explanation": "Criteria of Identification: Three distinct ribbon-like bands of outer longitudinal smooth muscle (taenia libera, mesocolica, omentalis) that converge at the base of the appendix.",
        "keyConcept": "Taeniae coli: three longitudinal smooth muscle bands converging at the appendix base, creating haustrations.",
        "imageUrl": "/images/practical/mgl-3/anatomy/large_intestine_anatomy.webp"
    },
    {
        "seq": 22,
        "lecture": 7,
        "text": "In this coronal section of the anal canal, identify the labeled transitional mucosal boundary line:",
        "correct_answer": "Pectinate (Dentate) line",
        "distractors": [
            "Intersphincteric white line (Hilton's)",
            "Anocutaneous line junction",
            "Anal valve margin"
        ],
        "explanation": "Criteria of Identification: Serrated line formed by anal valves, demarcating upper 2/3 (endodermal hindgut, autonomic nerve supply, portal venous drainage) from lower 1/3 (ectodermal proctodeum, somatic nerve supply, systemic venous drainage).",
        "keyConcept": "Pectinate line: embryological junction of hindgut and proctodeum; demarcates nerve, vascular, and lymphatic drainage.",
        "imageUrl": "/images/practical/mgl-3/anatomy/rectum_anal_canal.webp"
    },
    {
        "seq": 23,
        "lecture": 8,
        "text": "In this abdominal arterial dissection, identify the labeled primary foregut arterial trunk:",
        "correct_answer": "Celiac trunk",
        "distractors": [
            "Superior mesenteric artery",
            "Inferior phrenic artery",
            "Middle suprarenal trunk"
        ],
        "explanation": "Criteria of Identification: Unpaired anterior branch of abdominal aorta arising at T12 immediately below aortic hiatus, dividing into left gastric, common hepatic, and splenic arteries.",
        "keyConcept": "Celiac trunk: foregut artery arising from aorta at T12, giving off left gastric, common hepatic, and splenic arteries.",
        "imageUrl": "/images/practical/mgl-3/anatomy/celiac_trunk_arteries.webp"
    },
    {
        "seq": 24,
        "lecture": 8,
        "text": "In this arterial dissection, identify the labeled tortuous artery coursing along the upper border of the pancreas:",
        "correct_answer": "Splenic artery",
        "distractors": [
            "Common hepatic artery",
            "Left gastric artery trunk",
            "Gastroduodenal branch"
        ],
        "explanation": "Criteria of Identification: Largest branch of celiac trunk, running a strikingly tortuous course along superior border of pancreas toward splenorenal ligament.",
        "keyConcept": "Splenic artery: tortuous branch of celiac trunk running along upper border of pancreas to spleen.",
        "imageUrl": "/images/practical/mgl-3/anatomy/stomach_arterial_arcade.webp"
    },
    {
        "seq": 25,
        "lecture": 8,
        "text": "In this abdominal dissection, identify the labeled midgut arterial trunk crossing anterior to the 3rd part of duodenum:",
        "correct_answer": "Superior mesenteric artery",
        "distractors": [
            "Inferior mesenteric trunk",
            "Proper hepatic artery",
            "Left renal artery trunk"
        ],
        "explanation": "Criteria of Identification: Arises from anterior aspect of aorta at L1 behind neck of pancreas, emerges over uncinate process, and crosses anterior to third (horizontal) part of duodenum.",
        "keyConcept": "SMA: midgut artery arising at L1, crossing anterior to 3rd part of duodenum and uncinate process.",
        "imageUrl": "/images/practical/mgl-3/anatomy/sma_artery_branches.webp"
    },
    {
        "seq": 26,
        "lecture": 8,
        "text": "Examine these mesenteric arterial arcades. Identify the labeled intestinal segment shown with short vasa recta:",
        "correct_answer": "Ileal mesenteric arcades",
        "distractors": [
            "Jejunal arterial arcades",
            "Marginal artery of Drummond",
            "Middle colic anastomotic loop"
        ],
        "explanation": "Criteria of Identification: Characterized by multiple complex tiers of arterial arcades (3-5 tiers) giving off short, numerous vasa recta, typical of ileum.",
        "keyConcept": "Ileal mesentery: multiple tiers of arcades (3-5 rows) giving rise to short, numerous vasa recta.",
        "imageUrl": "/images/practical/mgl-3/anatomy/jejunal_ileal_arcades.webp"
    },
    {
        "seq": 27,
        "lecture": 8,
        "text": "In this transverse mesocolon dissection, identify the labeled colic arterial branch arising from the SMA:",
        "correct_answer": "Middle colic artery",
        "distractors": [
            "Right colic artery branch",
            "Ileocolic artery trunk",
            "Left colic artery branch"
        ],
        "explanation": "Criteria of Identification: Arises from anterior surface of SMA below pancreas, enters transverse mesocolon, divides into right and left branches to supply transverse colon.",
        "keyConcept": "Middle colic artery: branch of SMA entering transverse mesocolon to supply transverse colon.",
        "imageUrl": "/images/practical/mgl-3/anatomy/colic_arteries_sma.webp"
    },
    {
        "seq": 28,
        "lecture": 8,
        "text": "In this lower abdominal dissection, identify the labeled hindgut arterial trunk arising at L3:",
        "correct_answer": "Inferior mesenteric artery",
        "distractors": [
            "Median sacral artery",
            "Superior rectal terminal artery",
            "Left testicular / ovarian artery"
        ],
        "explanation": "Criteria of Identification: Arises from anterior aorta at L3 vertebral level (3-4 cm above bifurcation), giving off left colic, sigmoid arteries, and terminating as superior rectal artery.",
        "keyConcept": "IMA: hindgut artery arising at L3, giving off left colic, sigmoid branches, and superior rectal artery.",
        "imageUrl": "/images/practical/mgl-3/anatomy/ima_branches_colon.webp"
    },
    {
        "seq": 29,
        "lecture": 8,
        "text": "Behind the neck of the pancreas, identify the labeled large venous trunk formed by this union:",
        "correct_answer": "Hepatic portal vein",
        "distractors": [
            "Inferior vena cava (IVC)",
            "Superior mesenteric vein",
            "Splenic drainage vein"
        ],
        "explanation": "Criteria of Identification: Formed behind neck of pancreas at L2 by the union of splenic vein and superior mesenteric vein, ascending in free margin of lesser omentum to porta hepatis.",
        "keyConcept": "Portal vein: formed behind pancreatic neck at L2 by union of splenic vein and superior mesenteric vein.",
        "imageUrl": "/images/practical/mgl-3/anatomy/portal_vein_tributaries.webp"
    },
    {
        "seq": 30,
        "lecture": 9,
        "text": "On the inferior aspect of this bony palate, identify the labeled posterolateral bilateral foramina:",
        "correct_answer": "Greater palatine foramina",
        "distractors": [
            "Incisive fossa canal",
            "Lesser palatine foramina",
            "Sphenopalatine notch"
        ],
        "explanation": "Criteria of Identification: Located in posterolateral corner of hard palate medial to last molar tooth, transmitting greater palatine nerve and vessels.",
        "keyConcept": "Greater palatine foramen: transmits greater palatine nerve and vessels to mucosa of hard palate.",
        "imageUrl": "/images/practical/mgl-3/anatomy/bony_palate_foramina.webp"
    },
    {
        "seq": 31,
        "lecture": 9,
        "text": "On this bony iliac crest specimen, identify the labeled muscle attaching to the intermediate line:",
        "correct_answer": "Internal oblique muscle",
        "distractors": [
            "External oblique muscle",
            "Transversus abdominis muscle",
            "Tensor fasciae latae muscle"
        ],
        "explanation": "Criteria of Identification: The iliac crest anterior 2/3 presents an outer lip (external oblique), intermediate line (internal oblique), and inner lip (transversus abdominis).",
        "keyConcept": "Iliac crest intermediate line: site of origin of internal oblique muscle.",
        "imageUrl": "/images/practical/mgl-3/anatomy/iliac_crest_muscles.webp"
    },
    {
        "seq": 32,
        "lecture": 9,
        "text": "On this osteological pelvis specimen, identify the labeled muscle originating from the pubic crest:",
        "correct_answer": "Rectus abdominis muscle",
        "distractors": [
            "Pectineus adductor muscle",
            "Psoas minor tendon insertion",
            "Adductor longus tendon"
        ],
        "explanation": "Criteria of Identification: Rectus abdominis originates by two heads from pubic crest and pubic symphysis, inserting onto costal cartilages 5-7 and xiphoid process.",
        "keyConcept": "Rectus abdominis: originates from pubic crest and symphysis, inserting onto costal cartilages 5-7.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pubic_crest_attachments.webp"
    },
    {
        "seq": 33,
        "lecture": 9,
        "text": "On this typical lumbar vertebra, identify the labeled horizontal, hatchet-shaped posterior process:",
        "correct_answer": "Lumbar spinous process",
        "distractors": [
            "Superior articular facet",
            "Transverse costiform process",
            "Accessory posterior tubercle"
        ],
        "explanation": "Criteria of Identification: Lumbar spinous process is broad, thick, quadrangular/hatchet-shaped, projecting directly backwards horizontally.",
        "keyConcept": "Lumbar spinous process: broad, quadrangular, horizontal plate projecting directly backward.",
        "imageUrl": "/images/practical/mgl-3/anatomy/lumbar_vertebra_ligaments.webp"
    },
    {
        "seq": 34,
        "lecture": 9,
        "text": "On this atypical fifth lumbar vertebra (L5), identify the labeled defining morphological feature:",
        "correct_answer": "Massive conical transverse process attached directly to the pedicle and body",
        "distractors": [
            "Bifid spinous process with posterior divergence",
            "Costal articular facets on posterolateral body aspect",
            "Heart-shaped body with circular vertebral foramen"
        ],
        "explanation": "Criteria of Identification: L5 is distinguished by massive, conical transverse processes that attach broadly to both the pedicle and side of the vertebral body, providing attachment for iliolumbar ligaments.",
        "keyConcept": "L5 vertebra: massive transverse processes attached to both pedicle and body for iliolumbar ligament.",
        "imageUrl": "/images/practical/mgl-3/anatomy/atypical_l5_vertebra.webp"
    },
    {
        "seq": 35,
        "lecture": 10,
        "text": "Examine this clinical photograph. Identify the labeled embryological defect responsible for this unilateral facial cleft:",
        "correct_answer": "Failure of fusion between maxillary and medial nasal prominences",
        "distractors": [
            "Failure of fusion between lateral palatine processes",
            "Defective migration of second pharyngeal arch mesenchyme",
            "Incomplete development of frontonasal prominence"
        ],
        "explanation": "Criteria of Identification: Cleft lip results from failure of the maxillary prominence to fuse with the intermaxillary segment (derived from fused medial nasal prominences).",
        "keyConcept": "Cleft lip: failure of fusion between maxillary prominence and medial nasal prominence.",
        "imageUrl": "/images/practical/mgl-3/anatomy/cleft_lip_palate_anomaly.webp"
    },
    {
        "seq": 36,
        "lecture": 10,
        "text": "In this diagram of tracheoesophageal malformations, identify the labeled most common anatomical variant (85%):",
        "correct_answer": "Proximal esophageal atresia with distal tracheoesophageal fistula",
        "distractors": [
            "Isolated esophageal atresia without fistula (Type A)",
            "Isolated H-type tracheoesophageal fistula (Type E)",
            "Proximal fistula with distal esophageal atresia (Type B)"
        ],
        "explanation": "Criteria of Identification: The classic presentation (Type C) comprises a blind-ending proximal esophageal pouch with a fistula connecting the distal esophagus to the carina/trachea.",
        "keyConcept": "Most common TEF variant (85%): blind proximal esophageal pouch + fistula between distal esophagus and trachea.",
        "imageUrl": "/images/practical/mgl-3/anatomy/tef_anomalies_types.webp"
    },
    {
        "seq": 37,
        "lecture": 10,
        "text": "On this axial abdominal CT scan at the transpyloric plane (T12-L1), identify the labeled retroperitoneal organ crossing the midline:",
        "correct_answer": "Pancreas",
        "distractors": [
            "Spleen",
            "Left adrenal gland",
            "Transverse colon"
        ],
        "explanation": "Criteria of Identification: The body and tail of the pancreas lie obliquely across the retroperitoneum, anterior to the splenic vein, aorta, and left kidney, extending toward the splenic hilum.",
        "keyConcept": "Pancreas on CT: elongated organ crossing anterior to splenic vein, aorta, and superior mesenteric artery.",
        "imageUrl": "/images/practical/mgl-3/anatomy/axial_ct_abdomen_t12_l1.webp"
    }
]

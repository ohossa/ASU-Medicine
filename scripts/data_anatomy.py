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

# NET_NEW_ANATOMY for stations 38 to 75

NET_NEW_ANATOMY = [
    {
        "seq": 38,
        "lecture": 1,
        "text": "Examine this pinned sagittal dissection of the pharynx. Identify the pinned mucosal elevation indicated by [A] situated above the pharyngeal opening of the auditory tube:",
        "correct_answer": "Tubal elevation (Torus tubarius)",
        "distractors": [
            "Salpingopharyngeal fold",
            "Palatine tonsil",
            "Pharyngeal tonsil (Adenoid)"
        ],
        "explanation": "Criteria of Identification: The tubal elevation (torus tubarius) is a prominent, hood-like mucosal ridge on the lateral nasopharyngeal wall produced by the underlying cartilaginous end of the auditory (Eustachian) tube, situated directly superior and posterior to the pharyngeal orifice of the tube.",
        "keyConcept": "Torus tubarius: cartilaginous elevation overarching the pharyngeal orifice of the auditory tube.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0038.webp"
    },
    {
        "seq": 39,
        "lecture": 1,
        "text": "Examine this pinned cadaveric dissection of the submandibular triangle. Identify the tortuous arterial vessel indicated by pin [A] grooving the deep and posterior aspects of the submandibular gland:",
        "correct_answer": "Facial artery",
        "distractors": [
            "Lingual artery",
            "Maxillary artery",
            "External carotid artery"
        ],
        "explanation": "Criteria of Identification: The facial artery arises from the external carotid artery in the carotid triangle, enters the submandibular triangle by looping over the styloglossus muscle, grooves the posterosuperior aspect of the submandibular salivary gland, and hooks around the inferior border of the mandible at the anterior border of masseter.",
        "keyConcept": "Facial artery: loops deep to the posterior aspect of the submandibular gland before crossing the mandibular border.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0039.webp"
    },
    {
        "seq": 40,
        "lecture": 1,
        "text": "Examine this pinned dissection of the lateral face. Identify the salivary duct indicated by pin [A] crossing the superficial surface of the masseter muscle:",
        "correct_answer": "Parotid duct (Stensen's duct)",
        "distractors": [
            "Submandibular duct (Wharton's duct)",
            "Facial vein",
            "Buccal branch of facial nerve"
        ],
        "explanation": "Criteria of Identification: The parotid duct (Stensen's duct) arises from the anterior border of the parotid gland, runs horizontally forward across the superficial surface of the masseter muscle one fingerbreadth below the zygomatic arch, turns medially at the anterior border of masseter to pierce the buccal fat pad and buccinator muscle, opening into the oral vestibule opposite the crown of the upper 2nd molar.",
        "keyConcept": "Parotid duct: crosses superficial surface of masseter, pierces buccinator, opens opposite maxillary 2nd molar.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0040.webp"
    },
    {
        "seq": 41,
        "lecture": 2,
        "text": "Examine this pinned dissection of the deep anterior abdominal wall. Identify the oval defect in the fascia transversalis indicated by pin [A] situated 1.5 cm above the midinguinal point:",
        "correct_answer": "Deep inguinal ring",
        "distractors": [
            "Superficial inguinal ring",
            "Femoral ring",
            "Saphenous opening"
        ],
        "explanation": "Criteria of Identification: The deep (internal) inguinal ring is an oval aperture in the fascia transversalis located 1.25 to 1.5 cm superior to the midinguinal point (midway between ASIS and pubic symphysis), situated immediately lateral to the origin of the inferior epigastric vessels.",
        "keyConcept": "Deep inguinal ring: defect in fascia transversalis located 1.5 cm above midinguinal point, lateral to inferior epigastric vessels.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0041.webp"
    },
    {
        "seq": 42,
        "lecture": 2,
        "text": "Examine this pinned dissection of the posterior surface of the anterior abdominal wall. Identify the horizontal curved free margin indicated by pin [A] where the posterior rectus sheath terminates:",
        "correct_answer": "Arcuate line of Douglas (Linea semicircularis)",
        "distractors": [
            "Linea alba",
            "Linea semilunaris",
            "Pectineal line"
        ],
        "explanation": "Criteria of Identification: The arcuate line of Douglas (linea semicircularis) is the curved inferior free margin of the posterior wall of the rectus sheath, located midway between the umbilicus and pubic crest; below this line, all aponeuroses of the internal oblique and transversus abdominis pass anterior to the rectus abdominis muscle, leaving the rectus muscle resting directly on fascia transversalis.",
        "keyConcept": "Arcuate line: inferior free margin of the posterior rectus sheath midway between umbilicus and pubis.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0042.webp"
    },
    {
        "seq": 43,
        "lecture": 3,
        "text": "Examine this pinned dissection of the posterior abdominal wall. Identify the nerve indicated by pin [A] piercing and emerging onto the anterior surface of the psoas major muscle:",
        "correct_answer": "Genitofemoral nerve (L1, L2)",
        "distractors": [
            "Femoral nerve (L2-L4)",
            "Lateral cutaneous nerve of thigh (L2, L3)",
            "Ilioinguinal nerve (L1)"
        ],
        "explanation": "Criteria of Identification: The genitofemoral nerve (L1, L2) is the only nerve that pierces the substance of psoas major and descends vertically on its anterior surface beneath the retroperitoneal fascia, subsequently dividing into genital and femoral branches.",
        "keyConcept": "Genitofemoral nerve: only nerve emerging onto the anterior surface of psoas major.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0043.webp"
    },
    {
        "seq": 44,
        "lecture": 3,
        "text": "Examine this pinned posterior abdominal wall dissection. Identify the nerve indicated by pin [A] crossing obliquely across the iliacus muscle toward the anterior superior iliac spine:",
        "correct_answer": "Lateral cutaneous nerve of the thigh (L2, L3)",
        "distractors": [
            "Femoral nerve",
            "Obturator nerve",
            "Iliohypogastric nerve"
        ],
        "explanation": "Criteria of Identification: The lateral cutaneous nerve of the thigh (L2, L3) emerges from the lateral border of psoas major, crosses obliquely across the iliacus muscle toward the anterior superior iliac spine (ASIS), and passes into the thigh beneath the lateral attachment of the inguinal ligament.",
        "keyConcept": "Lateral cutaneous nerve of thigh: crosses obliquely over iliacus toward ASIS to exit beneath inguinal ligament.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0044.webp"
    },
    {
        "seq": 45,
        "lecture": 3,
        "text": "Examine this pinned posterior abdominal wall dissection. Identify the two somatic nerves indicated by pin [A] emerging from the upper lateral border of psoas major and running across quadratus lumborum:",
        "correct_answer": "Iliohypogastric and Ilioinguinal nerves (L1)",
        "distractors": [
            "Femoral and obturator nerves",
            "Subcostal and sympathetic trunk",
            "Genitofemoral and lateral cutaneous nerves"
        ],
        "explanation": "Criteria of Identification: The iliohypogastric and ilioinguinal nerves arise from the ventral ramus of L1, emerge from the lateral border of psoas major in close proximity, and course obliquely inferolaterally across the anterior surface of quadratus lumborum toward the iliac crest.",
        "keyConcept": "Iliohypogastric & Ilioinguinal nerves: L1 branches crossing quadratus lumborum above the iliac crest.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0045.webp"
    },
    {
        "seq": 46,
        "lecture": 4,
        "text": "Examine this pinned dissection of the retroperitoneum and stomach bed. Identify the remarkably tortuous arterial vessel indicated by pin [A] coursing along the superior border of the pancreas:",
        "correct_answer": "Splenic artery",
        "distractors": [
            "Common hepatic artery",
            "Left gastric artery",
            "Superior mesenteric artery"
        ],
        "explanation": "Criteria of Identification: The splenic artery is the largest and most tortuous branch of the celiac trunk; it runs horizontally to the left along the superior margin of the body and tail of the pancreas in the retroperitoneum, entering the splenorenal (lienorenal) ligament to reach the splenic hilum.",
        "keyConcept": "Splenic artery: characteristically tortuous artery running along the upper border of the pancreas toward splenic hilum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0046.webp"
    },
    {
        "seq": 47,
        "lecture": 4,
        "text": "Examine this internal mucosal view of an opened stomach. Identify the thickened circular smooth muscle ring indicated by pin [A] guarding the gastroduodenal junction:",
        "correct_answer": "Pyloric sphincter",
        "distractors": [
            "Lower esophageal sphincter",
            "Major duodenal papilla",
            "Angular incisure"
        ],
        "explanation": "Criteria of Identification: The pyloric sphincter is formed by a marked hypertrophy and thickening of the circular layer of muscularis externa at the pyloroduodenal junction, surrounding the narrow pyloric orifice and demarcated externally by the prepyloric vein of Mayo.",
        "keyConcept": "Pyloric sphincter: thickened circular smooth muscle muscularis externa ring controlling gastric emptying.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0047.webp"
    },
    {
        "seq": 48,
        "lecture": 4,
        "text": "Examine this pinned mucosal dissection of the descending (second) part of the duodenum. Identify the mucosal elevation indicated by pin [A] opening on the posteromedial wall 8–10 cm from the pylorus:",
        "correct_answer": "Major duodenal papilla (Ampulla of Vater)",
        "distractors": [
            "Minor duodenal papilla",
            "Duodenojejunal flexure",
            "Pyloric valve"
        ],
        "explanation": "Criteria of Identification: The major duodenal papilla (papilla of Vater) is a conical mucosal elevation located on the posteromedial wall of the second (descending) part of the duodenum, capped by a mucosal hood and harboring the hepatopancreatic ampulla where the common bile duct and main pancreatic duct (Wirsung) unite.",
        "keyConcept": "Major duodenal papilla: posteromedial wall of 2nd duodenum receiving CBD and main pancreatic duct.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0048.webp"
    },
    {
        "seq": 49,
        "lecture": 4,
        "text": "Examine this pinned retroperitoneal dissection. Identify the horizontal gut segment indicated by pin [A] crossed anteriorly by the superior mesenteric artery and vein:",
        "correct_answer": "Third (horizontal / transverse) part of duodenum",
        "distractors": [
            "Second (descending) part of duodenum",
            "Fourth (ascending) part of duodenum",
            "Transverse colon"
        ],
        "explanation": "Criteria of Identification: The 3rd (horizontal) part of the duodenum runs horizontally to the left across the L3 vertebra, abdominal aorta, and IVC, and is crossed anteriorly by the root of the mesentery containing the superior mesenteric artery and vein, making it vulnerable to compression in Superior Mesenteric Artery (Wilkie's) syndrome.",
        "keyConcept": "3rd part of duodenum: horizontal segment crossing L3 anterior to aorta/IVC, crossed anteriorly by SMA and SMV.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0049.webp"
    },
    {
        "seq": 50,
        "lecture": 4,
        "text": "Examine this pinned dissection of the pancreas. Identify the hook-like parenchymal process indicated by pin [A] extending medially and superiorly behind the superior mesenteric vessels:",
        "correct_answer": "Uncinate process of the pancreas",
        "distractors": [
            "Pancreatic head proper",
            "Pancreatic neck",
            "Pancreatic tail"
        ],
        "explanation": "Criteria of Identification: The uncinate process is a triangular prolongation projecting from the lower, left part of the pancreatic head; it extends medially and superiorly behind the superior mesenteric artery and vein, resting posteriorly on the abdominal aorta.",
        "keyConcept": "Uncinate process: lower projection of pancreatic head passing posterior to superior mesenteric vessels.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0050.webp"
    },
    {
        "seq": 51,
        "lecture": 5,
        "text": "Examine this pinned biliary dissection. Identify the tortuous duct indicated by pin [A] characterized by internal spiral mucosal folds (spiral valves of Heister):",
        "correct_answer": "Cystic duct",
        "distractors": [
            "Common hepatic duct",
            "Common bile duct",
            "Right hepatic duct"
        ],
        "explanation": "Criteria of Identification: The cystic duct is 3 to 4 cm long, connects the gallbladder neck to the common hepatic duct to form the common bile duct, and contains the mucosal spiral fold (valves of Heister) that keeps the lumen continuously patent during changes in intra-abdominal pressure.",
        "keyConcept": "Cystic duct: connects gallbladder neck to common hepatic duct; contains internal spiral valves of Heister.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0051.webp"
    },
    {
        "seq": 52,
        "lecture": 5,
        "text": "Examine this surgical dissection of the hepatobiliary triangle (Calot's triangle). Identify the arterial vessel indicated by pin [A] running through this space to supply the gallbladder:",
        "correct_answer": "Cystic artery",
        "distractors": [
            "Right hepatic artery",
            "Gastroduodenal artery",
            "Right gastric artery"
        ],
        "explanation": "Criteria of Identification: The cystohepatic triangle of Calot is bounded inferiorly by the cystic duct, medially by the common hepatic duct, and superiorly by the inferior visceral surface of the liver; the cystic artery (typically a branch of the right hepatic artery) traverses this triangle to reach the neck of the gallbladder.",
        "keyConcept": "Cystic artery: runs within Calot's triangle (bounded by cystic duct, common hepatic duct, and liver surface).",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0052.webp"
    },
    {
        "seq": 53,
        "lecture": 5,
        "text": "Examine this pinned posterior surface of a cadaveric liver. Identify the rectangular anatomical lobe indicated by pin [A] bounded by the IVC on the right and the fissure for ligamentum venosum on the left:",
        "correct_answer": "Caudate lobe of liver",
        "distractors": [
            "Quadrate lobe",
            "Left anatomical lobe",
            "Bare area of liver"
        ],
        "explanation": "Criteria of Identification: The caudate lobe (segment I) lies on the posterior surface of the liver; it is bounded on the right by the deep sulcus for the inferior vena cava, on the left by the fissure for the ligamentum venosum, and inferiorly by the porta hepatis.",
        "keyConcept": "Caudate lobe: posterior liver lobe bounded between groove for IVC on right and ligamentum venosum fissure on left.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0053.webp"
    },
    {
        "seq": 54,
        "lecture": 5,
        "text": "Examine this pinned visceral surface of a liver. Identify the rectangular lobe indicated by pin [A] bounded by the gallbladder fossa on the right and the fissure for ligamentum teres on the left:",
        "correct_answer": "Quadrate lobe of liver",
        "distractors": [
            "Caudate lobe",
            "Right anatomical lobe",
            "Gastric impression"
        ],
        "explanation": "Criteria of Identification: The quadrate lobe (segment IVb) is situated on the inferior visceral surface of the liver; it is bounded on the right by the fossa for the gallbladder, on the left by the fissure for the ligamentum teres (round ligament), anteriorly by the sharp inferior border of the liver, and posteriorly by the porta hepatis.",
        "keyConcept": "Quadrate lobe: visceral liver lobe bounded between gallbladder fossa on right and ligamentum teres fissure on left.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0054.webp"
    },
    {
        "seq": 55,
        "lecture": 5,
        "text": "Examine this pinned dissection of the free margin of the lesser omentum at the porta hepatis. Identify the large venous vessel indicated by pin [A] lying in the most posterior plane:",
        "correct_answer": "Portal vein",
        "distractors": [
            "Common bile duct",
            "Hepatic artery proper",
            "Inferior vena cava"
        ],
        "explanation": "Criteria of Identification: In the free right margin of the lesser omentum (anterior boundary of the epiploic foramen of Winslow), the structures are arranged constantly: the common bile duct lies right anterior, the proper hepatic artery lies left anterior, and the wide thin-walled portal vein lies posterior to both.",
        "keyConcept": "Porta hepatis arrangement: bile duct right-anterior, hepatic artery left-anterior, portal vein posterior.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0055.webp"
    },
    {
        "seq": 56,
        "lecture": 6,
        "text": "Examine this pinned dissection of the jejunal mesentery. Identify the characteristic morphological feature indicated by pin [A]:",
        "correct_answer": "Long straight vasa recta with simple 1-to-2 tier arterial arcades and clear translucent mesenteric windows",
        "distractors": [
            "Short straight vasa recta with complex multi-tiered arcades packed with fat",
            "Absence of straight arteries with single vascular loop",
            "Prominent subperitoneal lymphoid nodules"
        ],
        "explanation": "Criteria of Identification: The jejunum is definitively distinguished in mesenteric dissections by having simple arterial arcades (1 or 2 tiers), exceptionally long, straight vasa recta (arteriae rectae), and minimal mesenteric fat, leaving clear, translucent, fat-free peritoneal windows near the bowel wall.",
        "keyConcept": "Jejunal mesentery: 1–2 simple arterial arcades + long vasa recta + translucent fat-free peritoneal windows.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0056.webp"
    },
    {
        "seq": 57,
        "lecture": 6,
        "text": "Examine this pinned dissection of the ileal mesentery. Identify the characteristic morphological feature indicated by pin [A]:",
        "correct_answer": "Complex multi-tiered arterial arcades (3 to 5 tiers) with short vasa recta and fat extending up to the bowel wall",
        "distractors": [
            "Simple single-tier arcade with long vasa recta and clear windows",
            "Complete absence of mesenteric adipose tissue",
            "Presence of submucosal Brunner's glands"
        ],
        "explanation": "Criteria of Identification: The ileum exhibits complex arterial arcades arranged in 3 to 5 tiers giving off very short, fine vasa recta, with abundant mesenteric fat that extends all the way onto the bowel wall ('creeping fat'), completely obliterating translucent peritoneal windows.",
        "keyConcept": "Ileal mesentery: 3–5 multi-tiered complex arcades + short vasa recta + fat extending onto the intestinal wall.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0057.webp"
    },
    {
        "seq": 58,
        "lecture": 6,
        "text": "Examine this pinned dissection of the ileocecal junction. Identify the arterial vessel indicated by pin [A] running in the free border of the mesoappendix:",
        "correct_answer": "Appendicular artery",
        "distractors": [
            "Ileocolic artery",
            "Right colic artery",
            "Middle colic artery"
        ],
        "explanation": "Criteria of Identification: The appendicular artery is an end-artery arising from the inferior division of the ileocolic artery; it passes behind the terminal ileum to enter the free margin of the triangular mesoappendix, supplying the appendix up to its tip.",
        "keyConcept": "Appendicular artery: end-artery branch of ileocolic artery coursing in the free border of the mesoappendix.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0058.webp"
    },
    {
        "seq": 59,
        "lecture": 6,
        "text": "Examine this pinned gross dissection of the cecum. Identify the longitudinal smooth muscle band indicated by pin [A] that converges definitively at the base of the vermiform appendix:",
        "correct_answer": "Taenia coli (Taenia libera)",
        "distractors": [
            "Plica semilunaris",
            "Appendix epiploica",
            "Internal anal sphincter"
        ],
        "explanation": "Criteria of Identification: The three taeniae coli (taenia libera, taenia mesocolica, and taenia omentalis) are thickened longitudinal bands of muscularis externa that converge at the posteromedial wall of the cecum precisely at the base of the vermiform appendix, providing the definitive surgical guide to locating the appendix.",
        "keyConcept": "Taenia coli: longitudinal smooth muscle bands converging at the posteromedial base of the vermiform appendix.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0059.webp"
    },
    {
        "seq": 60,
        "lecture": 7,
        "text": "Examine this pinned dissection of the transverse mesocolon. Identify the artery indicated by pin [A] arising from the anterior surface of the SMA and dividing into right and left branches within the transverse mesocolon:",
        "correct_answer": "Middle colic artery",
        "distractors": [
            "Right colic artery",
            "Left colic artery",
            "Ileocolic artery"
        ],
        "explanation": "Criteria of Identification: The middle colic artery arises from the anterior surface of the superior mesenteric artery just below the neck of the pancreas, enters the transverse mesocolon, and divides into right and left branches that anastomose with the right colic and left colic arteries respectively.",
        "keyConcept": "Middle colic artery: branch of SMA coursing inside transverse mesocolon to supply transverse colon.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0060.webp"
    },
    {
        "seq": 61,
        "lecture": 7,
        "text": "Examine this pinned mesenteric arcade along the inner border of the large intestine. Identify the continuous anastomotic arterial channel indicated by pin [A] running parallel to the colon wall:",
        "correct_answer": "Marginal artery of Drummond",
        "distractors": [
            "Arc of Riolan",
            "Celiac axis",
            "Inferior pancreaticoduodenal arcade"
        ],
        "explanation": "Criteria of Identification: The marginal artery of Drummond is a continuous arterial arcade running 2.5 to 3.5 cm from the mesenteric border of the colon from the cecum to the rectum, formed by end-to-end anastomoses of branches of the ileocolic, right colic, middle colic, left colic, and sigmoid arteries.",
        "keyConcept": "Marginal artery of Drummond: continuous anastomotic arcade along mesenteric border of large intestine.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0061.webp"
    },
    {
        "seq": 62,
        "lecture": 7,
        "text": "Examine this pinned retroperitoneal dissection of the left colic gutter. Identify the arterial branch indicated by pin [A] arising from the inferior mesenteric artery and ascending retroperitoneally toward the splenic flexure:",
        "correct_answer": "Left colic artery",
        "distractors": [
            "Sigmoid artery",
            "Superior rectal artery",
            "Middle colic artery"
        ],
        "explanation": "Criteria of Identification: The left colic artery is the first and highest branch of the inferior mesenteric artery (IMA); it runs retroperitoneally upward and to the left in front of the psoas major, left ureter, and testicular/ovarian vessels toward the splenic (left colic) flexure, dividing into ascending and descending branches.",
        "keyConcept": "Left colic artery: first branch of IMA ascending retroperitoneally to supply splenic flexure and descending colon.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0062.webp"
    },
    {
        "seq": 63,
        "lecture": 7,
        "text": "Examine this pinned venous dissection behind the neck of the pancreas. Identify the two large venous trunks uniting to form the portal vein indicated by pin [A]:",
        "correct_answer": "Splenic vein and Superior mesenteric vein",
        "distractors": [
            "Inferior mesenteric vein and renal vein",
            "Hepatic vein and IVC",
            "Gastroduodenal vein and cystic vein"
        ],
        "explanation": "Criteria of Identification: The portal vein is formed behind the neck of the pancreas at the level of the L2 vertebra by the union of the superior mesenteric vein (running vertically) and the splenic vein (running horizontally from left to right). Note that the inferior mesenteric vein typically drains into the splenic vein.",
        "keyConcept": "Portal vein formation: union of splenic vein and superior mesenteric vein behind the neck of the pancreas at L2.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0063.webp"
    },
    {
        "seq": 64,
        "lecture": 8,
        "text": "Examine this pinned retroperitoneal vascular dissection. Identify the long venous vessel indicated by pin [A] crossing anterior to the abdominal aorta immediately below the origin of the superior mesenteric artery:",
        "correct_answer": "Left renal vein",
        "distractors": [
            "Right renal vein",
            "Splenic vein",
            "Left testicular vein"
        ],
        "explanation": "Criteria of Identification: The left renal vein is three times longer than the right (~7.5 cm vs. 2.5 cm); it crosses the midline horizontally in front of the abdominal aorta directly beneath the origin of the superior mesenteric artery (vulnerable to compression in Nutcracker syndrome) to drain into the IVC.",
        "keyConcept": "Left renal vein: crosses anterior to aorta directly beneath the origin of the superior mesenteric artery.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0064.webp"
    },
    {
        "seq": 65,
        "lecture": 8,
        "text": "Examine this pinned mucosal dissection of the coronal section of the anal canal. Identify the scalloped horizontal boundary indicated by pin [A] separating the anal columns from the anal pecten:",
        "correct_answer": "Pectinate (dentate) line",
        "distractors": [
            "Anocutaneous line (Hilton's white line)",
            "Interanal line",
            "Levator ani muscle shelf"
        ],
        "explanation": "Criteria of Identification: The pectinate (dentate) line is a zig-zag line formed by the free edges of the anal valves uniting the bases of the vertical anal columns of Morgagni, marking the fundamental boundary between hindgut-derived upper anal canal (visceral sensation, portal venous drainage) and proctodeum-derived lower anal canal (somatic pudendal sensation, systemic caval drainage).",
        "keyConcept": "Pectinate line: zig-zag boundary formed by anal valves demarcating visceral (hindgut) from somatic (ectoderm) anal canal.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0065.webp"
    },
    {
        "seq": 66,
        "lecture": 8,
        "text": "Examine this pinned pelvic dissection of the anal canal. Identify the palpable groove indicated by pin [A] situated between the lower rounded borders of the internal and external anal sphincters:",
        "correct_answer": "Intersphincteric groove (Hilton's white line)",
        "distractors": [
            "Pectinate line",
            "Anal valve margin",
            "Perineal body"
        ],
        "explanation": "Criteria of Identification: The intersphincteric groove (Hilton's line / anocutaneous line) is a palpable landmark at the lower end of the anal canal situated between the lower rounded margin of the involuntary internal anal sphincter and the subcutaneous part of the voluntary external anal sphincter.",
        "keyConcept": "Intersphincteric groove: palpable groove between internal and external anal sphincters at the anal verge.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0066.webp"
    },
    {
        "seq": 67,
        "lecture": 9,
        "text": "Examine this osteological specimen of a typical lumbar vertebra. Identify the cylindrical bony bar indicated by pin [A] connecting the vertebral body to the posterior neural arch:",
        "correct_answer": "Vertebral pedicle",
        "distractors": [
            "Vertebral lamina",
            "Transverse process",
            "Spinous process"
        ],
        "explanation": "Criteria of Identification: The pedicles of lumbar vertebrae are short, thick, rounded horizontal bony cylinders projecting posteriorly from the posterosuperior aspect of the vertebral body, possessing deep inferior vertebral notches that form intervertebral foramina for exiting spinal nerves.",
        "keyConcept": "Lumbar pedicle: thick horizontal cylindrical bony bar attaching the vertebral body to the neural arch.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0067.webp"
    },
    {
        "seq": 68,
        "lecture": 9,
        "text": "Examine this osteological specimen of the hip bone. Identify the intermediate area of the anterior two-thirds of the iliac crest indicated by pin [A]:",
        "correct_answer": "Attachment of the Internal Oblique muscle",
        "distractors": [
            "Attachment of External Oblique muscle",
            "Attachment of Transversus Abdominis muscle",
            "Attachment of Tensor Fasciae Latae"
        ],
        "explanation": "Criteria of Identification: The anterior two-thirds of the iliac crest displays three distinct zones: 1) outer lip (giving attachment to the external oblique and fascia lata), 2) intermediate area (giving origin to the internal oblique muscle), and 3) inner lip (giving attachment to transversus abdominis and fascia transversalis).",
        "keyConcept": "Iliac crest intermediate area: gives origin to the internal oblique abdominal muscle.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0068.webp"
    },
    {
        "seq": 69,
        "lecture": 9,
        "text": "Examine this osteological specimen of the pubic bone. Identify the pointed bony projection indicated by pin [A] located at the lateral end of the pubic crest:",
        "correct_answer": "Pubic tubercle",
        "distractors": [
            "Pecten pubis",
            "Pubic symphysis",
            "Anterior inferior iliac spine"
        ],
        "explanation": "Criteria of Identification: The pubic tubercle is a prominent, palpable bony projection at the lateral extremity of the pubic crest, providing the medial insertion for the inguinal ligament (Poupart's ligament) and the inferior crus of the superficial inguinal ring.",
        "keyConcept": "Pubic tubercle: bony projection at lateral end of pubic crest anchoring medial end of inguinal ligament.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0069.webp"
    },
    {
        "seq": 70,
        "lecture": 10,
        "text": "Examine this contrast barium meal radiograph from an infant with non-bilious projectile vomiting. Identify this congenital anomaly demonstrating a markedly elongated, narrowed pyloric canal ('string sign') and gastric distension:",
        "correct_answer": "Congenital Hypertrophic Pyloric Stenosis (CHIPS)",
        "distractors": [
            "Duodenal atresia",
            "Tracheoesophageal fistula",
            "Annular pancreas"
        ],
        "explanation": "Criteria of Identification: Congenital Hypertrophic Pyloric Stenosis (CHIPS) results from hypertrophy of the circular smooth muscle of the pylorus; barium swallow shows marked gastric distension, delayed emptying, and the classic 'string sign' (a thin, elongated stream of contrast through the narrowed pyloric canal).",
        "keyConcept": "CHIPS: hypertrophy of circular pyloric smooth muscle presenting with projectile non-bilious vomiting and 'string sign'.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0070.webp"
    },
    {
        "seq": 71,
        "lecture": 10,
        "text": "Examine this erect plain abdominal radiograph of a newborn with bilious vomiting. Identify the pathognomonic radiological appearance demonstrating two prominent gas-filled cavities in the upper abdomen ('double bubble' sign):",
        "correct_answer": "Duodenal atresia",
        "distractors": [
            "Pyloric stenosis",
            "Jejunal atresia",
            "Imperforate anus"
        ],
        "explanation": "Criteria of Identification: Duodenal atresia (due to failure of recanalization of the duodenal lumen in weeks 8–10 of development, strongly associated with Down syndrome) presents radiologically with the classic 'double bubble' sign: one air bubble in the distended stomach and the second in the dilated first/second duodenal bulb, with complete absence of distal bowel gas.",
        "keyConcept": "Duodenal atresia: failure of gut recanalization causing 'double bubble' sign (stomach + duodenum air bubbles).",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0071.webp"
    },
    {
        "seq": 72,
        "lecture": 10,
        "text": "Examine this clinical photograph of a newborn anterior abdominal wall anomaly indicated by pin [A]. Identify this midline congenital herniation of abdominal viscera into the base of the umbilical cord, completely enclosed within a translucent peritoneal-amniotic membrane:",
        "correct_answer": "Omphalocele (Exomphalos)",
        "distractors": [
            "Gastroschisis",
            "Umbilical hernia",
            "Patent vitellointestinal duct"
        ],
        "explanation": "Criteria of Identification: Omphalocele is a midline defect in the anterior abdominal wall due to failure of bowel loops to return to the abdominal cavity from the physiological umbilical herniation at week 10; viscera are characteristically enclosed within a translucent covering sac formed of peritoneum and amnion, with the umbilical cord inserting onto the apex of the sac.",
        "keyConcept": "Omphalocele: midline herniation of abdominal viscera covered by a protective peritoneal-amniotic sac.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0072.webp"
    },
    {
        "seq": 73,
        "lecture": 10,
        "text": "Examine this anatomical diagram of congenital anomalies. Identify this malformation where a ring of pancreatic tissue completely encircles the second (descending) part of the duodenum:",
        "correct_answer": "Annular pancreas",
        "distractors": [
            "Pancreas divisum",
            "Ectopic pancreas",
            "Duodenal duplication cyst"
        ],
        "explanation": "Criteria of Identification: Annular pancreas occurs when the bifid ventral pancreatic bud migrates in opposite directions (anterior and posterior to the duodenum) to fuse with the dorsal bud, creating a complete ring of pancreatic parenchyma encircling the second part of the duodenum and predisposing to neonatal duodenal obstruction.",
        "keyConcept": "Annular pancreas: ring of pancreatic tissue encircling 2nd part of duodenum due to abnormal ventral bud migration.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0073.webp"
    },
    {
        "seq": 74,
        "lecture": 10,
        "text": "Examine this axial abdominal CT scan at the transpyloric plane (T12-L1). Identify the organ indicated by pin [A] situated in the left upper quadrant posterior to the stomach and lateral to the left kidney:",
        "correct_answer": "Spleen",
        "distractors": [
            "Pancreatic tail",
            "Left adrenal gland",
            "Left colic flexure"
        ],
        "explanation": "Criteria of Identification: On axial CT at T12-L1, the spleen is recognized as a crescentic parenchymal organ occupying the left hypochondrium (under ribs 9–11), bounded medially by the left kidney, anteriorly by the stomach, and posterolaterally by the left hemidiaphragm.",
        "keyConcept": "Spleen on axial CT: crescentic parenchymal organ in left hypochondrium lateral to left kidney and stomach.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0074.webp"
    },
    {
        "seq": 75,
        "lecture": 10,
        "text": "Examine this axial abdominal CT scan at the subcostal plane (L1-L2). Identify the paired vascular structures indicated by pin [A] and [B] lying immediately anterior to the uncinate process of the pancreas:",
        "correct_answer": "Superior mesenteric vein [A] and Superior mesenteric artery [B]",
        "distractors": [
            "Portal vein and Celiac trunk",
            "Inferior vena cava and Abdominal aorta",
            "Splenic vein and Splenic artery"
        ],
        "explanation": "Criteria of Identification: At the L1-L2 level, the superior mesenteric vein (SMV, larger and situated to the right) and the superior mesenteric artery (SMA, circular with fat cuff, situated to the left) are positioned directly anterior to the uncinate process and 3rd duodenum, and posterior to the neck of the pancreas.",
        "keyConcept": "Mesenteric vessels on axial CT: SMV (right) and SMA (left) situated anterior to pancreatic uncinate process at L1-L2.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pinned_anat_0075.webp"
    }
]


ANATOMY_QUESTIONS = ANATOMY_QUESTIONS + NET_NEW_ANATOMY

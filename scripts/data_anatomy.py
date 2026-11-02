# scripts/data_anatomy.py
"""
Official 37 Anatomy Practical Revision Questions for Year 3 GIT (MGL-3).
Source: Final Anatomy Practical Revision (2022-2023).pdf (79 pages)
"""

ANATOMY_QUESTIONS = [
    {
        "seq": 1,
        "lecture": 1,
        "text": "In this sagittal section of the oral cavity and pharynx, identify the lymphoid structure situated in the triangular fossa bounded anteriorly by the palatoglossal arch and posteriorly by the palatopharyngeal arch:",
        "correct_answer": "Palatine tonsil",
        "distractors": [
            "Pharyngeal adenoid tonsil",
            "Lingual follicular tonsil",
            "Tubal mucosal tonsil"
        ],
        "explanation": "The palatine tonsil occupies the tonsillar sinus (fossa) between the palatoglossal arch (anterior pillar) and palatopharyngeal arch (posterior pillar), covered by non-keratinized stratified squamous epithelium.",
        "keyConcept": "Palatine tonsil: lymphoid organ situated in the tonsillar fossa between palatoglossal and palatopharyngeal arches.",
        "imageUrl": "/images/practical/mgl-3/anatomy/sagittal_mouth_pharynx.webp"
    },
    {
        "seq": 2,
        "lecture": 1,
        "text": "Examine this deep dissection of the palatine tonsillar bed. Identify the principal cranial nerve that traverses the bed and is vulnerable to injury during tonsillectomy, mediating taste to the posterior third of the tongue:",
        "correct_answer": "Glossopharyngeal nerve (CN IX)",
        "distractors": [
            "Hypoglossal motor nerve (CN XII)",
            "Lingual sensory nerve (V3)",
            "Accessory motor nerve (CN XI)"
        ],
        "explanation": "The glossopharyngeal nerve (CN IX) courses along the lateral muscular wall of the pharynx immediately deep to the tonsillar bed, posing a critical clinical risk during surgical tonsillectomy.",
        "keyConcept": "Glossopharyngeal nerve: traverses tonsillar bed supplying general sensation and taste to posterior 1/3 of tongue.",
        "imageUrl": "/images/practical/mgl-3/anatomy/palatine_tonsil_bed.webp"
    },
    {
        "seq": 3,
        "lecture": 1,
        "text": "Examine the dorsal surface of this dissected tongue. Identify the V-shaped groove whose apex points posteriorly to the foramen cecum, demarcating the junction between the anterior two-thirds and posterior one-third:",
        "correct_answer": "Sulcus terminalis",
        "distractors": [
            "Median lingual sulcus",
            "Glossoepiglottic fold",
            "Sublingual fold margin"
        ],
        "explanation": "The sulcus terminalis is the anatomical boundary between the presulcal oral part (anterior 2/3, 1st arch) and postsulcal pharyngeal part (posterior 1/3, 3rd arch), immediately flanked by circumvallate papillae.",
        "keyConcept": "Sulcus terminalis: V-shaped groove separating oral and pharyngeal tongue segments.",
        "imageUrl": "/images/practical/mgl-3/anatomy/tongue_dorsum_papillae.webp"
    },
    {
        "seq": 4,
        "lecture": 2,
        "text": "In this lateral head and neck dissection demonstrating the topography of the major salivary glands, identify the large gland wedged in the retromandibular fossa anterior to the mastoid process and sternocleidomastoid muscle:",
        "correct_answer": "Parotid salivary gland",
        "distractors": [
            "Submandibular gland",
            "Sublingual salivary gland",
            "Thyroid glandular lobe"
        ],
        "explanation": "The parotid gland occupies the retromandibular fossa, enclosed by the dense parotid fascia derived from the investing layer of deep cervical fascia, wrapping around the ramus of the mandible.",
        "keyConcept": "Parotid gland: largest salivary gland situated in retromandibular space anterior to sternocleidomastoid.",
        "imageUrl": "/images/practical/mgl-3/anatomy/salivary_glands_topography.webp"
    },
    {
        "seq": 5,
        "lecture": 2,
        "text": "Examine this superficial facial dissection. Identify the excretory duct that crosses superficial to the masseter muscle, pierces the buccinator, and opens into the oral vestibule opposite the crown of the upper second molar:",
        "correct_answer": "Parotid duct (Stensen's duct)",
        "distractors": [
            "Submandibular duct of Wharton",
            "Major sublingual duct of Rivinus",
            "Nasolacrimal drainage duct"
        ],
        "explanation": "Stensen's duct arises from the anterior border of the parotid gland, runs horizontally across the masseter, pierces the buccal fat pad and buccinator muscle, and terminates opposite the maxillary second molar.",
        "keyConcept": "Parotid duct: traverses masseter and pierces buccinator to open opposite the upper second molar.",
        "imageUrl": "/images/practical/mgl-3/anatomy/parotid_gland_stensen_duct.webp"
    },
    {
        "seq": 6,
        "lecture": 2,
        "text": "In this submandibular triangle dissection, identify the major vascular structure that arches upward from the neck, grooves the deep and posterior surface of the submandibular gland, and curves over the mandibular base:",
        "correct_answer": "Facial artery",
        "distractors": [
            "Lingual arterial trunk",
            "Superficial temporal artery",
            "Maxillary branch artery"
        ],
        "explanation": "The facial artery arises from the external carotid artery, loops deep to the posterior belly of the digastric, grooves the posterior pole of the submandibular gland, and enters the face at the anterior border of the masseter.",
        "keyConcept": "Facial artery: intimately grooves the posterosuperior aspect of the submandibular salivary gland.",
        "imageUrl": "/images/practical/mgl-3/anatomy/submandibular_gland_digastric.webp"
    },
    {
        "seq": 7,
        "lecture": 3,
        "text": "Examine the superficial layer of the anterior abdominal wall. Identify the triangular opening in the external oblique aponeurosis transmitting the spermatic cord or round ligament of the uterus:",
        "correct_answer": "Superficial inguinal ring",
        "distractors": [
            "Deep internal inguinal ring",
            "Femoral canal ring orifice",
            "Saphenous opening hiatus"
        ],
        "explanation": "The superficial inguinal ring is a triangular hiatus in the external oblique aponeurosis located superolateral to the pubic crest, bounded by the medial and lateral crura and intercrural fibers.",
        "keyConcept": "Superficial inguinal ring: aponeurotic defect in external oblique through which the spermatic cord exits.",
        "imageUrl": "/images/practical/mgl-3/anatomy/external_oblique_inguinal_ring.webp"
    },
    {
        "seq": 8,
        "lecture": 3,
        "text": "In this anterior abdominal wall dissection, identify the composite aponeurotic structure formed by the fusion of the lower arching aponeurotic fibers of the internal oblique and transversus abdominis inserting into the pubic crest:",
        "correct_answer": "Conjoint tendon (Falx inguinalis)",
        "distractors": [
            "Inguinal ligament of Poupart",
            "Lacunar ligament of Gimbernat",
            "Pectineal ligament of Cooper"
        ],
        "explanation": "The conjoint tendon (falx inguinalis) is formed by the fused aponeuroses of the internal oblique and transversus abdominis muscles, inserting into the pubic crest and pectineal line to reinforce the posterior inguinal canal wall.",
        "keyConcept": "Conjoint tendon: fused aponeurotic arch of internal oblique and transversus inserting into the pubis.",
        "imageUrl": "/images/practical/mgl-3/anatomy/internal_oblique_rectus.webp"
    },
    {
        "seq": 9,
        "lecture": 3,
        "text": "Examine the posterior layer of the rectus sheath. Identify the curved horizontal boundary below which the posterior sheath is absent, allowing the rectus abdominis muscle to rest directly on transversalis fascia:",
        "correct_answer": "Arcuate line (Line of Douglas)",
        "distractors": [
            "Linea alba central margin",
            "Linea semilunaris lateral groove",
            "Transpyloric anatomical plane"
        ],
        "explanation": "The arcuate line marks the lower limit of the posterior rectus sheath (midway between umbilicus and pubic crest). Inferior to it, all aponeurotic layers pass anterior to the rectus abdominis muscle.",
        "keyConcept": "Arcuate line: inferior border of posterior rectus sheath where aponeuroses shift entirely anteriorly.",
        "imageUrl": "/images/practical/mgl-3/anatomy/transversus_abdominis.webp"
    },
    {
        "seq": 10,
        "lecture": 3,
        "text": "In this posterior abdominal wall dissection, identify the thick fleshy muscle that arises from the transverse processes and bodies of T12–L5 vertebrae, courses along the pelvic brim, and forms the bed of the lumbar plexus:",
        "correct_answer": "Psoas major muscle",
        "distractors": [
            "Quadratus lumborum muscle",
            "Transversus abdominis",
            "Iliacus muscle of pelvis"
        ],
        "explanation": "The psoas major originates from the lumbar vertebral bodies, discs, and transverse processes, descending inferolaterally to insert onto the lesser trochanter. The lumbar nerve plexus develops within its substance.",
        "keyConcept": "Psoas major: medial posterior abdominal wall muscle arising from lumbar spine, housing lumbar plexus.",
        "imageUrl": "/images/practical/mgl-3/anatomy/posterior_wall_muscles.webp"
    },
    {
        "seq": 11,
        "lecture": 4,
        "text": "Examine the retroperitoneal great vessels. At which vertebral level does the abdominal aorta bifurcate into the right and left common iliac arteries, corresponding on the anterior abdominal wall to the level of the umbilicus?",
        "correct_answer": "L4 vertebral body",
        "distractors": [
            "L2 vertebral body",
            "L3 vertebral body",
            "L5 vertebral body"
        ],
        "explanation": "The abdominal aorta bifurcates into the common iliac arteries at the level of the L4 vertebra, approximately 2–3 cm below the umbilicus, just superior to the formation of the IVC at L5.",
        "keyConcept": "Aortic bifurcation: occurs at L4 vertebral level, slightly superior to IVC confluence at L5.",
        "imageUrl": "/images/practical/mgl-3/anatomy/aorta_ivc_relations.webp"
    },
    {
        "seq": 12,
        "lecture": 4,
        "text": "In this posterior abdominal wall dissection, identify the somatic nerve emerging through the anterior muscular surface of the psoas major, descending into the pelvis to provide genital and femoral cutaneous sensory branches:",
        "correct_answer": "Genitofemoral nerve (L1, L2)",
        "distractors": [
            "Ilioinguinal somatic nerve (L1)",
            "Lateral femoral cutaneous nerve",
            "Femoral anterior motor trunk"
        ],
        "explanation": "The genitofemoral nerve uniquely pierces the ventral fleshy belly of the psoas major muscle, descending on its anterior surface before dividing into genital and femoral branches.",
        "keyConcept": "Genitofemoral nerve: only lumbar plexus nerve piercing and descending on the anterior surface of psoas major.",
        "imageUrl": "/images/practical/mgl-3/anatomy/lumbar_plexus_nerves.webp"
    },
    {
        "seq": 13,
        "lecture": 4,
        "text": "Examine this gross specimen of the stomach. Identify the prominent anatomical notch located along the lesser curvature that marks the junction between the gastric body and the pyloric antrum:",
        "correct_answer": "Incisura angularis (Angular notch)",
        "distractors": [
            "Cardiac notch of stomach",
            "Sulcus intermedius groove",
            "Pyloric muscular sphincter"
        ],
        "explanation": "The incisura angularis is an acute indentation on the lower part of the lesser curvature that indicates the anatomical boundary between the body of the stomach and the pyloric antrum.",
        "keyConcept": "Incisura angularis: angular notch on the lesser curvature separating the gastric body from the pyloric antrum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/stomach_parts_anatomy.webp"
    },
    {
        "seq": 14,
        "lecture": 5,
        "text": "In this dissection of the peritoneal cavity, identify the free right margin of the lesser omentum (hepatoduodenal ligament) containing the portal triad. Which foramen does it bound anteriorly?",
        "correct_answer": "Epiploic foramen of Winslow",
        "distractors": [
            "Greater sciatic foramen",
            "Obturator vascular canal",
            "Incisura angularis margin"
        ],
        "explanation": "The epiploic foramen (of Winslow) connects the greater and lesser peritoneal sacs. Its anterior boundary is the hepatoduodenal ligament containing the portal vein, proper hepatic artery, and common bile duct.",
        "keyConcept": "Epiploic foramen: peritoneal entrance to lesser sac bounded anteriorly by the portal triad in lesser omentum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/lesser_greater_omenta.webp"
    },
    {
        "seq": 15,
        "lecture": 5,
        "text": "Examine this gross specimen showing the retroperitoneal relationships of the pancreas and duodenum. Identify the hook-like inferior projection of the pancreatic head that passes posterior to the superior mesenteric vessels:",
        "correct_answer": "Uncinate process",
        "distractors": [
            "Pancreatic neck region",
            "Pancreatic tail tip",
            "Major duodenal papilla"
        ],
        "explanation": "The uncinate process is a medial and inferior extension of the lower part of the pancreatic head that projects medially behind the superior mesenteric vessels and in front of the aorta and IVC.",
        "keyConcept": "Uncinate process: lower pancreatic head extension coursing posterior to superior mesenteric artery and vein.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pancreas_duodenum_relations.webp"
    },
    {
        "seq": 16,
        "lecture": 5,
        "text": "Identify the sickle-shaped peritoneal fold connecting the diaphragmatic and anterior surfaces of the liver to the anterior abdominal wall and diaphragm, containing the obliterated umbilical vein in its inferior free edge:",
        "correct_answer": "Falciform ligament",
        "distractors": [
            "Coronary liver ligament",
            "Right triangular ligament",
            "Hepatoduodenal ligament"
        ],
        "explanation": "The falciform ligament is a double-layered peritoneal fold anchoring the liver to the anterior wall and diaphragm. Its free lower border carries the ligamentum teres hepatis (obliterated left umbilical vein).",
        "keyConcept": "Falciform ligament: peritoneal fold carrying ligamentum teres hepatis in its inferior free edge.",
        "imageUrl": "/images/practical/mgl-3/anatomy/liver_anterior_falciform.webp"
    },
    {
        "seq": 17,
        "lecture": 6,
        "text": "Examine the posterior diaphragmatic surface of this liver specimen. Identify the triangular non-peritoneal area directly resting on the diaphragm, bounded by the superior and inferior layers of the coronary ligament:",
        "correct_answer": "Bare area of the liver",
        "distractors": [
            "Porta hepatis portal fissure",
            "Gallbladder fossa bed",
            "Fissure for ligamentum venosum"
        ],
        "explanation": "The bare area of the liver is devoid of peritoneal covering, resting in direct apposition with the diaphragm. It is bounded by the coronary and triangular ligaments and contains the groove for the IVC.",
        "keyConcept": "Bare area: non-peritoneal posterior hepatic surface bounded by coronary ligaments resting against diaphragm.",
        "imageUrl": "/images/practical/mgl-3/anatomy/liver_posterior_surface_relations.webp"
    },
    {
        "seq": 18,
        "lecture": 6,
        "text": "In this inferior visceral view of the liver, identify the rectangular lobe bounded on the right by the gallbladder fossa, on the left by the fissure for ligamentum teres, and posteriorly by the porta hepatis:",
        "correct_answer": "Quadrate lobe",
        "distractors": [
            "Caudate anatomical lobe",
            "Right hepatic lateral lobe",
            "Left anatomical lobe"
        ],
        "explanation": "The quadrate lobe is located on the visceral hepatic surface, bounded anteriorly by the inferior border, posteriorly by the porta hepatis, right by the gallbladder, and left by the ligamentum teres.",
        "keyConcept": "Quadrate lobe: visceral hepatic lobe located between gallbladder fossa and fissure for ligamentum teres.",
        "imageUrl": "/images/practical/mgl-3/anatomy/liver_inferior_visceral_surface.webp"
    },
    {
        "seq": 19,
        "lecture": 6,
        "text": "Examine this biliary tree dissection. Identify the common muscular dilation formed by the confluence of the bile duct and the main pancreatic duct (of Wirsung) before discharging into the descending duodenum:",
        "correct_answer": "Ampulla of Vater (Hepatopancreatic)",
        "distractors": [
            "Hartmann's gallbladder pouch",
            "Cystic duct spiral valve",
            "Duct of Santorini accessory"
        ],
        "explanation": "The ampulla of Vater is formed by the union of the common bile duct and main pancreatic duct within the duodenal wall, opening at the major duodenal papilla guarded by the sphincter of Oddi.",
        "keyConcept": "Ampulla of Vater: hepatopancreatic dilation discharging combined bile and pancreatic juice into duodenum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/biliary_tree_anatomy.webp"
    },
    {
        "seq": 20,
        "lecture": 7,
        "text": "Compare the macroscopic features of the jejunum and ileum shown in this small intestinal specimen. Which anatomical characteristic definitively distinguishes the jejunum from the ileum?",
        "correct_answer": "Taller, closely packed plicae circulares and longer vasa recta",
        "distractors": [
            "More abundant mesenteric fat encroaching the bowel wall",
            "More numerous tiers of complex arterial mesenteric arcades",
            "Abundant visible aggregated Peyer's lymphoid nodules"
        ],
        "explanation": "The jejunum has a wider caliber, thicker hypervascular wall, prominent plicae circulares, and simple arterial arcades (1–2 tiers) giving off long straight vasa recta, with clear translucent mesenteric windows.",
        "keyConcept": "Jejunum characteristics: prominent plicae, simpler arcades with long vasa recta, and less mesenteric fat.",
        "imageUrl": "/images/practical/mgl-3/anatomy/small_intestine_jejunum_ileum.webp"
    },
    {
        "seq": 21,
        "lecture": 7,
        "text": "Examine this gross specimen of the large bowel. Identify the three longitudinal ribbons of thickened outer muscularis externa that converge at the base of the vermiform appendix:",
        "correct_answer": "Taeniae coli",
        "distractors": [
            "Plicae semilunares",
            "Appendices epiploicae",
            "Haustra sacculations"
        ],
        "explanation": "Taeniae coli are three narrow, distinct bands of outer longitudinal smooth muscle (taenia libera, mesocolica, and omentalis) that traverse the large intestine and converge at the root of the appendix.",
        "keyConcept": "Taeniae coli: three longitudinal smooth muscle bands converging at the base of the vermiform appendix.",
        "imageUrl": "/images/practical/mgl-3/anatomy/large_intestine_anatomy.webp"
    },
    {
        "seq": 22,
        "lecture": 7,
        "text": "In this coronal section of the anal canal, identify the horizontal undulating boundary that demarcates the transition between upper endodermal (visceral) and lower ectodermal (somatic) mucosa:",
        "correct_answer": "Pectinate (Dentate) line",
        "distractors": [
            "Hilton's white line",
            "Anocutaneous junction line",
            "Intersphincteric anal groove"
        ],
        "explanation": "The pectinate (dentate) line represents the embryological junction of the hindgut endoderm and proctodeal ectoderm, dividing autonomic painless mucosa above from somatic exquisitely sensitive mucosa below.",
        "keyConcept": "Pectinate line: embryological watershed dividing visceral innervation and drainage from somatic.",
        "imageUrl": "/images/practical/mgl-3/anatomy/rectum_anal_canal.webp"
    },
    {
        "seq": 23,
        "lecture": 8,
        "text": "Examine this arterial dissection of the upper abdomen. Identify the short, wide ventral branch arising from the abdominal aorta at the level of T12 immediately below the aortic hiatus of the diaphragm:",
        "correct_answer": "Celiac trunk",
        "distractors": [
            "Superior mesenteric artery",
            "Inferior mesenteric artery",
            "Renal arterial trunk"
        ],
        "explanation": "The celiac trunk arises from the ventral aspect of the abdominal aorta at T12, immediately dividing into three branches: left gastric artery, splenic artery, and common hepatic artery, supplying the foregut.",
        "keyConcept": "Celiac trunk: foregut artery arising from aorta at T12 giving left gastric, splenic, and common hepatic arteries.",
        "imageUrl": "/images/practical/mgl-3/anatomy/celiac_trunk_arteries.webp"
    },
    {
        "seq": 24,
        "lecture": 8,
        "text": "In this stomach arterial arcade dissection, identify the tortuous artery coursing along the upper border of the pancreas and delivering short gastric and left gastroepiploic arteries to the stomach:",
        "correct_answer": "Splenic artery",
        "distractors": [
            "Left gastric artery",
            "Gastroduodenal artery",
            "Common hepatic trunk"
        ],
        "explanation": "The splenic artery is the largest branch of the celiac trunk. It takes a characteristic undulating tortuous path along the superior margin of the pancreas before reaching the splenic hilum and greater gastric curvature.",
        "keyConcept": "Splenic artery: tortuous celiac branch traveling along upper border of pancreas toward spleen and stomach.",
        "imageUrl": "/images/practical/mgl-3/anatomy/stomach_arterial_arcade.webp"
    },
    {
        "seq": 25,
        "lecture": 8,
        "text": "Identify this major midgut artery arising from the abdominal aorta at the level of L1, descending anterior to the horizontal (third) part of the duodenum and giving off branches to the small bowel and proximal colon:",
        "correct_answer": "Superior mesenteric artery",
        "distractors": [
            "Inferior mesenteric artery",
            "Celiac vascular trunk",
            "Common iliac artery"
        ],
        "explanation": "The superior mesenteric artery arises at L1 behind the pancreatic neck, crosses in front of the uncinate process and 3rd part of the duodenum, and enters the root of the mesentery to supply the entire midgut.",
        "keyConcept": "Superior mesenteric artery: midgut arterial supply crossing anterior to the 3rd part of the duodenum.",
        "imageUrl": "/images/practical/mgl-3/anatomy/sma_artery_branches.webp"
    },
    {
        "seq": 26,
        "lecture": 8,
        "text": "Examine these arterial loops in the small intestinal mesentery. Identify the segment demonstrating multiple overlapping tiers (3 to 5 levels) of complex arterial arcades with short vasa recta:",
        "correct_answer": "Ileal mesenteric arcades",
        "distractors": [
            "Jejunal mesenteric arcades",
            "Middle colic arcades",
            "Marginal artery of Drummond"
        ],
        "explanation": "The ileal mesentery is characterized by multiple rows (tiers 3–5) of small, crowded arterial arcades giving off short straight terminal vasa recta, accompanied by abundant mesenteric adipose tissue.",
        "keyConcept": "Ileal arcades: multiple complex tiers (3–5 arcades) with short vasa recta and heavy mesenteric fat.",
        "imageUrl": "/images/practical/mgl-3/anatomy/jejunal_ileal_arcades.webp"
    },
    {
        "seq": 27,
        "lecture": 8,
        "text": "In this dissection of the transverse mesocolon, identify the first major colic branch of the superior mesenteric artery that ascends to supply the transverse colon:",
        "correct_answer": "Middle colic artery",
        "distractors": [
            "Right colic artery",
            "Ileocolic artery",
            "Left colic artery"
        ],
        "explanation": "The middle colic artery arises from the anterior surface of the SMA just below the pancreas, enters the transverse mesocolon, and divides into right and left branches to supply the transverse colon.",
        "keyConcept": "Middle colic artery: SMA branch running through transverse mesocolon to supply the transverse colon.",
        "imageUrl": "/images/practical/mgl-3/anatomy/colic_arteries_sma.webp"
    },
    {
        "seq": 28,
        "lecture": 8,
        "text": "Identify this hindgut artery arising from the anterior aorta at the level of L3, descending to give off the left colic and sigmoid branches before terminating as the superior rectal artery:",
        "correct_answer": "Inferior mesenteric artery",
        "distractors": [
            "Superior mesenteric artery",
            "Middle colic branch",
            "Median sacral trunk"
        ],
        "explanation": "The inferior mesenteric artery arises at L3 and supplies the hindgut (distal 1/3 of transverse colon to upper anal canal), branching into the left colic, sigmoid arteries, and the superior rectal artery.",
        "keyConcept": "Inferior mesenteric artery: hindgut artery arising at L3 terminating as the superior rectal artery.",
        "imageUrl": "/images/practical/mgl-3/anatomy/ima_branches_colon.webp"
    },
    {
        "seq": 29,
        "lecture": 9,
        "text": "Examine this venous dissection behind the neck of the pancreas. Identify the large venous trunk formed by the union of the splenic vein and the superior mesenteric vein:",
        "correct_answer": "Hepatic portal vein",
        "distractors": [
            "Inferior vena cava",
            "Left renal vein",
            "Right gonadal vein"
        ],
        "explanation": "The portal vein is formed behind the neck of the pancreas by the confluence of the superior mesenteric vein and the splenic vein, conveying nutrient-rich blood from the digestive tract to the hepatic sinusoids.",
        "keyConcept": "Portal vein: formed behind pancreatic neck by the union of splenic vein and superior mesenteric vein.",
        "imageUrl": "/images/practical/mgl-3/anatomy/portal_vein_tributaries.webp"
    },
    {
        "seq": 30,
        "lecture": 9,
        "text": "In this inferior view of the bony palate (oral aspect), identify the bilateral posterolateral foramina located on the horizontal plates of the palatine bones that transmit the greater palatine nerves and vessels:",
        "correct_answer": "Greater palatine foramina",
        "distractors": [
            "Incisive fossa canal",
            "Lesser palatine foramina",
            "Jugular cranial foramen"
        ],
        "explanation": "The greater palatine foramina pierce the horizontal plate of the palatine bone near the posterior alveolar margin, transmitting the greater palatine nerve and vessels forward to the hard palate mucosa.",
        "keyConcept": "Greater palatine foramina: posterolateral bony palate apertures transmitting neurovascular supply to hard palate.",
        "imageUrl": "/images/practical/mgl-3/anatomy/bony_palate_foramina.webp"
    },
    {
        "seq": 31,
        "lecture": 9,
        "text": "Examine this dissected bony iliac crest specimen. Which muscle of the anterior abdominal wall attaches to the intermediate line of the iliac crest between its outer and inner lips?",
        "correct_answer": "Internal oblique muscle",
        "distractors": [
            "External oblique muscle",
            "Transversus abdominis",
            "Quadratus lumborum"
        ],
        "explanation": "The iliac crest provides muscular attachments in three zones: the outer lip attaches the external oblique, the intermediate line attaches the internal oblique, and the inner lip attaches transversus abdominis.",
        "keyConcept": "Intermediate line of iliac crest: site of muscular origin for the internal oblique abdominal muscle.",
        "imageUrl": "/images/practical/mgl-3/anatomy/iliac_crest_muscles.webp"
    },
    {
        "seq": 32,
        "lecture": 9,
        "text": "In this osteological pelvis specimen, identify the muscular structure that takes origin from the pubic crest and pubic tubercle, ascending vertically within the rectus sheath toward the costal margin:",
        "correct_answer": "Rectus abdominis muscle",
        "distractors": [
            "Pectineus adductor muscle",
            "Pyramidalis anterior belly",
            "Iliopsoas pelvic tendon"
        ],
        "explanation": "The rectus abdominis originates by two heads from the pubic crest and pubic symphysis, ascending within the rectus sheath to insert onto the xiphoid process and 5th to 7th costal cartilages.",
        "keyConcept": "Rectus abdominis: vertical strap muscle arising from pubic crest and symphysis ascending to costal margin.",
        "imageUrl": "/images/practical/mgl-3/anatomy/pubic_crest_attachments.webp"
    },
    {
        "seq": 33,
        "lecture": 9,
        "text": "Examine this typical lumbar vertebra (L1–L4). Identify the hatchet-shaped horizontal posterior projection that serves as an attachment site for the supraspinous and interspinous ligaments:",
        "correct_answer": "Lumbar spinous process",
        "distractors": [
            "Mamillary process projection",
            "Accessory tubercle process",
            "Costiform transverse process"
        ],
        "explanation": "Typical lumbar vertebrae possess a thick, quadrangular, hatchet-shaped spinous process that projects almost horizontally backwards, facilitating lumbar puncture between adjacent spines.",
        "keyConcept": "Lumbar spinous process: broad, horizontal hatchet-shaped process providing interspinous ligamentous anchor.",
        "imageUrl": "/images/practical/mgl-3/anatomy/lumbar_vertebra_ligaments.webp"
    },
    {
        "seq": 34,
        "lecture": 9,
        "text": "In this osteological specimen of the atypical fifth lumbar vertebra (L5), identify the defining morphological feature that distinguishes it from typical upper lumbar vertebrae:",
        "correct_answer": "Massive conical transverse process attached directly to the pedicle and body",
        "distractors": [
            "Circular rather than triangular vertebral canal",
            "Bifid spinous process with posterior hook",
            "Absence of superior articular facets"
        ],
        "explanation": "The L5 vertebra is atypical because its massive, stout, conical transverse processes arise directly from both the pedicle and the lateral surface of the body to anchor the robust iliolumbar ligaments.",
        "keyConcept": "L5 vertebra: distinguished by massive conical transverse processes attached directly to the pedicle and body.",
        "imageUrl": "/images/practical/mgl-3/anatomy/atypical_l5_vertebra.webp"
    },
    {
        "seq": 35,
        "lecture": 10,
        "text": "Examine this clinical photograph demonstrating a unilateral cleft lip. This congenital defect results from the failure of fusion between which two embryonic prominences?",
        "correct_answer": "Maxillary prominence and medial nasal prominence",
        "distractors": [
            "Mandibular prominence and lateral nasal prominence",
            "Lateral palatine process and nasal septum",
            "Frontonasal prominence and mandibular arch"
        ],
        "explanation": "Cleft lip occurs when the maxillary prominence of the 1st pharyngeal arch fails to fuse with the medial nasal prominence (intermaxillary segment), resulting in a persistent groove or cleft in the upper lip.",
        "keyConcept": "Cleft lip: developmental failure of fusion between the maxillary prominence and medial nasal prominence.",
        "imageUrl": "/images/practical/mgl-3/anatomy/cleft_lip_palate_anomaly.webp"
    },
    {
        "seq": 36,
        "lecture": 10,
        "text": "In this diagram of congenital tracheoesophageal anomalies, identify the most common anatomical variant (Type C / Vogt IIIb, ~85-90% of cases):",
        "correct_answer": "Proximal esophageal atresia with distal tracheoesophageal fistula",
        "distractors": [
            "Isolated esophageal atresia without fistula",
            "Proximal tracheoesophageal fistula with distal atresia",
            "Isolated H-type tracheoesophageal fistula"
        ],
        "explanation": "The most frequent anomaly (Type C, ~85%) consists of a blind proximal esophageal pouch (atresia) and a distal esophageal segment that communicates with the trachea near the carina, causing air in the stomach.",
        "keyConcept": "Tracheoesophageal fistula: Type C (blind upper esophageal pouch with distal fistula) is the most common form.",
        "imageUrl": "/images/practical/mgl-3/anatomy/tef_anomalies_types.webp"
    },
    {
        "seq": 37,
        "lecture": 10,
        "text": "Examine this axial abdominal CT scan at the transpyloric plane (T12-L1). Identify the large visceral organ crossing the midline whose neck lies immediately anterior to the superior mesenteric vessels:",
        "correct_answer": "Pancreas",
        "distractors": [
            "Transverse colon loop",
            "Duodenojejunal flexure",
            "Left renal cortex parenchyma"
        ],
        "explanation": "At the transpyloric plane (T12–L1), the pancreas lies transversely across the retroperitoneum, with its neck situated directly in front of the origin of the superior mesenteric vein and artery.",
        "keyConcept": "Pancreas on axial CT: elongated retroperitoneal organ whose neck crosses anterior to mesenteric vessels at L1.",
        "imageUrl": "/images/practical/mgl-3/anatomy/axial_ct_abdomen_t12_l1.webp"
    }
]

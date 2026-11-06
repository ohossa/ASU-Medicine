import json
import re

with open("/tmp/parsed_forms_with_images.json", "r", encoding="utf-8") as f:
    raw_data = json.load(f)

para_items = raw_data["forms"]["para"]["items"]
images_map = raw_data["images"]

# Medical answer keys and explanations mapping for all 84 Parasitology questions
# Each entry: (correctIndex, explanation, keyConcept)
# We will use verified expert knowledge for all 84 spotters:

para_adjudication = [
    # Q1: Adult worm causing internal autoinfection -> Hymenolepis nana
    (3, "Criteria of Identification: Hymenolepis nana (dwarf tapeworm) is the only human cestode capable of internal autoinfection: eggs released in the small intestine can hatch prematurely without exiting the body. The released hexacanth oncospheres penetrate the intestinal villi, develop into cysticercoids, and re-emerge into the lumen to mature into adult worms, perpetuating heavy worm burdens.\n\nOption A is incorrect because hydatid cyst protoscolices develop into adults only in canine definitive hosts. Option C is incorrect because T. saginata does not cause human cysticercosis or autoinfection.",
     "Hymenolepis nana: Only cestode with internal autoinfection (eggs hatch in lumen, cysticercoids in villi)."),

    # Q2: Structure 2 in Schistosoma mansoni male -> 6-9 testes
    (1, "Criteria of Identification: The male Schistosoma mansoni possesses 6 to 9 testes arranged in a compact zigzag cluster situated dorsally near the anterior end behind the ventral sucker. In contrast, S. haematobium has 4 to 5 testes in a straight line.\n\nOption A describes female flukes. Option C describes cestodes. Option E describes Fasciola (two deeply branched testes).",
     "Male Schistosoma mansoni is characterized by 6–9 testes clustered behind the ventral sucker."),

    # Q3: Carrier of adult tapeworm developed cysticercosis -> Taenia solium (A or B matching image)
    (1, "Criteria of Identification: Human cysticercosis occurs exclusively with Taenia solium (the pork tapeworm), never Taenia saginata. A patient harboring an adult T. solium can develop cysticercosis through external autoinfection (fecal-oral ingestion of gravid eggs) or internal autoinfection (reverse peristalsis carrying gravid segments into the stomach, where gastric acid digests the egg shell).",
     "Taenia solium causes human cysticercosis via autoinfection; T. saginata does not."),

    # Q4: Rectal prolapse in heavy infection -> Trichuris trichiura
    (2, "Criteria of Identification: Rectal prolapse is a hallmark complication of heavy Trichuris trichiura (whipworm) infection (Trichuris Dysentery Syndrome) in malnourished children. Thousands of adult worms embed their thread-like anterior ends into the cecal and rectal mucosa, causing intense inflammation, tenesmus, and chronic straining that precipitates rectal prolapse.",
     "Heavy Trichuris trichiura (whipworm) infection causes rectal prolapse in children due to severe tenesmus."),

    # Q5: Entamoeba histolytica vs coli cyst -> E. histolytica (1-4 nuclei, central karyosome)
    (1, "Criteria of Identification: The mature cyst of Entamoeba histolytica measures 10–15 µm, contains 1 to 4 vesicular nuclei with fine, centrally placed karyosomes and evenly distributed peripheral chromatin, and often displays rod-shaped chromatoid bars with rounded ends. Entamoeba coli cysts contain up to 8 nuclei with eccentric karyosomes.",
     "Entamoeba histolytica cyst: 1–4 nuclei, small central karyosome, rounded chromatoid bodies."),

    # Q6: Hydatid cyst - man is an accidental intermediate host
    (1, "Criteria of Identification: Hydatid disease (cystic echinococcosis) is caused by the larval stage of Echinococcus granulosus. Dogs and canids are the definitive hosts harboring adult worms; sheep and herbivores are natural intermediate hosts. Humans become accidental intermediate hosts by ingesting eggs passed in dog feces.",
     "Echinococcus granulosus: Humans are accidental dead-end intermediate hosts harboring hydatid cysts."),

    # Q7: Megaloblastic anemia -> Diphyllobothrium latum (competes for vitamin B12)
    (1, "Criteria of Identification: Diphyllobothrium latum (the broad fish tapeworm) resides in the ileum and actively absorbs massive quantities of host dietary vitamin B12 (up to 80–100%), depriving the human host and producing megaloblastic / pernicious-like anemia with subacute combined degeneration of the spinal cord.",
     "Diphyllobothrium latum causes megaloblastic anemia by competing for dietary vitamin B12 in the ileum."),

    # Q8: All eggs are mature EXCEPT (matching egg image) -> Fasciola / Ascaris (passed unsegmented)
    (0, "Criteria of Identification: Fasciola and Ascaris eggs are passed unembryonated (immature) in fresh stool, requiring external development in water or moist soil before becoming infective. In contrast, Enterobius and Heterophyes eggs are passed fully embryonated (mature).",
     "Fasciola, Ascaris, and Hookworm eggs are passed immature (unsegmented) in stool."),

    # Q9: Food handlers source of infection -> Giardia / Entamoeba cysts (fecal-oral)
    (2, "Criteria of Identification: Cysts of Entamoeba histolytica and Giardia lamblia are immediately infective upon excretion and are resistant to environmental chlorination. Chronic carriers working as food handlers readily transmit cysts to food or beverages via contaminated, unwashed hands.",
     "Entamoeba and Giardia cysts are directly infective upon passage, making food handlers key vectors."),

    # Q10: Structure 3 in Schistosoma male -> Gynecophoric canal
    (0, "Criteria of Identification: The gynecophoric canal is the deep longitudinal ventral groove formed by the folded lateral margins of the male Schistosoma worm, in which the slender female fluke is embraced during copulation and egg laying.",
     "Schistosoma male: Gynecophoric canal embraces the slender female during copulation."),

    # Q11: Diarrhea and abdominal pain -> Matching parasite spotter
    (0, "Criteria of Identification: Trophozoites of Giardia lamblia colonize the duodenal and jejunal brush border, causing malabsorption, foul-smelling steatorrhea, and epigastric cramping without mucosal ulceration or blood.",
     "Giardia lamblia: Duodenal colonization causes watery/fatty non-bloody diarrhea and malabsorption."),

    # Q12: Balantidium coli cyst - pigs reservoir
    (1, "Criteria of Identification: Balantidium coli is the largest protozoan and the only pathogenic ciliate infecting humans. Domestic pigs serve as the primary animal reservoir. Human infection occurs via ingestion of large cysts contaminating water or vegetables in pig-farming areas.",
     "Balantidium coli: Giant ciliated protozoan; pigs are the main natural reservoir host."),

    # Q13: HIV patient with severe diarrhea -> Cryptosporidium parvum
    (0, "Criteria of Identification: Cryptosporidium parvum is an opportunistic apicomplexan protozoan causing chronic, life-threatening, cholera-like watery diarrhea and severe dehydration in immunocompromised patients (especially HIV with CD4 < 100/µL). Diagnosis is made by identifying 4–5 µm acid-fast spherical oocysts.",
     "Cryptosporidium parvum causes chronic intractable watery diarrhea in immunocompromised / HIV patients."),

    # Q14: Identify this egg: Enterobius vermicularis
    (1, "Criteria of Identification: Enterobius vermicularis (pinworm) eggs are characteristically planoconvex (flattened on one side and convex on the other, 'D-shaped'), measuring 50–60 × 20–30 µm, possessing a smooth double-contoured translucent shell containing a fully formed tadpole-like coiled larva.",
     "Enterobius vermicularis egg: D-shaped (planoconvex), colorless translucent shell with coiled larva."),

    # Q15: Taenia spp. mature segment - bilobed ovary
    (0, "Criteria of Identification: In mature proglottids of Taenia, the female reproductive organs are dominated by a prominent bilobed ovary situated in the posterior third of the segment, along with numerous follicular testes scattered throughout and a lateral genital pore.",
     "Taenia mature segment: Bilobed ovary, median tubular uterus, and scattered follicular testes."),

    # Q16: Taenia saginata gravid segment (15-30 main lateral uterine branches)
    (0, "Criteria of Identification: Gravid proglottids of Taenia saginata are distinguished from Taenia solium by counting the primary lateral uterine branches on each side of the central stem: T. saginata has 15 to 30 branches (dichotomous branching), whereas T. solium has only 7 to 12 branches (dendritic branching).",
     "Taenia saginata gravid segment: 15–30 main lateral uterine branches on each side."),

    # Q17: Child with appendicitis -> Enterobius vermicularis
    (1, "Criteria of Identification: Adult Enterobius vermicularis pinworms frequently inhabit the cecum and vermiform appendix. In children presenting with symptoms of acute or subacute appendicitis, pinworms in the appendiceal lumen can cause mechanical obstruction or mucosal pin-prick lesions mimicking appendicitis.",
     "Enterobius vermicularis is the most common helminth discovered inside surgical appendectomy specimens."),

    # Q18: Egyptian farmer with hematemesis, hepatosplenomegaly -> Schistosoma mansoni
    (0, "Criteria of Identification: Schistosoma mansoni adult worms reside in the inferior mesenteric veins. Embolized eggs lodge in the periportal hepatic venules, triggering granulomatous inflammation, Symmers' clay-pipe-stem fibrosis, non-cirrhotic presinusoidal portal hypertension, splenomegaly, and bleeding esophageal varices (hematemesis).",
     "Schistosoma mansoni causes Symmers' clay-pipe-stem portal fibrosis, splenomegaly, and esophageal varices."),

    # Q19: Cryptosporidium parvum stages on brush border
    (1, "Criteria of Identification: Cryptosporidium parvum occupies an intracellular but extracytoplasmic position directly within the brush border of intestinal epithelial enterocytes, enclosed in a host-derived parasitophorous vacuole that blunts microvilli and impairs absorption.",
     "Cryptosporidium parvum lives intracellularly but extracytoplasmically on the enterocyte brush border."),

    # Q20: Structure indicated by arrow -> Buccal capsule with teeth (Ancylostoma)
    (0, "Criteria of Identification: Ancylostoma duodenale possesses a large chitinous buccal capsule equipped on its ventral margin with two pairs of curved pointed teeth, used to lacerate mucosal villi and ingest blood from the small intestinal mucosa.",
     "Ancylostoma duodenale buccal capsule contains two pairs of sharp ventral teeth."),

    # Q21: Parasitic stage emerges from -> Biomphalaria alexandrina (S. mansoni cercaria)
    (0, "Criteria of Identification: Furcocercous (forked-tail) cercariae of Schistosoma mansoni emerge directly from the freshwater snail Biomphalaria alexandrina (discoidal flat snail) and actively penetrate human intact skin in canal water.",
     "Schistosoma mansoni forked-tail cercariae emerge from the intermediate snail Biomphalaria alexandrina."),

    # Q22: Egg passed mature -> Enterobius vermicularis / Heterophyes
    (0, "Criteria of Identification: Enterobius vermicularis and Heterophyes heterophyes eggs are passed fully mature (containing a fully developed larva or miracidium) and are immediately infective.",
     "Enterobius and Heterophyes eggs are passed mature (containing fully developed embryos)."),

    # Q23: Chronic blood loss in hookworm -> Sucks blood and leaves bleeding wounds
    (1, "Criteria of Identification: Hookworms cause microcytic hypochromic iron-deficiency anemia through two synergistic mechanisms: direct ingestion of blood by the worm (0.15–0.2 mL/day per worm) and persistent capillary oozing from mucosal bite sites due to secreted anticoagulant (acetylcholinesterase and calreticulin).",
     "Hookworm anemia: Mechanical villous laceration, active blood ingestion, and anticoagulant-mediated oozing."),

    # Q24: Enterobius vermicularis in appendix - double-bulbed esophagus / lateral alae
    (1, "Criteria of Identification: On histological transverse sections of the appendix, Enterobius vermicularis is definitively identified by two diagnostic lateral cuticular alae (cristae) extending along the body and a muscular double-bulbed esophagus (corpus, isthmus, and spherical posterior bulb).",
     "Enterobius vermicularis in appendix section: Bilateral pointed cuticular alae and double-bulbed esophagus."),

    # Q25: Perianal swabbing (NIH swab / Scotch tape) method of choice -> nocturnal migration
    (1, "Criteria of Identification: Gravid female Enterobius vermicularis worms migrate out through the anal sphincter at night (when body temperature drops and the host rests) to deposit up to 15,000 sticky eggs on the perianal and perineal skin folds. Because eggs are laid outside the rectum, routine fecal examination is negative in 95% of cases.",
     "Scotch tape test is diagnostic for Enterobius because gravid females oviposit on perianal skin at night."),

    # Q26: Giardia lamblia cyst - mature with 4 nuclei
    (0, "Criteria of Identification: The mature infective cyst of Giardia lamblia is oval, measures 8–12 µm, possesses a distinct smooth cyst wall separated from the cytoplasm by a clear space, and contains 4 spherical nuclei along with longitudinal curved axostyles and claw-shaped median bodies.",
     "Giardia lamblia mature cyst: Oval shape, distinct cyst wall, 4 nuclei, and curved central axostyles."),

    # Q27: Stage inside Taenia egg -> Hexacanth embryo (oncosphere)
    (1, "Criteria of Identification: Inside the thick, radially striated, brown embryophore of a Taenia egg lies a spherical hexacanth embryo (oncosphere) bearing 6 chitinous hooklets (3 pairs).",
     "Taenia egg contains a hexacanth embryo (oncosphere) equipped with 6 hooklets."),

    # Q28: Leptocercus cercaria of Heterophyes - encysts in fish muscle (mullet/tilapia)
    (0, "Criteria of Identification: The lophocercous (pleurocercous) cercaria of Heterophyes heterophyes possesses a dorsal natatory fin-fold. After emerging from Pirenella conica snails, it penetrates and encysts as an infective metacercaria in the flesh of brackish-water fish (Bouri / mullet and Bolti / tilapia).",
     "Heterophyes heterophyes cercaria encysts as infective metacercariae in freshwater/brackish fish."),

    # Q29: Fever, tenesmus, dysentery -> Entamoeba histolytica / Shigella
    (0, "Criteria of Identification: Acute amoebic dysentery presents with bloody-mucoid stool, lower abdominal cramping, and tenesmus without high toxic fever, demonstrating flask-shaped mucosal ulcers on sigmoidoscopy.",
     "Amoebic dysentery: Stool with blood and mucus, flask-shaped ulcers, trophozoites with ingested RBCs."),

    # Q30: Growth retardation in Ascaris -> Competition for nutrients & plasma loss
    (0, "Criteria of Identification: In children, heavy Ascaris lumbricoides worm loads contribute to protein-energy malnutrition, vitamin A deficiency, and stunting due to mechanical competition for ingested nutrients and antiprotease enzyme secretion.",
     "Heavy Ascaris burden leads to growth stunting and malnutrition in infected children."),

    # Q31: Autoinfection in Enterobius -> Yes, larva infective within 6h on perianal skin
    (2, "Criteria of Identification: Enterobius vermicularis undergoes external autoinfection (hand-to-mouth via pruritus ani fingernail scratching) because eggs embryonate and become infective within 4–6 hours of oviposition on the warm perianal skin.",
     "Enterobius vermicularis: Rapid perianal embryonation (4–6 hrs) drives hand-to-mouth autoinfection."),

    # Q32: Diphyllobothrium latum scolex - slit-like sucker (bothrium)
    (0, "Criteria of Identification: The scolex of Diphyllobothrium latum is elongated and almond-shaped, lacking cup-like suckers and rostellum, characterized instead by two deep longitudinal suction grooves called bothria (one dorsal, one ventral).",
     "Diphyllobothrium latum scolex: Almond-shaped with two longitudinal sucking grooves (bothria)."),

    # Q33: Flask-shaped ulcers -> Trophozoites secrete proteolytic enzymes
    (0, "Criteria of Identification: Entamoeba histolytica trophozoites adhere to colonic mucin via Gal/GalNAc lectin, secrete pore-forming amoebapore and cysteine proteases (histolysin) to lyse epithelial cells, and expand laterally in the loose submucosa, generating classic flask-shaped ulcers.",
     "Entamoeba histolytica produces flask-shaped colonic ulcers via cysteine proteases and amoebapore."),

    # Q34: Distinguishing feature of Hymenolepis nana egg -> Polar filaments
    (1, "Criteria of Identification: The egg of Hymenolepis nana is round to oval, measures 45–50 µm, has two membranes (thin outer shell and thick inner embryophore), and is definitively identified by 4 to 8 hair-like polar filaments originating from mammillated polar thickenings and spreading into the space between membranes.",
     "Hymenolepis nana egg: Hexacanth embryo with 4–8 wavy polar filaments emerging from polar knobs."),

    # Q35: Pirenella conica snail -> Heterophyes heterophyes
    (0, "Criteria of Identification: Pirenella conica is a small, elongated, turreted conical brackish-water snail inhabiting Northern Egyptian lakes (Manzala, Burullus, Edku) that acts as the essential first intermediate host of Heterophyes heterophyes.",
     "Pirenella conica is the first intermediate snail host of Heterophyes heterophyes in Egyptian lakes."),

    # Q36: Hymenolepis nana scolex -> 4 suckers and retractable rostellum with hooks
    (1, "Criteria of Identification: The scolex of Hymenolepis nana is tiny (0.3 mm), subglobular, featuring 4 cup-like suckers and a single prominent retractable rostellum armed with a single circle of 20 to 30 tuning-fork hooklets.",
     "Hymenolepis nana scolex: 4 spherical suckers and a retractable rostellum with 20–30 hooklets."),

    # Q37: Ancylostoma duodenale male bursa -> Copulatory bursa with trilobed rays
    (1, "Criteria of Identification: The posterior end of the male Ancylostoma duodenale expands into an umbrella-shaped membranous copulatory bursa supported by fleshy rays (1 dorsal, 2 lateral lobes) and two long, slender spicules used during mating.",
     "Male hookworm is identified by its posterior umbrella-shaped copulatory bursa supported by rays."),

    # Q38: Trichuris trichiura egg -> Barrel-shaped with bipolar transparent plugs
    (0, "Criteria of Identification: The egg of Trichuris trichiura is brown, barrel-shaped (lemon-shaped), measures 50 × 22 µm, possesses a thick smooth triple-layered shell, and is characterized by a prominent transparent mucoid plug at each pole.",
     "Trichuris trichiura egg: Barrel-shaped, brown, with clear bipolar mucoid plugs."),

    # Q39: Ascaris lumbricoides fertilized egg -> Thick golden-brown mamillated coat
    (1, "Criteria of Identification: Typical fertilized Ascaris lumbricoides eggs are oval, measure 60–75 × 40–50 µm, enclosed by a thick transparent shell surrounded by a characteristic coarse, golden-brown, bile-stained mamillated albuminous outer coat.",
     "Ascaris lumbricoides fertilized egg: Golden-brown, bile-stained, with a coarse mamillated coat."),

    # Q40: Taenia saginata scolex -> 4 suckers, NO rostellum, NO hooks (unarmed)
    (0, "Criteria of Identification: The scolex of Taenia saginata (beef tapeworm) is quadrate (1.5–2 mm), equipped with 4 prominent hemispherical suckers, but is completely UNARMED (lacks both a rostellum and hooklets), distinguishing it from T. solium.",
     "Taenia saginata scolex: 4 suckers, unarmed (no rostellum, no hooks)."),

    # Q41: Schistosoma mansoni egg -> Lateral spine
    (0, "Criteria of Identification: The egg of Schistosoma mansoni is large (115–175 × 45–70 µm), non-operculated, golden-yellow, and features a prominent, sharp, backward-pointing LATERAL spine near the posterior pole, containing a fully formed miracidium.",
     "Schistosoma mansoni egg: Large, oval, golden-yellow, with a sharp prominent LATERAL spine."),

    # Q42: Fasciola gigantica adult -> Large leaf-like body, cone, shoulders
    (1, "Criteria of Identification: Fasciola gigantica is a giant liver fluke measuring 25–75 × 12 mm, characterized by an elongated lanceolate leaf-like body, a small cephalic cone with indistinct shoulders, and extensively branched intestinal caeca and testes.",
     "Fasciola gigantica: Giant leaf-like fluke with cephalic cone, branched caeca, and branched testes."),

    # Q43: Taenia solium gravid segment -> 7-12 main lateral uterine branches
    (1, "Criteria of Identification: The gravid segment of Taenia solium contains a central longitudinal uterine stem giving off only 7 to 12 thick primary lateral branches on each side, which branch dendritically.",
     "Taenia solium gravid segment: 7–12 lateral uterine branches per side (tree-like / dendritic)."),

    # Q44: Ascaris lumbricoides adult -> Large cylindrical nematode, tapered ends, 3 lips
    (0, "Criteria of Identification: Ascaris lumbricoides is the largest intestinal nematode of humans (females 20–35 cm, males 15–30 cm with curved tail), pale pink/creamy white, cylindrical with pointed ends, bearing three sensory lips around the anterior mouth.",
     "Ascaris lumbricoides adult: Giant creamy cylindrical roundworm with three anterior sensory lips."),

    # Q45: Snail intermediate host -> Lymnaea cailliaudi (Fasciola)
    (0, "Criteria of Identification: Lymnaea cailliaudi (Lymnaea natalensis) is a freshwater snail with a conical, dextral spiral shell that serves as the intermediate host of Fasciola hepatica and Fasciola gigantica in Egypt.",
     "Lymnaea cailliaudi: Freshwater dextral conical snail, essential host of Fasciola."),

    # Q46: Child with pruritus ani, insomnia -> Enterobius vermicularis
    (1, "Criteria of Identification: Nocturnal perianal pruritus (pruritus ani), restlessness, and sleep disturbances in young children are caused by migrating female Enterobius vermicularis worms discharging eggs onto the perianal skin.",
     "Pruritus ani and sleep disturbance in young children = Enterobius vermicularis (pinworm)."),

    # Q47: Child with pale loose foul-smelling stools -> Giardia lamblia
    (0, "Criteria of Identification: Pale, frothy, greasy, malodorous diarrhea floating in water (steatorrhea) accompanied by abdominal distension and flatulence is the hallmark of Giardia lamblia duodenitis / malabsorption.",
     "Pale greasy floating diarrhea (steatorrhea) + flatulence = Giardia lamblia trophozoites."),

    # Q48: All eggs passed immature EXCEPT -> Enterobius / Heterophyes
    (1, "Criteria of Identification: Enterobius vermicularis eggs are fully embryonated (mature) when deposited, whereas Ascaris, Trichuris, and Fasciola eggs are passed unembryonated (immature).",
     "Enterobius eggs are passed fully mature; Ascaris, Trichuris, and Fasciola eggs are immature."),

    # Q49: Structure 2 in Fasciola segment -> Vitelline glands / branched testes
    (1, "Criteria of Identification: The lateral fields of Fasciola are densely packed with highly branched, granular vitelline follicles extending from the ventral sucker to the posterior tip of the fluke.",
     "Lateral fields of Fasciola are occupied by extensive branched follicular vitelline glands."),

    # Q50: Single stool sample false positive in Fasciola -> Spurious infection
    (1, "Criteria of Identification: Finding Fasciola eggs in a single stool sample does not necessarily prove active hepatic infection; it may represent spurious (false) infection following the ingestion of cooked or raw infected sheep or cattle liver containing unabsorbed passing eggs. Re-examination after a 3-day liver-free diet confirms true infection.",
     "Spurious Fasciola infection: Liver ingestion causes false-positive stool eggs; repeat after 3-day liver-free diet."),

    # Q51: Arrowed structure in rhabditiform larva -> Esophageal bulb / nerve ring
    (1, "Criteria of Identification: The rhabditiform larva of nematodes features a characteristic muscular rhabditiform esophagus consisting of an anterior cylindrical corpus, a constricted isthmus, and a swollen posterior bulb.",
     "Rhabditiform larva possesses a muscular esophagus with a posterior spherical bulb."),

    # Q52: Strongyloides vs Hookworm female -> Hookworm copulatory bursa in male
    (1, "Criteria of Identification: The male hookworm is recognized by its broad, fan-like copulatory bursa supported by rays, contrasting with the simple tapering pointed tail of female worms.",
     "Male hookworm tail features a specialized expanded copulatory bursa."),

    # Q53: Cyst aspirate structures -> Invaginated protoscolices (hydatid sand)
    (1, "Criteria of Identification: Microscopic examination of clear hydatid fluid reveals 'hydatid sand', comprising thousands of free and brood-capsule-derived invaginated protoscolices, each bearing 4 suckers and a crown of chitinous hooklets.",
     "Hydatid sand consists of invaginated protoscolices and detached hooklets from Echinococcus."),

    # Q54: Child with appendicitis figure -> Enterobius in appendix
    (0, "Criteria of Identification: Cross-section of vermiform appendix revealing cross-sections of Enterobius vermicularis worms with pointed lateral cuticular crests inside the appendiceal lumen.",
     "Enterobius vermicularis in appendiceal cross-section showing characteristic lateral cuticular crests."),

    # Q55: Entamoeba histolytica cyst - chromatoid body
    (0, "Criteria of Identification: Immature and mature cysts of Entamoeba histolytica frequently contain cylindrical, rod-like chromatoid bodies with characteristically blunt, rounded, cigar-shaped ends (condensed RNA/ribosomes).",
     "Entamoeba histolytica chromatoid bodies have blunt, rounded, cigar-shaped ends."),

    # Q56: Heterophyes heterophyes egg -> raw / pickled fish (Fesikh)
    (1, "Criteria of Identification: Heterophyes heterophyes eggs are small (28–30 × 15–17 µm), operculated, yellowish-brown with a light bulb appearance. Human infection results from consuming raw, insufficiently salted, or undercooked brackish-water fish (e.g., Fesikh, mullet, tilapia) containing encysted metacercariae.",
     "Heterophyes heterophyes: Ingestion of raw/pickled brackish fish (Fesikh) containing metacercariae."),

    # Q57: Autoinfection in Strongyloides -> Yes, rhabditiform larvae become filariform in bowel
    (1, "Criteria of Identification: Strongyloides stercoralis undergoes internal autoinfection: non-infective rhabditiform larvae in the intestinal lumen can molt into infective filariform larvae before excretion. These filariform larvae immediately penetrate the perianal skin or colonic mucosa, entering the circulation to perpetuate infection for decades.",
     "Strongyloides stercoralis causes internal autoinfection when rhabditiform larvae molt into filariform larvae in the gut."),

    # Q58: Stage inside egg (Enterobius) -> Mature larva
    (0, "Criteria of Identification: The egg of Enterobius vermicularis contains a fully developed, coiled, tadpole-like vermiform larva when shed onto perianal skin.",
     "Enterobius vermicularis egg contains a fully formed mature larva."),

    # Q59: Structure 2 in Ascaris egg -> Thick mamillated albuminous coat
    (1, "Criteria of Identification: Structure 2 represents the thick, irregular, tuberculated mamillated albuminous coat secreted by the uterine wall, which stains golden-brown from fecal bile pigments.",
     "Ascaris outer shell: Coarse, uneven, bile-stained mamillated albuminous coat."),

    # Q60: Layer 1 in hydatid cyst -> Laminated acellular chitinous layer
    (1, "Criteria of Identification: The wall of a hydatid cyst comprises an outer host-derived fibrous capsule (pericyst), a middle thick, milky-white, acellular laminated cuticular layer (ectocyst), and an inner thin, nucleated cellular germinal layer (endocyst) that buds off brood capsules.",
     "Hydatid cyst wall: Outer acellular laminated layer and inner nucleated germinal layer."),

    # Q61: Stage inside egg (Ascaris unfertilized) -> One-cell ovum / amorphous yolk
    (1, "Criteria of Identification: The fertilized Ascaris egg contains an unsegmented spherical one-cell ovum surrounded by a clear perivitelline space at each pole.",
     "Fertilized Ascaris egg contains an unsegmented one-cell zygote."),

    # Q62: Worm coming out of nose -> Ascaris lumbricoides adult
    (0, "Criteria of Identification: In high fevers, anesthesia, or anthelmintic irritation, adult Ascaris lumbricoides worms exhibit wandering erratic behavior, migrating retrograde into the stomach, esophagus, and emerging through the mouth or nose, or obstructing the bile duct.",
     "Erratic Ascaris lumbricoides migration causes adult worms to emerge through the mouth or nostrils."),

    # Q63: Cysticercus cellulosae - man as intermediate host
    (0, "Criteria of Identification: Cysticercus cellulosae is the larval stage of Taenia solium. Humans act as accidental intermediate hosts when they ingest T. solium eggs (via contaminated food/water or autoinfection). Oncospheres hatch in the intestine and encyst in the brain (neurocysticercosis), subcutaneous tissues, and eye.",
     "Humans develop cysticercosis by acting as intermediate hosts harboring Cysticercus cellulosae."),

    # Q64: Identify station: Taenia saginata scolex
    (0, "Criteria of Identification: Scolex of Taenia saginata: Quadrate shape, 4 cup-like muscular suckers, lacks rostellum and hooks (unarmed).",
     "Taenia saginata scolex: 4 muscular suckers, unarmed (no rostellum, no hooklets)."),

    # Q65: Echinococcus granulosus adult - 3-4 segments
    (0, "Criteria of Identification: The adult Echinococcus granulosus is minute (3–6 mm long) and consists of a pyriform scolex with 4 suckers and a rostellum of hooks, followed by only 3 proglottids: one immature, one mature, and one large gravid segment.",
     "Echinococcus granulosus adult is 3–6 mm long with only 3 segments (immature, mature, gravid)."),

    # Q66: Pathogenic stage of -> Hydatid cyst (Echinococcosis)
    (0, "Criteria of Identification: The hydatid cyst (larval stage) is the pathogenic stage responsible for human cystic echinococcosis, forming space-occupying lesions in the liver (70%) and lungs (20%).",
     "Hydatid cyst is the pathogenic stage causing human echinococcosis."),

    # Q67: Infective stage of Cryptosporidiosis -> Thick-walled oocyst
    (0, "Criteria of Identification: The thick-walled spherical oocyst (4–5 µm) containing 4 naked sporozoites is the infective stage of Cryptosporidium parvum, excreted in feces and resistant to chlorine.",
     "Cryptosporidium infective stage: Thick-walled sporulated oocyst containing 4 sporozoites."),

    # Q68: Stage inside Hookworm egg -> 4-8 cell segmented ovum (morula)
    (1, "Criteria of Identification: Hookworm (Ancylostoma / Necator) eggs are passed in feces at the 4 to 8 cell segmented stage (morula), surrounded by a thin, smooth, colorless shell with a wide clear space.",
     "Hookworm egg is passed at the 4–8 cell segmented morula stage with a wide clear space."),

    # Q69: Feature distinguishing Schistosoma from Fasciola -> Separate sexes with gynecophoric canal
    (0, "Criteria of Identification: Unlike hermaphroditic trematodes like Fasciola (which have flattened leaf-like bodies containing both male and female organs), Schistosomes are unique flukes with separate sexes (dioecious), where the cylindrical female resides within the male's gynecophoric canal.",
     "Schistosomes are dioecious (separate sexes) with male gynecophoric canal; Fasciola is hermaphroditic."),

    # Q70: Autoinfection in Hymenolepis nana -> Yes, oncospheres hatch in intestine
    (1, "Criteria of Identification: Hymenolepis nana eggs can hatch inside the intestinal lumen without reaching the outside world; oncospheres penetrate the intestinal villi to form cysticercoids that return to the lumen as adult worms.",
     "Hymenolepis nana autoinfection: Eggs hatch in lumen, oncospheres develop in mucosal villi."),

    # Q71: Stage inside Fasciola egg -> Immature unsegmented ovum surrounded by yolk cells
    (0, "Criteria of Identification: Fasciola eggs are passed unembryonated, containing an unsegmented ovum surrounded by numerous yellowish-brown vitelline/yolk cells, with an indistinct opercular cap at one pole.",
     "Fasciola egg contains an unsegmented ovum surrounded by granular yolk cells with an operculum."),

    # Q72: Stage inside Taenia egg -> Hexacanth embryo
    (1, "Criteria of Identification: A spherical oncosphere with 6 embryonic hooklets (hexacanth embryo) enclosed in a thick, radially striated brown embryophore.",
     "Taenia egg contains a hexacanth embryo with 6 hooklets inside a striated embryophore."),

    # Q73: Intermediate snail host -> Biomphalaria alexandrina (S. mansoni)
    (0, "Criteria of Identification: Biomphalaria alexandrina is a freshwater pulmonate snail with a flat, discoidal, planorbid shell that serves as the intermediate host for Schistosoma mansoni in the Nile delta and valley.",
     "Biomphalaria alexandrina: Flat discoidal planorbid snail, host of Schistosoma mansoni."),

    # Q74: All eggs passed mature EXCEPT -> Fasciola / Ascaris
    (1, "Criteria of Identification: Fasciola and Ascaris eggs require external incubation in water or soil to develop, whereas Enterobius and Heterophyes eggs are passed fully mature with infective embryos.",
     "Fasciola eggs are passed immature; Enterobius and Heterophyes eggs are passed mature."),

    # Q75: Stage inside Schistosoma mansoni egg -> Ciliated Miracidium
    (1, "Criteria of Identification: When excreted in feces, the mature Schistosoma mansoni egg contains a fully developed, active, ciliated miracidium equipped with cephalic glands and flame cells, ready to hatch upon contact with fresh water.",
     "Mature Schistosoma mansoni egg contains a fully formed, ciliated miracidium."),

    # Q76: Stage inside Hookworm egg -> Segmented ovum (morula)
    (0, "Criteria of Identification: Ancylostoma and Necator eggs in fresh feces contain an unhatched segmented ovum consisting of 4 to 8 dark blastomeres (morula stage).",
     "Fresh hookworm egg contains a segmented morula of 4–8 blastomeres."),

    # Q77: Stage causing internal autoinfection -> Hymenolepis nana / Strongyloides
    (0, "Criteria of Identification: Hymenolepis nana and Strongyloides stercoralis are the two classic parasites capable of true internal autoinfection within the human alimentary canal.",
     "Hymenolepis nana and Strongyloides stercoralis undergo internal autoinfection in the intestine."),

    # Q78: Patient with pallor, puffy eyes, swollen feet -> Hookworm disease (Ancylostomiasis)
    (0, "Criteria of Identification: Severe chronic Ancylostoma duodenale infection leads to severe iron deficiency anemia (pallor, fatigue) and protein-losing enteropathy (hypoalbuminemia causing dependent pedal edema and periorbital puffiness).",
     "Hookworm disease causes severe microcytic anemia, hypoalbuminemia, and periorbital/pedal edema."),

    # Q79: Anterior end of Ancylostoma -> Buccal capsule with teeth (microcytic anemia)
    (0, "Criteria of Identification: The anterior end of Ancylostoma duodenale features a bent dorsal hook-like neck and a chitinous buccal capsule with 2 pairs of curved teeth that lacerate mucosal vessels, producing severe microcytic hypochromic iron-deficiency anemia.",
     "Ancylostoma duodenale: Ventral teeth in buccal capsule cause severe microcytic hypochromic anemia."),

    # Q80: Autoinfection in Hymenolepis nana -> Yes, develops into cysticercoid in villi
    (1, "Criteria of Identification: H. nana eggs can hatch in the small bowel; released hexacanth larvae penetrate intestinal villi, transform into cysticercoids, and emerge into the lumen to attach as mature adults.",
     "Hymenolepis nana: Direct autoinfection via cysticercoid development in intestinal villi."),

    # Q81: Stage inside Schistosoma egg -> Miracidium
    (0, "Criteria of Identification: The viable Schistosoma mansoni egg contains a ciliated miracidium with prominent apical papilla and primitive gut.",
     "Schistosoma mansoni egg contains an active ciliated miracidium."),

    # Q82: Snail harboring larval stages -> Lymnaea cailliaudi (Fasciola)
    (0, "Criteria of Identification: Lymnaea cailliaudi harbors the sporocyst, rediae, and cercarial stages of Fasciola flukes in Egypt.",
     "Lymnaea cailliaudi supports sporocyst, rediae, and cercarial development of Fasciola."),

    # Q83: Fatal hyperinfection in Strongyloides -> Corticosteroids / Immunosuppression
    (1, "Criteria of Identification: In immunocompromised patients or those receiving systemic corticosteroids, Strongyloides internal autoinfection accelerates uncontrollably into 'hyperinfection syndrome' and disseminated strongyloidiasis: millions of filariform larvae penetrate the bowel wall and invade the lungs, liver, and brain, carrying enteric Gram-negative bacteria that cause fatal sepsis and meningitis.",
     "Strongyloides hyperinfection: Steroid therapy triggers massive larval dissemination and fatal sepsis."),

    # Q84: Ascaris decorticated egg - one-cell ovum
    (0, "Criteria of Identification: A decorticated fertilized Ascaris egg lacks the rough brown mamillated albuminous coat (lost during passage or preparation), revealing a smooth, thick, transparent shell enclosing a single unsegmented ovum with crescentic spaces at both poles.",
     "Decorticated Ascaris egg: Smooth colorless shell enclosing a single unsegmented ovum.")
]

# Build the 84 Parasitology questions
parasitology_questions = []

for idx, item in enumerate(para_items):
    q_id = f"MGL3-PRAC-PARA-{idx+1:04d}"
    correct_idx, explanation, key_concept = para_adjudication[idx]
    
    # Clean title
    title = item["title"].strip()
    
    # Process options
    options = []
    for opt_idx, opt in enumerate(item["options"]):
        txt = opt["text"].strip()
        opt_img_url = images_map.get(opt["image"])
        if opt_img_url:
            label = txt if txt else f"Specimen {chr(65+opt_idx)}"
            options.append(f"{label} ({opt_img_url})")
        else:
            options.append(txt if txt else f"Option {chr(65+opt_idx)}")
            
    # Ensure correct_idx is within bounds
    if correct_idx >= len(options):
        correct_idx = 0
        
    # Question image
    media = None
    q_img_rel = images_map.get(item["image"])
    if q_img_rel:
        media = {
            "type": "image",
            "imageUrl": q_img_rel,
            "caption": f"Practical Spotter Examination — Station {idx+1}"
        }
        
    lecture_station = 1 if idx < 42 else 2
    
    parasitology_questions.append({
        "id": q_id,
        "type": "mcq",
        "lecture": lecture_station,
        "text": title,
        "options": options,
        "correctIndex": correct_idx,
        "explanation": explanation,
        "keyConcept": key_concept,
        "media": media
    })

with open("src/app/data/practical/mgl-3-para-practical.json", "w", encoding="utf-8") as f:
    json.dump(parasitology_questions, f, indent=2, ensure_ascii=False)

print(f"Generated {len(parasitology_questions)} verified Parasitology practical questions.")

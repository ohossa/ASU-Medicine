# scripts/data_parasitology.py
"""
Official 41 Parasitology Practical Revision Questions for Year 3 GIT (MGL-3).
All questions are authentic spotter exam questions with NO giveaways in question stems.
All images have all species names, stage names, and labels completely blanked out.
"""

PARASITOLOGY_QUESTIONS = [
    {
        "seq": 1,
        "lecture": 1,
        "text": "Examine this whole-mount microscopic slide of an adult trematode. Identify this parasite:",
        "correct_answer": "Fasciola hepatica (Adult)",
        "distractors": [
            "Fasciolopsis buski (Adult)",
            "Heterophyes heterophyes (Adult)",
            "Schistosoma mansoni (Adult)"
        ],
        "explanation": "Criteria of Identification: Large flat leaf-like body (20–30 mm) with distinct anterior cone and wide shoulders; intestinal ceca with extensive lateral and medial branching; dendritic tandem testes; habitat in hepatic bile ducts.",
        "keyConcept": "Fasciola hepatica adult: cephalic cone, distinct shoulders, highly branched ceca and dendritic testes.",
        "imageUrl": "/images/practical/mgl-3/parasitology/fasciola_flukes_adults.webp"
    },
    {
        "seq": 2,
        "lecture": 1,
        "text": "Examine this adult nematode specimen. Identify this parasite:",
        "correct_answer": "Trichuris trichiura (Whipworm adult)",
        "distractors": [
            "Enterobius vermicularis (Adult)",
            "Ancylostoma duodenale (Adult)",
            "Strongyloides stercoralis (Adult)"
        ],
        "explanation": "Criteria of Identification: Whip-like shape with thin capillary anterior 3/5 (containing stichosome esophagus) and stout posterior 2/5 housing reproductive organs; male posterior is coiled 360 degrees with a single spicule; habitat in cecum.",
        "keyConcept": "Trichuris trichiura adult: whip-like body with attenuated anterior 3/5 (stichosome) and stout posterior 2/5.",
        "imageUrl": "/images/practical/mgl-3/parasitology/trichuris_male_female.webp"
    },
    {
        "seq": 3,
        "lecture": 1,
        "text": "Examine this dioecious blood fluke slide. Identify these adult parasites:",
        "correct_answer": "Schistosoma mansoni (Adults in copula)",
        "distractors": [
            "Fasciola gigantica (Adult)",
            "Heterophyes heterophyes (Adult)",
            "Taenia saginata (Adult fluke)"
        ],
        "explanation": "Criteria of Identification: Dioecious trematodes; male is stout (6–12 mm) with dorsal tuberculations and ventral gynaecophoric canal; female is slender, cylindrical (7–17 mm) carried within the canal; habitat in mesenteric venules.",
        "keyConcept": "Schistosoma mansoni adults: tuberculated male with ventral gynaecophoric canal enclosing slender female.",
        "imageUrl": "/images/practical/mgl-3/parasitology/schistosoma_male_female_adult.webp"
    },
    {
        "seq": 4,
        "lecture": 1,
        "text": "Examine this adult female roundworm specimen. Identify this species:",
        "correct_answer": "Enterobius vermicularis (Pinworm female)",
        "distractors": [
            "Ascaris lumbricoides (Female)",
            "Trichuris trichiura (Female)",
            "Necator americanus (Female)"
        ],
        "explanation": "Criteria of Identification: Small white spindle-shaped worm (8–13 mm); lateral cuticular cephalic alae; characteristic muscular double-bulb esophagus; long, straight, pointed pin-like tail forming 1/3 of body length; habitat in cecum/perianal.",
        "keyConcept": "Enterobius vermicularis female: cephalic alae, double-bulb esophagus, and sharp pointed pin-like tail.",
        "imageUrl": "/images/practical/mgl-3/parasitology/enterobius_female_adult.webp"
    },
    {
        "seq": 5,
        "lecture": 2,
        "text": "Examine this minute adult tapeworm (3-6 mm). Identify this species:",
        "correct_answer": "Echinococcus granulosus (Adult)",
        "distractors": [
            "Hymenolepis nana (Adult)",
            "Taenia solium (Adult)",
            "Diphyllobothrium latum (Adult)"
        ],
        "explanation": "Criteria of Identification: Minute cyclophyllidean cestode (3–6 mm); scolex with 4 suckers and rostellum with double row of hooks; strobila contains only 3–4 proglottids, terminal gravid proglottid exceeds half the worm length; habitat in canine small bowel.",
        "keyConcept": "Echinococcus granulosus adult: tiny 3–4 segmented tapeworm with armed scolex and massive gravid proglottid.",
        "imageUrl": "/images/practical/mgl-3/parasitology/tapeworms_h_nana_echinococcus.webp"
    },
    {
        "seq": 6,
        "lecture": 2,
        "text": "Examine this minute pear-shaped intestinal fluke (1-1.7 mm). Identify this parasite:",
        "correct_answer": "Heterophyes heterophyes (Adult)",
        "distractors": [
            "Metagonimus yokogawai (Adult)",
            "Fasciolopsis buski (Adult)",
            "Clonorchis sinensis (Adult)"
        ],
        "explanation": "Criteria of Identification: Minute pyriform body (1.0–1.7 mm); scaly spine-bearing cuticle; three suckers: oral, ventral, and a sublateral genital sucker (gonotyl) bearing 70–80 chitinous teeth; two oval testes at posterior end; habitat in small intestine.",
        "keyConcept": "Heterophyes heterophyes adult: minute pear-shaped fluke with three suckers including a rodlet-armed gonotyl.",
        "imageUrl": "/images/practical/mgl-3/parasitology/heterophyes_metagonimus_adults.webp"
    },
    {
        "seq": 7,
        "lecture": 2,
        "text": "In this high-power micrograph of a hookworm buccal capsule, identify the genus shown:",
        "correct_answer": "Ancylostoma duodenale",
        "distractors": [
            "Necator americanus",
            "Strongyloides stercoralis",
            "Trichuris trichiura"
        ],
        "explanation": "Criteria of Identification: Heavily chitinized oval buccal capsule bearing two pairs of curved ventral teeth on upper border (vs. semilunar cutting plates in Necator); male copulatory bursa supported by tripartite dorsal ray; habitat in duodenum/jejunum.",
        "keyConcept": "Ancylostoma duodenale buccal capsule: two pairs of sharp, curved ventral teeth on the anterior margin.",
        "imageUrl": "/images/practical/mgl-3/parasitology/hookworm_teeth_bursa.webp"
    },
    {
        "seq": 8,
        "lecture": 2,
        "text": "Examine this microscopic parasitic female nematode. Identify this species:",
        "correct_answer": "Strongyloides stercoralis (Parasitic female)",
        "distractors": [
            "Enterobius vermicularis (Female)",
            "Trichinella spiralis (Female)",
            "Ancylostoma duodenale (Female)"
        ],
        "explanation": "Criteria of Identification: Slender transparent nematode (2.2 mm); long cylindrical esophagus without bulb extending 1/3 of body length; divergent (amphidelphic) uterus containing a single row of 5–8 thin-shelled eggs; habitat in duodenal mucosa.",
        "keyConcept": "Strongyloides stercoralis female: microscopic parthenogenetic nematode with long filariform esophagus.",
        "imageUrl": "/images/practical/mgl-3/parasitology/strongyloides_female_adult.webp"
    },
    {
        "seq": 9,
        "lecture": 3,
        "text": "Examine this cestode scolex under the microscope. Identify this species:",
        "correct_answer": "Taenia solium (Armed scolex)",
        "distractors": [
            "Taenia saginata (Unarmed scolex)",
            "Diphyllobothrium latum (Bothria)",
            "Hymenolepis diminuta (Scolex)"
        ],
        "explanation": "Criteria of Identification: Globular quadrate scolex (1 mm) with 4 hemispherical suckers and a rounded rostellum armed with a double crown of 22–32 hooks (armed scolex; vs. unarmed T. saginata lacking rostellum/hooks).",
        "keyConcept": "Taenia solium scolex: quadrate armed scolex with 4 suckers and a double row of rostellar hooklets.",
        "imageUrl": "/images/practical/mgl-3/parasitology/cestode_scolices_comparison.webp"
    },
    {
        "seq": 10,
        "lecture": 3,
        "text": "Examine this tapeworm mature proglottid. Identify this species:",
        "correct_answer": "Diphyllobothrium latum (Mature segment)",
        "distractors": [
            "Taenia saginata (Mature segment)",
            "Taenia solium (Mature segment)",
            "Dipylidium caninum (Segment)"
        ],
        "explanation": "Criteria of Identification: Transversely elongated proglottid (broader than long); centrally located dark rosette-like coiled uterus; central uterine pore (tocostome) discharging unembryonated operculated eggs; lateral follicular vitellaria.",
        "keyConcept": "Diphyllobothrium latum mature segment: broader than long with a diagnostic central rosette-shaped uterus.",
        "imageUrl": "/images/practical/mgl-3/parasitology/mature_segments_comparison.webp"
    },
    {
        "seq": 11,
        "lecture": 3,
        "text": "Examine this stained gravid tapeworm proglottid. Identify this species:",
        "correct_answer": "Taenia saginata (Gravid proglottid)",
        "distractors": [
            "Taenia solium (Gravid proglottid)",
            "Diphyllobothrium latum (Gravid)",
            "Hymenolepis nana (Gravid)"
        ],
        "explanation": "Criteria of Identification: Elongated rectangular proglottid (longer than broad); central uterine trunk with 15–30 main lateral branches on each side branching dichotomously (tree-like); actively motile, crawls out singly through anus.",
        "keyConcept": "Taenia saginata gravid segment: 15–30 lateral main uterine branches per side branching dichotomously.",
        "imageUrl": "/images/practical/mgl-3/parasitology/gravid_segments_taenia.webp"
    },
    {
        "seq": 12,
        "lecture": 3,
        "text": "Examine this larval trematode stage. Identify this cercaria:",
        "correct_answer": "Furcocercus cercaria of Schistosoma",
        "distractors": [
            "Leptocercus cercaria of Fasciola",
            "Microcercous cercaria of Paragonimus",
            "Lophocercous cercaria of Clonorchis"
        ],
        "explanation": "Criteria of Identification: Forked-tailed (furcocercus) cercaria; body has oral sucker, ventral acetabulum, and cephalic penetration glands; tail stem divides into two distal furcae; infective stage to humans via transcutaneous penetration.",
        "keyConcept": "Furcocercus cercaria: forked-tailed cercaria of Schistosoma penetrating unbroken human skin in freshwater.",
        "imageUrl": "/images/practical/mgl-3/parasitology/cercariae_leptocercus_furcocercus.webp"
    },
    {
        "seq": 13,
        "lecture": 4,
        "text": "Examine this larval cestode bladder worm. Identify this stage:",
        "correct_answer": "Cysticercus bovis",
        "distractors": [
            "Cysticercus cellulosae",
            "Hydatid cyst of Echinococcus",
            "Cenurus cerebralis larva"
        ],
        "explanation": "Criteria of Identification: Oval translucent bladder (7–10 mm) containing fluid and an invaginated scolex with 4 suckers and NO rostellum or hooks (unarmed); larval stage of Taenia saginata in cattle striated muscle.",
        "keyConcept": "Cysticercus bovis: unarmed larval cyst of Taenia saginata encysted in beef skeletal muscle.",
        "imageUrl": "/images/practical/mgl-3/parasitology/cysticercus_bovis_cellulosae.webp"
    },
    {
        "seq": 14,
        "lecture": 4,
        "text": "In this histological section of a cyst wall, identify the middle laminated layer indicated:",
        "correct_answer": "Laminated ectocyst layer",
        "distractors": [
            "Inner germinal endocyst layer",
            "Outer host fibrous pericyst",
            "Brood capsule cellular wall"
        ],
        "explanation": "Criteria of Identification: Acellular, chitinous, refractile layer with parallel concentric striations (laminated membrane / ectocyst); secreted by the inner cellular germinal layer (endocyst); non-nucleated elastic supportive barrier.",
        "keyConcept": "Hydatid ectocyst: thick, acellular, concentrically laminated cuticular membrane of Echinococcus granulosus.",
        "imageUrl": "/images/practical/mgl-3/parasitology/hydatid_cyst_wall_sand.webp"
    },
    {
        "seq": 15,
        "lecture": 4,
        "text": "Examine this diagnostic larva passed in freshly voided stool. Identify this larva:",
        "correct_answer": "Strongyloides stercoralis rhabditiform larva",
        "distractors": [
            "Hookworm rhabditiform larva",
            "Enterobius vermicularis larva",
            "Trichostrongylus first larva"
        ],
        "explanation": "Criteria of Identification: Length 200–250 um; short buccal cavity (shorter than head width); double-bulb rhabditiform esophagus; large conspicuous oval genital primordium at midbody (vs. hookworm larva which has long cavity, tiny primordium).",
        "keyConcept": "Strongyloides rhabditiform larva: short buccal cavity with a large, prominent genital primordium in stool.",
        "imageUrl": "/images/practical/mgl-3/parasitology/strongyloides_rhabditiform_larva.webp"
    },
    {
        "seq": 16,
        "lecture": 4,
        "text": "In this appendiceal cross-section, identify these parasitic nematodes in the lumen:",
        "correct_answer": "Enterobius vermicularis in appendix",
        "distractors": [
            "Ascaris lumbricoides in bowel",
            "Trichuris trichiura in cecum",
            "Ancylostoma duodenale in gut"
        ],
        "explanation": "Criteria of Identification: Nematode cross-sections showing bilateral triangular cuticular alae projecting from lateral fields; meromyarian somatic muscle cells; gravid females packed with characteristic asymmetrical D-shaped eggs.",
        "keyConcept": "Enterobius in appendix: distinct bilateral triangular lateral cuticular alae projecting into appendiceal lumen.",
        "imageUrl": "/images/practical/mgl-3/parasitology/worms_in_appendix_section.webp"
    },
    {
        "seq": 17,
        "lecture": 5,
        "text": "In this colonic biopsy, identify these giant ciliated trophozoites:",
        "correct_answer": "Balantidium coli trophozoite",
        "distractors": [
            "Entamoeba histolytica trophozoite",
            "Giardia lamblia trophozoite",
            "Cryptosporidium parvum schizont"
        ],
        "explanation": "Criteria of Identification: Giant ciliate (50–100 um); surface pellicle lined by longitudinal rows of uniform cilia; anterior cytostome (cell mouth); large dense bean-shaped macronucleus with adjacent micronucleus; invasive in colon.",
        "keyConcept": "Balantidium coli trophozoite: giant ciliated intestinal protozoan with a pathognomonic kidney-shaped macronucleus.",
        "imageUrl": "/images/practical/mgl-3/parasitology/balantidium_trophozoites_intestine.webp"
    },
    {
        "seq": 18,
        "lecture": 5,
        "text": "In this fecal smear, identify this binucleated flagellated trophozoite:",
        "correct_answer": "Giardia lamblia (Trophozoite)",
        "distractors": [
            "Trichomonas hominis (Trophozoite)",
            "Entamoeba histolytica (Trophozoite)",
            "Chilomastix mesnili (Trophozoite)"
        ],
        "explanation": "Criteria of Identification: Pyriform body (10–20 um) with bilateral symmetry; concave ventral sucking disk; two identical spherical nuclei with central karyosomes (face-like appearance); central axostyle; 8 flagella; falling-leaf motility.",
        "keyConcept": "Giardia lamblia trophozoite: bilaterally symmetrical pear-shaped flagellate with two nuclei and ventral sucking disk.",
        "imageUrl": "/images/practical/mgl-3/parasitology/giardia_trophozoite_smear.webp"
    },
    {
        "seq": 19,
        "lecture": 5,
        "text": "In this fresh stool dysenteric smear, identify the pathognomonic diagnostic feature:",
        "correct_answer": "Phagocytosed red blood cells in cytoplasm",
        "distractors": [
            "Multiple pulsatile contractile vacuoles",
            "Prominent ventral adhesive sucking disk",
            "Dense surface rows of longitudinal cilia"
        ],
        "explanation": "Criteria of Identification: Size 20–40 um; active directional monopodial pseudopodia; spherical nucleus with delicate peripheral chromatin and pinpoint central karyosome; pathognomonic presence of ingested red blood cells (erythrophagocytosis).",
        "keyConcept": "Entamoeba histolytica trophozoite: pathognomonic erythrophagocytosis (ingested RBCs) confirming invasive amebiasis.",
        "imageUrl": "/images/practical/mgl-3/parasitology/entamoeba_trophozoites_smear.webp"
    },
    {
        "seq": 20,
        "lecture": 5,
        "text": "In this Balantidium coli preparation, identify the prominent nuclear mass:",
        "correct_answer": "Reniform (Bean-shaped) macronucleus",
        "distractors": [
            "Pinpoint central karyosome",
            "Kinetoplast mitochondrial disk",
            "Cigar-shaped chromatoid bar"
        ],
        "explanation": "Criteria of Identification: Balantidium coli possesses dimorphic nuclei: a massive somatic polyploid kidney/bean-shaped macronucleus governing vegetative metabolism, and a tiny diploid micronucleus tucked in its concavity.",
        "keyConcept": "Balantidium macronucleus: large kidney/bean-shaped nuclear mass governing cellular vegetative metabolism.",
        "imageUrl": "/images/practical/mgl-3/parasitology/balantidium_trophozoite_highmag.webp"
    },
    {
        "seq": 21,
        "lecture": 5,
        "text": "In this iodine-stained fecal mount, identify this quadranucleate cyst:",
        "correct_answer": "Giardia lamblia cyst",
        "distractors": [
            "Entamoeba histolytica cyst",
            "Entamoeba coli cyst",
            "Balantidium coli cyst"
        ],
        "explanation": "Criteria of Identification: Oval shape (8–12 um) with distinct double-contoured wall; 4 spherical nuclei typically grouped at one pole; central longitudinal axostyle fibrils; curved claw-hammer shaped median bodies in cytoplasm.",
        "keyConcept": "Giardia lamblia cyst: oval quadranucleate cyst with longitudinal axostyle and distinct double wall.",
        "imageUrl": "/images/practical/mgl-3/parasitology/giardia_cysts_smear.webp"
    },
    {
        "seq": 22,
        "lecture": 6,
        "text": "In this fecal cyst comparison, identify the diagnostic features of Entamoeba histolytica:",
        "correct_answer": "Four nuclei with central karyosomes and smooth cigar-shaped chromatoid bars",
        "distractors": [
            "Eight nuclei with eccentric karyosomes and splintered chromatoid bars",
            "Single massive kidney-shaped nucleus with contractile vacuoles",
            "Two nuclei with axostyle fibrils and polar claw-hammer bodies"
        ],
        "explanation": "Criteria of Identification: E. histolytica mature cyst has 4 nuclei, central pinpoint karyosome, fine even peripheral chromatin, and thick chromatoid bars with rounded, blunt ends (vs. E. coli: 8 nuclei, eccentric karyosome, splintered bars).",
        "keyConcept": "Entamoeba histolytica cyst: 4 nuclei with central pinpoint karyosomes and rounded cigar-shaped chromatoid bars.",
        "imageUrl": "/images/practical/mgl-3/parasitology/entamoeba_cysts_comparison.webp"
    },
    {
        "seq": 23,
        "lecture": 6,
        "text": "Examine this large spherical double-walled cyst. Identify this species:",
        "correct_answer": "Balantidium coli cyst",
        "distractors": [
            "Entamoeba coli cyst",
            "Giardia lamblia cyst",
            "Isospora belli oocyst"
        ],
        "explanation": "Criteria of Identification: Large round to oval cyst (50–70 um); thick yellowish-green double wall; cytoplasm contains the persistent large kidney-shaped macronucleus, retracted cilia, and a contractile vacuole.",
        "keyConcept": "Balantidium coli cyst: large 50–70 um spherical double-walled cyst with persistent bean-shaped macronucleus.",
        "imageUrl": "/images/practical/mgl-3/parasitology/balantidium_cyst_smear.webp"
    },
    {
        "seq": 24,
        "lecture": 6,
        "text": "In this modified acid-fast fecal smear, identify these bright-red oocysts:",
        "correct_answer": "Cryptosporidium parvum oocysts",
        "distractors": [
            "Blastocystis hominis cysts",
            "Cyclospora cayetanensis oocysts",
            "Cystoisospora belli oocysts"
        ],
        "explanation": "Criteria of Identification: Small spherical oocysts (4–5 um); acid-fast positive (stain bright magenta-red against blue background); contain 4 slender naked sporozoites and a residual body; fully sporulated and infective when passed.",
        "keyConcept": "Cryptosporidium parvum oocysts: 4–5 um acid-fast bright red spherical oocysts containing 4 sporozoites.",
        "imageUrl": "/images/practical/mgl-3/parasitology/cryptosporidium_oocysts_acidfast.webp"
    },
    {
        "seq": 25,
        "lecture": 6,
        "text": "Identify this freshwater molluscan shell vector:",
        "correct_answer": "Biomphalaria alexandrina snail",
        "distractors": [
            "Bulinus truncatus snail",
            "Lymnaea cailliaudi snail",
            "Pirenella conica snail"
        ],
        "explanation": "Criteria of Identification: Planorbid snail; shell coiled in a single horizontal plane (discoidal/flat-coiled); sinistral aperture; obligate intermediate host transmitting Schistosoma mansoni miracidia to furcocercous cercariae.",
        "keyConcept": "Biomphalaria alexandrina: flat planorbid discoidal snail vector transmitting intestinal Schistosoma mansoni.",
        "imageUrl": "/images/practical/mgl-3/parasitology/snail_vectors_comparison.webp"
    },
    {
        "seq": 26,
        "lecture": 7,
        "text": "In this comparison of operculated eggs, identify the giant egg shown:",
        "correct_answer": "Fasciola hepatica egg",
        "distractors": [
            "Diphyllobothrium latum egg",
            "Heterophyes heterophyes egg",
            "Paragonimus westermani egg"
        ],
        "explanation": "Criteria of Identification: Giant yellowish-brown operculated egg (130–150 um, largest in human stool); indistinct operculum at one pole; filled with unsegmented ovum and numerous yolk vitelline cells; unembryonated when laid.",
        "keyConcept": "Fasciola hepatica egg: giant yellowish-brown operculated unsegmented egg (130–150 um).",
        "imageUrl": "/images/practical/mgl-3/parasitology/operculated_eggs_comparison.webp"
    },
    {
        "seq": 27,
        "lecture": 7,
        "text": "Examine this diagnostic egg in stool microscopy. Identify this species:",
        "correct_answer": "Schistosoma mansoni egg",
        "distractors": [
            "Schistosoma haematobium egg",
            "Schistosoma japonicum egg",
            "Fasciola gigantica egg"
        ],
        "explanation": "Criteria of Identification: Large oval egg (115–175 um); transparent golden shell; pathognomonic large sharp lateral spine pointing posteriorly; contains a fully formed ciliated miracidium; passed in feces.",
        "keyConcept": "Schistosoma mansoni egg: large elongated oval egg with a pathognomonic prominent lateral spine.",
        "imageUrl": "/images/practical/mgl-3/parasitology/schistosoma_mansoni_egg_spine.webp"
    },
    {
        "seq": 28,
        "lecture": 7,
        "text": "Examine this thin-shelled segmenting morula egg. Identify this species:",
        "correct_answer": "Hookworm egg (Ancylostoma / Necator)",
        "distractors": [
            "Ascaris lumbricoides egg",
            "Trichostrongylus egg",
            "Strongyloides stercoralis egg"
        ],
        "explanation": "Criteria of Identification: Elliptical shape (60 um); blunt rounded ends; extremely thin transparent shell appearing as a delicate black line; clear space between shell and 4–8 segmenting blastomeres (morula stage).",
        "keyConcept": "Hookworm egg: extremely thin, transparent shell enclosing an internal 4–8 cell segmenting morula.",
        "imageUrl": "/images/practical/mgl-3/parasitology/hookworm_egg_morula.webp"
    },
    {
        "seq": 29,
        "lecture": 7,
        "text": "In this comparison of spherical eggs, identify the radially striated egg:",
        "correct_answer": "Taenia species egg",
        "distractors": [
            "Hymenolepis nana egg",
            "Ascaris lumbricoides egg",
            "Toxocara canis egg"
        ],
        "explanation": "Criteria of Identification: Spherical shape (30–40 um); thick brown shell with diagnostic radial striations (embryophore); contains fully developed hexacanth embryo (oncosphere with 6 refractile hooklets); indistinguishable between T. solium and T. saginata.",
        "keyConcept": "Taenia egg: thick brown shell with prominent radial striations enclosing a 6-hooked hexacanth embryo.",
        "imageUrl": "/images/practical/mgl-3/parasitology/rounded_eggs_comparison.webp"
    },
    {
        "seq": 30,
        "lecture": 7,
        "text": "Examine this barrel-shaped egg with bipolar plugs. Identify this species:",
        "correct_answer": "Trichuris trichiura egg",
        "distractors": [
            "Enterobius vermicularis egg",
            "Capillaria hepatica egg",
            "Ascaris unfertilized egg"
        ],
        "explanation": "Criteria of Identification: Barrel/lemon-shaped (50–54 um); golden-brown triple-layered shell; diagnostic clear transparent bipolar mucoid plugs protruding at both ends; contains unsegmented single-celled ovum.",
        "keyConcept": "Trichuris trichiura egg: barrel-shaped golden egg with pathognomonic transparent bipolar mucoid plugs.",
        "imageUrl": "/images/practical/mgl-3/parasitology/plugged_dshaped_eggs.webp"
    },
    {
        "seq": 31,
        "lecture": 8,
        "text": "Spotter examination: Identify this armed cestode scolex:",
        "correct_answer": "Taenia solium (Pork tapeworm scolex)",
        "distractors": [
            "Taenia saginata (Beef tapeworm scolex)",
            "Diphyllobothrium latum (Fish scolex)",
            "Hymenolepis diminuta (Rat tapeworm scolex)"
        ],
        "explanation": "Criteria of Identification: Armed scolex (1 mm) with 4 cup suckers and rostellum with 2 rows of hooks; distinguishing landmark from unarmed Taenia saginata which lacks rostellar hooks; ingestion of eggs causes human cysticercosis.",
        "keyConcept": "Taenia solium scolex: 4 muscular suckers with a double crown of alternating chitinous rostellar hooks.",
        "imageUrl": "/images/practical/mgl-3/parasitology/taenia_solium_scolex_spotter.webp"
    },
    {
        "seq": 32,
        "lecture": 8,
        "text": "Clinical Case Station 1: A 42-year-old sheep farmer presents with right upper quadrant fullness. Abdominal ultrasound reveals a well-defined calcified unilocular hepatic cyst. Why is diagnostic needle aspiration contraindicated?",
        "correct_answer": "Risk of fatal anaphylactic shock and secondary intraperitoneal seeding",
        "distractors": [
            "Impossibility of obtaining diagnostic hydatid fluid or hooklets",
            "Certainty of causing acute severe portal venous thrombosis",
            "Risk of triggering uncontrollable biliary fistulization"
        ],
        "explanation": "Criteria of Identification: Hydatid cyst of Echinococcus granulosus; puncture risks catastrophic spillage of highly antigenic hydatid fluid, provoking lethal IgE-mediated anaphylaxis and multiple secondary peritoneal hydatid implants.",
        "keyConcept": "Hydatid cyst aspiration: strictly contraindicated due to risk of lethal anaphylactic shock and secondary seeding.",
        "imageUrl": "/images/practical/mgl-3/parasitology/clinical_case_1_hydatid.webp"
    },
    {
        "seq": 33,
        "lecture": 8,
        "text": "Clinical Case Station 2: A renal transplant recipient on high-dose corticosteroids develops paralytic ileus, severe diarrhea, and gram-negative sepsis. Stool reveals active rhabditiform larvae. What is the underlying mechanism?",
        "correct_answer": "Internal autoinfection leading to hyperinfection syndrome",
        "distractors": [
            "Massive exogenous reinfection through contaminated soil",
            "Malignant transformation of dormant encysted larvae",
            "Superinfection by swallowed adult Enterobius pinworms"
        ],
        "explanation": "Criteria of Identification: Strongyloides stercoralis hyperinfection; immunosuppression accelerates internal autoinfection where non-infective rhabditiform larvae rapidly molt into invasive filariform larvae within the bowel lumen.",
        "keyConcept": "Strongyloides hyperinfection: internal autoinfection triggered by immunosuppression causing systemic larval dissemination.",
        "imageUrl": "/images/practical/mgl-3/parasitology/clinical_case_2_strongyloides.webp"
    },
    {
        "seq": 34,
        "lecture": 9,
        "text": "Clinical Case Station 3: A 30-year-old farmer from the Nile Delta presents with hematemesis, splenomegaly, and ascites. Liver ultrasound shows Symmers' pipestem periportal fibrosis. Rectal biopsy shows eggs with large lateral spines. What is the etiology?",
        "correct_answer": "Granulomatous response to Schistosoma mansoni soluble egg antigens",
        "distractors": [
            "Direct occlusion of the main portal vein trunk by adult flukes",
            "Toxic necrosis of hepatocytes caused by adult worm excreta",
            "Autoimmune destruction of interlobular intrahepatic bile ducts"
        ],
        "explanation": "Criteria of Identification: Schistosoma mansoni; eggs trapped in periportal venules release soluble egg antigens (SEA), stimulating CD4+ Th2 delayed-type hypersensitivity granulomas and periportal fibrosis without true cirrhosis.",
        "keyConcept": "Symmers' pipestem fibrosis: granulomatous response to trapped Schistosoma mansoni lateral-spined eggs in portal tracts.",
        "imageUrl": "/images/practical/mgl-3/parasitology/clinical_case_3_schistosoma.webp"
    },
    {
        "seq": 35,
        "lecture": 9,
        "text": "Clinical Case Station 4: A 6-year-old child presents with colicky abdominal pain, vomiting, and abdominal distension. Plain radiography demonstrates mechanical intestinal obstruction caused by a tangled mass of large roundworms. Identify the parasite:",
        "correct_answer": "Ascaris lumbricoides",
        "distractors": [
            "Enterobius vermicularis",
            "Ancylostoma duodenale",
            "Trichuris trichiura"
        ],
        "explanation": "Criteria of Identification: Ascaris lumbricoides; largest human intestinal nematode (adults 15–35 cm); large worm burden tangles into a bolus causing mechanical small bowel obstruction, volvulus, or intussusception in children.",
        "keyConcept": "Ascaris lumbricoides: giant intestinal roundworm capable of forming obstructive boluses in the ileocecal region.",
        "imageUrl": "/images/practical/mgl-3/parasitology/clinical_case_4_ascaris.webp"
    },
    {
        "seq": 36,
        "lecture": 9,
        "text": "Clinical Case Station 5: An AIDS patient with CD4 count of 45 cells/microliter suffers from relentless cholera-like watery diarrhea (10 L/day). Modified acid-fast staining of stool demonstrates 4-5 micrometer round pink oocysts. What is the cellular niche of this parasite?",
        "correct_answer": "Intracellular but extracytoplasmic at the enterocyte brush border",
        "distractors": [
            "Obligate intranuclear replication inside lamina propria macrophages",
            "Free extracellular swimming within the intestinal lumen fluid",
            "Deep cytoplasmic residency in crypt-base Paneth secretory cells"
        ],
        "explanation": "Criteria of Identification: Cryptosporidium parvum; resides within a parasitophorous vacuole at the apical enterocyte border: intracellular (enclosed by host membrane) but extracytoplasmic (outside host cytoplasm).",
        "keyConcept": "Cryptosporidium cellular niche: intracellular but extracytoplasmic localization in enterocyte brush borders.",
        "imageUrl": "/images/practical/mgl-3/parasitology/clinical_case_5_cryptosporidium.webp"
    },
    {
        "seq": 37,
        "lecture": 10,
        "text": "Clinical Case Station 6: A hiker develops foul-smelling, fatty, floating diarrhea (steatorrhea), flatulence, and epigastric cramping after drinking untreated stream water. Microscopic stool exam shows binucleate flagellated trophozoites. What causes the malabsorption?",
        "correct_answer": "Mechanical coating and brush border flattening by ventral suction disks",
        "distractors": [
            "Deep mucosal ulceration with transmural transmigration into blood",
            "Direct enterotoxin stimulation of cyclic AMP chloride secretion",
            "Massive granulomatous destruction of mesenteric lacteal channels"
        ],
        "explanation": "Criteria of Identification: Giardia lamblia trophozoites adhere via ventral sucking disks to duodenal/jejunal microvilli, causing villous blunting, brush border enzyme deficiency, and fat malabsorption without mucosal invasion.",
        "keyConcept": "Giardia malabsorption: mechanical mucosal adherence via suction disks causing diffuse brush-border impairment.",
        "imageUrl": "/images/practical/mgl-3/parasitology/clinical_case_6_giardia.webp"
    },
    {
        "seq": 38,
        "lecture": 10,
        "text": "Clinical Case Station 7: A 38-year-old patient who routinely ingests raw wild watercress salad develops prolonged fever, tender hepatomegaly, marked eosinophilia (50%), and high serum transaminases. What was the infective stage ingested?",
        "correct_answer": "Encysted metacercariae on aquatic vegetation",
        "distractors": [
            "Free-swimming furcocercous cercariae in water",
            "Unembryonated operculated eggs in soil",
            "Rhabditiform larvae crawling on vegetation"
        ],
        "explanation": "Criteria of Identification: Fasciola hepatica / gigantica; human infection occurs by ingesting freshwater plants (watercress) harboring encysted metacercariae; juvenile flukes excyst in duodenum and migrate through liver capsule.",
        "keyConcept": "Fasciola transmission: ingestion of encysted metacercariae on aquatic plants (watercress).",
        "imageUrl": "/images/practical/mgl-3/parasitology/clinical_case_7_fasciola.webp"
    },
    {
        "seq": 39,
        "lecture": 10,
        "text": "Clinical Case Station 8: A 4-year-old child presents with intense nocturnal perianal pruritus and insomnia. A cellophane adhesive tape swab taken in the early morning demonstrates asymmetrical plano-convex eggs. Why is routine stool analysis usually negative?",
        "correct_answer": "Gravid females migrate out of the anus to oviposit directly on perianal skin",
        "distractors": [
            "Eggs dissolve rapidly in alkaline intestinal fecal secretions",
            "Eggs are exclusively passed through the urinary bladder mucosa",
            "The parasites reproduce exclusively via tissue asexual budding"
        ],
        "explanation": "Criteria of Identification: Enterobius vermicularis; gravid females migrate out through the anal sphincter at night and oviposit in the perianal folds rather than in the stool stream; diagnosis is made via Scotch tape perianal swab.",
        "keyConcept": "Enterobius diagnosis: perianal tape swab is required because females oviposit on perianal skin, not in feces.",
        "imageUrl": "/images/practical/mgl-3/parasitology/clinical_case_8_enterobius.webp"
    },
    {
        "seq": 40,
        "lecture": 10,
        "text": "Clinical Case Station 9: A 45-year-old traveler develops high swinging fever, right upper quadrant pain, and leukocytosis. Imaging reveals a solitary 8 cm hypoechoic abscess in the right liver lobe. Aspiration yields sterile anchovy-sauce-like fluid. Identify the causative agent:",
        "correct_answer": "Entamoeba histolytica",
        "distractors": [
            "Echinococcus granulosus",
            "Ascaris lumbricoides",
            "Cryptosporidium parvum"
        ],
        "explanation": "Criteria of Identification: Amebic liver abscess (Entamoeba histolytica); trophozoites reach liver via portal vein from colonic ulcers, releasing pore-forming peptides (amebapores) and cysteine proteinases causing liquefactive anchovy-sauce necrosis.",
        "keyConcept": "Amebic liver abscess: Entamoeba histolytica trophozoites causing sterile liquefactive anchovy-paste liver necrosis.",
        "imageUrl": "/images/practical/mgl-3/parasitology/clinical_case_9_entamoeba.webp"
    },
    {
        "seq": 41,
        "lecture": 10,
        "text": "Clinical Case Station 10: A barefoot agricultural worker presents with severe pallor, exertional fatigue, and epigastric discomfort. Lab work reveals microcytic hypochromic iron-deficiency anemia (Hb 5.8 g/dL). Stool shows thin-shelled 4-8 cell segmenting eggs. What is the source of blood loss?",
        "correct_answer": "Laceration of duodenal mucosa and active blood ingestion by adult worms",
        "distractors": [
            "Chronic hemolysis caused by circulating parasite cytolytic toxins",
            "Autoimmune destruction of bone marrow erythroid progenitor cells",
            "Splenic sequestration of red blood cells secondary to portal block"
        ],
        "explanation": "Criteria of Identification: Hookworm disease (Ancylostoma duodenale / Necator americanus); adult worms attach to duodenal mucosa with teeth/cutting plates, releasing anticoagulants and sucking blood (0.15–0.26 mL blood/worm/day).",
        "keyConcept": "Hookworm anemia: mechanical duodenal mucosal laceration and active blood-sucking causing severe iron deficiency.",
        "imageUrl": "/images/practical/mgl-3/parasitology/clinical_case_12_hookworm.webp"
    }
]

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

# NET_NEW_PARASITOLOGY for stations 42 to 75

NET_NEW_PARASITOLOGY = [
    {
        "seq": 42,
        "lecture": 1,
        "text": "Examine this microscopic mount of blood flukes. Identify this adult worm pair demonstrating the female held within the gynecophoric canal of the male:",
        "correct_answer": "Schistosoma mansoni adult worm pair in copula",
        "distractors": [
            "Fasciola hepatica adult worms",
            "Ancylostoma duodenale copulating pair",
            "Enterobius vermicularis adult worms"
        ],
        "explanation": "Criteria of Identification: Schistosoma mansoni adults are dioecious trematodes; the stouter male (6–10 mm) has a ventral longitudinal groove (gynecophoric canal) with a tuberculated cuticle and 8–9 testes, embracing the longer, slender, cylindrical female (10–14 mm) within the canal.",
        "keyConcept": "S. mansoni adults: stouter tuberculated male with gynecophoric canal embracing slender cylindrical female.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0042.webp"
    },
    {
        "seq": 43,
        "lecture": 1,
        "text": "Examine this freshwater snail shell. Identify this discoidal, flattened snail acting as the intermediate host for Schistosoma mansoni:",
        "correct_answer": "Biomphalaria alexandrina",
        "distractors": [
            "Bulinus truncatus",
            "Lymnaea cailliaudi",
            "Cleopatra bulimoides"
        ],
        "explanation": "Criteria of Identification: Biomphalaria alexandrina is a planorbid freshwater snail recognized by its flat, discoidal shell coiled in a single plane (wheel-shaped) without an elevated spire, serving as the obligate intermediate host for Schistosoma mansoni in Egypt.",
        "keyConcept": "Biomphalaria alexandrina: discoidal, flat wheel-shaped shell without spire; intermediate host of S. mansoni.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0043.webp"
    },
    {
        "seq": 44,
        "lecture": 1,
        "text": "Examine this freshwater snail shell showing a globular shape with an elevated spire and left-sided (sinistral) aperture. Identify this intermediate host:",
        "correct_answer": "Bulinus truncatus",
        "distractors": [
            "Biomphalaria alexandrina",
            "Lymnaea cailliaudi",
            "Lanistes carinatus"
        ],
        "explanation": "Criteria of Identification: Bulinus truncatus has a globular or ovate shell with a blunt spire and a sinistral (left-sided) opening when viewed with the spire facing upwards, serving as the intermediate host for Schistosoma haematobium in Egypt.",
        "keyConcept": "Bulinus truncatus: globular shell with sinistral (left-sided) aperture; intermediate host of S. haematobium.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0044.webp"
    },
    {
        "seq": 45,
        "lecture": 1,
        "text": "Examine this freshwater snail shell showing an elongated cone with a tall pointed spire and a large right-sided (dextral) aperture. Identify this intermediate host:",
        "correct_answer": "Lymnaea cailliaudi (Lymnaea natalensis)",
        "distractors": [
            "Biomphalaria alexandrina",
            "Bulinus truncatus",
            "Cleopatra bulimoides"
        ],
        "explanation": "Criteria of Identification: Lymnaea cailliaudi possesses an elongated, thin, horn-shaped shell with a tall sharply pointed spire, few rapid-expanding whorls, and a large dextral (right-sided) opening, acting as the intermediate host for Fasciola gigantica in Egypt.",
        "keyConcept": "Lymnaea cailliaudi: tall pointed spire with large dextral aperture; intermediate host of Fasciola gigantica.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0045.webp"
    },
    {
        "seq": 46,
        "lecture": 1,
        "text": "Examine this small operculated freshwater snail shell with a solid conical spire. Identify this intermediate host for Heterophyes heterophyes:",
        "correct_answer": "Cleopatra bulimoides (Pirenella conica)",
        "distractors": [
            "Biomphalaria alexandrina",
            "Lymnaea cailliaudi",
            "Bulinus truncatus"
        ],
        "explanation": "Criteria of Identification: Cleopatra bulimoides (freshwater) and Pirenella conica (brackish water lakes Manzala and Idku) are small conical operculated snails with thick, turreted shells that act as the first intermediate host for Heterophyes heterophyes in Egypt.",
        "keyConcept": "Cleopatra bulimoides / Pirenella conica: small conical operculated snails; first intermediate host of H. heterophyes.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0046.webp"
    },
    {
        "seq": 47,
        "lecture": 1,
        "text": "Examine this macroscopic mounted liver fluke. Identify this large, leaf-shaped parasite featuring a distinct conical anterior projection (cephalic cone) and branched intestinal caeca:",
        "correct_answer": "Fasciola gigantica adult worm",
        "distractors": [
            "Heterophyes heterophyes adult worm",
            "Schistosoma mansoni adult worm",
            "Dicrocoelium dendriticum adult worm"
        ],
        "explanation": "Criteria of Identification: Fasciola gigantica is a massive leaf-shaped liver fluke (2.5–7.5 cm long) featuring an anterior conical projection (cephalic cone), less prominent shoulders than F. hepatica, highly branched intestinal caeca, and profusely dendritic testes filling the posterior body.",
        "keyConcept": "Fasciola gigantica: large leaf-shaped fluke with anterior cephalic cone and highly branched intestinal caeca.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0047.webp"
    },
    {
        "seq": 48,
        "lecture": 2,
        "text": "Examine this microscopic slide of a minute pyriform intestinal fluke (< 2 mm). Identify this organism possessing three suckers, including a specialized genital sucker (gonotyl):",
        "correct_answer": "Heterophyes heterophyes adult worm",
        "distractors": [
            "Fasciola hepatica adult worm",
            "Enterobius vermicularis adult worm",
            "Schistosoma haematobium adult worm"
        ],
        "explanation": "Criteria of Identification: Heterophyes heterophyes is a microscopic, tear-drop shaped fluke (1.0–1.7 mm) equipped with 3 suckers: oral sucker, ventral sucker (acetabulum), and a distinctive third genital sucker (gonotyl) armed with 70–80 chitinous rodlets located posterolateral to the ventral sucker.",
        "keyConcept": "Heterophyes heterophyes: minute pyriform fluke (< 2 mm) armed with three suckers including a genital gonotyl.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0048.webp"
    },
    {
        "seq": 49,
        "lecture": 2,
        "text": "Examine this microscopic stool preparation showing a tiny golden-yellow operculated ovum (30 x 15 µm) with distinct opercular shoulders and a small knob at the abopercular pole. Identify this egg:",
        "correct_answer": "Heterophyes heterophyes egg",
        "distractors": [
            "Fasciola gigantica egg",
            "Schistosoma mansoni egg",
            "Ascaris lumbricoides egg"
        ],
        "explanation": "Criteria of Identification: Heterophyes heterophyes eggs are minute (28–30 x 15–17 µm), oval, golden-yellow, thick-shelled eggs possessing a distinct convex operculum resting upon opercular shoulders, a small thickened knob at the posterior abopercular pole, and containing a fully formed ciliated miracidium.",
        "keyConcept": "Heterophyes egg: tiny golden-yellow operculated egg (30 x 15 µm) with shoulders and abopercular knob containing miracidium.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0049.webp"
    },
    {
        "seq": 50,
        "lecture": 2,
        "text": "Examine this microscopic stool mount showing an asymmetrical, dark brown, thick-shelled operculated egg containing a miracidium with two conspicuous round eyespots. Identify this parasite ovum:",
        "correct_answer": "Dicrocoelium dendriticum (lancet fluke) egg",
        "distractors": [
            "Fasciola hepatica egg",
            "Heterophyes heterophyes egg",
            "Clonorchis sinensis egg"
        ],
        "explanation": "Criteria of Identification: Dicrocoelium dendriticum produces small (38–45 x 22–30 µm), thick-shelled, dark brown asymmetrical (one side flattened) operculated eggs containing a fully developed miracidium characterized by two prominent pigmented circular eyespots.",
        "keyConcept": "Dicrocoelium egg: asymmetrical dark brown operculated egg containing a miracidium with two distinct eyespots.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0050.webp"
    },
    {
        "seq": 51,
        "lecture": 3,
        "text": "Examine this mounted tapeworm scolex. Identify this quadrate head possessing four large cup-shaped suckers, without a rostellum and devoid of hooklets (unarmed scolex):",
        "correct_answer": "Taenia saginata scolex (Beef tapeworm)",
        "distractors": [
            "Taenia solium scolex",
            "Hymenolepis nana scolex",
            "Dipylidium caninum scolex"
        ],
        "explanation": "Criteria of Identification: The adult scolex of Taenia saginata (beef tapeworm) is square/quadrangular in outline (1.5–2 mm across), possessing four large hemispherical suckers, but completely lacks a rostellum and hooks (unarmed scolex), distinguishing it from T. solium.",
        "keyConcept": "Taenia saginata scolex: quadrangular with 4 suckers; unarmed (no rostellum, no hooks).",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0051.webp"
    },
    {
        "seq": 52,
        "lecture": 3,
        "text": "Examine this mounted tapeworm scolex. Identify this globular head possessing four suckers and a prominent rostellum armed with a double crown of alternating hooklets:",
        "correct_answer": "Taenia solium scolex (Pork tapeworm)",
        "distractors": [
            "Taenia saginata scolex",
            "Diphyllobothrium latum scolex",
            "Echinococcus granulosus scolex"
        ],
        "explanation": "Criteria of Identification: Taenia solium (pork tapeworm) has a globular scolex (~1 mm) armed with four suckers and a prominent, rounded rostellum bearing a double circle of 22 to 32 alternating large and small chitinous sickle-shaped hooklets.",
        "keyConcept": "Taenia solium scolex: globular head armed with 4 suckers and a rostellum with double crown of hooklets.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0052.webp"
    },
    {
        "seq": 53,
        "lecture": 3,
        "text": "Examine this cleared gravid tapeworm proglottid. Identify this segment showing a central longitudinal uterine stem giving off 15 to 30 fine, dichotomous lateral branches on each side:",
        "correct_answer": "Taenia saginata gravid proglottid",
        "distractors": [
            "Taenia solium gravid proglottid",
            "Diphyllobothrium latum proglottid",
            "Dipylidium caninum proglottid"
        ],
        "explanation": "Criteria of Identification: Gravid proglottids of Taenia saginata are longer than wide (16–20 x 5–7 mm) and feature a central longitudinal uterine trunk bearing 15 to 30 main lateral branches on each side that divide dichotomously, filled with thousands of eggs.",
        "keyConcept": "Taenia saginata gravid segment: 15 to 30 fine lateral uterine branches on each side dividing dichotomously.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0053.webp"
    },
    {
        "seq": 54,
        "lecture": 3,
        "text": "Examine this cleared gravid tapeworm proglottid. Identify this segment showing a central uterine stem giving off 7 to 12 coarse, dendritic lateral branches on each side:",
        "correct_answer": "Taenia solium gravid proglottid",
        "distractors": [
            "Taenia saginata gravid proglottid",
            "Hymenolepis diminuta proglottid",
            "Echinococcus proglottid"
        ],
        "explanation": "Criteria of Identification: Gravid segments of Taenia solium are longer than wide (10–12 x 5–6 mm) and are distinguished definitively from T. saginata by having only 7 to 12 main lateral uterine branches on each side, which branch coarsely in a dendritic fashion.",
        "keyConcept": "Taenia solium gravid segment: 7 to 12 coarse, dendritic lateral uterine branches on each side.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0054.webp"
    },
    {
        "seq": 55,
        "lecture": 3,
        "text": "Examine this tapeworm proglottid displaying an elongated, barrel- or cucumber-seed shape with two genital pores situated symmetrically on opposite lateral margins. Identify this segment:",
        "correct_answer": "Dipylidium caninum gravid proglottid",
        "distractors": [
            "Taenia saginata proglottid",
            "Hymenolepis nana proglottid",
            "Diphyllobothrium latum proglottid"
        ],
        "explanation": "Criteria of Identification: Dipylidium caninum (dog tapeworm) gravid proglottids resemble cucumber seeds or grains of rice (12 x 3 mm) with two sets of reproductive organs and bilateral lateral genital pores (one on each lateral margin), filled with egg packets containing 8–15 oncospheres each.",
        "keyConcept": "Dipylidium caninum: barrel-shaped 'cucumber seed' proglottid with bilateral dual lateral genital pores.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0055.webp"
    },
    {
        "seq": 56,
        "lecture": 3,
        "text": "Examine this microscopic stool mount showing a large, circular, yellowish-brown egg (70–85 µm) containing a six-hooked oncosphere devoid of polar filaments. Identify this cestode ovum:",
        "correct_answer": "Hymenolepis diminuta egg",
        "distractors": [
            "Hymenolepis nana egg",
            "Taenia species egg",
            "Ascaris lumbricoides egg"
        ],
        "explanation": "Criteria of Identification: Hymenolepis diminuta eggs are large, nearly spherical (70–85 µm), with a thick yellowish outer shell and an inner membrane enclosing a hexacanth oncosphere; they are distinguished definitively from H. nana (which has polar filaments) by the complete absence of polar filaments.",
        "keyConcept": "Hymenolepis diminuta egg: large round egg (70–85 µm) with hexacanth embryo lacking polar filaments.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0056.webp"
    },
    {
        "seq": 57,
        "lecture": 3,
        "text": "Examine this histopathological section of a hepatic cyst wall showing an outer, thick, acellular, eosinophilic, laminated chitinous cuticular layer resting upon an inner cellular germinal epithelium. Identify this parasite lesion:",
        "correct_answer": "Hydatid cyst wall (Echinococcus granulosus)",
        "distractors": [
            "Amoebic abscess capsule",
            "Biliary cystadenoma wall",
            "Schistosomal fibrous pseudocapsule"
        ],
        "explanation": "Criteria of Identification: The hydatid cyst wall of Echinococcus granulosus consists of: 1) host fibrous adventitia (pericyst), 2) intermediate thick, acellular, non-nucleated, gelatinous laminated layer (cuticle) staining pale pink, and 3) thin, nucleated inner germinal layer producing brood capsules and scolices.",
        "keyConcept": "Hydatid cyst wall: acellular eosinophilic laminated cuticular layer lined by cellular inner germinal epithelium.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0057.webp"
    },
    {
        "seq": 58,
        "lecture": 3,
        "text": "Examine this wet mount of aspirated clear cyst fluid ('hydatid sand'). Identify these microscopic structures showing invaginated scolices bearing circular suckers and refractile chitinous hooklets:",
        "correct_answer": "Echinococcus granulosus protoscolices and hooklets",
        "distractors": [
            "Fasciola metacercariae",
            "Schistosoma miracidia",
            "Taenia cysticercus cellulosae"
        ],
        "explanation": "Criteria of Identification: Hydatid sand consists of loose components precipitated within the hydatid cyst cavity, containing free invaginated or evaginated protoscolices (each equipped with 4 suckers and a rostellum of hooks), detached brood capsules, and loose refractile sickle-shaped hooklets.",
        "keyConcept": "Hydatid sand: aspirated cyst sediment containing invaginated protoscolices with rostellar hooklets and suckers.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0058.webp"
    },
    {
        "seq": 59,
        "lecture": 4,
        "text": "Examine this microscopic stool mount showing a golden-brown, broadly oval ovum (60 x 45 µm) with a thick shell covered by an irregular, coarsely tuberculated (mammillated) albuminous coat, containing an unsegmented central ovum. Identify this egg:",
        "correct_answer": "Fertilized Ascaris lumbricoides egg",
        "distractors": [
            "Unfertilized Ascaris egg",
            "Decorticated Ascaris egg",
            "Trichuris trichiura egg"
        ],
        "explanation": "Criteria of Identification: Fertilized Ascaris lumbricoides eggs are round-to-oval (45–75 x 35–50 µm), bile-stained golden-brown, with a thick shell surrounded by a heavy, coarsely tuberculated (mammillated) external albuminous layer enclosing a single unsegmented ovum surrounded by crescentic clear spaces at each pole.",
        "keyConcept": "Fertilized Ascaris egg: round-oval, thick shell with coarse tuberculated mammillated coat enclosing unsegmented ovum.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0059.webp"
    },
    {
        "seq": 60,
        "lecture": 4,
        "text": "Examine this microscopic stool mount showing an elongated, narrower ovum (90 x 40 µm) with a thin shell and an irregular, disorganized, heavily mammillated coat completely filled with disorganized refractile yolk granules. Identify this egg:",
        "correct_answer": "Unfertilized Ascaris lumbricoides egg",
        "distractors": [
            "Fertilized Ascaris egg",
            "Decorticated Ascaris egg",
            "Hookworm egg"
        ],
        "explanation": "Criteria of Identification: Unfertilized Ascaris lumbricoides eggs are longer and narrower than fertilized eggs (85–95 x 38–45 µm), with a thinner shell, prominent irregular scalloped mammillated coat, and an internal cavity completely packed with amorphous, highly refractile lecithin/yolk granules without clear spaces.",
        "keyConcept": "Unfertilized Ascaris egg: elongated, thin shell with irregular mammillations packed with disorganized refractile granules.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0060.webp"
    },
    {
        "seq": 61,
        "lecture": 4,
        "text": "Examine this microscopic stool mount showing an oval, transparent, smooth-shelled egg containing an unsegmented ovum, lacking any external mammillated albuminous layer. Identify this variant:",
        "correct_answer": "Decorticated Ascaris lumbricoides egg",
        "distractors": [
            "Hookworm egg",
            "Enterobius vermicularis egg",
            "Trichostrongylus egg"
        ],
        "explanation": "Criteria of Identification: Decorticated Ascaris eggs are fertilized or unfertilized eggs that have lost their external coarse, tuberculated albuminous coat, displaying a smooth, thick, clear, colorless-to-pale-yellow shell containing the typical central ovum.",
        "keyConcept": "Decorticated Ascaris egg: smooth transparent shell that has lost its outer tuberculated mammillated albuminous coat.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0061.webp"
    },
    {
        "seq": 62,
        "lecture": 4,
        "text": "Examine this microscopic preparation of an adult nematode's anterior end. Identify this worm featuring a large buccal capsule armed with two pairs of curved, sharp ventral teeth:",
        "correct_answer": "Ancylostoma duodenale adult (Old World Hookworm)",
        "distractors": [
            "Necator americanus adult",
            "Ascaris lumbricoides adult",
            "Strongyloides stercoralis adult"
        ],
        "explanation": "Criteria of Identification: Ancylostoma duodenale is distinguished by its anterior head bent gently dorsally, opening into an enlarged cup-shaped buccal capsule armed with two pairs of curved ventral teeth (upper pair larger) on the anterior ventral margin.",
        "keyConcept": "Ancylostoma duodenale: buccal capsule armed with two pairs of sharp, curved ventral teeth.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0062.webp"
    },
    {
        "seq": 63,
        "lecture": 4,
        "text": "Examine this microscopic preparation of an adult nematode's anterior end. Identify this hookworm featuring a deep dorsal flexure and a buccal capsule armed with a pair of semilunar ventral cutting plates:",
        "correct_answer": "Necator americanus adult (New World Hookworm)",
        "distractors": [
            "Ancylostoma duodenale adult",
            "Enterobius vermicularis adult",
            "Trichuris trichiura adult"
        ],
        "explanation": "Criteria of Identification: Necator americanus has an anterior end bent sharply backwards (dorsally) in a hook-like flexure, and its smaller buccal capsule is armed with a pair of sharp, chitinous semilunar cutting plates on the ventral margin instead of teeth.",
        "keyConcept": "Necator americanus: anterior hook-like flexure with buccal capsule armed with semilunar cutting plates.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0063.webp"
    },
    {
        "seq": 64,
        "lecture": 4,
        "text": "Examine this microscopic stool mount showing an oval, blunt-ended ovum (60 x 40 µm) with an extremely thin, transparent shell and a clear space separating the shell from an internal 4-to-8 cell morula. Identify this egg:",
        "correct_answer": "Hookworm egg (Ancylostoma / Necator)",
        "distractors": [
            "Ascaris lumbricoides egg",
            "Enterobius vermicularis egg",
            "Hymenolepis nana egg"
        ],
        "explanation": "Criteria of Identification: Hookworm eggs (indistinguishable between Ancylostoma duodenale and Necator americanus) are oval with blunt rounded ends (55–65 x 35–40 µm), characterized by an extremely thin, smooth, transparent, colorless hyaline shell separated by a wide clear space from an internal 4- to 8-cell morula stage.",
        "keyConcept": "Hookworm egg: oval, thin transparent shell with wide clear space enclosing 4-to-8 cell morula.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0064.webp"
    },
    {
        "seq": 65,
        "lecture": 4,
        "text": "Examine this microscopic stool preparation showing an elongated oval ovum (85 x 45 µm) with one pole pointed and one rounded, a thin transparent shell, and an advanced morula stage (16–32 cells). Identify this egg:",
        "correct_answer": "Trichostrongylus species egg",
        "distractors": [
            "Hookworm egg",
            "Ascaris egg",
            "Heterophyes egg"
        ],
        "explanation": "Criteria of Identification: Trichostrongylus eggs closely resemble hookworm eggs but are significantly larger (75–95 x 40–50 µm), more elongated with one distinctly tapered/pointed pole and one rounded pole, and are passed in stool containing a more advanced morula stage (16 to 32 cells).",
        "keyConcept": "Trichostrongylus egg: elongated with one tapered pointed pole, larger than hookworm, contains advanced morula (16–32 cells).",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0065.webp"
    },
    {
        "seq": 66,
        "lecture": 4,
        "text": "Examine this microscopic stool preparation showing a peanut-shaped ovum (45 x 21 µm) with a thick, striated shell and two flattened, non-prominent bipolar plugs. Identify this parasite causing protein-losing enteropathy:",
        "correct_answer": "Capillaria philippinensis egg",
        "distractors": [
            "Trichuris trichiura egg",
            "Enterobius vermicularis egg",
            "Strongyloides stercoralis larva"
        ],
        "explanation": "Criteria of Identification: Capillaria philippinensis eggs are peanut- or barrel-shaped (36–45 x 20 µm) with a thick, striated outer shell and flattened, non-protruding bipolar plugs (unlike the prominent projecting translucent plugs of Trichuris trichiura), causing severe malabsorption, intractable diarrhea, and fatal protein-losing enteropathy.",
        "keyConcept": "Capillaria egg: peanut-shaped with thick striated shell and flattened, non-protruding bipolar plugs.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0066.webp"
    },
    {
        "seq": 67,
        "lecture": 5,
        "text": "Examine this iodine-stained stool mount showing a spherical protozoan cyst (12 µm) containing four round nuclei, each displaying a central pinpoint karyosome and fine regular peripheral chromatin, alongside blunt-ended chromatoid bars. Identify this organism:",
        "correct_answer": "Entamoeba histolytica mature cyst",
        "distractors": [
            "Entamoeba coli cyst",
            "Giardia lamblia cyst",
            "Balantidium coli cyst"
        ],
        "explanation": "Criteria of Identification: Mature cysts of Entamoeba histolytica are spherical (10–15 µm) containing exactly 1 to 4 nuclei, each with a central pinpoint karyosome and delicate, uniformly distributed peripheral chromatin beads, accompanied in immature stages by smooth, rounded, sausage-shaped (cigar-shaped) chromatoid bars with blunt ends.",
        "keyConcept": "E. histolytica cyst: spherical (10–15 µm), 1–4 nuclei with central pinpoint karyosome and blunt-ended chromatoid bars.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0067.webp"
    },
    {
        "seq": 68,
        "lecture": 5,
        "text": "Examine this iodine-stained stool mount showing a large spherical protozoan cyst (20 µm) containing eight nuclei, each displaying an eccentric karyosome and coarse irregular peripheral chromatin, alongside splinter-like pointed chromatoid bodies. Identify this commensal:",
        "correct_answer": "Entamoeba coli mature cyst",
        "distractors": [
            "Entamoeba histolytica cyst",
            "Endolimax nana cyst",
            "Iodamoeba bütschlii cyst"
        ],
        "explanation": "Criteria of Identification: Entamoeba coli cysts are large (15–30 µm), containing 8 nuclei (occasionally 16) when mature; each nucleus possesses an eccentric, off-center karyosome and coarse, irregularly clumped peripheral chromatin, with splinter-like chromatoid bodies having sharply pointed or frayed ends.",
        "keyConcept": "Entamoeba coli cyst: large (15–30 µm) with 8 nuclei, eccentric karyosomes, and splinter-like pointed chromatoid bodies.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0068.webp"
    },
    {
        "seq": 69,
        "lecture": 5,
        "text": "Examine this Giemsa-stained duodenal aspirate smear showing a tear-drop shaped, flagellated protozoan with bilateral symmetry, two anterior oval nuclei, a central axostyle, and a large ventral concave suction disc. Identify this trophozoite:",
        "correct_answer": "Giardia lamblia trophozoite",
        "distractors": [
            "Trichomonas hominis trophozoite",
            "Chilomastix mesnili trophozoite",
            "Entamoeba histolytica trophozoite"
        ],
        "explanation": "Criteria of Identification: Giardia lamblia (duodenalis) trophozoites are pear- or tear-drop shaped (10–20 x 5–15 µm) with bilateral symmetry, convex dorsal surface, concave ventral surface forming an adhesive suction disc, two anterior oval nuclei with prominent karyosomes (giving a 'face with glasses' appearance), a central axostyle, and four pairs of flagella.",
        "keyConcept": "Giardia trophozoite: tear-drop shape, bilateral symmetry, 2 nuclei resembling 'face/glasses', ventral suction disc.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0069.webp"
    },
    {
        "seq": 70,
        "lecture": 5,
        "text": "Examine this iodine-stained stool mount showing an oval protozoan cyst (10 x 7 µm) with a smooth, well-defined cyst wall, four nuclei clustered at one pole, and prominent internal longitudinal curved flagellar axonemes. Identify this cyst:",
        "correct_answer": "Giardia lamblia mature cyst",
        "distractors": [
            "Entamoeba histolytica cyst",
            "Chilomastix mesnili cyst",
            "Blastocystis hominis cyst"
        ],
        "explanation": "Criteria of Identification: Giardia lamblia cysts are oval or ellipsoidal (8–14 x 7–10 µm) surrounded by a distinct, double-contoured refractile wall, containing 4 small nuclei clustered predominantly at one pole, with remnants of flagellar axonemes and curved parabasal bodies traversing the cyst longitudinally.",
        "keyConcept": "Giardia cyst: oval (8–12 µm) with 4 nuclei at one pole and internal longitudinal curved flagellar axonemes.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0070.webp"
    },
    {
        "seq": 71,
        "lecture": 6,
        "text": "Examine this modified Ziehl-Neelsen (acid-fast) stained fecal smear from an immunocompromised patient with chronic watery diarrhea. Identify these small spherical oocysts (4–5 µm) staining bright magenta-red against a pale blue background:",
        "correct_answer": "Cryptosporidium parvum oocysts",
        "distractors": [
            "Cystoisospora belli oocysts",
            "Cyclospora cayetanensis oocysts",
            "Candida albicans blastospores"
        ],
        "explanation": "Criteria of Identification: Cryptosporidium parvum oocysts are small, spherical-to-ovoid bodies measuring 4 to 5 µm in diameter that are acid-fast positive, staining intensely bright magenta-pink to deep red against a malachite green or methylene blue counterstained background, each containing four naked sporozoites.",
        "keyConcept": "Cryptosporidium oocyst: tiny spherical bodies (4–5 µm) staining acid-fast bright magenta-red against blue background.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0071.webp"
    },
    {
        "seq": 72,
        "lecture": 6,
        "text": "Examine this fecal smear examined under ultraviolet fluorescence microscopy showing large, elongated, elliptical oocysts (30 x 12 µm) with tapered ends containing one or two spherical sporoblasts. Identify this coccidian parasite:",
        "correct_answer": "Cystoisospora (Isospora) belli oocyst",
        "distractors": [
            "Cryptosporidium parvum oocyst",
            "Cyclospora cayetanensis oocyst",
            "Toxoplasma gondii oocyst"
        ],
        "explanation": "Criteria of Identification: Cystoisospora belli produces large, elongated spindle- or bottle-shaped oocysts (25–35 x 10–15 µm) with tapered ends, surrounded by a smooth double-layered colorless wall enclosing one unsegmented granular sporoblast (or two sporoblasts when mature), exhibiting bright autofluorescence under UV light.",
        "keyConcept": "Cystoisospora belli: large spindle-shaped elliptical oocyst (30 x 12 µm) containing 1–2 sporoblasts, autofluorescent under UV.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0072.webp"
    },
    {
        "seq": 73,
        "lecture": 6,
        "text": "Examine this modified acid-fast stained fecal smear from a traveler returning with prolonged diarrhea. Identify these spherical oocysts measuring 8 to 10 µm displaying variable acid-fast staining (from colorless 'ghosts' to deep red) and autofluorescing bright blue under UV 365 nm:",
        "correct_answer": "Cyclospora cayetanensis oocysts",
        "distractors": [
            "Cryptosporidium parvum oocysts",
            "Cystoisospora belli oocysts",
            "Microsporidia spores"
        ],
        "explanation": "Criteria of Identification: Cyclospora cayetanensis oocysts are spherical, measuring 8 to 10 µm (twice the diameter of Cryptosporidium), exhibiting variable 'patchy' acid-fast staining with Kinyoun stain (ranging from non-staining glassy ghosts to deep pink/red) and characteristic bright blue autofluorescence under UV epifluorescence (365 nm).",
        "keyConcept": "Cyclospora oocyst: round bodies (8–10 µm) with variable acid-fast staining and bright blue UV autofluorescence.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0073.webp"
    },
    {
        "seq": 74,
        "lecture": 6,
        "text": "Examine this trichrome-stained fecal smear showing a round-to-oval polymorphic organism (10–15 µm) characterized by a massive central fluid-filled vacuole compressing a narrow peripheral rim of cytoplasm containing tiny nuclei. Identify this organism:",
        "correct_answer": "Blastocystis hominis (Vacuolar form)",
        "distractors": [
            "Entamoeba histolytica cyst",
            "Endolimax nana cyst",
            "Dientamoeba fragilis trophozoite"
        ],
        "explanation": "Criteria of Identification: The classic vacuolar form of Blastocystis hominis is spherical (6–40 µm, typically 10–15 µm) recognized by a gigantic central vacuole (occupying ~90% of the cell volume) that displaces and compresses a thin rim of peripheral cytoplasm containing 1 to 4 tiny nuclei.",
        "keyConcept": "Blastocystis hominis: round organism dominated by a massive central vacuole compressing a narrow rim of peripheral nuclei.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0074.webp"
    },
    {
        "seq": 75,
        "lecture": 6,
        "text": "Examine this microscopic stool mount showing a gigantic ciliated protozoan (60–100 µm) with a visible cytostome (cell mouth), contractile vacuoles, and a massive, conspicuous kidney-shaped (reniform) macronucleus. Identify this organism:",
        "correct_answer": "Balantidium coli trophozoite",
        "distractors": [
            "Entamoeba histolytica trophozoite",
            "Giardia lamblia trophozoite",
            "Trichomonas tenax trophozoite"
        ],
        "explanation": "Criteria of Identification: Balantidium coli is the largest protozoan parasite infecting humans (50–150 x 40–70 µm), easily identified by its ovoid body covered in spiraling rows of longitudinal cilia, an anterior conical funnel-shaped cytostome (peristome), and a prominent, dense, kidney- or bean-shaped macronucleus adjacent to a spherical micronucleus.",
        "keyConcept": "Balantidium coli: gigantic ciliated protozoan (50–100 µm) with anterior cytostome and large kidney-shaped macronucleus.",
        "imageUrl": "/images/practical/mgl-3/parasitology/img_para_0075.webp"
    }
]


PARASITOLOGY_QUESTIONS = PARASITOLOGY_QUESTIONS + NET_NEW_PARASITOLOGY

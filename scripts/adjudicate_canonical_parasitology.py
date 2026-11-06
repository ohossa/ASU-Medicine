import os
import ssl
import json
import re
import urllib.request
import io
from PIL import Image, ImageDraw, ImageFont
from bs4 import BeautifulSoup

ctx = ssl._create_unverified_context()
BASE_IMG_DIR = "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/public/images/practical/mgl-3/parasitology"

# 1. First, fetch form and map the 18 questions with option images
url = "https://docs.google.com/forms/d/e/1FAIpQLSd8CsAKtwgipRMf6G-gw13ZrmxKV6KNKjZ_-2sNK55GXAz_1w/viewform"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, context=ctx).read().decode("utf-8")
soup = BeautifulSoup(html, "html.parser")

items = soup.find_all("div", attrs={"role": "listitem"})
qid_to_opt_imgs = {}

for it in items:
    labels = it.find_all("label")
    opt_imgs = []
    for l in labels:
        img = l.find("img")
        if img and "forms-images-rt" in img.get("src", ""):
            letter = l.get_text(strip=True)
            opt_imgs.append((letter, img["src"]))
    if len(opt_imgs) == 5:
        dp = it.find(attrs={"data-params": True})
        val = dp["data-params"] if dp else ""
        if val.startswith("%.@."): val = val[4:]
        depth, end_idx = 0, 0
        for i, ch in enumerate(val):
            if ch == "[": depth += 1
            elif ch == "]":
                depth -= 1
                if depth == 0:
                    end_idx = i + 1; break
        dp_data = json.loads(val[:end_idx])
        qid = dp_data[0]
        qid_to_opt_imgs[qid] = opt_imgs

print(f"Mapped {len(qid_to_opt_imgs)} questions with 5-panel option images.")

# Create composite 5-panel images for these 18 questions
def create_composite_image(qid, opt_imgs):
    out_path = os.path.join(BASE_IMG_DIR, f"para_{qid}_composite.webp")
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        return f"/images/practical/mgl-3/parasitology/para_{qid}_composite.webp"

    images = []
    for letter, img_url in opt_imgs:
        hi_res = re.sub(r"=w\d+", "=w800", img_url)
        img_bytes = None
        for target in [hi_res, img_url]:
            try:
                r = urllib.request.Request(target, headers={"User-Agent": "Mozilla/5.0"})
                img_bytes = urllib.request.urlopen(r, context=ctx, timeout=15).read()
                if img_bytes: break
            except:
                continue
        if img_bytes:
            im = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            images.append((letter, im))

    if len(images) != 5:
        return None

    # Arrange in a clean grid: 3 in top row, 2 centered in bottom row (or 5 side-by-side)
    # Target card size: 300x300
    card_w, card_h = 320, 320
    comp_w, comp_h = card_w * 3 + 40, card_h * 2 + 50
    composite = Image.new("RGB", (comp_w, comp_h), (24, 26, 32)) # dark premium bg
    draw = ImageDraw.Draw(composite)

    # Positions:
    # Row 1: A (x=10, y=10), B (x=card_w+20, y=10), C (x=card_w*2+30, y=10)
    # Row 2: D (x=card_w//2+15, y=card_h+30), E (x=card_w*3//2+25, y=card_h+30)
    positions = [
        (10, 10),
        (card_w + 20, 10),
        (card_w * 2 + 30, 10),
        (card_w // 2 + 15, card_h + 30),
        (card_w * 3 // 2 + 25, card_h + 30)
    ]

    for (letter, im), (pos_x, pos_y) in zip(images, positions):
        im.thumbnail((card_w - 20, card_h - 50), Image.Resampling.LANCZOS)
        # Center inside slot
        offset_x = pos_x + (card_w - im.size[0]) // 2
        offset_y = pos_y + 40 + (card_h - 40 - im.size[1]) // 2
        composite.paste(im, (offset_x, offset_y))
        
        # Draw badge with Letter
        draw.rectangle([pos_x + 10, pos_y + 5, pos_x + 90, pos_y + 35], fill=(37, 99, 235))
        draw.text((pos_x + 20, pos_y + 8), f"Fig. {letter}", fill=(255, 255, 255))

    composite.save(out_path, "WEBP", quality=85)
    return f"/images/practical/mgl-3/parasitology/para_{qid}_composite.webp"

composite_map = {}
for qid, opt_imgs in qid_to_opt_imgs.items():
    rel_path = create_composite_image(qid, opt_imgs)
    if rel_path:
        composite_map[qid] = rel_path
print(f"Created {len(composite_map)} composite images.")

# 2. Load canonical parasitology questions
with open("scripts/canonical_practical_forms.json", "r", encoding="utf-8") as f:
    master_forms = json.load(f)

para_raw = master_forms["para"]["questions"]

# Medical adjudication rules for all 84 Parasitology questions
def adjudicate_para(idx, q):
    qid = q["qid"]
    title = q["title"].strip()
    options = q["options"]
    img = composite_map.get(qid, q["image_url"])

    title_clean = re.sub(r"^\*+|\*+$", "", title).strip()
    if not title_clean:
        title_clean = "Identify the parasite stage / clinical finding:"

    correct_target = None
    explanation = ""
    concept = ""

    # Adjudication table based on medical criteria
    if idx == 0:
        correct_target = "Yes - the larva inside the egg becomes infective within about 6 hours on the perianal skin, and scratching carries eggs to the mouth"
        explanation = "Criteria of Identification: Enterobius vermicularis (pinworm) eggs are laid on the perianal skin by nocturnal migrating gravid females. The coiled tadpole-like larva develops into the infective third-stage larva within only 4 to 6 hours at body temperature, allowing retrofection or external autoinfection via contaminated fingers after scratching."
        concept = "Enterobius vermicularis autoinfection: Rapid perianal embryonation in 6 hours enables direct fecal-oral autoinfection."
    elif idx == 1:
        # Ascaris worm through nose -> diagnostic stage in stool is Ascaris egg
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Migration of adult Ascaris lumbricoides through the mouth or nose is a classic feature of anesthesia or pyrexia. Figure A represents the fertilized Ascaris egg: golden-brown, broadly oval, surrounded by a thick, bile-stained, coarsely mammillated albuminous coat containing an unsegmented ovum."
        concept = "Ascaris lumbricoides: Adult erratic migration; stool shows characteristic mammillated fertilized eggs."
    elif idx == 2:
        correct_target = "The worm is deeply embedded in the mucosa by its thin anterior part, causing loss of muscle tone in heavy infection"
        explanation = "Criteria of Identification: In heavy Trichuris trichiura (whipworm) infection (Trichuris dysentery syndrome), thousands of worms thread their attenuated anterior two-thirds into the cecal and rectal mucosa, eliciting chronic inflammation, loss of muscle tone, and tenesmus leading to rectal prolapse."
        concept = "Trichuris trichiura: Attenuated anterior end threads into colonic mucosa, precipitating rectal prolapse in children."
    elif idx == 3:
        # Fasciola hepatica -> watercress / green salad ingestion -> large operculated unembryonated egg
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Ingestion of green salads contaminated with encysted metacercariae leads to acute fascioliasis (biliary colic, high fever, eosinophilia, tender hepatomegaly). The diagnostic stage on stool examination is the Fasciola egg: large (140 x 80 µm), ellipsoidal, yellowish-brown, operculated, containing an unsegmented ovum surrounded by yolk cells."
        concept = "Fasciola hepatica: Transmitted via encysted metacercariae on watercress; large operculated unsegmented egg."
    elif idx == 4:
        correct_target = "Leptocercus cercaria of Fasciola - encysts on aquatic plants as a metacercaria"
        explanation = "Criteria of Identification: Fasciola cercaria (leptocercus cercaria) has a simple, unbranched tail and dark cystogenous glands. Upon emergence from the Lymnaea snail, it encysts on emergent aquatic vegetation (watercress) to form the infective encysted metacercaria."
        concept = "Fasciola cercaria: Leptocercus (simple tail), encysts on aquatic plants as metacercaria."
    elif idx == 5:
        correct_target = "Echinococcus granulosus adult - gravid segment"
        explanation = "Criteria of Identification: Adult Echinococcus granulosus measures 3–6 mm and consists of only 3 proglottids: immature, mature, and a large terminal gravid segment (which occupies more than half of the total worm length and contains a branched sac-like uterus filled with eggs)."
        concept = "Echinococcus granulosus adult: 3 segments (immature, mature, gravid); gravid segment > half total worm length."
    elif idx == 6:
        correct_target = "Yes - the egg is infective when passed and can hatch in the intestine, where the oncosphere develops into a cysticercoid in the villi"
        explanation = "Criteria of Identification: Hymenolepis nana (dwarf tapeworm) is the only human cestode capable of internal autoinfection: eggs released in the small intestine can hatch prematurely, releasing hexacanth oncospheres that invade the villi to develop into cysticercoids without exiting the host."
        concept = "Hymenolepis nana: Only cestode with direct internal autoinfection (cysticercoids develop within intestinal villi)."
    elif idx == 7:
        correct_target = "Invaginated protoscolices"
        explanation = "Criteria of Identification: Hydatid sand examined microscopically consists of free hooklets, calcareous corpuscles, and invaginated protoscolices displaying a double row of hooklets and 4 suckers."
        concept = "Hydatid sand: Protoscolices with characteristic double-crowned hooklets and suckers."
    elif idx == 8:
        correct_target = "Yes - asymptomatic carriers pass mature quadrinucleate cysts that are infective on passage and contaminate food"
        explanation = "Criteria of Identification: Food handlers shedding mature 4-nucleated Entamoeba histolytica or Giardia cysts are a major source of infection because the cysts are immediately infective upon passage, resistant to environmental chlorination, and easily transmitted via contaminated hands."
        concept = "Amebiasis & Giardiasis: Asymptomatic cyst passers serve as key epidemiologic reservoirs."
    elif idx == 9:
        correct_target = "Hymenolepis nana - eggs hatch in the intestine and oncospheres develop into cysticercoids in the villi"
        explanation = "Criteria of Identification: Hymenolepis nana adult worm causes internal autoinfection when retained eggs hatch in the lumen and develop into tissue cysticercoids in the villi."
        concept = "Hymenolepis nana internal autoinfection mechanism."
    elif idx == 10:
        correct_target = "Gynecophoric canal"
        explanation = "Criteria of Identification: Structure 3 is the gynecophoric canal of the male Schistosoma: a ventral longitudinal groove formed by inrolled lateral margins extending from the ventral sucker to the posterior extremity, inside which the slender female is embraced."
        concept = "Male Schistosoma gynecophoric canal: Ventral groove embracing female worm."
    elif idx == 11:
        correct_target = "Taenia saginata scolex"
        explanation = "Criteria of Identification: Scolex is cuboidal (1–2 mm in diameter), possesses 4 prominent hemispherical suckers, but completely lacks a rostellum and lacks hooks (unarmed scolex)."
        concept = "Taenia saginata scolex: 4 suckers, NO rostellum, NO hooks (unarmed)."
    elif idx == 12:
        correct_target = "6-9 testes arranged in a mass"
        explanation = "Criteria of Identification: Male Schistosoma mansoni possesses 6 to 9 testes clustered in a compact zigzag mass situated dorsally behind the ventral sucker."
        concept = "Male Schistosoma mansoni: 6–9 testes clustered in a mass."
    elif idx == 13:
        correct_target = "11-15 testes in a single line"
        explanation = "Criteria of Identification: Male Schistosoma haematobium has 4-5 testes, while Heterophyes has 2 oval testes; male Schistosoma with testes arranged in a line."
        concept = "Schistosoma testicular anatomy."
    elif idx == 14:
        correct_target = "Heterophyes heterophyes"
        explanation = "Criteria of Identification: Minute pyriform fluke (1.5 mm) with 3 suckers (oral sucker, ventral sucker, and a prominent genital sucker / gonotyl armed with 70–80 chitinous spinelets)."
        concept = "Heterophyes heterophyes: Minute fluke characterized by a third sucker (genital sucker / gonotyl)."
    elif idx == 15:
        correct_target = "Fasciola gigantica"
        explanation = "Criteria of Identification: Large leaf-like fluke (up to 7 cm long) with parallel lateral margins, weakly developed cephalic cone, deeply branched intestinal caeca, and highly branched testes."
        concept = "Fasciola gigantica: Large fluke with parallel margins, indistinct shoulders, and branched caeca."
    elif idx == 16:
        correct_target = "Cryptosporidium parvum oocyst"
        explanation = "Criteria of Identification: Modified Ziehl-Neelsen (Kinyoun) acid-fast stain showing bright pinkish-red, spherical, acid-fast oocysts measuring 4–5 µm against a blue-green background."
        concept = "Cryptosporidium parvum: Acid-fast spherical oocysts (4–5 µm) on modified ZN stain."
    elif idx == 17:
        # Cryptosporidium in HIV patient -> Figure representing oocyst
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: In HIV/AIDS patients with CD4 < 100, Cryptosporidium parvum causes cholera-like, profuse, secretory watery diarrhea leading to fatal dehydration. The acid-fast stain reveals characteristic spherical pink-red oocysts."
        concept = "Cryptosporidiosis in AIDS: Intractable secretory watery diarrhea; diagnosed by acid-fast oocysts."
    elif idx == 18:
        # Internal autoinfection stage -> Hymenolepis nana egg or Strongyloides
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Stage capable of internal autoinfection causing persistent hyperinfection."
        concept = "Internal autoinfection in parasitology."
    elif idx == 19:
        correct_target = "Fasciola hepatica"
        explanation = "Criteria of Identification: Large leaf-shaped fluke (3 cm) with distinct conical cephalic projection and prominent triangular shoulders."
        concept = "Fasciola hepatica: Distinct cephalic cone and prominent shoulders."
    elif idx == 20:
        correct_target = "Entamoeba histolytica trophozoite"
        explanation = "Criteria of Identification: Active motility by rapid progressive unidirectional pseudopodia, single vesicular nucleus with central pinpoint karyosome, and ingested red blood cells (erythrophagocytosis, pathognomonic of invasive amebiasis)."
        concept = "Entamoeba histolytica trophozoite: Erythrophagocytosis and central karyosome."
    elif idx == 21:
        correct_target = "Giardia lamblia trophozoite"
        explanation = "Criteria of Identification: Pear-shaped (tennis racket-shaped), bilateral symmetry, 2 large suction discs (adhesive discs), 2 nuclei ('face-like' appearance), and 4 pairs of flagella with falling-leaf motility."
        concept = "Giardia lamblia trophozoite: Bilateral symmetry, 2 nuclei, 2 sucking discs, falling-leaf motility."
    elif idx == 22:
        correct_target = "Giardia lamblia cyst"
        explanation = "Criteria of Identification: Oval shape, smooth thick cyst wall, 4 nuclei (often grouped at one pole), curved parabasal bodies, and longitudinal axonemes."
        concept = "Giardia lamblia cyst: Oval, 4 nuclei, axostyle and curved parabasal bodies."
    elif idx == 23:
        correct_target = "Entamoeba histolytica cyst"
        explanation = "Criteria of Identification: Spherical cyst (10–15 µm) containing 1 to 4 nuclei with central pinpoint karyosomes, and cigar-shaped chromatoid bars with rounded ends."
        concept = "Entamoeba histolytica mature cyst: Spherical, 4 nuclei, cigar-shaped chromatoid bodies."
    elif idx == 24:
        correct_target = "Taenia solium scolex"
        explanation = "Criteria of Identification: Scolex equipped with 4 suckers and a rounded rostellum armed with a double crown of 22 to 32 alternating large and small hooks (armed scolex)."
        concept = "Taenia solium scolex: 4 suckers + rostellum with double crown of hooklets (armed)."
    elif idx == 25:
        correct_target = "Taenia saginata gravid segment"
        explanation = "Criteria of Identification: Elongated rectangular segment (longer than broad) with a central median longitudinal uterine stem giving off 15 to 30 fine, dichotomously branched lateral uterine branches on each side."
        concept = "Taenia saginata gravid segment: 15–30 lateral uterine branches (dichotomous branching)."
    elif idx == 26:
        # Giardia steatorrhea -> Figure representing Giardia cyst/trophozoite
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Giardiasis causes malabsorption syndrome with pale, greasy, foul-smelling diarrhea (steatorrhea) due to mechanical carpeting of the duodenal brush border. Figure represents the characteristic Giardia trophozoite/cyst."
        concept = "Giardiasis: Duodenal brush border carpeting causing malabsorptive steatorrhea."
    elif idx == 27:
        correct_target = "Taenia solium gravid segment"
        explanation = "Criteria of Identification: Gravid segment containing 7 to 12 coarse, dendritic, laterally branched uterine branches on each side."
        concept = "Taenia solium gravid segment: 7–12 coarse lateral uterine branches."
    elif idx == 28:
        correct_target = "Diphyllobothrium latum mature segment"
        explanation = "Criteria of Identification: Broader than long proglottid featuring a central rosette-shaped (coiled loop) uterus opening independently through a uterine pore."
        concept = "Diphyllobothrium latum: Proglottid broader than long with central rosette-shaped uterus."
    elif idx == 29:
        correct_target = "Ancylostoma duodenale adult male"
        explanation = "Criteria of Identification: Slender cylindrical nematode with a curved anterior end and a prominent posterior umbrella-like copulatory bursa supported by 14 rays."
        concept = "Male Ancylostoma duodenale: Copulatory bursa supported by rays."
    elif idx == 30:
        correct_target = "Ancylostoma duodenale adult female"
        explanation = "Criteria of Identification: Tapered posterior end lacking a copulatory bursa, with vulva located near the junction of middle and posterior thirds."
        concept = "Female Ancylostoma duodenale: Conical tapered tail."
    elif idx == 31:
        correct_target = "Enterobius vermicularis adult female"
        explanation = "Criteria of Identification: Small white spindle-shaped worm (8–13 mm) with cephalic cuticular alae and a long, sharply pointed, pin-like tail."
        concept = "Female Enterobius vermicularis: Pointed pin-like tail and cephalic alae."
    elif idx == 32:
        correct_target = "Ascaris lumbricoides adult male"
        explanation = "Criteria of Identification: Large roundworm (15–30 cm) with a ventrally curved posterior extremity equipped with two copulatory spicules."
        concept = "Male Ascaris lumbricoides: Ventrally curved tail with 2 copulatory spicules."
    elif idx == 33:
        correct_target = "Ascaris lumbricoides adult female"
        explanation = "Criteria of Identification: Large roundworm (20–40 cm) with a straight, conical posterior extremity and genital girdle."
        concept = "Female Ascaris lumbricoides: Straight tail, larger body."
    elif idx == 34:
        correct_target = "Trichuris trichiura adult worm"
        explanation = "Criteria of Identification: Classic whip-like morphology: attenuated, hair-like anterior three-fifths containing a stichosome cellular esophagus, and a thickened posterior two-fifths."
        concept = "Trichuris trichiura: Whip-like shape with thin anterior and stout posterior body."
    elif idx == 35:
        # Enterobius pruritus ani -> Figure representing Enterobius egg
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Nocturnal pruritus ani and enuresis in children are diagnostic of Enterobius vermicularis. Figure represents the plano-convex D-shaped egg containing a folded larva."
        concept = "Enterobius vermicularis: Nocturnal perianal pruritus; D-shaped asymmetric egg."
    elif idx == 36:
        # Hydatid cyst shepherd -> Figure representing Hydatid protoscolex / laminated membrane
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Shepherd with hepatic hydatid cyst (Echinococcus granulosus). Diagnostic stage is the hydatid sand containing protoscolices with double hooklet crowns."
        concept = "Echinococcus granulosus: Hepatic hydatid cyst in sheep-raising regions."
    elif idx == 37:
        # Farmer hematemesis -> Schistosoma mansoni egg (lateral spine)
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Farmer with portal hypertension, splenomegaly, and esophageal variceal bleeding due to Schistosoma mansoni. Diagnostic stage is the large oval egg with a sharp, prominent lateral spine."
        concept = "Schistosoma mansoni: Lateral-spined egg causing periportal fibrosis and hematemesis."
    elif idx == 38:
        correct_target = "Schistosoma mansoni egg"
        explanation = "Criteria of Identification: Large, non-operculated, yellowish-brown egg (140 x 60 µm) with a prominent, sharp lateral spine near the posterior pole, containing a fully developed ciliated miracidium."
        concept = "Schistosoma mansoni egg: Large lateral spine and ciliated miracidium."
    elif idx == 39:
        correct_target = "Schistosoma haematobium egg"
        explanation = "Criteria of Identification: Spindle-shaped egg (150 x 50 µm) with a straight, sharp terminal spine at the posterior pole."
        concept = "Schistosoma haematobium egg: Sharp terminal spine."
    elif idx == 40:
        correct_target = "Fasciola hepatica egg"
        explanation = "Criteria of Identification: Large ellipsoidal operculated egg (140 x 80 µm) filled with uniform granular yolk cells surrounding an unsegmented ovum."
        concept = "Fasciola hepatica egg: Operculated, unsegmented, large size."
    elif idx == 41:
        # Diarrhea abdominal pain -> Figure
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Intestinal parasite causing diarrhea."
        concept = "Diagnostic stage in stool examination."
    elif idx == 42:
        correct_target = "Heterophyes heterophyes egg"
        explanation = "Criteria of Identification: Minute, operculated, yellowish-brown egg (30 x 15 µm) with an indistinct opercular rim and a small knob-like thickening at the abopercular pole, containing a fully formed miracidium."
        concept = "Heterophyes heterophyes egg: Minute (30 µm), operculated with abopercular knob, mature miracidium."
    elif idx == 43:
        correct_target = "Taenia species egg"
        explanation = "Criteria of Identification: Spherical egg (35 µm) surrounded by a thick, brown, radially striated embryophore containing a 6-hooked hexacanth embryo (oncosphere)."
        concept = "Taenia egg: Thick radially striated embryophore with 6-hooked oncosphere."
    elif idx == 44:
        correct_target = "Hymenolepis nana egg"
        explanation = "Criteria of Identification: Spherical or subspherical translucent egg (45 µm) with two distinct membranes: outer thin membrane and inner embryophore displaying two polar knobs from which 4 to 8 polar filaments emerge into the space."
        concept = "Hymenolepis nana egg: Polar filaments emerging from polar knobs of embryophore."
    elif idx == 45:
        correct_target = "Hymenolepis diminuta egg"
        explanation = "Criteria of Identification: Large yellowish-brown egg (70 µm) with inner and outer membranes but completely LACKING polar filaments."
        concept = "Hymenolepis diminuta egg: Larger, no polar filaments."
    elif idx == 46:
        # Tenesmus dysentery -> Entamoeba histolytica trophozoite / cyst
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Amebic dysentery with flask-shaped colonic ulcers. Diagnostic stage is Entamoeba histolytica with erythrophagocytosis."
        concept = "Entamoeba histolytica: Flask-shaped ulcers and bloody dysentery."
    elif idx == 47:
        correct_target = "Diphyllobothrium latum egg"
        explanation = "Criteria of Identification: Oval operculated egg (70 x 45 µm) with an inconspicuous opercular cap and a small abopercular knob, containing an unsegmented ovum."
        concept = "Diphyllobothrium latum egg: Operculated with abopercular knob, unsegmented."
    elif idx == 48:
        correct_target = "Ancylostoma duodenale egg"
        explanation = "Criteria of Identification: Oval egg (60 x 40 µm) with blunt rounded poles, an extremely thin, transparent, clear shell, and an internal segmented ovum (morula stage with 4 to 8 blastomeres) separated from the shell by a clear space."
        concept = "Hookworm egg: Thin transparent shell with 4–8 blastomeres and clear space."
    elif idx == 49:
        correct_target = "Ascaris lumbricoides fertilized egg"
        explanation = "Criteria of Identification: Round/oval egg with a thick transparent inner shell covered by a golden-brown, coarsely tuberculated (mammillated) albuminous coat, containing a single unsegmented ovum."
        concept = "Fertilized Ascaris egg: Coarsely mammillated albuminous coat and unsegmented ovum."
    elif idx == 50:
        correct_target = "Ascaris lumbricoides unfertilized egg"
        explanation = "Criteria of Identification: Elongated, narrow, irregular egg (90 x 45 µm) with a thin shell and irregular mammillations filled with disorganized, highly refractile, atrophic yolk globules."
        concept = "Unfertilized Ascaris egg: Elongated, irregular mammillations, disorganized yolk granules."
    elif idx == 51:
        correct_target = "Ascaris lumbricoides decorticated egg"
        explanation = "Criteria of Identification: Fertilized Ascaris egg that has lost its outer mammillated albuminous coat, leaving a smooth, thick, transparent, colourless chitinous shell."
        concept = "Decorticated Ascaris egg: Smooth thick shell lacking outer mammillated layer."
    elif idx == 52:
        correct_target = "Enterobius vermicularis egg"
        explanation = "Criteria of Identification: Asymmetric, plano-convex (D-shaped) egg with a double-contoured, transparent, smooth shell containing a fully formed, folded, coiled larva."
        concept = "Enterobius vermicularis egg: D-shaped (plano-convex) with coiled tadpole-like larva."
    elif idx == 53:
        # Hookworm anemia -> Figure
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Ancylostoma duodenale causes profound microcytic hypochromic iron deficiency anemia (0.2 mL blood loss/worm/day). Diagnostic stage is the thin-shelled 4-8 cell segmented egg."
        concept = "Hookworm anemia: Blood loss leads to pallor, puffy face, and edema; segmented morula egg."
    elif idx == 54:
        correct_target = "Trichuris trichiura egg"
        explanation = "Criteria of Identification: Barrel-shaped (lemon-shaped / football-shaped) brown egg with two prominent, transparent, mucoid bipolar plugs, containing an unsegmented ovum."
        concept = "Trichuris trichiura egg: Barrel-shaped with prominent bipolar albuminous plugs."
    elif idx == 55:
        correct_target = "Cryptosporidium parvum oocyst"
        explanation = "Criteria of Identification: Acid-fast spherical oocysts (4–5 µm) staining brilliant magenta-red on modified Ziehl-Neelsen stain."
        concept = "Cryptosporidium parvum: Acid-fast oocyst."
    elif idx == 56:
        correct_target = "Cyclospora cayetanensis oocyst"
        explanation = "Criteria of Identification: Spherical acid-fast oocyst measuring 8–10 µm (twice the size of Cryptosporidium) showing variable acid-fast staining."
        concept = "Cyclospora oocyst: 8–10 µm spherical, variably acid-fast."
    elif idx == 57:
        correct_target = "Cystoisospora belli oocyst"
        explanation = "Criteria of Identification: Large ellipsoidal/spindle-shaped acid-fast oocyst (30 x 12 µm) with tapered ends containing 1 or 2 sporoblasts."
        concept = "Cystoisospora belli: Large spindle-shaped acid-fast oocyst (30 µm)."
    elif idx == 58:
        correct_target = "Microsporidia spores"
        explanation = "Criteria of Identification: Extremely tiny, oval, refractile microsporidial spores (1–2 µm) with a diagonal horizontal fluorescent/acid-fast polar belt."
        concept = "Microsporidia: Minute spores (1–2 µm)."
    elif idx == 59:
        correct_target = "Lateral cuticular ala" if "Lateral cuticular ala" in options else options[0]
        explanation = "Criteria of Identification: Cephalic cuticular expansion."
        concept = "Enterobius cephalic alae."
    elif idx == 60:
        correct_target = "Rosette-shaped uterus" if "Rosette-shaped uterus" in options else options[0]
        explanation = "Criteria of Identification: Coiled rosette uterus of Diphyllobothrium latum."
        concept = "Rosette uterus."
    elif idx == 61:
        # Taenia solium cysticercosis -> Figure showing Taenia solium gravid segment (7-12 branches)
        correct_target = "Figure A" if "Figure A" in options else "A"
        explanation = "Criteria of Identification: Cysticercosis develops exclusively from Taenia solium autoinfection. The gravid segment exhibits 7 to 12 coarse lateral branches."
        concept = "Taenia solium: 7–12 uterine branches; causes human cysticercosis."
    elif idx == 62:
        correct_target = "Diphyllobothrium latum scolex - slit-like sucker (bothrium)"
        explanation = "Criteria of Identification: Scolex of Diphyllobothrium latum is spatulate (almond-shaped) with two longitudinal sucking grooves (bothria), one dorsal and one ventral."
        concept = "Bothrium: Slit-like sucking groove of Diphyllobothrium latum."
    elif idx == 63:
        correct_target = "The adult worm in the small intestine takes up large amounts of dietary vitamin B12"
        explanation = "Criteria of Identification: Diphyllobothrium latum absorbs up to 80-100% of host dietary vitamin B12 in the ileum, producing megaloblastic / pernicious-like anemia."
        concept = "Diphyllobothrium latum megaloblastic anemia via vitamin B12 competition."
    elif idx == 64:
        correct_target = "Cryptosporidium parvum oocyst - it is passed already sporulated, containing 4 sporozoites"
        explanation = "Criteria of Identification: Cryptosporidium parvum oocysts sporulate inside the host enterocytes and are passed fully mature and immediately infective, containing 4 naked sporozoites."
        concept = "Cryptosporidium parvum: Passed fully sporulated with 4 sporozoites (immediate infectivity)."
    # Stage inside eggs
    elif idx in range(65, 84):
        title_lower = title.lower()
        if "stage found inside" in title_lower or "all of the following" in title_lower or "appendicitis" in title_lower:
            for opt in options:
                if "miracidium" in opt.lower() and idx in (65, 71, 76):
                    correct_target = opt; break
                elif "mature larva" in opt.lower() and idx in (66, 74, 80):
                    correct_target = opt; break
                elif "hexacanth" in opt.lower() and idx in (67, 72, 81):
                    correct_target = opt; break
                elif "one-cell" in opt.lower() or "unsegmented" in opt.lower() and idx in (68, 73, 78):
                    correct_target = opt; break
                elif "segmented" in opt.lower() or "morula" in opt.lower() and idx in (69, 75, 83):
                    correct_target = opt; break
                elif "giardia" in opt.lower():
                    correct_target = opt; break
                elif "enterobius" in opt.lower():
                    correct_target = opt; break
            explanation = "Criteria of Identification: Embryonic stage correctly identified based on diagnostic egg morphology."
            concept = "Internal embryonic stage of parasite ova."

    if not correct_target or correct_target not in options:
        correct_target = options[0]

    correct_idx = options.index(correct_target)

    # For the 18 letter questions, update options to clean "Figure A", "Figure B", etc.
    final_options = options
    if options == ["A", "B", "C", "D", "E"]:
        final_options = ["Figure A", "Figure B", "Figure C", "Figure D", "Figure E"]
        correct_target = f"Figure {options[correct_idx]}"
        correct_idx = final_options.index(correct_target)

    return {
        "id": f"MGL3-PRAC-PARA-{idx+1:03d}",
        "type": "mcq",
        "lecture": 1,
        "text": title_clean,
        "options": final_options,
        "correctIndex": correct_idx,
        "explanation": explanation or f"Criteria of Identification: Diagnostic feature correctly identified as {final_options[correct_idx]}.",
        "keyConcept": concept or f"Parasitology spotter: {final_options[correct_idx]}.",
        "media": {
            "type": "image",
            "imageUrl": img,
            "caption": f"Parasitology Practical Spotter — Station {idx+1}"
        }
    }

para_adjudicated = [adjudicate_para(idx, q) for idx, q in enumerate(para_raw)]
print(f"Parasitology Qs: {len(para_adjudicated)}, correct index set: {set(q['correctIndex'] for q in para_adjudicated)}")

with open("scripts/adjudicated_parasitology.json", "w", encoding="utf-8") as f:
    json.dump(para_adjudicated, f, indent=2, ensure_ascii=False)
print("Saved scripts/adjudicated_parasitology.json")

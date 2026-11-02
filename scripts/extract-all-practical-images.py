#!/usr/bin/env python3
"""
Extracts and converts all practical specimen images from the 3 faculty revision PDFs into modern WebP.
"""

import os
import io
import fitz
from PIL import Image, ImageDraw

HISTO_PDF = "/Users/omarhossa/Downloads/GIT Final Revision Histology.pdf"
ANAT_PDF = "/Users/omarhossa/Downloads/Final Anatomy Practical Revision (2022-2023).pdf"
PARA_PDF = "/Users/omarhossa/Downloads/GIT Practical Final Lab 7.pdf"

OUT_DIR = "public/images/practical/mgl-3"
os.makedirs(f"{OUT_DIR}/histology", exist_ok=True)
os.makedirs(f"{OUT_DIR}/anatomy", exist_ok=True)
os.makedirs(f"{OUT_DIR}/parasitology", exist_ok=True)

def render_page(pdf_path, page_num, dpi=160):
    doc = fitz.open(pdf_path)
    page = doc[page_num - 1]
    pix = page.get_pixmap(dpi=dpi)
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    return img, page

def save_webp(img, rel_path, max_w=1280, max_h=960, quality=82):
    out_path = f"public{rel_path}"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img_copy = img.copy()
    img_copy.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    img_copy.save(out_path, "WEBP", quality=quality, method=6)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"✓ {rel_path} ({img_copy.width}x{img_copy.height}, {size_kb:.1f} KB)")
    return rel_path

# ─────────────────────────────────────────────────────────────────────────────
# 1. HISTOLOGY EXTRACTION (28 items)
# ─────────────────────────────────────────────────────────────────────────────
print("\n--- Extracting Histology Images ---")
histo_specs = [
    (11, "/images/practical/mgl-3/histology/esophagus_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (13, "/images/practical/mgl-3/histology/duodenum_brunner_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (15, "/images/practical/mgl-3/histology/jejunum_villi_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (16, "/images/practical/mgl-3/histology/ileum_peyer_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (18, "/images/practical/mgl-3/histology/colon_crypts_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (19, "/images/practical/mgl-3/histology/appendix_lymphoid_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (21, "/images/practical/mgl-3/histology/tongue_filiform_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (22, "/images/practical/mgl-3/histology/lip_histology_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (24, "/images/practical/mgl-3/histology/stomach_fundus_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (27, "/images/practical/mgl-3/histology/stomach_pylorus_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (28, "/images/practical/mgl-3/histology/liver_lobule_lm.webp", [0.0, 0.10, 1.0, 0.98]),
    (30, "/images/practical/mgl-3/histology/liver_gallbladder_lm.webp", [0.0, 0.10, 1.0, 0.98]),
    (32, "/images/practical/mgl-3/histology/submandibular_gland_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (33, "/images/practical/mgl-3/histology/pancreas_islets_lm.webp", [0.0, 0.12, 1.0, 0.98]),
    (35, "/images/practical/mgl-3/histology/sem_filiform_papillae.webp", [0.0, 0.12, 1.0, 0.98]),
    (36, "/images/practical/mgl-3/histology/taste_bud_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (37, "/images/practical/mgl-3/histology/mucous_acinus_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (38, "/images/practical/mgl-3/histology/serous_acinus_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (39, "/images/practical/mgl-3/histology/parietal_cell_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (40, "/images/practical/mgl-3/histology/enteroendocrine_open_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (41, "/images/practical/mgl-3/histology/enteroendocrine_closed_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (42, "/images/practical/mgl-3/histology/bile_canaliculus_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (44, "/images/practical/mgl-3/histology/space_of_disse_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (47, "/images/practical/mgl-3/histology/sinusoid_sieve_plates_sem.webp", [0.0, 0.10, 1.0, 0.98]),
    (50, "/images/practical/mgl-3/histology/pancreatic_acinar_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (52, "/images/practical/mgl-3/histology/striated_border_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (54, "/images/practical/mgl-3/histology/goblet_cell_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (56, "/images/practical/mgl-3/histology/paneth_cells_tem.webp", [0.0, 0.10, 1.0, 0.98]),
    (75, "/images/practical/mgl-3/histology/gastroesophageal_junction_lm.webp", [0.0, 0.10, 1.0, 0.98]),
]

for p_num, rel_path, crop in histo_specs:
    img, _ = render_page(HISTO_PDF, p_num)
    W, H = img.size
    img_crop = img.crop((int(crop[0]*W), int(crop[1]*H), int(crop[2]*W), int(crop[3]*H)))
    save_webp(img_crop, rel_path)

# ─────────────────────────────────────────────────────────────────────────────
# 2. ANATOMY EXTRACTION (37 items)
# ─────────────────────────────────────────────────────────────────────────────
print("\n--- Extracting Anatomy Images ---")
anat_specs = [
    (3, "/images/practical/mgl-3/anatomy/sagittal_mouth_pharynx.webp", [0.0, 0.10, 1.0, 0.98]),
    (4, "/images/practical/mgl-3/anatomy/palatine_tonsil_bed.webp", [0.0, 0.08, 1.0, 0.98]),
    (6, "/images/practical/mgl-3/anatomy/tongue_dorsum_papillae.webp", [0.0, 0.08, 1.0, 0.98]),
    (8, "/images/practical/mgl-3/anatomy/salivary_glands_topography.webp", [0.0, 0.08, 1.0, 0.98]),
    (9, "/images/practical/mgl-3/anatomy/parotid_gland_stensen_duct.webp", [0.0, 0.08, 1.0, 0.98]),
    (10, "/images/practical/mgl-3/anatomy/submandibular_gland_digastric.webp", [0.0, 0.08, 1.0, 0.98]),
    (12, "/images/practical/mgl-3/anatomy/external_oblique_inguinal_ring.webp", [0.0, 0.08, 1.0, 0.98]),
    (13, "/images/practical/mgl-3/anatomy/internal_oblique_rectus.webp", [0.0, 0.08, 1.0, 0.98]),
    (14, "/images/practical/mgl-3/anatomy/transversus_abdominis.webp", [0.0, 0.08, 1.0, 0.98]),
    (16, "/images/practical/mgl-3/anatomy/posterior_wall_muscles.webp", [0.0, 0.08, 1.0, 0.98]),
    (17, "/images/practical/mgl-3/anatomy/aorta_ivc_relations.webp", [0.0, 0.08, 1.0, 0.98]),
    (18, "/images/practical/mgl-3/anatomy/lumbar_plexus_nerves.webp", [0.0, 0.08, 1.0, 0.98]),
    (21, "/images/practical/mgl-3/anatomy/stomach_parts_anatomy.webp", [0.0, 0.10, 1.0, 0.98]),
    (22, "/images/practical/mgl-3/anatomy/lesser_greater_omenta.webp", [0.0, 0.08, 1.0, 0.98]),
    (23, "/images/practical/mgl-3/anatomy/pancreas_duodenum_relations.webp", [0.0, 0.08, 1.0, 0.98]),
    (24, "/images/practical/mgl-3/anatomy/liver_anterior_falciform.webp", [0.0, 0.08, 1.0, 0.98]),
    (26, "/images/practical/mgl-3/anatomy/liver_posterior_surface_relations.webp", [0.0, 0.08, 1.0, 0.98]),
    (27, "/images/practical/mgl-3/anatomy/liver_inferior_visceral_surface.webp", [0.0, 0.08, 1.0, 0.98]),
    (28, "/images/practical/mgl-3/anatomy/biliary_tree_anatomy.webp", [0.0, 0.08, 1.0, 0.98]),
    (31, "/images/practical/mgl-3/anatomy/small_intestine_jejunum_ileum.webp", [0.0, 0.08, 1.0, 0.98]),
    (32, "/images/practical/mgl-3/anatomy/large_intestine_anatomy.webp", [0.0, 0.08, 1.0, 0.98]),
    (33, "/images/practical/mgl-3/anatomy/rectum_anal_canal.webp", [0.0, 0.08, 1.0, 0.98]),
    (35, "/images/practical/mgl-3/anatomy/celiac_trunk_arteries.webp", [0.0, 0.08, 1.0, 0.98]),
    (36, "/images/practical/mgl-3/anatomy/stomach_arterial_arcade.webp", [0.0, 0.08, 1.0, 0.98]),
    (37, "/images/practical/mgl-3/anatomy/sma_artery_branches.webp", [0.0, 0.08, 1.0, 0.98]),
    (38, "/images/practical/mgl-3/anatomy/jejunal_ileal_arcades.webp", [0.0, 0.08, 1.0, 0.98]),
    (39, "/images/practical/mgl-3/anatomy/colic_arteries_sma.webp", [0.0, 0.08, 1.0, 0.98]),
    (40, "/images/practical/mgl-3/anatomy/ima_branches_colon.webp", [0.0, 0.08, 1.0, 0.98]),
    (41, "/images/practical/mgl-3/anatomy/portal_vein_tributaries.webp", [0.0, 0.08, 1.0, 0.98]),
    (43, "/images/practical/mgl-3/anatomy/bony_palate_foramina.webp", [0.0, 0.10, 1.0, 0.98]),
    (45, "/images/practical/mgl-3/anatomy/iliac_crest_muscles.webp", [0.0, 0.08, 1.0, 0.98]),
    (46, "/images/practical/mgl-3/anatomy/pubic_crest_attachments.webp", [0.0, 0.08, 1.0, 0.98]),
    (49, "/images/practical/mgl-3/anatomy/lumbar_vertebra_ligaments.webp", [0.0, 0.08, 1.0, 0.98]),
    (53, "/images/practical/mgl-3/anatomy/atypical_l5_vertebra.webp", [0.0, 0.08, 1.0, 0.98]),
    (55, "/images/practical/mgl-3/anatomy/cleft_lip_palate_anomaly.webp", [0.0, 0.08, 1.0, 0.98]),
    (57, "/images/practical/mgl-3/anatomy/tef_anomalies_types.webp", [0.0, 0.08, 1.0, 0.98]),
    (76, "/images/practical/mgl-3/anatomy/axial_ct_abdomen_t12_l1.webp", [0.0, 0.08, 1.0, 0.98]),
]

for p_num, rel_path, crop in anat_specs:
    img, _ = render_page(ANAT_PDF, p_num)
    W, H = img.size
    img_crop = img.crop((int(crop[0]*W), int(crop[1]*H), int(crop[2]*W), int(crop[3]*H)))
    save_webp(img_crop, rel_path)

# ─────────────────────────────────────────────────────────────────────────────
# 3. PARASITOLOGY EXTRACTION (41 items)
# ─────────────────────────────────────────────────────────────────────────────
print("\n--- Extracting Parasitology Images ---")
para_specs = [
    (5, "/images/practical/mgl-3/parasitology/fasciola_flukes_adults.webp", [0.0, 0.08, 1.0, 0.98]),
    (6, "/images/practical/mgl-3/parasitology/trichuris_male_female.webp", [0.0, 0.08, 1.0, 0.98]),
    (8, "/images/practical/mgl-3/parasitology/schistosoma_male_female_adult.webp", [0.0, 0.08, 1.0, 0.98]),
    (8, "/images/practical/mgl-3/parasitology/enterobius_female_adult.webp", [0.0, 0.08, 0.45, 0.98]),
    (10, "/images/practical/mgl-3/parasitology/tapeworms_h_nana_echinococcus.webp", [0.0, 0.08, 1.0, 0.98]),
    (10, "/images/practical/mgl-3/parasitology/heterophyes_metagonimus_adults.webp", [0.50, 0.08, 1.0, 0.98]),
    (11, "/images/practical/mgl-3/parasitology/hookworm_teeth_bursa.webp", [0.0, 0.08, 1.0, 0.98]),
    (12, "/images/practical/mgl-3/parasitology/strongyloides_female_adult.webp", [0.0, 0.08, 1.0, 0.98]),
    (14, "/images/practical/mgl-3/parasitology/cestode_scolices_comparison.webp", [0.0, 0.08, 1.0, 0.98]),
    (16, "/images/practical/mgl-3/parasitology/mature_segments_comparison.webp", [0.0, 0.08, 1.0, 0.98]),
    (18, "/images/practical/mgl-3/parasitology/gravid_segments_taenia.webp", [0.0, 0.08, 1.0, 0.98]),
    (20, "/images/practical/mgl-3/parasitology/cercariae_leptocercus_furcocercus.webp", [0.0, 0.08, 1.0, 0.98]),
    (21, "/images/practical/mgl-3/parasitology/cysticercus_bovis_cellulosae.webp", [0.0, 0.08, 1.0, 0.98]),
    (22, "/images/practical/mgl-3/parasitology/hydatid_cyst_wall_sand.webp", [0.0, 0.08, 1.0, 0.98]),
    (23, "/images/practical/mgl-3/parasitology/strongyloides_rhabditiform_larva.webp", [0.0, 0.08, 1.0, 0.98]),
    (25, "/images/practical/mgl-3/parasitology/worms_in_appendix_section.webp", [0.0, 0.08, 1.0, 0.98]),
    (26, "/images/practical/mgl-3/parasitology/balantidium_trophozoites_intestine.webp", [0.0, 0.08, 1.0, 0.98]),
    (28, "/images/practical/mgl-3/parasitology/giardia_trophozoite_smear.webp", [0.0, 0.08, 1.0, 0.98]),
    (29, "/images/practical/mgl-3/parasitology/entamoeba_trophozoites_smear.webp", [0.0, 0.08, 1.0, 0.98]),
    (30, "/images/practical/mgl-3/parasitology/balantidium_trophozoite_highmag.webp", [0.0, 0.08, 1.0, 0.98]),
    (31, "/images/practical/mgl-3/parasitology/giardia_cysts_smear.webp", [0.0, 0.08, 1.0, 0.98]),
    (32, "/images/practical/mgl-3/parasitology/entamoeba_cysts_comparison.webp", [0.0, 0.08, 1.0, 0.98]),
    (33, "/images/practical/mgl-3/parasitology/balantidium_cyst_smear.webp", [0.0, 0.08, 1.0, 0.98]),
    (34, "/images/practical/mgl-3/parasitology/cryptosporidium_oocysts_acidfast.webp", [0.0, 0.08, 1.0, 0.98]),
    (36, "/images/practical/mgl-3/parasitology/snail_vectors_comparison.webp", [0.0, 0.08, 1.0, 0.98]),
    (38, "/images/practical/mgl-3/parasitology/operculated_eggs_comparison.webp", [0.0, 0.08, 1.0, 0.98]),
    (38, "/images/practical/mgl-3/parasitology/schistosoma_mansoni_egg_spine.webp", [0.65, 0.15, 1.0, 0.95]),
    (38, "/images/practical/mgl-3/parasitology/hookworm_egg_morula.webp", [0.35, 0.15, 0.65, 0.95]),
    (39, "/images/practical/mgl-3/parasitology/rounded_eggs_comparison.webp", [0.0, 0.08, 1.0, 0.98]),
    (40, "/images/practical/mgl-3/parasitology/plugged_dshaped_eggs.webp", [0.0, 0.08, 1.0, 0.98]),
    (43, "/images/practical/mgl-3/parasitology/taenia_solium_scolex_spotter.webp", [0.0, 0.10, 1.0, 0.98]),
    (87, "/images/practical/mgl-3/parasitology/clinical_case_1_hydatid.webp", [0.0, 0.08, 1.0, 0.98]),
    (88, "/images/practical/mgl-3/parasitology/clinical_case_2_strongyloides.webp", [0.0, 0.08, 1.0, 0.98]),
    (89, "/images/practical/mgl-3/parasitology/clinical_case_3_schistosoma.webp", [0.0, 0.08, 1.0, 0.98]),
    (90, "/images/practical/mgl-3/parasitology/clinical_case_4_ascaris.webp", [0.0, 0.08, 1.0, 0.98]),
    (91, "/images/practical/mgl-3/parasitology/clinical_case_5_cryptosporidium.webp", [0.0, 0.08, 1.0, 0.98]),
    (92, "/images/practical/mgl-3/parasitology/clinical_case_6_giardia.webp", [0.0, 0.08, 1.0, 0.98]),
    (93, "/images/practical/mgl-3/parasitology/clinical_case_7_fasciola.webp", [0.0, 0.08, 1.0, 0.98]),
    (94, "/images/practical/mgl-3/parasitology/clinical_case_8_enterobius.webp", [0.0, 0.08, 1.0, 0.98]),
    (95, "/images/practical/mgl-3/parasitology/clinical_case_9_entamoeba.webp", [0.0, 0.08, 1.0, 0.98]),
    (98, "/images/practical/mgl-3/parasitology/clinical_case_12_hookworm.webp", [0.0, 0.08, 1.0, 0.98]),
]

for p_num, rel_path, crop in para_specs:
    img, _ = render_page(PARA_PDF, p_num)
    W, H = img.size
    img_crop = img.crop((int(crop[0]*W), int(crop[1]*H), int(crop[2]*W), int(crop[3]*H)))
    save_webp(img_crop, rel_path)

print("\n✓ Successfully extracted and converted all practical assets!")

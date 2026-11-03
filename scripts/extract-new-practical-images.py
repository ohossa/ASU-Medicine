import os
import fitz
from PIL import Image

PDF_PATH = "/Users/omarhossa/Downloads/All Practical GIT.pdf"
doc = fitz.open(PDF_PATH)

def extract_and_save(page_no, target_path, bbox_norm=None, min_w=150, min_h=150, rotate=0):
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    page = doc[page_no - 1]
    
    if bbox_norm is not None:
        # Render specific crop of page
        rect = page.rect
        crop = fitz.Rect(
            rect.width * bbox_norm[0],
            rect.height * bbox_norm[1],
            rect.width * bbox_norm[2],
            rect.height * bbox_norm[3]
        )
        pix = page.get_pixmap(clip=crop, dpi=180)
        im = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    else:
        # Extract best embedded image
        imgs = page.get_images()
        best_img = None
        max_res = 0
        for img in imgs:
            xref = img[0]
            bi = doc.extract_image(xref)
            w, h = bi['width'], bi['height']
            if w >= min_w and h >= min_h and w * h > max_res:
                max_res = w * h
                best_img = bi
        
        if best_img is not None:
            import io
            im = Image.open(io.BytesIO(best_img['image']))
            if im.mode != "RGB":
                im = im.convert("RGB")
        else:
            # Fallback to rendering page
            pix = page.get_pixmap(dpi=150)
            im = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    if rotate != 0:
        im = im.rotate(rotate, expand=True)

    # Save as optimized WebP
    im.save(target_path, "WEBP", quality=85, method=6)
    size_kb = os.path.getsize(target_path) / 1024
    print(f"Saved: {target_path} ({im.size[0]}x{im.size[1]}, {size_kb:.1f} KB)")

print("=== 1. Extracting Microbiology Practical Images ===")
micro_items = [
    # (page, path, bbox_norm, min_w, min_h)
    (1216, "public/images/practical/mgl-3/microbiology/macconkey_lf_nlf.webp", [0.08, 0.40, 0.92, 0.92]),
    (1204, "public/images/practical/mgl-3/microbiology/gram_negative_bacilli.webp", [0.20, 0.35, 0.80, 0.88]),
    (1246, "public/images/practical/mgl-3/microbiology/gram_positive_staph.webp", None, 200, 200),
    (1232, "public/images/practical/mgl-3/microbiology/tsi_reactions_comparison.webp", [0.15, 0.30, 0.85, 0.90]),
    (1226, "public/images/practical/mgl-3/microbiology/oxidase_test_reaction.webp", [0.05, 0.35, 0.95, 0.92]),
    (1225, "public/images/practical/mgl-3/microbiology/tcbs_cholera_colonies.webp", [0.10, 0.35, 0.90, 0.90]),
    (1209, "public/images/practical/mgl-3/microbiology/stewart_cary_blair_transport.webp", [0.10, 0.30, 0.90, 0.90]),
    (1264, "public/images/practical/mgl-3/microbiology/widal_slide_agglutination.webp", [0.05, 0.25, 0.95, 0.85]),
    (1267, "public/images/practical/mgl-3/microbiology/widal_tube_titration.webp", [0.05, 0.25, 0.95, 0.85]),
    (1254, "public/images/practical/mgl-3/microbiology/urease_test_reaction.webp", [0.10, 0.30, 0.90, 0.90]),
    (1247, "public/images/practical/mgl-3/microbiology/mannitol_salt_agar.webp", [0.10, 0.25, 0.90, 0.90]),
    (1255, "public/images/practical/mgl-3/microbiology/salmonella_slide_agglutination.webp", [0.10, 0.25, 0.90, 0.85])
]

for p, path, bbox, *rest in micro_items:
    extract_and_save(p, path, bbox)

print("\n=== 2. Extracting Biochemistry Practical Images ===")
biochem_items = [
    (1102, "public/images/practical/mgl-3/biochemistry/kayser_fleischer_ring.webp", [0.45, 0.35, 0.95, 0.90]),
    (1104, "public/images/practical/mgl-3/biochemistry/wilson_mri_basal_ganglia.webp", [0.15, 0.25, 0.85, 0.90]),
    (1175, "public/images/practical/mgl-3/biochemistry/spectrophotometer_tubes_b_s_t.webp", [0.10, 0.25, 0.90, 0.90]),
    (1184, "public/images/practical/mgl-3/biochemistry/vandenbergh_reaction_tubes.webp", [0.10, 0.25, 0.90, 0.90]),
    (1147, "public/images/practical/mgl-3/biochemistry/bmi_whr_body_composition.webp", [0.05, 0.20, 0.95, 0.90]),
    (1167, "public/images/practical/mgl-3/biochemistry/liver_cirrhosis_ascites_edema.webp", [0.10, 0.20, 0.90, 0.90]),
    (1172, "public/images/practical/mgl-3/biochemistry/spectrophotometer_cuvette_setup.webp", [0.10, 0.25, 0.90, 0.90]),
    (1183, "public/images/practical/mgl-3/biochemistry/jaundice_metabolism_pathway.webp", [0.05, 0.20, 0.95, 0.90]),
    (1188, "public/images/practical/mgl-3/biochemistry/liver_enzymes_alt_alp.webp", [0.05, 0.20, 0.95, 0.90]),
    (1144, "public/images/practical/mgl-3/biochemistry/caloric_activity_sheet.webp", [0.05, 0.15, 0.95, 0.90])
]

for p, path, bbox in biochem_items:
    extract_and_save(p, path, bbox)

print("\n=== 3. Extracting Physiology Practical Images ===")
physio_items = [
    (933, "public/images/practical/mgl-3/physiology/barium_swallow_bird_beak.webp", [0.50, 0.20, 0.98, 0.95]),
    (949, "public/images/practical/mgl-3/physiology/esophageal_manometry_tracing.webp", [0.10, 0.25, 0.90, 0.90]),
    (938, "public/images/practical/mgl-3/physiology/zenker_diverticulum_barium.webp", [0.50, 0.20, 0.98, 0.95]),
    (956, "public/images/practical/mgl-3/physiology/gerd_ph_monitoring_tracing.webp", [0.10, 0.25, 0.90, 0.90]),
    (1033, "public/images/practical/mgl-3/physiology/gastric_emptying_curves.webp", [0.10, 0.20, 0.90, 0.90]),
    (1045, "public/images/practical/mgl-3/physiology/vomiting_reflex_pathway.webp", [0.10, 0.20, 0.90, 0.90]),
    (960, "public/images/practical/mgl-3/physiology/parietal_cell_acid_secretion.webp", [0.10, 0.20, 0.90, 0.90]),
    (1080, "public/images/practical/mgl-3/physiology/sglt1_glucose_absorption.webp", [0.10, 0.20, 0.90, 0.90]),
    (985, "public/images/practical/mgl-3/physiology/bile_salts_micelle_emulsification.webp", [0.10, 0.20, 0.90, 0.90]),
    (1078, "public/images/practical/mgl-3/physiology/iron_ferroportin_hepcidin.webp", [0.10, 0.20, 0.90, 0.90]),
    (947, "public/images/practical/mgl-3/physiology/swallowing_stages_coordination.webp", [0.10, 0.20, 0.90, 0.90]),
    (1088, "public/images/practical/mgl-3/physiology/colonic_scfa_fermentation.webp", [0.10, 0.20, 0.90, 0.90])
]

for p, path, bbox in physio_items:
    extract_and_save(p, path, bbox)

print("\n=== 4. Extracting Clinical Practical Images ===")
clinical_items = [
    (1275, "public/images/practical/mgl-3/clinical/case_presentation_gerd_pud.webp", [0.08, 0.20, 0.92, 0.90]),
    (1286, "public/images/practical/mgl-3/clinical/gerd_erosive_esophagitis_endoscopy.webp", [0.10, 0.25, 0.90, 0.90]),
    (1287, "public/images/practical/mgl-3/clinical/endoscopy_gastric_vs_duodenal_ulcer.webp", [0.10, 0.25, 0.90, 0.90]),
    (1292, "public/images/practical/mgl-3/clinical/perforated_peptic_ulcer_xray.webp", [0.10, 0.25, 0.90, 0.90]),
    (1288, "public/images/practical/mgl-3/clinical/urea_breath_test_device.webp", [0.10, 0.25, 0.90, 0.90]),
    (1300, "public/images/practical/mgl-3/clinical/stigmata_chronic_liver_disease.webp", [0.10, 0.20, 0.90, 0.90]),
    (1305, "public/images/practical/mgl-3/clinical/esophageal_varices_endoscopy.webp", [0.10, 0.20, 0.90, 0.90]),
    (1312, "public/images/practical/mgl-3/clinical/viral_hepatitis_phases_chart.webp", [0.10, 0.20, 0.90, 0.90]),
    (1319, "public/images/practical/mgl-3/clinical/portal_hypertension_collaterals.webp", [0.10, 0.20, 0.90, 0.90]),
    (1289, "public/images/practical/mgl-3/clinical/pud_acid_suppression_algorithm.webp", [0.10, 0.20, 0.90, 0.90])
]

for p, path, bbox in clinical_items:
    extract_and_save(p, path, bbox)

print("\n=== 5. Extracting Pathology Practical Images ===")
path_items = [
    (528, "public/images/practical/mgl-3/pathology/peptic_ulcer_gross_punched_out.webp", [0.05, 0.20, 0.95, 0.90]),
    (532, "public/images/practical/mgl-3/pathology/malignant_gastric_ulcer_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (529, "public/images/practical/mgl-3/pathology/linitis_plastica_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (552, "public/images/practical/mgl-3/pathology/micronodular_cirrhosis_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (573, "public/images/practical/mgl-3/pathology/macronodular_cirrhosis_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (556, "public/images/practical/mgl-3/pathology/cirrhosis_with_hcc_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (595, "public/images/practical/mgl-3/pathology/chronic_cholecystitis_gallstones_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (597, "public/images/practical/mgl-3/pathology/meckel_diverticulum_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (598, "public/images/practical/mgl-3/pathology/typhoid_ulcers_ileum_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (599, "public/images/practical/mgl-3/pathology/tuberculous_ulcers_ileum_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (612, "public/images/practical/mgl-3/pathology/acute_appendicitis_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (616, "public/images/practical/mgl-3/pathology/colorectal_annular_carcinoma_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (622, "public/images/practical/mgl-3/pathology/colorectal_fungating_carcinoma_gross.webp", [0.05, 0.20, 0.95, 0.90]),
    (505, "public/images/practical/mgl-3/pathology/juvenile_retention_polyp_micro.webp", [0.05, 0.20, 0.95, 0.90]),
    (510, "public/images/practical/mgl-3/pathology/tubular_adenoma_colon_micro.webp", [0.05, 0.20, 0.95, 0.90]),
    (511, "public/images/practical/mgl-3/pathology/villous_adenoma_colon_micro.webp", [0.05, 0.20, 0.95, 0.90]),
    (513, "public/images/practical/mgl-3/pathology/colorectal_adenocarcinoma_micro.webp", [0.05, 0.20, 0.95, 0.90]),
    (517, "public/images/practical/mgl-3/pathology/mucinous_adenocarcinoma_micro.webp", [0.05, 0.20, 0.95, 0.90]),
    (483, "public/images/practical/mgl-3/pathology/chronic_active_hepatitis_micro.webp", [0.05, 0.20, 0.95, 0.90]),
    (615, "public/images/practical/mgl-3/pathology/amoebic_ulcers_colon_gross.webp", [0.05, 0.20, 0.95, 0.90])
]

for p, path, bbox in path_items:
    extract_and_save(p, path, bbox)

print("\n--- Image extraction finished successfully! ---")

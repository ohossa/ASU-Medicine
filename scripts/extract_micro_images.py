import fitz
import os
from PIL import Image

pdf_path = "/Users/omarhossa/.gemini/antigravity/brain/437081a4-16d9-4939-aa9a-e4a3e6361a00/.user_uploaded/media_1793966289608_e22fbc07.pdf"
out_dir = "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/public/images/practical/mgl-3/microbiology"
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)

# Map page index (0-based) to target filename and crop rect [x0, y0, x1, y1] (with padding)
# If crop rect is None, it uses the auto-detected image bbox + padding
crops = {
    1: ("micro_q01_gram_negative_bacilli.webp", [490, 160, 885, 395]),          # p2: Q1, Q6, Q7
    2: ("micro_q02_shigella_biochemical_panel.webp", [330, 150, 900, 400]),     # p3: Q2, Q3
    4: ("micro_q04_ehec_biochemical_panel.webp", [430, 165, 930, 310]),         # p5: Q4, Q5
    8: ("micro_q08_vibrio_tcbs.webp", [535, 140, 855, 485]),                   # p9: Q8, Q9, Q10, Q11
    12: ("micro_q12_macconkey_lactose_fermenting.webp", [665, 135, 870, 325]), # p13: Q12, Q14
    13: ("micro_q13_macconkey_and_gram.webp", [50, 135, 870, 535]),            # p14: Q13
    15: ("micro_q15_staph_blood_msa.webp", [340, 240, 955, 385]),              # p16: Q15
    16: ("micro_q16_staph_phage_typing.webp", [445, 225, 935, 425]),           # p17: Q16
    17: ("micro_q17_staph_msa_yellow.webp", [580, 160, 950, 330]),             # p18: Q17, Q32
    19: ("micro_q19_paratyphi_b_biochemical.webp", [545, 170, 860, 360]),      # p20: Q19 (Citrate +ve blue)
    20: ("micro_q20_salmonella_typhi_biochemical.webp", [540, 170, 880, 375]),  # p21: Q20, Q34 (Citrate -ve green)
    23: ("micro_q23_selenite_dca.webp", [725, 150, 875, 435]),                  # p24: Q23, Q24
    25: ("micro_q25_qualitative_widal.webp", [440, 140, 860, 325]),            # p26: Q25
    26: ("micro_q26_quantitative_widal_titer.webp", [265, 105, 955, 345]),      # p27: Q26, Q27 (includes 1/160 arrow)
    28: ("micro_q28_stool_container.webp", [665, 125, 880, 335]),              # p29: Q28, Q29, Q36
    31: ("micro_q31_staph_gram_stain.webp", [460, 180, 785, 445]),              # p32: Q31
    33: ("micro_q33_vibrio_gram_stain.webp", [530, 180, 890, 370]),            # p34: Q33
    38: ("micro_q38_enrichment_fluid_medium.webp", [705, 170, 845, 325]),       # p39: Q38
}

dpi = 200 # high crisp resolution
scale = dpi / 72.0

for page_idx, (fname, rect) in crops.items():
    page = doc[page_idx]
    clip_rect = fitz.Rect(rect[0], rect[1], rect[2], rect[3])
    pix = page.get_pixmap(dpi=dpi, clip=clip_rect)
    
    out_path = os.path.join(out_dir, fname)
    # Save with PIL to ensure high-quality webp
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    img.save(out_path, "WEBP", quality=92)
    print(f"Extracted {fname} ({pix.width}x{pix.height})")

print("All microbiology images extracted successfully.")

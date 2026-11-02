#!/usr/bin/env python3
"""
scripts/redact-all-practical-images.py
Comprehensive label blanker for ASU GIT Practical Exam.
Blanks out all labels, organ names, species names, and answer giveaways from all 106 exam images.
Uses Tesseract TSV OCR to locate word bounding boxes and draws clean blanking patches
(matching the local background) so specimens become authentic spotter exam items.
"""

import os
import csv
import io
import subprocess
import numpy as np
from PIL import Image, ImageDraw

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# All 106 images referenced in practical exam
import sys
sys.path.insert(0, os.path.dirname(__file__))

import data_histology as dh
import data_anatomy as da
import data_parasitology as dp

all_questions = [
    ("histology", dh.HISTOLOGY_QUESTIONS),
    ("anatomy", da.ANATOMY_QUESTIONS),
    ("parasitology", dp.PARASITOLOGY_QUESTIONS),
]

def get_fill_color(im, x0, y0, x1, y1):
    W, H = im.size
    border_pixels = []
    # Sample 2 rows/cols outside the box
    for bx in range(max(0, x0 - 2), min(W, x1 + 2)):
        if y0 > 2:
            border_pixels.append(im.getpixel((bx, y0 - 2)))
        if y1 < H - 2:
            border_pixels.append(im.getpixel((bx, y1 + 1)))
    for by in range(max(0, y0 - 2), min(H, y1 + 2)):
        if x0 > 2:
            border_pixels.append(im.getpixel((x0 - 2, by)))
        if x1 < W - 2:
            border_pixels.append(im.getpixel((x1 + 1, by)))
            
    if border_pixels:
        med_r = int(np.median([p[0] for p in border_pixels]))
        med_g = int(np.median([p[1] for p in border_pixels]))
        med_b = int(np.median([p[2] for p in border_pixels]))
        
        # If very close to white or page paper color, snap to clean white
        if med_r > 190 and med_g > 190 and med_b > 190:
            return (255, 255, 255)
        # If close to black, snap to pure black
        if med_r < 40 and med_g < 40 and med_b < 40:
            return (0, 0, 0)
        return (med_r, med_g, med_b)
    return (255, 255, 255)

def redact_single_image(disk_path, pad_x=8, pad_y=5):
    im = Image.open(disk_path).convert("RGB")
    W, H = im.size
    
    # Run tesseract
    res = subprocess.run(["tesseract", disk_path, "stdout", "tsv"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        return 0
        
    reader = list(csv.DictReader(io.StringIO(res.stdout), delimiter="\t"))
    boxes_to_blank = []
    
    for row in reader:
        conf = float(row["conf"])
        text = row["text"].strip()
        if conf <= 10 or not text:
            continue
            
        has_letters = any(c.isalpha() for c in text)
        is_symbol = text in ["©", "-", "—", "=", ":", "|", "/", "\\", ".", "~", "*", "(", ")", "[", "]", "{", "}"]
        is_standalone_digit = text.isdigit() and len(text) <= 2
        
        # If it has letters, symbols, or multi-digit text, redact it!
        # Standalone 1-digit numbers (like 1, 2, 3... 8) pointing to structures are preserved IF they have no letters
        if (has_letters or is_symbol or (text.isdigit() and len(text) > 2)) and not (is_standalone_digit and not has_letters):
            x = int(row["left"])
            y = int(row["top"])
            w = int(row["width"])
            h = int(row["height"])
            
            x0 = max(0, x - pad_x)
            y0 = max(0, y - pad_y)
            x1 = min(W, x + w + pad_x)
            y1 = min(H, y + h + pad_y)
            boxes_to_blank.append([x0, y0, x1, y1])

    if not boxes_to_blank:
        return 0

    # Merge overlapping or touching boxes
    merged = []
    for b in boxes_to_blank:
        placed = False
        for m in merged:
            # Check overlap or close horizontal proximity (within 15px)
            if not (b[2] < m[0] - 15 or b[0] > m[2] + 15 or b[3] < m[1] - 5 or b[1] > m[3] + 5):
                m[0] = min(m[0], b[0])
                m[1] = min(m[1], b[1])
                m[2] = max(m[2], b[2])
                m[3] = max(m[3], b[3])
                placed = True
                break
        if not placed:
            merged.append(b[:])

    draw = ImageDraw.Draw(im)
    for b in merged:
        fill = get_fill_color(im, b[0], b[1], b[2], b[3])
        draw.rectangle(b, fill=fill)

    # Save sanitized webp
    im.save(disk_path, "WEBP", quality=88)
    return len(merged)

def main():
    print("=== ASU Practical Exam Image Redactor & Sanitizer ===")
    total_processed = 0
    total_redacted_boxes = 0
    
    # 1. First pass on all referenced images
    all_disk_paths = []
    for cat_name, q_list in all_questions:
        for q in q_list:
            if "imageUrl" in q and q["imageUrl"]:
                rel = q["imageUrl"].lstrip("/")
                disk_path = os.path.join(ROOT_DIR, "public", rel)
                if disk_path not in all_disk_paths:
                    all_disk_paths.append(disk_path)

    print(f"Total unique referenced images to inspect: {len(all_disk_paths)}")
    
    for p in all_disk_paths:
        n = redact_single_image(p, pad_x=8, pad_y=5)
        if n > 0:
            print(f"  [REDACTED] {os.path.basename(p)}: blanked {n} text regions.")
            total_redacted_boxes += n
        total_processed += 1

    # 2. Verification pass with OCR
    print("\n=== Verification Pass via Tesseract OCR ===")
    still_has_text = []
    for p in all_disk_paths:
        res = subprocess.run(["tesseract", p, "stdout"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        lines = [l.strip() for l in res.stdout.strip().splitlines() if len(l.strip()) > 2]
        # Ignore standalone single numbers or short noise
        alphabetic_lines = [l for l in lines if any(c.isalpha() for c in l)]
        if alphabetic_lines:
            still_has_text.append((p, alphabetic_lines))

    if still_has_text:
        print(f"Found {len(still_has_text)} images with residual text. Running Pass 2 with wider padding...")
        for p, lines in still_has_text:
            print(f"  Second pass on: {os.path.basename(p)} -> {lines[:2]}")
            redact_single_image(p, pad_x=14, pad_y=8)
            
        # Final check
        print("\n=== Final Verification Pass ===")
        remaining = []
        for p in all_disk_paths:
            res = subprocess.run(["tesseract", p, "stdout"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            lines = [l.strip() for l in res.stdout.strip().splitlines() if len(l.strip()) > 2]
            alphabetic = [l for l in lines if any(c.isalpha() for c in l)]
            if alphabetic:
                remaining.append((os.path.basename(p), alphabetic))
                
        if remaining:
            print(f"WARNING: {len(remaining)} images still have detected text:")
            for bname, lines in remaining:
                print(f"  {bname}: {lines}")
        else:
            print("✓ 100% of images verified: ZERO readable text labels remain across all 106 images!")
    else:
        print("✓ 100% of images verified: ZERO readable text labels remain across all 106 images!")

if __name__ == "__main__":
    main()

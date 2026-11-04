#!/usr/bin/env python3
"""
ASU Medicine — Brand Assets & Social Preview Generator
Generates:
  - public/favicon.svg
  - public/favicon.png, public/favicon.webp (32x32)
  - public/favicon-192.png, public/favicon-192.webp (192x192)
  - public/favicon-512.png, public/favicon-512.webp (512x512)
  - public/asu-medicine-logo.webp
  - public/social-preview.png, public/social-preview.webp (1200x630)
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))

# --- 1. Generate Favicon SVG ---
FAVICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#1c1917" />
      <stop offset="100%" stop-color="#09090b" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8d5b7" />
      <stop offset="50%" stop-color="#c9b8a0" />
      <stop offset="100%" stop-color="#a78b71" />
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(232, 213, 183, 0.6)" />
      <stop offset="100%" stop-color="rgba(167, 139, 113, 0.2)" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="16" y="16" width="480" height="480" rx="120" fill="url(#bgGlow)" stroke="url(#borderGrad)" stroke-width="8" />

  <!-- Monogram Glyph: Interlocking ASU with Pulse Electrocardiogram Line -->
  <g id="asu-monogram" filter="url(#glow)">
    <!-- A -->
    <path d="M120 340 L190 160 L260 340 M145 285 L235 285" fill="none" stroke="url(#goldGrad)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" />
    <!-- S -->
    <path d="M340 180 C340 160, 310 155, 290 165 C260 180, 260 215, 295 230 C335 245, 345 280, 315 305 C285 325, 250 310, 250 290" fill="none" stroke="url(#goldGrad)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" />
    <!-- U -->
    <path d="M350 160 L350 270 C350 320, 420 320, 420 270 L420 160" fill="none" stroke="url(#goldGrad)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Heartbeat / ECG Rhythm Accent -->
    <path d="M80 380 L180 380 L200 340 L220 420 L245 360 L265 395 L280 380 L440 380" fill="none" stroke="#10b981" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />
  </g>
</svg>
"""

def generate_raster_icons():
    # Base Master High-Res Icon (512x512)
    img512 = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img512)

    # Squircle background
    bg_color = (9, 9, 11, 255)
    border_color = (201, 184, 160, 160)
    draw.rounded_rectangle([(16, 16), (496, 496)], radius=120, fill=bg_color, outline=border_color, width=8)

    # Draw inner subtle gradient glow
    glow = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([(140, 100), (370, 330)], fill=(167, 139, 113, 40))
    glow = glow.filter(ImageFilter.GaussianBlur(40))
    img512.alpha_composite(glow)

    draw = ImageDraw.Draw(img512)

    gold = (201, 184, 160, 255)
    emerald = (16, 185, 129, 255)

    # Draw A
    draw.line([(125, 335), (195, 165)], fill=gold, width=26)
    draw.line([(195, 165), (265, 335)], fill=gold, width=26)
    draw.line([(150, 280), (240, 280)], fill=gold, width=22)

    # Draw S
    draw.arc([(260, 155), (330, 235)], start=160, end=380, fill=gold, width=26)
    draw.arc([(255, 225), (335, 315)], start=0, end=210, fill=gold, width=26)

    # Draw U
    draw.line([(355, 165), (355, 260)], fill=gold, width=26)
    draw.line([(415, 165), (415, 260)], fill=gold, width=26)
    draw.arc([(355, 215), (415, 315)], start=0, end=180, fill=gold, width=26)

    # Draw ECG Rhythm
    ecg_points = [
        (85, 385), (185, 385),
        (205, 345), (225, 425),
        (250, 365), (270, 400),
        (285, 385), (435, 385)
    ]
    for i in range(len(ecg_points) - 1):
        draw.line([ecg_points[i], ecg_points[i+1]], fill=emerald, width=12)

    # Save 512
    img512.save(os.path.join(OUTPUT_DIR, "favicon-512.png"), "PNG")
    img512.save(os.path.join(OUTPUT_DIR, "favicon-512.webp"), "WEBP", quality=95)
    img512.save(os.path.join(OUTPUT_DIR, "asu-medicine-logo.webp"), "WEBP", quality=95)

    # Resize and save 192
    img192 = img512.resize((192, 192), Image.Resampling.LANCZOS)
    img192.save(os.path.join(OUTPUT_DIR, "favicon-192.png"), "PNG")
    img192.save(os.path.join(OUTPUT_DIR, "favicon-192.webp"), "WEBP", quality=95)

    # Resize and save 32 (Favicon)
    img32 = img512.resize((32, 32), Image.Resampling.LANCZOS)
    img32.save(os.path.join(OUTPUT_DIR, "favicon.png"), "PNG")
    img32.save(os.path.join(OUTPUT_DIR, "favicon.webp"), "WEBP", quality=95)

    print("✅ Icons & Favicons generated successfully.")


def generate_social_preview():
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), (9, 9, 11, 255))
    draw = ImageDraw.Draw(img)

    # 1. Radial Background Grid Dots (32px spacing)
    dot_color = (255, 255, 255, 18)
    for y in range(0, H, 32):
        for x in range(0, W, 32):
            draw.ellipse([(x, y), (x + 2, y + 2)], fill=dot_color)

    # 2. Golden Ambient Glow (Behind Logo)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([(80, 120), (480, 520)], fill=(167, 139, 113, 60))
    glow_draw.ellipse([(600, 50), (1100, 450)], fill=(45, 212, 191, 30))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    img.alpha_composite(glow)

    draw = ImageDraw.Draw(img)

    # 3. Paste high-res icon insignia
    icon512 = Image.open(os.path.join(OUTPUT_DIR, "favicon-512.png")).convert("RGBA")
    icon240 = icon512.resize((220, 220), Image.Resampling.LANCZOS)
    img.alpha_composite(icon240, (90, 195))

    # 4. Fonts
    font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18, index=0)
    font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 54, index=1)
    font_sub = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 23, index=0)
    font_badge = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16, index=1)
    font_url = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20, index=1)

    # 5. Right Content Layout
    content_x = 360

    # Pre-header (Eyebrow)
    eyebrow_text = "AIN SHAMS UNIVERSITY · FACULTY OF MEDICINE"
    draw.text((content_x, 155), eyebrow_text, font=font_small, fill=(201, 184, 160, 255))

    # Main Title
    title_text = "ASU Medicine Portal"
    draw.text((content_x, 190), title_text, font=font_title, fill=(255, 255, 255, 255))

    # Subtitle
    sub_text = "Official Academic Examination & Question Bank System"
    draw.text((content_x, 265), sub_text, font=font_sub, fill=(161, 161, 170, 255))

    # 6. Feature Badges (Pills)
    badges = [
        "42 Integrated Modules",
        "12,800+ Verified MCQs",
        "Years 1 to 5 Curriculum",
        "Clinical Spotter Simulator"
    ]

    pill_y = 330
    cur_x = content_x
    for badge in badges:
        bbox = draw.textbbox((0, 0), badge, font=font_badge)
        bw = bbox[2] - bbox[0] + 32
        bh = 38
        if cur_x + bw > W - 60:
            cur_x = content_x
            pill_y += 50

        # Pill background
        draw.rounded_rectangle([(cur_x, pill_y), (cur_x + bw, pill_y + bh)], radius=19, fill=(24, 24, 27, 220), outline=(63, 63, 70, 180), width=1)
        # Dot indicator
        draw.ellipse([(cur_x + 12, pill_y + 15), (cur_x + 20, pill_y + 23)], fill=(16, 185, 129, 255))
        # Text
        draw.text((cur_x + 26, pill_y + 10), badge, font=font_badge, fill=(228, 228, 231, 255))
        cur_x += bw + 14

    # 7. Bottom Bar with Live Link
    draw.line([(content_x, 465), (W - 90, 465)], fill=(63, 63, 70, 120), width=1)

    draw.ellipse([(content_x, 498), (content_x + 10, 508)], fill=(16, 185, 129, 255))
    draw.text((content_x + 18, 492), "LIVE SYSTEM · AUTHENTIC FACULTY BLUEPRINTS", font=font_small, fill=(16, 185, 129, 255))
    draw.text((W - 240, 492), "https://asu.codes", font=font_url, fill=(201, 184, 160, 255))

    # Save
    img.save(os.path.join(OUTPUT_DIR, "social-preview.png"), "PNG")
    img.save(os.path.join(OUTPUT_DIR, "social-preview.webp"), "WEBP", quality=95)
    print("✅ Social Preview Banner (1200x630) generated successfully.")

if __name__ == "__main__":
    with open(os.path.join(OUTPUT_DIR, "favicon.svg"), "w") as f:
        f.write(FAVICON_SVG)
    print("✅ public/favicon.svg created.")
    generate_raster_icons()
    generate_social_preview()

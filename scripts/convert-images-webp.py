#!/usr/bin/env python3
"""
Convert portal visual assets to next-generation WebP format.
Optimizes asset loading and eliminates network payload overhead.
"""
import os
import sys
from PIL import Image

def convert():
    images = [
        'public/social-preview.png',
        'public/luro-anki-logo.png',
        'public/favicon-512.png',
        'public/favicon-192.png',
        'public/favicon.png',
    ]

    for img_path in images:
        if os.path.exists(img_path):
            out_path = os.path.splitext(img_path)[0] + '.webp'
            im = Image.open(img_path)
            im.save(out_path, 'WEBP', quality=85, method=6)
            orig_sz = os.path.getsize(img_path)
            new_sz = os.path.getsize(out_path)
            reduction = (1 - new_sz / orig_sz) * 100
            print(f"✅ {img_path} ({orig_sz // 1024} KB) -> {out_path} ({new_sz // 1024} KB) [-{reduction:.1f}%]")

if __name__ == '__main__':
    convert()

import os
import ssl
import json
import hashlib
import urllib.request
import io
from PIL import Image
from bs4 import BeautifulSoup

ctx = ssl._create_unverified_context()

BASE_IMG_DIR = "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/public/images/practical/mgl-3"

forms = [
    ("parasitology", "para", "https://docs.google.com/forms/d/e/1FAIpQLSd8CsAKtwgipRMf6G-gw13ZrmxKV6KNKjZ_-2sNK55GXAz_1w/viewform"),
    ("histology", "histo1", "https://docs.google.com/forms/d/e/1FAIpQLScqZlg0_3jSsvuUaa_RWCTg2lP3PXpQSeGDBGtUGVMCgzqhCA/viewform"),
    ("histology", "histo2", "https://docs.google.com/forms/d/e/1FAIpQLSehLoDS7IDSU866G6wfrk8O6-jRedgIwA2e-Ms57oBrZkX90A/viewform"),
    ("pathology/museum", "patho_mus", "https://docs.google.com/forms/d/e/1FAIpQLSfWZXRKSwH07XqNxS9Vv37S6xz5Wkz85BicB5TQ39PRSbt6Bw/viewform"),
    ("pathology/lab", "patho_lab", "https://docs.google.com/forms/d/e/1FAIpQLSetktRo1q472I7DFqcZv5qZ62Qz9GbPSB7XjoAWn4VkcrHXLQ/viewform"),
    ("anatomy", "anat1", "https://docs.google.com/forms/d/e/1FAIpQLSeh420E2odDq3p4Ija8BAGRXAn85TvCgcwcOdsguAhWYR2vzA/viewform"),
    ("anatomy", "anat2", "https://docs.google.com/forms/d/e/1FAIpQLScqneDagIyGlX309dK4eOkYFwtBpQ1JaARuVBv_LvEjwYAVWQ/viewform"),
    ("anatomy", "anat3", "https://docs.google.com/forms/d/e/1FAIpQLScuhArAss0BUF_8wZH8j5JQq5_1d7pFco_BZyq8THbiZvt8Iw/viewform"),
    ("anatomy", "anat4", "https://docs.google.com/forms/d/e/1FAIpQLSdrqI8xT2BNLO1i1p81NSEEnBE2Dv2iwNVMDo_ndnGsWCxeVw/viewform"),
]

# Cache of url -> saved relative path
downloaded_cache = {}

def download_and_optimize(url, subfolder, prefix):
    if url in downloaded_cache:
        return downloaded_cache[url]
        
    out_dir = os.path.join(BASE_IMG_DIR, subfolder)
    os.makedirs(out_dir, exist_ok=True)
    
    # Extract high-res by modifying =w parameter if present
    hi_res_url = re.sub(r"=w\d+", "=w1200", url)
    
    try:
        req = urllib.request.Request(hi_res_url, headers={"User-Agent": "Mozilla/5.0"})
        img_bytes = urllib.request.urlopen(req, context=ctx, timeout=15).read()
    except Exception as e:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            img_bytes = urllib.request.urlopen(req, context=ctx, timeout=15).read()
        except Exception as e2:
            print(f"Failed to download image {url}: {e2}")
            return None

    # Compute hash of raw bytes
    h = hashlib.sha256(img_bytes).hexdigest()[:12]
    filename = f"{prefix}_{h}.webp"
    filepath = os.path.join(out_dir, filename)
    rel_url = f"/images/practical/mgl-3/{subfolder}/{filename}"
    
    if not os.path.exists(filepath):
        try:
            pil_img = Image.open(io.BytesIO(img_bytes))
            if pil_img.mode in ("RGBA", "P"):
                pil_img = pil_img.convert("RGB")
            
            # Resize if width > 1100
            max_w = 1100
            if pil_img.width > max_w:
                new_h = int(pil_img.height * (max_w / pil_img.width))
                pil_img = pil_img.resize((max_w, new_h), Image.Resampling.LANCZOS)
                
            pil_img.save(filepath, "WEBP", quality=80, method=6)
        except Exception as e:
            print(f"Error converting image to webp: {e}")
            return None
            
    downloaded_cache[url] = rel_url
    return rel_url

print("Script ready.")

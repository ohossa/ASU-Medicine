import os
import ssl
import json
import hashlib
import urllib.request
import io
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
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

def fetch_form_raw(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    html = urllib.request.urlopen(req, context=ctx, timeout=20).read().decode("utf-8")
    return html

def parse_items_from_html(html):
    soup = BeautifulSoup(html, "html.parser")
    items = soup.find_all("div", attrs={"role": "listitem"})
    if not items:
        items = soup.find_all("div", class_="geS5n")
    
    parsed = []
    for item in items:
        heading = item.find("div", attrs={"role": "heading"}) or item.find("span", class_="M7eMe")
        title = heading.get_text(strip=True) if heading else ""
        if not title:
            continue
            
        q_img = item.find("img", class_="HxhGpf")
        if not q_img:
            gcouxf = item.find("div", class_="gCouxf")
            if gcouxf:
                q_img = gcouxf.find("img")
        q_src = q_img.get("src") if (q_img and q_img.get("src") and "forms-images-rt" in q_img.get("src")) else None
        
        options = []
        radios = item.find_all("div", attrs={"role": "radio"}) or item.find_all("div", attrs={"role": "checkbox"})
        if radios:
            for r in radios:
                label_elem = r.find_parent("label") or r
                text_elem = label_elem.find("span", dir="auto")
                label_text = text_elem.get_text(strip=True) if text_elem else r.get_text(strip=True)
                opt_img = label_elem.find("img")
                opt_src = opt_img.get("src") if (opt_img and opt_img.get("src") and "forms-images-rt" in opt_img.get("src")) else None
                options.append({"text": label_text, "image": opt_src})
        else:
            for lbl in item.find_all("label"):
                t = lbl.get_text(strip=True)
                img = lbl.find("img")
                img_src = img.get("src") if (img and img.get("src") and "forms-images-rt" in img.get("src")) else None
                if t or img_src:
                    options.append({"text": t, "image": img_src})
                    
        parsed.append({
            "title": title,
            "image": q_src,
            "options": options
        })
    return parsed

def download_one_image(task):
    url, subfolder, filename = task
    out_dir = os.path.join(BASE_IMG_DIR, subfolder)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, filename)
    rel_url = f"/images/practical/mgl-3/{subfolder}/{filename}"
    
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        return url, rel_url

    hi_res = re.sub(r"=w\d+", "=w1200", url)
    img_bytes = None
    for target_url in [hi_res, url]:
        try:
            req = urllib.request.Request(target_url, headers={"User-Agent": "Mozilla/5.0"})
            img_bytes = urllib.request.urlopen(req, context=ctx, timeout=15).read()
            if img_bytes:
                break
        except Exception:
            continue
            
    if not img_bytes:
        return url, None
        
    try:
        im = Image.open(io.BytesIO(img_bytes))
        if im.mode in ("RGBA", "P"):
            im = im.convert("RGB")
        max_w = 1100
        if im.width > max_w:
            new_h = int(im.height * (max_w / im.width))
            im = im.resize((max_w, new_h), Image.Resampling.LANCZOS)
        im.save(out_path, "WEBP", quality=80, method=6)
        return url, rel_url
    except Exception as e:
        print(f"Error converting {filename}: {e}")
        return url, None

def run():
    all_tasks = []
    form_results = {}
    
    print("Fetching all Google Forms...")
    for subfolder, fid, url in forms:
        html = fetch_form_raw(url)
        items = parse_items_from_html(html)
        form_results[fid] = {"subfolder": subfolder, "items": items}
        print(f"[{fid}] Fetched {len(items)} items")
        
        # Schedule image downloads
        for q_idx, item in enumerate(items):
            if item["image"]:
                h = hashlib.sha256(item["image"].encode("utf-8")).hexdigest()[:10]
                fname = f"{fid}_q{q_idx+1}_{h}.webp"
                all_tasks.append((item["image"], subfolder, fname))
            for opt_idx, opt in enumerate(item["options"]):
                if opt["image"]:
                    h = hashlib.sha256(opt["image"].encode("utf-8")).hexdigest()[:10]
                    fname = f"{fid}_q{q_idx+1}_opt{opt_idx+1}_{h}.webp"
                    all_tasks.append((opt["image"], subfolder, fname))

    # Remove duplicates from tasks
    unique_tasks = {}
    for url, subfolder, fname in all_tasks:
        if url not in unique_tasks:
            unique_tasks[url] = (url, subfolder, fname)
            
    print(f"Total unique images to download: {len(unique_tasks)}")
    
    # Download with 16 threads
    url_to_rel_map = {}
    with ThreadPoolExecutor(max_workers=16) as pool:
        futures = {pool.submit(download_one_image, t): t for t in unique_tasks.values()}
        completed = 0
        for f in as_completed(futures):
            url, rel_path = f.result()
            if rel_path:
                url_to_rel_map[url] = rel_path
            completed += 1
            if completed % 50 == 0 or completed == len(unique_tasks):
                print(f"Downloaded & optimized {completed}/{len(unique_tasks)} images...")

    print("All images downloaded successfully!")
    
    # Save the parsed forms and url map to /tmp/raw_forms_with_images.json
    with open("/tmp/parsed_forms_with_images.json", "w", encoding="utf-8") as out_f:
        json.dump({"forms": form_results, "images": url_to_rel_map}, out_f, indent=2, ensure_ascii=False)
    print("Saved /tmp/parsed_forms_with_images.json")

if __name__ == "__main__":
    run()

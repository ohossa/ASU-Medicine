import os
import ssl
import json
import re
import urllib.request
import io
from PIL import Image
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed

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

def download_and_convert_webp(task):
    url, out_path = task
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        return url, out_path

    hi_res = re.sub(r"=w\d+", "=w1200", url)
    img_bytes = None
    for target in [hi_res, url]:
        try:
            req = urllib.request.Request(target, headers={"User-Agent": "Mozilla/5.0"})
            img_bytes = urllib.request.urlopen(req, context=ctx, timeout=20).read()
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
        # Resize if overly massive, maintaining aspect ratio
        max_dim = 1200
        if max(im.size) > max_dim:
            im.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        im.save(out_path, "WEBP", quality=82, method=6)
        return url, out_path
    except Exception as e:
        print(f"Error converting {url}: {e}")
        return url, None

def extract_all():
    master_records = {}
    download_tasks = []

    for subfolder, fid, url in forms:
        print(f"\nProcessing [{fid}] from {url}...")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        html = urllib.request.urlopen(req, context=ctx, timeout=25).read().decode("utf-8")

        # 1. Parse Canonical Questions from FB_PUBLIC_LOAD_DATA_
        match = re.search(r"FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);\s*</script>", html, re.DOTALL)
        if not match:
            print(f"ERROR: FB_PUBLIC_LOAD_DATA_ not found in {fid}")
            continue
        data = json.loads(match.group(1))
        canonical_items = data[1][1]

        # 2. Map DOM items by QID
        soup = BeautifulSoup(html, "html.parser")
        dom_items = soup.find_all("div", attrs={"role": "listitem"})
        qid_to_img_url = {}

        for it in dom_items:
            dp = it.find(attrs={"data-params": True})
            if not dp:
                continue
            val = dp["data-params"]
            if val.startswith("%.@."):
                val = val[4:]
            depth, end_idx = 0, 0
            for i, ch in enumerate(val):
                if ch == "[": depth += 1
                elif ch == "]":
                    depth -= 1
                    if depth == 0:
                        end_idx = i + 1; break
            dp_data = json.loads(val[:end_idx])
            qid = dp_data[0]
            imgs = [img["src"] for img in it.find_all("img") if "forms-images-rt" in img.get("src", "")]
            if imgs:
                qid_to_img_url[qid] = imgs[0]

        print(f"[{fid}] Canonical items: {len(canonical_items)}, DOM images mapped: {len(qid_to_img_url)}")

        # 3. Assemble Canonical Questions with exact bound image
        form_questions = []
        for idx, it in enumerate(canonical_items):
            qid = it[0]
            raw_title = it[1] or ""
            blob_info = it[9] if len(it) > 9 and it[9] else None
            blob_id = blob_info[0][0] if (blob_info and len(blob_info) > 0 and len(blob_info[0]) > 0) else None

            # Options
            options = []
            if len(it) > 4 and it[4]:
                for p in it[4]:
                    if len(p) > 1 and p[1]:
                        for o in p[1]:
                            opt_text = o[0] if o[0] is not None else ""
                            # clean leading letters
                            opt_clean = re.sub(r"^[A-E]\.\s*", "", opt_text).strip()
                            if opt_clean:
                                options.append(opt_clean)

            remote_img = qid_to_img_url.get(qid)
            local_rel_path = None
            if remote_img:
                filename = f"{fid}_{qid}.webp"
                local_abs_path = os.path.join(BASE_IMG_DIR, subfolder, filename)
                local_rel_path = f"/images/practical/mgl-3/{subfolder}/{filename}"
                download_tasks.append((remote_img, local_abs_path))

            form_questions.append({
                "qid": qid,
                "canonical_index": idx,
                "title": raw_title,
                "options": options,
                "blob_id": blob_id,
                "image_url": local_rel_path,
                "remote_image_url": remote_img
            })

        master_records[fid] = {
            "subfolder": subfolder,
            "questions": form_questions
        }

    # Deduplicate download tasks
    unique_tasks = {}
    for url, path in download_tasks:
        if path not in unique_tasks:
            unique_tasks[path] = (url, path)

    print(f"\nDownloading and converting {len(unique_tasks)} images in parallel...")
    with ThreadPoolExecutor(max_workers=16) as pool:
        futures = {pool.submit(download_and_convert_webp, t): t for t in unique_tasks.values()}
        completed = 0
        for f in as_completed(futures):
            f.result()
            completed += 1
            if completed % 50 == 0 or completed == len(unique_tasks):
                print(f"Downloaded {completed}/{len(unique_tasks)} images...")

    out_json = "scripts/canonical_practical_forms.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(master_records, f, indent=2, ensure_ascii=False)
    print(f"\nDone! Master canonical records saved to {out_json}")

if __name__ == "__main__":
    extract_all()

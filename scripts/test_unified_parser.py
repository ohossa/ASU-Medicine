import urllib.request
import ssl
import json
import re
from bs4 import BeautifulSoup

ctx = ssl._create_unverified_context()

def parse_google_form(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    html = urllib.request.urlopen(req, context=ctx).read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    
    # Each question is a div with class geS5n or role listitem
    items = soup.find_all("div", attrs={"role": "listitem"})
    if not items:
        items = soup.find_all("div", class_="geS5n")
    
    parsed_questions = []
    
    for idx, item in enumerate(items):
        # 1. Question Title / Stem
        heading = item.find("div", attrs={"role": "heading"})
        if not heading:
            # Fallback to class M7eMe
            heading = item.find("span", class_="M7eMe")
        title = heading.get_text(strip=True) if heading else ""
        if not title:
            continue
            
        # 2. Question Prompt Image (class HxhGpf or inside gCouxf)
        q_img_src = None
        prompt_img = item.find("img", class_="HxhGpf")
        if not prompt_img:
            # check inside div gCouxf
            gcouxf = item.find("div", class_="gCouxf")
            if gcouxf:
                prompt_img = gcouxf.find("img")
        if prompt_img and prompt_img.get("src") and "forms-images-rt" in prompt_img.get("src"):
            q_img_src = prompt_img.get("src")
            
        # 3. Options
        options = []
        # Find all radio options or labels
        radios = item.find_all("div", attrs={"role": "radio"})
        if not radios:
            # Check for checkboxes
            radios = item.find_all("div", attrs={"role": "checkbox"})
            
        if radios:
            for r in radios:
                # check for label text
                label_text = ""
                label_elem = r.find_parent("label") or r
                text_elem = label_elem.find("span", dir="auto")
                if text_elem:
                    label_text = text_elem.get_text(strip=True)
                else:
                    # try full text excluding image
                    label_text = r.get_text(strip=True)
                    
                # check for option image
                opt_img_src = None
                opt_img = label_elem.find("img")
                if opt_img and opt_img.get("src") and "forms-images-rt" in opt_img.get("src"):
                    opt_img_src = opt_img.get("src")
                    
                options.append({
                    "text": label_text,
                    "image": opt_img_src
                })
        else:
            # Check simple labels
            for lbl in item.find_all("label"):
                t = lbl.get_text(strip=True)
                img = lbl.find("img")
                img_src = img.get("src") if (img and img.get("src") and "forms-images-rt" in img.get("src")) else None
                if t or img_src:
                    options.append({
                        "text": t,
                        "image": img_src
                    })
                    
        parsed_questions.append({
            "index": len(parsed_questions) + 1,
            "title": title,
            "image": q_img_src,
            "options": options
        })
        
    return parsed_questions

forms = [
    ("para", "https://docs.google.com/forms/d/e/1FAIpQLSd8CsAKtwgipRMf6G-gw13ZrmxKV6KNKjZ_-2sNK55GXAz_1w/viewform"),
    ("physio", "https://docs.google.com/forms/d/e/1FAIpQLSdIcVGfuCWvHCfJWafgBR9yaHghQjWhhss-eR3Mwc1Um6Djzw/viewform"),
    ("histo1", "https://docs.google.com/forms/d/e/1FAIpQLScqZlg0_3jSsvuUaa_RWCTg2lP3PXpQSeGDBGtUGVMCgzqhCA/viewform"),
    ("histo2", "https://docs.google.com/forms/d/e/1FAIpQLSehLoDS7IDSU866G6wfrk8O6-jRedgIwA2e-Ms57oBrZkX90A/viewform"),
    ("patho_mus", "https://docs.google.com/forms/d/e/1FAIpQLSfWZXRKSwH07XqNxS9Vv37S6xz5Wkz85BicB5TQ39PRSbt6Bw/viewform"),
    ("patho_lab", "https://docs.google.com/forms/d/e/1FAIpQLSetktRo1q472I7DFqcZv5qZ62Qz9GbPSB7XjoAWn4VkcrHXLQ/viewform"),
    ("anat1", "https://docs.google.com/forms/d/e/1FAIpQLSeh420E2odDq3p4Ija8BAGRXAn85TvCgcwcOdsguAhWYR2vzA/viewform"),
    ("anat2", "https://docs.google.com/forms/d/e/1FAIpQLScqneDagIyGlX309dK4eOkYFwtBpQ1JaARuVBv_LvEjwYAVWQ/viewform"),
    ("anat3", "https://docs.google.com/forms/d/e/1FAIpQLScuhArAss0BUF_8wZH8j5JQq5_1d7pFco_BZyq8THbiZvt8Iw/viewform"),
    ("anat4", "https://docs.google.com/forms/d/e/1FAIpQLSdrqI8xT2BNLO1i1p81NSEEnBE2Dv2iwNVMDo_ndnGsWCxeVw/viewform"),
]

for fid, url in forms:
    qs = parse_google_form(url)
    img_count = sum(1 for q in qs if q["image"])
    opt_img_count = sum(sum(1 for o in q["options"] if o["image"]) for q in qs)
    print(f"[{fid}] Parsed {len(qs)} Qs | Q-Images: {img_count} | Opt-Images: {opt_img_count} | Sample Q1: \"{qs[0]['title'][:40]}\" with {len(qs[0]['options'])} options")

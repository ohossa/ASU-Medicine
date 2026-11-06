import json
import os
import re

PARSED_FORMS_PATH = "/tmp/parsed_forms_with_images.json"
MICRO_PRACTICAL_PATH = "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/src/app/data/practical/mgl-3-micro-practical.json"
OUTPUT_PRACTICAL_PATH = "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/src/app/data/practical/mgl-3-practical.json"

with open(PARSED_FORMS_PATH, "r", encoding="utf-8") as f:
    raw_data = json.load(f)

forms = raw_data["forms"]
images_map = raw_data["images"]

with open(MICRO_PRACTICAL_PATH, "r", encoding="utf-8") as f:
    micro_questions = json.load(f)

print("Loaded raw data successfully.")

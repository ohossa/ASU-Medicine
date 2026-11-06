import json

with open("src/app/data/practical/mgl-3-micro-practical.json", "r", encoding="utf-8") as f:
    micro_questions = json.load(f)

# Group questions by lecture station
lecture_names = [
    "Station 1: Bacillary Dysentery (Shigella & EHEC)",
    "Station 2: Cholera & Vibrio cholerae Diagnostics",
    "Station 3: Watery Diarrhea & E. coli Pathotypes",
    "Station 4: Staphylococcal Food Poisoning",
    "Station 5: Enteric Fever (Salmonella typhi & Paratyphi)",
    "Station 6: Stool Specimen Collection, Transport & Diagnostic Workup"
]

micro_chapter = {
    "id": 306,
    "title": "Practical — Microbiology",
    "subtitle": "Diagnostic Bacteriology, Stool Culture & Spotters",
    "emoji": "🧫",
    "page": 701,
    "lectureRange": "Stations 1–6",
    "accentColor": "microbiology",
    "bankSection": "practical",
    "subjects": [
        {
            "id": "microbiology",
            "name": "Microbiology",
            "iconName": "Bug",
            "lectures": "Stations 1–6",
            "lectureCount": len(lecture_names),
            "lectureNames": lecture_names,
            "questions": micro_questions
        }
    ]
}

# Write to mgl-3-practical.json
with open("src/app/data/practical/mgl-3-practical.json", "w", encoding="utf-8") as f:
    json.dump([micro_chapter], f, indent=2, ensure_ascii=False)

print(f"Updated mgl-3-practical.json with {len(micro_questions)} Microbiology practical questions.")

#!/usr/bin/env python3
"""
Applies Batch C2 repairs (all 85 questions) to src/imports/year-3/semester-1/MUG-3.json
Merges PART1_REPAIRS and PART2_REPAIRS.
"""

import json
from scripts.batch_c2_data_part1 import PART1_REPAIRS
from scripts.batch_c2_data_part2 import PART2_REPAIRS

BANK_PATH = "src/imports/year-3/semester-1/MUG-3.json"


def main():
    all_c2_repairs = {}
    all_c2_repairs.update(PART1_REPAIRS)
    all_c2_repairs.update(PART2_REPAIRS)

    print(f"Total C2 repairs to apply: {len(all_c2_repairs)}")

    with open(BANK_PATH, "r", encoding="utf-8") as f:
        bank = json.load(f)

    updated_count = 0
    for ch in bank.get("chapters", []):
        if ch.get("id") == 301:
            for sub in ch.get("subjects", []):
                for q in sub.get("questions", []):
                    qid = q.get("id")
                    if qid in all_c2_repairs:
                        rep = all_c2_repairs[qid]
                        q["text"] = rep["text"]
                        q["modelAnswer"] = rep["modelAnswer"]
                        q["explanation"] = rep["explanation"]
                        updated_count += 1

    print(f"Total Batch C2 repairs applied: {updated_count} / {len(all_c2_repairs)}")

    with open(BANK_PATH, "w", encoding="utf-8") as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)

    print(f"Successfully saved updated bank to {BANK_PATH}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
execute_ca1_deduplication.py

Deduplicates CA-1 past exam questions in MUG-3.json:
- Merges 35 identified duplicates (intra-PDF duplicates & cross-intake duplicates).
- Appends source occurrence anchors to canonical questions.
- Increments repetitionCount.
- Enriches explanations where applicable.
- Generates a full deduplication ledger artifact.
"""

import json
import os
import sys

BANK_PATH = "src/imports/year-3/semester-1/MUG-3.json"
LEDGER_PATH = "docs/verification/urogenital-ca1-deduplication-ledger.json"

MERGE_MAPPING = [
    # Format: (canonical_id, duplicate_id, reason)
    # Anatomy (Ch 101)
    ("MUG3-CH103-PHYS-0038", "MUG3-CH101-ANAT-0501", "Identical question: Morris rectangle horizontal boundary vertebrae (T11 and L3 spines)."),
    ("MUG3-CH101-ANAT-0029", "MUG3-CH101-ANAT-0504", "Identical question: Anterior relation of left kidney across omental bursa (Stomach) from 2024 paper."),
    ("MUG3-CH103-PHYS-0039", "MUG3-CH101-ANAT-0515", "Identical question: Adult ureter length (25 cm / 25-30 cm)."),
    ("MUG3-CH103-PHYS-0111", "MUG3-CH101-ANAT-0516", "Identical question: Structure not crossing anteriorly in front of right ureter (Obturator vessels / bundle)."),
    ("MUG3-CH101-ANAT-0030", "MUG3-CH101-ANAT-0524", "Identical question: Apex of urinary bladder attached to umbilicus by Median umbilical ligament."),
    ("MUG3-CH201-ANAT-0023", "MUG3-CH101-ANAT-0535", "Identical question: Embryological cause of double ureter (Early splitting of ureteric bud)."),
    ("MUG3-CH201-ANAT-0023", "MUG3-CH101-ANAT-0543", "Identical question: Embryological mechanism of double ureter (Early splitting of ureteric bud)."),
    ("MUG3-CH101-ANAT-0028", "MUG3-CH101-ANAT-0537", "Identical question: Ureteric bud outgrowth from Mesonephric duct."),

    # Histology (Ch 102)
    ("MUG3-CH102-HIST-0009", "MUG3-CH102-HIST-0503", "Identical question: Glomerular filtration slit diaphragm bridges adjacent podocyte foot processes."),
    ("MUG3-CH102-HIST-0011", "MUG3-CH102-HIST-0504", "Identical question: Glomerular basement membrane formed by podocytes and endothelial cells."),
    ("MUG3-CH202-HIST-0005", "MUG3-CH102-HIST-0516", "Identical question: Macula densa under light microscopy: closely packed tall epithelial cells with crowded nuclei."),
    ("MUG3-CH102-HIST-0002", "MUG3-CH102-HIST-0517", "Identical question: Macula densa Golgi apparatus reverse polarity: situated basal to nucleus."),
    ("MUG3-CH103-PHYS-0068", "MUG3-CH102-HIST-0520", "Identical question: Apical membrane plaques of umbrella / facet cells composed of uroplakins."),
    ("MUG3-CH203-PHYS-0111", "MUG3-CH102-HIST-0521", "Identical question: Superficial urothelial cells distension via unfolding/fusion of apical fusiform vesicles."),

    # Physiology (Ch 103)
    ("MUG3-CH103-PHYS-0502", "MUG3-CH103-PHYS-0503", "Intra-PDF exact duplicate slide: Endocrine function of kidney: Secretion of erythropoietin."),
    ("MUG3-CH103-PHYS-0502", "MUG3-CH103-PHYS-0509", "Identical question: Endocrine function of kidney: Secretion of erythropoietin."),
    ("MUG3-CH103-PHYS-0526", "MUG3-CH103-PHYS-0520", "Identical question: Stimulus for renin release: Decreased NaCl delivery to macula densa."),
    ("MUG3-CH103-PHYS-0527", "MUG3-CH103-PHYS-0528", "Identical question: Renal circulation feature: Vasa recta preserve medullary hyperosmolality / hyperosmolarity."),
    ("MUG3-CH103-PHYS-0137", "MUG3-CH103-PHYS-0529", "Identical question: Factor increasing GFR: Decrease in plasma oncotic pressure."),
    ("MUG3-CH103-PHYS-0137", "MUG3-CH103-PHYS-0534", "Identical question: Change increasing GFR: Decrease in plasma colloid osmotic pressure."),
    ("MUG3-CH103-PHYS-0538", "MUG3-CH103-PHYS-0540", "Identical question: Condition causing decrease in GFR: Prostatic enlargement."),
    ("MUG3-CH103-PHYS-0093", "MUG3-CH103-PHYS-0549", "Identical question: Inulin handling in kidney: Filtered, neither reabsorbed nor secreted."),
    ("MUG3-CH103-PHYS-0093", "MUG3-CH103-PHYS-0556", "Identical question: Inulin handling in kidney: Freely filtered, not reabsorbed and not secreted."),
    ("MUG3-CH103-PHYS-0138", "MUG3-CH103-PHYS-0551", "Identical question: Substance clearance > Inulin but < PAH: Tubular secretion occurs."),
    ("MUG3-CH103-PHYS-0129", "MUG3-CH103-PHYS-0564", "Identical question: Renal transport maximum (Tm) definition: Maximal tubular reabsorption or secretion rate."),
    ("MUG3-CH103-PHYS-0095", "MUG3-CH103-PHYS-0565", "Identical question: Mechanism of isolated renal glucosuria: Reduced/decreased renal threshold for glucose."),
    ("MUG3-CH103-PHYS-0576", "MUG3-CH103-PHYS-0570", "Identical question: Renal tubular transport true statement: Angiotensin II increases luminal NaHCO3 reabsorption."),
    ("MUG3-CH203-PHYS-0108", "MUG3-CH103-PHYS-0573", "Identical question: Characteristic feature of vasa recta: Passive countercurrent system/exchanger preserving gradient."),
    ("MUG3-CH103-PHYS-0109", "MUG3-CH103-PHYS-0594", "Identical question: Glomerulotubular balance: Increase in GFR leads to increase in peritubular capillary oncotic pressure."),

    # Biochemistry (Ch 104)
    ("MUG3-CH104-BIOC-0541", "MUG3-CH104-BIOC-0537", "Identical question: 17-alpha-hydroxylase deficiency hormonal alteration: Elevated aldosterone."),

    # Pathology (Ch 105)
    ("MUG3-CH105-PATH-0502", "MUG3-CH105-PATH-0506", "Identical question: Oliguria, hematuria, hypertension, and periorbital edema presentation: Poststreptococcal GN."),
    ("MUG3-CH105-PATH-0509", "MUG3-CH105-PATH-0507", "Identical question: Linear immunofluorescence for IgG and C3 along GBM with crescentic proliferation: Goodpasture syndrome."),
    ("MUG3-CH105-PATH-0513", "MUG3-CH105-PATH-0518", "Identical question: Diabetic glomerulosclerosis morphology EXCEPT: Idiopathic membranous GN."),
    ("MUG3-CH105-PATH-0521", "MUG3-CH105-PATH-0525", "Identical question: Penicillin-induced acute tubulointerstitial nephritis with eosinophilic infiltrate."),

    # Pharmacology (Ch 106)
    ("MUG3-CH206-PHAR-0006", "MUG3-CH106-PHAR-0513", "Identical question: Severe hypercalcemia in heart failure initial management: Isotonic saline plus loop diuretics.")
]

def main():
    with open(BANK_PATH, "r", encoding="utf-8") as f:
        bank = json.load(f)

    # Index all questions
    q_map = {}
    for ch in bank["chapters"]:
        for subj in ch.get("subjects", []):
            for q in subj.get("questions", []):
                q_map[q["id"]] = (ch, subj, q)

    ledger_entries = []
    merged_dup_ids = set()

    for can_id, dup_id, reason in MERGE_MAPPING:
        if can_id not in q_map:
            print(f"Error: Canonical question {can_id} not found!", file=sys.stderr)
            sys.exit(1)
        if dup_id not in q_map:
            print(f"Warning: Duplicate question {dup_id} not found (might already be merged).", file=sys.stderr)
            continue

        can_ch, can_subj, can_q = q_map[can_id]
        dup_ch, dup_subj, dup_q = q_map[dup_id]

        # 1. Merge sources
        can_sources = can_q.get("sources", [])
        dup_sources = dup_q.get("sources", [])
        for s in dup_sources:
            if s not in can_sources:
                can_sources.append(s)
        can_q["sources"] = can_sources

        # 2. Increment repetitionCount
        can_rep = can_q.get("repetitionCount", 1)
        dup_rep = dup_q.get("repetitionCount", 1)
        can_q["repetitionCount"] = can_rep + dup_rep

        # 3. Enrich explanation if canonical has shorter/weaker explanation
        can_expl = can_q.get("explanation", "")
        dup_expl = dup_q.get("explanation", "")
        if len(dup_expl) > len(can_expl):
            can_q["explanation"] = dup_expl

        # 4. Record ledger entry
        ledger_entries.append({
            "canonical_id": can_id,
            "canonical_chapter": can_ch["id"],
            "canonical_text": can_q.get("text") or can_q.get("question"),
            "duplicate_id": dup_id,
            "duplicate_chapter": dup_ch["id"],
            "duplicate_text": dup_q.get("text") or dup_q.get("question"),
            "merged_sources": dup_sources,
            "final_sources": can_q["sources"],
            "repetition_count": can_q["repetitionCount"],
            "equivalence_reason": reason
        })

        # 5. Mark duplicate for removal
        merged_dup_ids.add(dup_id)

    # Remove all merged duplicate questions from their subjects
    total_removed = 0
    for ch in bank["chapters"]:
        for subj in ch.get("subjects", []):
            orig_len = len(subj.get("questions", []))
            subj["questions"] = [q for q in subj.get("questions", []) if q["id"] not in merged_dup_ids]
            total_removed += (orig_len - len(subj["questions"]))

    print(f"Successfully merged and removed {total_removed} duplicate questions.")

    # Save modified bank
    with open(BANK_PATH, "w", encoding="utf-8") as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Updated bank saved to {BANK_PATH}.")

    # Save ledger
    os.makedirs(os.path.dirname(LEDGER_PATH), exist_ok=True)
    with open(LEDGER_PATH, "w", encoding="utf-8") as f:
        json.dump({
            "total_merged": len(ledger_entries),
            "date": "2026-11-23",
            "module": "MUG-3",
            "assessment_period": "ca-1",
            "entries": ledger_entries
        }, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Deduplication ledger saved to {LEDGER_PATH}.")

if __name__ == "__main__":
    main()

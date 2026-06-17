#!/usr/bin/env python3
"""Spot-check classification results against expected topics."""
import json
from pathlib import Path

mapping = json.load(open('.kimchi/docs/proposed-mapping.json'))
bank = json.load(open('src/imports/year-2/semester-2/MCNS-2.json'))

# Build question lookup
questions = {}
for ch in bank['chapters']:
    for sub in ch['subjects']:
        for q in sub['questions']:
            questions[q['id']] = q

def find_questions_by_keyword(keyword: str, limit: int = 10):
    results = []
    for qid, q in questions.items():
        text = ' '.join([
            q.get('text', ''),
            ' '.join(q.get('options', [])),
            q.get('explanation', ''),
            q.get('keyConcept', '')
        ]).lower()
        if keyword.lower() in text:
            results.append((qid, q))
            if len(results) >= limit:
                break
    return results

def check_topic(keyword: str, expected_ch: int, expected_sub: str):
    found = find_questions_by_keyword(keyword, limit=20)
    print(f"\n=== '{keyword}' ===")
    correct = 0
    wrong = 0
    examples = []
    for qid, q in found:
        mapped = mapping.get(qid)
        if mapped:
            ch = mapped['chapterId']
            sub = mapped['subject']
            ok = (ch == expected_ch and sub == expected_sub)
            if ok:
                correct += 1
            else:
                wrong += 1
                if len(examples) < 3:
                    evidence = ', '.join(mapped.get('evidence', [])[:3])
                    examples.append(f"  WRONG: Ch{ch}/{sub} (expected Ch{expected_ch}/{expected_sub}) | evidence: {evidence}")
    print(f"  Checked: {len(found)} | Correct: {correct} | Wrong: {wrong}")
    for ex in examples:
        print(ex)

check_topic('parkinson', 3, 'pharma')
check_topic('opioid', 2, 'pharma')
check_topic('morphine', 2, 'pharma')
check_topic('meningitis', 8, 'microbiology')
check_topic('cryptococcus', 8, 'microbiology')
check_topic('epilep', 6, 'pharma')
check_topic('urea cycle', 1, 'biochem')
check_topic('ammonia', 1, 'biochem')
check_topic('neurotransmitter', 1, 'biochem')
check_topic('dorsal column', 2, 'anatomy')
check_topic('spinothalamic', 2, 'anatomy')
check_topic('basal ganglia', 3, 'anatomy')
check_topic('cerebellum', 3, 'anatomy')
check_topic(' brain stem ', 4, 'anatomy')
check_topic('pons', 4, 'anatomy')
check_topic('temporal fossa', 4, 'anatomy')
check_topic('trigeminal', 4, 'anatomy')
check_topic('neck triangle', 5, 'anatomy')
check_topic('sternocleidomastoid', 5, 'anatomy')
check_topic('thalamus', 6, 'anatomy')
check_topic('reticular formation', 6, 'physiology')
check_topic('sleep', 6, 'physiology')
check_topic('limbic', 7, 'anatomy')
check_topic('cerebral blood supply', 7, 'anatomy')
check_topic('antidepressant', 7, 'pharma')
check_topic('rabies', 8, 'microbiology')
check_topic('antipsychotic', 10, 'pharma')
check_topic('drug abuse', 10, 'pharma')
check_topic('embryolog', 10, 'anatomy')

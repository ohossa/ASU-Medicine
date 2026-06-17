#!/usr/bin/env python3
"""Improved iNerd essay PDF parser v2."""
import json, re
from pathlib import Path

SUBJECTS = ['anatomy', 'histology', 'physiology', 'biochem', 'microbiology',
            'parasitology', 'pathology', 'pharma', 'clinical', 'embryology']

# Chapter inference keywords (ASU book canonical mapping)
CHAPTER_KEYWORDS = {
    1: ['scalp', 'layers of scalp', 'neuroglia', 'blood-brain barrier',
        'ependyma', 'myelin sheath', 'cortex layers', 'meninges layers',
        'introduction to cns', 'components of cns', 'cerebral hemisphere',
        'precentral gyrus', 'postcentral gyrus', 'facial expression'],
    2: ['sensory system', 'dorsal column', 'spinothalamic', 'spinocerebellar',
        'receptor', 'pain pathway', 'proprioception', 'fine touch',
        'gate control', 'two point discrimination'],
    3: ['motor system', 'basal ganglia', 'caudate nucleus', 'putamen',
        'globus pallidus', 'substantia nigra', 'cerebellum', 'purkinje',
        'motor cortex', 'corticospinal', 'pyramidal tract', 'internal capsule',
        'muscle stretch reflex', 'muscle spindle', 'motor neuron lesion'],
    4: ['brain stem', 'pons', 'medulla oblongata', 'midbrain',
        'cranial nerve', 'trigeminal', 'facial nerve',
        'temporal fossa', 'infratemporal fossa', 'pterygopalatine fossa',
        'dangerous area', 'scalp anatomy', 'face anatomy'],
    5: ['neck anatomy', 'sternocleidomastoid', 'ansa cervicalis',
        'cervical plexus', 'phrenic nerve', 'carotid sheath',
        'vagus nerve', 'hypoglossal nerve', 'glossopharyngeal nerve'],
    6: ['thalamus', 'hypothalamus', 'hypothalamic nucleus',
        'reticular formation', 'reticular activating system',
        'sleep physiology', 'alpha rhythm', 'eeg', 'epilepsy',
        'circadian rhythm', 'nrem sleep', 'rem sleep'],
    7: ['cerebrum', 'limbic system', 'hippocampus', 'amygdala',
        'fornix', 'cingulate gyrus', 'csf', 'cerebrospinal fluid',
        'ventricle', 'choroid plexus', 'blood supply of brain',
        'circle of willis', 'broca area', 'wernicke area'],
    8: ['meningitis', 'polio', 'rabies', 'negri body',
        'toxoplasmosis', 'cryptococcus', 'brain abscess',
        'viral encephalitis', 'fungal meningitis'],
    9: ['alzheimer', 'parkinson', 'multiple sclerosis', 'amyotrophic lateral sclerosis',
        'stroke', 'head injury', 'brain tumor', 'dementia',
        'subdural hematoma', 'subarachnoid hemorrhage', 'berry aneurysm',
        'hydrocephalus', 'normal pressure hydrocephalus'],
    10: ['pharyngeal arch', 'neural tube', 'neural crest',
         'spina bifida', 'meningocele', 'microcephaly',
         'craniosynostosis', 'embryology'],
}

def infer_chapter(text):
    text = text.lower()
    for ch_id, keywords in CHAPTER_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                return ch_id
    return None

def infer_subject(text):
    text = text.lower()
    # Check explicit subject mentions in text
    for sub in SUBJECTS:
        if sub in text:
            return sub
    # Fallback based on topic
    if any(t in text for t in ['drug', 'treatment', 'therapy', 'mechanism of action']):
        return 'pharma'
    elif any(t in text for t in ['function', 'response', 'reflex', 'excitation', 'inhibition', 'stimulation']):
        return 'physiology'
    elif any(t in text for t in ['structure', 'location', 'extent', 'origin', 'insertion']):
        return 'anatomy'
    elif any(t in text for t in ['disease', 'tumor', 'lesion', 'syndrome', 'deficiency']):
        return 'pathology'
    return 'anatomy'  # default

def is_noise_line(line):
    stripped = line.strip()
    if not stripped:
        return True
    if stripped.isdigit() and len(stripped) <= 3:
        return True
    if stripped == 'Section':
        return True
    if stripped == 'CNS Module (Questions) /':
        return True
    if stripped.startswith('/ CNS Module'):
        return True
    if stripped in ('Short Essay', 'Long Essay', 'Essay'):
        return True
    if stripped == '?':
        return True
    # Repeated Anatomy headers at page starts
    if stripped == 'Anatomy' and len(stripped) == len(line.strip()):
        return True
    return False

def parse_file(filepath, part_num):
    text = filepath.read_text(encoding='utf-8')
    lines = text.split('\n')
    
    entries = []
    current_subject = 'anatomy'
    current_chapter = 1
    current_question = None
    current_answer_lines = []
    
    def save_current():
        nonlocal current_question, current_answer_lines
        if current_question:
            answer = '\n'.join(current_answer_lines).strip()
            if answer:
                entries.append({
                    'question': current_question.strip(),
                    'answer': answer,
                    'chapterId': current_chapter,
                    'subject': current_subject,
                    'source': f'inerd-part{part_num}',
                })
        current_question = None
        current_answer_lines = []
    
    for i, line in enumerate(lines):
        # Skip noise lines
        if is_noise_line(line):
            continue
        
        stripped = line.strip()
        
        # Detect section headers (subject names alone on a line in uppercase or title case)
        # These appear between "Section" and questions
        lower = stripped.lower()
        if stripped.lower() in SUBJECTS and len(stripped) <= 15:
            save_current()
            current_subject = stripped.lower()
            continue
        
        # Detect chapter/topic labels
        # These are standalone topic names like "Spinal cord", "Scalp", "Face"
        # They typically appear before "Chapter N" or after "?"
        if stripped and not re.match(r'^\d+[\.\)]', stripped) and not stripped.startswith('y') and not stripped.lower().startswith('y '):
            ch_from_text = infer_chapter(stripped)
            if ch_from_text:
                save_current()
                current_chapter = ch_from_text
                continue
            elif stripped.lower() in ['chapter 1', 'chapter 2', 'chapter 3', 'chapter 4', 'chapter 5',
                                      'chapter 6', 'chapter 7', 'chapter 8', 'chapter 9', 'chapter 10']:
                save_current()
                num = int(stripped.lower().replace('chapter ', ''))
                current_chapter = num
                continue
        
        # Detect questions (start with number + period/tab)
        q_match = re.match(r'^(\d+)[\.\)]\s+(.+)$', stripped)
        if q_match:
            save_current()
            current_question = q_match.group(2).strip()
            # Check if there are multi-line continuation lines (next lines don't start with y or number)
            j = i + 1
            while j < len(lines):
                next_line = lines[j].strip()
                if not next_line or is_noise_line(lines[j]):
                    j += 1
                    continue
                if next_line.startswith('y') or re.match(r'^\d+[\.\)]', next_line):
                    break
                # Continuation of question text
                current_question += ' ' + next_line
                j += 1
            continue
        
        # Detect answer bullets (start with y or y-space)
        if stripped.startswith('y ') or stripped.startswith('y\t'):
            current_answer_lines.append(stripped[2:].strip())
            # Check for multi-line continuation
            j = i + 1
            while j < len(lines):
                next_line = lines[j]
                if is_noise_line(next_line):
                    j += 1
                    continue
                next_stripped = next_line.strip()
                if next_stripped.startswith('y ') or next_stripped.startswith('y\t') or re.match(r'^\d+[\.\)]', next_stripped):
                    break
                # Continuation of answer text
                if current_answer_lines:
                    current_answer_lines[-1] += ' ' + next_stripped
                j += 1
            continue
    
    save_current()
    return entries

def deduplicate(entries):
    """Deduplicate by normalized question text."""
    seen = {}
    unique = []
    for e in entries:
        key = re.sub(r'[^a-z0-9]', '', e['question'].lower())
        if key not in seen:
            seen[key] = e
            unique.append(e)
    return unique

def main():
    raw1 = Path('.kimchi/docs/inerd-essay-part1-raw.txt')
    raw2 = Path('.kimchi/docs/inerd-essay-part2-raw.txt')
    
    entries1 = parse_file(raw1, 1)
    entries2 = parse_file(raw2, 2)
    
    # Deduplicate combined
    all_entries = deduplicate(entries1 + entries2)
    
    # Re-infer chapter from full question+answer if needed
    for e in all_entries:
        if e['chapterId'] is None:
            combined = e['question'] + ' ' + e['answer']
            e['chapterId'] = infer_chapter(combined) or 1
        if e['subject'] not in SUBJECTS:
            combined = e['question'] + ' ' + e['answer']
            e['subject'] = infer_subject(combined)
    
    out = Path('.kimchi/docs/inerd-essays-structured.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(all_entries, f, indent=2, ensure_ascii=False)
    
    print(f"Total parsed entries: {len(all_entries)}")
    print(f"  Part 1: {len(entries1)}")
    print(f"  Part 2: {len(entries2)}")
    
    ch_counts = {}
    sub_counts = {}
    for e in all_entries:
        ch = e['chapterId']
        ch_counts[ch] = ch_counts.get(ch, 0) + 1
        sub_counts[e['subject']] = sub_counts.get(e['subject'], 0) + 1
    
    print("\nBy chapter:")
    for ch in sorted(ch_counts.keys()):
        print(f"  Ch{ch}: {ch_counts[ch]}")
    
    print("\nBy subject:")
    for sub, count in sorted(sub_counts.items(), key=lambda x: -x[1]):
        print(f"  {sub}: {count}")
    
    # Show sample entries
    print("\nSample entries (first 3):")
    for e in all_entries[:3]:
        print(f"  Q: {e['question'][:80]}...")
        print(f"  A: {e['answer'][:80]}...")
        print(f"    -> Ch{e['chapterId']}/{e['subject']}")

if __name__ == '__main__':
    main()

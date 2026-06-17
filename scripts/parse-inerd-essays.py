#!/usr/bin/env python3
"""Parse iNerd essay PDF raw text into structured Q&A JSON."""
import json, re
from pathlib import Path

RAW1 = Path('.kimchi/docs/inerd-essay-part1-raw.txt')
RAW2 = Path('.kimchi/docs/inerd-essay-part2-raw.txt')
OUT = Path('.kimchi/docs/inerd-essays-structured.json')

SUBJECTS = ['anatomy', 'histology', 'physiology', 'biochem', 'microbiology', 
            'pathology', 'pharma', 'clinical', 'parasitology', 'embryology']

def normalize_whitespace(text):
    lines = text.split('\n')
    cleaned = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        cleaned.append(line)
    return cleaned

def extract_qa_pairs(lines):
    """Extract Q&A pairs from a list of lines."""
    entries = []
    current_question = None
    current_answer_lines = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check if line starts with a question number (e.g., "1.", "1.", "12.")
        q_match = re.match(r'^(\d+)[\.\)]\s+(.+)$', line)
        if q_match:
            # Save previous question if exists
            if current_question:
                answer = '\n'.join(current_answer_lines).strip()
                if answer:
                    entries.append({
                        'question': current_question,
                        'answer': answer,
                    })
            current_question = q_match.group(2).strip()
            current_answer_lines = []
            continue
        
        # Check if line is an answer bullet (starts with y)
        if line.startswith('y '):
            current_answer_lines.append(line[2:].strip())
        elif line.startswith('y\t'):
            current_answer_lines.append(line[2:].strip())
        else:
            # Might be continuation of previous answer line
            if current_answer_lines and not line.startswith('y ') and not re.match(r'^\d+\.\s', line):
                current_answer_lines[-1] += ' ' + line.strip()
    
    # Save last question
    if current_question and current_answer_lines:
        entries.append({
            'question': current_question,
            'answer': '\n'.join(current_answer_lines).strip(),
        })
    
    return entries

def infer_chapter(question_text):
    """Infer chapter from question text using topic keywords."""
    text = question_text.lower()
    
    # Chapter mapping keywords
    if 'spinal cord' in text and 'cerebellum' not in text and 'brain stem' not in text:
        return 3  # Motor system / spinal cord
    elif 'brain stem' in text or 'pons' in text or 'medulla' in text or 'midbrain' in text:
        return 4
    elif 'neck' in text or 'sternocleidomastoid' in text or 'ansa cervicalis' in text:
        return 5
    elif 'thalamus' in text or 'hypothalamus' in text or 'reticular formation' in text or 'sleep' in text or 'epilepsy' in text:
        return 6
    elif 'cerebrum' in text or 'meninges' in text or 'limbic' in text or 'hippocampus' in text or 'memory' in text or 'csf' in text or 'ventricle' in text:
        return 7
    elif any(t in text for t in ['meningitis', 'polio', 'rabies', 'toxoplasma', 'cryptococcus', 'brain abscess']):
        return 8
    elif any(t in text for t in ['alzheimer', 'parkinson', 'multiple sclerosis', 'als', 'stroke', 'head injury', 'brain tumor', 'dementia', 'subdural hematoma', 'aneurysm']):
        return 9
    elif 'embryo' in text or 'pharyngeal arch' in text or 'neural tube' in text or 'spina bifida' in text or 'microcephaly' in text or 'craniosynostosis' in text:
        return 10
    elif any(t in text for t in ['scalp', 'layers of scalp', 'occipitofrontalis', 'facial expression', 'dangerous area']):
        return 1
    elif any(t in text for t in ['neuroglia', 'blood-brain barrier', 'cortex layers', 'myelin', 'ependyma']):
        return 1
    elif 'sensory' in text or 'dorsal column' in text or 'spinothalamic' in text or 'receptor' in text or 'pain pathway' in text or 'proprioception' in text:
        return 2
    elif 'basal ganglia' in text or 'cerebellum' in text or 'motor cortex' in text or 'internal capsule' in text or 'pyramidal tract' in text or 'corticospinal' in text:
        return 3
    elif any(t in text for t in ['motor neuron lesion', 'hemiplegia', 'brown-sequard', 'anterior cord syndrome']):
        return 3
    return None

def infer_subject(question_text, answer_text):
    """Infer subject from question/answer text."""
    text = (question_text + ' ' + answer_text).lower()
    
    if 'pharmacology' in text or 'drug' in text or 'treatment' in text or 'therapy' in text:
        return 'pharma'
    elif 'pathology' in text or 'disease' in text or 'tumor' in text or 'lesion' in text:
        return 'pathology'
    elif 'microbiology' in text or 'bacteria' in text or 'virus' in text or 'fungi' in text:
        return 'microbiology'
    elif 'parasitology' in text or 'toxoplasma' in text:
        return 'parasitology'
    elif 'clinical' in text or 'patient' in text or 'case' in text:
        return 'clinical'
    elif 'embryology' in text:
        return 'anatomy'  # embryology mapped to anatomy
    elif 'histology' in text or 'layers' in text or 'cells' in text:
        return 'histology'
    elif 'physiology' in text or 'function' in text or 'mechanism' in text:
        return 'physiology'
    elif 'biochemistry' in text or 'metabolism' in text or 'metabolic' in text:
        return 'biochem'
    elif 'anatomy' in text or 'structure' in text or 'location' in text:
        return 'anatomy'
    return None

def parse_file(filepath, default_part=1):
    text = filepath.read_text(encoding='utf-8')
    lines = normalize_whitespace(text)
    
    # Split by subject sections
    # The PDF alternates between Anatomy, Histology, etc.
    # We'll use the question numbering reset as section boundaries
    
    all_entries = []
    current_section_lines = []
    current_subject = 'anatomy'  # default
    
    for line in lines:
        # Detect subject headers
        l = line.lower()
        if l in SUBJECTS:
            current_subject = l
            continue
        
        current_section_lines.append(line)
    
    # Extract Q&A from all lines
    qa_pairs = extract_qa_pairs(current_section_lines)
    
    for qa in qa_pairs:
        ch = infer_chapter(qa['question'])
        sub = infer_subject(qa['question'], qa['answer'])
        if not sub:
            sub = current_subject
        
        all_entries.append({
            'source': f'inerd-essay-part{default_part}',
            'question': qa['question'],
            'answer': qa['answer'],
            'inferredChapterId': ch,
            'inferredSubject': sub,
        })
    
    return all_entries

entries_part1 = parse_file(RAW1, 1)
entries_part2 = parse_file(RAW2, 2)
all_entries = entries_part1 + entries_part2

with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(all_entries, f, indent=2, ensure_ascii=False)

print(f"Total parsed entries: {len(all_entries)}")
print(f"Part 1: {len(entries_part1)}")
print(f"Part 2: {len(entries_part2)}")

# Count by chapter
ch_counts = {}
sub_counts = {}
for e in all_entries:
    ch = e['inferredChapterId'] or 'unknown'
    ch_counts[ch] = ch_counts.get(ch, 0) + 1
    sub_counts[e['inferredSubject']] = sub_counts.get(e['inferredSubject'], 0) + 1

print("\nBy chapter:")
for ch in sorted(ch_counts.keys(), key=lambda x: (999 if x=='unknown' else x)):
    print(f"  Ch{ch}: {ch_counts[ch]}")

print("\nBy subject:")
for sub, count in sorted(sub_counts.items(), key=lambda x: -x[1]):
    print(f"  {sub}: {count}")

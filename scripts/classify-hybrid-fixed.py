#!/usr/bin/env python3
"""Hybrid classifier with FORCE routes for anatomical structures."""
import json, re, math
from collections import defaultdict, Counter
from pathlib import Path

# === PATHS ===
BOOK_TOC_PATH = Path('.kimchi/docs/book-toc.json')
BANK_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json')
OUT_PATH = Path('.kimchi/docs/proposed-mapping.json')
FLAG_PATH = Path('.kimchi/docs/low-confidence-flags.json')

# === LOAD DATA ===
with open(BOOK_TOC_PATH, 'r', encoding='utf-8') as f:
    book_toc = json.load(f)
with open(BANK_PATH, 'r', encoding='utf-8') as f:
    bank = json.load(f)

# === VALID PAIRS ===
valid_pairs = set()
for ch in book_toc['chapters']:
    ch_id = str(ch['id'])
    for sub_id in ch['subjects']:
        valid_pairs.add((ch_id, sub_id))

# === FORCE ROUTES ===
# These are specific terms that MUST route to a specific chapter regardless of other signals.
FORCE_ROUTES = [
    (['pons', 'medulla oblongata', 'medulla', 'pyramidal decussation'],
     '4', ['anatomy', 'histology']),
    (['midbrain', 'mesencephalon', 'superior colliculus', 'inferior colliculus',
      'cerebral peduncle', 'basis pedunculi', 'substantia nigra', 'red nucleus',
      'oculomotor nucleus', 'trochlear nucleus'],
     '4', ['anatomy', 'histology']),
    (['brain stem', 'brainstem', 'brain-stem'],
     '4', ['anatomy', 'histology']),
    (['facial colliculus', 'hypoglossal trigone', 'dorsal motor nucleus of vagus',
      'nucleus solitarius', 'spinal nucleus of trigeminal', 'inferior olivary nucleus',
      'pontine nuclei', 'locus coeruleus', 'superior olivary complex',
      'open medulla', 'closed medulla'],
     '4', ['histology']),
    (['cranial cavity', 'middle cranial fossa', 'anterior cranial fossa',
      'posterior cranial fossa', 'foramen magnum', 'jugular foramen',
      'hypoglossal canal'],
     '4', ['anatomy']),
    (['temporal fossa', 'infratemporal fossa', 'pterygopalatine fossa',
      'pterygopalatine ganglion', 'pterygoid', 'lateral pterygoid', 'medial pterygoid',
      'temporalis', 'masseter', 'chorda tympani', 'greater petrosal nerve'],
     '4', ['anatomy']),
    (['trigeminal nerve', 'trigeminal ganglion', 'gasserian ganglion',
      'ophthalmic nerve', 'maxillary nerve', 'mandibular nerve',
      'lingual nerve', 'inferior alveolar nerve', 'buccal nerve',
      'auriculotemporal nerve', 'mental nerve', 'infraorbital nerve'],
     '4', ['anatomy']),
    (['scalp', 'dangerous area of face', 'emissary vein', 'dangerous area'],
     '4', ['anatomy']),
    (['autonomic ganglia', 'ciliary ganglion', 'otic ganglion', 'submandibular ganglion'],
     '4', ['anatomy']),

    (['thalamus', 'thalamic nuclei', 'medial geniculate body', 'lateral geniculate body',
      'internal medullary lamina'],
     '6', ['anatomy']),
    (['hypothalamus', 'hypothalamic nuclei', 'mammillary body', 'tuber cinereum',
      'median eminence', 'pituitary stalk', 'infundibulum'],
     '6', ['anatomy']),
    (['pineal body', 'pineal gland', 'habenular triangle'],
     '6', ['anatomy']),
    (['third ventricle', 'interventricular foramen', 'foramen of monro'],
     '6', ['anatomy']),
    (['reticular formation', 'ascending reticular activating system', 'aras',
      'reticular activating system', 'pontine reticular', 'medullary reticular'],
     '6', ['physiology']),
    (['sleep', 'nrem sleep', 'rem sleep', 'slow wave sleep', 'fast wave sleep',
      'paradoxical sleep', 'sleep spindle', 'k-complex',
      'circadian rhythm', 'suprachiasmatic nucleus'],
     '6', ['physiology']),
    (['sedative', 'hypnotic', 'anesthesia', 'epilepsy', 'seizure',
      'barbiturate', 'benzodiazepine', 'diazepam', 'midazolam', 'lorazepam',
      'phenytoin', 'carbamazepine', 'valproate', 'ethosuximide', 'lamotrigine',
      'phenobarbital', 'migraine', 'sumatriptan', 'ergotamine', 'propranolol'],
     '6', ['pharma']),
    (['propofol', 'ketamine', 'thiopental', 'etomidate',
      'halothane', 'isoflurane', 'sevoflurane', 'desflurane', 'nitrous oxide',
      'lidocaine', 'bupivacaine', 'procaine'],
     '6', ['pharma']),

    (['dorsal column', 'fasciculus gracilis', 'fasciculus cuneatus',
      'dorsal column tract'],
     '2', ['anatomy']),
    (['spinothalamic', 'spinothalamic tract', 'anterolateral system',
      'anterolateral tract'],
     '2', ['anatomy']),
    (['spinocerebellar', 'spinocerebellar tract', 'dorsal spinocerebellar',
      'ventral spinocerebellar'],
     '2', ['anatomy']),
    (['receptor potential', 'generator potential', 'receptive field',
      'two-point discrimination', 'rapidly adapting', 'slowly adapting',
      'gate control', 'substance p', 'bradykinin', 'referred pain'],
     '2', ['physiology']),
    (['opioid', 'opiate', 'morphine', 'fentanyl', 'codeine',
      'mu receptor', 'endorphin', 'enkephalin', 'dynorphin',
      'naloxone', 'methadone', 'buprenorphine'],
     '2', ['pharma']),
    (['pacinian corpuscle', 'meissner corpuscle', 'merkel disc',
      'ruffini corpuscle', 'krause end bulb'],
     '2', ['histology']),

    (['basal ganglia', 'caudate nucleus', 'putamen', 'globus pallidus',
      'substantia nigra', 'subthalamic nucleus', 'striatum',
      'internal capsule'],
     '3', ['anatomy']),
    (['cerebellum', 'cerebellar peduncle', 'cerebellar hemisphere', 'cerebellar vermis',
      'dentate nucleus', 'fastigial nucleus', 'interposed nucleus',
      'purkinje cell', 'climbing fiber', 'mossy fiber', 'parallel fiber'],
     '3', ['anatomy', 'histology']),
    (['corticospinal tract', 'pyramidal tract', 'pyramidal decussation',
      'corticobulbar tract', 'extrapyramidal system'],
     '3', ['anatomy']),
    (['motor cortex', 'primary motor cortex', 'premotor cortex',
      'supplementary motor area', 'brodmann area 4'],
     '3', ['anatomy']),
    (['muscle stretch reflex', 'myotatic reflex', 'muscle spindle',
      'intrafusal fiber', 'nuclear bag', 'nuclear chain',
      'gamma loop', 'alpha-gamma coactivation',
      'golgi tendon organ', 'inverse stretch reflex',
      'withdrawal reflex', 'crossed extensor reflex'],
     '3', ['physiology']),
    (['parkinson disease', "parkinson's disease", 'parkinsonism',
      'levodopa', 'l-dopa', 'carbidopa', 'selegiline', 'rasagiline',
      'entacapone', 'tolcapone', 'amantadine', 'benztropine',
      'on-off phenomenon', 'wearing off', 'dyskinesia'],
     '3', ['pharma']),
    (['huntington disease', 'huntington', 'chorea', 'athetosis',
      'hemiballismus', 'wilson disease'],
     '3', ['pathology']),
    (['upper motor neuron lesion', 'lower motor neuron lesion',
      'hemiplegia', 'paraplegia', 'quadriplegia',
      'brown-sequard', 'anterior cord syndrome'],
     '3', ['clinical']),

    (['fascia of neck', 'investing fascia', 'pretracheal fascia', 'prevertebral fascia',
      'carotid sheath', 'suprasternal space'],
     '5', ['anatomy']),
    (['anterior triangle', 'posterior triangle', 'muscular triangle',
      'digastric triangle', 'carotid triangle', 'submental triangle',
      'omoclavicular triangle', 'occipital triangle'],
     '5', ['anatomy']),
    (['sternocleidomastoid', 'scm', 'trapezius', 'platysma',
      'digastric', 'mylohyoid', 'omohyoid', 'sternohyoid'],
     '5', ['anatomy']),
    (['cervical plexus', 'ansa cervicalis', 'greater auricular nerve',
      'transverse cervical nerve', 'supraclavicular nerve', 'phrenic nerve'],
     '5', ['anatomy']),
    (['sympathetic chain', 'stellate ganglion', 'cervicothoracic ganglion'],
     '5', ['anatomy']),
    (['glossopharyngeal nerve', 'vagus nerve', 'accessory nerve', 'hypoglossal nerve',
      'stylopharyngeus', 'internal laryngeal nerve', 'recurrent laryngeal nerve',
      'jugular foramen', 'thyrohyoid membrane'],
     '5', ['anatomy']),

    (['limbic system', 'hippocampus', 'amygdala', 'fornix',
      'cingulate gyrus', 'parahippocampal gyrus', 'dentate gyrus',
      'mammillothalamic tract'],
     '7', ['anatomy']),
    (['cerebral white matter', 'internal capsule', 'corona radiata',
      'centrum semiovale', 'superior longitudinal fasciculus'],
     '7', ['anatomy']),
    (['lateral ventricle', 'cerebral meninges', 'arachnoid granulation',
      'csf circulation', 'choroid plexus', 'cerebral aqueduct'],
     '7', ['anatomy']),
    (['circle of willis', 'anterior cerebral artery', 'middle cerebral artery',
      'posterior cerebral artery', 'vertebrobasilar'],
     '7', ['anatomy']),
    (['cerebral dominance', 'left hemisphere', 'right hemisphere',
      'broca area', 'wernicke area', 'arcuate fasciculus',
      'aphasia', 'broca aphasia', 'wernicke aphasia'],
     '7', ['physiology']),
    (['memory', 'short-term memory', 'long-term memory', 'declarative memory',
      'procedural memory', 'working memory', 'amnesia',
      'anterograde amnesia', 'retrograde amnesia'],
     '7', ['physiology']),
    (['antidepressant', 'depression', 'tricyclic antidepressant', 'tca',
      'ssri', 'fluoxetine', 'sertraline', 'paroxetine',
      'snri', 'venlafaxine', 'duloxetine',
      'maoi', 'mirtazapine', 'lithium', 'bipolar'],
     '7', ['pharma']),

    (['meningitis', 'encephalitis', 'bacterial meningitis', 'viral meningitis',
      'fungal meningitis', 'tuberculous meningitis',
      'haemophilus influenzae', 'streptococcus pneumoniae', 'neisseria meningitidis',
      'listeria monocytogenes', 'cryptococcus', 'cryptococcal',
      'poliomyelitis', 'poliovirus', 'rabies', 'rabies virus', 'negri body',
      'viral encephalitis', 'herpes simplex encephalitis',
      'arbovirus', 'japanese encephalitis',
      'toxoplasmosis', 'toxoplasma', 'neurosyphilis', 'brain abscess'],
     '8', ['microbiology']),
    (['amoebic encephalitis', 'naegleria', 'primary amebic meningoencephalitis',
      'cysticercosis', 'taenia solium', 'neurocysticercosis',
      'hydatid disease', 'echinococcus', 'cerebral malaria', 'plasmodium'],
     '8', ['parasitology']),
    (['ceftriaxone', 'cefotaxime', 'vancomycin', 'ampicillin',
      'acyclovir', 'ganciclovir', 'amphotericin b', 'voriconazole'],
     '8', ['pharma']),
    (['alzheimer disease', 'alzheimer', 'senile plaque', 'neurofibrillary tangle',
      'beta-amyloid', 'tau protein', 'lewy body'],
     '9', ['pathology']),
    (['multiple sclerosis', 'ms', 'demyelination', 'dawson finger',
      'amyotrophic lateral sclerosis', 'als', 'motor neuron disease',
      'guillain-barre syndrome', 'gbs'],
     '9', ['pathology']),
    (['head injury', 'traumatic brain injury', 'epidural hematoma',
      'subdural hematoma', 'subarachnoid hemorrhage', 'intracerebral hemorrhage',
      'diffuse axonal injury', 'contusion', 'concussion'],
     '9', ['pathology']),
    (['stroke', 'cerebrovascular accident', 'cva', 'ischemic stroke',
      'hemorrhagic stroke', 'transient ischemic attack', 'tia',
      'berry aneurysm', 'atherosclerosis'],
     '9', ['pathology']),
    (['brain tumor', 'glioma', 'glioblastoma', 'astrocytoma',
      'meningioma', 'schwannoma', 'acoustic neuroma',
      'pituitary adenoma', 'craniopharyngioma', 'ependymoma',
      'medulloblastoma', 'metastatic tumor'],
     '9', ['pathology']),
    (['donepezil', 'rivastigmine', 'galantamine', 'memantine',
      'interferon beta', 'natalizumab', 'fingolimod',
      'riluzole', 'alteplase', 'tpa', 'mannitol'],
     '9', ['pharma']),
    (['dementia', 'delirium', 'mild cognitive impairment',
      'vascular dementia', 'frontotemporal dementia'],
     '9', ['clinical']),

    (['pharyngeal arch', 'branchial arch', 'pharyngeal pouch',
      'thyroid diverticulum', 'ultimobranchial body',
      'development of face', 'development of nervous system',
      'neural tube', 'neural crest', 'neural groove', 'neural fold',
      'prosencephalon', 'mesencephalon', 'rhombencephalon',
      'telencephalon', 'diencephalon', 'metencephalon', 'myelencephalon',
      'spina bifida', 'meningocele', 'meningomyelocele',
      'craniostenosis', 'craniosynostosis', 'microcephaly', 'hydrocephalus'],
     '10', ['anatomy']),
    (['antipsychotic', 'neuroleptic', 'haloperidol', 'chlorpromazine',
      'risperidone', 'olanzapine', 'quetiapine', 'aripiprazole', 'clozapine',
      'extrapyramidal side effects', 'tardive dyskinesia',
      'neuroleptic malignant syndrome', 'akathisia', 'acute dystonia',
      'substance abuse', 'drug abuse', 'alcohol withdrawal',
      'delirium tremens', 'disulfiram', 'methadone maintenance',
      'naloxone', 'naltrexone', 'cocaine', 'amphetamine', 'cannabis'],
     '10', ['pharma']),
]

def tokenize(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def normalize_question(q):
    parts = [q.get('text', '')]
    if q.get('type') in ('mcq', 'truefalse'):
        parts.extend(q.get('options', []))
    elif q.get('type') == 'matching':
        for pair in q.get('pairs', []):
            parts.append(pair.get('premise', ''))
            parts.append(pair.get('target', ''))
    elif q.get('type') == 'case':
        for sq in q.get('subQuestions', []):
            parts.append(sq.get('text', ''))
    parts.append(q.get('explanation', ''))
    parts.append(q.get('keyConcept', ''))
    text = ' '.join(str(p) for p in parts if p)
    return tokenize(text)

def apply_force_routes(text):
    """Return list of (chapter, matched_term, subjects) from force routes."""
    matches = []
    for terms, ch, subjects in FORCE_ROUTES:
        for term in terms:
            if term in text:
                matches.append((ch, term, subjects))
    return matches

def determine_subject_for_chapter(text, chapter_id, q_sub):
    """Given a chapter, determine the best subject."""
    # Get valid subjects for this chapter
    valid_subjects = []
    for ch in book_toc['chapters']:
        if str(ch['id']) == chapter_id:
            valid_subjects = list(ch['subjects'].keys())
            break
    if not valid_subjects:
        return 'anatomy'
    if q_sub in valid_subjects:
        return q_sub
    # Need to determine best subject
    # Count force-route subject matches
    sub_scores = defaultdict(int)
    for terms, ch, subjects in FORCE_ROUTES:
        if ch != chapter_id:
            continue
        for term in terms:
            if term in text:
                for s in subjects:
                    sub_scores[s] += 3 if ' ' in term else 1
    # Default subject priorities
    if 'anatomy' in valid_subjects:
        sub_scores['anatomy'] += 0.1
    if sub_scores:
        return max(sub_scores, key=lambda s: sub_scores[s])
    return valid_subjects[0]

# === TF-IDF REFERENCE DOCS ===
print("Building TF-IDF reference vectors from Anki...")

ref_texts = defaultdict(list)
with open('/Users/omarhossa/Downloads/CNS anki .txt', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith('#') or 'Practical' in line:
            continue
        cols = line.split('\t')
        if len(cols) < 3:
            continue
        deck = cols[0]
        m = re.search(r'Chapter\s+(\d+)', deck, re.I)
        if not m:
            m = re.search(r'Unit\s+(\d+)', deck, re.I)
        if not m:
            continue
        ch = m.group(1)
        sub = None
        parts = deck.split('::')
        for i, p in enumerate(parts):
            p_clean = p.strip()
            if re.match(r'Chapter\s+\d+|Unit\s+\d+', p_clean, re.I) and i + 1 < len(parts):
                candidate = parts[i + 1].strip()
                if candidate == 'Biochemistry': sub = 'biochem'
                elif candidate == 'Physiology': sub = 'physiology'
                elif candidate == 'Anatomy': sub = 'anatomy'
                elif candidate == 'Histology': sub = 'histology'
                elif candidate == 'Pharmacology': sub = 'pharma'
                elif candidate == 'Pathology': sub = 'pathology'
                elif candidate == 'Microbiology': sub = 'microbiology'
                elif candidate == 'Parasitology': sub = 'parasitology'
                elif candidate == 'Neurology': sub = 'clinical'
                elif candidate == 'Clinical': sub = 'clinical'
                elif candidate == 'Embryology': sub = 'anatomy'
        if ch == '5':
            sub = 'anatomy'
        if not sub or (ch, sub) not in valid_pairs:
            continue
        content = ' '.join(cols[2:12])
        text_re = re.sub(r'\{\{c\d+::(.*?)\}\}', r'\1', content)
        text_re = text_re.replace('&nbsp;', ' ')
        text_re = re.sub(r'<[^>]+>', ' ', text_re)
        tokens = tokenize(text_re).split()
        ref_texts[(ch, sub)].extend(tokens)

# Add book TOC topics
for chapter in book_toc['chapters']:
    ch_id = str(chapter['id'])
    for sub_id, topics in chapter['subjects'].items():
        for topic in topics:
            tokens = tokenize(topic).split()
            ref_texts[(ch_id, sub_id)].extend(tokens)

N = len(ref_texts)
df = defaultdict(int)
ref_counters = {}
for key, tokens in ref_texts.items():
    counter = Counter(tokens)
    ref_counters[key] = counter
    for word in counter:
        df[word] += 1

def idf(word):
    return math.log(N / max(df.get(word, 1), 1)) + 1.0

ref_vectors = {}
for key, counter in ref_counters.items():
    vec = {}
    total = sum(counter.values())
    for word, count in counter.items():
        vec[word] = (count / total) * idf(word)
    ref_vectors[key] = vec

ref_norms = {k: math.sqrt(sum(v**2 for v in vec.values())) for k, vec in ref_vectors.items()}

def tfidf_score(q_tokens, ch, sub):
    q_counter = Counter(q_tokens)
    total = sum(q_counter.values())
    if total == 0:
        return 0
    q_vec = {}
    for word, count in q_counter.items():
        q_vec[word] = (count / total) * idf(word)
    q_norm = math.sqrt(sum(v**2 for v in q_vec.values()))
    if q_norm == 0:
        return 0
    r_vec = ref_vectors.get((ch, sub), {})
    r_norm = ref_norms.get((ch, sub), 1)
    dot = sum(q_vec.get(w, 0) * r_vec.get(w, 0) for w in set(q_vec) & set(r_vec))
    return dot / (q_norm * r_norm)

# === CLASSIFICATION ===
print("Classifying questions...")
mapping = {}
flags = {}
total = 0

for chapter in bank['chapters']:
    ch_id = str(chapter['id'])
    for subject in chapter['subjects']:
        sub_id = subject['id']
        for q in subject['questions']:
            qid = q['id']
            text = normalize_question(q)
            tokens = text.split()

            # 1. FORCE ROUTES (highest priority)
            force_matches = apply_force_routes(text)
            if force_matches:
                # If multiple force routes match, prefer the original chapter as tie-breaker
                force_chapters = defaultdict(list)
                for ch, term, subjects in force_matches:
                    force_chapters[ch].append((term, subjects))
                if len(force_chapters) == 1:
                    best_ch = list(force_chapters.keys())[0]
                    terms = force_chapters[best_ch]
                else:
                    # Multiple chapters match - prefer original chapter if among them
                    if ch_id in force_chapters:
                        best_ch = ch_id
                        terms = force_chapters[ch_id]
                    else:
                        # Pick the one with most force matches
                        best_ch = max(force_chapters, key=lambda c: len(force_chapters[c]))
                        terms = force_chapters[best_ch]
                best_sub = determine_subject_for_chapter(text, best_ch, sub_id)
                evidence = [f"force:{t}" for t, _ in terms[:5]]
                mapping[qid] = {
                    'chapterId': int(best_ch),
                    'subject': best_sub,
                    'oldChapterId': int(ch_id),
                    'oldSubject': sub_id,
                    'confidence': 99.9,
                    'score': 99.9,
                    'evidence': evidence,
                }
                total += 1
                if total % 500 == 0:
                    print(f"Processed {total}...")
                continue

            # 2. TF-IDF fallback
            tfidf_scores = []
            for vch, vsub in valid_pairs:
                s = tfidf_score(tokens, vch, vsub)
                tfidf_scores.append((s, vch, vsub))
            tfidf_scores.sort(reverse=True)

            if not tfidf_scores:
                mapping[qid] = {
                    'chapterId': int(ch_id), 'subject': sub_id,
                    'oldChapterId': int(ch_id), 'oldSubject': sub_id,
                    'confidence': 0, 'score': 0, 'evidence': []
                }
                flags[qid] = mapping[qid]
                total += 1
                continue

            best_score, best_ch, best_sub = tfidf_scores[0]
            second_score = tfidf_scores[1][0] if len(tfidf_scores) > 1 else 0
            confidence = best_score / (second_score + 0.001)
            evidence = []
            q_counter = Counter(tokens)
            for word in q_counter:
                if word in ref_vectors.get((best_ch, best_sub), {}):
                    evidence.append(f"tfidf:{word}")
            evidence = evidence[:5]

            mapping[qid] = {
                'chapterId': int(best_ch),
                'subject': best_sub,
                'oldChapterId': int(ch_id),
                'oldSubject': sub_id,
                'confidence': round(min(confidence, 99.9), 3),
                'score': round(best_score, 5),
                'evidence': evidence,
            }

            if confidence < 1.5:
                flags[qid] = mapping[qid]

            total += 1
            if total % 500 == 0:
                print(f"Processed {total}...")

OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(mapping, f, indent=2, ensure_ascii=False)
with open(FLAG_PATH, 'w', encoding='utf-8') as f:
    json.dump(flags, f, indent=2, ensure_ascii=False)

print(f"Classified {total} questions.")
print(f"Low-confidence flags: {len(flags)}")

dist = defaultdict(lambda: defaultdict(int))
for qid, d in mapping.items():
    dist[d['chapterId']][d['subject']] += 1
print("\nProposed distribution:")
for ch in sorted(dist.keys(), key=int):
    for sub in sorted(dist[ch].keys()):
        print(f"  Ch{ch}/{sub}: {dist[ch][sub]}")

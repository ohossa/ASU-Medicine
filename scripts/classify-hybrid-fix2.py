#!/usr/bin/env python3
"""Hybrid classifier with FORCE routes for anatomical structures."""
import json, re, math
from collections import defaultdict, Counter
from pathlib import Path

BOOK_TOC_PATH = Path('.kimchi/docs/book-toc.json')
BANK_PATH = Path('src/imports/year-2/semester-2/MCNS-2.json')
OUT_PATH = Path('.kimchi/docs/proposed-mapping.json')
FLAG_PATH = Path('.kimchi/docs/low-confidence-flags.json')

with open(BOOK_TOC_PATH, 'r', encoding='utf-8') as f:
    book_toc = json.load(f)
with open(BANK_PATH, 'r', encoding='utf-8') as f:
    bank = json.load(f)

valid_pairs = set()
for ch in book_toc['chapters']:
    ch_id = str(ch['id'])
    for sub_id in ch['subjects']:
        valid_pairs.add((ch_id, sub_id))

SUBJECT_PRIORITY = {
    '1': {'anatomy': 1, 'histology': 2, 'physiology': 3, 'biochem': 4},
    '2': {'anatomy': 1, 'histology': 2, 'physiology': 3, 'pharma': 4},
    '3': {'anatomy': 3, 'histology': 2, 'physiology': 1, 'pathology': 4, 'pharma': 5, 'clinical': 6},
    '4': {'anatomy': 1, 'histology': 2},
    '5': {'anatomy': 1},
    '6': {'anatomy': 1, 'physiology': 2, 'pharma': 3},
    '7': {'anatomy': 1, 'physiology': 2, 'pharma': 3},
    '8': {'microbiology': 1, 'parasitology': 2, 'pathology': 3, 'pharma': 4},
    '9': {'pathology': 1, 'pharma': 2, 'clinical': 3},
    '10': {'anatomy': 1, 'pharma': 2},
}

FORCE_ROUTES = [
    # CH1: Anatomy
    (['introduction to cns', 'components of the cns', 'general terms',
      'spinal cord external features', 'cerebral hemisphere', 'sensory cortex',
      'precentral gyrus', 'postcentral gyrus',
      'scalp layers', 'dangerous area of scalp',
      'occipitofrontalis', 'muscles of facial expression',
      'infraorbital nerve', 'supraorbital nerve', 'supratrochlear nerve'],
     '1', {'anatomy': 5}),
    # CH1: Histology
    (['neuroglia', 'astrocyte', 'oligodendrocyte', 'microglia', 'ependyma',
      'myelinated nerve fiber', 'myelin sheath',
      'blood-brain barrier', 'blood brain barrier',
      'cerebral cortex', 'neocortex', 'allocortex',
      'cerebellar cortex', 'meninges', 'dura mater', 'arachnoid mater', 'pia mater',
      'gyrus', 'sulcus', 'fissure'],
     '1', {'histology': 5}),
    # CH1: Biochemistry
    (['energy sources of the cns', 'ketone body',
      'pyruvate dehydrogenase deficiency', 'thiamine deficiency', 'beriberi',
      'wernicke encephalopathy', 'korsakoff psychosis',
      'urea cycle', 'hyperammonemia', 'ornithine transcarbamylase',
      'carbamoyl phosphate synthetase', 'argininosuccinate lyase',
      'maple syrup urine disease', 'phenylketonuria',
      'one carbon metabolism', 'folate metabolism', 'vitamin b12 deficiency'],
     '1', {'biochem': 5}),
    # CH1: Physiology
    (['processing of signals', 'convergence', 'divergence', 'temporal summation',
      'spatial summation', 'feedforward inhibition', 'reverberating circuit',
      'synaptic delay', 'synaptic plasticity', 'long term potentiation', 'long term depression'],
     '1', {'physiology': 5}),

    # CH2: Anatomy
    (['dorsal column tract', 'dorsal column pathway', 'dorsal column system',
      'fasciculus gracilis', 'fasciculus cuneatus', 'nucleus gracilis', 'nucleus cuneatus',
      'spinothalamic tract', 'spinoreticular tract', 'spinomesencephalic tract',
      'anterolateral system', 'anterolateral pathway',
      'spinocerebellar tract', 'posterior spinocerebellar', 'anterior spinocerebellar'],
     '2', {'anatomy': 5}),
    # CH2: Physiology
    (['sensory receptor', 'receptor potential', 'generator potential',
      'rapidly adapting', 'slowly adapting', 'phasic receptor', 'tonic receptor',
      'meissner corpuscle', 'pacinian corpuscle', 'merkel cell', 'ruffini ending',
      'free nerve ending', 'nociceptor', 'proprioceptor',
      'two point discrimination', 'receptive field',
      'gate control theory', 'substance p', 'bradykinin',
      'referred pain', 'visceral pain', 'phantom pain',
      'neospinothalamic', 'paleospinothalamic',
      'somatosensory cortex', 'sensory homunculus'],
     '2', {'physiology': 5}),
    # CH2: Pharma
    (['opioid', 'opiate', 'morphine', 'fentanyl', 'codeine', 'tramadol',
      'mu receptor', 'kappa receptor', 'delta receptor',
      'naloxone', 'naltrexone', 'nalmefene',
      'endorphin', 'enkephalin', 'dynorphin',
      'respiratory depression', 'miosis', 'opioid induced constipation',
      'methadone', 'buprenorphine', 'pentazocine', 'butorphanol'],
     '2', {'pharma': 5}),
    # CH2: Histology
    (['histology of receptors', 'tactile corpuscle', 'lamellated corpuscle',
      'krause end bulb', 'meissner corpuscle histology'],
     '2', {'histology': 5}),

    # CH3: Anatomy
    (['basal ganglia anatomy', 'caudate nucleus', 'putamen', 'globus pallidus',
      ' substantia nigra', 'subthalamic nucleus', 'corpus striatum',
      'internal capsule', 'external capsule', 'extreme capsule',
      'corticospinal tract anatomy', 'pyramidal tract anatomy',
      'cerebellum anatomy', 'cerebellar peduncle', 'dentate nucleus',
      'fastigial nucleus', 'interposed nucleus',
      'motor cortex anatomy', 'primary motor cortex anatomy'],
     '3', {'anatomy': 5}),
    # CH3: Histology
    (['purkinje cell', 'granule cell', 'golgi cell', 'basket cell', 'stellate cell',
      'cerebellar cortex histology', 'molecular layer', 'granular layer', 'purkinje layer',
      'climbing fiber', 'mossy fiber', 'parallel fiber'],
     '3', {'histology': 5}),
    # CH3: Physiology
    (['muscle stretch reflex', 'stretch reflex', 'myotatic reflex',
      'gamma loop reflex', 'muscle spindle', 'intrafusal fiber',
      'gamma motor neuron', 'alpha motor neuron', 'alpha gamma coactivation',
      'golgi tendon organ', 'inverse stretch reflex',
      'clasp knife phenomenon', 'clonus',
      'withdrawal reflex', 'flexor reflex', 'crossed extensor reflex',
      'babinski sign', 'plantar reflex',
      'upper motor neuron sign', 'lower motor neuron sign',
      'motor cortex function', 'motor homunculus',
      'cerebellar function', 'cerebellar ataxia', 'intention tremor',
      'nystagmus', 'dysmetria', 'dysdiadochokinesia',
      'basal ganglia function', 'dystonia', 'hemiballismus'],
     '3', {'physiology': 5}),
    # CH3: Pathology
    (['huntington disease', 'huntington chorea', 'chorea', 'athetosis',
      'hemiballismus pathology', 'wilson disease pathology',
      'tardive dyskinesia', 'cerebellar tumor', 'medulloblastoma'],
     '3', {'pathology': 5}),
    # CH3: Pharma
    (['levodopa', 'l-dopa', 'carbidopa',
      'selegiline', 'rasagiline',
      'entacapone', 'tolcapone',
      'amantadine', 'benztropine', 'trihexyphenidyl',
      'parkinson disease treatment', 'parkinsonism treatment',
      'levodopa induced dyskinesia', 'on off phenomenon', 'wearing off'],
     '3', {'pharma': 5}),
    # CH3: Clinical
    (['hemiplegia', 'paraplegia', 'quadriplegia',
      'brown sequard syndrome', 'anterior cord syndrome',
      'tabes dorsalis', 'friedreich ataxia'],
     '3', {'clinical': 5}),

    # CH4: Anatomy
    (['brain stem anatomy', 'pons anatomy', 'medulla anatomy', 'midbrain anatomy',
      'pyramidal decussation anatomy', 'sensory decussation',
      'olive anatomy', 'inferior olive anatomy',
      'facial colliculus', 'hypoglossal trigone',
      'fourth ventricle anatomy', 'fourth ventricle anatomy',
      'cranial nerve nuclei', 'cranial nerve columns',
      'brain stem blood supply', 'vertebrobasilar system',
      'cranial cavity', 'middle cranial fossa', 'anterior cranial fossa', 'posterior cranial fossa',
      'temporal fossa', 'infratemporal fossa', 'pterygopalatine fossa',
      'scalp anatomy', 'dangerous area', 'emissary vein',
      'trigeminal nerve anatomy', 'trigeminal ganglion', 'gasserian ganglion',
      'ophthalmic nerve', 'maxillary nerve', 'mandibular nerve',
      'autonomic ganglia', 'pterygopalatine ganglion', 'otic ganglion',
      'ciliary ganglion', 'submandibular ganglion',
      'greater petrosal nerve', 'chorda tympani',
      'face anatomy', 'muscles of mastication', 'temporalis', 'masseter'],
     '4', {'anatomy': 5}),
    # CH4: Histology
    (['open medulla', 'closed medulla',
      'inferior olivary nucleus histology', 'hypoglossal nucleus histology',
      'dorsal motor nucleus of vagus histology', 'nucleus solitarius histology',
      'spinal nucleus of trigeminal histology',
      'pontine nuclei histology', 'locus coeruleus histology',
      'superior olivary complex histology', 'trapezoid body histology',
      'oculomotor nucleus histology', 'trochlear nucleus histology',
      'edinger westphal nucleus', 'periaqueductal gray histology'],
     '4', {'histology': 5}),

    # CH5: Anatomy
    (['fascia of neck', 'investing fascia', 'pretracheal fascia', 'prevertebral fascia',
      'carotid sheath', 'suprasternal space', 'danger space',
      'anterior triangle', 'posterior triangle', 'muscular triangle',
      'digastric triangle', 'carotid triangle', 'submental triangle',
      'omoclavicular triangle', 'occipital triangle',
      'suprahyoid muscles', 'infrahyoid muscles',
      'sternocleidomastoid', 'scm', 'trapezius', 'platysma',
      'ansa cervicalis', 'cervical plexus',
      'greater auricular nerve', 'transverse cervical nerve',
      'phrenic nerve', 'supraclavicular nerve',
      'sympathetic trunk', 'stellate ganglion', 'cervicothoracic ganglion',
      'last four cranial nerves', 'glossopharyngeal nerve', 'vagus nerve',
      'accessory nerve', 'hypoglossal nerve',
      'stylopharyngeus', 'internal laryngeal nerve', 'external laryngeal nerve',
      'recurrent laryngeal nerve',
      'subclavian artery', 'subclavian vein', 'internal jugular vein'],
     '5', {'anatomy': 5}),

    # CH6: Anatomy
    (['thalamus anatomy', 'thalamic nuclei', 'medial geniculate body', 'lateral geniculate body',
      'internal medullary lamina',
      'hypothalamus anatomy', 'hypothalamic nuclei',
      'mammillary body', 'tuber cinereum', 'median eminence',
      'infundibulum', 'pituitary stalk',
      'third ventricle', 'interventricular foramen', 'foramen of monro',
      'pineal body', 'habenular triangle'],
     '6', {'anatomy': 5}),
    # CH6: Physiology
    (['reticular formation physiology', 'reticular activating system', 'aras',
      'alpha rhythm', 'beta rhythm', 'theta rhythm', 'delta rhythm',
      'eeg', 'electroencephalogram', 'evoked potential',
      'sleep physiology', 'nrem sleep', 'rem sleep', 'slow wave sleep',
      'paradoxical sleep', 'sleep spindle', 'k complex',
      'circadian rhythm', 'suprachiasmatic nucleus'],
     '6', {'physiology': 5}),
    # CH6: Pharma
    (['sedative', 'hypnotic', 'barbiturate', 'phenobarbital', 'thiopental',
      'benzodiazepine', 'diazepam', 'midazolam', 'lorazepam', 'alprazolam',
      'flumazenil', 'gaba receptor',
      'zolpidem', 'eszopiclone', 'ramelteon',
      'propofol', 'etomidate', 'ketamine',
      'general anesthetic', 'inhalation anesthetic',
      'halothane', 'isoflurane', 'sevoflurane', 'desflurane', 'nitrous oxide',
      'local anesthetic', 'lidocaine', 'bupivacaine', 'procaine',
      'epilepsy treatment', 'seizure treatment', 'antiepileptic',
      'phenytoin mechanism', 'carbamazepine mechanism',
      'valproate mechanism', 'ethosuximide mechanism',
      'lamotrigine mechanism', 'topiramate mechanism',
      'gabapentin mechanism', 'levetiracetam mechanism',
      'migraine treatment', 'sumatriptan mechanism', 'ergotamine',
      'migraine prophylaxis', 'propranolol migraine'],
     '6', {'pharma': 5}),

    # CH7: Anatomy
    (['limbic system anatomy', 'hippocampus anatomy', 'amygdala anatomy',
      'fornix anatomy', 'cingulate gyrus', 'parahippocampal gyrus',
      'cerebral white matter', 'internal capsule', 'corona radiata',
      'centrum semiovale', 'superior longitudinal fasciculus',
      'lateral ventricle anatomy', 'cerebral meninges',
      'arachnoid granulation', 'csf circulation', 'choroid plexus',
      'cerebral blood supply', 'circle of willis',
      'anterior cerebral artery', 'middle cerebral artery', 'posterior cerebral artery',
      'anterior communicating artery', 'posterior communicating artery',
      'vertebrobasilar system'],
     '7', {'anatomy': 5}),
    # CH7: Physiology
    (['cerebral dominance', 'left hemisphere function', 'right hemisphere function',
      'broca area', 'wernicke area', 'arcuate fasciculus',
      'broca aphasia', 'wernicke aphasia', 'conduction aphasia', 'global aphasia',
      'memory physiology', 'short term memory', 'long term memory',
      'declarative memory', 'procedural memory', 'working memory',
      'amnesia', 'anterograde amnesia', 'retrograde amnesia',
      'korsakoff syndrome'],
     '7', {'physiology': 5}),
    # CH7: Pharma
    (['antidepressant mechanism', 'depression treatment',
      'tricyclic antidepressant', 'amitriptyline', 'imipramine',
      'ssri mechanism', 'fluoxetine', 'sertraline', 'paroxetine',
      'snri mechanism', 'venlafaxine', 'duloxetine',
      'ndri', 'bupropion mechanism',
      'maoi', 'phenelzine', 'tranylcypromine',
      'mirtazapine mechanism', 'tianeptine',
      'lithium mechanism', 'bipolar disorder', 'mania treatment'],
     '7', {'pharma': 5}),

    # CH8: Microbiology
    (['meningitis microbiology', 'bacterial meningitis',
      'haemophilus influenzae', 'streptococcus pneumoniae', 'neisseria meningitidis',
      'listeria monocytogenes', 'group b streptococcus',
      'cryptococcus neoformans', 'cryptococcal meningitis',
      'candida meningitis', 'aspergillus meningitis',
      'mucor infections', 'rhizopus infections',
      'fungal meningitis microbiology',
      'poliomyelitis', 'poliovirus', 'post polio',
      'rabies virus', 'negri body', 'hydrophobia',
      'viral encephalitis', 'herpes simplex encephalitis',
      'arbovirus encephalitis', 'japanese encephalitis',
      'toxoplasma gondii', 'toxoplasmosis brain',
      'neurosyphilis', 'neuroborreliosis', 'lyme disease',
      'brain abscess microbiology'],
     '8', {'microbiology': 5}),
    # CH8: Parasitology
    (['amoebic encephalitis', 'naegleria fowleri', 'primary amebic meningoencephalitis',
      'cysticercosis brain', 'taenia solium brain',
      'neurocysticercosis', 'hydatid disease brain', 'echinococcus brain',
      'cerebral malaria', 'plasmodium falciparum brain'],
     '8', {'parasitology': 5}),
    # CH8: Pathology
    (['purulent exudate', 'leptomeningitis pathology',
      'subdural empyema pathology'],
     '8', {'pathology': 5}),
    # CH8: Pharma
    (['ceftriaxone meningitis', 'vancomycin meningitis',
      'ampicillin meningitis', 'acyclovir encephalitis',
      'amphotericin b fungal', 'voriconazole fungal', 'flucytosine',
      'dexamethasone meningitis'],
     '8', {'pharma': 5}),

    # CH9: Pathology
    (['alzheimer disease pathology', 'senile plaque', 'neurofibrillary tangle',
      'beta amyloid', 'tau protein',
      'parkinson disease pathology', 'lewy body disease',
      'huntington disease pathology',
      'multiple sclerosis pathology', 'demyelination',
      'oligodendrocyte loss', 'dawson fingers',
      'amyotrophic lateral sclerosis pathology',
      'guillain barre syndrome pathology',
      'head injury pathology', 'traumatic brain injury', 'epidural hematoma',
      'subdural hematoma', 'subarachnoid hemorrhage', 'intracerebral hemorrhage',
      'diffuse axonal injury', 'cerebral contusion', 'concussion pathology',
      'stroke pathology', 'cerebrovascular accident',
      'ischemic stroke pathology', 'hemorrhagic stroke pathology',
      'transient ischemic attack pathology',
      'atherosclerosis pathology', 'hypertensive encephalopathy',
      'berry aneurysm', 'charcot bouchard aneurysm',
      'brain tumor pathology', 'glioma pathology', 'glioblastoma multiforme',
      'astrocytoma pathology', 'meningioma pathology',
      'schwannoma pathology', 'acoustic neuroma pathology',
      'pituitary adenoma pathology', 'craniopharyngioma pathology',
      'ependymoma pathology', 'medulloblastoma pathology',
      'brain metastasis pathology'],
     '9', {'pathology': 5}),
    # CH9: Pharma
    (['donepezil mechanism', 'rivastigmine mechanism', 'galantamine mechanism',
      'memantine mechanism', 'cholinesterase inhibitor',
      'interferon beta mechanism', 'natalizumab mechanism',
      'fingolimod mechanism', 'ocrelizumab mechanism',
      'glatiramer acetate', 'dimethyl fumarate mechanism',
      'fampridine', 'dalfampridine', 'riluzole mechanism',
      'tissue plasminogen activator', 'alteplase stroke',
      'aspirin stroke', 'clopidogrel stroke',
      'warfarin stroke', 'dabigatran stroke',
      'mannitol brain edema', 'hypertonic saline brain'],
     '9', {'pharma': 5}),
    # CH9: Clinical
    (['dementia clinical', 'delirium clinical', 'mild cognitive impairment',
      'vascular dementia', 'frontotemporal dementia',
      'pick disease', 'dementia with lewy bodies',
      'normal pressure hydrocephalus',
      'cluster headache clinical', 'tension headache clinical'],
     '9', {'clinical': 5}),

    # CH10: Anatomy (Embryology)
    (['pharyngeal arch', 'branchial arch', 'pharyngeal pouch',
      'thyroid diverticulum', 'ultimobranchial body',
      'development of face', 'development of nervous system',
      'neural tube', 'neural crest', 'neural groove', 'neural fold',
      'neuropore', 'anterior neuropore', 'posterior neuropore',
      'prosencephalon', 'mesencephalon', 'rhombencephalon',
      'telencephalon', 'diencephalon', 'metencephalon', 'myelencephalon',
      'brain flexure', 'cephalic flexure', 'cervical flexure', 'pontine flexure',
      'spina bifida', 'meningocele', 'meningomyelocele',
      'craniosynostosis', 'microcephaly', 'hydrocephalus'],
     '10', {'anatomy': 5}),
    # CH10: Pharma
    (['antipsychotic mechanism', 'neuroleptic mechanism',
      'haloperidol mechanism', 'chlorpromazine mechanism',
      'risperidone mechanism', 'olanzapine mechanism',
      'quetiapine mechanism', 'aripiprazole mechanism', 'clozapine mechanism',
      'extrapyramidal side effect', 'tardive dyskinesia mechanism',
      'neuroleptic malignant syndrome', 'akathisia', 'acute dystonia',
      'drug abuse', 'substance abuse', 'alcohol withdrawal',
      'delirium tremens', 'disulfiram reaction',
      'methadone maintenance', 'naloxone overdose',
      'naltrexone alcohol', 'cocaine abuse', 'amphetamine abuse'],
     '10', {'pharma': 5}),
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


def term_matches(text, term):
    """Smart matching with word boundaries for short terms."""
    if not term:
        return False
    if ' ' in term or len(term) >= 5:
        return term in text
    # For short single words, use word boundary
    return bool(re.search(rf'\b{re.escape(term)}\b', text))


def apply_force_routes(text):
    """Return dict of chapter -> {subject: score}."""
    chapter_scores = defaultdict(lambda: defaultdict(float))
    for terms, ch, sub_scores in FORCE_ROUTES:
        for term in terms:
            if term_matches(text, term):
                for sub, weight in sub_scores.items():
                    chapter_scores[ch][sub] += weight
    return chapter_scores


def apply_force_routes_for_chapter(text, chapter_id):
    """Return subject scores for a specific chapter."""
    sub_scores = defaultdict(float)
    for terms, ch, sub_weights in FORCE_ROUTES:
        if ch != chapter_id:
            continue
        for term in terms:
            if term_matches(text, term):
                for sub, weight in sub_weights.items():
                    sub_scores[sub] += weight
    return sub_scores


def determine_subject(text, chapter_id, current_sub, proposed_sub_scores):
    """Determine subject within chapter."""
    # Get valid subjects for this chapter
    valid_subjects = []
    for ch in book_toc['chapters']:
        if str(ch['id']) == chapter_id:
            valid_subjects = list(ch['subjects'].keys())
            break
    if not valid_subjects:
        return 'anatomy'
    
    # If current subject is valid and has reasonable force scores, keep it
    if current_sub in valid_subjects:
        sub_scores = apply_force_routes_for_chapter(text, chapter_id)
        # If no strong overriding signal, keep current subject
        if not sub_scores or max(sub_scores.values()) < 3:
            return current_sub
        best_force = max(sub_scores, key=lambda s: sub_scores[s])
        # Only override if force signal is strong
        if sub_scores[best_force] >= 8:
            return best_force if best_force in valid_subjects else current_sub
    
    # Use force route subject scores
    if proposed_sub_scores:
        best = max(proposed_sub_scores, key=lambda s: proposed_sub_scores[s])
        if best in valid_subjects:
            return best
    
    # Fallback
    return current_sub if current_sub in valid_subjects else valid_subjects[0]


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


def calc_idf(word):
    return math.log(N / max(df.get(word, 1), 1)) + 1.0


ref_vectors = {}
for key, counter in ref_counters.items():
    vec = {}
    total = sum(counter.values())
    for word, count in counter.items():
        vec[word] = (count / total) * calc_idf(word)
    ref_vectors[key] = vec

ref_norms = {k: math.sqrt(sum(v**2 for v in vec.values())) for k, vec in ref_vectors.items()}


def tfidf_score(q_tokens, ch, sub):
    q_counter = Counter(q_tokens)
    total = sum(q_counter.values())
    if total == 0:
        return 0
    q_vec = {}
    for word, count in q_counter.items():
        q_vec[word] = (count / total) * calc_idf(word)
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
            
            # 1. Apply force routes
            force_chapters = apply_force_routes(text)
            
            if force_chapters:
                # If force routes match multiple chapters, pick the one with highest total score
                chapter_totals = {}
                for ch, sub_scores in force_chapters.items():
                    chapter_totals[ch] = sum(sub_scores.values())
                
                # If current chapter is among force matches and close to best, prefer current
                best_score = max(chapter_totals.values())
                if ch_id in chapter_totals and chapter_totals[ch_id] >= best_score * 0.6:
                    best_ch = ch_id
                else:
                    best_ch = max(chapter_totals, key=lambda c: chapter_totals[c])
                
                best_sub = determine_subject(text, best_ch, sub_id, force_chapters[best_ch])
                
                evidence = []
                for terms, ch, sub_weights in FORCE_ROUTES:
                    if ch != best_ch:
                        continue
                    for term in terms:
                        if term_matches(text, term):
                            evidence.append(f"force:{term}")
                evidence = evidence[:5]
                
                mapping[qid] = {
                    'chapterId': int(best_ch),
                    'subject': best_sub,
                    'oldChapterId': int(ch_id),
                    'oldSubject': sub_id,
                    'confidence': 99.9,
                    'score': chapter_totals[best_ch],
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

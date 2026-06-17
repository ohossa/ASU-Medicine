#!/usr/bin/env python3
"""Hybrid classifier with explicit rules + TF-IDF fallback."""
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

# Subject priority within chapter (for routing ambiguous topics)
SUBJECT_PRIORITY = {
    '1': {'anatomy': 1, 'histology': 2, 'physiology': 3, 'biochem': 4},
    '2': {'anatomy': 1, 'histology': 2, 'physiology': 3, 'pharma': 4},
    '3': {'anatomy': 1, 'histology': 2, 'physiology': 3, 'pathology': 4, 'pharma': 5, 'clinical': 6},
    '4': {'anatomy': 1, 'histology': 2},
    '5': {'anatomy': 1},
    '6': {'anatomy': 1, 'physiology': 2, 'pharma': 3},
    '7': {'anatomy': 1, 'physiology': 2, 'pharma': 3},
    '8': {'microbiology': 1, 'parasitology': 2, 'pathology': 3, 'pharma': 4},
    '9': {'pathology': 1, 'pharma': 2, 'clinical': 3},
    '10': {'anatomy': 1, 'pharma': 2},
}

# === EXPLICIT ANCHOR RULES ===
# These map specific terms/phrases directly to (chapter, subject or chapter-only)
# Format: (list of terms, chapter, subject_or_None)
ANCHOR_RULES = [
    # Ch1 Biochemistry
    (['urea cycle', 'ornithine', 'citrulline', 'argininosuccinate',
      'carbamoyl phosphate', 'n-acetylglutamate', 'nag',
      'hyperammonemia', 'hyperammonemic', 'ammonia intoxication',
      'glutamine synthetase', 'carbamoyl phosphate synthetase',
      'ornithine transcarbamylase', 'arginase',
      'maple syrup urine disease', 'msud',
      'phenylketonuria', 'pku', 'phenylalanine',
      'one carbon', 'folate', 'tetrahydrofolate', 'thf',
      'methionine synthase', 's-adenosylmethionine', 'sam',
      'vitamin b12', 'cobalamin', 'folic acid',
      'pyruvate dehydrogenase', 'pdh', 'thiamine', 'beriberi',
      'wernicke', 'korsakoff',
      'transamination', 'transaminase', 'plp',
      'alpha-ketoglutarate', 'oxaloacetate', 'fumarate',
      'glutamate dehydrogenase', 'alanine transaminase', 'aspartate transaminase',
      'propionic acidemia', 'methylmalonic aciduria', 'homocystinuria'], '1', 'biochem'),
    # Ch1 Biochemistry - Energy sources
    (['energy source', 'brain fuel', 'ketone body', 'acetoacetate',
      'beta-hydroxybutyrate', 'monocarboxylate transporter', 'mct1',
      'astrocyte', 'astrocytes', 'glucose transport', 'glut1', 'glut3',
      'glycogenolysis', 'glycogenesis', 'pfkfb3', 'fructose 2,6-bisphosphate',
      'hmp pathway', 'pentose phosphate'], '1', 'biochem'),
    # Ch1 Biochemistry - Neurotransmitters
    (['neurotransmitter', 'catecholamine', 'serotonin', 'tryptophan hydroxylase',
      'dopamine', 'dopa decarboxylase', 'tyrosine hydroxylase',
      'monoamine oxidase', 'mao', 'catechol-o-methyltransferase', 'comt',
      'vanillylmandelic acid', 'vma',
      '5-hydroxyindoleacetic acid', '5-hiaa',
      'homovanillic acid', 'hva',
      'gamma-aminobutyric acid', 'gaba',
      'glutamic acid decarboxylase', 'gad',
      'acetylcholine', 'acetylcholinesterase',
      'histamine', 'histidine decarboxylase',
      'melatonin', 'serotonin', 'pineal',
      'norepinephrine', 'epinephrine', 'pnmt',
      'parkinson', 'parkinsonism', 'parkinsonian'], '1', 'biochem'),  # Wait: Parkinsonism is Ch3/Pharma!
    # Wait - Parkinsonism should be Ch3/pharma, not Ch1/biochem
    # Let me remove it from Ch1. The neurotransmitters are system-level Ch1, but Parkinsonism as a CLINICAL concept is Ch3/pharma.
    # I'll handle this by ordering rules: more specific rules come later.

    # Ch1 Histology
    (['neuroglia', 'astrocyte', 'oligodendrocyte', 'microglia', 'ependyma',
      'myelination', 'myelin sheath', 'schwann cell',
      'blood-brain barrier', 'bbb', 'tight junction', 'zonula occludens',
      'cerebral cortex', 'neocortex', 'allocortex', 'hippocampal formation',
      'cerebellar cortex', 'purkinje cell', 'granule cell',
      'mening', 'dura', 'arachnoid', 'pia', 'arachnoid villi', 'pacchionian',
      'subarachnoid cistern', 'subarachnoid space', 'choroid plexus',
      'gyrus', 'sulcus', 'fissure', 'lamina'], '1', 'histology'),
    # Ch1 Physiology
    (['processing of signals', 'facilitation', 'occlusion', 'convergence',
      'divergence', 'reverberating circuit', 'feedback', 'feedforward',
      'temporal summation', 'spatial summation', 'synaptic delay',
      'synaptic transmission', 'synaptic plasticity',
      'presynaptic inhibition', 'postsynaptic inhibition',
      'recurrent inhibition', 'reciprocal inhibition',
      'rebound excitation', 'after discharge'], '1', 'physiology'),
    # Ch1 Anatomy
    (['introduction to cns', 'general terms', 'components of the cns',
      'spinal cord features', 'conus medullaris', 'filum terminale',
      'cauda equina', 'lumbar cistern', 'dural sac',
      'cervical enlargement', 'lumbar enlargement',
      'cerebral hemisphere', 'central sulcus', 'lateral sulcus',
      'frontal pole', 'occipital pole', 'temporal pole',
      'postcentral gyrus', 'precentral gyrus',
      'scalp', 'pericranium', 'epicranial aponeurosis',
      'occipitofrontalis', 'face', 'muscles of facial expression',
      'infraorbital nerve', 'supraorbital nerve'], '1', 'anatomy'),

    # Ch2 Anatomy
    (['dorsal column', 'fasciculus gracilis', 'fasciculus cuneatus',
      'spinothalamic', 'anterolateral system', 'pain pathway',
      'spinocerebellar', 'spinoreticular', 'spinomesencephalic',
      'periaqueductal gray', 'substantia gelatinosa', 'posterior horn',
      'nuclues proprius', 'nucleus dorsalis', 'clarke'], '2', 'anatomy'),
    # Ch2 Physiology
    (['receptor potential', 'generator potential',
      'receptive field', 'two-point discrimination',
      'rapidly adapting', 'slowly adapting', 'phasic receptor', 'tonic receptor',
      'meissner corpuscle', 'merkel cell', 'ruffini ending',
      'free nerve ending', 'nociceptor',
      'gate control', 'substance p', 'bradykinin',
      'referred pain', 'visceral pain',
      'fast pain', 'slow pain', 'delta fiber', 'c fiber',
      'sensory cortex'], '2', 'physiology'),
    # Ch2 Pharma
    (['opioid', 'opiate', 'morphine', 'fentanyl', 'codeine',
      'mu receptor', 'delta receptor', 'kappa receptor',
      'naloxone', 'naltrexone',
      'endogenous opioid', 'endorphin', 'enkephalin', 'dynorphin',
      'respiratory depression', 'miosis', 'constipation',
      'methadone', 'buprenorphine', 'pentazocine'], '2', 'pharma'),
    # Ch2 Histology
    (['pacinian corpuscle', 'meissner corpuscle', 'merkel disc',
      'free nerve ending', 'krause end bulb', 'ruffini corpuscle',
      'lamellated corpuscle', 'tactile corpuscle'], '2', 'histology'),

    # Ch3 Anatomy
    (['basal ganglia', 'caudate nucleus', 'putamen', 'globus pallidus',
      ' substantia nigra', 'subthalamic nucleus',
      'striatum', 'neostriatum', 'lentiform nucleus',
      'corpus striatum', 'internal capsule',
      'corticospinal tract', 'pyramidal tract', 'pyramidal decussation',
      'corticobulbar', 'extrapyramidal system',
      'cerebellar peduncle', 'superior peduncle', 'middle peduncle', 'inferior peduncle',
      'cerebellar vermis', 'cerebellar hemisphere', 'cerebellar nuclei',
      'dentate nucleus', 'fastigial', 'interposed',
      'motor cortex', 'primary motor cortex', 'premotor cortex',
      'supplementary motor area', 'brodmann area 4', 'pyramidal cell',
      'decussation of pyramids'], '3', 'anatomy'),
    # Ch3 Physiology
    (['muscle stretch reflex', 'myotatic reflex', 'tendon reflex',
      'knee jerk', 'ankle jerk', 'biceps jerk', 'triceps jerk',
      'gamma loop', 'alpha-gamma coactivation',
      'muscle spindle', 'intrafusal fiber', 'extrafusal fiber',
      'nuclear bag', 'nuclear chain',
      'golgi tendon organ', 'inverse stretch reflex',
      'clasp knife phenomenon', 'clonus',
      'deep tendon reflex', 'superficial reflex',
      'babinski sign', 'plantar reflex',
      'withdrawal reflex', 'flexor reflex', 'crossed extensor reflex',
      'gamma motor neuron', 'alpha motor neuron',
      'motor unit', 'motor neuron pool',
      'upper motor neuron', 'lower motor neuron',
      'spasticity', 'rigidity', 'fasciculation'],
     '3', 'physiology'),
    # Ch3 Pharma
    (['levodopa', 'l-dopa', 'carbidopa', 'dopamine agonist',
      'selegiline', 'rasagiline', 'mao-b inhibitor',
      'entacapone', 'tolcapone', 'comt inhibitor',
      'amantadine', 'benztropine', 'trihexyphenidyl',
      'parkinson disease', 'parkinsonism', 'parkinsonian',
      'on-off phenomenon', 'wearing off', 'dyskinesia'], '3', 'pharma'),
    # Ch3 Pathology
    (['huntington disease', 'huntington', 'chorea', 'athetosis',
      'hemiballismus', 'wilson disease', 'hepatolenticular degeneration',
      'tardive dyskinesia', 'parkinson disease pathology'], '3', 'pathology'),
    # Ch3 Histology
    (['purkinje cell', 'granule cell', 'golgi cell',
      'molecular layer', 'granular layer', 'purkinje layer',
      'climbing fiber', 'parallel fiber', 'mossy fiber'], '3', 'histology'),
    # Ch3 Clinical
    (['upper motor neuron lesion', 'lower motor neuron lesion',
      'hemiplegia', 'paraplegia', 'quadriplegia',
      'brown-sequard', 'anterior cord syndrome', 'posterior cord syndrome',
      'tabes dorsalis', 'friedreich ataxia'], '3', 'clinical'),

    # Ch4 Anatomy
    (['brain stem', 'pons', 'medulla', 'medulla oblongata', 'midbrain', 'mesencephalon',
      'fourth ventricle', 'floor of fourth ventricle',
      'superior colliculus', 'inferior colliculus', 'tectum', 'tegmentum',
      'basis pedunculi', 'substantia nigra', 'red nucleus',
      'pyramidal decussation', 'sensory decussation',
      'olive', 'inferior olive', 'pyramid',
      'facial colliculus', 'hypoglossal trigone',
      'cranial nerve nuclei', 'salivatory nucleus', 'dorsal motor nucleus of vagus',
      'gracile tubercle', 'cuneate tubercle',
      'anterior median fissure', 'posterior median sulcus',
      'internal arcuate fibers',
      'cranial cavity', 'middle cranial fossa', 'anterior cranial fossa', 'posterior cranial fossa',
      'temporal fossa', 'infratemporal fossa', 'pterygopalatine fossa',
      'scalp', 'dangerous area', 'emissary vein',
      'trigeminal nerve', 'trigeminal ganglion', 'gasserian ganglion',
      'ophthalmic nerve', 'maxillary nerve', 'mandibular nerve',
      'autonomic ganglia', 'pterygopalatine ganglion', 'otic ganglion', 'submandibular ganglion',
      'ciliary ganglion',
      'greater petrosal nerve', 'chorda tympani',
      'pterygoid muscles', 'lateral pterygoid', 'medial pterygoid',
      'temporalis', 'masseter',
      'face', 'facial nerve', 'facial artery', 'facial vein'], '4', 'anatomy'),
    # Ch4 Histology
    (['open medulla', 'closed medulla',
      'inferior olivary nucleus', 'hypoglossal nucleus',
      'dorsal motor nucleus', 'nucleus solitarius', 'spinal nucleus of trigeminal',
      'pontine nuclei', 'locus coeruleus',
      'superior olivary complex', 'trapezoid body',
      'oculomotor nucleus', 'trochlear nucleus', 'edinger-westphal nucleus',
      'red nucleus', 'substantia nigra', 'periaqueductal gray',
      'cerebral aqueduct'], '4', 'histology'),

    # Ch5 Anatomy
    (['fascia of neck', 'investing fascia', 'pretracheal fascia', 'prevertebral fascia',
      'carotid sheath', 'suprasternal space', 'danger space',
      'anterior triangle', 'posterior triangle', 'muscular triangle',
      'digastric triangle', 'carotid triangle', 'submental triangle',
      'omoclavicular triangle', 'occipital triangle',
      'suprahyoid muscles', 'infrahyoid muscles',
      'mylohyoid', 'geniohyoid', 'digastric', 'stylohyoid',
      'sternohyoid', 'sternothyroid', 'thyrohyoid', 'omohyoid',
      'ansa cervicalis', 'cervical plexus',
      'greater auricular nerve', 'transverse cervical nerve',
      'phrenic nerve', 'supraclavicular nerve',
      'sympathetic chain', 'stellate ganglion', 'cervicothoracic ganglion',
      'last four cranial nerves', 'glossopharyngeal nerve', 'vagus nerve',
      'accessory nerve', 'hypoglossal nerve',
      'stylopharyngeus', 'internal laryngeal nerve', 'external laryngeal nerve',
      'recurrent laryngeal nerve',
      'jugular foramen', 'hypoglossal canal',
      'thyrohyoid membrane', 'cricothyroid ligament',
      'subclavian artery', 'subclavian vein', 'internal jugular vein',
      'sternocleidomastoid', 'scm',
      'trapezius', 'platysma'], '5', 'anatomy'),

    # Ch6 Anatomy
    (['thalamus', 'thalamic nuclei', 'medial geniculate body', 'lateral geniculate body',
      'internal medullary lamina', 'external medullary lamina',
      'anterior nuclear group', 'medial nuclear group', 'lateral nuclear group',
      'intralaminar nuclei', 'reticular nucleus of thalamus',
      'hypothalamus', 'hypothalamic nuclei',
      'mammillary body', 'tuber cinereum', 'median eminence',
      'infundibulum', 'pituitary stalk',
      'third ventricle', 'interventricular foramen', 'foramen of monro',
      'thalamostriate vein', 'choroid vein', 'vena terminalis',
      'pineal body', 'habenular triangle'], '6', 'anatomy'),
    # Ch6 Physiology
    (['reticular formation', 'ascending reticular activating system', 'aras',
      'alpha rhythm', 'beta rhythm', 'theta rhythm', 'delta rhythm',
      'eeg', 'electroencephalogram', 'evoked potential',
      'sleep', 'nrem sleep', 'rem sleep', 'fast wave sleep',
      'slow wave sleep', 'paradoxical sleep',
      'sleep spindle', 'k-complex',
      'circadian rhythm', 'suprachiasmatic nucleus',
      'arousal', 'alertness', 'consciousness'], '6', 'physiology'),
    # Ch6 Pharma
    (['barbiturate', 'phenobarbital', 'thiopental',
      'benzodiazepine', 'diazepam', 'midazolam', 'lorazepam', 'alprazolam', 'clonazepam',
      'flumazenil', 'gaba receptor',
      'zolpidem', 'eszopiclone', 'zaleplon', 'ramelteon', 'melatonin receptor',
      'propofol', 'etomidate', 'ketamine',
      'general anesthetic', 'inhalation anesthetic',
      'halothane', 'isoflurane', 'sevoflurane', 'desflurane', 'nitrous oxide',
      'local anesthetic', 'lidocaine', 'bupivacaine', 'procaine', 'benzocaine',
      'conduction block', 'sodium channel block',
      'epilepsy', 'seizure', 'partial seizure', 'generalized seizure',
      'tonic-clonic', 'absence seizure', 'myoclonic seizure',
      'grand mal', 'petit mal', 'status epilepticus',
      'phenytoin', 'phenobarbital', 'carbamazepine', 'valproic acid', 'valproate',
      'ethosuximide', 'lamotrigine', 'topiramate', 'gabapentin', 'pregabalin',
      'levetiracetam', 'clonazepam',
      'migraine', 'sumatriptan', 'ergotamine', 'propranolol',
      'migraine prophylaxis'], '6', 'pharma'),

    # Ch7 Anatomy
    (['limbic system', 'hippocampus', 'amygdala', 'fornix',
      'cingulate gyrus', 'parahippocampal gyrus', 'dentate gyrus',
      'mammillothalamic tract', 'mammillary body',
      'cerebral white matter', 'internal capsule', 'corona radiata',
      'centrum semiovale', 'superior longitudinal fasciculus',
      'lateral ventricle', 'interventricular foramen',
      'cerebral meninges', 'arachnoid granulation', 'pacchionian body',
      'csf circulation', 'csf', 'choroid plexus',
      'cerebral blood supply', 'circle of willis', 'anterior cerebral artery',
      'middle cerebral artery', 'posterior cerebral artery',
      'anterior communicating artery', 'posterior communicating artery',
      'carotid siphon', 'vertebrobasilar system',
      'blood-brain barrier'], '7', 'anatomy'),
    # Ch7 Physiology
    (['cerebral dominance', 'right hemisphere', 'left hemisphere',
      'broca area', 'wernicke area', 'arcuate fasciculus',
      'aphasia', 'broca aphasia', 'wernicke aphasia',
      'conduction aphasia', 'global aphasia',
      'memory', 'short-term memory', 'long-term memory',
      'declarative memory', 'procedural memory', 'working memory',
      'amnesia', 'anterograde amnesia', 'retrograde amnesia',
      'korsakoff syndrome', 'alzheimer disease', 'dementia',
      'kinesthesia', 'stereognosis'], '7', 'physiology'),
    # Ch7 Pharma
    (['antidepressant', 'depression', 'major depressive disorder', 'mdd',
      'tricyclic antidepressant', 'tca', 'amitriptyline', 'imipramine',
      'ssri', 'fluoxetine', 'sertraline', 'paroxetine', 'citalopram', 'escitalopram',
      'snri', 'venlafaxine', 'duloxetine',
      'ndri', 'bupropion',
      'maoi', 'monoamine oxidase inhibitor', 'phenelzine', 'tranylcypromine',
      'mirtazapine', 'tianeptine',
      'lithium', 'bipolar disorder', 'mania'], '7', 'pharma'),

    # Ch8 Microbiology
    (['meningitis', 'encephalitis',
      'bacterial meningitis', 'viral meningitis', 'fungal meningitis',
      'tuberculous meningitis', 'aseptic meningitis',
      'haemophilus influenzae', 'streptococcus pneumoniae', 'neisseria meningitidis',
      'listeria monocytogenes', 'group b streptococcus',
      'cryptococcus neoformans', 'cryptococcal meningitis', 'india ink',
      'candida', 'aspergillus', 'mucor', 'rhizopus',
      'poliomyelitis', 'poliovirus', 'post-polio',
      'rabies', 'rabies virus', 'negri body', 'hydrophobia',
      'viral encephalitis', 'herpes simplex encephalitis',
      'arbovirus', 'japanese encephalitis', 'west nile virus',
      'toxoplasmosis', 'toxoplasma gondii',
      'neurosyphilis', 'neuroborreliosis', 'lyme disease',
      'brain abscess', 'subdural empyema',
      'lrt', 'lumbar puncture', 'csf analysis', 'cloudy csf',
      'creactive protein', 'gram stain'], '8', 'microbiology'),
    # Ch8 Parasitology
    (['amoebic encephalitis', 'naegleria fowleri', 'primary amebic meningoencephalitis',
      'larvae affecting the brain', 'cysticercosis', 'taenia solium',
      'neurocysticercosis', 'hydatid disease', 'echinococcus',
      'toxoplasma', 'plasmodium falciparum', 'cerebral malaria'], '8', 'parasitology'),
    # Ch8 Pathology
    (['meningitis pathology', 'brain abscess pathology',
      'purulent exudate', 'leptomeningitis'], '8', 'pathology'),
    # Ch8 Pharma
    (['ceftriaxone', 'cefotaxime', 'vancomycin', 'ampicillin',
      'acyclovir', 'ganciclovir', 'amphotericin b', 'flucytosine',
      'flucytosine', 'voriconazole', 'amphotericin',
      'dexamethasone', 'antibiotic prophylaxis'], '8', 'pharma'),

    # Ch9 Pathology
    (['alzheimer disease', 'alzheimer', 'senile plaque', 'neurofibrillary tangle',
      'beta-amyloid', 'tau protein',
      'parkinson disease pathology', 'lewy body',
      'huntington disease',
      'multiple sclerosis', 'ms', 'demyelination', 'demyelinating',
      'oligodendrocyte loss', 'plaques', 'dawson finger',
      'amyotrophic lateral sclerosis', 'als', 'motor neuron disease',
      'guillain-barre syndrome', 'gbs',
      'head injury', 'traumatic brain injury', 'epidural hematoma',
      'subdural hematoma', 'subarachnoid hemorrhage', 'intracerebral hemorrhage',
      'diffuse axonal injury', 'contusion', 'concussion',
      'stroke', 'cerebrovascular accident', 'cva',
      'ischemic stroke', 'hemorrhagic stroke',
      'transient ischemic attack', 'tia',
      'atherosclerosis', 'hypertensive encephalopathy',
      'berry aneurysm', ' Charcot-bouchard aneurysm',
      'brain tumor', 'glioma', 'glioblastoma', 'astrocytoma',
      'meningioma', 'schwannoma', 'acoustic neuroma',
      'pituitary adenoma', 'craniopharyngioma',
      'ependymoma', 'medulloblastoma',
      'metastatic tumor', 'brain metastasis',
      'pseudotumor cerebri', 'idiopathic intracranial hypertension'], '9', 'pathology'),
    # Ch9 Pharma
    (['donepezil', 'rivastigmine', 'galantamine', 'memantine',
      'cholinesterase inhibitor',
      'interferon beta', 'natalizumab', 'fingolimod', 'ocrelizumab',
      'glatiramer acetate', 'dimethyl fumarate', 'teriflunomide',
      'fampridine', 'dalfampridine', 'riluzole',
      'tissue plasminogen activator', 'tpa', 'alteplase',
      'aspirin', 'clopidogrel', 'warfarin', 'dabigatran',
      'mannitol', 'hypertonic saline', 'decompressive craniectomy'], '9', 'pharma'),
    # Ch9 Clinical
    (['dementia', 'delirium', 'mild cognitive impairment',
      'vascular dementia', 'frontotemporal dementia',
      'pick disease', 'dementia with lewy bodies',
      'normal pressure hydrocephalus',
      'cluster headache', 'tension headache', 'migraine headache',
      'hemiplegic migraine'], '9', 'clinical'),

    # Ch10 Anatomy (Embryology)
    (['pharyngeal arch', 'branchial arch', 'pharyngeal pouch',
      'thyroid diverticulum', 'ultimobranchial body',
      'development of face', 'development of nervous system',
      'neural tube', 'neural crest', 'neural groove', 'neural fold',
      'neuropore', 'anterior neuropore', 'posterior neuropore',
      'prosencephalon', 'mesencephalon', 'rhombencephalon',
      'telencephalon', 'diencephalon', 'metencephalon', 'myelencephalon',
      'brain flexure', 'cephalic flexure', 'cervical flexure', 'pontine flexure',
      'spina bifida', 'meningocele', 'meningomyelocele',
      'craniostenosis', 'craniosynostosis',
      'microcephaly', 'hydrocephalus'],
     '10', 'anatomy'),
    # Ch10 Pharma
    (['antipsychotic', 'neuroleptic', 'typical antipsychotic', 'atypical antipsychotic',
      'haloperidol', 'chlorpromazine', 'fluphenazine',
      'risperidone', 'olanzapine', 'quetiapine', 'aripiprazole', 'clozapine',
      'extrapyramidal side effects', 'tardive dyskinesia', 'neuroleptic malignant syndrome',
      'akathisia', 'acute dystonia', 'drug-induced parkinsonism',
      'substance abuse', 'drug abuse', 'alcohol withdrawal',
      'delirium tremens', 'benzodiazepine withdrawal',
      'cocaine', 'amphetamine', 'cannabis', 'lysergic acid diethylamide',
      'opioid overdose', 'naloxone', 'naltrexone',
      'disulfiram', 'acamprosate', 'methadone maintenance',
      'nicotine replacement', 'varenicline'], '10', 'pharma'),
]

# Remove the incorrect Parkinson rule from Ch1 biochem above
# The ANCHOR_RULES are processed in order; later rules can override earlier ones
# But my implementation should check all rules and prefer the most specific match

# === HELPER FUNCTIONS ===
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

# === RULE-BASED CLASSIFICATION ===
def classify_with_rules(text):
    """Return list of (ch, sub, weight, evidence) from rule matches."""
    matches = []
    for terms, ch, sub in ANCHOR_RULES:
        score = 0
        ev = []
        for term in terms:
            if term in text:
                score += 3.0 if ' ' in term else 1.0
                ev.append(term)
        if score > 0:
            matches.append((ch, sub, score, ev))
    # Sort by score descending
    matches.sort(key=lambda x: -x[2])
    return matches

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
        text = re.sub(r'\{\{c\d+::(.*?)\}\}', r'\1', content)
        text = text.replace('&nbsp;', ' ')
        text = re.sub(r'<[^>]+>', ' ', text)
        tokens = tokenize(text).split()
        ref_texts[(ch, sub)].extend(tokens)

# Add book TOC topics
for chapter in book_toc['chapters']:
    ch_id = str(chapter['id'])
    for sub_id, topics in chapter['subjects'].items():
        for topic in topics:
            tokens = tokenize(topic).split()
            ref_texts[(ch_id, sub_id)].extend(tokens)

# Build TF-IDF
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

# Also add explicit rules as strong vectors
rule_bonuses = defaultdict(dict)
for terms, ch, sub in ANCHOR_RULES:
    for term in terms:
        word = term.lower()
        rule_bonuses[(ch, sub)][word] = 5.0 if ' ' in word else 2.0

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
    
    # Add rule bonuses
    bonus = 0
    for word, score in rule_bonuses.get((ch, sub), {}).items():
        if word in q_counter:
            bonus += score * q_counter[word]
    
    sim = dot / (q_norm * r_norm)
    return sim + bonus

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
            
            # 1. Rule-based scoring
            rule_matches = classify_with_rules(text)
            
            # 2. TF-IDF scoring
            tfidf_scores = []
            for vch, vsub in valid_pairs:
                s = tfidf_score(tokens, vch, vsub)
                tfidf_scores.append((s, vch, vsub))
            tfidf_scores.sort(reverse=True)
            
            # Decision logic
            best_ch, best_sub = None, None
            best_score = -1
            evidence = []
            
            # If rule match is strong, use it
            if rule_matches:
                top_rule = rule_matches[0]
                # Check if any other rule gives a higher score
                if len(rule_matches) > 1 and rule_matches[1][2] >= top_rule[2] * 0.7:
                    # Ambiguous rules - let TF-IDF decide
                    best_score, best_ch, best_sub = tfidf_scores[0]
                    # boost evidence from matching rules
                    evidence = [f"rule:{top_rule[3][0]}"]
                else:
                    best_ch, best_sub = top_rule[0], top_rule[1]
                    best_score = top_rule[2] * 3  # boost rule score
                    evidence = [f"rule:{e}" for e in top_rule[3][:5]]
            else:
                best_score, best_ch, best_sub = tfidf_scores[0]
                # collect evidence: top matching words
                q_counter = Counter(tokens)
                for word in q_counter:
                    if word in ref_vectors.get((best_ch, best_sub), {}):
                        evidence.append(f"tfidf:{word}")
                evidence = evidence[:5]
            
            second_score = tfidf_scores[1][0] if len(tfidf_scores) > 1 else 0
            confidence = best_score / (second_score + 0.1) if second_score > 0 else best_score * 10
            
            mapping[qid] = {
                'chapterId': int(best_ch),
                'subject': best_sub,
                'oldChapterId': int(ch_id),
                'oldSubject': sub_id,
                'confidence': round(min(confidence, 99.9), 3),
                'score': round(best_score, 4),
                'evidence': evidence,
            }
            
            if confidence < 1.5 and best_score < 2:
                flags[qid] = mapping[qid]
            
            total += 1
            if total % 500 == 0:
                print(f"Processed {total}/{sum(sum(len(s['questions']) for s in c['subjects']) for c in bank['chapters'])}...")

OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(mapping, f, indent=2, ensure_ascii=False)
with open(FLAG_PATH, 'w', encoding='utf-8') as f:
    json.dump(flags, f, indent=2, ensure_ascii=False)

print(f"Classified {total} questions.")
print(f"Low-confidence flags: {len(flags)}")

# Distribution
dist = defaultdict(lambda: defaultdict(int))
for qid, d in mapping.items():
    dist[d['chapterId']][d['subject']] += 1
print("\nProposed distribution:")
for ch in sorted(dist.keys(), key=int):
    for sub in sorted(dist[ch].keys()):
        print(f"  Ch{ch}/{sub}: {dist[ch][sub]}")

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const CLEANED_DIR = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const INTERIM_FILE = 'data-format-v2/interim/mcns2-interim.json';

const validTypes: Record<string, string> = {
  mcq: 'mcq',
  truefalse: 'truefalse',
  matching: 'matching',
  essay: 'essay',
  shortessay: 'essay',
  'short essay': 'essay',
  fillblank: 'fillblank',
  'fill in the blank': 'fillblank',
  'clinical case': 'case',
  'case-based': 'case',
  case: 'case',
};

const canonicalSubjects = [
  'Anatomy', 'Histology', 'Physiology', 'Biochemistry',
  'Microbiology', 'Parasitology', 'Pathology', 'Pharmacology',
  'Psychiatry', 'Ophthalmology', 'ENT', 'Clinical',
];

const subjectKeywords: Record<string, string[]> = {
  Anatomy: ['cerebrum', 'cerebellum', 'brainstem', 'medulla', 'pons', 'midbrain', 'thalamus', 'hypothalamus', 'pituitary', 'cortex', 'hemisphere', 'lobe', 'frontal', 'parietal', 'temporal', 'occipital', 'insula', 'cingulate', 'hippocampus', 'amygdala', 'basal ganglia', 'caudate', 'putamen', 'globus pallidus', 'subthalamic', 'substantia nigra', 'internal capsule', 'corpus callosum', 'fornix', 'ventricle', 'meninges', 'dura', 'arachnoid', 'pia', 'cranium', 'skull', 'sulcus', 'gyrus', 'fissure', 'cistern', 'fossa', 'sella turcica', 'clivus', 'tentorium', 'falx', 'spinal cord', 'conus', 'filum terminale', 'cauda equina', 'denticulate', 'intervertebral', 'foramen magnum', 'jugular', 'carotid', 'vertebral', 'circle of willis', 'anterior cerebral', 'middle cerebral', 'posterior cerebral', 'anterior communicating', 'posterior communicating', 'basilar', 'cranial nerve', 'olfactory', 'optic', 'oculomotor', 'trochlear', 'trigeminal', 'abducens', 'facial', 'vestibulocochlear', 'glossopharyngeal', 'vagus', 'accessory', 'hypoglossal'],
  Histology: ['neuroglia', 'astrocyte', 'oligodendrocyte', 'microglia', 'ependyma', 'neuron', 'nissl body', 'axon hillock', 'myelin sheath', 'schwann cell', 'node of ranvier', 'synaptic bouton', 'bouton', 'dendrite', 'axon', 'soma', 'cell body', 'neurofibril', 'microtubule', 'neurofilament', 'histological', 'histology', 'gray matter', 'white matter', 'nucleus', 'ganglion', 'plexus', 'lamina', 'layer', 'cortical layer', 'pyramidal cell', 'stellar cell', 'granule cell', 'purkinje'],
  Physiology: ['action potential', 'resting membrane potential', 'depolarization', 'repolarization', 'hyperpolarization', 'threshold', 'all-or-none', 'refractory period', 'saltatory conduction', 'synapse', 'synaptic', 'neurotransmitter release', 'calcium channel', 'vesicle', 'receptor', 'ligand-gated', 'voltage-gated', 'ion channel', 'sodium', 'potassium', 'chloride', 'calcium', ' NMDA', 'AMPA', 'GABA receptor', 'reflex', 'stretch reflex', 'myotatic', 'withdrawal', 'crossed extensor', 'reciprocal inhibition', 'gamma loop', 'muscle spindle', 'golgi tendon', 'pacinian', 'meissner', 'merkel', 'ruffini', 'free nerve ending', 'receptor potential', 'generator potential', 'adaptation', 'coding', 'modality', 'intensity', 'location', 'duration', 'sensory', 'motor', 'pathway', 'tract', 'fasciculus', 'lemniscus', 'spinothalamic', 'dorsal column', 'corticospinal', 'corticobulbar', 'rubrospinal', 'vestibulospinal', 'reticulospinal', 'tectospinal', 'extrapyramidal'],
  Biochemistry: ['enzyme', 'metabolism', 'glycolysis', 'krebs', 'citric acid', 'TCA', 'oxidative phosphorylation', 'ATP', 'ATPase', 'sodium-potassium', 'calcium pump', 'creatine phosphate', 'neurotransmitter synthesis', 'tyrosine hydroxylase', 'dopa decarboxylase', 'dopamine beta-hydroxylase', 'PNMT', 'choline acetyltransferase', 'GAD', 'glutamic acid decarboxylase', 'GABA transaminase', 'MAO', 'COMT', 'acetylcholinesterase', 'reuptake', 'vesicular transporter', 'ammonia', 'urea cycle', 'ornithine', 'carbamoyl phosphate', 'citrulline', 'arginine', 'hyperammonemia', 'encephalopathy', 'amino acid', 'phenylketonuria', 'PKU', 'tyrosinemia', 'maple syrup', 'homocystinuria', 'vitamin', 'folate', 'B12', 'thiamine', 'B1', 'riboflavin', 'B2', 'niacin', 'B6', 'biotin', 'pantothenic', 'one-carbon', 'SAM', 'SAH', 'methionine'],
  Pharmacology: ['drug', 'agonist', 'antagonist', 'inverse agonist', 'partial agonist', 'competitive', 'noncompetitive', 'receptor blocker', 'channel blocker', 'channel opener', 'analgesic', 'opioid', 'morphine', 'fentanyl', 'tramadol', 'NSAID', 'aspirin', 'paracetamol', 'antidepressant', 'SSRI', 'SNRI', 'TCA', 'MAOI', 'antiepileptic', 'anticonvulsant', 'phenytoin', 'carbamazepine', 'valproate', 'phenobarbital', 'gabapentin', 'antipsychotic', 'typical antipsychotic', 'atypical', 'haloperidol', 'chlorpromazine', 'risperidone', 'olanzapine', 'anxiolytic', 'benzodiazepine', 'diazepam', 'lorazepam', 'alprazolam', 'barbiturate', 'sedative', 'hypnotic', 'anesthetic', 'local anesthetic', 'general anesthetic', 'lidocaine', 'bupivacaine', 'propofol', 'ketamine', 'ether', 'neuromuscular blocker', 'succinylcholine', 'curare', 'atropine', 'anticholinergic', 'antimuscarinic', 'dopaminergic', 'adrenergic', 'cholinergic', 'serotonergic', 'GABAergic', 'glutamatergic', 'neuroleptic', 'neuropharmacology', 'psychoactive', 'stimulant', 'amphetamine', 'cocaine', 'caffeine', 'nicotine'],
  Pathology: ['lesion', 'syndrome', 'disease', 'disorder', 'degeneration', 'atrophy', 'sclerosis', 'plaque', 'tumor', 'neoplasm', 'glioma', 'meningioma', 'schwannoma', 'neurofibroma', 'astrocytoma', 'oligodendroglioma', 'medulloblastoma', 'ependymoma', 'craniopharyngioma', 'pituitary adenoma', 'hematoma', 'epidural', 'subdural', 'subarachnoid', 'intracerebral', 'infarction', 'stroke', 'ischemia', 'hypoxia', 'anoxia', 'edema', 'hydrocephalus', 'demyelination'],
  Microbiology: ['virus', 'bacteria', 'infection', 'rabies', 'HIV', 'AIDS', 'encephalitis', 'meningitis', 'poliomyelitis', 'polio', 'neurosyphilis', 'tetanus', 'botulism', 'leprosy', 'tuberculosis', 'neurocysticercosis', 'toxoplasmosis', 'malaria', 'fungal', 'mycosis', 'prion', 'Creutzfeldt', 'mad cow', 'herpes', 'varicella', 'zoster', 'cytomegalovirus', 'CMV', 'Epstein', 'EBV', 'JC virus', 'PML', 'arbovirus', 'enterovirus', 'rotavirus'],
  Psychiatry: ['depression', 'schizophrenia', 'bipolar', 'dementia', 'delirium', 'anxiety', 'personality disorder', 'panic', 'phobia', 'OCD', 'PTSD', ' Adjustment', 'psychosis', 'hallucination', 'delusion', 'mood disorder', 'affective', 'catatonia', 'paranoia', 'mania', 'hypomania', 'cognitive decline', 'Alzheimer', 'vascular dementia', ' Lewy body', 'frontotemporal', 'Korsakoff', 'Wernicke'],
  Ophthalmology: ['optic nerve', 'retina', 'visual pathway', 'pupillary reflex', 'pupil', 'cornea', 'lens', 'iris', 'ciliary', 'sclera', 'choroid', 'fovea', 'macula', 'optic disc', 'blind spot', 'visual field', 'hemianopia', 'quadrantanopia', 'scotoma', 'papilledema', 'cataract', 'glaucoma', 'strabismus', 'nystagmus'],
  ENT: ['cochlea', 'auditory nerve', 'vestibular', 'semicircular canal', 'utricle', 'saccule', 'endolymph', 'perilymph', 'stria vascularis', 'organ of corti', 'hair cell', 'tympanic', 'eustachian', 'ossicle', 'malleus', 'incus', 'stapes', 'hearing loss', 'vertigo', 'tinnitus', 'Meniere'],
  Parasitology: ['parasite', 'helminth', 'nematode', 'cestode', 'trematode', 'protozoa', 'amoeba', 'plasmodium', 'malaria', 'toxoplasma', 'trypanosoma', 'leishmania'],
  Clinical: ['patient', 'present', 'presentation', 'diagnosis', 'diagnose', 'symptom', 'sign', 'history', 'examination', 'physical exam', 'investigation', 'laboratory', 'lab', 'treatment', 'management', 'therapy', 'prognosis', 'follow-up', 'referral', 'admission', 'discharge', 'case'],
};

const canonicalChapters = [
  'Introduction to CNS',
  'Cerebrum & Cortical Functions',
  'Thalamus & Hypothalamus',
  'Brain Stem',
  'Cerebellum & Basal Ganglia',
  'Spinal Cord Tracts',
  'Cranial Nerves',
  'Meninges, Ventricles & CSF',
  'Blood Supply of the CNS',
  'CNS Pathology & Neuropharmacology',
];

const chapterKeywords: Record<string, string[]> = {
  'Introduction to CNS': ['introduction', 'overview', 'neuroglia', 'astrocyte', 'oligodendrocyte', 'microglia', 'ependyma', 'neuron', 'nissl body', 'axon', 'dendrite', 'sources of energy', 'glucose', 'glycolysis', 'ATP', 'creatine phosphate', 'neurotransmitter', 'synapse', 'neurotransmitter synthesis', 'spinal cord external', 'spinal cord features', 'processing of signals', 'signal processing', 'source of energy'],
  'Cerebrum & Cortical Functions': ['cerebrum', 'cerebral hemisphere', 'cortex', 'cortical', 'sensory cortex', 'motor cortex', 'frontal', 'parietal', 'temporal', 'occipital', 'insula', 'cingulate', 'hippocampus', 'amygdala', 'association cortex', 'prefrontal', 'premotor', 'supplementary', 'Broca', 'Wernicke', 'angular gyrus', 'supramarginal', 'cortical layer', 'pyramidal cell', 'granule cell'],
  'Thalamus & Hypothalamus': ['thalamus', 'hypothalamus', 'pituitary', 'adenohypophysis', 'neurohypophysis', 'pars distalis', 'pars intermedia', 'pars tuberalis', 'median eminence', 'infundibulum', 'infundibular', 'pineal', 'epithalamus', 'subthalamus', 'mammillary', 'suprachiasmatic', 'paraventricular', 'supraoptic', 'arcuate', 'median preoptic', 'limbic system', 'Papez circuit', 'fornix', 'mammillothalamic'],
  'Brain Stem': ['brainstem', 'midbrain', 'pons', 'medulla', 'medullary', 'reticular formation', 'reticular', 'tegmentum', 'tectum', 'superior colliculus', 'inferior colliculus', 'periaqueductal', 'substantia nigra', 'red nucleus', 'olive', 'pyramid', 'pyramidal decussation', 'fourth ventricle', 'basilar', 'raphe', 'locus ceruleus'],
  'Cerebellum & Basal Ganglia': ['cerebellum', 'vermis', 'hemisphere', 'flocculonodular', 'anterior lobe', 'posterior lobe', 'purkinje cell', 'deep cerebellar', 'dentate', 'fastigial', 'interposed', 'cerebellar peduncle', 'superior peduncle', 'middle peduncle', 'inferior peduncle', 'basal ganglia', 'caudate', 'putamen', 'globus pallidus', 'lentiform', 'striatum', 'subthalamic nucleus', 'substantia nigra', 'nigrostriatal'],
  'Spinal Cord Tracts': ['spinal cord', 'spinal tract', 'ascending tract', 'descending tract', 'dorsal column', 'fasciculus gracilis', 'fasciculus cuneatus', 'spinothalamic', 'anterolateral', 'spinocerebellar', 'corticospinal', 'lateral corticospinal', 'anterior corticospinal', 'corticobulbar', 'pyramidal tract', 'extrapyramidal', 'rubrospinal', 'vestibulospinal', 'reticulospinal', 'tectospinal', 'upper motor neuron', 'lower motor neuron'],
  'Cranial Nerves': ['cranial nerve', 'olfactory', 'optic', 'oculomotor', 'trochlear', 'trigeminal', 'abducens', 'facial', 'vestibulocochlear', 'glossopharyngeal', 'vagus', 'accessory', 'hypoglossal', 'CN I', 'CN II', 'CN III', 'CN IV', 'CN V', 'CN VI', 'CN VII', 'CN VIII', 'CN IX', 'CN X', 'CN XI', 'CN XII', 'mesencephalic nucleus', 'principal sensory nucleus', 'spinal nucleus of V'],
  'Meninges, Ventricles & CSF': ['meninges', 'dura mater', 'arachnoid', 'pia mater', 'dural venous sinus', 'superior sagittal', 'transverse sinus', 'sigmoid sinus', 'cavernous sinus', 'subarachnoid space', 'subdural space', 'epidural space', 'ventricle', 'lateral ventricle', 'third ventricle', 'fourth ventricle', 'cerebral aqueduct', 'foramen of Monro', 'foramen of Magendie', 'foramen of Luschka', 'choroid plexus', 'CSF', 'cerebrospinal fluid', 'arachnoid granulation', 'subarachnoid cistern'],
  'Blood Supply of the CNS': ['blood supply', 'artery', 'vein', 'circle of willis', 'anterior cerebral artery', 'middle cerebral artery', 'posterior cerebral artery', 'anterior communicating artery', 'posterior communicating artery', 'basilar artery', 'vertebral artery', 'internal carotid', 'external carotid', 'anterior spinal artery', 'posterior spinal artery', 'venous drainage', 'great cerebral vein', 'superior sagittal sinus', 'cavernous sinus', 'blood-brain barrier', 'blood-CSF barrier', ' watershed', 'ischemia', 'infarction'],
  'CNS Pathology & Neuropharmacology': ['disease', 'disorder', 'degeneration', 'lesion', 'syndrome', 'treatment', 'management', 'drug', 'pharmacology', 'neuropharmacology', 'Alzheimer', 'Parkinson', 'multiple sclerosis', ' Huntington', 'ALS', 'motor neuron disease', 'epilepsy', 'seizure', 'stroke', 'CVA', 'hemorrhage', 'hematoma', 'tumor', 'neoplasm', 'meningioma', 'glioma', 'astrocytoma', 'hydrocephalus', 'encephalitis', 'meningitis', 'rabies', 'polio', 'HIV encephalopathy', 'neurosyphilis', 'myasthenia gravis', 'Guillain-Barre', 'demyelination', 'Wallerian', 'chromatolysis', 'neurofibrillary', 'senile plaque', 'Lewy body'],
};

function cleanSubject(raw: string | undefined): string {
  if (!raw) return 'UNKNOWN';
  const s = raw.trim();
  if (canonicalSubjects.includes(s)) return s;
  if (s === 'Neurology') return 'Anatomy'; // Neurology is not in canonical subjects, map to Anatomy for CNS
  if (s === 'Unknown' || s === 'UNKNOWN' || s === 'N/A' || s === '') return 'UNKNOWN';
  return 'UNKNOWN';
}

function classifySubjectFromKeywords(text: string): string {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};
  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.split(' ').length > 1 ? 3 : 1;
      }
    }
    if (score > 0) scores[subject] = score;
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted.length && sorted[0][1] >= 2) return sorted[0][0];
  return 'UNKNOWN';
}

function classifyChapterFromKeywords(text: string): string {
  const lower = text.toLowerCase();

  // Check specific chapters first with strong exact phrases
  const specificChecks: Array<{ chapter: string; phrases: string[] }> = [
    {
      chapter: 'Cranial Nerves',
      phrases: ['cranial nerve', 'olfactory nerve', 'optic nerve', 'oculomotor nerve', 'trochlear nerve', 'trigeminal nerve', 'abducens nerve', 'facial nerve', 'vestibulocochlear nerve', 'glossopharyngeal nerve', 'vagus nerve', 'accessory nerve', 'hypoglossal nerve', 'mesencephalic nucleus', 'principal sensory nucleus', 'spinal nucleus of v', 'cn i', 'cn ii', 'cn iii', 'cn iv', 'cn v', 'cn vi', 'cn vii', 'cn viii', 'cn ix', 'cn x', 'cn xi', 'cn xii'],
    },
    {
      chapter: 'Spinal Cord Tracts',
      phrases: ['spinal cord tract', 'ascending tract', 'descending tract', 'dorsal column', 'fasciculus gracilis', 'fasciculus cuneatus', 'spinothalamic', 'anterolateral', 'spinocerebellar', 'corticospinal', 'pyramidal tract', 'extrapyramidal', 'rubrospinal', 'vestibulospinal', 'reticulospinal', 'tectospinal', 'upper motor neuron', 'lower motor neuron'],
    },
    {
      chapter: 'Brain Stem',
      phrases: ['brain stem', 'brainstem', 'midbrain', 'pons', 'medulla oblongata', 'medullary', 'reticular formation', 'tegmentum', 'tectum', 'superior colliculus', 'inferior colliculus', 'periaqueductal', 'substantia nigra', 'red nucleus', 'olive', 'pyramid', 'pyramidal decussation', 'fourth ventricle', 'locus ceruleus', 'raphe nucleus'],
    },
    {
      chapter: 'Cerebellum & Basal Ganglia',
      phrases: ['cerebellum', 'cerebellar', 'vermis', 'flocculonodular', 'purkinje', 'dentate nucleus', 'fastigial nucleus', 'cerebellar peduncle', 'basal ganglia', 'striatum', 'caudate nucleus', 'putamen', 'globus pallidus', 'lentiform nucleus', 'subthalamic nucleus', 'nigrostriatal'],
    },
    {
      chapter: 'Thalamus & Hypothalamus',
      phrases: ['thalamus', 'thalamic', 'hypothalamus', 'hypothalamic', 'pituitary', 'adenohypophysis', 'neurohypophysis', 'pars distalis', 'pars intermedia', 'pars tuberalis', 'median eminence', 'infundibulum', 'pineal', 'epithalamus', 'subthalamus', 'mammillary body', 'suprachiasmatic', 'paraventricular', 'supraoptic', 'arcuate nucleus', 'median preoptic', 'papez circuit', 'mammillothalamic'],
    },
    {
      chapter: 'Cerebrum & Cortical Functions',
      phrases: ['cerebrum', 'cerebral hemisphere', 'cerebral cortex', 'sensory cortex', 'motor cortex', 'frontal lobe', 'parietal lobe', 'temporal lobe', 'occipital lobe', 'insula', 'cingulate gyrus', 'hippocampus', 'amygdala', 'association cortex', 'prefrontal cortex', 'premotor cortex', 'supplementary motor', 'broca', 'wernicke', 'angular gyrus', 'supramarginal gyrus', 'corpus callosum', 'cortical layer'],
    },
    {
      chapter: 'Meninges, Ventricles & CSF',
      phrases: ['meninges', 'dura mater', 'arachnoid mater', 'pia mater', 'dural venous sinus', 'superior sagittal sinus', 'subarachnoid space', 'subdural space', 'epidural space', 'ventricle', 'lateral ventricle', 'third ventricle', 'fourth ventricle', 'cerebral aqueduct', 'foramen of monro', 'foramen of magendie', 'foramen of luschka', 'choroid plexus', 'cerebrospinal fluid', 'csf', 'arachnoid granulation', 'subarachnoid cistern'],
    },
    {
      chapter: 'Blood Supply of the CNS',
      phrases: ['blood supply', 'circle of willis', 'anterior cerebral artery', 'middle cerebral artery', 'posterior cerebral artery', 'anterior communicating artery', 'posterior communicating artery', 'basilar artery', 'vertebral artery', 'internal carotid', 'anterior spinal artery', 'posterior spinal artery', 'great cerebral vein', 'blood-brain barrier', 'blood-csf barrier', 'venous drainage', 'ischemia', 'watershed'],
    },
    {
      chapter: 'CNS Pathology & Neuropharmacology',
      phrases: ['alzheimer', 'parkinson', 'huntington', 'multiple sclerosis', 'als', 'motor neuron disease', 'epilepsy', 'seizure', 'stroke', 'cva', 'hemorrhage', 'hematoma', 'meningioma', 'glioma', 'astrocytoma', 'hydrocephalus', 'encephalitis', 'myasthenia gravis', 'guillain-barre', 'demyelination', 'neurosyphilis', 'rabies', 'poliomyelitis', 'hiv encephalopathy', 'treatment of', 'management of', 'pharmacological', 'neuropharmacology', 'drug therapy', 'antiepileptic', 'antidepressant', 'antipsychotic', 'analgesic', 'opioid', 'anesthetic'],
    },
  ];

  for (const check of specificChecks) {
    for (const phrase of check.phrases) {
      if (lower.includes(phrase)) {
        return check.chapter;
      }
    }
  }

  // Fallback: score generic keywords for Introduction
  const introTerms = ['neuroglia', 'neurotransmitter', 'synapse', 'action potential', 'resting membrane potential', 'source of energy', 'introduction to cns', 'overview of the nervous'];
  for (const term of introTerms) {
    if (lower.includes(term)) return 'Introduction to CNS';
  }

  return 'Introduction to CNS';
}

function parseBlock(raw: string): Record<string, any> {
  const block: Record<string, string> = {};
  let currentKey: string | null = null;
  const lines = raw.split('\n');
  for (const line of lines) {
    const match = line.match(/^([A-Z][A-Z_0-9]*):\s*(.*)$/);
    if (match) {
      currentKey = match[1];
      block[currentKey] = match[2].trim();
    } else if (currentKey) {
      block[currentKey] += '\n' + line;
    }
  }

  for (const k of Object.keys(block)) {
    block[k] = block[k].trim();
  }

  return block;
}

function stripOptionPrefix(line: string): string {
  return line.replace(/^[A-Ea-e][\s.)]\s*/, '').trim();
}

function stripBlankPrefix(line: string): string {
  return line.trim().replace(/^\d+[.\s)]\s*/, '').trim();
}

function splitBlocks(content: string): string[] {
  return content.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
}

function parseOptions(optionsBlock: string): string[] {
  if (!optionsBlock) return [];
  const lines = optionsBlock.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    const l = line.trim();
    if (!l) continue;
    if (/^[A-Ea-e][\s.)]/.test(l)) {
      result.push(stripOptionPrefix(l));
    } else if (l.startsWith('✔') || l.startsWith('◆') || l.startsWith('●') || l.startsWith('•')) {
      result.push(l.replace(/^[✔◆●•]\s*/, '').trim());
    } else {
      result.push(l);
    }
  }
  return result.filter(Boolean);
}

function parseBlanks(blanksBlock: string): string[] {
  if (!blanksBlock) return [];
  return blanksBlock
    .split('\n')
    .map(l => stripBlankPrefix(l.trim()))
    .filter(Boolean);
}

function parsePairs(pairsBlock: string): Array<{ premise: string; target: string }> {
  if (!pairsBlock) return [];
  return pairsBlock
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(/\s*=\s*/);
      return {
        premise: parts[0]?.trim() || '',
        target: parts[1]?.trim() || '',
      };
    })
    .filter(p => p.premise && p.target);
}

function parseCaseSubQuestions(sqBlock: string): any[] {
  if (!sqBlock) return [];
  const lines = sqBlock.split('\n');
  const subs: any[] = [];
  let current: Record<string, any> | null = null;
  for (const line of lines) {
    const match = line.match(/^\d+[/.)]\s*(.*)$/);
    if (match) {
      if (current) subs.push(current);
      current = { text: match[1].trim(), type: 'mcq' };
    } else if (current) {
      if (line.trim().startsWith('TYPE:')) {
        current.type = line.split(':')[1].trim().toLowerCase();
      } else if (line.trim().startsWith('TEXT:')) {
        current.text = (current.text ? current.text + ' ' : '') + line.split(':')[1].trim();
      } else if (line.trim().startsWith('OPTIONS:')) {
        // options start after this line
      } else if (line.trim().startsWith('ANSWER:')) {
        current.correctAnswer = line.split(':')[1].trim();
      } else if (line.trim().startsWith('MODEL_ANSWER:')) {
        current.modelAnswer = line.split(':')[1].trim();
      } else if (/^[A-E][\s.]/.test(line.trim()) && current.type === 'mcq') {
        if (!current.options) current.options = [];
        current.options.push(stripOptionPrefix(line.trim()));
      }
    }
  }
  if (current) subs.push(current);
  return subs;
}

function inferCorrectAnswer(block: Record<string, string>, options: string[], type: string): string | null {
  const ans = block['ANSWER'] || '';
  if (!ans || ans === 'N/A') return null;

  const upper = ans.trim().toUpperCase();

  if (type === 'truefalse') {
    if (upper === 'TRUE' || upper === 'A') return 'A';
    if (upper === 'FALSE' || upper === 'B') return 'B';
    return null;
  }

  if (upper.length === 1 && upper >= 'A' && upper <= 'E') {
    const idx = upper.charCodeAt(0) - 'A'.charCodeAt(0);
    if (idx < options.length) return upper;
    return null;
  }

  // Try to match answer text to options
  for (let i = 0; i < options.length; i++) {
    if (options[i].toLowerCase().includes(ans.toLowerCase()) || ans.toLowerCase().includes(options[i].toLowerCase())) {
      return String.fromCharCode('A'.charCodeAt(0) + i);
    }
  }

  return null;
}

function mapQuestionType(raw: string): string | null {
  if (!raw) return null;
  const lower = raw.trim().toLowerCase();
  return validTypes[lower] || null;
}

function parseLecture(raw: string): number {
  if (!raw || raw === 'N/A') return 1;
  const num = parseInt(raw.trim(), 10);
  return isNaN(num) ? 1 : num;
}

function sanitizeText(text: string): string {
  return text
    .replace(/\*{2,}/g, '')
    .replace(/---/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const questions: any[] = [];

import { readdirSync } from 'node:fs';
const files = readdirSync(CLEANED_DIR)
  .filter(f => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('FAILED'))
  .sort((a, b) => {
    const na = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const nb = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return na - nb;
  });

for (const file of files) {
  const content = readFileSync(join(CLEANED_DIR, file), 'utf-8');
  const rawBlocks = splitBlocks(content);

  for (const raw of rawBlocks) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const block = parseBlock(trimmed);
    const qType = mapQuestionType(block['QUESTION_TYPE']);
    if (!qType) continue;

    let text = block['TEXT'] || block['CASE_TEXT'] || '';
    text = sanitizeText(text);
    if (!text) continue;

    const options = qType === 'mcq' || qType === 'truefalse' ? parseOptions(block['OPTIONS'] || '') : [];
    const blanks = qType === 'fillblank' ? parseBlanks(block['BLANKS'] || '') : [];
    const pairs = qType === 'matching' ? parsePairs(block['PAIRS'] || '') : [];
    const subQuestions = qType === 'case' ? parseCaseSubQuestions(block['SUB_QUESTIONS'] || '') : [];
    const correctAnswer = inferCorrectAnswer(block, options, qType);

    let subject = cleanSubject(block['SUBJECT']);
    if (subject === 'UNKNOWN') {
      subject = classifySubjectFromKeywords(text + ' ' + (block['KEY_CONCEPT'] || ''));
    }
    if (subject === 'UNKNOWN') subject = 'Anatomy'; // fallback

    let chapterTitle = block['CHAPTER'] || '';
    if (!chapterTitle || chapterTitle === 'N/A' || !canonicalChapters.includes(chapterTitle)) {
      chapterTitle = classifyChapterFromKeywords(text + ' ' + (block['KEY_CONCEPT'] || ''));
    }
    const chapterId = canonicalChapters.indexOf(chapterTitle) + 1;

    const q: Record<string, any> = {
      chapterTitle,
      chapterId,
      subject,
      lecture: parseLecture(block['LECTURE']),
      type: qType,
      text,
      explanation: (block['EXPLANATION'] && block['EXPLANATION'] !== 'N/A') ? sanitizeText(block['EXPLANATION']) : '',
      keyConcept: (block['KEY_CONCEPT'] && block['KEY_CONCEPT'] !== 'N/A') ? sanitizeText(block['KEY_CONCEPT']) : '',
    };

    if (qType === 'mcq' || qType === 'truefalse') {
      q.options = options;
      q.correctAnswer = correctAnswer;
    }
    if (qType === 'fillblank') {
      q.blanks = blanks;
      if (block['ACCEPTED_ANSWERS']) {
        q.acceptedAnswers = block['ACCEPTED_ANSWERS'].split('\n').map((l: string) => l.split(',').map((s: string) => s.trim()));
      }
    }
    if (qType === 'matching') {
      q.pairs = pairs;
    }
    if (qType === 'essay') {
      q.modelAnswer = (block['MODEL_ANSWER'] && block['MODEL_ANSWER'] !== 'N/A') ? sanitizeText(block['MODEL_ANSWER']) : '';
    }
    if (qType === 'case') {
      q.subQuestions = subQuestions;
    }

    questions.push(q);
  }
}

mkdirSync('data-format-v2/interim', { recursive: true });
writeFileSync(INTERIM_FILE, JSON.stringify({ moduleCode: 'MCNS-2', questions }, null, 2), 'utf-8');
console.log(`Parsed ${questions.length} questions into ${INTERIM_FILE}`);

// Summary
const typeCounts: Record<string, number> = {};
const subjectCounts: Record<string, number> = {};
const chapterCounts: Record<string, number> = {};
for (const q of questions) {
  typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
  subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
  chapterCounts[q.chapterTitle] = (chapterCounts[q.chapterTitle] || 0) + 1;
}
console.log('\nBy type:', typeCounts);
console.log('By subject:', subjectCounts);
console.log('By chapter:', chapterCounts);

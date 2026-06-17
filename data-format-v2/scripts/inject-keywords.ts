import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = dirname(fileURLToPath(import.meta.url));
const importsDir = join(base, '../../src/imports');

const cnsKeywords: Record<number, string[]> = {
  1:  ['introduction','neuroglia','astrocytes','oligodendrocytes','microglia','ependyma','blood brain barrier','cerebral cortex','energy metabolism','glucose','ketone','spinal cord','external features','conus medullaris','filum terminale','neurotransmitters','acetylcholine','dopamine','serotonin','norepinephrine','gaba','glutamate','signal processing','spatial summation','temporal summation','sensory cortex','ammonia','urea cycle','hyperammonemia','amino acid','inborn errors','vitamin deficiency','folate'],
  2:  ['sensory','receptors','exteroceptors','interoceptors','proprioceptors','sensory coding','adaptation','spinal cord','gray matter','posterior horn','spinothalamic','anterolateral','pain','pain pathways','gate control','opioids','morphine','fentanyl','dorsal column','somatosensory cortex'],
  3:  ['motor','pyramidal','extrapyramidal','corticospinal','rubrospinal','vestibulospinal','white matter','stretch receptors','muscle spindle','stretch reflex','golgi tendon','motor cortex','basal ganglia','substantia nigra','parkinsonism','cerebellum','purkinje','climbing fibers','mossy fibers','lesions','upper motor neuron','lower motor neuron'],
  4:  ['brain stem','midbrain','pons','medulla','cranial cavity','temporal region','pterygopalatine fossa','cranial nerves','trigeminal'],
  5:  ['neck','cervical fascia','triangles','sternocleidomastoid','carotid triangle','submandibular triangle','cervical plexus','accessory nerve','hypoglossal nerve'],
  6:  ['diencephalon','thalamus','hypothalamus','reticular formation','reticular activating system','eeg','sleep','nrem','rem','anesthesia','epilepsy','antiepileptic','phenytoin'],
  7:  ['cerebrum','cerebral hemisphere','dominance','speech','aphasia','broca','wernicke','memory','limbic system','hippocampus','amygdala','meninges','dura','arachnoid','pia','blood supply','circle of willis','cerebral arteries'],
  8:  ['meningitis','bacterial','viral','tuberculous','poliomyelitis','rabies','tetanus','botulism','parasitic','neurocysticercosis','prions'],
  9:  ['neurodegenerative','alzheimer','parkinson','huntington','multiple sclerosis','demyelination','guillain barre','trauma','concussion','contusion','vascular','stroke','ischemia','hemorrhage','aneurysm','tumors','glioma','meningioma','dementia'],
  10: ['antipsychotics','neuroleptics','chlorpromazine','haloperidol','drug abuse','alcohol','opioid','cocaine','embryology','neural tube','neurulation','cephalic flexure'],
};

async function injectKeywords() {
  const years = (await readdir(importsDir)).filter(f => !f.startsWith('.') && !f.endsWith('.json'));
  for (const year of years) {
    const semesterDir = join(importsDir, year);
    const semesters = (await readdir(semesterDir)).filter(f => !f.startsWith('.') && !f.endsWith('.json'));
    for (const semester of semesters) {
      const files = (await readdir(join(semesterDir, semester))).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const path = join(semesterDir, semester, file);
        let raw = await readFile(path, 'utf8');
        let data: any;
        try {
          data = JSON.parse(raw);
        } catch {
          console.error(`Failed to parse ${path}`);
          continue;
        }
        if (!data.chapters) continue;

        let changed = false;
        for (const chapter of data.chapters) {
          if (data.meta?.moduleCode === 'MCNS-2') {
            const keywords = cnsKeywords[chapter.id];
            if (keywords) {
              chapter.keywords = keywords;
              changed = true;
            }
          } else if (!chapter.keywords) {
            chapter.keywords = [];
            changed = true;
          }
        }

        if (changed) {
          await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
          console.log(`Updated ${path}`);
        }
      }
    }
  }
}

injectKeywords().catch(console.error);

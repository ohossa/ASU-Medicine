import * as fs from 'fs';
import * as path from 'path';

const all = JSON.parse(fs.readFileSync('interim/combined-enriched.json', 'utf8'));

const meta = {
  moduleCode: 'MCNS-2',
  moduleName: 'Central Nervous System',
  year: 2,
  semester: 2,
  creditPoints: 6,
  totalMarks: 200,
  keywords: ['CNS', 'Neuroanatomy', 'Neuropharmacology', 'Neurophysiology', 'Neuropathology']
};

const chapterOrder = [
  'Introduction to CNS',
  'Cranial Nerves',
  'Brain Stem',
  'Thalamus & Hypothalamus',
  'Cerebellum & Basal Ganglia',
  'Cerebrum & Cortical Functions',
  'Spinal Cord Tracts',
  'Meninges, Ventricles & CSF',
  'Blood Supply of the CNS',
  'CNS Pathology & Neuropharmacology'
];

const chapterMap: Record<string, { id: number; title: string; subtitle: string; emoji: string; subjects: Record<string, any[]> }> = {};

for (const q of all) {
  const ct = q.chapterTitle || 'Introduction to CNS';
  if (!chapterMap[ct]) {
    const cid = chapterOrder.indexOf(ct) + 1;
    chapterMap[ct] = {
      id: cid || 99,
      title: ct,
      subtitle: '',
      emoji: '🧠',
      subjects: {}
    };
  }
  const subj = q.subject || 'Anatomy';
  if (!chapterMap[ct].subjects[subj]) chapterMap[ct].subjects[subj] = [];
  chapterMap[ct].subjects[subj].push(q);
}

const chapters = chapterOrder
  .filter(ct => chapterMap[ct])
  .map(ct => {
    const ch = chapterMap[ct];
    const subjects = Object.entries(ch.subjects).map(([name, questions]) => {
      const subjColorMap: Record<string, string> = {
        Anatomy: 'anatomy', Histology: 'histology', Physiology: 'physiology',
        Biochemistry: 'biochem', Microbiology: 'microbiology', Pathology: 'pathology',
        Pharmacology: 'pharma', Clinical: 'clinical', Parasitology: 'parasitology'
      };
      return {
        id: subjColorMap[name] || 'anatomy',
        name,
        iconName: subjColorMap[name] || 'anatomy',
        lectures: 'L1-L5',
        lectureCount: 5,
        questions: questions.map((q: any, idx: number) => {
          const base: any = {
            id: `mcns2-ch${ch.id}-${subjColorMap[name] || 'anatomy'}-q${idx + 1}`,
            type: q.type,
            lecture: q.lecture || 1,
            text: q.text,
            explanation: q.explanation,
            keyConcept: q.keyConcept,
          };
          if (q.type === 'mcq' || q.type === 'truefalse') {
            base.options = q.options || [];
            base.correctIndex = q.options && q.correctAnswer
              ? q.options.findIndex((o: string) =>
                  o.startsWith(q.correctAnswer + '.') ||
                  o.startsWith(q.correctAnswer + ')') ||
                  o === q.correctAnswer
                )
              : 0;
            if (base.correctIndex < 0) base.correctIndex = 0;
          }
          if (q.type === 'essay') base.modelAnswer = q.modelAnswer;
          if (q.type === 'matching') base.pairs = q.pairs || [];
          if (q.type === 'fillblank') base.blanks = q.blanks || [];
          if (q.type === 'case') {
            base.subQuestions = (q.subQuestions || []).map((sq: any, sidx: number) => {
              const sqBase: any = {
                id: base.id + '-sq' + (sidx + 1),
                type: sq.type || 'essay',
                text: sq.text,
                explanation: sq.explanation || q.explanation,
                keyConcept: sq.keyConcept || q.keyConcept,
              };
              if (sq.type === 'mcq') {
                sqBase.options = sq.options || [];
                sqBase.correctIndex = sq.options && sq.correctAnswer
                  ? sq.options.findIndex((o: string) => o.startsWith(sq.correctAnswer + '.'))
                  : 0;
                if (sqBase.correctIndex < 0) sqBase.correctIndex = 0;
              } else {
                sqBase.modelAnswer = sq.modelAnswer || '';
              }
              return sqBase;
            });
          }
          return base;
        })
      };
    });
    return {
      id: ch.id,
      title: ch.title,
      subtitle: ch.subtitle,
      emoji: ch.emoji,
      page: ch.id,
      lectureRange: 'L1-L5',
      subjects
    };
  });

const bank = {
  schemaVersion: 1,
  meta,
  chapters
};

const outDir = 'data-format-v2/question-bank-mcns2';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'question-bank-mcns2.json'), JSON.stringify(bank, null, 2));

// Also copy per-chapter chunks
const chunkDir = path.join(outDir, 'chapters');
if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir, { recursive: true });
for (const ch of chapters) {
  const safe = ch.title.replace(/[^a-zA-Z0-9]/g, '_');
  const chunk = { schemaVersion: 1, meta, chapters: [ch] };
  fs.writeFileSync(path.join(chunkDir, `${safe}.json`), JSON.stringify(chunk, null, 2));
}

console.log('Bank assembled:', all.length, 'questions');
console.log('Chapters:', chapters.length);
console.log('Output:', outDir);

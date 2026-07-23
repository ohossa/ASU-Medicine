import { readFile, writeFile } from 'node:fs/promises';

type SubjectColor = 'anatomy' | 'histology' | 'physiology' | 'biochem' | 'microbiology' | 'pathology' | 'pharma' | 'clinical' | 'parasitology' | 'psychiatry' | 'ophthalmology' | 'ent';

const SUBJECT_DISPLAY: Record<string, { id: SubjectColor; name: string; iconName: string }> = {
  "anatomy": { id: "anatomy", name: "Anatomy", iconName: "Bone" },
  "histology": { id: "histology", name: "Histology", iconName: "Microscope" },
  "physiology": { id: "physiology", name: "Physiology", iconName: "Activity" },
  "biochemistry": { id: "biochem", name: "Biochemistry", iconName: "FlaskConical" },
  "biochem": { id: "biochem", name: "Biochemistry", iconName: "FlaskConical" },
  "microbiology": { id: "microbiology", name: "Microbiology", iconName: "Biohazard" },
  "pathology": { id: "pathology", name: "Pathology", iconName: "ShieldAlert" },
  "pharmacology": { id: "pharma", name: "Pharmacology", iconName: "Pill" },
  "pharma": { id: "pharma", name: "Pharmacology", iconName: "Pill" },
  "clinical": { id: "clinical", name: "Clinical", iconName: "Stethoscope" },
  "parasitology": { id: "parasitology", name: "Parasitology", iconName: "Bug" },
  "psychiatry": { id: "psychiatry", name: "Psychiatry", iconName: "Brain" },
  "ophthalmology": { id: "ophthalmology", name: "Ophthalmology", iconName: "Eye" },
  "ent": { id: "ent", name: "E.N.T.", iconName: "Ear" }
};

function normalize(str: string): string {
  return str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
}

function getSubjectKey(subj: string): string {
  const norm = normalize(subj);
  if (norm.includes("anat")) return "anatomy";
  if (norm.includes("hist")) return "histology";
  if (norm.includes("phys")) return "physiology";
  if (norm.includes("bioc")) return "biochem";
  if (norm.includes("micro")) return "microbiology";
  if (norm.includes("path")) return "pathology";
  if (norm.includes("phar")) return "pharma";
  if (norm.includes("clin")) return "clinical";
  if (norm.includes("para")) return "parasitology";
  if (norm.includes("psyc")) return "psychiatry";
  if (norm.includes("opht")) return "ophthalmology";
  if (norm.includes("ent")) return "ent";
  return norm;
}

async function main() {
  const batchPath = "/Users/omarhossa/Downloads/Blood Q's/MBL-2_WEBSITE_READY_FINAL.json";
  const targetPath = "src/imports/year-2/semester-1/MBL-2.json";

  const batch = JSON.parse(await readFile(batchPath, 'utf8'));
  const bank = JSON.parse(await readFile(targetPath, 'utf8'));

  // Group unique lecture strings by chapterId and subject
  const mapping: Record<number, Record<string, Set<string>>> = {};

  for (const q of batch.questions) {
    const chapterId = q.chapterId;
    const rawSubj = q.subject;
    const lectureStr = q.lecture;

    if (!chapterId || !rawSubj || !lectureStr) continue;

    const subjKey = getSubjectKey(rawSubj);

    if (!mapping[chapterId]) {
      mapping[chapterId] = {};
    }
    if (!mapping[chapterId][subjKey]) {
      mapping[chapterId][subjKey] = new Set<string>();
    }
    mapping[chapterId][subjKey].add(lectureStr);
  }

  // Update chapters in bank
  for (const chapter of bank.chapters) {
    const chapterId = chapter.id;
    const chMapping = mapping[chapterId] || {};

    chapter.subjects = [];

    for (const [subjKey, lecs] of Object.entries(chMapping)) {
      const display = SUBJECT_DISPLAY[subjKey];
      if (!display) {
        console.error(`Unknown subject key: ${subjKey}`);
        continue;
      }

      const lectureNames = Array.from(lecs);
      chapter.subjects.push({
        id: display.id,
        name: display.name,
        iconName: display.iconName,
        lectures: `Lectures 1-${lectureNames.length}`,
        lectureCount: lectureNames.length,
        lectureNames: lectureNames,
        questions: []
      });
    }
  }

  await writeFile(targetPath, JSON.stringify(bank, null, 2) + "\n", 'utf8');
  console.log("Successfully updated MBL-2.json skeleton!");
}

main().catch(console.error);

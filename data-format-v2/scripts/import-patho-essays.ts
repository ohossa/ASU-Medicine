import * as fs from 'fs';
import * as path from 'path';

const JSON_PATH = '/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/src/imports/year-2/semester-2/MCNS-2.json';
const TEXT_PATH = '/Users/omarhossa/.gemini/antigravity/brain/0f225776-fc2f-480a-bb59-347b5268164e/scratch/cns_patho_essay_text.txt';

interface Question {
  id: string;
  type: string;
  lecture: number;
  text: string;
  explanation: string;
  keyConcept: string;
  modelAnswer: string;
}

const CUSTOM_TABLES: Record<number, string> = {
  19: `| Parameter | Normal | Bacterial | Viral | Tuberculous (TB) | Fungal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pressure** | 8 - 15 mmHg | Increased | Normal to moderate | Increased (can be low with spinal block) | Increased |
| **Appearance** | Clear, colorless | Turbid | Clear | Opaque, cobweb coagulum | Clear |
| **WBCs** | 0 - 5 cells | Increased PMNs | Increased lymphocytes | Increased lymphocytes | Increased mixed cells |
| **Protein** | <40 mg/dl | Increased | Normal to mild increase | Increased | Increased |
| **Glucose** | 40 - 70 mg/dl | Decreased | Normal | Decreased | Decreased |`,

  29: `| Feature | Epidural Hematoma | Subdural Hematoma |
| :--- | :--- | :--- |
| **Location** | Between skull and dura mater | Between dura and arachnoid mater |
| **Involved Vessels** | Rupture of **Middle Meningeal Artery** (typically secondary to temporoparietal skull fracture) | Tear of **bridging veins** draining the brain to dural sinuses |
| **Risk Factors** | Severe head trauma / skull fractures | Brain atrophy (elderly), anticoagulant therapy, shaking, whiplash |
| **Symptoms** | **Lucid interval** before rapid loss of consciousness ("talk and die" syndrome); trans-tentorial herniation can occur | Slow venous bleeding with **delayed onset** of gradually increasing headache and confusion |
| **CT Appearance** | **Biconvex (lenticular)** shaped hemorrhage; does not cross suture lines | **Crescent** shaped hemorrhage; crosses suture lines (gyri are preserved as pressure is distributed equally); cannot cross falx/tentorium |`,

  41: `| Time | Gross Picture | Microscopic Picture |
| :--- | :--- | :--- |
| **0 - 12 hours** | No change | No or minimal change |
| **12 - 24 hours** | Minimal change | **Red neurons** (hypereosinophilic) with pyknotic nuclei |
| **24 - 48 hours** | Indistinct gray-white matter junction | **Neutrophilic infiltration** |
| **2 - 10 days** | Friable tissue with marked edema | **Histiocytic infiltration**; neurons disappear |
| **2 - 3 weeks** | Tissue liquefies (liquefactive necrosis) | Histiocytes filled with products of myelin breakdown |
| **3 weeks - months** | Fluid-filled cavity demarcated by a gliotic scar | Fluid-filled cavity; reactive astrocytes and lipid-laden macrophages (MQs) |
| **Years** | Old cysts surrounded by a gliotic scar | **Astrogliosis** surrounding a cyst |`,

  45: `| WHO Grade | Designation | Histological Criteria |
| :---: | :--- | :--- |
| **Grade II** | Diffuse astrocytoma | No appreciable mitotic activity |
| **Grade III** | Anaplastic astrocytoma | Mitoses present |
| **Grade IV** | Glioblastoma (Astrocytoma Grade IV) | **Necrosis** and/or **microvascular proliferation**, usually associated with frequent mitoses |`,

  53: `| Histological Variant | Microscopic Picture / Features |
| :--- | :--- |
| **Syncytial** | Whorled clusters of cells without visible cell membranes |
| **Fibroblastic** | Elongated cells and abundant collagen deposition between them |
| **Transitional** | Shares features of both syncytial and fibroblastic types |
| **Psammomatous** | Numerous **psammoma bodies** |`
};

function getChapterAndLecture(qNum: number): { chId: number; lecture: number } {
  if (qNum >= 11 && qNum <= 20) {
    return { chId: 8, lecture: 5 };
  }
  // Neurodegenerative
  if ((qNum >= 1 && qNum <= 5) || qNum === 7 || (qNum >= 21 && qNum <= 28)) {
    return { chId: 9, lecture: 1 };
  }
  // Trauma
  if (qNum === 29) {
    return { chId: 9, lecture: 3 };
  }
  // Vascular
  if (qNum >= 30 && qNum <= 42) {
    return { chId: 9, lecture: 4 };
  }
  // Tumours
  if (qNum === 6 || qNum === 8 || qNum === 9 || qNum === 10 || (qNum >= 43 && qNum <= 53)) {
    return { chId: 9, lecture: 6 };
  }
  throw new Error(`Unknown question number: ${qNum}`);
}

function cleanAnswerText(num: number, answerText: string): string {
  if (CUSTOM_TABLES[num]) {
    return CUSTOM_TABLES[num];
  }

  // Formatting lists nicely with bullet points if they contain lists
  const lines = answerText.split('\n').map(l => l.trim()).filter(Boolean);
  const formattedLines: string[] = [];

  for (const line of lines) {
    // If the line starts with a list marker (e.g. "1.", "1-", "•", "a-", "-")
    const listMatch = line.match(/^([0-9]+\s*[-.]|•|-|[a-z]\s*[-.])\s*(.*)$/);
    if (listMatch) {
      formattedLines.push(`• ${listMatch[2].trim()}`);
    } else {
      // If it has multiple bullet-like structures separated by " - "
      if (line.includes(' - ') && !line.includes('http')) {
        const parts = line.split(/\s+-\s+/);
        parts.forEach(p => formattedLines.push(`• ${p.trim()}`));
      } else {
        formattedLines.push(line);
      }
    }
  }

  return formattedLines.join('\n');
}

function generateKeyConcept(qText: string, ansText: string): string {
  // Extract key concepts or use first sentence/bullet of answer
  const firstLine = ansText.split('\n')[0].replace(/^[•\s\-\d\.\*]+/g, '').trim();
  let concept = firstLine;
  if (concept.length > 70) {
    concept = concept.substring(0, 67) + '...';
  }
  return concept || qText;
}

function generateExplanation(qText: string, ansText: string): string {
  const cleanAns = ansText.replace(/[•\t\*]+/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  return `This question asks: ${qText} Key point: ${cleanAns}`;
}

async function run() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error('JSON file not found:', JSON_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(TEXT_PATH)) {
    console.error('PDF text file not found:', TEXT_PATH);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const textContent = fs.readFileSync(TEXT_PATH, 'utf8');

  // Parse questions line by line
  const lines = textContent.split(/\r?\n/);
  let currentQuestionNum = 0;
  let currentQuestionText = '';
  let currentAnswerLines: string[] = [];
  const parsedQuestions: { num: number; question: string; answer: string }[] = [];

  for (const line of lines) {
    if (/^\s*--\s*\d+\s+of\s+\d+\s*--\s*$/.test(line)) {
      continue; // Skip footers!
    }

    const match = line.match(/^\s*([1-9]\d*)\s*[-.]\s*(.*)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      const text = match[2].trim();
      if (num === currentQuestionNum + 1 || (num === currentQuestionNum && currentQuestionNum > 0)) {
        if (currentQuestionNum > 0) {
          parsedQuestions.push({
            num: currentQuestionNum,
            question: currentQuestionText,
            answer: currentAnswerLines.join('\n').trim()
          });
        }
        currentQuestionNum = num;
        currentQuestionText = text;
        currentAnswerLines = [];
        continue;
      }
    }

    if (currentQuestionNum > 0) {
      currentAnswerLines.push(line);
    }
  }

  if (currentQuestionNum > 0) {
    parsedQuestions.push({
      num: currentQuestionNum,
      question: currentQuestionText,
      answer: currentAnswerLines.join('\n').trim()
    });
  }

  console.log(`Parsed ${parsedQuestions.length} raw questions from text.`);

  let importedCount = 0;
  let duplicateCount = 0;

  for (const rawQ of parsedQuestions) {
    // 1. Skip duplicates inside the PDF itself
    // Q7 is duplicate of Q5, Q8 is duplicate of Q6
    if (rawQ.num === 7 || rawQ.num === 8) {
      console.log(`Skipping duplicate PDF question #${rawQ.num}: "${rawQ.question}"`);
      duplicateCount++;
      continue;
    }

    const { chId, lecture } = getChapterAndLecture(rawQ.num);
    const chapter = data.chapters.find((c: any) => c.id === chId);
    if (!chapter) {
      console.error(`Chapter ${chId} not found in JSON`);
      continue;
    }

    const pathSub = chapter.subjects.find((s: any) => s.id === 'pathology');
    if (!pathSub) {
      console.error(`Pathology subject not found in Chapter ${chId}`);
      continue;
    }

    // 2. Clean the question text and answer
    const qText = rawQ.question.trim();
    let rawAns = rawQ.answer.trim();
    if (rawAns.startsWith('Answer:')) {
      rawAns = rawAns.substring('Answer:'.length).trim();
    }
    const cleanAns = cleanAnswerText(rawQ.num, rawAns);

    // 3. Skip duplicates of existing questions in the JSON file
    const isDuplicate = pathSub.questions.some((q: any) => {
      const existingText = q.text.toLowerCase().replace(/[^a-z0-9]/g, '');
      const newText = qText.toLowerCase().replace(/[^a-z0-9]/g, '');
      return existingText === newText;
    });

    if (isDuplicate) {
      console.log(`Skipping duplicate existing question: "${qText}"`);
      duplicateCount++;
      continue;
    }

    // 4. Generate sequential ID
    // Find all existing pathology questions in this chapter to get the highest suffix
    let maxNum = 0;
    const prefix = `MCNS2-CH${chId}-PATH-`;
    for (const q of pathSub.questions) {
      if (q.id.startsWith(prefix)) {
        const numPart = parseInt(q.id.substring(prefix.length), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    }

    const nextIdNum = maxNum + 1;
    const newId = `${prefix}${String(nextIdNum).padStart(4, '0')}`;

    // 5. Construct question object
    const newQuestion: Question = {
      id: newId,
      type: 'essay',
      lecture: lecture,
      text: qText,
      explanation: generateExplanation(qText, cleanAns),
      keyConcept: generateKeyConcept(qText, cleanAns),
      modelAnswer: cleanAns
    };

    pathSub.questions.push(newQuestion);
    importedCount++;
  }

  console.log(`Imported ${importedCount} new questions. Skipped/consolidated ${duplicateCount} duplicates.`);

  // Write updated JSON back to file
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Successfully updated ${JSON_PATH}`);
}

run().catch(err => {
  console.error('Error importing questions:', err);
  process.exit(1);
});

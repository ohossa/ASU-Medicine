import { REPORT_CATEGORIES, type QuestionReport } from "./contracts";

export function reviewContext(report: QuestionReport): string {
  const s = report.snapshot,
    q = s.question;
  const key =
    typeof q.correctIndex === "number" &&
    q.options?.[q.correctIndex] !== undefined
      ? `${String.fromCharCode(65 + q.correctIndex)}. ${q.options[q.correctIndex]}`
      : "See model answer / full snapshot";

  const optionsText = q.options
    ?.map(
      (o, i) =>
        `${String.fromCharCode(65 + i)}. ${o}${
          i === q.correctIndex ? " (Marked Correct on Portal)" : ""
        }`,
    )
    .join("\n") || "";

  return [
    `You are an expert academic medical consultant assisting Omar HossamEldin Maged, founder of ASUCodes (Faculty of Medicine, Ain Shams University). Review this student-reported medical question, evaluate the medical reasoning, and draft a clear, human explanation for the student.`,
    `--- STRICT HUMANIZER & ANTI-AI WRITING INSTRUCTIONS (FOLLOW CAREFULLY) ---
1. Tone & Persona: Speak directly as an email explanation from Omar HossamEldin Maged to a fellow Ain Shams medical student. Keep it collegial, respectful, clear, and direct.
2. Zero Conversational AI Filler: Do NOT include chatbot meta-chatter, intros, or closings (e.g. NEVER say "Certainly!", "Sure thing!", "I hope this helps!", "Great question!", "Here is a response for the student:", or "Feel free to reach out if you need further clarification").
3. Anti-AI Vocabulary: Never use overused AI words (e.g. "delve", "crucial", "pivotal", "testament", "underscores", "vibrant", "landscape", "beacon", "foster", "tapestry", "moreover").
4. No Em Dashes or Formatting Slop: Do NOT use em dashes (—). Use ordinary commas, periods, or parentheses. Do not use curly quotes or excessive bolding.
5. No Negative Parallelisms: Do NOT write "It's not just X, it's Y" or "Not because X, but because Y". State the fact directly.
6. Plain Emotion & Concrete Specificity: State medical facts plainly without body-performance melodrama ("heart sinks", "chest tightened"). Name specific anatomical structures, physiological pathways, drug targets, or Ain Shams curriculum lecture topics.
7. Stop at the End: When the explanation finishes, stop immediately. Do not append an artificial moral, takeaway lesson, or summary coda.`,
    `--- QUESTION SNAPSHOT (AS SUBMITTED) ---
Module: ${s.moduleCode}
Chapter: ${s.chapterTitle}
Subject: ${s.subjectName}${s.topicName ? `\nTopic: ${s.topicName}` : ""}
Question ID: ${q.id}
Source version: ${s.version}${report.subQuestionId ? `\nReported part: ${report.subQuestionId}` : ""}`,
    `Question:\n${q.text || q.question || ""}`,
    optionsText,
    `Correct answer: ${key}`,
    ...[
      "subQuestions",
      "pairs",
      "blanks",
      "acceptedAnswers",
      "media",
      "keyConcept",
    ]
      .filter((k) => q[k] !== undefined)
      .map((k) => `${k}:\n${JSON.stringify(q[k], null, 2)}`),
    q.explanation ? `Explanation:\n${q.explanation}` : "",
    q.modelAnswer ? `Model answer:\n${q.modelAnswer}` : "",
    `--- STUDENT FEEDBACK ---
Report category: ${REPORT_CATEGORIES[report.category].en}
Student message (as submitted):
${report.explanation || "No message added."}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function replyTemplate(
  kind: "correct" | "fixed" | "clarify",
  report: QuestionReport,
): string {
  const intro =
    "Hi,\n\nThank you for taking the time to report this question on ASUCodes.\n\n";

  const context = `${report.snapshot.moduleCode} · Question ${report.snapshot.question.id}`;
  const detail =
    kind === "correct"
      ? `I reviewed your report about ${context} with the faculty curriculum references. The current answer is correct.\n\n[Explain the correct answer and address the student’s concern here]`
      : kind === "fixed"
        ? `I reviewed your report about ${context} and updated the question.\n\n[Describe the correction that you have published here]`
        : `I’m reviewing your report about ${context} and would appreciate a little more detail.\n\n[Ask your specific clarification question here]`;

  return (
    intro +
    detail +
    "\n\nThanks for helping improve the Ain Shams medical question bank.\n\nBest regards,\nOmar HossamEldin Maged\nASUCodes"
  );
}

/**
 * Strips AI tells, conversational filler, sycophancy, buzzwords, and structural slop
 * from raw AI chats or drafted explanations, following the /structural-humanizer and /humanizer guides.
 */
export function humanizeAIExplanation(raw: string): string {
  if (!raw) return "";
  let text = raw.trim();

  // 1. Strip common LLM chat preambles and meta introductions
  text = text.replace(
    /^(?:(?:Here(?:'s| is) (?:a |the |your )?(?:draft |polite |clear |detailed |suggested )?(?:response|explanation|reply|message)(?: for the student)?:?\s*)|(?:Certainly!?|Sure thing!?|Of course!?|Great question!?|Hello!?|Hi there!?)|(?:Dear [^,\n]+,\s*)|(?:Hi [^,\n]+,\s*)|(?:Here is what you can (?:send|write)(?: to the student)?:?\s*))+/gi,
    "",
  );

  // 2. Strip trailing AI conversational boilerplate & sign-offs (multiline aware)
  text = text.replace(
    /(?:\n\s*(?:(?:I hope this helps[^\n]*)|(?:Hope this [^\n]*)|(?:Let me know if [^\n]*)|(?:Feel free to [^\n]*)|(?:Best regards[^\n]*)|(?:Warm regards[^\n]*)|(?:Sincerely[^\n]*)|(?:(?:Medical )?AI Assistant[^\n]*)|(?:Kind regards[^\n]*)))+$/gi,
    "",
  );

  // 3. De-slop em dashes and en dashes -> replace with comma or clean spacing
  text = text.replace(/\s*[—–]\s*/g, ", ");

  // 4. Normalize curly quotes to standard quotes
  text = text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  // 5. De-emphasize mechanical bolding on single terms: **term** -> term (preserves readable headings)
  text = text.replace(/\*\*([a-zA-Z0-9\s.,'/-]{1,40})\*\*/g, "$1");

  // 6. Clean high-frequency AI vocabulary words
  text = text.replace(/\bdelve into\b/gi, "examine");
  text = text.replace(/\bdelve\b/gi, "explore");
  text = text.replace(/\ba testament to\b/gi, "evidence of");
  text = text.replace(/\btestament to\b/gi, "evidence of");
  text = text.replace(/\bpivotal role\b/gi, "key role");
  text = text.replace(/\bpivotal\b/gi, "key");
  text = text.replace(/\bcrucial\b/gi, "important");
  text = text.replace(/\bunderscores\b/gi, "shows");
  text = text.replace(/\bmoreover\b/gi, "also");
  text = text.replace(/\bfurthermore\b/gi, "in addition");

  // 7. Remove negative parallelism crutches (e.g. "It's not just about X, it's Y" -> "Y")
  text = text.replace(/\b(?:It(?:'s| is) not just (?:about )?[^,]+,\s*(?:it(?:'s| is) )?)\b/gi, "");

  // 8. Strip inline bullet dashes at line starts if formatted as lists
  text = text.replace(/^\s*[-*]\s+/gm, "");

  return text.trim();
}

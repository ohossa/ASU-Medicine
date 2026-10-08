/**
 * Strip a leading source question label for student display only.
 * Leave source records, clinical numbers, options, answers and internal lists intact.
 */
export function cleanQuestionStem(text: string): string {
  // Explicit labels also occur without punctuation (e.g. "Question 10A patient...").
  const labelled = /^\s*(?:question\s*\d+(?:\s*[-–—]\s*\d+)?\s*[.:)&-]?|q\s*\d+(?:\s*[-–—]\s*\d+)?\s*[.:)])\s*/i;
  if (labelled.test(text)) return text.replace(labelled, '');

  // Punctuation distinguishes source numbering from ages/doses. A hyphen must
  // have surrounding whitespace so drug names such as 5-fluorouracil survive.
  const numbered = /^\s*(?:\(\d+(?:\s*[-–—]\s*\d+)?\)|\d+(?:\s*[-–—]\s*\d+)?\s*[.):]|\d+(?:\s+[-–—]\s*|\s*[-–—]\s+))\s*(?=[^\d\s])/;
  // Some imports repeat the label, e.g. "2. Question 2:A patient...".
  if (numbered.test(text)) return text.replace(numbered, '').replace(labelled, '');

  // Two imported ondansetron prompts omit the separator altogether. Keep this
  // narrow: arbitrary bare numbers can be clinically meaningful.
  return text.replace(/^\s*\d+\s+(?=Ondansetron is effective in the following types of vomiting except\b)/i, '');
}

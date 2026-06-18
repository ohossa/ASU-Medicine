/**
 * api/hint.ts — AI Tutoring Hint Endpoint
 *
 * Provides contextual hints when a student answers incorrectly twice.
 * Uses a pluggable adapter pattern so the AI provider can be swapped
 * without changing the frontend contract.
 *
 * Adapters:
 *  • StaticFallbackAdapter — returns generic hints based on question subject
 *    (default when no API key is configured)
 *  • OpenAIAdapter — calls OpenAI Chat Completions
 *  • GoogleGenAIAdapter — calls Google Gemini API
 *
 * To add a new provider:
 *  1. Implement the AIAdapter interface below
 *  2. Wire it in getAdapter()
 *  3. Set the appropriate env vars
 */

import { verifyToken } from '@clerk/backend';
import { Redis as UpstashRedis } from '@upstash/redis';
import ioredis from 'ioredis';

/* ─── types ─── */

export interface HintRequest {
  questionText: string;
  options?: string[];
  correctIndex?: number;
  pairs?: { premise: string; target: string }[];
  explanation?: string;
  keyConcept?: string;
  subject?: string;
  chapter?: string;
  previousAttempts: number;
  userAnswer?: string;
  studentWrongAnswer?: string;
  correctAnswer?: string;
  modelAnswer?: string;
  blanks?: string[];
  messages?: { role: 'user' | 'assistant'; content: string }[];
}

export interface HintResponse {
  text: string;
  source: 'static' | 'openai' | 'google' | 'nvidia';
  cached?: boolean;
}

interface AIAdapter {
  generateHint(req: HintRequest): Promise<HintResponse>;
}

/* ─── adapters ─── */

class StaticFallbackAdapter implements AIAdapter {
  async generateHint(req: HintRequest): Promise<HintResponse> {
    const hasMessages = req.messages && req.messages.length > 0;

    // When there's a conversation happening but no AI provider, let the student know
    if (hasMessages) {
      return {
        text: "I'm not able to see chat history without an AI provider configured. For now, focus on the core concept and remember: eliminate clearly wrong answers first, then reason from pathophysiology.",
        source: 'static',
      };
    }

    const subject = req.subject?.toLowerCase() ?? '';
    const chapter = req.chapter?.toLowerCase() ?? '';

    // Tailored generic hints based on common medical subjects
    if (subject.includes('cns') || subject.includes('neuro') || chapter.includes('nervous') || chapter.includes('cranial')) {
      return { text: 'Think about which cranial nerve exits at the pontomedullary junction and what function it serves.', source: 'static' };
    }
    if (subject.includes('cardio') || subject.includes('heart') || chapter.includes('cardiac')) {
      return { text: 'Trace the blood flow through the chambers and valves. Which valve would be affected by this condition?', source: 'static' };
    }
    if (subject.includes('resp') || chapter.includes('lung') || chapter.includes('pulmo')) {
      return { text: 'Consider the pressure gradients during inspiration and expiration. Which muscle is the primary driver?', source: 'static' };
    }
    if (subject.includes('renal') || chapter.includes('kidney')) {
      return { text: 'Think about the nephron segments and what is reabsorbed or secreted at each site.', source: 'static' };
    }
    if (subject.includes('endo') || chapter.includes('hormone')) {
      return { text: 'Which gland secretes this hormone, and what is its feedback loop?', source: 'static' };
    }
    if (subject.includes('gastro') || chapter.includes('digest')) {
      return { text: 'Follow the anatomical pathway and think about where enzymes act or where absorption occurs.', source: 'static' };
    }
    if (subject.includes('musculo') || chapter.includes('muscle') || chapter.includes('bone')) {
      return { text: 'Consider the origin, insertion, and action of the muscle. Which nerve innervates it?', source: 'static' };
    }
    if (subject.includes('pharma') || chapter.includes('drug') || chapter.includes('pharmacology')) {
      return { text: 'What is the mechanism of action, and which receptor or enzyme is targeted?', source: 'static' };
    }
    if (subject.includes('micro') || chapter.includes('bacteria') || chapter.includes('virus')) {
      return { text: 'Think about the Gram stain, morphology, or viral family. What is the mode of transmission?', source: 'static' };
    }
    if (subject.includes('patho') || chapter.includes('disease') || chapter.includes('cancer')) {
      return { text: 'What is the underlying pathophysiology? Consider gross vs microscopic findings.', source: 'static' };
    }

    // Ultra-generic fallback
    return {
      text: 'Take a step back. What is the core concept being tested here? Look for clues in the stem and eliminate distractors that are clearly unrelated to the topic.',
      source: 'static',
    };
  }
}

class OpenAIAdapter implements AIAdapter {
  private apiKey: string;
  private model: string;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY ?? '';
    this.model = process.env.OPENAI_HINT_MODEL ?? 'gpt-4o-mini';

    const customBase = process.env.KIMCHI_BASE_URL;
    const isOpenRouter = this.apiKey.startsWith('sk-or-');

    if (customBase && !isOpenRouter) {
      // Custom OpenAI-compatible endpoint (e.g. Kimchi, LiteLLM proxy)
      this.baseUrl = customBase.replace(/\/$/, '') + '/chat/completions';
      this.headers = {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      };
    } else if (isOpenRouter) {
      // OpenRouter key format: sk-or-...
      this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
      this.headers = {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://asu-medical-portal.vercel.app',
        'X-Title': 'ASU Medical Portal AI Tutor',
      };
    } else {
      // Direct OpenAI
      this.baseUrl = 'https://api.openai.com/v1/chat/completions';
      this.headers = {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      };
    }
  }

  async generateHint(req: HintRequest): Promise<HintResponse> {
    if (!this.apiKey) throw new Error('OPENAI_API_KEY not configured');

    const systemPrompt = buildSystemPrompt(req);
    const userPrompt = buildUserPrompt(req);

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Include conversation history if available
    if (req.messages && req.messages.length > 0) {
      messages.push(...req.messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })));
    }

    messages.push({ role: 'user', content: userPrompt });

    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI-compatible API error: ${res.status} ${err}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? '';
    return { text, source: 'openai' };
  }
}

class GoogleGenAIAdapter implements AIAdapter {
  private apiKey: string;
  private model: string;
  constructor() {
    this.apiKey = process.env.GOOGLE_GENAI_API_KEY ?? '';
    this.model = process.env.GOOGLE_HINT_MODEL ?? 'gemini-1.5-flash';
  }

  async generateHint(req: HintRequest): Promise<HintResponse> {
    if (!this.apiKey) throw new Error('GOOGLE_GENAI_API_KEY not configured');

    const systemPrompt = buildSystemPrompt(req);
    const userPrompt = buildUserPrompt(req);

    let contents: any[] = [];

    // Include conversation history if available
    if (req.messages && req.messages.length > 0) {
      for (const msg of req.messages) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    contents.push({
      parts: [{ text: userPrompt }],
    });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google GenAI error: ${res.status} ${err}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    return { text, source: 'google' };
  }
}

class NVIDIAAdapter implements AIAdapter {
  private apiKey: string;
  private model: string;
  constructor() {
    this.apiKey = process.env.NVIDIA_API_KEY ?? '';
    this.model = process.env.NVIDIA_HINT_MODEL ?? 'meta/llama-3.1-8b-instruct';
  }

  async generateHint(req: HintRequest): Promise<HintResponse> {
    if (!this.apiKey) throw new Error('NVIDIA_API_KEY not configured');

    const systemPrompt = buildSystemPrompt(req);
    const userPrompt = buildUserPrompt(req);

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Include conversation history if available
    if (req.messages && req.messages.length > 0) {
      messages.push(...req.messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })));
    }

    messages.push({ role: 'user', content: userPrompt });

    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: 200,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`NVIDIA API error: ${res.status} ${err}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? '';
    return { text, source: 'nvidia' };
  }
}

/* ─── helpers ─── */

function buildSystemPrompt(req: HintRequest): string {
  const answeredIndex = req.userAnswer !== undefined && req.options ? parseInt(req.userAnswer, 10) : NaN;
  const isCorrect = !isNaN(answeredIndex) && req.correctIndex !== undefined && answeredIndex === req.correctIndex;

  // Determine question type for strategy guidance
  const hasOptions = !!(req.options && req.options.length > 0);
  const hasPairs = !!(req.pairs && req.pairs.length > 0);
  const questionTypeHint = hasPairs
    ? 'MATCHING'
    : hasOptions
    ? 'MCQ / TRUE-FALSE'
    : 'ESSAY / CASE / FILL-BLANK';

  const parts: string[] = [
    '=== ASU MEDICAL TUTOR — SYSTEM PROMPT ===',
    '',
    'You are a medical tutor at the Ain Shams University Faculty of Medicine.',
    'You are a warm, direct medical tutor. Answer immediately and clearly.',
    'Then explain the reasoning so the student learns deeply.',
    'Speak exclusively in English (for medical terminology precision).',
    'You understand Arabic but always reply in English.',
    'Use first-person plural: "Let\'s walk through this together..."',
    '',
    '## ABSOLUTE RULES — NEVER VIOLATE',
    '1. Give the direct answer FIRST. Explain the reasoning immediately. Follow with a Socratic question at the end.',
    isCorrect
      ? '2. Student answered CORRECTLY: Confirm in ONE sentence, then immediately challenge deeper — clinical application, related condition, or mechanism-behind-the-mechanism.'
      : '2. Student answered WRONG: Name the misconception first. Ask them to defend their reasoning. THEN gently correct.',
    '3. ALWAYS end with exactly ONE Socratic question that requires reasoning (not yes/no).',
    '4. Clinical correlation is MANDATORY: every response must include one real clinical scenario.',
    '5. Bold key terms with **asterisks**. (e.g. **lateral rectus**, **pontomedullary junction**)',
    '6. Mnemonics are encouraged — build a simple one if none exists.',
    '7. NEVER hallucinate facts outside the EXPLANATION field. Stay within the provided curriculum.',
    '8. NEVER say "As an AI..." or "I am a language model...". You are their tutor.',
    '9. First message max length: 4-6 sentences. Follow-ups only longer if student asks for depth.',
    '10. Provide daily-life analogies for complex mechanisms.',
    '',
    '## PER QUESTION TYPE — ' + questionTypeHint,
  ];

  if (hasOptions) {
    parts.push(
      '- MCQ/TF wrong: Explain why EACH wrong distractor is wrong, one by one.',
      '- MCQ/TF correct: Ask "What pathology would you see if this structure were damaged?"'
    );
  }
  if (hasPairs) {
    parts.push(
      '- Matching: Explain the PHYSIOLOGICAL RELATIONSHIP, not just the pair.',
      '- Example: "CN VII exits at the pontomedullary junction AND innervates the facial muscles BECAUSE the facial nerve motor nucleus is in the pons."'
    );
  }
  if (!hasOptions && !hasPairs) {
    parts.push(
      '- Essay/Case: Evaluate their answer against the model answer. Give a 1-5 strength score + ONE concrete improvement.',
      '- Case: "What\'s your next clinical step? What are you ruling in and ruling out?"',
      '- Fill-Blank: Explain the ENTIRE pathway leading to the blank. Teach the flow, not just the answer.'
    );
  }

  parts.push(
    '',
    '## RESPONSE STRUCTURE (every message)',
    '[Opening — acknowledge their choice]',
    '[First message: Direct answer + explanation immediately. Then a Socratic question.]',
    '[Explanation — concise, bold key terms, one clinical correlation line]',
    '[Mnemonic or memory aid if helpful]',
    '[Closing Socratic question]',
    '',
    '## CONTEXT',
    'QUESTION: ' + req.questionText,
  );

  if (hasOptions) {
    const optionsWithMarker = req.options!.map((opt, i) => {
      const marker = req.correctIndex === i ? ' [CORRECT]' : '';
      return `${String.fromCharCode(65 + i)}) ${opt}${marker}`;
    });
    parts.push('OPTIONS: ' + optionsWithMarker.join(', '));
  }

  if (hasPairs) {
    parts.push('PAIRS: ' + req.pairs!.map(p => `${p.premise} → ${p.target}`).join(', '));
  }

  if (req.correctAnswer) {
    parts.push('CORRECT ANSWER: ' + req.correctAnswer);
  }

  if (!isNaN(answeredIndex) && req.options && req.options[answeredIndex]) {
    const marker = isCorrect ? ' [CORRECT]' : ' [WRONG]';
    parts.push('STUDENT SELECTED: ' + String.fromCharCode(65 + answeredIndex) + ') ' + req.options[answeredIndex] + marker);
  }

  if (req.explanation) {
    parts.push('EXPLANATION: ' + req.explanation);
  }

  if (req.keyConcept) {
    parts.push('KEY CONCEPT: ' + req.keyConcept);
  }

  if (req.modelAnswer) {
    parts.push('MODEL ANSWER: ' + req.modelAnswer);
  }

  if (req.blanks && req.blanks.length > 0) {
    parts.push('BLANK SLOTS: ' + req.blanks.join(' / '));
  }

  parts.push('');
  return parts.join('\n');
}

function buildUserPrompt(req: HintRequest): string {
  if (req.messages && req.messages.length > 0) {
    const lastMessage = req.messages[req.messages.length - 1];
    if (lastMessage.role === 'user') {
      return lastMessage.content;
    }
  }
  return buildInitialMessage(req);
}

function buildInitialMessage(req: HintRequest): string {
  const answeredIndex = req.userAnswer !== undefined && req.options ? parseInt(req.userAnswer, 10) : NaN;
  const isCorrect = !isNaN(answeredIndex) && req.correctIndex !== undefined && answeredIndex === req.correctIndex;
  const selectedText = !isNaN(answeredIndex) && req.options && req.options[answeredIndex]
    ? String.fromCharCode(65 + answeredIndex) + ') ' + req.options[answeredIndex]
    : req.userAnswer || 'my answer';
  const correctText = req.correctAnswer || 'the correct answer';

  if (isCorrect) {
    return `I got this question correct — I chose ${selectedText}. But I want to make sure I truly understand the concept beneath the surface. Can you help me go deeper?`;
  }
  return `I answered ${selectedText} for this question, but I see that's wrong — the correct answer is ${correctText}. Can you help me understand where my reasoning went wrong?`;
}

function getAdapter(): AIAdapter {
  const provider = (process.env.HINT_AI_PROVIDER ?? detectProvider()).toLowerCase();
  switch (provider) {
    case 'openai':
      return new OpenAIAdapter();
    case 'google':
    case 'gemini':
      return new GoogleGenAIAdapter();
    case 'nvidia':
    case 'nim':
      return new NVIDIAAdapter();
    case 'static':
    default:
      return new StaticFallbackAdapter();
  }
}

function detectProvider(): string {
  // Auto-detect which AI provider to use based on available API keys
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GOOGLE_GENAI_API_KEY) return 'google';
  if (process.env.NVIDIA_API_KEY) return 'nvidia';
  return 'static';
}

/* ─── KV / Redis client (same pattern as api/sync.ts) ─── */
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const redisUrl = process.env.REDIS_URL || '';

let dbClient: { get: (key: string) => Promise<any>; set: (key: string, value: any) => Promise<any> };

if (redisUrl) {
  const tcpClient = new ioredis(redisUrl);
  dbClient = {
    get: async (key: string) => {
      const val = await tcpClient.get(key);
      if (!val) return null;
      try { return JSON.parse(val); } catch { return val; }
    },
    set: async (key: string, value: any) => {
      await tcpClient.set(key, typeof value === 'string' ? value : JSON.stringify(value));
    },
  };
} else if (kvUrl && kvToken) {
  const restClient = new UpstashRedis({ url: kvUrl, token: kvToken });
  dbClient = {
    get: async (key: string) => restClient.get(key),
    set: async (key: string, value: any) => restClient.set(key, value),
  };
} else {
  dbClient = { get: async () => null, set: async () => {} };
}

/* ─── rate limiter ─── */
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;

async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `hint_rate:${userId}`;
  const now = Date.now();
  const bucket: number[] = (await dbClient.get(key)) ?? [];
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = bucket.filter((t: number) => t > windowStart);
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now);
  // Trim to max to prevent unbounded growth
  if (recent.length > RATE_LIMIT_MAX) recent.shift();
  await dbClient.set(key, recent);
  return true;
}

/* ─── export default handler ─── */
export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    /* 1. Auth */
    const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
    let userId: string;

    if (!process.env.CLERK_SECRET_KEY) {
      if (!isProduction) {
        // Non-production environments (local dev, preview, vercel dev): bypass Clerk verification
        userId = 'dev-user';
      } else {
        return res.status(500).json({ error: 'Server misconfigured: CLERK_SECRET_KEY is not set. Add it in your Vercel project settings.', hint: 'Get it from your Clerk Dashboard → API Keys' });
      }
    } else {
      const authHeader = req.headers['authorization'];
      const token = authHeader?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized: Missing token' });

      let verified;
      try {
        verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
      } catch (err: any) {
        return res.status(401).json({ error: 'Unauthorized', details: err.message });
      }
      userId = verified.sub ?? '';
      if (!userId) return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    /* 2. Rate limit */
    const allowed = await checkRateLimit(userId);
    if (!allowed) {
      return res.status(429).json({ error: 'Rate limit exceeded. Try again in a minute.' });
    }

    /* 3. Parse body */
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Bad Request: Invalid JSON' }); }
    }
    const requestBody: HintRequest = body;
    if (!requestBody.questionText || requestBody.previousAttempts === undefined) {
      return res.status(400).json({ error: 'Bad Request: questionText and previousAttempts required' });
    }

    /* 4. Generate hint */
    const adapter = getAdapter();
    const response = await adapter.generateHint(requestBody);

    /* 5. Return */
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Hint API Error:', error);
    const msg = error.message || 'Unknown error';
    // Extract the upstream status code from the adapter error message (e.g. "OpenAI API error: 402 ...")
    const statusMatch = msg.match(/\b(\d{3})\b/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : 502;
    return res.status(status).json({ error: 'AI provider error', message: msg });
  }
}
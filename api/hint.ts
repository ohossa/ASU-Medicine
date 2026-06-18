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
  messages?: { role: 'user' | 'assistant'; content: string }[];
}

export interface HintResponse {
  text: string;
  source: 'static' | 'openai' | 'google' | 'custom';
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
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY ?? '';
    this.model = process.env.OPENAI_HINT_MODEL ?? 'gpt-4o-mini';
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
      messages.push(...req.messages);
    }

    messages.push({ role: 'user', content: userPrompt });

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
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
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error: ${res.status} ${err}`);
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

/* ─── helpers ─── */

function buildSystemPrompt(req: HintRequest): string {
  const parts: string[] = [
    'You are a medical tutor helping a student understand why they got this question wrong.',
    '',
    'QUESTION: ' + req.questionText,
  ];

  if (req.options && req.options.length > 0) {
    const optionsWithMarker = req.options.map((opt, i) => {
      const marker = req.correctIndex === i ? ' [CORRECT]' : '';
      return `${String.fromCharCode(65 + i)}) ${opt}${marker}`;
    });
    parts.push('OPTIONS: ' + optionsWithMarker.join(', '));
  }

  if (req.pairs && req.pairs.length > 0) {
    parts.push('PAIRS: ' + req.pairs.map(p => `${p.premise} → ${p.target}`).join(', '));
  }

  if (req.correctAnswer) {
    parts.push('CORRECT ANSWER: ' + req.correctAnswer);
  }

  if (req.studentWrongAnswer) {
    parts.push('STUDENT ANSWERED: ' + req.studentWrongAnswer);
  }

  if (req.explanation) {
    parts.push('EXPLANATION: ' + req.explanation);
  }

  if (req.keyConcept) {
    parts.push('KEY CONCEPT: ' + req.keyConcept);
  }

  parts.push('');
  parts.push('The student is asking questions in a chat. Be warm, encouraging, and precise. If they ask "why", explain the physiological mechanism. If they ask for a mnemonic, provide one. Always respond in English for medical accuracy.');

  return parts.join('\n');
}

function buildUserPrompt(req: HintRequest): string {
  if (req.messages && req.messages.length > 0) {
    const lastMessage = req.messages[req.messages.length - 1];
    if (lastMessage.role === 'user') {
      return lastMessage.content;
    }
  }
  return 'Give me a hint about this question.';
}

function getAdapter(): AIAdapter {
  const provider = (process.env.HINT_AI_PROVIDER ?? 'static').toLowerCase();
  switch (provider) {
    case 'openai':
      return new OpenAIAdapter();
    case 'google':
    case 'gemini':
      return new GoogleGenAIAdapter();
    case 'static':
    default:
      return new StaticFallbackAdapter();
  }
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
    const authHeader = req.headers['authorization'];
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized: Missing token' });

    let verified;
    try {
      verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    } catch (err: any) {
      return res.status(401).json({ error: 'Unauthorized', details: err.message });
    }
    const userId = verified.sub;
    if (!userId) return res.status(401).json({ error: 'Unauthorized: Invalid token' });

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
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
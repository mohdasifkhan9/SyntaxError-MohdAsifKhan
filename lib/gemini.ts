import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiResponse {
  summary: string;
  key_points: string[];
  risk_score: 'Low' | 'Medium' | 'High' | 'Unknown';
  clauses: {
    text: string;
    simplified: string;
    risk: 'Low' | 'Medium' | 'High' | 'Unknown';
  }[];
  advice: string;
}

export interface GeminiAnalysisMeta {
  attempts: number;
  retried: boolean;
  usedFallback: boolean;
  model: string;
  reason?: string;
}

export interface AnalyzeDocumentResult {
  analysis: GeminiResponse;
  meta: GeminiAnalysisMeta;
}

const PRIMARY_MODEL = 'gemini-2.5-flash';
const SECONDARY_MODEL = 'gemini-1.5-flash';
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 3;

const FALLBACK_ANALYSIS: GeminiResponse = {
  summary: 'Unable to analyze document at the moment. Please try again.',
  key_points: [],
  risk_score: 'Unknown',
  clauses: [],
  advice: 'Please retry after some time.',
};

const promptHeader = `
Analyze the following legal document and provide the response in JSON format.

{
  "summary": "simple explanation",
  "key_points": ["point1", "point2"],
  "risk_score": "Low | Medium | High | Unknown",
  "clauses": [
    {
      "text": "original clause",
      "simplified": "easy explanation",
      "risk": "Low | Medium | High | Unknown"
    }
  ],
  "advice": "practical suggestions on what to avoid, what to negotiate, and what to be careful about"
}

Instructions:
- Simplify legal language
- Identify risks, penalties, hidden charges
- Keep explanations short and clear
- Make sure "risk_score" is exactly one of: "Low", "Medium", "High", "Unknown"
- In "advice", give practical suggestions: what to avoid, what to negotiate, red flags to watch for. Use newlines to separate each point.
- Output nothing but valid JSON. No markdown backticks unless part of JSON inside string.

Document:
`;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Gemini request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function extractStatusCode(errorMessage: string): number | null {
  const match = errorMessage.match(/\[(\d{3})\s/);
  return match ? Number(match[1]) : null;
}

function shouldRetry(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const status = extractStatusCode(message);

  if (message.toLowerCase().includes('timed out')) return true;
  if (!status) return true;
  return [429, 500, 502, 503, 504].includes(status);
}

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('```json')) {
    return trimmed.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  }
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```[^\n]*\n?/, '').replace(/\s*```$/, '').trim();
  }
  return trimmed;
}

function normalizeRisk(value: unknown): 'Low' | 'Medium' | 'High' | 'Unknown' {
  if (value === 'Low' || value === 'Medium' || value === 'High' || value === 'Unknown') {
    return value;
  }
  return 'Unknown';
}

function normalizeAnalysis(payload: unknown): GeminiResponse {
  const data = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;
  const clausesInput = Array.isArray(data.clauses) ? data.clauses : [];

  return {
    summary: typeof data.summary === 'string' && data.summary.trim() ? data.summary : FALLBACK_ANALYSIS.summary,
    key_points: Array.isArray(data.key_points)
      ? data.key_points.filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
      : [],
    risk_score: normalizeRisk(data.risk_score),
    clauses: clausesInput
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const clause = item as Record<string, unknown>;
        return {
          text: typeof clause.text === 'string' ? clause.text : '',
          simplified: typeof clause.simplified === 'string' ? clause.simplified : '',
          risk: normalizeRisk(clause.risk),
        };
      })
      .filter((c) => c.text || c.simplified),
    advice: typeof data.advice === 'string' ? data.advice : FALLBACK_ANALYSIS.advice,
  };
}

async function requestAnalysis(modelName: string, prompt: string, apiKey: string): Promise<GeminiResponse> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await withTimeout(model.generateContent(prompt), REQUEST_TIMEOUT_MS);
  const responseText = result.response.text();

  if (!responseText) {
    throw new Error('No response string from Gemini API');
  }

  const rawText = stripCodeFence(responseText);
  const parsed = JSON.parse(rawText);
  return normalizeAnalysis(parsed);
}

export async function analyzeDocument(text: string): Promise<AnalyzeDocumentResult> {
  console.info('[gemini] analyzeDocument started');
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[gemini] GEMINI_API_KEY missing');
    return {
      analysis: FALLBACK_ANALYSIS,
      meta: {
        attempts: 0,
        retried: false,
        usedFallback: true,
        model: PRIMARY_MODEL,
        reason: 'GEMINI_API_KEY is not configured.',
      },
    };
  }

  const prompt = `${promptHeader}${text}`;
  const modelsToTry = [PRIMARY_MODEL, SECONDARY_MODEL];
  let attempts = 0;
  let lastErrorMessage = 'Unknown Gemini API error.';

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      attempts += 1;
      console.info('[gemini] request attempt', { model: modelName, attempt, totalAttempts: attempts });
      try {
        const analysis = await requestAnalysis(modelName, prompt, apiKey);
        console.info('[gemini] request success', { model: modelName, totalAttempts: attempts });
        return {
          analysis,
          meta: {
            attempts,
            retried: attempts > 1,
            usedFallback: false,
            model: modelName,
          },
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        lastErrorMessage = message;
        console.error('[gemini] request failed', { model: modelName, attempt, message });

        const canRetry = shouldRetry(error);
        const isLastAttempt = attempt === MAX_RETRIES;

        if (!canRetry || isLastAttempt) {
          break;
        }

        // Backoff schedule: 1s -> 2s -> 3s
        await delay(attempt * 1000);
      }
    }
  }

  console.error('[gemini] returning fallback response', { attempts, reason: lastErrorMessage });
  return {
    analysis: FALLBACK_ANALYSIS,
    meta: {
      attempts,
      retried: attempts > 1,
      usedFallback: true,
      model: SECONDARY_MODEL,
      reason: lastErrorMessage,
    },
  };
}

import { GoogleGenerativeAI } from '@google/generative-ai';

// The client is initialized dynamically to ensure process.env is read at runtime

export interface GeminiResponse {
  summary: string;
  key_points: string[];
  risk_score: 'Low' | 'Medium' | 'High';
  clauses: {
    text: string;
    simplified: string;
    risk: 'Low' | 'Medium' | 'High';
  }[];
  advice: string;
}

export async function analyzeDocument(text: string): Promise<GeminiResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const prompt = `
Analyze the following legal document and provide the response in JSON format.

{
  "summary": "simple explanation",
  "key_points": ["point1", "point2"],
  "risk_score": "Low | Medium | High",
  "clauses": [
    {
      "text": "original clause",
      "simplified": "easy explanation",
      "risk": "Low | Medium | High"
    }
  ],
  "advice": "practical suggestions on what to avoid, what to negotiate, and what to be careful about"
}

Instructions:
- Simplify legal language
- Identify risks, penalties, hidden charges
- Keep explanations short and clear
- Make sure "risk_score" is exactly one of: "Low", "Medium", "High"
- In "advice", give practical suggestions: what to avoid, what to negotiate, red flags to watch for. Use newlines to separate each point.
- Output nothing but valid JSON. No markdown backticks unless part of JSON inside string.

Document:
${text}
`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("No response string from Gemini API");
    }

    // Strip markdown formatting if present
    let rawText = responseText.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```[^\n]*\n/, '').replace(/\n```$/, '');
    }
    
    // Sometimes it might still have surrounding spaces or trailing commas
    rawText = rawText.trim();

    const jsonResult: GeminiResponse = JSON.parse(rawText);
    
    // Ensure advice field exists (backward compat)
    if (!jsonResult.advice) {
      jsonResult.advice = '';
    }
    
    return jsonResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze document");
  }
}

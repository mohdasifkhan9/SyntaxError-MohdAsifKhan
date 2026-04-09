import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Attempt to fetch context (most recently analyzed document)
    let contextStr = '';
    const { data: recentDoc } = await supabase
      .from('documents')
      .select('summary, file_url, created_at, risk_score')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentDoc) {
      const fileName = recentDoc.file_url.split('/').pop()?.split('_')[0] || 'Document';
      contextStr = `\n\n[CONTEXT: The user recently analyzed a document named "${fileName}". It had a risk score of ${recentDoc.risk_score || 'Medium'}. Summary: ${recentDoc.summary}]`;
    }

    const systemInstruction = `You are an expert, helpful legal AI assistant for NyayAI. 
Your goal is to answer the user's legal questions clearly and concisely.
CRITICAL: ALWAYS respond in the exact same language the user uses in their prompt.
Explain complex legal terms very simply. Avoid massive walls of text; use bullet points if helpful.
If applicable, use this context about the user's documents to tailor your advice: ${contextStr}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction 
    });

    // Format frontend messages into Gemini format
    const geminiHistory = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Start stream
    const resultStream = await model.generateContentStream({
      contents: geminiHistory
    });

    // Create a ReadableStream to stream chunks back to the client
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of resultStream.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(new TextEncoder().encode('\n[Error: Connection interrupted]'));
        } finally {
          controller.close();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

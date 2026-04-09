import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeDocument } from '@/lib/gemini';
import { extractTextFromBuffer } from '@/lib/extractText';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FALLBACK_ANALYSIS = {
  summary: 'Analysis temporarily unavailable',
  key_points: [],
  risk_score: 'Unknown',
  clauses: [],
  advice: 'Please try again later',
};

function jsonError(message: string, status: number, details?: Record<string, unknown>) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...details,
    },
    { status }
  );
}

export async function POST(req: NextRequest) {
  try {
    console.info('[analyze] Request started');
    const supabase = await createClient();
    
    // Auth check using getUser for security
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return jsonError('Unauthorized', 401);
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    if (!body || typeof body !== 'object') {
      return jsonError('Request body is required', 400);
    }

    const { fileUrl, documentPath } = body;

    const hasValidPath = typeof documentPath === 'string' && documentPath.trim().length > 0;
    const hasValidUrl = typeof fileUrl === 'string' && fileUrl.trim().length > 0;
    if (!hasValidPath && !hasValidUrl) {
      return jsonError('Missing fileUrl or documentPath', 400);
    }

    let pdfBuffer: Buffer;

    // Fetch the file contents. If it's in Supabase storage, we download it using the client.
    if (hasValidPath) {
        const { data, error } = await supabase.storage
            .from('documents')
            .download(documentPath.trim());
            
        if (error || !data) {
            console.error("Storage Error:", error);
            return jsonError('Failed to download document from storage', 500);
        }
        pdfBuffer = Buffer.from(await data.arrayBuffer());
    } else {
        // Fallback for direct URL
        const fileResponse = await fetch(fileUrl.trim());
        if (!fileResponse.ok) {
            return jsonError('Failed to fetch document', 500);
        }
        const arrayBuffer = await fileResponse.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
    }

    // Extract text from the buffer using our new utility
    const pathOrUrl = hasValidPath ? documentPath.trim() : fileUrl.trim();
    let text = '';
    
    try {
       text = await extractTextFromBuffer(pdfBuffer, pathOrUrl);
    } catch (parseErr: any) {
       console.error("Text Extraction Error:", parseErr);
       return jsonError(parseErr.message || 'Failed to extract text from the document format', 400);
    }

    if (!text || text.trim() === '') {
        return jsonError('No text could be extracted from the document', 400);
    }

    // Call Gemini API (resilient: retries + fallback JSON)
    const aiResult = await analyzeDocument(text);
    const analysis = aiResult.analysis;
    const aiMeta = aiResult.meta;
    console.info('[analyze] Gemini completed', aiMeta);
    const dbRiskScore =
      analysis.risk_score === 'Low' || analysis.risk_score === 'Medium' || analysis.risk_score === 'High'
        ? analysis.risk_score
        : null;

    // Save results into Supabase "documents" table (including new fields)
    const { data: docRecord, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_url: pathOrUrl,
        extracted_text: text,
        summary: analysis.summary,
        risk_score: dbRiskScore,
        advice: analysis.advice || null,
        key_points: analysis.key_points || null,
      })
      .select('id')
      .single();

    if (docError || !docRecord) {
        console.error("Doc Insert Error:", docError);
        return NextResponse.json(
          {
            success: false,
            error: docError?.message || 'Failed to save document record',
            documentId: null,
            analysis: aiMeta.usedFallback
              ? analysis
              : FALLBACK_ANALYSIS,
            meta: {
              ...aiMeta,
              usedFallback: true,
              reason: docError?.message || 'Failed to save document record',
            },
          },
          { status: 200 }
        );
    }

    // Save clauses
    if (analysis.clauses && analysis.clauses.length > 0) {
        const clausesToInsert = analysis.clauses.map(clause => ({
            document_id: docRecord.id,
            clause_text: clause.text,
            simplified: clause.simplified,
            risk: clause.risk
        }));

        const { error: clausesError } = await supabase
            .from('clauses')
            .insert(clausesToInsert);
            
        if (clausesError) {
             console.error("Clauses Insert Error:", clausesError);
             // We won't block the return if clauses fail, but we'll log it
        }
    }

    // Return the response
    return NextResponse.json({
        success: true,
        documentId: docRecord.id,
        analysis,
        meta: aiMeta,
    });

  } catch (error: any) {
    console.error('Analyze API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Something went wrong',
        documentId: null,
        analysis: FALLBACK_ANALYSIS,
        meta: {
          attempts: 0,
          retried: false,
          usedFallback: true,
          model: 'gemini-2.5-flash',
          reason: error?.message || 'Internal server error',
        },
      },
      { status: 200 }
    );
  }
}

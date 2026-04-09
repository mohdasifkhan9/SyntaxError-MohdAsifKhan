import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeDocument } from '@/lib/gemini';
import { extractTextFromBuffer } from '@/lib/extractText';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Auth check using getUser for security
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileUrl, documentPath } = await req.json();

    if (!fileUrl && !documentPath) {
      return NextResponse.json({ error: 'Missing fileUrl or documentPath' }, { status: 400 });
    }

    let pdfBuffer: Buffer;

    // Fetch the file contents. If it's in Supabase storage, we download it using the client.
    if (documentPath) {
        const { data, error } = await supabase.storage
            .from('documents')
            .download(documentPath);
            
        if (error || !data) {
            console.error("Storage Error:", error);
            return NextResponse.json({ error: 'Failed to download document from storage' }, { status: 500 });
        }
        pdfBuffer = Buffer.from(await data.arrayBuffer());
    } else {
        // Fallback for direct URL
        const fileResponse = await fetch(fileUrl);
        if (!fileResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
        }
        const arrayBuffer = await fileResponse.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
    }

    // Extract text from the buffer using our new utility
    const pathOrUrl = documentPath || fileUrl;
    let text = '';
    
    try {
       text = await extractTextFromBuffer(pdfBuffer, pathOrUrl);
    } catch (parseErr: any) {
       console.error("Text Extraction Error:", parseErr);
       return NextResponse.json({ error: parseErr.message || 'Failed to extract text from the document format' }, { status: 400 });
    }

    if (!text || text.trim() === '') {
        return NextResponse.json({ error: 'No text could be extracted from the document' }, { status: 400 });
    }

    // Call Gemini API
    const analysis = await analyzeDocument(text);

    // Save results into Supabase "documents" table (including new fields)
    const { data: docRecord, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_url: pathOrUrl,
        extracted_text: text,
        summary: analysis.summary,
        risk_score: analysis.risk_score,
        advice: analysis.advice || null,
        key_points: analysis.key_points || null,
      })
      .select('id')
      .single();

    if (docError || !docRecord) {
        console.error("Doc Insert Error:", docError);
        return NextResponse.json({ error: 'Failed to save document record' }, { status: 500 });
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
        analysis
    });

  } catch (error) {
    console.error('Analyze API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

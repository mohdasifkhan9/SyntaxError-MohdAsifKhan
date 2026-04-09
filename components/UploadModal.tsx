'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const demoData = {
  summary:
    'This sample rental agreement has moderate risk. Watch for one-sided termination terms, late-fee penalties, and limited landlord repair obligations.',
  key_points: [
    'The agreement allows quick termination with short notice.',
    'Late payment penalties can accumulate quickly.',
    'Repair responsibilities are mostly shifted to the tenant.',
  ],
  risk_score: 'Medium',
  score: 62,
  clauses: [
    {
      text: 'Either party may terminate this agreement with 7 days written notice.',
      keyword: 'termination',
    },
    {
      text: 'A late fee of 5% of monthly rent applies after 3 days of due date.',
      keyword: 'penalty',
    },
    {
      text: 'Tenant is responsible for all minor maintenance and interior repairs.',
      keyword: 'maintenance',
    },
  ],
  advice: [
    'Ask for at least 30 days termination notice.',
    'Cap late fees to a fixed and reasonable amount.',
    'Clarify landlord responsibility for structural and major repairs.',
  ],
};

export default function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressText, setProgressText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setIsDemo(false);
    setError(null);
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Only PDF, DOCX, and TXT files are supported currently.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }
    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const createDemoAnalysis = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('You must be logged in to use the demo document.');
    }

    const { data: docRecord, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: session.user.id,
        file_url: `demo/demo-document-${Date.now()}.txt`,
        extracted_text: 'Demo legal document content for product walkthrough.',
        summary: demoData.summary,
        risk_score: demoData.risk_score,
        advice: demoData.advice.join('\n'),
        key_points: demoData.key_points,
      })
      .select('id')
      .single();

    if (docError || !docRecord) {
      throw new Error(docError?.message || 'Failed to create demo analysis.');
    }

    const clausesToInsert = demoData.clauses.map((clause) => ({
      document_id: docRecord.id,
      clause_text: clause.text,
      simplified: `Potential concern related to "${clause.keyword}".`,
      risk: demoData.risk_score,
    }));

    const { error: clauseError } = await supabase.from('clauses').insert(clausesToInsert);

    if (clauseError) {
      throw new Error(clauseError.message || 'Failed to create demo clause data.');
    }

    return docRecord.id;
  };

  const handleDemo = async () => {
    try {
      setIsDemo(true);
      setLoading(true);
      setError(null);
      setProgressText('Loading demo document...');

      const documentId = await createDemoAnalysis();
      router.push(`/dashboard/document/${documentId}`);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Unable to load demo document.');
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  const handleUploadAndAnalyze = async () => {
    const trimmedText = inputText.trim();
    if (!file && !trimmedText) {
      setError('Please upload a document or paste legal text.');
      return;
    }

    let retryHintTimer: ReturnType<typeof setTimeout> | null = null;

    try {
      setIsDemo(false);
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to upload documents.');
      }

      let payload: Record<string, string> = {};

      // Prioritize pasted text when both text and file are present.
      if (trimmedText) {
        payload = { text: trimmedText };
      } else if (file) {
        setProgressText('Uploading document securely...');
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(uploadError.message || 'Failed to upload file.');
        }

        payload = { documentPath: uploadData.path };
      }

      setProgressText('Analyzing document...');
      retryHintTimer = setTimeout(() => {
        setProgressText('Retrying AI request...');
      }, 11000);

      let result: any = null;
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const rawResponse = await response.text();
        try {
          result = rawResponse ? JSON.parse(rawResponse) : null;
        } catch (parseError) {
          console.error('Analyze API returned non-JSON response:', rawResponse);
          console.error('JSON parse error:', parseError);
        }

        if (!response.ok || !result?.success) {
          console.error('Analyze API failed', {
            status: response.status,
            statusText: response.statusText,
            body: rawResponse,
          });
          throw new Error('AI analysis failed. Please try again.');
        }
      } catch (apiError) {
        console.error('Analyze request failed:', apiError);
        throw new Error('AI analysis failed. Please try again.');
      }
      if (retryHintTimer) {
        clearTimeout(retryHintTimer);
        retryHintTimer = null;
      }

      if (result?.meta?.retried) {
        setProgressText('Retrying AI request...');
      }

      if (result?.meta?.usedFallback || !result?.documentId) {
        setError('AI analysis failed. Please try again.');
        return;
      }

      setProgressText('Analysis complete!');
      router.push(`/dashboard/document/${result.documentId}`);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      if (retryHintTimer) {
        clearTimeout(retryHintTimer);
      }
      setLoading(false);
      setProgressText('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A] shadow-2xl p-6"
          >
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
              Analyze Document
            </h2>
            <p className="text-white/60 mb-6">
              Upload a legal document to get AI-powered insights, risk analysis, and simplified clauses.
            </p>

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-10 transition-colors text-center ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-400/5'
                    : 'border-white/20 bg-white/5 hover:border-purple-400/50 hover:bg-white/10'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                  <Upload className="h-8 w-8 text-white/60" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Click or drag and drop</h3>
                <p className="text-sm text-white/40">Supports PDF, DOCX, TXT up to 10MB</p>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="grid gap-1 overflow-hidden">
                    <p className="truncate font-medium text-white">{file.name}</p>
                    <p className="text-xs text-white/50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {!loading && (
                  <button onClick={clearFile} className="p-2 text-white/50 hover:text-red-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium text-white/40">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setIsDemo(false);
                setInputText(e.target.value);
                setError(null);
              }}
              disabled={loading}
              placeholder="Paste your legal document here..."
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-cyan-400/40 focus:bg-white/10 disabled:opacity-60"
            />

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleDemo}
                disabled={loading}
                className="text-sm text-white/50 hover:text-cyan-300 transition-colors disabled:opacity-50"
              >
                Try Demo Document -&gt;
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm border border-red-400/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl font-medium text-white border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={loading || (!file && !inputText.trim())}
                onClick={handleUploadAndAnalyze}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                  boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {progressText || 'Processing...'}
                  </>
                ) : (
                  'Analyze Document'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

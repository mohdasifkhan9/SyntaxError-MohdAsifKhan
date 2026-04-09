'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
    setError(null);
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/msword', 
      'text/plain'
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Only PDF, DOCX, and TXT files are supported currently.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
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

  const handleUploadAndAnalyze = async () => {
    if (!file) return;

    let retryHintTimer: ReturnType<typeof setTimeout> | null = null;

    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to upload documents.");
      }

      // 1. Upload to Supabase Storage
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

      // 2. Call our API Route to Extract Text + Analyze with Gemini
      setProgressText('Analyzing document...');
      retryHintTimer = setTimeout(() => {
        setProgressText('Retrying AI request...');
      }, 11000);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentPath: uploadData.path }),
      });
      if (retryHintTimer) {
        clearTimeout(retryHintTimer);
        retryHintTimer = null;
      }

      const responseClone = response.clone();
      let result: any = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success) {
        const fallbackText = !result ? await responseClone.text().catch(() => '') : '';
        throw new Error(result?.error || fallbackText || 'Failed to analyze document.');
      }

      if (result?.meta?.retried) {
        setProgressText('Retrying AI request...');
      }

      if (result?.meta?.usedFallback || !result?.documentId) {
        setError(result?.analysis?.summary || 'Unable to analyze document at the moment. Please try again.');
        return;
      }

      // Done
      setProgressText('Analysis complete!');
      
      // Redirect to document view using the newly created documentId
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
            <p className="text-white/60 mb-6">Upload a legal document to get AI-powered insights, risk analysis, and simplified clauses.</p>

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
                disabled={!file || loading}
                onClick={handleUploadAndAnalyze}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
                  boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
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

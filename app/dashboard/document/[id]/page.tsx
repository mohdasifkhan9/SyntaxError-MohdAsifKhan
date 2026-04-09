import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Brain, FileText, ChevronLeft, ListChecks } from 'lucide-react';
import Link from 'next/link';
import RiskMeter from '@/components/RiskMeter';
import ClauseCard from '@/components/ClauseCard';
import SafetyScore from '@/components/SafetyScore';
import AiAdvice from '@/components/AiAdvice';

export default async function DocumentAnalysisPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const supabase = await createClient();

  // Auth Protection
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch document
  const { data: document, error: docError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (docError || !document || document.user_id !== session.user.id) {
    redirect('/dashboard');
  }

  // Fetch clauses
  const { data: clauses } = await supabase
    .from('clauses')
    .select('*')
    .eq('document_id', id);

  const fineName = document.file_url.split('/').pop()?.split('_')[0] || 'Document';

  // Build clause data for SafetyScore
  const clauseRisks = (clauses || []).map((c: any) => ({ risk: c.risk as 'Low' | 'Medium' | 'High' }));

  // Parse key_points (could be stored as JSON array or string)
  let keyPoints: string[] = [];
  if (document.key_points) {
    if (Array.isArray(document.key_points)) {
      keyPoints = document.key_points;
    } else if (typeof document.key_points === 'string') {
      try { keyPoints = JSON.parse(document.key_points); } catch { keyPoints = []; }
    }
  }

  return (
    <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-2 break-words">
            {fineName}
          </h1>
          <p className="text-white/50">Analyzed on {new Date(document.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Safety Score, Risk, Summary, Key Points, AI Advice */}
        <div className="space-y-6 lg:space-y-8">
           {/* Safety Score */}
           <SafetyScore clauses={clauseRisks} />

           {/* Risk Meter */}
           <RiskMeter score={document.risk_score as any || 'Medium'} />

           {/* AI Summary */}
           <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">AI Summary</h3>
             </div>
             <p className="text-white/70 leading-relaxed">
               {document.summary}
             </p>
           </div>

           {/* Key Points */}
           {keyPoints.length > 0 && (
             <div className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-xl">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Key Points</h3>
               </div>
               <ul className="space-y-3">
                 {keyPoints.map((point, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                     <span className="text-white/70 leading-relaxed text-sm">{point}</span>
                   </li>
                 ))}
               </ul>
             </div>
           )}

           {/* AI Advice */}
           <AiAdvice advice={document.advice || ''} />
        </div>

        {/* Right Column: Clauses */}
        <div className="lg:col-span-2">
           <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl h-full">
             <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Clause Breakdown</h3>
             <p className="text-white/50 mb-6 sm:mb-8">Detailed analysis of potentially concerning clauses.</p>
             
             {(!clauses || clauses.length === 0) ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                  <p className="text-white/50">No notable clauses found by AI.</p>
                </div>
             ) : (
                <div className="space-y-4">
                  {clauses.map((clause: any) => (
                    <ClauseCard 
                      key={clause.id}
                      original={clause.clause_text}
                      simplified={clause.simplified}
                      risk={clause.risk as any}
                    />
                  ))}
                </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}

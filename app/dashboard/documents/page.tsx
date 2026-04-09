import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DocumentCard from '@/components/DocumentCard';
import { FileText } from 'lucide-react';

export default async function DocumentsPage() {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch all documents for this user
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">My Documents</h1>
        <p className="text-white/50">Manage and review all your previously analyzed legal documents.</p>
      </div>

      {!documents || documents.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
          <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
             <FileText className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No documents found</h3>
          <p className="text-white/50">Head over to the Dashboard to upload and analyze your first document.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc: any) => {
            const fileName = doc.file_url.split('/').pop()?.split('_')[0] || 'Document';
            return (
              <DocumentCard 
                key={doc.id}
                id={doc.id}
                name={fileName}
                date={doc.created_at}
                risk={doc.risk_score || 'Medium'}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ChatClient from '@/components/ChatClient';

export default async function ChatPage() {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="py-6 h-[calc(100vh-100px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-4 shrink-0">
        <h1 className="text-3xl font-bold text-white mb-2">NyayAI Assistant</h1>
        <p className="text-white/50">Chat contextually about your recent legal documents.</p>
      </div>

      <div className="flex-1 min-h-0">
        <ChatClient />
      </div>
    </div>
  );
}

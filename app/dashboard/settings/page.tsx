'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { UserCircle, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();
  const { signOut } = useAuth();

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (data) setProfile(data);
      }
    }
    loadUser();
  }, [supabase]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/50">Manage your profile and account settings.</p>
      </div>

      <div className="space-y-6">
        <div className="p-8 rounded-2xl border border-white/10 bg-[#0F172A]/50 backdrop-blur-xl">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <UserCircle className="w-10 h-10 text-white/50" />
               )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{profile?.full_name || 'User Profile'}</h2>
              <p className="text-white/50">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-white/60 mb-2">Account ID</label>
               <input 
                 type="text" 
                 disabled 
                 value={user?.id || ''} 
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/70 font-mono text-sm" 
               />
             </div>
             
             <div className="pt-4">
               <button 
                 onClick={handleLogout}
                 className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors font-medium cursor-pointer"
               >
                 <LogOut className="w-5 h-5" />
                 Log out of all devices
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

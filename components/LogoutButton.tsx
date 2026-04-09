'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden md:inline">Logout</span>
    </button>
  );
}
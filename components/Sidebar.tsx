'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { LayoutDashboard, FileText, MessageSquare, Settings, LogOut, Scale, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // GSAP Sidebar Entrance Animation (desktop only)
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    if (mediaQuery.matches && sidebarRef.current) {
        gsap.fromTo(
            sidebarRef.current,
            { x: -300, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
    }
    
    // Animate links staggering in
    if (linksRef.current.length > 0) {
        gsap.fromTo(
            linksRef.current.filter(Boolean),
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power2.out" }
        );
    }
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
          ref={sidebarRef}
          className={`w-64 h-screen fixed left-0 top-0 flex flex-col justify-between border-r border-white/10 p-6 z-[60] transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          style={{
               background: "rgba(15, 23, 42, 0.95)",
               backdropFilter: "blur(20px)"
          }}
      >
        <div>
          <div className="flex items-center justify-between mb-10 pl-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                    NyayAI
                </span>
              </div>
              {/* Mobile close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  ref={(el) => { linksRef.current[i] = el; }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-white border border-white/10 shadow-[0_0_15px_rgba(124,58,237,0.1)]' 
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-auto w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );
}

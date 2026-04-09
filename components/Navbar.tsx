'use client';

import { motion } from 'motion/react';
import { Scale, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Don't show navbar on auth pages or dashboard
  const showNavbar = !pathname?.startsWith('/login') && !pathname?.startsWith('/signup') && !pathname?.startsWith('/dashboard');

  if (!showNavbar) return null;

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 pt-6 px-4 pointer-events-none"
    >
      <div className="max-w-4xl border rounded-full mr-auto ml-auto pt-3 pr-6 pb-3 pl-6 border-white/10 pointer-events-auto"
        style={{
          background: "linear-gradient(180deg, rgba(14,16,26,0.55), rgba(14,16,26,0.35)) padding-box, linear-gradient(120deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08)) border-box",
          border: "1px solid transparent",
          backdropFilter: "blur(16px) saturate(120%)",
          WebkitBackdropFilter: "blur(16px) saturate(120%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)"
        }}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white/90">Nyay<span className="text-primary">AI</span></span>
          </Link>
          <ul className="hidden md:flex items-center gap-1 text-sm font-medium text-white/60">
            <li className="">
              <Link href="#"
                className="transition-colors duration-300 rounded-full pt-2 pr-4 pb-2 pl-4 hover:text-white hover:bg-white/5">Home</Link>
            </li>
            <li className="">
              <Link href="#problem"
                className="transition-colors duration-300 hover:text-white hover:bg-white/5 rounded-full pt-2 pr-4 pb-2 pl-4">Problem</Link>
            </li>
            <li className="">
              <Link href="#solution"
                className="transition-colors duration-300 rounded-full pt-2 pr-4 pb-2 pl-4 hover:text-white hover:bg-white/5">Solution</Link>
            </li>
            <li className="">
              <Link href="#features"
                className="transition-colors duration-300 rounded-full pt-2 pr-4 pb-2 pl-4 hover:text-white hover:bg-white/5">Features</Link>
            </li>
            <li className="">
              <Link href="#demo"
                className="transition-colors duration-300 rounded-full pt-2 pr-4 pb-2 pl-4 hover:text-white hover:bg-white/5">Demo</Link>
            </li>
          </ul>
          <div className="flex items-center gap-2 md:gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              // Logged in - show Dashboard and Logout
              <div className="flex items-center gap-2">
                <Link href="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              // Not logged in - show Login and Signup
              <div className="flex items-center gap-2">
                <Link href="/login"
                  className="px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  Login
                </Link>
                <Link href="/signup" className="custom-signup-btn">
                  <div className="points_wrapper">
                    <i className="point"></i>
                    <i className="point"></i>
                    <i className="point"></i>
                    <i className="point"></i>
                    <i className="point"></i>
                    <i className="point"></i>
                    <i className="point"></i>
                    <i className="point"></i>
                    <i className="point"></i>
                    <i className="point"></i>
                  </div>
                  <span className="inner">
                    Sign Up
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-signup-btn {
          cursor: pointer;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: all 0.25s ease;
          background: radial-gradient(65.28% 65.28% at 50% 100%, rgba(99, 102, 241, 0.6) 0%, rgba(129, 140, 248, 0.3) 50%, rgba(99, 102, 241, 0) 100%), linear-gradient(135deg, #4338ca, #6366f1, #8b5cf6);
          border-radius: 9999px;
          border: none;
          outline: none;
          padding: 8px 20px;
          min-height: 40px;
          min-width: 120px;
          box-shadow: 0 8px 25px -8px rgba(99, 102, 241, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
        .custom-signup-btn::before, .custom-signup-btn::after {
          content: "";
          position: absolute;
          transition: all 0.5s ease-in-out;
          z-index: 0;
        }
        .custom-signup-btn::before {
          inset: 1px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%);
          border-radius: 9999px;
        }
        .custom-signup-btn::after {
          inset: 2px;
          background: radial-gradient(65.28% 65.28% at 50% 100%, rgba(99, 102, 241, 0.4) 0%, rgba(129, 140, 248, 0.2) 50%, rgba(99, 102, 241, 0) 100%), linear-gradient(135deg, #4338ca, #6366f1, #8b5cf6);
          border-radius: 9999px;
        }
        .custom-signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px -8px rgba(99, 102, 241, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.2);
        }
        .custom-signup-btn:active { transform: translateY(-1px) scale(0.98); }
        .custom-signup-btn .points_wrapper {
          overflow: hidden; width: 100%; height: 100%; pointer-events: none; position: absolute; z-index: 1;
        }
        .custom-signup-btn .points_wrapper .point {
          bottom: -10px; position: absolute; animation: floating-points infinite ease-in-out; pointer-events: none; width: 2px; height: 2px; background-color: #c7d2fe; border-radius: 9999px; box-shadow: 0 0 4px rgba(199, 210, 254, 0.8);
        }
        @keyframes floating-points {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { opacity: 1; }
          85% { opacity: 0.3; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
        .custom-signup-btn .points_wrapper .point:nth-child(1) { left: 15%; opacity: 0.9; animation-duration: 2.8s; animation-delay: 0.3s; }
        .custom-signup-btn .points_wrapper .point:nth-child(2) { left: 25%; opacity: 0.7; animation-duration: 3.2s; animation-delay: 0.7s; }
        .custom-signup-btn .points_wrapper .point:nth-child(3) { left: 35%; opacity: 0.8; animation-duration: 2.6s; animation-delay: 0.2s; }
        .custom-signup-btn .points_wrapper .point:nth-child(4) { left: 50%; opacity: 0.6; animation-duration: 2.4s; animation-delay: 0.1s; }
        .custom-signup-btn .points_wrapper .point:nth-child(5) { left: 60%; opacity: 0.9; animation-duration: 2.1s; animation-delay: 0s; }
        .custom-signup-btn .points_wrapper .point:nth-child(6) { left: 70%; opacity: 0.5; animation-duration: 2.9s; animation-delay: 1.2s; }
        .custom-signup-btn .points_wrapper .point:nth-child(7) { left: 80%; opacity: 0.8; animation-duration: 2.7s; animation-delay: 0.4s; }
        .custom-signup-btn .points_wrapper .point:nth-child(8) { left: 45%; opacity: 0.7; animation-duration: 3.0s; animation-delay: 0.6s; }
        .custom-signup-btn .points_wrapper .point:nth-child(9) { left: 85%; opacity: 0.6; animation-duration: 2.3s; animation-delay: 0.8s; }
        .custom-signup-btn .points_wrapper .point:nth-child(10) { left: 65%; opacity: 0.9; animation-duration: 2.5s; animation-delay: 0.5s; }
        
        .custom-signup-btn .inner {
          z-index: 2; gap: 6px; position: relative; width: 100%; color: #ffffff; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; line-height: 1.4; transition: all 0.2s ease-in-out; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .custom-signup-btn .inner svg.icon {
          width: 16px; height: 16px; transition: transform 0.3s ease; stroke: #ffffff; fill: none; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
        }
        .custom-signup-btn:hover svg.icon { transform: translateX(3px); }
        .custom-signup-btn:hover svg.icon path { animation: dash 0.8s linear forwards; }
        @keyframes dash {
          0% { stroke-dasharray: 0, 25; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 12, 12; stroke-dashoffset: -6; }
          100% { stroke-dasharray: 25, 0; stroke-dashoffset: -12; }
        }
      `}} />
    </motion.nav>
  );
}

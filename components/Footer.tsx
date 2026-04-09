import { Scale, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Nyay<span className="text-primary">AI</span></span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-foreground/60">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200">
              <Twitter className="w-4 h-4 text-foreground" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200">
              <Github className="w-4 h-4 text-foreground" />
            </a>
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-foreground/40">
          <p>Built for the Hackathon. Empowering users with legal clarity.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} NyayAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

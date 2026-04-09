'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, CheckCircle2, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !dashboardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(dashboardRef.current, 
        { 
          scale: 0.8,
          opacity: 0,
          rotateX: 10
        },
        {
          scale: 1,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="demo" ref={sectionRef} className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            See It In <span className="text-secondary">Action</span>
          </h2>
        </div>

        <div 
          ref={dashboardRef}
          className="w-full aspect-[16/10] md:aspect-[16/9] glass-card rounded-3xl border border-slate-200 p-4 md:p-8 flex flex-col shadow-2xl shadow-secondary/20"
          style={{ perspective: "1000px" }}
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <span className="text-xl">📄</span>
              </div>
              <div>
                <h3 className="font-semibold">Rental_Agreement_2024.pdf</h3>
                <p className="text-xs text-foreground/50">Analyzed in 2.4s</p>
              </div>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-red-50 text-red-500 text-sm font-medium flex items-center gap-2 border border-red-200">
              <ShieldAlert className="w-4 h-4" />
              2 High Risks Found
            </div>
          </div>

          {/* Dashboard Body */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Col - Document */}
            <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-200 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 pointer-events-none" />
              <div className="space-y-4 opacity-50 font-serif text-sm">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-red-100 rounded w-4/5 border border-red-200"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
              
              {/* Highlight Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-xl w-4/5 shadow-2xl">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-500 mb-1">Unfair Eviction Clause</h4>
                    <p className="text-sm text-foreground/80">The landlord claims the right to evict you with only 24 hours notice for any reason. This is illegal under standard tenancy laws.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col - Chat/Summary */}
            <div className="col-span-1 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  TL;DR Summary
                </h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• 12-month lease term</li>
                  <li>• $2,000/month rent</li>
                  <li>• Pets are NOT allowed</li>
                </ul>
              </div>

              <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-200 flex flex-col">
                <h4 className="font-medium mb-auto flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-accent" />
                  Ask NyayAI
                </h4>
                
                <div className="mt-4 space-y-3">
                  <div className="bg-slate-50 rounded-lg p-3 text-sm ml-4 border border-slate-200">
                    Can I break the lease early?
                  </div>
                  <div className="bg-accent/10 rounded-lg p-3 text-sm mr-4 border border-accent/20 text-accent">
                    Yes, but there is a penalty of 2 months' rent ($4,000) according to Clause 7.b.
                  </div>
                </div>
                
                <div className="mt-4 relative">
                  <input type="text" placeholder="Ask a question..." className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-accent" disabled />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

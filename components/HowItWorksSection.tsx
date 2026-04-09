'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, Cpu, FileText, HelpCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Upload Document",
    desc: "PDF, Word, or Image"
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "AI Analyzes",
    desc: "Scanning for clauses"
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Get Summary",
    desc: "Risks highlighted"
  },
  {
    icon: <HelpCircle className="w-6 h-6" />,
    title: "Ask Questions",
    desc: "Chat with document"
  }
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "center center",
          scrub: 1,
        }
      });

      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center" })
        .fromTo(stepsRef.current, { y: 20, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, stagger: 0.2 }, "<");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            How It Works
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-slate-200 hidden md:block rounded-full">
            <div ref={lineRef} className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                ref={(el) => { stepsRef.current[index] = el; }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center mb-6 relative group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 text-foreground">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent text-white font-bold flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-foreground/50 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

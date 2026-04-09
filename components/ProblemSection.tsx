'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileWarning, AlertTriangle, Scale } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    icon: <FileWarning className="w-8 h-8 text-primary" />,
    title: "Complex Language",
    description: "Legal jargon is designed to be precise, but it ends up being incomprehensible to the average person."
  },
  {
    icon: <AlertTriangle className="w-8 h-8 text-accent" />,
    title: "Hidden Risks",
    description: "Unfair clauses and hidden liabilities are often buried deep within pages of dense text."
  },
  {
    icon: <Scale className="w-8 h-8 text-secondary" />,
    title: "Lack of Knowledge",
    description: "Without a law degree, it's nearly impossible to know if a contract is standard or heavily skewed against you."
  }
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { 
          y: 100, 
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="problem" ref={sectionRef} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            The Legal System is <span className="text-foreground/50">Broken</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Signing a document shouldn't feel like a gamble. Yet, millions of people sign contracts every day without truly understanding what they are agreeing to.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:bg-white/80 transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50" />
              
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 border border-slate-200">
                {problem.icon}
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{problem.title}</h3>
              <p className="text-foreground/60 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

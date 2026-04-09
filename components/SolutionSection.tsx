'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function SolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !leftCardRef.current || !rightCardRef.current || !arrowRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "center center",
          scrub: 1,
        }
      });

      tl.fromTo(leftCardRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1 })
        .fromTo(arrowRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1 }, "-=0.2")
        .fromTo(rightCardRef.current, { x: 50, opacity: 0, filter: 'blur(10px)' }, { x: 0, opacity: 1, filter: 'blur(0px)' }, "-=0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="solution" ref={sectionRef} className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-[100%] blur-[100px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            From Legalese to <span className="text-gradient">Clarity</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Watch as our AI instantly translates complex legal clauses into plain, understandable language.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Before */}
          <div ref={leftCardRef} className="w-full lg:w-5/12 glass-card p-8 rounded-3xl relative">
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-200 text-xs font-semibold text-foreground/70">
              Original Contract
            </div>
            <div className="mt-8 font-serif text-foreground/50 text-sm leading-relaxed">
              "The Lessee shall indemnify, defend and hold harmless the Lessor from and against any and all claims, demands, liabilities, damages, losses, costs and expenses, including without limitation reasonable attorneys' fees, arising out of or in connection with the Lessee's use or occupancy of the Premises, except to the extent caused by the gross negligence or willful misconduct of the Lessor."
            </div>
          </div>

          {/* Arrow */}
          <div ref={arrowRef} className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(139,92,246,0.5)] z-10">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>

          {/* After */}
          <div ref={rightCardRef} className="w-full lg:w-5/12 glass-card p-8 rounded-3xl relative border-accent/30 bg-accent/5">
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent/20 text-xs font-semibold text-accent">
              NyayAI Explanation
            </div>
            <div className="mt-8 font-sans text-foreground text-lg leading-relaxed">
              If someone gets hurt or sues because of how you used the property, <span className="text-accent font-semibold">you have to pay for it</span> (including legal fees). 
              <br/><br/>
              <span className="text-foreground/70 text-sm">Exception: You don't pay if the landlord caused the problem on purpose or through extreme carelessness.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

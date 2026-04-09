'use client';

import { motion } from 'motion/react';

export default function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10 pointer-events-none" />
      
      {/* Animated background waves/glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 rounded-full blur-[100px] opacity-50 animate-pulse" style={{ animationDuration: '4s' }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-12 md:p-20 rounded-[3rem] border-slate-200 shadow-2xl shadow-primary/10"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Ready to Understand Your Documents?
          </h2>
          <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
            Join thousands of users who are taking control of their legal agreements with NyayAI.
          </p>
          
          <button className="px-10 py-5 rounded-full bg-foreground text-background font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(15,23,42,0.1)] hover:shadow-[0_0_60px_rgba(15,23,42,0.2)]">
            Start for Free
          </button>
          
          <p className="mt-6 text-sm text-foreground/50">
            No credit card required. Try it instantly.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

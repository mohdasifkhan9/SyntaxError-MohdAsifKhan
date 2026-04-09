'use client';

import { motion } from 'motion/react';
import { Sparkles, ShieldAlert, Mic, Languages, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    title: "AI Simplification",
    description: "Instantly translate complex legal jargon into plain, easy-to-understand language.",
    className: "md:col-span-2 md:row-span-2"
  },
  {
    icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
    title: "Risk Detection",
    description: "Automatically highlight hidden clauses and potential liabilities.",
    className: "md:col-span-1 md:row-span-1"
  },
  {
    icon: <Mic className="w-6 h-6 text-blue-400" />,
    title: "Voice Explanation",
    description: "Listen to the summary instead of reading.",
    className: "md:col-span-1 md:row-span-1"
  },
  {
    icon: <Languages className="w-6 h-6 text-green-400" />,
    title: "Hindi Support",
    description: "Full support for explaining documents in Hindi.",
    className: "md:col-span-1 md:row-span-1"
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-accent" />,
    title: "AI Chat",
    description: "Ask specific questions about your document.",
    className: "md:col-span-1 md:row-span-1"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Powerful Features for <span className="text-gradient">Everyone</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 0.98, rotateX: 2, rotateY: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`glass-card p-8 rounded-3xl relative overflow-hidden group ${feature.className}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
                  {feature.icon}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

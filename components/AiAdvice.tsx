'use client';

import { motion } from 'motion/react';
import { Lightbulb } from 'lucide-react';

interface AiAdviceProps {
  advice: string;
}

export default function AiAdvice({ advice }: AiAdviceProps) {
  if (!advice) return null;

  // Split advice into bullet points (handle newlines, numbered lists, or dash lists)
  const points = advice
    .split(/\n/)
    .map(line => line.replace(/^[\d]+[.)]\s*/, '').replace(/^[-•*]\s*/, '').trim())
    .filter(line => line.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-white">AI Advice</h3>
      </div>
      <ul className="space-y-3">
        {points.map((point, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
            className="flex items-start gap-3"
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
            <span className="text-white/70 leading-relaxed text-sm">{point}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

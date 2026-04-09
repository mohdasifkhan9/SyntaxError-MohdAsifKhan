'use client';

import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

interface SafetyScoreProps {
  clauses: { risk: 'Low' | 'Medium' | 'High' }[];
}

function calculateSafetyScore(clauses: { risk: 'Low' | 'Medium' | 'High' }[]): {
  score: number;
  label: string;
  color: string;
  gradient: string;
  border: string;
  bg: string;
} {
  let score = 100;
  for (const clause of clauses) {
    switch (clause.risk) {
      case 'High': score -= 20; break;
      case 'Medium': score -= 10; break;
      case 'Low': score -= 5; break;
    }
  }
  score = Math.max(0, Math.min(100, score));

  if (score >= 70) {
    return { score, label: 'Safe', color: 'text-emerald-400', gradient: 'from-emerald-500 to-green-500', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' };
  } else if (score >= 40) {
    return { score, label: 'Moderate', color: 'text-amber-400', gradient: 'from-amber-500 to-orange-500', border: 'border-amber-500/20', bg: 'bg-amber-500/10' };
  } else {
    return { score, label: 'Risky', color: 'text-red-400', gradient: 'from-red-500 to-rose-600', border: 'border-red-500/20', bg: 'bg-red-500/10' };
  }
}

export default function SafetyScore({ clauses }: SafetyScoreProps) {
  const { score, label, color, gradient, border, bg } = calculateSafetyScore(clauses);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-2xl border ${border} ${bg} backdrop-blur-xl relative overflow-hidden`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">Safety Score</h3>
          <p className={`text-sm font-semibold ${color}`}>{label}</p>
        </div>
        <div className="text-right">
          <span className={`text-3xl font-bold ${color}`}>{score}</span>
          <span className="text-white/40 text-sm">/100</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${gradient} rounded-full`}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] font-medium text-white/30 px-0.5">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </motion.div>
  );
}

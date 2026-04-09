'use client';

import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface RiskMeterProps {
  score: 'Low' | 'Medium' | 'High';
}

export default function RiskMeter({ score }: RiskMeterProps) {
  const getRiskConfig = () => {
    switch (score) {
      case 'Low':
        return {
          color: 'from-emerald-500 to-green-500',
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          percent: 25,
          icon: CheckCircle,
          description: 'Document looks safe. No major red flags detected.',
        };
      case 'Medium':
        return {
          color: 'from-amber-500 to-orange-500',
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          percent: 50,
          icon: Info,
          description: 'Some attention required. Review the highlighted clauses.',
        };
      case 'High':
      default:
        return {
          color: 'from-red-500 to-rose-600',
          text: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          percent: 85,
          icon: AlertTriangle,
          description: 'High risk detected. Proceed with caution and review carefully.',
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <div className={`p-6 rounded-2xl border ${config.border} ${config.bg} backdrop-blur-xl relative overflow-hidden`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Risk Analysis</h3>
          <p className="text-white/60 text-sm">{config.description}</p>
        </div>
      </div>

      <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden mt-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${config.percent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${config.color}`}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs font-medium text-white/40 px-1">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
}

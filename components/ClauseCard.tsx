'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ShieldAlert, Sparkles } from 'lucide-react';

interface ClauseCardProps {
  original: string;
  simplified: string;
  risk: 'Low' | 'Medium' | 'High';
}

export default function ClauseCard({ original, simplified, risk }: ClauseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskColor = () => {
    switch (risk) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#1e293b]/50 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-white/20">
      <div 
        className="p-5 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center shrink-0 border border-white/5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-base mb-1">{simplified}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getRiskColor()}`}>
             {risk === 'High' && <ShieldAlert className="w-3 h-3" />}
             {risk} Risk
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 text-white/30">
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/20"
          >
            <div className="p-5 border-t border-white/5">
              <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Original Legal Text</p>
              <p className="text-sm text-white/70 italic relative pl-4 border-l-2 border-white/10">
                "{original}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

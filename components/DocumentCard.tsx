'use client';

import Link from 'next/link';
import { FileText, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

interface DocumentCardProps {
  id: string;
  name: string;
  date: string;
  risk: string;
}

export default function DocumentCard({ id, name, date, risk }: DocumentCardProps) {
  const getRiskColor = () => {
    switch (risk) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  return (
    <Link 
      href={`/dashboard/document/${id}`}
      className="group block rounded-2xl border border-white/10 bg-[#0F172A]/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-purple-500/30 hover:bg-white/5 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(124,58,237,0.3)]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/5 flex items-center justify-center">
          <FileText className="w-6 h-6 text-purple-400" />
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getRiskColor()}`}>
          {risk === 'High' && <ShieldAlert className="w-3 h-3" />}
          {risk} Risk
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all">
        {name}
      </h3>
      
      <div className="flex items-center justify-between text-sm text-white/50 border-t border-white/5 mt-4 pt-4">
        <div className="flex items-center gap-2">
           <Clock className="w-4 h-4" />
           {new Date(date).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1 text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
          View Report
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

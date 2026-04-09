'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, MessageSquare, Clock, Star, Brain } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import UploadModal from '@/components/UploadModal';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface DashboardContentProps {
  user: User;
  profile: Profile | null;
}

export default function DashboardContent({ user, profile }: DashboardContentProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/50 text-lg">Welcome back, <span className="text-white/80">{profile?.full_name || user.email}</span></p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10"
      >
        {[
          { icon: FileText, label: 'Analyzed Docs', value: '1', color: 'from-purple-500 to-pink-500' },
          { icon: MessageSquare, label: 'AI Summaries', value: '1', color: 'from-cyan-500 to-blue-500' },
          { icon: Clock, label: 'Hours Saved', value: '4.5', color: 'from-amber-500 to-orange-500' },
          { icon: Brain, label: 'High Risk Found', value: '0', color: 'from-red-500 to-orange-500' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            style={{
              background: "linear-gradient(180deg, rgba(30, 27, 75, 0.3), rgba(15, 23, 42, 0.5)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)) border-box",
            }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-white/40 text-sm">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Upload Document Card */}
        <div className="relative backdrop-blur-xl rounded-2xl border border-white/10 p-8 flex flex-col items-start"
          style={{
            background: "linear-gradient(180deg, rgba(124, 58, 237, 0.1), rgba(15, 23, 42, 0.5)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)) border-box",
          }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Upload Legal Document</h3>
          <p className="text-white/50 mb-8">Upload any legal document and get an instant AI-powered summary, risk review, and simplified clauses.</p>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 mt-auto"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
              boxShadow: "0 4px 20px rgba(124, 58, 237, 0.3)",
            }}
          >
            Upload Document
          </button>
        </div>

        {/* Recent Activity Card */}
        <div className="relative backdrop-blur-xl rounded-2xl border border-white/10 p-8"
          style={{
            background: "linear-gradient(180deg, rgba(30, 27, 75, 0.3), rgba(15, 23, 42, 0.5)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)) border-box",
          }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-6">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Recent Activity</h3>
          <p className="text-white/50 mb-6">View your previously analyzed documents.</p>
          <div className="flex flex-col gap-3">
             <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between pointer-events-none opacity-50">
                <span className="text-white">Non-Disclosure Agreement.pdf</span>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-md">Low Risk</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
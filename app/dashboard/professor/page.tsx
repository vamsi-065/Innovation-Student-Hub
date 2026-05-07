"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  BookOpen, Star, Clock, CheckCircle, XCircle,
  TrendingUp, Users, Lightbulb, Eye, Flame,
  CheckCircle2, AlertCircle, ChevronRight, Trophy
} from "lucide-react";
import { formatRelativeTime, truncate } from "@/lib/utils";

export default function ProfessorDashboard() {
  const { token, user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpenIdeas() {
      try {
        const res = await fetch("/api/ideas?status=OPEN&limit=20");
        const data = await res.json();
        setIdeas(data.ideas || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchOpenIdeas();
  }, []);

  const stats = [
    { label: "Pending Review", value: ideas.length, icon: Clock, color: "#38bdf8" },
    { label: "Total Reviewed", value: user?._count?.reviews ?? 0, icon: CheckCircle2, color: "#10b981" },
    { label: "Avg. Score", value: "4.8", icon: Star, color: "#f59e0b" },
    { label: "Students Guided", value: "12", icon: Users, color: "#818cf8" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--hub-text)] mb-2 tracking-tight">
            Professor <span className="text-emerald-400">Panel</span>
          </h1>
          <p className="text-[var(--hub-text-muted)] text-sm max-w-md">
            Guide the next generation of innovators by reviewing projects and providing expert feedback.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border-emerald-500/20 bg-emerald-500/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)]">
                <s.icon size={18} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-3xl font-bold text-[var(--hub-text)] mb-1">{s.value}</div>
            <div className="text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Review List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-[var(--hub-text)] flex items-center gap-3">
                <AlertCircle size={20} className="text-sky-400" />
                Awaiting Feedback
              </h2>
              <button className="text-xs text-sky-400 font-bold hover:underline">View All</button>
           </div>

           {loading ? (
             <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="glass-card p-6 space-y-3">
                    <div className="skeleton h-6 w-2/3" />
                    <div className="skeleton h-4 w-full" />
                  </div>
                ))}
             </div>
           ) : ideas.length === 0 ? (
             <div className="glass-card p-20 text-center flex flex-col items-center border-dashed">
                <BookOpen size={40} className="text-[var(--hub-text-subtle)] mb-4" />
                <p className="text-[var(--hub-text-muted)] text-sm">No new ideas are currently awaiting review.</p>
             </div>
           ) : (
             <div className="space-y-4">
                 {ideas.map((idea: any) => (
                  <Link key={idea.id} href={`/dashboard/professor/review/${idea.id}`}>
                    <div className="glass-card hover:bg-[var(--hub-surface-2)] group transition-all p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                             <span className="badge-status border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/5">
                               {idea.domain || "General"}
                             </span>
                             <span className="text-[10px] text-[var(--hub-text-muted)]">• {formatRelativeTime(idea.createdAt)}</span>
                           </div>
                           <h3 className="text-lg font-bold text-[var(--hub-text)] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                             {idea.title}
                           </h3>
                           <p className="text-sm text-[var(--hub-text-muted)] line-clamp-2">
                             {idea.description}
                           </p>
                           <div className="flex items-center gap-4 pt-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[var(--hub-surface-2)] border border-[var(--hub-border)] overflow-hidden">
                                  {idea.author.avatar && <img src={idea.author.avatar} />}
                                </div>
                                <span className="text-xs text-[var(--hub-text-muted)]">{idea.author.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-[var(--hub-text-subtle)]">
                                <Flame size={12} className="text-orange-500" />
                                {idea._count.likes} interest
                              </div>
                           </div>
                        </div>
                        <div className="p-2 rounded-full bg-[var(--hub-surface-2)] group-hover:bg-sky-500 group-hover:text-white transition-all text-[var(--hub-text-muted)]">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
             </div>
           )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-[var(--hub-text)] mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                 {[1, 2].map(i => (
                   <div key={i} className="flex gap-3">
                      <div className="w-2 h-10 rounded bg-emerald-500/20 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[var(--hub-text)]">Solar Smart Grid</p>
                        <p className="text-[10px] text-[var(--hub-text-muted)]">Approved • Score: 9.5</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
              <h3 className="text-sm font-bold text-[var(--hub-text)] mb-2 flex items-center gap-2">
                <Trophy size={16} className="text-indigo-500" />
                Featured Projects
              </h3>
              <p className="text-[10px] text-[var(--hub-text-muted)] mb-4">You have highlighted 3 projects this semester.</p>
              <button className="w-full btn-primary text-xs bg-indigo-600 text-white shadow-indigo-500/20">Manage Featured</button>
           </div>
        </div>
      </div>
    </div>
  );
}

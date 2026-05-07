"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import IdeaCard from "@/components/IdeaCard";
import { 
  TrendingUp, Users, BookOpen, Search, 
  Filter, Sparkles, Zap, Flame, Star, Trophy,
  ChevronRight, ArrowRight, X
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discovery");

  useEffect(() => {
    fetchIdeas();
  }, [query, activeTab]);

  async function fetchIdeas() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: query,
        tab: activeTab,
      });
      const res = await fetch(`/api/ideas?${params}`);
      const data = await res.json();
      setIdeas(data.ideas || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main Feed Column */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Feed Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--hub-text)] tracking-tight">Idea <span className="text-sky-400">Discovery</span></h1>
              <p className="text-xs text-[var(--hub-text-muted)] mt-1">Explore what's happening in the innovation hub.</p>
            </div>
            
            <div className="flex items-center gap-1 bg-[var(--hub-surface)] p-1 rounded-2xl border border-[var(--hub-border)]">
              {[
                { id: "discovery", label: "Discovery", icon: Sparkles },
                { id: "trending", label: "Trending", icon: Flame },
                { id: "following", label: "Following", icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${
                    activeTab === tab.id 
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" 
                    : "text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] hover:bg-[var(--hub-surface-2)]"
                  }`}
                >
                  <tab.icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {query && (
            <div className="flex items-center gap-2 px-4 py-2 bg-sky-500/5 border border-sky-500/10 rounded-xl w-fit">
              <Search size={14} className="text-sky-400" />
              <span className="text-xs text-[var(--hub-text-muted)]">Results for <span className="text-[var(--hub-text)] font-bold">"{query}"</span></span>
              <button 
                onClick={() => window.location.href = "/dashboard/student"}
                className="ml-2 text-sky-400 hover:text-sky-300"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Feed Content */}
          <div className="space-y-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-6 space-y-5">
                  <div className="flex gap-4">
                    <div className="skeleton w-12 h-12 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <div className="skeleton h-4 w-32" />
                      <div className="skeleton h-3 w-20" />
                    </div>
                  </div>
                  <div className="skeleton h-6 w-3/4 rounded-lg" />
                  <div className="skeleton h-32 w-full rounded-2xl" />
                  <div className="flex gap-4">
                    <div className="skeleton h-8 w-20 rounded-xl" />
                    <div className="skeleton h-8 w-20 rounded-xl" />
                  </div>
                </div>
              ))
            ) : ideas.length === 0 ? (
              <div className="glass-card p-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center mb-6">
                  <Search size={32} className="text-[var(--hub-text-subtle)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--hub-text)] mb-2">No matching ideas</h3>
                <p className="text-[var(--hub-text-muted)] text-sm max-w-sm leading-relaxed">
                  We couldn't find any ideas matching your criteria. Try different keywords or browse our trending topics.
                </p>
                <button 
                  onClick={() => window.location.href = "/dashboard/student"}
                  className="mt-8 btn-primary px-8"
                >
                  Reset Feed
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {ideas.map((idea: any) => (
                  <IdeaCard 
                    key={idea.id} 
                    idea={idea} 
                    onUpdate={fetchIdeas}
                  />
                ))}
              </AnimatePresence>
            )}
            
            {!loading && ideas.length > 0 && (
              <div className="text-center py-10">
                <p className="text-xs text-[var(--hub-text-subtle)] font-bold uppercase tracking-widest">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="hidden xl:block w-[340px] space-y-6">
          {/* User Status Panel */}
          <div className="glass-card p-6 bg-gradient-to-br from-[var(--hub-primary)]/5 to-transparent">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center text-xl font-bold text-sky-400 overflow-hidden shrink-0">
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-[var(--hub-text)] truncate">{user?.name}</p>
                  <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mt-0.5">{user?.role}</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[var(--hub-surface-2)] rounded-2xl p-4 border border-[var(--hub-border)] hover:border-[var(--hub-border-hover)] transition-colors group">
                  <p className="text-2xl font-bold text-[var(--hub-text)] group-hover:text-sky-400 transition-colors">{user?._count?.ideas || 0}</p>
                  <p className="text-[10px] text-[var(--hub-text-muted)] font-bold uppercase tracking-tighter">My Ideas</p>
                </div>
                <div className="bg-[var(--hub-surface-2)] rounded-2xl p-4 border border-[var(--hub-border)] hover:border-[var(--hub-border-hover)] transition-colors group">
                  <p className="text-2xl font-bold text-[var(--hub-text)] group-hover:text-emerald-400 transition-colors">{user?._count?.teamMembers || 0}</p>
                  <p className="text-[10px] text-[var(--hub-text-muted)] font-bold uppercase tracking-tighter">Teams</p>
                </div>
             </div>
             <Link href="/dashboard/profile">
               <button className="w-full btn-ghost py-2.5 text-xs font-bold uppercase tracking-widest">View Profile</button>
             </Link>
          </div>

          {/* Trending Topics */}
          <div className="glass-card p-6">
            <h3 className="text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={12} className="text-sky-400" />
              Popular Domains
            </h3>
            <div className="space-y-5">
              {[
                { name: "AI/ML", count: 142, icon: Zap },
                { name: "Sustainability", count: 89, icon: Sparkles },
                { name: "HealthTech", count: 64, icon: Star },
                { name: "FinTech", count: 42, icon: Trophy },
              ].map((topic, i) => (
                <div key={topic.name} className="group cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center text-[var(--hub-text-muted)] group-hover:bg-sky-500/10 group-hover:text-sky-400 transition-all">
                      <topic.icon size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--hub-text)] group-hover:text-sky-400 transition-colors truncate">#{topic.name}</p>
                      <p className="text-[10px] text-[var(--hub-text-muted)]">{topic.count} ideas</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[var(--hub-text-subtle)] group-hover:text-sky-400 transition-all -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
            <button className="w-full mt-8 text-[10px] font-bold text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-colors uppercase tracking-widest border-t border-[var(--hub-border)] pt-4">Explore all topics</button>
          </div>

          {/* Featured Members */}
          <div className="glass-card p-6">
            <h3 className="text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Users size={12} className="text-emerald-400" />
              Innovators to Follow
            </h3>
            <div className="space-y-5">
               {[
                 { name: "Sarah Chen", dept: "Robotics", online: true },
                 { name: "James Wilson", dept: "BioTech", online: false },
                 { name: "Alex Rivera", dept: "Software", online: true },
               ].map((m, i) => (
                 <div key={m.name} className="flex items-center gap-3 group">
                   <div className="relative">
                     <div className="w-9 h-9 rounded-xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center text-xs font-bold text-sky-400 group-hover:scale-110 transition-transform">
                        {m.name.charAt(0)}
                     </div>
                     {m.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[var(--hub-surface)]" />}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-[var(--hub-text)] truncate">{m.name}</p>
                     <p className="text-[10px] text-[var(--hub-text-muted)] truncate">{m.dept}</p>
                   </div>
                   <button className="text-[10px] font-bold text-sky-400 hover:text-sky-300 transition-colors bg-sky-500/5 hover:bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/10">Follow</button>
                 </div>
               ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-2 pt-4">
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
               {["About", "Guidelines", "Privacy", "Terms"].map(link => (
                 <button key={link} className="text-[10px] text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-colors font-medium">{link}</button>
               ))}
             </div>
             <p className="text-[10px] text-[var(--hub-text-subtle)] font-bold tracking-widest uppercase">IdeaForge © 2026</p>
          </div>
        </aside>
      </div>
    </div>
  );
}



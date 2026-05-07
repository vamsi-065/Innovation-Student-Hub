"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Heart, MessageCircle, Share2, 
  Bookmark, Users, Target, Calendar, 
  User, Send, Sparkles, Shield, Trophy,
  Eye, Clock, Tag, ChevronRight, MoreVertical
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

export default function IdeaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchIdea();
  }, [id]);

  async function fetchIdea() {
    try {
      const res = await fetch(`/api/ideas/${id}`);
      const data = await res.json();
      setIdea(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto py-20 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-3xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center animate-spin mb-6">
        <Sparkles className="text-sky-500" size={32} />
      </div>
      <p className="text-[var(--hub-text-muted)] font-bold uppercase tracking-widest text-xs">Loading vision...</p>
    </div>
  );

  if (!idea) return (
    <div className="max-w-4xl mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold text-[var(--hub-text)] mb-4">Idea not found</h1>
      <button onClick={() => router.back()} className="btn-primary px-8">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-all mb-8 group bg-[var(--hub-surface-2)] border border-[var(--hub-border)] px-4 py-2 rounded-xl w-fit"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Feed</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-8 min-w-0">
          {/* Header Card */}
          <div className="glass-card p-8 bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-lg bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest border border-sky-500/20">
                {idea.domain || "Innovation"}
              </span>
              <span className="text-[10px] text-[var(--hub-text-muted)] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={12} />
                {formatRelativeTime(idea.createdAt)}
              </span>
              <span className="text-[10px] text-[var(--hub-text-muted)] font-bold uppercase tracking-widest flex items-center gap-1.5 ml-auto">
                <Eye size={12} className="text-sky-400" />
                {idea.views || 0} Views
              </span>
            </div>
            
            <h1 className="text-4xl font-extrabold text-[var(--hub-text)] tracking-tight leading-tight mb-6">
              {idea.title}
            </h1>

            <div className="flex items-center justify-between py-6 border-y border-[var(--hub-border)]">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] overflow-hidden shrink-0 flex items-center justify-center text-sky-400 font-bold">
                    {idea.author?.avatar ? <img src={idea.author.avatar} className="w-full h-full object-cover" /> : idea.author?.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-bold text-[var(--hub-text)] truncate">{idea.author?.name}</p>
                    <p className="text-[10px] text-[var(--hub-text-muted)] font-bold uppercase tracking-widest mt-0.5">{idea.author?.role}</p>
                  </div>
               </div>
               <button className="btn-ghost px-6 py-2 text-xs font-bold uppercase tracking-widest">Follow</button>
            </div>

            <div className="mt-8 space-y-6">
               <h3 className="text-xs font-bold text-[var(--hub-text-muted)] uppercase tracking-widest flex items-center gap-2">
                 <Target size={14} className="text-sky-400" /> Executive Summary
               </h3>
               <p className="text-base text-[var(--hub-text)] opacity-90 leading-relaxed whitespace-pre-wrap">
                 {idea.description}
               </p>
               
               <div className="flex flex-wrap gap-2 pt-6">
                 {idea.tags?.map((tag: string) => (
                   <span key={tag} className="px-3 py-1.5 rounded-xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] text-[var(--hub-text-muted)] text-xs font-medium hover:text-sky-400 hover:border-sky-500/30 transition-all cursor-pointer">
                     #{tag}
                   </span>
                 ))}
               </div>
            </div>
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center gap-2 px-2">
             <button className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[var(--hub-surface)] border border-[var(--hub-border)] text-[var(--hub-text-muted)] hover:text-red-400 hover:bg-red-400/5 hover:border-red-500/20 transition-all">
                <Heart size={20} />
                <span className="text-sm font-bold">{idea._count?.likes || 0}</span>
             </button>
             <button className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[var(--hub-surface)] border border-[var(--hub-border)] text-[var(--hub-text-muted)] hover:text-sky-400 hover:bg-sky-400/5 hover:border-sky-500/20 transition-all">
                <MessageCircle size={20} />
                <span className="text-sm font-bold">{idea._count?.reviews || 0}</span>
             </button>
             <button className="p-3 rounded-2xl bg-[var(--hub-surface)] border border-[var(--hub-border)] text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-all">
                <Share2 size={20} />
             </button>
             <div className="flex-1" />
             <button className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[var(--hub-surface)] border border-[var(--hub-border)] text-[var(--hub-text-muted)] hover:text-amber-400 hover:bg-amber-400/5 hover:border-amber-500/20 transition-all">
                <Bookmark size={20} />
                <span className="text-sm font-bold">Save</span>
             </button>
          </div>

          {/* Discussion */}
          <div className="glass-card p-8 space-y-8">
             <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold text-[var(--hub-text)] tracking-tight">Discussion</h3>
               <span className="text-xs text-[var(--hub-text-muted)] font-bold uppercase tracking-widest">{idea._count?.reviews || 0} Comments</span>
             </div>
             
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] shrink-0 flex items-center justify-center text-xs font-bold text-sky-400">
                  {user?.name?.charAt(0)}
                </div>
                <div className="flex-1 relative group">
                   <textarea 
                    placeholder="Contribute to this vision..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-glass w-full py-4 min-h-[120px] resize-none text-sm transition-all focus:ring-4 focus:ring-sky-500/10"
                   />
                   <div className="absolute bottom-3 right-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
                     <button className="btn-primary py-2 px-6 text-xs font-bold uppercase tracking-widest shadow-lg shadow-sky-500/20">
                       Post Comment
                     </button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
           {/* Team Panel */}
           <div className="glass-card p-6 border-sky-500/20 bg-gradient-to-br from-sky-500/[0.03] to-transparent">
              <h3 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Users size={14} /> Collaboration Status
              </h3>
              <div className="space-y-4 mb-8">
                 <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-[var(--hub-text-muted)]">Project Team</span>
                    <span className="text-[var(--hub-text)]">{idea.team_size || 0} / 5 Members</span>
                 </div>
                 <div className="w-full h-2 bg-[var(--hub-surface-2)] rounded-full overflow-hidden border border-[var(--hub-border)]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "40%" }}
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 shadow-lg shadow-sky-500/50" 
                    />
                 </div>
              </div>
              
              <div className="space-y-4 mb-8">
               <div className="space-y-4 mb-8">
                <p className="text-[10px] text-[var(--hub-text-muted)] font-bold uppercase tracking-widest">Looking for:</p>
                <div className="flex flex-wrap gap-2">
                  {["React Developer", "UI/UX Designer", "Product Manager"].map(role => (
                    <span key={role} className="px-2.5 py-1 rounded-lg bg-[var(--hub-surface-2)] border border-[var(--hub-border)] text-[10px] font-bold text-[var(--hub-text-muted)]">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full btn-primary py-4 text-xs font-bold uppercase tracking-widest shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98]">Request to Join Team</button>
           </div>
          </div>

           {/* Metrics */}
           <div className="glass-card p-6">
              <h3 className="text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest mb-6 flex items-center gap-2">
                <Trophy size={14} className="text-amber-400" /> Innovation Score
              </h3>
              <div className="flex items-end gap-2 mb-2">
                 <p className="text-4xl font-extrabold text-[var(--hub-text)] tracking-tighter">98<span className="text-sky-500 text-xl">.2</span></p>
                 <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                   <Sparkles size={10} /> Unique
                 </p>
              </div>
              <p className="text-[10px] text-[var(--hub-text-muted)] leading-relaxed">This project ranks in the top <span className="text-[var(--hub-text)] font-bold">2%</span> of novel innovations in its domain.</p>
           </div>

           {/* Faculty Review */}
           <div className="glass-card p-6 border-[var(--hub-border)] bg-[var(--hub-surface-2)]/30">
              <h3 className="text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest mb-6 flex items-center gap-2">
                <Shield size={14} className="text-indigo-400" /> Faculty Review
              </h3>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                 <div className="w-12 h-12 rounded-2xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center mb-4 text-[var(--hub-text-subtle)]">
                    <Shield size={24} />
                 </div>
                 <p className="text-xs text-[var(--hub-text-muted)] mb-6 px-4 italic leading-relaxed">This project is currently awaiting validation from a faculty mentor.</p>
                 <button className="w-full btn-ghost py-2.5 text-[10px] uppercase font-bold tracking-widest hover:text-sky-400 hover:border-sky-500/20">Invite Mentor</button>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}

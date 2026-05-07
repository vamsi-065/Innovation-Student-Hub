"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Lightbulb, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import Link from "next/link";
import IdeaCard from "@/components/IdeaCard";
import { useAuth } from "@/context/AuthContext";

export default function MyIdeasPage() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyIdeas();
  }, []);

  async function fetchMyIdeas() {
    try {
      const res = await fetch("/api/ideas?authorId=" + user?.id);
      const data = await res.json();
      // Filter locally just in case the API doesn't support authorId filter yet
      const myIdeas = data.ideas?.filter((i: any) => i.author_id === user?.id || i.author?.id === user?.id) || [];
      setIdeas(myIdeas);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--hub-text)] mb-2">My Innovations</h1>
          <p className="text-[var(--hub-text-muted)] text-sm">Manage and track the progress of your shared ideas.</p>
        </div>
        <Link href="/dashboard/student/ideas/new">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Idea
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Ideas", value: ideas.length, icon: Lightbulb, color: "text-amber-400" },
          { label: "Total Views", value: ideas.reduce((acc: number, i: any) => acc + (i.views || 0), 0), icon: TrendingUp, color: "text-sky-400" },
          { label: "Pending Reviews", value: 2, icon: Calendar, color: "text-purple-400" },
          { label: "Collaborators", value: 5, icon: ArrowUpRight, color: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className={`p-2 w-10 h-10 rounded-xl bg-[var(--hub-surface-2)] ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-[var(--hub-text)] mb-1">{stat.value}</div>
            <div className="text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--hub-border)] pb-4">
          <h3 className="text-sm font-bold text-[var(--hub-text)] uppercase tracking-widest">Active Projects</h3>
          <SearchInput 
            placeholder="Filter my ideas..." 
            containerClassName="w-64"
            className="text-xs"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => <div key={i} className="skeleton h-64 w-full rounded-2xl" />)}
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((idea: any) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card">
            <div className="w-16 h-16 rounded-3xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center mx-auto mb-6 text-[var(--hub-text-subtle)]">
              <Lightbulb size={32} />
            </div>
            <h3 className="text-lg font-bold text-[var(--hub-text)] mb-2">No ideas yet</h3>
            <p className="text-[var(--hub-text-muted)] text-sm mb-8">Launch your first innovative idea to start building your portfolio.</p>
            <Link href="/dashboard/student/ideas/new">
              <button className="btn-primary">Post Your First Idea</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

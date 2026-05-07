"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import IdeaCard from "@/components/IdeaCard";
import { Bookmark, Search, Zap } from "lucide-react";

export default function SavedIdeasPage() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedIdeas();
  }, []);

  async function fetchSavedIdeas() {
    setLoading(true);
    try {
      // For now, we'll fetch all ideas and filter on frontend or use a specific endpoint
      // In a real app, this would be /api/ideas?saved=true
      const res = await fetch(`/api/ideas`);
      const data = await res.json();
      // Simulating "saved" filter since we haven't implemented the bookmark API yet
      setIdeas(data.ideas || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
          <Bookmark size={24} className="text-sky-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--hub-text)]">Saved Ideas</h1>
          <p className="text-[var(--hub-text-muted)] text-sm">Ideas you've bookmarked for later</p>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="feed-card p-6 space-y-4">
              <div className="skeleton h-6 w-3/4" />
              <div className="skeleton h-20 w-full" />
            </div>
          ))
        ) : ideas.length === 0 ? (
          <div className="glass-card p-20 text-center flex flex-col items-center">
            <Bookmark size={40} className="text-[var(--hub-text-subtle)] mb-4" />
            <h3 className="text-xl font-bold text-[var(--hub-text)] mb-2">No saved ideas</h3>
            <p className="text-[var(--hub-text-muted)] text-sm">You haven't bookmarked any ideas yet.</p>
          </div>
        ) : (
          <AnimatePresence>
            {ideas.map((idea: any) => (
              <IdeaCard key={idea.id} idea={idea} onUpdate={fetchSavedIdeas} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

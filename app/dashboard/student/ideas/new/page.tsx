"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
  Rocket, Lightbulb, Users, Target, 
  Tag, Image as ImageIcon, Send, ArrowLeft,
  Sparkles, Zap
} from "lucide-react";

export default function NewIdeaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "AI/ML",
    tags: "",
    team_size: 1,
    looking_for: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
          looking_for: formData.looking_for.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      
      if (res.ok) {
        router.push("/dashboard/student");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Feed
      </button>

      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
          <Rocket size={24} className="text-sky-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--hub-text)]">Post New Idea</h1>
          <p className="text-[var(--hub-text-muted)] text-sm">Share your vision with the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--hub-text-subtle)] uppercase tracking-widest flex items-center gap-2">
              <Lightbulb size={14} /> Title
            </label>
            <input 
              required
              type="text"
              placeholder="Give your idea a catchy name..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input-glass text-lg font-bold py-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--hub-text-subtle)] uppercase tracking-widest flex items-center gap-2">
               Description
            </label>
            <textarea 
              required
              rows={6}
              placeholder="Describe what problem you're solving and how..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input-glass py-4 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--hub-text-subtle)] uppercase tracking-widest flex items-center gap-2">
                <Target size={14} /> Domain
              </label>
              <select 
                value={formData.domain}
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
                className="input-glass"
              >
                {["AI/ML", "Web3", "HealthTech", "EdTech", "FinTech", "Sustainability", "Other"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--hub-text-subtle)] uppercase tracking-widest flex items-center gap-2">
                <Tag size={14} /> Tags
              </label>
              <input 
                type="text"
                placeholder="ai, startup, social (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="input-glass"
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-8 space-y-6">
           <h3 className="text-sm font-bold text-[var(--hub-text)] flex items-center gap-2">
             <Users size={16} className="text-emerald-400" />
             Team Recruitment
           </h3>
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--hub-text-subtle)] uppercase tracking-widest">Team Size</label>
                <input 
                  type="number"
                  min={1}
                  max={10}
                  value={formData.team_size}
                  onChange={(e) => setFormData({...formData, team_size: parseInt(e.target.value)})}
                  className="input-glass"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--hub-text-subtle)] uppercase tracking-widest">Looking For</label>
                <input 
                  type="text"
                  placeholder="Designer, Backend, etc."
                  value={formData.looking_for}
                  onChange={(e) => setFormData({...formData, looking_for: e.target.value})}
                  className="input-glass"
                />
              </div>
           </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary flex items-center gap-2 bg-sky-500 shadow-sky-500/20 py-3 px-8"
          >
            {loading ? "Posting..." : (
              <>
                Post Idea <Send size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Lightbulb, TrendingUp, Users, BookOpen, Plus,
  Heart, Eye, MessageCircle, Search, Filter, Zap,
} from "lucide-react";
import { formatRelativeTime, STATUS_COLORS, truncate } from "@/lib/utils";

interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  domain?: string;
  stage?: string;
  views: number;
  createdAt: string;
  author: { id: string; name: string; avatar?: string; role: string };
  _count: { likes: number; reviews: number };
  team?: { _count: { members: number } };
}

const DOMAINS = ["AI/ML", "Web3", "HealthTech", "EdTech", "FinTech", "CleanTech", "SaaS", "Mobile"];
const STATUSES = ["OPEN", "IN_PROGRESS", "COMPLETED", "DRAFT"];

export default function StudentDashboard() {
  const { user, token } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchIdeas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterDomain, filterStatus, page]);

  async function fetchIdeas() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        ...(search && { search }),
        ...(filterDomain && { domain: filterDomain }),
        ...(filterStatus && { status: filterStatus }),
      });
      const res = await fetch(`/api/ideas?${params}`);
      const data = await res.json();
      setIdeas(data.ideas || []);
      setTotal(data.pagination?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(ideaId: string, e: React.MouseEvent) {
    e.preventDefault();
    if (!token) return;
    await fetch(`/api/ideas/${ideaId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchIdeas();
  }

  const stats = [
    { label: "Ideas Posted", value: user?._count?.ideas ?? 0, icon: Lightbulb, color: "#7c3aed" },
    { label: "Teams Joined", value: user?._count?.teamMembers ?? 0, icon: Users, color: "#06b6d4" },
    { label: "Reviews Received", value: user?._count?.reviews ?? 0, icon: BookOpen, color: "#10b981" },
    { label: "Total Ideas", value: total, icon: TrendingUp, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Good day, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-zinc-400 text-sm">Discover ideas, build teams, ship projects.</p>
        </div>
        <Link href="/dashboard/student/ideas/new">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn-primary flex items-center gap-2 text-sm"
            id="post-idea-btn"
          >
            <Plus size={16} />
            Post Idea
          </motion.button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
                >
                  <Icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass pl-9 text-sm"
            id="idea-search"
          />
        </div>

        <select
          value={filterDomain}
          onChange={(e) => setFilterDomain(e.target.value)}
          className="input-glass w-40 text-sm"
          id="domain-filter"
        >
          <option value="">All Domains</option>
          {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-glass w-40 text-sm"
          id="status-filter"
        >
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <button
          onClick={fetchIdeas}
          className="btn-ghost flex items-center gap-2 text-sm py-2 px-4"
        >
          <Filter size={14} />
          Filter
        </button>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="content-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Zap size={40} className="text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">No ideas found</h3>
          <p className="text-zinc-600 text-sm mb-6">Be the first to post an idea!</p>
          <Link href="/dashboard/student/ideas/new">
            <button className="btn-primary text-sm">Post Your Idea</button>
          </Link>
        </div>
      ) : (
        <div className="content-grid">
          {ideas.map((idea, i) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/dashboard/student/ideas/${idea.id}`}>
                <div className="glass-card glass-hover p-6 cursor-pointer h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <span className={`badge text-xs ${STATUS_COLORS[idea.status]}`}>
                      {idea.status.replace("_", " ")}
                    </span>
                    {idea.domain && (
                      <span className="text-xs text-zinc-500">{idea.domain}</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-white mb-2 leading-tight">
                    {truncate(idea.title, 60)}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1 mb-4">
                    {truncate(idea.description, 120)}
                  </p>

                  {/* Tags */}
                  {idea.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {idea.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                      {idea.tags.length > 3 && (
                        <span className="text-xs text-zinc-600">+{idea.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      {idea.author.avatar ? (
                        <img src={idea.author.avatar} alt={idea.author.name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
                          {idea.author.name[0]}
                        </div>
                      )}
                      <span className="text-xs text-zinc-400">{idea.author.name}</span>
                      <span className="text-xs text-zinc-600">·</span>
                      <span className="text-xs text-zinc-600">{formatRelativeTime(idea.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-600">
                      <button
                        onClick={(e) => handleLike(idea.id, e)}
                        className="flex items-center gap-1 text-xs hover:text-red-400 transition-colors"
                      >
                        <Heart size={12} />
                        {idea._count.likes}
                      </button>
                      <div className="flex items-center gap-1 text-xs">
                        <Eye size={12} />
                        {idea.views}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <MessageCircle size={12} />
                        {idea._count.reviews}
                      </div>
                      {idea.team && (
                        <div className="flex items-center gap-1 text-xs">
                          <Users size={12} />
                          {idea.team._count.members}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  BookOpen, Star, Clock, CheckCircle, XCircle,
  TrendingUp, Users, Lightbulb, Eye,
} from "lucide-react";
import { formatRelativeTime, STATUS_COLORS, truncate } from "@/lib/utils";

interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  domain?: string;
  views: number;
  createdAt: string;
  author: { id: string; name: string; avatar?: string; university?: string };
  _count: { likes: number; reviews: number };
}

export default function ProfessorDashboard() {
  const { token, user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpenIdeas() {
      try {
        const res = await fetch("/api/ideas?status=OPEN&limit=20", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setIdeas(data.ideas || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchOpenIdeas();
  }, [token]);

  const stats = [
    { label: "Ideas to Review", value: ideas.length, icon: BookOpen, color: "#06b6d4" },
    { label: "Reviewed", value: user?._count?.reviews ?? 0, icon: CheckCircle, color: "#10b981" },
    { label: "Students Guided", value: 0, icon: Users, color: "#7c3aed" },
    { label: "Avg. Rating Given", value: "4.2", icon: Star, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Professor Dashboard</h1>
        <p className="text-zinc-400 text-sm">Review student ideas and provide expert guidance.</p>
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
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                <Icon size={16} style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Ideas Pending Review */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock size={16} className="text-cyan-400" />
          Ideas Awaiting Review
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-5 space-y-3">
                <div className="skeleton h-5 w-1/2" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Lightbulb size={32} className="text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500">No open ideas to review right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ideas.map((idea, i) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/dashboard/professor/review/${idea.id}`}>
                  <div className="glass-card glass-hover p-5 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-white">{truncate(idea.title, 60)}</h3>
                          {idea.domain && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              {idea.domain}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400 mb-3">{truncate(idea.description, 100)}</p>
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            {idea.author.avatar ? (
                              <img src={idea.author.avatar} className="w-4 h-4 rounded-full" alt="" />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-violet-500/30" />
                            )}
                            {idea.author.name}
                            {idea.author.university && ` · ${idea.author.university}`}
                          </span>
                          <span className="flex items-center gap-1"><Eye size={11} />{idea.views}</span>
                          <span className="flex items-center gap-1"><TrendingUp size={11} />{idea._count.likes} likes</span>
                          <span>{formatRelativeTime(idea.createdAt)}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <span className={`badge ${STATUS_COLORS[idea.status]}`}>
                          {idea.status}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                          <BookOpen size={11} />
                          {idea._count.reviews} reviews
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

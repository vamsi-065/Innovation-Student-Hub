"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Users, Lightbulb, BarChart3, TrendingUp, Flag,
  Shield, Search, Trash2, Edit2, CheckCircle, XCircle, AlertTriangle
} from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  university?: string;
  createdAt: string;
  _count: { ideas: number; reviews: number };
}

interface AdminIdea {
  id: string;
  title: string;
  author: { name: string; email: string };
  status: string;
  flags: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"users" | "ideas">("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [ideas, setIdeas] = useState<AdminIdea[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ users: 0, students: 0, professors: 0, ideas: 0 });

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
      });
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);

      // Rough stats
      const allRes = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      const allData = await allRes.json();
      const allUsers: AdminUser[] = allData.users || [];
      setStats({
        users: allData.total || 0,
        students: allUsers.filter((u) => u.role === "STUDENT").length,
        professors: allUsers.filter((u) => u.role === "PROFESSOR").length,
        ideas: allUsers.reduce((acc, u) => acc + u._count.ideas, 0),
      });
      // Also fetch ideas for moderation
      const ideasRes = await fetch("/api/ideas?limit=50", { headers: { Authorization: `Bearer ${token}` } });
      const ideasData = await ideasRes.json();
      setIdeas(ideasData.ideas || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function updateRole(userId: string, role: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, role }),
    });
    fetchUsers();
  }

  async function deleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user? This action is irreversible.")) return;
    await fetch(`/api/admin/users?userId=${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  }

  async function deleteIdea(ideaId: string) {
    if (!confirm("Are you sure you want to remove this idea?")) return;
    await fetch(`/api/ideas/${ideaId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  }

  const roleColors: Record<string, string> = {
    STUDENT: "#7c3aed", PROFESSOR: "#06b6d4", ADMIN: "#f59e0b",
  };

  const adminStats = [
    { label: "Total Users", value: stats.users, icon: Users, color: "#7c3aed" },
    { label: "Students", value: stats.students, icon: Lightbulb, color: "#06b6d4" },
    { label: "Professors", value: stats.professors, icon: Shield, color: "#10b981" },
    { label: "Total Ideas", value: stats.ideas, icon: TrendingUp, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-zinc-400 text-sm">Platform overview and user management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {adminStats.map((s, i) => {
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

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "users" ? "text-white border-b-2 border-violet-500" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab("ideas")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "ideas" ? "text-white border-b-2 border-cyan-500" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Content Moderation
        </button>
      </div>

      {activeTab === "users" && (
      <>
      {/* User Table */}
      <div className="glass-card">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Users size={16} className="text-amber-400" />
            User Management
            <span className="text-xs text-zinc-500 font-normal ml-1">({total} total)</span>
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-glass pl-9 text-sm py-2 w-56"
                id="admin-user-search"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-glass text-sm py-2 w-36"
              id="admin-role-filter"
            >
              <option value="">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="PROFESSOR">Professor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["User", "Role", "University", "Ideas", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-zinc-500 px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="skeleton h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                users.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: `${roleColors[u.role]}40` }}
                          >
                            {getInitials(u.name)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">{u.name}</div>
                          <div className="text-xs text-zinc-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                          background: `${roleColors[u.role]}15`,
                          color: roleColors[u.role],
                          border: `1px solid ${roleColors[u.role]}30`,
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{u.university || "—"}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{u._count.ideas}</td>
                    <td className="px-6 py-4 text-xs text-zinc-500">{formatDate(u.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => updateRole(u.id, e.target.value)}
                          className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-zinc-300 cursor-pointer"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="PROFESSOR">Professor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete user"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {activeTab === "ideas" && (
      <div className="glass-card">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            Content Moderation (Ideas)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Title", "Author", "Status", "Flags", "Created", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-zinc-500 px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ideas.sort((a,b) => b.flags - a.flags).map((idea) => (
                <tr key={idea.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">{idea.title}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-300">{idea.author.name}</div>
                    <div className="text-xs text-zinc-500">{idea.author.email}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400">{idea.status}</td>
                  <td className="px-6 py-4">
                    {idea.flags > 0 ? (
                      <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full w-fit">
                        <Flag size={12} /> {idea.flags} flags
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500">0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">{formatDate(idea.createdAt)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2 text-xs"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}

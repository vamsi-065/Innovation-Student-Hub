"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Users, Lightbulb, BarChart3, TrendingUp, Flag,
  Shield, Trash2, Edit2, CheckCircle, XCircle, 
  AlertTriangle, ArrowUpRight, MoreVertical,
  UserPlus, Mail
} from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { formatDate, getInitials } from "@/lib/utils";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"users" | "ideas">("users");
  const [users, setUsers] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, students: 0, professors: 0, ideas: 0 });

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      
      // Update stats based on results
      setStats({
        users: data.total || 0,
        students: (data.users || []).filter((u: any) => u.role === "STUDENT").length,
        professors: (data.users || []).filter((u: any) => u.role === "PROFESSOR").length,
        ideas: (data.users || []).reduce((acc: number, u: any) => acc + (u._count?.ideas || 0), 0),
      });

      const ideasRes = await fetch("/api/ideas?limit=50");
      const ideasData = await ideasRes.json();
      setIdeas(ideasData.ideas || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function updateRole(userId: string, role: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    fetchUsers();
  }

  async function deleteUser(userId: string) {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
    fetchUsers();
  }

  const adminStats = [
    { label: "Total Platform Users", value: stats.users, icon: Users, color: "#38bdf8", trend: "+12%" },
    { label: "Active Ideas", value: stats.ideas, icon: Lightbulb, color: "#f59e0b", trend: "+5%" },
    { label: "Faculty Members", value: stats.professors, icon: Shield, color: "#10b981", trend: "Stable" },
    { label: "Reports", value: "3", icon: Flag, color: "#ef4444", trend: "-2" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--hub-text)] mb-2 tracking-tight">
            System <span className="text-sky-400">Control</span>
          </h1>
          <p className="text-[var(--hub-text-muted)] text-sm">Monitor platform health and manage ecosystem participants.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost flex items-center gap-2">
            <BarChart3 size={16} />
            Export Data
          </button>
          <button className="btn-primary flex items-center gap-2">
            <UserPlus size={16} />
            Invite User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)]">
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-400" : "bg-[var(--hub-surface-2)] text-[var(--hub-text-muted)]"}`}>
                {s.trend}
              </span>
            </div>
            <div className="text-3xl font-bold text-[var(--hub-text)] mb-1">{s.value}</div>
            <div className="text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Content Area */}
      <div className="glass-card overflow-hidden">
        <div className="p-1 border-b border-[var(--hub-border)] flex items-center justify-between bg-[var(--hub-surface)]/30">
           <div className="flex items-center">
              {[
                { id: "users", label: "Participants", icon: Users },
                { id: "ideas", label: "Moderation", icon: Shield },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all relative ${
                    activeTab === tab.id ? "text-[var(--hub-text)]" : "text-[var(--hub-text-muted)] hover:text-[var(--hub-text)]"
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500"
                    />
                  )}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-4 px-6">
              <SearchInput 
                placeholder="Filter results..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                containerClassName="w-64"
                className="text-xs"
              />
           </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {activeTab === "users" ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--hub-surface-2)]/30 border-b border-[var(--hub-border)]">
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">Participant</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">Activity</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hub-border)]">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-[var(--hub-surface-2)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center text-xs font-bold text-sky-400">
                          {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover rounded-xl" /> : getInitials(u.name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--hub-text)]">{u.name}</p>
                          <p className="text-xs text-[var(--hub-text-muted)] flex items-center gap-1">
                            <Mail size={10} /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <select 
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className="bg-transparent border-none text-xs font-bold text-sky-400 focus:ring-0 cursor-pointer p-0"
                       >
                         <option value="STUDENT">STUDENT</option>
                         <option value="PROFESSOR">FACULTY</option>
                         <option value="ADMIN">ADMIN</option>
                       </select>
                    </td>
                    <td className="px-6 py-4">
                       <div className="space-y-1">
                          <p className="text-xs text-[var(--hub-text)]">{u._count?.ideas || 0} Ideas</p>
                          <p className="text-[10px] text-[var(--hub-text-muted)]">{u._count?.reviews || 0} Reviews</p>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full w-fit">
                         <div className="w-1 h-1 rounded-full bg-emerald-500" /> ACTIVE
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg bg-[var(--hub-surface-2)] text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => deleteUser(u.id)}
                            className="p-2 rounded-lg bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
               <thead>
                <tr className="bg-[var(--hub-surface-2)]/30 border-b border-[var(--hub-border)]">
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">Idea</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">Author</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">Reports</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hub-border)]">
                {ideas.map((idea: any) => (
                  <tr key={idea.id} className="hover:bg-[var(--hub-surface-2)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[var(--hub-text)]">{idea.title}</p>
                        <p className="text-[10px] text-[var(--hub-text-muted)]">{formatDate(idea.createdAt)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--hub-text-muted)]">{idea.author.name}</td>
                    <td className="px-6 py-4">
                       {idea.flags > 0 ? (
                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full w-fit">
                           <AlertTriangle size={12} /> {idea.flags} REPORTS
                         </span>
                       ) : (
                         <span className="text-[10px] text-[var(--hub-text-subtle)] font-bold uppercase">Safe</span>
                       )}
                    </td>
                    <td className="px-6 py-4">
                       <button className="btn-ghost py-1.5 px-3 text-[10px] border-red-500/20 text-red-400 hover:bg-red-500/10">Take Down</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

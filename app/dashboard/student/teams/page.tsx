"use client";

import { motion } from "framer-motion";
import { Users, Search, Plus, UserPlus, Shield, MessageCircle } from "lucide-react";

export default function TeamsPage() {
  const dummyTeams = [
    { id: 1, name: "SolarTech Hub", role: "Leader", members: 4, status: "Active", idea: "Smart Solar Optimization" },
    { id: 2, name: "EcoTrack AI", role: "Collaborator", members: 3, status: "Active", idea: "Carbon Footprint Tracker" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--hub-text)] mb-2">My Teams</h1>
          <p className="text-[var(--hub-text-muted)] text-sm">Collaborate with peers to bring ideas to life.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus size={18} /> Join a Team
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dummyTeams.map((team, i) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Users size={32} />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-[var(--hub-text)] mb-1 group-hover:text-sky-400 transition-colors">{team.name}</h3>
              <p className="text-xs text-[var(--hub-text-muted)] mb-2">Project: <span className="text-[var(--hub-text)] font-medium">{team.idea}</span></p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">
                  <Shield size={12} className="text-sky-500" /> {team.role}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">
                  <Users size={12} className="text-emerald-500" /> {team.members} Members
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-all">
                <MessageCircle size={20} />
              </button>
              <button className="btn-ghost text-xs py-2 px-6">View Workspace</button>
            </div>
          </motion.div>
        ))}

        <div className="border-2 border-dashed border-[var(--hub-border)] rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--hub-surface-2)] flex items-center justify-center mb-4 text-[var(--hub-text-subtle)]">
            <Plus size={24} />
          </div>
          <h3 className="text-[var(--hub-text)] font-bold mb-1">Create a new team</h3>
          <p className="text-[var(--hub-text-muted)] text-xs mb-6 max-w-xs">Start a new collaboration for one of your existing ideas.</p>
          <button className="btn-ghost text-[10px] uppercase font-bold tracking-widest py-2 px-6">Create Team</button>
        </div>
      </div>
    </div>
  );
}

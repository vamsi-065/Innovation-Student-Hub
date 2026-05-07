"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
  User, Mail, Building2, Calendar, MapPin, 
  Globe, Edit2, Save, X,
  Camera, Lightbulb, Heart, Bookmark, Users,
  CheckCircle2, Award, Link as LinkIcon, Link2
} from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: "Passionate innovator and full-stack developer exploring the intersection of AI and sustainability.",
    university: user?.university || "Tech Institute of Innovation",
    department: user?.department || "Computer Science",
    github: "github.com/innovator",
    linkedin: "linkedin.com/in/innovator",
    website: "innovator.dev"
  });

  const stats = [
    { label: "Ideas Posted", value: 8, icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Collaborations", value: 12, icon: Users, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Hearts Received", value: 145, icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "Achievements", value: 4, icon: Award, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="glass-card overflow-hidden relative">
        <div className="h-40 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 border-b border-white/5" />
        <div className="px-8 pb-8">
          <div className="relative -mt-16 flex items-end justify-between mb-6">
            <div className="flex items-end gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl bg-[var(--hub-surface-2)] border-4 border-[var(--hub-bg)] flex items-center justify-center text-3xl font-bold text-sky-400 overflow-hidden shadow-2xl">
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user?.name || "")}
                </div>
                <button className="absolute bottom-2 right-2 p-2 rounded-xl bg-sky-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={16} />
                </button>
              </div>
              <div className="pb-2 min-w-0">
                <h1 className="text-3xl font-extrabold text-[var(--hub-text)] mb-1 truncate">{user?.name}</h1>
                <div className="flex items-center gap-3 text-[var(--hub-text-muted)] text-sm">
                  <span className="flex items-center gap-1.5"><Building2 size={14} /> {formData.university}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--hub-border)]" />
                  <span className="flex items-center gap-1.5 text-sky-400/80 font-bold uppercase tracking-widest text-[10px]">{user?.role}</span>
                </div>
              </div>
            </div>
            <div className="pb-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`btn-ghost flex items-center gap-2 ${isEditing ? "text-rose-400 border-rose-500/20" : ""}`}
              >
                {isEditing ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit Profile</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">About Me</h3>
                {isEditing ? (
                  <textarea 
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    className="input-glass w-full h-32 resize-none text-sm leading-relaxed placeholder-[var(--hub-text-muted)]"
                  />
                ) : (
                  <p className="text-[var(--hub-text-muted)] leading-relaxed">{formData.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map(s => (
                  <div key={s.label} className="p-4 rounded-2xl bg-[var(--hub-surface-2)]/30 border border-[var(--hub-border)] hover:bg-[var(--hub-surface-2)] transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                        <s.icon size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">{s.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-[var(--hub-text)]">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[var(--hub-text-muted)] uppercase tracking-widest">Connect</h3>
                <div className="space-y-2">
                   {[
                    { icon: LinkIcon, value: formData.github, label: "GitHub" },
                    { icon: Link2, value: formData.linkedin, label: "LinkedIn" },
                    { icon: Globe, value: formData.website, label: "Website" },
                    { icon: Mail, value: user?.email, label: "Email" },
                   ].map(link => (
                    <div key={link.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--hub-surface-2)] transition-colors group">
                      <link.icon size={16} className="text-[var(--hub-text-muted)] group-hover:text-sky-400 transition-colors" />
                      <span className="text-sm text-[var(--hub-text-muted)] group-hover:text-[var(--hub-text)] transition-colors truncate">{link.value}</span>
                    </div>
                   ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Verified Innovator</span>
                </div>
                <p className="text-[10px] text-[var(--hub-text-muted)] leading-relaxed">Identity and university affiliation verified on {formatDate(user?.createdAt || "")}.</p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 pt-8 border-t border-[var(--hub-border)] flex justify-end">
              <button 
                onClick={() => setIsEditing(false)}
                className="btn-primary flex items-center gap-2 px-8"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

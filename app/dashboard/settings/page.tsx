"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Bell, Lock, Shield, Eye, 
  Smartphone, Monitor, Moon, Globe, Trash2,
  CheckCircle2, AlertCircle, X, Loader2, Sun
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

interface SettingItem {
  id: string;
  label: string;
  desc: string;
  toggle: boolean;
  value: boolean;
}

interface SettingSection {
  title: string;
  icon: any;
  items: SettingItem[];
}

export default function SettingsPage() {
  const { user, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [sections, setSections] = useState<SettingSection[]>([
    {
      title: "Account Preferences",
      icon: Settings,
      items: [
        { id: "public-profile", label: "Public Profile", desc: "Allow others to see your innovations", toggle: true, value: true },
        { id: "available-hire", label: "Available for Hire", desc: "Show 'Open to Collaborate' badge", toggle: true, value: true },
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { id: "email-updates", label: "Email Updates", desc: "Get project reviews via email", toggle: true, value: true },
        { id: "team-invites", label: "Team Invites", desc: "Notify when someone invites you", toggle: true, value: true },
        { id: "desktop-alerts", label: "Desktop Alerts", desc: "Browser notifications for messages", toggle: true, value: false },
      ]
    },
    {
      title: "Privacy & Security",
      icon: Lock,
      items: [
        { id: "two-factor", label: "Two-Factor Auth", desc: "Add an extra layer of security", toggle: true, value: false },
        { id: "show-email", label: "Show Email", desc: "Display email on profile page", toggle: true, value: false },
      ]
    }
  ]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState<"none" | "confirm" | "processing">("none");
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" }[]>([]);

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleToggle = (sectionIdx: number, itemIdx: number) => {
    const newSections = [...sections];
    const item = newSections[sectionIdx].items[itemIdx];
    item.value = !item.value;
    setSections(newSections);
    addToast(`${item.label} updated`, "success");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleteStep("processing");
    
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error("Failed to delete account");
      
      addToast("Account deleted successfully", "success");
      setTimeout(async () => {
        await logout();
        router.push("/");
      }, 1500);
    } catch (err) {
      addToast("Error deleting account", "error");
      setDeleteStep("confirm");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-10 min-w-0">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--hub-text)] tracking-tight">Settings</h1>
        <p className="text-[var(--hub-text-muted)] text-sm md:text-base">Manage your account settings and hub preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Theme Toggle Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden border-sky-500/10"
        >
          <div className="px-6 py-4 border-b border-[var(--hub-border)] bg-[var(--hub-surface-2)]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-sky-400" />
              <h2 className="text-sm font-bold text-[var(--hub-text)] uppercase tracking-widest">Appearance</h2>
            </div>
            <span className="text-[10px] font-bold text-sky-500/50 uppercase tracking-widest bg-sky-500/5 px-2 py-0.5 rounded-full border border-sky-500/10">UI/UX</span>
          </div>
          <div className="px-6 py-5 flex items-center justify-between hover:bg-[var(--hub-surface-2)]/30 transition-colors group">
            <div>
              <p className="text-sm font-bold text-[var(--hub-text)] mb-0.5 group-hover:text-sky-400 transition-colors">Theme Mode</p>
              <p className="text-xs text-[var(--hub-text-muted)]">Switch between sleek obsidian and paper light themes.</p>
            </div>
            <button 
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                theme === "dark" 
                ? "bg-[var(--hub-surface-2)] border-[var(--hub-border)] text-[var(--hub-text-muted)] hover:text-[var(--hub-text)]" 
                : "bg-[var(--hub-surface)] border-[var(--hub-border)] text-[var(--hub-text-muted)] hover:text-[var(--hub-text)]"
              }`}
            >
              {theme === "dark" ? <><Moon size={14} /> Dark</> : <><Sun size={14} /> Light</>}
            </button>
          </div>
        </motion.div>

        {sections.map((section, sIdx) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.1 }}
            className="glass-card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[var(--hub-border)] bg-[var(--hub-surface-2)]/30 flex items-center gap-3">
              <section.icon size={18} className="text-sky-400" />
              <h2 className="text-sm font-bold text-[var(--hub-text)] uppercase tracking-widest">{section.title}</h2>
            </div>
            <div className="divide-y divide-[var(--hub-border)]">
              {section.items.map((item, iIdx) => (
                <div key={item.id} className="px-6 py-5 flex items-center justify-between hover:bg-[var(--hub-surface-2)]/30 transition-colors group">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-bold text-[var(--hub-text)] mb-0.5 group-hover:text-sky-400 transition-colors truncate">{item.label}</p>
                    <p className="text-xs text-[var(--hub-text-muted)] leading-relaxed line-clamp-2 sm:line-clamp-none">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle(sIdx, iIdx)}
                    className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${item.value ? "bg-sky-500 shadow-lg shadow-sky-500/20" : "bg-[var(--hub-surface-2)]"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${item.value ? "translate-x-7" : "translate-x-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <div className="pt-6">
          <div className="p-1 rounded-[22px] bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20">
            <div className="glass-card bg-[var(--hub-surface)] border-red-500/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2">
                  <Trash2 size={16} /> Danger Zone
                </p>
                <p className="text-xs text-[var(--hub-text-muted)] leading-relaxed">Permanently remove your account, projects, and all data. This action is irreversible.</p>
              </div>
              <button 
                onClick={() => setDeleteStep("confirm")}
                className="btn-ghost text-red-500 hover:bg-red-500/10 hover:border-red-500/20 text-xs py-2.5 px-6 font-bold uppercase tracking-widest whitespace-nowrap"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteStep !== "none" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => deleteStep !== "processing" && setDeleteStep("none")}
              className="absolute inset-0 bg-[var(--hub-background)]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-card bg-[var(--hub-surface)] p-8 border-red-500/20 shadow-2xl shadow-red-500/10"
            >
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-extrabold text-[var(--hub-text)] text-center mb-2">Are you absolutely sure?</h2>
              <p className="text-[var(--hub-text-muted)] text-sm text-center mb-8 leading-relaxed">
                This will permanently delete your profile, all shared ideas, and team memberships. This action cannot be undone.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleteStep === "processing"}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleteStep === "processing" ? (
                    <><Loader2 className="animate-spin" size={18} /> Processing...</>
                  ) : "Yes, Delete Everything"}
                </button>
                <button 
                  onClick={() => setDeleteStep("none")}
                  disabled={deleteStep === "processing"}
                  className="w-full py-3 rounded-xl bg-[var(--hub-surface-2)] hover:bg-[var(--hub-surface)] text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] font-bold text-sm transition-all border border-[var(--hub-border)]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[110] space-y-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl ${
                t.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {t.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span className="text-xs font-bold tracking-tight">{t.message}</span>
              <button 
                onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
                className="ml-2 hover:opacity-70"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

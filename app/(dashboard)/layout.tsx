"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Home, Lightbulb, Users, MessageCircle, BookOpen,
  Settings, LogOut, Bell, Menu, X, Sparkles,
  BarChart3, Shield, ChevronRight, User,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

const studentNav = [
  { href: "/dashboard/student", label: "Feed", icon: Home },
  { href: "/dashboard/student/ideas", label: "My Ideas", icon: Lightbulb },
  { href: "/dashboard/student/teams", label: "Teams", icon: Users },
  { href: "/dashboard/student/messages", label: "Messages", icon: MessageCircle },
];

const professorNav = [
  { href: "/dashboard/professor", label: "Dashboard", icon: Home },
  { href: "/dashboard/professor/reviews", label: "Reviews", icon: BookOpen },
  { href: "/dashboard/professor/messages", label: "Messages", icon: MessageCircle },
];

const adminNav = [
  { href: "/dashboard/admin", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Shield },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications] = useState(3);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-hub flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center animate-pulse-glow">
            <Sparkles size={22} className="text-white" />
          </div>
          <p className="text-zinc-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems =
    user.role === "ADMIN" ? adminNav
      : user.role === "PROFESSOR" ? professorNav
        : studentNav;

  const roleColor =
    user.role === "ADMIN" ? "#f59e0b"
      : user.role === "PROFESSOR" ? "#06b6d4"
        : "#7c3aed";

  return (
    <div className="min-h-screen bg-mesh" style={{ background: "var(--hub-bg)" }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sidebar hidden md:flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shrink-0 animate-pulse-glow">
            <Sparkles size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-white font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden"
              >
                InnovationHub
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="ml-auto text-zinc-600 hover:text-zinc-300 transition-colors shrink-0"
          >
            <ChevronRight
              size={16}
              className="transition-transform duration-300"
              style={{ transform: sidebarOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        </div>

        {/* Role Badge */}
        {sidebarOpen && (
          <div className="px-4 pt-4">
            <div
              className="text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
              style={{ background: `${roleColor}15`, color: roleColor, border: `1px solid ${roleColor}30` }}
            >
              {user.role === "ADMIN" && <Shield size={10} />}
              {user.role === "PROFESSOR" && <BookOpen size={10} />}
              {user.role === "STUDENT" && <User size={10} />}
              {user.role}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== `/dashboard/${user?.role?.toLowerCase() || "student"}` && pathname.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div className={`sidebar-item ${active ? "active" : ""}`} title={!sidebarOpen ? label : undefined}>
                  <Icon size={18} className="shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-white/5 p-3 space-y-1">
          <Link href={`/dashboard/profile/${user.id}`}>
            <div className="sidebar-item">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full shrink-0 object-cover" />
              ) : (
                <div
                  className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)` }}
                >
                  {getInitials(user.name)}
                </div>
              )}
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                    <div className="text-xs font-medium text-zinc-200 whitespace-nowrap truncate">{user.name}</div>
                    <div className="text-xs text-zinc-600 whitespace-nowrap truncate">{user.email}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Link>
          <button
            onClick={logout}
            className="sidebar-item w-full text-left text-red-500/70 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={16} className="shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 240 : 72 }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
          <button className="md:hidden text-zinc-400" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="text-sm text-zinc-500">
            <span className="text-zinc-300 font-medium">
              {user.role === "ADMIN" ? "Admin Panel" : user.role === "PROFESSOR" ? "Professor Dashboard" : "Student Hub"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 glass rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Bell size={16} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 text-xs text-white flex items-center justify-center font-bold">
                  {notifications}
                </span>
              )}
            </button>
            <Link href={`/dashboard/profile/${user.id}`}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover cursor-pointer border border-white/10" />
              ) : (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)` }}
                >
                  {getInitials(user.name)}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

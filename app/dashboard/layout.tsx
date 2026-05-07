"use client";

import { Suspense, useEffect, useState, ReactNode, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Home, Lightbulb, Users, MessageCircle, BookOpen,
  Settings, LogOut, Bell, Menu, X, Sparkles,
  BarChart3, Shield, ChevronRight, User,
  Plus, ChevronDown, Bookmark, Heart, Settings2,
  Calendar, CheckCircle2, AlertCircle, Star, LucideIcon
} from "lucide-react";
import { SearchInput } from "@/components/SearchInput";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}
import { getInitials } from "@/lib/utils";

const studentNav: NavItem[] = [
  { href: "/dashboard/student", label: "Feed", icon: Home },
  { href: "/dashboard/student/ideas", label: "My Ideas", icon: Lightbulb },
  { href: "/dashboard/student/saved", label: "Saved", icon: Bookmark },
  { href: "/dashboard/student/teams", label: "Teams", icon: Users },
  { href: "/dashboard/chats", label: "Chats", icon: MessageCircle, badge: 2 },
];

const professorNav: NavItem[] = [
  { href: "/dashboard/professor", label: "Dashboard", icon: Home },
  { href: "/dashboard/professor/reviews", label: "Reviews", icon: BookOpen },
  { href: "/dashboard/chats", label: "Chats", icon: MessageCircle, badge: 5 },
];

const adminNav: NavItem[] = [
  { href: "/dashboard/admin", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/dashboard/chats", label: "Chats", icon: MessageCircle },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Shield },
];

const DUMMY_NOTIFICATIONS = [
  { id: 1, title: "New Review", content: "Prof. Sarah left a review on your idea.", time: "2m ago", read: false, type: "review" },
  { id: 2, title: "Team Invite", content: "Alex invited you to join SolarTech team.", time: "1h ago", read: false, type: "team" },
  { id: 3, title: "System Update", content: "New features added to the dashboard.", time: "5h ago", read: true, type: "system" },
];

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const role = user?.role?.toLowerCase() || "student";
    router.push(`/dashboard/${role}?q=${encodeURIComponent(searchValue)}`);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center animate-pulse">
            <Sparkles size={22} className="text-white" />
          </div>
          <p className="text-[var(--hub-text-muted)] text-sm font-medium">Loading Hub...</p>
        </div>
      </div>
    );
  }

  const navItems =
    user.role === "ADMIN" ? adminNav
      : user.role === "PROFESSOR" ? professorNav
        : studentNav;

  return (
    <div className="min-h-screen bg-transparent text-[var(--hub-text)] flex transition-colors duration-400">
      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="w-72 h-full bg-[var(--hub-surface)] border-r border-[var(--hub-border)] p-6 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-10 px-2">
                <Sparkles size={24} className="text-sky-400" />
                <span className="font-bold text-xl tracking-tight text-[var(--hub-text)]">IdeaForge</span>
              </div>
              <nav className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-item ${pathname === item.href ? "active" : ""}`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[var(--hub-surface)]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-6 space-y-1.5 border-t border-[var(--hub-border)]">
                <Link href="/dashboard/settings" className="nav-item">
                  <Settings2 size={20} />
                  <span>Settings</span>
                </Link>
                <button onClick={logout} className="nav-item w-full text-red-400 hover:bg-red-500/10">
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside
        className={`fixed left-0 top-0 h-full z-50 bg-[var(--hub-surface)]/60 backdrop-blur-2xl border-r border-[var(--hub-border)] transition-all duration-300 hidden md:flex flex-col ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="h-20 flex items-center gap-3 px-6 shrink-0 border-b border-[var(--hub-border)]">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-sky-400" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-xl tracking-tight text-[var(--hub-text)] whitespace-nowrap"
              >
                IdeaForge
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="px-3 py-6 space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? "active shadow-lg shadow-sky-500/10" : ""} ${!sidebarOpen ? "justify-center px-0 h-12" : "h-11"}`}
                title={!sidebarOpen ? item.label : ""}
              >
                <item.icon size={20} className={`shrink-0 ${active ? "text-white" : "text-[var(--hub-text-muted)]"}`} />
                {sidebarOpen && <span className="flex-1">{item.label}</span>}
                {sidebarOpen && item.badge && (
                  <span className="bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[var(--hub-surface)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 mt-auto border-t border-[var(--hub-border)] space-y-1.5">
          <Link
            href="/dashboard/settings"
            className={`nav-item ${pathname === "/dashboard/settings" ? "active" : ""} ${!sidebarOpen ? "justify-center px-0 h-12" : "h-11"}`}
          >
            <Settings2 size={20} className="shrink-0 text-[var(--hub-text-muted)]" />
            {sidebarOpen && <span className="flex-1">Settings</span>}
          </Link>
          <button
            onClick={logout}
            className={`nav-item w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 ${!sidebarOpen ? "justify-center px-0 h-12" : "h-11"}`}
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span className="flex-1 text-left">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}
      >
        {/* Header */}
        <header className="h-20 border-b border-[var(--hub-border)] flex items-center justify-between px-4 md:px-6 sticky top-0 bg-[var(--hub-bg)]/80 backdrop-blur-md z-[45]">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="md:hidden p-2 text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
            <button
              className="hidden md:flex p-2 text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>

            {/* Search Bar - Responsive */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl min-w-0">
              <SearchInput
                placeholder="Search ideas..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </form>
          </div>

          <div className="flex items-center gap-4 ml-4">
            {user.role === "STUDENT" && (
              <Link href="/dashboard/student/ideas/new">
                <button className="btn-primary flex items-center gap-2 pr-6 h-10">
                  <Plus size={18} />
                  <span className="hidden lg:inline">Post Idea</span>
                </button>
              </Link>
            )}

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`w-10 h-10 rounded-xl bg-[var(--hub-surface)] border border-[var(--hub-border)] flex items-center justify-center text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-all relative ${notifOpen ? "bg-[var(--hub-surface-2)] text-[var(--hub-text)]" : ""}`}
              >
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-[var(--hub-bg)]"></span>
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-[var(--hub-surface)] border border-[var(--hub-border)] rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-[var(--hub-border)] flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[var(--hub-text)]">Notifications</h3>
                      <button className="text-[10px] font-bold text-sky-400 hover:underline uppercase tracking-widest">Mark all as read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto no-scrollbar">
                      {DUMMY_NOTIFICATIONS.map(n => (
                        <div key={n.id} className={`p-4 border-b border-[var(--hub-border)] hover:bg-[var(--hub-surface-2)] cursor-pointer transition-colors ${!n.read ? "bg-sky-500/5" : ""}`}>
                          <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === "review" ? "bg-amber-500/10 text-amber-500" :
                                n.type === "team" ? "bg-sky-500/10 text-sky-500" :
                                  "bg-[var(--hub-text-subtle)]/10 text-[var(--hub-text-subtle)]"
                              }`}>
                              {n.type === "review" ? <Star size={14} /> : n.type === "team" ? <Users size={14} /> : <Bell size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[var(--hub-text)] truncate">{n.title}</p>
                              <p className="text-[11px] text-[var(--hub-text-muted)] mt-0.5 line-clamp-2">{n.content}</p>
                              <p className="text-[9px] text-[var(--hub-text-subtle)] mt-1.5 font-medium">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-[var(--hub-surface-2)] text-center">
                      <button className="text-[10px] font-bold text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-colors uppercase tracking-widest">View all notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--hub-surface-2)] transition-all border border-transparent hover:border-[var(--hub-border)]"
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-[var(--hub-border)] bg-[var(--hub-surface-2)] flex items-center justify-center text-xs font-bold text-sky-400">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : getInitials(user.name)}
                </div>
                <ChevronDown size={14} className={`text-[var(--hub-text-subtle)] transition-transform hidden sm:block ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-[var(--hub-surface)] border border-[var(--hub-border)] rounded-2xl shadow-2xl z-50 p-2 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[var(--hub-border)] mb-1">
                      <p className="text-sm font-semibold text-[var(--hub-text)] truncate">{user.name}</p>
                      <p className="text-[10px] text-[var(--hub-text-muted)] truncate uppercase tracking-widest mt-0.5 font-bold">{user.role}</p>
                    </div>
                    <Link href={`/dashboard/profile`} onClick={() => setProfileOpen(false)}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--hub-text-muted)] hover:bg-[var(--hub-surface-2)] hover:text-[var(--hub-text)] transition-all">
                        <User size={18} />
                        View Profile
                      </div>
                    </Link>
                    <Link href="/dashboard/student/saved" onClick={() => setProfileOpen(false)}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--hub-text-muted)] hover:bg-[var(--hub-surface-2)] hover:text-[var(--hub-text)] transition-all">
                        <Bookmark size={18} />
                        Saved Ideas
                      </div>
                    </Link>
                    <div className="h-px bg-[var(--hub-border)] my-1" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

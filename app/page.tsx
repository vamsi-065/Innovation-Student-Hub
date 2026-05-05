"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lightbulb, Users, BookOpen, ArrowRight, Zap,
  Star, TrendingUp, Shield, MessageCircle, Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Share Your Idea",
    description: "Post your startup or project idea with tags, team requirements, and a detailed description.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.2)",
  },
  {
    icon: Users,
    title: "Find Collaborators",
    description: "Connect with like-minded students who have the skills your project needs.",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.2)",
  },
  {
    icon: BookOpen,
    title: "Get Professor Guidance",
    description: "Submit your ideas for expert review and mentorship from experienced professors.",
    color: "#7c3aed",
    glow: "rgba(124,58,237,0.2)",
  },
  {
    icon: MessageCircle,
    title: "Real-time Messaging",
    description: "Communicate instantly with your team members and mentors via built-in chat.",
    color: "#10b981",
    glow: "rgba(16,185,129,0.2)",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your idea's journey from concept to completion with status tracking.",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.2)",
  },
  {
    icon: Shield,
    title: "Role-based Access",
    description: "Students, professors, and admins each have tailored experiences and permissions.",
    color: "#f97316",
    glow: "rgba(249,115,22,0.2)",
  },
];

const stats = [
  { value: "500+", label: "Student Ideas" },
  { value: "120+", label: "Active Teams" },
  { value: "40+", label: "Professors" },
  { value: "95%", label: "Success Rate" },
];

const roles = [
  {
    role: "Student",
    description: "Post ideas, join teams, collaborate and message peers",
    icon: Lightbulb,
    color: "#7c3aed",
    gradient: "from-violet-600/20 to-violet-600/5",
    border: "border-violet-500/20",
    items: ["Post & manage ideas", "Join project teams", "Real-time messaging", "Get peer reviews"],
  },
  {
    role: "Professor",
    description: "Mentor students, review ideas, provide expert guidance",
    icon: BookOpen,
    color: "#06b6d4",
    gradient: "from-cyan-600/20 to-cyan-600/5",
    border: "border-cyan-500/20",
    items: ["Review student ideas", "Submit ratings & feedback", "Guide project teams", "Track progress"],
  },
  {
    role: "Admin",
    description: "Manage platform, moderate content, oversee users",
    icon: Shield,
    color: "#f59e0b",
    gradient: "from-amber-600/20 to-amber-600/5",
    border: "border-amber-500/20",
    items: ["Manage all users", "Moderate content", "Platform analytics", "Role management"],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-hero overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">InnovationHub</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</a>
          <a href="#roles" className="text-sm text-zinc-400 hover:text-white transition-colors">Roles</a>
          <a href="#about" className="text-sm text-zinc-400 hover:text-white transition-colors">About</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="btn-ghost text-sm py-2 px-4">Sign In</button>
          </Link>
          <Link href="/signup">
            <button className="btn-primary text-sm py-2 px-5">Get Started</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-violet-300 mb-8 border border-violet-500/20">
            <Zap size={14} className="text-violet-400" />
            <span>Built for the next generation of innovators</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl text-white mb-6 leading-[0.9]">
            Where Student<br />
            <span className="gradient-text">Ideas Take Flight</span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Share your startup ideas, find talented collaborators, and get expert
            guidance from professors — all in one beautiful platform.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex items-center gap-2 text-base py-3 px-8"
              >
                Start Building <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-ghost flex items-center gap-2 text-base py-3 px-8"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center justify-center gap-12 mt-20 flex-wrap"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white gradient-text">{stat.value}</div>
              <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl text-white mb-4">
            Everything You <span className="gradient-text">Need</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            A complete ecosystem for student innovation — from idea conception to project completion.
          </p>
        </motion.div>

        <div className="content-grid">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card glass-hover p-6"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.glow}`, border: `1px solid ${feature.color}30` }}
                >
                  <Icon size={22} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-32 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl text-white mb-4">
            Built for <span className="gradient-text-violet">Everyone</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Tailored experiences for students, professors, and administrators.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`glass-card p-8 bg-gradient-to-b ${r.gradient} border ${r.border}`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${r.color}20`, border: `1px solid ${r.color}30` }}
                >
                  <Icon size={26} style={{ color: r.color }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{r.role}</h3>
                <p className="text-zinc-400 text-sm mb-6">{r.description}</p>
                <ul className="space-y-2">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Star size={12} style={{ color: r.color }} className="shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card max-w-3xl mx-auto p-16 glow-violet"
        >
          <Sparkles size={40} className="text-violet-400 mx-auto mb-6" />
          <h2 className="font-display text-5xl text-white mb-4">
            Ready to <span className="gradient-text">Innovate?</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Join hundreds of students already building the future.
          </p>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-primary text-lg py-4 px-10"
            >
              Create Free Account
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-white font-semibold">InnovationHub</span>
        </div>
        <p className="text-zinc-600 text-sm">© 2025 Student Innovation Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion, useTransform, Variants } from "framer-motion";
import {
  Lightbulb, Users, BookOpen, ArrowRight, Zap,
  Star, TrendingUp, Shield, MessageCircle, Sparkles, Code
} from "lucide-react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { TiltCard } from "@/components/ui/TiltCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useRef, useEffect, useState } from "react";

const features = [
  {
    icon: Lightbulb,
    title: "Share Your Idea",
    description: "Post your startup or project idea with tags, team requirements, and a detailed description.",
    color: "#0ea5e9", // Electric Blue
  },
  {
    icon: Users,
    title: "Find Collaborators",
    description: "Connect with like-minded students who have the skills your project needs.",
    color: "#06b6d4", // Cyan
  },
  {
    icon: BookOpen,
    title: "Get Professor Guidance",
    description: "Submit your ideas for expert review and mentorship from experienced professors.",
    color: "#84cc16", // Lime
  },
  {
    icon: MessageCircle,
    title: "Real-time Messaging",
    description: "Communicate instantly with your team members and mentors via built-in chat.",
    color: "#3b82f6", // Blue
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your idea's journey from concept to completion with status tracking.",
    color: "#22d3ee", // Sky
  },
  {
    icon: Shield,
    title: "Role-based Access",
    description: "Students, professors, and admins each have tailored experiences and permissions.",
    color: "#a3e635", // Light Lime
  },
];

const stats = [
  { value: "500+", label: "Student Ideas" },
  { value: "120+", label: "Active Teams" },
  { value: "40+", label: "Professors" },
  { value: "95%", label: "Success Rate" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (index: number) => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    containerRef.current.scrollTo({ top: height * index, behavior: 'smooth' });
  };

  return (
    <AuroraBackground ref={containerRef}>
      {/* Navigation (Fixed) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Code size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-[var(--hub-text)] text-lg tracking-tight">InnovationHub</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection(1)} className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors">Features</button>
          <button onClick={() => scrollToSection(2)} className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors">Get Started</button>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="btn-ghost text-sm py-2 px-4 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all">Sign In</button>
          </Link>
          <Link href="/signup">
            <MagneticButton className="btn-primary text-sm py-2 px-6">
              Get Started
            </MagneticButton>
          </Link>
        </div>
      </nav>

      {/* SECTION 1: Hero */}
      <section className="h-screen w-full snap-start snap-always shrink-0 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden z-10 pt-16">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-md rounded-full text-sm font-medium text-blue-400 mb-8 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] cursor-pointer"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>Built for the next generation of innovators</span>
          </motion.div>

          <h1 className="font-display text-6xl md:text-8xl text-[var(--hub-text)] mb-6 leading-[1.05] tracking-tight">
            Where Student <br />
            <span className="gradient-text-blue">Ideas Take Flight</span>
          </h1>

          <p className="text-xl text-[var(--hub-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Share your startup ideas, find talented collaborators, and get expert
            guidance from professors — all in one powerful platform.
          </p>

          <div className="flex items-center justify-center gap-6 flex-wrap">
            <Link href="/signup">
              <MagneticButton className="btn-primary flex items-center gap-2 text-base py-4 px-10 shadow-[0_0_40px_rgba(14,165,233,0.3)]">
                Start Building <ArrowRight size={18} />
              </MagneticButton>
            </Link>
            <Link href="/login">
              <MagneticButton className="btn-ghost flex items-center gap-2 text-base py-4 px-10 border-[var(--hub-border)] hover:border-[var(--hub-border-hover)]">
                Sign In
              </MagneticButton>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-16 mt-20 flex-wrap border-t border-white/5 pt-10 w-full max-w-4xl"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl font-bold text-[var(--hub-text)] tracking-tight">{stat.value}</div>
              <div className="text-sm font-medium text-cyan-600 dark:text-cyan-500/80 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 2: Features */}
      <section className="h-screen w-full snap-start snap-always shrink-0 flex flex-col justify-center items-center px-4 max-w-7xl mx-auto relative z-10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl text-[var(--hub-text)] mb-4 tracking-tight">
            Everything You <span className="text-cyan-400">Need</span>
          </h2>
          <p className="text-[var(--hub-text-muted)] text-lg max-w-2xl mx-auto">
            A complete ecosystem for student innovation — from idea conception to project completion.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.2 }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants} className="h-full">
                <TiltCard className="p-8 h-full border-white/5 hover:border-cyan-500/30 transition-colors duration-500 group flex flex-col justify-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 group-hover:bg-cyan-500/10 transition-colors duration-500">
                    <Icon size={24} style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[var(--hub-text)] mb-3 group-hover:text-cyan-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-sm text-[var(--hub-text-muted)] leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">{feature.description}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* SECTION 3: CTA & Footer */}
      <section className="h-screen w-full snap-start snap-always shrink-0 flex flex-col items-center justify-center px-4 text-center relative z-10 pt-16">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl p-16 rounded-[2rem] border border-[var(--hub-border)] dark:border-cyan-500/20 bg-white dark:bg-gradient-to-b dark:from-cyan-900/20 dark:to-transparent shadow-xl dark:shadow-none overflow-hidden mb-auto mt-auto"
        >
          <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] hidden dark:block" />
          
          <div className="relative z-10">
            <Code size={48} className="text-cyan-400 mx-auto mb-8" />
            <h2 className="font-display text-5xl md:text-6xl text-[var(--hub-text)] mb-6 tracking-tight">
              Ready to <span className="gradient-text-blue">Innovate?</span>
            </h2>
            <p className="text-[var(--hub-text-muted)] text-xl mb-10 max-w-xl mx-auto">
              Join hundreds of students already building the future.
            </p>
            <Link href="/signup">
              <MagneticButton className="btn-primary text-lg py-5 px-12 shadow-[0_0_40px_rgba(14,165,233,0.3)]">
                Create Free Account
              </MagneticButton>
            </Link>
          </div>
        </motion.div>

        {/* Embedded Footer so it stays at the very bottom of the last slide */}
        <footer className="w-full border-t border-[var(--hub-border)] py-8 px-6 text-center bg-white dark:bg-[#030712]/50 backdrop-blur-lg">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Code size={12} className="text-white" />
            </div>
            <span className="text-[var(--hub-text)] font-display font-bold">InnovationHub</span>
          </div>
          <p className="text-[var(--hub-text-subtle)] text-sm">© 2026 Student Innovation Hub. All rights reserved.</p>
        </footer>

      </section>

    </AuroraBackground>
  );
}

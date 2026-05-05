"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Eye, EyeOff, GraduationCap, BookOpen, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT" as "STUDENT" | "PROFESSOR",
    university: "",
    department: "",
    bio: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(form);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">InnovationHub</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-zinc-400 text-sm">Join the community of student innovators</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-300 mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "STUDENT", label: "Student", icon: GraduationCap, desc: "Post & explore ideas" },
                { value: "PROFESSOR", label: "Professor", icon: BookOpen, desc: "Review & mentor" },
              ].map((r) => {
                const Icon = r.icon;
                const active = form.role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, role: r.value as "STUDENT" | "PROFESSOR" }))}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      active
                        ? "border-violet-500/50 bg-violet-500/10 text-white"
                        : "border-white/8 bg-white/3 text-zinc-400 hover:border-white/15"
                    }`}
                  >
                    <Icon size={20} className={`mb-2 ${active ? "text-violet-400" : "text-zinc-500"}`} />
                    <div className="text-sm font-semibold">{r.label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{r.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name *</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Alex Johnson"
                  className="input-glass"
                  id="signup-name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="alex@university.edu"
                  className="input-glass"
                  id="signup-email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password *</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="input-glass pr-12"
                  id="signup-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* University + Department */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">University</label>
                <input
                  name="university"
                  type="text"
                  value={form.university}
                  onChange={handleChange}
                  placeholder="MIT, Stanford..."
                  className="input-glass"
                  id="signup-university"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Department</label>
                <input
                  name="department"
                  type="text"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Computer Science..."
                  className="input-glass"
                  id="signup-department"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Short Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us a bit about yourself and what you're passionate about..."
                rows={3}
                className="input-glass resize-none"
                id="signup-bio"
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn-primary w-full py-3 text-sm font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              id="signup-submit"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                `Join as ${form.role === "STUDENT" ? "Student" : "Professor"}`
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

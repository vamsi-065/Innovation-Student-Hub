"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Save, X, Plus, Sparkles } from "lucide-react";

const SKILL_SUGGESTIONS = [
  "React", "Next.js", "Python", "Machine Learning", "Node.js", "TypeScript",
  "UI/UX Design", "Figma", "Data Science", "AWS", "Docker", "GraphQL",
  "Flutter", "iOS", "Android", "Blockchain", "Computer Vision", "NLP",
];

const INTEREST_SUGGESTIONS = [
  "AI/ML", "Web3", "HealthTech", "EdTech", "FinTech", "CleanTech",
  "SaaS", "Mobile Apps", "Open Source", "Social Impact", "Gaming", "IoT",
];

export default function EditProfilePage() {
  const { user, token, updateUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    university: "",
    department: "",
    year: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    avatar: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        university: user.university || "",
        department: user.department || "",
        year: user.year || "",
        githubUrl: user.githubUrl || "",
        linkedinUrl: user.linkedinUrl || "",
        websiteUrl: user.websiteUrl || "",
        avatar: user.avatar || "",
      });
      setSkills(user.skills || []);
      setInterests(user.interests || []);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  function addSkill(skill: string) {
    const s = skill.trim();
    if (s && !skills.includes(s)) setSkills((p) => [...p, s]);
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills((p) => p.filter((s) => s !== skill));
  }

  function addInterest(interest: string) {
    const i = interest.trim();
    if (i && !interests.includes(i)) setInterests((p) => [...p, i]);
    setInterestInput("");
  }

  function removeInterest(interest: string) {
    setInterests((p) => p.filter((i) => i !== interest));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, skills, interests }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      updateUser(data);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push(`/dashboard/profile/${user.id}`);
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--hub-text)] mb-1">Edit Profile</h1>
        <p className="text-[var(--hub-text-muted)] text-sm">Update your public profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--hub-text-muted)] mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-violet-400" />
            Basic Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--hub-text-muted)] mb-1.5">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-glass" id="edit-name" />
            </div>
            <div>
              <label className="block text-xs text-[var(--hub-text-muted)] mb-1.5">Profile Picture URL</label>
              <input name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://..." className="input-glass placeholder-[var(--hub-text-muted)]" id="edit-avatar" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[var(--hub-text-muted)] mb-1.5">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell others about yourself, your passions, and what you're building..."
              className="input-glass resize-none placeholder-[var(--hub-text-muted)]"
              id="edit-bio"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-[var(--hub-text-muted)] mb-1.5">University</label>
              <input name="university" value={form.university} onChange={handleChange} placeholder="MIT" className="input-glass placeholder-[var(--hub-text-muted)]" id="edit-university" />
            </div>
            <div>
              <label className="block text-xs text-[var(--hub-text-muted)] mb-1.5">Department</label>
              <input name="department" value={form.department} onChange={handleChange} placeholder="CS" className="input-glass placeholder-[var(--hub-text-muted)]" id="edit-department" />
            </div>
            <div>
              <label className="block text-xs text-[var(--hub-text-muted)] mb-1.5">Year</label>
              <input name="year" value={form.year} onChange={handleChange} placeholder="3" className="input-glass placeholder-[var(--hub-text-muted)]" id="edit-year" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-[var(--hub-text-muted)] mb-4">Skills</h2>

          <div className="flex gap-2 mb-3">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))}
              placeholder="Add a skill..."
              className="input-glass flex-1 text-sm placeholder-[var(--hub-text-muted)]"
              id="skill-input"
            />
            <button
              type="button"
              onClick={() => addSkill(skillInput)}
              className="btn-ghost py-2 px-3"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Current skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <motion.span
                  key={skill}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="skill-badge flex items-center gap-1.5 cursor-pointer"
                  onClick={() => removeSkill(skill)}
                  title="Click to remove"
                >
                  {skill}
                  <X size={10} />
                </motion.span>
              ))}
            </div>
          )}

          {/* Suggestions */}
          <div>
            <p className="text-xs text-[var(--hub-text-subtle)] mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="text-xs px-3 py-1 rounded-full border border-[var(--hub-border)] text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] hover:border-[var(--hub-border-hover)] transition-all"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-[var(--hub-text-muted)] mb-4">Interests</h2>

          <div className="flex gap-2 mb-3">
            <input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest(interestInput))}
              placeholder="Add an interest..."
              className="input-glass flex-1 text-sm placeholder-[var(--hub-text-muted)]"
              id="interest-input"
            />
            <button type="button" onClick={() => addInterest(interestInput)} className="btn-ghost py-2 px-3">
              <Plus size={16} />
            </button>
          </div>

          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {interests.map((interest) => (
                <motion.span
                  key={interest}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="tag cursor-pointer flex items-center gap-1.5"
                  onClick={() => removeInterest(interest)}
                  title="Click to remove"
                >
                  {interest}
                  <X size={10} />
                </motion.span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {INTEREST_SUGGESTIONS.filter((i) => !interests.includes(i)).map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => addInterest(i)}
                className="text-xs px-3 py-1 rounded-full border border-[var(--hub-border)] text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] hover:border-[var(--hub-border-hover)] transition-all"
              >
                + {i}
              </button>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--hub-text-muted)] mb-4">Social Links</h2>
          {[
            { name: "githubUrl", label: "GitHub URL", placeholder: "https://github.com/username" },
            { name: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/username" },
            { name: "websiteUrl", label: "Website URL", placeholder: "https://yoursite.com" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs text-[var(--hub-text-muted)] mb-1.5">{field.label}</label>
              <input
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="input-glass placeholder-[var(--hub-text-muted)]"
                id={`edit-${field.name}`}
              />
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`btn-primary flex items-center gap-2 text-sm ${saved ? "bg-emerald-600" : ""}`}
            id="save-profile-btn"
          >
            {saved ? (
              <><Save size={16} />Saved!</>
            ) : loading ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
            ) : (
              <><Save size={16} />Save Profile</>
            )}
          </motion.button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost text-sm py-2 px-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

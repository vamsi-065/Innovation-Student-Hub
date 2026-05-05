"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Globe, MapPin, GraduationCap,
  Calendar, Edit2, Lightbulb, BookOpen, Users,
  Star, ExternalLink, ArrowLeft, Link as LinkIcon, Link2,
} from "lucide-react";
import { getInitials, formatDate, STATUS_COLORS, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  university?: string;
  department?: string;
  year?: string;
  skills: string[];
  interests: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  ideas: {
    id: string;
    title: string;
    status: string;
    tags: string[];
    createdAt: string;
    _count: { likes: number };
  }[];
  reviews: {
    id: string;
    content: string;
    rating: number;
    status: string;
    createdAt: string;
    idea: { id: string; title: string };
  }[];
  _count: { ideas: number; reviews: number; teamMembers: number };
}

const roleColors: Record<string, string> = {
  STUDENT: "#7c3aed",
  PROFESSOR: "#06b6d4",
  ADMIN: "#f59e0b",
};

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: authUser, token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ideas" | "reviews" | "about">("ideas");

  const isOwner = authUser?.id === id;
  const roleColor = roleColors[profile?.role || "STUDENT"];

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/users/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) { router.push("/dashboard/student"); return; }
        const data = await res.json();
        setProfile(data);
      } catch {
        router.push("/dashboard/student");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id, token, router]);

  if (loading || !profile) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8">
          <div className="flex gap-6">
            <div className="skeleton w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-7 w-1/3" />
              <div className="skeleton h-4 w-1/4" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Profile Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        {/* Banner */}
        <div
          className="h-32 w-full"
          style={{
            background: `linear-gradient(135deg, ${roleColor}30 0%, ${roleColor}10 50%, transparent 100%)`,
            borderBottom: `1px solid ${roleColor}20`,
          }}
        />

        <div className="px-8 pb-8">
          {/* Avatar + Edit */}
          <div className="flex items-end justify-between -mt-12 mb-6">
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-[#05050a]"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white border-4 border-[#05050a]"
                  style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)` }}
                >
                  {getInitials(profile.name)}
                </div>
              )}
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: roleColor, color: "white" }}
                title={profile.role}
              >
                {profile.role === "STUDENT" ? "S" : profile.role === "PROFESSOR" ? "P" : "A"}
              </div>
            </div>

            {isOwner && (
              <Link href="/dashboard/profile/edit">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  className="btn-ghost flex items-center gap-2 text-sm py-2 px-4"
                  id="edit-profile-btn"
                >
                  <Edit2 size={14} />
                  Edit Profile
                </motion.button>
              </Link>
            )}
          </div>

          {/* Name & Role */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: `${roleColor}15`, color: roleColor, border: `1px solid ${roleColor}30` }}
              >
                {profile.role}
              </span>
            </div>

            <div className="flex items-center gap-4 flex-wrap text-sm text-zinc-400 mb-3">
              {profile.university && (
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-zinc-500" />
                  {profile.university}
                  {profile.department && ` · ${profile.department}`}
                </span>
              )}
              {profile.year && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-zinc-500" />
                  Year {profile.year}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-zinc-500" />
                Joined {formatDate(profile.createdAt)}
              </span>
            </div>

            {profile.bio && (
              <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">{profile.bio}</p>
            )}
          </div>

          {/* Social Links */}
          {(profile.githubUrl || profile.linkedinUrl || profile.websiteUrl) && (
            <div className="flex items-center gap-3 mb-6">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
                  <LinkIcon size={15} />
                  <span>GitHub</span>
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
                  <Link2 size={15} />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.websiteUrl && (
                <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
                  <Globe size={15} />
                  <span>Website</span>
                </a>
              )}
            </div>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-6 py-4 border-t border-white/5">
            {[
              { label: "Ideas", value: profile._count.ideas, icon: Lightbulb },
              { label: "Teams", value: profile._count.teamMembers, icon: Users },
              { label: "Reviews", value: profile._count.reviews, icon: BookOpen },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <div className="flex items-center gap-1.5 text-xl font-bold text-white">
                    <Icon size={16} style={{ color: roleColor }} />
                    {s.value}
                  </div>
                  <div className="text-xs text-zinc-500">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Skills */}
      {profile.skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <Star size={14} className="text-amber-400" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span key={skill} className="skill-badge">{skill}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Interests */}
      {profile.interests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6"
        >
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="tag">{interest}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
      >
        {/* Tab Bar */}
        <div className="flex border-b border-white/5">
          {[
            { id: "ideas" as const, label: "Ideas", count: profile._count.ideas },
            { id: "reviews" as const, label: "Reviews", count: profile._count.reviews },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-violet-500 text-violet-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
              id={`profile-tab-${tab.id}`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Ideas Tab */}
          {activeTab === "ideas" && (
            <div className="space-y-3">
              {profile.ideas.length === 0 ? (
                <div className="text-center py-8 text-zinc-600">No ideas posted yet</div>
              ) : (
                profile.ideas.map((idea) => (
                  <Link key={idea.id} href={`/dashboard/student/ideas/${idea.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/3 transition-all cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-medium text-white">{idea.title}</h3>
                          <span className={`badge text-xs ${STATUS_COLORS[idea.status]}`}>
                            {idea.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {idea.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag text-xs">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-600 ml-4">
                        <span className="text-xs">{formatRelativeTime(idea.createdAt)}</span>
                        <ExternalLink size={14} />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-3">
              {profile.reviews.length === 0 ? (
                <div className="text-center py-8 text-zinc-600">No reviews submitted yet</div>
              ) : (
                profile.reviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl border border-white/5">
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/dashboard/student/ideas/${review.idea.id}`} className="text-sm font-medium text-violet-400 hover:text-violet-300">
                        {review.idea.title}
                      </Link>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{review.content}</p>
                    <p className="text-xs text-zinc-600 mt-2">{formatRelativeTime(review.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

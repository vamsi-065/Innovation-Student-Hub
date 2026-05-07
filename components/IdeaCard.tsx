"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Heart, MessageCircle, Share2, Bookmark, 
  MoreHorizontal, Send, ExternalLink, User,
  Sparkles, Clock, Eye, Star
} from "lucide-react";
import { formatRelativeTime, truncate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface IdeaCardProps {
  idea: any;
  onUpdate?: () => void;
}

export default function IdeaCard({ idea, onUpdate }: IdeaCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(idea.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(idea.isBookmarked || false);
  const [likeCount, setLikeCount] = useState(idea._count?.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev: number) => newLikedState ? prev + 1 : prev - 1);

    try {
      if (newLikedState) {
        await supabase.from("idea_likes").insert({ idea_id: idea.id, user_id: user?.id });
      } else {
        await supabase.from("idea_likes").delete().eq("idea_id", idea.id).eq("user_id", user?.id);
      }
    } catch (err) {
      console.error("Like error:", err);
      setIsLiked(!newLikedState);
      setLikeCount((prev: number) => !newLikedState ? prev + 1 : prev - 1);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/dashboard/student/ideas/${idea.id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="feed-card bg-[var(--hub-surface)] border-[var(--hub-border)] hover:bg-[var(--hub-surface-2)] transition-all duration-300"
    >
      {/* Author Header */}
      <div className="p-4 flex items-center justify-between border-b border-[var(--hub-border)]/30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center overflow-hidden shrink-0">
            {idea.author?.avatar ? (
              <img src={idea.author.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-sky-400">{idea.author?.name?.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--hub-text)] hover:text-sky-400 transition-colors truncate cursor-pointer">
                {idea.author?.name}
              </span>
              {idea.author?.role === "PROFESSOR" && (
                <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-widest border border-emerald-500/20">Faculty</div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[var(--hub-text-muted)] text-[10px] uppercase font-bold tracking-tighter">
              <Clock size={10} />
              {formatRelativeTime(idea.createdAt)}
            </div>
          </div>
        </div>
        <button className="p-2 text-[var(--hub-text-subtle)] hover:text-[var(--hub-text)] transition-colors shrink-0">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <Link href={`/dashboard/student/ideas/${idea.id}`}>
        <div className="p-5 cursor-pointer group">
          <h3 className="text-xl font-bold text-[var(--hub-text)] mb-2 group-hover:text-sky-400 transition-colors leading-snug">
            {idea.title}
          </h3>
          <p className="text-sm text-[var(--hub-text-muted)] leading-relaxed mb-5 line-clamp-3">
            {idea.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {idea.tags?.slice(0, 4).map((tag: string) => (
              <span key={tag} className="text-[10px] font-bold text-sky-500 bg-sky-500/5 border border-sky-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                #{tag}
              </span>
            ))}
            {idea.tags?.length > 4 && <span className="text-[10px] font-bold text-[var(--hub-text-subtle)]">+{idea.tags.length - 4}</span>}
          </div>

          {/* Visual Placeholder */}
          <div className="w-full aspect-[2/1] rounded-2xl bg-gradient-to-br from-[var(--hub-primary)]/5 to-transparent border border-[var(--hub-border)] flex items-center justify-center relative overflow-hidden group/img">
            <div className="absolute inset-0 bg-sky-500/[0.02] opacity-0 group-hover/img:opacity-100 transition-opacity" />
            <Sparkles size={32} className="text-[var(--hub-text-subtle)]/20" />
            <div className="absolute bottom-3 right-3 bg-[var(--hub-surface)]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-bold text-[var(--hub-text)] flex items-center gap-1.5 border border-[var(--hub-border)] uppercase tracking-widest">
               <Eye size={12} className="text-sky-400" /> {idea.views || 0}
            </div>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="px-3 py-2 flex items-center justify-between border-t border-[var(--hub-border)]/50 bg-[var(--hub-surface)]/30">
        <div className="flex items-center gap-1">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isLiked ? "text-red-400 bg-red-400/10" : "text-[var(--hub-text-muted)] hover:bg-[var(--hub-surface-2)] hover:text-[var(--hub-text)]"}`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            <span className="text-xs font-bold">{likeCount}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${showComments ? "text-sky-400 bg-sky-400/10" : "text-[var(--hub-text-muted)] hover:bg-[var(--hub-surface-2)] hover:text-[var(--hub-text)]"}`}
          >
            <MessageCircle size={18} />
            <span className="text-xs font-bold">{idea._count?.reviews || 0}</span>
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--hub-text-muted)] hover:bg-[var(--hub-surface-2)] hover:text-[var(--hub-text)] transition-all"
          >
            <Share2 size={18} />
          </button>
        </div>
        <button 
          onClick={handleBookmark}
          className={`p-2.5 rounded-xl transition-all ${isBookmarked ? "text-amber-400 bg-amber-400/10" : "text-[var(--hub-text-muted)] hover:bg-[var(--hub-surface-2)] hover:text-[var(--hub-text)]"}`}
        >
          <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Comment Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[var(--hub-surface-2)]/50"
          >
            <div className="p-4 border-t border-[var(--hub-border)]">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center text-[10px] font-bold text-sky-400 shrink-0">
                  {user?.name?.charAt(0)}
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="input-glass w-full pr-12 text-xs"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-sky-400 hover:text-sky-300">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


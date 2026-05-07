"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Send, Paperclip, MoreVertical, 
  Smile, Phone, Video, Info, Check, CheckCheck,
  User, Image as ImageIcon, FileText, X, MessageCircle
} from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { getInitials } from "@/lib/utils";

const DUMMY_CHATS = [
  { id: 1, name: "Alex Rivera", lastMsg: "The solar panel design looks great!", time: "10:30 AM", unread: 2, online: true },
  { id: 2, name: "Sarah Chen", lastMsg: "Can we schedule a meeting for tomorrow?", time: "9:45 AM", unread: 0, online: true },
  { id: 3, name: "Innovation Hub Team", lastMsg: "Welcome to the team!", time: "Yesterday", unread: 0, online: false },
  { id: 4, name: "Prof. James Wilson", lastMsg: "I've reviewed your latest submission.", time: "Yesterday", unread: 0, online: false },
];

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [msg, setMsg] = useState("");

  return (
    <div className="h-[calc(100vh-160px)] flex glass-card overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-[var(--hub-border)] flex flex-col bg-[var(--hub-surface-2)]/30">
        <div className="p-4 border-b border-[var(--hub-border)]">
          <h1 className="text-xl font-bold text-[var(--hub-text)] mb-4">Messages</h1>
          <SearchInput 
            placeholder="Search messages..." 
            className="text-xs"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
          {DUMMY_CHATS.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 rounded-xl cursor-pointer transition-all flex gap-3 items-center group ${selectedChat?.id === chat.id ? "bg-sky-500/10 border border-sky-500/20" : "hover:bg-[var(--hub-surface-2)] border border-transparent"}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center text-xs font-bold text-sky-400 shrink-0">
                  {getInitials(chat.name)}
                </div>
                {chat.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--hub-surface)]"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="text-sm font-bold text-[var(--hub-text)] truncate">{chat.name}</p>
                  <span className="text-[10px] text-[var(--hub-text-muted)]">{chat.time}</span>
                </div>
                <p className="text-xs text-[var(--hub-text-muted)] truncate">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <span className="bg-sky-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-[var(--hub-surface)]">
                  {chat.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col bg-[var(--hub-surface-2)]/10">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-[var(--hub-border)] flex items-center justify-between bg-[var(--hub-surface)]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center text-xs font-bold text-sky-400">
                  {getInitials(selectedChat.name)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--hub-text)]">{selectedChat.name}</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{selectedChat.online ? "Online" : "Offline"}</p>
                </div>
              </div>
              <button className="p-2 text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-4">
              <div className="flex justify-center mb-6">
                <span className="text-[10px] font-bold text-[var(--hub-text-muted)] uppercase tracking-widest bg-[var(--hub-surface-2)] px-3 py-1 rounded-full">Today</span>
              </div>
              
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-lg bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center text-[10px] font-bold text-sky-400 shrink-0">
                  {getInitials(selectedChat.name)}
                </div>
                <div className="bg-[var(--hub-surface-2)] border border-[var(--hub-border)] p-3 rounded-2xl rounded-tl-none">
                  <p className="text-xs text-[var(--hub-text)] opacity-90 leading-relaxed">{selectedChat.lastMsg}</p>
                </div>
              </div>

              <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                <div className="bg-sky-500 p-3 rounded-2xl rounded-tr-none shadow-lg shadow-sky-500/20">
                  <p className="text-xs text-white leading-relaxed">Hey Alex! Thanks for the update. Let's discuss this further in our next session.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--hub-border)] bg-[var(--hub-surface)]/30">
              <div className="flex items-center gap-2">
                <button className="p-2 text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-colors">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="input-glass w-full pr-12 placeholder-[var(--hub-text-muted)]"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--hub-text-muted)] hover:text-[var(--hub-text)] transition-colors">
                    <Smile size={18} />
                  </button>
                </div>
                <button className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-16 h-16 rounded-3xl bg-[var(--hub-surface-2)] border border-[var(--hub-border)] flex items-center justify-center mb-6 text-[var(--hub-text-muted)]">
              <MessageCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-[var(--hub-text)] mb-2">Your Conversations</h2>
            <p className="text-[var(--hub-text-muted)] text-sm max-w-xs">Select a chat from the sidebar to start messaging your teammates and professors.</p>
          </div>
        )}
      </div>
    </div>
  );
}

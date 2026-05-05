import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) return formatDate(date);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateRoomId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join("_");
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  OPEN: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  IN_PROGRESS: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  COMPLETED: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  REJECTED: "text-red-400 bg-red-400/10 border-red-400/20",
  PENDING: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  APPROVED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export function apiError(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return Response.json(data, { status });
}

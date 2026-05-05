"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "PROFESSOR" | "ADMIN";
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
  _count?: { ideas: number; reviews: number; teamMembers: number };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "PROFESSOR";
  university?: string;
  department?: string;
  bio?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      fetchMe(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchMe(t: string) {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem("auth_token");
        setToken(null);
      }
    } catch {
      localStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("auth_token", data.token);
    setToken(data.token);
    setUser(data.user);

    // Redirect based on role
    const role = data.user.role.toLowerCase();
    if (role === "admin") router.push("/dashboard/admin");
    else if (role === "professor") router.push("/dashboard/professor");
    else router.push("/dashboard/student");
  }

  async function signup(signupData: SignupData) {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");

    localStorage.setItem("auth_token", data.token);
    setToken(data.token);
    setUser(data.user);

    const role = data.user.role.toLowerCase();
    if (role === "professor") router.push("/dashboard/professor");
    else router.push("/dashboard/student");
  }

  async function logout() {
    await fetch("/api/auth/me", { method: "DELETE" });
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  }

  function updateUser(data: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

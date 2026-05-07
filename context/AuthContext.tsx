"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
  createdAt?: string;
  _count?: { ideas: number; reviews: number; teamMembers: number };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
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

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      const accessToken = session?.access_token || null;
      setToken(accessToken);
      if (accessToken) {
        document.cookie = `auth_token=${accessToken}; path=/; max-age=${7*24*60*60}; SameSite=Lax`;
        if (session && session.user) {
          fetchProfile(session.user.id, session.user.email!);
        } else {
          setLoading(false);
        }
      } else {
        document.cookie = `auth_token=; path=/; max-age=0`;
        setLoading(false);
      }
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const accessToken = session?.access_token || null;
      setToken(accessToken);
      
      if (accessToken) {
        document.cookie = `auth_token=${accessToken}; path=/; max-age=${7*24*60*60}; SameSite=Lax`;
        if (session && session.user) {
          fetchProfile(session.user.id, session.user.email!);
        } else {
          setLoading(false);
        }
      } else {
        document.cookie = `auth_token=; path=/; max-age=0`;
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string, email: string) {
    try {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // If no profile is found, automatically create it
      if (error && error.code === "PGRST116") {
        const { data: newProfile, error: upsertError } = await supabase
          .from("profiles")
          .upsert({ id: userId, email: email, role: "STUDENT" })
          .select()
          .single();
          
        if (!upsertError) {
          data = newProfile;
          error = null;
        }
      } else if (error) {
        throw error;
      }
      
      if (data) {
        setUser({ ...data, name: data.full_name || data.name || "Student", email } as User);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Login failed");

    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    // Handle missing profile for existing users
    if (profileError && profileError.code === "PGRST116") {
      const { data: newProfile, error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: authData.user.id,
          email: authData.user.email,
          role: "STUDENT" // default role fallback
        })
        .select()
        .single();
        
      if (!upsertError) {
        profile = newProfile;
      }
    } else if (profileError) {
      console.error("Profile fetch error:", profileError);
      throw new Error("Could not fetch user profile");
    }

    const fullUser = { 
      ...profile, 
      name: profile?.full_name || profile?.name || "Student", 
      email: authData.user.email 
    } as User;
    
    setUser(fullUser);
    setToken(authData.session.access_token);
    return fullUser;
  }

  async function signup(signupData: SignupData): Promise<User> {
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Browser:", typeof window !== "undefined");

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: {
          name: signupData.name,
          full_name: signupData.name,
          role: signupData.role,
        }
      }
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error("User not returned from Supabase");
    }

    console.log("SIGNUP SUCCESS. SESSION:", authData.session ? "PRESENT" : "MISSING (Email confirmation may be enabled)");

    // If session is missing, it means the user must confirm their email first.
    // In this state, RLS will likely block the manual profile insert below.
    if (!authData.session) {
      console.warn("No session after signup. Profile creation might fail if RLS is enabled and email confirmation is required.");
    }

    // Insert into profiles
    // Note: If you applied the 'handle_new_user' trigger, this manual insert might 
    // fail with a duplicate key error, which is fine—it means the trigger worked!
    console.log("PREPARING PROFILE INSERT FOR ID:", authData.user.id);
    const profilePayload = {
      id: authData.user.id,
      email: signupData.email,
      name: signupData.name,
      full_name: signupData.name, 
      role: signupData.role,
      university: signupData.university || null,
      department: signupData.department || null,
      bio: signupData.bio || null,
    };
    
    const { data: profileResult, error: profileError } = await supabase
      .from("profiles")
      .upsert(profilePayload, { onConflict: "id" })
      .select()
      .single();

    if (profileError) {
      console.error("PROFILE SETUP FAILED:", profileError);
      throw new Error(`Account created, but profile setup failed: ${profileError.message}`);
    }

    console.log("PROFILE INSERT SUCCESS:", profileResult || "Created by trigger");

    const fullUser = { 
      id: authData.user.id,
      email: authData.user.email,
      name: signupData.name,
      role: signupData.role,
      university: signupData.university || null,
      department: signupData.department || null,
      bio: signupData.bio || null,
      skills: [],
      interests: []
    } as User;
    
    setUser(fullUser);
    setToken(authData.session?.access_token || null);
    return fullUser;
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
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

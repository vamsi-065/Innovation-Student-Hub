import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Student Innovation Hub - Where Ideas Take Flight",
  description:
    "The premier platform for students to share startup ideas, find collaborators, and get guidance from professors.",
  keywords: ["student innovation", "startup ideas", "collaboration", "university projects"],
  openGraph: {
    title: "Student Innovation Hub",
    description: "Where student ideas take flight",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased min-h-screen text-[var(--hub-text)] overflow-x-hidden`}
      >
        <ThemeProvider>
          <BackgroundGlow />
          <div className="fixed inset-0 z-0 pointer-events-none">
            <CursorGlow />
          </div>
          <AuthProvider>
            <div className="relative z-10 min-h-screen w-full bg-transparent">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

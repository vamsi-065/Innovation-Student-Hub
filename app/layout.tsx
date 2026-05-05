import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Innovation Hub — Where Ideas Take Flight",
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

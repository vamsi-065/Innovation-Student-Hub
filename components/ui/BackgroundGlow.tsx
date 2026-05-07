"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export const BackgroundGlow = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration check - only render futuristic elements if mounted and in dark mode
  if (!mounted || theme !== "dark") return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Futuristic Effects - ONLY IN DARK MODE */}
      <div className="absolute inset-0">
        {/* Subtle Grid / Mesh Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `linear-gradient(var(--hub-primary) 1px, transparent 1px), linear-gradient(to right, var(--hub-primary) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />

        {/* Premium Animated Glows */}
        <div className="absolute inset-0 opacity-20">
          {/* Primary Glow (Sky/Cyan) */}
          <motion.div
            animate={{
              x: [0, 150, 0],
              y: [0, 100, 0],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-sky-400/30 blur-[120px]"
          />

          {/* Secondary Glow (Indigo/Violet) */}
          <motion.div
            animate={{
              x: [0, -120, 0],
              y: [0, 150, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-[15%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/30 blur-[150px]"
          />

          {/* Accent Glow (Emerald) */}
          <motion.div
            animate={{
              x: [0, 80, 0],
              y: [0, -80, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-emerald-400/20 blur-[130px]"
          />
        </div>

        {/* Glassmorphism Smoothing Layer */}
        <div className="absolute inset-0 backdrop-blur-[100px] pointer-events-none opacity-50" />
      </div>
    </div>
  );
};

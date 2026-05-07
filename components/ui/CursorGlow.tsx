"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useVelocity, useTransform } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export function CursorGlow() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // subtle velocity scaling
  const xVelocity = useVelocity(cursorX);
  const velocityScale = useTransform(xVelocity, [-2500, 0, 2500], [1.03, 1, 1.03]);

  const mousePos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    setMounted(true);
    let animationFrameId: number;

    const handlePointerMove = (e: PointerEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const updatePosition = () => {
      const easing = 0.18;
      const currentX = cursorX.get();
      const currentY = cursorY.get();

      const dx = mousePos.current.x - currentX;
      const dy = mousePos.current.y - currentY;

      if (Math.abs(dx) > 0.05) cursorX.set(currentX + dx * easing);
      if (Math.abs(dy) > 0.05) cursorY.set(currentY + dy * easing);

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.closest("button") ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!mounted || theme !== "dark") return null;

  // 🔥 Bigger radius (spread more light)
  const spotlightSize = isHovering ? 580 : 420;

  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        scale: velocityScale,
      }}
    >
      {/* ✨ Enhanced Glow Layer */}
      <motion.div
        className="rounded-full"
        style={{
          width: spotlightSize,
          height: spotlightSize,

          // 🔥 Multi-layer smooth gradient (no harsh edge)
          background: `
            radial-gradient(circle,
              rgba(255,255,255,0.45) 0%,
              rgba(255,255,255,0.28) 15%,
              rgba(255,255,255,0.15) 30%,
              rgba(255,255,255,0.08) 45%,
              rgba(255,255,255,0.03) 60%,
              rgba(255,255,255,0.01) 75%,
              rgba(255,255,255,0.0) 100%
            )
          `,

          // 🔥 More diffusion (spread light naturally)
          filter: "blur(90px)",
        }}
        animate={{
          width: spotlightSize,
          height: spotlightSize,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 35,
        }}
      />
    </motion.div>
  );
}
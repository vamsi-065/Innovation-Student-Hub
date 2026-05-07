"use client";
import React, { forwardRef } from "react";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AuroraBackground = forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={`relative h-screen w-full overflow-x-hidden overflow-y-auto snap-y snap-mandatory scroll-smooth ${className}`}
        {...props}
      >
        {/* Content wrapper */}
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    );
  }
);
AuroraBackground.displayName = "AuroraBackground";

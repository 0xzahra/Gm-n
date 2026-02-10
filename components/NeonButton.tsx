
import React from "react";
import { motion } from "framer-motion";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: React.ReactNode;
  flashing?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ variant = "primary", children, className = "", flashing = false, ...props }) => {
  const baseStyles = "relative px-6 py-3 font-mono font-bold uppercase tracking-widest transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed clip-path-polygon touch-manipulation select-none";
  
  const variants = {
    // Primary: Green background, Black text. Hover: White background, Green text.
    primary: "bg-neo-green text-neo-black hover:bg-white hover:text-neo-green shadow-neon active:scale-[0.98]",
    // Secondary: Transparent with Green Border. Hover: Green background tint.
    secondary: "bg-neo-green/5 text-neo-green border border-neo-green/30 hover:border-neo-green hover:bg-neo-green/10 hover:shadow-neon active:scale-[0.98]",
    // Ghost: Minimalist
    ghost: "bg-transparent text-neo-green/70 hover:text-neo-green hover:bg-neo-green/5 active:scale-[0.98]",
    // Danger: Red tones
    danger: "bg-red-900/20 text-red-500 border border-red-500/50 hover:bg-red-500/20 active:scale-[0.98]",
  };

  const flashClass = flashing ? "animate-pulse-fast bg-white text-neo-green shadow-neon-strong" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${flashClass} hud-panel ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

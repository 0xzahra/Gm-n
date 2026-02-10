import React from "react";
import { motion } from "framer-motion";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ variant = "primary", children, className = "", ...props }) => {
  const baseStyles = "relative px-6 py-3 font-mono font-bold uppercase tracking-widest transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed clip-path-polygon";
  
  // HUD-like clip path styles are applied via className in parent usually, but we can fake it with borders here or just use square technical look.
  // The 'hud-panel' class from index.html handles the shape.

  const variants = {
    // text-neo-black ensures text is Black in Dark Mode (on Green) and White in Light Mode (on Dark Green)
    primary: "bg-neo-green text-neo-black hover:bg-white hover:text-neo-green shadow-neon hover:shadow-neon-strong hud-panel",
    secondary: "bg-neo-green/5 text-neo-green border border-neo-green/30 hover:border-neo-green hover:bg-neo-green/10 hover:shadow-neon hud-panel",
    ghost: "bg-transparent text-neo-green/70 hover:text-neo-green hover:bg-neo-green/5",
    danger: "bg-red-900/20 text-red-500 border border-red-500/50 hover:bg-red-500/20 hud-panel",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
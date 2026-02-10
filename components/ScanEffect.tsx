import React from "react";
import { motion } from "framer-motion";

export const ScanEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <motion.div
        className="w-full h-[2px] bg-neo-green shadow-[0_0_20px_#00FF41,0_0_10px_#00FF41]"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
        style={{ position: "absolute" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neo-green/5 to-transparent opacity-20" />
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neo-green" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neo-green" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neo-green" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neo-green" />
    </div>
  );
};

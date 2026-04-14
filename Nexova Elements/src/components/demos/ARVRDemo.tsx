"use client";

import { motion } from "framer-motion";

interface ARVRDemoProps {
  gridColor?: string;
  objectColor?: string;
  text?: string;
}

export default function ARVRDemo(props: ARVRDemoProps) {
  return <ARVRImplementation {...props} />;
}

export function ARVRImplementation({
  gridColor = "#333333",
  objectColor = "#10b981",
  text = "AR OBJECT",
}: ARVRDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-black rounded-lg relative overflow-hidden flex items-center justify-center perspective-1000">
      {/* Grid Floor */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          transform: "rotateX(60deg) scale(2)",
          transformOrigin: "center 80%",
        }}
      />

      {/* Floating AR Card */}
      <motion.div
        className="w-40 h-24 bg-black/50 border backdrop-blur-sm rounded-lg flex items-center justify-center relative z-10"
        style={{ borderColor: objectColor }}
        animate={{
          y: [-10, 10, -10],
          rotateX: [0, 5, 0],
          rotateY: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono" style={{ color: objectColor }}>
          {text}
        </div>
        <div className="w-2 h-2 rounded-full animate-ping absolute top-2 right-2" style={{ backgroundColor: objectColor }} />
        <span className="font-bold tracking-widest" style={{ color: objectColor }}>DATA</span>
        
        {/* Connecting Lines */}
        <div 
          className="absolute top-full left-1/2 w-px h-20" 
          style={{ background: `linear-gradient(to bottom, ${objectColor}, transparent)` }}
        />
      </motion.div>
    </div>
  );
}

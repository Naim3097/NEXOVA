"use client";

import { motion } from "framer-motion";

interface LogoMarqueeDemoProps {
  speed?: number;
  textColor?: string;
  gradientColor?: string;
  logos?: string[];
}

export default function LogoMarqueeDemo(props: LogoMarqueeDemoProps) {
  return <LogoMarqueeImplementation {...props} />;
}

export function LogoMarqueeImplementation({
  speed = 20,
  textColor = "#3f3f46",
  gradientColor = "#18181b",
  logos = ["Acme", "Globex", "Soylent", "Initech", "Umbrella", "Stark", "Wayne"],
}: LogoMarqueeDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center overflow-hidden relative">
      <div 
        className="absolute inset-y-0 left-0 w-20 z-10"
        style={{ background: `linear-gradient(to right, ${gradientColor}, transparent)` }}
      />
      <div 
        className="absolute inset-y-0 right-0 w-20 z-10"
        style={{ background: `linear-gradient(to left, ${gradientColor}, transparent)` }}
      />
      
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="text-2xl font-bold uppercase tracking-widest"
            style={{ color: textColor }}
          >
            {logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

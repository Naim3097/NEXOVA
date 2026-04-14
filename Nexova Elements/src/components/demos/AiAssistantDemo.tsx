"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AiAssistantDemo(props: any) {
  return <AiAssistantImplementation {...props} />;
}

export function AiAssistantImplementation({
  primaryColor = "#06b6d4",
  secondaryColor = "#a855f7",
}: any) {
  const [bars, setBars] = useState<Array<{height: number[], duration: number, delay: number}>>([]);

  useEffect(() => {
    // eslint-disable-next-line
    setBars([...Array(5)].map((_, i) => ({
      height: [20, Math.random() * 60 + 30, 20],
      duration: 0.5 + Math.random() * 0.5,
      delay: i * 0.1
    })));
  }, []);

  return (
    <div className="w-full h-full min-h-[200px] bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
      {/* Core */}
      <div className="w-16 h-16 bg-white/10 rounded-full blur-xl absolute" />
      
      <div className="flex items-center justify-center gap-1">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full"
            style={{ background: `linear-gradient(to top, ${primaryColor}, ${secondaryColor})` }}
            animate={{
              height: bar.height,
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: bar.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: bar.delay,
            }}
          />
        ))}
      </div>

      {/* Ambient Glow */}
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        style={{ background: `linear-gradient(to right, ${primaryColor}1A, ${secondaryColor}1A)` }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

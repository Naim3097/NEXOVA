"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AmbientBackgroundDemo(props: any) {
  return <AmbientBackgroundImplementation {...props} />;
}

export function AmbientBackgroundImplementation({
  color1 = "#a855f7",
  color2 = "#3b82f6",
  particleCount = 5,
}: any) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    setParticles(
      [...Array(particleCount)].map((_, i) => ({
        id: i,
        color: i % 2 === 0 ? color1 : color2,
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        duration: 10 + Math.random() * 10,
      }))
    );
  }, [particleCount, color1, color2]);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[200px] bg-black rounded-lg relative overflow-hidden flex items-center justify-center">
        <span className="text-white/80 font-light tracking-widest uppercase text-sm">Ambient</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] bg-black rounded-lg relative overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full mix-blend-screen filter blur-xl opacity-50"
          style={{
            background: p.color,
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
          }}
          animate={{
            x: [0, p.x, 0],
            y: [0, p.y, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/80 font-light tracking-widest uppercase text-sm">Ambient</span>
      </div>
    </div>
  );
}

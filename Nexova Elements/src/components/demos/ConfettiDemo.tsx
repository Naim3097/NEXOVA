"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ConfettiDemoProps {
  buttonText?: string;
  particleCount?: number;
  colors?: string[];
}

export default function ConfettiDemo(props: ConfettiDemoProps) {
  return <ConfettiImplementation {...props} />;
}

export function ConfettiImplementation({
  buttonText = "Celebrate!",
  particleCount = 30,
  colors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"],
}: ConfettiDemoProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const explode = () => {
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <div className="relative">
        <button
          onClick={explode}
          className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-transform"
        >
          {buttonText}
        </button>
        
        {particles.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 1 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ backgroundColor: p.color }}
            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full pointer-events-none"
          />
        ))}
      </div>
    </div>
  );
}

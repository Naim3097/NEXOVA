"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AudioVisualizerDemoProps {
  barColorStart?: string;
  barColorEnd?: string;
  barCount?: number;
}

export default function AudioVisualizerDemo(props: AudioVisualizerDemoProps) {
  return <AudioVisualizerImplementation {...props} />;
}

export function AudioVisualizerImplementation({
  barColorStart = "#6366f1",
  barColorEnd = "#a855f7",
  barCount = 20,
}: AudioVisualizerDemoProps) {
  const [bars, setBars] = useState(new Array(barCount).fill(10));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      setBars(new Array(barCount).fill(10));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => {
        const newBars = [...prev];
        // If barCount changed, resize array
        if (newBars.length !== barCount) {
            return new Array(barCount).fill(10).map(() => Math.random() * 80 + 10);
        }
        return newBars.map(() => Math.random() * 80 + 10);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center bg-zinc-900 gap-8">
      <div className="flex items-end justify-center gap-1 h-32">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-t-full"
            style={{ background: `linear-gradient(to top, ${barColorStart}, ${barColorEnd})` }}
            animate={{ height: `${height}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        ))}
      </div>
      
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`px-6 py-2 rounded-full font-medium transition-all ${
          isPlaying 
            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
            : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
        }`}
      >
        {isPlaying ? "Stop Simulation" : "Start Simulation"}
      </button>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

interface AudioWaveformDemoProps {
  barColor?: string;
  barCount?: number;
}

export default function AudioWaveformDemo(props: AudioWaveformDemoProps) {
  return <AudioWaveformImplementation {...props} />;
}

export function AudioWaveformImplementation({
  barColor = "#ec4899",
  barCount = 20,
}: AudioWaveformDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center gap-1">
      {[...Array(barCount)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full"
          style={{ backgroundColor: barColor }}
          animate={{
            height: [10, 10 + Math.sin(i) * 20 + 20, 10],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

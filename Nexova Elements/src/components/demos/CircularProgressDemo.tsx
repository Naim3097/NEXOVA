"use client";

import { motion } from "framer-motion";

interface CircularProgressDemoProps {
  progress?: number;
  progressColor?: string;
  trackColor?: string;
  textColor?: string;
  size?: number;
  strokeWidth?: number;
}

export default function CircularProgressDemo(props: CircularProgressDemoProps) {
  return <CircularProgressImplementation {...props} />;
}

export function CircularProgressImplementation({
  progress = 75,
  progressColor = "#10b981",
  trackColor = "#27272a",
  textColor = "#ffffff",
  size = 128,
  strokeWidth = 8,
}: CircularProgressDemoProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: textColor }}>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

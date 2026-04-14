"use client";

import { motion, Variants } from "framer-motion";

interface SelfDrawingDemoProps {
  color1?: string;
  color2?: string;
  color3?: string;
}

export default function SelfDrawingDemo(props: SelfDrawingDemoProps) {
  return <SelfDrawingImplementation {...props} />;
}

export function SelfDrawingImplementation({
  color1 = "#ff0088",
  color2 = "#4ff0b7",
  color3 = "#0d63f8",
}: SelfDrawingDemoProps) {
  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
      const delay = 1 + i * 0.5;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
          opacity: { delay, duration: 0.01 }
        }
      };
    }
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-950 rounded-lg flex items-center justify-center">
      <motion.svg
        width="150"
        height="150"
        viewBox="0 0 600 600"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          stroke={color1}
          variants={draw}
          custom={1}
          className="stroke-[10px] fill-transparent"
        />
        <motion.line
          x1="220"
          y1="30"
          x2="360"
          y2="170"
          stroke={color2}
          variants={draw}
          custom={2}
          className="stroke-[10px] fill-transparent"
        />
        <motion.line
          x1="220"
          y1="170"
          x2="360"
          y2="30"
          stroke={color2}
          variants={draw}
          custom={2.5}
          className="stroke-[10px] fill-transparent"
        />
        <motion.rect
          width="140"
          height="140"
          x="410"
          y="30"
          rx="20"
          stroke={color3}
          variants={draw}
          custom={3}
          className="stroke-[10px] fill-transparent"
        />
        <motion.circle
          cx="100"
          cy="300"
          r="80"
          stroke={color3}
          variants={draw}
          custom={4}
          className="stroke-[10px] fill-transparent"
        />
        <motion.line
          x1="220"
          y1="230"
          x2="360"
          y2="370"
          stroke={color1}
          variants={draw}
          custom={5}
          className="stroke-[10px] fill-transparent"
        />
        <motion.line
          x1="220"
          y1="370"
          x2="360"
          y2="230"
          stroke={color1}
          variants={draw}
          custom={5.5}
          className="stroke-[10px] fill-transparent"
        />
        <motion.rect
          width="140"
          height="140"
          x="410"
          y="230"
          rx="20"
          stroke={color2}
          variants={draw}
          custom={6}
          className="stroke-[10px] fill-transparent"
        />
      </motion.svg>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

interface HoverDemoProps {
  text?: string;
  hoverColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function Hover({ text = "Hover Me", hoverColor = "#9333ea", backgroundColor = "#ffffff", textColor = "#000000" }: HoverDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <motion.button
        className="px-8 py-4 font-bold rounded-full relative overflow-hidden group"
        style={{ backgroundColor, color: textColor }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
          {text}
        </span>
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: hoverColor }}
          initial={{ x: "-100%" }}
          whileHover={{ x: 0 }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
        />
      </motion.button>
    </div>
  );
}

export default function HoverDemo(props: HoverDemoProps) {
  return <Hover {...props} />;
}

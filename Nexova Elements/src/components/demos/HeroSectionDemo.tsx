"use client";

import { motion } from "framer-motion";

interface HeroSectionDemoProps {
  titleGradientStart?: string;
  titleGradientEnd?: string;
  buttonBg?: string;
  buttonText?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export default function HeroSectionDemo(props: HeroSectionDemoProps) {
  return <HeroSectionImplementation {...props} />;
}

export function HeroSectionImplementation({
  titleGradientStart = "#c084fc",
  titleGradientEnd = "#db2777",
  buttonBg = "#ffffff",
  buttonText = "#000000",
  title = "Next Gen Design",
  subtitle = "Experience the future of digital interaction today.",
  ctaText = "Get Started",
}: HeroSectionDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-zinc-900 to-black rounded-lg flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold text-white mb-2">
          {title.split(" ").slice(0, -1).join(" ")} <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${titleGradientStart}, ${titleGradientEnd})` }}>{title.split(" ").slice(-1)}</span>
        </h3>
      </motion.div>
      
      <motion.p
        className="text-zinc-400 text-xs mb-6 max-w-[200px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {subtitle}
      </motion.p>
      
      <motion.button
        className="px-6 py-2 rounded-full text-xs font-bold"
        style={{ backgroundColor: buttonBg, color: buttonText }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {ctaText}
      </motion.button>
    </div>
  );
}

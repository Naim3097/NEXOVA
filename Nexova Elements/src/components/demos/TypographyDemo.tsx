"use client";

import { motion } from "framer-motion";

interface TypographyDemoProps {
  text?: string;
  textColor?: string;
  hoverColor?: string;
}

export default function TypographyDemo(props: TypographyDemoProps) {
  return <TypographyImplementation {...props} />;
}

export function TypographyImplementation({
  text = "VIBE DESIGN",
  textColor = "#ffffff",
  hoverColor = "#a855f7",
}: TypographyDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-black rounded-lg flex items-center justify-center overflow-hidden">
      <div className="flex overflow-hidden">
        {text.split("").map((char: string, i: number) => (
          <motion.span
            key={i}
            className="text-4xl font-black inline-block"
            style={{ color: textColor }}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.05,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.2,
              color: hoverColor,
              transition: { duration: 0.2 }
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

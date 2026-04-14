"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterDemoProps {
  text?: string;
  speed?: number;
  cursorColor?: string;
}

export default function TypewriterDemo(props: TypewriterDemoProps) {
  return <TypewriterImplementation {...props} />;
}

export function TypewriterImplementation({
  text = "Building the future of web design.",
  speed = 100,
  cursorColor = "#3b82f6",
}: TypewriterDemoProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center p-8">
      <div className="text-2xl font-mono text-white">
        {displayedText}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-3 h-6 ml-1 align-middle"
          style={{ backgroundColor: cursorColor }}
        />
      </div>
    </div>
  );
}

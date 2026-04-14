"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

interface TextScrambleDemoProps {
  text?: string;
  speed?: number;
  color?: string;
}

export default function TextScrambleDemo(props: TextScrambleDemoProps) {
  return <TextScrambleImplementation {...props} />;
}

export function TextScrambleImplementation({
  text = "CYBERPUNK",
  speed = 30,
  color = "#22c55e",
}: TextScrambleDemoProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev: string) =>
        text
          .split("")
          .map((letter: string, index: number) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <div 
        className="font-mono text-4xl font-bold tracking-widest"
        style={{ color }}
      >
        {displayText}
      </div>
    </div>
  );
}

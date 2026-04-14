"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CodeTypingDemoProps {
  code?: string;
  keywordColor?: string;
  functionColor?: string;
  cursorColor?: string;
}

export default function CodeTypingDemo(props: CodeTypingDemoProps) {
  return <CodeTypingImplementation {...props} />;
}

export function CodeTypingImplementation({
  code = `function optimize() {
  const data = await fetch('/api');
  return data.json();
}`,
  keywordColor = "#60a5fa",
  functionColor = "#facc15",
  cursorColor = "#60a5fa",
}: CodeTypingDemoProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < code.length) {
        setText(code.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          i = 0;
          setText("");
        }, 3000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [code]);

  return (
    <div className="w-full h-full min-h-[200px] bg-[#1e1e1e] rounded-lg p-6 font-mono text-sm overflow-hidden relative">
      <div className="flex gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      
      <div className="text-gray-300 whitespace-pre">
        <span style={{ color: keywordColor }}>function</span>{" "}
        <span style={{ color: functionColor }}>optimize</span>() {"{"}
        {"\n"}
        {text.split("\n").slice(1).join("\n")}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 ml-1 align-middle"
          style={{ backgroundColor: cursorColor }}
        />
      </div>
    </div>
  );
}

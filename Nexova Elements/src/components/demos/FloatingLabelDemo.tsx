"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface FloatingLabelDemoProps {
  label?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export default function FloatingLabelDemo(props: FloatingLabelDemoProps) {
  return <FloatingLabelImplementation {...props} />;
}

export function FloatingLabelImplementation({
  label = "Email Address",
  activeColor = "#60a5fa",
  inactiveColor = "#71717a",
}: FloatingLabelDemoProps) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <div className="relative w-64">
        <motion.label
          initial={false}
          animate={{
            y: focused || value ? -24 : 0,
            scale: focused || value ? 0.85 : 1,
            color: focused ? activeColor : inactiveColor,
          }}
          className="absolute left-0 top-2 origin-left pointer-events-none"
        >
          {label}
        </motion.label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-b-2 border-zinc-700 py-2 text-white outline-none transition-colors"
          style={{ borderColor: focused ? activeColor : undefined }}
        />
      </div>
    </div>
  );
}

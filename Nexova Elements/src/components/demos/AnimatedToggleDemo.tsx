"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedToggleDemoProps {
  activeColor?: string;
  inactiveColor?: string;
  onToggle?: (isOn: boolean) => void;
}

export default function AnimatedToggleDemo(props: AnimatedToggleDemoProps) {
  return <AnimatedToggleImplementation {...props} />;
}

export function AnimatedToggleImplementation({
  activeColor = "#22c55e",
  inactiveColor = "#3f3f46",
  onToggle,
}: AnimatedToggleDemoProps) {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <div
        className="w-16 h-9 rounded-full p-1 cursor-pointer transition-colors duration-300"
        style={{ backgroundColor: isOn ? activeColor : inactiveColor }}
        onClick={handleToggle}
      >
        <motion.div
          className="w-7 h-7 bg-white rounded-full shadow-md"
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          animate={{ x: isOn ? 28 : 0 }}
        />
      </div>
    </div>
  );
}

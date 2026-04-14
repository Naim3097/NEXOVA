"use client";

import { motion } from "framer-motion";

interface NeumorphicDemoProps {
  baseColor?: string;
  shadowDark?: string;
  shadowLight?: string;
}

export default function NeumorphicDemo(props: NeumorphicDemoProps) {
  return <NeumorphicImplementation {...props} />;
}

export function NeumorphicImplementation({
  baseColor = "#e0e5ec",
  shadowDark = "rgba(163, 177, 198, 0.6)",
  shadowLight = "rgba(255, 255, 255, 0.5)",
}: NeumorphicDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] rounded-lg flex items-center justify-center text-zinc-600" style={{ backgroundColor: baseColor }}>
      <motion.div
        className="w-32 h-32 rounded-[30px] flex items-center justify-center"
        style={{
          backgroundColor: baseColor,
          boxShadow: `9px 9px 16px ${shadowDark}, -9px -9px 16px ${shadowLight}`
        }}
        animate={{
          boxShadow: [
            `9px 9px 16px ${shadowDark}, -9px -9px 16px ${shadowLight}`,
            `inset 6px 6px 10px 0 ${shadowDark}, inset -6px -6px 10px 0 ${shadowLight}`,
            `9px 9px 16px ${shadowDark}, -9px -9px 16px ${shadowLight}`
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="font-bold text-lg">Soft UI</span>
      </motion.div>
    </div>
  );
}

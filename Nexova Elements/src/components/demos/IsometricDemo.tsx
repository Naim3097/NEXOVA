"use client";

import { motion } from "framer-motion";

interface IsometricDemoProps {
  topColor?: string;
  sideColor1?: string;
  sideColor2?: string;
}

export default function IsometricDemo(props: IsometricDemoProps) {
  return <IsometricImplementation {...props} />;
}

export function IsometricImplementation({
  topColor = "#3b82f6",
  sideColor1 = "#60a5fa",
  sideColor2 = "#2563eb",
}: IsometricDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Isometric Grid Container */}
        <motion.div
          className="relative w-20 h-20"
          style={{ transform: "rotateX(60deg) rotateZ(-45deg)" }}
        >
          {/* Block 1 */}
          <motion.div
            className="absolute w-full h-full shadow-lg"
            style={{ backgroundColor: topColor }}
            animate={{ z: [0, 40, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
             <div className="absolute inset-0 origin-bottom -rotate-x-90 translate-y-full h-10" style={{ backgroundColor: sideColor1 }} />
             <div className="absolute inset-0 origin-right -rotate-y-90 translate-x-full w-10" style={{ backgroundColor: sideColor2 }} />
          </motion.div>
          
          {/* Block 2 (Shadow) */}
          <motion.div
            className="absolute w-full h-full bg-black/50 blur-md -z-10"
            animate={{ scale: [1, 0.8, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}

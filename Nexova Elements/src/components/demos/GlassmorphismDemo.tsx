"use client";

import { motion } from "framer-motion";

interface GlassmorphismDemoProps {
  blobColor1?: string;
  blobColor2?: string;
  glassColor?: string;
}

export default function GlassmorphismDemo(props: GlassmorphismDemoProps) {
  return <GlassmorphismImplementation {...props} />;
}

export function GlassmorphismImplementation({
  blobColor1 = "#a855f7",
  blobColor2 = "#3b82f6",
  glassColor = "rgba(255, 255, 255, 0.1)",
}: GlassmorphismDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg relative overflow-hidden flex items-center justify-center">
      {/* Background Blobs */}
      <motion.div
        className="absolute w-32 h-32 rounded-full top-10 left-10 blur-xl"
        style={{ backgroundColor: blobColor1 }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-40 h-40 rounded-full bottom-10 right-10 blur-xl"
        style={{ backgroundColor: blobColor2 }}
        animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Glass Card */}
      <motion.div
        className="w-48 h-32 rounded-xl border border-white/20 shadow-xl backdrop-blur-md flex flex-col items-center justify-center p-4 z-10"
        style={{ backgroundColor: glassColor }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 mb-2" />
        <div className="w-24 h-2 rounded bg-white/20 mb-1" />
        <div className="w-16 h-2 rounded bg-white/20" />
      </motion.div>
    </div>
  );
}

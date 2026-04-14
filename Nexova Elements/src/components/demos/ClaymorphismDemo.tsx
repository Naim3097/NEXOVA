"use client";

import { motion } from "framer-motion";

interface ClaymorphismDemoProps {
  text?: string;
}

export default function ClaymorphismDemo({ text = "Clay Button" }: ClaymorphismDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-[#f0f4f8] rounded-lg flex items-center justify-center">
      <motion.button
        className="px-8 py-4 bg-[#f0f4f8] rounded-[20px] text-slate-600 font-bold text-lg"
        style={{
          boxShadow: "inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff, 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff"
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {text}
      </motion.button>
    </div>
  );
}

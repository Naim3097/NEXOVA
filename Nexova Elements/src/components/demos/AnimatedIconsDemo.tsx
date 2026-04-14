"use client";

import { motion } from "framer-motion";
import { Bell, Home, Settings } from "lucide-react";

export default function AnimatedIconsDemo(props: any) {
  return <AnimatedIconsImplementation {...props} />;
}

export function AnimatedIconsImplementation({
  icon1Color = "#60a5fa",
  icon2Color = "#facc15",
  icon3Color = "#34d399",
}: any) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center gap-8">
      <motion.div
        whileHover={{ scale: 1.2, rotate: 15 }}
        className="p-3 bg-zinc-800 rounded-lg cursor-pointer"
      >
        <Home className="w-6 h-6" style={{ color: icon1Color }} />
      </motion.div>
      
      <motion.div
        whileHover={{ rotate: [0, -20, 20, -20, 20, 0] }}
        transition={{ duration: 0.5 }}
        className="p-3 bg-zinc-800 rounded-lg cursor-pointer"
      >
        <Bell className="w-6 h-6" style={{ color: icon2Color }} />
      </motion.div>

      <motion.div
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.5 }}
        className="p-3 bg-zinc-800 rounded-lg cursor-pointer"
      >
        <Settings className="w-6 h-6" style={{ color: icon3Color }} />
      </motion.div>
    </div>
  );
}

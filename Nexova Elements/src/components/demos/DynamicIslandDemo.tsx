"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Bell, Check } from "lucide-react";

interface DynamicIslandDemoProps {
  backgroundColor?: string;
  activeColor?: string;
  textColor?: string;
  title?: string;
  subtitle?: string;
}

export default function DynamicIslandDemo(props: DynamicIslandDemoProps) {
  return <DynamicIslandImplementation {...props} />;
}

export function DynamicIslandImplementation({
  backgroundColor = "#000000",
  activeColor = "#22c55e",
  textColor = "#ffffff",
  title = "Notification",
  subtitle = "Just now",
}: DynamicIslandDemoProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <motion.div
        layout
        onClick={() => setExpanded(!expanded)}
        className="rounded-[24px] cursor-pointer overflow-hidden relative z-10"
        style={{ backgroundColor }}
        initial={{ width: 120, height: 36 }}
        animate={{
          width: expanded ? 300 : 120,
          height: expanded ? 80 : 36,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeColor }} />
              <span className="text-xs font-medium" style={{ color: textColor }}>Active</span>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-between px-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5" style={{ color: textColor }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold" style={{ color: textColor }}>{title}</span>
                  <span className="text-zinc-400 text-xs">{subtitle}</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-black" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedTabsDemoProps {
  tabs?: string[];
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
}

export default function AnimatedTabsDemo(props: AnimatedTabsDemoProps) {
  return <AnimatedTabsImplementation {...props} />;
}

export function AnimatedTabsImplementation({
  tabs = ["Account", "Security", "Billing", "Notifications"],
  activeColor = "#ffffff",
  inactiveColor = "#a1a1aa",
  backgroundColor = "#3f3f46",
}: AnimatedTabsDemoProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <div className="flex space-x-1 p-1 rounded-xl" style={{ backgroundColor: `${backgroundColor}80` }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-4 py-2 text-sm font-medium transition-colors outline-none"
            style={{ color: activeTab === tab ? activeColor : inactiveColor }}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

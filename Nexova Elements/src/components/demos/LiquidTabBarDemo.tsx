"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Home, Search, User, Settings, Heart } from "lucide-react";

interface Tab {
  id: string;
  icon: any;
  label: string;
}

interface LiquidTabBarDemoProps {
  barBg?: string;
  activeBg?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  tabs?: Tab[];
}

export default function LiquidTabBarDemo(props: LiquidTabBarDemoProps) {
  return <LiquidTabBarImplementation {...props} />;
}

export function LiquidTabBarImplementation({
  barBg = "#000000",
  activeBg = "#ffffff",
  activeTextColor = "#000000",
  inactiveTextColor = "#71717a",
  tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "likes", icon: Heart, label: "Likes" },
    { id: "search", icon: Search, label: "Search" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "profile", icon: User, label: "Profile" },
  ],
}: LiquidTabBarDemoProps) {
  const [activeTab, setActiveTab] = useState(tabs[2].id);

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-zinc-900">
      <div 
        className="px-2 py-2 rounded-full flex items-center gap-2 relative"
        style={{ backgroundColor: barBg }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-4 py-3 rounded-full text-sm font-medium transition-colors duration-300 z-10 flex items-center justify-center"
            style={{ color: activeTab === tab.id ? activeTextColor : inactiveTextColor }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-full -z-10"
                style={{ backgroundColor: activeBg }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <tab.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
}

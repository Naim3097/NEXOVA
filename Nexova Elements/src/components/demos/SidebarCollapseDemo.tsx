"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Home, Settings, Users, Menu } from "lucide-react";

interface SidebarCollapseDemoProps {
  expandedWidth?: number;
  collapsedWidth?: number;
  backgroundColor?: string;
  menuItems?: { icon: any; label: string }[];
}

export default function SidebarCollapseDemo(props: SidebarCollapseDemoProps) {
  return <SidebarCollapseImplementation {...props} />;
}

export function SidebarCollapseImplementation({
  expandedWidth = 200,
  collapsedWidth = 60,
  backgroundColor = "#27272a",
  menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: Users, label: "Users" },
    { icon: Settings, label: "Settings" },
  ],
}: SidebarCollapseDemoProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex overflow-hidden">
      <motion.div
        animate={{ width: isCollapsed ? collapsedWidth : expandedWidth }}
        className="h-full border-r border-zinc-700 flex flex-col"
        style={{ backgroundColor }}
      >
        <div className="p-4 flex items-center justify-between border-b border-zinc-700">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-white"
            >
              Admin
            </motion.span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-zinc-700 rounded"
          >
            <Menu className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
        
        <div className="flex-1 p-2 space-y-1">
          {menuItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-700 cursor-pointer text-zinc-300 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5 min-w-[20px]" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
      
      <div className="flex-1 bg-zinc-900 p-8 flex items-center justify-center text-zinc-700">
        Content Area
      </div>
    </div>
  );
}

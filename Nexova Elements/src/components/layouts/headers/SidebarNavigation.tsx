"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, BarChart2, Users, Settings, LogOut, Menu, X } from "lucide-react";

export default function SidebarNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-[600px] bg-zinc-950 border border-white/10 rounded-xl overflow-hidden relative">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isCollapsed ? 80 : 250 }}
        className="bg-black border-r border-white/10 flex flex-col z-10"
      >
        <div className="h-20 flex items-center px-6 border-b border-white/10 justify-between">
          {!isCollapsed && <span className="font-bold text-white text-xl">DASH.</span>}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-zinc-400 hover:text-white"
          >
            {isCollapsed ? <Menu className="w-5 h-5 mx-auto" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {[
            { icon: Home, label: "Dashboard" },
            { icon: BarChart2, label: "Analytics" },
            { icon: Users, label: "Customers" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-4 px-4 py-3 text-zinc-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors group"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap opacity-100 transition-opacity">
                  {item.label}
                </span>
              )}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Content Area Placeholder */}
      <main className="flex-1 bg-zinc-900/50 p-8 overflow-y-auto">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-black border border-white/10 rounded-xl p-6">
                <div className="w-8 h-8 bg-zinc-800 rounded-full mb-4" />
                <div className="h-4 w-24 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
          <div className="h-64 bg-black border border-white/10 rounded-xl p-6">
             <div className="h-full w-full bg-zinc-800/20 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center text-zinc-500">
               Chart Area
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

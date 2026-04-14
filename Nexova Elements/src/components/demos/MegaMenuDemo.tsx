"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface MegaMenuDemoProps {
  menuBg?: string;
  highlightColor?: string;
  textColor?: string;
  items?: { title: string; description: string }[];
}

export default function MegaMenuDemo(props: MegaMenuDemoProps) {
  return <MegaMenuImplementation {...props} />;
}

export function MegaMenuImplementation({
  menuBg = "#27272a",
  highlightColor = "#3b82f6",
  textColor = "#ffffff",
  items = [
    { title: "Feature 1", description: "Description for feature 1" },
    { title: "Feature 2", description: "Description for feature 2" },
    { title: "Feature 3", description: "Description for feature 3" },
    { title: "Feature 4", description: "Description for feature 4" },
  ],
}: MegaMenuDemoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg p-8 relative">
      <nav className="flex justify-center">
        <div
          className="relative"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button className="flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors">
            Products <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[300px] rounded-xl border border-zinc-700 shadow-2xl p-4 z-20"
                style={{ backgroundColor: menuBg }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 1) * 0.05 }}
                      className="group cursor-pointer"
                    >
                      <div 
                        className="h-6 w-6 rounded-lg mb-2 transition-colors"
                        style={{ backgroundColor: "#3f3f46" }} // Default zinc-700
                      >
                        <div 
                          className="w-full h-full rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: highlightColor }}
                        />
                      </div>
                      <h4 className="text-xs font-bold mb-1" style={{ color: textColor }}>{item.title}</h4>
                      <p className="text-[10px] text-zinc-400">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { LayoutItem } from "@/data/layouts";
import { ArrowRight, Maximize2, Code } from "lucide-react";
import { useState } from "react";

interface LayoutCardProps {
  layout: LayoutItem;
  index: number;
}

export default function LayoutCard({ layout, index }: LayoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden hover:border-[#5FC7CD]/50 shadow-sm hover:shadow-md transition-all duration-300 ${
        layout.gridSize === "full" ? "md:col-span-2 lg:col-span-3" : ""
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#E2E8F0] flex items-start justify-between bg-white z-10 relative">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#5BC0BE]/10 text-xs font-medium text-[#5BC0BE]">
              {layout.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#455263] mb-1">{layout.title}</h3>
          <p className="text-gray-500 text-sm">{layout.description}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#455263] hover:border-[#5FC7CD] hover:text-[#5FC7CD] transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area — [transform:translateZ(0)] creates a new containing block
           so any position:fixed children inside layout components stay within
           the card and don't escape to cover the page navbar */}
      <div className={`relative bg-black overflow-hidden transition-all duration-500 [transform:translateZ(0)] ${
        isExpanded ? "h-[80vh]" : "h-[400px]"
      }`}>
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
          <div className="min-h-full relative">
             {/* We wrap the component in a div that isolates it somewhat. 
                 For fixed elements like headers, this might still be tricky without an iframe, 
                 but we'll assume the components are built to be flexible or we'd use a specific preview wrapper.
                 For now, we render it directly.
             */}
             <layout.component />
          </div>
        </div>
        
        {/* Overlay for non-expanded state to indicate scrollability/interaction */}
        {!isExpanded && (
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none" />
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
        <button className="text-sm font-medium text-gray-500 hover:text-[#5FC7CD] transition-colors flex items-center gap-2">
          <Code className="w-4 h-4" /> View Code
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
          Use Layout <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

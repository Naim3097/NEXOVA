"use client";

import React from "react";
import Image from "next/image";

interface HotspotItem {
  id: number | string;
  top: string;
  left: string;
  title: string;
  description: string;
}

interface HotspotWidgetProps {
  image?: string;
  animation?: "expand" | "soft-beat" | "overlay";
  hotspots?: HotspotItem[];
}

export default function HotspotWidget({
  image = "https://picsum.photos/seed/hotspot/800/600",
  animation = "expand",
  hotspots = [
    { id: 1, top: "30%", left: "25%", title: "Smart Lens", description: "High resolution capture with AI enhancement." },
    { id: 2, top: "65%", left: "70%", title: "Ergonomic Grip", description: "Designed for comfort during long sessions." },
    { id: 3, top: "45%", left: "55%", title: "Touch Display", description: "Responsive OLED screen for instant feedback." },
  ],
}: HotspotWidgetProps) {
  return (
    <div className="relative w-full rounded-lg overflow-hidden aspect-video bg-gray-100 group/container shadow-lg">
      <Image 
        src={image} 
        alt="Hotspot Base" 
        fill 
        className="object-cover transition-transform duration-700 group-hover/container:scale-105"
      />
      
      {hotspots.map((spot) => (
        <div 
          key={spot.id}
          className="absolute group cursor-pointer z-10"
          style={{ top: spot.top, left: spot.left }}
        >
          {/* Hotspot Dot */}
          <div className="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-blue-600 rounded-full relative z-10 shadow-sm border-2 border-white transition-transform duration-300 group-hover:scale-125"></div>
            <div className={`absolute inset-0 bg-blue-600 rounded-full ${animation === "expand" ? "animate-ping" : "animate-pulse"} opacity-75`}></div>
            {animation === "overlay" && <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30 delay-75"></div>}
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white/95 backdrop-blur-sm text-gray-800 text-sm p-4 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 transform translate-y-4 scale-95 group-hover:translate-y-0 group-hover:scale-100 origin-bottom">
            <h4 className="font-bold mb-1 text-gray-900 border-b border-gray-100 pb-1">{spot.title}</h4>
            <p className="text-gray-600 leading-relaxed text-xs mt-1">{spot.description}</p>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/95"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

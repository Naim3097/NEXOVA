"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RefreshCw, Settings, AlertCircle } from "lucide-react";

// Add type definition for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': any;
    }
  }
}

interface LottieWidgetProps {
  source?: string;
  loop?: boolean;
  speed?: number;
  autoplay?: boolean;
}

export default function LottieWidget({
  source = "https://assets9.lottiefiles.com/packages/lf20_b88nh30c.json",
  loop = true,
  speed = 1,
  autoplay = true,
}: LottieWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load the Lottie Player script from CDN
    const scriptId = "lottie-player-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (player && isScriptLoaded) {
      // Add a small delay to ensure the custom element is fully upgraded
      const timer = setTimeout(() => {
        if (player && typeof player.play === 'function') {
          if (isPlaying) {
            try {
              player.play();
            } catch (e) {
              console.warn("Could not play Lottie animation:", e);
            }
          }
        }
        
        if (player && typeof player.pause === 'function') {
          if (!isPlaying) {
            try {
              player.pause();
            } catch (e) {
              console.warn("Could not pause Lottie animation:", e);
            }
          }
        }
        
        if (player && typeof player.setSpeed === 'function') {
          try {
            player.setSpeed(speed);
          } catch (e) {
            console.warn("Could not set speed:", e);
          }
        }
        
        if (player && 'loop' in player) {
          player.loop = loop;
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying, speed, loop, isScriptLoaded]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <div className="relative w-full aspect-square bg-transparent flex items-center justify-center overflow-hidden group rounded-xl">
        {isScriptLoaded ? (
          React.createElement("lottie-player", {
            ref: playerRef,
            src: source,
            background: "transparent",
            speed: speed,
            style: { width: "100%", height: "100%" },
            loop: loop,
            autoplay: autoplay
          })
        ) : (
          <div className="flex flex-col items-center text-gray-400 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
            <span className="text-xs">Loading Player...</span>
          </div>
        )}
        
        {/* Controls Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-4 py-2 flex items-center gap-3 pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <button 
              onClick={togglePlay}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>
            <div className="w-px h-4 bg-gray-300"></div>
            <span className="text-xs font-mono text-gray-600">{speed}x</span>
          </div>
        </div>
      </div>

      {/* Info Bar (Optional, for editor feel) */}
      <div className="mt-2 w-full flex items-center justify-between text-[10px] text-gray-400 px-2">
        <div className="flex items-center gap-1 truncate max-w-[70%]">
          <Settings size={10} />
          <span className="truncate" title={source}>{source.split("/").pop()}</span>
        </div>
        <div className="flex items-center gap-1">
          <RefreshCw size={10} className={loop ? "text-green-500" : "text-gray-300"} />
          <span>{loop ? "Loop" : "Once"}</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface StoryViewDemoProps {
  progressBarColor?: string;
  progressBgColor?: string;
  stories?: { id: number; color: string; text: string }[];
}

export default function StoryViewDemo(props: StoryViewDemoProps) {
  return <StoryViewImplementation {...props} />;
}

export function StoryViewImplementation({
  progressBarColor = "#ffffff",
  progressBgColor = "rgba(255, 255, 255, 0.3)",
  stories = [
    { id: 1, color: "bg-indigo-500", text: "Story 1" },
    { id: 2, color: "bg-purple-500", text: "Story 2" },
    { id: 3, color: "bg-pink-500", text: "Story 3" },
  ],
}: StoryViewDemoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex, stories.length]);

  const handleTap = (e: any, info: any) => {
    const width = e.target.offsetWidth;
    if (info.point.x > width / 2) {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-zinc-900">
      <div className="relative w-64 h-96 bg-black rounded-2xl overflow-hidden shadow-2xl">
        {/* Progress Bars */}
        <div className="absolute top-4 left-0 w-full px-2 flex gap-1 z-20">
          {stories.map((story, index) => (
            <div 
              key={story.id} 
              className="h-1 flex-1 rounded-full overflow-hidden"
              style={{ backgroundColor: progressBgColor }}
            >
              <motion.div
                className="h-full"
                style={{ backgroundColor: progressBarColor }}
                initial={{ width: index < currentIndex ? "100%" : "0%" }}
                animate={{ width: index === currentIndex ? "100%" : index < currentIndex ? "100%" : "0%" }}
                transition={{ duration: index === currentIndex ? 3 : 0, ease: "linear" }}
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onTap={handleTap}
            className={`absolute inset-0 ${stories[currentIndex].color} flex items-center justify-center`}
          >
            <h2 className="text-white text-2xl font-bold">{stories[currentIndex].text}</h2>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface TestimonialCarouselDemoProps {
  activeColor?: string;
  inactiveColor?: string;
  authorColor?: string;
  textColor?: string;
  testimonials?: { text: string; author: string }[];
}

export default function TestimonialCarouselDemo(props: TestimonialCarouselDemoProps) {
  return <TestimonialCarouselImplementation {...props} />;
}

export function TestimonialCarouselImplementation({
  activeColor = "#a855f7",
  inactiveColor = "#3f3f46",
  authorColor = "#c084fc",
  textColor = "#d4d4d8",
  testimonials = [
    { text: "Absolutely stunning work!", author: "Sarah J." },
    { text: "Best investment we made.", author: "Mike T." },
    { text: "Incredible attention to detail.", author: "Alex R." },
  ],
}: TestimonialCarouselDemoProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center p-8">
      <div className="relative w-full max-w-md text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <p className="text-xl italic" style={{ color: textColor }}>
              &quot;{testimonials[index].text}&quot;
            </p>
            <span className="text-sm font-bold" style={{ color: authorColor }}>
              — {testimonials[index].author}
            </span>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-colors"
              style={{ backgroundColor: i === index ? activeColor : inactiveColor }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedHeadlineWidgetProps {
  style?: "highlight" | "rotating";
  animation?: "circle" | "curly" | "underline" | "double" | "double-underline" | "underline-zigzag" | "diagonal" | "strikethrough" | "cross" | "typing" | "clip" | "flip" | "slide";
  beforeText?: string;
  highlightedText?: string;
  rotatingText?: string[];
  afterText?: string;
  color?: string;
}

export default function AnimatedHeadlineWidget({
  style = "highlight",
  animation = "circle",
  beforeText = "This is",
  highlightedText = "Amazing",
  rotatingText = ["Amazing", "Incredible", "Fantastic", "Awesome"],
  afterText = "",
  color = "#3b82f6",
}: AnimatedHeadlineWidgetProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Rotating Logic
  useEffect(() => {
    if (style === "rotating" && animation !== "typing") {
      const interval = setInterval(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingText.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [style, animation, rotatingText]);

  // Typing Logic
  useEffect(() => {
    if (style === "rotating" && animation === "typing") {
      const currentWord = rotatingText[currentWordIndex];
      const typeSpeed = isDeleting ? 50 : 150;
      
      const timer = setTimeout(() => {
        if (!isDeleting) {
          setTypingText(currentWord.substring(0, typingText.length + 1));
          if (typingText.length === currentWord.length) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setTypingText(currentWord.substring(0, typingText.length - 1));
          if (typingText.length === 0) {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % rotatingText.length);
          }
        }
      }, typeSpeed);

      return () => clearTimeout(timer);
    }
  }, [typingText, isDeleting, currentWordIndex, rotatingText, style, animation]);

  // SVG Shapes for Highlight
  const HighlightShape = () => {
    const props = {
      className: "absolute left-0 top-full w-[105%] -ml-[2.5%] h-[0.6em] -mt-[0.2em] opacity-80 pointer-events-none z-0",
      viewBox: "0 0 200 9",
      preserveAspectRatio: "none",
      style: { color }
    };

    switch (animation) {
      case "circle":
        return (
          <svg {...props} viewBox="0 0 500 150" className="absolute left-[-10%] top-[-20%] w-[120%] h-[140%] opacity-80 pointer-events-none z-0">
            <path d="M9.3,127.3c49.3-3,150.7-7.6,199.7-7.4c121.9,0.4,189.9,0.4,282.3,7.2c3.8,0.1,7.6,4.5,9.7,11.2 / c2.5,6.8,2.6,12.8,0.1,19.3c-3.9,10.1-15.2,11.1-24.6,11.6c-51.8,2.6-102.5,2.6-154.4,0c-87.4-4.2-174.8-8.3-262.1-12.5 c-14.1-0.7-28.3-1.3-42.4-2c-10.5-0.5-20.9-1-31.4-1.5c-4.3-0.2-8.6-0.4-12.9-0.6c-2.1-0.1-4.2-0.2-6.3-0.3c-1-0.1-2.1-0.1-3.1-0.2 c-0.5,0-1,0-1.5,0c-0.3,0-0.5,0-0.8,0l-0.4,0" fill="none" stroke="currentColor" strokeWidth="10" />
          </svg>
        );
      case "curly":
        return (
          <svg {...props}>
            <path d="M3,7.5c38.5-6.5,77.5-5.5,116.5,0c38.5,5.5,77.5,6.5,116.5,0" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        );
      case "underline":
        return (
          <svg {...props}>
            <path d="M5,5 L195,5" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );
      case "double":
      case "double-underline":
        return (
          <svg {...props} viewBox="0 0 200 15">
            <path d="M5,3 L195,3 M5,12 L195,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case "underline-zigzag":
        return (
          <svg {...props} viewBox="0 0 200 15">
            <path d="M5,10 L15,2 L25,10 L35,2 L45,10 L55,2 L65,10 L75,2 L85,10 L95,2 L105,10 L115,2 L125,10 L135,2 L145,10 L155,2 L165,10 L175,2 L185,10 L195,2" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "diagonal":
        return (
          <svg {...props} className="absolute left-0 top-0 w-full h-full opacity-40 pointer-events-none z-0">
            <path d="M0,100 L200,0" stroke="currentColor" strokeWidth="15" strokeLinecap="square" />
          </svg>
        );
      case "strikethrough":
        return (
          <svg {...props} className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[10px] opacity-60 pointer-events-none z-0">
            <path d="M5,5 L195,5" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );
      case "cross":
        return (
          <svg {...props} className="absolute left-0 top-0 w-full h-full opacity-40 pointer-events-none z-0" viewBox="0 0 100 100">
            <path d="M10,10 L90,90 M90,10 L10,90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-center py-8">
      <h3 className="text-3xl md:text-5xl font-bold text-gray-900 flex flex-wrap justify-center gap-x-3 gap-y-1 items-center leading-tight">
        <span>{beforeText}</span>
        
        {style === "highlight" ? (
          <span className="relative inline-block px-2">
            <span className="relative z-10">{highlightedText}</span>
            <HighlightShape />
          </span>
        ) : (
          <span className="relative inline-flex min-w-[150px] text-left text-blue-600">
            {animation === "typing" ? (
              <span className="border-r-2 border-blue-600 pr-1 animate-pulse">
                {typingText}
              </span>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  initial={
                    animation === "slide" ? { y: 20, opacity: 0 } :
                    animation === "flip" ? { rotateX: -90, opacity: 0 } :
                    animation === "clip" ? { width: 0, opacity: 0 } :
                    { scale: 0.5, opacity: 0 }
                  }
                  animate={
                    animation === "slide" ? { y: 0, opacity: 1 } :
                    animation === "flip" ? { rotateX: 0, opacity: 1 } :
                    animation === "clip" ? { width: "auto", opacity: 1 } :
                    { scale: 1, opacity: 1 }
                  }
                  exit={
                    animation === "slide" ? { y: -20, opacity: 0 } :
                    animation === "flip" ? { rotateX: 90, opacity: 0 } :
                    animation === "clip" ? { width: 0, opacity: 0 } :
                    { scale: 0.5, opacity: 0 }
                  }
                  transition={{ duration: 0.5 }}
                  className="absolute left-0 top-0 whitespace-nowrap"
                  style={{ color }}
                >
                  {rotatingText[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            )}
            {/* Invisible spacer to keep layout stable */}
            <span className="opacity-0 pointer-events-none">{rotatingText.reduce((a, b) => a.length > b.length ? a : b)}</span>
          </span>
        )}

        <span>{afterText}</span>
      </h3>
    </div>
  );
}

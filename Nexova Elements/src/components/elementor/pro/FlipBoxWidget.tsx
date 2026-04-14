"use client";

import React from "react";

interface FlipBoxWidgetProps {
  frontTitle?: string;
  frontDesc?: string;
  frontIcon?: React.ReactNode;
  backTitle?: string;
  backDesc?: string;
  backButtonText?: string;
  effect?: "flip" | "slide" | "push" | "zoom-in" | "zoom-out" | "fade";
  height?: number;
  direction?: "left" | "right" | "up" | "down";
}

export default function FlipBoxWidget({
  frontTitle = "This is the heading",
  frontDesc = "Lorem ipsum dolor sit amet consectetur.",
  frontIcon,
  backTitle = "This is the heading",
  backDesc = "Lorem ipsum dolor sit amet consectetur.",
  backButtonText = "Click Here",
  effect = "flip",
  height = 250,
  direction = "left",
}: FlipBoxWidgetProps) {
  
  const getContainerClasses = () => {
    // Perspective is needed for 3D effects
    return "perspective-[1000px]";
  };

  const getInnerClasses = () => {
    let base = "relative w-full h-full transition-all duration-500 transform-style-3d";
    
    if (effect === "flip") {
      // We'll handle hover state via group-hover on the parent
      return `${base} group-hover:[transform:rotateY(180deg)]`;
    }
    
    // For other effects, we might not need rotateY, but we need to handle the transition
    return base;
  };

  const getFrontClasses = () => {
    const base = "absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-6 text-center bg-gray-100 rounded-xl";
    
    switch (effect) {
      case "slide":
        return `${base} transition-transform duration-500 group-hover:-translate-y-full`;
      case "push":
        return `${base} transition-transform duration-500 group-hover:-translate-x-full`;
      case "zoom-in":
        return `${base} transition-all duration-500 group-hover:scale-110 group-hover:opacity-0`;
      case "zoom-out":
        return `${base} transition-all duration-500 group-hover:scale-90 group-hover:opacity-0`;
      case "fade":
        return `${base} transition-opacity duration-500 group-hover:opacity-0`;
      case "flip":
      default:
        return base;
    }
  };

  const getBackClasses = () => {
    const base = "absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-6 text-center bg-blue-600 text-white rounded-xl";
    
    switch (effect) {
      case "slide":
        return `${base} translate-y-full transition-transform duration-500 group-hover:translate-y-0`;
      case "push":
        return `${base} translate-x-full transition-transform duration-500 group-hover:translate-x-0`;
      case "zoom-in":
        return `${base} scale-90 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100`;
      case "zoom-out":
        return `${base} scale-110 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100`;
      case "fade":
        return `${base} opacity-0 transition-opacity duration-500 group-hover:opacity-100`;
      case "flip":
      default:
        return `${base} [transform:rotateY(180deg)]`;
    }
  };

  return (
    <div className={`group w-full ${getContainerClasses()}`} style={{ height }}>
      <div className={getInnerClasses()}>
        {/* Front Side */}
        <div className={getFrontClasses()}>
          {frontIcon ? (
            <div className="mb-4 text-blue-600">{frontIcon}</div>
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-blue-600">
              <span className="text-2xl">★</span>
            </div>
          )}
          <h3 className="text-xl font-bold mb-2 text-gray-800">{frontTitle}</h3>
          <p className="text-gray-600 text-sm">{frontDesc}</p>
        </div>

        {/* Back Side */}
        <div className={getBackClasses()}>
          <h3 className="text-xl font-bold mb-2">{backTitle}</h3>
          <p className="text-blue-100 text-sm mb-6">{backDesc}</p>
          <button className="px-6 py-2 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors">
            {backButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface WaterRippleDemoProps {
  rippleColor?: string;
  backgroundColor?: string;
}

export default function WaterRippleDemo(props: WaterRippleDemoProps) {
  return <WaterRippleImplementation {...props} />;
}

export function WaterRippleImplementation({
  rippleColor = "rgba(255, 255, 255, 0.3)",
  backgroundColor = "#3b82f6",
}: WaterRippleDemoProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1000);
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-full min-h-[300px] relative overflow-hidden cursor-pointer"
      style={{ backgroundColor }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-white/50 text-sm font-medium">Click anywhere</span>
      </div>
      
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            transform: "translate(-50%, -50%)",
            animationDuration: "1s",
            backgroundColor: rippleColor,
          }}
        />
      ))}
    </div>
  );
}

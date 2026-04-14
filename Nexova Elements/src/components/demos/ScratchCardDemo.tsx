"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScratchCardDemoProps {
  scratchColor?: string;
  scratchText?: string;
  revealText?: string;
  revealColor?: string;
}

export default function ScratchCardDemo(props: ScratchCardDemoProps) {
  return <ScratchCardImplementation {...props} />;
}

export function ScratchCardImplementation({
  scratchColor = "#C0C0C0",
  scratchText = "Scratch Me!",
  revealText = "WINNER! 🎉",
  revealColor = "from-yellow-400 to-orange-500",
}: ScratchCardDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill with scratchable layer
    ctx.fillStyle = scratchColor; // Silver
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add texture/text to scratch layer
    ctx.fillStyle = "#A0A0A0";
    ctx.font = "20px Arial";
    ctx.fillText(scratchText, 80, 100);

    let isDrawing = false;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Check percentage revealed (simplified)
      // In a real app, you'd check pixel data
    };

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const { x, y } = getPos(e);
      scratch(x, y);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const { x, y } = getPos(e);
      scratch(x, y);
    };

    const handleMouseUp = () => {
      isDrawing = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleMouseDown);
    canvas.addEventListener("touchmove", handleMouseMove);
    canvas.addEventListener("touchend", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("touchmove", handleMouseMove);
      canvas.removeEventListener("touchend", handleMouseUp);
    };
  }, [scratchColor, scratchText]);

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-zinc-900">
      <div className="relative w-64 h-48 rounded-xl overflow-hidden shadow-xl">
        {/* Hidden Content */}
        <div className={`absolute inset-0 bg-gradient-to-br ${revealColor} flex items-center justify-center`}>
          <span className="text-2xl font-bold text-white">{revealText}</span>
        </div>
        
        {/* Scratch Layer */}
        <canvas
          ref={canvasRef}
          width={256}
          height={192}
          className="absolute inset-0 cursor-crosshair"
        />
      </div>
    </div>
  );
}

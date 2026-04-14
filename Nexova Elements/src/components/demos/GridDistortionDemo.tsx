"use client";

import React, { useEffect, useRef } from "react";

interface GridDistortionProps {
  gridSize?: number;
  mouseRange?: number;
  distortStrength?: number;
  cursorColor?: string;
  gridColor?: string;
}

export default function GridDistortionDemo(props: GridDistortionProps) {
  return <GridDistortionImplementation {...props} />;
}

export function GridDistortionImplementation({
  gridSize = 30,
  mouseRange = 150,
  distortStrength = 40,
  cursorColor = "rgba(255, 255, 255, 0.5)",
  gridColor = "rgba(255, 255, 255, 0.2)"
}: GridDistortionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points: { x: number; y: number; originX: number; originY: number }[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initPoints();
    };

    const initPoints = () => {
      points.length = 0;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          points.push({ x, y, originX: x, originY: y });
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      // Update points
      points.forEach(p => {
        const dx = mouseX - p.originX;
        const dy = mouseY - p.originY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouseRange) {
          const force = (mouseRange - dist) / mouseRange;
          const angle = Math.atan2(dy, dx);
          p.x = p.originX - Math.cos(angle) * force * distortStrength;
          p.y = p.originY - Math.sin(angle) * force * distortStrength;
        } else {
          p.x += (p.originX - p.x) * 0.1;
          p.y += (p.originY - p.y) * 0.1;
        }
        
        ctx.fillStyle = cursorColor;
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [gridSize, mouseRange, distortStrength, cursorColor, gridColor]);

  return (
    <div className="w-full h-full min-h-[300px] bg-zinc-900 relative overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

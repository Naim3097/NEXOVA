"use client";

import React, { useEffect, useRef } from "react";

interface StarFieldProps {
  starCount?: number;
  baseSpeed?: number;
  starColor?: string;
}

class Star {
  x: number;
  y: number;
  z: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = (Math.random() - 0.5) * canvasWidth * 2;
    this.y = (Math.random() - 0.5) * canvasHeight * 2;
    this.z = Math.random() * canvasWidth;
  }

  update(canvasWidth: number, canvasHeight: number, speed: number) {
    this.z -= speed * 20;
    if (this.z <= 0) {
      this.z = canvasWidth;
      this.x = (Math.random() - 0.5) * canvasWidth * 2;
      this.y = (Math.random() - 0.5) * canvasHeight * 2;
    }
  }

  draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, starColor: string) {
    const x = (this.x / this.z) * 100 + canvasWidth / 2;
    const y = (this.y / this.z) * 100 + canvasHeight / 2;
    const radius = (1 - this.z / canvasWidth) * 2;

    if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) return;

    ctx.fillStyle = starColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function StarField({
  starCount = 200,
  baseSpeed = 0.1,
  starColor = "white"
}: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let speed = baseSpeed;

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star(canvas.width, canvas.height));
      }
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars();
    };

    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.update(canvas.width, canvas.height, speed);
        star.draw(ctx, canvas.width, canvas.height, starColor);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const centerX = rect.width / 2;
      speed = baseSpeed + (Math.abs(x - centerX) / centerX) * 0.5;
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starCount, baseSpeed, starColor]);

  return (
    <div className="w-full h-full min-h-[300px] bg-black relative overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default function StarFieldDemo(props: StarFieldProps) {
  return <StarField {...props} />;
}

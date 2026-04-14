"use client";

import React, { useEffect, useRef } from "react";

interface FireworksProps {
  colors?: string[];
  density?: number;
  speed?: number;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  speed: number;

  constructor(x: number, y: number, color: string, speed: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 4 + 1;
    this.vx = Math.cos(angle) * velocity * speed;
    this.vy = Math.sin(angle) * velocity * speed;
    this.alpha = 1;
    this.color = color;
    this.speed = speed;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05 * this.speed; // gravity
    this.alpha -= 0.01;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export default function FireworksDemo(props: FireworksProps) {
  return <Fireworks {...props} />;
}

export function Fireworks({
  colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"],
  density = 50,
  speed = 1
}: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];

    const createFirework = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < density; i++) {
        particles.push(new Particle(x, y, color, speed));
      }
    };

    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      if (Math.random() < 0.05) {
        createFirework(Math.random() * canvas.width, Math.random() * canvas.height / 2);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      createFirework(e.clientX - rect.left, e.clientY - rect.top);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("click", handleClick);
    
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, density, speed]);

  return (
    <div className="w-full h-full min-h-[300px] bg-black relative overflow-hidden cursor-crosshair">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none">
        Click to celebrate!
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}



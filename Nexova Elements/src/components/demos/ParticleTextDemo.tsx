"use client";

import React, { useEffect, useRef } from "react";

interface ParticleTextProps {
  text?: string;
  particleColor?: string;
  mouseInteractionRadius?: number;
  particleSize?: number;
  fontSize?: number;
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  vx: number;
  vy: number;
  color: string;

  constructor(x: number, y: number, canvasWidth: number, canvasHeight: number, particleSize: number, particleColor: string) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.originX = x;
    this.originY = y;
    this.size = particleSize;
    this.vx = 0;
    this.vy = 0;
    this.color = particleColor;
  }

  update(mouseX: number, mouseY: number, mouseInteractionRadius: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = (mouseInteractionRadius - dist) / mouseInteractionRadius;

    if (dist < mouseInteractionRadius) {
      const angle = Math.atan2(dy, dx);
      this.vx -= Math.cos(angle) * force * 5;
      this.vy -= Math.sin(angle) * force * 5;
    }

    this.vx *= 0.9; // friction
    this.vy *= 0.9;
    
    this.x += this.vx + (this.originX - this.x) * 0.1;
    this.y += this.vy + (this.originY - this.y) * 0.1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

export function ParticleText({
  text = "VIBE",
  particleColor = "white",
  mouseInteractionRadius = 100,
  particleSize = 2,
  fontSize = 80
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      ctx.fillStyle = "white";
      ctx.font = `900 ${fontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];

      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const index = (y * canvas.width + x) * 4;
          if (imageData.data[index + 3] > 128) {
            particles.push(new Particle(x, y, canvas.width, canvas.height, particleSize, particleColor));
          }
        }
      }
    };

    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(mouseX, mouseY, mouseInteractionRadius);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
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

    window.addEventListener("resize", init);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    
    init();
    animate();

    return () => {
      window.removeEventListener("resize", init);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, particleColor, mouseInteractionRadius, particleSize, fontSize]);

  return (
    <div className="w-full h-full min-h-[300px] bg-zinc-900 relative overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default function ParticleTextDemo(props: ParticleTextProps) {
  return <ParticleText {...props} />;
}

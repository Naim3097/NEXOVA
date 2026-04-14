"use client";

import React, { useEffect, useRef } from "react";

interface ParticleNetworkDemoProps {
  particleColor?: string;
  backgroundColor?: string;
  particleCount?: number;
}

export default function ParticleNetworkDemo(props: ParticleNetworkDemoProps) {
  return <ParticleNetworkImplementation {...props} />;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = (Math.random() - 0.5) * 1;
    this.size = Math.random() * 2 + 1;
  }

  update(canvasWidth: number, canvasHeight: number, mouseX: number, mouseY: number, mouseDistance: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
    if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;

    // Mouse interaction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouseDistance) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (mouseDistance - distance) / mouseDistance;
      const directionX = forceDirectionX * force * 0.5;
      const directionY = forceDirectionY * force * 0.5;
      this.vx += directionX;
      this.vy += directionY;
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function ParticleNetworkImplementation({
  particleColor = "#ffffff",
  backgroundColor = "#18181b",
  particleCount = 50,
}: ParticleNetworkDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const connectionDistance = 100;
    const mouseDistance = 150;

    let mouseX = 0;
    let mouseY = 0;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height, mouseX, mouseY, mouseDistance);
        particle.draw(ctx, particleColor);
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            // Convert hex to rgb for opacity
            // Simple hack: assume hex is #RRGGBB
            const r = parseInt(particleColor.slice(1, 3), 16);
            const g = parseInt(particleColor.slice(3, 5), 16);
            const b = parseInt(particleColor.slice(5, 7), 16);
            
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
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
  }, [particleColor, particleCount]);

  return (
    <div 
      className="w-full h-full min-h-[300px] relative overflow-hidden"
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

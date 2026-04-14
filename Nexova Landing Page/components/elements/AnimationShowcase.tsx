'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { animations, getAnimationsByCategory, type Animation } from '@/lib/elements-data';

/* ════════════════════════════════════════════════════════════════
   Per-animation CSS mini-previews (keyed by animation id)
   Each returns a small animated visual for the dark preview box.
   ════════════════════════════════════════════════════════════════ */
const PREVIEW: Record<number, ReactNode> = {
  /* ── 3D & Immersion ── */
  1: ( // Real-Time Rendering — rotating wireframe cube
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '200px' }}>
      <div className="w-14 h-14 border-2 border-cyan-400/60 animate-[spin3d_4s_linear_infinite]" />
    </div>
  ),
  3: ( // AR/VR Motion Graphics — pulsing VR headset icon
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-9 border-2 border-purple-400/70 rounded-lg animate-[pulse_2s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-purple-400/70 animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
      </div>
    </div>
  ),
  14: ( // Faux 3D — perspective shifting box
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '150px' }}>
      <div className="w-16 h-16 bg-gradient-to-br from-blue-400/40 to-purple-500/40 border border-blue-400/30 rounded-lg animate-[tilt3d_3s_ease-in-out_infinite]" />
    </div>
  ),
  19: ( // Isometric — stacked blocks
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative" style={{ transform: 'rotateX(45deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }}>
        <div className="w-10 h-10 bg-cyan-400/30 border border-cyan-400/50 animate-[el-float_2s_ease-in-out_infinite]" />
        <div className="w-10 h-10 bg-purple-400/30 border border-purple-400/50 absolute -top-3 -left-3 animate-[el-float_2s_ease-in-out_infinite_0.5s]" />
      </div>
    </div>
  ),
  63: ( // Interactive Globe — rotating circle with meridians
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-cyan-400/50 relative animate-[spinSlow_8s_linear_infinite]">
        <div className="absolute inset-0 rounded-full border-r-2 border-cyan-400/30" style={{ transform: 'rotateY(60deg)' }} />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/30" />
      </div>
    </div>
  ),
  72: ( // 3D Cylinder Scroll — rotating bars
    <div className="w-full h-full flex items-center justify-center gap-1">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="w-2 bg-gradient-to-b from-cyan-400/60 to-purple-500/60 rounded-full animate-[barWave_1.5s_ease-in-out_infinite]" style={{ height: '24px', animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  ),
  76: ( // 3D Book Flip — flipping page
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '200px' }}>
      <div className="w-12 h-16 bg-white/10 border border-white/20 rounded-r relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent origin-left animate-[bookFlip_3s_ease-in-out_infinite]" />
      </div>
    </div>
  ),
  80: ( // 3D Cube Spinner
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '200px' }}>
      <div className="w-12 h-12 border-2 border-purple-400/60 rounded animate-[spin3d_3s_linear_infinite]" />
    </div>
  ),
  91: ( // Infinite Tunnel — concentric shrinking squares
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-20 h-20">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="absolute border border-cyan-400/40 animate-[tunnel_3s_linear_infinite] rounded" style={{ inset: `${i * 8}px`, animationDelay: `${i * 0.75}s` }} />
        ))}
      </div>
    </div>
  ),

  /* ── Interaction ── */
  2: ( // Scrollytelling — scrolling content lines
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className="space-y-2 animate-[scrollUp_4s_linear_infinite]">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-cyan-400/50" />
            <div className={`h-1.5 rounded-full bg-white/${i % 2 ? 30 : 20}`} style={{ width: `${40 + (i * 7) % 30}px` }} />
          </div>
        ))}
      </div>
    </div>
  ),
  5: ( // Real-Time Collaborative — two cursors moving
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute w-2 h-2 border-l-2 border-b-2 border-cyan-400 animate-[cursorA_3s_ease-in-out_infinite]" style={{ top: '30%', left: '20%' }} />
      <div className="absolute w-2 h-2 border-l-2 border-b-2 border-pink-400 animate-[cursorB_3s_ease-in-out_infinite]" style={{ top: '50%', left: '60%' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-10 border border-white/15 rounded-lg" />
    </div>
  ),
  15: ( // Vertical/Horizontal Scroll — cross arrows
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-full bg-white/20" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-white/20" />
        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400/80 animate-[moveVH_4s_ease-in-out_infinite]" />
      </div>
    </div>
  ),
  22: ( // Page Transitions — sliding panels
    <div className="w-full h-full flex items-center justify-center gap-1 overflow-hidden">
      <div className="w-10 h-14 bg-white/10 border border-white/15 rounded animate-[slideOutLeft_3s_ease-in-out_infinite]" />
      <div className="w-10 h-14 bg-cyan-400/10 border border-cyan-400/20 rounded animate-[slideInRight_3s_ease-in-out_infinite]" />
    </div>
  ),
  26: ( // Hover Effects — card with hover glow
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-12 bg-white/10 border border-white/15 rounded-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 animate-[shimmer_2s_ease-in-out_infinite]" />
      </div>
    </div>
  ),
  30: ( // Animated Flipbooks — flipping page
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '200px' }}>
      <div className="w-14 h-18 relative">
        <div className="w-14 h-16 bg-white/10 border border-white/20 rounded" />
        <div className="absolute inset-0 w-14 h-16 bg-white/15 border border-white/25 rounded origin-left animate-[pageFlip_2s_ease-in-out_infinite]" />
      </div>
    </div>
  ),
  51: ( // Magnetic Buttons
    <div className="w-full h-full flex items-center justify-center">
      <div className="px-4 py-2 bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] rounded-full text-white text-xs font-semibold relative animate-[magnetPull_2s_ease-in-out_infinite]">
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] animate-[glow_2s_ease-in-out_infinite] blur-md opacity-50" />
        <span className="relative">Click</span>
      </div>
    </div>
  ),
  52: ( // Cursor Trails — trail of dots
    <div className="w-full h-full relative overflow-hidden">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-[trailDot_3s_ease-in-out_infinite]" style={{ opacity: 1 - i * 0.2, animationDelay: `${i * 0.15}s`, top: '40%', left: '30%' }} />
      ))}
    </div>
  ),
  53: ( // Parallax Tilt Cards
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '200px' }}>
      <div className="w-16 h-12 bg-gradient-to-br from-white/15 to-white/5 border border-white/20 rounded-xl animate-[tilt3d_3s_ease-in-out_infinite] shadow-lg">
        <div className="p-2 space-y-1">
          <div className="h-1 bg-white/30 rounded-full w-3/4" />
          <div className="h-1 bg-white/20 rounded-full w-full" />
        </div>
      </div>
    </div>
  ),
  54: ( // Spotlight Reveal — flashlight circle
    <div className="w-full h-full relative bg-[#1a1a2e] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white/10 text-xs font-bold tracking-widest">REVEAL</div>
      </div>
      <div className="absolute w-16 h-16 rounded-full bg-radial-gradient animate-[spotlightMove_4s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }} />
    </div>
  ),
  55: ( // Magnifying Glass
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative animate-[magnetPull_3s_ease-in-out_infinite]">
        <div className="w-10 h-10 rounded-full border-2 border-white/40" />
        <div className="absolute -bottom-2 -right-2 w-4 h-1 bg-white/40 rotate-45 rounded" />
      </div>
    </div>
  ),
  71: ( // Stacked Card Carousel
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-20 h-14">
        {[0, 1, 2].map(i => (
          <div key={i} className="absolute bg-white/10 border border-white/20 rounded-lg animate-[stackShuffle_3s_ease-in-out_infinite]" style={{ width: '48px', height: '36px', top: `${i * 4}px`, left: `${i * 8}px`, zIndex: 3 - i, animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>
    </div>
  ),
  73: ( // Gravity Physics Grid — bouncing balls
    <div className="w-full h-full flex items-end justify-center gap-2 pb-4">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-3 h-3 rounded-full bg-gradient-to-b from-cyan-400 to-purple-500 animate-[bounce_1s_ease-in_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  ),
  77: ( // Elastic Drag Elements — stretching element
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-14 h-6 bg-gradient-to-r from-cyan-400/50 to-purple-500/50 rounded-full animate-[elasticStretch_2s_ease-in-out_infinite]" />
    </div>
  ),
  82: ( // Kanban Drag & Drop — columns with moving card
    <div className="w-full h-full flex items-center justify-center gap-2">
      <div className="w-8 h-16 bg-white/5 border border-white/10 rounded p-1 space-y-1">
        <div className="w-full h-2 bg-cyan-400/40 rounded animate-[kanbanMove_3s_ease-in-out_infinite]" />
        <div className="w-full h-2 bg-white/15 rounded" />
      </div>
      <div className="w-8 h-16 bg-white/5 border border-white/10 rounded p-1 space-y-1">
        <div className="w-full h-2 bg-white/15 rounded" />
      </div>
      <div className="w-8 h-16 bg-white/5 border border-white/10 rounded p-1" />
    </div>
  ),
  85: ( // Scratch Card
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-12 bg-white/10 border border-white/20 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5BC0BE]/40 to-[#7C74EA]/40 animate-[scratchReveal_3s_ease-in-out_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center text-white/80 text-[8px] font-bold">WIN!</div>
      </div>
    </div>
  ),
  89: ( // Focus Blur Reveal
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/80 text-xs font-bold tracking-widest animate-[focusBlur_3s_ease-in-out_infinite]">REVEAL</div>
    </div>
  ),
  96: ( // Mouse Image Trail
    <div className="w-full h-full relative overflow-hidden">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="absolute w-4 h-4 bg-gradient-to-br from-cyan-400/60 to-purple-500/60 rounded animate-[trailDot_3s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s`, top: '40%', left: '30%' }} />
      ))}
    </div>
  ),

  /* ── Background ── */
  6: ( // Ambient Background Motion
    <div className="w-full h-full bg-gradient-to-br from-[#5BC0BE] via-[#7C74EA] to-[#455263] bg-[length:200%_200%] animate-[bgshift_6s_ease-in-out_infinite_alternate] rounded" />
  ),
  18: ( // Animated Gradient
    <div className="w-full h-full bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-cyan-500/40 bg-[length:200%_200%] animate-[bgshift_4s_ease-in-out_infinite_alternate] rounded" />
  ),
  20: ( // Background Website Animations
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute w-24 h-24 rounded-full bg-cyan-400/15 animate-[floatBubble_5s_ease-in-out_infinite] -top-4 -left-4" />
      <div className="absolute w-16 h-16 rounded-full bg-purple-400/15 animate-[floatBubble_4s_ease-in-out_infinite_1s] -bottom-4 -right-4" />
    </div>
  ),
  70: ( // Particle Network — dots with connecting lines
    <div className="w-full h-full relative overflow-hidden">
      {[{ x: 20, y: 25 }, { x: 60, y: 45 }, { x: 40, y: 70 }, { x: 75, y: 25 }, { x: 30, y: 50 }].map((p, i) => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-[particleFloat_4s_ease-in-out_infinite]" style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${i * 0.5}s` }} />
      ))}
      <svg className="absolute inset-0 w-full h-full">
        <line x1="20%" y1="25%" x2="60%" y2="45%" className="stroke-cyan-400/20" strokeWidth="0.5" />
        <line x1="60%" y1="45%" x2="75%" y2="25%" className="stroke-cyan-400/20" strokeWidth="0.5" />
        <line x1="40%" y1="70%" x2="30%" y2="50%" className="stroke-cyan-400/20" strokeWidth="0.5" />
      </svg>
    </div>
  ),
  79: ( // Water Ripple
    <div className="w-full h-full flex items-center justify-center">
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute w-10 h-10 rounded-full border border-cyan-400/30 animate-[ripple_3s_ease-out_infinite]" style={{ animationDelay: `${i * 1}s` }} />
      ))}
    </div>
  ),
  83: ( // Interactive Star Field
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a1a]">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full animate-[twinkle_2s_ease-in-out_infinite]" style={{ left: `${(i * 17 + 5) % 95}%`, top: `${(i * 13 + 3) % 90}%`, animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  ),
  86: ( // Gradient Follower — glowing blob
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/50 to-purple-500/50 blur-xl animate-[spotlightMove_4s_ease-in-out_infinite]" />
    </div>
  ),
  88: ( // Interactive Grid Distortion
    <div className="w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-5 grid-rows-5 gap-1">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-[gridWarp_3s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.05}s` }} />
        ))}
      </div>
    </div>
  ),
  97: ( // Retro Grid Scroll — perspective grid
    <div className="w-full h-full flex items-end justify-center overflow-hidden" style={{ perspective: '100px' }}>
      <div className="w-full h-3/4 border-t border-l border-r border-cyan-400/20 grid grid-cols-6 grid-rows-4" style={{ transform: 'rotateX(40deg)', transformOrigin: 'bottom' }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="border border-cyan-400/10" />
        ))}
      </div>
    </div>
  ),
  100: ( // Fireworks
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a1a]">
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute animate-[firework_2s_ease-out_infinite]" style={{ left: `${25 + i * 25}%`, bottom: '20%', animationDelay: `${i * 0.7}s` }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
            <div key={deg} className="absolute w-0.5 h-3 bg-gradient-to-t from-transparent" style={{ transform: `rotate(${deg}deg)`, transformOrigin: 'bottom', background: `linear-gradient(to top, transparent, ${['#5BC0BE', '#7C74EA', '#f59e0b'][i]})` }} />
          ))}
        </div>
      ))}
    </div>
  ),
  99: ( // Matrix Digital Rain
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a0a]">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="absolute text-green-400/70 text-[8px] font-mono leading-tight animate-[matrixFall_3s_linear_infinite]" style={{ left: `${15 + i * 18}%`, animationDelay: `${i * 0.4}s` }}>
          {'01\n10\n11\n00\n01\n10'.split('\n').map((c, j) => <div key={j}>{c}</div>)}
        </div>
      ))}
    </div>
  ),

  /* ── Style ── */
  16: ( // Mixed Media
    <div className="w-full h-full flex items-center justify-center gap-2">
      <div className="w-8 h-10 bg-white/10 rounded animate-[el-float_3s_ease-in-out_infinite]" />
      <div className="w-10 h-10 border-2 border-purple-400/40 rounded-full animate-[el-float_3s_ease-in-out_infinite_0.5s]" />
    </div>
  ),
  17: ( // Liquid Motion
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/40 to-purple-500/40 animate-[blob_5s_ease-in-out_infinite] opacity-80" />
    </div>
  ),
  21: ( // Doodle
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-16 h-16" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="126" className="animate-[drawLine_3s_ease-in-out_infinite]" />
        <circle cx="26" cy="28" r="2" fill="rgba(255,255,255,0.4)" />
        <circle cx="38" cy="28" r="2" fill="rgba(255,255,255,0.4)" />
        <path d="M26 38 Q32 44 38 38" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      </svg>
    </div>
  ),
  27: ( // Neumorphic
    <div className="w-full h-full flex items-center justify-center" style={{ background: '#2a2a3a' }}>
      <div className="w-14 h-14 rounded-2xl animate-[neuPress_2s_ease-in-out_infinite]" style={{ background: '#2a2a3a', boxShadow: '4px 4px 8px #1a1a26, -4px -4px 8px #3a3a4e' }} />
    </div>
  ),
  28: ( // Glassmorphic
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="absolute w-8 h-8 rounded-full bg-cyan-400/40 -top-2 -left-2 blur-sm" />
      <div className="absolute w-8 h-8 rounded-full bg-purple-400/40 -bottom-2 -right-2 blur-sm" />
      <div className="w-16 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl" />
    </div>
  ),
  29: ( // Claymorphic
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-14 h-10 rounded-2xl bg-gradient-to-br from-pink-300/30 to-purple-300/30 border border-white/10 animate-[el-float_3s_ease-in-out_infinite]" style={{ boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.1), 4px 4px 8px rgba(0,0,0,0.3)' }} />
    </div>
  ),
  31: ( // Stop-Motion
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-12 bg-white/20 rounded animate-[stopMotion_1s_steps(4)_infinite]" />
    </div>
  ),
  68: ( // Holographic Card
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-12 bg-white/10 border border-white/20 rounded-xl overflow-hidden relative animate-[el-float_3s_ease-in-out_infinite]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-cyan-500/30 animate-[holoShift_3s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-[holoShine_2s_ease-in-out_infinite]" />
      </div>
    </div>
  ),
  78: ( // Color Palette Generator
    <div className="w-full h-full flex items-center justify-center gap-1">
      {['from-cyan-400 to-teal-400', 'from-purple-400 to-pink-400', 'from-amber-400 to-orange-400', 'from-emerald-400 to-cyan-400'].map((g, i) => (
        <div key={i} className={`w-4 h-12 rounded-full bg-gradient-to-b ${g} animate-[colorShift_3s_ease-in-out_infinite]`} style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
    </div>
  ),
  92: ( // Glitch Image Effect
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="text-white/60 text-sm font-bold tracking-widest relative animate-[glitch_2s_steps(2)_infinite]">
        GLITCH
        <span className="absolute inset-0 text-cyan-400/50 animate-[glitchR_2s_steps(2)_infinite]">GLITCH</span>
        <span className="absolute inset-0 text-red-400/50 animate-[glitchL_2s_steps(2)_infinite]">GLITCH</span>
      </div>
    </div>
  ),

  /* ── Vector ── */
  7: ( // Line Animation
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-20 h-12" viewBox="0 0 80 48">
        <polyline points="5,40 20,20 35,30 50,10 65,25 75,8" fill="none" stroke="rgba(91,192,190,0.6)" strokeWidth="2" strokeDasharray="120" className="animate-[drawLine_3s_ease-in-out_infinite]" />
      </svg>
    </div>
  ),
  8: ( // Self-Drawing
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-16 h-16" viewBox="0 0 64 64">
        <rect x="8" y="8" width="48" height="48" rx="8" fill="none" stroke="rgba(124,116,234,0.6)" strokeWidth="2" strokeDasharray="192" className="animate-[drawLine_4s_ease-in-out_infinite]" />
      </svg>
    </div>
  ),
  9: ( // Morphing Effects
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 bg-gradient-to-br from-[#5BC0BE] to-[#7C74EA] animate-[blob_7s_ease-in-out_infinite] opacity-80" />
    </div>
  ),

  /* ── Typography ── */
  4: ( // Expressive Typography
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-white/80 text-lg font-black tracking-widest animate-[kineticType_2s_ease-in-out_infinite]">TYPE</span>
    </div>
  ),
  87: ( // Kinetic Typography
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-white/70 text-base font-bold animate-[kineticSkew_2s_ease-in-out_infinite]">KINETIC</span>
    </div>
  ),

  /* ── Text ── */
  60: ( // Text Scramble Reveal
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-white/70 font-mono text-xs tracking-widest animate-[textFlicker_0.5s_steps(2)_infinite]">&#x25A0;E&#x25A0;O&#x25A0;A</span>
    </div>
  ),
  61: ( // Typewriter Effect
    <div className="w-full h-full flex items-center justify-center px-3">
      <span className="text-white font-mono text-xs font-bold overflow-hidden whitespace-nowrap border-r-2 border-[#5FC7CD] animate-[typing_3.5s_steps(16,end)_infinite,blink_0.75s_step-end_infinite]">Build. Launch. Grow.</span>
    </div>
  ),
  62: ( // Video Text Masking
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_200%] animate-[bgshift_3s_ease-in-out_infinite_alternate]">TEXT</span>
    </div>
  ),
  93: ( // Particle Text Explosion
    <div className="w-full h-full flex items-center justify-center relative">
      {'BOOM'.split('').map((ch, i) => (
        <span key={i} className="text-white/70 font-bold text-sm animate-[explode_2s_ease-out_infinite]" style={{ animationDelay: `${i * 0.1}s` }}>{ch}</span>
      ))}
    </div>
  ),

  /* ── UI Elements ── */
  11: ( // Animated Icons
    <div className="w-full h-full flex items-center justify-center gap-3">
      <div className="w-5 h-5 border-2 border-cyan-400/60 rounded animate-[spinSlow_3s_linear_infinite]" />
      <div className="w-5 h-5 border-2 border-purple-400/60 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
      <svg className="w-5 h-5 text-pink-400/60 animate-[bounceIcon_1s_ease-in-out_infinite]" viewBox="0 0 20 20" fill="currentColor"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
    </div>
  ),
  12: ( // Microinteractions
    <div className="w-full h-full flex items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center animate-[microTap_1.5s_ease-in-out_infinite]">
        <div className="w-3 h-3 bg-cyan-400/60 rounded-sm" />
      </div>
    </div>
  ),
  66: ( // Dynamic Island Notification
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-black rounded-full px-3 py-1.5 flex items-center gap-2 animate-[islandExpand_3s_ease-in-out_infinite]">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-[pulse_1s_ease-in-out_infinite]" />
        <span className="text-white text-[8px] font-medium whitespace-nowrap overflow-hidden animate-[islandText_3s_ease-in-out_infinite]">New message</span>
      </div>
    </div>
  ),
  94: ( // Liquid Blob Button
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative px-5 py-2 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 to-purple-500/50 animate-[blob_4s_ease-in-out_infinite]" />
        <span className="relative text-white text-xs font-semibold">Button</span>
      </div>
    </div>
  ),

  /* ── Navigation ── */
  41: ( // Mega Menu Reveal
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
      <div className="flex gap-3">
        {[1, 2, 3].map(i => <div key={i} className="w-6 h-1 bg-white/30 rounded" />)}
      </div>
      <div className="w-20 h-10 bg-white/5 border border-white/10 rounded-lg mt-1 p-1.5 space-y-1 animate-[menuReveal_2.5s_ease-in-out_infinite]">
        {[1, 2, 3].map(i => <div key={i} className="h-1.5 bg-white/15 rounded" style={{ animationDelay: `${i * 0.1}s` }} />)}
      </div>
    </div>
  ),
  42: ( // Sticky Scroll Progress
    <div className="w-full h-full flex flex-col items-center justify-start pt-3 px-3">
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-[progressFill_3s_ease-in-out_infinite]" />
      </div>
      <div className="space-y-2 w-full">
        {[1, 2, 3].map(i => <div key={i} className="h-1.5 bg-white/10 rounded-full" style={{ width: `${60 + i * 10}%` }} />)}
      </div>
    </div>
  ),
  43: ( // Animated Tabs
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex gap-0.5 bg-white/5 rounded-lg p-0.5 relative">
        <div className="absolute top-0.5 left-0.5 w-10 h-6 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 rounded-md animate-[tabSlide_3s_ease-in-out_infinite]" />
        {['Tab 1', 'Tab 2', 'Tab 3'].map(t => <div key={t} className="w-10 h-6 flex items-center justify-center text-white/50 text-[7px] font-medium relative z-10">{t}</div>)}
      </div>
    </div>
  ),
  44: ( // Accordion/FAQ
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-4">
      <div className="w-full bg-white/5 border border-white/10 rounded p-1.5">
        <div className="flex justify-between items-center"><div className="h-1 bg-white/30 rounded w-8" /><div className="text-white/30 text-[8px]">−</div></div>
        <div className="mt-1 space-y-0.5 animate-[accordionOpen_3s_ease-in-out_infinite] overflow-hidden">
          <div className="h-1 bg-white/10 rounded w-full" />
          <div className="h-1 bg-white/10 rounded w-3/4" />
        </div>
      </div>
      <div className="w-full bg-white/5 border border-white/10 rounded p-1.5">
        <div className="flex justify-between items-center"><div className="h-1 bg-white/20 rounded w-10" /><div className="text-white/20 text-[8px]">+</div></div>
      </div>
    </div>
  ),
  45: ( // Sidebar Collapse
    <div className="w-full h-full flex">
      <div className="bg-white/5 border-r border-white/10 h-full animate-[sidebarWidth_3s_ease-in-out_infinite] overflow-hidden">
        <div className="p-2 space-y-2 w-14">
          {[1, 2, 3].map(i => <div key={i} className="h-1.5 bg-white/15 rounded" />)}
        </div>
      </div>
      <div className="flex-1 p-2"><div className="h-1.5 bg-white/10 rounded w-8" /></div>
    </div>
  ),
  69: ( // Liquid Tab Bar
    <div className="w-full h-full flex items-end justify-center pb-3">
      <div className="flex gap-3 items-end">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="relative flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-cyan-400/60 animate-[liquidBubble_2s_ease-in-out_infinite]' : 'bg-white/20'}`} />
          </div>
        ))}
      </div>
    </div>
  ),
  81: ( // Magnified Dock
    <div className="w-full h-full flex items-end justify-center pb-3 gap-1">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="rounded bg-gradient-to-b from-white/20 to-white/10 animate-[dockMagnify_3s_ease-in-out_infinite]" style={{ width: '8px', height: '8px', animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  ),

  /* ── Forms ── */
  46: ( // Floating Label Inputs
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="w-full relative">
        <div className="w-full h-6 border-b border-white/20" />
        <span className="absolute text-[8px] text-cyan-400/70 font-medium animate-[floatLabel_3s_ease-in-out_infinite]">Email</span>
      </div>
    </div>
  ),
  47: ( // Password Strength Meter
    <div className="w-full h-full flex flex-col items-center justify-center px-4 gap-2">
      <div className="w-full h-5 border border-white/15 rounded px-1.5 flex items-center"><div className="text-white/30 text-[7px] font-mono">••••••••</div></div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full animate-[progressFill_3s_ease-in-out_infinite]" />
      </div>
    </div>
  ),
  48: ( // File Upload Dropzone
    <div className="w-full h-full flex items-center justify-center px-3">
      <div className="w-full h-14 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-1 animate-[dropzonePulse_2s_ease-in-out_infinite]">
        <div className="text-white/30 text-xs">↑</div>
        <div className="text-white/20 text-[7px]">Drop file</div>
      </div>
    </div>
  ),
  49: ( // Multi-Step Form Wizard
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-4">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map(i => (<>
          <div key={`dot-${i}`} className={`w-3 h-3 rounded-full border-2 ${i === 0 ? 'bg-cyan-400/60 border-cyan-400/60' : 'border-white/20'} animate-[wizardStep_4s_ease-in-out_infinite]`} style={{ animationDelay: `${i * 1.3}s` }} />
          {i < 2 && <div key={`line-${i}`} className="w-4 h-0.5 bg-white/10 rounded" />}
        </>))}
      </div>
      <div className="w-full h-6 bg-white/5 border border-white/10 rounded" />
    </div>
  ),
  50: ( // Animated Toggles
    <div className="w-full h-full flex items-center justify-center gap-3">
      <div className="w-10 h-5 bg-white/10 rounded-full p-0.5 relative">
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-[toggleSlide_2s_ease-in-out_infinite]" />
      </div>
    </div>
  ),

  /* ── Marketing ── */
  36: ( // Pricing Table Toggles
    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
      <div className="flex bg-white/5 rounded-full p-0.5">
        <div className="px-2 py-1 text-[7px] text-white/50 font-medium rounded-full animate-[pricingToggle_3s_ease-in-out_infinite]">Monthly</div>
        <div className="px-2 py-1 text-[7px] text-white/30 font-medium rounded-full">Yearly</div>
      </div>
      <div className="flex gap-1">
        {[19, 39, 99].map(p => (
          <div key={p} className="w-8 h-12 bg-white/5 border border-white/10 rounded p-1 flex flex-col items-center justify-center">
            <span className="text-[8px] text-white/60 font-bold">${p}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  37: ( // Testimonial Carousel
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className="flex gap-2 animate-[marquee_6s_linear_infinite]">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-16 h-10 bg-white/5 border border-white/10 rounded-lg p-1.5 shrink-0">
            <div className="h-1 bg-white/20 rounded w-8 mb-1" />
            <div className="h-1 bg-white/10 rounded w-10" />
          </div>
        ))}
      </div>
    </div>
  ),
  38: ( // Infinite Logo Marquee
    <div className="w-full h-full flex items-center overflow-hidden">
      <div className="flex gap-6 animate-[marquee_8s_linear_infinite] whitespace-nowrap">
        {['BRAND', 'LOGO', 'NEXOVA', 'STUDIO', 'DESIGN', 'BRAND', 'LOGO', 'NEXOVA'].map((text, i) => (
          <span key={i} className="text-white/30 text-[10px] font-bold tracking-widest">{text}</span>
        ))}
      </div>
    </div>
  ),
  39: ( // Countdown Timer
    <div className="w-full h-full flex items-center justify-center gap-1">
      {['02', '14', '36'].map((v, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded p-1 text-center">
          <div className="text-white/70 text-xs font-bold font-mono animate-[countFlip_1s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.3}s` }}>{v}</div>
          <div className="text-white/20 text-[6px]">{['HRS', 'MIN', 'SEC'][i]}</div>
        </div>
      ))}
    </div>
  ),
  40: ( // Comparison Slider
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="w-20 h-14 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-cyan-400/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-400/20 animate-[comparisonSlide_3s_ease-in-out_infinite]" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        <div className="absolute top-0 bottom-0 w-0.5 bg-white/60 animate-[sliderHandle_3s_ease-in-out_infinite]" />
      </div>
    </div>
  ),

  /* ── Data ── */
  32: ( // Interactive Charts
    <div className="w-full h-full flex items-end justify-center gap-1.5 pb-3 px-3">
      {[60, 80, 45, 90, 65].map((h, i) => (
        <div key={i} className="w-3 bg-gradient-to-t from-cyan-400/60 to-purple-500/60 rounded-t animate-[barGrow_2s_ease-out_infinite]" style={{ height: `${h}%`, animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  ),
  33: ( // Circular Progress Stats
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle cx="28" cy="28" r="22" fill="none" stroke="url(#grad)" strokeWidth="4" strokeDasharray="138" strokeLinecap="round" className="animate-[circleProgress_3s_ease-in-out_infinite]" />
        <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#5BC0BE" /><stop offset="100%" stopColor="#7C74EA" /></linearGradient></defs>
      </svg>
    </div>
  ),
  34: ( // Animated Number Counters
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className="text-2xl font-bold text-white/70 font-mono animate-[countUp_3s_ease-out_infinite] tabular-nums">
        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">100%</span>
      </div>
    </div>
  ),
  35: ( // Audio Waveforms
    <div className="w-full h-full flex items-center justify-center gap-0.5">
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="w-1 bg-gradient-to-t from-cyan-400/60 to-purple-500/60 rounded-full animate-[barWave_1s_ease-in-out_infinite]" style={{ height: '20px', animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  ),

  /* ── Feedback ── */
  56: ( // Toast Notifications
    <div className="w-full h-full flex flex-col items-end justify-start pt-2 pr-2 gap-1">
      <div className="bg-green-400/15 border border-green-400/20 rounded-lg px-2 py-1 flex items-center gap-1 animate-[toastSlide_3s_ease-in-out_infinite]">
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
        <span className="text-[7px] text-white/50">Success</span>
      </div>
    </div>
  ),
  57: ( // Success/Error Morphs
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-green-400/50 flex items-center justify-center animate-[morphCheck_2s_ease-in-out_infinite]">
        <svg className="w-5 h-5 text-green-400/70" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4,10 8,14 16,6" className="animate-[drawLine_2s_ease-in-out_infinite]" strokeDasharray="20" /></svg>
      </div>
    </div>
  ),
  58: ( // Confetti Explosion
    <div className="w-full h-full relative overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 rounded-full animate-[confettiPop_2s_ease-out_infinite]" style={{ left: '50%', top: '50%', backgroundColor: ['#5BC0BE', '#7C74EA', '#f59e0b', '#ec4899', '#22c55e'][i % 5], animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  ),
  59: ( // Advanced Skeleton Loaders
    <div className="w-full h-full flex items-center justify-center px-3">
      <div className="w-full space-y-2">
        <div className="flex gap-2"><div className="w-8 h-8 rounded bg-white/10 animate-[shimmer_1.5s_ease-in-out_infinite]" /><div className="flex-1 space-y-1"><div className="h-2 bg-white/10 rounded animate-[shimmer_1.5s_ease-in-out_infinite_0.2s]" /><div className="h-2 bg-white/10 rounded w-2/3 animate-[shimmer_1.5s_ease-in-out_infinite_0.4s]" /></div></div>
      </div>
    </div>
  ),

  /* ── Loading ── */
  24: ( // Loading Skeleton Screens
    <div className="w-full h-full flex items-center justify-center px-3">
      <div className="w-full space-y-2">
        <div className="h-3 bg-white/10 rounded animate-[shimmer_1.5s_ease-in-out_infinite]" />
        <div className="h-3 bg-white/10 rounded w-3/4 animate-[shimmer_1.5s_ease-in-out_infinite_0.3s]" />
        <div className="h-3 bg-white/10 rounded w-1/2 animate-[shimmer_1.5s_ease-in-out_infinite_0.6s]" />
      </div>
    </div>
  ),
  25: ( // Loading Animations — spinning ring
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-cyan-400/60 animate-[spin_1s_linear_infinite]" />
    </div>
  ),
  74: ( // Morphing SVG Loader
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/40 to-purple-500/40 animate-[blob_3s_ease-in-out_infinite]" />
    </div>
  ),

  /* ── Media ── */
  75: ( // Audio Visualizer
    <div className="w-full h-full flex items-center justify-center gap-0.5">
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} className="w-1.5 bg-gradient-to-t from-cyan-400/50 to-purple-500/50 rounded-full animate-[barWave_0.8s_ease-in-out_infinite]" style={{ height: '24px', animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  ),
  84: ( // Swipeable Story View
    <div className="w-full h-full flex items-center justify-center gap-1">
      {[0, 1, 2].map(i => (
        <div key={i} className={`w-10 h-14 rounded-lg border ${i === 1 ? 'border-cyan-400/40 bg-cyan-400/5 scale-110' : 'border-white/10 bg-white/5 scale-90 opacity-50'}`}>
          <div className="flex gap-0.5 p-1">{[0, 1, 2].map(j => <div key={j} className={`flex-1 h-0.5 rounded-full ${i === 1 && j === 0 ? 'bg-cyan-400/60' : 'bg-white/15'}`} />)}</div>
        </div>
      ))}
    </div>
  ),
  90: ( // Magnetic Image Gallery
    <div className="w-full h-full flex items-center justify-center gap-1">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-6 h-8 bg-gradient-to-br from-white/10 to-white/5 rounded border border-white/10 animate-[magnetPull_3s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
    </div>
  ),

  /* ── Branding ── */
  10: ( // Animated Logos
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/60 text-lg font-black tracking-tighter animate-[logoReveal_3s_ease-in-out_infinite]">N<span className="text-cyan-400/70">X</span></div>
    </div>
  ),

  /* ── Character ── */
  13: ( // Character Website Animations
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-white/20 mx-auto" />
        <div className="w-8 h-10 bg-white/15 rounded-lg mx-auto -mt-1 animate-[characterBounce_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  ),

  /* ── Layout ── */
  23: ( // Hero Section Animations
    <div className="w-full h-full flex items-center justify-center px-3">
      <div className="w-full space-y-2 text-center">
        <div className="h-2 bg-white/25 rounded mx-auto w-12 animate-[fadeInUp_2s_ease-out_infinite]" />
        <div className="h-1.5 bg-white/15 rounded mx-auto w-16 animate-[fadeInUp_2s_ease-out_infinite_0.2s]" />
        <div className="h-4 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded mx-auto w-10 mt-2 animate-[fadeInUp_2s_ease-out_infinite_0.4s]" />
      </div>
    </div>
  ),
  95: ( // Vertical Card Stack
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-16 h-12">
        {[0, 1, 2].map(i => (
          <div key={i} className="absolute w-16 bg-white/10 border border-white/15 rounded-lg animate-[stackPeel_3s_ease-in-out_infinite]" style={{ height: `${36 - i * 2}px`, top: `${i * 6}px`, left: `${i * 3}px`, zIndex: 3 - i, animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>
    </div>
  ),

  /* ── AI & Tech ── */
  64: ( // AI Voice Waveform
    <div className="w-full h-full flex items-center justify-center gap-0.5">
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="w-1 rounded-full bg-gradient-to-t from-cyan-400/50 to-purple-500/50 animate-[aiWave_1.5s_ease-in-out_infinite]" style={{ height: '20px', animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  ),

  /* ── Tech/SaaS ── */
  65: ( // Code Typing Terminal
    <div className="w-full h-full flex items-start justify-start p-2 overflow-hidden bg-[#0d1117]">
      <div className="font-mono text-[7px] leading-relaxed">
        <div className="text-green-400/60">$ npm run build</div>
        <div className="text-white/30 animate-[typing_3s_steps(20,end)_infinite] overflow-hidden whitespace-nowrap">✓ Compiled successfully</div>
      </div>
    </div>
  ),

  /* ── Presentation ── */
  67: ( // Parallax Device Scroll
    <div className="w-full h-full flex items-center justify-center gap-2">
      <div className="w-6 h-10 border-2 border-white/20 rounded-lg animate-[el-float_3s_ease-in-out_infinite]">
        <div className="mx-auto mt-0.5 w-3 h-0.5 bg-white/15 rounded-full" />
      </div>
      <div className="w-10 h-7 border-2 border-white/20 rounded-lg animate-[el-float_3s_ease-in-out_infinite_0.5s]">
        <div className="mx-auto mt-0.5 w-2 h-0.5 bg-white/15 rounded-full" />
      </div>
    </div>
  ),

  /* ── Science ── */
  98: ( // Interactive DNA Helix
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-1 animate-[spinSlow_4s_linear_infinite]">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-0" style={{ transform: `translateX(${Math.sin(i * 1.2) * 6}px)` }}>
            <div className="w-2 h-2 rounded-full bg-cyan-400/50" />
            <div className="w-4 h-0.5 bg-white/15" />
            <div className="w-2 h-2 rounded-full bg-purple-400/50" />
          </div>
        ))}
      </div>
    </div>
  ),
};

/* ── Fallback preview per category (for any animations without a specific preview) ── */
const CATEGORY_FALLBACK: Record<string, ReactNode> = {
  'Interaction': (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-purple-400/40 rounded-full animate-[pulse_2s_ease-in-out_infinite] relative">
        <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-[ripple_2s_ease-out_infinite]" />
      </div>
    </div>
  ),
  'Style': (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-14 h-14 bg-gradient-to-br from-pink-400/30 via-purple-400/30 to-cyan-400/30 animate-[blob_5s_ease-in-out_infinite] opacity-70" />
    </div>
  ),
  'Background': (
    <div className="w-full h-full bg-gradient-to-br from-[#5BC0BE]/30 via-[#7C74EA]/30 to-[#455263]/30 bg-[length:200%_200%] animate-[bgshift_5s_ease-in-out_infinite_alternate]" />
  ),
  '3D & Immersion': (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '200px' }}>
      <div className="w-12 h-12 border-2 border-cyan-400/40 animate-[spin3d_4s_linear_infinite]" />
    </div>
  ),
  'Vector': (
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-16 h-12" viewBox="0 0 64 48"><path d="M8,40 Q32,0 56,40" fill="none" stroke="rgba(91,192,190,0.5)" strokeWidth="2" strokeDasharray="80" className="animate-[drawLine_3s_ease-in-out_infinite]" /></svg>
    </div>
  ),
  'Typography': (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-white/70 text-base font-black animate-[kineticType_2s_ease-in-out_infinite]">Aa</span>
    </div>
  ),
  'Text': (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-white/60 font-mono text-xs overflow-hidden whitespace-nowrap border-r border-white/40 animate-[typing_3s_steps(8,end)_infinite,blink_0.75s_step-end_infinite]">Nexova</span>
    </div>
  ),
  'UI Elements': (
    <div className="w-full h-full flex items-center justify-center gap-2">
      <div className="w-6 h-6 rounded bg-cyan-400/20 border border-cyan-400/30 animate-[pulse_1.5s_ease-in-out_infinite]" />
      <div className="w-6 h-6 rounded-full bg-purple-400/20 border border-purple-400/30 animate-[pulse_1.5s_ease-in-out_infinite_0.3s]" />
    </div>
  ),
  'Navigation': (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
      {[1, 2, 3].map(i => <div key={i} className="w-8 h-0.5 bg-white/25 rounded animate-[shimmer_2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />)}
    </div>
  ),
  'Forms': (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="w-full h-6 border border-white/15 rounded px-2 flex items-center"><div className="w-1 h-3 bg-cyan-400/50 animate-[blink_1s_step-end_infinite]" /></div>
    </div>
  ),
  'Marketing': (
    <div className="w-full h-full flex items-center overflow-hidden">
      <div className="flex gap-4 animate-[marquee_6s_linear_infinite] whitespace-nowrap">
        {['★★★★★', '★★★★★', '★★★★★', '★★★★★'].map((s, i) => <span key={i} className="text-yellow-400/40 text-xs">{s}</span>)}
      </div>
    </div>
  ),
  'Data': (
    <div className="w-full h-full flex items-end justify-center gap-1 pb-3">
      {[40, 65, 50, 80].map((h, i) => <div key={i} className="w-2.5 bg-gradient-to-t from-cyan-400/40 to-purple-500/40 rounded-t animate-[barGrow_2s_ease-out_infinite]" style={{ height: `${h}%`, animationDelay: `${i * 0.2}s` }} />)}
    </div>
  ),
  'Feedback': (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-green-400/40 flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]"><span className="text-green-400/60 text-xs">✓</span></div>
    </div>
  ),
  'Loading': (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-cyan-400/50 animate-[spin_1s_linear_infinite]" />
    </div>
  ),
  'Media': (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center"><div className="w-0 h-0 border-l-[8px] border-l-white/50 border-y-[5px] border-y-transparent ml-1" /></div>
    </div>
  ),
  'Branding': (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/50 text-lg font-black animate-[pulse_2s_ease-in-out_infinite]">N</div>
    </div>
  ),
  'Character': (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-5 h-5 rounded-full bg-white/20 animate-[bounce_1.5s_ease-in-out_infinite]" />
    </div>
  ),
  'Layout': (
    <div className="w-full h-full flex items-center justify-center px-3 gap-1">
      <div className="w-3 h-10 bg-white/10 rounded" />
      <div className="flex-1 h-10 bg-white/5 rounded" />
    </div>
  ),
  'AI & Tech': (
    <div className="w-full h-full flex items-center justify-center gap-0.5">
      {[0, 1, 2, 3, 4].map(i => <div key={i} className="w-1 rounded-full bg-cyan-400/40 animate-[aiWave_1.5s_ease-in-out_infinite]" style={{ height: '16px', animationDelay: `${i * 0.15}s` }} />)}
    </div>
  ),
  'Tech/SaaS': (
    <div className="w-full h-full flex items-start p-2 bg-[#0d1117]">
      <div className="text-green-400/50 font-mono text-[7px]">$ _<span className="animate-[blink_1s_step-end_infinite]">|</span></div>
    </div>
  ),
  'Presentation': (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-8 border-2 border-white/20 rounded-lg animate-[el-float_3s_ease-in-out_infinite]" />
    </div>
  ),
  'Science': (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border border-cyan-400/30 animate-[spinSlow_6s_linear_infinite] relative">
        <div className="absolute w-2 h-2 bg-cyan-400/50 rounded-full top-0 left-1/2 -translate-x-1/2" />
      </div>
    </div>
  ),
};

function getPreview(anim: Animation): ReactNode {
  return PREVIEW[anim.id] ?? CATEGORY_FALLBACK[anim.category] ?? CATEGORY_FALLBACK['Style'];
}

/* ── Category badge colors ── */
const CATEGORY_COLORS: Record<string, string> = {
  '3D & Immersion': 'bg-blue-100 text-blue-700',
  Interaction: 'bg-purple-100 text-purple-700',
  Background: 'bg-teal-100 text-teal-700',
  Style: 'bg-pink-100 text-pink-700',
  Vector: 'bg-emerald-100 text-emerald-700',
  Typography: 'bg-amber-100 text-amber-700',
  Text: 'bg-amber-100 text-amber-700',
  'UI Elements': 'bg-sky-100 text-sky-700',
  Navigation: 'bg-indigo-100 text-indigo-700',
  Forms: 'bg-green-100 text-green-700',
  Marketing: 'bg-rose-100 text-rose-700',
  Data: 'bg-cyan-100 text-cyan-700',
  Feedback: 'bg-orange-100 text-orange-700',
  Loading: 'bg-yellow-100 text-yellow-700',
  Media: 'bg-violet-100 text-violet-700',
  Branding: 'bg-fuchsia-100 text-fuchsia-700',
  Character: 'bg-lime-100 text-lime-700',
  Layout: 'bg-slate-100 text-slate-700',
  'AI & Tech': 'bg-cyan-100 text-cyan-700',
  'Tech/SaaS': 'bg-blue-100 text-blue-700',
  Presentation: 'bg-indigo-100 text-indigo-700',
  Science: 'bg-emerald-100 text-emerald-700',
};

export function AnimationShowcase() {
  const grouped = getAnimationsByCategory();
  const sortedCategories = Array.from(grouped.entries()).sort(
    (a, b) => b[1].length - a[1].length,
  );

  return (
    <>
      {/* ═══ All 100 animations grouped by category ═══ */}
      <div className="space-y-14">
        {sortedCategories.map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-5">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                {category}
              </h4>
              <span className="text-xs text-gray-400 font-medium">
                {items.length} animation{items.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((anim) => (
                <div
                  key={anim.id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Dark animated preview */}
                  <div className="aspect-video bg-gradient-to-br from-[#455263] to-[#2D2B4A] relative overflow-hidden">
                    {getPreview(anim)}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5 ${
                        CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {category}
                    </span>
                    <h5 className="text-sm font-semibold text-gray-800 group-hover:text-[#5BC0BE] transition-colors">
                      {anim.title}
                    </h5>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {anim.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <p className="text-sm text-gray-500 mb-4">
          All {animations.length} animations available inside X.IDE — live,
          interactive, and copy-ready.
        </p>
        <Link href="/builder">
          <button className="px-8 py-3 bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full text-sm font-semibold shadow-md transition-all">
            Open full library in X.IDE →
          </button>
        </Link>
      </div>
    </>
  );
}

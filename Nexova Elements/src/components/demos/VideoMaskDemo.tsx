"use client";

import { motion } from "framer-motion";

interface VideoMaskDemoProps {
  text?: string;
  fontSize?: number;
  opacity?: number;
}

export default function VideoMaskDemo(props: VideoMaskDemoProps) {
  return <VideoMaskImplementation {...props} />;
}

export function VideoMaskImplementation({
  text = "VIBE",
  fontSize = 96,
  opacity = 0.5,
}: VideoMaskDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity }}
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-196-large.mp4"
            type="video/mp4"
          />
        </video>
        
        <div className="relative z-10 mix-blend-screen bg-black w-full h-full flex items-center justify-center">
          <h1 
            className="font-black text-white tracking-tighter uppercase"
            style={{ fontSize }}
          >
            {text}
          </h1>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";

interface VideoWidgetProps {
  src?: string;
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export default function VideoWidget({
  src = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  autoplay = false,
  mute = false,
  loop = false,
  controls = true,
}: VideoWidgetProps) {
  return (
    <div style={{ width: "100%", borderRadius: "8px", overflow: "hidden", aspectRatio: "16/9" }}>
      <iframe
        width="100%"
        height="100%"
        src={`${src}?autoplay=${autoplay ? 1 : 0}&mute=${mute ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`}
        title="Video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

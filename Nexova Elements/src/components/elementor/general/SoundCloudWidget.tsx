"use client";

import React from "react";

interface SoundCloudWidgetProps {
  url?: string;
  visual?: boolean;
  autoplay?: boolean;
  height?: string;
  color?: string;
}

export default function SoundCloudWidget({
  url = "https://soundcloud.com/octobersveryown/drake-gods-plan",
  visual = true,
  autoplay = false,
  height = visual ? "300" : "166",
  color = "ff5500",
}: SoundCloudWidgetProps) {
  const encodedUrl = encodeURIComponent(url);
  const src = `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23${color}&auto_play=${autoplay}&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=${visual}`;

  return (
    <div className="w-full overflow-hidden rounded-md shadow-sm">
      <iframe
        width="100%"
        height={height}
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={src}
        title="SoundCloud Player"
        className="block"
      ></iframe>
    </div>
  );
}

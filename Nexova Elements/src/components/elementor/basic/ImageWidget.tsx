"use client";

import React from "react";
import Image from "next/image";

interface ImageWidgetProps {
  src?: string;
  width?: "thumbnail" | "medium" | "large" | "full";
  align?: "left" | "center" | "right";
  caption?: string;
  link?: string;
}

export default function ImageWidget({
  src = "https://picsum.photos/seed/elementor/800/600",
  width = "large",
  align = "center",
  caption = "",
  link = "",
}: ImageWidgetProps) {
  const getWidth = () => {
    switch (width) {
      case "thumbnail": return "150px";
      case "medium": return "300px";
      case "large": return "1024px";
      case "full": return "100%";
      default: return "100%";
    }
  };

  const img = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center" }}>
      <div style={{ position: "relative", width: getWidth(), maxWidth: "100%", height: "auto", aspectRatio: "16/9" }}>
        <Image
          src={src}
          alt={caption || "Widget"}
          fill
          style={{
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </div>
      {caption && <p style={{ marginTop: "8px", color: "#71717a", fontSize: "0.875rem" }}>{caption}</p>}
    </div>
  );

  if (link) {
    return <a href={link} style={{ display: "block", width: "100%" }}>{img}</a>;
  }

  return <div style={{ width: "100%" }}>{img}</div>;
}

"use client";

import React from "react";
import Image from "next/image";

interface ImageBoxWidgetProps {
  image?: string;
  title?: string;
  description?: string;
  position?: "top" | "left" | "right";
  align?: "left" | "center" | "right" | "justify";
}

export default function ImageBoxWidget({
  image = "https://picsum.photos/seed/imgbox/800/600",
  title = "This is the heading",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  position = "top",
  align = "center",
}: ImageBoxWidgetProps) {
  const isHorizontal = position === "left" || position === "right";
  const flexDirection = position === "right" ? "row-reverse" : position === "left" ? "row" : "column";

  return (
    <div 
      className="flex gap-4"
      style={{ 
        flexDirection: flexDirection as React.CSSProperties['flexDirection'],
        textAlign: align,
        alignItems: isHorizontal ? "flex-start" : align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center"
      }}
    >
      <div className={`${isHorizontal ? "w-1/3" : "w-full mb-4"} relative aspect-video`}>
        <Image src={image} alt={title} fill className="rounded-lg object-cover" />
      </div>
      <div className={`${isHorizontal ? "w-2/3" : "w-full"}`}>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

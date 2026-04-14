"use client";

import React from "react";
import Image from "next/image";

interface TestimonialWidgetProps {
  content?: string;
  name?: string;
  job?: string;
  imagePosition?: "aside" | "top";
  align?: "left" | "center" | "right";
}

export default function TestimonialWidget({
  content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  name = "John Doe",
  job = "Designer",
  imagePosition = "aside",
  align = "left",
}: TestimonialWidgetProps) {
  const isAside = imagePosition === "aside";

  return (
    <div 
      className={`flex ${isAside ? "flex-row gap-4" : "flex-col gap-4"}`}
      style={{ 
        textAlign: align,
        alignItems: isAside ? "flex-start" : align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center"
      }}
    >
      <div className={`flex-shrink-0 ${isAside ? "" : "mx-auto"}`}>
        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden relative">
          <Image src="https://picsum.photos/seed/testimonial/100/100" alt={name} fill className="object-cover" />
        </div>
      </div>
      <div>
        <p className="text-gray-600 italic mb-4">&quot;{content}&quot;</p>
        <h4 className="font-bold text-gray-800">{name}</h4>
        <span className="text-sm text-gray-500">{job}</span>
      </div>
    </div>
  );
}

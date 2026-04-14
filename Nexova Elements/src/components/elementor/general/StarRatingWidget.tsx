"use client";

import React from "react";
import { Star } from "lucide-react";

interface StarRatingWidgetProps {
  rating?: number;
  style?: "star" | "outline";
  align?: "left" | "center" | "right";
  title?: string;
}

export default function StarRatingWidget({
  rating = 5,
  style = "star",
  align = "center",
  title = "",
}: StarRatingWidgetProps) {
  return (
    <div className="flex flex-col gap-2" style={{ alignItems: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center" }}>
      {title && <span className="font-bold text-gray-800">{title}</span>}
      <div className="flex gap-1 text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < Math.round((rating / 10) * 5);
          return (
            <Star 
              key={i} 
              size={20} 
              fill={style === "star" && isFilled ? "currentColor" : "none"} 
              strokeWidth={style === "outline" ? 2 : isFilled ? 0 : 2}
            />
          );
        })}
      </div>
    </div>
  );
}

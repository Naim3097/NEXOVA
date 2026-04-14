"use client";

import React from "react";
import Image from "next/image";

interface GalleryItem {
  id: number | string;
  src: string;
  alt?: string;
}

interface BasicGalleryWidgetProps {
  columns?: "1" | "2" | "3" | "4" | "5" | "6";
  gap?: number;
  lightbox?: boolean;
  images?: GalleryItem[];
}

export default function BasicGalleryWidget({
  columns = "4",
  gap = 10,
  lightbox = true,
  images = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    src: `https://picsum.photos/seed/gallery${i}/300/300`,
    alt: `Gallery Item ${i}`
  })),
}: BasicGalleryWidgetProps) {
  const gridCols = {
    "1": "grid-cols-1",
    "2": "grid-cols-2",
    "3": "grid-cols-3",
    "4": "grid-cols-4",
    "5": "grid-cols-5",
    "6": "grid-cols-6",
  };

  return (
    <div className={`grid ${gridCols[columns]}`} style={{ gap: `${gap}px` }}>
      {images.map((item) => (
        <div key={item.id} className="relative group overflow-hidden rounded cursor-pointer aspect-square">
          <Image 
            src={item.src} 
            alt={item.alt || "Gallery Image"} 
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {lightbox && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-2xl">+</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

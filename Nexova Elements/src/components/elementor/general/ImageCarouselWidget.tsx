"use client";

import React from "react";
import Image from "next/image";

interface CarouselImage {
  id: number | string;
  src: string;
  alt?: string;
}

interface ImageCarouselWidgetProps {
  slidesToShow?: number;
  slidesToScroll?: number;
  autoplay?: boolean;
  arrows?: boolean;
  dots?: boolean;
  images?: CarouselImage[];
}

export default function ImageCarouselWidget({
  slidesToShow = 3,
  slidesToScroll: _slidesToScroll = 1,
  autoplay: _autoplay = true,
  arrows: _arrows = true,
  dots = true,
  images = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    src: `https://picsum.photos/seed/carousel${i}/400/300`,
    alt: `Slide ${i}`
  })),
}: ImageCarouselWidgetProps) {
  return (
    <div className="w-full overflow-hidden relative group">
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
        {images.map((img) => (
          <div 
            key={img.id} 
            className="flex-shrink-0 snap-center rounded-lg overflow-hidden relative aspect-[4/3]"
            style={{ width: `calc(100% / ${slidesToShow} - 16px)` }}
          >
            <Image 
              src={img.src} 
              alt={img.alt || "Slide"} 
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
      {dots && (
        <div className="flex justify-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
      )}
    </div>
  );
}

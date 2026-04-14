"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
  id: number | string;
  image: string;
  title?: string;
  link?: string;
}

interface MediaCarouselWidgetProps {
  skin?: "carousel" | "slideshow" | "coverflow";
  slidesToShow?: number;
  height?: number;
  autoplay?: boolean;
  items?: MediaItem[];
}

export default function MediaCarouselWidget({
  skin = "carousel",
  slidesToShow = 3,
  height = 300,
  autoplay = true,
  items = [
    { id: 1, image: "https://picsum.photos/seed/media1/600/400", title: "Image Title 1" },
    { id: 2, image: "https://picsum.photos/seed/media2/600/400", title: "Image Title 2" },
    { id: 3, image: "https://picsum.photos/seed/media3/600/400", title: "Image Title 3" },
    { id: 4, image: "https://picsum.photos/seed/media4/600/400", title: "Image Title 4" },
    { id: 5, image: "https://picsum.photos/seed/media5/600/400", title: "Image Title 5" },
    { id: 6, image: "https://picsum.photos/seed/media6/600/400", title: "Image Title 6" },
  ],
}: MediaCarouselWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Ensure we don't show more slides than we have items
  const effectiveSlidesToShow = Math.min(slidesToShow, items.length);
  const maxIndex = items.length - effectiveSlidesToShow;

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [autoplay, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="w-full relative group overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ 
          transform: `translateX(-${currentIndex * (100 / effectiveSlidesToShow)}%)`,
        }}
      >
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex-shrink-0 px-2"
            style={{ 
              width: `${100 / effectiveSlidesToShow}%`,
              height: `${height}px`
            }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-md group/item">
              <Image 
                src={item.image} 
                alt={item.title || `Slide ${item.id}`} 
                fill
                className="object-cover group-hover/item:scale-110 transition-transform duration-700"
              />
              {item.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium">{item.title}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

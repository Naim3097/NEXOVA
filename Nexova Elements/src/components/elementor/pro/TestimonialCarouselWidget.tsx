"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number | string;
  name: string;
  role: string;
  content: string;
  image?: string;
}

interface TestimonialCarouselWidgetProps {
  slidesToShow?: number;
  skin?: "default" | "bubble";
  align?: "left" | "center" | "right";
  autoplay?: boolean;
  testimonials?: Testimonial[];
}

export default function TestimonialCarouselWidget({
  slidesToShow = 1,
  skin = "default",
  align = "center",
  autoplay = true,
  testimonials = [
    { id: 1, name: "John Doe", role: "Designer", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis." },
    { id: 2, name: "Jane Smith", role: "Developer", content: "Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Sed do eiusmod tempor incididunt." },
    { id: 3, name: "Mike Johnson", role: "Manager", content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." },
    { id: 4, name: "Sarah Williams", role: "CEO", content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
  ],
}: TestimonialCarouselWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const effectiveSlidesToShow = Math.min(slidesToShow, testimonials.length);
  const maxIndex = testimonials.length - effectiveSlidesToShow;

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [autoplay, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="w-full relative group overflow-hidden py-4">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ 
          transform: `translateX(-${currentIndex * (100 / effectiveSlidesToShow)}%)`,
        }}
      >
        {testimonials.map((t) => (
          <div 
            key={t.id} 
            className="flex-shrink-0 px-3"
            style={{ width: `${100 / effectiveSlidesToShow}%` }}
          >
            <div className={`h-full ${skin === "bubble" ? "bg-white rounded-lg shadow-md p-6 relative mb-4" : "text-center"}`}>
              {skin === "bubble" && (
                <div className="absolute bottom-[-10px] left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white filter drop-shadow-sm"></div>
              )}
              
              <p className={`text-gray-600 italic mb-6 ${skin === "bubble" ? "" : "text-lg"}`} style={{ textAlign: align }}>
                &quot;{t.content}&quot;
              </p>
              
              <div className={`flex items-center gap-4 ${align === "center" && skin !== "bubble" ? "justify-center" : ""}`}>
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                   <img src={t.image || `https://i.pravatar.cc/150?u=${t.id}`} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-800">{t.name}</h4>
                  <span className="text-sm text-gray-500">{t.role}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

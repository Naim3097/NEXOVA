"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number | string;
  image: string;
  title: string;
  description: string;
  button: string;
}

interface SlidesWidgetProps {
  height?: number;
  autoplay?: boolean;
  speed?: number;
  arrows?: boolean;
  dots?: boolean;
  slides?: Slide[];
}

export default function SlidesWidget({
  height = 400,
  autoplay = true,
  speed = 5000,
  arrows = true,
  dots = true,
  slides = [
    {
      id: 1,
      image: "https://picsum.photos/seed/slide1/1200/800",
      title: "Amazing Slide Title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
      button: "Click Here"
    },
    {
      id: 2,
      image: "https://picsum.photos/seed/slide2/1200/800",
      title: "Discover New Horizons",
      description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
      button: "Learn More"
    },
    {
      id: 3,
      image: "https://picsum.photos/seed/slide3/1200/800",
      title: "Create Your Future",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      button: "Get Started"
    }
  ],
}: SlidesWidgetProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, speed);

    return () => clearInterval(interval);
  }, [autoplay, speed, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 group" style={{ height: `${height}px` }}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative z-10 text-center text-white px-4 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8">{slide.description}</p>
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors">
                {slide.button}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      {arrows && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Dots */}
      {dots && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Star, Twitter, Facebook, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewItem {
  id: number;
  name: string;
  date: string;
  content: string;
  rating: number;
  image?: string;
}

interface ReviewsWidgetProps {
  slidesToShow?: number;
  showImage?: boolean;
  showRating?: boolean;
  source?: "google" | "twitter" | "facebook";
  reviews?: ReviewItem[];
  autoplay?: boolean;
}

export default function ReviewsWidget({
  slidesToShow = 3,
  showImage = true,
  showRating = true,
  source = "google",
  autoplay = true,
  reviews = [
    { id: 1, name: "Alice Freeman", date: "2 days ago", content: "Absolutely love this product! It has changed the way I work completely.", rating: 5 },
    { id: 2, name: "Bob Smith", date: "1 week ago", content: "Great support and amazing features. Highly recommended.", rating: 5 },
    { id: 3, name: "Charlie Brown", date: "2 weeks ago", content: "Good value for money. I would like to see more updates though.", rating: 4 },
    { id: 4, name: "Diana Prince", date: "1 month ago", content: "The best in the market. Don't hesitate to buy it.", rating: 5 },
    { id: 5, name: "Evan Wright", date: "2 months ago", content: "Simple, clean, and effective. Just what I needed.", rating: 5 },
  ],
}: ReviewsWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const effectiveSlidesToShow = isMobile ? 1 : Math.min(slidesToShow, reviews.length);
  const maxIndex = Math.max(0, reviews.length - effectiveSlidesToShow);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay, maxIndex]);

  const nextSlide = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

  const getIcon = () => {
    switch (source) {
      case "twitter": return <Twitter size={16} className="text-blue-400" />;
      case "facebook": return <Facebook size={16} className="text-blue-600" />;
      default: return <span className="font-bold text-blue-500 text-lg">G</span>;
    }
  };

  return (
    <div className="relative group w-full overflow-hidden py-4">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ 
          transform: `translateX(-${currentIndex * (100 / effectiveSlidesToShow)}%)`,
        }}
      >
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="flex-shrink-0 px-3"
            style={{ width: `${100 / effectiveSlidesToShow}%` }}
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {showImage && (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden border border-gray-200">
                       <img 
                         src={review.image || `https://i.pravatar.cc/150?u=${review.id + 10}`} 
                         alt={review.name} 
                         className="w-full h-full object-cover" 
                       />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-full">
                  {getIcon()}
                </div>
              </div>
              
              {showRating && (
                <div className="flex text-yellow-400 mb-3 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < review.rating ? "currentColor" : "none"} 
                      className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              )}
              
              <p className="text-gray-600 text-sm leading-relaxed flex-grow italic">
                &quot;{review.content}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-blue-600 w-6" : "bg-gray-300 hover:bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";

interface CallToActionWidgetProps {
  skin?: "classic" | "cover";
  title?: string;
  description?: string;
  buttonText?: string;
  position?: "left" | "center" | "right";
  image?: string;
  link?: string;
}

export default function CallToActionWidget({
  skin = "classic",
  title = "This is the heading",
  description = "Lorem ipsum dolor sit amet consectetur.",
  buttonText = "Click Here",
  position = "center",
  image = "https://picsum.photos/seed/cta/800/400",
  link = "#",
}: CallToActionWidgetProps) {
  const isCover = skin === "cover";

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${isCover ? "h-80" : "bg-white shadow-md"}`}
    >
      {isCover && (
        <div className="absolute inset-0">
          <Image 
            src={image} 
            alt="Background" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className={`relative z-10 p-8 flex flex-col ${isCover ? "h-full justify-center text-white" : "text-gray-800"}`}
           style={{ alignItems: position === "left" ? "flex-start" : position === "right" ? "flex-end" : "center", textAlign: position }}>
        
        {!isCover && (
          <div className="mb-6 w-full h-48 overflow-hidden rounded-md relative">
             <Image src={image} alt="CTA" fill className="object-cover" />
          </div>
        )}

        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className={`mb-6 max-w-xl ${isCover ? "text-gray-200" : "text-gray-600"}`}>{description}</p>
        
        <a 
          href={link}
          className={`px-6 py-3 rounded font-semibold transition-colors inline-block ${
          isCover 
            ? "bg-white text-black hover:bg-gray-100" 
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}>
          {buttonText}
        </a>
      </div>
    </div>
  );
}

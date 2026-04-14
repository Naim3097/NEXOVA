"use client";

import React from "react";
import Image from "next/image";

interface PriceItem {
  title: string;
  price: string;
  description: string;
  image?: string;
}

interface PriceListWidgetProps {
  items?: PriceItem[];
  showImage?: boolean;
  separator?: "solid" | "dotted" | "dashed" | "double" | "none";
}

export default function PriceListWidget({
  items = [
    { title: "Classic Haircut", price: "$25", description: "Includes wash and style", image: "https://picsum.photos/seed/price1/100/100" },
    { title: "Beard Trim", price: "$15", description: "Shape up and trim", image: "https://picsum.photos/seed/price2/100/100" },
    { title: "Full Service", price: "$45", description: "Haircut, beard trim, and hot towel", image: "https://picsum.photos/seed/price3/100/100" },
  ],
  showImage = true,
  separator = "dotted",
}: PriceListWidgetProps) {
  return (
    <ul className="space-y-6">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-4 group">
          {showImage && item.image && (
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative border-2 border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-grow">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-bold text-gray-800 text-lg">{item.title}</span>
              {separator !== "none" && (
                <span 
                  className={`flex-grow mx-3 border-gray-300 opacity-50 ${separator === "double" ? "border-b-4" : "border-b-2"}`} 
                  style={{ borderBottomStyle: separator }}
                />
              )}
              <span className="font-bold text-blue-600 text-lg">{item.price}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

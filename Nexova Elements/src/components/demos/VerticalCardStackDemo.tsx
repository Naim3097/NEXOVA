"use client";

import { motion } from "framer-motion";

interface CardItem {
  id: number;
  color: string;
  title: string;
}

interface VerticalCardStackProps {
  items?: CardItem[];
  offset?: number;
  scaleFactor?: number;
}

export function VerticalCardStack({
  items = [
    { id: 1, color: "#ef4444", title: "Card 1" }, // red-500
    { id: 2, color: "#3b82f6", title: "Card 2" }, // blue-500
    { id: 3, color: "#22c55e", title: "Card 3" }, // green-500
    { id: 4, color: "#a855f7", title: "Card 4" }, // purple-500
  ],
  offset = 100,
  scaleFactor = 0.05
}: VerticalCardStackProps) {
  return (
    <div className="w-full h-full min-h-[400px] bg-zinc-900 overflow-y-auto p-8 relative">
      <div className="space-y-8 pb-32">
        <div className="text-center text-zinc-500 mb-8">Scroll Down</div>
        {items.map((card, index) => (
          <div
            key={card.id}
            className="sticky top-8 mx-auto w-48 h-64 rounded-xl shadow-xl flex items-center justify-center text-white font-bold text-2xl"
            style={{
              backgroundColor: card.color,
              zIndex: index,
              marginTop: index === 0 ? 0 : `-${offset}px`,
              transform: `scale(${1 - index * scaleFactor})`,
            }}
          >
            <div 
              className="w-full h-full rounded-xl flex items-center justify-center"
              style={{ backgroundColor: card.color }}
            >
              {card.title}
            </div>
          </div>
        ))}
        <div className="h-32" />
      </div>
    </div>
  );
}

export default function VerticalCardStackDemo(props: VerticalCardStackProps) {
  return <VerticalCardStack {...props} />;
}

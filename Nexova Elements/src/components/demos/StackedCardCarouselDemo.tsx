"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

interface StackedCardCarouselDemoProps {
  textColor?: string;
  cards?: { id: number; color: string; text: string }[];
}

export default function StackedCardCarouselDemo(props: StackedCardCarouselDemoProps) {
  return <StackedCardCarouselImplementation {...props} />;
}

export function StackedCardCarouselImplementation({
  textColor = "#ffffff",
  cards: initialCards = [
    { id: 1, color: "bg-red-500", text: "Design" },
    { id: 2, color: "bg-blue-500", text: "Develop" },
    { id: 3, color: "bg-green-500", text: "Ship" },
    { id: 4, color: "bg-purple-500", text: "Profit" },
  ],
}: StackedCardCarouselDemoProps) {
  const [cards, setCards] = useState(initialCards);

  const removeCard = (id: number) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    // Reset if empty for demo purposes
    if (cards.length <= 1) {
      setTimeout(() => setCards(initialCards), 500);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-zinc-900 overflow-hidden relative">
      <div className="relative w-64 h-96">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isFront = index === cards.length - 1;
            return (
              <Card
                key={card.id}
                card={card}
                index={index}
                isFront={isFront}
                total={cards.length}
                onRemove={() => removeCard(card.id)}
                textColor={textColor}
              />
            );
          })}
        </AnimatePresence>
        {cards.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            All Done!
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ card, index, isFront, total, onRemove, textColor }: any) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onRemove();
    }
  };

  return (
    <motion.div
      style={{
        zIndex: index,
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 1,
        scale: 1 - (total - 1 - index) * 0.05,
        y: (total - 1 - index) * 10,
        color: textColor,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1 - (total - 1 - index) * 0.05, y: (total - 1 - index) * 10, opacity: 1 }}
      exit={{ x: x.get() < 0 ? -200 : 200, opacity: 0, transition: { duration: 0.2 } }}
      className={`absolute inset-0 rounded-2xl shadow-xl flex items-center justify-center text-4xl font-bold cursor-grab active:cursor-grabbing ${card.color}`}
    >
      {card.text}
    </motion.div>
  );
}

"use client";

import React, { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp, ArrowDown, ArrowUp } from "lucide-react";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionWidgetProps {
  icon?: "plus" | "arrow" | "chevron";
  activeIcon?: "minus" | "arrow-up" | "chevron-up";
  titleHtmlTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  items?: AccordionItem[];
}

export default function AccordionWidget({
  icon = "plus",
  activeIcon = "minus",
  titleHtmlTag = "div",
  items = [
    { title: "Accordion Item #1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { title: "Accordion Item #2", content: "Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
  ],
}: AccordionWidgetProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const getIcon = (isActive: boolean) => {
    if (isActive) {
      if (activeIcon === "minus") return <Minus size={16} />;
      if (activeIcon === "arrow-up") return <ArrowUp size={16} />;
      if (activeIcon === "chevron-up") return <ChevronUp size={16} />;
    } else {
      if (icon === "plus") return <Plus size={16} />;
      if (icon === "arrow") return <ArrowDown size={16} />;
      if (icon === "chevron") return <ChevronDown size={16} />;
    }
    return <Plus size={16} />;
  };

  const TitleTag = titleHtmlTag as React.ElementType;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleItem(index)}
            className={`w-full flex items-center justify-between p-4 text-left transition-colors ${activeIndex === index ? "bg-gray-50 text-blue-600" : "bg-white text-gray-800 hover:bg-gray-50"}`}
          >
            <TitleTag className="font-bold text-sm">{item.title}</TitleTag>
            <span className="text-gray-500">
              {getIcon(activeIndex === index)}
            </span>
          </button>
          {activeIndex === index && (
            <div className="p-4 bg-white text-gray-600 text-sm border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

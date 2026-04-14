"use client";

import React, { useState } from "react";

interface TabItem {
  title: string;
  content: string;
}

interface TabsWidgetProps {
  items?: TabItem[];
  position?: "horizontal" | "vertical";
  align?: "left" | "center" | "right" | "justify";
  style?: "default" | "pills" | "underline";
}

export default function TabsWidget({
  items = [
    { title: "Tab 1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
    { title: "Tab 2", content: "I am the content of Tab 2. Consectetur adipiscing elit." },
    { title: "Tab 3", content: "And I am Tab 3 content. Luctus nec ullamcorper mattis." },
  ],
  position = "horizontal",
  align = "left",
  style = "default",
}: TabsWidgetProps) {
  const [activeTab, setActiveTab] = useState(0);

  const isVertical = position === "vertical";

  return (
    <div className={`flex ${isVertical ? "flex-row gap-4" : "flex-col"}`}>
      <div 
        className={`flex ${isVertical ? "flex-col min-w-[150px]" : "border-b border-gray-200"}`}
        style={{ 
          justifyContent: !isVertical && align === "center" ? "center" : !isVertical && align === "right" ? "flex-end" : !isVertical && align === "justify" ? "space-between" : "flex-start"
        }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 font-medium transition-colors ${
              style === "pills" 
                ? `rounded-md ${activeTab === index ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`
                : style === "underline"
                ? `border-b-2 ${activeTab === index ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-800"}`
                : `border ${activeTab === index ? "border-gray-200 border-b-white bg-white text-blue-600" : "border-transparent bg-gray-50 text-gray-600 hover:text-gray-800"} ${!isVertical ? "rounded-t-lg -mb-px" : "rounded-l-lg -mr-px"}`
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className={`p-4 bg-white border border-gray-200 ${!isVertical && style === "default" ? "rounded-b-lg rounded-tr-lg" : "rounded-lg"} flex-grow`}>
        <h4 className="font-bold mb-2">Content for {items[activeTab]?.title}</h4>
        <p className="text-gray-600">
          {items[activeTab]?.content}
        </p>
      </div>
    </div>
  );
}

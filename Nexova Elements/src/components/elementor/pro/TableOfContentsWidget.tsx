"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsWidgetProps {
  title?: string;
  listStyle?: "disc" | "decimal" | "none";
  minimize?: boolean;
  headings?: Heading[];
}

export default function TableOfContentsWidget({
  title = "Table of Contents",
  listStyle = "disc",
  minimize = true,
  headings = [
    { id: "intro", text: "Introduction", level: 1 },
    { id: "chapter-1", text: "Chapter 1: Getting Started", level: 1 },
    { id: "setup", text: "Setup & Installation", level: 2 },
    { id: "config", text: "Configuration", level: 2 },
    { id: "chapter-2", text: "Chapter 2: Advanced Usage", level: 1 },
    { id: "conclusion", text: "Conclusion", level: 1 },
  ],
}: TableOfContentsWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      // Simple scroll spy simulation
      const scrollPosition = window.scrollY;
      // In a real app, we would check element positions
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-xs overflow-hidden transition-all duration-300">
      <div 
        className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={() => minimize && setIsMinimized(!isMinimized)}
      >
        <h4 className="font-bold text-gray-800 flex items-center gap-2">
          <List size={16} />
          {title}
        </h4>
        {minimize && (
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            {isMinimized ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        )}
      </div>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMinimized ? "max-h-0 opacity-0" : "max-h-96 opacity-100"}`}>
        <ul className={`p-4 space-y-2 text-sm text-gray-600 ${listStyle === "none" ? "list-none" : listStyle === "decimal" ? "list-decimal pl-8" : "list-disc pl-8"}`}>
          {headings.map((heading) => (
            <li 
              key={heading.id} 
              className={`${heading.level === 2 ? "ml-4" : ""} transition-colors duration-200`}
            >
              <a 
                href={`#${heading.id}`} 
                className={`hover:text-blue-600 hover:underline block py-0.5 ${activeId === heading.id ? "text-blue-600 font-medium" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveId(heading.id);
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

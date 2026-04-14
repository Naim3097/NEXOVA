"use client";

import React from "react";
import { Quote, Twitter } from "lucide-react";

interface BlockquoteWidgetProps {
  skin?: "border" | "quotation" | "boxed" | "clean";
  align?: "left" | "center" | "right";
  color?: string;
  tweetButton?: boolean;
  content?: string;
  author?: string;
  source?: string;
}

export default function BlockquoteWidget({
  skin = "border",
  align = "left",
  color = "#3b82f6",
  tweetButton = true,
  content = "The only way to do great work is to love what you do.",
  author = "Steve Jobs",
  source = "Co-founder, Apple Inc.",
}: BlockquoteWidgetProps) {
  const containerStyle: React.CSSProperties = {
    textAlign: align,
    position: "relative",
    padding: skin === "boxed" ? "40px" : "20px 30px",
    backgroundColor: skin === "boxed" ? "#f9fafb" : "transparent",
    borderLeft: skin === "border" ? `5px solid ${color}` : "none",
    border: skin === "boxed" ? "1px solid #e5e7eb" : "none",
    borderRadius: skin === "boxed" ? "8px" : "0",
  };

  const handleTweet = () => {
    const text = `${content} — ${author}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <blockquote style={containerStyle} className="group">
      {skin === "quotation" && (
        <Quote 
          size={48} 
          style={{ 
            color: color, 
            opacity: 0.2, 
            position: "absolute", 
            top: -10, 
            left: align === "center" ? "50%" : 0, 
            transform: align === "center" ? "translateX(-50%)" : "none" 
          }} 
        />
      )}
      
      <div className="relative z-10">
        <p className="text-xl md:text-2xl font-medium text-gray-800 mb-6 leading-relaxed italic">
          &quot;{content}&quot;
        </p>
        
        <footer className="flex items-center gap-4" style={{ justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start" }}>
          <div className="flex flex-col">
            <cite className="text-base font-bold text-gray-900 not-italic">{author}</cite>
            {source && <span className="text-sm text-gray-500">{source}</span>}
          </div>
        </footer>

        {tweetButton && (
          <button 
            onClick={handleTweet}
            className="mt-6 flex items-center gap-2 text-sm font-medium text-[#1da1f2] hover:text-[#0c85d0] transition-colors"
            style={{ margin: align === "center" ? "24px auto 0" : align === "right" ? "24px 0 0 auto" : "24px 0 0 0" }}
          >
            <Twitter size={16} />
            Tweet
          </button>
        )}
      </div>
    </blockquote>
  );
}

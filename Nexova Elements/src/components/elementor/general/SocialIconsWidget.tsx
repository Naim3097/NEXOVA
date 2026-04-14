"use client";

import React from "react";
import { Facebook, Twitter, Youtube, Instagram, Linkedin, Github } from "lucide-react";

interface SocialIconItem {
  network: "Facebook" | "Twitter" | "Youtube" | "Instagram" | "Linkedin" | "Github";
  url: string;
}

interface SocialIconsWidgetProps {
  items?: SocialIconItem[];
  shape?: "rounded" | "square" | "circle";
  align?: "left" | "center" | "right";
  color?: "official" | "custom";
  customPrimaryColor?: string;
  customSecondaryColor?: string;
  hoverAnimation?: "grow" | "shrink" | "rotate" | "float" | "sink" | "none";
}

export default function SocialIconsWidget({
  items = [
    { network: "Facebook", url: "#" },
    { network: "Twitter", url: "#" },
    { network: "Youtube", url: "#" },
  ],
  shape = "rounded",
  align = "center",
  color = "official",
  customPrimaryColor = "#333333",
  customSecondaryColor = "#ffffff",
  hoverAnimation = "grow",
}: SocialIconsWidgetProps) {
  const iconMap = {
    Facebook: { icon: Facebook, officialColor: "#3b5998" },
    Twitter: { icon: Twitter, officialColor: "#1da1f2" },
    Youtube: { icon: Youtube, officialColor: "#cd201f" },
    Instagram: { icon: Instagram, officialColor: "#e1306c" },
    Linkedin: { icon: Linkedin, officialColor: "#0077b5" },
    Github: { icon: Github, officialColor: "#333333" },
  };

  const getStyle = (officialColor: string) => {
    const baseStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      color: color === "official" ? "white" : customSecondaryColor,
      backgroundColor: color === "official" ? officialColor : customPrimaryColor,
      transition: "all 0.3s ease",
    };

    if (shape === "rounded") baseStyle.borderRadius = "4px";
    if (shape === "circle") baseStyle.borderRadius = "50%";

    return baseStyle;
  };

  const getHoverClass = () => {
    switch (hoverAnimation) {
      case "grow": return "hover:scale-110";
      case "shrink": return "hover:scale-90";
      case "rotate": return "hover:rotate-6";
      case "float": return "hover:-translate-y-1 hover:shadow-lg";
      case "sink": return "hover:translate-y-1";
      default: return "";
    }
  };

  return (
    <div className="flex gap-3 flex-wrap" style={{ justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center" }}>
      {items.map((item, index) => {
        const iconData = iconMap[item.network];
        if (!iconData) return null;
        const Icon = iconData.icon;
        
        return (
          <a 
            key={index} 
            href={item.url} 
            style={getStyle(iconData.officialColor)} 
            className={`transition-all duration-300 ${getHoverClass()}`}
          >
            <Icon size={20} fill={color === "official" ? "currentColor" : "none"} />
          </a>
        );
      })}
    </div>
  );
}

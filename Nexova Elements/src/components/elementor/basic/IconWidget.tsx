"use client";

import React from "react";
import { Star, Heart, User, Check, Bell, Search, Home, Settings } from "lucide-react";

interface IconWidgetProps {
  icon?: "star" | "heart" | "user" | "check" | "bell" | "search" | "home" | "settings";
  view?: "default" | "stacked" | "framed";
  shape?: "circle" | "square";
  align?: "left" | "center" | "right";
  color?: string;
  secondaryColor?: string;
  size?: number;
  rotate?: number;
}

export default function IconWidget({
  icon = "star",
  view = "default",
  shape = "circle",
  align = "center",
  color = "#10b981",
  secondaryColor = "#ffffff",
  size = 50,
  rotate = 0,
}: IconWidgetProps) {
  const iconMap = {
    star: Star,
    heart: Heart,
    user: User,
    check: Check,
    bell: Bell,
    search: Search,
    home: Home,
    settings: Settings,
  };

  const IconComponent = iconMap[icon] || Star;
  
  const iconStyle: React.CSSProperties = {
    transform: `rotate(${rotate}deg)`,
    color: view === "default" ? color : view === "stacked" ? secondaryColor : color,
  };

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: view !== "default" ? `${size * 1.5}px` : "auto",
    height: view !== "default" ? `${size * 1.5}px` : "auto",
    backgroundColor: view === "stacked" ? color : view === "framed" ? "transparent" : "transparent",
    border: view === "framed" ? `2px solid ${color}` : "none",
    borderRadius: shape === "circle" ? "50%" : "0",
  };

  return (
    <div style={{ textAlign: align, padding: "10px" }}>
      <div style={containerStyle}>
        <IconComponent size={size} style={iconStyle} />
      </div>
    </div>
  );
}

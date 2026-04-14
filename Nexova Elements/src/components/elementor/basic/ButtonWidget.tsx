"use client";

import React from "react";

interface ButtonWidgetProps {
  text?: string;
  link?: string;
  align?: "left" | "center" | "right" | "justify";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "danger" | "info" | "success" | "warning";
}

export default function ButtonWidget({
  text = "Click Here",
  link = "#",
  align = "left",
  size = "sm",
  variant = "primary",
}: ButtonWidgetProps) {
  const getStyles = () => {
    const baseStyles: React.CSSProperties = {
      display: "inline-block",
      borderRadius: "4px",
      textDecoration: "none",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
    };

    // Size
    switch (size) {
      case "xs": baseStyles.padding = "8px 16px"; baseStyles.fontSize = "0.75rem"; break;
      case "sm": baseStyles.padding = "12px 24px"; baseStyles.fontSize = "0.875rem"; break;
      case "md": baseStyles.padding = "16px 32px"; baseStyles.fontSize = "1rem"; break;
      case "lg": baseStyles.padding = "20px 40px"; baseStyles.fontSize = "1.125rem"; break;
      case "xl": baseStyles.padding = "24px 48px"; baseStyles.fontSize = "1.25rem"; break;
      default: baseStyles.padding = "12px 24px"; baseStyles.fontSize = "0.875rem";
    }

    // Variant
    const colors: Record<string, string> = {
      primary: "#3b82f6",
      secondary: "#6b7280",
      danger: "#ef4444",
      info: "#3b82f6",
      success: "#10b981",
      warning: "#f59e0b",
    };
    
    baseStyles.backgroundColor = colors[variant] || colors.primary;
    baseStyles.color = "#ffffff";
    baseStyles.border = "none";

    return baseStyles;
  };

  return (
    <div style={{ textAlign: align }}>
      <a href={link} style={getStyles()}>
        {text}
      </a>
    </div>
  );
}

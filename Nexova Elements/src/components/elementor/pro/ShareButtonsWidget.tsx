"use client";

import React from "react";
import { Facebook, Twitter, Linkedin, Mail, Link2, LucideIcon } from "lucide-react";

interface ShareButton {
  name: string;
  icon: LucideIcon;
  color: string;
  url?: string;
  action?: "copy";
}

interface ShareButtonsWidgetProps {
  view?: "icon-text" | "icon" | "text";
  skin?: "gradient" | "minimal" | "framed" | "boxed" | "flat";
  shape?: "square" | "rounded" | "circle";
  buttons?: ShareButton[];
}

export default function ShareButtonsWidget({
  view = "icon-text",
  skin = "gradient",
  shape = "square",
  buttons = [
    { name: "Facebook", icon: Facebook, color: "#3b5998", url: "https://www.facebook.com/sharer/sharer.php?u=" },
    { name: "Twitter", icon: Twitter, color: "#1da1f2", url: "https://twitter.com/intent/tweet?url=" },
    { name: "LinkedIn", icon: Linkedin, color: "#0077b5", url: "https://www.linkedin.com/shareArticle?mini=true&url=" },
    { name: "Email", icon: Mail, color: "#ea4335", url: "mailto:?body=" },
    { name: "Copy Link", icon: Link2, color: "#888888", action: "copy" },
  ],
}: ShareButtonsWidgetProps) {
  const handleShare = (btn: ShareButton) => {
    if (btn.action === "copy") {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } else if (btn.url) {
      window.open(btn.url + encodeURIComponent(window.location.href), "_blank", "width=600,height=400");
    }
  };

  const getStyles = (color: string) => {
    const style: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "10px 20px",
      cursor: "pointer",
      transition: "all 0.3s",
    };

    // Shape
    if (shape === "rounded") style.borderRadius = "4px";
    if (shape === "circle") style.borderRadius = "50px";

    // Skin
    if (skin === "gradient" || skin === "flat") {
      style.backgroundColor = color;
      style.color = "white";
    } else if (skin === "framed") {
      style.border = `1px solid ${color}`;
      style.color = color;
      style.backgroundColor = "transparent";
    } else if (skin === "minimal") {
      style.color = color;
      style.backgroundColor = "transparent";
    } else if (skin === "boxed") {
      style.backgroundColor = "#f3f4f6";
      style.color = color;
    }

    return style;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((btn) => (
        <div 
          key={btn.name} 
          style={getStyles(btn.color)}
          onClick={() => handleShare(btn)}
          className="hover:opacity-90 active:scale-95 select-none"
        >
          {(view === "icon" || view === "icon-text") && <btn.icon size={18} />}
          {(view === "text" || view === "icon-text") && <span className="font-medium text-sm">{btn.name}</span>}
        </div>
      ))}
    </div>
  );
}

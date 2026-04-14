"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  children?: string[];
}

interface NavMenuWidgetProps {
  layout?: "horizontal" | "vertical" | "dropdown";
  align?: "left" | "center" | "right" | "justify";
  pointer?: "none" | "underline" | "overline" | "double-line" | "framed" | "background" | "text";
  animation?: "fade" | "slide" | "grow" | "drop-in" | "drop-out" | "none";
  breakpoint?: "mobile" | "tablet" | "none";
  menuItems?: MenuItem[];
}

export default function NavMenuWidget({
  layout = "horizontal",
  align = "center",
  pointer = "underline",
  animation = "fade",
  breakpoint = "mobile",
  menuItems = [
    { label: "Home", href: "#" },
    { 
      label: "Services", 
      href: "#", 
      children: ["Web Design", "Development", "SEO", "Marketing"] 
    },
    { label: "Portfolio", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
}: NavMenuWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(menuItems[0]?.label || "Home");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (breakpoint === "none") return setIsMobileView(false);
      const width = window.innerWidth;
      if (breakpoint === "mobile" && width < 768) setIsMobileView(true);
      else if (breakpoint === "tablet" && width < 1024) setIsMobileView(true);
      else setIsMobileView(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  const effectiveLayout = isMobileView ? "dropdown" : layout;

  const containerStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: effectiveLayout === "vertical" ? "column" : "row",
    justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : align === "justify" ? "space-between" : "center",
    gap: effectiveLayout === "vertical" ? "0" : "32px",
    width: "100%",
    alignItems: effectiveLayout === "vertical" ? (align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start") : "center",
  };

  const getPointerClass = (isActive: boolean) => {
    if (effectiveLayout === "dropdown") return "";
    
    const base = "relative transition-all duration-300 ";
    if (pointer === "none") return base + (isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600");
    
    if (pointer === "underline") {
      return base + (isActive ? "text-blue-600 after:w-full" : "text-gray-700 hover:text-blue-600 hover:after:w-full") + 
        " after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-blue-600 after:w-0 after:transition-all after:duration-300";
    }
    
    if (pointer === "overline") {
      return base + (isActive ? "text-blue-600 before:w-full" : "text-gray-700 hover:text-blue-600 hover:before:w-full") + 
        " before:content-[''] before:absolute before:left-0 before:-top-1 before:h-[2px] before:bg-blue-600 before:w-0 before:transition-all before:duration-300";
    }
    
    if (pointer === "framed") {
      return base + " px-4 py-2 rounded border " + (isActive ? "border-blue-600 text-blue-600" : "border-transparent hover:border-blue-600 text-gray-700");
    }
    
    if (pointer === "background") {
      return base + " px-4 py-2 rounded " + (isActive ? "bg-blue-600 text-white" : "hover:bg-blue-50 text-gray-700 hover:text-blue-600");
    }

    return base + "text-gray-700 hover:text-blue-600";
  };

  // Mobile / Dropdown Layout
  if (effectiveLayout === "dropdown") {
    return (
      <div className="relative w-full">
        <div className={`flex items-center p-2 ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"}`}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2.5 rounded-md transition-all flex items-center gap-2 ${isOpen ? "bg-blue-50 text-blue-600" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl border-t border-gray-100 z-50 animate-in slide-in-from-top-2 fade-in duration-200 overflow-hidden">
            <nav className="flex flex-col py-2">
              {menuItems.map((item) => (
                <div key={item.label}>
                  <a 
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); setActiveItem(item.label); }}
                    className={`px-6 py-3 flex justify-between items-center group transition-colors ${activeItem === item.label ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {item.label}
                    {item.children && <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />}
                  </a>
                  {item.children && activeItem === item.label && (
                    <div className="bg-gray-50 py-1 animate-in slide-in-from-top-1">
                      {item.children.map(child => (
                        <a key={child} href="#" className="block px-10 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                          {child}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <nav style={containerStyles} className="w-full px-4">
      {menuItems.map((item) => (
        <div 
          key={item.label} 
          className="relative group"
          onMouseEnter={() => setHoveredItem(item.label)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <a 
            href={item.href} 
            onClick={(e) => { e.preventDefault(); setActiveItem(item.label); }}
            className={`flex items-center gap-1 font-medium ${getPointerClass(activeItem === item.label)}`}
          >
            {item.label}
            {item.children && <ChevronDown size={14} className={`transition-transform duration-200 ${hoveredItem === item.label ? "rotate-180" : ""}`} />}
          </a>

          {/* Dropdown for Desktop */}
          {item.children && (
            <div className={`absolute top-full left-0 pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${animation === "slide" ? "translate-y-2 group-hover:translate-y-0" : ""}`}>
              <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden py-1">
                {item.children.map((child) => (
                  <a 
                    key={child} 
                    href="#" 
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {child}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

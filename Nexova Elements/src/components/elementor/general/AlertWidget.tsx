"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AlertWidgetProps {
  type?: "info" | "success" | "warning" | "danger";
  title?: string;
  description?: string;
  showDismiss?: boolean;
}

export default function AlertWidget({
  type = "info",
  title = "This is an Alert",
  description = "I am a description. Click the edit button to change this text.",
  showDismiss = true,
}: AlertWidgetProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const styles = {
    info: { bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-800" },
    success: { bg: "bg-green-100", border: "border-green-200", text: "text-green-800" },
    warning: { bg: "bg-yellow-100", border: "border-yellow-200", text: "text-yellow-800" },
    danger: { bg: "bg-red-100", border: "border-red-200", text: "text-red-800" },
  };

  const currentStyle = styles[type];

  return (
    <div className={`p-4 rounded-md border ${currentStyle.bg} ${currentStyle.border} ${currentStyle.text} relative`}>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm opacity-90">{description}</p>
      {showDismiss && (
        <button 
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

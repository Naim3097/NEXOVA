"use client";

import React from "react";
import { Check } from "lucide-react";

interface Step {
  label: string;
  completed: boolean;
}

interface ProgressTrackerWidgetProps {
  direction?: "horizontal" | "vertical";
  progress?: number;
  steps?: Step[];
}

export default function ProgressTrackerWidget({
  direction = "horizontal",
  progress = 50,
  steps = [
    { label: "Details", completed: progress >= 25 },
    { label: "Shipping", completed: progress >= 50 },
    { label: "Payment", completed: progress >= 75 },
    { label: "Review", completed: progress >= 100 },
  ],
}: ProgressTrackerWidgetProps) {
  return (
    <div className={`flex ${direction === "vertical" ? "flex-col h-80" : "w-full items-center"}`}>
      {steps.map((step, index) => {
        const isCompleted = step.completed;
        const isCurrent = !isCompleted && (index === 0 || steps[index - 1].completed);
        
        return (
          <React.Fragment key={index}>
            <div className="relative flex flex-col items-center group">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all duration-500 border-2 
                  ${isCompleted 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : isCurrent 
                      ? "bg-white border-blue-600 text-blue-600" 
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : index + 1}
              </div>
              
              <span 
                className={`absolute text-sm font-medium transition-colors duration-300 whitespace-nowrap
                  ${direction === "vertical" 
                    ? "left-14 top-1/2 -translate-y-1/2" 
                    : "top-12 text-center"
                  }
                  ${isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"}
                `}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`relative bg-gray-200 ${direction === "vertical" ? "w-0.5 h-full mx-auto my-1" : "h-0.5 w-full mx-2"}`}>
                <div 
                  className={`absolute bg-blue-600 transition-all duration-700 ease-out ${direction === "vertical" ? "w-full top-0" : "h-full left-0"}`}
                  style={{ 
                    [direction === "vertical" ? "height" : "width"]: isCompleted ? "100%" : "0%" 
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

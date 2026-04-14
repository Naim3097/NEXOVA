"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface FormField {
  id: string;
  type: "text" | "email" | "textarea" | "select" | "checkbox" | "radio";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface FormWidgetProps {
  name?: string;
  showLabels?: boolean;
  buttonText?: string;
  buttonSize?: "xs" | "sm" | "md" | "lg";
  fields?: FormField[];
}

export default function FormWidget({
  name = "Contact Us",
  showLabels = true,
  buttonText = "Send Message",
  buttonSize = "sm",
  fields = [
    { id: "name", type: "text", label: "Name", placeholder: "John Doe", required: true },
    { id: "email", type: "email", label: "Email", placeholder: "john@example.com", required: true },
    { id: "subject", type: "select", label: "Subject", options: ["General Inquiry", "Support", "Sales"] },
    { id: "message", type: "textarea", label: "Message", placeholder: "How can we help?", required: true },
    { id: "newsletter", type: "checkbox", label: "Subscribe to newsletter" }
  ]
}: FormWidgetProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState<Record<string, any>>({});

  const btnSizeClass = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    let isValid = true;
    fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        isValid = false;
      }
      if (field.type === "email" && formData[field.id] && !validateEmail(formData[field.id])) {
        isValid = false;
      }
    });

    if (!isValid) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormData({});
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100 relative overflow-hidden">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">{name}</h3>
      
      {status === "success" && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-green-600 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} />
          </div>
          <p className="font-bold text-lg">Message Sent Successfully!</p>
          <p className="text-sm text-gray-500 mt-2">We'll get back to you soon.</p>
        </div>
      )}

      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field.id}>
            {field.type !== "checkbox" && showLabels && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}
            
            {field.type === "textarea" ? (
              <textarea
                rows={4}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder={field.placeholder}
              />
            ) : field.type === "select" ? (
              <select
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Select...</option>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={field.id}
                  checked={formData[field.id] || false}
                  onChange={(e) => handleChange(field.id, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={field.id} className="text-sm text-gray-600 cursor-pointer select-none">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
              </div>
            ) : (
              <input
                type={field.type}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded border border-red-100 animate-in slide-in-from-top-1">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>Please fill in all required fields correctly.</span>
          </div>
        )}

        <button 
          type="submit" 
          disabled={status === "submitting"}
          className={`w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow ${btnSizeClass[buttonSize]}`}
        >
          {status === "submitting" ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

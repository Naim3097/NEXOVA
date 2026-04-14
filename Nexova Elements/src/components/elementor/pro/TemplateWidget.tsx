"use client";

import React, { useState } from "react";
import { Layout, Eye, Check, Search, X } from "lucide-react";

interface Template {
  id: string;
  name: string;
  category: string;
  image: string;
}

interface TemplateWidgetProps {
  templateId?: string;
  templates?: Template[];
}

export default function TemplateWidget({ 
  templateId = "12345",
  templates = [
    { id: "12345", name: "Landing Page", category: "Marketing", image: "https://picsum.photos/seed/tpl1/600/400" },
    { id: "67890", name: "Contact Form", category: "Forms", image: "https://picsum.photos/seed/tpl2/600/400" },
    { id: "11223", name: "Blog Post", category: "Content", image: "https://picsum.photos/seed/tpl3/600/400" },
    { id: "44556", name: "Portfolio Grid", category: "Creative", image: "https://picsum.photos/seed/tpl4/600/400" },
    { id: "77889", name: "E-commerce Shop", category: "Shop", image: "https://picsum.photos/seed/tpl5/600/400" },
    { id: "99000", name: "About Us", category: "Corporate", image: "https://picsum.photos/seed/tpl6/600/400" },
  ]
}: TemplateWidgetProps) {
  const [selectedId, setSelectedId] = useState(templateId);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full p-6 bg-white rounded-lg border border-gray-200 shadow-sm relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Layout size={20} className="text-blue-600" />
          Template Library
        </h3>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {filteredTemplates.map((template) => (
          <div 
            key={template.id}
            onClick={() => setSelectedId(template.id)}
            className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 group
              ${selectedId === template.id 
                ? "border-blue-600 bg-blue-50" 
                : "border-gray-100 hover:border-blue-300 hover:bg-gray-50"
              }`}
          >
            <div className="aspect-video bg-gray-200 rounded mb-3 overflow-hidden relative">
              <img src={template.image} alt={template.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                {template.category}
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template.image); }}
                  className="bg-white text-gray-900 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 hover:bg-gray-100 shadow-lg"
                >
                  <Eye size={12} /> Preview
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`font-medium text-sm truncate ${selectedId === template.id ? "text-blue-700" : "text-gray-700"}`}>
                {template.name}
              </span>
              {selectedId === template.id && (
                <div className="bg-blue-600 text-white p-1 rounded-full flex-shrink-0">
                  <Check size={10} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {selectedId ? `Selected: ID #${selectedId}` : "No template selected"}
        </span>
        <button 
          disabled={!selectedId}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors shadow-sm"
        >
          Insert Template
        </button>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl">
            <button 
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors z-10"
            >
              <X size={20} />
            </button>
            <img src={previewTemplate} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ExternalLink, ZoomIn, Loader2 } from "lucide-react";

interface Project {
  id: number | string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

interface PortfolioWidgetProps {
  columns?: "2" | "3" | "4" | "5";
  count?: number;
  masonry?: boolean;
  gap?: number;
  showFilter?: boolean;
  showLoadMore?: boolean;
  projects?: Project[];
}

export default function PortfolioWidget({
  columns = "3",
  count = 6,
  masonry = false,
  gap = 20,
  showFilter = true,
  showLoadMore = true,
  projects = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    title: `Project ${i + 1}`,
    category: ["Design", "Development", "Marketing", "Branding"][i % 4],
    image: `https://picsum.photos/seed/portfolio${i}/600/${masonry ? 400 + (i % 3) * 200 : 600}`,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  })),
}: PortfolioWidgetProps) {
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(count);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredItems = filter === "All" 
    ? projects 
    : projects.filter(item => item.category === filter);

  const displayedItems = filteredItems.slice(0, visibleCount);

  const gridCols = {
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
    "5": "grid-cols-1 sm:grid-cols-3 md:grid-cols-5",
  };

  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 3);
      setIsLoadingMore(false);
    }, 800);
  };

  return (
    <div className="w-full">
      {/* Filter Bar */}
      {showFilter && (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setVisibleCount(count); }}
              className={`text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 border 
                ${filter === cat 
                  ? "bg-black text-white border-black shadow-lg scale-105" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div 
        className={`grid ${gridCols[columns]}`} 
        style={{ gap: `${gap}px` }}
      >
        {displayedItems.map((item, index) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedProject(item)}
            className="group relative overflow-hidden rounded-xl cursor-pointer bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 animate-in fade-in zoom-in-95 fill-mode-backwards"
            style={{ 
              aspectRatio: masonry ? "auto" : "1/1",
              animationDelay: `${index * 50}ms`
            }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <Image 
                src={item.image} 
                alt={item.title} 
                width={600}
                height={600}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${masonry ? "h-auto" : ""}`}
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-2">
                  {item.category}
                </span>
                <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                <div className="flex items-center gap-2 text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <span>View Project</span>
                  <ExternalLink size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No projects found in this category.</p>
          <button onClick={() => setFilter("All")} className="mt-4 text-blue-600 font-medium hover:underline">
            View all projects
          </button>
        </div>
      )}

      {/* Load More */}
      {showLoadMore && visibleCount < filteredItems.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-800 font-medium rounded-full hover:bg-gray-50 hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isLoadingMore ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More Projects</span>
            )}
          </button>
        </div>
      )}

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
              <Image 
                src={selectedProject.image} 
                alt={selectedProject.title} 
                fill 
                className="object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
              <span className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">{selectedProject.category}</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProject.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                {selectedProject.description}
                <br /><br />
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
              
              <div className="flex gap-4 mt-auto pt-6 border-t border-gray-100">
                <button className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  View Live <ExternalLink size={16} />
                </button>
                <button className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  Details <ZoomIn size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

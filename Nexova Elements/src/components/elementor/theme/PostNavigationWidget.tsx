import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PostNavigationWidgetProps {
  showLabel?: boolean;
  showArrow?: boolean;
  showTitle?: boolean;
}

export default function PostNavigationWidget({ 
  showLabel = true, 
  showArrow = true, 
  showTitle = true 
}: PostNavigationWidgetProps) {
  return (
    <div className="flex justify-between w-full border-t border-b border-gray-200 py-6 my-8">
      <div className="flex flex-col items-start max-w-[45%] cursor-pointer group">
        <div className="flex items-center text-gray-500 text-sm mb-1 group-hover:text-blue-600 transition-colors">
          {showArrow && <ChevronLeft className="w-4 h-4 mr-1" />}
          {showLabel && <span>Previous</span>}
        </div>
        {showTitle && (
          <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            Previous Post Title
          </span>
        )}
      </div>

      <div className="flex flex-col items-end max-w-[45%] cursor-pointer group">
        <div className="flex items-center text-gray-500 text-sm mb-1 group-hover:text-blue-600 transition-colors">
          {showLabel && <span>Next</span>}
          {showArrow && <ChevronRight className="w-4 h-4 ml-1" />}
        </div>
        {showTitle && (
          <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            Next Post Title
          </span>
        )}
      </div>
    </div>
  );
}

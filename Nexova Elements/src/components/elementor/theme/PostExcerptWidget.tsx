import React from 'react';

interface PostExcerptWidgetProps {
  excerpt?: string;
  length?: number;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export default function PostExcerptWidget({ 
  excerpt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  length = 50, 
  align = 'left' 
}: PostExcerptWidgetProps) {
  const displayExcerpt = excerpt.length > length ? excerpt.substring(0, length) + '...' : excerpt;

  return (
    <div 
      className="text-gray-600 leading-relaxed"
      style={{ textAlign: align }}
    >
      {displayExcerpt}
    </div>
  );
}

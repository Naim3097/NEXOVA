import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface FeaturedImageWidgetProps {
  size?: 'thumbnail' | 'medium' | 'large' | 'full';
  align?: 'left' | 'center' | 'right';
  caption?: boolean;
}

export default function FeaturedImageWidget({ size = 'full', align = 'center', caption = false }: FeaturedImageWidgetProps) {
  const heightMap = {
    thumbnail: 'h-32 w-32',
    medium: 'h-64 w-1/2',
    large: 'h-96 w-3/4',
    full: 'h-96 w-full'
  };

  return (
    <div className={`flex flex-col w-full items-${align === 'center' ? 'center' : align === 'right' ? 'end' : 'start'}`}>
      <div className={`bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg ${heightMap[size]}`}>
        <ImageIcon className="w-16 h-16" />
      </div>
      {caption && (
        <p className="text-sm text-gray-500 mt-2 italic">Featured Image Caption</p>
      )}
    </div>
  );
}

import React from 'react';
import { Star } from 'lucide-react';

interface ProductRatingWidgetProps {
  rating?: number;
  reviewCount?: number;
  align?: 'left' | 'center' | 'right';
  color?: string;
}

export default function ProductRatingWidget({ 
  rating = 5,
  reviewCount = 12,
  align = 'left', 
  color = '#EAB308' 
}: ProductRatingWidgetProps) {
  return (
    <div 
      className="flex items-center gap-2 mb-2"
      style={{ justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}
    >
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`}
            style={{ color: i < rating ? color : undefined }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500">({reviewCount} customer reviews)</span>
    </div>
  );
}

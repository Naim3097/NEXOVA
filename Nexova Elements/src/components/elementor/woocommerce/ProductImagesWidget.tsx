import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ProductImagesWidgetProps {
  images?: string[];
  showSaleFlash?: boolean;
  saleFlashText?: string;
}

export default function ProductImagesWidget({ 
  images = [],
  showSaleFlash = true, 
  saleFlashText = 'Sale!' 
}: ProductImagesWidgetProps) {
  const mainImage = images.length > 0 ? images[0] : null;
  const thumbnails = images.length > 1 ? images.slice(1) : [1, 2, 3, 4]; // Fallback for demo

  return (
    <div className="w-full">
      <div className="aspect-square bg-gray-100 rounded-lg relative flex items-center justify-center mb-4 overflow-hidden">
        {mainImage ? (
          <img src={mainImage} alt="Product" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-24 h-24 text-gray-300" />
        )}
        
        {showSaleFlash && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {saleFlashText}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {thumbnails.map((thumb, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-md flex items-center justify-center cursor-pointer hover:ring-2 ring-blue-500 transition-all overflow-hidden">
            {typeof thumb === 'string' ? (
              <img src={thumb} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

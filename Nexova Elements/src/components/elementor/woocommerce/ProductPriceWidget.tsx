import React from 'react';

interface ProductPriceWidgetProps {
  price?: string;
  salePrice?: string;
  align?: 'left' | 'center' | 'right';
  color?: string;
}

export default function ProductPriceWidget({ 
  price = "$129.00", 
  salePrice = "$99.00",
  align = 'left', 
  color = '#111827' 
}: ProductPriceWidgetProps) {
  return (
    <div 
      className="flex items-baseline gap-2"
      style={{ 
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        color: color
      }}
    >
      {salePrice && <span className="text-lg text-gray-400 line-through">{price}</span>}
      <span className="text-2xl font-bold">{salePrice || price}</span>
    </div>
  );
}

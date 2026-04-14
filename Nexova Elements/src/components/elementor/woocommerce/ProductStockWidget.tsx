import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProductStockWidgetProps {
  align?: 'left' | 'center' | 'right';
  text?: string;
}

export default function ProductStockWidget({ align = 'left', text = 'In Stock' }: ProductStockWidgetProps) {
  return (
    <div 
      className="flex items-center gap-1.5 text-green-600 font-medium text-sm mb-4"
      style={{ justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}
    >
      <CheckCircle className="w-4 h-4" />
      <span>{text}</span>
    </div>
  );
}

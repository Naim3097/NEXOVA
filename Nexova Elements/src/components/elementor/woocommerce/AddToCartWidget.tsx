import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus } from 'lucide-react';

interface AddToCartWidgetProps {
  showQuantity?: boolean;
  buttonText?: string;
  align?: 'left' | 'center' | 'right';
}

export default function AddToCartWidget({ 
  showQuantity = true, 
  buttonText = 'Add to cart',
  align = 'left'
}: AddToCartWidgetProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div 
      className="flex flex-wrap gap-4 items-center"
      style={{ justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}
    >
      {showQuantity && (
        <div className="flex items-center border border-gray-300 rounded-md">
          <button 
            className="p-2 hover:bg-gray-100 text-gray-600"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="w-4 h-4" />
          </button>
          <input 
            type="number" 
            className="w-12 text-center border-none focus:ring-0 p-0 text-gray-900 font-medium"
            value={quantity}
            readOnly
          />
          <button 
            className="p-2 hover:bg-gray-100 text-gray-600"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <button className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        {buttonText}
      </button>
    </div>
  );
}

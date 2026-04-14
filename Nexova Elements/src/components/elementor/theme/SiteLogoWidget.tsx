import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface SiteLogoWidgetProps {
  align?: 'left' | 'center' | 'right';
  width?: number;
}

export default function SiteLogoWidget({ align = 'left', width = 150 }: SiteLogoWidgetProps) {
  return (
    <div className={`flex w-full justify-${align === 'center' ? 'center' : align === 'right' ? 'end' : 'start'}`}>
      <div 
        className="bg-gray-200 flex items-center justify-center text-gray-400 rounded"
        style={{ width: `${width}px`, height: `${width * 0.4}px` }}
      >
        <div className="flex flex-col items-center">
          <ImageIcon className="w-8 h-8 mb-1" />
          <span className="text-xs font-medium">LOGO</span>
        </div>
      </div>
    </div>
  );
}

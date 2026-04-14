import React from 'react';

interface ProductTitleWidgetProps {
  title?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  align?: 'left' | 'center' | 'right';
  color?: string;
}

export default function ProductTitleWidget({ 
  title = "Premium Wireless Headphones",
  tag = 'h1', 
  align = 'left', 
  color = '#111827' 
}: ProductTitleWidgetProps) {
  const Tag = tag as React.ElementType;
  
  return (
    <Tag 
      className="font-bold text-3xl mb-2"
      style={{ 
        textAlign: align,
        color: color
      }}
    >
      {title}
    </Tag>
  );
}

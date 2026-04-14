import React from 'react';

interface PageTitleWidgetProps {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  align?: 'left' | 'center' | 'right';
  color?: string;
}

export default function PageTitleWidget({ tag = 'h1', align = 'left', color = '#111827' }: PageTitleWidgetProps) {
  const Tag = tag as React.ElementType;
  
  return (
    <Tag 
      className="font-bold text-4xl mb-4"
      style={{ 
        textAlign: align,
        color: color
      }}
    >
      Current Page Title
    </Tag>
  );
}

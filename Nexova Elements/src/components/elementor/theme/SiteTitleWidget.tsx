import React from 'react';

interface SiteTitleWidgetProps {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p';
  align?: 'left' | 'center' | 'right';
  color?: string;
}

export default function SiteTitleWidget({ tag = 'h2', align = 'left', color = '#000000' }: SiteTitleWidgetProps) {
  const Tag = tag as React.ElementType;
  
  return (
    <Tag 
      className="font-bold text-2xl"
      style={{ 
        textAlign: align,
        color: color
      }}
    >
      Site Title
    </Tag>
  );
}

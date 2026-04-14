import React from 'react';

interface ProductContentWidgetProps {
  content?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export default function ProductContentWidget({ 
  content = `
    <p>Experience industry-leading noise cancellation with our premium wireless headphones. Designed for comfort and long listening sessions, these headphones deliver exceptional sound quality with deep bass and clear highs.</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li>30-hour battery life</li>
      <li>Quick charging capability</li>
      <li>Touch sensor controls</li>
      <li>Speak-to-chat technology</li>
    </ul>
  `,
  align = 'left' 
}: ProductContentWidgetProps) {
  return (
    <div 
      className="prose prose-sm max-w-none text-gray-600 mb-6"
      style={{ textAlign: align }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

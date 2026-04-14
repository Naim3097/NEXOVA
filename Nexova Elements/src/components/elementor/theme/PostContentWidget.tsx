import React from 'react';

interface PostContentWidgetProps {
  content?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export default function PostContentWidget({ 
  content = `
    <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p class="mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <h3 class="text-xl font-bold mb-2">Subheading</h3>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
  `,
  align = 'left' 
}: PostContentWidgetProps) {
  return (
    <div 
      className="prose max-w-none text-gray-700"
      style={{ textAlign: align }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

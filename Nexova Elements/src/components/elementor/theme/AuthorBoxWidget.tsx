import React from 'react';
import { User } from 'lucide-react';

interface AuthorBoxWidgetProps {
  name?: string;
  bio?: string;
  avatar?: string;
  viewAllPostsLink?: string;
  websiteLink?: string;
  showImage?: boolean;
  showName?: boolean;
  showBio?: boolean;
  align?: 'left' | 'center' | 'right';
}

export default function AuthorBoxWidget({ 
  name = "John Doe",
  bio = "Senior Content Writer with 10+ years of experience in tech journalism. Passionate about AI, web development, and digital design.",
  avatar,
  viewAllPostsLink = "#",
  websiteLink = "#",
  showImage = true, 
  showName = true, 
  showBio = true,
  align = 'left'
}: AuthorBoxWidgetProps) {
  return (
    <div 
      className={`p-6 bg-gray-50 rounded-lg border border-gray-100 flex ${align === 'center' ? 'flex-col items-center text-center' : align === 'right' ? 'flex-row-reverse text-right' : 'flex-row text-left'} gap-4`}
    >
      {showImage && (
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
      )}
      
      <div className="flex flex-col justify-center">
        {showName && <h4 className="font-bold text-lg text-gray-900">{name}</h4>}
        {showBio && (
          <p className="text-gray-600 text-sm mt-1">
            {bio}
          </p>
        )}
        <div className={`mt-3 flex gap-2 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <a href={viewAllPostsLink} className="text-xs text-blue-600 cursor-pointer hover:underline">View all posts</a>
          <a href={websiteLink} className="text-xs text-blue-600 cursor-pointer hover:underline">Website</a>
        </div>
      </div>
    </div>
  );
}

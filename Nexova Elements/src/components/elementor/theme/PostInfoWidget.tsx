import React from 'react';
import { User, Calendar, Clock, MessageCircle } from 'lucide-react';

interface PostInfoWidgetProps {
  author?: string;
  date?: string;
  time?: string;
  commentsCount?: string;
  layout?: 'inline' | 'list';
  align?: 'left' | 'center' | 'right';
  showAuthor?: boolean;
  showDate?: boolean;
  showTime?: boolean;
  showComments?: boolean;
}

export default function PostInfoWidget({ 
  author = "John Doe",
  date = "Oct 24, 2023",
  time = "5 min read",
  commentsCount = "3 Comments",
  layout = 'inline', 
  align = 'left',
  showAuthor = true,
  showDate = true,
  showTime = true,
  showComments = true
}: PostInfoWidgetProps) {
  const items = [
    showAuthor && { icon: User, text: author },
    showDate && { icon: Calendar, text: date },
    showTime && { icon: Clock, text: time },
    showComments && { icon: MessageCircle, text: commentsCount },
  ].filter(Boolean) as { icon: React.ElementType, text: string }[];

  return (
    <div 
      className={`flex ${layout === 'list' ? 'flex-col gap-2' : 'flex-row gap-4 flex-wrap'} text-sm text-gray-500`}
      style={{ 
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        alignItems: layout === 'list' ? (align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start') : 'center'
      }}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <item.icon className="w-4 h-4" />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

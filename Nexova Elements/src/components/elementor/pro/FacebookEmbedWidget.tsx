"use client";

import React from "react";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Globe, Heart, MessageSquare } from "lucide-react";

interface FacebookEmbedWidgetProps {
  type?: "post" | "video" | "comment" | "page";
  url?: string;
  profileName?: string;
  profileImage?: string;
  content?: string;
  image?: string;
  date?: string;
  likes?: number;
  comments?: number;
  shares?: number;
}

export default function FacebookEmbedWidget({
  type = "post",
  url = "https://www.facebook.com/facebook/posts/10153231379946729",
  profileName = "Facebook Page",
  profileImage,
  content = "This is a simulated preview of a Facebook post. In a real production environment, you would use the Facebook SDK or oEmbed API to render the actual content.",
  image,
  date = "2 hrs",
  likes = 124,
  comments = 45,
  shares = 12,
}: FacebookEmbedWidgetProps) {
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt={profileName} className="w-full h-full object-cover" />
            ) : (
              "f"
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm hover:underline cursor-pointer">{profileName}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="hover:underline cursor-pointer">{date}</span>
              <span>·</span>
              <Globe size={12} />
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-sm text-gray-800 mb-3 whitespace-pre-line">
          {content}
        </p>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline break-all block mb-4">
            {url}
          </a>
        )}
      </div>

      {/* Media Placeholder */}
      {image ? (
        <div className="w-full h-64 bg-gray-100 overflow-hidden">
          <img src={image} alt="Post content" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border-y border-gray-100">
          Post Media / Video
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white z-10 border border-white">
              <ThumbsUp size={8} fill="currentColor" />
            </div>
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white border border-white">
              <Heart size={8} fill="currentColor" />
            </div>
          </div>
          <span className="hover:underline cursor-pointer ml-1">{likes}</span>
        </div>
        <div className="flex gap-3">
          <span className="hover:underline cursor-pointer">{comments} comments</span>
          <span className="hover:underline cursor-pointer">{shares} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 flex items-center justify-between">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-md text-gray-600 font-medium text-sm transition-colors">
          <ThumbsUp size={18} />
          <span>Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-md text-gray-600 font-medium text-sm transition-colors">
          <MessageSquare size={18} />
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-md text-gray-600 font-medium text-sm transition-colors">
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

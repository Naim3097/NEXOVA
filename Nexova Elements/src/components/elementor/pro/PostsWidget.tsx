"use client";

import React from "react";
import Image from "next/image";

interface Post {
  id: number | string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author?: string;
}

interface PostsWidgetProps {
  count?: number;
  columns?: "1" | "2" | "3" | "4";
  showImage?: boolean;
  showTitle?: boolean;
  showExcerpt?: boolean;
  showMeta?: boolean;
  posts?: Post[];
}

export default function PostsWidget({
  count = 3,
  columns = "3",
  showImage = true,
  showTitle = true,
  showExcerpt = true,
  showMeta = true,
  posts = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: `Blog Post Title ${i + 1}`,
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "Oct 24, 2023",
    image: `https://picsum.photos/seed/post${i}/400/300`,
    author: "Admin"
  })),
}: PostsWidgetProps) {
  const displayPosts = posts.slice(0, count);

  const gridCols = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-3",
    "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 w-full`}>
      {displayPosts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          {showImage && (
            <div className="h-48 overflow-hidden relative">
              <Image src={post.image} alt={post.title} fill className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          )}
          <div className="p-4">
            {showTitle && <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>}
            {showMeta && <div className="text-xs text-gray-400 mb-3">{post.date} • By {post.author || "Admin"}</div>}
            {showExcerpt && <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>}
            <div className="mt-4">
              <span className="text-blue-500 text-sm font-medium cursor-pointer hover:underline">Read More »</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

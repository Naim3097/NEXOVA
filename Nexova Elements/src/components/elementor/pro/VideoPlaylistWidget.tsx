"use client";

import React, { useState } from "react";
import { Play, Clock, CheckCircle2, Pause } from "lucide-react";

interface VideoItem {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  url: string; // In a real app, this would be the video source
  watched: boolean;
}

interface VideoPlaylistWidgetProps {
  skin?: "dark" | "light";
  layout?: "vertical" | "horizontal";
  videos?: VideoItem[];
}

export default function VideoPlaylistWidget({
  skin = "dark",
  layout = "vertical",
  videos = [
    { id: 1, title: "Introduction to the Course", duration: "02:15", watched: true, thumbnail: "https://picsum.photos/seed/video1/200/150", url: "#" },
    { id: 2, title: "Setting Up Your Environment", duration: "05:30", watched: true, thumbnail: "https://picsum.photos/seed/video2/200/150", url: "#" },
    { id: 3, title: "Basic Concepts Explained", duration: "10:24", watched: false, thumbnail: "https://picsum.photos/seed/video3/200/150", url: "#" },
    { id: 4, title: "Advanced Techniques", duration: "15:45", watched: false, thumbnail: "https://picsum.photos/seed/video4/200/150", url: "#" },
    { id: 5, title: "Final Project Overview", duration: "08:10", watched: false, thumbnail: "https://picsum.photos/seed/video5/200/150", url: "#" },
    { id: 6, title: "Conclusion & Next Steps", duration: "03:20", watched: false, thumbnail: "https://picsum.photos/seed/video6/200/150", url: "#" },
  ],
}: VideoPlaylistWidgetProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isDark = skin === "dark";
  const isVertical = layout === "vertical";

  const currentVideo = videos[currentVideoIndex];

  const handleVideoClick = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className={`flex ${isVertical ? "flex-col md:flex-row" : "flex-col"} overflow-hidden rounded-xl shadow-2xl ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"} border ${isDark ? "border-gray-800" : "border-gray-200"}`}>
      {/* Main Video Player */}
      <div className={`${isVertical ? "md:w-2/3" : "w-full"} aspect-video bg-black relative group`}>
        {isPlaying ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
             {/* Placeholder for actual video player */}
             <div className="text-center">
                <div className="animate-pulse mb-4">
                  <Play size={48} className="text-blue-500 mx-auto opacity-50" />
                </div>
                <p className="text-gray-400">Playing: {currentVideo.title}</p>
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                >
                  Stop Playback
                </button>
             </div>
          </div>
        ) : (
          <>
            <img 
              src={`https://picsum.photos/seed/video_large_${currentVideo.id}/800/450`} 
              alt={currentVideo.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 cursor-pointer hover:bg-blue-600 hover:text-white border-2 border-white/30"
              >
                <Play size={32} className="ml-1 fill-current" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <h3 className="text-white font-bold text-xl md:text-2xl mb-1">{currentVideo.title}</h3>
              <p className="text-gray-300 text-sm">{currentVideo.duration} • Lesson {currentVideoIndex + 1}</p>
            </div>
          </>
        )}
      </div>

      {/* Playlist Sidebar */}
      <div className={`${isVertical ? "md:w-1/3 border-l" : "w-full border-t"} ${isDark ? "border-gray-800" : "border-gray-200"} flex flex-col h-[400px]`}>
        <div className={`p-5 font-bold border-b flex justify-between items-center ${isDark ? "border-gray-800 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}>
          <span>Course Content</span>
          <span className="text-xs font-normal px-2 py-1 rounded bg-black/10 dark:bg-white/10">
            {currentVideoIndex + 1}/{videos.length}
          </span>
        </div>
        
        <div className="overflow-y-auto flex-grow custom-scrollbar">
          {videos.map((video, index) => (
            <div 
              key={video.id} 
              onClick={() => handleVideoClick(index)}
              className={`p-4 flex gap-4 cursor-pointer transition-all border-b border-transparent group
                ${index === currentVideoIndex 
                  ? (isDark ? "bg-white/5 border-l-4 border-l-blue-500" : "bg-blue-50 border-l-4 border-l-blue-500") 
                  : (isDark ? "hover:bg-white/5 border-l-4 border-l-transparent" : "hover:bg-gray-50 border-l-4 border-l-transparent")
                }
              `}
            >
              <div className="relative w-28 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                 <img src={video.thumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                 {video.watched && (
                   <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5 shadow-sm">
                     <CheckCircle2 size={10} className="text-white" />
                   </div>
                 )}
                 {index === currentVideoIndex && isPlaying && (
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                     <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                   </div>
                 )}
              </div>
              
              <div className="flex flex-col justify-center min-w-0">
                <span className={`text-sm font-medium line-clamp-2 mb-1.5 leading-snug ${index === currentVideoIndex ? "text-blue-500" : ""}`}>
                  {index + 1}. {video.title}
                </span>
                <div className="flex items-center gap-1.5 text-xs opacity-60">
                  <Clock size={12} />
                  <span>{video.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

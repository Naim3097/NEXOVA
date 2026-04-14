"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";

const posts = [
  {
    title: "The Future of Web Design: Trends to Watch in 2025",
    excerpt: "Explore the emerging technologies and design patterns that will shape the next generation of digital experiences.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2672&auto=format&fit=crop",
    date: "Mar 15, 2025",
    author: "Sarah Johnson",
    category: "Design"
  },
  {
    title: "Optimizing React Applications for Maximum Performance",
    excerpt: "A deep dive into advanced optimization techniques, from code splitting to server-side rendering.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2670&auto=format&fit=crop",
    date: "Mar 12, 2025",
    author: "Mike Chen",
    category: "Development"
  },
  {
    title: "Building Accessible Interfaces: A Comprehensive Guide",
    excerpt: "Why accessibility matters and how to implement WCAG 2.1 standards in your modern web applications.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=2670&auto=format&fit=crop",
    date: "Mar 10, 2025",
    author: "Emily Davis",
    category: "Accessibility"
  }
];

export default function BlogGrid() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-4">Latest Insights</h2>
            <p className="text-zinc-400">Thoughts on design, development, and technology.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-white hover:text-blue-400 transition-colors font-medium">
            View all articles <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3]">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                  {post.category}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {post.author}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-medium text-white group-hover:translate-x-2 transition-transform">
                Read Article <ArrowRight className="w-4 h-4" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

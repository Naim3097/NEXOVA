"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function SplitContact() {
  return (
    <section className="min-h-screen flex bg-zinc-950">
      <div className="container mx-auto px-6 py-20">
        <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 flex flex-col lg:flex-row min-h-[600px]">
          
          {/* Info Side */}
          <div className="lg:w-2/5 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-blue-100 mb-12">
                Fill up the form and our Team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-blue-200" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-blue-200" />
                  <span>hello@axtra.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-blue-200" />
                  <span>102 Street 2714, <br />San Francisco, CA</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex gap-4 mt-12">
              <div className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer" />
              <div className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer" />
              <div className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-3/5 p-12 bg-zinc-900">
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">First Name</label>
                  <input type="text" className="w-full bg-black border-b border-zinc-700 focus:border-blue-500 px-0 py-2 outline-none text-white transition-colors" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Last Name</label>
                  <input type="text" className="w-full bg-black border-b border-zinc-700 focus:border-blue-500 px-0 py-2 outline-none text-white transition-colors" placeholder="Doe" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Email</label>
                  <input type="email" className="w-full bg-black border-b border-zinc-700 focus:border-blue-500 px-0 py-2 outline-none text-white transition-colors" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Phone</label>
                  <input type="tel" className="w-full bg-black border-b border-zinc-700 focus:border-blue-500 px-0 py-2 outline-none text-white transition-colors" placeholder="+1 234 567 890" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Message</label>
                <textarea rows={4} className="w-full bg-black border-b border-zinc-700 focus:border-blue-500 px-0 py-2 outline-none text-white transition-colors resize-none" placeholder="Write your message.." />
              </div>

              <div className="flex justify-end">
                <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

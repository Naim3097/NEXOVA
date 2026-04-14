"use client";

import React from "react";
import { Check, X, HelpCircle } from "lucide-react";

export default function ComparisonPricingTable() {
  return (
    <section className="py-24 bg-zinc-950 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Compare Plans</h2>
          <p className="text-zinc-400">Detailed feature comparison for all plans.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-zinc-900/50 border-b border-white/10 min-w-[200px]">Features</th>
                <th className="p-4 bg-zinc-900/50 border-b border-white/10 text-center min-w-[150px]">Starter</th>
                <th className="p-4 bg-zinc-900/50 border-b border-white/10 text-center min-w-[150px] text-blue-400">Pro</th>
                <th className="p-4 bg-zinc-900/50 border-b border-white/10 text-center min-w-[150px]">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Section 1 */}
              <tr>
                <td colSpan={4} className="p-4 bg-zinc-900/20 font-bold text-zinc-500 uppercase tracking-wider text-xs">Core Features</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 flex items-center gap-2">
                  Projects <HelpCircle className="w-3 h-3 text-zinc-600" />
                </td>
                <td className="p-4 text-center">3</td>
                <td className="p-4 text-center font-bold">Unlimited</td>
                <td className="p-4 text-center">Unlimited</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">Storage</td>
                <td className="p-4 text-center">5GB</td>
                <td className="p-4 text-center font-bold">100GB</td>
                <td className="p-4 text-center">Unlimited</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">Bandwidth</td>
                <td className="p-4 text-center">10GB/mo</td>
                <td className="p-4 text-center font-bold">1TB/mo</td>
                <td className="p-4 text-center">Unlimited</td>
              </tr>

              {/* Section 2 */}
              <tr>
                <td colSpan={4} className="p-4 bg-zinc-900/20 font-bold text-zinc-500 uppercase tracking-wider text-xs">Security</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">SSL Certificate</td>
                <td className="p-4 text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></td>
                <td className="p-4 text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></td>
                <td className="p-4 text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">SSO</td>
                <td className="p-4 text-center"><X className="w-4 h-4 mx-auto text-zinc-700" /></td>
                <td className="p-4 text-center"><X className="w-4 h-4 mx-auto text-zinc-700" /></td>
                <td className="p-4 text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">Audit Logs</td>
                <td className="p-4 text-center"><X className="w-4 h-4 mx-auto text-zinc-700" /></td>
                <td className="p-4 text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></td>
                <td className="p-4 text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

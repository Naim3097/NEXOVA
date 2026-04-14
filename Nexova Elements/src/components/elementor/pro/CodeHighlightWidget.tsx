"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeHighlightWidgetProps {
  language?: "javascript" | "html" | "css" | "python" | "php";
  theme?: "dark" | "light";
  copyButton?: boolean;
  code?: string;
}

export default function CodeHighlightWidget({
  language = "javascript",
  theme = "dark",
  copyButton = true,
  code = `function helloWorld() {
  console.log("Hello, World!");
  return true;
}`,
}: CodeHighlightWidgetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting simulation
  const highlightCode = (codeStr: string) => {
    const keywords = ["function", "return", "var", "let", "const", "if", "else", "for", "while", "import", "from", "export", "default", "class", "interface"];
    const builtins = ["console", "log", "window", "document", "React", "useState", "useEffect"];
    
    return codeStr.split(/(\s+|[(){};,"'])/g).map((token, i) => {
      if (keywords.includes(token)) return <span key={i} className="text-purple-400">{token}</span>;
      if (builtins.includes(token)) return <span key={i} className="text-blue-400">{token}</span>;
      if (token.startsWith('"') || token.startsWith("'")) return <span key={i} className="text-green-400">{token}</span>;
      if (!isNaN(Number(token))) return <span key={i} className="text-orange-400">{token}</span>;
      if (token.match(/^[A-Z]/)) return <span key={i} className="text-yellow-400">{token}</span>; // Classes/Types
      return <span key={i}>{token}</span>;
    });
  };

  return (
    <div className={`rounded-lg overflow-hidden border shadow-sm ${theme === "dark" ? "bg-[#1e1e1e] border-gray-800" : "bg-white border-gray-200"}`}>
      <div className={`flex justify-between items-center px-4 py-2 border-b ${theme === "dark" ? "border-gray-800 bg-[#252526]" : "border-gray-100 bg-gray-50"}`}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono uppercase ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{language}</span>
          {copyButton && (
            <button 
              onClick={handleCopy}
              className={`p-1.5 rounded transition-all ${
                theme === "dark" 
                  ? "text-gray-400 hover:bg-white/10 hover:text-white" 
                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
              }`}
              title="Copy code"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>
      <pre className={`p-4 overflow-x-auto font-mono text-sm leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
        <code>{highlightCode(code)}</code>
      </pre>
    </div>
  );
}

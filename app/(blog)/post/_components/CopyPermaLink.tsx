"use client";
import { Hash, Check } from "lucide-react";
import { useState } from "react";

export default function CopyPermalink() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`bg-transparent cursor-pointer group flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
        copied
          ? "bg-green-600 text-white"
          : "bg-white text-black hover:bg-cyan-400"
      }`}
    >
      {copied ? <Check size={18} /> : <Hash size={18} />}
      <span className="text-xs uppercase tracking-widest">
        {copied ? "Copied" : "Permalink"}
      </span>
    </button>
  );
}

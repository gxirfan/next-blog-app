"use client";

import { Loader2, Terminal } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" />
        <div className="relative h-16 w-16 bg-[#0d0d0d] border border-neutral-800 rounded-2xl flex items-center justify-center text-cyan-500">
          <Loader2 size={32} className="animate-spin" />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-neutral-900/50 border border-neutral-800 rounded-full">
          <Terminal size={12} className="text-neutral-600" />
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em] animate-pulse">
            Fetching_System_Resources...
          </span>
        </div>

        <p className="text-[9px] font-mono text-neutral-700 uppercase tracking-widest">
          {process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog"} Protocol v1.0.4
        </p>
      </div>

      <div className="w-48 h-px bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

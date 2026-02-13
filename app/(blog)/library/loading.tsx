// app/library/loading.tsx
import { Loader } from "lucide-react";

export default function LibraryLoading() {
  return (
    <div className="mx-auto space-y-10  animate-in fade-in duration-500">
      {/* 1. Header Skeleton - Keep it consistent with your Library layout */}
      <div className="border-b border-neutral-900 pb-8">
        <div className="flex items-center space-x-4 mb-3">
          <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-2xl animate-pulse" />
          <div className="h-8 w-40 bg-neutral-900 rounded-lg animate-pulse" />
        </div>
        <div className="h-3 w-56 bg-neutral-900 rounded-md animate-pulse ml-1" />
      </div>

      {/* 2. Centralized Loader Area */}
      <div className="flex flex-col items-center justify-center py-32 bg-neutral-950 border border-neutral-900 rounded-[2.5rem]">
        <div className="relative flex items-center justify-center">
          {/* Subtle glow without using shadow: strictly using blur and opacity */}
          <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full animate-pulse" />
          <Loader
            className="animate-spin text-cyan-500 relative z-10"
            size={32}
          />
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-neutral-600 animate-pulse">
          Synchronizing Grid Data...
        </p>
      </div>
    </div>
  );
}

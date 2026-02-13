// app/flow/loading.tsx
import { Loader, Grid, Sparkles, PlusCircle } from "lucide-react";

export default function FlowLoading() {
  return (
    <div className="w-full mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* 1. Header & Navigation Skeleton (Flow-specific) */}
      <div className="border-b border-neutral-900 pb-10 flex justify-between items-center">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="h-10 w-48 bg-neutral-900 rounded-xl animate-pulse" />
          <div className="h-4 w-72 bg-neutral-900/50 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-32 bg-cyan-500/10 border border-cyan-500/20 rounded-full animate-pulse flex items-center justify-center">
          <PlusCircle size={20} className="text-cyan-500/50 animate-pulse" />
        </div>
      </div>

      {/* 2. Centralized Loader: Dynamic Grid Sync */}
      <div className="flex flex-col items-center justify-center py-20 bg-neutral-950 border border-neutral-800 rounded-[2.5rem] overflow-hidden relative">
        {/* Subtle radial gradient for depth without shadow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02),transparent)] pointer-events-none" />

        <div className="relative">
          {/* Pulsing outer ring */}
          <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-full animate-ping-slow" />

          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl relative z-10">
            <Loader
              className="animate-spin text-cyan-500"
              size={36}
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center space-y-3">
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 animate-pulse">
            Establishing Flow Stream
          </p>
          <div className="flex gap-1.5">
            <Sparkles
              size={16}
              className="text-cyan-500/70 animate-pulse [animation-delay:-0.4s]"
            />
            <Sparkles
              size={16}
              className="text-cyan-500/70 animate-pulse [animation-delay:-0.2s]"
            />
            <Sparkles size={16} className="text-cyan-500/70 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 3. Flow Card Stream Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-6 bg-neutral-950 border border-neutral-800 rounded-[2rem] space-y-4 animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }} // Sequential pulse
          >
            <div className="h-4 w-3/4 bg-neutral-900 rounded-lg" />
            <div className="h-3 w-full bg-neutral-900/50 rounded-md" />
            <div className="h-3 w-5/6 bg-neutral-900/50 rounded-md" />
            <div className="h-10 w-2/3 ml-auto bg-neutral-900 rounded-xl mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

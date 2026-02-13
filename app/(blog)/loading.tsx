import { Loader } from "lucide-react";

export default function BlogLoading() {
  return (
    <div className="w-full mx-auto space-y-10 animate-in fade-in duration-700">
      {/* 1. Header Skeleton Area */}
      <div className="border-b border-neutral-900 pb-10">
        <div className="flex items-center space-x-4 mb-3">
          {/* Square rounded icon placeholder */}
          <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-2xl animate-pulse" />
          {/* Title placeholder */}
          <div className="h-10 w-64 bg-neutral-900 rounded-xl animate-pulse" />
        </div>
        {/* Subtitle placeholder */}
        <div className="h-3 w-48 bg-neutral-900/50 rounded-lg animate-pulse ml-1" />
      </div>

      {/* 2. Main Content Loader: Stark & Modern */}
      <div className="relative flex flex-col items-center justify-center py-32 bg-neutral-950 border border-neutral-800 rounded-[2.5rem] overflow-hidden">
        {/* Subtle background detail (Zero Shadow approach: using border/blur instead) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03),transparent)] pointer-events-none" />

        <div className="relative">
          {/* Outer Ring Animation */}
          <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-full animate-ping" />

          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl relative z-10">
            <Loader
              className="animate-spin text-cyan-500"
              size={32}
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center space-y-2">
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 animate-pulse">
            Synchronizing Grid
          </p>
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* 3. Footer/List Skeleton (Optional) */}
      <div className="grid grid-cols-1 gap-4 opacity-20">
        <div className="h-32 w-full bg-neutral-900 border border-neutral-800 rounded-[2rem]" />
        <div className="h-32 w-full bg-neutral-900 border border-neutral-800 rounded-[2rem]" />
      </div>
    </div>
  );
}

import { Loader } from "lucide-react";

export default function LibraryLoading() {
  return (
    <div className="mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="border-b border-neutral-900 pb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full animate-pulse" />
          <div className="h-7 w-48 bg-neutral-900 rounded-full animate-pulse" />
        </div>
        <div className="h-2.5 w-64 bg-neutral-900/40 rounded-full animate-pulse ml-1" />
      </div>

      <div className="relative flex flex-col items-center justify-center py-32 bg-neutral-950 border border-neutral-900 rounded-[3rem] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03),transparent)] pointer-events-none" />

        <div className="relative flex flex-col items-center">
          <div className="absolute w-12 h-12 bg-cyan-500/5 rounded-full animate-ping duration-[3s]" />

          <div className="p-6 bg-neutral-900/30 border border-neutral-800 rounded-full relative z-10">
            <Loader
              className="animate-spin text-cyan-500/80"
              size={28}
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            Loading Library
          </p>

          <div className="w-12 h-px bg-neutral-900 rounded-full overflow-hidden">
            <div className="w-full h-full bg-cyan-500/30 animate-[loading-slide_2s_infinite_ease-in-out]" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { ENV } from "@/config/env.config";

interface AllTopicsHeaderProps {
  totalTopics: number;
}

export default function AllTopicsHeader({ totalTopics }: AllTopicsHeaderProps) {
  return (
    <header className="relative flex flex-col gap-4 border-b border-neutral-900 pb-10">
      {/* Visual connection to the system grid */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.4em]">
          Knowledge Base Index
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            Topic <span className="text-neutral-600 font-light">Archive</span>
          </h1>
          <p className="text-neutral-500 font-medium max-w-md text-sm mt-3">
            Explore content by topic. Join specific spheres to discover and
            contribute to shared knowledge within the {ENV.PROJECT_NAME}{" "}
            network.
          </p>
        </div>

        {/* Counter display in terminal style */}
        <div className="flex flex-col items-end border-r-2 border-cyan-500/30 pr-4">
          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
            Records
          </span>
          <span className="text-3xl font-mono font-black text-cyan-500/80">
            {String(totalTopics || 0).padStart(3, "0")}
          </span>
        </div>
      </div>
    </header>
  );
}

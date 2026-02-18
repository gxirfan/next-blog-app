import { ENV } from "@/config/env.config";

interface AllPostsHeaderProps {
  totalRecords: number;
}

export default function AllPostsHeader({ totalRecords }: AllPostsHeaderProps) {
  return (
    <header className="relative flex flex-col gap-4 border-b border-neutral-900 pb-10">
      {/* Decorative Index Indicator */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.4em]">
          Database Index
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
            All <span className="text-neutral-600 font-light">Posts</span>
          </h1>
          <p className="text-neutral-500 font-medium max-w-md">
            Complete archive of system logs and shared insights across the
            {ENV.PROJECT_NAME} network.
          </p>
        </div>

        {/* Statistical Telemetry */}
        <div className="flex flex-col items-end border-r-2 border-cyan-500/30 pr-4">
          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
            Records
          </span>
          <span className="text-3xl font-mono font-black text-cyan-500/80">
            {String(totalRecords || 0).padStart(3, "0")}
          </span>
        </div>
      </div>
    </header>
  );
}

import { ENV } from "@/config/env.config";

interface AllPostsHeaderProps {
  totalRecords: number;
}

export default function AllPostsHeader({ totalRecords }: AllPostsHeaderProps) {
  return (
    <header className="relative flex flex-col gap-4 border-b border-neutral-900 pb-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 group">
          <div className="w-1.5 h-1.5 bg-cyan-500 rotate-45 group-hover:rotate-90 transition-transform duration-500" />

          <span className="text-[11px] font-black text-neutral-400 tracking-[0.3em]">
            Explore <span className="text-neutral-200">{ENV.POST_TYPE}s</span>
          </span>
        </div>

        <div className="h-px w-12 bg-neutral-800" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-white tracking-tighter">
            Latest{" "}
            <span className="text-neutral-600 font-light">
              {ENV.POST_TYPE}s
            </span>
          </h1>
          <p className="text-neutral-500 font-medium max-w-md">
            Complete archive of system logs and shared {ENV.POST_TYPE}s across
            the {ENV.PROJECT_NAME} network.
          </p>
        </div>

        <div className="flex flex-col items-end border-r-2 border-cyan-500/30 pr-4">
          <span className="text-[10px] font-mono text-neutral-600 tracking-widest">
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

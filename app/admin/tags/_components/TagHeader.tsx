import { Database, Tag } from "lucide-react";

interface TagHeaderProps {
  count: number;
}

export default function TagHeader({ count }: TagHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b-4 border-neutral-950 pb-14 px-4 md:px-0">
      <div className="space-y-6">
        <div className="flex items-center gap-4 text-neutral-800 font-black text-[10px] tracking-[0.5em]">
          <Database size={16} strokeWidth={3} />
          Taxonomy Registry Control
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none select-none">
          Global <span className="text-neutral-900">Labels</span>
        </h1>

        <p className="text-sm font-bold text-neutral-600 max-w-sm tracking-wide leading-relaxed">
          Structural classification and management of the global data indexing
          framework.
        </p>
      </div>

      <div className="bg-neutral-950 border-4 border-neutral-900 flex items-center gap-8 px-10 py-6 rounded-[2.5rem]">
        <div className="text-right space-y-2 leading-none">
          <p className="text-[10px] text-neutral-700 font-black tracking-[0.3em]">
            Registered Tags
          </p>
          <p className="text-4xl font-black text-white tracking-tighter">
            {count}
          </p>
        </div>

        <div className="h-12 w-1 bg-neutral-900 rounded-full" />

        <div className="p-4 bg-neutral-900/50 rounded-2xl border-2 border-neutral-800 text-white/10 group-hover:text-white/30 transition-colors">
          <Tag size={32} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

import { Layers } from "lucide-react";

export default function TopicHeader({ count }: { count: number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/50 pb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-cyan-500 font-mono text-[10px] tracking-widest uppercase">
          <Layers size={12} />
          Data Partition
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight leading-none uppercase">
          Topic <span className="text-neutral-500 font-medium">Inventory</span>
        </h1>
      </div>

      <div className="bg-[#0d0d0d] border border-neutral-800/60 flex items-center gap-3 px-4 py-2 rounded-2xl">
        <div className="text-right leading-none">
          <p className="text-[9px] text-neutral-600 uppercase font-black tracking-tighter">
            Nodes
          </p>
          <p className="text-lg font-bold text-neutral-200">{count}</p>
        </div>
        <div className="h-6 w-[1px] bg-neutral-800" />
        <Layers className="text-cyan-500/30" size={18} />
      </div>
    </div>
  );
}

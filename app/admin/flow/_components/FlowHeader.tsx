import { Activity } from "lucide-react";

export default function FlowHeader({ count }: { count: number }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800/50 pb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
          <Activity size={14} />
          Network Throughput
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
          Flow{" "}
          <span className="text-neutral-500 font-light text-2xl tracking-tighter">
            Analyzer
          </span>
        </h1>
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-2 font-bold">
          Monitoring real-time data streams and content propagation.
        </p>
      </div>

      <div className="bg-[#0d0d0d] border border-neutral-800 flex items-center gap-4 px-6 py-3 rounded-2xl">
        <div className="text-right leading-none">
          <p className="text-[9px] text-neutral-600 uppercase font-black tracking-tighter">
            Active_Streams
          </p>
          <p className="text-xl font-bold text-neutral-200">{count}</p>
        </div>
        <div className="h-8 w-[1px] bg-neutral-800" />
        <Activity className="text-cyan-500/30" size={20} />
      </div>
    </div>
  );
}

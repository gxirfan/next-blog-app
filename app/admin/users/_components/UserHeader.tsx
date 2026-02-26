import { Crown, ShieldAlert } from "lucide-react";

export default function UserHeader({ count }: { count: number }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-4 border-neutral-950 pb-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-neutral-600 font-black text-[10px] tracking-[0.4em]">
          <ShieldAlert size={14} className="text-neutral-800" />
          Identity Management
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
          User <span className="text-neutral-800">Database</span>
        </h1>
        <p className="text-sm font-bold text-neutral-500 max-w-sm tracking-wide">
          Management of identity nodes and access clearance levels.
        </p>
      </div>

      <div className="bg-neutral-950 border-2 border-neutral-900 flex items-center gap-6 px-8 py-5 rounded-[2rem]">
        <div className="text-right space-y-1 leading-none">
          <p className="text-[10px] text-neutral-700 font-black tracking-widest">
            Total Nodes
          </p>
          <p className="text-2xl font-black text-white">{count}</p>
        </div>
        <div className="h-10 w-0.5 bg-neutral-900" />
        <Crown className="text-white opacity-20" size={32} />
      </div>
    </div>
  );
}

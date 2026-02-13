import { Tag } from "lucide-react";

interface TagHeaderProps {
  count: number;
}

export default function TagHeader({ count }: TagHeaderProps) {
  const BORDER_STYLE = "border border-neutral-800/60";
  const CARD_BG = "bg-[#111]";

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800/50 pb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs tracking-[0.2em] uppercase">
          <Tag size={14} />
          Taxonomy Management
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight leading-none uppercase">
          Tag{" "}
          <span className="text-neutral-500 font-light text-2xl tracking-tighter">
            Registry
          </span>
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mt-1">
          Manage system-wide labels and categorization logic.
        </p>
      </div>

      <div
        className={`${CARD_BG} ${BORDER_STYLE} flex items-center gap-4 px-5 py-3 rounded-2xl`}
      >
        <div className="text-right leading-none">
          <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">
            Global Tags
          </p>
          <p className="text-xl font-medium text-neutral-200">{count}</p>
        </div>
        <div className="h-8 w-[1px] bg-neutral-800" />
        <Tag className="text-cyan-500/30" size={24} />
      </div>
    </div>
  );
}

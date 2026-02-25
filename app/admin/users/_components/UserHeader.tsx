import { Crown, ShieldAlert } from "lucide-react";

interface UserHeaderProps {
  count: number;
}

export default function UserHeader({ count }: UserHeaderProps) {
  const BORDER_STYLE = "border border-neutral-800/60";
  const CARD_BG = "bg-neutral-950";

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800/50 pb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs tracking-[0.2em]">
          <ShieldAlert size={16} />
          System Intelligence
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight leading-none">
          User{" "}
          <span className="text-neutral-500 font-light text-2xl tracking-tighter">
            Database
          </span>
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mt-1">
          Monitor identity nodes, access levels, and security protocols.
        </p>
      </div>

      <div
        className={`${CARD_BG} ${BORDER_STYLE} flex items-center gap-4 px-5 py-3 rounded-2xl`}
      >
        <div className="text-right leading-none">
          <p className="text-[10px] text-neutral-600 font-bold tracking-widest">
            Total Identity
          </p>
          <p className="text-xl font-medium text-neutral-200">{count}</p>
        </div>
        <div className="h-8 w-[1px] bg-neutral-800" />
        <Crown className="text-cyan-500/30" size={24} />
      </div>
    </div>
  );
}

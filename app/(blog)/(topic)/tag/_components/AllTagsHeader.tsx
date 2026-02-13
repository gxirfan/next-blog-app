interface AllTagsHeaderProps {
  totalTags: number;
}

export default function AllTagsHeader({ totalTags }: AllTagsHeaderProps) {
  return (
    <header className="relative flex flex-col gap-5 border-b border-neutral-900 pb-12">
      {/* Decorative tag-specific system indicator */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-sm bg-cyan-500 rotate-45 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.4em]">
          Metadata Registry
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            Tag <span className="text-neutral-700 font-light">Index</span>
          </h1>
          <p className="text-neutral-500 font-medium max-w-lg text-sm leading-relaxed">
            A comprehensive mapping of micro-identifiers. Use these nodes to
            filter through the global data stream with precision.
          </p>
        </div>

        {/* Total tag count in a high-contrast terminal box */}
        <div className="flex flex-col items-end border-r-2 border-cyan-500/30 pr-4">
          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
            Records
          </span>
          <span className="text-3xl font-mono font-black text-cyan-500/80">
            {String(totalTags || 0).padStart(3, "0")}
          </span>
        </div>
      </div>
    </header>
  );
}

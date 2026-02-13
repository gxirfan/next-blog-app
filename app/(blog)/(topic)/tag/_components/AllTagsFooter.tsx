import PaginationControls from "@/app/components/PaginationControls";
import { IMeta } from "@/app/types/common";

interface AllTagsFooterProps {
  meta: IMeta;
}

export default function AllTagsFooter({ meta }: AllTagsFooterProps) {
  // Navigation is redundant if data fits in a single frame
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <footer className="pt-12 border-t border-neutral-900 flex flex-col items-center gap-8">
      <div className="flex items-center gap-4">
        <div className="h-px w-8 bg-neutral-800" />
        <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.5em] font-black">
          Registry_Navigation
        </span>
        <div className="h-px w-8 bg-neutral-800" />
      </div>

      <div className="bg-black/40 backdrop-blur-sm p-3 rounded-4xl border border-neutral-800 shadow-2xl shadow-cyan-500/5">
        <PaginationControls meta={meta} />
      </div>
    </footer>
  );
}

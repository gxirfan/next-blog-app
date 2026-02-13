import PaginationControls from "@/app/components/PaginationControls";
import { IMeta } from "@/app/types/common";

interface AllTopicsFooterProps {
  meta: IMeta;
}

export default function AllTopicsFooter({ meta }: AllTopicsFooterProps) {
  // Logic: Do not render the navigation module if there is only one page
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <footer className="pt-12 border-t border-neutral-900 flex flex-col items-center gap-8">
      <div className="flex items-center gap-6">
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-neutral-800" />
        <span className="text-[10px] font-mono text-neutral-700 uppercase tracking-[0.3em] font-bold">
          Sector Navigation
        </span>
        <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-neutral-800" />
      </div>

      <div className="bg-[#0a0a0a] p-3 rounded-2xl border border-neutral-800/50 shadow-2xl shadow-cyan-500/5">
        <PaginationControls meta={meta} />
      </div>
    </footer>
  );
}

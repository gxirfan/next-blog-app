import PaginationControls from "@/app/components/PaginationControls";
import { IMeta } from "@/app/types/common";

interface AllPostsFooterProps {
  meta: IMeta;
}

export default function AllPostsFooter({ meta }: AllPostsFooterProps) {
  // Only render if there is more than one page to navigate
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <footer className="pt-10 border-t border-neutral-900 flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="h-px w-12 bg-neutral-900" />
        <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
          Navigation Control
        </span>
        <div className="h-px w-12 bg-neutral-900" />
      </div>

      <div className="bg-neutral-950/50 p-2 rounded-2xl border border-neutral-900">
        <PaginationControls meta={meta} />
      </div>
    </footer>
  );
}

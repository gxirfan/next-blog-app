import Link from "next/link";
import { CornerDownRight } from "lucide-react";
import { IFlow } from "@/app/types/flow";
import AuthorBlock from "@/app/components/AuthorBlock";
import FlowActions from "./FlowActions";
import { getRelativeTime } from "@/app/utils/date";

export default function FlowDetailClient({ mainFlow }: { mainFlow: IFlow }) {
  const { author } = mainFlow;

  return (
    <div className="flex flex-col">
      {mainFlow.parentContent && mainFlow.parentSlug && (
        <div className="relative pl-0 md:pl-16 mb-6">
          <div className="absolute left-7 top-0 h-10 w-[2px] bg-neutral-900" />

          <Link
            href={`/stream/thread/${mainFlow.parentSlug}`}
            className="group flex flex-col p-6 rounded-4xl bg-neutral-900/40 border border-neutral-900 hover:border-neutral-800 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 rounded-full bg-neutral-950 flex items-center justify-center border border-neutral-800 text-neutral-500 group-hover:text-cyan-500 transition-colors">
                <CornerDownRight size={12} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] text-neutral-500 group-hover:text-neutral-400">
                Replying to
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 pl-9">
              &quot;{mainFlow.parentContent}&quot;
            </p>
          </Link>
        </div>
      )}

      <article className="group relative bg-transparent pt-6 pb-12 px-0 md:px-0">
        <div className="absolute left-[-2px] top-0 bottom-0 w-[3px] bg-cyan-500 rounded-r-full" />

        <div className="flex flex-col pl-6 md:pl-16">
          <div className="flex items-center justify-between mb-10">
            <AuthorBlock
              username={author?.username || "User"}
              nickname={author?.nickname || "User"}
              avatarUrl={author?.avatar}
              role={author?.role || "Member"}
            />
            <div className="opacity-40 hover:opacity-100 transition-opacity">
              <FlowActions
                slug={mainFlow.slug}
                initialContent={mainFlow.content}
                authorId={author?.id || ""}
              />
            </div>
          </div>

          <div className="text-white text-[22px] md:text-[28px] leading-[1.6] font-bold tracking-tight whitespace-pre-wrap mb-10">
            {mainFlow.content}
          </div>

          <div className="flex items-center gap-6 pt-8 border-t border-neutral-900/80">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span className="text-[10px] font-black tracking-[0.2em] text-neutral-300">
                Posted
              </span>
            </div>
            <span className="text-[10px] font-bold text-neutral-600 tracking-widest">
              {getRelativeTime(mainFlow.createdAt) || "Just now"}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

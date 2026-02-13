// FlowDetailStaticContent.tsx (SERVER COMPONENT)
import Link from "next/link";
import { CornerDownRight, Hash } from "lucide-react";
import { IFlow } from "@/app/types/flow";
import AuthorBlock from "@/app/components/AuthorBlock";
import FlowActions from "./FlowActions";
import { getRelativeTime } from "@/app/utils/date";

export default function FlowDetailClient({ mainFlow }: { mainFlow: IFlow }) {
  const { author } = mainFlow;

  return (
    <div className="flex flex-col gap-y-4">
      {/* 1. PARENT CONTEXT */}
      {mainFlow.parentContent && mainFlow.parentSlug && (
        <div className="relative group">
          <div className="absolute left-[26px] top-10 h-full w-[2px] bg-neutral-900 group-hover:bg-neutral-900 transition-colors z-0" />
          <Link
            href={`/flow/${mainFlow.parentSlug}`}
            className="flex items-start space-x-3 opacity-60 hover:opacity-100 transition-opacity"
          >
            {/* ... Icon logic ... */}
            <div className="shrink-0 w-12 flex justify-center z-10 pb-2">
              <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-700">
                <Hash size={14} className="text-neutral-500" />
              </div>
            </div>
            <div className="pb-6 pt-1">
              <div className="flex items-center text-xs text-neutral-500 mb-1">
                <CornerDownRight size={12} className="mr-1" />
                <span className="font-medium">Replying to a thread</span>
              </div>
              <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed">
                &quot;{mainFlow.parentContent}&quot;
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* 2. MAIN HERO FLOW */}
      <article className="relative z-10 border-b border-neutral-800 pb-6">
        <div className="flex items-center justify-between mb-6">
          <AuthorBlock
            username={author?.username || "Unknown"}
            nickname={author?.nickname || "Unknown"}
            avatarUrl={author?.avatar}
            role={author?.role || "user"}
          />
          <FlowActions
            slug={mainFlow.slug}
            initialContent={mainFlow.content}
            authorId={author?.id || ""}
          />
        </div>

        {/* Font size is optimized for long-form reading */}
        <div className="text-white text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-bold mb-6 pl-1 tracking-tight">
          {mainFlow.content}
        </div>

        <div className="text-neutral-500 text-xs font-medium uppercase tracking-wider pl-1">
          {getRelativeTime(mainFlow.createdAt) || "N/A"}
        </div>
      </article>
    </div>
  );
}

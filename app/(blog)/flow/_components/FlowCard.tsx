// app/flow/_components/FlowCard.tsx
import { CornerDownRight, Clock } from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";
import { IFlow } from "@/app/types/flow";
import Link from "next/link";
import { getRelativeTime } from "@/app/utils/date";

interface FlowCardProps {
  flow: IFlow;
  actionSlot?: React.ReactNode;
}

export default function FlowCard({ flow, actionSlot }: FlowCardProps) {
  const { author } = flow;

  return (
    <div className="group relative bg-transparent p-5 md:p-7 border-b border-neutral-800/40 transition-colors duration-200 hover:bg-neutral-900/60">
      <div className="flex flex-col">
        {/* 1. HEADER */}
        <div className="flex items-start justify-between mb-3">
          <AuthorBlock
            username={author.username}
            nickname={author.nickname}
            avatarUrl={author.avatar}
            role={author.role}
          />

          <div className="flex items-center space-x-2 pt-1 text-[11px] font-medium text-neutral-600 uppercase tracking-widest">
            <Link
              href={`/flow/${flow.slug}`}
              className="hover:text-cyan-500 transition-colors"
            >
              {getRelativeTime(flow.createdAt) || "N/A"}
            </Link>
          </div>
        </div>

        {/* 2. CONTENT */}
        <div className="pl-0 md:pl-[52px]">
          <Link href={`/flow/${flow.slug}`} className="block">
            {/* Hover'da metin rengi soft bir beyaza dönüyor */}
            <p className="text-neutral-300 text-[16px] md:text-[18px] leading-[1.6] whitespace-pre-wrap break-words group-hover:text-neutral-100 transition-colors duration-300">
              {flow.content}
            </p>
          </Link>

          {/* 3. PARENT CONTEXT: Daha ince ve bütünleşik */}
          {flow.parentContent && flow.parentId && (
            <Link
              href={`/flow/${flow.parentSlug || "#"}`}
              className="mt-4 block border-l-2 border-neutral-800 bg-neutral-900/30 rounded-r-lg p-3 hover:bg-neutral-800/20 transition-all"
            >
              <div className="flex items-center space-x-2 mb-1 text-neutral-500">
                <CornerDownRight size={12} />
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  In reply to
                </span>
              </div>
              <p className="text-neutral-500 text-[14px] line-clamp-1">
                {flow.parentContent}
              </p>
            </Link>
          )}

          {/* 4. ACTIONS: Hover'da opaklığı artarak netleşir */}
          <div className="mt-5 flex items-center space-x-8 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            {actionSlot}
          </div>
        </div>
      </div>
    </div>
  );
}

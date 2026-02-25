import { CornerDownRight } from "lucide-react";
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
    <div className="group relative bg-transparent p-6 md:p-10 border-b border-neutral-900 transition-all duration-300 hover:bg-neutral-900/40">
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <AuthorBlock
              username={author.username}
              nickname={author.nickname}
              avatarUrl={author.avatar}
              role={author.role}
            />
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 group-hover:bg-cyan-500 transition-all duration-500" />
          </div>

          <Link
            href={`/stream/thread/${flow.slug}`}
            className="text-[10px] font-black tracking-[0.25em] text-neutral-600 hover:text-white transition-colors"
          >
            {getRelativeTime(flow.createdAt)}
          </Link>
        </div>

        <div className="relative pl-0 md:pl-16">
          {flow.parentId && (
            <div className="absolute left-7 top-[-60px] h-[40px] w-[2px] bg-neutral-800 hidden md:block" />
          )}

          <Link href={`/stream/thread/${flow.slug}`} className="block">
            <p className="text-neutral-400 text-[16px] md:text-[18px] leading-[1.8] font-medium tracking-tight whitespace-pre-wrap group-hover:text-neutral-100 transition-colors duration-300">
              {flow.content}
            </p>
          </Link>

          {flow.parentContent && flow.parentId && (
            <Link
              href={`/stream/thread/${flow.parentSlug || "#"}`}
              className="mt-6 block relative bg-neutral-900/60 border border-neutral-800 rounded-4xl p-6 hover:border-neutral-700 transition-all duration-300 group/parent"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-cyan-500 border border-neutral-700">
                  <CornerDownRight size={12} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] text-neutral-500 group-hover/parent:text-cyan-400 transition-colors">
                  Replying to
                </span>
              </div>
              <p className="text-neutral-500 text-[14px] line-clamp-2 leading-relaxed font-medium pl-9">
                &quot;{flow.parentContent}&quot;
              </p>
            </Link>
          )}

          <div className="mt-8 pt-6 border-t border-neutral-900/50 flex items-center opacity-30 group-hover:opacity-100 transition-all duration-500">
            <div className="w-full flex items-center justify-between">
              {actionSlot}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

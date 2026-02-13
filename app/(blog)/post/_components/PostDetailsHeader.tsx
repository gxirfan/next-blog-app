import Link from "next/link";
import { Layout, CornerDownRight, Calendar, Eye } from "lucide-react";
import VoteButtons from "./VoteButtons";
import { IPostResponse } from "@/app/types/post";
import AuthorBlock from "@/app/components/AuthorBlock";
import { getRelativeTime } from "@/app/utils/date";

interface HeaderProps {
  postDetails: IPostResponse;
  userCurrentVoteDirection: number | null;
}

export default function PostDetailsHeader({
  postDetails,
  userCurrentVoteDirection,
}: HeaderProps) {
  const authorProps = {
    username: postDetails.authorUsername,
    nickname: postDetails.authorNickname,
    role: postDetails.authorRole,
    avatarUrl: postDetails.authorAvatar,
  };

  return (
    <>
      {/* Meta Labels & Hierarchy */}
      <div className="flex flex-wrap items-center gap-3 mb-8 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full">
          <Layout size={12} className="text-cyan-500" />
          <Link
            href={`/topic/${postDetails.topicSlug}`}
            className="hover:text-cyan-400 transition-colors"
          >
            {postDetails.topicTitle}
          </Link>
        </div>
        {postDetails.parentId && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full">
            <CornerDownRight size={12} className="text-cyan-500" />
            <Link
              href={`/post/${postDetails.parentSlug}`}
              className="hover:text-cyan-400 transition-colors"
            >
              Ref: {postDetails.parentTitle}
            </Link>
          </div>
        )}
      </div>

      <h1 className="text-4xl md:text-6xl sm:text-5xl text-white leading-[1.1] tracking-normal mb-10 font-black">
        {postDetails.title}
      </h1>

      {/* Author & Engagement Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-neutral-900 mb-12">
        <div className="flex items-center gap-6">
          <AuthorBlock {...authorProps} />
          <div className="h-10 w-px bg-neutral-800 hidden md:block" />
          <VoteButtons
            postId={postDetails.id}
            score={postDetails.score}
            userCurrentVoteDirection={userCurrentVoteDirection}
          />
        </div>

        <div className="flex items-center gap-8 text-[11px] font-bold tracking-widest text-neutral-600 font-mono">
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800">
              <Calendar size={14} />
            </div>
            <span className="text-neutral-400">
              {getRelativeTime(postDetails.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-right">
              <Eye size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-700 text-[8px] uppercase tracking-[0.3em] mb-1 leading-none">
                Hits
              </span>
              <span className="text-neutral-400">
                {postDetails.viewCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

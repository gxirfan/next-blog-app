"use client";

import Link from "next/link";
import { ITopicResponse } from "@/app/types/topic";
import { Eye, MessageSquare, Clock, Tag } from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";
import { getRelativeTime } from "@/app/utils/date";

interface TopicDetailsCardProps {
  topicDetails: ITopicResponse;
}

const TopicDetailsCard = ({ topicDetails }: TopicDetailsCardProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-3 animate-in fade-in duration-500">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-full group hover:border-cyan-500/50 transition-all">
          <Tag size={14} className="text-cyan-500" />
          <Link
            href={`/tag/${topicDetails.tagSlug}`}
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 group-hover:text-white transition-colors"
          >
            {topicDetails.tagTitle}
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl sm:text-5xl text-white leading-[1.1] tracking-tighter">
          {topicDetails.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-neutral-900">
          <div className="flex items-center gap-6">
            <div className="scale-110 origin-left">
              <AuthorBlock
                avatarUrl={topicDetails.authorAvatar}
                nickname={topicDetails.authorNickname}
                username={topicDetails.authorUsername}
                role={topicDetails.authorRole}
              />
            </div>
            <div className="h-10 w-px bg-neutral-900 hidden md:block" />
            <div className="flex items-center gap-4 text-neutral-600 font-bold text-[11px] uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Eye size={14} /> {topicDetails.viewCount}
              </span>
            </div>
          </div>
          <div className="text-[11px] uppercase tracking-widest text-neutral-700">
            Published:{" "}
            <span className="text-neutral-400 ml-1">
              {getRelativeTime(topicDetails.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <article
        className="prose prose-invert max-w-none 
        text-xl
                prose-p:text-neutral-300 prose-p:text-[1.2rem] md:prose-p:text-[1.35rem] 
                prose-p:leading-[1.85] prose-p:mb-8 
                prose-strong:text-cyan-400 prose-strong:font-bold
                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter
                prose-blockquote:border-l-cyan-500 prose-blockquote:bg-neutral-900/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl"
      >
        <div dangerouslySetInnerHTML={{ __html: topicDetails.content }} />
      </article>

      <div className="mt-16 pt-8 border-t border-neutral-900 flex items-center justify-between gap-8">
        <AuthorBlock
          avatarUrl={topicDetails.authorAvatar}
          nickname={topicDetails.authorNickname}
          username={topicDetails.authorUsername}
          role={topicDetails.authorRole}
        />
        <div className="flex items-center gap-4">
          <div className="px-5 py-3 bg-neutral-900/50 border border-neutral-800 rounded-4xl flex items-center gap-8">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">
                Posts
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <MessageSquare size={16} className="text-cyan-500" />
                <span>{topicDetails.postCount}</span>
              </div>
            </div>
            <div className="h-6 w-px bg-neutral-800" />
            <div>
              <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">
                Last Update
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Clock size={16} className="text-neutral-500" />
                <span className="text-sm">
                  {getRelativeTime(topicDetails.lastPostAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetailsCard;

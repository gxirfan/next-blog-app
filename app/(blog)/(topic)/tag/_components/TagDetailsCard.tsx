"use client";

import { ITagResponse } from "@/app/types/tag";
import { BookOpen, Calendar, Info, Tag } from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";
import { getRelativeTime } from "@/app/utils/date";
import ScrollProgress from "@/app/components/ScrollProgress";
import { ENV } from "@/config/env.config";

interface TagDetailsCardProps {
  tag: ITagResponse;
  topicCount: number;
}

const TagDetailsCard = ({ tag, topicCount }: TagDetailsCardProps) => {
  return (
    <div className="w-full mb-12 animate-in fade-in duration-700">
      <ScrollProgress />
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cyan-500">
          <Info size={14} />
          <span>Tag Overview</span>
        </div>

        <h1 className="text-4xl md:text-6xl sm:text-5xl text-white tracking-tighter leading-tight flex items-center gap-4">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-cyan-500">
            <Tag size={32} strokeWidth={2.5} />
          </div>
          {tag.title}
        </h1>

        <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-3xl font-medium">
          {tag.description ||
            `Discover the latest discussions and ${ENV.POST_TYPE}s in this tag.`}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-neutral-900">
        <div className="flex items-center gap-4">
          <AuthorBlock
            avatarUrl={tag.authorAvatar}
            nickname={tag.authorNickname}
            username={tag.authorUsername}
            role={tag.authorRole}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full">
            <BookOpen size={14} className="text-cyan-500" />
            <span className="text-xs uppercase tracking-widest text-white">
              {topicCount}{" "}
              <span className="text-neutral-500 ml-1">
                {topicCount === 1 ? "Topic" : "Topics"}
              </span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full">
            <Calendar size={14} className="text-neutral-700" />
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">
              {getRelativeTime(tag.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagDetailsCard;

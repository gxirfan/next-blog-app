"use client";

import Link from "next/link";
import { ITopicResponse } from "@/app/types/topic";
import {
  MessageSquare,
  Eye,
  Calendar,
  ChevronRight,
  Clock,
  Tag,
} from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";
import { getRelativeTime } from "@/app/utils/date";

interface TopicListProps {
  topics: ITopicResponse[];
}

const TopicList = ({ topics }: TopicListProps) => {
  if (topics.length === 0) {
    return (
      <div className="p-12 text-center bg-neutral-950 border border-neutral-900 rounded-[2.5rem]">
        <p className="text-neutral-500 text-sm uppercase tracking-widest">
          No topics discovered yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 w-full">
      {topics.map((topic) => {
        return (
          <div
            key={topic.id}
            className="group relative block p-6 md:p-8 bg-neutral-950 border border-neutral-800/80 rounded-[2.5rem] transition-all duration-300 hover:border-cyan-500/30 hover:bg-neutral-900/10"
          >
            {/* Header: Title & Context */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Tag Badge */}
                <Link
                  href={`/tag/${topic.tagSlug}`}
                  className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full hover:border-cyan-500/50 transition-colors group/tag"
                >
                  <Tag size={12} className="text-cyan-500" />
                  <span className="text-xs uppercase tracking-widest text-neutral-500 group-hover/tag:text-cyan-400">
                    {topic.tagTitle}
                  </span>
                </Link>

                <div className="flex items-center gap-2 scale-90 origin-left">
                  <AuthorBlock
                    avatarUrl={topic.authorAvatar}
                    nickname={topic.authorNickname}
                    username={topic.authorUsername}
                    role={topic.authorRole}
                  />
                </div>
              </div>

              <Link href={`/topic/${topic.slug}`} className="block group/title">
                <h3 className="text-2xl md:text-3xl text-white tracking-tighter leading-tight group-hover/title:text-cyan-400 transition-colors">
                  {topic.title}
                </h3>
              </Link>
            </div>

            {/* Content Preview */}
            <div className="mt-4 space-y-4">
              <div
                className="text-neutral-500 text-sm md:text-base leading-relaxed line-clamp-2 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: topic.content }}
              />

              <Link
                href={`/topic/${topic.slug}`}
                className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-[0.2em] text-cyan-500 hover:text-cyan-400 transition-all group/read"
              >
                Explore Topic
                <ChevronRight
                  size={14}
                  className="group-hover/read:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* Footer: Stats & Activity */}
            <div className="mt-8 pt-6 border-t border-neutral-900/50 flex flex-wrap items-center gap-6 text-[11px] font-bold text-neutral-600 uppercase tracking-tight">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-neutral-800" />
                <span>{getRelativeTime(topic.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2 text-cyan-500/80">
                <MessageSquare size={14} />
                <span>{topic.postCount} Posts</span>
              </div>

              <div className="flex items-center gap-2">
                <Eye size={14} />
                <span>{topic.viewCount} Views</span>
              </div>

              {topic.lastPostAt && (
                <div className="hidden sm:flex items-center gap-2 ml-auto text-neutral-700 font-medium lowercase">
                  <Clock size={12} />
                  <span>active {getRelativeTime(topic.lastPostAt)}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopicList;

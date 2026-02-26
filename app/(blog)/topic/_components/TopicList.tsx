"use client";

import Link from "next/link";
import { ITopicResponse } from "@/app/types/topic";
import { MessageSquare, Eye, ChevronRight, Tag } from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";
import { getRelativeTime } from "@/app/utils/date";
import { ENV } from "@/config/env.config";

interface TopicListProps {
  topics: ITopicResponse[];
}

const TopicList = ({ topics }: TopicListProps) => {
  if (topics.length === 0) {
    return (
      <div className="p-12 text-center bg-neutral-950 border border-neutral-900 rounded-[2.5rem]">
        <p className="text-neutral-500 text-sm tracking-widest">
          No topics discovered yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 w-full">
      {topics.map((topic) => {
        return (
          <div
            key={topic.id}
            className="group relative flex flex-col p-6 md:p-10 bg-neutral-950 border border-neutral-900 rounded-[3rem] transition-all duration-300 hover:border-neutral-800"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AuthorBlock
                    avatarUrl={topic.authorAvatar}
                    nickname={topic.authorNickname}
                    username={topic.authorUsername}
                    role={topic.authorRole}
                  />
                  <span className="text-neutral-500">•</span>
                  <span className="hidden sm:block text-xs text-neutral-500 font-medium">
                    {getRelativeTime(topic.createdAt)}
                  </span>
                </div>

                <div className="text-[10px] text-neutral-700 font-bold tracking-widest">
                  Updated {getRelativeTime(topic.lastPostAt)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/tag/${topic.tagSlug}`}
                    className="group/tag flex items-center gap-2 pr-3 pl-1.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-cyan-500/30 rounded-full transition-all duration-300"
                  >
                    <div className="p-1 bg-neutral-800 rounded-full group-hover/tag:bg-cyan-500/10 transition-all">
                      <Tag
                        size={12}
                        className="text-neutral-500 group-hover/tag:text-cyan-500 transition-colors"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-500 group-hover/tag:text-neutral-300 tracking-wider transition-colors">
                      {topic.tagTitle}
                    </span>
                  </Link>
                </div>

                <Link href={`/topic/${topic.slug}`} className="block">
                  <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight hover:text-cyan-400 transition-colors">
                    {topic.title}
                  </h3>
                </Link>
              </div>

              <div
                className="text-neutral-500 text-sm md:text-lg leading-relaxed line-clamp-2"
                dangerouslySetInnerHTML={{ __html: topic.content }}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-6 text-[11px] font-bold text-neutral-500 tracking-widest">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-neutral-500" />
                  <span>
                    {topic.postCount} {ENV.POST_TYPE}s
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-neutral-500" />
                  <span>{topic.viewCount} Views</span>
                </div>
              </div>

              <Link
                href={`/topic/${topic.slug}`}
                className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 font-black text-[11px] tracking-[0.2em] transition-all group/explore"
              >
                Explore
                <ChevronRight
                  size={16}
                  className="group-hover/explore:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopicList;

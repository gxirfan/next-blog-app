"use client";

import Link from "next/link";
import { ITagResponse } from "../../../../types/tag";
import { ChevronRight, Tag } from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";

interface TagCardListProps {
  tags: ITagResponse[];
  accentColor: string;
}

const TagCardList = ({ tags, accentColor }: TagCardListProps) => {
  if (!tags || tags.length === 0) {
    return (
      <div className="p-12 text-center bg-neutral-950 border border-neutral-800 rounded-[2rem]">
        <p className="text-neutral-600 text-sm uppercase tracking-widest">
          No tags discovered yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 w-full">
      {tags.map((tag) => {
        if (!tag.authorUsername || !tag.authorRole) return null;

        return (
          <div
            key={tag.id}
            className="group relative bg-neutral-950 border border-neutral-800/80 rounded-3xl p-5 md:p-7 transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-900/20"
          >
            <div className="flex flex-col gap-6">
              {/* Top Section */}
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex shrink-0 w-12 h-12 items-center justify-center bg-neutral-900 rounded-2xl border border-neutral-800 transition-colors group-hover:border-cyan-500/50">
                  <Tag size={20} className="text-cyan-500" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <Link href={`/tag/${tag.slug}`} className="inline-block">
                    <h3 className="text-xl md:text-2xl text-white tracking-tight group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                      <span className="sm:hidden text-cyan-500">#</span>
                      {tag.title}
                    </h3>
                  </Link>
                  <p className="text-neutral-500 text-sm md:text-base leading-relaxed line-clamp-2">
                    {tag.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-neutral-900">
                <div className="flex items-center gap-3">
                  <div className="scale-90 origin-left">
                    <AuthorBlock
                      avatarUrl={tag.authorAvatar}
                      nickname={tag.authorNickname}
                      username={tag.authorUsername}
                      role={tag.authorRole}
                    />
                  </div>
                </div>

                <Link
                  href={`/tag/${tag.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-neutral-900 border border-neutral-800 hover:bg-white hover:border-white rounded-full transition-all duration-200 group/btn"
                >
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 group-hover/btn:text-black transition-colors duration-200">
                    View Topics
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-neutral-500 group-hover/btn:text-black group-hover/btn:translate-x-1 transition-all duration-200"
                  />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TagCardList;

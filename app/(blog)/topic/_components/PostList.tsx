"use client";

import Link from "next/link";
import { IPostResponse } from "@/app/types/post";
import {
  MessageSquare,
  Eye,
  CornerDownRight,
  ChevronRight,
  FolderOpen,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";
import { prepareContentForImage } from "@/app/types/prepareContentForImage";
import Image from "next/image";
import { getRelativeTime } from "@/app/utils/date";
import { ENV } from "@/config/env.config";

interface PostListProps {
  posts: IPostResponse[];
}

const PostList = ({ posts }: PostListProps) => {
  if (posts.length === 0) {
    return (
      <div className="p-12 text-center bg-neutral-950 border border-neutral-900 rounded-4xl">
        <p className="text-neutral-500 font-medium">
          No {ENV.POST_TYPE}s found yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {posts.map((post) => {
        return (
          <div
            key={post.id}
            className="group relative flex flex-col p-6 md:p-10 bg-neutral-950 border border-neutral-900 rounded-3xl transition-all duration-500 hover:border-cyan-500/30 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-5">
                <div className="flex items-center gap-3">
                  <AuthorBlock
                    avatarUrl={post.authorAvatar}
                    nickname={post.authorNickname}
                    username={post.authorUsername}
                    role={post.authorRole}
                  />
                  <span className="text-neutral-800">•</span>
                  <span className="text-[12px] text-neutral-600 font-medium">
                    {getRelativeTime(post.createdAt)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium">
                    <Link
                      href={`/topic/${post.topicSlug}`}
                      className="group/topic flex items-center gap-2 pr-3 pl-2 py-1 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/10 hover:border-cyan-500/30 rounded-lg transition-all duration-300"
                    >
                      <div className="p-1 bg-cyan-500/20 rounded-md group-hover/topic:bg-cyan-500 group-hover/topic:text-black transition-all">
                        <FolderOpen
                          size={12}
                          className="text-cyan-400 group-hover/topic:text-inherit"
                        />
                      </div>
                      <span className="text-[11px] text-neutral-400 group-hover/topic:text-cyan-400 transition-colors">
                        {post.topicTitle}
                      </span>
                    </Link>

                    {post.parentId && (
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-px bg-neutral-800 rotate-12" />
                        <Link
                          href={`/post/${post.parentSlug}`}
                          className="group/ref flex items-center gap-2 py-1 text-neutral-500 hover:text-neutral-300 transition-all"
                        >
                          <CornerDownRight
                            size={14}
                            className="text-neutral-700 group-hover/ref:text-cyan-500 transition-colors"
                          />
                          <span className="text-[11px] truncate max-w-[150px] italic">
                            {post.parentTitle}
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/post/${post.slug}`}
                    className="block group/title"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-neutral-100 tracking-tight leading-[1.2] group-hover/title:text-cyan-400 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                </div>

                <div
                  className="text-neutral-400 text-sm md:text-base leading-relaxed line-clamp-3 opacity-90 group-hover:opacity-100 transition-opacity"
                  dangerouslySetInnerHTML={{
                    __html: prepareContentForImage(post.content, true),
                  }}
                />
              </div>

              {post.mainImage && (
                <div className="w-full md:w-52 lg:w-72 h-48 md:h-auto relative shrink-0 overflow-hidden rounded-2xl border border-neutral-900 bg-black">
                  <Link href={`/post/${post.slug}`}>
                    <Image
                      src={ENV.API_IMAGE_URL + post.mainImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-900 flex items-center justify-between text-[12px] text-neutral-600 font-medium">
              <div className="flex items-center gap-6">
                {post.score !== 0 && (
                  <div
                    className={`flex items-center gap-1.5 ${post.score > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {post.score > 0 ? (
                      <ArrowBigUp size={14} fill="currentColor" />
                    ) : (
                      <ArrowBigDown size={14} fill="currentColor" />
                    )}
                    <span className="font-mono">{Math.abs(post.score)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 hover:text-cyan-500 transition-colors">
                  <MessageSquare size={14} className="opacity-40" />
                  <span>{post.postCount}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Eye size={14} className="opacity-40" />
                  <span>{post.viewCount}</span>
                </div>
              </div>

              <Link
                href={`/post/${post.slug}`}
                className="flex items-center gap-1 text-cyan-600 hover:text-cyan-400 font-bold tracking-wide transition-all group/read"
              >
                READ ENTRY
                <ChevronRight
                  size={14}
                  className="group-hover/read:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;

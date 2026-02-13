"use client";

import Link from "next/link";
import { IPostResponse } from "@/app/types/post";
import {
  MessageSquare,
  Eye,
  Calendar,
  CornerDownRight,
  ChevronRight,
  Clock,
  FolderOpen,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";
import { prepareContentForImage } from "@/app/types/prepareContentForImage";
import Image from "next/image";
import { getRelativeTime } from "@/app/utils/date";

interface PostListProps {
  posts: IPostResponse[];
}

const PostList = ({ posts }: PostListProps) => {
  if (posts.length === 0) {
    return (
      <div className="p-12 text-center bg-neutral-950 border border-neutral-900 rounded-4xl">
        <p className="text-neutral-500 font-medium">No posts found yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {posts.map((post) => {
        return (
          <div
            key={post.id}
            className="group relative block p-6 md:p-8 bg-neutral-950 border border-neutral-800/50 rounded-4xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-neutral-900/20"
          >
            {/* Header: Title & Context */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-widest text-neutral-500">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 rounded-full border border-neutral-800 font-bold">
                  <FolderOpen size={12} className="text-cyan-500" />
                  <Link
                    href={`/topic/${post.topicSlug}`}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {post.topicTitle}
                  </Link>
                </span>

                {post.parentId && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 rounded-full border border-neutral-800 font-bold">
                    <CornerDownRight size={12} className="text-cyan-500" />
                    <Link
                      href={`/post/${post.parentSlug}`}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {post.parentTitle}
                    </Link>
                  </span>
                )}
              </div>

              <Link href={`/post/${post.slug}`} className="block group/title">
                <h3 className="text-2xl md:text-3xl text-white tracking-tight leading-tight group-hover/title:text-cyan-400 transition-colors">
                  {post.title}
                </h3>
              </Link>

              <div className="flex items-center gap-2">
                <AuthorBlock
                  avatarUrl={post.authorAvatar}
                  nickname={post.authorNickname}
                  username={post.authorUsername}
                  role={post.authorRole}
                />
              </div>
            </div>

            {post.mainImage && (
              <div className="mt-4 relative w-full h-72 shrink-0 overflow-hidden rounded-[1.8rem] bg-neutral-900 border border-neutral-800">
                <Link href={`/post/${post.slug}`}>
                  <Image
                    src={process.env.NEXT_PUBLIC_API_IMAGE_URL + post.mainImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 224px"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-neutral-950/50 to-transparent opacity-60" />
                </Link>
              </div>
            )}

            {/* Content Preview */}
            <div className="mt-6 space-y-4">
              <div
                className="text-neutral-400 text-base md:text-lg leading-relaxed line-clamp-3 prose prose-invert prose-p:my-0 max-w-none"
                dangerouslySetInnerHTML={{
                  __html: prepareContentForImage(post.content, true),
                }}
              />

              <Link
                href={`/post/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-500 hover:text-cyan-400 transition-all pt-2 group/read"
              >
                Read full entry
                <ChevronRight
                  size={16}
                  className="group-hover/read:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* Footer Stats: Updated to be cleaner */}
            <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-wrap items-center gap-6 text-[11px] font-bold text-neutral-500 uppercase tracking-tight">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-neutral-700" />
                <span>{getRelativeTime(post.createdAt)}</span>
              </div>

              {/* Vote Scores with simple style */}
              {post.score !== 0 && (
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 ${
                    post.score > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {post.score > 0 ? (
                    <ArrowBigUp size={14} fill="currentColor" />
                  ) : (
                    <ArrowBigDown size={14} fill="currentColor" />
                  )}
                  <span>{post.score > 0 ? `+${post.score}` : post.score}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-cyan-500/80">
                <MessageSquare size={14} />
                <span>{post.postCount} Replies</span>
              </div>

              <div className="flex items-center gap-2">
                <Eye size={14} />
                <span>{post.viewCount} Views</span>
              </div>

              {post.lastPostAt && (
                <div className="hidden sm:flex items-center gap-2 ml-auto text-neutral-600 font-medium">
                  <Clock size={12} />
                  <span>Activity: {getRelativeTime(post.lastPostAt)}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;

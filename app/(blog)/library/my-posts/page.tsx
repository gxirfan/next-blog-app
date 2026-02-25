import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  MessageSquareOff,
  ArrowRight,
  Eye,
} from "lucide-react";
import PaginationControls from "@/app/components/PaginationControls";
import { IBaseResponse } from "@/app/types/common";
import { getRelativeTime } from "@/app/utils/date";
import { ENV } from "@/config/env.config";
import { getRequiredAuthSession } from "@/app/services/session";

export const metadata: Metadata = {
  title: `My ${ENV.POST_TYPE}s | Content Library`,
};

interface MyPostsPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

async function getMyPosts(
  page: number = 1,
  limit: number = 10,
): Promise<IBaseResponse<any>> {
  const headersList = await cookies();
  const res = await fetch(
    `${ENV.API_URL}/posts/all/library/my-posts?page=${page}&limit=${limit}`,
    {
      cache: "no-store",
      headers: {
        Cookie: headersList.toString(),
      },
    },
  );
  if (!res.ok)
    return {
      success: false,
      data: { data: [], meta: null },
    } as IBaseResponse<any>;
  return await res.json();
}

export default async function MyPostsPage({ searchParams }: MyPostsPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const limit = parseInt(resolvedParams.limit || "10");

  const response = await getMyPosts(page, limit);
  const posts = response?.data?.data || [];
  const meta = response?.data?.meta;

  const getStatusStyles = (status: boolean) => {
    return status
      ? {
          icon: CheckCircle,
          text: "Active",
          color: "text-green-500/80",
          bg: "bg-green-500/5 border-green-500/10",
        }
      : {
          icon: Clock,
          text: "Draft",
          color: "text-yellow-500/80",
          bg: "bg-yellow-500/5 border-yellow-500/10",
        };
  };

  await getRequiredAuthSession("/library/my-posts");
  return (
    <div className="mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      {/* 1. HEADER SECTION - Solid & Balanced */}
      <div className="border-b-2 border-neutral-900 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-neutral-900 border-2 border-neutral-800 rounded-3xl flex items-center justify-center text-cyan-500">
                <MessageSquare size={28} />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
              My <span className="text-neutral-800">{ENV.POST_TYPE}s</span>
            </h1>
            <div className="flex items-center gap-4 px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-neutral-600 tracking-[0.3em]">
                  Total Shared:
                </span>
                <span className="text-[11px] font-black text-white tracking-widest bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                  {meta?.total || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. POST LIST - High Contrast & Human Language */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          <>
            {posts.map((post: any) => {
              const status = getStatusStyles(post.status);
              return (
                <div
                  key={post.id}
                  className="group relative p-8 md:p-10 bg-neutral-950 border-2 border-neutral-900 rounded-[3rem] hover:border-neutral-700 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-10"
                >
                  <div className="flex-1 min-w-0 space-y-6">
                    {/* Status & Date Row */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`px-4 py-1.5 rounded-full border-2 ${status.bg} border-opacity-20 flex items-center gap-2`}
                      >
                        <span
                          className={`text-[10px] font-black tracking-widest ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-neutral-700 tracking-[0.2em]">
                        {getRelativeTime(post.createdAt) || "N/A"}
                      </span>
                    </div>

                    {/* Title - Bold & Large */}
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-2xl md:text-3xl font-black text-white hover:text-cyan-500 transition-colors block leading-tight tracking-tighter"
                    >
                      {post.title}
                    </Link>

                    {/* Info Tags */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
                        <span className="text-[10px] font-black text-neutral-600 tracking-widest">
                          Topic:
                        </span>
                        <span className="text-[10px] font-black text-neutral-300">
                          {post.topicTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
                        <Eye size={14} className="text-neutral-600" />
                        <span className="text-[10px] font-black text-neutral-400 tracking-widest">
                          {post.viewCount} Views
                        </span>
                      </div>

                      {post.parentId && (
                        <div className="px-4 py-2 border-2 border-dashed border-neutral-900 rounded-full text-[10px] font-black text-neutral-700 tracking-widest">
                          Reply Post
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 w-full md:w-auto pt-8 md:pt-0 border-t-2 md:border-t-0 border-neutral-900">
                    <Link
                      href={`/post/${post.slug}`}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-neutral-900 border-2 border-neutral-800 rounded-full text-[12px] font-black tracking-[0.2em] text-neutral-400 hover:text-white hover:border-white transition-all active:scale-95"
                    >
                      View Detail
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}

            {meta && meta.totalPages > 1 && (
              <div className="pt-16 flex justify-center">
                <PaginationControls meta={meta} />
              </div>
            )}
          </>
        ) : (
          /* EMPTY STATE - Samimi Dil */
          <div className="flex flex-col items-center justify-center py-32 bg-neutral-950 border-2 border-dashed border-neutral-900 rounded-[4rem]">
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-8 border-2 border-neutral-800">
              <MessageSquareOff size={32} className="text-neutral-700" />
            </div>
            <p className="text-neutral-500 font-black tracking-[0.3em] text-[11px] mb-10 text-center px-6">
              You haven't shared any {ENV.POST_TYPE}s yet.
            </p>
            <Link
              href="/topic/all"
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full text-[12px] font-black tracking-[0.2em] hover:bg-cyan-500 transition-all active:scale-95"
            >
              Create Your First Post
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

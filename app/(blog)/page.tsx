import { IPostResponse } from "@/app/types/post";
import { IBaseResponse, IMeta } from "@/app/types/common";
import PostList from "@/app/(blog)/topic/_components/PostList";
import PaginationControls from "@/app/components/PaginationControls";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Layers,
  Tag,
  Zap,
  Compass,
  Users,
} from "lucide-react";
import { ENV } from "@/config/env.config";
import { cookies } from "next/headers";
import { getCurrentUser } from "../services/session";

async function fetchPosts(
  page: number,
  limit: number,
  tab: string = "explore",
): Promise<IBaseResponse<{ data: IPostResponse[]; meta: IMeta }>> {
  const headersList = await cookies();
  const cookieHeader = headersList.toString();

  try {
    const endpoint = tab === "following" ? "all/following" : "all/view-count";
    const url = `${ENV.API_URL}/posts/${endpoint}?page=${page}&limit=${limit}`;

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
        success: false,
        message: "Failed to fetch posts",
        statusCode: response.status,
      };
    }
    return await response.json();
  } catch (error) {
    return {
      data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
      success: false,
      message: "Server error",
      statusCode: 500,
    };
  }
}

export default async function blogHomePage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string; tab?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const activeTab = params.tab || "explore";

  const postsData = await fetchPosts(page, limit, activeTab);
  const currentUser = await getCurrentUser();
  const posts: IPostResponse[] = postsData.data.data || [];
  const meta = postsData.data.meta;

  return (
    <div className="mx-auto space-y-8">
      <div className="flex flex-col mb-12 relative border-b border-neutral-900 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full mb-6">
              <Flame size={12} className="text-orange-500" />
              <span className="text-[10px] font-black text-neutral-500 tracking-[0.2em]">
                {activeTab === "following" ? "Personalized" : "Trending"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.95] mb-6">
              {activeTab === "following" ? "Your Feed" : "Featured"}{" "}
              <span className="text-neutral-500">{ENV.POST_TYPE}s</span>
            </h1>

            <p className="text-neutral-500 text-sm md:text-base max-w-xl leading-relaxed font-bold tracking-tight">
              {activeTab === "following"
                ? "The latest content from authors you follow, organized by time."
                : `The most popular ${ENV.POST_TYPE}s across the network, ranked by live activity.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/stream"
              className="group relative flex items-center justify-between gap-6 px-8 py-4 bg-cyan-500 text-black rounded-2xl font-black text-sm tracking-[0.2em] transition-all duration-300 hover:bg-white active:scale-95 overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] opacity-70 mb-1 tracking-widest">
                    Join the
                  </span>
                  <span className="text-lg">STREAM</span>
                </div>
              </div>
              <div className="relative z-10 p-2 bg-black/10 rounded-xl group-hover:bg-black group-hover:text-white transition-all duration-300">
                <Zap
                  size={20}
                  className="fill-current group-hover:rotate-12 transition-transform"
                />
              </div>
              <div className="absolute top-0 -right-0 w-12 h-full bg-white/20 skew-x-20 group-hover:translate-x-[-150%] transition-transform duration-700 pointer-events-none" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/post/all"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black text-md tracking-[0.2em] transition-all hover:bg-neutral-200 active:scale-95"
          >
            <span>Latest {ENV.POST_TYPE}s</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="/topic/all"
            className="group flex items-center justify-between p-4 bg-neutral-950 border border-neutral-900 rounded-2xl hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 group-hover:text-white transition-all">
                <Layers size={18} />
              </div>
              <span className="text-sm font-black text-neutral-400 tracking-tighter group-hover:text-white transition-colors">
                Browse Topics
              </span>
            </div>
            <ArrowRight
              size={18}
              className="text-neutral-800 group-hover:text-white transition-all"
            />
          </Link>
          <Link
            href="/tag/all"
            className="group flex items-center justify-between p-4 bg-neutral-950 border border-neutral-900 rounded-2xl hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 group-hover:text-white transition-all">
                <Tag size={18} />
              </div>
              <span className="text-sm font-black text-neutral-400 tracking-tighter group-hover:text-white transition-colors">
                Explore Tags
              </span>
            </div>
            <ArrowRight
              size={18}
              className="text-neutral-800 group-hover:text-white transition-all"
            />
          </Link>
        </div>
        {currentUser && (
          <div className="flex items-center gap-1 p-1 bg-black border border-neutral-900 rounded-2xl w-fit group/tabs">
            {/* EXPLORE TAB */}
            <Link
              href="/?tab=explore"
              scroll={false}
              className={`relative flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 ${
                activeTab === "explore"
                  ? "bg-cyan-500 text-black"
                  : "text-neutral-400 hover:text-neutral-300 hover:bg-neutral-900/50"
              }`}
            >
              <Compass
                size={14}
                strokeWidth={activeTab === "explore" ? 3 : 2}
                className="transition-transform duration-500 group-hover/tabs:rotate-12"
              />
              <span className="uppercase">EXPLORE</span>
            </Link>

            {/* FOLLOWING TAB */}
            <Link
              href="/?tab=following"
              scroll={false}
              className={`relative flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 ${
                activeTab === "following"
                  ? "bg-cyan-500 text-black"
                  : "text-neutral-400 hover:text-neutral-300 hover:bg-neutral-900/50"
              }`}
            >
              <Users
                size={14}
                strokeWidth={activeTab === "following" ? 3 : 2}
              />
              <span className="uppercase">FOLLOWING</span>
            </Link>
          </div>
        )}
      </div>

      {posts && posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <div className="text-center py-20 px-10 bg-neutral-950 border border-dashed border-neutral-900 rounded-[2.5rem]">
          <p className="text-neutral-600 font-bold tracking-tight text-lg">
            {activeTab === "following"
              ? "You aren't following anyone yet or they haven't posted."
              : "No posts found in this category."}
          </p>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="pt-4">
          <PaginationControls meta={meta} />
        </div>
      )}
    </div>
  );
}

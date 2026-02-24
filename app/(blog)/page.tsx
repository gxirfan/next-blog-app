import { IPostResponse } from "@/app/types/post";
import { IBaseResponse, IMeta } from "@/app/types/common";
import PostList from "@/app/(blog)/topic/_components/PostList";
import PaginationControls from "@/app/components/PaginationControls";
import Link from "next/link";
import { ArrowRight, Flame, Layers, Tag, Zap } from "lucide-react";
import { ENV } from "@/config/env.config";

async function fetchPosts(
  page: number,
  limit: number,
): Promise<IBaseResponse<{ data: IPostResponse[]; meta: IMeta }>> {
  try {
    const url = `${ENV.API_URL}/posts/all/view-count?page=${page}&limit=${limit}`;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      console.error(`Posts could not be loaded: ${response.status}`);
      return {
        data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
        success: false,
        message: "Failed to fetch posts",
        statusCode: 500,
      };
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Server error:", error);
    return {
      data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
      success: false,
      message: "Failed to fetch posts",
      statusCode: 500,
    };
  }
}

export default async function blogHomePage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const params = await searchParams;
  const pageString = params.page;
  const limitString = params.limit;

  const postsData = await fetchPosts(
    Number(pageString) || 1,
    Number(limitString) || 10,
  );

  const postsDataResult = postsData.data.data;
  const posts: IPostResponse[] = postsDataResult || [];
  const meta = postsData.data.meta;

  return (
    <div className="mx-auto space-y-8 ">
      <div className="flex flex-col mb-16 relative">
        <div className="max-w-4xl mb-16 relative">
          <div className="flex items-center gap-6 mb-8">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-neutral-900/50 border border-neutral-800 rounded-full transition-all duration-300 hover:border-neutral-700 group/trending">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 transition-colors group-hover/trending:bg-orange-500/20">
                <Flame
                  size={12}
                  className="text-orange-500/80 group-hover/trending:text-orange-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-20"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500/60"></span>
                </div>

                <span className="text-[11px] font-bold text-neutral-500 group-hover/trending:text-neutral-300 transition-colors tracking-wide uppercase">
                  Trending Entries
                </span>
              </div>
            </div>
            <div className="h-px flex-1 bg-neutral-900" />{" "}
            {/* Decorative axis line
            <span className="hidden md:block text-[9px] font-mono text-neutral-700 uppercase tracking-widest">
              Status: Real_Time_Indexing
            </span> */}
          </div>

          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] font-urbanist">
              Featured <br />
              <span className="text-neutral-800 outline-text group-hover:text-neutral-700 transition-colors duration-500">
                {ENV.POST_TYPE}s
              </span>
            </h1>
            {/* Background Identifier (Subtle text) */}
            <span className="absolute -top-4 -left-2 text-[60px] font-black text-white/2 select-none pointer-events-none uppercase">
              Featured {ENV.POST_TYPE}s
            </span>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="text-neutral-500 text-lg md:text-xl max-w-xl leading-relaxed font-medium font-inter">
              The most popular {ENV.POST_TYPE}s across the network, ranked by
              live{" "}
              <span className="text-neutral-300 border-b border-neutral-800">
                reader activity
              </span>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 mb-12">
          <Link
            href="/post/all"
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-cyan-400 active:scale-95"
          >
            <span>Browse Latest {ENV.POST_TYPE}s</span>

            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <Link
            href="/stream"
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-neutral-900 border-2 border-neutral-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:border-cyan-500/50 active:scale-95"
          >
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <Zap
              size={20}
              className="text-cyan-500 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"
            />

            <span className="relative z-10">
              Join the {ENV.SOCIAL_POST_TYPE}
            </span>

            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-cyan-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Link>
        </div>

        <div className="mt-16 pt-12 border-t border-neutral-900/60">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
            <span className="text-[10px] font-black font-jetbrains-mono text-neutral-600 uppercase tracking-[0.3em]">
              Discover
            </span>
            <div className="h-px flex-1 bg-neutral-900/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/topic/all"
              className="group flex items-center justify-between p-5 bg-neutral-950 border border-neutral-900 rounded-4xl hover:bg-neutral-900/30 hover:border-neutral-800 transition-all duration-300 active:scale-[0.98]"
            >
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 group-hover:text-blue-500 group-hover:border-blue-500/30 transition-all duration-500">
                  <Layers size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-0.5">
                    Browse
                  </span>
                  <span className="text-[15px] font-black text-neutral-300 uppercase tracking-tight font-urbanist group-hover:text-white transition-colors">
                    Latest Topics
                  </span>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-neutral-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300"
              />
            </Link>

            <Link
              href="/tag/all"
              className="group flex items-center justify-between p-5 bg-neutral-950 border border-neutral-900 rounded-4xl hover:bg-neutral-900/30 hover:border-neutral-800 transition-all duration-300 active:scale-[0.98]"
            >
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 group-hover:text-cyan-500 group-hover:border-cyan-500/30 transition-all duration-500">
                  <Tag size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-0.5">
                    Explore
                  </span>
                  <span className="text-[15px] font-black text-neutral-300 uppercase tracking-tight font-urbanist group-hover:text-white transition-colors">
                    Latest Tags
                  </span>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-neutral-800 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-300"
              />
            </Link>
          </div>
        </div>
      </div>

      {posts && posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <div className="text-center p-10 text-neutral-500">No posts found.</div>
      )}

      {meta && (
        <div className="pt-4">
          <PaginationControls meta={meta} />
        </div>
      )}
    </div>
  );
}

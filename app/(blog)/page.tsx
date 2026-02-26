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
        <div className="max-w-4xl mb-12 relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full transition-all hover:border-orange-500/50 group/trending">
              <Flame size={14} className="text-orange-500" />
              <span className="text-[11px] font-black text-neutral-500 group-hover/trending:text-white transition-colors tracking-widest">
                Trending
              </span>
            </div>
            <div className="h-px flex-1 bg-neutral-900" />
          </div>

          <div className="relative">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">
              Featured <br />
              <span className="text-neutral-800">{ENV.POST_TYPE}s</span>
            </h1>
          </div>

          <div className="mt-8">
            <p className="text-neutral-500 text-lg md:text-xl max-w-xl leading-relaxed font-bold tracking-tight">
              The most popular {ENV.POST_TYPE}s across the network, ranked by
              live
              <span className="text-white ml-2 underline underline-offset-4 decoration-neutral-800">
                reader activity.
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 mb-16">
          <Link
            href="/post/all"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black text-xs tracking-[0.2em] transition-all hover:bg-cyan-500 uppercase active:scale-95"
          >
            <span>Browse {ENV.POST_TYPE}s</span>
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <Link
            href="/stream"
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-neutral-900 border-2 border-neutral-800 text-white rounded-full font-black text-xs tracking-[0.2em] transition-all duration-500 hover:border-cyan-500 hover:text-cyan-400 active:scale-95 uppercase overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-cyan-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[loading-slide_2s_infinite_ease-in-out] transition-opacity duration-500 pointer-events-none" />

            <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
              <Zap
                size={18}
                className="text-cyan-500 fill-cyan-500/10 group-hover:scale-125 group-hover:rotate-12 group-hover:fill-cyan-500 transition-all duration-300"
              />
            </div>

            <span className="relative z-10 tracking-[0.3em]">Join Stream</span>

            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-cyan-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Link>
        </div>

        <div className="mt-12 pt-10 border-t border-neutral-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/topic/all"
              className="group flex items-center justify-between p-6 bg-neutral-950 border border-neutral-900 rounded-[2.5rem] hover:border-neutral-700 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 group-hover:text-white transition-all">
                  <Layers size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-neutral-600 tracking-widest mb-0.5">
                    Browse
                  </span>
                  <span className="text-lg font-black text-neutral-400 tracking-tighter group-hover:text-white transition-colors">
                    Latest Topics
                  </span>
                </div>
              </div>
              <ArrowRight
                size={20}
                className="text-neutral-800 group-hover:text-white transition-all"
              />
            </Link>

            <Link
              href="/tag/all"
              className="group flex items-center justify-between p-6 bg-neutral-950 border border-neutral-900 rounded-[2.5rem] hover:border-neutral-700 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 group-hover:text-white transition-all">
                  <Tag size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-neutral-600 tracking-widest mb-0.5">
                    Explore
                  </span>
                  <span className="text-lg font-black text-neutral-400 tracking-tighter group-hover:text-white transition-colors">
                    Latest Tags
                  </span>
                </div>
              </div>
              <ArrowRight
                size={20}
                className="text-neutral-800 group-hover:text-white transition-all"
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

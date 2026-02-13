import { IPostResponse } from "@/app/types/post";
import { IBaseResponse, IMeta } from "@/app/types/common";
import PostList from "@/app/(blog)/topic/_components/PostList";
import PaginationControls from "@/app/components/PaginationControls";
import Link from "next/link";
import { ArrowRight, BookOpen, Flame, Tag, Zap } from "lucide-react";

async function fetchPosts(
  page: number,
  limit: number,
): Promise<IBaseResponse<{ data: IPostResponse[]; meta: IMeta }>> {
  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

  try {
    const url = `${API_URL}/posts/all/view-count?page=${page}&limit=${limit}`;

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

// async function fetchTopics(page: number, limit: number): Promise<IBaseResponse<{data: ITopicResponse[], meta: IMeta}>> {
//     const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
//     try {
//         const url = `${API_BASE_URL}/topics/all?page=${page}&limit=${limit}`;

//         const response = await fetch(url, { next: { revalidate: 60 } });

//         if (!response.ok) {
//             console.error(`Failed to fetch topics: ${response.status}`);
//             return { data: {data: [], meta: { total: 0, page, limit, totalPages: 0 }}, success: false, message: "Failed to fetch topics", statusCode: 500 };
//         }

//         const result = await response.json();
//         console.log(result.data.meta);
//         return result || { data: {data: [], meta: { total: 0, page, limit, totalPages: 0 }}, success: false, message: "Failed to fetch topics", statusCode: 500 };

//     } catch (error) {
//         console.error("Topic fetching error:", error);
//         return { data: {data: [], meta: { total: 0, page, limit, totalPages: 0 }}, success: false, message: "Failed to fetch topics", statusCode: 500 };
//     }
// }

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
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-4 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full w-max">
            <Flame size={14} className="text-red-500 animate-pulse" />

            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 font-bold">
              Network Peak Velocity
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
            Most Viewed <br />
            <span className="text-neutral-600">Insights</span>
          </h1>

          <p className="text-neutral-500 text-lg md:text-xl mt-6 max-w-xl leading-relaxed font-medium">
            The most accessed data nodes across the global network, indexed by
            real-time <span className="text-neutral-300">engagement logs</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 mb-12">
          <Link
            href="/post/all"
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-cyan-400 active:scale-95"
          >
            <span>Browse All Posts</span>

            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <Link
            href="/flow"
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-neutral-900 border-2 border-neutral-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:border-cyan-500/50 active:scale-95"
          >
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <Zap
              size={20}
              className="text-cyan-500 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"
            />

            <span className="relative z-10">Join the Flow</span>

            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-cyan-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Link>
        </div>

        <div className="flex flex-col gap-6 pt-10 border-t border-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-cyan-900" />

            <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-[0.4em]">
              System Discovery
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/tag/all"
              className="group flex items-center gap-5 p-4 rounded-4xl bg-neutral-950 border border-neutral-900 transition-all hover:border-cyan-500/30"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 group-hover:text-cyan-400 transition-all">
                <Tag size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-1">
                  Explore
                </span>
                <span className="text-sm font-black text-neutral-300 uppercase tracking-tight group-hover:text-white">
                  Latest Tags
                </span>
              </div>
              <ArrowRight
                size={16}
                className="ml-auto mr-2 text-neutral-800 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all"
              />
            </Link>

            {/* Topic Discovery */}
            <Link
              href="/topic/all"
              className="group flex items-center gap-5 p-4 rounded-4xl bg-neutral-950 border border-neutral-900 transition-all hover:border-cyan-500/30"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 group-hover:text-cyan-400 transition-all">
                <BookOpen size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-1">
                  Browse
                </span>
                <span className="text-sm font-black text-neutral-300 uppercase tracking-tight group-hover:text-white">
                  Latest Topics
                </span>
              </div>
              <ArrowRight
                size={16}
                className="ml-auto mr-2 text-neutral-800 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all"
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

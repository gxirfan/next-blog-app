import PostList from "../../topic/_components/PostList";
import PaginationControls from "@/app/components/PaginationControls";
import { IBaseResponse, IMeta } from "@/app/types/common";
import { IPostResponse } from "@/app/types/post";
import { ENV } from "@/config/env.config";
import { ArrowUpRight } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

async function fetchUserPosts(
  username: string,
  page: number,
  limit: number,
): Promise<IBaseResponse<{ data: IPostResponse[]; meta: IMeta }> | null> {
  const headersList = await cookies();
  const cookieHeader = headersList.toString();

  try {
    const url = `${ENV.API_URL}/posts/all/username/${username}?page=${page}&limit=${limit}`;
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) return null;
    if (!response.ok)
      throw new Error(`Failed to fetch ${ENV.POST_TYPE}s: ${response.status}`);

    const result = await response.json();
    return result as IBaseResponse<{ data: IPostResponse[]; meta: IMeta }>;
  } catch (error) {
    console.error(`${ENV.POST_TYPE}s fetching error: ${error}`);
    return null;
  }
}

interface PostsSectionProps {
  username: string;
  page: number;
  limit: number;
  nickname: string;
}

export default async function PostsSection({
  username,
  page,
  limit,
  nickname,
}: PostsSectionProps) {
  const userPosts = await fetchUserPosts(username, page, limit);

  const postList = userPosts?.data.data || [];
  const meta = userPosts?.data.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  return (
    <div className="min-h-[400px]">
      <div className="flex items-end justify-between border-b border-neutral-900 pb-4 mb-8">
        <div>
          <h2 className="text-2xl text-white tracking-tighter  font-bold font-urbanist">
            Latest <span className="capitalize">{ENV.POST_TYPE}s</span> by{" "}
            <span className="text-cyan-500">{nickname}</span>
          </h2>
        </div>

        <Link
          href={`/user/${username}/threads`}
          className="
    flex items-center gap-3 px-4 py-2 
    bg-neutral-900/50 border border-neutral-900 rounded-xl
    text-neutral-400 font-jetbrains-mono text-[11px] font-black uppercase tracking-widest
    hover:bg-neutral-900 hover:border-neutral-700 hover:text-white
    transition-all duration-300 active:scale-95 group
  "
        >
          <span>View All Threads</span>

          <div className="flex items-center gap-2 border-l border-neutral-900 pl-3 group-hover:border-neutral-700 transition-colors">
            <ArrowUpRight
              size={14}
              className="text-neutral-600 group-hover:text-cyan-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </Link>
      </div>

      <PostList posts={postList} />

      {meta && meta.totalPages > 1 && (
        <div className="pt-8 flex justify-center border-t border-neutral-900 mt-8">
          <PaginationControls meta={meta} />
        </div>
      )}
    </div>
  );
}

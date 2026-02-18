import PostList from "../../topic/_components/PostList";
import PaginationControls from "@/app/components/PaginationControls";
import { IBaseResponse, IMeta } from "@/app/types/common";
import { IPostResponse } from "@/app/types/post";
import { ENV } from "@/config/env.config";
import { headers } from "next/headers";

async function fetchUserPosts(
  username: string,
  page: number,
  limit: number,
): Promise<IBaseResponse<{ data: IPostResponse[]; meta: IMeta }> | null> {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

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
      throw new Error(`Failed to fetch posts: ${response.status}`);

    const result = await response.json();
    return result as IBaseResponse<{ data: IPostResponse[]; meta: IMeta }>;
  } catch (error) {
    console.error(`Post fetching error: ${error}`);
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
      <h2 className="text-2xl text-white border-b border-neutral-700 pb-3 mb-6">
        Latest Posts by @{nickname}
      </h2>

      <PostList posts={postList} />

      {meta && meta.totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <PaginationControls meta={meta} />
        </div>
      )}
    </div>
  );
}

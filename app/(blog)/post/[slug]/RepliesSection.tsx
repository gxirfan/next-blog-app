import { IBaseResponse, IMeta } from "@/app/types/common";
import { IPostResponse } from "@/app/types/post";
import { MessageSquare } from "lucide-react";
import PostList from "../../topic/_components/PostList";
import PaginationControls from "@/app/components/PaginationControls";
import { ENV } from "@/config/env.config";

async function fetchLevel2Posts(
  parentId: string,
  page: number,
  limit: number,
): Promise<IBaseResponse<{ data: IPostResponse[]; meta: IMeta }>> {
  try {
    const url = `${ENV.API_URL}/posts/all/parent/${parentId}?page=${page}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch level 2 posts: ${response.status}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Level 2 Post error:", error);
    return {
      success: false,
      message: "Failed to fetch level 2 posts",
      statusCode: 500,
      data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } },
    };
  }
}

export async function RepliesSection({
  parentId,
  page,
  limit,
}: {
  parentId: string;
  page: number;
  limit: number;
}) {
  const replies = await fetchLevel2Posts(parentId, page, limit);
  const repliesData = replies.data.data;
  const meta = replies.data.meta;

  return (
    <>
      <h2 className="text-2xl font-bold text-white mt-8 border-b border-neutral-700 pb-2 flex items-center space-x-2">
        <MessageSquare size={24} className="text-cyan-400" />
        <span>Replies ({meta.total})</span>
      </h2>

      <PostList posts={repliesData} />

      {meta && meta.totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <PaginationControls meta={meta} />
        </div>
      )}
    </>
  );
}

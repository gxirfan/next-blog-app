import { IPostResponse } from "@/app/types/post";
import { IBaseResponse, IMeta } from "@/app/types/common";
import PostList from "../_components/PostList";
import PaginationControls from "@/app/components/PaginationControls";
import { ENV } from "@/config/env.config";

async function fetchTopicPosts(
  topicId: string,
  page: number,
  limit: number,
): Promise<IBaseResponse<{ data: IPostResponse[]; meta: IMeta }>> {
  try {
    const url = `${ENV.API_URL}/posts/all/topic/${topicId}?page=${page}&limit=${limit}`;
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch topic ${ENV.POST_TYPE}s: ${response.status}`,
      );
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Topic ${ENV.POST_TYPE}s fetching error: ${error}`);
    return {
      success: false,
      message: `Failed to fetch topic ${ENV.POST_TYPE}s`,
      statusCode: 500,
      data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
    };
  }
}

interface TopicPostsSectionProps {
  topicId: string;
  page: number;
  limit: number;
}

export default async function TopicPostsSection({
  topicId,
  page,
  limit,
}: TopicPostsSectionProps) {
  const topicPostsData = await fetchTopicPosts(topicId, page, limit);
  const topicPosts = topicPostsData.data.data;
  const meta = topicPostsData.data.meta;

  return (
    <>
      <h2 className="text-xl font-bold text-white mb-4 border-b border-neutral-700 pb-2">
        {ENV.POST_TYPE}s ({meta.total})
      </h2>

      <PostList posts={topicPosts || []} />

      {meta && (
        <div className="pt-4">
          <PaginationControls meta={meta} />
        </div>
      )}
    </>
  );
}

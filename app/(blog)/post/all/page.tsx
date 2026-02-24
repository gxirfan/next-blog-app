import { IPostResponse } from "@/app/types/post";
import PostList from "../../topic/_components/PostList";
import { IBaseResponse, IMeta } from "@/app/types/common";
import AllPostsHeader from "../_components/AllPostsHeader";
import AllPostsFooter from "../_components/AllPostsFooter";
import { ENV } from "@/config/env.config";

async function fetchPosts(
  page: number,
  limit: number,
): Promise<IBaseResponse<{ data: IPostResponse[]; meta: IMeta }>> {
  try {
    const url = `${ENV.API_URL}/posts/all?page=${page}&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status}`);
      return {
        data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
        success: false,
        message: "Failed to fetch posts",
        statusCode: 500,
      };
    }

    const result = await response.json();
    return (
      result || {
        data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
        success: false,
        message: "Failed to fetch posts",
        statusCode: 500,
      }
    );
  } catch (error) {
    console.error("Post fetching error:", error);
    return {
      data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
      success: false,
      message: "Failed to fetch posts",
      statusCode: 500,
    };
  }
}

export const generateMetadata = async ({
  params,
}: {
  params: { page?: string; limit?: string };
}) => {
  const paramsData = await params;
  const currentPage = Number(paramsData.page) || 1;
  const currentLimit = Number(paramsData.limit) || 10;

  const postsData = await fetchPosts(currentPage, currentLimit);
  const postsDataResult = postsData.data.data;
  const posts: IPostResponse[] = postsDataResult || [];
  const meta = postsData.data.meta;
  if (!posts || !meta) {
    return {
      title: "Latest Posts",
      description: "Latest Posts",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  return {
    title: "Latest Posts",
    description: "Latest Posts",
    robots: {
      index: true,
      follow: true,
    },
  };
};

export default async function PostAllPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentLimit = Number(params.limit) || 10;

  const postsData = await fetchPosts(currentPage, currentLimit);
  const posts = postsData.data.data || [];
  const meta = postsData.data.meta;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-12">
      <AllPostsHeader totalRecords={meta?.total || 0} />

      <main className="min-h-[60vh]">
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-neutral-900 rounded-[3rem]">
            <span className="text-neutral-700 font-mono text-sm uppercase tracking-widest">
              No entries found in this sector.
            </span>
          </div>
        )}
      </main>

      <AllPostsFooter meta={meta} />
    </div>
  );
}

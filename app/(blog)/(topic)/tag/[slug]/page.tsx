import TagDetailsCard from "../_components/TagDetailsCard";
import TopicList from "../../../topic/_components/TopicList";
import { IBaseResponse, IMeta } from "@/app/types/common";
import TopicCreationWrapper from "../_components/TopicCreationWrapper";
import { ITopicResponse } from "@/app/types/topic";
import { ITagResponse } from "@/app/types/tag";
import PaginationControls from "@/app/components/PaginationControls";
import TagManagementActions from "../_components/TagManagementActions";
import { ENV } from "@/config/env.config";
import { cookies } from "next/headers";

async function fetchTagDetails(
  slug: string,
): Promise<IBaseResponse<ITagResponse> | null> {
  const cookie = await cookies();
  try {
    const url = `${ENV.API_URL}/tags/${slug}`;
    const response = await fetch(url, {
      headers: { Cookie: cookie.toString() },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
}
async function fetchTopicsByTagId(
  tagId: number,
  page: number,
  limit: number,
): Promise<IBaseResponse<{ data: ITopicResponse[]; meta: IMeta }>> {
  const cookie = await cookies();
  try {
    const url = `${ENV.API_URL}/topics/all/${tagId}?page=${page}&limit=${limit}`;
    const response = await fetch(url, {
      headers: { Cookie: cookie.toString() },
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
      success: false,
      message: "Error",
      statusCode: 500,
    };
  }
}

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const paramsData = await params;
  const tagSlug = await paramsData.slug;

  const tagDetails = await fetchTagDetails(tagSlug);

  if (!tagDetails || !tagDetails.data) {
    return {
      title: "Tag not found",
      description: "Tag not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${tagDetails.data.title}`,
    description: tagDetails.data.description,
    robots: {
      index: true,
      follow: true,
    },
  };
};

export default async function TagTopicsPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string; limit?: string };
}) {
  const tagSlugData = await params;
  const tagSlug = await tagSlugData.slug;
  const searchParamData = await searchParams;
  const pageString = await searchParamData.page;
  const limitString = await searchParamData.limit;

  const currentPage = Number(pageString) || 1;
  const currentLimit = Number(limitString) || 10;

  const tagDetails = await fetchTagDetails(tagSlug);

  if (!tagDetails || !tagDetails.data) {
    return <div>Tags not found.</div>;
  }

  const topicsData = await fetchTopicsByTagId(
    tagDetails.data.id,
    currentPage,
    currentLimit,
  );
  const topics: ITopicResponse[] = topicsData.data.data || [];
  const meta: IMeta = topicsData.data.meta || {
    total: 0,
    page: currentPage,
    limit: currentLimit,
    totalPages: 0,
  };

  return (
    <div className="mx-auto space-y-8 ">
      <TagManagementActions tag={tagDetails.data} />
      <TagDetailsCard tag={tagDetails.data} topicCount={meta.total} />

      <div className="flex justify-between items-center w-full border-b border-gray-700 pb-2 pt-4">
        <h2 className="text-2xl font-bold text-neutral-200">
          {meta.total} {meta.total === 1 ? "Topic" : "Topics"}
        </h2>
        <TopicCreationWrapper
          tagId={tagDetails.data.id}
          tagTitle={tagDetails.data.title}
        />
      </div>

      <TopicList topics={topics} />

      {meta && (
        <div className="pt-4">
          <PaginationControls meta={meta} />
        </div>
      )}
    </div>
  );
}

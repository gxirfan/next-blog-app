import { ITopicResponse } from "@/app/types/topic";
import { IBaseResponse, IMeta } from "@/app/types/common";
import TopicList from "../_components/TopicList";
import PaginationControls from "@/app/components/PaginationControls";
import AllTopicsHeader from "../_components/AllTopicsHeader";
import AllTopicsFooter from "../_components/AllTopicsFooter";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

interface TopicListResponse {
  data: ITopicResponse[];
  meta: IMeta;
}

async function fetchTopics(
  page: number,
  limit: number,
): Promise<IBaseResponse<TopicListResponse>> {
  try {
    const url = `${API_BASE_URL}/topics/all?page=${page}&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch topics: ${response.status}`);
      return {
        data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
        success: false,
        message: "Failed to fetch topics",
        statusCode: 500,
      };
    }

    const result = await response.json();
    return (
      result || {
        data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
        success: false,
        message: "Failed to fetch topics",
        statusCode: 500,
      }
    );
  } catch (error) {
    console.error("Topic fetching error:", error);
    return {
      data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
      success: false,
      message: "Failed to fetch topics",
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
  const topicsData = await fetchTopics(
    Number(paramsData.page) || 1,
    Number(paramsData.limit) || 10,
  );

  if (!topicsData) {
    return {
      title: "All Topics",
      description: "All topics",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: "All Topics",
    description: "All topics",
    robots: {
      index: true,
      follow: true,
    },
  };
};

export default async function TopicAllPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentLimit = Number(params.limit) || 10;

  const topicsData = await fetchTopics(currentPage, currentLimit);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-16">
      {/* Section Header: Provides context and statistical metadata */}
      <AllTopicsHeader totalTopics={topicsData.data.meta.total || 0} />

      {/* Main Grid: Displays the list of topics or an empty state */}
      <main className="min-h-[50vh]">
        {topicsData.data.data.length > 0 ? (
          <TopicList topics={topicsData.data.data} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-neutral-900 rounded-[3rem] bg-neutral-900/5">
            <span className="text-neutral-700 font-mono text-xs uppercase tracking-[0.5em] font-black">
              Zero_Topics_Detected_In_Current_Quadrant
            </span>
          </div>
        )}
      </main>

      {/* Footer Controls: Pagination for multi-page data sets */}
      <AllTopicsFooter meta={topicsData.data.meta} />
    </div>
  );
}

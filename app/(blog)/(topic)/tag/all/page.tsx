import TagCardList from "@/app/(blog)/(topic)/tag/_components/TagCardList";
import { ITagResponse } from "@/app/types/tag";
import { IBaseResponse, IMeta } from "@/app/types/common";
import AllTagsHeader from "../_components/AllTagsHeader";
import AllTagsFooter from "../_components/AllTagsFooter";
import CreateTagCard from "../_components/CreateTagCard";

async function fetchTags(
  page: number,
  limit: number,
): Promise<IBaseResponse<{ data: ITagResponse[]; meta: IMeta }>> {
  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

  try {
    const url = `${API_URL}/tags/all?page=${page}&limit=${limit}`;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      console.error(`Tags could not be loaded: ${response.status}`);
      return {
        data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
        success: false,
        message: "Failed to fetch tags",
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
      message: "Failed to fetch tags",
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

  const tagsData = await fetchTags(currentPage, currentLimit);
  const tagsDataResult = tagsData.data.data;
  const tags: ITagResponse[] = tagsDataResult || [];
  const meta = tagsData.data.meta;
  if (!tags || !meta) {
    return {
      title: "All Tags",
      description: "All Tags",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  return {
    title: "All Tags",
    description: "All Tags",
    robots: {
      index: true,
      follow: true,
    },
  };
};

export default async function TagAllPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const params = await searchParams;
  const pageString = params.page;
  const limitString = params.limit;

  const tagsData = await fetchTags(
    Number(pageString) || 1,
    Number(limitString) || 10,
  );

  const tagsDataResult = tagsData.data.data;
  const tags: ITagResponse[] = tagsDataResult || [];
  const meta = tagsData.data.meta;

  const ACCENT_COLOR = "text-[#00bcd4]";

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-16">
      {/* Visual Identity: Renders the system name and tag stats */}
      <AllTagsHeader totalTags={meta?.total || 0} />
      <CreateTagCard />

      {/* Main Registry Display */}
      <main className="min-h-[50vh]">
        {tags.length > 0 ? (
          <TagCardList tags={tags} accentColor={ACCENT_COLOR} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-neutral-900 rounded-[3rem] bg-neutral-900/5">
            <span className="text-neutral-700 font-mono text-[10px] uppercase tracking-[0.5em] font-black">
              Empty_Registry: No_Tags_Available
            </span>
          </div>
        )}
      </main>

      {/* Pagination Module: Controls the data flow per page */}
      <AllTagsFooter meta={meta} />
    </div>
  );
}

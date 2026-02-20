import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { IBaseResponse, IMeta } from "@/app/types/common";
import { IFlow } from "@/app/types/flow";
import FlowReplySection from "./_components/FlowReplySection";
import FlowDetailClient from "./_components/FlowDetailClient";
import PaginationControls from "@/app/components/PaginationControls";
import { ENV } from "@/config/env.config";

// --- Fetchers ---

async function getFlowDetail(
  slug: string,
): Promise<IBaseResponse<IFlow> | null> {
  const headersList = await cookies();

  try {
    const res = await fetch(`${ENV.API_URL}/flow/${slug}`, {
      cache: "no-store",
      headers: { Cookie: headersList.toString() },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json : null;
  } catch (e) {
    console.error("Error fetching flow detail:", e);
    return null;
  }
}

async function getReplies(
  slug: string,
  page: number,
): Promise<IBaseResponse<{ data: IFlow[]; meta: IMeta }>> {
  const headersList = await cookies();

  try {
    const res = await fetch(
      `${ENV.API_URL}/flow/${slug}/replies?page=${page}&limit=10`,
      {
        cache: "no-store",
        headers: { Cookie: headersList.toString() },
      },
    );

    if (!res.ok)
      return {
        success: false,
        message: "Failed to fetch replies",
        statusCode: res.status,
        data: {
          data: [],
          meta: { total: 0, page: 0, limit: 0, totalPages: 0 },
        },
      };
    const json = await res.json();

    if (json.success && json.data && Array.isArray(json.data.data)) {
      return {
        success: true,
        message: "Success.",
        statusCode: 200,
        data: { data: json.data.data, meta: json.data.meta },
      };
    }
    return {
      success: false,
      message: "Failed to fetch replies",
      statusCode: 500,
      data: { data: [], meta: { total: 0, page: 0, limit: 0, totalPages: 0 } },
    };
  } catch (e) {
    console.error("Replies fetch error:", e);
    return {
      success: false,
      message: "Failed to fetch replies",
      statusCode: 500,
      data: { data: [], meta: { total: 0, page: 0, limit: 0, totalPages: 0 } },
    };
  }
}

export default async function FlowDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const pageNum = isNaN(parseInt(page || "1", 10))
    ? 1
    : parseInt(page || "1", 10);

  const [flowRes, replies] = await Promise.all([
    getFlowDetail(slug),
    getReplies(slug, pageNum),
  ]);

  if (!flowRes || !flowRes.data) {
    return notFound();
  }

  const mainFlow = flowRes.data;
  return (
    <>
      {/* <div className="sticky top-0 bg-neutral-950/80 backdrop-blur-md z-20 px-4 py-3 flex items-center border-b border-neutral-800">
        <Link
          href="/flow"
          className="mr-4 p-2 hover:bg-neutral-900 rounded-full transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="text-neutral-400 group-hover:text-white"
          />
        </Link>
        <h1 className="text-lg font-bold text-white">Flow Detail</h1>
      </div> */}

      <div className="p-4 pb-20">
        <FlowDetailClient mainFlow={mainFlow} />

        <FlowReplySection
          mainFlow={mainFlow}
          initialReplies={replies.data.data}
        />
      </div>
      <PaginationControls meta={replies.data.meta} />
    </>
  );
}

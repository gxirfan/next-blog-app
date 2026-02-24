import { Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import PaginationControls from "@/app/components/PaginationControls";
import { IBaseResponse } from "@/app/types/common";
import { IFlow } from "@/app/types/flow";
import { IPaginationResponse } from "@/app/types/pagination-response";
import FlowFeed from "./_components/FlowFeed";
import { ENV } from "@/config/env.config";

async function getFlows(
  page: number,
  limit: number,
): Promise<IBaseResponse<IPaginationResponse<IFlow>>> {
  const headersList = await cookies();

  try {
    const res = await fetch(`${ENV.API_URL}/flow?page=${page}&limit=${limit}`, {
      cache: "no-store",
      headers: { Cookie: headersList.toString() },
    });

    if (!res.ok) {
      return {
        data: {
          data: [],
          meta: { total: 0, page: 0, limit: 0, totalPages: 0 },
        },
        message: "Failed to fetch stream.",
        success: false,
        statusCode: res.status,
      };
    }
    return await res.json();
  } catch (error) {
    console.error("Fetch stream error:", error);
    return {
      data: { data: [], meta: { total: 0, page: 0, limit: 0, totalPages: 0 } },
      message: "Network error",
      success: false,
      statusCode: 500,
    };
  }
}

interface FlowPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function FlowPage({ searchParams }: FlowPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 50;

  const flowsResponse = await getFlows(page, limit);
  const flows = flowsResponse.data?.data || [];
  const meta = flowsResponse.data?.meta;

  return (
    <div className="container mx-auto">
      <div className="flex items-center space-x-2 mb-6 px-2">
        <Sparkles className="text-cyan-400" size={24} />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          The Stream
        </h1>
      </div>

      <FlowFeed initialFlows={flows} />

      {meta && meta.totalPages > 1 && (
        <div className="mt-8">
          <PaginationControls meta={meta} />
        </div>
      )}
    </div>
  );
}

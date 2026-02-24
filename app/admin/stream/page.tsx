import { cookies } from "next/headers";
import FlowHeader from "./_components/FlowHeader";
import FlowTableClient from "./_components/FlowTableClient";
import FlowFooter from "./_components/FlowFooter";
import { IBaseResponse } from "@/app/types/common";
import { IPaginationResponse } from "@/app/types/pagination-response";
import { IFlow } from "@/app/types/flow";
import { ENV } from "@/config/env.config";

async function fetchFlows(
  page: number = 1,
  limit: number = 10,
): Promise<IBaseResponse<IPaginationResponse<IFlow>>> {
  const headerList = await cookies();
  const cookie = headerList.toString();

  try {
    const response = await fetch(
      `${ENV.API_URL}/admin/get-flow-posts?page=${page}&limit=${limit}`,
      {
        headers: {
          Cookie: cookie,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok)
      return {
        success: false,
        message: "Failed to fetch threads",
        statusCode: response.status,
        data: {
          data: [],
          meta: { total: 0, page: 0, limit: 0, totalPages: 0 },
        },
      };
    const result = await response.json();
    return result;
  } catch {
    return {
      success: false,
      message: "Failed to fetch threads",
      statusCode: 500,
      data: { data: [], meta: { total: 0, page: 0, limit: 0, totalPages: 0 } },
    };
  }
}

export default async function AdminFlowPage({
  searchParams,
}: {
  searchParams: { page: string; limit: string };
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const flowResponse = await fetchFlows(page, limit); // IPaginationResponse<IFlow>
  const hasData =
    Array.isArray(flowResponse?.data?.data) &&
    flowResponse.data.data.length > 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <FlowHeader count={flowResponse?.data?.meta?.total || 0} />

      {!hasData ? (
        <div className="py-32 text-center border border-neutral-900 rounded-[2.5rem]">
          <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.4em]">
            No Threads Detected In Stream
          </p>
        </div>
      ) : (
        <FlowTableClient paginationData={flowResponse} />
      )}
      <FlowFooter />
    </div>
  );
}

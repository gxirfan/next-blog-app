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
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000 px-6 py-10">
      <FlowHeader count={flowResponse?.data?.meta?.total || 0} />

      <div className="min-h-[500px]">
        {!hasData ? (
          <div className="bg-neutral-950 border-2 border-neutral-900 py-48 text-center rounded-[3rem]">
            <div className="space-y-6">
              <p className="text-neutral-800 text-[11px] font-black tracking-[0.6em]">
                Inventory Empty
              </p>
              <p className="text-neutral-500 text-sm font-bold tracking-widest max-w-xs mx-auto leading-relaxed">
                There are currently no active threads recorded in the archive.
              </p>
            </div>
          </div>
        ) : (
          <FlowTableClient paginationData={flowResponse} />
        )}
      </div>

      <FlowFooter />
    </div>
  );
}

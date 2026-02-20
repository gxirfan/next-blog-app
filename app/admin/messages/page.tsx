import { IBaseResponse } from "@/app/types/common";
import MessageTableClient from "./_components/MessageTableClient";
import { cookies } from "next/headers";
import { IPaginationResponse } from "@/app/types/pagination-response";
import { IContactResponse } from "@/app/types/contact-response";
import { ENV } from "@/config/env.config";

async function fetchMessages(
  page: number,
  limit: number,
): Promise<IBaseResponse<IPaginationResponse<IContactResponse>>> {
  // Note: Ensure you handle authentication cookies/headers here if needed
  const headerList = await cookies();
  const cookie = headerList.toString();
  const response = await fetch(
    `${ENV.API_URL}/admin/get-contacts?page=${page}&limit=${limit}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookie,
        Accept: "application/json",
      },
    },
  );
  const result = await response.json();
  return result; // This returns the IPaginationResponse object
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentLimit = Number(params.limit) || 10;

  const paginationData = await fetchMessages(currentPage, currentLimit);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
          Contact_Logs{" "}
          <span className="text-neutral-600 font-light">Archive</span>
        </h1>
        <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-[0.3em]">
          Total_Signals_Detected: {paginationData?.data?.meta?.total || 0}
        </p>
      </header>

      {/* Reusable Client Table Component */}
      <MessageTableClient paginationData={paginationData} />
    </div>
  );
}

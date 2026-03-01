import { IBaseResponse } from "@/app/types/common";
import MessageTableClient from "./_components/MessageTableClient";
import { cookies } from "next/headers";
import { IPaginationResponse } from "@/app/types/pagination-response";
import { IContactResponse } from "@/app/types/contact-response";
import { ENV } from "@/config/env.config";
import { Activity, Database, Mail } from "lucide-react";

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
    <div className="space-y-16 animate-in fade-in duration-1000 px-4 md:px-0">
      {/* 1. HEADER SECTION: Archive Authority */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b-4 border-neutral-950 pb-14">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-neutral-800 font-black text-[10px] tracking-[0.5em]">
            <Database size={16} strokeWidth={3} />
            Communication Registry Control
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none select-none">
            Contact <span className="text-neutral-900">Archive</span>
          </h1>

          <p className="text-sm font-bold text-neutral-600 max-w-sm tracking-wide leading-relaxed">
            Management of incoming signals and structural communication logs.
          </p>
        </div>

        {/* Stats Badge */}
        <div className="bg-neutral-950 border-4 border-neutral-900 flex items-center gap-8 px-10 py-6 rounded-[2.5rem]">
          <div className="text-right space-y-2 leading-none">
            <p className="text-[10px] text-neutral-700 font-black tracking-[0.3em]">
              Total Messages
            </p>
            <p className="text-4xl font-black text-white tracking-tighter">
              {(paginationData?.data?.meta?.total || 0).toString()}
            </p>
          </div>
          <div className="h-12 w-1 bg-neutral-900 rounded-full" />
          <div className="p-4 bg-neutral-900 rounded-2xl border-2 border-neutral-800 text-white/10">
            <Mail size={32} strokeWidth={2.5} />
          </div>
        </div>
      </header>

      {/* 2. CONTENT SECTION */}
      <div className="min-h-[500px]">
        <MessageTableClient paginationData={paginationData} />
      </div>

      {/* 3. FOOTER */}
      <footer className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t-4 border-neutral-950 px-6">
        <div className="flex items-center gap-4 text-[10px] font-black text-neutral-800 tracking-[0.5em]">
          <Activity size={16} strokeWidth={3} />
          <span>{ENV.PROJECT_NAME} LOGISTICS ARCHIVE</span>
        </div>
        <div className="text-[10px] font-black text-neutral-900 border-l-2 border-neutral-950 pl-6 tracking-widest">
          Secure Admin Session Active
        </div>
      </footer>
    </div>
  );
}

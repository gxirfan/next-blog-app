"use client";

import {
  Eye,
  User,
  Clock,
  Share2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { IFlow } from "@/app/types/flow";
import { IPaginationResponse } from "@/app/types/pagination-response";
import PaginationControls from "@/app/components/PaginationControls";
import Link from "next/link";
import { IBaseResponse } from "@/app/types/common";
import { getRelativeTime } from "@/app/utils/date";

interface FlowTableProps {
  paginationData: IBaseResponse<IPaginationResponse<IFlow>>;
}

export default function FlowTableClient({ paginationData }: FlowTableProps) {
  const flows = Array.isArray(paginationData?.data?.data)
    ? paginationData.data.data
    : [];
  const meta = paginationData?.data?.meta;
  const ACTION_BUTTON_STYLE =
    "p-4 bg-neutral-900 border-2 border-neutral-800 text-neutral-500 hover:text-white hover:border-white rounded-2xl transition-all active:scale-95 group/btn";

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-2">
      {/* 1. DATA GRID */}
      <div className="border-2 border-neutral-900 rounded-[3rem] overflow-hidden bg-neutral-950 overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-neutral-950 text-neutral-700 text-[10px] font-black tracking-[0.3em]">
              <th className="px-10 py-7 border-b-2 border-neutral-900 w-[45%]">
                Archive Origin
              </th>
              <th className="px-10 py-7 border-b-2 border-neutral-900 w-[30%] text-center">
                Engagement
              </th>
              <th className="px-10 py-7 border-b-2 border-neutral-900 text-right w-[25%]">
                System Protocol
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-900">
            {flows.map((flow: any) => (
              <tr
                key={String(flow.id)}
                className="group hover:bg-neutral-900/40 transition-all duration-300"
              >
                {/* Content & Author */}
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center text-white group-hover:border-white transition-all duration-500">
                      <Share2 size={22} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <p className="text-base font-black text-white tracking-tighter truncate leading-none group-hover:pl-1 transition-all">
                        {flow.content}
                      </p>
                      <div className="flex items-center gap-3 font-bold text-[10px] text-neutral-600 tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-neutral-800" />
                          <span>@{flow.author?.username || "anonymous"}</span>
                        </div>
                        {flow.parentId && (
                          <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-900 text-[8px] text-neutral-400 font-black rounded-md">
                            REPLY_NODE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Engagement */}
                <td className="px-10 py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-white font-black text-lg tracking-tighter">
                      <MessageSquare size={16} className="text-neutral-700" />
                      {flow.replyCount || 0}
                    </div>
                    <div className="text-[9px] tracking-[0.2em] text-neutral-800 font-black">
                      Total Responses
                    </div>
                  </div>
                </td>

                {/* Protocol */}
                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-8">
                    <div className="text-right space-y-1">
                      <div className="flex items-center justify-end text-[10px] font-black text-neutral-500 tracking-widest">
                        <Clock size={12} className="mr-2 text-neutral-800" />
                        {getRelativeTime(flow.createdAt)}
                      </div>
                      <div className="flex items-center justify-end gap-1.5 text-[9px] font-black text-emerald-600/60 tracking-widest">
                        <ShieldCheck size={10} />
                        Verified
                      </div>
                    </div>
                    <Link
                      href={`/board/${flow.slug}`}
                      className={ACTION_BUTTON_STYLE}
                    >
                      <Eye size={20} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. PAGINATION */}
      {meta && (
        <div className="pt-4 opacity-80 group-hover:opacity-100 transition-opacity">
          <PaginationControls meta={meta} />
        </div>
      )}
    </div>
  );
}

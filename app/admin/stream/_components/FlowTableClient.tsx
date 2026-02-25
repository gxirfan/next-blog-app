"use client";

import { Eye, User, Clock, Share2, MessageSquare } from "lucide-react";
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
    "p-2.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40 rounded-xl transition-all active:scale-90";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Table Container */}
      <div className="border border-neutral-900 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left border-separate border-spacing-0 table-fixed">
          <thead>
            <tr className="bg-neutral-900/30 text-neutral-500 text-[10px] tracking-[0.2em] font-black">
              <th className="px-8 py-5 border-b border-neutral-800/50 w-[45%] font-black">
                Stream Origin
              </th>
              <th className="px-8 py-5 border-b border-neutral-800/50 w-[30%] text-center font-black">
                Metrics
              </th>
              <th className="px-8 py-5 border-b border-neutral-800/50 text-right w-[25%] font-black">
                Protocol
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/40">
            {flows.map((flow) => (
              <tr
                key={String(flow.id)}
                className="group hover:bg-white/1.5 transition-all duration-300"
              >
                {/* Content & Author */}
                <td className="px-8 py-7">
                  <div className="flex items-center gap-5">
                    <div className="h-11 w-11 shrink-0 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-500/50 group-hover:border-cyan-500/40 group-hover:text-cyan-400 transition-all duration-500">
                      <Share2 size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-neutral-200 tracking-tight truncate leading-none">
                        {flow.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-neutral-400">
                        <User size={10} className="text-neutral-600" />
                        <span className="truncate">
                          @{flow.author?.username || "unknown_node"}
                        </span>
                        {flow.parentId && (
                          <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-[8px] text-cyan-400 font-black rounded">
                            Reply
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Metrics */}
                <td className="px-8 py-7 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-2 text-neutral-200 font-mono text-[11px] font-black">
                      <MessageSquare size={12} className="text-cyan-500/60" />
                      {flow.replyCount || 0}
                    </div>
                    <div className="text-[9px] tracking-widest text-neutral-600 font-black">
                      Interaction_Level
                    </div>
                  </div>
                </td>

                {/* Telemetry */}
                <td className="px-8 py-7 text-right">
                  <div className="flex items-center justify-end gap-6">
                    <div className="text-right">
                      <div className="flex items-center justify-end text-[10px] font-mono text-neutral-300 font-black mb-1">
                        <Clock size={11} className="mr-1.5 text-neutral-600" />
                        {getRelativeTime(flow.createdAt) || "Unknown"}
                      </div>
                      <p className="text-[9px] font-black text-cyan-500/40 tracking-tighter">
                        Data_Verified
                      </p>
                    </div>
                    <Link
                      href={`/board/${flow.slug}`}
                      className={ACTION_BUTTON_STYLE}
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && <PaginationControls meta={meta} />}
    </div>
  );
}

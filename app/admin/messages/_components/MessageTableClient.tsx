"use client";

import React from "react";
import { Mail, User, Clock, Eye, Trash2, CheckCircle2 } from "lucide-react";
import { IPaginationResponse } from "@/app/types/pagination-response";
import PaginationControls from "@/app/components/PaginationControls";
import Link from "next/link";
import { IBaseResponse } from "@/app/types/common";
import { IContactResponse } from "@/app/types/contact-response";
import { getRelativeTime } from "@/app/utils/date";

interface MessageTableProps {
  paginationData: IBaseResponse<IPaginationResponse<IContactResponse>>;
}

export default function MessageTableClient({
  paginationData,
}: MessageTableProps) {
  // Ensure we have an array to map over, even if the data is undefined
  const messages = paginationData?.data?.data || [];
  const meta = paginationData?.data?.meta;

  const ACTION_BUTTON_STYLE =
    "p-2.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40 rounded-xl transition-all active:scale-90";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Container with sharp terminal aesthetics */}
      <div className="bg-[#0d0d0d] border border-neutral-900 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left border-separate border-spacing-0 table-fixed">
          <thead>
            <tr className="bg-neutral-900/30 text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-black">
              <th className="px-8 py-5 border-b border-neutral-800/50 w-[40%] font-black">
                Source_Signal
              </th>
              <th className="px-8 py-5 border-b border-neutral-800/50 w-[35%] font-black">
                Subject_Protocol
              </th>
              <th className="px-8 py-5 border-b border-neutral-800/50 text-right w-[25%] font-black">
                Telemetry
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/40">
            {messages.map((message) => (
              <tr
                key={message.id}
                className={`group transition-all duration-300 ${
                  !message.isRead ? "bg-cyan-500/[0.02]" : "hover:bg-white/1.5"
                }`}
              >
                {/* Sender Details */}
                <td className="px-8 py-7">
                  <div className="flex items-center gap-5">
                    <div
                      className={`h-11 w-11 shrink-0 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                        !message.isRead
                          ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : "bg-neutral-900 border-neutral-800 text-neutral-500"
                      }`}
                    >
                      <User size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-neutral-200 uppercase tracking-tight truncate leading-none">
                        {message.name}
                      </p>
                      <p className="mt-2 font-mono text-[10px] text-neutral-500 truncate">
                        {message.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Subject and Status */}
                <td className="px-8 py-7">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      {!message.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                      )}
                      <p
                        className={`text-[11px] font-black uppercase tracking-tighter truncate ${
                          !message.isRead ? "text-cyan-400" : "text-neutral-400"
                        }`}
                      >
                        {message.subject}
                      </p>
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-neutral-600 font-bold">
                      {message.isRead ? "Signal_Processed" : "Awaiting_Review"}
                    </div>
                  </div>
                </td>

                {/* Date and Actions */}
                <td className="px-8 py-7 text-right">
                  <div className="flex items-center justify-end gap-6">
                    <div className="text-right hidden md:block">
                      <div className="flex items-center justify-end text-[10px] font-mono text-neutral-400 font-black mb-1">
                        <Clock size={11} className="mr-1.5 text-neutral-700" />
                        {getRelativeTime(message.createdAt) || "Unknown"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/messages/${message.slug}`}
                        className={ACTION_BUTTON_STYLE}
                        title="View Message"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination component with metadata */}
      {meta && <PaginationControls meta={meta} />}
    </div>
  );
}

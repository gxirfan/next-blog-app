"use client";

import { useState } from "react";
import { User, Clock, Eye, Search, Mail } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const messages = paginationData?.data?.data || [];
  const meta = paginationData?.data?.meta;

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* 1. TOP BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="relative w-full md:w-96 group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-white transition-colors"
          />
          <input
            type="text"
            placeholder="SEARCH MESSAGES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-neutral-950 border-2 border-neutral-900 rounded-2xl text-[11px] font-black tracking-[0.2em] text-white placeholder-neutral-800 focus:outline-none focus:border-neutral-700 transition-all"
          />
        </div>

        <div className="flex items-center gap-4 text-[10px] font-black text-neutral-600 tracking-widest">
          <span>Total Records:</span>
          <span className="text-white bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">
            {meta?.total || 0}
          </span>
        </div>
      </div>

      {/* 2. TABLE */}
      <div className="border-2 border-neutral-900 rounded-[3rem] overflow-hidden bg-neutral-950">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-neutral-950 text-neutral-500">
              <th className="px-10 py-6 border-b-2 border-neutral-900 text-[10px] font-black tracking-[0.3em] w-[40%]">
                Sender Identity
              </th>
              <th className="px-10 py-6 border-b-2 border-neutral-900 text-[10px] font-black tracking-[0.3em] w-[35%]">
                Subject
              </th>
              <th className="px-10 py-6 border-b-2 border-neutral-900 text-[10px] font-black tracking-[0.3em] text-right w-[25%]">
                Timeline
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-900">
            {filteredMessages.map((message) => (
              <tr
                key={message.id}
                className={`group transition-all duration-300 hover:bg-neutral-900/40 ${
                  !message.isRead ? "bg-white/[0.02]" : ""
                }`}
              >
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div
                      className={`h-14 w-14 shrink-0 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                        !message.isRead
                          ? "bg-white text-black border-white"
                          : "bg-neutral-900 text-neutral-600 border-neutral-800"
                      }`}
                    >
                      <User size={22} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-base font-black text-white tracking-tight truncate leading-none">
                        {message.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-bold tracking-wider">
                        <Mail size={12} />
                        {message.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-10 py-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {!message.isRead && (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                      )}
                      <p
                        className={`text-sm font-black tracking-tight truncate ${
                          !message.isRead ? "text-white" : "text-neutral-500"
                        }`}
                      >
                        {message.subject}
                      </p>
                    </div>
                    <p className="text-[9px] font-black tracking-[0.2em] text-neutral-700">
                      {message.isRead ? "Archived" : "New Entry"}
                    </p>
                  </div>
                </td>

                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-8">
                    <div className="hidden md:flex flex-col items-end gap-1">
                      <div className="flex items-center text-[10px] font-black text-neutral-500 tracking-widest">
                        <Clock size={12} className="mr-2 text-neutral-800" />
                        {getRelativeTime(message.createdAt)}
                      </div>
                    </div>

                    <Link
                      href={`/admin/messages/${message.slug}`}
                      className="p-4 bg-neutral-900 border-2 border-neutral-800 text-neutral-500 hover:text-white hover:border-white rounded-2xl transition-all active:scale-90 group/btn flex items-center gap-2"
                    >
                      <Eye size={18} />
                      <span className="hidden lg:inline text-[9px] font-black tracking-widest ml-1">
                        View
                      </span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-6 border-t-2 border-neutral-900">
        {meta && <PaginationControls meta={meta} />}
      </div>
    </div>
  );
}

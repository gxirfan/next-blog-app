"use client";

import React from "react";
import { Mail, Clock, User, MessageSquare, ShieldCheck } from "lucide-react";
import { IContactResponse } from "@/app/types/contact-response";
import { IBaseResponse } from "@/app/types/common";
import { getRelativeTime } from "@/app/utils/date";

/**
 * A minimalist, data-focused view for contact message analysis.
 * Removes heavy decorative elements to prioritize readability.
 */
export default function MessageDetailClient({
  message,
}: {
  message: IBaseResponse<IContactResponse>;
}) {
  const { data: msg } = message;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-900 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[9px] font-mono font-black text-cyan-500 tracking-[0.3em]">
            <ShieldCheck size={12} /> Signal_Verified
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {msg.subject}
          </h1>
        </div>

        <div
          className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] font-bold tracking-widest ${
            msg.isRead
              ? "bg-neutral-900/50 border-neutral-800 text-neutral-600"
              : "bg-cyan-500/5 border-cyan-500/20 text-cyan-500"
          }`}
        >
          {msg.isRead ? "PROCESSED" : "UNREAD_STREAM"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4">
          <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 space-y-6">
            <p className="text-[9px] font-mono text-neutral-700 tracking-widest font-black">
              // Source_Metadata
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-neutral-600">
                  <User size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-500 font-bold tracking-tighter">
                    Sender
                  </p>
                  <p className="text-sm text-neutral-200 font-semibold truncate">
                    {msg.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-neutral-600">
                  <Mail size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-500 font-bold tracking-tighter">
                    Address
                  </p>
                  <p className="text-sm text-neutral-200 font-mono truncate">
                    {msg.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-neutral-600">
                  <Clock size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-500 font-bold tracking-tighter">
                    Timestamp
                  </p>
                  <p className="text-sm text-neutral-200 font-mono">
                    {getRelativeTime(msg.createdAt) || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-8">
          <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-8 md:p-10 min-h-[300px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-[9px] font-mono text-neutral-700 tracking-[0.3em] font-black">
              <MessageSquare size={12} /> Payload_Data
            </div>

            <div className="flex-1 text-neutral-400 text-base leading-relaxed font-medium whitespace-pre-wrap selection:bg-cyan-500/30">
              {msg.message}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-900/50 text-[9px] font-mono text-neutral-800 tracking-widest">
              End_of_Signal_Log
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

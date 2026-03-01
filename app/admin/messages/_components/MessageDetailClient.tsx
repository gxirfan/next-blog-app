"use client";

import { useState } from "react";
import { Mail, Clock, User, MessageSquare, ShieldCheck } from "lucide-react";
import { IContactResponse } from "@/app/types/contact-response";
import { IBaseResponse } from "@/app/types/common";
import { getRelativeTime } from "@/app/utils/date";

export default function MessageDetailClient({
  message,
}: {
  message: IBaseResponse<IContactResponse>;
}) {
  const { data: msg } = message;
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 px-6 py-10">
      {/* 2. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-neutral-950 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-neutral-600 tracking-[0.3em]">
            <ShieldCheck size={14} />
            Security Verified
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
            {msg.subject}
          </h1>
        </div>

        <div
          className={`px-6 py-2 rounded-full border-2 font-black text-[10px] tracking-[0.2em] ${
            msg.isRead
              ? "border-neutral-900 text-neutral-600"
              : "border-white text-white"
          }`}
        >
          {msg.isRead ? "Processed" : "New Message"}
        </div>
      </div>

      {/* 3. CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-950 border-2 border-neutral-900 rounded-[2rem] p-8 space-y-8">
            <h2 className="text-[10px] font-black text-neutral-700 tracking-[0.3em] border-b border-neutral-900 pb-4">
              Sender Details
            </h2>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-900 rounded-xl text-neutral-500">
                  <User size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-neutral-700 font-black tracking-widest">
                    Full Name
                  </p>
                  <p className="text-base text-white font-bold truncate">
                    {msg.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-900 rounded-xl text-neutral-500">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-neutral-700 font-black tracking-widest">
                    Email Address
                  </p>
                  <p className="text-sm text-neutral-300 font-bold truncate">
                    {msg.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-900 rounded-xl text-neutral-500">
                  <Clock size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-neutral-700 font-black tracking-widest">
                    Received At
                  </p>
                  <p className="text-sm text-neutral-300 font-bold">
                    {getRelativeTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="lg:col-span-8">
          <div className="bg-neutral-950 border-2 border-neutral-900 rounded-[2.5rem] p-8 md:p-12 min-h-[400px] flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-10 text-[10px] font-black text-neutral-700 tracking-[0.3em]">
              <MessageSquare size={16} />
              Message Content
            </div>

            <div className="flex-1 text-neutral-200 text-lg md:text-xl leading-relaxed font-bold tracking-tight whitespace-pre-wrap selection:bg-white selection:text-black">
              {msg.message}
            </div>

            <div className="mt-12 pt-6 border-t-2 border-neutral-900 text-[9px] font-black text-neutral-800 tracking-[0.4em]">
              Archive Reference: {msg.id}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

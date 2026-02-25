"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, User, Layers, Search } from "lucide-react";
import { ITopicResponse } from "@/app/types/topic";
import { getRelativeTime } from "@/app/utils/date";

export default function TopicTableClient({
  topics,
}: {
  topics: ITopicResponse[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.authorUsername.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative group max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
          size={16}
        />
        <input
          type="text"
          placeholder="Filter data nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-neutral-800/60 rounded-2xl pl-12 pr-6 py-3 text-sm text-neutral-200 focus:border-cyan-500/40 focus:outline-none transition-all placeholder:text-neutral-700"
        />
      </div>

      {filteredTopics.length === 0 ? (
        <div className="border border-neutral-900 py-20 text-center rounded-4xl">
          <p className="text-neutral-600 text-xs font-mono tracking-widest font-bold">
            Null_Search_Results
          </p>
        </div>
      ) : (
        <div className="border border-neutral-900 rounded-4xl overflow-hidden">
          <table className="w-full text-left border-separate border-spacing-0 table-fixed">
            <thead>
              <tr className="bg-neutral-900/30 text-neutral-600 text-[10px] tracking-widest font-black">
                <th className="px-6 py-4 border-b border-neutral-800/50 w-[45%]">
                  Resource
                </th>
                <th className="px-6 py-4 border-b border-neutral-800/50 w-[30%] text-center">
                  Attributes
                </th>
                <th className="px-6 py-4 border-b border-neutral-800/50 text-right w-[25%]">
                  Access
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/40">
              {filteredTopics.map((topic) => (
                <tr
                  key={topic.id}
                  className="group hover:bg-white/[0.015] transition-all duration-200"
                >
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-500">
                        <Layers size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-neutral-200 truncate group-hover:text-cyan-400 tracking-tight">
                          {topic.title}
                        </div>
                        <div className="text-[10px] text-neutral-600 font-mono flex items-center gap-1.5 mt-0.5">
                          <User size={10} className="opacity-50" />
                          <span className="truncate">
                            @{topic.authorUsername}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black bg-cyan-500/5 border border-cyan-500/20 text-cyan-400/80 tracking-widest">
                        {topic.tagTitle}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-1 w-1 rounded-full ${topic.status ? "bg-emerald-500" : "bg-neutral-800"}`}
                        />
                        <span
                          className={`text-[9px] font-bold ${topic.status ? "text-emerald-500/80" : "text-neutral-700"}`}
                        >
                          {topic.status ? "Live" : "Idle"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="hidden sm:flex flex-col items-end opacity-40">
                        <span className="text-[9px] font-mono text-neutral-600">
                          {getRelativeTime(topic.createdAt) || "Unknown"}
                        </span>
                      </div>
                      <Link
                        href={`/topic/${topic.slug}`}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-all active:scale-90"
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
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, User, Layers, Search, Clock } from "lucide-react";
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
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="relative group max-w-md px-2">
        <Search
          className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-800 group-focus-within:text-white transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="SEARCH RESOURCE NODES..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-950 border-2 border-neutral-900 rounded-2xl pl-14 pr-6 py-4 text-[11px] font-black tracking-widest text-white focus:border-neutral-700 focus:outline-none transition-all placeholder:text-neutral-800"
        />
      </div>

      {filteredTopics.length === 0 ? (
        <div className="border-2 border-neutral-900 py-40 text-center rounded-[3rem] bg-neutral-950/50">
          <p className="text-neutral-700 text-[10px] font-black tracking-[0.5em]">
            No Search Matches Found
          </p>
        </div>
      ) : (
        <div className="border-2 border-neutral-900 rounded-[3rem] overflow-hidden bg-neutral-950 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-neutral-950 text-neutral-700 text-[10px] font-black tracking-[0.3em]">
                <th className="px-10 py-7 border-b-2 border-neutral-900 w-[45%]">
                  Resource Title
                </th>
                <th className="px-10 py-7 border-b-2 border-neutral-900 w-[30%] text-center">
                  Attributes
                </th>
                <th className="px-10 py-7 border-b-2 border-neutral-900 text-right w-[25%]">
                  Access
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-900">
              {filteredTopics.map((topic) => (
                <tr
                  key={topic.id}
                  className="group hover:bg-neutral-900/40 transition-all duration-300"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center text-white group-hover:border-white transition-all duration-500">
                        <Layers size={22} strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="text-lg font-black text-white tracking-tighter group-hover:pl-1 transition-all">
                          {topic.title}
                        </div>
                        <div className="text-[10px] text-neutral-600 font-bold tracking-wider flex items-center gap-2">
                          <User size={12} className="text-neutral-800" />
                          <span>@{topic.authorUsername}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="px-4 py-1.5 rounded-xl text-[9px] font-black border-2 border-neutral-900 bg-neutral-900 text-neutral-400 tracking-widest">
                        {topic.tagTitle}
                      </span>
                      <div className="flex items-center gap-2 text-[9px] font-black text-neutral-700 tracking-tighter">
                        <div
                          className={`h-2 w-2 rounded-full ${topic.status ? "bg-emerald-500" : "bg-neutral-800"}`}
                        />
                        {topic.status ? "Live" : "Idle"}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-8">
                      <div className="hidden lg:flex flex-col items-end gap-1">
                        <div className="flex items-center text-[10px] font-black text-neutral-500 tracking-widest">
                          <Clock size={12} className="mr-2 text-neutral-800" />
                          {getRelativeTime(topic.createdAt)}
                        </div>
                      </div>
                      <Link
                        href={`/topic/${topic.slug}`}
                        className="p-4 bg-neutral-900 border-2 border-neutral-800 text-neutral-500 hover:text-white hover:border-white rounded-2xl transition-all active:scale-95 group/btn"
                      >
                        <Eye size={18} />
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

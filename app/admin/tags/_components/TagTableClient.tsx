"use client";

import { useState } from "react";
import Link from "next/link";
import { ITagResponse } from "@/app/types/tag";
import { Eye, User, Tag, Search, Clock } from "lucide-react";
import { getRelativeTime } from "@/app/utils/date";

export default function TagTableClient({ tags }: { tags: ITagResponse[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTags = tags.filter(
    (tag) =>
      tag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchTerm.toLowerCase()),
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
          placeholder="SEARCH TAXONOMY NODES..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-950 border-2 border-neutral-900 rounded-2xl pl-14 pr-6 py-4 text-[11px] font-black tracking-widest text-white focus:border-neutral-700 focus:outline-none transition-all placeholder:text-neutral-800"
        />
      </div>

      <div className="border-2 border-neutral-900 rounded-[3rem] overflow-hidden bg-neutral-950 overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-neutral-950 text-neutral-700 text-[10px] font-black tracking-[0.3em]">
              <th className="px-10 py-7 border-b-2 border-neutral-900 w-[40%]">
                Tag Identity
              </th>
              <th className="px-10 py-7 border-b-2 border-neutral-900 w-[35%]">
                Context
              </th>
              <th className="px-10 py-7 border-b-2 border-neutral-900 text-right w-[25%]">
                Attributes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-900">
            {filteredTags.map((tag) => {
              const isTagActive = tag.status !== false;
              return (
                <tr
                  key={tag.id}
                  className="group hover:bg-neutral-900/40 transition-all duration-300"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center text-white group-hover:border-white transition-all duration-500">
                        <Tag size={22} strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-lg font-black text-white tracking-tighter group-hover:pl-1 transition-all">
                          {tag.title}
                        </p>
                        <div className="text-[10px] text-neutral-600 font-bold tracking-wider flex items-center gap-2">
                          <User size={12} className="text-neutral-800" />
                          <span>@{tag.authorUsername}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-10 py-8">
                    <p className="text-sm text-neutral-500 font-bold leading-relaxed max-w-xs line-clamp-1 tracking-tight group-hover:text-neutral-300 transition-colors">
                      {tag.description || "NO SYSTEM DESCRIPTION PROVIDED."}
                    </p>
                  </td>

                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-8">
                      <div className="hidden lg:flex flex-col items-end gap-2">
                        <div className="flex items-center text-[10px] font-black text-neutral-600 tracking-widest">
                          <Clock size={12} className="mr-2 text-neutral-800" />
                          {getRelativeTime(tag.createdAt)}
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black border-2 tracking-tighter ${
                            isTagActive
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
                              : "bg-neutral-900 border-neutral-800 text-neutral-700"
                          }`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${isTagActive ? "bg-emerald-500" : "bg-neutral-800"}`}
                          />
                          {isTagActive ? "Live" : "Idle"}
                        </div>
                      </div>

                      <Link
                        href={`/tag/${tag.slug}`}
                        className="p-4 bg-neutral-900 border-2 border-neutral-800 text-neutral-500 hover:text-white hover:border-white rounded-2xl transition-all active:scale-95 group/btn"
                      >
                        <Eye size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

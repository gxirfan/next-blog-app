"use client";

import { useState } from "react";
import Link from "next/link";
import { ITagResponse } from "@/app/types/tag";
import { Eye, User, Calendar, Tag, Search } from "lucide-react";
import { getRelativeTime } from "@/app/utils/date";

export default function TagTableClient({ tags }: { tags: ITagResponse[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTags = tags.filter(
    (tag) =>
      tag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative group max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
          size={16}
        />
        <input
          type="text"
          placeholder="Search taxonomy nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-neutral-800/60 rounded-2xl pl-12 pr-6 py-3 text-sm text-neutral-200 focus:border-cyan-500/40 focus:outline-none transition-all placeholder:text-neutral-700 font-medium"
        />
      </div>

      <div className="border border-neutral-900 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left border-separate border-spacing-0 table-fixed">
          <thead>
            <tr className="bg-neutral-900/30 text-neutral-600 text-[10px] tracking-[0.2em] font-black">
              <th className="px-8 py-5 border-b border-neutral-800/50 w-[40%]">
                Tag Identity
              </th>
              <th className="px-8 py-5 border-b border-neutral-800/50 w-[35%]">
                Context
              </th>
              <th className="px-8 py-5 border-b border-neutral-800/50 text-right w-[25%]">
                Attributes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/40">
            {filteredTags.map((tag) => {
              const isTagActive = tag.status !== false;
              return (
                <tr
                  key={tag.id}
                  className="group hover:bg-white/[0.015] transition-all duration-200"
                >
                  {/* Tag Identity */}
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-5 overflow-hidden">
                      <div className="h-11 w-11 flex-shrink-0 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-500 group-hover:border-cyan-500/40 transition-all duration-500">
                        <Tag size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-neutral-200 tracking-tight group-hover:text-cyan-400 transition-colors truncate">
                          {tag.title}
                        </p>
                        <p className="text-[10px] text-neutral-600 flex items-center gap-1.5 mt-0.5 font-mono tracking-tighter">
                          <User size={10} className="opacity-40" />
                          <span className="truncate">
                            @{tag.authorUsername}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Context */}
                  <td className="px-8 py-7">
                    <p className="text-xs text-neutral-500 leading-relaxed max-w-xs line-clamp-1 font-medium group-hover:text-neutral-400 transition-colors">
                      {tag.description || "System generated: No preview."}
                    </p>
                  </td>

                  {/* Attributes & Actions */}
                  <td className="px-8 py-7 text-right">
                    <div className="flex items-center justify-end gap-6">
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center text-[10px] font-mono text-neutral-600">
                          <Calendar size={11} className="mr-1.5 opacity-30" />
                          {getRelativeTime(tag.createdAt) || "Unknown"}
                        </div>
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black border ${
                            isTagActive
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500/80"
                              : "bg-neutral-900 border-neutral-800 text-neutral-600"
                          }`}
                        >
                          <div
                            className={`h-1 w-1 rounded-full ${isTagActive ? "bg-emerald-500" : "bg-neutral-700"}`}
                          />
                          {isTagActive ? "Live" : "Idle"}
                        </div>
                      </div>

                      <Link
                        href={`/tag/${tag.slug}`}
                        className="h-10 w-10 flex-shrink-0 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-cyan-400 hover:border-cyan-500/40 flex items-center justify-center transition-all active:scale-90"
                      >
                        <Eye size={16} />
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

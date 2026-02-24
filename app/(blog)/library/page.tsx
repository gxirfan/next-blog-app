"use client";

import Link from "next/link";
import React from "react";
import {
  Pencil,
  Star,
  Tag,
  MessageSquare,
  FolderOpen,
  Zap,
  ChevronRight,
  ListChecks,
} from "lucide-react";
import { ENV } from "@/config/env.config";

export default function LibraryPage() {
  const ICON_SIZE = 18;

  const renderLink = (
    href: string,
    title: string,
    IconComponent: React.ElementType,
    colorClass: string = "text-cyan-500",
  ) => (
    <Link
      href={href}
      className="group flex items-center justify-between p-5 bg-neutral-900/30 border border-neutral-900 rounded-[2rem] hover:bg-neutral-900/60 hover:border-neutral-800 transition-all duration-300 active:scale-[0.98]"
    >
      <div className="flex items-center gap-5">
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-2xl bg-neutral-950 border border-neutral-800 group-hover:border-neutral-700 transition-colors ${colorClass}`}
        >
          <IconComponent size={ICON_SIZE} />
        </div>
        <div className="flex flex-col">
          <span className="text-neutral-200 font-bold tracking-tight text-[15px] group-hover:text-white transition-colors">
            {title}
          </span>
          <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-medium">
            Browse Records
          </span>
        </div>
      </div>
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-950 border border-neutral-900 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
        <ChevronRight size={14} className="text-neutral-400" />
      </div>
    </Link>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 space-y-20">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-1 bg-cyan-500 rounded-full" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-600">
            Vault
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase font-urbanist">
          Content <span className="text-neutral-700">Library</span>
        </h1>
      </header>

      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-neutral-900 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight font-urbanist">
              My Created Content
            </h2>
            <p className="text-neutral-500 text-sm max-w-md">
              Management portal for your authored topics, {ENV.POST_TYPE}, and
              streams.
            </p>
          </div>
          <Pencil size={20} className="text-neutral-800 mb-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {renderLink(
            "/library/my-streams",
            "My Streams",
            Zap,
            "text-cyan-500",
          )}
          {renderLink(
            "/library/my-posts",
            `My ${ENV.POST_TYPE}s`,
            MessageSquare,
            "text-blue-500",
          )}
          {renderLink(
            "/library/my-topics",
            "My Topics",
            FolderOpen,
            "text-purple-500",
          )}
          {renderLink("/library/my-tags", "My Tags", Tag, "text-emerald-500")}
          {renderLink(
            "/library/voted-posts",
            `My Voted ${ENV.POST_TYPE}s`,
            ListChecks,
            "text-orange-500",
          )}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-neutral-900 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight font-urbanist">
              My Saved Content
            </h2>
            <p className="text-neutral-500 text-sm max-w-md">
              Archive of bookmarks and saved data nodes.
            </p>
          </div>
          <Star size={20} className="text-neutral-800 mb-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-10 rounded-[2rem] border border-dashed border-neutral-900 flex flex-col items-center justify-center bg-neutral-950/20 md:col-span-3 group">
            <Star
              size={24}
              className="text-neutral-800 group-hover:text-yellow-500/50 transition-colors duration-500 mb-3"
            />
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-700">
              Future_Modules_Pending
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

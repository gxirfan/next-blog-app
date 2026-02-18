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

export default function LibraryPage() {
  const ICON_SIZE = 18;
  const ACCENT_COLOR = "text-cyan-400";

  const renderLink = (
    href: string,
    title: string,
    IconComponent: React.ElementType,
    isSaved: boolean = false,
  ) => (
    <Link
      href={href}
      className="group flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-4xl hover:border-cyan-500/40 transition-all duration-300 active:scale-[0.98]"
    >
      <div className="flex items-center space-x-4">
        <div
          className={`p-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl group-hover:border-neutral-700 transition-colors ${
            isSaved ? "text-yellow-400" : ACCENT_COLOR
          }`}
        >
          <IconComponent size={ICON_SIZE} />
        </div>
        <span className="text-neutral-200 font-bold tracking-tight text-[14px] group-hover:text-white transition-colors">
          {title}
        </span>
      </div>
      <ChevronRight
        size={14}
        className="text-neutral-700 group-hover:text-white group-hover:translate-x-1 transition-all"
      />
    </Link>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 ">
      {/* 1. Page Header - Orijinal Başlık Korundu */}
      <h1 className="text-4xl font-extrabold text-neutral-200 border-b border-neutral-800 pb-5 tracking-tighter">
        📚 Content Library
      </h1>

      {/* 2. Section: My Created Content */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-200 border-b border-neutral-800 pb-3 flex items-center space-x-3">
          <Pencil size={24} className={ACCENT_COLOR} />
          <span>My Created Content</span>
        </h2>

        <p className="text-neutral-500 text-sm font-medium leading-relaxed max-w-2xl">
          View and manage all topics, posts, flows, and tags you have personally
          authored or created.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderLink("/library/my-flows", "My Flows", Zap)}
          {renderLink("/library/my-posts", "My Posts", MessageSquare)}
          {renderLink("/library/my-topics", "My Topics", FolderOpen)}
          {renderLink("/library/my-tags", "My Tags", Tag)}
          {renderLink("/library/voted-posts", "My Voted Posts", ListChecks)}
        </div>
      </section>

      {/* 3. Section: My Saved Content */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-200 border-b border-neutral-800 pb-3 flex items-center space-x-3">
          <Star size={24} className="text-yellow-400" />
          <span>My Saved Content</span>
        </h2>

        <p className="text-neutral-400 text-sm font-medium leading-relaxed max-w-2xl">
          Access posts and topics you have bookmarked or saved for later
          reference.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-4xl border border-dashed border-neutral-800 flex items-center justify-center bg-neutral-950/30 md:col-span-3">
            <div className="flex items-center gap-3 opacity-30">
              <Star size={16} className="text-neutral-500" />
              <p className="text-[11px] uppercase tracking-widest">
                More saved options coming soon...
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

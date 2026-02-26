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
  ArrowRight,
  ListChecks,
} from "lucide-react";
import { ENV } from "@/config/env.config";

export default function LibraryPage() {
  const renderLink = (
    href: string,
    title: string,
    IconComponent: React.ElementType,
    description: string,
  ) => (
    <Link
      href={href}
      className="group flex flex-col justify-between p-8 bg-neutral-950 border-2 border-neutral-900 rounded-[2.5rem] hover:border-neutral-700 transition-all duration-300 active:scale-[0.98] min-h-[180px]"
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-neutral-900 border-2 border-neutral-800 rounded-2xl flex items-center justify-center text-white group-hover:text-cyan-500 transition-colors">
          <IconComponent size={24} />
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 opacity-0 group-hover:opacity-100 transition-all">
          <ArrowRight size={16} className="text-white" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-black text-white tracking-tighter group-hover:text-cyan-500 transition-colors">
          {title}
        </h3>
        <p className="text-[10px] text-neutral-600 font-black tracking-[0.2em]">
          {description}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-32 space-y-24 animate-in fade-in duration-700">
      {/* HEADER - Solid & Massive */}
      <header className="space-y-6 border-b-2 border-neutral-900 pb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-1.5 bg-cyan-500 rounded-full" />
          <span className="text-xs font-black tracking-[0.4em] text-neutral-600">
            Personal Archive
          </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
          Personal Library
        </h1>
      </header>

      {/* SECTION 1: CREATED CONTENT */}
      <section className="space-y-10">
        <div className="flex items-end justify-between border-b-2 border-neutral-900 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tighter">
              My Creations
            </h2>
            <p className="text-neutral-600 text-xs font-black tracking-widest">
              Manage your authored topics, {ENV.POST_TYPE}s and shared threads.
            </p>
          </div>
          <Pencil size={24} className="text-neutral-800 mb-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderLink(
            "/library/my-threads",
            "My Threads",
            Zap,
            "Shared Transmissions",
          )}
          {renderLink(
            "/library/my-posts",
            `My ${ENV.POST_TYPE}s`,
            MessageSquare,
            "Published Articles",
          )}
          {renderLink(
            "/library/my-topics",
            "My Topics",
            FolderOpen,
            "Established Units",
          )}
          {renderLink(
            "/library/my-tags",
            "My Tags",
            Tag,
            "Classification Labels",
          )}
          {renderLink(
            "/library/voted-posts",
            "Your Votes",
            ListChecks,
            "Interaction History",
          )}
        </div>
      </section>

      {/* SECTION 2: SAVED CONTENT */}
      <section className="space-y-10">
        <div className="flex items-end justify-between border-b-2 border-neutral-900 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tighter">
              Collections
            </h2>
            <p className="text-neutral-600 text-xs font-black tracking-widest">
              Saved items and bookmarks for future reference.
            </p>
          </div>
          <Star size={24} className="text-neutral-800 mb-2" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="py-24 rounded-[3rem] border-2 border-dashed border-neutral-900 flex flex-col items-center justify-center bg-neutral-950/50 group">
            <Star
              size={32}
              className="text-neutral-900 group-hover:text-cyan-500/50 transition-all duration-500 mb-6"
            />
            <p className="text-xs font-black tracking-[0.4em] text-neutral-700">
              No bookmarks archived yet
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

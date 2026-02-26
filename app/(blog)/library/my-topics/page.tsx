import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  FolderOpen,
  CheckCircle,
  Clock,
  MessageSquare,
  Eye,
  Tag,
  Activity,
  ArrowRight,
} from "lucide-react";
import PaginationControls from "@/app/components/PaginationControls";
import { IBaseResponse } from "@/app/types/common";
import { getRelativeTime } from "@/app/utils/date";
import { ENV } from "@/config/env.config";
import { getRequiredAuthSession } from "@/app/services/session";

export const metadata: Metadata = {
  title: "My Topics | Content Library",
};

interface MyTopicsPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

/**
 * Server-side fetch for user's created topics
 */
async function getMyTopics(
  page: number = 1,
  limit: number = 10,
): Promise<IBaseResponse<any>> {
  const headersList = await cookies();
  const res = await fetch(
    `${ENV.API_URL}/topics/all/library/my-topics?page=${page}&limit=${limit}`,
    {
      cache: "no-store",
      headers: {
        Cookie: headersList.toString(),
      },
    },
  );
  if (!res.ok)
    return {
      success: false,
      data: { data: [], meta: null },
    } as IBaseResponse<any>;
  return await res.json();
}

export default async function MyTopicsPage({
  searchParams,
}: MyTopicsPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const limit = parseInt(resolvedParams.limit || "10");

  const response = await getMyTopics(page, limit);
  const topics = response?.data?.data || [];
  const meta = response?.data?.meta;

  const getStatusStyles = (status: boolean) => {
    return status
      ? {
          icon: CheckCircle,
          text: "Active",
          color: "text-green-500/80",
          bg: "bg-green-500/5 border-green-500/10",
        }
      : {
          icon: Clock,
          text: "Hidden",
          color: "text-yellow-500/80",
          bg: "bg-yellow-500/5 border-yellow-500/10",
        };
  };

  await getRequiredAuthSession("/library/my-topics");
  return (
    <div className="mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      {/* 1. HEADER SECTION - Solid & Balanced */}
      <div className="border-b-2 border-neutral-900 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-neutral-900 border-2 border-neutral-800 rounded-3xl flex items-center justify-center text-cyan-500">
                <FolderOpen size={28} />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
              My <span className="text-neutral-800">Topics</span>
            </h1>
            <div className="flex items-center gap-4 px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-neutral-600 tracking-[0.3em]">
                  Total Created:
                </span>
                <span className="text-[11px] font-black text-white tracking-widest bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                  {meta?.total || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOPIC LIST - High Contrast & Human Language */}
      <div className="space-y-6">
        {topics.length > 0 ? (
          <>
            {topics.map((topic: any) => {
              const status = getStatusStyles(topic.status);
              return (
                <div
                  key={topic.id}
                  className="group relative p-8 md:p-10 bg-neutral-950 border-2 border-neutral-900 rounded-[3rem] hover:border-neutral-700 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-10"
                >
                  <div className="flex-1 min-w-0 space-y-6">
                    {/* Status & Tag Row */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div
                        className={`px-4 py-1.5 rounded-full border-2 ${status.bg} border-opacity-20 flex items-center gap-2`}
                      >
                        <span
                          className={`text-[10px] font-black tracking-widest ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-neutral-900 px-4 py-1.5 rounded-full border border-neutral-800 text-neutral-400">
                        <Tag size={12} className="text-cyan-500" />
                        <span className="text-[10px] font-black tracking-widest">
                          {topic.tagTitle}
                        </span>
                      </div>
                    </div>

                    {/* Title - Bold & Large */}
                    <Link
                      href={`/topic/${topic.slug}`}
                      className="text-2xl md:text-3xl font-black text-white hover:text-cyan-500 transition-colors block leading-tight tracking-tighter"
                    >
                      {topic.title}
                    </Link>

                    {/* Metadata - Simplified */}
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[10px] font-black tracking-[0.2em] text-neutral-500">
                      <div className="flex items-center gap-2.5">
                        <MessageSquare size={16} className="text-neutral-700" />
                        <span>
                          {topic.postCount}{" "}
                          <span className="text-neutral-800">
                            {ENV.POST_TYPE}s
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Eye size={16} className="text-neutral-700" />
                        <span>
                          {topic.viewCount}{" "}
                          <span className="text-neutral-800">Views</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Activity size={16} className="text-neutral-700" />
                        <span className="text-neutral-600">
                          Last Update:{" "}
                          {getRelativeTime(topic.lastPostAt) || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 w-full md:w-auto pt-8 md:pt-0 border-t-2 md:border-t-0 border-neutral-900">
                    <Link
                      href={`/topic/${topic.slug}`}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-neutral-900 border-2 border-neutral-800 rounded-full text-xs font-black tracking-[0.2em] text-neutral-400 hover:text-white hover:border-white transition-all active:scale-95"
                    >
                      View Topic
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}

            {meta && meta.totalPages > 1 && (
              <div className="pt-16 flex justify-center">
                <PaginationControls meta={meta} />
              </div>
            )}
          </>
        ) : (
          /* EMPTY STATE - Samimi Dil */
          <div className="flex flex-col items-center justify-center py-32 bg-neutral-950 border-2 border-dashed border-neutral-900 rounded-[4rem]">
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-8 border-2 border-neutral-800">
              <FolderOpen size={32} className="text-neutral-700" />
            </div>
            <p className="text-neutral-500 font-black tracking-[0.3em] text-[11px] mb-10 text-center px-6">
              You haven't started any topics yet.
            </p>
            <Link
              href="/library"
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full text-xs font-black tracking-[0.2em] hover:bg-cyan-500 transition-all active:scale-95"
            >
              Back to Library
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

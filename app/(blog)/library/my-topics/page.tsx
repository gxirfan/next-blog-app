// app/library/my-topics/page.tsx
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
  ChevronRight,
  Activity,
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
    <div className="mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* 1. HEADER SECTION */}
      <div className="border-b border-neutral-900 pb-10">
        <div className="flex items-center space-x-4 mb-3">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-cyan-500">
            <FolderOpen size={28} strokeWidth={2} />
          </div>
          <h1 className="text-4xl text-white tracking-tighter uppercase leading-none">
            My Topics
          </h1>
        </div>
        <p className="text-neutral-500 text-[11px] uppercase tracking-widest ml-1">
          Registered Master Nodes:{" "}
          <span className="text-white">{meta?.total || 0}</span>
        </p>
      </div>

      {/* 2. TOPIC LIST */}
      <div className="space-y-4">
        {topics.length > 0 ? (
          <>
            {topics.map((topic: any) => {
              const status = getStatusStyles(topic.status);
              return (
                <div
                  key={topic.id}
                  className="group relative p-6 md:p-8 bg-neutral-950 border border-neutral-800 rounded-[2rem] hover:border-cyan-500/30 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Badge Row */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-3 py-1 rounded-full border ${status.bg} flex items-center gap-1.5`}
                      >
                        <status.icon size={12} className={status.color} />
                        <span
                          className={`text-[9px] uppercase tracking-widest ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400">
                        <Tag size={12} className="text-cyan-500/50" />
                        <span className="text-[9px] uppercase tracking-widest">
                          {topic.tagTitle}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/topic/${topic.slug}`}
                      className="text-xl md:text-2xl font-bold text-neutral-200 group-hover:text-cyan-400 transition-colors block leading-tight tracking-tight"
                    >
                      {topic.title}
                    </Link>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-widest text-neutral-500">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={14} className="text-neutral-700" />
                        <span>
                          {topic.postCount}{" "}
                          <span className="text-neutral-800">
                            {ENV.POST_TYPE}s
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={14} className="text-neutral-700" />
                        <span>
                          {topic.viewCount}{" "}
                          <span className="text-neutral-800">Views</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-neutral-700" />
                        <span className="text-neutral-600">
                          Last Sync:{" "}
                          {getRelativeTime(topic.lastPostAt) || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-neutral-900">
                    <Link
                      href={`/topic/${topic.slug}`}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 border border-neutral-800 rounded-xl text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-white hover:border-cyan-500/50 transition-all active:scale-95"
                    >
                      Modify Node
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}

            {meta && meta.totalPages > 1 && (
              <div className="pt-10 flex justify-center">
                <PaginationControls meta={meta} />
              </div>
            )}
          </>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 bg-neutral-950 border border-dashed border-neutral-800 rounded-[2.5rem]">
            <div className="p-6 bg-neutral-900 rounded-full mb-6">
              <FolderOpen size={40} className="text-neutral-700" />
            </div>
            <p className="text-neutral-400 uppercase tracking-widest text-xs">
              No topics established in this registry.
            </p>
            <Link
              href="/library"
              className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] uppercase tracking-[0.2em] text-cyan-500 hover:border-cyan-500/50 transition-all"
            >
              Return to Library
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

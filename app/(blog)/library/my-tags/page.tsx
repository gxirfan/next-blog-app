// app/library/my-tags/page.tsx
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  Tag,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Hash,
  TagIcon,
} from "lucide-react";
import PaginationControls from "@/app/components/PaginationControls";
import { IBaseResponse } from "@/app/types/common";
import { ENV } from "@/config/env.config";
import { getRequiredAuthSession } from "@/app/services/session";

export const metadata: Metadata = {
  title: "My Tags | Content Library",
};

interface MyTagsPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

/**
 * Server-side fetch for user's created tags
 */
async function getMyTags(
  page: number = 1,
  limit: number = 10,
): Promise<IBaseResponse<any>> {
  const headersList = await cookies();
  const res = await fetch(
    `${ENV.API_URL}/tags/all/library/my-tags?page=${page}&limit=${limit}`,
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

export default async function MyTagsPage({ searchParams }: MyTagsPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const limit = parseInt(resolvedParams.limit || "10");

  const response = await getMyTags(page, limit);
  const tags = response?.data?.data || [];
  const meta = response?.data?.meta;

  const getStatusStyles = (status: boolean) => {
    return status
      ? {
          icon: ShieldCheck,
          text: "Active",
          color: "text-green-500/80",
          bg: "bg-green-500/5 border-green-500/10",
        }
      : {
          icon: ShieldAlert,
          text: "Inactive",
          color: "text-red-500/80",
          bg: "bg-red-500/5 border-red-500/10",
        };
  };

  await getRequiredAuthSession("/library/my-tags");

  return (
    <div className="mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* 1. HEADER SECTION */}
      <div className="border-b border-neutral-900 pb-10">
        <div className="flex items-center space-x-4 mb-3">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-cyan-500">
            <Tag size={28} strokeWidth={2} />
          </div>
          <h1 className="text-4xl text-white tracking-tighter uppercase leading-none">
            My Created Tags
          </h1>
        </div>
        <p className="text-neutral-500 text-[11px] uppercase tracking-widest ml-1">
          Defined Classifications:{" "}
          <span className="text-white">{meta?.total || 0}</span>
        </p>
      </div>

      {/* 2. TAG LIST */}
      <div className="space-y-4">
        {tags.length > 0 ? (
          <>
            {tags.map((tag: any) => {
              const status = getStatusStyles(tag.status);
              return (
                <div
                  key={tag.id}
                  className="group relative p-6 bg-neutral-950 border border-neutral-800 rounded-4xl hover:border-cyan-500/30 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-cyan-500">
                        <Hash size={12} />
                        <span className="text-[10px] uppercase tracking-widest">
                          Tag Node
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-neutral-200 group-hover:text-cyan-400 transition-colors tracking-tight">
                      {tag.title}
                    </h3>

                    <p className="text-sm font-medium text-neutral-500 leading-relaxed max-w-2xl">
                      {tag.description ||
                        "No registry description provided for this node."}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-neutral-900">
                    <div className="flex flex-col items-end gap-3 min-w-[120px]">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${status.bg} ${status.color}`}
                      >
                        <status.icon size={12} />
                        <span className="text-[9px] uppercase tracking-widest">
                          {status.text}
                        </span>
                      </div>

                      <Link
                        href={`/tag/${tag.slug}`}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-cyan-400 transition-all group/link"
                      >
                        View Node
                        <ChevronRight
                          size={14}
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
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
              <TagIcon size={40} className="text-neutral-700" />
            </div>
            <p className="text-neutral-400 uppercase tracking-widest text-xs">
              No tags found in the registry.
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

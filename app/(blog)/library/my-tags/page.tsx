import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { Tag, ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react";
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
    <div className="mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      {/* 1. HEADER SECTION - Solid & Balanced */}
      <div className="border-b-2 border-neutral-900 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-neutral-900 border-2 border-neutral-800 rounded-3xl flex items-center justify-center text-cyan-500">
                <Tag size={28} />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
              My <span className="text-neutral-800">Tags</span>
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

      {/* 2. TAG LIST - High Contrast & Clean Language */}
      <div className="space-y-6">
        {tags.length > 0 ? (
          <>
            {tags.map((tag: any) => {
              const status = getStatusStyles(tag.status);
              return (
                <div
                  key={tag.id}
                  className="group relative p-8 md:p-10 bg-neutral-950 border-2 border-neutral-900 rounded-[3rem] hover:border-neutral-700 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-10"
                >
                  <div className="flex-1 min-w-0 space-y-5">
                    <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-cyan-500 transition-colors tracking-tighter">
                      {tag.title}
                    </h3>

                    <p className="text-sm font-bold text-neutral-500 leading-relaxed max-w-2xl tracking-tight">
                      {tag.description ||
                        "No description has been added for this tag yet."}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-6 w-full md:w-auto pt-8 md:pt-0 border-t-2 md:border-t-0 border-neutral-900">
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${status.bg} border-opacity-20`}
                    >
                      <span
                        className={`text-[10px] font-black tracking-widest ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </div>

                    <Link
                      href={`/tag/${tag.slug}`}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-neutral-900 border-2 border-neutral-800 rounded-full text-xs font-black tracking-[0.2em] text-neutral-400 hover:text-white hover:border-white transition-all active:scale-95"
                    >
                      View Topics
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
              <Tag size={32} className="text-neutral-700" />
            </div>
            <p className="text-neutral-500 font-black tracking-[0.3em] text-[11px] mb-10 text-center">
              You haven't created any tags yet.
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

import { Metadata } from "next";
import {
  Zap,
  MessageSquareOff,
  ChevronRight,
  Calendar,
  ArrowRight,
} from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";
import Link from "next/link";
import { IBaseResponse } from "@/app/types/common";
import PaginationControls from "@/app/components/PaginationControls";
import { getRelativeTime } from "@/app/utils/date";
import { ENV } from "@/config/env.config";
import { cookies } from "next/headers";
import { getRequiredAuthSession } from "@/app/services/session";

export const metadata: Metadata = {
  title: "My Threads | Content Library",
};

interface MyFlowsPageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getFlowsForLibrary(
  page: number = 1,
): Promise<IBaseResponse<any>> {
  const headersList = await cookies();
  const res = await fetch(
    `${ENV.API_URL}/flow/all/library/my-flows?page=${page}&limit=10`,
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

export default async function MyFlowsPage({ searchParams }: MyFlowsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page || "1";

  const response = await getFlowsForLibrary(parseInt(page));
  const flows = response?.data?.data || [];
  const meta = response?.data?.meta;

  await getRequiredAuthSession("/library/my-threads");
  return (
    <div className="mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      {/* 1. HEADER SECTION - Solid & Balanced */}
      <div className="border-b-2 border-neutral-900 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-neutral-900 border-2 border-neutral-800 rounded-3xl flex items-center justify-center text-cyan-500">
                <Zap size={28} />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
              My <span className="text-neutral-800">Threads</span>
            </h1>
            <p className="text-neutral-500 text-[12px] font-black tracking-[0.4em] ml-1">
              A personal collection of your shared thoughts
            </p>
          </div>
        </div>
      </div>

      {/* 2. THREADS LIST - Clean & Focused */}
      <div className="space-y-6">
        {flows.length > 0 ? (
          <>
            {flows.map((flow: any) => (
              <div
                key={flow.id}
                className="group p-8 md:p-10 bg-neutral-950 border-2 border-neutral-900 rounded-[3rem] hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between gap-8"
              >
                {/* Top Row: Date Only */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 px-4 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full">
                    <Calendar size={14} className="text-neutral-600" />
                    <span className="text-[10px] font-black text-neutral-400 tracking-widest">
                      {getRelativeTime(flow.createdAt) || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Content - Large & Bold DNA */}
                <Link
                  href={`/${ENV.SOCIAL_POST_TYPE}/thread/${flow.slug}`}
                  className="block text-xl md:text-2xl font-black text-white leading-tight tracking-tighter hover:text-cyan-500 transition-colors"
                >
                  &quot;{flow.content}&quot;
                </Link>

                {/* Footer: Action Button */}
                <div className="flex items-center pt-8 border-t-2 border-neutral-900">
                  <Link
                    href={`/${ENV.SOCIAL_POST_TYPE}/thread/${flow.slug}`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-neutral-900 border-2 border-neutral-800 rounded-full text-[12px] font-black tracking-[0.2em] text-neutral-400 hover:text-white hover:border-white transition-all active:scale-95"
                  >
                    View Discussion
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}

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
              <MessageSquareOff size={32} className="text-neutral-700" />
            </div>
            <p className="text-neutral-500 font-black tracking-[0.3em] text-[12px] mb-10 text-center px-6">
              Your thread archive is currently empty.
            </p>
            <Link
              href={`/${ENV.SOCIAL_POST_TYPE}`}
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full text-[12px] font-black tracking-[0.2em] hover:bg-cyan-500 transition-all active:scale-95"
            >
              Start a Thread
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

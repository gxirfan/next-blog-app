import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Zap, MessageSquareOff, ChevronRight, Calendar } from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";
import Link from "next/link";
import { headers } from "next/headers";
import { IBaseResponse } from "@/app/types/common";
import PaginationControls from "@/app/components/PaginationControls";
import { getRelativeTime } from "@/app/utils/date";

export const metadata: Metadata = {
  title: "My Flows | Content Library",
};

interface MyFlowsPageProps {
  searchParams: Promise<{ page?: string }>;
}

// Logic remained exactly as you provided
async function getCurrentUser() {
  const headersList = await headers();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/status`, {
    cache: "no-store",
    headers: {
      Cookie: headersList.get("cookie") || "",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

async function getFlowsByUsername(
  username: string,
  page: number = 1,
): Promise<IBaseResponse<any>> {
  const headersList = await headers();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/flow/username/${username}?page=${page}&limit=10`,
    {
      cache: "no-store",
      headers: {
        Cookie: headersList.get("cookie") || "",
      },
    },
  );
  if (!res.ok) return { success: false, data: { data: [], meta: null } } as any;
  return await res.json();
}

export default async function MyFlowsPage({ searchParams }: MyFlowsPageProps) {
  const session = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page || "1";

  if (!session || !session.data) {
    redirect("/auth/login?returnUrl=/library/my-flows");
  }

  const response = await getFlowsByUsername(
    session.data.user.username,
    parseInt(page),
  );

  const flows = response?.data?.data || [];
  const meta = response?.data?.meta;

  return (
    <div className="mx-auto space-y-10  animate-in fade-in duration-700">
      {/* 1. HEADER SECTION - Styled but original content kept */}
      <div className="border-b border-neutral-900 pb-8">
        <div className="flex items-center space-x-4 mb-3">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-cyan-500">
            <Zap size={28} strokeWidth={2} />
          </div>
          <h1 className="text-4xl text-white tracking-tighter uppercase">
            My Flows
          </h1>
        </div>
        <p className="text-neutral-500 text-[13px] font-medium ml-1">
          Everything you&apos;ve shared in the flow stream.
        </p>
      </div>

      {/* 2. FLOW LIST - Stark Minimalist & Zero Shadow */}
      <div className="space-y-6">
        {flows.length > 0 ? (
          flows.map((flow: any) => (
            <div
              key={flow.id}
              className="group block p-6 md:p-8 bg-neutral-950 border border-neutral-800 rounded-[2rem] hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-6">
                <AuthorBlock
                  username={flow.author.username}
                  nickname={flow.author.nickname}
                  avatarUrl={flow.author.avatar}
                  role={flow.author.role}
                />
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full">
                  <Calendar size={12} className="text-neutral-600" />
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
                    {getRelativeTime(flow.createdAt) || "N/A"}
                  </span>
                </div>
              </div>

              <p className="text-neutral-200 text-lg md:text-xl font-bold leading-relaxed tracking-tight mb-6 pl-1 line-clamp-4">
                &quot;{flow.content}&quot;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
                <Link
                  href={`/flow/${flow.slug}`}
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-bold hover:text-cyan-400 transition-all group/link"
                >
                  View Thread
                  <ChevronRight
                    size={14}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </Link>
                <div className="text-[9px] uppercase tracking-widest text-neutral-700">
                  ID: {flow.id.substring(0, 8)}
                </div>
              </div>
            </div>
          ))
        ) : (
          /* 3. EMPTY STATE - Corrected UI */
          <div className="flex flex-col items-center justify-center py-24 bg-neutral-950 border border-dashed border-neutral-800 rounded-[2.5rem]">
            <div className="p-6 bg-neutral-900 rounded-full mb-6 text-neutral-700">
              <MessageSquareOff size={40} />
            </div>
            <p className="text-neutral-400 uppercase tracking-widest text-xs">
              No flows detected in the grid.
            </p>
            <Link
              href="/flow"
              className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] uppercase tracking-[0.2em] text-cyan-500 hover:border-cyan-500/50 transition-all active:scale-95"
            >
              Initialize First Flow
            </Link>
          </div>
        )}
      </div>

      {/* 4. PAGINATION */}
      {meta && meta.totalPages > 1 && (
        <div className="pt-10 flex justify-center">
          <PaginationControls meta={meta} />
        </div>
      )}
    </div>
  );
}

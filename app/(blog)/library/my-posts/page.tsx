// app/library/my-posts/page.tsx
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  MessageSquare,
  BookOpen,
  Clock,
  CheckCircle,
  ChevronRight,
  Hash,
  MessageSquareOff,
} from "lucide-react";
import PaginationControls from "@/app/components/PaginationControls";
import { IBaseResponse } from "@/app/types/common";
import { getRelativeTime } from "@/app/utils/date";

export const metadata: Metadata = {
  title: "My Posts | Content Library",
};

interface MyPostsPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

/**
 * Fetch authentication status from the internal API
 */
async function getCurrentUser() {
  const headersList = await headers();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/status`, {
    cache: "no-store",
    headers: {
      Cookie: headersList.get("cookie") || "",
    },
  });
  if (!res.ok) return null;
  return await res.json();
}

/**
 * Fetch user's posts with pagination
 */
async function getMyPosts(
  page: number = 1,
  limit: number = 10,
): Promise<IBaseResponse<any>> {
  const headersList = await headers();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/all/library/my-posts?page=${page}&limit=${limit}`,
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

export default async function MyPostsPage({ searchParams }: MyPostsPageProps) {
  const session = await getCurrentUser();
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const limit = parseInt(resolvedParams.limit || "10");

  // Redirect unauthorized users
  if (!session || !session.data) {
    redirect("/auth/login?returnUrl=/library/my-posts");
  }

  const response = await getMyPosts(page, limit);
  const posts = response?.data?.data || [];
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
          text: "Draft",
          color: "text-yellow-500/80",
          bg: "bg-yellow-500/5 border-yellow-500/10",
        };
  };

  return (
    <div className="mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* 1. HEADER SECTION */}
      <div className="border-b border-neutral-900 pb-10">
        <div className="flex items-center space-x-4 mb-3">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-cyan-500">
            <MessageSquare size={28} strokeWidth={2} />
          </div>
          <h1 className="text-4xl text-white tracking-tighter uppercase leading-none">
            My Posts
          </h1>
        </div>
        <div className="flex items-center gap-3 ml-1 text-neutral-500">
          <Hash size={14} className="text-neutral-700" />
          <p className="text-[11px] uppercase tracking-widest">
            Total Registry:{" "}
            <span className="text-white">{meta?.total || 0}</span>
          </p>
        </div>
      </div>

      {/* 2. POST LIST */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          <>
            {posts.map((post: any) => {
              const status = getStatusStyles(post.status);
              return (
                <div
                  key={post.id}
                  className="group relative p-6 md:p-8 bg-neutral-950 border border-neutral-800 rounded-[2rem] hover:border-cyan-500/30 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex-1 min-w-0 space-y-4">
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
                      <span className="text-[10px] text-neutral-700 uppercase tracking-widest">
                        {getRelativeTime(post.createdAt) || "N/A"}
                      </span>
                    </div>

                    <Link
                      href={`/post/${post.slug}`}
                      className="text-xl md:text-2xl font-bold text-neutral-200 group-hover:text-cyan-400 transition-colors block leading-tight tracking-tight"
                    >
                      {post.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-neutral-500">
                      <span className="flex items-center gap-1.5">
                        Topic:{" "}
                        <span className="text-neutral-400 font-bold">
                          {post.topicTitle}
                        </span>
                      </span>
                      {post.parentId && (
                        <span className="text-neutral-600">
                          ↳ Reply to thread
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 ml-0 md:ml-2">
                        <BookOpen size={14} className="text-neutral-700" />
                        <span>{post.viewCount} Views</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-neutral-900">
                    <Link
                      href={`/post/${post.slug}`}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 border border-neutral-800 rounded-xl text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-white hover:border-cyan-500/50 transition-all active:scale-95"
                    >
                      Modify Entry
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
              <MessageSquareOff size={40} className="text-neutral-700" />
            </div>
            <p className="text-neutral-400 uppercase tracking-widest text-xs">
              No transmissions recorded in the grid.
            </p>
            <Link
              href="/topic/all"
              className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] uppercase tracking-[0.2em] text-cyan-500 hover:border-cyan-500/50 transition-all"
            >
              Start New Discussion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

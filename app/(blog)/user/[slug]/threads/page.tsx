import FlowFeed from "@/app/(blog)/stream/_components/FlowFeed";
import PaginationControls from "@/app/components/PaginationControls";
import { ENV } from "@/config/env.config";
import { Activity, Zap } from "lucide-react";

async function getUserFlows(username: string, page: string = "1") {
  const res = await fetch(
    `${ENV.API_URL}/flow/username/${username}?page=${page}&limit=10`,
    { cache: "no-store" },
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function UserFlowsPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const paramList = await params;
  const searchParamList = await searchParams;
  const currentPage = searchParamList.page || "1";

  const result = await getUserFlows(paramList.slug, currentPage);

  if (!result) {
    return (
      <main className="max-w-4xl mx-auto pt-32 text-center font-jetbrains-mono text-red-500">
        [ERROR_404]: NODE_ACCESS_DENIED
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto pt-24 pb-20 px-0 md:px-4">
      <header className="mb-10 px-6 md:px-0 border-b border-neutral-900 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-cyan-500">
            <Zap
              size={20}
              className="text-cyan-500 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"
            />
          </div>
          <span className="text-[14px] font-black font-jetbrains-mono tracking-[0.3em] text-neutral-600">
            / @{paramList.slug}
          </span>
        </div>

        <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-urbanist leading-none">
          User <span className="text-cyan-500">Threads</span>
        </h1>

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900/50 border border-neutral-800 rounded-md">
            <Activity size={12} className="text-cyan-950" />
            <span className="text-[11px] font-black font-jetbrains-mono text-neutral-500 uppercase tracking-widest">
              Records_Count: {result.data.meta?.total || 0}
            </span>
          </div>
          <div className="h-px flex-1 bg-neutral-900/50 mx-4" />
        </div>
      </header>

      <section className="min-h-[500px]">
        <FlowFeed initialFlows={result.data.data} isDetailsPage={true} />
      </section>

      {result.data.meta && result.data.meta.totalPages > 1 && (
        <footer className="mt-12 pt-10 border-t border-neutral-900 flex justify-center">
          <PaginationControls meta={result.data.meta} />
        </footer>
      )}
    </main>
  );
}

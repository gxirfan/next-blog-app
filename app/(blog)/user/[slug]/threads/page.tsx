import FlowCard from "@/app/(blog)/stream/_components/FlowCard";
import PaginationControls from "@/app/components/PaginationControls";
import { IFlow } from "@/app/types/flow";
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
            <Zap size={20} className="text-cyan-500" />
          </div>
          <span className="text-[14px] font-black tracking-[0.3em] text-neutral-600">
            / @{paramList.slug}
          </span>
        </div>

        <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
          User <span className="text-cyan-500">Threads</span>
        </h1>

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-neutral-900/30 border border-neutral-800 rounded-full">
            <Activity size={12} className="text-cyan-900" />
            <span className="text-[10px] font-black text-neutral-500 tracking-widest">
              Total Threads: {result.data.meta?.total || 0}
            </span>
          </div>
          <div className="h-px flex-1 bg-neutral-900/50 mx-4" />
        </div>
      </header>

      <section className="min-h-[500px] flex flex-col">
        {result.data.data && result.data.data.length > 0 ? (
          result.data.data.map((flow: IFlow) => (
            <FlowCard key={flow.id} flow={flow} />
          ))
        ) : (
          <div className="py-20 text-center border border-dashed border-neutral-900 rounded-[2rem]">
            <p className="text-neutral-700 font-black tracking-widest text-xs">
              No threads broadcasted yet.
            </p>
          </div>
        )}
      </section>

      {result.data.meta && result.data.meta.totalPages > 1 && (
        <footer className="mt-12 pt-10 border-t border-neutral-900 flex justify-center">
          <PaginationControls meta={result.data.meta} />
        </footer>
      )}
    </main>
  );
}

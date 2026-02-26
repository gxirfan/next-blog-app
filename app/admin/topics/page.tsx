import { ITopicResponse } from "@/app/types/topic";
import TopicHeader from "./_components/TopicHeader";
import TopicTableClient from "./_components/TopicTableClient";
import TopicFooter from "./_components/TopicFooter";
import { ENV } from "@/config/env.config";
import { cookies } from "next/headers";

async function fetchTopics(): Promise<ITopicResponse[]> {
  const headerList = await cookies();
  const cookie = headerList.toString();
  try {
    const response = await fetch(`${ENV.API_URL}/admin/get-topics`, {
      headers: { Cookie: cookie, Accept: "application/json" },
      next: { revalidate: 0 },
    });
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    return [];
  }
}

export default async function AdminTopicsListPage() {
  const topics = await fetchTopics();

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-4 md:px-0">
      <TopicHeader count={topics.length} />

      <div className="min-h-[450px]">
        {topics.length === 0 ? (
          <div className="bg-neutral-950 border-2 border-neutral-900 py-40 text-center rounded-[3rem]">
            <div className="space-y-4">
              <p className="text-neutral-800 text-[10px] font-black tracking-[0.6em]">
                Null Data Partition
              </p>
              <p className="text-neutral-600 text-xs font-bold tracking-widest">
                No resources recorded in the inventory.
              </p>
            </div>
          </div>
        ) : (
          <TopicTableClient topics={topics} />
        )}
      </div>

      <TopicFooter />
    </div>
  );
}

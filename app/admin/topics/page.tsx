import { ITopicResponse } from "@/app/types/topic";
import { headers } from "next/headers";
import TopicHeader from "./_components/TopicHeader";
import TopicTableClient from "./_components/TopicTableClient";
import TopicFooter from "./_components/TopicFooter";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

async function fetchTopics(): Promise<ITopicResponse[]> {
  const headerList = await headers();
  const cookie = headerList.get("cookie");
  try {
    const response = await fetch(`${API_BASE_URL}/admin/get-topics`, {
      headers: { Cookie: cookie || "", Accept: "application/json" },
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <TopicHeader count={topics.length} />

      {topics.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-neutral-800/60 py-20 text-center rounded-[2rem]">
          <p className="text-neutral-600 text-xs font-mono tracking-widest uppercase font-bold">
            Null_Data_Detected
          </p>
        </div>
      ) : (
        <TopicTableClient topics={topics} />
      )}

      <TopicFooter />
    </div>
  );
}

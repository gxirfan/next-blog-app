import { ITagResponse } from "@/app/types/tag";
import { cookies } from "next/headers";
import TagHeader from "./_components/TagHeader";
import TagFooter from "./_components/TagFooter";
import TagTableClient from "./_components/TagTableClient";
import { ENV } from "@/config/env.config";

async function fetchTags(): Promise<ITagResponse[]> {
  const headerList = await cookies();
  const cookie = headerList.toString();

  try {
    const url = `${ENV.API_URL}/admin/get-tags`;
    const response = await fetch(url, {
      headers: {
        Cookie: cookie,
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    return [];
  }
}

export default async function AdminTagsListPage() {
  const tags = await fetchTags();

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-4 md:px-0">
      <TagHeader count={tags.length} />

      <div className="min-h-[450px]">
        {tags.length === 0 ? (
          <div className="bg-neutral-950 border-2 border-neutral-900 py-40 text-center rounded-[3rem]">
            <div className="space-y-4">
              <p className="text-neutral-800 text-[10px] font-black tracking-[0.6em]">
                Null Taxonomy Partition
              </p>
              <p className="text-neutral-600 text-xs font-bold tracking-widest leading-relaxed">
                No taxonomy nodes detected in the global registry.
              </p>
            </div>
          </div>
        ) : (
          <TagTableClient tags={tags} />
        )}
      </div>

      <TagFooter />
    </div>
  );
}

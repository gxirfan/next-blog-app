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
    <div className="space-y-10 animate-in fade-in duration-700">
      <TagHeader count={tags.length} />

      {tags.length === 0 ? (
        <div className="py-32 text-center border border-neutral-900 rounded-4xl">
          <p className="text-neutral-600 text-sm font-light font-mono tracking-widest">
            Null_Data_Partition: No tags detected.
          </p>
        </div>
      ) : (
        <TagTableClient tags={tags} />
      )}

      <TagFooter />
    </div>
  );
}

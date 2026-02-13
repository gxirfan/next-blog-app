import { ITagResponse } from "@/app/types/tag";
import { headers } from "next/headers";
import TagHeader from "./_components/TagHeader";
import TagFooter from "./_components/TagFooter";
import TagTableClient from "./_components/TagTableClient";

async function fetchTags(): Promise<ITagResponse[]> {
  const headerList = await headers();
  const cookie = headerList.get("cookie");

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/get-tags`;
    const response = await fetch(url, {
      headers: {
        Cookie: cookie || "",
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
      {/* 1. Header Bileşeni */}
      <TagHeader count={tags.length} />

      {/* 2. İçerik / Tablo Kısmı */}
      {tags.length === 0 ? (
        <div className="py-32 text-center bg-[#0d0d0d] border border-neutral-900 rounded-[2.5rem]">
          <p className="text-neutral-600 text-sm font-light font-mono uppercase tracking-widest">
            Null_Data_Partition: No tags detected.
          </p>
        </div>
      ) : (
        <TagTableClient tags={tags} />
      )}

      {/* 3. Footer Bileşeni */}
      <TagFooter />
    </div>
  );
}

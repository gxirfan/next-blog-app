import { IBaseResponse } from "@/app/types/common";
import MessageDetailClient from "../_components/MessageDetailClient";
import { IContactResponse } from "@/app/types/contact-response";
import { headers } from "next/headers";

async function fetchMessageDetail(
  slug: string,
): Promise<IBaseResponse<IContactResponse>> {
  const headersList = await headers();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // Ensure we are fetching without caching to get the latest read/unread status
  const response = await fetch(`${API_URL}/admin/get-contact/${slug}`, {
    cache: "no-store",
    headers: {
      cookie: headersList.get("cookie") || "",
    },
  });
  const result = await response.json();

  return result;
}

export default async function AdminMessagePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const messageData = await fetchMessageDetail(slug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <MessageDetailClient message={messageData} />
    </div>
  );
}

import { IBaseResponse } from "@/app/types/common";
import MessageDetailClient from "../_components/MessageDetailClient";
import { IContactResponse } from "@/app/types/contact-response";
import { ENV } from "@/config/env.config";
import { cookies } from "next/headers";

async function fetchMessageDetail(
  slug: string,
): Promise<IBaseResponse<IContactResponse>> {
  const headersList = await cookies();
  // Ensure we are fetching without caching to get the latest read/unread status
  const response = await fetch(`${ENV.API_URL}/admin/get-contact/${slug}`, {
    cache: "no-store",
    headers: {
      cookie: headersList.toString(),
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

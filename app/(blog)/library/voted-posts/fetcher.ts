import { IBaseResponse } from "@/app/types/common";
import { IVoteStatusResponse } from "@/app/types/vote";
import { ENV } from "@/config/env.config";
import { cookies } from "next/headers";

async function fetchUserVotedPosts(): Promise<IVoteStatusResponse[]> {
  const headersList = await cookies();
  const cookieHeader = headersList.toString();

  if (!cookieHeader) return [];

  try {
    const url = `${ENV.API_URL}/vote/user-voted-post-list`;

    const response = await fetch(url, {
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch voted posts: ${response.status}`);
      return [];
    }

    const result = (await response.json()) as IBaseResponse<
      IVoteStatusResponse[]
    >;

    return result.data || [];
  } catch (error) {
    console.error("Voted posts fetch error:", error);
    return [];
  }
}

export { fetchUserVotedPosts };

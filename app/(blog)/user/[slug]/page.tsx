import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ProfileHeader from "../_components/ProfileHeader";
import ProfileInfoCard from "../_components/ProfileInfoCard";
import { IBaseResponse } from "@/app/types/common";
import { IUserResponse } from "@/app/types/user-response.dto";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import PostsSection from "../_components/PostsSection";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

async function fetchUserProfile(
  username: string,
): Promise<IBaseResponse<IUserResponse> | null> {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  try {
    const url = `${API_BASE_URL}/user/public-profile/${username}`;
    const response = await fetch(url, {
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) return null;
    if (!response.ok)
      throw new Error(`Failed to fetch profile: ${response.status}`);

    const result = await response.json();
    return result as IBaseResponse<IUserResponse>;
  } catch (error) {
    console.error(`Profile fetching error: ${error}`);
    return null;
  }
}

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const paramsData = await params;
  const userProfile = await fetchUserProfile(paramsData.slug);

  if (!userProfile) {
    return {
      title: "Profile Not Found",
      description: "Profile not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${userProfile.data.nickname}`,
    description: userProfile.data.bio || "No bio available",
    robots: {
      index: true,
      follow: true,
    },
  };
};

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string; limit?: string };
}) {
  const userSlugData = await params;
  const userSlug = userSlugData.slug;

  const userProfile = await fetchUserProfile(userSlug);

  if (!userProfile) {
    return notFound();
  }

  const searchParamsData = await searchParams;
  const pageString = searchParamsData.page;
  const limitString = searchParamsData.limit;
  const username = userSlug;
  const nickname = userProfile.data.nickname;

  const imageApiUrl =
    process.env.NEXT_PUBLIC_API_IMAGE_URL || "http://localhost:3000";
  const DEFAULT_COVER = imageApiUrl + "/images/user/covers/default-cover.png";
  const coverUrl = userProfile.data.cover
    ? imageApiUrl + userProfile.data.cover
    : DEFAULT_COVER;

  const backgroundStyle = {
    backgroundImage: `url('${coverUrl}')`,
  };

  const postsFallback = (
    <div className="min-h-[400px]">
      <h2 className="text-2xl font-bold text-white border-b border-neutral-700 pb-3 mb-6">
        Latest Posts by @{nickname}
      </h2>
      <div className="flex justify-center items-center py-10 bg-neutral-900/50 rounded-xl border border-neutral-700">
        <Loader className="animate-spin text-cyan-400" size={24} />
        <span className="text-cyan-400 ml-3">Loading posts...</span>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 w-full bg-cover bg-center bg-fixed opacity-15 z-0 pointer-events-none"
        style={backgroundStyle}
      />

      <div className="relative w-full z-1">
        <div className="w-full">
          <div className="mx-auto space-y-8 max-w-4xl">
            <ProfileHeader user={userProfile.data} />
            <div className="pt-0 mt-24">
              <ProfileInfoCard user={userProfile.data} />
            </div>

            <Suspense fallback={postsFallback}>
              <PostsSection
                username={username}
                nickname={nickname}
                page={Number(pageString) || 1}
                limit={Number(limitString) || 10}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

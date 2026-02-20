import { notFound } from "next/navigation";
import { Suspense } from "react";
import TopicManagementActions from "../_components/TopicManagementActions";
import TopicPostsSection from "../_components/TopicPostsSection";
import PostCreationWrapper from "../_components/PostCreationWrapper";
import { ITopicResponse } from "@/app/types/topic";
import { Metadata } from "next";
import { Loader } from "lucide-react";
import TopicDetailsCard from "../_components/TopicDetailsCard";
import { ENV } from "@/config/env.config";
import { cookies } from "next/headers";

async function fetchTopicDetails(slug: string): Promise<ITopicResponse | null> {
  const headersList = await cookies();
  const cookieHeader = headersList.toString();
  try {
    const url = `${ENV.API_URL}/topics/${slug}`;
    const response = await fetch(url, {
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch topic: ${response.status}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error(`Topic detail fetching error: ${error}`);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const paramsData = await params;

  const topicDetails = await fetchTopicDetails(paramsData.slug);

  if (!topicDetails || topicDetails.status === false) {
    return {
      title: "Topic Not Found",
      description: "Topic not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${topicDetails.title}`,
    description: topicDetails.content.substring(0, 150) + "...",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TopicDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string; limit?: string };
}) {
  const topicSlugData = await params;
  const topicSlug = topicSlugData.slug;
  const topicDetails = await fetchTopicDetails(topicSlug);

  if (!topicDetails) {
    return notFound();
  }

  const searchParamsData = await searchParams;
  const pageString = searchParamsData.page;
  const limitString = searchParamsData.limit;

  return (
    <div className="mx-auto space-y-8 ">
      <TopicManagementActions topic={topicDetails} />

      <TopicDetailsCard topicDetails={topicDetails} />

      <PostCreationWrapper
        topicId={topicDetails.id}
        parentId={null}
        buttonLabel="Start a new discussion post"
      />

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-10 bg-neutral-900/50 rounded-lg border border-neutral-700">
            <Loader className="animate-spin text-cyan-400" size={24} />
            <span className="text-cyan-400 ml-3">Loading posts...</span>
          </div>
        }
      >
        <TopicPostsSection
          topicId={topicDetails.id}
          page={Number(pageString) || 1}
          limit={Number(limitString) || 10}
        />
      </Suspense>
    </div>
  );
}

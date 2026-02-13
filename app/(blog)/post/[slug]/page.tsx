import { notFound } from "next/navigation";
import { IPostResponse } from "@/app/types/post";
import PostCreationWrapper from "@/app/(blog)/topic/_components/PostCreationWrapper";
import { headers } from "next/headers";
import { Metadata } from "next";
import { Loader } from "lucide-react";
import { Suspense } from "react";
import PostDetailsCard from "../_components/PostDetailsPage";
import { RepliesSection } from "./RepliesSection";
import PostManagementActions from "../_components/PostManagementActions";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

async function fetchPostDetail(slug: string): Promise<IPostResponse | null> {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");
  try {
    const url = `${API_BASE_URL}/posts/${slug}`;
    const response = await fetch(url, {
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
        "Content-Type": "application/json",
      },
    });
    if (response.status === 404) return null;
    if (!response.ok)
      throw new Error(`Failed to fetch post: ${response.status}`);
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error(`Post detail fetching error: ${error}`);
    return null;
  }
}

/**
 * Generates SEO metadata using existing post fields.
 * Includes keywords derived from topic and title automatically.
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const paramsData = await params;
  const postDetails = await fetchPostDetail(paramsData.slug);

  if (!postDetails) {
    return {
      title:
        "Content Not Found | " +
        (process.env.NEXT_PUBLIC_PROJECT_NAME || "Project"),
      description:
        "The requested data node could not be retrieved from the network.",
      robots: { index: false, follow: false },
    };
  }

  // 1. Automatic Keyword Generation
  // Uses topic and title to create a relevant keyword cloud
  const generatedKeywords = [
    postDetails.topicTitle.toLowerCase(),
    postDetails.topicSlug.replace(/-/g, " "),
    ...postDetails.title
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3),
    process.env.NEXT_PUBLIC_PROJECT_NAME || "Project",
    "software development",
  ];

  // 2. Clean Content for Description
  const cleanDescription = postDetails.content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .substring(0, 160) // Standard SEO length
    .trim();

  const siteUrl =
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const apiImageUrl = process.env.NEXT_PUBLIC_API_IMAGE_URL || "";

  // Construct the full image URL
  const coverImage = postDetails.mainImage
    ? `${apiImageUrl}${postDetails.mainImage}`
    : `${siteUrl}/default-og-image.png`;

  const fullTitle = `${postDetails.title} | ${postDetails.topicTitle}`;

  return {
    title: fullTitle,
    description: cleanDescription,
    keywords: [...new Set(generatedKeywords)], // Remove duplicates
    authors: [{ name: postDetails.authorNickname || postDetails.author }],

    // Open Graph (Facebook, LinkedIn, Discord)
    openGraph: {
      title: fullTitle,
      description: cleanDescription,
      url: `${siteUrl}/post/${postDetails.slug}`,
      siteName: process.env.NEXT_PUBLIC_PROJECT_NAME || "Project",
      type: "article",
      publishedTime: new Date(postDetails.createdAt).toISOString(),
      section: postDetails.topicTitle,
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: postDetails.title,
        },
      ],
    },

    // Twitter / X Card
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: cleanDescription,
      images: [coverImage],
      creator: `@${postDetails.authorUsername}`,
    },

    // Technical SEO
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string; limit?: string };
}) {
  const postSlugData = await params;
  const postSlug = postSlugData.slug;
  const postDetails = await fetchPostDetail(postSlug);

  if (!postDetails) {
    return notFound();
  }

  const searchParamsData = await searchParams;
  const pageString = searchParamsData.page;
  const limitString = searchParamsData.limit;

  return (
    <div className="mx-auto space-y-8 ">
      <PostManagementActions post={postDetails} />

      <PostDetailsCard postDetails={postDetails} />

      <PostCreationWrapper
        topicId={postDetails.topicId}
        parentId={postDetails.id}
        buttonLabel="Post a Reply"
      />

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-12 bg-neutral-950 border border-neutral-900 rounded-4xl space-y-4">
            <Loader className="animate-spin text-cyan-500" size={20} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-neutral-600">
              Streaming Replies...
            </span>
          </div>
        }
      >
        <RepliesSection
          parentId={postDetails.id}
          page={Number(pageString) || 1}
          limit={Number(limitString) || 10}
        />
      </Suspense>
    </div>
  );
}

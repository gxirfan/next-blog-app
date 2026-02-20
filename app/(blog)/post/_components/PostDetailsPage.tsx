import { IPostResponse } from "@/app/types/post";
import { Clock } from "lucide-react";
import { cookies } from "next/headers";
import { IBaseResponse } from "@/app/types/common";
import { IVoteStatusResponse } from "@/app/types/vote";
import { prepareContentForImage } from "@/app/types/prepareContentForImage";
import Image from "next/image";
import PostDetailsFooter from "./PostDetailsFooter";
import PostDetailsHeader from "./PostDetailsHeader";
import { ENV } from "@/config/env.config";

interface PostDetailsCardProps {
  postDetails: IPostResponse;
}

async function fetchUserVoteDirection(postId: string): Promise<number | null> {
  const headersList = await cookies();
  const cookieHeader = headersList.toString();
  if (!cookieHeader) return null;

  try {
    const url = `${ENV.API_URL}/vote?postId=${postId}&type=post`;

    const response = await fetch(url, {
      headers: { Cookie: cookieHeader, "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) return null;
    const text = await response.text();
    if (!text) return null;
    const result = JSON.parse(text) as IBaseResponse<IVoteStatusResponse>;
    return result.data?.direction ?? 0;
  } catch (error) {
    console.error("User vote fetch error:", error);
    return null;
  }
}

const PostDetailsCard = async ({ postDetails }: PostDetailsCardProps) => {
  const userCurrentVoteDirection = await fetchUserVoteDirection(postDetails.id);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      {/* HEADER SECTION */}
      <PostDetailsHeader
        postDetails={postDetails}
        userCurrentVoteDirection={userCurrentVoteDirection}
      />

      {/* MAIN IMAGE */}
      {postDetails.mainImage && (
        <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-neutral-900 border border-neutral-800 mb-8">
          <Image
            src={ENV.API_IMAGE_URL + postDetails.mainImage}
            alt={postDetails.title}
            width={1200}
            height={675}
            className="w-full h-auto object-contain block"
            priority
          />
        </div>
      )}

      {/* CONTENT METRICS BAR */}
      <div className="flex items-center gap-4 mb-12 group">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/5 border border-cyan-500/20 rounded-lg shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-[0.3em]">
            Source Content
          </span>
        </div>
        <div className="h-px flex-1 bg-neutral-800" />
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <Clock size={12} className="text-neutral-500" />
          <span className="text-[11px] font-mono font-black text-neutral-300">
            {postDetails.readingTime || 1} min_read
          </span>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <article className="prose prose-invert max-w-none mb-20 text-xl leading-relaxed">
        <div
          dangerouslySetInnerHTML={{
            __html: prepareContentForImage(postDetails.content)
              .replace(
                /<h2/g,
                '<h2 style="font-size: 40px; font-weight: 900; color: white; margin-top: 50px; margin-bottom: 20px; line-height: 1.1;"',
              )
              .replace(
                /<h3/g,
                '<h3 style="font-size: 28px; font-weight: 800; color: #e5e5e5; margin-top: 40px; margin-bottom: 16px;"',
              )
              .replace(
                /<p/g,
                '<p style="font-size: 20px; line-height: 1.8; margin-bottom: 24px; color: #d4d4d4;"',
              ),
          }}
        />
      </article>

      {/* FOOTER SECTION */}
      <PostDetailsFooter postDetails={postDetails} />
    </div>
  );
};

export default PostDetailsCard;

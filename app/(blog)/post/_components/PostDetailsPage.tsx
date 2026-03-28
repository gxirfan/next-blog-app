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
import PostContentForScrollProgress from "./PostContentForScrollProgress";

interface PostDetailsCardProps {
  postDetails: IPostResponse;
}

async function fetchUserVoteDirection(postId: number): Promise<number | null> {
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
    <PostContentForScrollProgress>
      <div className="w-full mx-auto">
        {/* HEADER SECTION */}
        <PostDetailsHeader
          postDetails={postDetails}
          userCurrentVoteDirection={userCurrentVoteDirection}
        />

        {/* MAIN IMAGE */}
        {postDetails.mainImage && (
          <div className="relative w-full overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-neutral-900 border border-neutral-800 mb-6 md:mb-10">
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
        <div className="flex items-center gap-3 md:gap-6 mb-8 md:mb-12">
          <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 bg-neutral-900 border-2 border-neutral-800 rounded-full shrink-0">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-500" />
            <span className="text-[10px] md:text-[11px] font-black text-white tracking-[0.15em] md:tracking-[0.2em]">
              Content
            </span>
          </div>

          <div className="h-1px md:h-[2px] flex-1 bg-neutral-900" />

          <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 bg-neutral-900/30 border-2 border-transparent hover:border-neutral-800 rounded-full transition-all duration-300">
            <Clock size={12} strokeWidth={2.5} className="text-neutral-500" />
            <span className="text-[10px] md:text-[11px] font-bold text-neutral-400 tracking-widest uppercase">
              {postDetails.readingTime || 1} Min Read
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <article className="prose prose-invert max-w-none mb-20 text-base md:text-xl leading-relaxed">
          <div
            dangerouslySetInnerHTML={{
              __html: prepareContentForImage(postDetails.content)
                .replace(
                  /<h2/g,
                  '<h2 style="font-size: clamp(2rem, 5vw, 2.5rem); font-weight: 900; color: white; margin-top: 2rem; margin-bottom: 1rem; line-height: 1.1;"',
                )
                .replace(
                  /<h3/g,
                  '<h3 style="font-size: clamp(1.375rem, 4vw, 1.75rem); font-weight: 800; color: #e5e5e5; margin-top: 1.5rem; margin-bottom: 1rem;"',
                )
                .replace(
                  /<p/g,
                  '<p style="font-size: clamp(1rem, 3vw, 1.25rem); line-height: 1.7; margin-bottom: 1.5rem; color: #d4d4d4;"',
                ),
            }}
          />
        </article>

        {/* FOOTER SECTION */}
        <PostDetailsFooter
          postDetails={postDetails}
          userCurrentVoteDirection={userCurrentVoteDirection}
        />
      </div>
    </PostContentForScrollProgress>
  );
};

export default PostDetailsCard;

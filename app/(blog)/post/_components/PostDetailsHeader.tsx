import Link from "next/link";
import { CornerDownRight, FolderOpen } from "lucide-react";
import { IPostResponse } from "@/app/types/post";
import PostMetaBar from "./PostMetaBar";

interface HeaderProps {
  postDetails: IPostResponse;
  userCurrentVoteDirection: number | null;
}

export default function PostDetailsHeader({
  postDetails,
  userCurrentVoteDirection,
}: HeaderProps) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-8 text-[13px] text-neutral-400 font-medium">
        <Link
          href={`/topic/${postDetails.topicSlug}`}
          className="group flex items-center gap-2 pr-3 pl-2 py-1 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/10 hover:border-cyan-500/30 rounded-lg transition-all duration-300"
        >
          <div className="p-1 bg-cyan-500/20 rounded-md group-hover:bg-cyan-500 group-hover:text-black transition-all">
            <FolderOpen
              size={12}
              className="text-cyan-400 group-hover:text-inherit"
            />
          </div>
          <span className="group-hover:text-cyan-400 transition-colors">
            {postDetails.topicTitle}
          </span>
        </Link>

        {!!postDetails.parentId && (
          <>
            <div className="h-4 w-px bg-neutral-800 rotate-12 mx-1" />{" "}
            <Link
              href={`/post/${postDetails.parentSlug}`}
              className="group flex items-center gap-2 px-2 py-1 hover:text-neutral-200 transition-all"
            >
              <CornerDownRight
                size={14}
                className="text-neutral-600 group-hover:text-cyan-500 transition-colors"
              />
              <span className="text-neutral-500 group-hover:text-neutral-300 truncate max-w-[200px]">
                {postDetails.parentTitle}
              </span>
            </Link>
          </>
        )}
      </div>

      <h1 className="text-4xl md:text-6xl sm:text-5xl text-white leading-[1.1] tracking-normal mb-10 font-black">
        {postDetails.title}
      </h1>

      <PostMetaBar
        postDetails={postDetails}
        userCurrentVoteDirection={userCurrentVoteDirection}
      />
    </>
  );
}

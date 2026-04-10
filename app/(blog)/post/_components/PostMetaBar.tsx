import { Calendar, Eye } from "lucide-react";
import AuthorBlock from "@/app/components/AuthorBlock";
import VoteButtons from "./VoteButtons";
import { getRelativeTime } from "@/app/utils/date";
import { IPostResponse } from "@/app/types/post";

interface PostMetaBarProps {
  postDetails: IPostResponse;
  userCurrentVoteDirection: number | null;
  showBorder?: boolean;
}

export default function PostMetaBar({
  postDetails,
  userCurrentVoteDirection,
  showBorder = true,
}: PostMetaBarProps) {
  const authorProps = {
    username: postDetails.authorUsername,
    nickname: postDetails.authorNickname,
    role: postDetails.authorRole,
    avatarUrl: postDetails.authorAvatar,
  };

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 ${
        showBorder ? "border-b border-neutral-900" : ""
      } mb-12`}
    >
      <div className="flex items-center gap-6">
        <AuthorBlock {...authorProps} />
        <div className="h-10 w-px bg-neutral-800 hidden md:block" />
        <VoteButtons
          postId={postDetails.id}
          score={postDetails.score}
          userCurrentVoteDirection={userCurrentVoteDirection}
        />
      </div>

      <div className="flex items-center gap-8 text-[11px] font-bold tracking-widest text-neutral-600 font-mono">
        <div className="flex items-center gap-3 group">
          <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800">
            <Calendar size={14} />
          </div>
          <span className="text-neutral-400">
            {getRelativeTime(postDetails.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-3 group">
          <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-right">
            <Eye size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-400">
              {postDetails.viewCount} VIEWS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

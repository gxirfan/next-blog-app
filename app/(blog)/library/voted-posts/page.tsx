import { ArrowBigUp, ArrowBigDown, ListChecks, Hash } from "lucide-react";
import Link from "next/link";
import { fetchUserVotedPosts } from "./fetcher";
import { IVoteStatusResponse } from "@/app/types/vote";
import { getRequiredAuthSession } from "@/app/services/session";

export default async function VotedPostsPage() {
  const votedPosts = await fetchUserVotedPosts();

  await getRequiredAuthSession("/library/voted-posts");

  const TitleBar = (
    <div className="flex flex-col gap-2 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-cyan-400">
          <ListChecks size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
            Vote History
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-px w-4 bg-neutral-800" />
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-neutral-500 font-bold">
              Archived Operations ({votedPosts.length})
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (votedPosts.length === 0) {
    await getRequiredAuthSession("/library/voted-posts");
    return (
      <div className="container mx-auto p-6 max-w-4xl min-h-[60vh] flex flex-col justify-center">
        {TitleBar}
        <div className="bg-[#0d0d0d] border border-neutral-900 p-12 rounded-[2.5rem] text-center space-y-4">
          <div className="inline-flex p-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-600">
            <Hash size={32} />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            No data nodes detected in current session.
          </p>
          <Link
            href="/"
            className="inline-block text-[11px] font-black uppercase tracking-widest text-cyan-400 hover:text-white transition-colors underline underline-offset-8"
          >
            [ Start Exploration ]
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl mb-20">
      {TitleBar}

      <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {votedPosts.map((vote) => (
          <PostListItem key={vote.id} vote={vote} />
        ))}
      </div>
    </div>
  );
}

interface PostListItemProps {
  vote: IVoteStatusResponse;
}

const PostListItem = ({ vote }: PostListItemProps) => {
  const isUpvote = vote.direction === 1;
  const isDownvote = vote.direction === -1;

  const title = vote.title || "Untitled Post";
  const slug = vote.slug || "#";

  return (
    <div className="group relative flex items-center bg-[#0d0d0d] p-5 rounded-4xl border border-neutral-900 hover:border-cyan-500/30 transition-all duration-500">
      {/* Vote Indicator Node */}
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-2xl border transition-all duration-500 
                            ${
                              isUpvote
                                ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400"
                                : isDownvote
                                  ? "bg-red-500/5 border-red-500/20 text-red-400"
                                  : "bg-neutral-900 border-neutral-800 text-neutral-600"
                            }`}
      >
        {isUpvote ? (
          <ArrowBigUp
            size={28}
            strokeWidth={2.5}
            fill={isUpvote ? "currentColor" : "none"}
            className="opacity-80"
          />
        ) : isDownvote ? (
          <ArrowBigDown
            size={28}
            strokeWidth={2.5}
            fill={isDownvote ? "currentColor" : "none"}
            className="opacity-80"
          />
        ) : (
          <span className="font-mono text-xs">00</span>
        )}
      </div>

      <div className="grow ml-6">
        {/* <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border 
              ${isUpvote ? "border-cyan-500/30 text-cyan-500" : "border-red-500/30 text-red-500"}`}
          >
            {isUpvote ? "Positive" : "Negative"}
          </span>
        </div> */}
        <Link
          href={`/post/${slug}`}
          className="text-white text-lg font-bold tracking-tight group-hover:text-cyan-400 transition-colors block leading-tight"
        >
          {title}
        </Link>
        {/* <div
            className={`text-sm text-neutral-400 line-clamp-4 prose prose-invert leading-relaxed transition-colors`}
            dangerouslySetInnerHTML={{ __html: vote.content }}
          /> */}
      </div>

      {/* <div className="ml-4 flex flex-col items-end shrink-0">
        <div className="p-2 bg-neutral-900/50 rounded-lg border border-neutral-800/50 text-neutral-600 group-hover:text-cyan-400 transition-colors">
          <Clock size={14} />
        </div>
        <div className="mt-2 text-right text-neutral-600 font-mono text-[9px] uppercase tracking-tighter">
          {getRelativeTime(vote.createdAt) || "N/A"}
        </div>
      </div> */}

      {/* Background Accent for Hover */}
      <div className="absolute inset-0 bg-linear-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/2 opacity-0 group-hover:opacity-100 rounded-4xl transition-opacity pointer-events-none" />
    </div>
  );
};

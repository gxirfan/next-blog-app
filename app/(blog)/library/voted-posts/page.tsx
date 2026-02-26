import { ListChecks, Hash, ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchUserVotedPosts } from "./fetcher";
import { IVoteStatusResponse } from "@/app/types/vote";
import { getRequiredAuthSession } from "@/app/services/session";

export default async function VotedPostsPage() {
  const votedPosts = await fetchUserVotedPosts();

  await getRequiredAuthSession("/library/voted-posts");

  const TitleBar = (
    <div className="border-b-2 border-neutral-900 pb-12 mb-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-neutral-900 border-2 border-neutral-800 rounded-3xl flex items-center justify-center text-cyan-500">
              <ListChecks size={28} />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Your <span className="text-neutral-800">Votes</span>
          </h1>
          <div className="flex items-center gap-4 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-neutral-600 tracking-[0.3em]">
                Total Interactions:
              </span>
              <span className="text-xs font-black text-white tracking-widest bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                {votedPosts.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (votedPosts.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-5xl min-h-[70vh] flex flex-col justify-center">
        {TitleBar}
        <div className="bg-neutral-950 border-2 border-dashed border-neutral-900 p-20 rounded-[4rem] text-center space-y-8">
          <div className="inline-flex w-24 h-24 items-center justify-center bg-neutral-900 border-2 border-neutral-800 rounded-full text-neutral-800">
            <Hash size={48} />
          </div>
          <p className="text-xs font-black tracking-[0.3em] text-neutral-500">
            You haven't voted for any posts yet.
          </p>
          <Link
            href="/"
            className="inline-flex px-12 py-5 bg-white text-black rounded-full text-xs font-black tracking-[0.3em] hover:bg-cyan-500 transition-all active:scale-95"
          >
            Start Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl mb-32">
      {TitleBar}
      <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
  const title = vote.title || "Untitled Content";
  const slug = vote.slug || "#";

  return (
    <div className="group relative p-8 md:p-10 bg-neutral-950 border-2 border-neutral-900 rounded-[3rem] hover:border-neutral-700 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
      <div className="flex-1 min-w-0 space-y-6">
        {/* Vote Type & Date Row */}
        <div className="flex items-center gap-4">
          <div
            className={`px-4 py-1.5 rounded-full border-2 ${
              isUpvote
                ? "bg-cyan-500/10 border-cyan-500/20"
                : "bg-red-500/10 border-red-500/20"
            } flex items-center gap-2`}
          >
            <span
              className={`text-xs font-black tracking-widest ${
                isUpvote ? "text-cyan-500" : "text-red-500"
              }`}
            >
              {isUpvote ? "Upvoted" : "Downvoted"}
            </span>
          </div>
          <span className="text-xs font-black text-neutral-700 tracking-[0.2em]">
            Added to archive
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/post/${slug}`}
          className="text-2xl md:text-3xl font-black text-white hover:text-cyan-500 transition-colors block leading-tight tracking-tighter"
        >
          {title}
        </Link>

        {/* Feedback Row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
            <span className="text-xs font-black text-neutral-600 tracking-widest">
              Action:
            </span>
            <span className="text-xs font-black text-neutral-300">
              {isUpvote ? "Positive Feedback" : "Negative Feedback"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center gap-4 w-full md:w-auto pt-8 md:pt-0 border-t-2 md:border-t-0 border-neutral-900">
        <Link
          href={`/post/${slug}`}
          className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-neutral-900 border-2 border-neutral-800 rounded-full text-xs font-black tracking-[0.2em] text-neutral-400 hover:text-white hover:border-white transition-all active:scale-95"
        >
          View Content
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

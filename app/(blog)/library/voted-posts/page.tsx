import { ArrowBigUp, ArrowBigDown, ListChecks } from "lucide-react";
import Link from "next/link";
import { fetchUserVotedPosts } from "./fetcher";
import { IVoteStatusResponse } from "@/app/types/vote";
import { getRelativeTime } from "@/app/utils/date";

export default async function VotedPostsPage() {
  const votedPosts = await fetchUserVotedPosts();

  // if (votedPosts.length === 0 && userIsLoggedInCheck) redirect('/login');

  const TitleBar = (
    <div className="flex items-center space-x-2 border-b border-neutral-700 pb-3 mb-6">
      <ListChecks size={24} className="text-cyan-400" />
      <h1 className="text-3xl font-bold text-white">My Voted Posts</h1>
      <span className="text-neutral-500 text-lg">({votedPosts.length})</span>
    </div>
  );

  if (votedPosts.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        {TitleBar}
        <div className="bg-neutral-900 p-8 rounded-lg text-neutral-400 border border-neutral-700">
          You haven't voted on any posts yet. Start exploring!
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {TitleBar}

      <div className="space-y-4">
        {votedPosts.map((vote) => (
          <PostListItem key={vote.id} vote={vote} />
        ))}
      </div>
    </div>
  );
}

const PostListItem: React.FC<{ vote: IVoteStatusResponse }> = ({ vote }) => {
  const isUpvote = vote.direction === 1;
  const isDownvote = vote.direction === -1;

  const title = vote.title || "Untitled Post";
  const slug = vote.slug || "#";

  return (
    <div className="flex items-center bg-neutral-900 p-4 rounded-lg border border-neutral-700 transition-all duration-200">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 text-white font-bold text-lg 
                            ${
                              isUpvote
                                ? "bg-cyan-600/30"
                                : isDownvote
                                  ? "bg-red-600/30"
                                  : "bg-neutral-600/30"
                            }`}
      >
        {isUpvote ? (
          <ArrowBigUp size={24} className="text-cyan-400" />
        ) : isDownvote ? (
          <ArrowBigDown size={24} className="text-red-400" />
        ) : (
          "0"
        )}
      </div>

      <div className="grow">
        <Link
          href={`/post/${slug}`}
          className="text-white text-lg hover:text-cyan-400 hover:underline transition-colors"
        >
          {title}
        </Link>
        <div
          className={`text-sm text-neutral-400 line-clamp-4 prose prose-invert leading-relaxed transition-colors`}
          dangerouslySetInnerHTML={{ __html: vote.content }}
        />
      </div>

      <div className="ml-4 text-right text-neutral-500 text-xs">
        Voted: <br />
        {getRelativeTime(vote.updatedAt) || "N/A"}
      </div>
    </div>
  );
};

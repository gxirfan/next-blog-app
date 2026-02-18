import Link from "next/link";
import { ITopicResponse } from "@/app/types/topic";
import { getRelativeTime } from "@/app/utils/date";

interface TopicListProps {
  topics: ITopicResponse[];
}

const TopicList = ({ topics }: TopicListProps) => {
  const ACCENT_COLOR = "text-[#00bcd4]";

  if (topics.length === 0) {
    return (
      <p className="text-neutral-400 text-xl">
        There are no topics related to this tag yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          href={`/topic/${topic.slug}`}
          className="w-full flex justify-between items-center p-5 sm:p-6 bg-neutral-950 rounded-xl border border-gray-800 hover:border-cyan-400 transition-all duration-200 group"
        >
          <div className="flex flex-col space-y-1 w-full">
            <h3
              className={`text-xl font-bold text-neutral-300 hover:underline truncate transition-colors`}
            >
              {topic.title}
            </h3>
            <div
              className="text-sm text-neutral-400 mt-1 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: topic.content }}
            />

            <div className="flex justify-between line-clamp-2 mt-2 border-t border-gray-800 pt-2">
              <span className={`font-medium ${ACCENT_COLOR}`}>
                @{topic.authorNickname}
              </span>
              <div className="flex flex-col items-end shrink-0 text-sm font-mono">
                <span className="text-neutral-400">
                  Post Count: {topic.postCount.toString() || "N/A"}
                </span>
                <span className="text-neutral-400">
                  Last Post: {getRelativeTime(topic.lastPostAt) || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TopicList;

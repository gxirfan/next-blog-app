import {
  Search,
  ArrowUpRight,
  User,
  FileText,
  Layers,
  Tag,
  Zap,
} from "lucide-react";
import { SearchResult } from "../../types/search";
import { ENV } from "@/config/env.config";
import Image from "next/image";
import { cookies } from "next/headers";
import Link from "next/link";
import SearchInput from "./_components/SearchInput";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

async function getSearchResults(query: string) {
  if (!query || query.length < 2) return [];

  const cookieStore = await cookies();
  try {
    const res = await fetch(
      `${ENV.API_URL}/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          cookie: cookieStore.toString(),
        },
        next: { revalidate: 0 },
      },
    );
    const response = await res.json();
    return response.success ? response.data.data : [];
  } catch (error) {
    console.error("Search API Error:", error);
    return [];
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: query = "" } = await searchParams;
  const results: SearchResult[] = await getSearchResults(query);

  const getIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      user: <User size={16} />,
      post: <FileText size={16} />,
      tag: <Tag size={16} />,
      flow: <Zap size={16} />,
    };
    return icons[type] || <Layers size={16} />;
  };

  return (
    <div className="min-h-screen text-neutral-200 font-jetbrains-mono selection:bg-cyan-500/30">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter text-white flex items-center gap-3">
          <Search className="text-cyan-500" size={28} />
          {ENV.PROJECT_NAME} search
        </h1>
        <p className="text-neutral-500 text-sm">
          {query
            ? `Scanning indices for: "${query}"`
            : "Awaiting input sequence..."}
        </p>
      </div>

      {/* Input Field (Client Component) */}
      <SearchInput initialQuery={query} />

      {/* Results Section */}
      <div className="space-y-3">
        {results.length > 0 ? (
          results.map((item) => (
            <Link
              key={item.id}
              href={
                item.type === "post"
                  ? `/post/${item.url}`
                  : item.type === "flow"
                    ? `/stream/thread/${item.url}`
                    : item.type === "user"
                      ? `/user/${item.url}`
                      : item.type === "tag"
                        ? `/tag/${item.url}`
                        : item.type === "topic"
                          ? `/topic/${item.url}`
                          : `/${item.type}/${item.id}`
              }
              className="group block relative bg-neutral-900/30 border border-neutral-900 rounded-xl p-5 
             hover:border-neutral-700 hover:bg-neutral-900/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10 shrink-0">
                    {item.type === "user" && item.avatar ? (
                      <Image
                        src={ENV.API_IMAGE_URL + item.avatar}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="w-full h-full rounded-full object-cover border border-neutral-800 group-hover:border-cyan-500/50 transition-colors"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-lg bg-neutral-900 text-cyan-500 border border-neutral-800 group-hover:border-cyan-500/50 transition-colors">
                        {getIcon(item.type)}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-cyan-500/70 font-bold tracking-widest bg-cyan-500/10 px-1.5 py-0.5 rounded">
                        {item.type === "user"
                          ? "User"
                          : item.type === "post"
                            ? ENV.POST_TYPE
                            : item.type === "tag"
                              ? "Tag"
                              : item.type === "flow"
                                ? "Thread"
                                : "Other"}
                      </span>
                      <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    {item.description && (
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-1 leading-relaxed italic">
                        {item.type === "user"
                          ? `@${item.url || item.title.toLowerCase()}`
                          : item.description}
                      </p>
                    )}
                  </div>
                </div>
                <ArrowUpRight
                  className="text-neutral-700 group-hover:text-cyan-500 transition-colors"
                  size={18}
                />
              </div>
            </Link>
          ))
        ) : query.length >= 2 ? (
          <div className="text-center py-20 border border-dashed border-neutral-900 rounded-2xl">
            <p className="text-neutral-600">
              0 results found for &quot;{query}&quot; in the stream.
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-10">
            Start typing to search {ENV.PROJECT_NAME}...
          </p>
        )}
      </div>
    </div>
  );
}

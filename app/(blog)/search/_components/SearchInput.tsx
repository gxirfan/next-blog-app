"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SearchInput({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (term: string) => {
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.replace(`/search?${params.toString()}`);
    });
  };

  return (
    <div className="relative group mb-12">
      <input
        type="text"
        defaultValue={initialQuery}
        placeholder="Type to search..."
        autoFocus
        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 pl-12 
                   text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50
                   transition-all duration-300 placeholder:text-neutral-700"
        onChange={(e) => handleChange(e.target.value)}
      />
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isPending ? "text-cyan-500 animate-pulse" : "text-neutral-600 group-focus-within:text-cyan-500"}`}
        size={20}
      />
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const PaginationControls = ({ meta }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ensure 'page' is always treated as a number to avoid string concatenation like "1"+1 = "11"
  const currentPage = Number(meta.page);
  const totalPages = Number(meta.totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    router.push(createPageURL(pageNumber), { scroll: false });
  };

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-16 mb-12 select-none">
      {/* 1. PREV BUTTON */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-600 hover:text-cyan-500 hover:border-cyan-500/50 disabled:opacity-10 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>

      {/* 2. NUMBERS KAPSÜLÜ */}
      <div className="flex items-center gap-2 px-3 py-2 bg-neutral-950 border border-neutral-900 rounded-[2rem]">
        {getPageNumbers().map((p, index) => {
          if (p === "...") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-neutral-800"
              >
                <MoreHorizontal size={14} />
              </div>
            );
          }

          const isActive = p === currentPage;

          return (
            <button
              key={`page-${p}`}
              onClick={() => handlePageChange(p as number)}
              className={`
                relative w-10 h-10 rounded-xl text-[12px] transition-all duration-300 cursor-pointer
                ${
                  isActive
                    ? "bg-cyan-500 text-black scale-110"
                    : "text-neutral-600 hover:text-white hover:bg-neutral-900"
                }
              `}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* 3. NEXT BUTTON */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-600 hover:text-cyan-500 hover:border-cyan-500/50 disabled:opacity-10 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default PaginationControls;

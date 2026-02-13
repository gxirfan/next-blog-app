'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IMeta } from '../types/common';
import React from 'react';

interface LoadMoreButtonProps {
  meta: IMeta;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ meta }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const { page, totalPages } = meta;
  const isLastPage = page === totalPages;

  if (totalPages <= 1 || isLastPage) {
    return null; 
  }

  const createNextPageUrl = () => {
    const nextPage = Number(page) + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    
    return `${pathname}?${params.toString()}`;
  };

  const ButtonBaseClass = "px-6 py-3 rounded-lg font-bold text-sm transition-colors duration-200";
  const ACCENT_CLASS = 'bg-[#00bcd4] hover:bg-cyan-500 text-black';

  return (
    <div className="flex justify-center pt-8">
      
      <Link 
        href={createNextPageUrl()}
        className={`${ButtonBaseClass} ${ACCENT_CLASS}`}
        scroll={false}
      >
        Load More Topics ({totalPages - page} pages left)
      </Link>
      
    </div>
  );
};

export default LoadMoreButton;
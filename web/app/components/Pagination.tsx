"use client";

import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers with smart ellipsis window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Number of pages to show around current page

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("ellipsis-left");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("ellipsis-right");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrev = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav
      className="flex items-center justify-center gap-1.5 sm:gap-2 mt-12 mb-6 select-none"
      aria-label="Phân trang"
    >
      {/* Previous Page Button */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage <= 1 || isLoading}
        aria-label="Trang trước"
        className="flex items-center gap-1 px-3.5 sm:px-4 py-2 text-sm font-semibold rounded-xl border border-[#e5e3dc] bg-white text-[#1b1c1a] hover:bg-[#fff5f5] hover:border-[#ff6b6b]/40 hover:text-[#ff6b6b] disabled:opacity-40 disabled:pointer-events-none disabled:hover:bg-white disabled:hover:border-[#e5e3dc] transition-all duration-200 shadow-sm cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        <span className="hidden sm:inline">Trước</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pageNumbers.map((page, index) => {
          if (typeof page === "string") {
            return (
              <span
                key={`${page}-${index}`}
                className="w-8 sm:w-10 h-10 flex items-center justify-center text-[#8c706f] font-bold text-sm tracking-wider"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => !isActive && !isLoading && onPageChange(page)}
              disabled={isLoading}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Trang ${page}`}
              className={`w-9 sm:w-10 h-9 sm:h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#ff6b6b] text-white shadow-md shadow-[#ff6b6b]/25 border border-[#ff6b6b] scale-105"
                  : "bg-white text-[#1b1c1a] border border-[#e5e3dc] hover:border-[#ff6b6b]/40 hover:bg-[#fff5f5] hover:text-[#ff6b6b] shadow-sm"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage >= totalPages || isLoading}
        aria-label="Trang sau"
        className="flex items-center gap-1 px-3.5 sm:px-4 py-2 text-sm font-semibold rounded-xl border border-[#e5e3dc] bg-white text-[#1b1c1a] hover:bg-[#fff5f5] hover:border-[#ff6b6b]/40 hover:text-[#ff6b6b] disabled:opacity-40 disabled:pointer-events-none disabled:hover:bg-white disabled:hover:border-[#e5e3dc] transition-all duration-200 shadow-sm cursor-pointer"
      >
        <span className="hidden sm:inline">Sau</span>
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </nav>
  );
}

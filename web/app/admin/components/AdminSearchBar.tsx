"use client";

import React from "react";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  count?: number;
  totalCount?: number;
  unitLabel?: string;
  children?: React.ReactNode; // Extra filters or controls if needed
}

export default function AdminSearchBar({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  count,
  totalCount,
  unitLabel = "mục",
  children,
}: AdminSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#f4f4f0] p-4 rounded-2xl border border-[#e3e2df]">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-md">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c706f] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-[#e3e2df] text-sm text-[#1b1c1a] placeholder-[#8c706f]/70 focus:outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c706f] hover:text-[#1b1c1a] p-1 cursor-pointer transition-colors"
            aria-label="Xóa tìm kiếm"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Optional Children Filters & Stats Counter */}
      <div className="flex items-center gap-3 justify-between sm:justify-end">
        {children}

        {count !== undefined && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#584140]">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-[#e3e2df] font-mono font-bold text-[#ae2f34]">
              {count}
              {totalCount !== undefined && totalCount !== count
                ? ` / ${totalCount}`
                : ""}
            </span>
            <span>{unitLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

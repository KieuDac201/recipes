"use client";

import Link from "next/link";
import React from "react";

interface AdminEmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export default function AdminEmptyState({
  icon = "restaurant_menu",
  title,
  description,
  searchQuery,
  onClearSearch,
  actionText = "Tạo Công Thức Đầu Tiên",
  actionHref = "/admin/recipes/create",
  onActionClick,
}: AdminEmptyStateProps) {
  const displayTitle =
    title ||
    (searchQuery
      ? "Không tìm thấy kết quả phù hợp"
      : "Chưa có dữ liệu nào");

  const displayDesc =
    description ||
    (searchQuery
      ? `Không có kết quả nào khớp với từ khóa "${searchQuery}". Hãy thử tìm kiếm từ khóa khác.`
      : "Bắt đầu thêm dữ liệu mới để quản lý trên hệ thống Bếp Phương.");

  return (
    <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-[#efeeea] shadow-sm">
      <div className="w-16 h-16 rounded-3xl bg-[#efeeea] text-[#8c706f] flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <h4 className="font-[var(--font-headline)] font-bold text-lg text-[#1b1c1a] mb-1">
        {displayTitle}
      </h4>
      <p className="text-xs text-[#8c706f] max-w-sm mx-auto mb-6 leading-relaxed">
        {displayDesc}
      </p>

      {searchQuery && onClearSearch ? (
        <button
          type="button"
          onClick={onClearSearch}
          className="px-4 py-2 rounded-xl bg-[#efeeea] text-[#584140] font-[var(--font-headline)] text-xs font-bold hover:bg-[#e3e2df] transition-colors cursor-pointer"
        >
          Xóa Bộ Lọc Tìm Kiếm
        </button>
      ) : onActionClick ? (
        <button
          type="button"
          onClick={onActionClick}
          className="px-5 py-2.5 rounded-xl bg-[#ff6b6b] text-white font-[var(--font-headline)] text-xs font-bold hover:bg-[#ae2f34] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          {actionText}
        </button>
      ) : actionHref ? (
        <Link
          href={actionHref}
          className="px-5 py-2.5 rounded-xl bg-[#ff6b6b] text-white font-[var(--font-headline)] text-xs font-bold hover:bg-[#ae2f34] shadow-sm transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          {actionText}
        </Link>
      ) : null}
    </div>
  );
}


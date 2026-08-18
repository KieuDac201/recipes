"use client";

import Link from "next/link";

interface AdminEmptyStateProps {
  searchQuery?: string;
  onClearSearch: () => void;
}

export default function AdminEmptyState({
  searchQuery,
  onClearSearch,
}: AdminEmptyStateProps) {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-[#ff6b6b]/10 flex items-center justify-center text-[#ae2f34] mb-3">
        <span className="material-symbols-outlined text-[32px]">restaurant_menu</span>
      </div>
      <h4 className="font-[var(--font-headline)] font-bold text-lg text-[#1b1c1a] mb-1">
        {searchQuery ? "Không tìm thấy công thức phù hợp" : "Chưa có công thức nào"}
      </h4>
      <p className="text-sm text-[#584140] max-w-md mb-6">
        {searchQuery
          ? `Không có kết quả nào khớp với từ khóa "${searchQuery}". Hãy thử tìm kiếm từ khóa khác.`
          : "Bắt đầu thêm công thức món ăn mới để quản lý và chia sẻ trên hệ thống Bếp Phương."}
      </p>
      {searchQuery ? (
        <button
          type="button"
          onClick={onClearSearch}
          className="px-4 py-2 rounded-xl bg-[#efeeea] text-[#1b1c1a] font-[var(--font-headline)] text-xs font-bold hover:bg-[#e3e2df] transition-colors cursor-pointer"
        >
          Xóa Bộ Lọc Tìm Kiếm
        </button>
      ) : (
        <Link
          href="/admin/recipes/create"
          className="px-5 py-2.5 rounded-xl bg-[#ff6b6b] text-white font-[var(--font-headline)] text-xs font-bold hover:bg-[#e05656] shadow-sm transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tạo Công Thức Đầu Tiên
        </Link>
      )}
    </div>
  );
}

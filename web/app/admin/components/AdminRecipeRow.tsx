"use client";

import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/src/types/recipe";

interface AdminRecipeRowProps {
  recipe: Recipe;
  onApprove: (recipe: Recipe) => void;
  onReject: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onRestore: (recipe: Recipe) => void;
}

export default function AdminRecipeRow({
  recipe,
  onApprove,
  onReject,
  onDelete,
  onRestore,
}: AdminRecipeRowProps) {
  const formatDate = (dateInput: string | Date | undefined) => {
    if (!dateInput) return "Vừa tạo";
    try {
      const d = new Date(dateInput);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return String(dateInput);
    }
  };

  const isDeleted = Boolean(recipe.deleted_at);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 md:p-5 transition-colors items-center group ${
        isDeleted ? "bg-[#fbfaf9] opacity-80 hover:opacity-100 hover:bg-[#f5f4f0]" : "hover:bg-[#faf9f5]"
      }`}
    >
      {/* Title & Image & Cooking Info */}
      <div className="col-span-1 md:col-span-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#e9e8e4] flex-shrink-0 overflow-hidden flex items-center justify-center border border-[#e0bfbd]/40 relative group-hover:shadow-sm transition-shadow">
          {recipe.image_url ? (
            <Image
              alt={recipe.title}
              className="object-cover"
              src={recipe.image_url}
              fill
              sizes="48px"
            />
          ) : (
            <span className="material-symbols-outlined text-[#8c706f]">image</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className={`font-[var(--font-headline)] text-sm font-bold truncate transition-colors ${
                isDeleted
                  ? "text-[#8c706f] line-through group-hover:text-[#1b1c1a]"
                  : "text-[#1b1c1a] group-hover:text-[#ae2f34]"
              }`}
            >
              {recipe.title}
            </p>
            <span className="hidden sm:inline-block text-[11px] font-mono text-[#8c706f] bg-[#efeeea] px-1.5 py-0.5 rounded">
              #{recipe.id}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#8c706f]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              {recipe.prep_time_minutes + recipe.cook_time_minutes} phút
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">group</span>
              {recipe.servings} phần
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              {(recipe.view_count || 0).toLocaleString()}
            </span>
            <span className="font-mono text-[11px] text-[#8c706f]/80 truncate max-w-[140px]">
              /{recipe.slug}
            </span>
          </div>
        </div>
      </div>

      {/* Status & Date */}
      <div className="col-span-1 md:col-span-3 flex flex-wrap md:flex-col items-start gap-1.5">
        {isDeleted ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 font-[var(--font-headline)] text-xs font-bold">
            <span className="material-symbols-outlined text-[13px]">delete_outline</span>
            Đã xóa tạm
          </span>
        ) : recipe.status === "approved" ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-[var(--font-headline)] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Đã duyệt
          </span>
        ) : recipe.status === "rejected" ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-[var(--font-headline)] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Bị từ chối
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-[var(--font-headline)] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Chờ duyệt
          </span>
        )}
        <span className="text-xs text-[#8c706f]">
          Ngày tạo: {formatDate(recipe.created_at)}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-end gap-2 text-sm text-[#584140]">
        <div className="flex items-center gap-1">
          {/* Approve button (only if not deleted) */}
          {!isDeleted && recipe.status !== "approved" && (
            <button
              type="button"
              onClick={() => onApprove(recipe)}
              className="p-2 rounded-xl hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-all cursor-pointer"
              title="Duyệt công thức"
            >
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </button>
          )}

          {/* Reject button (only if not deleted) */}
          {!isDeleted && recipe.status !== "rejected" && (
            <button
              type="button"
              onClick={() => onReject(recipe)}
              className="p-2 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-700 transition-all cursor-pointer"
              title="Từ chối công thức"
            >
              <span className="material-symbols-outlined text-[20px]">cancel</span>
            </button>
          )}

          {/* View button */}
          <Link
            href={`/recipes/${recipe.slug || recipe.id}`}
            className="p-2 rounded-xl hover:bg-[#efeeea] text-[#584140] hover:text-[#006c4f] transition-all cursor-pointer"
            title="Xem trang công thức"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </Link>

          {/* Edit button (only if not deleted) */}
          {!isDeleted && (
            <Link
              href={`/admin/recipes/${recipe.id}/edit`}
              className="p-2 rounded-xl hover:bg-[#efeeea] text-[#584140] hover:text-[#ae2f34] transition-all cursor-pointer"
              title="Chỉnh sửa công thức"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </Link>
          )}

          {/* Delete vs Recovery Button */}
          {isDeleted ? (
            <button
              type="button"
              onClick={() => onRestore(recipe)}
              className="p-2 rounded-xl hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-all cursor-pointer"
              title="Khôi phục công thức"
            >
              <span className="material-symbols-outlined text-[20px]">restore_from_trash</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onDelete(recipe)}
              className="p-2 rounded-xl hover:bg-[#ffdad6] text-[#584140] hover:text-[#ba1a1a] transition-all cursor-pointer"
              title="Xóa công thức"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

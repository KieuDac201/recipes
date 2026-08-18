"use client";

import { Recipe } from "@/src/types/recipe";

interface ApproveRecipeModalProps {
  recipe: Recipe | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ApproveRecipeModal({
  recipe,
  isLoading,
  onClose,
  onConfirm,
}: ApproveRecipeModalProps) {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-md w-full p-6 md:p-8 shadow-2xl border border-[#efeeea] animate-in zoom-in-95 duration-200 relative">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 mx-auto">
          <span className="material-symbols-outlined text-[32px]">verified</span>
        </div>

        <h3 className="font-[var(--font-headline)] text-2xl font-extrabold text-[#1b1c1a] text-center mb-2">
          Xác Nhận Duyệt Công Thức?
        </h3>

        <p className="text-sm text-[#584140] text-center mb-6 leading-relaxed">
          Sau khi được duyệt, công thức này sẽ chuyển sang trạng thái <strong>Đã duyệt</strong> và hiển thị công khai cho mọi người xem.
        </p>

        {/* Target Recipe Preview Card */}
        <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-[#efeeea] flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#e9e8e4] overflow-hidden flex-shrink-0 flex items-center justify-center">
            {recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-[#8c706f]">image</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a] truncate">
              {recipe.title}
            </p>
            <p className="text-xs text-[#8c706f] truncate">
              ID: #{recipe.id} · /{recipe.slug}
            </p>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-[#efeeea] text-[#584140] font-[var(--font-headline)] text-sm font-bold hover:bg-[#e3e2df] transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-[var(--font-headline)] text-sm font-bold hover:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_0_#065f46] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                Đang Duyệt...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">check</span>
                Duyệt Công Thức
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

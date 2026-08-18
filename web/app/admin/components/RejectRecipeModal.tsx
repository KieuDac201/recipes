"use client";

import { Recipe } from "@/src/types/recipe";

interface RejectRecipeModalProps {
  recipe: Recipe | null;
  reason: string;
  error: string | null;
  isLoading: boolean;
  onChangeReason: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RejectRecipeModal({
  recipe,
  reason,
  error,
  isLoading,
  onChangeReason,
  onClose,
  onConfirm,
}: RejectRecipeModalProps) {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-md w-full p-6 md:p-8 shadow-2xl border border-[#efeeea] animate-in zoom-in-95 duration-200 relative">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mb-5 mx-auto">
          <span className="material-symbols-outlined text-[32px]">block</span>
        </div>

        <h3 className="font-[var(--font-headline)] text-2xl font-extrabold text-[#1b1c1a] text-center mb-2">
          Từ Chối Công Thức
        </h3>

        <p className="text-sm text-[#584140] text-center mb-4 leading-relaxed">
          Vui lòng nhập lý do từ chối để thông báo cho người đăng bài chỉnh sửa lại.
        </p>

        {/* Target Recipe Preview Card */}
        <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-[#efeeea] flex items-center gap-3.5 mb-4">
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

        {/* Reason Textarea */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#584140] mb-1.5 uppercase tracking-wider">
            Lý do từ chối <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => onChangeReason(e.target.value)}
            placeholder="Ví dụ: Hình ảnh chưa rõ nét, hướng dẫn các bước nấu còn thiếu..."
            className={`w-full p-3 rounded-xl border text-sm text-[#1b1c1a] placeholder:text-[#8c706f] focus:outline-none transition-colors ${
              error
                ? "border-red-500 focus:border-red-600 bg-red-50/30"
                : "border-[#e3e2df] focus:border-[#ff6b6b] bg-white"
            }`}
          />
          {error && <p className="text-xs text-red-600 font-semibold mt-1">{error}</p>}
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
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-[var(--font-headline)] text-sm font-bold hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_0_#991b1b] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                Đang Lưu...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Xác Nhận Từ Chối
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

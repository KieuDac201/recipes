"use client";

import Link from "next/link";
import { Recipe } from "@/src/types/recipe";

interface PublishSuccessModalProps {
  recipe: Recipe | null;
  onReset: () => void;
}

export function PublishSuccessModal({
  recipe,
  onReset,
}: PublishSuccessModalProps) {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-[32px] p-8 w-full max-w-[500px] text-center shadow-floating border border-[#efeeea] animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-[#00b083]/15 text-[#006c4f] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
          <span
            className="material-symbols-outlined text-[44px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        <h3 className="font-[var(--font-headline)] text-2xl md:text-3xl font-extrabold text-[#1b1c1a] mb-2">
          Xuất Bản Thành Công!
        </h3>

        <p className="text-sm md:text-base text-[#584140] mb-6">
          Món <strong className="text-[#1b1c1a] font-bold">&quot;{recipe.title}&quot;</strong> đã được lưu trữ an toàn trong cơ sở dữ liệu và tải ảnh lên Cloudinary thành công.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={`/recipes/${recipe.slug || recipe.id}`}
            className="btn-coral-punch w-full py-3.5 text-center font-[var(--font-headline)] font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
            Xem Món Ăn Trên Website
          </Link>

          <button
            type="button"
            onClick={onReset}
            className="btn-outline w-full py-3 text-center font-[var(--font-headline)] font-bold text-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Tạo Thêm Công Thức Khác
          </button>

          <Link
            href="/admin"
            className="text-xs text-[#8c706f] hover:text-[#ae2f34] py-2 transition-colors font-medium"
          >
            Quay lại Bảng Điều Khiển Quản Trị
          </Link>
        </div>
      </div>
    </div>
  );
}

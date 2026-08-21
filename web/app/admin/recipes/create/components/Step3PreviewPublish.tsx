"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getCategories } from "@/src/services/categoryApi";
import { Category, CreateRecipeFormData } from "@/src/types/recipe";

interface Step3Props {
  formData: CreateRecipeFormData;
  isPublishing: boolean;
  publishError: string | null;
  onBack: () => void;
  onPublish: () => void;
  isEditMode?: boolean;
  submitButtonLabel?: string;
  loadingLabel?: string;
}

export function Step3PreviewPublish({
  formData,
  isPublishing,
  publishError,
  onBack,
  onPublish,
  isEditMode = false,
  submitButtonLabel,
  loadingLabel,
}: Step3Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let isMounted = true;
    getCategories().then((data) => {
      if (isMounted) {
        setCategories(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Category names mapped from IDs
  const selectedCategories = categories.filter((c) =>
    formData.categories.includes(c.id)
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* ── Header Banner ──────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-2">
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#ffd167] text-[#765900] font-[var(--font-headline)] text-xs font-bold mb-2">
          Bước 3 / 3: Sẵn Sàng Xuất Bản
        </span>
        <h2 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a] tracking-tight mb-2">
          Kiểm Tra Lại Công Thức
        </h2>
        <p className="text-sm md:text-base text-[#584140]">
          Xem lại bản trình bày thực tế trước khi xuất bản lên GourmetPop.
        </p>
      </div>

      {/* ── Publish Error Banner ───────────────────────────────── */}
      {publishError && (
        <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-in shake">
          <span className="material-symbols-outlined text-[24px] mt-0.5">
            error
          </span>
          <div className="flex-1">
            <h4 className="font-[var(--font-headline)] font-bold text-sm">
              Không thể xuất bản công thức
            </h4>
            <p className="text-xs md:text-sm mt-0.5 text-[#410006]">
              {publishError}
            </p>
          </div>
        </div>
      )}

      {/* ── Preview Canvas ─────────────────────────────────────── */}
      <div className="bg-white rounded-[28px] shadow-[0_10px_30px_rgba(255,107,107,0.06)] border border-[#e3e2df] p-6 md:p-10 relative overflow-hidden">
        {/* Hero Image & Category Tags */}
        <div className="w-full h-72 md:h-[420px] rounded-2xl overflow-hidden mb-8 relative group border border-[#efeeea] bg-[#faf9f5]">
          {formData.imageUrl ? (
            <Image
              src={formData.imageUrl}
              alt={formData.title || "Ảnh món ăn"}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              unoptimized={formData.imageUrl.startsWith("blob:") || formData.imageUrl.startsWith("data:")}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#efeeea] flex flex-col items-center justify-center text-[#8c706f]">
              <span className="material-symbols-outlined text-6xl mb-2">
                restaurant
              </span>
              <span className="text-sm font-medium">Chưa có ảnh đại diện món ăn</span>
            </div>
          )}

          {/* Category Badges */}
          <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end max-w-[80%]">
            {selectedCategories.length > 0 ? (
              selectedCategories.map((cat) => (
                <span
                  key={cat.id}
                  className="bg-[#00b083] text-white px-3.5 py-1 rounded-full font-[var(--font-headline)] text-xs font-bold shadow-md"
                >
                  {cat.name}
                </span>
              ))
            ) : (
              <span className="bg-[#8c706f] text-white px-3.5 py-1 rounded-full font-[var(--font-headline)] text-xs font-bold shadow-md">
                Chưa chọn danh mục
              </span>
            )}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content (Title, Bento, Instructions) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a] mb-3">
                {formData.title || "Tên Món Ăn"}
              </h2>
              <p className="text-base text-[#584140] leading-relaxed">
                {formData.description || "Chưa có mô tả cho món ăn này."}
              </p>
            </div>

            {/* Meta Details Bento (Difficulty removed) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#faf9f5] border border-[#efeeea] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#ae2f34] mb-1">timer</span>
                <span className="font-[var(--font-headline)] text-[10px] font-bold text-[#8c706f] uppercase tracking-wider">
                  Chuẩn Bị
                </span>
                <span className="font-[var(--font-headline)] text-base font-bold text-[#1b1c1a]">
                  {formData.prepTimeMinutes || 0} phút
                </span>
              </div>

              <div className="bg-[#faf9f5] border border-[#efeeea] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#ae2f34] mb-1">skillet</span>
                <span className="font-[var(--font-headline)] text-[10px] font-bold text-[#8c706f] uppercase tracking-wider">
                  Nấu Nướng
                </span>
                <span className="font-[var(--font-headline)] text-base font-bold text-[#1b1c1a]">
                  {formData.cookTimeMinutes || 0} phút
                </span>
              </div>

              <div className="bg-[#faf9f5] border border-[#efeeea] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#ae2f34] mb-1">group</span>
                <span className="font-[var(--font-headline)] text-[10px] font-bold text-[#8c706f] uppercase tracking-wider">
                  Khẩu Phần
                </span>
                <span className="font-[var(--font-headline)] text-base font-bold text-[#1b1c1a]">
                  {formData.servings || 1} người
                </span>
              </div>
            </div>

            {/* Instructions Timeline Preview */}
            <div>
              <h3 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6b6b]">format_list_numbered</span>
                Hướng Dẫn Thực Hiện Chi Tiết ({formData.instructions.length} bước)
              </h3>

              <div className="space-y-6">
                {formData.instructions.map((step) => (
                  <div key={step.id} className="flex gap-4 items-start bg-[#faf9f5] p-5 rounded-2xl border border-[#efeeea]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center font-[var(--font-headline)] text-sm font-bold mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-[var(--font-headline)] font-bold text-[#1b1c1a] text-base">
                        {step.title || `Bước ${step.stepNumber}`}
                      </h4>
                      <p className="text-sm text-[#584140] leading-relaxed whitespace-pre-line">
                        {step.instruction || "Chưa có nội dung hướng dẫn cho bước này."}
                      </p>
                      {step.imageUrl && (
                        <div className="relative mt-3 rounded-xl overflow-hidden h-64 max-w-md border border-[#efeeea]">
                          <Image
                            src={step.imageUrl}
                            alt={step.title || `Bước ${step.stepNumber}`}
                            fill
                            sizes="448px"
                            unoptimized={step.imageUrl.startsWith("blob:") || step.imageUrl.startsWith("data:")}
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (Ingredients Summary) */}
          <div>
            <div className="bg-[#faf9f5] border border-[#efeeea] p-6 rounded-2xl sticky top-24">
              <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#1b1c1a] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ae2f34]">kitchen</span>
                Nguyên Liệu ({formData.ingredients.filter((i) => i.name.trim()).length})
              </h3>
              <ul className="space-y-3">
                {formData.ingredients
                  .filter((ing) => ing.name.trim())
                  .map((ing) => (
                    <li
                      key={ing.id}
                      className="flex justify-between items-start gap-4 border-b border-[#e3e2df]/60 pb-2 text-sm"
                    >
                      <span className="text-[#1b1c1a] font-medium leading-snug flex-1 min-w-0">
                        {ing.name}
                      </span>
                      <span className="font-[var(--font-headline)] font-bold text-[#584140] shrink-0 text-right whitespace-nowrap">
                        {ing.amount} {ing.unit}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Bottom Contextual Bar ──────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#e3e2df] px-4 md:px-12 py-4 flex justify-between items-center shadow-lg">
        <button
          type="button"
          onClick={onBack}
          disabled={isPublishing}
          className="px-5 py-2.5 rounded-full font-[var(--font-headline)] text-sm font-bold text-[#ae2f34] hover:bg-[#ff6b6b]/10 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          Quay Lại Chỉnh Sửa
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="btn-coral-punch px-8 py-3.5 rounded-full font-[var(--font-headline)] text-sm font-bold flex items-center gap-2 elevation-fab text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
        >
          {isPublishing ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">
                progress_activity
              </span>
              {loadingLabel || (isEditMode ? "Đang Cập Nhật Công Thức..." : "Đang Xuất Bản Lên Hệ Thống...")}
            </>
          ) : (
            <>
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              {submitButtonLabel || (isEditMode ? "Cập Nhật Công Thức" : "Xuất Bản Công Thức")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

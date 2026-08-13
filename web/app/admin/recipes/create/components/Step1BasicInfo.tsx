"use client";

import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { CategorySelector } from "./CategorySelector";
import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { StepNavigationFooter } from "./StepNavigationFooter";
import { CreateRecipeFormData } from "@/src/types/recipe";

interface Step1Props {
  formData: CreateRecipeFormData;
  updateField: <K extends keyof CreateRecipeFormData>(
    field: K,
    value: CreateRecipeFormData[K]
  ) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPreview: () => void;
}

export function Step1BasicInfo({
  formData,
  updateField,
  errors,
  onNext,
  onPreview,
}: Step1Props) {
  const [isSlugLocked, setIsSlugLocked] = useState(true);

  // Auto-generate slug from Vietnamese title
  const handleTitleChange = (newTitle: string) => {
    updateField("title", newTitle);
    if (isSlugLocked) {
      const autoSlug = newTitle
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      updateField("slug", autoSlug);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* ── Section 1: Core Information ───────────────────────── */}
      <FormSection
        icon="edit_note"
        title="Thông Tin Cơ Bản"
        required
        subtitle="Điền tiêu đề, đường dẫn tĩnh và danh mục món ăn"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Title */}
          <FormField
            label="Tên Công Thức"
            required
            error={errors.title}
            rightElement={
              <span className="text-xs text-[#8c706f]">
                {formData.title.length}/120
              </span>
            }
          >
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ví dụ: Phở Bò Tái Lăn Hà Nội"
              maxLength={120}
              className={`vibrant-input text-base ${
                errors.title ? "border-[#ba1a1a] focus:border-[#ba1a1a]" : ""
              }`}
            />
          </FormField>

          {/* Slug */}
          <FormField
            label="Đường Dẫn Tĩnh (Slug)"
            required
            error={errors.slug}
            rightElement={
              <button
                type="button"
                onClick={() => setIsSlugLocked(!isSlugLocked)}
                className="text-xs text-[#ae2f34] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isSlugLocked ? "lock" : "lock_open"}
                </span>
                <span>{isSlugLocked ? "Tự động" : "Tùy chỉnh"}</span>
              </button>
            }
          >
            <input
              type="text"
              value={formData.slug}
              readOnly={isSlugLocked}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="pho-bo-tai-lan-ha-noi"
              className={`vibrant-input text-sm font-mono text-[#584140] w-full ${
                isSlugLocked ? "bg-[#f4f4f0]/80 cursor-not-allowed" : "bg-white"
              } ${errors.slug ? "border-[#ba1a1a]" : ""}`}
            />
          </FormField>
        </div>

        {/* Description */}
        <div className="mb-6">
          <FormField
            label="Mô Tả Ngắn"
            rightElement={
              <span className="text-xs text-[#8c706f]">
                {(formData.description || "").length}/500
              </span>
            }
          >
            <textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Mô tả ngắn gọn, hấp dẫn về hương vị, nguồn gốc hoặc điểm đặc biệt của món ăn..."
              maxLength={500}
              className="vibrant-input min-h-[110px] resize-y text-sm leading-relaxed"
            />
          </FormField>
        </div>

        {/* Categories Multi-select */}
        <CategorySelector
          selectedIds={formData.categories}
          onChange={(newIds) => updateField("categories", newIds)}
          error={errors.categories}
        />
      </FormSection>

      {/* ── Section 2: Time & Servings (Difficulty removed) ────── */}
      <FormSection
        icon="schedule"
        title="Thời Gian & Khẩu Phần"
        required
        subtitle="Ước lượng thời gian và số lượng khẩu phần ăn"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Prep Time */}
          <FormField
            label="Chuẩn bị (phút)"
            icon="timer"
            required
            error={errors.prepTimeMinutes}
          >
            <input
              type="number"
              min={0}
              value={formData.prepTimeMinutes}
              onChange={(e) => updateField("prepTimeMinutes", e.target.value)}
              placeholder="15"
              className={`vibrant-input ${
                errors.prepTimeMinutes ? "border-[#ba1a1a]" : ""
              }`}
            />
          </FormField>

          {/* Cook Time */}
          <FormField
            label="Nấu nướng (phút)"
            icon="skillet"
            required
            error={errors.cookTimeMinutes}
          >
            <input
              type="number"
              min={0}
              value={formData.cookTimeMinutes}
              onChange={(e) => updateField("cookTimeMinutes", e.target.value)}
              placeholder="30"
              className={`vibrant-input ${
                errors.cookTimeMinutes ? "border-[#ba1a1a]" : ""
              }`}
            />
          </FormField>

          {/* Servings */}
          <FormField
            label="Khẩu phần (người)"
            icon="group"
            required
            error={errors.servings}
          >
            <input
              type="number"
              min={1}
              value={formData.servings}
              onChange={(e) => updateField("servings", e.target.value)}
              placeholder="4"
              className={`vibrant-input ${
                errors.servings ? "border-[#ba1a1a]" : ""
              }`}
            />
          </FormField>
        </div>
      </FormSection>

      {/* ── Section 3: Hero Image Upload ──────────────────────── */}
      <FormSection
        icon="photo_camera"
        title="Ảnh Đại Diện Món Ăn"
        required
        badge={
          <span className="text-xs text-[#8c706f]">
            Tối ưu qua Cloudinary CDN
          </span>
        }
      >
        <ImageUploader
          value={formData.imageUrl || null}
          onChange={(url) => updateField("imageUrl", url || "")}
          variant="hero"
          label="Ảnh đại diện món ăn"
        />

        {errors.imageUrl && (
          <p className="text-xs text-[#ba1a1a] font-medium flex items-center gap-1 mt-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{errors.imageUrl}</span>
          </p>
        )}
      </FormSection>

      {/* ── Actions Footer ─────────────────────────────────────── */}
      <StepNavigationFooter
        stepInfo="Bước 1 / 3: Thiết lập thông tin món ăn"
        onPreview={onPreview}
        onNext={onNext}
        nextLabel="Tiếp Tục: Nguyên Liệu & Các Bước"
      />
    </div>
  );
}

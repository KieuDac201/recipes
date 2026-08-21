"use client";

import { useState, useEffect } from "react";
import { Category } from "@/src/types/recipe";

interface CategoryModalProps {
  isOpen: boolean;
  category?: Category | null; // null/undefined for create mode, category object for edit mode
  isLoading: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (data: { name: string; slug: string }) => void;
}

// Utility to generate URL-friendly slug from Vietnamese text
const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default function CategoryModal({
  isOpen,
  category,
  isLoading,
  error,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isEditMode = !!category;

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setAutoGenerateSlug(false);
    } else {
      setName("");
      setSlug("");
      setAutoGenerateSlug(true);
    }
    setValidationError(null);
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    setValidationError(null);
    if (autoGenerateSlug) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setAutoGenerateSlug(false);
    setValidationError(null);
  };

  const handleRegenerateSlug = () => {
    const generated = generateSlug(name);
    setSlug(generated);
    setAutoGenerateSlug(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError("Vui lòng nhập tên danh mục.");
      return;
    }
    const finalSlug = slug.trim() || generateSlug(name);
    if (!finalSlug) {
      setValidationError("Vui lòng nhập hoặc tạo slug hợp lệ.");
      return;
    }
    onSubmit({ name: name.trim(), slug: finalSlug });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#efeeea] animate-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ff6b6b]/10 text-[#ff6b6b] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">
                {isEditMode ? "edit_note" : "add_circle"}
              </span>
            </div>
            <div>
              <h3 className="font-[var(--font-headline)] text-xl font-extrabold text-[#1b1c1a]">
                {isEditMode ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
              </h3>
              <p className="text-xs text-[#8c706f]">
                {isEditMode
                  ? `Cập nhật thông tin cho danh mục #${category.id}`
                  : "Tạo danh mục mới để phân loại công thức món ăn"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-[#8c706f] hover:text-[#1b1c1a] hover:bg-[#efeeea] p-2 rounded-xl transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Error Notification */}
        {(error || validationError) && (
          <div className="p-3.5 mb-5 rounded-2xl bg-[#ffdad6]/60 border border-[#ffdad6] text-[#ba1a1a] text-xs font-semibold flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] flex-shrink-0">
              error
            </span>
            <span>{error || validationError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-xs font-bold text-[#584140] mb-1.5 uppercase tracking-wide">
              Tên Danh Mục <span className="text-[#ff6b6b]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="VD: Món Tráng Miệng, Canh & Súp..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-[#faf9f5] border border-[#e3e2df] text-sm text-[#1b1c1a] placeholder-[#8c706f]/60 focus:outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
              autoFocus
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#584140] uppercase tracking-wide">
                Đường Dẫn Slug <span className="text-[#ff6b6b]">*</span>
              </label>
              {name && (
                <button
                  type="button"
                  onClick={handleRegenerateSlug}
                  className="text-xs text-[#ff6b6b] hover:text-[#ae2f34] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  Tạo lại từ tên
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="VD: mon-trang-mieng"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-[#faf9f5] border border-[#e3e2df] text-sm font-mono text-[#584140] placeholder-[#8c706f]/60 focus:outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
              />
            </div>
            <p className="text-[11px] text-[#8c706f] mt-1">
              Được dùng trên URL: <code className="bg-[#efeeea] px-1 py-0.5 rounded text-[#584140]">/category/{slug || "slug-danh-muc"}</code>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#efeeea] mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-[#efeeea] text-[#584140] font-[var(--font-headline)] text-sm font-bold hover:bg-[#e3e2df] transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-[#ff6b6b] text-white font-[var(--font-headline)] text-sm font-bold hover:bg-[#ae2f34] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_0_#ae2f34] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    {isEditMode ? "save" : "add"}
                  </span>
                  {isEditMode ? "Cập Nhật" : "Tạo Mới"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

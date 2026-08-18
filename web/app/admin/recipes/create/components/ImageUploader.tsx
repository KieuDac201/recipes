"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { uploadImage, validateImageFile } from "@/src/services/uploadApi";

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  variant?: "hero" | "compact";
  aspectRatio?: string;
  disabled?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label = "Ảnh minh họa",
  variant = "hero",
  disabled = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Tệp không hợp lệ.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const data = await uploadImage(file);
      onChange(data.url);
    } catch (err: any) {
      console.error("[ImageUploader] Upload failed:", err);
      setUploadError(err?.message || "Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setUploadError(null);
  };

  // Compact variant (used for step instruction thumbnail)
  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-1.5">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && !disabled && fileInputRef.current?.click()}
          className={`w-full md:w-48 h-36 md:h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group select-none ${
            isDragging
              ? "border-[#ff6b6b] bg-[#ffdad8]/30 scale-[1.02]"
              : "border-[#8c706f]/30 bg-[#faf9f5] hover:bg-[#efeeea] hover:border-[#ff6b6b]/60"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center p-3 text-center">
              <span className="material-symbols-outlined animate-spin text-[#ff6b6b] text-2xl mb-1">
                progress_activity
              </span>
              <span className="font-[var(--font-headline)] text-[11px] font-bold text-[#584140]">
                Đang tải...
              </span>
            </div>
          ) : value ? (
            <>
              <img
                src={value}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                <span className="text-white font-[var(--font-headline)] text-xs font-bold flex items-center gap-1 bg-[#ff6b6b] px-2.5 py-1 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  Đổi
                </span>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-white hover:text-[#ffdad6] p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                  title="Xóa ảnh"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-[#8c706f] group-hover:text-[#ae2f34] transition-colors p-2 text-center">
              <span className="material-symbols-outlined text-2xl mb-1 group-hover:scale-110 transition-transform">
                add_photo_alternate
              </span>
              <span className="font-[var(--font-headline)] text-xs font-bold">
                Thêm ảnh
              </span>
            </div>
          )}
        </div>

        {uploadError && (
          <p className="text-[11px] text-[#ba1a1a] font-medium leading-tight max-w-48">
            {uploadError}
          </p>
        )}
      </div>
    );
  }

  // Hero banner variant (used for main recipe image)
  return (
    <div className="w-full flex flex-col gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#e3e2df] aspect-[16/7] md:aspect-[21/8] min-h-[260px] md:min-h-[340px] max-h-[440px] group shadow-sm bg-[#faf9f5]">
          <img
            src={value}
            alt="Ảnh xem trước món ăn"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />

          {/* Badge Cloudinary Verified */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-[var(--font-headline)] font-bold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[#06d6a0] text-[16px]">
              verified
            </span>
            <span>Cloudinary Optimized</span>
          </div>

          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn-coral-punch cursor-pointer text-sm flex items-center gap-1.5 px-5 py-2.5 shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">upload</span>
              Đổi Ảnh Mới
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-white/95 text-[#ba1a1a] hover:bg-white px-4 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-1 shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Xóa Ảnh
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-12 md:p-14 min-h-[220px] md:min-h-[280px] flex flex-col items-center justify-center text-center cursor-pointer transition-all group relative overflow-hidden select-none ${
            isDragging
              ? "border-[#ff6b6b] bg-[#ffdad8]/30 scale-[1.01]"
              : "border-[#8c706f]/40 bg-[#f4f4f0] hover:bg-[#efeeea] hover:border-[#ff6b6b]"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <span className="material-symbols-outlined animate-spin text-[#ff6b6b] text-5xl mb-3">
                progress_activity
              </span>
              <p className="font-[var(--font-headline)] font-bold text-lg text-[#1b1c1a] mb-1">
                Đang tải và tối ưu ảnh lên Cloudinary...
              </p>
              <p className="text-sm text-[#584140]">
                Ảnh đang được chuyển đổi WebP/AVIF tự động
              </p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-[#ff6b6b]/10 text-[#ff6b6b] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[36px]">
                  cloud_upload
                </span>
              </div>
              <p className="font-[var(--font-headline)] font-bold text-base md:text-lg text-[#1b1c1a] mb-1">
                Kéo và thả ảnh đại diện món ăn vào đây
              </p>
              <p className="text-sm text-[#584140]">
                hoặc bấm để chọn tệp từ thiết bị (JPG, PNG, WebP, GIF tối đa 5MB)
              </p>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 text-[#ba1a1a] bg-[#ffdad6]/60 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-medium animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}

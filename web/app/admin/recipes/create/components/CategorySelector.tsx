"use client";

import { useEffect, useState } from "react";
import { CustomSelect, SelectOption } from "./CustomSelect";
import { getCategories } from "@/src/services/categoryApi";
import { Category } from "@/src/types/recipe";

interface CategorySelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  error?: string;
}

export function CategorySelector({
  selectedIds,
  onChange,
  error,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        console.error("[CategorySelector] Failed to fetch categories:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const categoryOptions: SelectOption<number>[] = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a] flex items-center gap-1.5">
          <span>Danh Mục Món Ăn</span>
          <span className="text-[#ae2f34]">*</span>
          <span className="text-xs font-normal text-[#584140]">
            (Chọn 1 hoặc nhiều danh mục)
          </span>
        </label>
        {selectedIds.length > 0 && (
          <span className="text-xs font-[var(--font-headline)] font-bold text-[#006c4f] bg-[#00b083]/15 px-2.5 py-0.5 rounded-full">
            Đã chọn {selectedIds.length} danh mục
          </span>
        )}
      </div>

      <CustomSelect<number>
        options={categoryOptions}
        value={selectedIds}
        onChange={onChange}
        isMulti={true}
        isSearchable={true}
        isClearable={true}
        placeholder={
          isLoading
            ? "Đang tải danh mục..."
            : "Tìm kiếm và chọn danh mục món ăn..."
        }
        error={!!error}
      />

      {error && (
        <p className="text-xs text-[#ba1a1a] font-medium flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[16px]">error</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

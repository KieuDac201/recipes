"use client";

import { CustomSelect, SelectOption } from "./CustomSelect";
import { CategoryOption } from "@/src/types/recipe";

export const AVAILABLE_CATEGORIES: CategoryOption[] = [
  { id: 1, name: "Món Việt", slug: "mon-viet" },
  { id: 2, name: "Món Nước", slug: "mon-nuoc" },
  { id: 3, name: "Món Ăn Đường Phố", slug: "mon-an-duong-pho" },
  { id: 4, name: "Bữa Sáng", slug: "bua-sang" },
  { id: 21, name: "Món Cuốn", slug: "mon-cuon" },
  { id: 22, name: "Món Cơm", slug: "mon-com" },
  { id: 23, name: "Món Ăn Sáng", slug: "mon-an-sang" },
  { id: 24, name: "Món Nhậu / Nhắm", slug: "mon-nhau" },
];

const CATEGORY_OPTIONS: SelectOption<number>[] = AVAILABLE_CATEGORIES.map((c) => ({
  value: c.id,
  label: c.name,
}));

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
        options={CATEGORY_OPTIONS}
        value={selectedIds}
        onChange={onChange}
        isMulti={true}
        isSearchable={true}
        isClearable={true}
        placeholder="Tìm kiếm và chọn danh mục món ăn..."
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

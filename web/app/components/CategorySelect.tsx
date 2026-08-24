"use client";

import type { Category } from "@/src/types/recipe";

export interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (categoryValue: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function CategorySelect({
  categories,
  value,
  onChange,
  disabled = false,
  className = "",
}: CategorySelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative inline-block">
        <label htmlFor="category-filter-select" className="sr-only">
          Lọc theo danh mục
        </label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c706f]">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            category
          </span>
        </div>
        <select
          id="category-filter-select"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="appearance-none bg-white border border-[#e5e3dc] rounded-full py-2.5 pl-10 pr-10 text-sm font-medium text-[#1b1c1a] shadow-xs cursor-pointer hover:border-[#ff6b6b]/40 hover:bg-[#faf9f5] focus:outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed max-w-[200px] sm:max-w-[260px] truncate"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.slug || String(category.id)}
            >
              {category.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#8c706f]">
          <span className="material-symbols-outlined text-[18px]">
            unfold_more
          </span>
        </div>
      </div>
    </div>
  );
}

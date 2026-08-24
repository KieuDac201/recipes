"use client";

import type { RecipeSortBy, SortOrder } from "@/src/types/recipe";

export interface RecipeSortOption {
  id: string;
  label: string;
  sortBy: RecipeSortBy;
  sortOrder: SortOrder;
  icon?: string;
}

export const RECIPE_SORT_OPTIONS: RecipeSortOption[] = [
  {
    id: "newest",
    label: "Mới nhất",
    sortBy: "created_at",
    sortOrder: "desc",
    icon: "schedule",
  },
  {
    id: "oldest",
    label: "Cũ nhất",
    sortBy: "created_at",
    sortOrder: "asc",
    icon: "history",
  },
  {
    id: "most_viewed",
    label: "Nhiều lượt view nhất",
    sortBy: "view_count",
    sortOrder: "desc",
    icon: "visibility",
  },
  {
    id: "least_viewed",
    label: "Ít lượt view nhất",
    sortBy: "view_count",
    sortOrder: "asc",
    icon: "visibility_off",
  },
];

export interface RecipeSortSelectProps {
  value: RecipeSortOption;
  onChange: (option: RecipeSortOption) => void;
  disabled?: boolean;
  className?: string;
}

export default function RecipeSortSelect({
  value,
  onChange,
  disabled = false,
  className = "",
}: RecipeSortSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = RECIPE_SORT_OPTIONS.find((opt) => opt.id === e.target.value);
    if (selected) {
      onChange(selected);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative inline-block">
        <label htmlFor="recipe-sort-select" className="sr-only">
          Sắp xếp công thức
        </label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c706f]">
          <span className="material-symbols-outlined text-[18px]">
            {value.icon || "sort"}
          </span>
        </div>
        <select
          id="recipe-sort-select"
          value={value.id}
          onChange={handleChange}
          disabled={disabled}
          className="appearance-none bg-white border border-[#e5e3dc] rounded-full py-2.5 pl-10 pr-10 text-sm font-medium text-[#1b1c1a] shadow-xs cursor-pointer hover:border-[#ff6b6b]/40 hover:bg-[#faf9f5] focus:outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {RECIPE_SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
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

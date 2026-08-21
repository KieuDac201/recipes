"use client";

import { Category } from "@/src/types/recipe";

interface CategoryTableRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTableRow({
  category,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  return (
    <tr className="hover:bg-[#faf9f5] transition-colors group">
      {/* ID */}
      <td className="py-4 px-6 font-mono text-xs text-[#8c706f] font-semibold">
        #{category.id}
      </td>

      {/* Name */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <span className="font-[var(--font-headline)] font-bold text-[#1b1c1a] text-base">
            {category.name}
          </span>
        </div>
      </td>

      {/* Slug */}
      <td className="py-4 px-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f4f4f0] text-xs font-mono text-[#584140] border border-[#e3e2df]">
          /{category.slug}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="p-2 rounded-xl text-[#584140] hover:text-[#1b1c1a] hover:bg-[#efeeea] transition-all cursor-pointer"
            title="Chỉnh sửa danh mục"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="p-2 rounded-xl text-[#ba1a1a] hover:text-[#93000a] hover:bg-[#ffdad6]/50 transition-all cursor-pointer"
            title="Xóa danh mục"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
}

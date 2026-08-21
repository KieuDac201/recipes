import Link from "next/link";
import Image from "next/image";
import type { Recipe, RecipeStatus } from "@/src/types/recipe";

export interface RecipeCardProps {
  recipe: Recipe;
  showStatus?: boolean;
  className?: string;
}

export function getStatusBadge(status?: RecipeStatus) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm backdrop-blur-sm bg-opacity-90">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          Đã duyệt
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 shadow-sm backdrop-blur-sm bg-opacity-90">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
          Bị từ chối
        </span>
      );
    case "pending":
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm backdrop-blur-sm bg-opacity-90">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
          Chờ duyệt
        </span>
      );
  }
}

export default function RecipeCard({
  recipe,
  showStatus = false,
  className = "",
}: RecipeCardProps) {
  const totalTime =
    (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
  const recipeUrl = `/recipes/${recipe.slug || recipe.id}`;

  return (
    <div
      className={`bg-white rounded-2xl border border-[#e5e3dc] overflow-hidden hover:shadow-lg transition-all flex flex-col h-full group ${className}`}
    >
      {/* Thumbnail + Status Badge */}
      <Link
        href={recipeUrl}
        className="relative aspect-[16/10] overflow-hidden bg-[#e9e8e4] block"
      >
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-[#f4f4f0]">
            🍲
          </div>
        )}

        {showStatus && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            {getStatusBadge(recipe.status)}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <Link href={recipeUrl}>
            <h3 className="font-bold text-base text-[#1b1c1a] line-clamp-2 min-h-[2.75rem] leading-snug group-hover:text-[#ae2f34] transition-colors mb-1.5">
              {recipe.title}
            </h3>
          </Link>
          <p className="text-xs text-[#8c706f] line-clamp-2 mb-4 leading-relaxed">
            {recipe.description || "Chưa có mô tả chi tiết."}
          </p>

          {/* Rejection reason alert */}
          {showStatus &&
            recipe.status === "rejected" &&
            recipe.rejection_reason && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                <span className="font-semibold block mb-0.5">
                  Lý do từ chối:
                </span>
                {recipe.rejection_reason}
              </div>
            )}
        </div>

        {/* Meta & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#f0eee9] text-xs text-[#8c706f] mt-auto">
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1"
              title="Thời gian chế biến"
            >
              <span className="material-symbols-outlined text-[16px]">
                schedule
              </span>
              {totalTime > 0 ? `${totalTime}p` : "Nhanh"}
            </span>
            <span className="flex items-center gap-1" title="Khẩu phần">
              <span className="material-symbols-outlined text-[16px]">
                group
              </span>
              {recipe.servings || 4} người
            </span>
            <span className="flex items-center gap-1" title="Lượt xem">
              <span className="material-symbols-outlined text-[16px]">
                visibility
              </span>
              {(recipe.view_count || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

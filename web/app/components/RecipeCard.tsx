import Link from "next/link";
import type { Recipe } from "@/src/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime =
    (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  return (
    <Link
      href={`/recipes/${recipe.slug || recipe.id}`}
      className="group bg-white rounded-3xl overflow-hidden flex flex-col p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(255,107,107,0.15)] shadow-[0_10px_30px_-10px_rgba(255,107,107,0.08)]"
    >
      {/* Image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-[#f4f4f0]">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍲
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#1b1c1a] mb-1 group-hover:text-[#ff6b6b] transition-colors line-clamp-2 leading-snug">
          {recipe.title}
        </h3>
        <p className="text-sm text-[#584140] line-clamp-2 mb-3 flex-grow leading-relaxed">
          {recipe.description || "Công thức món ăn thơm ngon, hấp dẫn."}
        </p>
        <div className="flex items-center gap-1 text-xs font-bold text-[#584140] mt-auto pt-3 border-t border-[#e3e2df]/60">
          <span
            className="material-symbols-outlined text-[15px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            schedule
          </span>
          {totalTime > 0 ? `${totalTime} phút` : "Nhanh gọn"}
        </div>
      </div>
    </Link>
  );
}

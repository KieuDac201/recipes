"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { categories, getRecipesWithCategories } from "@/src/data/mockData";

const categoryBadgeColors: Record<string, { bg: string; text: string }> = {
  soup:       { bg: "bg-[#ff6b6b]", text: "text-white" },
  breakfast:  { bg: "bg-[#ffd167]", text: "text-[#765900]" },
  vegan:      { bg: "bg-[#00b083]", text: "text-white" },
  "quick-easy": { bg: "bg-[#ff6b6b]", text: "text-white" },
  desserts:   { bg: "bg-[#ffd167]", text: "text-[#765900]" },
  specialty:  { bg: "bg-[#ae2f34]", text: "text-white" },
  all:         { bg: "bg-[#efeeea]", text: "text-[#1b1c1a]" },
};

function getBadgeColors(slug: string) {
  return categoryBadgeColors[slug] ?? { bg: "bg-[#efeeea]", text: "text-[#1b1c1a]" };
}

export default function RecipeListing() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const allRecipes = useMemo(() => getRecipesWithCategories(), []);

  const filtered = useMemo(() => {
    return allRecipes.filter((recipe) => {
      const matchesSearch =
        search.trim() === "" ||
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "all" ||
        recipe.categories.some((c) => c.slug === activeCategory);

      return matchesSearch && matchesCategory;
    });
  }, [allRecipes, search, activeCategory]);

  const displayCategories = categories.filter((c) => c.slug !== "all");

  return (
    <>
      {/* Hero + Search */}
      <section className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-[var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tight text-[#1b1c1a] mb-10 leading-tight">
          Hôm nay chúng ta nấu gì nào? 🍳
        </h1>

        {/* Search bar */}
        <div className="relative w-full max-w-2xl mb-10 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span
              className="material-symbols-outlined text-[#584140] group-focus-within:text-[#ff6b6b] transition-colors"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              search
            </span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm công thức món ăn..."
            className="w-full bg-[#f8f9fa] border-0 rounded-full py-4 pl-12 pr-6 text-lg text-[#1b1c1a] placeholder:text-[#584140]/60 focus:ring-2 focus:ring-[#ff6b6b] focus:bg-white shadow-inner transition-all duration-300 outline-none"
          />
        </div>

        {/* Category pills */}
        <div className="w-full overflow-x-auto scrollbar-hide py-3">
          <div className="flex gap-3 justify-start md:justify-center min-w-max px-4">
            {/* "All" pill */}
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#ff6b6b] text-white shadow-[0_2px_0_0_#ae2f34] -translate-y-0.5"
                  : "bg-[#efeeea] text-[#1b1c1a] hover:bg-[#e3e2df]"
              }`}
            >
              Tất Cả
            </button>

            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.slug
                    ? "bg-[#ff6b6b] text-white shadow-[0_2px_0_0_#ae2f34] -translate-y-0.5"
                    : "bg-[#efeeea] text-[#1b1c1a] hover:bg-[#e3e2df]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <span className="text-6xl mb-4 block">🍽️</span>
          <p className="text-xl font-semibold text-[#584140]">Không tìm thấy công thức nào.</p>
          <p className="text-[#8c706f] mt-1">Hãy thử tìm kiếm bằng từ khóa hoặc danh mục khác.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((recipe) => {
            const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
            const primaryCategory = recipe.categories[0];
            const badgeColors = primaryCategory
              ? getBadgeColors(primaryCategory.slug)
              : { bg: "bg-[#efeeea]", text: "text-[#1b1c1a]" };

            return (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.slug}`}
                className="group bg-white rounded-3xl overflow-hidden flex flex-col p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(255,107,107,0.15)] shadow-[0_10px_30px_-10px_rgba(255,107,107,0.08)]"
              >
                {/* Image */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {primaryCategory && (
                    <span
                      className={`absolute top-3 left-3 ${badgeColors.bg} ${badgeColors.text} text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm`}
                    >
                      {primaryCategory.name}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow">
                  <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#1b1c1a] mb-1 group-hover:text-[#ff6b6b] transition-colors line-clamp-2 leading-snug">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-[#584140] line-clamp-2 mb-3 flex-grow leading-relaxed">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#584140] mt-auto pt-3 border-t border-[#e3e2df]/60">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      schedule
                    </span>
                    {totalTime} phút
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </>
  );
}

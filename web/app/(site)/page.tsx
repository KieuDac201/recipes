import type { Metadata } from "next";
import RecipeListing from "../components/RecipeListing";
import { getPublicRecipes } from "@/src/services/recipeApi";
import type { Recipe, PaginationMeta } from "@/src/types/recipe";
import { PUBLIC_RECIPE_PAGE_SIZE } from "@/src/config/constants";

export const metadata: Metadata = {
  title: "GourmetPop — Khám Phá Công Thức Nấu Ăn Thượng Hạng",
  description:
    "Duyệt hàng trăm công thức nấu ăn ngon, đơn giản, chi tiết từng bước. Khám phá bí quyết ẩm thực mỗi ngày cùng GourmetPop.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GourmetPop — Khám Phá Công Thức Nấu Ăn Thượng Hạng",
    description:
      "Duyệt hàng trăm công thức nấu ăn ngon, đơn giản, chi tiết từng bước.",
    url: "/",
    siteName: "GourmetPop",
    locale: "vi_VN",
    type: "website",
  },
};

export default async function Home() {
  // Pre-fetch initial page of recipes on the server for instant HTML rendering & SEO indexing
  let initialRecipes: Recipe[] = [];
  let initialPagination: PaginationMeta | null = null;

  try {
    const res = await getPublicRecipes({ current_page: 1, limit: PUBLIC_RECIPE_PAGE_SIZE });
    initialRecipes = res.data || [];
    initialPagination = res.pagination || null;
  } catch (err) {
    console.error("Failed to pre-fetch recipes on SSR:", err);
  }

  // Generate Schema.org ItemList JSON-LD for rich snippet search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Danh sách công thức nấu ăn nổi bật",
    numberOfItems: initialRecipes.length,
    itemListElement: initialRecipes.map((recipe, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: recipe.title,
      url: `/recipes/${recipe.slug || recipe.id}`,
      image: recipe.image_url || undefined,
    })),
  };

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-16">
      {/* Schema.org ItemList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecipeListing
        initialRecipes={initialRecipes}
        initialPagination={initialPagination}
      />
    </main>
  );
}


import { Suspense } from "react";
import type { Metadata } from "next";
import RecipeListing from "../components/RecipeListing";
import RecipeSkeletonCard from "../components/RecipeSkeletonCard";
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

export default function Home() {
  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-16">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
            {Array.from({ length: PUBLIC_RECIPE_PAGE_SIZE }).map((_, i) => (
              <RecipeSkeletonCard key={i} />
            ))}
          </div>
        }
      >
        <RecipeListing />
      </Suspense>
    </main>
  );
}

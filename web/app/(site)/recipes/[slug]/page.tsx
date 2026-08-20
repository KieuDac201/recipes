import { notFound } from "next/navigation";
import Link from "next/link";
import { getRecipeByIdOrSlug } from "@/src/services/recipeApi";
import ServingScaler from "@/app/components/ServingScaler";
import RecipeActions from "@/app/components/RecipeActions";
import CategoryBadge from "@/app/components/CategoryBadge";
import RecipeMetaStats from "@/app/components/RecipeMetaStats";
import ViewTracker from "@/app/components/ViewTracker";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeByIdOrSlug(slug);
  if (!recipe) return { title: "Không Tìm Thấy Công Thức" };
  return {
    title: `${recipe.title} — Bếp Phương`,
    description: recipe.description || undefined,
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await getRecipeByIdOrSlug(slug);
  if (!recipe) notFound();

  const { ingredients = [], instructions = [], categories = [] } = recipe;

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-16">
      {/* ── View Tracker ─────────────────────────────────────── */}
      <ViewTracker recipeId={recipe.id} />

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="mb-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#584140] hover:text-[#ae2f34] text-sm font-semibold mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Quay lại danh sách món ăn
        </Link>

        {/* Title + meta */}
        <div className="flex flex-col md:flex-row gap-10 md:items-end justify-between mb-8">
          <div className="max-w-2xl">
            <h1 className="font-[var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tight text-[#1b1c1a] mb-3 leading-tight">
              {recipe.title}
            </h1>

            {/* Category badges */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {categories.map((cat, idx) => {
                  const catName = typeof cat === "string" ? cat : (cat as any).name;
                  return <CategoryBadge key={idx} category={catName} />;
                })}
              </div>
            )}

            {/* Time/serving/view stats */}
            <RecipeMetaStats
              prepTimeMinutes={recipe.prep_time_minutes}
              cookTimeMinutes={recipe.cook_time_minutes}
              servings={recipe.servings}
              viewCount={recipe.view_count}
            />
          </div>

          {/* Action buttons — client component */}
          <RecipeActions recipeSlug={recipe.slug} recipeTitle={recipe.title} />
        </div>

        {/* Hero image */}
        <div className="w-full aspect-[16/7] md:aspect-[21/8] min-h-[280px] md:min-h-[360px] rounded-3xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(255,107,107,0.15)] relative group cursor-pointer mb-8">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Recipe Description Section */}
        {recipe.description && (
          <div className="bg-white border border-[#efeeea] rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.04)] relative">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#ffdad8] text-[#ae2f34] flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  menu_book
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-[var(--font-headline)] text-lg font-bold text-[#1b1c1a] mb-2">
                  Về món ăn này
                </h2>
                <p className="text-[#584140] text-base md:text-lg leading-relaxed font-[var(--font-body)]">
                  {recipe.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Content Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Ingredients sidebar (client — serving scaler) */}
        <aside className="lg:col-span-4">
          <ServingScaler ingredients={ingredients} baseServings={recipe.servings} />
        </aside>

        {/* Instructions (server rendered) */}
        <section className="lg:col-span-8 bg-white border border-[#efeeea] rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_-10px_rgba(255,107,107,0.1)] flex flex-col gap-8">
          <div className="flex items-center gap-3 border-b border-[#efeeea] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#ffd166]/20 text-[#785a00] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                restaurant
              </span>
            </div>
            <h2 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a]">
              Hướng Dẫn Từng Bước
            </h2>
          </div>

          <div className="space-y-8">
            {instructions.map((step) => (
              <div key={step.id} className="flex items-start gap-4 sm:gap-5 group">
                {/* Step number bubble */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center font-[var(--font-headline)] text-lg font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform mt-0.5">
                  {step.step_number}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-[var(--font-headline)] text-lg font-bold text-[#1b1c1a] mb-2">
                    Bước {step.step_number}
                  </h3>
                  <p className="text-[#584140] leading-relaxed mb-4 font-[var(--font-body)]">
                    {step.instruction}
                  </p>

                  {/* Optional step image */}
                  {step.image_url && (
                    <div className="rounded-2xl overflow-hidden shadow-sm aspect-video group-hover:shadow-[0_10px_30px_-10px_rgba(0,176,131,0.2)] transition-shadow max-w-lg">
                      <img
                        src={step.image_url}
                        alt={`Bước ${step.step_number}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* "Made this recipe?" CTA */}
          <div className="mt-4 p-8 bg-[#faf9f5] rounded-2xl text-center border border-[#e9e8e4]">
            <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#1b1c1a] mb-2">
              Bạn đã nấu món này chưa?
            </h3>
            <p className="text-[#584140] text-sm mb-6">
              Hãy chia sẻ thành quả và cảm nhận của bạn để truyền cảm hứng cho mọi người nhé!
            </p>
            <div className="flex justify-center gap-3">
              <button className="bg-[#ff6b6b] text-white text-sm font-semibold px-8 py-3 rounded-full shadow-[0_4px_10px_-2px_rgba(255,107,107,0.4)] hover:-translate-y-1 hover:shadow-[0_6px_15px_-2px_rgba(255,107,107,0.5)] transition-all flex items-center gap-2 cursor-pointer">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                Viết Đánh Giá
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

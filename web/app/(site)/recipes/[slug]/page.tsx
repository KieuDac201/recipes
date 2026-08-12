import { notFound } from "next/navigation";
import Link from "next/link";
import { getRecipeByIdOrSlug } from "@/src/services/recipeApi";
import ServingScaler from "@/app/components/ServingScaler";
import RecipeActions from "@/app/components/RecipeActions";
import CategoryBadge from "@/app/components/CategoryBadge";
import RecipeMetaStats from "@/app/components/RecipeMetaStats";
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
    title: `${recipe.title} — GourmetPop`,
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
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="mb-16">
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

            {/* Time/serving stats */}
            <RecipeMetaStats
              prepTimeMinutes={recipe.prep_time_minutes}
              cookTimeMinutes={recipe.cook_time_minutes}
              servings={recipe.servings}
            />
          </div>

          {/* Action buttons — client component */}
          <RecipeActions recipeSlug={recipe.slug} recipeTitle={recipe.title} />
        </div>

        {/* Hero image */}
        <div className="w-full aspect-[21/9] md:aspect-[24/9] rounded-3xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(255,107,107,0.15)] relative group cursor-pointer">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </section>

      {/* ── Content Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Ingredients sidebar (client — serving scaler) */}
        <aside className="lg:col-span-4">
          <ServingScaler ingredients={ingredients} baseServings={recipe.servings} />
        </aside>

        {/* Instructions (server rendered) */}
        <section className="lg:col-span-8 flex flex-col gap-10">
          <h2 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a]">
            Hướng Dẫn Từng Bước
          </h2>

          <div className="space-y-10">
            {instructions.map((step) => (
              <div key={step.id} className="relative pl-16 group">
                {/* Step number bubble */}
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center font-[var(--font-headline)] text-xl font-bold shadow-sm group-hover:scale-110 transition-transform">
                  {step.step_number}
                </div>

                <h3 className="font-[var(--font-headline)] text-lg font-bold text-[#1b1c1a] mb-2">
                  Bước {step.step_number}
                </h3>
                <p className="text-[#584140] leading-relaxed mb-4">
                  {step.instruction}
                </p>

                {/* Optional step image */}
                {step.image_url && (
                  <div className="rounded-2xl overflow-hidden shadow-sm aspect-video group-hover:shadow-[0_10px_30px_-10px_rgba(0,176,131,0.2)] transition-shadow">
                    <img
                      src={step.image_url}
                      alt={`Bước ${step.step_number}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* "Made this recipe?" CTA */}
          <div className="mt-10 p-10 bg-[#f4f4f0] rounded-3xl text-center shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-[#e9e8e4]">
            <h3 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a] mb-2">
              Bạn đã nấu món này chưa?
            </h3>
            <p className="text-[#584140] mb-6">
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

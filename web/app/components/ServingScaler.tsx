"use client";

import { useState } from "react";
import type { Ingredient } from "@/src/types/recipe";

interface ServingScalerProps {
  ingredients: Ingredient[];
  baseServings: number;
}

export default function ServingScaler({ ingredients, baseServings }: ServingScalerProps) {
  const [servings, setServings] = useState(baseServings);

  const scale = servings / baseServings;

  function formatQty(amount: number | string): string {
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) return String(amount);
    const scaled = numericAmount * scale;
    if (scaled % 1 === 0) return String(scaled);
    // Show up to 1 decimal place
    return scaled.toFixed(1).replace(/\.0$/, "");
  }

  function changeServings(delta: number) {
    setServings((prev) => Math.max(1, Math.min(24, prev + delta)));
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(255,107,107,0.1)] sticky top-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-[#efeeea] pb-4">
        <h2 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a]">
          Nguyên Liệu
        </h2>

        {/* Scaler */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeServings(-1)}
            aria-label="Giảm khẩu phần"
            title="Giảm khẩu phần"
            className="w-8 h-8 rounded-full bg-[#efeeea] text-[#1b1c1a] flex items-center justify-center hover:bg-[#ff6b6b] hover:text-white transition-all text-lg font-bold leading-none cursor-pointer"
          >
            −
          </button>
          <span className="font-[var(--font-headline)] font-bold text-[#1b1c1a] w-6 text-center">
            {servings}
          </span>
          <button
            onClick={() => changeServings(1)}
            aria-label="Tăng khẩu phần"
            title="Tăng khẩu phần"
            className="w-8 h-8 rounded-full bg-[#efeeea] text-[#1b1c1a] flex items-center justify-center hover:bg-[#ff6b6b] hover:text-white transition-all text-lg font-bold leading-none cursor-pointer"
          >
            +
          </button>
          <span className="text-xs font-semibold text-[#584140] ml-1">khẩu phần</span>
        </div>
      </div>

      {/* Ingredient list with checkboxes */}
      <ul className="flex flex-col gap-1">
        {ingredients.map((ing) => (
          <IngredientItem key={ing.id} ingredient={ing} formatQty={formatQty} />
        ))}
      </ul>

      {/* Add to grocery list */}
      <button className="w-full mt-5 bg-[#efeeea] text-[#1b1c1a] text-sm font-semibold py-3 rounded-xl hover:bg-[#e9e8e4] transition-colors flex items-center justify-center gap-2 cursor-pointer">
        <span
          className="material-symbols-outlined text-[18px]"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          add_shopping_cart
        </span>
        Thêm Vào Danh Sách Đi Chợ
      </button>
    </div>
  );
}

function IngredientItem({
  ingredient,
  formatQty,
}: {
  ingredient: Ingredient;
  formatQty: (amount: number | string) => string;
}) {
  const [checked, setChecked] = useState(false);
  const id = `ing-${ingredient.id}`;

  return (
    <li className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f4f4f0] transition-colors cursor-pointer group">
      {/* Custom checkbox */}
      <div
        role="checkbox"
        aria-checked={checked}
        id={id}
        onClick={() => setChecked((v) => !v)}
        className={`mt-0.5 w-5 h-5 shrink-0 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
          checked
            ? "bg-[#ff6b6b] border-[#ff6b6b]"
            : "border-[#e0bfbd] bg-transparent"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 10" className="w-3 h-3 text-white fill-current">
            <path d="M1.5 5.5 L4.5 8.5 L10.5 1.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <label
        htmlFor={id}
        onClick={() => setChecked((v) => !v)}
        className={`flex-grow cursor-pointer text-sm leading-snug transition-all duration-200 ${
          checked ? "line-through text-[#8c706f]" : "text-[#1b1c1a]"
        }`}
      >
        <span className="font-semibold">{formatQty(ingredient.amount)} {ingredient.unit}</span>{" "}
        {ingredient.name}
      </label>
    </li>
  );
}

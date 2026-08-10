"use client";

import { useState, useEffect } from "react";

interface RecipeActionsProps {
  recipeSlug: string;
  recipeTitle: string;
}

export default function RecipeActions({ recipeSlug, recipeTitle }: RecipeActionsProps) {
  const storageKey = `gourmetpop:fav:${recipeSlug}`;

  const [isFavorited, setIsFavorited] = useState(false);

  // Rehydrate favorite state from localStorage on mount
  useEffect(() => {
    setIsFavorited(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  function toggleFavorite() {
    const next = !isFavorited;
    setIsFavorited(next);
    localStorage.setItem(storageKey, String(next));
  }

  async function handleShare() {
    const url = window.location.href;

    // Web Share API (mobile / modern desktop)
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: recipeTitle, url });
        return;
      } catch {
        // user cancelled or API failed — fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // silently fail
    }
  }

  return (
    <div className="flex gap-3">
      {/* Favorite */}
      <button
        onClick={toggleFavorite}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorited}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer hover:-translate-y-1 ${
          isFavorited
            ? "bg-[#ff6b6b] text-white"
            : "bg-[#efeeea] text-[#584140] hover:bg-[#ff6b6b] hover:text-white"
        }`}
      >
        <span
          className="material-symbols-outlined select-none"
          style={{
            fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0",
            transition: "font-variation-settings 0.2s ease",
          }}
        >
          favorite
        </span>
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        aria-label="Share recipe"
        className="w-12 h-12 rounded-full bg-[#efeeea] text-[#584140] flex items-center justify-center hover:bg-[#ff6b6b] hover:text-white hover:-translate-y-1 transition-all shadow-sm cursor-pointer"
      >
        <span
          className="material-symbols-outlined select-none"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          share
        </span>
      </button>
    </div>
  );
}

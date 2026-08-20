"use client";

import { useEffect, useRef } from "react";
import { increaseRecipeViewCount } from "@/src/services/recipeApi";

interface ViewTrackerProps {
  recipeId: number;
}

export default function ViewTracker({ recipeId }: ViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current || !recipeId) return;
    trackedRef.current = true;

    increaseRecipeViewCount(recipeId).catch((error) => {
      console.error("[ViewTracker] Failed to record view count:", error);
    });
  }, [recipeId]);

  return null;
}

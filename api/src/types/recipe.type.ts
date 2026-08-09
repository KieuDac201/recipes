// src/types/recipe.type.ts
export interface Recipe {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_url: string;
    prep_time_minutes: number;
    cook_time_minutes: number;
    servings: number;
    created_at: Date;
}

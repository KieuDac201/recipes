// ============================================================
// Mock data — Vietnamese cuisine, matches the PostgreSQL schema
// ============================================================

export interface Recipe {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
}

export interface Ingredient {
  id: number;
  recipe_id: number;
  amount: number;
  unit: string;
  name: string;
}

export interface Instruction {
  id: number;
  recipe_id: number;
  step_number: number;
  image_url: string | null;
  instruction: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface RecipeCategory {
  recipe_id: number;
  category_id: number;
}

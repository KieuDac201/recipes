export interface Recipe {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image_url: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  created_at: string | Date;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number | string;
  unit: string;
}

export interface Instruction {
  id: number;
  step_number: number;
  instruction: string;
  image_url?: string | null;
}

export interface RecipeDetail extends Recipe {
  categories: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export interface PaginationMeta {
  currentPage?: number;
  totalPage?: number;
  limit?: number;
  totalCount?: number;
}

export interface GetRecipesResponse {
  success: boolean;
  pagination?: PaginationMeta;
  data: Recipe[];
}

export interface GetRecipeDetailResponse {
  success: boolean;
  data: RecipeDetail;
}

export interface GetRecipesParams {
  limit?: number;
  current_page?: number;
  search?: string;
}

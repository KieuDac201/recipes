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

export interface IngredientBody {
  name: string;
  unit: string;
  amount: number | string;
}

export interface InstructionBody {
  step_number: number;
  instruction: string;
  image_url: string | null;
}

export interface RecipeBody {
  title: string;
  slug: string;
  description: string | null;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  image_url: string;
  categories: number[];
  instructions: InstructionBody[];
  ingredients: IngredientBody[];
}

export interface CreateRecipeResponse {
  success: boolean;
  data: Recipe;
}

export interface UpdateRecipeResponse {
  success: boolean;
  data: Recipe;
}

export interface DeleteRecipeResponse {
  success: boolean;
  data: Recipe;
}

export interface UploadImageData {
  url: string;
  publicId: string;
}

export interface UploadImageResponse {
  success: boolean;
  data: UploadImageData;
}

export interface CategoryOption {
  id: number;
  name: string;
  slug: string;
}

export interface FormIngredientItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface FormInstructionStep {
  id: string;
  stepNumber: number;
  title?: string;
  instruction: string;
  imageUrl: string | null;
}

export interface CreateRecipeFormData {
  title: string;
  slug: string;
  description: string;
  categories: number[];
  prepTimeMinutes: number | string;
  cookTimeMinutes: number | string;
  servings: number | string;
  imageUrl: string;
  ingredients: FormIngredientItem[];
  instructions: FormInstructionStep[];
}



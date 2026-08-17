export interface BaseEntity<TId = number> {
  id: TId;
}

export interface TimestampedEntity {
  created_at: string | Date;
  updated_at?: string | Date;
}

export interface PaginationMeta {
  currentPage?: number;
  totalPage?: number;
  limit?: number;
  totalCount?: number;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  current_page?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ApiResponse<TData = unknown> {
  success: boolean;
  data: TData;
  message?: string;
}

export interface PaginatedApiResponse<TData = unknown> extends ApiResponse<TData[]> {
  pagination?: PaginationMeta;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
}

export interface Ingredient extends BaseEntity {
  name: string;
  amount: number | string;
  unit: string;
  recipe_id?: number;
}

export interface Instruction extends BaseEntity {
  step_number: number;
  instruction: string;
  image_url?: string | null;
  recipe_id?: number;
}

export interface Recipe extends BaseEntity, TimestampedEntity {
  title: string;
  slug: string;
  description: string | null;
  image_url: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
}

export interface RecipeDetail extends Recipe {
  categories: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export type IngredientBody = Omit<Ingredient, "id" | "recipe_id">;
export type IngredientInput = IngredientBody;

export type InstructionBody = Omit<Instruction, "id" | "recipe_id">;
export type InstructionInput = InstructionBody;

export interface RecipeBody extends Omit<Recipe, "id" | "created_at" | "updated_at"> {
  categories: number[];
  ingredients: IngredientBody[];
  instructions: InstructionBody[];
}
export type RecipeInput = RecipeBody;
export type UpdateRecipeBody = Partial<RecipeBody>;

export interface GetRecipesParams extends PaginationParams {
  category_id?: number;
  category_slug?: string;
}

export type GetRecipesResponse = PaginatedApiResponse<Recipe>;
export type GetRecipeDetailResponse = ApiResponse<RecipeDetail>;
export type CreateRecipeResponse = ApiResponse<Recipe>;
export type UpdateRecipeResponse = ApiResponse<Recipe>;
export type DeleteRecipeResponse = ApiResponse<Recipe>;

export interface UploadImageData {
  url: string;
  publicId: string;
}

export type UploadImageResponse = ApiResponse<UploadImageData>;

export type CategoryOption = Category;

export interface FormIngredientItem extends BaseEntity<string> {
  name: string;
  amount: string;
  unit: string;
}

export interface FormInstructionStep extends BaseEntity<string> {
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

export type UpdateRecipeFormData = Partial<CreateRecipeFormData>;

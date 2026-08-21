// src/types/recipe.type.ts

interface Recipe {
  id: number
  title: string
  slug: string
  description: string | null
  image_url: string
  prep_time_minutes: number
  cook_time_minutes: number
  servings: number
  view_count?: number
  author_id: number
  created_at: Date | string
}

interface Ingredient {
  id: number
  name: string
  unit: string
  amount: number | string
}

interface Instruction {
  id: number
  step_number: number
  instruction: string
  image_url: string | null
}

interface RecipeDetail extends Recipe {
  categories: string[]
  instructions: Instruction[]
  ingredients: Ingredient[]
}

type IngredientBody = Omit<Ingredient, "id">

type InstructionBody = Omit<Instruction, "id">

interface RecipeBody extends Omit<Recipe, "id" | "created_at"> {
  categories: number[]
  instructions: InstructionBody[]
  ingredients: IngredientBody[]
}

type RecipeStatus = "pending" | "approved" | "rejected" | "all"

export {
  Recipe,
  Ingredient,
  Instruction,
  RecipeDetail,
  IngredientBody,
  InstructionBody,
  RecipeBody,
  RecipeStatus,
}

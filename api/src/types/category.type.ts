export interface Category {
  id: number
  name: string
  slug: string
}

export interface CreateCategoryBody {
  name: string
  slug?: string
}

export interface UpdateCategoryBody {
  name?: string
  slug?: string
}



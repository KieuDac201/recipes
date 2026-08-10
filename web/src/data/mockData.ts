// ============================================================
// Mock data — matches the PostgreSQL schema exactly
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

// ── Categories ───────────────────────────────────────────────
export const categories: Category[] = [
  { id: 1, name: "All",         slug: "all" },
  { id: 2, name: "Breakfast",   slug: "breakfast" },
  { id: 3, name: "Vegan",       slug: "vegan" },
  { id: 4, name: "Quick & Easy",slug: "quick-easy" },
  { id: 5, name: "Desserts",    slug: "desserts" },
  { id: 6, name: "Healthy",     slug: "healthy" },
  { id: 7, name: "Seafood",     slug: "seafood" },
];

// ── Recipes ──────────────────────────────────────────────────
export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Spicy Honey Garlic Shrimp Bowl",
    slug: "spicy-honey-garlic-shrimp-bowl",
    description:
      "Succulent shrimp glazed in a sweet, spicy honey-garlic sauce served over fluffy jasmine rice. A weeknight crowd-pleaser that takes only 25 minutes from pan to plate.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9KL1RIc6-U2LFeRAlzX_nkDHGQrHMuzoEgTicu47EzzTXVnAhAyDsUrGpH57GIgiC0UbJV4VuJEqekL68zSSpv3Vk0-cZrhfNnz4Gr99xtYNsTwcIvgpNn1LlIKc1gTId30EUlHsUWuDUKCoMBolLT0ZoAuDx9lWqYnsPUTBldUPjIBUGhCDaGi9_RmBBbrnoCl7V5loyiydnxve2olqwDzB5eEDR2_gc4msxlTXAnSlVZaeUsnB6",
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    servings: 4,
  },
  {
    id: 2,
    title: "Creamy Mint Avocado Toast",
    slug: "creamy-mint-avocado-toast",
    description:
      "A fresh and vibrant start to your morning with creamy smashed avocado, fresh mint leaves, and a squeeze of lemon on rustic sourdough toast.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBm2mQ_7neXKDWYzhqc_3zpQsmwPdfd19bF8ZOPS8Dcd-vXYgcL4Wu9UKi96mguhS0O5YVR0_9RceWE1K-Mpl9CJypUkbcERkasqUuuaT7nqw82BNcBmPFrrpx2IwvgDHjHNgsWFlU7SqJgUkChGshMfeC0L_g4JfaSbqm-k7n-6QQMKwsRK1VEyd8bx6rEHF6BOf6ErXtbgtEDER4M66uBsmiB96wKMMl5OWXDgZ-uTxApO6N57KsY",
    prep_time_minutes: 5,
    cook_time_minutes: 5,
    servings: 2,
  },
  {
    id: 3,
    title: "Spicy Volcano Ramen",
    slug: "spicy-volcano-ramen",
    description:
      "A fiery and comforting noodle bowl packed with umami-rich broth, spring onions, nori, and topped with a perfect soft-boiled egg. Warning: highly addictive.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBCjsGX3O4_ji49VHD0NUNzVh0GPWq_FVWV6fErfseOiv8xN3Bv_9czLTh-sP4zLZURzow3rT1I-YJ1cNHyQmJoh6y3TJnyEfRtycip4iAKWxQVlIBx8QrkohPClc8vZSPajwT91s83e08Ioj9KQA6hHVvNSwY5lOmkwcy7Wy5m9W517gFa-dUGgTijw5Mb7MCP2CxtjVdPu331cuou60YREM-zaUo1UepWla9XGb3Qumsy21bY5zB",
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    servings: 2,
  },
  {
    id: 4,
    title: "Lemon Ricotta Pancakes",
    slug: "lemon-ricotta-pancakes",
    description:
      "Light, airy, and bursting with bright citrus flavor, these cloud-like pancakes melt in your mouth. The ricotta keeps them impossibly fluffy and tender.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXk1o2NQKqpoqtZjcgCn2U3vFyh7LvBKvKeZkS6EyNhmhrTRz-As9GwsJ-2gPS9pa6Iw7n_cHvXyz48_xr2Nm86GZ_9X6ZIQ225Uu8AGAcqi1twINytD1L0HC5Tj5wtzDJnQ4xu0Na9_EH2exavGYLTYpjGF6y5EyONy54T9pz6GmSPdba9WZBvE6RK_KO0-pJwbDebESlaMMHmTKegNdP2lQCSRqiNjAXn4bXFurwyAd3msD7_ab5",
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    servings: 4,
  },
  {
    id: 5,
    title: "Harvest Glow Bowl",
    slug: "harvest-glow-bowl",
    description:
      "A nourishing bowl packed with seasonal roasted vegetables, hearty grains, and a zesty tahini-lemon drizzle. Meal-prep friendly and endlessly customizable.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1c3rSJciX885ObxC9WITz0jpi2yZkkEwRmMoqn38gqjn4M--_mp9RvgVXUAIzPceMpZl97xeipUHSYANQq_0-DIEeXGhAnCUtFd3cw2dmb4EKjGN7Nk-NIODmkFL-p4AbBZASACTAOduTCx6TrM0sgsQl1taw7aT-bcQ7d6b22eJtGl59Qf9n0I5L6VJ-KxHbkVpGJNqHcu7bVcRRtWJOXBaX6KdI32ISCQzVGf2HECcCpCzC5jV8",
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    servings: 3,
  },
  {
    id: 6,
    title: "Midnight Espresso Cake",
    slug: "midnight-espresso-cake",
    description:
      "A decadent, fudgy chocolate cake enriched with a shot of dark espresso for an extraordinary depth of flavor. Finished with a silky ganache glaze.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8YJlTw4A0BDXScSLfUzfw-A1zPGjiZ7P_0LgKbJu2zKnmMjXUx35TM8iAB0Ma4NAt4xU-IE3qQSoKC3nkcCNUfeITsw-WTNUpU8T7Dfq7sszcEwaJsBqhvliRHdWzLK32Vk6Z3fdXmGg2TIffMwaftY8xPh0gMd2NcQX5sU8oPpIYeTFuC735e1FpKjImIxQX3AHHsJPs_SooGBIOKmlD4SWG6Z4gKK3THzn3Rr_mrBqd07B7G9bz",
    prep_time_minutes: 20,
    cook_time_minutes: 40,
    servings: 8,
  },
];

// ── Ingredients ──────────────────────────────────────────────
export const ingredients: Ingredient[] = [
  // Recipe 1 — Spicy Honey Garlic Shrimp Bowl
  { id: 1,  recipe_id: 1, amount: 500,  unit: "g",    name: "Large Shrimp, peeled and deveined" },
  { id: 2,  recipe_id: 1, amount: 3,    unit: "tbsp",  name: "Honey" },
  { id: 3,  recipe_id: 1, amount: 2,    unit: "tbsp",  name: "Soy Sauce (Low Sodium)" },
  { id: 4,  recipe_id: 1, amount: 4,    unit: "cloves",name: "Garlic, minced" },
  { id: 5,  recipe_id: 1, amount: 1,    unit: "tbsp",  name: "Sriracha (adjust for heat)" },
  { id: 6,  recipe_id: 1, amount: 1,    unit: "tbsp",  name: "Olive Oil" },
  { id: 7,  recipe_id: 1, amount: 2,    unit: "cups",  name: "Cooked Jasmine Rice" },
  { id: 8,  recipe_id: 1, amount: 1,    unit: "tbsp",  name: "Sesame Seeds" },
  { id: 9,  recipe_id: 1, amount: 2,    unit: "stalks",name: "Green Onions, sliced" },

  // Recipe 2 — Creamy Mint Avocado Toast
  { id: 10, recipe_id: 2, amount: 2,    unit: "slices",name: "Rustic Sourdough Bread" },
  { id: 11, recipe_id: 2, amount: 1,    unit: "whole", name: "Ripe Avocado" },
  { id: 12, recipe_id: 2, amount: 0.5,  unit: "lemon", name: "Fresh Lemon Juice" },
  { id: 13, recipe_id: 2, amount: 10,   unit: "leaves",name: "Fresh Mint Leaves" },
  { id: 14, recipe_id: 2, amount: 0.25, unit: "tsp",   name: "Red Pepper Flakes" },
  { id: 15, recipe_id: 2, amount: 1,    unit: "pinch", name: "Sea Salt & Black Pepper" },

  // Recipe 3 — Spicy Volcano Ramen
  { id: 16, recipe_id: 3, amount: 2,    unit: "packs", name: "Ramen Noodles" },
  { id: 17, recipe_id: 3, amount: 600,  unit: "ml",    name: "Rich Chicken Broth" },
  { id: 18, recipe_id: 3, amount: 2,    unit: "tbsp",  name: "Gochujang Paste" },
  { id: 19, recipe_id: 3, amount: 2,    unit: "whole", name: "Soft-Boiled Eggs" },
  { id: 20, recipe_id: 3, amount: 2,    unit: "sheets",name: "Nori (Roasted Seaweed)" },
  { id: 21, recipe_id: 3, amount: 3,    unit: "stalks",name: "Green Onions, chopped" },
  { id: 22, recipe_id: 3, amount: 1,    unit: "tbsp",  name: "Toasted Sesame Oil" },

  // Recipe 4 — Lemon Ricotta Pancakes
  { id: 23, recipe_id: 4, amount: 1,    unit: "cup",   name: "Ricotta Cheese" },
  { id: 24, recipe_id: 4, amount: 1,    unit: "cup",   name: "All-Purpose Flour" },
  { id: 25, recipe_id: 4, amount: 2,    unit: "whole", name: "Eggs, separated" },
  { id: 26, recipe_id: 4, amount: 0.25, unit: "cup",   name: "Caster Sugar" },
  { id: 27, recipe_id: 4, amount: 1,    unit: "whole", name: "Lemon, zested & juiced" },
  { id: 28, recipe_id: 4, amount: 0.75, unit: "cup",   name: "Whole Milk" },
  { id: 29, recipe_id: 4, amount: 1,    unit: "tsp",   name: "Baking Powder" },

  // Recipe 5 — Harvest Glow Bowl
  { id: 30, recipe_id: 5, amount: 1,    unit: "cup",   name: "Farro or Quinoa, cooked" },
  { id: 31, recipe_id: 5, amount: 200,  unit: "g",     name: "Butternut Squash, cubed" },
  { id: 32, recipe_id: 5, amount: 150,  unit: "g",     name: "Chickpeas, roasted" },
  { id: 33, recipe_id: 5, amount: 100,  unit: "g",     name: "Baby Spinach" },
  { id: 34, recipe_id: 5, amount: 3,    unit: "tbsp",  name: "Tahini" },
  { id: 35, recipe_id: 5, amount: 1,    unit: "tbsp",  name: "Lemon Juice" },
  { id: 36, recipe_id: 5, amount: 1,    unit: "clove", name: "Garlic, minced" },
  { id: 37, recipe_id: 5, amount: 30,   unit: "g",     name: "Pumpkin Seeds" },

  // Recipe 6 — Midnight Espresso Cake
  { id: 38, recipe_id: 6, amount: 200,  unit: "g",     name: "Dark Chocolate (70%), chopped" },
  { id: 39, recipe_id: 6, amount: 200,  unit: "g",     name: "Unsalted Butter" },
  { id: 40, recipe_id: 6, amount: 300,  unit: "g",     name: "Caster Sugar" },
  { id: 41, recipe_id: 6, amount: 4,    unit: "whole", name: "Large Eggs" },
  { id: 42, recipe_id: 6, amount: 150,  unit: "g",     name: "Plain Flour" },
  { id: 43, recipe_id: 6, amount: 2,    unit: "tbsp",  name: "Cocoa Powder, unsweetened" },
  { id: 44, recipe_id: 6, amount: 1,    unit: "shot",  name: "Strong Espresso (cooled)" },
  { id: 45, recipe_id: 6, amount: 100,  unit: "ml",    name: "Double Cream (for ganache)" },
];

// ── Instructions ─────────────────────────────────────────────
export const instructions: Instruction[] = [
  // Recipe 1
  { id: 1,  recipe_id: 1, step_number: 1, image_url: null, instruction: "In a small bowl, whisk together the honey, soy sauce, minced garlic, and Sriracha until smooth. Set aside — this sweet and spicy glaze is the star of the show." },
  { id: 2,  recipe_id: 1, step_number: 2, image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6O_L3TM8wiqHPJdgBahFrmANd05x82-HrVbkCa_Jjt5SbcClHf1pI4U-UB3yTLKfmbi9BOTLfWXG9s4RbRNYVmo1EmZYOPnvD_fGBAO4d2Z21AeRMN7rPDAmzTyyXq3Wk3K0AOFwfKBn2rhmrnKt71EZWTCCrLuFZvduUcE3nJEwO-92l9B2rCzs2kM1rvuN7KY8rWRskklsSPQbq5z6SCU5JSvNWMubJEBmsTgjhWIt4HBYIhRAJ", instruction: "Heat olive oil in a large skillet over medium-high heat. Add the shrimp in a single layer and cook for 1–2 minutes per side until pink and opaque. Do not overcook!" },
  { id: 3,  recipe_id: 1, step_number: 3, image_url: null, instruction: "Pour the prepared sauce over the cooked shrimp. Reduce heat to low and simmer for 1 minute until the sauce thickens and coats the shrimp beautifully. Serve over warm jasmine rice garnished with sesame seeds and green onions." },

  // Recipe 2
  { id: 4,  recipe_id: 2, step_number: 1, image_url: null, instruction: "Toast the sourdough slices until golden and crisp." },
  { id: 5,  recipe_id: 2, step_number: 2, image_url: null, instruction: "Halve the avocado, remove the stone, and scoop the flesh into a bowl. Add lemon juice, salt, and pepper, then smash with a fork to your desired chunkiness." },
  { id: 6,  recipe_id: 2, step_number: 3, image_url: null, instruction: "Spread the avocado mixture generously onto the toast. Top with fresh mint leaves and a pinch of red pepper flakes. Serve immediately." },

  // Recipe 3
  { id: 7,  recipe_id: 3, step_number: 1, image_url: null, instruction: "Bring broth to a gentle boil in a medium saucepan. Stir in the gochujang paste and sesame oil. Simmer for 5 minutes to let the flavors meld." },
  { id: 8,  recipe_id: 3, step_number: 2, image_url: null, instruction: "Cook the ramen noodles according to package directions, then drain and divide between two bowls. Pour the hot spicy broth over." },
  { id: 9,  recipe_id: 3, step_number: 3, image_url: null, instruction: "Halve the soft-boiled eggs and arrange on top of the noodles. Add a sheet of nori and a generous scatter of green onions. Serve immediately." },

  // Recipe 4
  { id: 10, recipe_id: 4, step_number: 1, image_url: null, instruction: "Separate the eggs. Whisk egg yolks with ricotta, milk, lemon zest, and lemon juice until combined. Fold in flour and baking powder." },
  { id: 11, recipe_id: 4, step_number: 2, image_url: null, instruction: "Whip the egg whites with a pinch of salt to stiff peaks. Gently fold into the ricotta batter in two batches to keep the batter light and airy." },
  { id: 12, recipe_id: 4, step_number: 3, image_url: null, instruction: "Heat a non-stick pan over medium-low heat and lightly grease. Drop ¼ cup of batter per pancake. Cook 2–3 minutes until bubbles appear, flip and cook 1–2 minutes more. Serve with maple syrup." },

  // Recipe 5
  { id: 13, recipe_id: 5, step_number: 1, image_url: null, instruction: "Preheat oven to 200°C. Toss butternut squash cubes and chickpeas with olive oil, cumin, and smoked paprika. Roast for 25–30 minutes until caramelized." },
  { id: 14, recipe_id: 5, step_number: 2, image_url: null, instruction: "Whisk together tahini, lemon juice, garlic, and 3–4 tablespoons of water to make a pourable dressing. Season well." },
  { id: 15, recipe_id: 5, step_number: 3, image_url: null, instruction: "Build the bowl: start with farro, add spinach, pile on the roasted squash and chickpeas. Drizzle generously with tahini dressing and top with pumpkin seeds." },

  // Recipe 6
  { id: 16, recipe_id: 6, step_number: 1, image_url: null, instruction: "Preheat oven to 180°C. Melt chocolate and butter together in a bain-marie, stirring until smooth. Remove from heat and stir in the espresso. Cool slightly." },
  { id: 17, recipe_id: 6, step_number: 2, image_url: null, instruction: "Whisk eggs and sugar together until pale and doubled in volume (about 5 minutes). Fold in the chocolate mixture, then sift in flour and cocoa powder and fold until just combined." },
  { id: 18, recipe_id: 6, step_number: 3, image_url: null, instruction: "Pour into a greased and lined 20cm tin. Bake for 35–40 minutes. Allow to cool completely, then pour over warm ganache (cream + melted chocolate). Slice and serve." },
];

// ── Junction Table ───────────────────────────────────────────
export const recipesCategories: RecipeCategory[] = [
  { recipe_id: 1, category_id: 4 }, // Shrimp Bowl → Quick & Easy
  { recipe_id: 1, category_id: 7 }, // Shrimp Bowl → Seafood
  { recipe_id: 2, category_id: 3 }, // Avocado Toast → Vegan
  { recipe_id: 2, category_id: 2 }, // Avocado Toast → Breakfast
  { recipe_id: 3, category_id: 4 }, // Ramen → Quick & Easy
  { recipe_id: 4, category_id: 2 }, // Pancakes → Breakfast
  { recipe_id: 5, category_id: 6 }, // Harvest Bowl → Healthy
  { recipe_id: 5, category_id: 3 }, // Harvest Bowl → Vegan
  { recipe_id: 6, category_id: 5 }, // Espresso Cake → Desserts
];

// ── Helper Functions ─────────────────────────────────────────

export function getRecipeWithDetails(slug: string) {
  const recipe = recipes.find((r) => r.slug === slug);
  if (!recipe) return null;

  const recipeIngredients = ingredients.filter((i) => i.recipe_id === recipe.id);
  const recipeInstructions = instructions
    .filter((i) => i.recipe_id === recipe.id)
    .sort((a, b) => a.step_number - b.step_number);
  const categoryIds = recipesCategories
    .filter((rc) => rc.recipe_id === recipe.id)
    .map((rc) => rc.category_id);
  const recipeCategories = categories.filter((c) => categoryIds.includes(c.id));

  return { recipe, ingredients: recipeIngredients, instructions: recipeInstructions, categories: recipeCategories };
}

export function getRecipesWithCategories() {
  return recipes.map((recipe) => {
    const categoryIds = recipesCategories
      .filter((rc) => rc.recipe_id === recipe.id)
      .map((rc) => rc.category_id);
    const recipeCategories = categories.filter((c) => categoryIds.includes(c.id));
    return { ...recipe, categories: recipeCategories };
  });
}

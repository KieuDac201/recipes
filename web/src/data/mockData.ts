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

// ── Categories ───────────────────────────────────────────────
export const categories: Category[] = [
  { id: 1, name: "Tất Cả", slug: "all" },
  { id: 2, name: "Súp & Canh", slug: "soup" },
  { id: 3, name: "Ăn Sáng", slug: "breakfast" },
  { id: 4, name: "Chay", slug: "vegan" },
  { id: 5, name: "Nhanh & Dễ", slug: "quick-easy" },
  { id: 6, name: "Tráng Miệng", slug: "desserts" },
  { id: 7, name: "Đặc Sản", slug: "specialty" },
];

// ── Recipes ──────────────────────────────────────────────────
export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Phở Bò Hà Nội",
    slug: "pho-bo-ha-noi",
    description:
      "Tô phở bò truyền thống Hà Nội với nước dùng hầm từ xương bò trong 8 tiếng, thơm lừng hồi, quế và gừng nướng. Thịt bò tái mềm tan, bánh phở dai, rau thơm tươi xanh — linh hồn ẩm thực Việt.",
    image_url: "/images/pho-bo-ha-noi.png",
    prep_time_minutes: 30,
    cook_time_minutes: 480,
    servings: 4,
  },
  {
    id: 2,
    title: "Bánh Mì Thịt Nướng",
    slug: "banh-mi-thit-nuong",
    description:
      "Ổ bánh mì giòn rụm kẹp thịt heo nướng sả ớt thơm lừng, dưa chua cà rốt và củ cải giòn ngọt, rau mùi tươi và tương ớt Sriracha. Bữa sáng quốc dân Việt Nam chỉ trong 20 phút.",
    image_url: "/images/banh-mi-thit-nuong.png",
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    servings: 2,
  },
  {
    id: 3,
    title: "Gỏi Cuốn Tôm Thịt",
    slug: "goi-cuon-tom-thit",
    description:
      "Những cuốn gỏi trong suốt bằng bánh tráng, nhân tôm luộc hồng tươi, thịt ba chỉ luộc, bún tươi và rau xà lách. Chấm với nước sốt tương hoisin và đậu phộng rang — thanh mát và tinh tế.",
    image_url: "/images/goi-cuon-tom-thit.png",
    prep_time_minutes: 20,
    cook_time_minutes: 10,
    servings: 3,
  },
  {
    id: 4,
    title: "Bún Chả Hà Nội",
    slug: "bun-cha-ha-noi",
    description:
      "Đặc sản Hà Nội lừng danh: chả viên và thịt ba chỉ nướng than hoa thơm khói, chan nước mắm pha chua ngọt, ăn kèm bún tươi mát và đĩa rau sống xanh mướt. Hương vị không thể quên.",
    image_url: "/images/bun-cha-ha-noi.png",
    prep_time_minutes: 20,
    cook_time_minutes: 25,
    servings: 4,
  },
  {
    id: 5,
    title: "Chả Giò Giòn Rụm",
    slug: "cha-gio-gion-rum",
    description:
      "Những chiếc chả giò vàng giòn đẫy ắp thịt heo băm, miến, nấm mèo và cà rốt, chiên vàng đều tay. Cuốn bánh tráng với rau sống, chấm nước mắm chua ngọt — không thể cưỡng lại.",
    image_url: "/images/cha-gio-gion-rum.png",
    prep_time_minutes: 30,
    cook_time_minutes: 20,
    servings: 4,
  },
  {
    id: 6,
    title: "Chè Ba Màu",
    slug: "che-ba-mau",
    description:
      "Ly chè ba màu đặc trưng miền Nam: đậu xanh đánh nhuyễn béo ngậy, thạch đỏ từ đậu đỏ, thạch xanh lá dứa mát lành, chan nước cốt dừa thơm và đá bào. Tráng miệng mùa hè hoàn hảo.",
    image_url: "/images/che-ba-mau.png",
    prep_time_minutes: 20,
    cook_time_minutes: 30,
    servings: 6,
  },
];

// ── Ingredients ──────────────────────────────────────────────
export const ingredients: Ingredient[] = [
  // Recipe 1 — Phở Bò Hà Nội
  { id: 1, recipe_id: 1, amount: 1.5, unit: "kg", name: "Xương ống bò" },
  { id: 2, recipe_id: 1, amount: 300, unit: "g", name: "Thịt bò tái (thăn hoặc nạm)" },
  { id: 3, recipe_id: 1, amount: 400, unit: "g", name: "Bánh phở tươi" },
  { id: 4, recipe_id: 1, amount: 3, unit: "củ", name: "Hành tây, nướng" },
  { id: 5, recipe_id: 1, amount: 1, unit: "nhánh", name: "Gừng lớn, nướng" },
  { id: 6, recipe_id: 1, amount: 4, unit: "hoa", name: "Hoa hồi" },
  { id: 7, recipe_id: 1, amount: 1, unit: "thanh", name: "Quế" },
  { id: 8, recipe_id: 1, amount: 2, unit: "tbsp", name: "Nước mắm ngon" },
  { id: 9, recipe_id: 1, amount: 1, unit: "tbsp", name: "Đường phèn" },
  { id: 10, recipe_id: 1, amount: 1, unit: "bó", name: "Hành lá và ngò gai" },
  { id: 11, recipe_id: 1, amount: 200, unit: "g", name: "Giá đỗ tươi" },
  { id: 12, recipe_id: 1, amount: 2, unit: "quả", name: "Chanh tươi" },

  // Recipe 2 — Bánh Mì Thịt Nướng
  { id: 13, recipe_id: 2, amount: 2, unit: "ổ", name: "Bánh mì Việt Nam giòn" },
  { id: 14, recipe_id: 2, amount: 300, unit: "g", name: "Thịt heo ba chỉ, thái mỏng" },
  { id: 15, recipe_id: 2, amount: 2, unit: "cây", name: "Sả, băm nhỏ" },
  { id: 16, recipe_id: 2, amount: 1, unit: "tbsp", name: "Nước mắm" },
  { id: 17, recipe_id: 2, amount: 1, unit: "tbsp", name: "Mật ong" },
  { id: 18, recipe_id: 2, amount: 150, unit: "g", name: "Cà rốt và củ cải dưa chua" },
  { id: 19, recipe_id: 2, amount: 1, unit: "bó", name: "Rau mùi và dưa leo" },
  { id: 20, recipe_id: 2, amount: 2, unit: "tbsp", name: "Tương ớt Sriracha" },
  { id: 21, recipe_id: 2, amount: 1, unit: "tbsp", name: "Pate gan (tùy chọn)" },

  // Recipe 3 — Gỏi Cuốn Tôm Thịt
  { id: 22, recipe_id: 3, amount: 12, unit: "tờ", name: "Bánh tráng gạo (đường kính 22cm)" },
  { id: 23, recipe_id: 3, amount: 200, unit: "g", name: "Tôm sú luộc, bóc vỏ" },
  { id: 24, recipe_id: 3, amount: 200, unit: "g", name: "Thịt ba chỉ luộc, thái lát" },
  { id: 25, recipe_id: 3, amount: 200, unit: "g", name: "Bún tươi" },
  { id: 26, recipe_id: 3, amount: 1, unit: "bó", name: "Rau xà lách, rau húng quế, rau tía tô" },
  { id: 27, recipe_id: 3, amount: 3, unit: "tbsp", name: "Tương hoisin" },
  { id: 28, recipe_id: 3, amount: 2, unit: "tbsp", name: "Đậu phộng rang, giã dập" },
  { id: 29, recipe_id: 3, amount: 1, unit: "tép", name: "Tỏi băm" },

  // Recipe 4 — Bún Chả Hà Nội
  { id: 30, recipe_id: 4, amount: 400, unit: "g", name: "Thịt heo ba chỉ, thái khoanh mỏng" },
  { id: 31, recipe_id: 4, amount: 200, unit: "g", name: "Thịt heo nạc băm (làm chả viên)" },
  { id: 32, recipe_id: 4, amount: 400, unit: "g", name: "Bún tươi sợi nhỏ" },
  { id: 33, recipe_id: 4, amount: 3, unit: "tbsp", name: "Nước mắm ngon" },
  { id: 34, recipe_id: 4, amount: 2, unit: "tbsp", name: "Đường" },
  { id: 35, recipe_id: 4, amount: 2, unit: "tbsp", name: "Giấm gạo" },
  { id: 36, recipe_id: 4, amount: 2, unit: "tép", name: "Tỏi và ớt băm" },
  { id: 37, recipe_id: 4, amount: 1, unit: "đĩa", name: "Rau sống: rau muống chẻ, tía tô, kinh giới" },
  { id: 38, recipe_id: 4, amount: 50, unit: "g", name: "Đu đủ và cà rốt ngâm chua ngọt" },

  // Recipe 5 — Chả Giò Giòn Rụm
  { id: 39, recipe_id: 5, amount: 300, unit: "g", name: "Thịt heo băm" },
  { id: 40, recipe_id: 5, amount: 50, unit: "g", name: "Miến dong, ngâm mềm, cắt ngắn" },
  { id: 41, recipe_id: 5, amount: 30, unit: "g", name: "Nấm mèo khô, ngâm nở, thái sợi" },
  { id: 42, recipe_id: 5, amount: 1, unit: "củ", name: "Cà rốt, bào sợi" },
  { id: 43, recipe_id: 5, amount: 1, unit: "củ", name: "Khoai môn nhỏ, bào sợi" },
  { id: 44, recipe_id: 5, amount: 20, unit: "tờ", name: "Bánh tráng nem" },
  { id: 45, recipe_id: 5, amount: 500, unit: "ml", name: "Dầu ăn (để chiên ngập)" },
  { id: 46, recipe_id: 5, amount: 2, unit: "tbsp", name: "Nước mắm và hạt tiêu" },

  // Recipe 6 — Chè Ba Màu
  { id: 47, recipe_id: 6, amount: 100, unit: "g", name: "Đậu xanh cà (bỏ vỏ)" },
  { id: 48, recipe_id: 6, amount: 100, unit: "g", name: "Đậu đỏ" },
  { id: 49, recipe_id: 6, amount: 100, unit: "g", name: "Thạch lá dứa xắt hạt lựu" },
  { id: 50, recipe_id: 6, amount: 200, unit: "ml", name: "Nước cốt dừa béo" },
  { id: 51, recipe_id: 6, amount: 150, unit: "g", name: "Đường trắng" },
  { id: 52, recipe_id: 6, amount: 2, unit: "tbsp", name: "Bột năng (tạo độ sánh)" },
  { id: 53, recipe_id: 6, amount: 500, unit: "g", name: "Đá bào mịn" },
  { id: 54, recipe_id: 6, amount: 1, unit: "tsp", name: "Muối (cho nước cốt dừa)" },
];

// ── Instructions ─────────────────────────────────────────────
export const instructions: Instruction[] = [
  // Recipe 1 — Phở Bò
  { id: 1, recipe_id: 1, step_number: 1, image_url: "/images/steps/pho_bo_step1.png", instruction: "Chần xương bò trong nước sôi 5 phút, đổ bỏ nước đầu để loại bỏ tạp chất. Rửa sạch xương rồi cho vào nồi lớn với 3 lít nước lạnh, hầm lửa nhỏ." },
  { id: 2, recipe_id: 1, step_number: 2, image_url: "/images/steps/pho_bo_step2.png", instruction: "Nướng hành tây và gừng trực tiếp trên lửa đến khi vỏ cháy xém, thơm mùi khói. Bọc hồi, quế, đinh hương vào túi lọc. Cho tất cả vào nồi nước dùng, hầm 6–8 tiếng, hớt bọt thường xuyên." },
  { id: 3, recipe_id: 1, step_number: 3, image_url: "/images/steps/pho_bo_step3.png", instruction: "Nêm nước dùng với nước mắm, đường phèn và muối vừa ăn. Trụng bánh phở vào nước sôi, xếp vào tô. Thái thịt bò thật mỏng, đặt lên bánh phở rồi chan nước dùng sôi bỏng vào. Ăn kèm giá, rau thơm, chanh và ớt." },

  // Recipe 2 — Bánh Mì
  { id: 4, recipe_id: 2, step_number: 1, image_url: "/images/steps/banh_mi_step1.png", instruction: "Ướp thịt heo ba chỉ với sả băm, nước mắm, mật ong, tỏi và chút hạt tiêu. Để thịt thấm gia vị ít nhất 30 phút (hoặc qua đêm trong tủ lạnh)." },
  { id: 5, recipe_id: 2, step_number: 2, image_url: "/images/steps/banh_mi_step2.png", instruction: "Nướng thịt trên chảo gang hoặc vỉ nướng ở lửa vừa cao, mỗi mặt 3–4 phút cho đến khi vàng thơm và hơi cháy cạnh. Để nghỉ 2 phút rồi thái miếng vừa ăn." },
  { id: 6, recipe_id: 2, step_number: 3, image_url: "/images/steps/banh_mi_step3.png", instruction: "Xẻ ổ bánh mì, phết pate (nếu dùng). Kẹp thịt nướng, dưa chua, dưa leo, rau mùi và tương ớt vào. Thưởng thức ngay khi bánh còn nóng giòn." },

  // Recipe 3 — Gỏi Cuốn
  { id: 7, recipe_id: 3, step_number: 1, image_url: "/images/steps/goi_cuon_step1.png", instruction: "Luộc tôm với chút muối và gừng đến khi chín hồng, để nguội rồi bóc vỏ. Luộc thịt ba chỉ chín mềm, để nguội rồi thái lát mỏng." },
  { id: 8, recipe_id: 3, step_number: 2, image_url: "/images/steps/goi_cuon_step2.png", instruction: "Nhúng từng tờ bánh tráng vào bát nước ấm 3–5 giây cho mềm dẻo. Trải ra mặt phẳng, xếp rau, bún, thịt và tôm vào giữa. Cuộn chặt tay, gấp hai đầu vào trước khi cuốn hoàn chỉnh." },
  { id: 9, recipe_id: 3, step_number: 3, image_url: null, instruction: "Pha nước chấm: trộn tương hoisin với ít nước ấm cho loãng vừa, thêm đậu phộng giã, tỏi và chút ớt. Ăn gỏi cuốn ngay khi vừa làm xong." },

  // Recipe 4 — Bún Chả
  { id: 10, recipe_id: 4, step_number: 1, image_url: null, instruction: "Ướp thịt ba chỉ và thịt băm (vo thành chả viên) với nước mắm, đường, tỏi ớt băm và hành tím. Để ướp ít nhất 30 phút." },
  { id: 11, recipe_id: 4, step_number: 2, image_url: null, instruction: "Nướng thịt trên bếp than hoặc chảo gang đến khi vàng thơm có vệt cháy nhẹ. Pha nước mắm chua ngọt: nước mắm + đường + giấm + nước ấm + tỏi ớt, khuấy đến khi đường tan." },
  { id: 12, recipe_id: 4, step_number: 3, image_url: null, instruction: "Xếp thịt nướng vào bát nước mắm còn ấm. Ăn kèm bún tươi, rau sống và dưa góp. Gắp thịt từ bát nước mắm ra, cuốn cùng rau và bún — chuẩn vị Hà thành." },

  // Recipe 5 — Chả Giò
  { id: 13, recipe_id: 5, step_number: 1, image_url: null, instruction: "Trộn đều thịt băm, miến, nấm mèo, cà rốt, khoai môn với nước mắm, hạt tiêu và một quả trứng. Để nhân nghỉ 10 phút cho các nguyên liệu quyện vào nhau." },
  { id: 14, recipe_id: 5, step_number: 2, image_url: null, instruction: "Trải bánh tráng nem, múc 1 muỗng nhân đặt gần mép dưới. Gấp hai cạnh bên vào, cuộn chặt tay. Dán mép bằng hỗn hợp lòng trắng trứng hoặc bột năng pha nước." },
  { id: 15, recipe_id: 5, step_number: 3, image_url: null, instruction: "Chiên chả giò trong dầu ở nhiệt độ 170°C đến khi vàng ruộm giòn rụm (khoảng 5–7 phút). Vớt ra để ráo dầu. Cuốn cùng bánh tráng tươi, rau sống và chấm nước mắm chua ngọt." },

  // Recipe 6 — Chè Ba Màu
  { id: 16, recipe_id: 6, step_number: 1, image_url: null, instruction: "Nấu đậu xanh với nước đến khi chín bở. Đánh nhuyễn cùng đường và chút muối. Nấu đậu đỏ riêng với đường cho đến khi mềm. Để riêng hai loại đậu nguội hoàn toàn." },
  { id: 17, recipe_id: 6, step_number: 2, image_url: null, instruction: "Nấu nước cốt dừa với đường, muối và bột năng đã hòa tan đến khi hơi sệt. Khuấy liên tục để không bị cháy đáy. Để nguội rồi cho vào tủ lạnh." },
  { id: 18, recipe_id: 6, step_number: 3, image_url: null, instruction: "Xếp ly: cho thạch lá dứa vào đáy, tiếp đến đậu đỏ, rồi đậu xanh đánh. Chan nước cốt dừa lên trên và cuối cùng là đá bào mịn. Thưởng thức ngay khi còn lạnh." },
];

// ── Junction Table ───────────────────────────────────────────
export const recipesCategories: RecipeCategory[] = [
  { recipe_id: 1, category_id: 2 }, // Phở → Súp & Canh
  { recipe_id: 1, category_id: 3 }, // Phở → Ăn Sáng
  { recipe_id: 1, category_id: 7 }, // Phở → Đặc Sản
  { recipe_id: 2, category_id: 3 }, // Bánh Mì → Ăn Sáng
  { recipe_id: 2, category_id: 5 }, // Bánh Mì → Nhanh & Dễ
  { recipe_id: 3, category_id: 5 }, // Gỏi Cuốn → Nhanh & Dễ
  { recipe_id: 3, category_id: 4 }, // Gỏi Cuốn → Chay (có thể làm chay)
  { recipe_id: 4, category_id: 7 }, // Bún Chả → Đặc Sản
  { recipe_id: 5, category_id: 5 }, // Chả Giò → Nhanh & Dễ
  { recipe_id: 5, category_id: 7 }, // Chả Giò → Đặc Sản
  { recipe_id: 6, category_id: 6 }, // Chè Ba Màu → Tráng Miệng
  { recipe_id: 6, category_id: 4 }, // Chè Ba Màu → Chay
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

"use client";

import { useState } from "react";
import Link from "next/link";

interface IngredientItem {
  id: string;
  amount: string;
  unit: string;
  name: string;
}

interface InstructionStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  imageUrl: string | null;
}

export default function CreateRecipePage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Form State
  const [title, setTitle] = useState("Tacos Xoài Sốt Cay Nhiệt Đới");
  const [slug, setSlug] = useState("tacos-xoai-sot-cay-nhiet-doi");
  const [description, setDescription] = useState(
    "Món bánh taco phong cách nhiệt đới độc đáo kết hợp sốt xoài tươi mọng, bắp cải tím giòn ngọt và sốt mayonnaise cay béo ngậy."
  );
  const [category, setCategory] = useState("dinner");
  const [prepTime, setPrepTime] = useState<number | string>(15);
  const [cookTime, setCookTime] = useState<number | string>(20);
  const [servings, setServings] = useState<number | string>(4);
  const [difficulty, setDifficulty] = useState("Dễ");
  const [heroImage, setHeroImage] = useState<string>(
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0UFtmb5iMmKTQzT26fbNkX0OMQe5a3KgDOI2OBYtc3ITutWGgHdouPgXA3GHaB-ZIDPTlpwIF3LgdgERLCtD3Bvdz_dc5VmdCEZfBgw1Ry5gkdOl0_yVe-OUuZ4q45pEDG8g03PGQ5ADr8xgWgaxhSkkQmy8MMeZHeLOj5EjLSpqomdtAnzsDInarMTMPejUYbQK74ADXyO51g5QDvQFr04g8r5JQgTk2-DRdF7mTiEHqAjGsMqcX"
  );

  // Ingredients State
  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { id: "ing-1", amount: "2", unit: "chén", name: "Xoài chín cắt hạt lựu" },
    { id: "ing-2", amount: "1", unit: "chén", name: "Bắp cải tím bào sợi" },
    { id: "ing-3", amount: "0.5", unit: "chén", name: "Rau mùi (ngò rí) băm nhỏ" },
    { id: "ing-4", amount: "8", unit: "cái", name: "Vỏ bánh Tortilla ngô" },
    { id: "ing-5", amount: "2", unit: "muỗng canh", name: "Sốt Mayo ớt cay chipotle" },
  ]);

  // Instructions State
  const [instructions, setInstructions] = useState<InstructionStep[]>([
    {
      id: "step-1",
      stepNumber: 1,
      title: "Sơ chế sốt salsa xoài",
      instruction:
        "Cắt xoài thành các khối vuông nhỏ. Băm nhuyễn hành tím và rau mùi. Trộn tất cả vào tô lớn cùng nước cốt chanh tươi và một chút muối biển. Để nghỉ 10 phút cho ngấm gia vị.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDyX_Hf1xffCShYgi4nA3R2fhgM2580LjzhGIUYuVrGscPZYCIbm0R0KMGQZ0BCPgYN0kYcZY2MIjYs2vzfOgmd7JSHMogFj1AJw96y_eZE_pLweTfYe1NdJLK3twqDm0JnICX6hTOJ6n5UCyCtlXek9T5qnxCRpzjxNA81vctZJNEVUSyzCpwZtRTdOahEEdXWihxu78Z10OZxv7R2mFkDb3sc232XznWtOPK3XxqxJfzSs6tMmcOG",
    },
    {
      id: "step-2",
      stepNumber: 2,
      title: "Trộn salad bắp cải giòn",
      instruction:
        "Bào mỏng bắp cải tím. Trong một bát nhỏ, đánh tan sốt mayonnaise chay với một chút giấm táo và ớt bột. Rưới sốt lên bắp cải và trộn đều.",
      imageUrl: null,
    },
    {
      id: "step-3",
      stepNumber: 3,
      title: "Áp chảo vỏ bánh & Trình bày",
      instruction:
        "Làm nóng vỏ bánh tortilla trên chảo chống dính ở lửa vừa khoảng 30 giây mỗi mặt. Xếp salad bắp cải lên trước, múc salsa xoài lên trên, rắc thêm ngò rí và thưởng thức kèm lát chanh tươi.",
      imageUrl: null,
    },
  ]);

  // Title change -> auto-generate slug
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const generated = newTitle
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generated);
  };

  // Ingredient Handlers
  const handleIngredientChange = (id: string, field: keyof IngredientItem, value: string) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const handleAddIngredient = () => {
    const newId = `ing-${Date.now()}`;
    setIngredients((prev) => [
      ...prev,
      { id: newId, amount: "", unit: "chén", name: "" },
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  // Instruction Handlers
  const handleInstructionChange = <K extends keyof InstructionStep>(
    id: string,
    field: K,
    value: InstructionStep[K]
  ) => {
    setInstructions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAddStep = () => {
    const newStepNum = instructions.length + 1;
    const newId = `step-${Date.now()}`;
    setInstructions((prev) => [
      ...prev,
      {
        id: newId,
        stepNumber: newStepNum,
        title: `Bước ${newStepNum}`,
        instruction: "",
        imageUrl: null,
      },
    ]);
  };

  const handleDuplicateStep = (id: string) => {
    const target = instructions.find((s) => s.id === id);
    if (!target) return;
    const newId = `step-${Date.now()}`;
    const newStep: InstructionStep = {
      ...target,
      id: newId,
      title: `${target.title} (Bản sao)`,
      stepNumber: instructions.length + 1,
    };
    setInstructions((prev) => [...prev, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    if (instructions.length <= 1) return;
    const filtered = instructions.filter((s) => s.id !== id);
    const renumbered = filtered.map((step, idx) => ({
      ...step,
      stepNumber: idx + 1,
    }));
    setInstructions(renumbered);
  };

  // Image upload mock
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setHeroImage(url);
    }
  };

  const handleStepImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleInstructionChange(id, "imageUrl", url);
    }
  };

  // Publish simulation
  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccessModal(true);
    }, 800);
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const categoryLabelMap: Record<string, string> = {
    breakfast: "Bữa Sáng",
    lunch: "Bữa Trưa",
    dinner: "Bữa Tối",
    dessert: "Tráng Miệng",
    soup: "Súp & Canh",
    vegan: "Món Chay / Thanh Đạm",
    specialty: "Món Đặc Sản",
  };

  return (
    <div className="min-h-screen pb-36 max-w-[1200px] mx-auto px-4 md:px-12 py-8 relative">
      {/* ── Toast Notification for Draft ──────────────────────────── */}
      {draftSaved && (
        <div className="fixed top-6 right-6 z-50 bg-[#006c4f] text-white px-5 py-3 rounded-2xl shadow-floating flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-[var(--font-headline)] text-sm font-bold">Bản nháp đã được lưu thành công!</span>
        </div>
      )}

      {/* ── Stepper Breadcrumb Header ─────────────────────────────── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-6 border-b border-[#e3e2df] gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#584140] mb-2 font-[var(--font-headline)] text-xs font-bold uppercase tracking-wider">
            <Link href="/admin" className="hover:text-[#ae2f34] transition-colors">
              Quản Trị
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-[#ae2f34]">
              Bước {currentStep} / 3
            </span>
          </div>

          <h1 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a] tracking-tight">
            {currentStep === 1 && "Tạo Công Thức Mới"}
            {currentStep === 2 && (title || "Nguyên Liệu & Hướng Dẫn Nấu")}
            {currentStep === 3 && "Kiểm Tra Lại Công Thức"}
          </h1>
          <p className="text-sm md:text-base text-[#584140] mt-1">
            {currentStep === 1 && "Điền các thông tin cơ bản để bắt đầu tác phẩm ẩm thực của bạn."}
            {currentStep === 2 && "Định lượng chi tiết nguyên liệu và các bước thực hiện tuần tự."}
            {currentStep === 3 && "Kiểm tra lại toàn bộ công thức trước khi chia sẻ cùng cộng đồng GourmetPop."}
          </p>
        </div>

        {/* Quick Stepper Switcher */}
        <div className="flex items-center gap-2 bg-[#f4f4f0] p-1.5 rounded-full border border-[#e3e2df]">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`px-4 py-1.5 rounded-full text-xs font-[var(--font-headline)] font-bold transition-all ${
              currentStep === 1
                ? "bg-[#ff6b6b] text-white shadow-sm"
                : "text-[#584140] hover:bg-[#e9e8e4]"
            }`}
          >
            1. Thông Tin Cơ Bản
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`px-4 py-1.5 rounded-full text-xs font-[var(--font-headline)] font-bold transition-all ${
              currentStep === 2
                ? "bg-[#ff6b6b] text-white shadow-sm"
                : "text-[#584140] hover:bg-[#e9e8e4]"
            }`}
          >
            2. Nguyên Liệu & Các Bước
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`px-4 py-1.5 rounded-full text-xs font-[var(--font-headline)] font-bold transition-all ${
              currentStep === 3
                ? "bg-[#ff6b6b] text-white shadow-sm"
                : "text-[#584140] hover:bg-[#e9e8e4]"
            }`}
          >
            3. Xem Lại & Xuất Bản
          </button>
        </div>
      </header>

      {/* ============================================================
          STEP 1: BASIC INFO
          ============================================================ */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-in fade-in duration-300">
          {/* Section 1: Basic Info */}
          <section className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_4px_10px_rgba(255,107,107,0.04)] border border-[#e3e2df] hover:shadow-md transition-shadow">
            <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#1b1c1a] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ae2f34]">edit_note</span>
              Thông Tin Cơ Bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a]">
                  Tên Công Thức <span className="text-[#ae2f34]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ví dụ: Gà Xào Húng Quế Cay Thái Lan"
                  className="vibrant-input text-base"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a]">
                  Đường dẫn tĩnh (Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ga-xao-hung-que-cay"
                  className="vibrant-input text-base text-[#584140] font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <label className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a]">
                Mô Tả Ngắn
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn gọn, hấp dẫn về hương vị món ăn..."
                className="vibrant-input min-h-[120px] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a]">
                  Danh Mục Món Ăn
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="vibrant-input cursor-pointer"
                >
                  <option value="dinner">Bữa Tối</option>
                  <option value="lunch">Bữa Trưa</option>
                  <option value="breakfast">Bữa Sáng</option>
                  <option value="dessert">Tráng Miệng</option>
                  <option value="soup">Súp & Canh</option>
                  <option value="vegan">Món Chay / Thanh Đạm</option>
                  <option value="specialty">Món Đặc Sản</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a]">
                  Độ Khó
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="vibrant-input cursor-pointer"
                >
                  <option value="Dễ">Dễ (Dành cho người mới)</option>
                  <option value="Trung bình">Trung bình (Nấu tại gia)</option>
                  <option value="Khó">Khó (Thử thách tay nghề)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Time & Servings */}
          <section className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_4px_10px_rgba(255,107,107,0.04)] border border-[#e3e2df] hover:shadow-md transition-shadow">
            <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#1b1c1a] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ae2f34]">schedule</span>
              Thời Gian & Khẩu Phần
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-[var(--font-headline)] text-sm font-semibold text-[#1b1c1a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#8c706f]">timer</span>
                  Chuẩn bị (phút)
                </label>
                <input
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="15"
                  className="vibrant-input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-[var(--font-headline)] text-sm font-semibold text-[#1b1c1a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#8c706f]">skillet</span>
                  Nấu (phút)
                </label>
                <input
                  type="number"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  placeholder="30"
                  className="vibrant-input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-[var(--font-headline)] text-sm font-semibold text-[#1b1c1a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#8c706f]">group</span>
                  Khẩu phần (người)
                </label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="4"
                  className="vibrant-input"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Media */}
          <section className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_4px_10px_rgba(255,107,107,0.04)] border border-[#e3e2df] hover:shadow-md transition-shadow">
            <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#1b1c1a] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ae2f34]">photo_camera</span>
              Ảnh Đại Diện Món Ăn
            </h3>

            {heroImage ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#e3e2df] aspect-[21/9] max-h-72 group">
                <img
                  src={heroImage}
                  alt="Ảnh xem trước món ăn"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <label className="btn-coral-punch cursor-pointer text-sm">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    Đổi Ảnh
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setHeroImage("")}
                    className="bg-white/90 text-[#ba1a1a] hover:bg-white px-4 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Xóa
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#8c706f]/40 rounded-2xl bg-[#f4f4f0] p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#efeeea] hover:border-[#ff6b6b] transition-all group">
                <span className="material-symbols-outlined text-[52px] text-[#ff6b6b] mb-3 group-hover:scale-110 transition-transform">
                  cloud_upload
                </span>
                <p className="font-[var(--font-headline)] font-bold text-base text-[#1b1c1a] mb-1">
                  Kéo và thả ảnh đại diện món ăn vào đây
                </p>
                <p className="text-sm text-[#584140]">
                  hoặc bấm để duyệt tệp (JPG, PNG, WebP tối đa 5MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </section>

          {/* Actions Footer */}
          <div className="mt-6 pt-6 border-t border-[#e3e2df] flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              type="button"
              disabled
              className="text-[#8c706f] font-[var(--font-headline)] text-sm font-semibold flex items-center gap-2 opacity-50 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Quay lại
            </button>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-outline flex-1 md:flex-none"
              >
                Xem Trước
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn-coral-punch flex-1 md:flex-none flex items-center justify-center gap-2"
              >
                Tiếp tục
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          STEP 2: INGREDIENTS & INSTRUCTIONS
          ============================================================ */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-2">
            <span className="font-[var(--font-headline)] text-sm font-bold text-[#584140]">
              Tùy chỉnh định lượng nguyên liệu và các bước nấu chi tiết
            </span>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn-outline text-sm py-2 px-5"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Lưu Bản Nháp
            </button>
          </div>

          {/* Section 4: Ingredients */}
          <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_4px_10px_rgba(255,107,107,0.04)] border border-[#e3e2df] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b6b]/5 rounded-bl-full -z-10" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6b6b]">grocery</span>
                Nguyên Liệu
              </h3>
              <span className="bg-[#ff6b6b]/10 text-[#ae2f34] font-[var(--font-headline)] text-xs font-bold px-3 py-1.5 rounded-full">
                Khẩu phần: {servings} người
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {ingredients.map((ing) => (
                <div key={ing.id} className="flex gap-2 items-center group">
                  <span className="material-symbols-outlined text-[#8c706f] cursor-grab active:cursor-grabbing text-[20px]">
                    drag_indicator
                  </span>
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={(e) => handleIngredientChange(ing.id, "amount", e.target.value)}
                    placeholder="SL"
                    className="vibrant-input w-20 text-center font-bold"
                  />
                  <select
                    value={ing.unit}
                    onChange={(e) => handleIngredientChange(ing.id, "unit", e.target.value)}
                    className="vibrant-input w-36 px-2 text-sm"
                  >
                    <option value="chén">chén / bát</option>
                    <option value="muỗng canh">muỗng canh (tbsp)</option>
                    <option value="muỗng cà phê">muỗng cà phê (tsp)</option>
                    <option value="g">gam (g)</option>
                    <option value="kg">kg</option>
                    <option value="cái">cái / quả / củ</option>
                    <option value="lát">lát / miếng</option>
                    <option value="bó">bó</option>
                    <option value="nắm">nắm</option>
                    <option value="tép">tép</option>
                    <option value="ml">ml</option>
                    <option value="lít">lít (l)</option>
                  </select>
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(ing.id, "name", e.target.value)}
                    placeholder="Tên nguyên liệu..."
                    className="vibrant-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing.id)}
                    className="text-[#8c706f] hover:text-[#ba1a1a] p-2 rounded-full hover:bg-[#ffdad6] transition-colors"
                    title="Xóa nguyên liệu"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Add ingredient buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddIngredient}
                className="w-full py-3.5 border-2 border-dashed border-[#ff6b6b]/40 rounded-2xl text-[#ae2f34] font-[var(--font-headline)] font-bold text-sm hover:bg-[#ff6b6b]/5 hover:border-[#ff6b6b] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Thêm Nguyên Liệu
              </button>
            </div>
          </div>

          {/* Section 5: Step-by-Step Instructions */}
          <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_4px_10px_rgba(255,107,107,0.04)] border border-[#e3e2df]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6b6b]">format_list_numbered</span>
                Hướng Dẫn Từng Bước
              </h3>
              <span className="text-xs font-semibold text-[#584140]">
                Đã cấu hình {instructions.length} bước
              </span>
            </div>

            {/* Timeline Container */}
            <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-[#e3e2df]">
              {instructions.map((step) => (
                <div
                  key={step.id}
                  className="relative bouncy-hover bg-[#faf9f5] rounded-2xl p-6 border border-[#efeeea]"
                >
                  {/* Step Bubble Indicator */}
                  <div className="absolute left-[-41px] top-6 w-8 h-8 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center font-bold text-sm ring-4 ring-[#faf9f5] shadow-sm z-10 font-[var(--font-headline)]">
                    {step.stepNumber}
                  </div>

                  {/* Step Header */}
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) =>
                        handleInstructionChange(step.id, "title", e.target.value)
                      }
                      placeholder="Tiêu đề bước (ví dụ: Sơ chế sốt salsa)"
                      className="font-[var(--font-headline)] text-lg md:text-xl font-bold text-[#1b1c1a] bg-transparent border-0 border-b-2 border-transparent focus:border-[#ff6b6b]/40 focus:ring-0 px-0 py-1 transition-colors w-2/3"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicateStep(step.id)}
                        className="text-[#8c706f] hover:text-[#ae2f34] p-1.5 rounded-lg hover:bg-[#e9e8e4] transition-colors"
                        title="Nhân bản bước"
                      >
                        <span className="material-symbols-outlined text-[20px]">content_copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(step.id)}
                        className="text-[#8c706f] hover:text-[#ba1a1a] p-1.5 rounded-lg hover:bg-[#ffdad6] transition-colors"
                        title="Xóa bước"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <textarea
                        value={step.instruction}
                        onChange={(e) =>
                          handleInstructionChange(step.id, "instruction", e.target.value)
                        }
                        placeholder="Mô tả chi tiết các thao tác thực hiện..."
                        className="vibrant-input w-full h-32 resize-y"
                      />
                    </div>

                    {/* Step Image Upload Box */}
                    <div className="w-full md:w-44 h-32 bg-[#efeeea] rounded-xl border-2 border-dashed border-[#8c706f]/40 flex flex-col items-center justify-center text-[#584140] hover:bg-[#e9e8e4] transition-colors cursor-pointer relative overflow-hidden group">
                      {step.imageUrl ? (
                        <>
                          <img
                            src={step.imageUrl}
                            alt={step.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-40 transition-opacity"
                          />
                          <label className="relative z-10 flex flex-col items-center group-hover:opacity-100 bg-black/40 w-full h-full justify-center text-white opacity-0 transition-opacity cursor-pointer">
                            <span className="material-symbols-outlined">add_photo_alternate</span>
                            <span className="font-[var(--font-headline)] text-xs font-bold mt-1">
                              Đổi Ảnh
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleStepImageUpload(step.id, e)}
                              className="hidden"
                            />
                          </label>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                          <span className="material-symbols-outlined group-hover:text-[#ae2f34] transition-colors mb-1 text-[28px]">
                            add_photo_alternate
                          </span>
                          <span className="font-[var(--font-headline)] text-xs font-bold">
                            Thêm Ảnh
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleStepImageUpload(step.id, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Next Step */}
            <div className="mt-8 pl-8">
              <button
                type="button"
                onClick={handleAddStep}
                className="btn-outline w-full flex items-center justify-center gap-2 border-dashed py-3.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Thêm Bước Tiếp Theo
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-4 pt-6 border-t border-[#e3e2df] flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-[#584140] font-[var(--font-headline)] text-sm font-bold hover:text-[#ae2f34] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Quay Lại Thông Tin Cơ Bản
            </button>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-outline flex-1 md:flex-none"
              >
                Xem Trước
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-coral-punch flex-1 md:flex-none flex items-center justify-center gap-2"
              >
                Tiếp Theo: Xem Lại & Xuất Bản
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          STEP 3: PREVIEW & PUBLISH
          ============================================================ */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-2">
            <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#ffd167] text-[#765900] font-[var(--font-headline)] text-xs font-bold mb-2">
              Bước 3 / 3: Sẵn Sàng Xuất Bản
            </span>
            <h2 className="font-[var(--font-headline)] text-3xl md:text-5xl font-extrabold text-[#1b1c1a] tracking-tight mb-2">
              Kiểm Tra Lại Công Thức
            </h2>
            <p className="text-base text-[#584140]">
              Hãy kiểm tra lại lần cuối trước khi chia sẻ món ngon này cùng cộng đồng GourmetPop.
            </p>
          </div>

          {/* Preview Canvas */}
          <div className="bg-white rounded-[24px] shadow-[0_10px_25px_rgba(255,107,107,0.06)] border border-[#e3e2df] p-6 md:p-10 relative overflow-hidden">
            {/* Hero Image */}
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 relative group border border-[#efeeea]">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#efeeea] flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-[#8c706f]">
                    restaurant
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-[#00b083] text-white px-4 py-1.5 rounded-full font-[var(--font-headline)] text-xs font-bold shadow-floating">
                {categoryLabelMap[category] ?? "Món Đặc Sản"}
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a] mb-3">
                    {title}
                  </h2>
                  <p className="text-base md:text-lg text-[#584140] leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Meta Details Bento */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-[#faf9f5] border border-[#efeeea] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[#ae2f34] mb-1">timer</span>
                    <span className="font-[var(--font-headline)] text-[10px] font-bold text-[#8c706f] uppercase tracking-wider">
                      Chuẩn Bị
                    </span>
                    <span className="font-[var(--font-headline)] text-base font-bold text-[#1b1c1a]">
                      {prepTime} phút
                    </span>
                  </div>

                  <div className="bg-[#faf9f5] border border-[#efeeea] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[#ae2f34] mb-1">cooking</span>
                    <span className="font-[var(--font-headline)] text-[10px] font-bold text-[#8c706f] uppercase tracking-wider">
                      Thời Gian Nấu
                    </span>
                    <span className="font-[var(--font-headline)] text-base font-bold text-[#1b1c1a]">
                      {cookTime} phút
                    </span>
                  </div>

                  <div className="bg-[#faf9f5] border border-[#efeeea] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[#ae2f34] mb-1">restaurant</span>
                    <span className="font-[var(--font-headline)] text-[10px] font-bold text-[#8c706f] uppercase tracking-wider">
                      Khẩu Phần
                    </span>
                    <span className="font-[var(--font-headline)] text-base font-bold text-[#1b1c1a]">
                      {servings} người
                    </span>
                  </div>

                  <div className="bg-[#faf9f5] border border-[#efeeea] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[#ae2f34] mb-1">
                      local_fire_department
                    </span>
                    <span className="font-[var(--font-headline)] text-[10px] font-bold text-[#8c706f] uppercase tracking-wider">
                      Độ Khó
                    </span>
                    <span className="font-[var(--font-headline)] text-base font-bold text-[#1b1c1a]">
                      {difficulty}
                    </span>
                  </div>
                </div>

                {/* Instructions Preview */}
                <div>
                  <h3 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a] mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff6b6b]">format_list_numbered</span>
                    Hướng Dẫn Nấu Chi Tiết
                  </h3>
                  <div className="space-y-6">
                    {instructions.map((step) => (
                      <div key={step.id} className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center font-[var(--font-headline)] text-sm font-bold mt-0.5">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-[var(--font-headline)] font-bold text-[#1b1c1a] text-base">
                            {step.title}
                          </h4>
                          <p className="text-sm text-[#584140] leading-relaxed">
                            {step.instruction}
                          </p>
                          {step.imageUrl && (
                            <div className="mt-3 rounded-xl overflow-hidden max-h-48 max-w-sm border border-[#efeeea]">
                              <img
                                src={step.imageUrl}
                                alt={step.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Ingredients */}
              <div>
                <div className="bg-[#faf9f5] border border-[#efeeea] p-6 rounded-2xl sticky top-24">
                  <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#1b1c1a] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ae2f34]">kitchen</span>
                    Danh Sách Nguyên Liệu ({ingredients.length})
                  </h3>
                  <ul className="space-y-3">
                    {ingredients.map((ing) => (
                      <li
                        key={ing.id}
                        className="flex justify-between items-center border-b border-[#e3e2df]/60 pb-2 text-sm"
                      >
                        <span className="text-[#1b1c1a] font-medium">{ing.name}</span>
                        <span className="font-[var(--font-headline)] font-bold text-[#584140]">
                          {ing.amount} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Contextual Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#e3e2df] px-4 md:px-12 py-4 flex justify-between items-center shadow-lg">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-full font-[var(--font-headline)] text-sm font-bold text-[#ae2f34] hover:bg-[#ff6b6b]/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              Quay Lại Chỉnh Sửa
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="btn-coral-punch px-8 py-3 rounded-full font-[var(--font-headline)] text-sm font-bold flex items-center gap-2 elevation-fab text-white cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  Đang Xuất Bản...
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  Xuất Bản Công Thức
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          SUCCESS MODAL
          ============================================================ */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-[480px] text-center shadow-floating border border-[#efeeea] animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#00b083]/15 text-[#006c4f] rounded-full flex items-center justify-center mx-auto mb-4">
              <span
                className="material-symbols-outlined text-[36px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h3 className="font-[var(--font-headline)] text-2xl font-extrabold text-[#1b1c1a] mb-2">
              Xuất Bản Thành Công!
            </h3>
            <p className="text-sm text-[#584140] mb-6">
              Món &quot;{title}&quot; hiện đã được xuất bản trực tuyến trên GourmetPop.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/admin"
                className="btn-coral-punch w-full py-3 text-center"
              >
                Về Bảng Điều Khiển
              </Link>
              <Link
                href="/"
                className="btn-outline w-full py-3 text-center"
              >
                Xem Trên Trang Công Khai
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

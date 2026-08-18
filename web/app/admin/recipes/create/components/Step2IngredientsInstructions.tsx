"use client";

import { ImageUploader } from "./ImageUploader";
import { FormSection } from "./FormSection";
import { CustomSelect, SelectOption } from "./CustomSelect";
import { StepNavigationFooter } from "./StepNavigationFooter";
import {
  FormIngredientItem,
  FormInstructionStep,
  CreateRecipeFormData,
} from "@/src/types/recipe";

export const UNIT_OPTIONS: SelectOption<string>[] = [
  { value: "g", label: "gam (g)" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "lít", label: "lít (l)" },
  { value: "chén", label: "chén / bát" },
  { value: "muỗng canh", label: "muỗng canh (tbsp)" },
  { value: "muỗng cà phê", label: "muỗng cà phê (tsp)" },
  { value: "cái", label: "cái / quả / củ" },
  { value: "lát", label: "lát / miếng" },
  { value: "bó", label: "bó" },
  { value: "nắm", label: "nắm" },
  { value: "tép", label: "tép" },
  { value: "gói", label: "gói" },
  { value: "lon", label: "lon / hộp" },
];

interface Step2Props {
  formData: CreateRecipeFormData;
  updateField: <K extends keyof CreateRecipeFormData>(
    field: K,
    value: CreateRecipeFormData[K]
  ) => void;
  errors: Record<string, string>;
  onBack: () => void;
  onNext: () => void;
  onPreview: () => void;
  onSaveDraft?: () => void;
}

export function Step2IngredientsInstructions({
  formData,
  updateField,
  errors,
  onBack,
  onNext,
  onPreview,
  onSaveDraft,
}: Step2Props) {
  // ── Ingredients Handlers ─────────────────────────────────────
  const handleIngredientChange = (
    id: string,
    field: keyof FormIngredientItem,
    value: string
  ) => {
    const updated = formData.ingredients.map((ing) =>
      ing.id === id ? { ...ing, [field]: value } : ing
    );
    updateField("ingredients", updated);
  };

  const handleAddIngredient = () => {
    const newId = `ing-${Date.now()}`;
    updateField("ingredients", [
      ...formData.ingredients,
      { id: newId, amount: "", unit: "g", name: "" },
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    if (formData.ingredients.length <= 1) {
      updateField("ingredients", [
        { id: `ing-${Date.now()}`, amount: "", unit: "g", name: "" },
      ]);
      return;
    }
    updateField(
      "ingredients",
      formData.ingredients.filter((ing) => ing.id !== id)
    );
  };

  // ── Instructions Handlers ────────────────────────────────────
  const handleInstructionChange = <K extends keyof FormInstructionStep>(
    id: string,
    field: K,
    value: FormInstructionStep[K]
  ) => {
    const updated = formData.instructions.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    updateField("instructions", updated);
  };

  const handleAddStep = () => {
    const nextStepNum = formData.instructions.length + 1;
    const newId = `step-${Date.now()}`;
    updateField("instructions", [
      ...formData.instructions,
      {
        id: newId,
        stepNumber: nextStepNum,
        title: `Bước ${nextStepNum}`,
        instruction: "",
        imageUrl: null,
      },
    ]);
  };

  const handleDuplicateStep = (id: string) => {
    const target = formData.instructions.find((s) => s.id === id);
    if (!target) return;

    const newId = `step-${Date.now()}`;
    const newStep: FormInstructionStep = {
      ...target,
      id: newId,
      title: `${target.title || `Bước ${target.stepNumber}`} (Bản sao)`,
      stepNumber: formData.instructions.length + 1,
    };
    updateField("instructions", [...formData.instructions, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    if (formData.instructions.length <= 1) return;
    const filtered = formData.instructions.filter((s) => s.id !== id);
    const renumbered = filtered.map((step, idx) => ({
      ...step,
      stepNumber: idx + 1,
      title: step.title?.startsWith("Bước ") ? `Bước ${idx + 1}` : step.title,
    }));
    updateField("instructions", renumbered);
  };

  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* ── Subheader / Actions ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <span className="font-[var(--font-headline)] text-sm font-bold text-[#584140]">
          Định lượng chi tiết nguyên liệu và các bước nấu từng giai đoạn
        </span>
        <button
          type="button"
          onClick={onSaveDraft}
          className="btn-outline text-sm py-2 px-5 flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          Lưu Bản Nháp
        </button>
      </div>

      {/* ── Section 4: Ingredients List ────────────────────────── */}
      <FormSection
        icon="grocery"
        iconColor="text-[#ff6b6b]"
        title="Nguyên Liệu"
        required
        subtitle="Nhập định lượng, đơn vị đo và tên nguyên liệu"
        badge={
          <span className="bg-[#ff6b6b]/10 text-[#ae2f34] font-[var(--font-headline)] text-xs font-bold px-3 py-1.5 rounded-full">
            Khẩu phần: {formData.servings || 4} người
          </span>
        }
      >
        {errors.ingredients && (
          <div className="mb-4 p-3 bg-[#ffdad6]/60 rounded-xl text-xs text-[#ba1a1a] font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errors.ingredients}</span>
          </div>
        )}

        {/* Ingredients Column Headers */}
        <div className="flex gap-2.5 items-center px-1 text-[11px] font-[var(--font-headline)] font-bold text-[#8c706f] uppercase tracking-wider mb-1.5 select-none">
          <span className="w-5 text-center opacity-40">#</span>
          <span className="w-16 sm:w-20 text-center">Số lượng</span>
          <span className="w-28 sm:w-32">Đơn vị</span>
          <span className="flex-1">Tên nguyên liệu</span>
          <span className="w-8" />
        </div>

        {/* Ingredients Rows */}
        <div className="space-y-3">
          {formData.ingredients.map((ing, idx) => (
            <div key={ing.id} className="flex gap-2.5 items-center group">
              <span className="material-symbols-outlined text-[#8c706f] text-[20px] select-none opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0">
                drag_indicator
              </span>

              {/* Amount (compact) */}
              <input
                type="text"
                value={ing.amount}
                onChange={(e) =>
                  handleIngredientChange(ing.id, "amount", e.target.value)
                }
                placeholder="SL"
                className="vibrant-input !w-16 sm:w-20 text-center font-bold text-sm h-[46px] flex-shrink-0"
              />

              {/* Unit Custom Select (compact react-select) */}
              <div className="w-28 sm:w-32 flex-shrink-0">
                <CustomSelect<string>
                  options={UNIT_OPTIONS}
                  value={ing.unit}
                  onChange={(val) =>
                    handleIngredientChange(ing.id, "unit", val || "g")
                  }
                  placeholder="Đơn vị"
                  isSearchable={true}
                  size="md"
                />
              </div>

              {/* Ingredient Name (expanded width) */}
              <input
                type="text"
                value={ing.name}
                onChange={(e) =>
                  handleIngredientChange(ing.id, "name", e.target.value)
                }
                placeholder={`Tên nguyên liệu ${idx + 1} (vd: Thịt thăn bò, Xương ống, Nước mắm...)`}
                className="vibrant-input flex-1 min-w-[180px] text-sm h-[46px]"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveIngredient(ing.id)}
                className="text-[#8c706f] hover:text-[#ba1a1a] p-2 rounded-full hover:bg-[#ffdad6] transition-colors cursor-pointer flex-shrink-0"
                title="Xóa nguyên liệu"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          ))}
        </div>


        {/* Add Ingredient Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleAddIngredient}
            className="w-full py-3 border-2 border-dashed border-[#ff6b6b]/40 rounded-2xl text-[#ae2f34] font-[var(--font-headline)] font-bold text-sm hover:bg-[#ff6b6b]/5 hover:border-[#ff6b6b] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Thêm Nguyên Liệu Mới
          </button>
        </div>
      </FormSection>

      {/* ── Section 5: Step-by-Step Instructions ───────────────── */}
      <FormSection
        icon="format_list_numbered"
        iconColor="text-[#ff6b6b]"
        title="Hướng Dẫn Từng Bước"
        required
        subtitle="Mô tả chi tiết từng thao tác và đính kèm ảnh minh họa"
        badge={
          <span className="text-xs font-semibold text-[#584140] bg-[#efeeea] px-3 py-1.5 rounded-full">
            {formData.instructions.length} bước thực hiện
          </span>
        }
      >
        {errors.instructions && (
          <div className="mb-6 p-3 bg-[#ffdad6]/60 rounded-xl text-xs text-[#ba1a1a] font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errors.instructions}</span>
          </div>
        )}

        {/* Steps Timeline Container */}
        <div className="relative pl-12 space-y-8 before:absolute before:inset-y-0 before:left-6 before:-translate-x-1/2 before:w-[2px] before:bg-[#e3e2df]">
          {formData.instructions.map((step) => (
            <div
              key={step.id}
              className="relative bg-[#faf9f5] rounded-2xl p-5 md:p-6 border border-[#efeeea] hover:border-[#ff6b6b]/40 transition-colors"
            >
              {/* Step Number Badge */}
              <div className="absolute -left-6 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center font-bold text-sm ring-4 ring-[#faf9f5] shadow-sm z-10 font-[var(--font-headline)]">
                {step.stepNumber}
              </div>

              {/* Step Header */}
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={step.title || ""}
                  onChange={(e) =>
                    handleInstructionChange(step.id, "title", e.target.value)
                  }
                  placeholder={`Tiêu đề Bước ${step.stepNumber} (ví dụ: Sơ chế và ướp gia vị)`}
                  className="font-[var(--font-headline)] text-base md:text-lg font-bold text-[#1b1c1a] bg-transparent border-0 border-b-2 border-transparent focus:border-[#ff6b6b]/50 focus:ring-0 px-0 py-1 transition-colors w-2/3"
                />

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDuplicateStep(step.id)}
                    className="text-[#8c706f] hover:text-[#ae2f34] p-1.5 rounded-lg hover:bg-[#e9e8e4] transition-colors cursor-pointer"
                    title="Nhân bản bước này"
                  >
                    <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(step.id)}
                    disabled={formData.instructions.length <= 1}
                    className="text-[#8c706f] hover:text-[#ba1a1a] p-1.5 rounded-lg hover:bg-[#ffdad6] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Xóa bước này"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Step Content */}
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                  <textarea
                    value={step.instruction}
                    onChange={(e) =>
                      handleInstructionChange(step.id, "instruction", e.target.value)
                    }
                    placeholder="Mô tả chi tiết các thao tác thực hiện, thời gian canh lửa, lưu ý..."
                    className="vibrant-input w-full h-32 resize-y text-sm leading-relaxed"
                  />
                </div>

                {/* Step Image Upload (Cloudinary) */}
                <div className="w-full md:w-48 flex-shrink-0">
                  <ImageUploader
                    value={step.imageUrl}
                    onChange={(url) =>
                      handleInstructionChange(step.id, "imageUrl", url)
                    }
                    variant="compact"
                    label={`Ảnh bước ${step.stepNumber}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Next Step Button */}
        <div className="mt-8 pl-12">
          <button
            type="button"
            onClick={handleAddStep}
            className="btn-outline w-full flex items-center justify-center gap-2 border-dashed py-3.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Thêm Bước Tiếp Theo
          </button>
        </div>
      </FormSection>

      {/* ── Actions Footer ─────────────────────────────────────── */}
      <StepNavigationFooter
        onBack={onBack}
        backLabel="Quay Lại Thông Tin Cơ Bản"
        onPreview={onPreview}
        onNext={onNext}
        nextLabel="Tiếp Theo: Xem Lại & Xuất Bản"
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Step1BasicInfo } from "./components/Step1BasicInfo";
import { Step2IngredientsInstructions } from "./components/Step2IngredientsInstructions";
import { Step3PreviewPublish } from "./components/Step3PreviewPublish";
import { PublishSuccessModal } from "./components/PublishSuccessModal";
import { createRecipe } from "@/src/services/recipeApi";
import { ApiError } from "@/src/services/apiClient";
import {
  CreateRecipeFormData,
  Recipe,
  RecipeBody,
} from "@/src/types/recipe";
import {
  recipeStep1Schema,
  recipeStep2Schema,
  formatZodFieldErrors,
} from "@/src/schemas";

const DRAFT_STORAGE_KEY = "gourmet_recipe_create_draft_v1";

const createEmptyFormData = (): CreateRecipeFormData => ({
  title: "",
  slug: "",
  description: "",
  categories: [],
  prepTimeMinutes: "",
  cookTimeMinutes: "",
  servings: "",
  imageUrl: "",
  ingredients: [
    { id: `ing-${Date.now()}`, amount: "", unit: "g", name: "" },
  ],
  instructions: [
    {
      id: `step-${Date.now()}`,
      stepNumber: 1,
      title: "Bước 1",
      instruction: "",
      imageUrl: null,
    },
  ],
});

export default function CreateRecipePage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<CreateRecipeFormData>(createEmptyFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [createdRecipe, setCreatedRecipe] = useState<Recipe | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasStoredDraft, setHasStoredDraft] = useState(false);

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        setHasStoredDraft(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const updateField = <K extends keyof CreateRecipeFormData>(
    field: K,
    value: CreateRecipeFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ── Draft Handling ───────────────────────────────────────────
  const handleSaveDraft = () => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      showToast("Bản nháp đã được lưu an toàn trên trình duyệt!");
      setHasStoredDraft(false);
    } catch (e) {
      console.error("Failed to save draft:", e);
    }
  };

  const handleRestoreDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        showToast("Đã khôi phục thành công dữ liệu bản nháp!");
        setHasStoredDraft(false);
      }
    } catch (e) {
      console.error("Failed to restore draft:", e);
    }
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasStoredDraft(false);
      showToast("Đã xóa bản nháp đã lưu.");
    } catch (e) {
      console.error("Failed to discard draft:", e);
    }
  };

  // ── Validation ───────────────────────────────────────────────
  // ── Validation using Zod Schemas ───────────────────────────
  const validateStep1 = (): boolean => {
    const result = recipeStep1Schema.safeParse(formData);
    if (!result.success) {
      const errs = formatZodFieldErrors(result.error);
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = (): boolean => {
    const result = recipeStep2Schema.safeParse(formData);
    if (!result.success) {
      const errs = formatZodFieldErrors(result.error);
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateAll = (): boolean => {
    const step1Ok = validateStep1();
    const step2Ok = validateStep2();
    return step1Ok && step2Ok;
  };

  // ── Step Navigation ──────────────────────────────────────────
  const goToStep = (step: 1 | 2 | 3) => {
    if (step === 2) {
      if (!validateStep1()) {
        showToast("Vui lòng hoàn thành các trường bắt buộc ở Bước 1!");
        return;
      }
    } else if (step === 3) {
      if (!validateStep1()) {
        setCurrentStep(1);
        showToast("Vui lòng hoàn thành các thông tin cơ bản ở Bước 1!");
        return;
      }
      if (!validateStep2()) {
        setCurrentStep(2);
        showToast("Vui lòng hoàn thành nguyên liệu & các bước ở Bước 2!");
        return;
      }
    }
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Publish Action ───────────────────────────────────────────
  const handlePublish = async () => {
    if (!validateAll()) {
      setPublishError("Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc.");
      showToast("Vui lòng kiểm tra lại các trường thông tin!");
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    // Format payload matching backend Zod schema
    const payload: RecipeBody = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim() || null,
      prep_time_minutes: Math.max(0, Number(formData.prepTimeMinutes) || 0),
      cook_time_minutes: Math.max(0, Number(formData.cookTimeMinutes) || 0),
      servings: Math.max(1, Number(formData.servings) || 1),
      image_url: formData.imageUrl.trim(),
      categories: formData.categories,
      ingredients: formData.ingredients
        .filter((ing) => ing.name.trim() !== "")
        .map((ing) => ({
          name: ing.name.trim(),
          amount: isNaN(Number(ing.amount)) ? ing.amount.trim() || "1" : Number(ing.amount),
          unit: ing.unit.trim() || "g",
        })),
      instructions: formData.instructions
        .filter((step) => step.instruction.trim() !== "")
        .map((step, idx) => ({
          step_number: idx + 1,
          instruction: step.instruction.trim(),
          image_url: step.imageUrl ? step.imageUrl.trim() : null,
        })),
    };

    try {
      const result = await createRecipe(payload);
      setCreatedRecipe(result);

      // Clear draft on successful publication
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {}

      showToast("Tạo công thức thành công!");
    } catch (err: any) {
      console.error("[CreateRecipePage] Publication error:", err);
      const errMsg =
        err instanceof ApiError
          ? err.message
          : err?.response?.data?.error ||
            err?.message ||
            "Đã xảy ra lỗi khi tạo công thức. Vui lòng thử lại.";
      setPublishError(errMsg);
      showToast(`Lỗi: ${errMsg}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleResetForm = () => {
    setFormData(createEmptyFormData());
    setCreatedRecipe(null);
    setCurrentStep(1);
    setErrors({});
    setPublishError(null);
  };

  return (
    <div className="min-h-screen pb-36 max-w-[1200px] mx-auto px-4 md:px-12 py-8 relative">
      {/* ── Toast Notification Banner ─────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1b1c1a] text-white px-5 py-3 rounded-2xl shadow-floating flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-[#06d6a0] text-[22px]">
            check_circle
          </span>
          <span className="font-[var(--font-headline)] text-sm font-bold">
            {toastMessage}
          </span>
        </div>
      )}

      {/* ── Saved Draft Prompt Banner ────────────────────────────── */}
      {hasStoredDraft && (
        <div className="mb-6 p-4 rounded-2xl bg-[#ffd167]/20 border border-[#ffd167] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-[#765900]">
            <span className="material-symbols-outlined text-[24px]">history</span>
            <span className="text-sm font-medium">
              Bạn có một bản nháp công thức chưa hoàn thành từ phiên làm việc trước.
            </span>
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-3.5 py-1.5 rounded-xl bg-[#765900] text-white text-xs font-[var(--font-headline)] font-bold hover:bg-[#5b4300] transition-colors cursor-pointer"
            >
              Khôi Phục
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#e3e2df] text-[#584140] text-xs font-[var(--font-headline)] font-bold hover:bg-[#f4f4f0] transition-colors cursor-pointer"
            >
              Bỏ Qua
            </button>
          </div>
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
            <span className="text-[#ae2f34]">Bước {currentStep} / 3</span>
          </div>

          <h1 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a] tracking-tight">
            {currentStep === 1 && "Tạo Công Thức Mới"}
            {currentStep === 2 && (formData.title || "Nguyên Liệu & Hướng Dẫn")}
            {currentStep === 3 && "Kiểm Tra Lại Công Thức"}
          </h1>
          <p className="text-sm md:text-base text-[#584140] mt-1">
            {currentStep === 1 &&
              "Điền các thông tin cơ bản và tải ảnh đại diện chất lượng cao cho món ăn."}
            {currentStep === 2 &&
              "Định lượng chính xác nguyên liệu và mô tả từng bước thực hiện tuần tự."}
            {currentStep === 3 &&
              "Kiểm tra tổng thể bản xem trước trước khi xuất bản chính thức."}
          </p>
        </div>

        {/* Stepper Navigation Pills */}
        <div className="flex items-center gap-1.5 bg-[#f4f4f0] p-1.5 rounded-full border border-[#e3e2df] select-none">
          <button
            type="button"
            onClick={() => goToStep(1)}
            className={`px-4 py-2 rounded-full text-xs font-[var(--font-headline)] font-bold transition-all cursor-pointer ${
              currentStep === 1
                ? "bg-[#ff6b6b] text-white shadow-sm"
                : "text-[#584140] hover:bg-[#e9e8e4]"
            }`}
          >
            1. Thông Tin Cơ Bản
          </button>
          <button
            type="button"
            onClick={() => goToStep(2)}
            className={`px-4 py-2 rounded-full text-xs font-[var(--font-headline)] font-bold transition-all cursor-pointer ${
              currentStep === 2
                ? "bg-[#ff6b6b] text-white shadow-sm"
                : "text-[#584140] hover:bg-[#e9e8e4]"
            }`}
          >
            2. Nguyên Liệu & Các Bước
          </button>
          <button
            type="button"
            onClick={() => goToStep(3)}
            className={`px-4 py-2 rounded-full text-xs font-[var(--font-headline)] font-bold transition-all cursor-pointer ${
              currentStep === 3
                ? "bg-[#ff6b6b] text-white shadow-sm"
                : "text-[#584140] hover:bg-[#e9e8e4]"
            }`}
          >
            3. Xem Lại & Xuất Bản
          </button>
        </div>
      </header>

      {/* ── STEP 1: Basic Info & Hero Image ───────────────────────── */}
      {currentStep === 1 && (
        <Step1BasicInfo
          formData={formData}
          updateField={updateField}
          errors={errors}
          onNext={() => goToStep(2)}
          onPreview={() => goToStep(3)}
        />
      )}

      {/* ── STEP 2: Ingredients & Instructions ─────────────────────── */}
      {currentStep === 2 && (
        <Step2IngredientsInstructions
          formData={formData}
          updateField={updateField}
          errors={errors}
          onBack={() => setCurrentStep(1)}
          onNext={() => goToStep(3)}
          onPreview={() => goToStep(3)}
          onSaveDraft={handleSaveDraft}
        />
      )}

      {/* ── STEP 3: Preview & Publish ─────────────────────────────── */}
      {currentStep === 3 && (
        <Step3PreviewPublish
          formData={formData}
          isPublishing={isPublishing}
          publishError={publishError}
          onBack={() => setCurrentStep(2)}
          onPublish={handlePublish}
        />
      )}

      {/* ── Success Modal ─────────────────────────────────────────── */}
      {createdRecipe && (
        <PublishSuccessModal
          recipe={createdRecipe}
          onReset={handleResetForm}
        />
      )}
    </div>
  );
}

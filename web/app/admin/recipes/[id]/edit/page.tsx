"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Step1BasicInfo } from "../../create/components/Step1BasicInfo";
import { Step2IngredientsInstructions } from "../../create/components/Step2IngredientsInstructions";
import { Step3PreviewPublish } from "../../create/components/Step3PreviewPublish";
import { AVAILABLE_CATEGORIES } from "../../create/components/CategorySelector";
import Tabs from "@/app/components/Tabs";
import { getRecipeByIdOrSlug, updateRecipe } from "@/src/services/recipeApi";
import { ApiError } from "@/src/services/apiClient";
import {
  CreateRecipeFormData,
  Recipe,
  RecipeBody,
  RecipeDetail,
} from "@/src/types/recipe";

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

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const recipeId = unwrappedParams.id;
  const router = useRouter();

  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<CreateRecipeFormData>(createEmptyFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updatedRecipe, setUpdatedRecipe] = useState<Recipe | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Convert loaded RecipeDetail to form data structure
  const populateFormData = useCallback((detail: RecipeDetail) => {
    // Map category names or IDs to category IDs
    const matchedCategoryIds: number[] = [];
    if (Array.isArray(detail.categories)) {
      detail.categories.forEach((catItem: any) => {
        if (typeof catItem === "number") {
          matchedCategoryIds.push(catItem);
        } else if (typeof catItem === "string") {
          const match = AVAILABLE_CATEGORIES.find(
            (c) =>
              c.name.toLowerCase() === catItem.toLowerCase() ||
              c.slug.toLowerCase() === catItem.toLowerCase()
          );
          if (match) {
            matchedCategoryIds.push(match.id);
          }
        }
      });
    }

    setFormData({
      title: detail.title || "",
      slug: detail.slug || "",
      description: detail.description || "",
      categories: matchedCategoryIds.length > 0 ? matchedCategoryIds : [1],
      prepTimeMinutes: detail.prep_time_minutes ?? 15,
      cookTimeMinutes: detail.cook_time_minutes ?? 30,
      servings: detail.servings ?? 4,
      imageUrl: detail.image_url || "",
      ingredients:
        detail.ingredients && detail.ingredients.length > 0
          ? detail.ingredients.map((ing, idx) => ({
            id: `ing-${ing.id || idx}-${Date.now()}`,
            name: ing.name || "",
            amount: String(ing.amount ?? ""),
            unit: ing.unit || "g",
          }))
          : [{ id: `ing-${Date.now()}`, amount: "", unit: "g", name: "" }],
      instructions:
        detail.instructions && detail.instructions.length > 0
          ? detail.instructions.map((step, idx) => ({
            id: `step-${step.id || idx}-${Date.now()}`,
            stepNumber: step.step_number || idx + 1,
            title: `Bước ${step.step_number || idx + 1}`,
            instruction: step.instruction || "",
            imageUrl: step.image_url || null,
          }))
          : [
            {
              id: `step-${Date.now()}`,
              stepNumber: 1,
              title: "Bước 1",
              instruction: "",
              imageUrl: null,
            },
          ],
    });
  }, []);

  // Fetch recipe details on mount
  useEffect(() => {
    let isMounted = true;
    const fetchRecipe = async () => {
      setIsLoadingRecipe(true);
      setLoadError(null);
      try {
        const data = await getRecipeByIdOrSlug(recipeId);
        if (!data) {
          if (isMounted) setLoadError("Không tìm thấy công thức yêu cầu.");
          return;
        }
        if (isMounted) {
          populateFormData(data);
        }
      } catch (err: any) {
        console.error("[EditRecipePage] Error loading recipe:", err);
        if (isMounted) {
          setLoadError(
            err instanceof ApiError
              ? err.message
              : "Đã xảy ra lỗi khi tải dữ liệu công thức."
          );
        }
      } finally {
        if (isMounted) setIsLoadingRecipe(false);
      }
    };

    fetchRecipe();
    return () => {
      isMounted = false;
    };
  }, [recipeId, populateFormData]);

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

  // ── Validation ───────────────────────────────────────────────
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.title.trim()) {
      errs.title = "Vui lòng nhập tên công thức.";
    }

    if (!formData.slug.trim()) {
      errs.slug = "Đường dẫn tĩnh (slug) không được để trống.";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errs.slug = "Slug chỉ được chứa chữ cái thường, số và dấu gạch nối (-).";
    }

    if (formData.categories.length === 0) {
      errs.categories = "Vui lòng chọn ít nhất 1 danh mục cho món ăn.";
    }

    if (formData.prepTimeMinutes === "" || formData.prepTimeMinutes === undefined) {
      errs.prepTimeMinutes = "Vui lòng nhập thời gian chuẩn bị.";
    } else {
      const prep = Number(formData.prepTimeMinutes);
      if (isNaN(prep) || prep < 0) {
        errs.prepTimeMinutes = "Thời gian chuẩn bị phải là số không âm.";
      }
    }

    if (formData.cookTimeMinutes === "" || formData.cookTimeMinutes === undefined) {
      errs.cookTimeMinutes = "Vui lòng nhập thời gian nấu.";
    } else {
      const cook = Number(formData.cookTimeMinutes);
      if (isNaN(cook) || cook < 0) {
        errs.cookTimeMinutes = "Thời gian nấu phải là số không âm.";
      }
    }

    if (formData.servings === "" || formData.servings === undefined) {
      errs.servings = "Vui lòng nhập khẩu phần.";
    } else {
      const serv = Number(formData.servings);
      if (isNaN(serv) || serv <= 0) {
        errs.servings = "Khẩu phần phải lớn hơn 0.";
      }
    }

    if (!formData.imageUrl || !formData.imageUrl.trim()) {
      errs.imageUrl = "Vui lòng tải lên ảnh đại diện cho món ăn.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};

    const validIngredients = formData.ingredients.filter(
      (ing) => ing.name.trim() !== ""
    );
    if (validIngredients.length === 0) {
      errs.ingredients = "Vui lòng thêm ít nhất 1 nguyên liệu có tên rõ ràng.";
    }

    const validInstructions = formData.instructions.filter(
      (step) => step.instruction.trim() !== ""
    );
    if (validInstructions.length === 0) {
      errs.instructions = "Vui lòng mô tả ít nhất 1 bước thực hiện.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
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

  // ── Update Action ───────────────────────────────────────────
  const handleUpdate = async () => {
    if (!validateAll()) {
      setUpdateError("Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc.");
      showToast("Vui lòng kiểm tra lại các trường thông tin!");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

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
      const result = await updateRecipe(recipeId, payload);
      setUpdatedRecipe(result);
      showToast("Cập nhật công thức thành công!");
    } catch (err: any) {
      console.error("[EditRecipePage] Update error:", err);
      const errMsg =
        err instanceof ApiError
          ? err.message
          : err?.response?.data?.error ||
          err?.message ||
          "Đã xảy ra lỗi khi cập nhật công thức. Vui lòng thử lại.";
      setUpdateError(errMsg);
      showToast(`Lỗi: ${errMsg}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Render Loading State ─────────────────────────────────────
  if (isLoadingRecipe) {
    return (
      <div className="min-h-screen max-w-[1200px] mx-auto px-4 md:px-12 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[#efeeea] rounded-xl w-1/4" />
          <div className="h-12 bg-[#efeeea] rounded-2xl w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-[#efeeea] rounded-3xl" />
            <div className="h-64 bg-[#efeeea] rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Render Error State ───────────────────────────────────────
  if (loadError) {
    return (
      <div className="min-h-screen max-w-[1200px] mx-auto px-4 md:px-12 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h2 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a] mb-2">
          {loadError}
        </h2>
        <p className="text-sm text-[#584140] mb-6">
          Không tìm thấy công thức với ID #{recipeId} hoặc công thức đã bị xóa khỏi hệ thống.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff6b6b] text-white font-[var(--font-headline)] text-sm font-bold shadow-sm hover:bg-[#e05656] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Quay Lại Bảng Quản Trị
        </Link>
      </div>
    );
  }

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

      {/* ── Stepper Breadcrumb Header ─────────────────────────────── */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 pb-6 border-b border-[#e3e2df] gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[#584140] mb-2 font-[var(--font-headline)] text-xs font-bold uppercase tracking-wider">
            <Link href="/admin" className="hover:text-[#ae2f34] transition-colors whitespace-nowrap">
              Quản Trị
            </Link>
            <span className="material-symbols-outlined text-[16px] select-none opacity-60">chevron_right</span>
            <span className="whitespace-nowrap">Chỉnh Sửa Công Thức #{recipeId}</span>
            <span className="material-symbols-outlined text-[16px] select-none opacity-60">chevron_right</span>
            <span className="text-[#ae2f34] whitespace-nowrap">Bước {currentStep} / 3</span>
          </div>

          <h1 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a] tracking-tight">
            {currentStep === 1 && "Chỉnh Sửa Thông Tin Công Thức"}
            {currentStep === 2 && (formData.title || "Nguyên Liệu & Hướng Dẫn")}
            {currentStep === 3 && "Kiểm Tra & Lưu Thay Đổi"}
          </h1>
          <p className="text-sm md:text-base text-[#584140] mt-1">
            {currentStep === 1 &&
              "Cập nhật các thông tin cơ bản, danh mục hoặc thay đổi ảnh đại diện món ăn."}
            {currentStep === 2 &&
              "Chỉnh sửa định lượng nguyên liệu và các bước hướng dẫn nấu ăn."}
            {currentStep === 3 &&
              "Kiểm tra lại toàn bộ bản xem trước trước khi lưu cập nhật lên hệ thống."}
          </p>
        </div>

        {/* Stepper Navigation Pills */}
        <Tabs<1 | 2 | 3>
          tabs={[
            { label: "1. Thông Tin Cơ Bản", value: 1 },
            { label: "2. Nguyên Liệu & Các Bước", value: 2 },
            { label: "3. Xem Lại & Cập Nhật", value: 3 },
          ]}
          activeTab={currentStep}
          onChange={goToStep}
          variant="coral"
          ariaLabel="Các bước chỉnh sửa công thức"
        />
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
        />
      )}

      {/* ── STEP 3: Preview & Save Updates ────────────────────────── */}
      {currentStep === 3 && (
        <Step3PreviewPublish
          formData={formData}
          isPublishing={isUpdating}
          publishError={updateError}
          onBack={() => setCurrentStep(2)}
          onPublish={handleUpdate}
          isEditMode={true}
          submitButtonLabel="Lưu Thay Đổi Công Thức"
          loadingLabel="Đang Lưu Cập Nhật..."
        />
      )}

      {/* ── Update Success Modal ──────────────────────────────────── */}
      {updatedRecipe && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-[500px] text-center shadow-floating border border-[#efeeea] animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-[#00b083]/15 text-[#006c4f] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
              <span
                className="material-symbols-outlined text-[44px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>

            <h3 className="font-[var(--font-headline)] text-2xl md:text-3xl font-extrabold text-[#1b1c1a] mb-2">
              Cập Nhật Thành Công!
            </h3>

            <p className="text-sm md:text-base text-[#584140] mb-6">
              Món <strong className="text-[#1b1c1a] font-bold">&quot;{updatedRecipe.title}&quot;</strong> đã được cập nhật thay đổi thành công vào hệ thống.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href={`/recipes/${updatedRecipe.slug || updatedRecipe.id}`}
                className="btn-coral-punch w-full py-3.5 text-center font-[var(--font-headline)] font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">visibility</span>
                Xem Món Ăn Trên Website
              </Link>

              <Link
                href="/admin"
                className="btn-outline w-full py-3 text-center font-[var(--font-headline)] font-bold text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                Về Bảng Điều Khiển Quản Trị
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

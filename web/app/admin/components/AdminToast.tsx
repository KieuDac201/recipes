"use client";

export interface ToastState {
  message: string;
  type: "success" | "error";
}

interface AdminToastProps {
  toast: ToastState | null;
  onClose?: () => void;
}

export default function AdminToast({ toast, onClose }: AdminToastProps) {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
      <div
        className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-white ${
          isError
            ? "bg-[#ba1a1a] border-[#93000a]"
            : "bg-[#1b1c1a] border-[#3d3a39]"
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] flex-shrink-0 ${
            isError ? "text-white" : "text-[#06d6a0]"
          }`}
        >
          {isError ? "error" : "check_circle"}
        </span>
        <span className="font-[var(--font-headline)] text-sm font-semibold">
          {toast.message}
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-white/70 hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}

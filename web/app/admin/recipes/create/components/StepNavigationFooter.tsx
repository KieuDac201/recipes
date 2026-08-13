"use client";

import { ReactNode } from "react";

interface StepNavigationFooterProps {
  onBack?: () => void;
  backLabel?: string;
  onPreview?: () => void;
  onNext: () => void;
  nextLabel: string;
  nextIcon?: string;
  stepInfo?: ReactNode;
}

export function StepNavigationFooter({
  onBack,
  backLabel = "Quay Lại",
  onPreview,
  onNext,
  nextLabel,
  nextIcon = "arrow_forward",
  stepInfo,
}: StepNavigationFooterProps) {
  return (
    <div className="mt-4 pt-6 border-t border-[#e3e2df] flex flex-col sm:flex-row justify-between items-center gap-4">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-[#584140] font-[var(--font-headline)] text-sm font-bold hover:text-[#ae2f34] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>{backLabel}</span>
        </button>
      ) : stepInfo ? (
        <span className="text-xs text-[#8c706f] font-medium hidden sm:inline">
          {stepInfo}
        </span>
      ) : (
        <div />
      )}

      <div className="flex gap-4 w-full sm:w-auto">
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="btn-outline flex-1 sm:flex-none"
          >
            Xem Trước
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          className="btn-coral-punch flex-1 sm:flex-none flex items-center justify-center gap-2"
        >
          <span>{nextLabel}</span>
          <span className="material-symbols-outlined text-[20px]">{nextIcon}</span>
        </button>
      </div>
    </div>
  );
}

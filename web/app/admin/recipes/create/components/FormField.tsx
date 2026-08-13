"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: ReactNode;
  required?: boolean;
  icon?: string;
  error?: string;
  rightElement?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  required = false,
  icon,
  error,
  rightElement,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a] flex items-center gap-1.5">
          {icon && (
            <span className="material-symbols-outlined text-[18px] text-[#8c706f]">
              {icon}
            </span>
          )}
          <span>{label}</span>
          {required && <span className="text-[#ae2f34]">*</span>}
        </label>
        {rightElement}
      </div>

      {children}

      {error && (
        <p className="text-xs text-[#ba1a1a] font-medium flex items-center gap-1 mt-0.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[15px]">error</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

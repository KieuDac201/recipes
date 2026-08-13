"use client";

import { ReactNode } from "react";

interface FormSectionProps {
  icon: string;
  title: string;
  required?: boolean;
  subtitle?: string;
  badge?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  iconColor?: string;
}

export function FormSection({
  icon,
  title,
  required = false,
  subtitle,
  badge,
  action,
  children,
  className = "",
  iconColor = "text-[#ae2f34]",
}: FormSectionProps) {
  return (
    <section
      className={`bg-white rounded-[24px] p-6 md:p-8 shadow-[0_4px_10px_rgba(255,107,107,0.04)] border border-[#e3e2df] hover:shadow-md transition-shadow relative ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-[var(--font-headline)] text-xl font-bold text-[#1b1c1a] flex items-center gap-2">
            <span className={`material-symbols-outlined ${iconColor}`}>
              {icon}
            </span>
            <span>{title}</span>
            {required && <span className="text-[#ae2f34]">*</span>}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#8c706f] mt-0.5 ml-8">{subtitle}</p>
          )}
        </div>

        {(badge || action) && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {badge}
            {action}
          </div>
        )}
      </div>

      {children}
    </section>
  );
}

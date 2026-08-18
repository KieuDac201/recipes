"use client";

import React from "react";

export interface TabItem<T = string | number> {
  label: string | React.ReactNode;
  value: T;
  icon?: string;
  badge?: number | string;
  disabled?: boolean;
}

export interface TabsProps<T = string | number> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (value: T) => void;
  variant?: "coral" | "white";
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

export default function Tabs<T extends string | number = string>({
  tabs,
  activeTab,
  onChange,
  variant = "white",
  size = "md",
  className = "",
  ariaLabel = "Danh sách tab",
}: TabsProps<T>) {
  const isCoral = variant === "coral";

  const containerClasses = [
    "flex items-center select-none overflow-x-auto max-w-full shrink-0",
    isCoral ? "bg-[#f4f4f0] p-1.5 rounded-full border border-[#e3e2df] gap-1.5" : "bg-[#f0eee9] p-1.5 rounded-2xl border border-[#e3e2df]/60 gap-1.5",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1 text-xs"
      : "px-4 py-2 text-xs";

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={containerClasses}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        let activeClasses = "";
        if (isActive) {
          activeClasses = isCoral
            ? "bg-[#ff6b6b] text-white shadow-sm font-bold"
            : "bg-white text-[#ae2f34] shadow-sm font-bold";
        } else {
          activeClasses = isCoral
            ? "text-[#584140] hover:bg-[#e9e8e4] hover:text-[#1b1c1a] font-bold"
            : "text-[#8c706f] hover:text-[#1b1c1a] hover:bg-white/50 font-semibold";
        }

        const pillRadius = isCoral ? "rounded-full" : "rounded-xl";

        return (
          <button
            key={String(tab.value)}
            role="tab"
            type="button"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.value)}
            className={`${sizeClasses} ${pillRadius} font-[var(--font-headline)] whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${activeClasses}`}
          >
            {tab.icon && (
              <span className="material-symbols-outlined text-[16px]">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? isCoral
                      ? "bg-white/20 text-white"
                      : "bg-[#ffdad8] text-[#ae2f34]"
                    : "bg-[#e3e2df] text-[#584140]"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

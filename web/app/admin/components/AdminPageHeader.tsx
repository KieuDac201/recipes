"use client";

import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminPageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  children?: React.ReactNode; // Action buttons or controls
}

export default function AdminPageHeader({
  breadcrumbs,
  title,
  subtitle,
  children,
}: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-xs text-[#8c706f] font-semibold mb-1">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.label}>
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-[#ff6b6b] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-[#584140]" : ""}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <span className="material-symbols-outlined text-[14px]">
                      chevron_right
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}
        <h1 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a] tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-[#8c706f] mt-1">{subtitle}</p>}
      </div>

      {children && (
        <div className="flex items-center gap-3 flex-shrink-0">{children}</div>
      )}
    </header>
  );
}

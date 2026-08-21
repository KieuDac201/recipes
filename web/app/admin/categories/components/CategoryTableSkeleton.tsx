"use client";

interface CategoryTableSkeletonProps {
  rowCount?: number;
}

export default function CategoryTableSkeleton({
  rowCount = 5,
}: CategoryTableSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rowCount }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-[#efeeea] animate-pulse rounded-2xl border border-[#e3e2df]"
        />
      ))}
    </div>
  );
}

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const categoryBadgeColors: Record<string, { bg: string; text: string }> = {
  soup: { bg: "bg-[#ff6b6b]", text: "text-white" },
  breakfast: { bg: "bg-[#ffd167]", text: "text-[#765900]" },
  vegan: { bg: "bg-[#00b083]", text: "text-white" },
  "quick-easy": { bg: "bg-[#ff6b6b]", text: "text-white" },
  desserts: { bg: "bg-[#ffd167]", text: "text-[#765900]" },
  specialty: { bg: "bg-[#ae2f34]", text: "text-white" },
  "món việt": { bg: "bg-[#ae2f34]", text: "text-white" },
  "món nước": { bg: "bg-[#ff6b6b]", text: "text-white" },
  "món khô": { bg: "bg-[#ffd167]", text: "text-[#765900]" },
  "món chay": { bg: "bg-[#00b083]", text: "text-white" },
};

export function getCategoryBadgeColors(category: string): { bg: string; text: string } {
  const normalized = category.toLowerCase().trim();
  return categoryBadgeColors[normalized] ?? { bg: "bg-[#efeeea]", text: "text-[#1b1c1a]" };
}

export default function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const colors = getCategoryBadgeColors(category);
  return (
    <span
      className={`${colors.bg} ${colors.text} text-xs font-bold px-3 py-1 rounded-full ${className}`}
    >
      {category}
    </span>
  );
}

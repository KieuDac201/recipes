interface RecipeMetaStatsProps {
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  className?: string;
}

export default function RecipeMetaStats({
  prepTimeMinutes = 0,
  cookTimeMinutes = 0,
  servings,
  className = "",
}: RecipeMetaStatsProps) {
  const totalTime = prepTimeMinutes + cookTimeMinutes;

  return (
    <div
      className={`grid grid-cols-2 gap-y-2 sm:flex sm:flex-wrap sm:divide-x sm:divide-[#e0bfbd] text-sm font-semibold text-[#584140] ${className}`}
    >
      {prepTimeMinutes > 0 && (
        <div className="flex items-center gap-1.5 sm:pr-5">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            timer
          </span>
          Chuẩn bị: {prepTimeMinutes}p
        </div>
      )}
      {cookTimeMinutes > 0 && (
        <div className="flex items-center gap-1.5 px-5">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            skillet
          </span>
          Nấu: {cookTimeMinutes}p
        </div>
      )}
      {totalTime > 0 && (
        <div className="flex items-center gap-1.5 sm:px-5 font-bold text-[#1b1c1a]">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            schedule
          </span>
          Tổng cộng: {totalTime}p
        </div>
      )}
      {servings !== undefined && servings > 0 && (
        <div className="flex items-center gap-1.5 sm:pl-5">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            group
          </span>
          {servings} khẩu phần
        </div>
      )}
    </div>
  );
}

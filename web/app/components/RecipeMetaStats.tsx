interface RecipeMetaStatsProps {
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  viewCount?: number;
  className?: string;
}

export default function RecipeMetaStats({
  prepTimeMinutes = 0,
  cookTimeMinutes = 0,
  servings,
  viewCount,
  className = "",
}: RecipeMetaStatsProps) {
  const totalTime = prepTimeMinutes + cookTimeMinutes;

  return (
    <div
      className={`flex flex-wrap items-center gap-y-2 text-sm font-semibold text-[#584140] ${className}`}
    >
      {prepTimeMinutes > 0 && (
        <div className="flex items-center gap-1.5 pr-4 sm:pr-5 border-r border-[#e0bfbd]">
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
        <div className="flex items-center gap-1.5 px-4 sm:px-5 border-r border-[#e0bfbd]">
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
        <div
          className={`flex items-center gap-1.5 px-4 sm:px-5 font-bold ${
            servings ? "border-r border-[#e0bfbd]" : ""
          }`}
        >
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
        <div className="flex items-center gap-1.5 pl-4 sm:pl-5">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            group
          </span>
          {servings} khẩu phần
        </div>
      )}
      {viewCount !== undefined && (
        <div className="flex items-center gap-1.5 pl-0 basis-full pt-0.5">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            visibility
          </span>
          {viewCount.toLocaleString()} lượt xem
        </div>
      )}
    </div>
  );
}

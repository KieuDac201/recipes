export default function RecipeSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e3dc] overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-[16/10] bg-[#efeeea]" />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-5 bg-[#efeeea] rounded-md mb-2 w-3/4" />
          <div className="h-3.5 bg-[#efeeea] rounded-md mb-1.5 w-full" />
          <div className="h-3.5 bg-[#efeeea] rounded-md mb-4 w-2/3" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-[#f0eee9]">
          <div className="flex items-center gap-3">
            <div className="h-4 bg-[#efeeea] rounded-md w-10" />
            <div className="h-4 bg-[#efeeea] rounded-md w-14" />
            <div className="h-4 bg-[#efeeea] rounded-md w-10" />
          </div>
          <div className="h-4 bg-[#efeeea] rounded-md w-16" />
        </div>
      </div>
    </div>
  );
}

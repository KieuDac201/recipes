export default function RecipeSkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden flex flex-col p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] animate-pulse">
      <div className="w-full aspect-square rounded-2xl bg-[#efeeea] mb-3" />
      <div className="h-6 bg-[#efeeea] rounded-md mb-2 w-3/4" />
      <div className="h-4 bg-[#efeeea] rounded-md mb-1 w-full" />
      <div className="h-4 bg-[#efeeea] rounded-md mb-4 w-2/3" />
      <div className="h-4 bg-[#efeeea] rounded-md mt-auto w-1/3" />
    </div>
  );
}

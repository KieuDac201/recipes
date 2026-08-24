"use client";

export interface RecipeSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
}

export default function RecipeSearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Tìm kiếm công thức món ăn...",
}: RecipeSearchBarProps) {
  return (
    <section className="text-center mb-10 flex flex-col items-center">
      <h1 className="font-[var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tight text-[#1b1c1a] mb-8 leading-tight">
        Hôm nay chúng ta nấu gì nào? 🍳
      </h1>

      <div className="relative w-full max-w-2xl group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
          <span
            className="material-symbols-outlined text-[#8c706f] group-focus-within:text-[#ff6b6b] text-[22px] transition-colors"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            search
          </span>
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white border-2 border-[#e5e3dc] rounded-full py-4 pl-14 pr-12 text-base md:text-lg text-[#1b1c1a] font-medium placeholder:text-[#8c706f]/70 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_36px_rgba(255,107,107,0.12)] hover:border-[#ff6b6b]/40 focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/15 focus:shadow-[0_14px_40px_rgba(255,107,107,0.18)] focus:outline-none focus-visible:outline-none outline-none transition-all duration-300"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8c706f] hover:text-[#ff6b6b] transition-colors cursor-pointer"
            title="Xóa tìm kiếm"
          >
            <span className="material-symbols-outlined text-[20px] bg-[#efeeea] hover:bg-[#ffdad8] p-1 rounded-full transition-colors">
              close
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

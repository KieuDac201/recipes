import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-[#faf9f5]/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-4 md:px-12 py-5">
        {/* Brand + nav links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-[#ae2f34] font-[var(--font-headline)]"
          >
            GourmetPop
          </Link>
          <div className="hidden md:flex items-center gap-5 ml-4">
            <Link
              href="/"
              className="text-sm font-bold text-[#ae2f34] border-b-2 border-[#ae2f34] pb-0.5"
            >
              Discover
            </Link>
            <a
              href="#"
              className="text-sm font-medium text-[#584140] hover:text-[#ae2f34] transition-colors duration-200"
            >
              My Recipes
            </a>
            <a
              href="#"
              className="text-sm font-medium text-[#584140] hover:text-[#ae2f34] transition-colors duration-200"
            >
              Meal Plan
            </a>
          </div>
        </div>

        {/* CTA + avatar */}
        <div className="flex items-center gap-6">
          <button className="hidden md:flex items-center gap-2 bg-[#ff6b6b] text-white text-sm font-semibold py-2.5 px-5 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_2px_0_0_#ae2f34] cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
            What are we cooking today?
          </button>
          <div className="w-10 h-10 rounded-full bg-[#e9e8e4] overflow-hidden border-2 border-[#e9e8e4] cursor-pointer hover:scale-105 active:scale-95 transition-transform">
            <img
              alt="Chef profile avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz4rlFouQd4Rs2D0oK6wrgazFNXDdX0ylypRJYzrdUh3qNkuiDHJzVeFptFc8dBtMYnNSyB9H5c-y0p6QE4pzWkUinhJ4SHvoMo9xK0r4Dydw5FWVSF34PmANd-DVrroVCy57ykKDZeAKVlwaMhelT1VuoUKO3323eS1cUTJwOZtxa9Bu1dPjGKBCpyz5eyAujizFuoD7kKkw68f4C26dN4hLJBGM-brOvsekZXnt33JC_xYdzbpQ5"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

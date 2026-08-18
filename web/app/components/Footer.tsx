import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full rounded-t-[32px] bg-[#e9e8e4] mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center max-w-[1200px] mx-auto px-12 py-16 gap-10">
        <div className="flex flex-col gap-3">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black text-[#ae2f34] font-[var(--font-headline)] hover:opacity-90 transition-opacity">
              GourmetPop
            </span>
          </Link>
          <p className="text-sm text-[#584140]">
            © 2024 GourmetPop. Nơi lan tỏa niềm đam mê ẩm thực.
          </p>
        </div>
        <nav className="flex flex-wrap gap-6 text-xs font-bold text-[#584140]">
          {["Instagram", "TikTok", "Pinterest", "Bản Tin", "Chính Sách Bảo Mật"].map((link) => (
            <a
              key={link}
              href="#"
              className="hover:text-[#785a00] transition-colors hover:-translate-y-1 inline-block transition-transform"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

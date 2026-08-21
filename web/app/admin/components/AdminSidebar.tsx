"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Bảng Điều Khiển", href: "/admin", icon: "dashboard" },
  { name: "Danh Mục", href: "/admin/categories", icon: "category", activeOn: ["/admin/categories"] },
  { name: "Công Thức", href: "/admin/recipes/create", icon: "restaurant_menu", activeOn: ["/admin/recipes/create"] },
  { name: "Nguyên Liệu", href: "#ingredients", icon: "liquor" },
  { name: "Thống Kê", href: "#analytics", icon: "analytics" },
  { name: "Cài Đặt", href: "#settings", icon: "admin_panel_settings" },
];


export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isItemActive = (item: typeof navItems[number]) => {
    if (item.href === "/admin") {
      return pathname === "/admin";
    }
    if (item.activeOn) {
      return item.activeOn.some((p) => pathname.startsWith(p));
    }
    return pathname === item.href;
  };

  return (
    <>
      {/* ── Mobile Top Bar ────────────────────────────────────────── */}
      <div className="md:hidden flex justify-between items-center w-full px-4 py-4 bg-[#f4f4f0] border-b border-[#e3e2df] sticky top-0 z-40">
        <Link href="/" className="font-extrabold text-2xl text-[#ae2f34] font-[var(--font-headline)]">
          Bếp Phương
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-[#584140] p-1.5 rounded-lg hover:bg-[#e9e8e4] transition-colors"
            title="Thông báo"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#584140] p-1.5 rounded-lg hover:bg-[#e9e8e4] transition-colors"
            aria-label="Đóng/Mở menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ──────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-[#faf9f5] z-50 p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isItemActive(item);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    active
                      ? "bg-[#ff6b6b] text-white shadow-sm"
                      : "text-[#584140] hover:bg-[#efeeea]"
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-[var(--font-headline)] text-sm">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-[#e3e2df] flex flex-col gap-3">
            <Link
              href="/admin/recipes/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#ff6b6b] text-white font-semibold text-sm py-3 rounded-xl shadow-[0_2px_0_#ae2f34] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Thêm Công Thức
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-[#584140] px-4 py-2 hover:bg-[#efeeea] rounded-xl text-sm"
            >
              <span className="material-symbols-outlined">logout</span>
              Về Trang Công Khai
            </Link>
          </div>
        </div>
      )}

      {/* ── Desktop Fixed Sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#f4f4f0] shadow-sm p-6 gap-2 z-50 border-r border-[#e3e2df]/60">
        {/* Brand / Header */}
        <div className="mb-8">
          <Link href="/">
            <h1 className="font-[var(--font-headline)] text-2xl font-extrabold text-[#ae2f34] tracking-tight hover:opacity-90 transition-opacity">
              Bếp Phương
            </h1>
          </Link>
          <p className="font-[var(--font-headline)] text-xs font-bold text-[#584140] mt-1 tracking-wide uppercase">
            Trang Quản Trị
          </p>
          <p className="text-xs text-[#8c706f]">Quản Lý Ẩm Thực</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#ff6b6b] text-white shadow-[0_4px_10px_rgba(255,107,107,0.15)] font-bold scale-[0.98]"
                    : "text-[#584140] hover:bg-[#e9e8e4] hover:scale-[1.02] hover:text-[#1b1c1a]"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-[var(--font-headline)] text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA & Footer */}
        <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-[#e3e2df]">
          <Link
            href="/admin/recipes/create"
            className="w-full bg-[#ff6b6b] text-white font-[var(--font-headline)] text-sm font-bold py-3 rounded-xl shadow-[0_2px_0_#ae2f34] hover:shadow-[0_4px_0_#ae2f34] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Thêm Công Thức
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 text-[#584140] px-4 py-2 hover:bg-[#e9e8e4] rounded-xl transition-all text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-[var(--font-headline)]">Về Trang Công Khai</span>
          </Link>

          <div className="flex items-center gap-3 mt-2 px-2 py-1.5 rounded-lg bg-[#efeeea]/60">
            <img
              alt="GourmetPop Admin"
              className="w-8 h-8 rounded-full object-cover border border-[#e0bfbd]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLNIjzHkQVNaRQl-c8_FjKfJ3PGEwBtcgDGpKO4_BzoCWj9YZDAhqkhreAgk0cNxVZZsZMPJCKrKTn0oAntLkKDtlr5NDHBfU1hPFuJ9YqhZ-WwIvnCdZwG4tFyv7aURtMolw6Nbs2vNieg5tXSa_8k-UgRsHHgd8AHskjoiulBiEsNHmqdxgrNXj0PJK2BCOQRXw9Dtjsoc0ZipFW5GoIku7pPAd1uyTwlkmcfIto_q9b6fZZOfqV"
            />
            <div className="overflow-hidden">
              <p className="font-[var(--font-headline)] text-xs font-bold text-[#1b1c1a] truncate">Đầu Bếp Quản Trị</p>
              <p className="text-[10px] text-[#8c706f] truncate">admin@gourmetpop.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

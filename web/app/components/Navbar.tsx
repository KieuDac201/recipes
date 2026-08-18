"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authService, UserProfile } from "@/src/services/authApi";

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    window.location.href = "/";
  };

  const isHomeActive = pathname === "/";
  const isMyRecipesActive = pathname === "/my-recipes" || pathname.startsWith("/my-recipes/");
  const isAdminActive = pathname === "/admin" || pathname.startsWith("/admin/");

  const linkClass = (isActive: boolean) =>
    isActive
      ? "text-sm font-bold text-[#ae2f34] border-b-2 border-[#ae2f34] pb-0.5"
      : "text-sm font-medium text-[#584140] hover:text-[#ae2f34] transition-colors duration-200";

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#faf9f5]/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-4 md:px-12 py-5">
        {/* Brand + nav links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-[#ae2f34] font-[var(--font-headline)]"
          >
            Bếp Phương
          </Link>
          <div className="hidden md:flex items-center gap-5 ml-4">
            <Link
              href="/"
              className={linkClass(isHomeActive)}
            >
              Khám Phá
            </Link>
            {currentUser && (
              <Link
                href="/my-recipes"
                className={linkClass(isMyRecipesActive)}
              >
                Món Của Tôi
              </Link>
            )}
            {currentUser?.role === "admin" && (
              <Link
                href="/admin"
                className={linkClass(isAdminActive)}
              >
                Bảng Quản Trị
              </Link>
            )}
          </div>
        </div>

        {/* CTA + auth actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/recipes/create"
            className="hidden md:flex items-center gap-2 bg-[#ff6b6b] text-white text-sm font-semibold py-2.5 px-5 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_2px_0_0_#ae2f34] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Thêm Công Thức
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                href={currentUser.role === "admin" ? "/admin" : "/my-recipes"}
                title={`Đã đăng nhập: ${currentUser.email} (${currentUser.role || "user"})`}
                className="w-10 h-10 rounded-full bg-[#e9e8e4] overflow-hidden border-2 border-[#ff6b6b] cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center justify-center font-bold text-xs text-[#ae2f34]"
              >
                {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : "U"}
              </Link>
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="text-xs font-semibold text-[#8c706f] hover:text-[#ae2f34] transition-colors p-1.5 rounded-lg hover:bg-[#efeeea] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#584140] hover:text-[#ae2f34] transition-colors px-3 py-2 rounded-lg hover:bg-[#efeeea]"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-[#ae2f34] border border-[#ae2f34] px-3.5 py-1.5 rounded-full hover:bg-[#ae2f34] hover:text-white transition-all"
              >
                Đăng Ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

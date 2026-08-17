"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authService, UserProfile } from "@/src/services/authApi";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#faf9f5]/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-4 md:px-12 py-5">
        {/* Brand + nav links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-[#ae2f34] font-[var(--font-headline)]"
          >
            Bếp Nhà Phương
          </Link>
          <div className="hidden md:flex items-center gap-5 ml-4">
            <Link
              href="/"
              className="text-sm font-bold text-[#ae2f34] border-b-2 border-[#ae2f34] pb-0.5"
            >
              Khám Phá
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-[#584140] hover:text-[#ae2f34] transition-colors duration-200"
            >
              Bảng Quản Trị
            </Link>
          </div>
        </div>

        {/* CTA + auth actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/admin/recipes/create"
            className="hidden md:flex items-center gap-2 bg-[#ff6b6b] text-white text-sm font-semibold py-2.5 px-5 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_2px_0_0_#ae2f34] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Thêm Công Thức
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                title={`Đã đăng nhập: ${currentUser.email}`}
                className="w-10 h-10 rounded-full bg-[#e9e8e4] overflow-hidden border-2 border-[#ff6b6b] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                <img
                  alt="Ảnh đại diện"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz4rlFouQd4Rs2D0oK6wrgazFNXDdX0ylypRJYzrdUh3qNkuiDHJzVeFptFc8dBtMYnNSyB9H5c-y0p6QE4pzWkUinhJ4SHvoMo9xK0r4Dydw5FWVSF34PmANd-DVrroVCy57ykKDZeAKVlwaMhelT1VuoUKO3323eS1cUTJwOZtxa9Bu1dPjGKBCpyz5eyAujizFuoD7kKkw68f4C26dN4hLJBGM-brOvsekZXnt33JC_xYdzbpQ5"
                />
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

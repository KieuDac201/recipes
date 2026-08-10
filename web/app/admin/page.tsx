import Link from "next/link";
import { recipes } from "@/src/data/mockData";

export const metadata = {
  title: "Bảng Điều Khiển Admin — GourmetPop",
  description: "Quản lý công thức, xem thống kê và điều hành nội dung ẩm thực.",
};

const recentItems = [
  {
    id: 1,
    title: "Phở Bò Hà Nội (Phở Bò Tái Nạm Truyền Thống)",
    slug: "pho-bo-ha-noi",
    image_url: "/images/pho-bo-ha-noi.png",
    status: "Published",
    date: "24 Th10, 2023",
  },
  {
    id: 2,
    title: "Bánh Mì Thịt Nướng (Bánh Mì Sả Ớt Giòn Rụm)",
    slug: "banh-mi-thit-nuong",
    image_url: "/images/banh-mi-thit-nuong.png",
    status: "Published",
    date: "22 Th10, 2023",
  },
  {
    id: 3,
    title: "Mỳ Ý Sốt Ớt Cay Calabrian",
    slug: "spicy-calabrian-chili-pasta",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5y3s8Pvg7dT5DNc2dKvsqCUKcPG9Q7IU2t8eT8rqPo5VwClb5tgFyQ-z8F3KaEkXs8EQEEve-3Jd6dJGR1sIND9C4wm8UbwEhpYdx-U5Nb6R8ZbWLMh15fZd90IRF6x5r4s7d_iypVu1YWFeBC_5Khhq9YMtcngHpMOkk_VYPtGRqBDB-iTNRopGVix4MQwoQ7cUKXBnN-W9yrjzy9xcGR3xiMwby6PuwUejiBJkRBMKKXyDg-LR9",
    status: "Published",
    date: "20 Th10, 2023",
  },
  {
    id: 4,
    title: "Hướng Dẫn Nuôi Men Bánh Mì Sourdough",
    slug: "classic-sourdough-starter-guide",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDy70Dy7p8WivyDLhRCmAFoFd1sMOiSWG5OfSuBZyk5hrqFl9RUkRwxeq9rAUnJJsfJLTZOXF1gYdGWED65qq1fXARDVleFYmqqXBCQ8-aK4FhStFrgGrYkp4YCAPhhDPkZcOtv5H_TqizRgy2cRRUdy7jP9_G79pZYVPFcH2LPUyv0v4mYR00OjOIlw6fYbDItnpqfgLlSThaSFBgcMFFuP77cQ4I9bkw5tYAhtGNiRJcqJrSPafDF",
    status: "Draft",
    date: "18 Th10, 2023",
  },
  {
    id: 5,
    title: "Bánh Tart Chanh Yuzu",
    slug: "yuzu-citrus-tartlets",
    image_url: null,
    status: "Draft",
    date: "15 Th10, 2023",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="p-4 md:p-12 min-h-screen relative z-10 max-w-[1300px] mx-auto">
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a] tracking-tight mb-1">
            Chào mừng trở lại, Bếp Trưởng!
          </h2>
          <p className="text-base md:text-lg text-[#584140]">
            Dưới đây là tổng quan tình hình ẩm thực của bạn hôm nay.
          </p>
        </div>
        <Link
          href="/admin/recipes/create"
          className="bg-[#ff6b6b] text-white font-[var(--font-headline)] text-sm font-bold px-6 py-3 rounded-xl shadow-[0_2px_0_#ae2f34] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,107,0.3)] active:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Tạo Công Thức Mới
        </Link>
      </header>

      {/* ── Stats Bento Grid ──────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_20px_rgba(255,107,107,0.04)] hover:shadow-[0_20px_40px_rgba(255,107,107,0.08)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group border border-[#efeeea]">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#f4f4f0] rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="material-symbols-outlined text-[#ae2f34] text-[32px] p-3 bg-[#ff6b6b]/10 rounded-xl">
              menu_book
            </span>
            <span className="bg-[#00b083]/15 text-[#006c4f] font-[var(--font-headline)] text-xs font-bold px-3 py-1 rounded-full">
              +{recipes.length} tuần này
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-[var(--font-headline)] text-sm font-semibold text-[#584140] mb-1">
              Tổng Số Công Thức
            </h3>
            <p className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a]">
              124
            </p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_20px_rgba(255,107,107,0.04)] hover:shadow-[0_20px_40px_rgba(255,107,107,0.08)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group border border-[#efeeea]">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#f4f4f0] rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="material-symbols-outlined text-[#785a00] text-[32px] p-3 bg-[#ffd167]/20 rounded-xl">
              publish
            </span>
            <span className="bg-[#efeeea] text-[#1b1c1a] font-[var(--font-headline)] text-xs font-bold px-3 py-1 rounded-full">
              Đúng tiến độ
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-[var(--font-headline)] text-sm font-semibold text-[#584140] mb-1">
              Đã Xuất Bản Tháng Này
            </h3>
            <p className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a]">
              12
            </p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_20px_rgba(255,107,107,0.04)] hover:shadow-[0_20px_40px_rgba(255,107,107,0.08)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group border border-[#efeeea]">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#f4f4f0] rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="material-symbols-outlined text-[#006c4f] text-[32px] p-3 bg-[#00b083]/15 rounded-xl">
              visibility
            </span>
            <span className="bg-[#ff6b6b]/15 text-[#ae2f34] font-[var(--font-headline)] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              15%
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-[var(--font-headline)] text-sm font-semibold text-[#584140] mb-1">
              Tổng Lượt Xem
            </h3>
            <p className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a]">
              45.2k
            </p>
          </div>
        </div>
      </section>

      {/* ── Recent Recipes Section ────────────────────────────── */}
      <section className="relative z-10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a]">
            Công Thức Gần Đây
          </h3>
          <Link
            href="/"
            className="font-[var(--font-headline)] text-sm font-bold text-[#ae2f34] hover:text-[#ff6b6b] transition-colors flex items-center gap-1"
          >
            Xem Trang Công Khai
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-[24px] border border-[#efeeea] shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Header row (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-[#f4f4f0]/60 border-b border-[#e3e2df] font-[var(--font-headline)] text-xs font-bold text-[#584140] uppercase tracking-wider">
            <div className="col-span-6">Tên Công Thức</div>
            <div className="col-span-3">Trạng Thái</div>
            <div className="col-span-3 text-right">Ngày Tạo / Thao Tác</div>
          </div>

          {/* List Items */}
          <div className="divide-y divide-[#efeeea]">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 md:p-5 hover:bg-[#faf9f5] transition-colors items-center group"
              >
                {/* Title & Image */}
                <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e9e8e4] flex-shrink-0 overflow-hidden flex items-center justify-center border border-[#e0bfbd]/40">
                    {item.image_url ? (
                      <img
                        alt={item.title}
                        className="w-full h-full object-cover"
                        src={item.image_url}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[#8c706f]">image</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a] truncate group-hover:text-[#ae2f34] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#8c706f] md:hidden mt-0.5">Ngày tạo: {item.date}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-1 md:col-span-3 flex items-center">
                  {item.status === "Published" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00b083]/15 text-[#006c4f] font-[var(--font-headline)] text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#006c4f]" />
                      Đã xuất bản
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efeeea] text-[#584140] font-[var(--font-headline)] text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#8c706f]" />
                      Bản nháp
                    </span>
                  )}
                </div>

                {/* Date / Quick Links */}
                <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-end gap-3 text-sm text-[#584140]">
                  <span className="hidden md:inline font-medium text-xs text-[#8c706f]">{item.date}</span>
                  <div className="flex items-center gap-1">
                    {item.status === "Published" && (
                      <Link
                        href={`/recipes/${item.slug}`}
                        className="p-1.5 rounded-lg hover:bg-[#efeeea] text-[#584140] hover:text-[#ae2f34] transition-colors"
                        title="Xem công thức trên trang"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </Link>
                    )}
                    <Link
                      href="/admin/recipes/create"
                      className="p-1.5 rounded-lg hover:bg-[#efeeea] text-[#584140] hover:text-[#ae2f34] transition-colors"
                      title="Chỉnh sửa công thức"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

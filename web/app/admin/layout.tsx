import type { Metadata } from "next";
import AdminSidebar from "./components/AdminSidebar";
import AdminGuard from "./components/AdminGuard";

export const metadata: Metadata = {
  title: "Bếp Phương — Quản Trị Hệ Thống",
  description: "Bảng điều khiển quản lý ẩm thực và tạo công thức món ăn.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="bg-[#faf9f5] text-[#1b1c1a] min-h-screen flex flex-col md:flex-row relative">
        {/* Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 md:ml-64 min-h-screen relative overflow-x-hidden">
          {/* Ambient Decorative Background Element */}
          <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#ff6b6b] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}

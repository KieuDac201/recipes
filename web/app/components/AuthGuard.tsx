"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/src/services/authApi";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Array<"user" | "admin">;
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Only run on client
    const token = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    // 1. Not logged in -> redirect to login
    if (!token || !user) {
      const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
      router.replace(redirectUrl);
      return;
    }

    // 2. Role restriction
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = (user.role || "user") as "user" | "admin";
      if (!allowedRoles.includes(userRole)) {
        router.replace("/");
        return;
      }
    }

    setIsAuthorized(true);
  }, [router, pathname, allowedRoles]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#faf9f5]">
        <div className="w-10 h-10 border-4 border-[#ff6b6b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-[#8c706f]">Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  return <>{children}</>;
}

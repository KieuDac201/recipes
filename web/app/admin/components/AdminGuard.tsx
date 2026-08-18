"use client";

import AuthGuard from "@/app/components/AuthGuard";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={["admin"]}>{children}</AuthGuard>;
}

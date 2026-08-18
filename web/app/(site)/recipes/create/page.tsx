"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CreateRecipePage from "@/app/admin/recipes/create/page";

export default function UserCreateRecipePage() {
  return (
    <AuthGuard>
      <div className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8">
        <CreateRecipePage />
      </div>
    </AuthGuard>
  );
}

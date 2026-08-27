"use client";

import AuthGuard from "@/app/components/AuthGuard";
import EditRecipePage from "@/app/admin/recipes/[id]/edit/page";

export default function UserEditRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <AuthGuard>
      <div className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8">
        <EditRecipePage params={params} />
      </div>
    </AuthGuard>
  );
}

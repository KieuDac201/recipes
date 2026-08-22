import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand revalidation Route Handler for Next.js ISR
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, path } = body;

    // 1. Revalidate the specific recipe detail page
    if (slug) {
      revalidatePath(`/recipes/${slug}`);
    }

    // 2. Revalidate explicit path if provided
    if (path) {
      revalidatePath(path);
    }

    // 3. Revalidate public listing and home page
    revalidatePath("/");
    revalidatePath("/(site)", "layout");

    return NextResponse.json({
      revalidated: true,
      slug: slug || null,
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to revalidate cache" },
      { status: 500 }
    );
  }
}

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { getAuthUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

// POST /api/ideas/[id]/flag - flag an idea as inappropriate
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ideaId } = await params;
    const supabase = await createClient();
    
    // Increment flags count
    const { data: idea, error } = await supabase
      .from("ideas")
      .select("flags")
      .eq("id", ideaId)
      .single();

    if (error || !idea) return apiError("Idea not found", 404);

    await supabase
      .from("ideas")
      .update({ flags: (idea.flags || 0) + 1 })
      .eq("id", ideaId);

    return apiSuccess({ message: "Idea flagged for moderation" });
  } catch (err) {
    console.error("[IDEA FLAG]", err);
    return apiError("Internal server error", 500);
  }
}

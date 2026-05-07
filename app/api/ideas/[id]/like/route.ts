import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ideaId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return apiError("Unauthorized", 401);

    const { data: existing, error: checkError } = await supabase
      .from("idea_likes")
      .select()
      .eq("idea_id", ideaId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      // Unlike
      await supabase.from("idea_likes").delete().eq("idea_id", ideaId).eq("user_id", user.id);
      return apiSuccess({ liked: false });
    } else {
      // Like
      await supabase.from("idea_likes").insert({ idea_id: ideaId, user_id: user.id });
      return apiSuccess({ liked: true });
    }
  } catch (err) {
    console.error("[IDEA LIKE]", err);
    return apiError("Internal server error", 500);
  }
}

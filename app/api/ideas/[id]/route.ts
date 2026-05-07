import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: idea, error } = await supabase
      .from("ideas")
      .select(`
        *,
        author:profiles!ideas_author_id_fkey(id, name, avatar, role),
        _count_likes:idea_likes(count),
        _count_reviews:reviews(count)
      `)
      .eq("id", id)
      .single();

    if (error || !idea) return apiError("Idea not found", 404);

    // Increment views (simple RPC or manual update)
    await supabase.from("ideas").update({ views: (idea.views || 0) + 1 }).eq("id", id);

    // Format for frontend
    const formattedIdea = {
      ...idea,
      _count: {
        likes: idea._count_likes?.[0]?.count || 0,
        reviews: idea._count_reviews?.[0]?.count || 0
      }
    };

    return apiSuccess(formattedIdea);
  } catch (err) {
    console.error("[IDEA GET]", err);
    return apiError("Internal server error", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return apiError("Unauthorized", 401);

    const body = await req.json();
    
    const { data: idea, error: fetchError } = await supabase
      .from("ideas")
      .select("author_id")
      .eq("id", id)
      .single();

    if (fetchError || !idea) return apiError("Idea not found", 404);

    if (idea.author_id !== authUser.id) {
      return apiError("Not authorized to edit this idea", 403);
    }

    const { data: updated, error: updateError } = await supabase
      .from("ideas")
      .update({
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.tags && { tags: body.tags }),
        ...(body.status && { status: body.status }),
        ...(body.domain !== undefined && { domain: body.domain }),
        ...(body.stage !== undefined && { stage: body.stage }),
        ...(body.team_size && { team_size: body.team_size }),
        ...(body.looking_for && { looking_for: body.looking_for }),
        ...(body.cover_image !== undefined && { cover_image: body.cover_image }),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return apiSuccess(updated);
  } catch (err) {
    console.error("[IDEA PATCH]", err);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return apiError("Unauthorized", 401);

    const { error } = await supabase
      .from("ideas")
      .delete()
      .eq("id", id)
      .eq("author_id", authUser.id);

    if (error) throw error;

    return apiSuccess({ message: "Idea deleted" });
  } catch (err) {
    console.error("[IDEA DELETE]", err);
    return apiError("Internal server error", 500);
  }
}


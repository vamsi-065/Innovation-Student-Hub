import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { apiError, apiSuccess } from "@/lib/utils";

// POST /api/reviews - submit a review (professor only)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return apiError("Unauthorized", 401);

    // Check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "PROFESSOR" && profile?.role !== "ADMIN") {
      return apiError("Only professors can submit reviews", 403);
    }

    const body = await req.json();
    const { ideaId, content, rating, status, feedback } = body;

    if (!ideaId || !content) {
      return apiError("Idea ID and content are required", 400);
    }

    // Insert review
    const { data: review, error: insertError } = await supabase
      .from("reviews")
      .insert({
        idea_id: ideaId,
        professor_id: user.id,
        content,
        rating: Number(rating),
        status: status || "PENDING",
        feedback,
      })
      .select(`
        *,
        professor:profiles!reviews_professor_id_fkey(id, name, avatar)
      `)
      .single();

    if (insertError) throw insertError;

    return apiSuccess(review, 201);
  } catch (err) {
    console.error("[REVIEW POST]", err);
    return apiError("Internal server error", 500);
  }
}

// GET /api/reviews?ideaId=xxx - get reviews for an idea
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const ideaId = searchParams.get("ideaId");

    let query = supabase
      .from("reviews")
      .select(`
        *,
        professor:profiles!reviews_professor_id_fkey(id, name, avatar)
      `);

    if (ideaId) query = query.eq("idea_id", ideaId);

    const { data: reviews, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    return apiSuccess(reviews);
  } catch (err) {
    console.error("[REVIEWS GET]", err);
    return apiError("Internal server error", 500);
  }
}

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

    const { data: user, error } = await supabase
      .from("profiles")
      .select(`
        *,
        _count_ideas:ideas(count),
        _count_reviews:reviews(count)
      `)
      .eq("id", id)
      .single();

    if (error || !user) return apiError("User not found", 404);

    // Format for frontend
    const formattedUser = {
      ...user,
      _count: {
        ideas: user._count_ideas?.[0]?.count || 0,
        reviews: user._count_reviews?.[0]?.count || 0
      }
    };

    return apiSuccess(formattedUser);
  } catch (err) {
    console.error("[USER GET]", err);
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
    const body = await req.json();

    const { data: user, error } = await supabase
      .from("profiles")
      .update({
        ...(body.name && { name: body.name }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.university !== undefined && { university: body.university }),
        ...(body.department !== undefined && { department: body.department }),
        ...(body.year !== undefined && { year: body.year }),
        ...(body.skills && { skills: body.skills }),
        ...(body.interests && { interests: body.interests }),
        ...(body.github_url !== undefined && { github_url: body.github_url }),
        ...(body.linkedin_url !== undefined && { linkedin_url: body.linkedin_url }),
        ...(body.website_url !== undefined && { website_url: body.website_url }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return apiSuccess(user);
  } catch (err) {
    console.error("[USER PATCH]", err);
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

    // Note: This only deletes from the profiles table.
    // Full auth deletion usually requires service_role key.
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return apiSuccess({ message: "User deleted successfully" });
  } catch (err) {
    console.error("[USER DELETE]", err);
    return apiError("Internal server error", 500);
  }
}

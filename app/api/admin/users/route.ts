import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { apiError, apiSuccess } from "@/lib/utils";

// GET /api/admin/users — all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authUser?.id)
      .single();

    if (profile?.role !== "ADMIN") return apiError("Forbidden", 403);

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    let query = supabase
      .from("profiles")
      .select(`
        *,
        _count_ideas:ideas(count),
        _count_reviews:reviews(count)
      `, { count: "exact" });

    if (role) query = query.eq("role", role);
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: users, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Format for frontend
    const formattedUsers = users?.map(u => ({
      ...u,
      _count: {
        ideas: u._count_ideas?.[0]?.count || 0,
        reviews: u._count_reviews?.[0]?.count || 0
      }
    }));

    return apiSuccess({ 
      users: formattedUsers, 
      total: count || 0, 
      page, 
      pages: Math.ceil((count || 0) / limit) 
    });
  } catch (err) {
    console.error("[ADMIN USERS GET]", err);
    return apiError("Internal server error", 500);
  }
}

// PATCH /api/admin/users — update user role
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { userId, role } = body;

    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return apiSuccess(data);
  } catch (err) {
    console.error("[ADMIN USER PATCH]", err);
    return apiError("Internal server error", 500);
  }
}

// DELETE /api/admin/users — delete user
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return apiError("User ID required", 400);

    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) throw error;

    return apiSuccess({ message: "User deleted" });
  } catch (err) {
    console.error("[ADMIN USER DELETE]", err);
    return apiError("Internal server error", 500);
  }
}


import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { apiError, apiSuccess } from "@/lib/utils";

// GET /api/ideas — list with filters, search, pagination
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const tab = searchParams.get("tab") || "discovery";
    const status = searchParams.get("status");
    const domain = searchParams.get("domain");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    
    let query = supabase
      .from("ideas")
      .select(`
        *,
        author:profiles(id, name, avatar, role, full_name),
        _count_likes:idea_likes(count),
        _count_reviews:reviews(count)
      `);

    // Filtering
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (status) query = query.eq("status", status);
    if (domain) query = query.eq("domain", domain);

    // Tab-based sorting
    if (tab === "trending") {
      query = query.order("views", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: ideas, error, count } = await query;

    if (error) throw error;

    // Format for frontend consistency
    const formattedIdeas = ideas?.map(idea => ({
      ...idea,
      createdAt: idea.created_at,
      author: idea.author ? {
        ...idea.author,
        name: (idea.author as any).full_name || (idea.author as any).name || "Innovator"
      } : null,
      _count: {
        likes: idea._count_likes?.[0]?.count || 0,
        reviews: idea._count_reviews?.[0]?.count || 0
      }
    }));

    return apiSuccess({
      ideas: formattedIdeas,
      pagination: { page, limit, total: count || 0 }
    });
  } catch (err) {
    console.error("[IDEAS GET] Full Error:", JSON.stringify(err, null, 2));
    return apiError("Internal server error", 500);
  }
}

// POST /api/ideas — create new idea (student only)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) return apiError("Unauthorized", 401);

    const body = await req.json();
    const { title, description, tags, domain, stage, team_size, looking_for, cover_image } = body;

    if (!title || !description) {
      return apiError("Title and description are required", 400);
    }

    const { data: idea, error: insertError } = await supabase
      .from("ideas")
      .insert({
        title,
        description,
        tags: tags || [],
        domain,
        stage,
        team_size: team_size || 1,
        looking_for: looking_for || [],
        cover_image,
        author_id: user.id,
      })
      .select(`
        *,
        author:profiles(id, name, avatar)
      `)
      .single();

    if (insertError) throw insertError;

    // Auto-create team for the idea
    await supabase.from("teams").insert({
      idea_id: idea.id,
      creator_id: user.id
    });

    return apiSuccess(idea, 201);
  } catch (err) {
    console.error("[IDEA POST]", err);
    return apiError("Internal server error", 500);
  }
}


import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

// GET /api/ideas — list with filters, search, pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const domain = searchParams.get("domain") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(domain && { domain }),
      ...(tag && { tags: { has: tag } }),
    };

    const [ideas, total] = await Promise.all([
      prisma.idea.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, avatar: true, role: true },
          },
          _count: { select: { likes: true, reviews: true } },
          team: {
            select: { _count: { select: { members: true } } },
          },
        },
      }),
      prisma.idea.count({ where }),
    ]);

    return apiSuccess({
      ideas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[IDEAS GET]", err);
    return apiError("Internal server error", 500);
  }
}

// POST /api/ideas — create new idea (student only)
export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);
    if (authUser.role === "PROFESSOR")
      return apiError("Professors cannot post ideas", 403);

    const body = await req.json();
    const { title, description, tags, domain, stage, teamSize, lookingFor, coverImage } = body;

    if (!title || !description) {
      return apiError("Title and description are required", 400);
    }

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        tags: tags || [],
        domain,
        stage,
        teamSize: teamSize || 1,
        lookingFor: lookingFor || [],
        coverImage,
        authorId: authUser.userId,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Auto-create team for the idea
    await prisma.team.create({
      data: {
        ideaId: idea.id,
        members: {
          create: {
            userId: authUser.userId,
            role: "Founder",
          },
        },
      },
    });

    return apiSuccess(idea, 201);
  } catch (err) {
    console.error("[IDEA POST]", err);
    return apiError("Internal server error", 500);
  }
}

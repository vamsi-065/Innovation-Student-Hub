import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

// POST /api/reviews — submit a review (professor only)
export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);
    if (authUser.role !== "PROFESSOR" && authUser.role !== "ADMIN") {
      return apiError("Only professors can submit reviews", 403);
    }

    const body = await req.json();
    const { ideaId, content, rating, status, feedback } = body;

    if (!ideaId || !content) {
      return apiError("Idea ID and content are required", 400);
    }
    if (rating < 1 || rating > 5) {
      return apiError("Rating must be between 1 and 5", 400);
    }

    // Check idea exists
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) return apiError("Idea not found", 404);

    // Prevent duplicate review from same professor
    const existing = await prisma.review.findFirst({
      where: { ideaId, professorId: authUser.userId },
    });
    if (existing) return apiError("You have already reviewed this idea", 409);

    const review = await prisma.review.create({
      data: {
        ideaId,
        professorId: authUser.userId,
        content,
        rating: Number(rating),
        status: status || "PENDING",
        feedback,
      },
      include: {
        professor: { select: { id: true, name: true, avatar: true, department: true } },
      },
    });

    // Notify idea author
    await prisma.notification.create({
      data: {
        userId: idea.authorId,
        type: "REVIEW_SUBMITTED",
        content: `Professor reviewed your idea "${idea.title}"`,
        link: `/dashboard/student/ideas/${ideaId}`,
      },
    });

    return apiSuccess(review, 201);
  } catch (err) {
    console.error("[REVIEW POST]", err);
    return apiError("Internal server error", 500);
  }
}

// GET /api/reviews?ideaId=xxx — get reviews for an idea
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ideaId = searchParams.get("ideaId");

    const reviews = await prisma.review.findMany({
      where: ideaId ? { ideaId } : {},
      include: {
        professor: { select: { id: true, name: true, avatar: true, department: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(reviews);
  } catch (err) {
    console.error("[REVIEWS GET]", err);
    return apiError("Internal server error", 500);
  }
}

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true, name: true, avatar: true, role: true,
            university: true, department: true, skills: true,
          },
        },
        team: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, avatar: true, role: true, skills: true } },
              },
              where: { status: "ACTIVE" },
            },
          },
        },
        reviews: {
          include: {
            professor: { select: { id: true, name: true, avatar: true, department: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        likes: { select: { userId: true } },
        _count: { select: { likes: true, reviews: true } },
      },
    });

    if (!idea) return apiError("Idea not found", 404);

    // Increment views
    await prisma.idea.update({ where: { id }, data: { views: { increment: 1 } } });

    return apiSuccess(idea);
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
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);

    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) return apiError("Idea not found", 404);

    if (idea.authorId !== authUser.userId && authUser.role !== "ADMIN") {
      return apiError("Not authorized to edit this idea", 403);
    }

    const body = await req.json();
    const updated = await prisma.idea.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.tags && { tags: body.tags }),
        ...(body.status && { status: body.status }),
        ...(body.domain !== undefined && { domain: body.domain }),
        ...(body.stage !== undefined && { stage: body.stage }),
        ...(body.teamSize && { teamSize: body.teamSize }),
        ...(body.lookingFor && { lookingFor: body.lookingFor }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
      },
    });

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
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);

    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) return apiError("Idea not found", 404);

    if (idea.authorId !== authUser.userId && authUser.role !== "ADMIN") {
      return apiError("Not authorized to delete this idea", 403);
    }

    await prisma.idea.delete({ where: { id } });
    return apiSuccess({ message: "Idea deleted" });
  } catch (err) {
    console.error("[IDEA DELETE]", err);
    return apiError("Internal server error", 500);
  }
}

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

// POST /api/ideas/[id]/flag — flag an idea as inappropriate
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);

    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) return apiError("Idea not found", 404);

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: { flags: { increment: 1 } },
    });

    return apiSuccess({ message: "Idea flagged for review", flags: updatedIdea.flags }, 200);
  } catch (err) {
    console.error("[FLAG IDEA]", err);
    return apiError("Internal server error", 500);
  }
}

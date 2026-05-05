import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

// Toggle like on an idea
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);

    const existing = await prisma.ideaLike.findUnique({
      where: { ideaId_userId: { ideaId: id, userId: authUser.userId } },
    });

    if (existing) {
      await prisma.ideaLike.delete({
        where: { ideaId_userId: { ideaId: id, userId: authUser.userId } },
      });
      return apiSuccess({ liked: false });
    } else {
      await prisma.ideaLike.create({
        data: { ideaId: id, userId: authUser.userId },
      });
      return apiSuccess({ liked: true });
    }
  } catch (err) {
    console.error("[LIKE]", err);
    return apiError("Internal server error", 500);
  }
}

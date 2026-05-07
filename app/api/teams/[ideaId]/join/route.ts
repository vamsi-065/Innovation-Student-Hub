import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

// POST /api/teams/[ideaId]/join — request to join a team
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);
    if (authUser.role !== "STUDENT") return apiError("Only students can join teams", 403);

    const team = await prisma.team.findUnique({
      where: { ideaId },
      include: { members: true },
    });

    if (!team) return apiError("Team not found", 404);

    // Check if already a member
    const existingMember = team.members.find((m: any) => m.userId === authUser.userId);
    if (existingMember) {
      return apiError("You are already in this team", 409);
    }

    // Check idea to get author for notification
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) return apiError("Idea not found", 404);

    const member = await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: authUser.userId,
        status: "PENDING",
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Notify idea owner
    await prisma.notification.create({
      data: {
        userId: idea.authorId,
        type: "TEAM_JOIN_REQUEST",
        content: `${authUser.name} wants to join your team for "${idea.title}"`,
        link: `/dashboard/student/ideas/${ideaId}`,
      },
    });

    return apiSuccess({ message: "Join request sent" });
  } catch (err) {
    console.error("[TEAM JOIN]", err);
    return apiError("Internal server error", 500);
  }
}

// DELETE /api/teams/[ideaId]/join — leave a team
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);

    const team = await prisma.team.findUnique({ where: { ideaId } });
    if (!team) return apiError("Team not found", 404);

    await prisma.teamMember.deleteMany({
      where: { teamId: team.id, userId: authUser.userId },
    });

    return apiSuccess({ message: "Left team successfully" });
  } catch (err) {
    console.error("[TEAM LEAVE]", err);
    return apiError("Internal server error", 500);
  }
}

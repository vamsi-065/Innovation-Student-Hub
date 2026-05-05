import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        university: true,
        department: true,
        year: true,
        skills: true,
        interests: true,
        githubUrl: true,
        linkedinUrl: true,
        websiteUrl: true,
        createdAt: true,
        _count: {
          select: { ideas: true, reviews: true, teamMembers: true },
        },
      },
    });

    if (!user) return apiError("User not found", 404);
    return apiSuccess(user);
  } catch (err) {
    console.error("[ME]", err);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(req: NextRequest) {
  // Logout — clear cookie
  const response = apiSuccess({ message: "Logged out" });
  response.headers.set(
    "Set-Cookie",
    "auth_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
  );
  return response;
}

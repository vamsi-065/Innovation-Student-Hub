import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

// GET /api/admin/users — all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") return apiError("Forbidden", 403);

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || undefined;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          ...(role && { role: role as "STUDENT" | "PROFESSOR" | "ADMIN" }),
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }),
        },
        select: {
          id: true, name: true, email: true, role: true, avatar: true,
          university: true, createdAt: true,
          _count: { select: { ideas: true, reviews: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({
        where: {
          ...(role && { role: role as "STUDENT" | "PROFESSOR" | "ADMIN" }),
        },
      }),
    ]);

    return apiSuccess({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[ADMIN USERS]", err);
    return apiError("Internal server error", 500);
  }
}

// PATCH /api/admin/users — update user role
export async function PATCH(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") return apiError("Forbidden", 403);

    const body = await req.json();
    const { userId, role } = body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return apiSuccess(updated);
  } catch (err) {
    console.error("[ADMIN USER PATCH]", err);
    return apiError("Internal server error", 500);
  }
}

// DELETE /api/admin/users — delete user
export async function DELETE(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") return apiError("Forbidden", 403);

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return apiError("User ID required", 400);

    await prisma.user.delete({ where: { id: userId } });
    return apiSuccess({ message: "User deleted" });
  } catch (err) {
    console.error("[ADMIN USER DELETE]", err);
    return apiError("Internal server error", 500);
  }
}

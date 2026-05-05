import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        avatar: true,
        bio: true,
        skills: true,
        university: true,
        department: true,
      },
    });

    if (!user) return apiError("Invalid email or password", 401);

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) return apiError("Invalid email or password", 401);

    const { password: _, ...userWithoutPassword } = user;

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = apiSuccess({ user: userWithoutPassword, token });
    response.headers.set(
      "Set-Cookie",
      `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
    );

    return response;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return apiError((err as any).errors[0].message, 400);
    }
    console.error("[LOGIN]", err);
    return apiError("Internal server error", 500);
  }
}

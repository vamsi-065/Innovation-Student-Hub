import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "PROFESSOR"]),
  university: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = signupSchema.parse(body);

    // Check if email exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) return apiError("Email already registered", 409);

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        university: data.university,
        department: data.department,
        bio: data.bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    // Sign token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = apiSuccess({ user, token }, 201);
    // Set HTTP-only cookie
    response.headers.set(
      "Set-Cookie",
      `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
    );

    return response;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return apiError((err as any).errors[0].message, 400);
    }
    console.error("[SIGNUP]", err);
    return apiError("Internal server error", 500);
  }
}

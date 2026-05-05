import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  // Fallback to cookie
  const cookie = req.cookies.get("auth_token");
  return cookie?.value ?? null;
}

export function getAuthUser(req: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(req: NextRequest): JWTPayload {
  const user = getAuthUser(req);
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export function requireRole(req: NextRequest, ...roles: Role[]): JWTPayload {
  const user = requireAuth(req);
  if (!roles.includes(user.role)) throw new Error("FORBIDDEN");
  return user;
}

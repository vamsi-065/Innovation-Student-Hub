import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];
const PUBLIC_API = ["/api/auth/signup", "/api/auth/login", "/api/ideas"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();
  if (PUBLIC_API.some((r) => pathname.startsWith(r) && req.method === "GET"))
    return NextResponse.next();

  // Get token from cookie or header
  const token =
    req.cookies.get("auth_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  // Redirect unauthenticated users
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = verifyToken(token);
  if (!user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based route protection
  if (pathname.startsWith("/dashboard/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/student", req.url));
  }
  if (pathname.startsWith("/dashboard/professor") && user.role !== "PROFESSOR" && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/student", req.url));
  }
  if (pathname.startsWith("/api/admin") && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Attach user info to headers for downstream use
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", user.userId);
  requestHeaders.set("x-user-role", user.role);
  requestHeaders.set("x-user-email", user.email);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

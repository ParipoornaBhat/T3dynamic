import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "./env";

// Define expected shape of token from NextAuth
type TokenType = {
  permissions?: string[];
  role?: string;
} | null;

// Utility to check permissions
const hasPermissions = (token: TokenType, requiredPermissions: string[]): boolean => {
  if (!token?.permissions || !Array.isArray(token.permissions)) return false;
  return requiredPermissions.some((perm) => token.permissions!.includes(perm));
};

// Utility to set flash error in cookie
const setFlashError = (response: NextResponse, message: string) => {
  response.cookies.set("flash_error", message, {
    maxAge: 5, // 5 seconds
    path: "/",
    httpOnly: false,
  });
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: env.AUTH_SECRET }) as TokenType;

  // Public routes
  const publicPaths = ["/", "/home", "/about", "/forgotpassword"];
  if (publicPaths.includes(pathname)) return NextResponse.next();

  // Redirect /auth to /auth/signin
  if (pathname === "/auth") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Prevent logged-in users from accessing /auth/signin
  if (pathname === "/auth/signin" && token) {
    const res = NextResponse.redirect(new URL("/", request.url));
    setFlashError(res, "You are already logged in.");
    return res;
  }

  // Allow access to /auth/* if not logged in
  if (pathname.startsWith("/auth") && !token) return NextResponse.next();

  // /dashboard access - block CUSTOMERS
  if (pathname.startsWith("/dashboard")) {
    if (!token || token.role === "CUSTOMER") {
      const res = NextResponse.redirect(new URL("/auth/signin", request.url));
      setFlashError(res, "You must be an employee to access the dashboard.");
      return res;
    }

    // Permissions for /dashboard/settings
    if (pathname === "/dashboard/settings") {
      const required = ["MANAGE_ROLE", "MANAGE_PERMISSION"];
      if (!hasPermissions(token, required)) {
        const res = NextResponse.redirect(new URL("/dashboard", request.url));
        setFlashError(res, "You don't have permission to access Settings.");
        return res;
      }
    }

    // Permissions for /dashboard/alluser
    if (pathname === "/dashboard/alluser") {
      const required = ["MANAGE_CUSTOMER", "MANAGE_EMPLOYEE"];
      if (!hasPermissions(token, required)) {
        const res = NextResponse.redirect(new URL("/dashboard", request.url));
        setFlashError(res, "You don't have permission to view all users.");
        return res;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/about",
    "/forgotpassword",
    "/auth/:path*",
    "/dashboard/:path*",
  ],
};

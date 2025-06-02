import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "./env";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: env.AUTH_SECRET });
if (!token){
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    return NextResponse.next();
}
  if (request.nextUrl.pathname === "/signin") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  if (request.nextUrl.pathname === "/dashboard") {
    console.log(token);
    if (token) {
      if (token.role === "OWNER") {
        return NextResponse.redirect(new URL("/dashboard/owner", request.url));
      } else if (token.role === "EMPLOYEE") {
        return NextResponse.redirect(
          new URL("/dashboard/employee", request.url),
        );
      }
    }
  }
  if (request.nextUrl.pathname === "/dashboard/owner") {
    if (!token || token.role !== "OWNER") {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }
  if (request.nextUrl.pathname === "/dashboard/employee") {
    if (!token || token.role !== "EMPLOYEE") {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/dashboard"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie (database sessions use authjs.session-token)
  // In production with HTTPS, the cookie has __Secure- prefix
  const sessionToken =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value;
  const isLoggedIn = !!sessionToken;

  // Public routes that don't require auth (landing page, login, auth API, legal pages)
  const publicRoutes = ["/", "/login", "/privacy", "/terms", "/api/auth"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname === route || (route !== "/" && pathname.startsWith(route))
  );

  // API routes handle their own auth
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Root path: redirect logged-in users to dashboard, show landing page otherwise
  if (pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Let page.tsx handle rendering the landing page
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute) {
    // Redirect logged-in users away from login page
    if (pathname === "/login" && isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api/stripe/webhook|api/cron).*)",
  ],
};

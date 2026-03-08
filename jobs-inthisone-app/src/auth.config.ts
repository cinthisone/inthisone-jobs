import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Public routes (landing page, login, auth API)
      const publicRoutes = ["/", "/login", "/api/auth"];
      const isPublicRoute = publicRoutes.some((route) =>
        pathname === route || (route !== "/" && pathname.startsWith(route))
      );

      // API routes handle their own auth
      if (pathname.startsWith("/api/")) {
        return true;
      }

      // Root path: let middleware handle redirect for logged-in users
      if (pathname === "/") {
        return true;
      }

      // Allow public routes
      if (isPublicRoute) {
        // Redirect logged-in users away from login page
        if (pathname === "/login" && isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Protect all other routes
      if (!isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
};

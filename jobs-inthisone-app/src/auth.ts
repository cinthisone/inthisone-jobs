import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import prisma from "@/lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user }) {
      // Fetch user data for session
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          role: true,
          subscriptionStatus: true,
          trialEndDate: true,
          gracePeriodEndDate: true,
          image: true,
          name: true,
        },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.role = dbUser.role;
        session.user.subscriptionStatus = dbUser.subscriptionStatus;
        session.user.trialEndDate = dbUser.trialEndDate?.toISOString() ?? null;
        session.user.gracePeriodEndDate =
          dbUser.gracePeriodEndDate?.toISOString() ?? null;
      }

      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Set trial dates for new users (60 days from now)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 60);

      // Check if this is the first user or admin email
      const userCount = await prisma.user.count();
      const isFirstUser = userCount === 1;
      const adminEmail = process.env.ADMIN_EMAIL;
      const isAdmin = isFirstUser || user.email === adminEmail;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          trialEndDate,
          role: isAdmin ? "admin" : "user",
          subscriptionStatus: "trialing",
        },
      });
    },
    async signIn({ user }) {
      // Update last login time
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      }
    },
  },
});

// Type augmentation for next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      subscriptionStatus: string;
      trialEndDate: string | null;
      gracePeriodEndDate: string | null;
    };
  }
}

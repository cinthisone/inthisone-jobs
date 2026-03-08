import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all users with their job and resume counts
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        subscriptionStatus: true,
        trialEndDate: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            jobs: true,
            resumes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get aggregate stats
    const totalJobs = await prisma.job.count();
    const totalResumes = await prisma.resume.count();
    const totalUsers = users.length;

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
        role: u.role,
        subscriptionStatus: u.subscriptionStatus,
        trialEndDate: u.trialEndDate,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        jobCount: u._count.jobs,
        resumeCount: u._count.resumes,
      })),
      totals: {
        users: totalUsers,
        jobs: totalJobs,
        resumes: totalResumes,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

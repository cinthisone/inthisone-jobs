import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { checkWriteAccess } from "@/lib/subscription";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Get resumes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check write access (subscription status)
    const canWrite = await checkWriteAccess(session.user.id);
    if (!canWrite) {
      return NextResponse.json(
        { error: "Subscription required to create resumes" },
        { status: 403 }
      );
    }

    const data = await request.json();

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title: data.title,
        jobTitle: data.jobTitle,
        content: data.content,
      },
    });

    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    console.error("Create resume error:", error);
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}

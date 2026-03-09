import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { checkWriteAccess } from "@/lib/subscription";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const job = await prisma.job.findFirst({
      where: {
        id,
        userId: session.user.id, // Filter by user
      },
      include: {
        resume: {
          select: { id: true, title: true, content: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Get job error:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check write access (subscription status)
    const canWrite = await checkWriteAccess(session.user.id);
    if (!canWrite) {
      return NextResponse.json(
        { error: "Subscription required to update jobs" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const existingJob = await prisma.job.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const data = await request.json();

    const job = await prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        company: data.company,
        applyDate: data.applyDate ? new Date(data.applyDate) : null,
        description: data.description,
        coverLetter: data.coverLetter,
        payRange: data.payRange,
        jobUrl: data.jobUrl,
        source: data.source,
        fitScore: data.fitScore,
        fitAnalysisHtml: data.fitAnalysisHtml,
        whyCompanyAnswers: data.whyCompanyAnswers,
        interviewQA: data.interviewQA,
        favorite: data.favorite ?? undefined,
        resumeId: data.resumeId || null,
      },
      include: {
        resume: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check write access (subscription status)
    const canWrite = await checkWriteAccess(session.user.id);
    if (!canWrite) {
      return NextResponse.json(
        { error: "Subscription required to delete jobs" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const existingJob = await prisma.job.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}

// PATCH - Toggle favorite status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existingJob = await prisma.job.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Toggle the favorite status
    const job = await prisma.job.update({
      where: { id },
      data: {
        favorite: !existingJob.favorite,
      },
    });

    return NextResponse.json({ favorite: job.favorite });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { checkWriteAccess } from "@/lib/subscription";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "applyDate";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const whereClause: Prisma.JobWhereInput = {
      userId: session.user.id, // Filter by user
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                company: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            ],
          }
        : {}),
    };

    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        resume: {
          select: { id: true, title: true },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Get jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
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
        { error: "Subscription required to create jobs" },
        { status: 403 }
      );
    }

    const data = await request.json();

    console.log("Creating job with data:", {
      ...data,
      interviewQA: data.interviewQA ? `[${data.interviewQA.length} chars]` : null,
    });

    const job = await prisma.job.create({
      data: {
        userId: session.user.id, // Add userId
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
        whyCompanyAnswers: data.whyCompanyAnswers || null,
        interviewQA: data.interviewQA || null,
        resumeId: data.resumeId || null,
      },
      include: {
        resume: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create job: ${errorMessage}` },
      { status: 500 }
    );
  }
}

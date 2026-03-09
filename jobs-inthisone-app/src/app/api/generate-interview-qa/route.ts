import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkWriteAccess } from "@/lib/subscription";
import { generateInterviewQA } from "@/lib/openai";
import prisma from "@/lib/prisma";

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
        { error: "Subscription required to use AI features" },
        { status: 403 }
      );
    }

    const { jobId, jobTitle, company, jobDescription, resumeId } =
      await request.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    let resumeContent: string | undefined;

    if (resumeId) {
      // Verify the resume belongs to the user
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: session.user.id },
        select: { content: true },
      });
      resumeContent = resume?.content || undefined;
    }

    const interviewQA = await generateInterviewQA({
      jobTitle: jobTitle || "",
      company: company || "",
      jobDescription,
      resumeContent,
    });

    // If jobId is provided, update the job with the interview Q&A
    if (jobId) {
      // Verify the job belongs to the user
      const existingJob = await prisma.job.findFirst({
        where: { id: jobId, userId: session.user.id },
      });

      if (existingJob) {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            interviewQA: JSON.stringify(interviewQA),
          },
        });
      }
    }

    return NextResponse.json({ interviewQA });
  } catch (error) {
    console.error("Generate interview Q&A error:", error);
    return NextResponse.json(
      { error: "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}

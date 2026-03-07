import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { parseJobPosting, generateCoverLetter } from "@/lib/openai";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobText, resumeId, generateCover } = await request.json();

    if (!jobText) {
      return NextResponse.json(
        { error: "Job posting text is required" },
        { status: 400 }
      );
    }

    // Parse the job posting
    const parsedJob = await parseJobPosting(jobText);

    let coverLetter = "";
    if (generateCover) {
      let resumeContent: string | undefined;

      if (resumeId) {
        const resume = await prisma.resume.findUnique({
          where: { id: resumeId },
          select: { content: true },
        });
        resumeContent = resume?.content || undefined;
      }

      coverLetter = await generateCoverLetter({
        jobTitle: parsedJob.title,
        company: parsedJob.company,
        jobDescription: parsedJob.description,
        resumeContent,
      });
    }

    return NextResponse.json({
      ...parsedJob,
      coverLetter,
    });
  } catch (error) {
    console.error("Parse job error:", error);
    return NextResponse.json(
      { error: "Failed to parse job posting" },
      { status: 500 }
    );
  }
}

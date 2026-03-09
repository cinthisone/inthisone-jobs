import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkWriteAccess } from "@/lib/subscription";
import {
  parseJobPosting,
  generateCoverLetter,
  generateFitAnalysis,
  generateWhyCompanyAnswers,
} from "@/lib/openai";
import prisma from "@/lib/prisma";

// Replace date placeholders with actual current date
function replaceDatePlaceholders(text: string): string {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Match various date placeholder patterns
  const patterns = [
    /\[Today'?s?\s*Date\]/gi,
    /\[Current\s*Date\]/gi,
    /\[Date\]/gi,
    /\[Insert\s*Date\]/gi,
    /\[DATE\]/g,
    /\[MM\/DD\/YYYY\]/gi,
    /\[Month\s+Day,?\s+Year\]/gi,
  ];

  let result = text;
  for (const pattern of patterns) {
    result = result.replace(pattern, formattedDate);
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check write access (subscription status) since this is a write-like operation
    const canWrite = await checkWriteAccess(session.user.id);
    if (!canWrite) {
      return NextResponse.json(
        { error: "Subscription required to use AI features" },
        { status: 403 }
      );
    }

    const { jobText, resumeId, generateCover, customInstructions } =
      await request.json();

    if (!jobText) {
      return NextResponse.json(
        { error: "Job posting text is required" },
        { status: 400 }
      );
    }

    // Parse the job posting
    const parsedJob = await parseJobPosting(jobText);

    let coverLetter = "";
    let fitAnalysis = { fitScore: "", tableHtml: "" };
    let whyCompanyAnswers = "";

    let resumeContent: string | undefined;

    if (resumeId) {
      // Verify the resume belongs to the user
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: session.user.id },
        select: { content: true },
      });
      resumeContent = resume?.content || undefined;
    }

    const requestData = {
      jobTitle: parsedJob.title,
      company: parsedJob.company,
      jobDescription: parsedJob.description,
      resumeContent,
      customInstructions,
    };

    if (generateCover) {
      // Run AI generations in parallel for speed (interview Q&A is generated on-demand separately)
      const [coverLetterResult, fitAnalysisResult, whyCompanyResult] =
        await Promise.all([
          generateCoverLetter(requestData),
          generateFitAnalysis(requestData),
          generateWhyCompanyAnswers(requestData),
        ]);

      coverLetter = replaceDatePlaceholders(coverLetterResult);
      fitAnalysis = fitAnalysisResult;
      whyCompanyAnswers = whyCompanyResult;
    }

    return NextResponse.json({
      ...parsedJob,
      coverLetter,
      fitAnalysis,
      whyCompanyAnswers,
    });
  } catch (error) {
    console.error("Parse job error:", error);
    return NextResponse.json(
      { error: "Failed to parse job posting" },
      { status: 500 }
    );
  }
}

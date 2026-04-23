import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company")?.trim();
  const title = searchParams.get("title")?.trim();

  if (!company || !title) {
    return NextResponse.json({ duplicates: [] });
  }

  const duplicates = await prisma.job.findMany({
    where: {
      userId: session.user.id,
      company: { equals: company, mode: "insensitive" },
      title: { equals: title, mode: "insensitive" },
    },
    select: {
      id: true,
      title: true,
      company: true,
      applyDate: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ duplicates });
}

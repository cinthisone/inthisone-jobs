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

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
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
        { error: "Subscription required to create notes" },
        { status: 403 }
      );
    }

    const data = await request.json();

    const note = await prisma.note.create({
      data: {
        userId: session.user.id,
        title: data.title,
        content: data.content,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

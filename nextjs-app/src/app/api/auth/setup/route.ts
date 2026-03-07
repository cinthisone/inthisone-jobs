import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ needsSetup: userCount === 0 });
  } catch (error) {
    console.error("Setup check error:", error);
    return NextResponse.json({ needsSetup: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      return NextResponse.json(
        { error: "Setup already completed" },
        { status: 400 }
      );
    }

    const { username, password } = await request.json();

    const finalUsername = username || process.env.DEFAULT_ADMIN_USERNAME || "admin";
    const finalPassword = password || process.env.DEFAULT_ADMIN_PASSWORD || "inthisonejobs2024";

    const passwordHash = await hashPassword(finalPassword);

    const user = await prisma.user.create({
      data: {
        username: finalUsername,
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created",
      username: user.username,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}

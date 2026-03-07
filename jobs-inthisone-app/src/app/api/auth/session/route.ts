import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ isLoggedIn: false });
    }

    return NextResponse.json({
      isLoggedIn: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        subscriptionStatus: session.user.subscriptionStatus,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ isLoggedIn: false });
  }
}

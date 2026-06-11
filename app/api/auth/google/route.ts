import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, name, firebaseUid } = await request.json();

    if (!email || !firebaseUid) {
      return NextResponse.json(
        { error: "Email and Firebase UID are required" },
        { status: 400 }
      );
    }

    const password = `GfbAuth_${firebaseUid}`;
    const displayName = name || email.split("@")[0];

    let authResponse = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    if (authResponse.ok) {
      return authResponse;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.user.delete({ where: { id: existingUser.id } });
    }

    authResponse = await auth.api.signUpEmail({
      body: { name: displayName, email, password },
      asResponse: true,
    });

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: "Could not create account. Please try email/password registration." },
        { status: 422 }
      );
    }

    return authResponse;
  } catch (error) {
    console.error("Google auth bridge error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

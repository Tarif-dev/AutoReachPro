import { createClient } from "@/lib/supabase/server";
import { createUserProfile } from "@/lib/auth/create-profile";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, fullName, testUserId } = await request.json();

    if (!email || !testUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and testUserId are required",
        },
        { status: 400 }
      );
    }

    console.log("Testing manual profile creation:", {
      email,
      fullName,
      testUserId,
    });

    const result = await createUserProfile(testUserId, email, fullName);

    console.log("Manual profile creation result:", result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Profile creation test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

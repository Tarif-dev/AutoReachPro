import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    // Test the connection by trying to query auth.users
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Supabase connection failed",
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Try to query a simple table to test database access
    const { data: testData, error: dbError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (dbError) {
      return NextResponse.json(
        {
          status: "auth_ok_db_error",
          message: "Supabase auth works but database schema not deployed",
          error: dbError.message,
          suggestion:
            "Please deploy the supabase-schema.sql file in Supabase SQL editor",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Supabase connection and database schema working correctly",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unexpected error testing Supabase connection",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

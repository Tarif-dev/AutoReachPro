import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { leads } = body;

    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: "No leads provided" }, { status: 400 });
    }

    const results = {
      total_processed: leads.length,
      imported_count: 0,
      skipped_count: 0,
      error_count: 0,
      imported_leads: [] as any[],
      errors: [] as string[],
    };

    for (const leadData of leads) {
      try {
        // Validate required fields
        if (!leadData.email || !leadData.first_name) {
          results.error_count++;
          results.errors.push(
            `Missing required fields for lead: ${leadData.email || "unknown"}`
          );
          continue;
        }

        // Check if lead already exists
        const { data: existingLead } = await supabase
          .from("leads")
          .select("id")
          .eq("user_id", user.id)
          .eq("email", leadData.email)
          .single();

        if (existingLead) {
          results.skipped_count++;
          continue;
        }

        // Insert new lead
        const { data: newLead, error } = await supabase
          .from("leads")
          .insert({
            user_id: user.id,
            first_name: leadData.first_name?.trim() || "",
            last_name: leadData.last_name?.trim() || "",
            email: leadData.email?.trim() || "",
            company: leadData.company?.trim() || null,
            position: leadData.position?.trim() || null,
            phone: leadData.phone?.trim() || null,
            website: leadData.website?.trim() || null,
            linkedin: leadData.linkedin?.trim() || null,
            source: leadData.source?.trim() || "CSV Import",
            notes: leadData.notes?.trim() || null,
            status: "new",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          results.error_count++;
          results.errors.push(
            `Error importing ${leadData.email}: ${error.message}`
          );
        } else {
          results.imported_count++;
          results.imported_leads.push(newLead);
        }
      } catch (error) {
        results.error_count++;
        results.errors.push(
          `Unexpected error for ${leadData.email || "unknown"}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

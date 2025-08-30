import { NextRequest, NextResponse } from "next/server";
import {
  personalizeEmail,
  generateEmailVariations,
} from "@/lib/ai/personalization";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { leadId, template, variations = 1 } = await request.json();

    if (!leadId || !template) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead ID and template are required",
        },
        { status: 400 }
      );
    }

    // Verify user authentication
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .eq("user_id", user.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found",
        },
        { status: 404 }
      );
    }

    // Prepare lead data for personalization
    const leadData = {
      firstName: lead.first_name,
      lastName: lead.last_name,
      company: lead.company,
      position: lead.position,
      industry: lead.industry,
      website: lead.website,
      linkedinUrl: lead.linkedin_url,
      notes: lead.notes,
    };

    // Generate personalized email(s)
    if (variations === 1) {
      const personalized = await personalizeEmail(template, leadData);
      return NextResponse.json({
        success: true,
        data: personalized,
      });
    } else {
      const variationsList = await generateEmailVariations(
        template,
        leadData,
        variations
      );
      return NextResponse.json({
        success: true,
        data: variationsList,
      });
    }
  } catch (error: any) {
    console.error("AI personalization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to personalize email",
      },
      { status: 500 }
    );
  }
}

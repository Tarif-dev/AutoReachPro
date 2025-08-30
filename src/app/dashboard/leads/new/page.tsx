"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddLeadForm from "@/components/AddLeadForm";
import { createClient } from "@/lib/supabase/client";

interface Lead {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  position?: string;
  industry?: string;
  website?: string;
  phone?: string;
  linkedin_url?: string;
  status: string;
  source?: string;
  notes?: string;
}

export default function AddLeadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSave = async (leadData: Lead) => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("leads")
        .insert([
          {
            user_id: user.id,
            email: leadData.email,
            first_name: leadData.first_name,
            last_name: leadData.last_name,
            company: leadData.company || null,
            position: leadData.position || null,
            industry: leadData.industry || null,
            website: leadData.website || null,
            phone: leadData.phone || null,
            linkedin_url: leadData.linkedin_url || null,
            status: leadData.status,
            source: leadData.source || null,
            notes: leadData.notes || null,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      console.log("Lead created successfully:", data);
      router.push("/dashboard/leads?success=created");
    } catch (err: any) {
      console.error("Error creating lead:", err);
      setError(err.message || "Failed to create lead");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/leads");
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      <AddLeadForm
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}

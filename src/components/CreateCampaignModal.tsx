"use client";

import { useState } from "react";
import { X, Target, Users, Mail } from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  status: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  total_leads: number;
  emails_sent: number;
  created_at: string;
}

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (campaign: Campaign) => void;
  leads: Lead[];
}

export default function CreateCampaignModal({
  isOpen,
  onClose,
  onSuccess,
  leads,
}: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    template_id: "",
    selected_leads: [] as string[],
    use_ai_personalization: true,
    send_immediately: false,
  });
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(1); // 1: Campaign Info, 2: Lead Selection, 3: Review

  const availableLeads = leads.filter((lead) => lead.status !== "converted");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleLeadSelection = (leadId: string) => {
    setFormData((prev) => ({
      ...prev,
      selected_leads: prev.selected_leads.includes(leadId)
        ? prev.selected_leads.filter((id) => id !== leadId)
        : [...prev.selected_leads, leadId],
    }));
  };

  const selectAllLeads = () => {
    setFormData((prev) => ({
      ...prev,
      selected_leads: availableLeads.map((lead) => lead.id),
    }));
  };

  const deselectAllLeads = () => {
    setFormData((prev) => ({
      ...prev,
      selected_leads: [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.subject) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.selected_leads.length === 0) {
      toast.error("Please select at least one lead");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          subject: formData.subject,
          template_id: formData.template_id || null,
          selected_leads: formData.selected_leads,
          use_ai_personalization: formData.use_ai_personalization,
          send_immediately: formData.send_immediately,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create campaign");
      }

      const campaign = await response.json();
      onSuccess(campaign);

      // Reset form
      setFormData({
        name: "",
        subject: "",
        template_id: "",
        selected_leads: [],
        use_ai_personalization: true,
        send_immediately: false,
      });
      setStep(1);

      toast.success("Campaign created successfully!");
    } catch (error) {
      console.error("Campaign creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create campaign"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      subject: "",
      template_id: "",
      selected_leads: [],
      use_ai_personalization: true,
      send_immediately: false,
    });
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Create New Campaign
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {[
            {
              number: 1,
              title: "Campaign Info",
              icon: <Target className="h-4 w-4" />,
            },
            {
              number: 2,
              title: "Select Leads",
              icon: <Users className="h-4 w-4" />,
            },
            {
              number: 3,
              title: "Review & Create",
              icon: <Mail className="h-4 w-4" />,
            },
          ].map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= stepItem.number
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {stepItem.icon}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= stepItem.number ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {stepItem.title}
              </span>
              {index < 2 && (
                <div
                  className={`mx-4 h-0.5 w-16 ${
                    step > stepItem.number ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Campaign Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Campaign Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Q4 Product Launch Outreach"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Quick question about {{company}}"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Use {`{company}`}, {`{first_name}`}, {`{last_name}`} for
                  personalization
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="use_ai_personalization"
                    name="use_ai_personalization"
                    checked={formData.use_ai_personalization}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="use_ai_personalization"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Use AI for email personalization
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  AI will customize email content based on lead information
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Lead Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">
                  Select Leads ({formData.selected_leads.length} selected)
                </h4>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={selectAllLeads}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={deselectAllLeads}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                {availableLeads.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {availableLeads.map((lead) => (
                      <div key={lead.id} className="p-3 hover:bg-gray-50">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selected_leads.includes(lead.id)}
                            onChange={() => handleLeadSelection(lead.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {lead.first_name} {lead.last_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {lead.email}
                                </p>
                                {lead.company && (
                                  <p className="text-xs text-gray-400">
                                    {lead.company}
                                  </p>
                                )}
                              </div>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  lead.status === "new"
                                    ? "bg-blue-100 text-blue-800"
                                    : lead.status === "qualified"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {lead.status}
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No leads available. Add some leads first.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-3">
                  Campaign Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Subject:</span>
                    <span className="ml-2 font-medium">{formData.subject}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Selected Leads:</span>
                    <span className="ml-2 font-medium">
                      {formData.selected_leads.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">AI Personalization:</span>
                    <span className="ml-2 font-medium">
                      {formData.use_ai_personalization ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="send_immediately"
                    name="send_immediately"
                    checked={formData.send_immediately}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="send_immediately"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Send campaign immediately after creation
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  If unchecked, you can send the campaign manually later
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={creating}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formData.name || !formData.subject)) ||
                    (step === 2 && formData.selected_leads.length === 0)
                  }
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Create Campaign
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

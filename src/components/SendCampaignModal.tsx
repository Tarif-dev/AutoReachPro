"use client";

import { useState } from "react";
import { Send, Clock, AlertCircle, CheckCircle } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: string;
  total_leads: number;
  emails_sent: number;
}

interface SendCampaignModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (results: any) => void;
}

export default function SendCampaignModal({
  campaign,
  isOpen,
  onClose,
  onSuccess,
}: SendCampaignModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<any>(null);

  const handleSendNow = async () => {
    setIsSending(true);
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send campaign");
      }

      const results = await response.json();
      setSendResults(results.results);
      onSuccess(results);
    } catch (error) {
      console.error("Error sending campaign:", error);
      alert("Failed to send campaign. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="text-center">
          {!sendResults ? (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Send Campaign
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  Campaign: {campaign.name}
                </p>
                <p className="text-sm text-gray-500">
                  This will send emails to {campaign.total_leads} leads
                </p>
              </div>

              {campaign.status === "sent" && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-700">
                      This campaign has already been sent. Sending again will
                      create duplicate emails.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={onClose}
                  disabled={isSending}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNow}
                  disabled={isSending}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Campaign Sent Successfully!
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total leads:</span>{" "}
                  {sendResults.total}
                </p>
                <p className="text-sm text-green-600">
                  <span className="font-medium">Successfully sent:</span>{" "}
                  {sendResults.sent}
                </p>
                {sendResults.failed > 0 && (
                  <p className="text-sm text-red-600">
                    <span className="font-medium">Failed:</span>{" "}
                    {sendResults.failed}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createFullSampleData } from "@/lib/utils/sample-data";
import { useRouter } from "next/navigation";
import { Database, Users, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DevToolsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateSampleData = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Get current user from session
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Please log in first");
      }

      const { user } = await response.json();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const result = await createFullSampleData(user.id);

      if (result.success) {
        setMessage("Sample data created successfully!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError("Failed to create sample data");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Development Tools
            </h1>
            <p className="text-gray-600">
              Quick setup tools for testing AutoReachPro
            </p>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-green-800 text-sm">{message}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Database className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleCreateSampleData}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Users className="mr-2 h-5 w-5" />
                  Create Sample Data
                </>
              )}
            </button>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                What this creates:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 5 sample leads with different statuses</li>
                <li>• 1 sample email campaign with stats</li>
                <li>• Realistic test data for dashboard</li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

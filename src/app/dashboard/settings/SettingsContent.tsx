"use client";

import { useState } from "react";
import { User, Settings, Key, Mail, Bell, Shield, Save } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  company?: string;
  website?: string;
  phone?: string;
}

interface UserSettings {
  openai_api_key?: string;
  email_signature?: string;
  timezone?: string;
  daily_email_limit?: number;
  auto_follow_up?: boolean;
  slack_webhook?: string;
}

interface SettingsContentProps {
  user: any;
  profile: Profile | null;
  settings: UserSettings | null;
}

export default function SettingsContent({
  user,
  profile,
  settings,
}: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || "",
    company: profile?.company || "",
    website: profile?.website || "",
    phone: profile?.phone || "",
  });
  const [settingsData, setSettingsData] = useState({
    openai_api_key: settings?.openai_api_key || "",
    email_signature: settings?.email_signature || "",
    timezone: settings?.timezone || "UTC",
    daily_email_limit: settings?.daily_email_limit || 100,
    auto_follow_up: settings?.auto_follow_up || false,
    slack_webhook: settings?.slack_webhook || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "London" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Asia/Tokyo", label: "Tokyo" },
  ];

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "api", name: "API Keys", icon: Key },
    { id: "email", name: "Email", icon: Mail },
    { id: "notifications", name: "Notifications", icon: Bell },
  ];

  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const updatedProfile = await response.json();
      console.log("Profile saved successfully:", updatedProfile);

      // Show success message (you could add a toast notification here)
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsData),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const updatedSettings = await response.json();
      console.log("Settings saved successfully:", updatedSettings);

      // Show success message
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings, API keys, and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Profile Information
                </h3>
                <p className="text-sm text-gray-600">
                  Update your account profile information.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        full_name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        company: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        website: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleProfileSave}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
                <p className="text-sm text-gray-600">
                  Configure your API keys for AI-powered features.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={settingsData.openai_api_key}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        openai_api_key: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="sk-..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for AI-powered email personalization. Get your key
                    from{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      OpenAI Dashboard
                    </a>
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSettingsSave}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save API Keys"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Email Settings
                </h3>
                <p className="text-sm text-gray-600">
                  Configure your email sending preferences and signature.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Signature
                  </label>
                  <textarea
                    value={settingsData.email_signature}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        email_signature: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Best regards,&#10;Your Name&#10;Your Title&#10;Your Company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Email Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={settingsData.daily_email_limit}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        daily_email_limit: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum number of emails to send per day to avoid being
                    marked as spam.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settingsData.timezone}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        timezone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {timezones.map((timezone) => (
                      <option key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto_follow_up"
                    checked={settingsData.auto_follow_up}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        auto_follow_up: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="auto_follow_up"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Enable automatic follow-up emails
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSettingsSave}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Configure how you want to be notified about campaign
                  activities.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slack Webhook URL
                  </label>
                  <input
                    type="url"
                    value={settingsData.slack_webhook}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        slack_webhook: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://hooks.slack.com/services/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Receive campaign notifications in Slack. Learn how
                    to{" "}
                    <a
                      href="https://api.slack.com/messaging/webhooks"
                      target="_blank"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      create a webhook
                    </a>
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="campaign_started"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="campaign_started"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Campaign started notifications
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="campaign_completed"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="campaign_completed"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Campaign completed notifications
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email_replies"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="email_replies"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Email reply notifications
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="weekly_summary"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="weekly_summary"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Weekly summary reports
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSettingsSave}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Notifications"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, User, Mail, Building, Phone, Globe, Linkedin } from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  position: string | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  status: string;
  source: string | null;
  notes: string | null;
  created_at: string;
}

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (lead: Lead) => void;
}

export default function CreateLeadModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateLeadModalProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    position: "",
    phone: "",
    website: "",
    linkedin: "",
    source: "",
    notes: "",
  });
  const [creating, setCreating] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim().toLowerCase(),
          company: formData.company.trim() || null,
          position: formData.position.trim() || null,
          phone: formData.phone.trim() || null,
          website: formData.website.trim() || null,
          linkedin: formData.linkedin.trim() || null,
          source: formData.source.trim() || "Manual Entry",
          notes: formData.notes.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create lead");
      }

      const lead = await response.json();
      onSuccess(lead);

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        position: "",
        phone: "",
        website: "",
        linkedin: "",
        source: "",
        notes: "",
      });

      toast.success("Lead added successfully!");
    } catch (error) {
      console.error("Lead creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create lead"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      company: "",
      position: "",
      phone: "",
      website: "",
      linkedin: "",
      source: "",
      notes: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Add New Lead</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  First Name *
                </div>
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Smith"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email Address *
              </div>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@company.com"
              required
            />
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  Company
                </div>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position/Title
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Marketing Manager"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone
                </div>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700"
              >
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  Website
                </div>
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://company.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-700"
            >
              <div className="flex items-center">
                <Linkedin className="h-4 w-4 mr-1" />
                LinkedIn Profile
              </div>
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>

          <div>
            <label
              htmlFor="source"
              className="block text-sm font-medium text-gray-700"
            >
              Lead Source
            </label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select source...</option>
              <option value="Manual Entry">Manual Entry</option>
              <option value="Website Form">Website Form</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referral">Referral</option>
              <option value="Cold Outreach">Cold Outreach</option>
              <option value="Event">Event/Conference</option>
              <option value="Social Media">Social Media</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional information about this lead..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={creating}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !formData.first_name || !formData.email}
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Adding...
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Add Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

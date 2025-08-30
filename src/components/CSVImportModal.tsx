"use client";

import { useState, useRef } from "react";
import { Upload, Download, AlertCircle, CheckCircle, X } from "lucide-react";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (importedLeads: any[]) => void;
}

export default function CSVImportModal({
  isOpen,
  onClose,
  onSuccess,
}: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleCSVData = `first_name,last_name,email,company,position,phone,website,linkedin,source,notes
John,Doe,john.doe@example.com,Tech Corp,CEO,(555) 123-4567,https://techcorp.com,https://linkedin.com/in/johndoe,Website,Interested in our services
Jane,Smith,jane.smith@startup.io,Startup Inc,CTO,(555) 987-6543,https://startup.io,https://linkedin.com/in/janesmith,Referral,Looking for automation solutions`;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        setError("Please select a CSV file");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    const leads = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const lead: any = {};

      headers.forEach((header, index) => {
        lead[header] = values[index] || "";
      });

      // Validate required fields
      if (lead.email && lead.first_name) {
        leads.push(lead);
      }
    }

    return leads;
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const text = await file.text();
      const parsedLeads = parseCSV(text);

      if (parsedLeads.length === 0) {
        setError(
          "No valid leads found in CSV. Make sure it has 'email' and 'first_name' columns."
        );
        setIsUploading(false);
        return;
      }

      // Send to API
      const response = await fetch("/api/leads/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leads: parsedLeads }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import leads");
      }

      const results = await response.json();
      setUploadResults(results);
      onSuccess(results.imported_leads);
    } catch (error) {
      console.error("Import error:", error);
      setError(error instanceof Error ? error.message : "Failed to import CSV");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCSVData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-leads.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setFile(null);
    setUploadResults(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Import Leads from CSV
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!uploadResults ? (
          <div className="space-y-4">
            {/* Download sample */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center">
                <Download className="h-5 w-5 text-blue-600 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Need a template?
                  </p>
                  <p className="text-sm text-blue-700">
                    Download our sample CSV file to see the expected format.
                  </p>
                </div>
                <button
                  onClick={handleDownloadSample}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Download Sample
                </button>
              </div>
            </div>

            {/* File upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="mb-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {file ? file.name : "Choose CSV file to upload"}
                    </span>
                    <span className="mt-1 block text-sm text-gray-600">
                      {file ? "Click to change file" : "or drag and drop"}
                    </span>
                  </label>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Select File
                </button>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Expected format */}
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Expected CSV Format:
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <strong>Required columns:</strong> first_name, last_name,
                  email
                </p>
                <p>
                  <strong>Optional columns:</strong> company, position, phone,
                  website, linkedin, source, notes
                </p>
                <p>
                  <strong>Note:</strong> Column headers should match exactly
                  (case-sensitive)
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-bounce" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Leads
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Import Completed Successfully!
            </h3>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total processed:</span>{" "}
                {uploadResults.total_processed}
              </p>
              <p className="text-sm text-green-600">
                <span className="font-medium">Successfully imported:</span>{" "}
                {uploadResults.imported_count}
              </p>
              {uploadResults.skipped_count > 0 && (
                <p className="text-sm text-yellow-600">
                  <span className="font-medium">Skipped (duplicates):</span>{" "}
                  {uploadResults.skipped_count}
                </p>
              )}
              {uploadResults.error_count > 0 && (
                <p className="text-sm text-red-600">
                  <span className="font-medium">Errors:</span>{" "}
                  {uploadResults.error_count}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

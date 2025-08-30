import Link from "next/link";
import { Mail, CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 mb-8"
          >
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              AutoReachPro
            </span>
          </Link>
        </div>

        {/* Verification Message */}
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center space-y-6">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-gray-600">
              We've sent a verification link to your email address. Please click
              the link to verify your account and complete your signup.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              <strong>Didn't receive the email?</strong> Check your spam folder
              or try signing up again.
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Back to sign in
            </Link>
          </div>
        </div>

        {/* Help */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Having trouble?{" "}
            <a
              href="mailto:support@autoreachpro.com"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

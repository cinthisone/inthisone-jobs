"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero section */}
          <div className="relative h-56 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
              <Image
                src="/images/inthisone-jobs-logo.png"
                alt="Inthisone Jobs"
                width={200}
                height={67}
                className="mb-4 brightness-0 invert"
                priority
              />
              <p className="text-center text-indigo-100">
                Track your job applications with AI-powered assistance
              </p>
            </div>
          </div>

          {/* Login section */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Get Started
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Sign in or create an account to manage your job applications
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6">
                {error === "OAuthAccountNotLinked"
                  ? "This email is already associated with another account."
                  : "An error occurred during sign in. Please try again."}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span className="text-gray-700 font-medium">
                {isLoading ? "Signing in..." : "Continue with Google"}
              </span>
            </button>

            {/* Trial info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  New users get a <span className="font-semibold text-indigo-600">30-day free trial</span>
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Then $10/month to continue using all features
                </p>
                <p className="text-xs text-emerald-600 flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card required to get started
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

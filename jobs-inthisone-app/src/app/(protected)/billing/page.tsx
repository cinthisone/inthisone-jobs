"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface SubscriptionInfo {
  status: string;
  trialEndDate: string | null;
  gracePeriodEndDate: string | null;
  daysRemaining: number | null;
  canWrite: boolean;
}

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const fetchSubscriptionInfo = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user) {
        setSubscriptionInfo({
          status: data.user.subscriptionStatus,
          trialEndDate: data.user.trialEndDate,
          gracePeriodEndDate: data.user.gracePeriodEndDate,
          daysRemaining: calculateDaysRemaining(data.user),
          canWrite: ["trialing", "active", "grace_period"].includes(data.user.subscriptionStatus),
        });
      }
    } catch (err) {
      console.error("Failed to fetch subscription info:", err);
    }
  };

  const calculateDaysRemaining = (user: { subscriptionStatus: string; trialEndDate: string | null; gracePeriodEndDate: string | null }) => {
    const now = new Date();
    if (user.subscriptionStatus === "trialing" && user.trialEndDate) {
      const endDate = new Date(user.trialEndDate);
      return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
    if (user.subscriptionStatus === "grace_period" && user.gracePeriodEndDate) {
      const endDate = new Date(user.gracePeriodEndDate);
      return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
    return null;
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError("Failed to open billing portal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!subscriptionInfo) return null;

    const badges: Record<string, { color: string; text: string }> = {
      trialing: { color: "bg-blue-100 text-blue-800", text: "Free Trial" },
      active: { color: "bg-green-100 text-green-800", text: "Active" },
      grace_period: { color: "bg-yellow-100 text-yellow-800", text: "Grace Period" },
      expired: { color: "bg-red-100 text-red-800", text: "Expired" },
      cancelled: { color: "bg-gray-100 text-gray-800", text: "Cancelled" },
    };

    const badge = badges[subscriptionInfo.status] || { color: "bg-gray-100 text-gray-800", text: subscriptionInfo.status };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing & Subscription</h1>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Your subscription is now active. Thank you for subscribing!
        </div>
      )}

      {canceled && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Checkout was canceled. You can try again when you&apos;re ready.
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
          {getStatusBadge()}
        </div>

        {subscriptionInfo && (
          <div className="space-y-3">
            {subscriptionInfo.status === "trialing" && subscriptionInfo.daysRemaining !== null && (
              <p className="text-gray-600">
                Your free trial ends in <span className="font-semibold">{subscriptionInfo.daysRemaining} days</span>
                {subscriptionInfo.trialEndDate && (
                  <span className="text-gray-500">
                    {" "}({new Date(subscriptionInfo.trialEndDate).toLocaleDateString()})
                  </span>
                )}
              </p>
            )}

            {subscriptionInfo.status === "grace_period" && subscriptionInfo.daysRemaining !== null && (
              <p className="text-yellow-600">
                Your grace period ends in <span className="font-semibold">{subscriptionInfo.daysRemaining} days</span>.
                Subscribe now to keep full access.
              </p>
            )}

            {subscriptionInfo.status === "active" && (
              <p className="text-gray-600">
                You have full access to all features.
              </p>
            )}

            {subscriptionInfo.status === "expired" && (
              <p className="text-red-600">
                Your subscription has expired. Subscribe to regain access to create and edit jobs.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>

        <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Pro Plan</h3>
              <p className="text-gray-600">Full access to all features</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-gray-900">$10</span>
              <span className="text-gray-600">/month</span>
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Unlimited job applications
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              AI-powered job parsing
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Resume management
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cover letter generation
            </li>
          </ul>

          {subscriptionInfo?.status === "active" ? (
            <button
              onClick={handleManageBilling}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Manage Subscription"}
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Subscribe Now"}
            </button>
          )}
        </div>
      </div>

      {/* Billing Portal */}
      {subscriptionInfo?.status === "active" && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Portal</h2>
          <p className="text-gray-600 mb-4">
            Manage your subscription, update payment method, view invoices, and more.
          </p>
          <button
            onClick={handleManageBilling}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Open Billing Portal"}
          </button>
        </div>
      )}
    </div>
  );
}

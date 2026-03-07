"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Job } from "@/lib/types";

export default function ViewJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Failed to fetch job:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job application?")) {
      return;
    }

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-600 mt-1">{job.company}</p>
            <p className="text-sm text-gray-500 mt-2">
              Applied on {formatDate(job.applyDate)}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/jobs/${id}/edit`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Meta info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {job.payRange && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Pay Range</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {job.payRange}
              </p>
            </div>
          )}
          {job.source && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Source</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {job.source}
              </p>
            </div>
          )}
          {job.jobUrl && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Job URL</h3>
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-indigo-600 hover:text-indigo-800 inline-flex items-center"
              >
                View Posting
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
          {job.resume && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Resume Used</h3>
              <Link
                href={`/resumes/${job.resume.id}`}
                className="mt-1 text-indigo-600 hover:text-indigo-800"
              >
                {job.resume.title}
              </Link>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Job Description
          </h2>
          <div className="prose max-w-none bg-gray-50 rounded-lg p-4">
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: job.description || "No description provided" }}
            />
          </div>
        </div>

        {/* Cover Letter */}
        {job.coverLetter && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Cover Letter
            </h2>
            <div className="prose max-w-none bg-gray-50 rounded-lg p-4">
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: job.coverLetter }}
              />
            </div>
          </div>
        )}

        {/* Fit Analysis */}
        {job.fitScore && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Fit Analysis</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                Fit Score: {job.fitScore}
              </span>
            </div>
            {job.fitAnalysisHtml && (
              <div className="prose max-w-none bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <div dangerouslySetInnerHTML={{ __html: job.fitAnalysisHtml }} />
              </div>
            )}
          </div>
        )}

        {/* Why This Company */}
        {job.whyCompanyAnswers && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Why Do You Want to Work for This Company?
            </h2>
            <div className="prose max-w-none bg-blue-50 rounded-lg p-4">
              <div dangerouslySetInnerHTML={{ __html: job.whyCompanyAnswers }} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

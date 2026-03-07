"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Resume } from "@/lib/types";

export default function ViewResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(`/api/resumes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setResume(data);
        } else {
          router.push("/resumes");
        }
      } catch (error) {
        console.error("Failed to fetch resume:", error);
        router.push("/resumes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResume();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/resumes");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete resume");
      }
    } catch (error) {
      console.error("Failed to delete resume:", error);
    }
  };

  const formatDate = (dateString: string) => {
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

  if (!resume) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {resume.title}
            </h1>
            {resume.jobTitle && (
              <p className="text-lg text-gray-600 mt-1">
                Target: {resume.jobTitle}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Last updated {formatDate(resume.updatedAt)}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/resumes/${id}/edit`}
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
        {/* Associated Jobs */}
        {resume.jobs && resume.jobs.length > 0 && (
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-indigo-800 mb-3">
              Used in {resume.jobs.length} Job Application{resume.jobs.length !== 1 ? "s" : ""}
            </h3>
            <div className="space-y-2">
              {resume.jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center justify-between p-2 bg-white rounded hover:bg-indigo-100 transition-colors"
                >
                  <span className="font-medium text-gray-900">{job.title}</span>
                  <span className="text-sm text-gray-500">{job.company}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Resume Content */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Resume Content
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: resume.content || "<p>No content</p>",
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Link
          href="/resumes"
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
          Back to Resumes
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Resume } from "@/lib/types";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg p-4 min-h-[350px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
    </div>
  ),
});

interface ResumeFormProps {
  resume?: Resume;
  isEditing?: boolean;
}

export default function ResumeForm({ resume, isEditing = false }: ResumeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: resume?.title || "",
    jobTitle: resume?.jobTitle || "",
    content: resume?.content || "",
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = isEditing ? `/api/resumes/${resume?.id}` : "/api/resumes";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save resume");
      }

      router.push("/resumes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g. Software Engineer Resume"
        />
        <p className="mt-1 text-sm text-gray-500">
          A name to identify this resume
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g. Senior Software Engineer"
        />
        <p className="mt-1 text-sm text-gray-500">
          The job title you&apos;re targeting with this resume
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume Content <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
          placeholder="Paste your complete resume content here including skills, experience, education, etc."
        />
        <p className="mt-1 text-sm text-gray-500">
          Your complete resume content. This will be used by AI to generate tailored cover letters.
        </p>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? "Saving..." : isEditing ? "Update Resume" : "Save Resume"}
        </button>
      </div>
    </form>
  );
}

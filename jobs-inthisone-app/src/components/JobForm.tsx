"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Job, Resume } from "@/lib/types";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
    </div>
  ),
});

interface JobFormProps {
  job?: Job;
  isEditing?: boolean;
}

export default function JobForm({ job, isEditing = false }: JobFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [formData, setFormData] = useState({
    title: job?.title || "",
    company: job?.company || "",
    applyDate: job?.applyDate?.split("T")[0] || new Date().toISOString().split("T")[0],
    description: job?.description || "",
    coverLetter: job?.coverLetter || "",
    payRange: job?.payRange || "",
    jobUrl: job?.jobUrl || "",
    source: job?.source || "",
    fitScore: job?.fitScore || "",
    fitAnalysisHtml: job?.fitAnalysisHtml || "",
    whyCompanyAnswers: job?.whyCompanyAnswers || "",
    resumeId: job?.resumeId || "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          setResumes(data);
        }
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      }
    };
    fetchResumes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = isEditing ? `/api/jobs/${job?.id}` : "/api/jobs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          resumeId: formData.resumeId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save job");
      }

      router.push("/dashboard");
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Senior Software Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Acme Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Application Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="applyDate"
            value={formData.applyDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pay Range
          </label>
          <input
            type="text"
            name="payRange"
            value={formData.payRange}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. $75,000 - $90,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job URL
          </label>
          <input
            type="url"
            name="jobUrl"
            value={formData.jobUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {["LinkedIn", "Indeed", "Glassdoor", "Company Website", "Referral", "ZipRecruiter"].map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, source: src }))}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  formData.source === src
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                {src}
              </button>
            ))}
          </div>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Or type a custom source..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Associated Resume
          </label>
          <select
            name="resumeId"
            value={formData.resumeId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">None</option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          content={formData.description}
          onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
          placeholder="Paste the job description here..."
          minHeight="300px"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
          {formData.coverLetter && (
            <button
              type="button"
              onClick={async () => {
                try {
                  const { jsPDF } = await import('jspdf');
                  const textContent = formData.coverLetter
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/p>/gi, '\n\n')
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .trim();

                  const doc = new jsPDF({ unit: 'in', format: 'letter', orientation: 'portrait' });
                  const marginLeft = 1;
                  const marginTop = 1;
                  const pageWidth = 8.5;
                  const pageHeight = 11;
                  const maxWidth = pageWidth - 2;
                  const lineHeight = 0.2;
                  const paragraphSpacing = 0.15;

                  doc.setFont('times', 'normal');
                  doc.setFontSize(12);

                  const paragraphs = textContent.split(/\n\n+/);
                  let y = marginTop;

                  for (let i = 0; i < paragraphs.length; i++) {
                    const para = paragraphs[i].trim();
                    if (!para) continue;
                    const lines = doc.splitTextToSize(para, maxWidth);
                    for (const line of lines) {
                      if (y > pageHeight - 1) {
                        doc.addPage();
                        y = marginTop;
                      }
                      doc.text(line, marginLeft, y);
                      y += lineHeight;
                    }
                    if (i < paragraphs.length - 1) {
                      y += paragraphSpacing;
                    }
                  }

                  const filename = `Cover_Letter_${(formData.company || 'Draft').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
                  doc.save(filename);
                } catch (err) {
                  console.error('PDF generation error:', err);
                  alert(`Failed to generate PDF: ${err instanceof Error ? err.message : String(err)}`);
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          )}
        </div>
        <RichTextEditor
          content={formData.coverLetter}
          onChange={(content) => setFormData((prev) => ({ ...prev, coverLetter: content }))}
          placeholder="Your cover letter..."
          minHeight="400px"
        />
      </div>

      {/* Fit Analysis Section */}
      {formData.fitScore && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Fit Analysis</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              Fit Score: {formData.fitScore}
            </span>
          </div>
          {formData.fitAnalysisHtml && (
            <div
              className="prose prose-sm max-w-none overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: formData.fitAnalysisHtml }}
            />
          )}
        </div>
      )}

      {/* Why This Company Section */}
      {formData.whyCompanyAnswers && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Why Do You Want to Work for This Company?
          </h3>
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: formData.whyCompanyAnswers }}
          />
        </div>
      )}

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
          {isLoading ? "Saving..." : isEditing ? "Update Job" : "Save Job"}
        </button>
      </div>
    </form>
  );
}

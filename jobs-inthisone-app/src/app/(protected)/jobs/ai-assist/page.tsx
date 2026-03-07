"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Resume } from "@/lib/types";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
    </div>
  ),
});

export default function AIAssistPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobText, setJobText] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [generateCover, setGenerateCover] = useState(true);
  const [customInstructions, setCustomInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [fitAnalysis, setFitAnalysis] = useState({ fitScore: "", tableHtml: "" });
  const [whyCompanyAnswers, setWhyCompanyAnswers] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    applyDate: new Date().toISOString().split("T")[0],
    description: "",
    coverLetter: "",
    payRange: "",
    jobUrl: "",
    source: "",
    fitScore: "",
    fitAnalysisHtml: "",
    whyCompanyAnswers: "",
    resumeId: "",
  });

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          setResumes(data);

          // Load last selected resume from localStorage
          const lastResumeId = localStorage.getItem("lastSelectedResumeId");
          if (lastResumeId && data.some((r: Resume) => r.id === lastResumeId)) {
            setSelectedResumeId(lastResumeId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      }
    };
    fetchResumes();
  }, []);

  // Save selected resume to localStorage when it changes
  useEffect(() => {
    if (selectedResumeId) {
      localStorage.setItem("lastSelectedResumeId", selectedResumeId);
    }
  }, [selectedResumeId]);

  const handleParse = async () => {
    if (!jobText.trim()) {
      setError("Please paste a job posting first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobText,
          resumeId: selectedResumeId || null,
          generateCover,
          customInstructions: generateCover ? customInstructions : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to parse job posting");
      }

      const data = await res.json();
      const fitData = data.fitAnalysis || { fitScore: "", tableHtml: "" };
      const whyData = data.whyCompanyAnswers || "";
      setFormData({
        title: data.title || "",
        company: data.company || "",
        applyDate: data.applyDate || new Date().toISOString().split("T")[0],
        description: data.description || "",
        coverLetter: data.coverLetter || "",
        payRange: data.payRange || "",
        jobUrl: "",
        source: "",
        fitScore: fitData.fitScore,
        fitAnalysisHtml: fitData.tableHtml,
        whyCompanyAnswers: whyData,
        resumeId: selectedResumeId,
      });
      setFitAnalysis(fitData);
      setWhyCompanyAnswers(whyData);
      setIsParsed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
      const res = await fetch("/api/jobs", {
        method: "POST",
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
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        AI-Assisted Job Entry
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      {!isParsed ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Job Posting
            </label>
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Paste the full job posting text here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Resume (for tailored cover letter)
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">None</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Selecting a resume helps the AI tailor the cover letter to your experience.
              </p>
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateCover}
                  onChange={(e) => setGenerateCover(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Generate cover letter
                </span>
              </label>
            </div>
          </div>

          {generateCover && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Instructions for Cover Letter (Optional)
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Emphasize my leadership experience, mention I'm relocating to the area, keep it concise, use a formal tone..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide any specific instructions or context you want the AI to consider when generating your cover letter.
              </p>
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
              onClick={handleParse}
              disabled={isLoading || !jobText.trim()}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 inline-flex items-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing with AI...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Parse with AI
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Job posting parsed successfully! Review and edit the details below.
          </div>

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
                {["LinkedIn", "Indeed", "Glassdoor", "Company Website", "Referral", "ZipRecruiter", "BuiltIn"].map((src) => (
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Cover Letter
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const textContent = formData.coverLetter.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
                    navigator.clipboard.writeText(textContent);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { jsPDF } = await import('jspdf');

                      // Strip HTML tags and get plain text
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

                      // Create PDF with letter size
                      const doc = new jsPDF({
                        unit: 'in',
                        format: 'letter',
                        orientation: 'portrait'
                      });

                      // Set font and margins
                      const marginLeft = 1;
                      const marginTop = 1;
                      const pageWidth = 8.5;
                      const pageHeight = 11;
                      const maxWidth = pageWidth - 2; // 1 inch margins on each side
                      const lineHeight = 0.2; // Tighter line spacing
                      const paragraphSpacing = 0.15; // Extra space between paragraphs

                      doc.setFont('times', 'normal');
                      doc.setFontSize(12);

                      // Split into paragraphs first, then process each
                      const paragraphs = textContent.split(/\n\n+/);

                      let y = marginTop;
                      for (let i = 0; i < paragraphs.length; i++) {
                        const para = paragraphs[i].trim();
                        if (!para) continue;

                        // Split paragraph into lines that fit within margins
                        const lines = doc.splitTextToSize(para, maxWidth);

                        for (const line of lines) {
                          if (y > pageHeight - 1) {
                            doc.addPage();
                            y = marginTop;
                          }
                          doc.text(line, marginLeft, y);
                          y += lineHeight;
                        }

                        // Add paragraph spacing after each paragraph (except the last)
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
                  className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
            <RichTextEditor
              content={formData.coverLetter}
              onChange={(content) => setFormData((prev) => ({ ...prev, coverLetter: content }))}
              placeholder="Your cover letter will appear here..."
              minHeight="400px"
            />
          </div>

          {/* Fit Analysis Section */}
          {fitAnalysis.fitScore && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Fit Analysis</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  Fit Score: {fitAnalysis.fitScore}
                </span>
              </div>
              <div
                className="prose prose-sm max-w-none overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: fitAnalysis.tableHtml }}
              />
            </div>
          )}

          {/* Why This Company Section */}
          {whyCompanyAnswers && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Why Do You Want to Work for This Company?
              </h3>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: whyCompanyAnswers }}
              />
            </div>
          )}

          {/* Job Description - at the bottom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              content={formData.description}
              onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
              placeholder="Job description..."
              minHeight="300px"
            />
          </div>

          {/* Floating Action buttons - sticky at bottom */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 -mx-6 mt-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-end gap-4 z-10">
            <button
              type="button"
              onClick={() => setIsParsed(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Parse
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Job Application"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

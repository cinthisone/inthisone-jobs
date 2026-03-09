import ResumeForm from "@/components/ResumeForm";

export default function NewResumePage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Copy & Paste Your Resume
      </h1>
      <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-sm text-blue-800">
          <p className="font-medium">Plain text is fine!</p>
          <p className="mt-1 text-blue-700">
            It doesn&apos;t need to be nicely formatted. Just paste your resume text so our AI can learn about your skills and experience to generate personalized cover letters.
          </p>
        </div>
      </div>
      <ResumeForm />
    </div>
  );
}

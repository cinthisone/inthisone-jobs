import ResumeForm from "@/components/ResumeForm";

export default function NewResumePage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Add New Resume
      </h1>
      <ResumeForm />
    </div>
  );
}

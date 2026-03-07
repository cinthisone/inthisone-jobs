import JobForm from "@/components/JobForm";

export default function NewJobPage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Add New Job Application
      </h1>
      <JobForm />
    </div>
  );
}

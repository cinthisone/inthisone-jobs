"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import JobForm from "@/components/JobForm";
import { Job } from "@/lib/types";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Edit Job Application
      </h1>
      <JobForm job={job} isEditing />
    </div>
  );
}

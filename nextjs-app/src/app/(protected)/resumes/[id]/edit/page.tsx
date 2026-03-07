"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ResumeForm from "@/components/ResumeForm";
import { Resume } from "@/lib/types";

export default function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Resume</h1>
      <ResumeForm resume={resume} isEditing />
    </div>
  );
}

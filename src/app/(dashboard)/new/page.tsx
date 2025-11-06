import { JobRequestForm } from '@/components/job-requests/JobRequestForm';

export default function NewRequestPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">New Job Request</h1>
        <p className="text-gray-600 mt-2">
          Create a new job request form
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <JobRequestForm />
      </div>
    </div>
  );
}
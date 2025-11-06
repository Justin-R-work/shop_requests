import { JobRequestList } from '@/components/job-requests/JobRequestList';

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Requests</h1>
        <p className="text-gray-600 mt-2">
          View and manage all job requests
        </p>
      </div>
      <JobRequestList />
    </div>
  );
}
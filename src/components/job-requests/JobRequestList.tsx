'use client';

import { useState, useEffect } from 'react';
import { JobRequest } from '@/types/job-request';
import { JobRequestItem } from './JobRequestItem';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function JobRequestList() {
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/job-requests');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.request_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.requesting_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRequestUpdated = () => {
    fetchRequests();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by request number, person, or assignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="In Process">In Process</option>
            <option value="Needs Revision">Needs Revision</option>
            <option value="Complete">Complete</option>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredRequests.length} of {requests.length} requests
      </div>

      {/* Request list */}
      <div className="space-y-2">
        {filteredRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">No job requests found</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <JobRequestItem
              key={request.id}
              request={request}
              isExpanded={expandedId === request.id}
              onToggleExpand={handleToggleExpand}
              onRequestUpdated={handleRequestUpdated}
            />
          ))
        )}
      </div>
    </div>
  );
}
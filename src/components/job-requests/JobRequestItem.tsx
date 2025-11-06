'use client';

import { useState } from 'react';
import { JobRequest } from '@/types/job-request';
import { ChevronDown, ChevronRight, Edit, Trash2, Download, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { EditJobRequestModal } from './EditJobRequestModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { CommentSection } from './CommentSection';
import { generatePDF } from '@/lib/pdf-generator';

type JobStatus = "In Process" | "Needs Revision" | "Complete";

interface JobRequestItemProps {
  request: JobRequest;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onRequestUpdated: () => void;
}

export function JobRequestItem({
  request,
  isExpanded,
  onToggleExpand,
  onRequestUpdated,
}: JobRequestItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [localStatus, setLocalStatus] = useState(request.status);
  const [localDateCompleted, setLocalDateCompleted] = useState(request.date_completed || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800';
      case 'In Process':
        return 'bg-blue-100 text-blue-800';
      case 'Needs Revision':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLocalStatus(newStatus as JobStatus);
    await updateRequest({ status: newStatus as JobStatus });
  };

  const handleDateCompletedChange = async (newDate: string) => {
    setLocalDateCompleted(newDate);
    await updateRequest({ date_completed: newDate });
  };

  const updateRequest = async (updates: Partial<JobRequest>) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/job-requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update request');
      onRequestUpdated();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/job-requests/${request.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete request');
      onRequestUpdated();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(request);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Collapsed view */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onToggleExpand(request.id)}
        >
          <div className="flex items-center space-x-4 flex-1">
            <button className="text-gray-400 hover:text-gray-600">
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Request Number</p>
                <p className="font-medium text-gray-900">{request.request_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Requested</p>
                <p className="font-medium text-gray-900">
                  {new Date(request.request_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Requesting Person</p>
                <p className="font-medium text-gray-900">{request.requesting_person}</p>
              </div>
              <div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    localStatus
                  )}`}
                >
                  {localStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded view */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-6 space-y-6">
            {/* Action buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={handleDownloadPDF}
                className="flex items-center space-x-1"
              >
                <Download size={16} />
                <span>Download PDF</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center space-x-1"
              >
                <Edit size={16} />
                <span>Edit</span>
              </Button>
              <Button
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center space-x-1"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </Button>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Request Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Request Number</p>
                    <p className="font-medium">{request.request_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Requesting Person</p>
                    <p className="font-medium">{request.requesting_person}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Request Date</p>
                    <p className="font-medium">
                      {new Date(request.request_date).toLocaleDateString()}
                    </p>
                  </div>
                  {request.file_path && (
                    <div>
                      <p className="text-sm text-gray-500">File Path</p>
                      <p className="font-medium text-sm break-all">{request.file_path}</p>
                    </div>
                  )}
                  {request.file_name && (
                    <div>
                      <p className="text-sm text-gray-500">File Name</p>
                      <p className="font-medium">{request.file_name}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Material & Assignment</h3>
                <div className="space-y-3">
                  {request.material_type && (
                    <div>
                      <p className="text-sm text-gray-500">Material Type</p>
                      <p className="font-medium">{request.material_type}</p>
                    </div>
                  )}
                  {request.quantity && (
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">{request.quantity}</p>
                    </div>
                  )}
                  {request.assigned_to && (
                    <div>
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <p className="font-medium">{request.assigned_to}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <Select
                      value={localStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={isUpdatingStatus}
                    >
                      <option value="In Process">In Process</option>
                      <option value="Needs Revision">Needs Revision</option>
                      <option value="Complete">Complete</option>
                    </Select>
                  </div>
                  <div>
                    <Input
                      label="Date Completed"
                      type="date"
                      value={localDateCompleted}
                      onChange={(e) => handleDateCompletedChange(e.target.value)}
                      disabled={isUpdatingStatus}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            {request.image_url && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Part Image</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <img
                    src={request.image_url}
                    alt="Part"
                    className="max-h-96 mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Comments */}
            <CommentSection requestId={request.id} />
          </div>
        )}
      </div>

      {/* Modals */}
      <EditJobRequestModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        request={request}
        onRequestUpdated={onRequestUpdated}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        requestNumber={request.request_number}
      />
    </>
  );
}

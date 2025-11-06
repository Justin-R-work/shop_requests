'use client';

import { useState } from 'react';
import { JobRequest } from '@/types/job-request';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EditJobRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: JobRequest;
  onRequestUpdated: () => void;
}

export function EditJobRequestModal({
  isOpen,
  onClose,
  request,
  onRequestUpdated,
}: EditJobRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    request_number: request.request_number,
    requesting_person: request.requesting_person,
    request_date: request.request_date,
    file_path: request.file_path || '',
    file_name: request.file_name || '',
    material_type: request.material_type || '',
    quantity: request.quantity?.toString() || '',
    assigned_to: request.assigned_to || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/job-requests/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job request');
      }

      onRequestUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating job request:', error);
      alert('Failed to update job request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Job Request" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Request Number *"
            name="request_number"
            value={formData.request_number}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Requesting Person *"
            name="requesting_person"
            value={formData.requesting_person}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Request Date *"
            name="request_date"
            type="date"
            value={formData.request_date}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
          />

          <Input
            label="File Path"
            name="file_path"
            value={formData.file_path}
            onChange={handleInputChange}
          />

          <Input
            label="File Name"
            name="file_name"
            value={formData.file_name}
            onChange={handleInputChange}
          />

          <Input
            label="Material Type"
            name="material_type"
            value={formData.material_type}
            onChange={handleInputChange}
          />

          <Input
            label="Assigned To"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requestNumber: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  requestNumber,
}: DeleteConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Job Request" size="sm">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertTriangle size={24} />
          <p className="font-medium">Are you sure you want to delete this request?</p>
        </div>
        <p className="text-gray-600">
          Request Number: <span className="font-semibold">{requestNumber}</span>
        </p>
        <p className="text-sm text-gray-500">
          This action cannot be undone. All associated comments and data will be permanently deleted.
        </p>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Delete Request
          </Button>
        </div>
      </div>
    </Modal>
  );
}
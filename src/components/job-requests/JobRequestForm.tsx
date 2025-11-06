'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';

export function JobRequestForm() {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    request_number: '',
    requesting_person: user?.fullName || '',
    request_date: new Date().toISOString().split('T')[0],
    file_path: '',
    file_name: '',
    material_type: '',
    quantity: '',
    assigned_to: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload image first if exists
      let imageUrl = null;
      let imageFilename = null;

      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('file', imageFile);

        const uploadResponse = await fetch('/api/job-requests/upload', {
          method: 'POST',
          body: formDataImage,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
        imageFilename = uploadData.filename;
      }

      // Create job request
      const response = await fetch('/api/job-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
          image_url: imageUrl,
          image_filename: imageFilename,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job request');
      }

      router.push('/');
    } catch (error) {
      console.error('Error creating job request:', error);
      alert('Failed to create job request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Request Number (M2M Job Order) *"
          name="request_number"
          value={formData.request_number}
          onChange={handleInputChange}
          required
          placeholder="Enter job order number"
        />

        <Input
          label="Requesting Person *"
          name="requesting_person"
          value={formData.requesting_person}
          onChange={handleInputChange}
          required
          placeholder="Enter your name"
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
          placeholder="Enter quantity"
          min="1"
        />

        <Input
          label="File Path"
          name="file_path"
          value={formData.file_path}
          onChange={handleInputChange}
          placeholder="\\server\folder\file.pdf"
        />

        <Input
          label="File Name"
          name="file_name"
          value={formData.file_name}
          onChange={handleInputChange}
          placeholder="Enter file name"
        />

        <Input
          label="Material Type"
          name="material_type"
          value={formData.material_type}
          onChange={handleInputChange}
          placeholder="Enter material type"
        />

        <Input
          label="Assigned To"
          name="assigned_to"
          value={formData.assigned_to}
          onChange={handleInputChange}
          placeholder="Enter assignee name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Part Image/Snip
        </label>
        {!imagePreview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click to upload image or PDF
              </span>
              <span className="text-xs text-gray-500 mt-1">
                JPG, PNG, PDF (Max 10MB)
              </span>
            </label>
          </div>
        ) : (
          <div className="relative border border-gray-300 rounded-lg p-4">
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={16} />
            </button>
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-64 mx-auto"
            />
            <p className="text-sm text-gray-600 text-center mt-2">
              {imageFile?.name}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Request'}
        </Button>
      </div>
    </form>
  );
}
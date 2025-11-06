export interface JobRequest {
  id: string;
  request_number: string;
  requesting_person: string;
  request_date: string;
  file_path?: string;
  file_name?: string;
  material_type?: string;
  quantity?: number;
  assigned_to?: string;
  status: 'In Process' | 'Needs Revision' | 'Complete';
  date_completed?: string;
  image_url?: string;
  image_filename?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface JobRequestComment {
  id: string;
  job_request_id: string;
  comment: string;
  created_at: string;
  created_by?: string;
  author_name?: string;
}

export interface JobRequestFormData {
  request_number: string;
  requesting_person: string;
  request_date: string;
  file_path?: string;
  file_name?: string;
  material_type?: string;
  quantity?: number;
  assigned_to?: string;
  image?: File;
}
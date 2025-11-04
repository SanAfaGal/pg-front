// Common types used across the application

export interface ApiError {
  detail: string;
  code: string;
}

export interface ErrorResponse {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export type UUID = string;

export interface PaginationParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'cancelled' | 'expired';

export type Gender = 'male' | 'female' | 'other';

export type DocumentType = 'cc' | 'ce' | 'passport' | 'nit';

// Date range for filtering
export interface DateRange {
  start_date: string;
  end_date: string;
}

// Common filter interface
export interface BaseFilters extends PaginationParams {
  is_active?: boolean;
  created_from?: string;
  created_to?: string;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Language types
export type Language = 'es' | 'en';

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Table column definition
export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

// Modal props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Form field props
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}
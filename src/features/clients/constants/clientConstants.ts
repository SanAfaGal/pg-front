/**
 * Constants for Clients Module
 * Centralizes configuration values for consistency and maintainability
 */

// API Timeouts
export const API_TIMEOUTS = {
  default: 30000, // 30 seconds
  documentCheck: 10000, // 10 seconds for document validation
} as const;

// Query Stale Times (when data is considered fresh)
export const QUERY_STALE_TIMES = {
  clients: 2 * 60 * 1000, // 2 minutes - list changes frequently
  detail: 5 * 60 * 1000, // 5 minutes - individual client doesn't change often
  dashboard: 5 * 60 * 1000, // 5 minutes - dashboard data
  stats: 10 * 60 * 1000, // 10 minutes - stats change slowly
} as const;

// Query Cache Times (how long to keep unused data)
export const QUERY_CACHE_TIMES = {
  clients: 5 * 60 * 1000, // 5 minutes
  detail: 10 * 60 * 1000, // 10 minutes
  dashboard: 10 * 60 * 1000, // 10 minutes
  stats: 15 * 60 * 1000, // 15 minutes
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  retries: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

// Form Validation Debounce
export const VALIDATION_DEBOUNCE_MS = 500; // milliseconds for document check

// Document Validation
export const DOCUMENT_VALIDATION = {
  minLength: 5,
  maxLength: 20,
  checkDelay: 500, // ms to wait before checking document
} as const;

// Form Field Validation Rules
export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },
  document: {
    minLength: 5,
    maxLength: 20,
    pattern: /^\d+$/,
  },
  phone: {
    minLength: 7,
    maxLength: 15,
    pattern: /^\d{7,15}$/,
  },
  address: {
    minLength: 10,
    maxLength: 200,
  },
  age: {
    minimum: 10,
    maximum: 120,
  },
} as const;

// Country Codes
export const COUNTRY_CODES = [
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
] as const;

// Document Types
export const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PP', label: 'Pasaporte' },
] as const;

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' },
] as const;

// Notification Messages
export const NOTIFICATION_MESSAGES = {
  createSuccess: 'Cliente registrado exitosamente',
  updateSuccess: 'Cliente actualizado exitosamente',
  createError: 'Error al registrar cliente',
  updateError: 'Error al actualizar cliente',
  documentExists: 'Este número de documento ya está registrado',
  documentValid: 'Documento válido',
} as const;


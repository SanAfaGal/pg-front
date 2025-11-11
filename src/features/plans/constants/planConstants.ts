import { DurationType } from '../api/types';

// Query Stale Times
export const QUERY_STALE_TIMES = {
  plans: 5 * 60 * 1000, // 5 minutes
  plan: 5 * 60 * 1000, // 5 minutes
  search: 1 * 60 * 1000, // 1 minute for search results
} as const;

// Query Cache Times
export const QUERY_CACHE_TIMES = {
  plans: 15 * 60 * 1000, // 15 minutes
  plan: 15 * 60 * 1000, // 15 minutes
  search: 5 * 60 * 1000, // 5 minutes
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  retries: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  plan: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      message: {
        required: 'El nombre es obligatorio',
        minLength: 'El nombre debe tener al menos 3 caracteres',
        maxLength: 'El nombre no puede exceder 100 caracteres',
      },
    },
    slug: {
      required: false,
      maxLength: 100,
      message: {
        maxLength: 'El slug no puede exceder 100 caracteres',
      },
    },
    description: {
      required: false,
      maxLength: 500,
      message: {
        maxLength: 'La descripción no puede exceder 500 caracteres',
      },
    },
    price: {
      required: true,
      min: 0,
      message: {
        required: 'El precio es obligatorio',
        min: 'El precio debe ser mayor o igual a 0',
      },
    },
    currency: {
      required: true,
      length: 3,
      message: {
        required: 'La moneda es obligatoria',
        length: 'La moneda debe ser un código de 3 letras',
      },
    },
    duration_unit: {
      required: true,
      message: {
        required: 'La unidad de duración es obligatoria',
      },
    },
    duration_count: {
      required: true,
      min: 1,
      message: {
        required: 'La cantidad de duración es obligatoria',
        min: 'La cantidad debe ser mayor a 0',
      },
    },
  },
} as const;

// Duration Types Options
export const DURATION_TYPES: { value: DurationType; label: string }[] = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
];

// Currency Options
export const CURRENCIES: { value: string; label: string }[] = [
  { value: 'COP', label: 'Peso Colombiano (COP)' },
  { value: 'USD', label: 'Dólar Estadounidense (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
];

// Notification Messages
export const NOTIFICATION_MESSAGES = {
  plan: {
    created: 'Plan creado exitosamente',
    updated: 'Plan actualizado exitosamente',
    deleted: 'Plan eliminado exitosamente',
  },
  error: {
    generic: 'Ha ocurrido un error inesperado',
    network: 'Error de conexión. Verifique su internet.',
    validation: 'Por favor revise los datos ingresados',
    unauthorized: 'No tiene permisos para realizar esta acción',
    notFound: 'El plan solicitado no fue encontrado',
  },
} as const;


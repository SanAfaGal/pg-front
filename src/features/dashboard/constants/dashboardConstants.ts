/**
 * Constants for Dashboard Module
 * Centralizes configuration values for consistency and maintainability
 */

// Query Stale Times (when data is considered fresh)
export const QUERY_STALE_TIMES = {
  dashboard: 2 * 60 * 1000, // 2 minutes - dashboard data changes frequently
} as const;

// Query Cache Times (how long to keep unused data)
export const QUERY_CACHE_TIMES = {
  dashboard: 10 * 60 * 1000, // 10 minutes
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  retries: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

// Period Types
export const PERIOD_TYPES = {
  TODAY: 'today' as const,
  WEEK: 'week' as const,
  MONTH: 'month' as const,
  YEAR: 'year' as const,
} as const;

export const PERIOD_OPTIONS = [
  { value: PERIOD_TYPES.TODAY, label: 'Hoy' },
  { value: PERIOD_TYPES.WEEK, label: 'Esta Semana' },
  { value: PERIOD_TYPES.MONTH, label: 'Este Mes' },
  { value: PERIOD_TYPES.YEAR, label: 'Este Año' },
] as const;

// Date Format Patterns
export const DATE_FORMATS = {
  display: 'dd/MM/yyyy',
  time: 'HH:mm:ss',
  time12: 'hh:mm a',
  full: 'EEEE, dd \'de\' MMMM \'de\' yyyy',
  api: 'yyyy-MM-dd',
} as const;

// Activity Type Icons and Colors
export const ACTIVITY_TYPE_CONFIG = {
  client_registration: {
    icon: 'UserPlus',
    color: 'blue',
    label: 'Registro de Cliente',
  },
  subscription_created: {
    icon: 'Calendar',
    color: 'green',
    label: 'Suscripción Creada',
  },
  payment_received: {
    icon: 'DollarSign',
    color: 'green',
    label: 'Pago Recibido',
  },
  check_in: {
    icon: 'Activity',
    color: 'blue',
    label: 'Check-in',
  },
} as const;

// Alert Severity Colors
export const ALERT_SEVERITY_CONFIG = {
  info: {
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: 'Info',
  },
  warning: {
    color: 'amber',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: 'AlertTriangle',
  },
  error: {
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: 'AlertCircle',
  },
} as const;

// Notification Messages
export const NOTIFICATION_MESSAGES = {
  loadError: 'Error al cargar los datos del dashboard',
  refreshSuccess: 'Dashboard actualizado exitosamente',
  refreshError: 'Error al actualizar el dashboard',
} as const;


import { SubscriptionStatus, PaymentMethod } from '../api/types';

// Subscription Status Configuration
export const SUBSCRIPTION_STATUS_CONFIG = {
  [SubscriptionStatus.ACTIVE]: {
    label: 'Activa',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '✓',
  },
  [SubscriptionStatus.EXPIRED]: {
    label: 'Expirada',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: '⚠',
  },
  [SubscriptionStatus.PENDING_PAYMENT]: {
    label: 'Pendiente de Pago',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: '⏳',
  },
  [SubscriptionStatus.CANCELED]: {
    label: 'Cancelada',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: '✗',
  },
  [SubscriptionStatus.SCHEDULED]: {
    label: 'Programada',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: '📅',
  },
} as const;

// Payment Method Configuration
export const PAYMENT_METHOD_CONFIG = {
  [PaymentMethod.CASH]: {
    label: 'Efectivo',
    icon: '💵',
    color: 'green',
  },
  [PaymentMethod.QR]: {
    label: 'Código QR',
    icon: '📱',
    color: 'blue',
  },
  [PaymentMethod.TRANSFER]: {
    label: 'Transferencia',
    icon: '🏦',
    color: 'purple',
  },
  [PaymentMethod.CARD]: {
    label: 'Tarjeta',
    icon: '💳',
    color: 'indigo',
  },
} as const;

// Default Pagination Settings
export const DEFAULT_PAGINATION = {
  limit: 100,
  offset: 0,
} as const;

// API Timeouts
export const API_TIMEOUTS = {
  default: 30000, // 30 seconds
  upload: 60000, // 60 seconds
} as const;

// Query Stale Times
export const QUERY_STALE_TIMES = {
  subscriptions: 5 * 60 * 1000, // 5 minutes
  payments: 5 * 60 * 1000, // 5 minutes
  stats: 2 * 60 * 1000, // 2 minutes
} as const;

// Query Cache Times
export const QUERY_CACHE_TIMES = {
  subscriptions: 15 * 60 * 1000, // 15 minutes
  payments: 15 * 60 * 1000, // 15 minutes
  stats: 10 * 60 * 1000, // 10 minutes
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  retries: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  subscription: {
    planId: {
      required: true,
      message: 'Debe seleccionar un plan',
    },
    startDate: {
      required: true,
      message: 'Debe seleccionar una fecha de inicio',
    },
  },
  payment: {
    amount: {
      required: true,
      min: 0.01,
      message: 'El monto debe ser mayor a 0',
    },
    paymentMethod: {
      required: true,
      message: 'Debe seleccionar un método de pago',
    },
  },
  cancellation: {
    reason: {
      required: false,
      maxLength: 500,
      message: 'La razón no puede exceder 500 caracteres',
    },
  },
} as const;

// Date Formats
export const DATE_FORMATS = {
  display: 'dd/MM/yyyy',
  api: 'yyyy-MM-dd',
  datetime: 'dd/MM/yyyy HH:mm',
  iso: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
} as const;

// Currency Configuration
export const CURRENCY_CONFIG = {
  symbol: '$',
  locale: 'es-CO',
  decimals: 2,
} as const;

// Action Permissions
export const ACTION_PERMISSIONS = {
  [SubscriptionStatus.ACTIVE]: ['renew', 'cancel', 'pay'],
  [SubscriptionStatus.EXPIRED]: ['renew', 'pay'],
  [SubscriptionStatus.PENDING_PAYMENT]: ['pay', 'cancel'],
  [SubscriptionStatus.CANCELED]: ['renew'],
  [SubscriptionStatus.SCHEDULED]: ['cancel'],
} as const;

// Notification Messages
export const NOTIFICATION_MESSAGES = {
  subscription: {
    created: 'Suscripción creada exitosamente',
    renewed: 'Suscripción renovada exitosamente',
    canceled: 'Suscripción cancelada exitosamente',
    updated: 'Suscripción actualizada exitosamente',
    deleted: 'Suscripción eliminada exitosamente',
    expired: 'Suscripciones expiradas exitosamente',
    activated: 'Suscripciones activadas exitosamente',
  },
  payment: {
    created: 'Pago registrado exitosamente',
    updated: 'Pago actualizado exitosamente',
    deleted: 'Pago eliminado exitosamente',
  },
  error: {
    generic: 'Ha ocurrido un error inesperado',
    network: 'Error de conexión. Verifique su internet.',
    validation: 'Por favor revise los datos ingresados',
    unauthorized: 'No tiene permisos para realizar esta acción',
    notFound: 'El recurso solicitado no fue encontrado',
  },
} as const;

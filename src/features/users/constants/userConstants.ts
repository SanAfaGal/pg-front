import { UserRole } from '../api/types';

// Query Stale Times
export const QUERY_STALE_TIMES = {
  users: 5 * 60 * 1000, // 5 minutes
  user: 5 * 60 * 1000, // 5 minutes
} as const;

// Query Cache Times
export const QUERY_CACHE_TIMES = {
  users: 15 * 60 * 1000, // 15 minutes
  user: 15 * 60 * 1000, // 15 minutes
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  retries: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

// User Role Options
export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'employee', label: 'Empleado' },
];

// Validation Rules
export const VALIDATION_RULES = {
  user: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_]+$/,
      message: {
        required: 'El nombre de usuario es obligatorio',
        minLength: 'El nombre de usuario debe tener al menos 3 caracteres',
        maxLength: 'El nombre de usuario no puede exceder 50 caracteres',
        pattern: 'El nombre de usuario solo puede contener letras, números y guiones bajos',
      },
    },
    email: {
      required: false,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: {
        pattern: 'El email debe tener un formato válido',
      },
    },
    full_name: {
      required: false,
      maxLength: 100,
      message: {
        maxLength: 'El nombre completo no puede exceder 100 caracteres',
      },
    },
    password: {
      required: true,
      minLength: 8,
      message: {
        required: 'La contraseña es obligatoria',
        minLength: 'La contraseña debe tener al menos 8 caracteres',
      },
    },
    role: {
      required: true,
      message: {
        required: 'El rol es obligatorio',
      },
    },
  },
} as const;

// Notification Messages
export const NOTIFICATION_MESSAGES = {
  user: {
    created: 'Usuario creado exitosamente',
    updated: 'Usuario actualizado exitosamente',
    deleted: 'Usuario eliminado exitosamente',
    passwordReset: 'Contraseña restablecida exitosamente',
    roleChanged: 'Rol de usuario actualizado exitosamente',
    enabled: 'Usuario habilitado exitosamente',
    disabled: 'Usuario deshabilitado exitosamente',
  },
  error: {
    generic: 'Ha ocurrido un error inesperado',
    network: 'Error de conexión. Verifique su internet.',
    validation: 'Por favor revise los datos ingresados',
    unauthorized: 'No tiene permisos para realizar esta acción',
    notFound: 'El usuario solicitado no fue encontrado',
    cannotDeleteSelf: 'No puedes eliminar tu propia cuenta',
    usernameExists: 'El nombre de usuario ya está en uso',
    emailExists: 'El email ya está registrado',
  },
} as const;


import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, UserCreateInput, UserUpdateInput } from '../api/types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Shield, AlertCircle } from 'lucide-react';
import { USER_ROLES, VALIDATION_RULES } from '../constants/userConstants';

interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserCreateInput | UserUpdateInput) => void;
  isLoading?: boolean;
  title?: string;
}

interface UserFormData {
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'employee';
  password: string;
  confirm_password: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  title,
}) => {
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<UserFormData>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      full_name: '',
      role: 'employee',
      password: '',
      confirm_password: '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirm_password');

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role,
        password: '',
        confirm_password: '',
      });
    } else {
      reset({
        username: '',
        email: '',
        full_name: '',
        role: 'employee',
        password: '',
        confirm_password: '',
      });
    }
  }, [user, reset]);

  const handleFormSubmit = (data: UserFormData) => {
    if (isEditing) {
      const updateData: UserUpdateInput = {
        email: data.email || undefined,
        full_name: data.full_name || undefined,
      };
      onSubmit(updateData);
    } else {
      const createData: UserCreateInput = {
        username: data.username,
        email: data.email || undefined,
        full_name: data.full_name || undefined,
        role: data.role,
        password: data.password,
      };
      onSubmit(createData);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      title={title || (isEditing ? 'Editar Usuario' : 'Nuevo Usuario')}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {title || (isEditing ? 'Editar Usuario' : 'Nuevo Usuario')}
              </h2>
              <p className="text-sm text-gray-600">
                {isEditing
                  ? 'Modifica la información del usuario'
                  : 'Agrega un nuevo usuario al sistema'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información Básica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={isEditing ? 'md:col-span-2' : ''}>
                <Input
                  {...register('username', {
                    required: VALIDATION_RULES.user.username.message.required,
                    minLength: {
                      value: VALIDATION_RULES.user.username.minLength,
                      message: VALIDATION_RULES.user.username.message.minLength,
                    },
                    maxLength: {
                      value: VALIDATION_RULES.user.username.maxLength,
                      message: VALIDATION_RULES.user.username.message.maxLength,
                    },
                    pattern: {
                      value: VALIDATION_RULES.user.username.pattern,
                      message: VALIDATION_RULES.user.username.message.pattern,
                    },
                    disabled: isEditing,
                  })}
                  label="Nombre de Usuario *"
                  placeholder="Ej: juan_perez"
                  error={errors.username?.message}
                  helperText={
                    isEditing
                      ? 'El nombre de usuario no se puede modificar'
                      : undefined
                  }
                />
              </div>

              <div>
                <Input
                  {...register('email', {
                    pattern: {
                      value: VALIDATION_RULES.user.email.pattern,
                      message: VALIDATION_RULES.user.email.message.pattern,
                    },
                  })}
                  type="email"
                  label="Email"
                  placeholder="usuario@ejemplo.com"
                  error={errors.email?.message}
                />
              </div>

              <div>
                <Input
                  {...register('full_name', {
                    maxLength: {
                      value: VALIDATION_RULES.user.full_name.maxLength,
                      message: VALIDATION_RULES.user.full_name.message.maxLength,
                    },
                  })}
                  label="Nombre Completo"
                  placeholder="Ej: Juan Pérez"
                  error={errors.full_name?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  {...register('role', {
                    required: VALIDATION_RULES.user.role.message.required,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {USER_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {!isEditing && (
                <>
                  <div>
                    <Input
                      {...register('password', {
                        required: VALIDATION_RULES.user.password.message.required,
                        minLength: {
                          value: VALIDATION_RULES.user.password.minLength,
                          message:
                            VALIDATION_RULES.user.password.message.minLength,
                        },
                      })}
                      type="password"
                      label="Contraseña *"
                      placeholder="Mínimo 8 caracteres"
                      error={errors.password?.message}
                    />
                  </div>

                  <div>
                    <Input
                      {...register('confirm_password', {
                        required: 'Por favor confirma la contraseña',
                        validate: (value) =>
                          value === password || 'Las contraseñas no coinciden',
                      })}
                      type="password"
                      label="Confirmar Contraseña *"
                      placeholder="Repite la contraseña"
                      error={errors.confirm_password?.message}
                    />
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Por favor corrige los siguientes errores:
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                  {errors.username && <li>{errors.username.message}</li>}
                  {errors.email && <li>{errors.email.message}</li>}
                  {errors.password && <li>{errors.password.message}</li>}
                  {errors.confirm_password && (
                    <li>{errors.confirm_password.message}</li>
                  )}
                  {errors.role && <li>{errors.role.message}</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || isLoading}>
              {isLoading
                ? 'Guardando...'
                : isEditing
                  ? 'Actualizar Usuario'
                  : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};


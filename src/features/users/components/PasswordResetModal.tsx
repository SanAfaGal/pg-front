import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../api/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VALIDATION_RULES } from '../constants/userConstants';

interface PasswordResetModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string) => void;
  isLoading?: boolean;
}

interface PasswordFormData {
  new_password: string;
  confirm_password: string;
}

const validatePasswordStrength = (password: string): string | undefined => {
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'La contraseña debe contener al menos una letra minúscula';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'La contraseña debe contener al menos una letra mayúscula';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'La contraseña debe contener al menos un número';
  }
  return undefined;
};

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<PasswordFormData>({
    mode: 'onChange',
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  const newPassword = watch('new_password');
  const confirmPassword = watch('confirm_password');

  // Calculate password strength
  React.useEffect(() => {
    if (newPassword) {
      const strengthError = validatePasswordStrength(newPassword);
      if (strengthError) {
        setPasswordStrength({ score: 1, feedback: strengthError });
      } else {
        let score = 2;
        if (newPassword.length >= 12) score++;
        if (/(?=.*[!@#$%^&*])/.test(newPassword)) score++;
        setPasswordStrength({
          score,
          feedback:
            score >= 4
              ? 'Contraseña muy segura'
              : score === 3
                ? 'Contraseña segura'
                : 'Contraseña aceptable',
        });
      }
    } else {
      setPasswordStrength(null);
    }
  }, [newPassword]);

  const handleFormSubmit = (data: PasswordFormData) => {
    onSubmit(data.new_password);
  };

  const handleClose = () => {
    reset();
    setPasswordStrength(null);
    onClose();
  };

  const getStrengthColor = () => {
    if (!passwordStrength) return 'bg-gray-200';
    if (passwordStrength.score >= 4) return 'bg-green-500';
    if (passwordStrength.score === 3) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      title="Resetear Contraseña"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Resetear Contraseña
              </h2>
              <p className="text-sm text-gray-600">
                Establece una nueva contraseña para{' '}
                <span className="font-medium">{user.username}</span>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Password Fields */}
          <div className="space-y-4">
            <div>
              <Input
                {...register('new_password', {
                  required: VALIDATION_RULES.user.password.message.required,
                  minLength: {
                    value: VALIDATION_RULES.user.password.minLength,
                    message: VALIDATION_RULES.user.password.message.minLength,
                  },
                  validate: (value) => {
                    const error = validatePasswordStrength(value);
                    return error || true;
                  },
                })}
                type="password"
                label="Nueva Contraseña *"
                placeholder="Mínimo 8 caracteres"
                error={errors.new_password?.message}
              />
              {newPassword && passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getStrengthColor()}`}
                        style={{
                          width: `${(passwordStrength.score / 4) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    La contraseña debe contener: letras mayúsculas, minúsculas,
                    números y al menos 8 caracteres
                  </p>
                </div>
              )}
            </div>

            <div>
              <Input
                {...register('confirm_password', {
                  required: 'Por favor confirma la contraseña',
                  validate: (value) =>
                    value === newPassword || 'Las contraseñas no coinciden',
                })}
                type="password"
                label="Confirmar Contraseña *"
                placeholder="Repite la contraseña"
                error={errors.confirm_password?.message}
              />
            </div>
          </div>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Por favor corrige los siguientes errores:
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                  {errors.new_password && (
                    <li>{errors.new_password.message}</li>
                  )}
                  {errors.confirm_password && (
                    <li>{errors.confirm_password.message}</li>
                  )}
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
              {isLoading ? 'Reseteando...' : 'Resetear Contraseña'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};


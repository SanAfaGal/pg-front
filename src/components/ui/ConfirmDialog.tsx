import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

/**
 * ConfirmDialog - Reusable confirmation dialog component
 * 
 * Displays a modal with a confirmation message and action buttons.
 * Supports different variants (danger, warning, info) for different contexts.
 * 
 * @example
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onConfirm={handleConfirm}
 *   title="Confirmar acción"
 *   message="¿Está seguro de realizar esta acción?"
 *   variant="danger"
 * />
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  icon,
}: ConfirmDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Error handling is done by the parent component
      console.error('Error in confirm action:', error);
    }
  };

  const variantStyles = {
    danger: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      buttonVariant: 'danger' as const,
    },
    warning: {
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      buttonVariant: 'primary' as const,
    },
    info: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      buttonVariant: 'primary' as const,
    },
  };

  const styles = variantStyles[variant];
  const defaultIcon = <AlertTriangle className="w-6 h-6" />;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
    >
      <div className="space-y-6">
        {/* Icon and Title */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center ${styles.iconColor} flex-shrink-0`}
          >
            {icon || defaultIcon}
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Warning Box */}
        {variant === 'danger' && (
          <div className={`${styles.bgColor} ${styles.borderColor} border rounded-xl p-4`}>
            <div className="flex items-start gap-3">
              <div className={`${styles.iconColor} flex-shrink-0 mt-0.5`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${styles.textColor}`}>
                  Esta acción no se puede deshacer. El cliente será marcado como inactivo y no aparecerá en la lista de clientes activos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={styles.buttonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto order-1 sm:order-2"
            leftIcon={isLoading ? <LoadingSpinner size="sm" /> : undefined}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


import React, { useState } from 'react';
import { Subscription } from '../api/types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { AlertTriangle, X } from 'lucide-react';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
  subscription: Subscription | null;
  isLoading?: boolean;
}

export const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  subscription,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    setError(null);
    try {
      await onConfirm(reason.trim() || undefined);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar la suscripción');
    }
  };

  if (!subscription) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cancelar Suscripción"
      size="md"
    >
      <div className="space-y-6">
        {/* Warning Message */}
        <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              ¿Estás seguro de cancelar esta suscripción?
            </h3>
            <p className="text-sm text-amber-800">
              Esta acción cancelará la suscripción actual. Esta operación no se puede deshacer.
            </p>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID de Suscripción:</span>
              <span className="font-medium text-gray-900">{subscription.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium text-gray-900 capitalize">{subscription.status}</span>
            </div>
          </div>
        </div>

        {/* Reason Input */}
        <div>
          <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-2">
            Razón de cancelación (opcional)
          </label>
          <textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ingrese la razón de cancelación..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            rows={4}
            maxLength={500}
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            {reason.length}/500 caracteres
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            leftIcon={isLoading ? <LoadingSpinner size="sm" /> : <X className="w-4 h-4" />}
          >
            {isLoading ? 'Cancelando...' : 'Confirmar Cancelación'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


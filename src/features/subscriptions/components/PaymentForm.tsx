import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Subscription, PaymentCreateInput, PaymentMethod } from '../api/types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useCreatePayment } from '../hooks/usePayments';
import { formatCurrency, validatePaymentAmount } from '../utils/paymentHelpers';
import { DollarSign, CreditCard, AlertCircle } from 'lucide-react';

// Validation schema
const paymentFormSchema = z.object({
  amount: z.string().min(1, 'Debe ingresar un monto'),
  payment_method: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Debe seleccionar un método de pago' }),
  }),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subscription: Subscription;
  maxAmount?: number;
  className?: string;
}

const PAYMENT_METHODS = [
  { value: PaymentMethod.CASH, label: 'Efectivo', icon: '💵' },
  { value: PaymentMethod.QR, label: 'Código QR', icon: '📱' },
  { value: PaymentMethod.TRANSFER, label: 'Transferencia', icon: '🏦' },
  { value: PaymentMethod.CARD, label: 'Tarjeta', icon: '💳' },
];

export const PaymentForm: React.FC<PaymentFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  subscription,
  maxAmount,
  className = '',
}) => {
  const [amountError, setAmountError] = useState<string>('');
  const createPaymentMutation = useCreatePayment();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: '',
      payment_method: PaymentMethod.CASH,
    },
  });

  const watchedAmount = watch('amount');

  // Validate amount in real-time
  React.useEffect(() => {
    if (watchedAmount) {
      const validation = validatePaymentAmount(watchedAmount, maxAmount);
      setAmountError(validation.error || '');
    } else {
      setAmountError('');
    }
  }, [watchedAmount, maxAmount]);

  const onSubmit = async (data: PaymentFormData) => {
    // Final validation
    const validation = validatePaymentAmount(data.amount, maxAmount);
    if (!validation.isValid) {
      setAmountError(validation.error || '');
      return;
    }

    try {
      await createPaymentMutation.mutateAsync({
        subscriptionId: subscription.id,
        data: {
          amount: data.amount,
          payment_method: data.payment_method,
        },
      });
      
      reset();
      setAmountError('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const handleClose = () => {
    reset();
    setAmountError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar Pago"
      className={className}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Subscription Info */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Suscripción</h3>
          <div className="text-sm text-blue-700">
            <p>ID: {subscription.id.slice(0, 8)}</p>
            <p>Estado: {subscription.status}</p>
            {maxAmount && (
              <p className="font-medium mt-1">
                Deuda máxima: {formatCurrency(maxAmount)}
              </p>
            )}
          </div>
        </Card>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto del Pago
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className={`pl-10 ${errors.amount || amountError ? 'border-red-500' : ''}`}
              {...register('amount')}
            />
          </div>
          {(errors.amount || amountError) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.amount?.message || amountError}
            </p>
          )}
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de Pago
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <Card
                key={method.value}
                className={`p-3 cursor-pointer transition-all ${
                  watch('payment_method') === method.value
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  register('payment_method').onChange({ target: { value: method.value } });
                }}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">{method.icon}</span>
                  <span className="text-sm font-medium">{method.label}</span>
                </div>
              </Card>
            ))}
          </div>
          {errors.payment_method && (
            <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
          )}
        </div>

        {/* Payment Summary */}
        {watchedAmount && !amountError && (
          <Card className="p-4 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Resumen del Pago</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Monto:</span>
                <span className="font-medium text-green-900">
                  {formatCurrency(watchedAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Método:</span>
                <span className="font-medium text-green-900">
                  {PAYMENT_METHODS.find(m => m.value === watch('payment_method'))?.label}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Error Display */}
        {createPaymentMutation.error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800 text-sm">
                {(createPaymentMutation.error as any)?.detail || 'Error al registrar el pago'}
              </p>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !!amountError || !watchedAmount}
            leftIcon={isSubmitting ? <LoadingSpinner size="sm" /> : <CreditCard className="w-4 h-4" />}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

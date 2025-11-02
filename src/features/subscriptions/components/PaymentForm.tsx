import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UUID } from '../../../shared/types/common';
import { Subscription, PaymentMethod, PaymentStats } from '../api/types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useCreatePayment } from '../hooks/usePayments';
import { formatCurrency, validatePaymentAmount, canMakePayment, isSubscriptionFullyPaid } from '../utils/paymentHelpers';
import { NOTIFICATION_MESSAGES } from '../constants/subscriptionConstants';
import { DollarSign, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

// Validation schema - only integers allowed
const paymentFormSchema = z.object({
  amount: z.string()
    .min(1, 'Debe ingresar un monto')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && Number.isInteger(num) && num > 0;
    }, 'El monto debe ser un número entero mayor a 0'),
  payment_method: z.nativeEnum(PaymentMethod).refine(
    (value) => Object.values(PaymentMethod).includes(value),
    { message: 'Debe seleccionar un método de pago' }
  ),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subscription: Subscription;
  clientId?: UUID;
  maxAmount?: number;
  remainingDebt?: number;
  paymentStats?: PaymentStats;
}

const PAYMENT_METHODS = [
  { value: PaymentMethod.CASH, label: 'Efectivo', icon: '💵', color: 'green' },
  { value: PaymentMethod.QR, label: 'Código QR', icon: '📱', color: 'blue' },
];

export const PaymentForm: React.FC<PaymentFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  subscription,
  clientId,
  maxAmount,
  remainingDebt,
  paymentStats,
}) => {
  const [amountError, setAmountError] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'partial' | 'full'>('partial');
  const createPaymentMutation = useCreatePayment();

  // Check if payment can be made
  const paymentValidation = canMakePayment(subscription, paymentStats);
  const isFullyPaid = isSubscriptionFullyPaid(paymentStats);

  // Get the current remaining debt from paymentStats (most accurate) or from prop
  const currentRemainingDebt = useMemo(() => {
    if (paymentStats?.remaining_debt !== undefined) {
      return parseFloat(paymentStats.remaining_debt);
    }
    return remainingDebt;
  }, [paymentStats?.remaining_debt, remainingDebt]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: '',
      payment_method: PaymentMethod.CASH,
    },
  });

  const watchedAmount = watch('amount');
  const watchedPaymentMethod = watch('payment_method');

  // Reset form when modal closes or paymentStats changes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setAmountError('');
      setPaymentType('partial');
    }
  }, [isOpen, reset]);

  // Handle payment type change
  const handlePaymentTypeChange = useCallback((type: 'partial' | 'full') => {
    setPaymentType(type);
    if (type === 'full' && currentRemainingDebt !== undefined) {
      // Round to integer for full payment
      const fullAmount = Math.floor(currentRemainingDebt);
      setValue('amount', fullAmount.toString(), { shouldValidate: true });
    } else {
      setValue('amount', '', { shouldValidate: false });
    }
    setAmountError('');
  }, [currentRemainingDebt, setValue]);

  // Validate amount in real-time using current remaining debt
  useEffect(() => {
    if (watchedAmount) {
      const validation = validatePaymentAmount(
        watchedAmount, 
        maxAmount, 
        currentRemainingDebt
      );
      setAmountError(validation.error || '');
    } else {
      setAmountError('');
    }
  }, [watchedAmount, maxAmount, currentRemainingDebt]);

  // Handle input to only allow integers
  const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any non-numeric characters except the minus sign at the start
    value = value.replace(/[^\d]/g, '');
    
    // Update the input value
    if (value !== e.target.value) {
      e.target.value = value;
    }
    
    // Update form value
    setValue('amount', value, { shouldValidate: true });
  }, [setValue]);

  // Prevent spinner/wheel changes
  const handleAmountWheel = useCallback((e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.currentTarget.blur();
  }, []);

  // Prevent keyboard increment/decrement
  const handleAmountKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent arrow up/down and page up/down
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  const onSubmit = async (data: PaymentFormData) => {
    // Final validation with current remaining debt
    const validation = validatePaymentAmount(
      data.amount, 
      maxAmount,
      currentRemainingDebt
    );
    if (!validation.isValid) {
      setAmountError(validation.error || '');
      return;
    }

    try {
      await createPaymentMutation.mutateAsync({
        subscriptionId: subscription.id,
        clientId: clientId || subscription.client_id,
        data: {
          amount: data.amount,
          payment_method: data.payment_method,
        },
      });
      
      reset();
      setAmountError('');
      setPaymentType('partial');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating payment:', error);
      // Error is handled by the error display section
    }
  };

  const handleClose = useCallback(() => {
    reset();
    setAmountError('');
    setPaymentType('partial');
    onClose();
  }, [reset, onClose]);

  const handlePaymentMethodSelect = useCallback((method: PaymentMethod) => {
    setValue('payment_method', method, { shouldValidate: true });
  }, [setValue]);

  // Calculate remaining after payment
  const remainingAfterPayment = currentRemainingDebt !== undefined && watchedAmount && !amountError && parseFloat(watchedAmount) > 0
    ? currentRemainingDebt - parseFloat(watchedAmount)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar Pago"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Payment Validation Warning */}
        {!paymentValidation.canPay && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900 mb-1">No se puede registrar pago</p>
                <p className="text-sm text-red-800">{paymentValidation.reason}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Fully Paid Info */}
        {isFullyPaid && paymentValidation.canPay && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900 mb-1">Suscripción completamente pagada</p>
                <p className="text-sm text-green-800">
                  Esta suscripción ya está completamente pagada. No se pueden registrar pagos adicionales.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Subscription Info */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Información de Suscripción</h3>
              <div className="text-sm text-blue-700 space-y-0.5">
                <p><span className="font-medium">ID:</span> {subscription.id.slice(0, 8)}</p>
                <p><span className="font-medium">Estado:</span> <span className="capitalize">{subscription.status}</span></p>
                {currentRemainingDebt !== undefined && (
                  <p className="font-semibold mt-1 text-blue-900">
                    Deuda pendiente: {formatCurrency(currentRemainingDebt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Type Selection */}
        {paymentValidation.canPay && currentRemainingDebt !== undefined && currentRemainingDebt > 0 && !isFullyPaid && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Pago
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  paymentType === 'partial'
                    ? 'ring-2 ring-blue-500 bg-blue-50 shadow-sm'
                    : 'hover:bg-gray-50 hover:shadow-sm border-gray-200'
                }`}
                onClick={() => handlePaymentTypeChange('partial')}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${
                    paymentType === 'partial' ? 'bg-blue-100' : 'bg-orange-100'
                  }`}>
                    <span className="text-xl">💰</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pago Parcial</h4>
                  <p className="text-xs text-gray-600">
                    Ingresa el monto que deseas pagar
                  </p>
                </div>
              </Card>
              
              <Card
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  paymentType === 'full'
                    ? 'ring-2 ring-green-500 bg-green-50 shadow-sm'
                    : 'hover:bg-gray-50 hover:shadow-sm border-gray-200'
                }`}
                onClick={() => handlePaymentTypeChange('full')}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${
                    paymentType === 'full' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className="text-xl">✅</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pago Completo</h4>
                  <p className="text-xs text-gray-600">
                    Pagar {formatCurrency(Math.floor(currentRemainingDebt))}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Amount Input - Only Integers */}
        {paymentValidation.canPay && !isFullyPaid && (
        <div>
          <label htmlFor="payment-amount" className="block text-sm font-medium text-gray-700 mb-2">
            Monto del Pago <span className="text-gray-500 font-normal">(solo valores enteros)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="payment-amount"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={paymentType === 'full' && currentRemainingDebt ? formatCurrency(Math.floor(currentRemainingDebt)) : '0'}
              disabled={paymentType === 'full'}
              className={`pl-10 ${errors.amount || amountError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} ${
                paymentType === 'full' ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              {...register('amount')}
              onChange={handleAmountInput}
              onWheel={handleAmountWheel}
              onKeyDown={handleAmountKeyDown}
            />
          </div>
          {(errors.amount || amountError) && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.amount?.message || amountError}
            </p>
          )}
          {currentRemainingDebt !== undefined && currentRemainingDebt > 0 && !amountError && (
            <p className="mt-1 text-xs text-gray-500">
              Deuda restante: {formatCurrency(currentRemainingDebt)}
            </p>
          )}
        </div>
        )}

        {/* Payment Method Selection */}
        {paymentValidation.canPay && !isFullyPaid && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de Pago
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = watchedPaymentMethod === method.value;
              return (
                <Card
                  key={method.value}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? `ring-2 ring-blue-500 bg-blue-50 shadow-sm`
                      : 'hover:bg-gray-50 hover:shadow-sm border-gray-200'
                  }`}
                  onClick={() => handlePaymentMethodSelect(method.value)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">{method.icon}</span>
                    <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {method.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          {errors.payment_method && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.payment_method.message}
            </p>
          )}
        </div>
        )}

        {/* Payment Summary */}
        {watchedAmount && !amountError && parseFloat(watchedAmount) > 0 && (
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Resumen del Pago
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-green-700">Monto a pagar:</span>
                <span className="font-bold text-green-900 text-lg">
                  {formatCurrency(watchedAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700">Método:</span>
                <span className="font-medium text-green-900">
                  {PAYMENT_METHODS.find(m => m.value === watchedPaymentMethod)?.label}
                </span>
              </div>
              {remainingAfterPayment !== null && (
                <div className="pt-2 mt-2 border-t border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Deuda restante:</span>
                    <span className={`font-semibold ${remainingAfterPayment <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {formatCurrency(Math.max(0, remainingAfterPayment))}
                    </span>
                  </div>
                  {remainingAfterPayment <= 0 && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ¡La suscripción quedará completamente pagada!
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Error Display */}
        {createPaymentMutation.error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-900 mb-1">Error al registrar el pago</p>
                <p className="text-red-800 text-sm">
                  {(createPaymentMutation.error as any)?.response?.data?.detail || 
                   (createPaymentMutation.error as any)?.message || 
                   NOTIFICATION_MESSAGES.error.generic}
                </p>
              </div>
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
            className="min-w-[100px]"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting || 
              !!amountError || 
              !watchedAmount || 
              parseFloat(watchedAmount || '0') <= 0 ||
              !paymentValidation.canPay ||
              isFullyPaid
            }
            leftIcon={isSubmitting ? <LoadingSpinner size="sm" /> : <CreditCard className="w-4 h-4" />}
            className="min-w-[140px]"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

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
import { logger } from '../../../shared';
import { DollarSign, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Format number input to display as currency while typing
 */
const formatCurrencyInput = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  if (!numericValue) return '';
  
  // Format with thousand separators (Colombian format)
  const number = parseInt(numericValue, 10);
  return new Intl.NumberFormat('es-CO').format(number);
};

/**
 * Remove currency formatting to get numeric value
 */
const unformatCurrencyInput = (value: string): string => {
  return value.replace(/\D/g, '');
};

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
  const [paymentType, setPaymentType] = useState<'partial' | 'full'>('full');
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
      setPaymentType('full');
    } else if (isOpen && paymentType === 'full' && currentRemainingDebt !== undefined && currentRemainingDebt > 0) {
      // Set full payment amount when modal opens with 'full' selected
      const fullAmount = Math.floor(currentRemainingDebt);
      setValue('amount', fullAmount.toString(), { shouldValidate: true });
    }
  }, [isOpen, reset, paymentType, currentRemainingDebt, setValue]);

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

  // Handle input to only allow integers and format as currency
  const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Update form value with numeric value for validation
    setValue('amount', numericValue, { shouldValidate: true });
  }, [setValue]);
  
  // Get formatted display value for the input
  const displayAmount = useMemo(() => {
    if (paymentType === 'full') {
      if (currentRemainingDebt !== undefined && currentRemainingDebt > 0) {
        return formatCurrencyInput(Math.floor(currentRemainingDebt).toString());
      }
      return '';
    }
    
    if (!watchedAmount) return '';
    const numericValue = unformatCurrencyInput(watchedAmount);
    if (!numericValue) return '';
    return formatCurrencyInput(numericValue);
  }, [watchedAmount, paymentType, currentRemainingDebt]);

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

    // Ensure amount is a clean numeric string (remove any formatting)
    // data.amount should already be numeric-only from handleAmountInput, but ensure it's clean
    const cleanAmount = data.amount.replace(/\D/g, '');
    if (!cleanAmount || cleanAmount === '0') {
      setAmountError('El monto debe ser mayor a 0');
      return;
    }

    // Convert to number and validate it's an integer
    const numericAmount = parseInt(cleanAmount, 10);
    if (isNaN(numericAmount) || numericAmount <= 0 || !Number.isInteger(numericAmount)) {
      setAmountError('El monto debe ser un número entero mayor a 0');
      return;
    }

    // Prepare payment data with clean numeric string
    const paymentData = {
      amount: numericAmount.toString(), // Send as clean numeric string
      payment_method: data.payment_method,
    };

    // Log for debugging (only in dev)
    logger.debug('Sending payment data:', {
      subscriptionId: subscription.id,
      clientId: clientId || subscription.client_id,
      paymentData,
      amountType: typeof paymentData.amount,
      amountValue: paymentData.amount,
    });

    try {
      await createPaymentMutation.mutateAsync({
        subscriptionId: subscription.id,
        clientId: clientId || subscription.client_id,
        data: paymentData,
      });
      
      reset();
      setAmountError('');
      setPaymentType('full');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      logger.error('Error creating payment:', error);
      // Error is handled by the error display section
    }
  };

  const handleClose = useCallback(() => {
    reset();
    setAmountError('');
    setPaymentType('full');
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
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Payment Validation Warning */}
        {!paymentValidation.canPay && (
          <Card className="p-3 bg-red-50 border-red-200">
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
          <Card className="p-3 bg-green-50 border-green-200">
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

        {/* Payment Type Selection */}
        {paymentValidation.canPay && currentRemainingDebt !== undefined && currentRemainingDebt > 0 && !isFullyPaid && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Pago
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Card
                className={`p-3 cursor-pointer transition-all duration-200 ${
                  paymentType === 'partial'
                    ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                    : 'hover:bg-gray-50 hover:shadow-sm border-gray-200'
                }`}
                onClick={() => handlePaymentTypeChange('partial')}
              >
                <div className="text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${
                    paymentType === 'partial' ? 'bg-blue-500' : 'bg-orange-100'
                  }`}>
                    <span className={`text-lg ${paymentType === 'partial' ? '' : 'text-orange-600'}`}>💰</span>
                  </div>
                  <h4 className={`font-semibold mb-0.5 ${paymentType === 'partial' ? 'text-blue-900' : 'text-gray-900'}`}>Pago Parcial</h4>
                  <p className="text-xs text-gray-600">
                    Ingresa el monto
                  </p>
                </div>
              </Card>
              
              <Card
                className={`p-3 cursor-pointer transition-all duration-200 ${
                  paymentType === 'full'
                    ? 'ring-2 ring-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-md'
                    : 'hover:bg-gray-50 hover:shadow-sm border-gray-200'
                }`}
                onClick={() => handlePaymentTypeChange('full')}
              >
                <div className="text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${
                    paymentType === 'full' ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    <span className={`text-lg ${paymentType === 'full' ? '' : 'text-gray-600'}`}>✅</span>
                  </div>
                  <h4 className={`font-semibold mb-0.5 ${paymentType === 'full' ? 'text-green-900' : 'text-gray-900'}`}>Pago Completo</h4>
                  <p className="text-xs text-gray-600">
                    {formatCurrency(Math.floor(currentRemainingDebt))}
                  </p>
                </div>
              </Card>
            </div>
            {/* Warning message for partial payment */}
            {paymentType === 'partial' && (
              <Card className="p-2.5 mt-2 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    <span className="font-semibold">Importante:</span> Solo se puede realizar un pago parcial por día.
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Amount Input - Only Integers with Currency Format */}
        {paymentValidation.canPay && !isFullyPaid && (
        <div>
          <label htmlFor="payment-amount" className="block text-sm font-medium text-gray-700 mb-2">
            Monto del Pago
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="payment-amount"
              type="text"
              inputMode="numeric"
              value={displayAmount}
              placeholder={paymentType === 'partial' ? '0' : formatCurrencyInput(Math.floor(currentRemainingDebt || 0).toString())}
              disabled={paymentType === 'full'}
              className={`pl-10 pr-16 text-lg font-semibold ${errors.amount || amountError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} ${
                paymentType === 'full' ? 'bg-gray-100 cursor-not-allowed' : paymentType === 'partial' ? 'bg-blue-50 border-blue-200 focus:border-blue-400 focus:ring-blue-200' : ''
              }`}
              {...register('amount')}
              onChange={handleAmountInput}
              onWheel={handleAmountWheel}
              onKeyDown={handleAmountKeyDown}
            />
            {paymentType === 'partial' && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-sm font-medium text-blue-600">COP</span>
              </div>
            )}
          </div>
          {(errors.amount || amountError) && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.amount?.message || amountError}
            </p>
          )}
          {currentRemainingDebt !== undefined && currentRemainingDebt > 0 && !amountError && paymentType === 'partial' && (
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
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = watchedPaymentMethod === method.value;
              return (
                <Card
                  key={method.value}
                  className={`p-3 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? `ring-2 ring-blue-500 bg-blue-50 shadow-sm`
                      : 'hover:bg-gray-50 hover:shadow-sm border-gray-200'
                  }`}
                  onClick={() => handlePaymentMethodSelect(method.value)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">{method.icon}</span>
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
          <Card className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Resumen del Pago
            </h3>
            <div className="space-y-1.5 text-sm">
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
          <Card className="p-3 bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-900 mb-1">Error al registrar el pago</p>
                <p className="text-red-800 text-sm">
                  {(createPaymentMutation.error as Error & { response?: { data?: { detail?: string } }; message?: string })?.response?.data?.detail || 
                   (createPaymentMutation.error as Error & { message?: string })?.message || 
                   NOTIFICATION_MESSAGES.error.generic}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
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
